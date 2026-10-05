// Everything Jay might want to change lives here.
// Secrets and the street address are env vars (see .env.example), never in this file.

/** Party date in Los Angeles. Backup date is 2026-10-24: change only this line. */
export const EVENT_DATE = "2026-10-31";
export const EVENT_START = "09:00";
export const EVENT_END = "13:00";
export const EVENT_TIMEZONE = "America/Los_Angeles";

export const EVENT_NAME = "Sunrise Rave: Jay's 30th";
export const EVENT_CITY = "Los Angeles";

export const DONATION_URL = "https://togetherasonela.org";
export const DONATION_ORG = "Together As One";
export const DONATION_GOAL = 5000;
/** Update by hand as donations come in. Set to 0 to hide the progress bar. */
export const AMOUNT_RAISED = 0;

/** Expected headcount that triggers a warning on /host. */
export const CAPACITY = 100;

export const SCHEDULE = [
  { time: "09:00", label: "Doors open", detail: "Check in at the gate, grab a wristband and a prop." },
  { time: "09:30", label: "DJ starts", detail: "Daytime house and disco. Coffee in hand." },
  { time: "10:30", label: "Donation shout-out", detail: "A quick toast to Together As One." },
  { time: "11:30", label: "Group photo", detail: "Everyone, costumes and all." },
  { time: "12:45", label: "Last song", detail: "Music stops at 1pm sharp." },
] as const;

export const VOLUNTEER_ROLES = ["Setup", "Check-in", "Kids' zone", "Drinks", "Breakdown", "Photos"] as const;

export const PARKING_NOTE =
  "Street parking is limited. Please rideshare or carpool, and don't block the neighbors' driveways.";

// ---- Derived helpers ----

/** Offset in minutes of `timeZone` from UTC at the given instant. */
function tzOffsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return (asUtc - at.getTime()) / 60000;
}

/** Converts a local wall-clock time on EVENT_DATE to a real Date. */
export function eventInstant(hhmm: string): Date {
  const [y, m, d] = EVENT_DATE.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(guess.getTime() - tzOffsetMinutes(guess, EVENT_TIMEZONE) * 60000);
}

export const eventStart = () => eventInstant(EVENT_START);
export const eventEnd = () => eventInstant(EVENT_END);

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

/** e.g. "Saturday, October 31, 2026" */
export function formatDateLong(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(eventStart());
}

/** e.g. "Sat Oct 31" */
export function formatDateShort(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  })
    .format(eventStart())
    .replace(",", "");
}

export const timeRange = () => `${formatTime(EVENT_START)}–${formatTime(EVENT_END)}`;

export const siteUrl = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
