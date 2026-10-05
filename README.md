# Bani Adam · Jay's 30th

One-page invite and RSVP site. Next.js (App Router) + TypeScript + Tailwind, Supabase for RSVPs, Resend for confirmation emails, deployed on Vercel.

## Change event details

Everything lives in `src/config/event.ts`: date (`EVENT_DATE`; the backup date is 2026-10-24), times, schedule, donation link, goal, `AMOUNT_RAISED` (shows a progress bar when > 0), and `CAPACITY`. Push and Vercel redeploys.

The street address is **never** in the code or the page. It lives only in the `PARTY_ADDRESS` env var and goes out only in confirmation emails to Yes/Maybe replies.

## Setup

1. **Supabase**: run `supabase/migrations/0001_rsvps.sql` in the SQL editor of the project you use. It creates `rsvps` with RLS on and no public policies. Only the server, using the service role key, can read or write.
2. **Resend**: verify a sending domain, create an API key, and set `RESEND_FROM` to an address on that domain.
3. **Vercel**: import the repo and add the env vars from `.env.example`. None of them use the `NEXT_PUBLIC_` prefix, so none reach the browser.
4. Open `/host` and log in with `HOST_PASSWORD`.

## Local dev

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

## How it works

- `POST /api/rsvp`: zod validation, honeypot, per-IP rate limit, upsert on email (re-RSVPing updates the row), then the Resend email with an .ics attachment.
- `/calendar.ics` and the Google Calendar link are public, so they show "Jay's house, Los Angeles" and never the street address.
- `/host`: password-protected. Shows totals, a warning when expected headcount (yes + maybe) is over `CAPACITY`, volunteers grouped by role, and a searchable table with CSV export.
- `opengraph-image.tsx`: generates the link-preview image for iMessage and WhatsApp.

## Design preview (GitHub Pages)

`./scripts/build-preview.sh` builds a static copy into `out/` with no backend: the form shows a "preview" notice and `/host` is left out. It's published on the `gh-pages` branch at https://jnemanpour.github.io/Bani-Adam-/. Send guests the real Vercel link, not this one.
