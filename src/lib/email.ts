import "server-only";
import {
  DONATION_GOAL,
  DONATION_ORG,
  DONATION_URL,
  EVENT_NAME,
  PARKING_NOTE,
  formatDateLong,
  siteUrl,
  timeRange,
} from "@/config/event";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar";
import type { RsvpInput } from "@/lib/rsvp-schema";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(rsvp: RsvpInput, address: string | null) {
  const first = esc(rsvp.name.split(/\s+/)[0]);
  const going = rsvp.attending !== "no";
  const headline =
    rsvp.attending === "yes"
      ? "You're on the list. See you at sunrise."
      : rsvp.attending === "maybe"
        ? "You're a maybe. We'll save you a taco."
        : "We'll miss you!";

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#FF7A59;font-weight:700;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#FFF6EC">${value}</td></tr>`;

  const details = going
    ? `<table role="presentation" style="border-collapse:collapse;margin:16px 0;font-size:16px">
        ${row("When", `${esc(formatDateLong())}<br>${timeRange()} · doors 9:00, DJ 9:30`)}
        ${address ? row("Where", `${esc(address)}<br><a href="https://maps.google.com/?q=${encodeURIComponent(address)}" style="color:#8FD19E">Open in Maps</a>`) : ""}
        ${row("Parking", esc(PARKING_NOTE))}
        ${row("Your party", `${rsvp.adults} adult${rsvp.adults === 1 ? "" : "s"}${rsvp.kids ? `, ${rsvp.kids} kid${rsvp.kids === 1 ? "" : "s"}` : ""}`)}
        ${row("Wear", "A Halloween costume if you like. There's a props bin at the door.")}
        ${row("Bring", "Sunscreen, a hat, a water bottle. Food and drinks are covered.")}
      </table>
      <p style="margin:0 0 16px"><a href="${esc(googleCalendarUrl(address ?? undefined))}" style="color:#8FD19E">Add to Google Calendar</a> · a calendar file is attached too.</p>
      <p style="margin:0 0 16px;color:#c4cfc0;font-size:14px">Please keep the address to yourself. It's Jay's home.</p>`
    : `<p>Thanks for letting Jay know. If plans change, just RSVP again with the same email.</p>`;

  const html = `<!doctype html><html><body style="margin:0;background:#050806;font-family:Helvetica,Arial,sans-serif;color:#FFF6EC">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="font-size:14px;letter-spacing:4px;color:#FF4F6D;font-weight:700">BANI ADAM · JAY'S 30TH</div>
    <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.2;margin:12px 0 8px;color:#FFC46B">${headline}</h1>
    <p style="font-size:16px;margin:0 0 8px">Hi ${first},</p>
    ${details}
    <div style="border:2px solid #FF4F6D;border-radius:16px;padding:16px;margin:24px 0">
      <div style="font-weight:700;color:#FF4F6D">No gifts. Give instead.</div>
      <p style="margin:8px 0">Jay's goal is $${DONATION_GOAL.toLocaleString("en-US")} for ${DONATION_ORG}, an LA nonprofit for chronically homeless neighbors.</p>
      <a href="${DONATION_URL}" style="display:inline-block;background:#FF4F6D;color:#050806;font-weight:700;padding:12px 20px;border-radius:999px;text-decoration:none">Donate</a>
    </div>
    <p style="font-size:14px;color:#c4cfc0">Need to change your RSVP? Submit the form again with this email: <a href="${siteUrl()}/#rsvp" style="color:#8FD19E">${siteUrl().replace(/^https?:\/\//, "")}</a></p>
  </div></body></html>`;

  const text = [
    headline,
    "",
    `Hi ${rsvp.name.split(/\s+/)[0]},`,
    ...(going
      ? [
          `When: ${formatDateLong()}, ${timeRange()} (doors 9:00, DJ 9:30)`,
          ...(address ? [`Where: ${address}`] : []),
          `Parking: ${PARKING_NOTE}`,
          "Bring: sunscreen, a hat, a water bottle.",
          "Please keep the address to yourself. It's Jay's home.",
        ]
      : ["Thanks for letting Jay know. If plans change, RSVP again with the same email."]),
    "",
    `No gifts. Give to ${DONATION_ORG} instead: ${DONATION_URL}`,
  ].join("\n");

  return { html, text, subject: going ? `${EVENT_NAME}: you're on the list` : `${EVENT_NAME}: thanks for letting us know` };
}

/** Sends the confirmation. The street address is included only for yes/maybe. */
export async function sendConfirmation(rsvp: RsvpInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    console.warn("RESEND_API_KEY or RESEND_FROM not set; skipping confirmation email");
    return false;
  }
  const address = rsvp.attending !== "no" ? (process.env.PARTY_ADDRESS ?? null) : null;
  const { html, text, subject } = render(rsvp, address);

  const attachments =
    rsvp.attending !== "no"
      ? [{ filename: "bani-adam.ics", content: Buffer.from(buildIcs(address ?? undefined)).toString("base64") }]
      : undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [rsvp.email], subject, html, text, attachments }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}
