import type { Metadata } from "next";
import { CAPACITY, VOLUNTEER_ROLES, formatDateLong } from "@/config/event";
import { isHost } from "@/lib/host-auth";
import { supabaseAdmin, type Rsvp } from "@/lib/supabase";
import { logout } from "./actions";
import LoginForm from "./LoginForm";
import RsvpTable from "./RsvpTable";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Host view · Sunrise Rave", robots: { index: false, follow: false } };

function Stat({ label, value, tone = "text-cream" }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-night-2 p-4">
      <p className="text-sm text-mist">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default async function HostPage() {
  if (!(await isHost())) {
    return (
      <main className="min-h-screen px-5 py-16 text-center">
        <h1 className="title text-4xl">Host view</h1>
        <LoginForm />
      </main>
    );
  }

  const { data, error } = await supabaseAdmin().from("rsvps").select("*").order("created_at", { ascending: false });
  if (error) {
    return <main className="p-8 text-hibiscus">Couldn&apos;t load RSVPs: {error.message}</main>;
  }
  const rows = (data ?? []) as Rsvp[];

  const by = (a: Rsvp["attending"]) => rows.filter((r) => r.attending === a);
  const yes = by("yes");
  const maybe = by("maybe");
  const no = by("no");
  const sum = (list: Rsvp[], k: "adults" | "kids") => list.reduce((n, r) => n + (r[k] ?? 0), 0);
  const going = [...yes, ...maybe];
  const adults = sum(going, "adults");
  const kids = sum(going, "kids");
  const confirmed = sum(yes, "adults") + sum(yes, "kids");
  const expected = adults + kids;

  const volunteers = VOLUNTEER_ROLES.map((role) => ({
    role,
    people: going.filter((r) => r.volunteer?.includes(role)),
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="title text-3xl sm:text-4xl">Host view</h1>
          <p className="mt-2 text-mist">{formatDateLong()}</p>
        </div>
        <form action={logout}>
          <button className="rounded-full border border-white/30 px-4 py-2 text-sm">Log out</button>
        </form>
      </div>

      {expected > CAPACITY && (
        <p role="alert" className="mt-6 rounded-2xl border-2 border-hibiscus bg-hibiscus/15 p-4 text-lg font-bold text-hibiscus">
          ⚠️ Expected headcount is {expected}, over the {CAPACITY} limit. The backyard holds about 60–70 at once.
        </p>
      )}

      <section aria-label="Totals" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Stat label="Yes" value={yes.length} tone="text-gold" />
        <Stat label="Maybe" value={maybe.length} tone="text-coral" />
        <Stat label="No" value={no.length} tone="text-mist" />
        <Stat label="Adults (yes + maybe)" value={adults} />
        <Stat label="Kids (yes + maybe)" value={kids} />
        <Stat label="Confirmed heads (yes)" value={confirmed} tone="text-palm" />
        <Stat label="Expected heads (yes + maybe)" value={expected} tone={expected > CAPACITY ? "text-hibiscus" : "text-palm"} />
      </section>

      <section aria-labelledby="vol" className="mt-10">
        <h2 id="vol" className="text-2xl font-bold">Volunteers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {volunteers.map(({ role, people }) => (
            <div key={role} className="rounded-2xl border border-palm/30 bg-night-2 p-4">
              <h3 className="font-bold text-palm">
                {role} <span className="text-mist">({people.length})</span>
              </h3>
              {people.length ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {people.map((p) => (
                    <li key={p.id}>
                      {p.name} · <a className="underline" href={`tel:${p.phone}`}>{p.phone}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-mist">Nobody yet</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <RsvpTable rows={rows} />
    </main>
  );
}
