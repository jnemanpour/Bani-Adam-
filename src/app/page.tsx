import Image from "next/image";
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
import heroArt from "../../public/bani-adam.webp";

const MARQUEE = ["Live DJ", "Egg tacos", "Cold brew", "Bubble station", "Kids' zone", "Costumes", "Art", "Vendors", "Zero alcohol"];

const LINEUP = [
  { title: "DJ set", body: "Daytime house and disco from 9:30." },
  { title: "Egg taco bar", body: "Scrambled eggs, chorizo, papas, beans, a full salsa bar. Veggie friendly." },
  { title: "Sunrise bar", body: "Cold brew, pineapple lemonade, spa water." },
  { title: "Bubble station", body: "Giant bubbles and bubble guns." },
  { title: "Kids' zone", body: "Crafts, chalk, face gems." },
  { title: "Art & vendors", body: "Live painting, local makers, henna and temporary tattoos." },
  { title: "Costume floor", body: "Props bin at the door. Grab a flower crown." },
  { title: "Lounge", body: "Couches and shade when you need a breather." },
];

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
  { q: "What does Bani Adam mean?", a: "“Children of Adam”: all of us. It's the opening of a poem by Saadi about how every person is part of one body." },
];

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="12" cy="6.5" rx="4" ry="5.5" transform={`rotate(${r} 12 12)`} opacity="0.9" />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="var(--color-gold)" />
    </svg>
  );
}

function SectionTitle({ kicker, children, id }: { kicker: string; children: React.ReactNode; id?: string }) {
  return (
    <header className="mb-10 text-center">
      <p className="script text-3xl sm:text-4xl">{kicker}</p>
      <h2 id={id} className="title mt-1 text-4xl uppercase sm:text-5xl">
        {children}
      </h2>
      <Flower className="mx-auto mt-4 size-5 text-hibiscus" />
    </header>
  );
}

export default function Home() {
  const pct = Math.min(100, Math.round((AMOUNT_RAISED / DONATION_GOAL) * 100));
  const money = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <main>
      {/* 1. Hero */}
      <section aria-labelledby="title" className="relative isolate overflow-hidden px-5 pb-16 pt-6 text-center sm:pt-10">
        <div aria-hidden className="sunrise-glow pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3" />
        <h1 id="title" className="mx-auto max-w-[620px] sm:max-w-[520px]">
          <Image
            src={heroArt}
            alt="Bani Adam, بنی آدم"
            priority
            sizes="(max-width: 640px) 100vw, 520px"
            className="hero-art h-auto w-full"
          />
        </h1>
        <p className="script -mt-4 text-3xl sm:-mt-8 sm:text-4xl">Jay turns thirty</p>
        <p className="mx-auto mt-3 max-w-xl text-lg text-cream sm:text-xl">
          A sober, all-ages sunrise dance party. Dance at 9am, eat egg tacos, bring your kids, wear something ridiculous.
        </p>
        <p className="title mx-auto mt-6 inline-block rounded-full border border-gold/50 px-6 py-3 text-xl sm:text-2xl">
          {formatDateLong()}
          <span className="block text-lg text-gold sm:text-xl">
            {timeRange()} · {EVENT_CITY}
          </span>
        </p>
        <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <a href="#rsvp" className="flex-1 rounded-full bg-hibiscus px-8 py-4 text-lg font-medium tracking-wide text-night shadow-[0_8px_30px_-6px_var(--color-hibiscus)] transition hover:bg-coral">
            RSVP
          </a>
          <a href="#give" className="flex-1 rounded-full border-2 border-palm/70 px-8 py-4 text-lg font-medium tracking-wide text-palm transition hover:bg-palm hover:text-night">
            No gifts →
          </a>
        </div>
      </section>

      {/* 2. Marquee */}
      <div className="overflow-hidden border-y border-gold/30 bg-leaf py-4" role="region" aria-label="What's there">
        <p className="sr-only">{MARQUEE.join(", ")}</p>
        <div aria-hidden className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((n) => (
            <span key={n} className="flex">
              {MARQUEE.map((m, i) => (
                <span key={i} className="flex items-center gap-6 px-3 font-serif text-2xl font-semibold uppercase tracking-[0.15em] text-cream">
                  {m}
                  <Flower className="size-5 text-hibiscus" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Vision */}
      <section aria-labelledby="vision" className="mx-auto max-w-3xl px-5 py-20 text-center">
        <SectionTitle kicker="the vision" id="vision">A rave at breakfast</SectionTitle>
        <div className="space-y-5 text-lg leading-relaxed text-mist sm:text-xl">
          <p>
            A <strong className="font-medium text-cream">sober, all-ages sunrise rave</strong> at Jay&apos;s house: a DJ, great speakers, costumes, props, bubble guns, art, vendors and a lot of joy.
          </p>
          <p>
            Kids dance next to their parents. Grandparents welcome. <strong className="font-medium text-cream">Coffee instead of cocktails, egg tacos instead of a bar tab.</strong>
          </p>
        </div>
      </section>

      {/* 4. Lineup */}
      <section aria-labelledby="lineup" className="jungle px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionTitle kicker="the lineup" id="lineup">What&apos;s on</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LINEUP.map((item, i) => (
              <li key={item.title} className="rounded-3xl border border-palm/20 bg-night/70 p-6 backdrop-blur">
                <Flower className={`size-7 ${i % 2 ? "text-coral" : "text-hibiscus"}`} />
                <h3 className="title mt-3 text-2xl">{item.title}</h3>
                <p className="mt-1 text-mist">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Schedule */}
      <section aria-labelledby="schedule" className="mx-auto max-w-2xl px-5 py-20">
        <SectionTitle kicker="how the morning works" id="schedule">Run of show</SectionTitle>
        <ol className="relative space-y-7 border-l border-gold/40 pl-8">
          {SCHEDULE.map((s) => (
            <li key={s.time} className="relative">
              <span aria-hidden className="absolute -left-[38px] top-2 size-3.5 rounded-full bg-hibiscus ring-4 ring-night" />
              <p className="title text-2xl text-gold">{formatTime(s.time)}</p>
              <p className="text-xl font-medium">{s.label}</p>
              <p className="text-mist">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. House rules */}
      <section aria-labelledby="rules" className="jungle px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <SectionTitle kicker="house rules" id="rules">Keep it sweet</SectionTitle>
          <ul className="space-y-3">
            {RULES.map((r, i) => (
              <li key={r} className="flex items-baseline gap-4 rounded-2xl border border-palm/20 bg-night/70 p-4 text-lg">
                <span className="title text-2xl text-coral" aria-hidden>
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
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-gold/40 bg-gradient-to-b from-leaf to-night p-8 text-center sm:p-12">
          <p className="script text-3xl sm:text-4xl">give, don&apos;t gift</p>
          <h2 id="give-title" className="title mt-2 text-6xl text-gold sm:text-8xl">
            {money(DONATION_GOAL)}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-mist">
            No gifts, please. Instead, give to <strong className="font-medium text-cream">{DONATION_ORG}</strong>, an LA nonprofit serving chronically homeless neighbors, where Jay is a director. Any amount helps us hit the goal.
          </p>
          {AMOUNT_RAISED > 0 && (
            <div className="mx-auto mt-8 max-w-md text-left">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gold">{money(AMOUNT_RAISED)} raised</span>
                <span className="text-mist">{pct}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream/10" role="progressbar" aria-valuenow={AMOUNT_RAISED} aria-valuemin={0} aria-valuemax={DONATION_GOAL} aria-label="Donations raised">
                <div className="h-full rounded-full bg-gradient-to-r from-hibiscus via-coral to-gold" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-hibiscus px-10 py-4 text-lg font-medium tracking-wide text-night shadow-[0_8px_30px_-6px_var(--color-hibiscus)] transition hover:bg-coral"
          >
            Donate to {DONATION_ORG}
          </a>
          <figure className="mx-auto mt-12 max-w-md border-t border-gold/25 pt-8">
            <blockquote>
              <p lang="fa" dir="rtl" className="font-persian text-2xl leading-[2.4] text-cream sm:text-3xl sm:leading-[2.4]">
                بنی‌آدم اعضای یکدیگرند
                <br />
                که در آفرینش ز یک گوهرند
              </p>
              <p className="mt-4 font-serif text-xl italic text-mist">
                The children of Adam are limbs of one another, made in creation from one essence.
              </p>
            </blockquote>
            <figcaption className="mt-2 text-sm uppercase tracking-[0.2em] text-gold">Saadi</figcaption>
          </figure>
        </div>
      </section>

      {/* 8. RSVP */}
      <section id="rsvp" aria-labelledby="rsvp-title" className="jungle scroll-mt-4 px-5 py-20">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="kindly reply" id="rsvp-title">RSVP</SectionTitle>
          <p className="-mt-4 mb-8 text-center text-mist">The address comes in your confirmation email.</p>
          <RsvpForm googleUrl={googleCalendarUrl()} />
        </div>
      </section>

      {/* 9. FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-2xl px-5 py-20">
        <SectionTitle kicker="questions" id="faq">FAQ</SectionTitle>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-2xl border border-palm/20 bg-night-2">
              <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-4 text-lg font-medium">
                {f.q}
                <span aria-hidden className="faq-plus text-2xl text-coral transition-transform">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-gold/25 px-5 py-10 text-center text-mist">
        <p className="title text-xl">Bani Adam · Jay&apos;s 30th · Los Angeles</p>
        <p lang="fa" dir="rtl" className="mt-2 font-persian text-xl text-coral">بنی آدم</p>
      </footer>
    </main>
  );
}
