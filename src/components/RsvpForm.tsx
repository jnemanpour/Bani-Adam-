"use client";

import { useRef, useState } from "react";
import { VOLUNTEER_ROLES } from "@/config/event";

type Attending = "yes" | "maybe" | "no";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; attending: Attending; updated: boolean } | { kind: "error"; message: string };

const field =
  "mt-2 block w-full rounded-xl border-2 border-white/15 bg-night px-4 py-3 text-lg text-cream placeholder:text-cream/40 focus:border-palm focus:outline-none aria-[invalid=true]:border-hibiscus";
const label = "block text-base font-bold";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

export default function RsvpForm({ googleUrl }: { googleUrl: string }) {
  const [attending, setAttending] = useState<Attending | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const doneRef = useRef<HTMLDivElement>(null);
  const coming = attending !== "no";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      attending: fd.get("attending"),
      adults: fd.get("adults") ?? 0,
      kids: fd.get("kids") ?? 0,
      kids_ages: fd.get("kids_ages") ?? "",
      dietary: fd.get("dietary") ?? "",
      volunteer: fd.getAll("volunteer"),
      note: fd.get("note") ?? "",
      website: fd.get("website") ?? "",
    };
    if (PREVIEW) {
      setStatus({ kind: "error", message: "This is a design preview, so RSVPs aren't saved yet. The real link is coming soon." });
      return;
    }
    setStatus({ kind: "sending" });
    setErrors({});
    try {
      const res = await fetch(`${BASE}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      setStatus({ kind: "done", attending: data.attending, updated: data.updated });
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "done") {
    const going = status.attending !== "no";
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-3xl border-2 border-gold bg-night p-8 text-center shadow-[0_0_50px_-10px_var(--color-coral)] focus:outline-none">
        <div className="text-6xl" aria-hidden>
          {going ? "🌅" : "💌"}
        </div>
        <h3 className="title mt-4 text-3xl leading-snug sm:text-4xl">{going ? "You're on the list" : "We'll miss you"}</h3>
        <p className="mt-4 text-lg text-mist">
          {going
            ? status.attending === "maybe"
              ? "Marked as a maybe. Check your email for the address and details."
              : "See you at sunrise. Check your email for the address and details."
            : "Thanks for letting Jay know. You can still give below."}
          {status.updated && " (We updated your earlier RSVP.)"}
        </p>
        {going ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={`${BASE}/calendar.ics`} className="rounded-full bg-gold px-6 py-4 font-bold text-night transition hover:bg-coral">
              Add to calendar (.ics)
            </a>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-palm px-6 py-4 font-bold text-palm transition hover:bg-palm hover:text-night">
              Google Calendar
            </a>
          </div>
        ) : (
          <a href="#give" className="mt-6 inline-block rounded-full bg-hibiscus px-6 py-4 font-bold text-night">
            Give instead
          </a>
        )}
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-6 text-sm text-mist underline underline-offset-4">
          Change my RSVP
        </button>
      </div>
    );
  }

  const err = (name: string) =>
    errors[name] ? (
      <p id={`${name}-err`} className="mt-1 text-sm font-bold text-hibiscus">
        {errors[name]}
      </p>
    ) : null;
  const a11y = (name: string) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-err` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6 rounded-3xl border-2 border-palm/40 bg-night p-6 sm:p-8">
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="name" className={label}>Full name</label>
        <input id="name" name="name" required autoComplete="name" className={field} {...a11y("name")} />
        {err("name")}
      </div>

      <div>
        <label htmlFor="phone" className={label}>Phone</label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} {...a11y("phone")} />
        <p className="mt-1 text-sm text-mist">For day-of texts and kid check-in.</p>
        {err("phone")}
      </div>

      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" className={field} {...a11y("email")} />
        <p className="mt-1 text-sm text-mist">We&apos;ll send your confirmation and the address here.</p>
        {err("email")}
      </div>

      <fieldset>
        <legend className={label}>Are you coming?</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ["yes", "Yes!", "peer-checked:bg-gold peer-checked:border-gold"],
              ["maybe", "Maybe", "peer-checked:bg-coral peer-checked:border-coral"],
              ["no", "Can't", "peer-checked:bg-mist peer-checked:border-mist"],
            ] as const
          ).map(([value, text, checked]) => (
            <label key={value} className="relative">
              <input
                type="radio"
                name="attending"
                value={value}
                required
                className="peer sr-only"
                onChange={() => setAttending(value)}
                aria-describedby={errors.attending ? "attending-err" : undefined}
              />
              <span className={`flex min-h-14 cursor-pointer items-center justify-center rounded-xl border-2 border-white/20 px-2 text-lg font-bold transition peer-checked:text-night peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-palm ${checked}`}>
                {text}
              </span>
            </label>
          ))}
        </div>
        {err("attending")}
      </fieldset>

      {coming && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="adults" className={label}>Adults <span className="font-normal text-mist">(incl. you)</span></label>
              <select id="adults" name="adults" defaultValue="1" className={field} {...a11y("adults")}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              {err("adults")}
            </div>
            <div>
              <label htmlFor="kids" className={label}>Kids</label>
              <select id="kids" name="kids" defaultValue="0" className={field} {...a11y("kids")}>
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              {err("kids")}
            </div>
          </div>

          <div>
            <label htmlFor="kids_ages" className={label}>Kids&apos; ages <span className="font-normal text-mist">(optional)</span></label>
            <input id="kids_ages" name="kids_ages" placeholder="e.g. 3 and 7" className={field} />
          </div>

          <div>
            <label htmlFor="dietary" className={label}>Dietary notes <span className="font-normal text-mist">(optional)</span></label>
            <input id="dietary" name="dietary" placeholder="Vegetarian, allergies…" className={field} />
          </div>

          <fieldset>
            <legend className={label}>Want to help? <span className="font-normal text-mist">(optional)</span></legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VOLUNTEER_ROLES.map((role) => (
                <label key={role} className="relative">
                  <input type="checkbox" name="volunteer" value={role} className="peer sr-only" />
                  <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 border-white/20 px-2 text-center font-bold transition peer-checked:border-palm peer-checked:bg-palm peer-checked:text-night peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-palm">
                    {role}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <div>
        <label htmlFor="note" className={label}>Note for Jay <span className="font-normal text-mist">(optional)</span></label>
        <textarea id="note" name="note" rows={3} className={field} />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl border-2 border-hibiscus bg-hibiscus/10 p-4 font-bold text-hibiscus">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="w-full rounded-full bg-hibiscus px-8 py-4 text-xl font-bold text-night shadow-[0_0_30px_var(--color-hibiscus)] transition hover:bg-coral disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send my RSVP"}
      </button>
    </form>
  );
}
