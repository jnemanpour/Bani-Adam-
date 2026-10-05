import { DONATION_URL, EVENT_CITY, EVENT_NAME, eventEnd, eventStart, siteUrl } from "@/config/event";

const PUBLIC_LOCATION = `Jay's house, ${EVENT_CITY} (address is in your RSVP email)`;

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

function description() {
  return `Sober, all-ages sunrise dance party. No gifts: please give to Together As One instead. ${DONATION_URL}\n\n${siteUrl()}`;
}

/** Calendar file. Pass `location` only in private channels (the email); the public download never has the address. */
export function buildIcs(location: string = PUBLIC_LOCATION): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bani Adam//RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:sunrise-rave-jay-30@${new URL(siteUrl()).host}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(eventStart())}`,
    `DTEND:${stamp(eventEnd())}`,
    `SUMMARY:${escapeIcs(EVENT_NAME)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(description())}`,
    `URL:${siteUrl()}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function googleCalendarUrl(location: string = PUBLIC_LOCATION): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_NAME,
    dates: `${stamp(eventStart())}/${stamp(eventEnd())}`,
    details: description(),
    location,
    ctz: "America/Los_Angeles",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
