import {
  AMOUNT_RAISED,
  DONATION_GOAL,
  DONATION_ORG,
  DONATION_URL,
  EVENT_CITY,
  SCHEDULE,
  formatDateLong,
  formatTime,
  timeRange,
} from "@/config/event";
import { googleCalendarUrl } from "@/lib/calendar";
import RsvpForm from "@/components/RsvpForm";

const MARQUEE = ["Live DJ", "Egg tacos", "Cold brew", "Bubble station", "Kids' zone", "Costumes", "Art", "Vendors", "Zero alcohol"];

const LINEUP = [
  { icon: "🎧", title: "DJ set", body: "Daytime house and disco from 9:30.", color: "pink" },
  { icon: "🌮", title: "Egg taco bar", body: "Scrambled eggs, chorizo, papas, beans, a full salsa bar. Veggie friendly.", color: "orange" },
  { icon: "☕", title: "Sunrise bar", body: "Cold brew, pineapple lemonade, spa water.", color: "sun" },
  { icon: "🫧", title: "Bubble station", body: "Giant bubbles and bubble guns.", color: "cyan" },
  { icon: "🖍️", title: "Kids' zone", body: "Crafts, chalk, face gems.", color: "pink" },
  { icon: "🎨", title: "Art & vendors", body: "Live painting, local makers, henna and temporary tattoos.", color: "orange" },
  { icon: "🦄", title: "Costume floor", body: "Props bin at the door. Grab a cape.", color: "sun" },
  { icon: "🛋️", title: "Lounge", body: "Couches and shade when you need a breather.", color: "cyan" },
] as const;

const RULES = [
  "Check in at the gate and get a wristband.",
  "Kids sign in with a parent's phone number. The lost-kid spot is the bubble station.",
  "Rideshare if you can. Don't block the neighbors' driveways.",
  "No alcohol on site.",
  "Music stops at 1pm sharp.",
];

const FAQ = [
  { q: "Is it really at 9am?", a: "Yes. Doors at 9, last song at 12:45." },
  { q: "Can I bring my kids?", a: "Please. There's a kids' zone." },
  { q: "Do I have to wear a costume?", a: "No, but you'll wish you had." },
  { q: "What should I bring?", a: "Sunscreen, a hat, a water bottle. Food and drinks are covered." },
  { q: "What if it rains?", a: "It moves under the garage and tents. Same time." },
  { q: "Where do I park?", a: "Street parking is limited. Rideshare or carpool." },
  { q: "Where is it exactly?", a: "Jay's house in Los Angeles. The address comes in your RSVP confirmation email." },
];

const ring: Record<string, string> = {
  pink: "border-pink/60 shadow-[0_0_24px_-8px_var(--color-pink)]",
  orange: "border-orange/60 shadow-[0_0_24px_-8px_var(--color-orange)]",
  sun: "border-sun/60 shadow-[0_0_24px_-8px_var(--color-sun)]",
  cyan: "border-cyan/60 shadow-[0_0_24px_-8px_var(--color-cyan)]",
};

function SectionTitle({ kicker, children, id }: { kicker: string; children: React.ReactNode; id?: string }) {
  return (
    <header className="mb-8 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan">{kicker}</p>
      <h2 id={id} className="neon mt-3 text-4xl leading-tight sm:text-5xl">
        {children}
      </h2>
    </header>
  );
}

export default function Home() {
  const pct = Math.min(100, Math.round((AMOUNT_RAISED / DONATION_GOAL) * 100));
  const money = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <main>
      {/* 1. Hero */}
      <section aria-labelledby="title" className="sky relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-[34svh] pt-14 text-center sm:pt-20">
        <div className="relative z-10 flex flex-col items-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan sm:text-base">Jay turns 30</p>
        <h1 id="title" className="neon mt-4 text-[17vw] leading-[0.95] sm:text-8xl md:text-9xl">
          Sunrise
          <br />
          Rave
        </h1>
        <p className="mt-6 max-w-xl text-lg font-medium text-white sm:text-xl [text-shadow:0_2px_12px_rgb(7_4_15/0.8)]">
          Jay turns 30. Dance at 9am, eat egg tacos, bring your kids, wear something ridiculous.
        </p>
        <p className="neon-sub mt-5 rounded-2xl bg-night/75 px-5 py-3 text-xl font-bold backdrop-blur sm:text-2xl">
          {formatDateLong()}
          <br />
          {timeRange()} · {EVENT_CITY}
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <a href="#rsvp" className="flex-1 rounded-full bg-pink px-8 py-4 text-lg font-bold text-night shadow-[0_0_30px_var(--color-pink)] transition hover:scale-[1.03] hover:bg-white">
            RSVP
          </a>
          <a href="#give" className="flex-1 rounded-full border-2 border-sun bg-night/60 px-8 py-4 text-lg font-bold text-sun backdrop-blur transition hover:bg-sun hover:text-night">
            No gifts →
          </a>
        </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex flex-col items-center">
          <div className="sun translate-y-1/2" />
          <div className="relative h-[24svh] w-[220%] -mt-[1px] bg-night">
            <div className="grid-floor absolute inset-0" />
          </div>
        </div>
      </section>

      {/* 2. Marquee */}
      <div className="overflow-hidden border-y-2 border-pink bg-night py-4" role="region" aria-label="What's there">
        <p className="sr-only">{MARQUEE.join(", ")}</p>
        <div aria-hidden className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((n) => (
            <span key={n} className="flex">
              {MARQUEE.map((m, i) => (
                <span key={i} className="flex items-center px-4 text-xl font-bold uppercase tracking-widest text-sun">
                  {m}
                  <span className="pl-8 text-pink">✺</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Vision */}
      <section aria-labelledby="vision" className="mx-auto max-w-3xl px-5 py-20 text-center">
        <SectionTitle kicker="The vision" id="vision">A rave at breakfast</SectionTitle>
        <div className="space-y-5 text-lg leading-relaxed text-mist sm:text-xl">
          <p>
            A <strong className="text-white">sober, all-ages sunrise rave</strong> at Jay&apos;s house: a DJ, great speakers, costumes, props, bubble guns, art, vendors and a lot of joy.
          </p>
          <p>
            Kids dance next to their parents. Grandparents welcome. <strong className="text-white">Coffee instead of cocktails, egg tacos instead of a bar tab.</strong>
          </p>
        </div>
      </section>

      {/* 4. Lineup */}
      <section aria-labelledby="lineup" className="bg-night-2 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionTitle kicker="The lineup" id="lineup">What&apos;s on</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LINEUP.map((item) => (
              <li key={item.title} className={`rounded-2xl border-2 bg-night p-5 ${ring[item.color]}`}>
                <div className="text-4xl" aria-hidden>
                  {item.icon}
                </div>
                <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                <p className="mt-1 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Schedule */}
      <section aria-labelledby="schedule" className="mx-auto max-w-2xl px-5 py-20">
        <SectionTitle kicker="How the morning works" id="schedule">Run of show</SectionTitle>
        <ol className="relative space-y-6 border-l-2 border-dashed border-pink/60 pl-8">
          {SCHEDULE.map((s) => (
            <li key={s.time} className="relative">
              <span aria-hidden className="absolute -left-[41px] top-1.5 size-4 rounded-full bg-sun shadow-[0_0_14px_var(--color-orange)]" />
              <p className="text-2xl font-bold text-sun">{formatTime(s.time)}</p>
              <p className="text-xl font-bold">{s.label}</p>
              <p className="text-mist">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. House rules */}
      <section aria-labelledby="rules" className="bg-night-2 px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <SectionTitle kicker="House rules" id="rules">Keep it sweet</SectionTitle>
          <ul className="space-y-3">
            {RULES.map((r, i) => (
              <li key={r} className="flex gap-4 rounded-2xl border border-cyan/30 bg-night p-4 text-lg">
                <span className="font-display text-2xl text-cyan" aria-hidden>
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Give */}
      <section id="give" aria-labelledby="give-title" className="scroll-mt-4 px-5 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-pink bg-gradient-to-b from-[#2a0b2e] to-night p-8 text-center shadow-[0_0_60px_-10px_var(--color-pink)] sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan">Give, don&apos;t gift</p>
          <h2 id="give-title" className="neon mt-4 text-6xl sm:text-8xl">
            {money(DONATION_GOAL)}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-mist">
            No gifts, please. Instead, give to <strong className="text-white">{DONATION_ORG}</strong>, an LA nonprofit serving chronically homeless neighbors, where Jay is a director. Any amount helps us hit the goal.
          </p>
          {AMOUNT_RAISED > 0 && (
            <div className="mx-auto mt-8 max-w-md text-left">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-sun">{money(AMOUNT_RAISED)} raised</span>
                <span className="text-mist">{pct}%</span>
              </div>
              <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={AMOUNT_RAISED} aria-valuemin={0} aria-valuemax={DONATION_GOAL} aria-label="Donations raised">
                <div className="h-full rounded-full bg-gradient-to-r from-pink via-orange to-sun" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-pink px-10 py-4 text-lg font-bold text-night shadow-[0_0_30px_var(--color-pink)] transition hover:scale-[1.03] hover:bg-white"
          >
            Donate to {DONATION_ORG}
          </a>
        </div>
      </section>

      {/* 8. RSVP */}
      <section id="rsvp" aria-labelledby="rsvp-title" className="scroll-mt-4 bg-night-2 px-5 py-20">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Kindly reply" id="rsvp-title">RSVP</SectionTitle>
          <p className="-mt-4 mb-8 text-center text-mist">The address comes in your confirmation email.</p>
          <RsvpForm googleUrl={googleCalendarUrl()} />
        </div>
      </section>

      {/* 9. FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-2xl px-5 py-20">
        <SectionTitle kicker="Questions" id="faq">FAQ</SectionTitle>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-orange/40 bg-night-2">
              <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-4 text-lg font-bold">
                {f.q}
                <span aria-hidden className="faq-plus text-2xl text-orange transition-transform">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t-2 border-pink/50 px-5 py-10 text-center text-mist">
        <p className="font-bold">Sunrise Rave · Jay&apos;s 30th · Los Angeles</p>
      </footer>
    </main>
  );
}
