/* eslint-disable @next/next/no-img-element */
// Trials 46–50: the second five complete homepages. Same rules as fullpages-a — real copy
// from src/lib/data.ts, CSS only, server components, whole page from nav to footer.

import { galleryImages, testimonials, aboutParagraphs, workshopTypes } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { Switcher } from './registry';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');
const g = (i: number) => asset(galleryImages[i].src);
const alt = (i: number) => galleryImages[i].alt;

const GREEN = '#4c7252';
const ORANGE = '#d3793b';
const CREAM = '#f7f1e3';
const INK = '#1c1a17';

const NAV = ['About', 'Workshops', 'Hoop Shop', 'Contact'];
const OFFERS = workshopTypes.slice(0, 3);
const T0 = testimonials[0];
const T1 = testimonials[1] ?? testimonials[0];

function Frame({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <Switcher current={id} />
      {children}
    </div>
  );
}

// ═══ 46 — Neon sign ════════════════════════════════════════════════════════════════════
// The wordmark as a neon tube on a dark wall, festival-at-night. Sells the LED and fire
// side hardest, and the glow does the logo's contrast work for it.
export function Art46() {
  const glow = (c: string) => `0 0 6px ${c}, 0 0 18px ${c}, 0 0 44px ${c}80, 0 0 90px ${c}40`;
  return (
    <Frame id="46" bg="#0a0810">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span
            className="font-display text-xl tracking-wide"
            style={{ color: CREAM, textShadow: glow('#ff9a4d') }}
          >
            {siteConfig.name}
          </span>
          <nav
            className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.2em] sm:flex"
            style={{ color: 'rgba(247,241,227,.55)' }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,154,77,.22), transparent 62%)' }}
        />
        <img
          src={LOGO}
          alt="Flowsha"
          width={670}
          height={896}
          className="relative h-[44vh] w-auto"
          style={{
            filter:
              'drop-shadow(0 0 22px rgba(255,154,77,.65)) drop-shadow(0 0 60px rgba(255,154,77,.3))',
          }}
        />
        <h1
          className="relative mt-9 font-display text-[clamp(2.4rem,8vw,5.6rem)] leading-[0.9]"
          style={{ color: '#fff3e2', textShadow: glow('#ff9a4d') }}
        >
          flow · play · connect
        </h1>
        <p className="relative mt-6 max-w-md text-lg" style={{ color: 'rgba(247,241,227,.7)' }}>
          Hoop classes by day. Fire and LED shows after dark. {siteConfig.areaServed}.
        </p>
        <span
          className="relative mt-9 inline-block rounded-full border-2 px-8 py-3 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ borderColor: '#ff9a4d', color: '#ffcf9e', boxShadow: glow('#ff9a4d') }}
        >
          Book a workshop
        </span>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map((o, i) => {
            const c = ['#ff9a4d', '#54e0c0', '#c98cff'][i];
            return (
              <div
                key={o.title}
                className="rounded-2xl border p-6"
                style={{ borderColor: `${c}55`, boxShadow: `inset 0 0 40px ${c}12` }}
              >
                <h3 className="font-display text-xl" style={{ color: c, textShadow: glow(c) }}>
                  {o.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'rgba(247,241,227,.72)' }}
                >
                  {o.blurb}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-14">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: '#ff9a4d' }}
        >
          Meet Osha
        </p>
        <p className="mt-4 text-[15px] leading-[1.85]" style={{ color: 'rgba(247,241,227,.78)' }}>
          {aboutParagraphs[0]}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 5, 2, 9].map((n) => (
            <img
              key={n}
              src={g(n)}
              alt={alt(n)}
              className="h-40 w-full rounded-xl object-cover"
              style={{ boxShadow: '0 0 30px rgba(255,154,77,.12)' }}
            />
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <blockquote
          className="mx-auto max-w-3xl text-center font-display text-[clamp(1.3rem,3.4vw,2.1rem)] italic leading-snug"
          style={{ color: '#fff3e2' }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: '#ff9a4d' }}
        >
          {T0.name}
        </p>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-6 py-9">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <span
              className="font-display text-xl"
              style={{ color: CREAM, textShadow: glow('#ff9a4d') }}
            >
              {siteConfig.name}
            </span>
          </div>
          <p
            className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em]"
            style={{ color: 'rgba(247,241,227,.5)' }}
          >
            {siteConfig.email}
            <br />
            {siteConfig.areaServed}
          </p>
        </div>
      </footer>
    </Frame>
  );
}

// ═══ 47 — Tape swatches ════════════════════════════════════════════════════════════════
// Built around the thing Osha actually makes: hoop tape. A swatch library, material labels,
// spec language. This is the shop's best case dressed as the homepage.
export function Art47() {
  const tapes = [
    ['Terracotta', ORANGE],
    ['Forest', GREEN],
    ['Mustard', '#d8a534'],
    ['Clay', '#7a5240'],
    ['Sage', '#7f9a7a'],
    ['Petrol', '#12313a'],
    ['Plum', '#33204a'],
    ['Bone', '#e6ddcb'],
  ] as const;
  return (
    <Frame id="47" bg="#faf6ec">
      <header className="border-b" style={{ borderColor: 'rgba(28,26,23,.18)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-11 w-auto" />
            <span className="font-display text-xl" style={{ color: GREEN }}>
              {siteConfig.name}
            </span>
          </div>
          <nav
            className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.18em] sm:flex"
            style={{ color: 'rgba(28,26,23,.65)' }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* Swatch wall as the hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid items-center gap-10 md:grid-cols-[.85fr_1fr]">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.26em]"
              style={{ color: ORANGE }}
            >
              Materials · Southampton
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.92]"
              style={{ color: INK }}
            >
              Pick your tape.
              <br />
              I&rsquo;ll make the hoop.
            </h1>
            <p
              className="mt-5 max-w-sm text-[15px] leading-relaxed"
              style={{ color: 'rgba(28,26,23,.78)' }}
            >
              Every hoop is sized, weighted and taped by hand to suit how you move. Classes and
              shows too.
            </p>
            <span
              className="mt-7 inline-block rounded-full px-7 py-3 text-sm font-semibold"
              style={{ backgroundColor: GREEN, color: CREAM }}
            >
              Order a hoop
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {tapes.map(([name, c]) => (
              <div key={name}>
                <div
                  className="aspect-square rounded-md"
                  style={{ backgroundColor: c, boxShadow: 'inset 0 -8px 14px rgba(0,0,0,.14)' }}
                />
                <p
                  className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(28,26,23,.65)' }}
                >
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The specimen */}
      <section
        className="border-y"
        style={{ borderColor: 'rgba(28,26,23,.14)', backgroundColor: '#f2ece0' }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-[auto_1fr]">
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="h-[38vh] w-auto justify-self-center"
          />
          <dl className="font-mono text-[12px] uppercase tracking-[0.1em]">
            {[
              ['Maker', 'Osha'],
              ['Tubing', 'Polypro · HDPE'],
              ['Finish', 'Shiny tape · gaffer · grip'],
              ['Sizes', 'Made to your height'],
              ['Lead time', 'On request'],
              ['Collection', `Free · ${siteConfig.areaServed}`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b py-3"
                style={{ borderColor: 'rgba(28,26,23,.15)', color: 'rgba(28,26,23,.7)' }}
              >
                <dt>{k}</dt>
                <dd style={{ color: INK }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: '#f2ece0',
                borderTop: `5px solid ${[ORANGE, GREEN, '#7a5240'][i]}`,
              }}
            >
              <h3 className="font-display text-xl" style={{ color: INK }}>
                {o.title}
              </h3>
              <p
                className="mt-2 text-[14px] leading-relaxed"
                style={{ color: 'rgba(28,26,23,.75)' }}
              >
                {o.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.26em]" style={{ color: ORANGE }}>
          Meet the maker
        </p>
        <p className="mt-4 text-[15px] leading-[1.8]" style={{ color: 'rgba(28,26,23,.85)' }}>
          {aboutParagraphs[0]}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 5, 2, 9].map((n) => (
            <img key={n} src={g(n)} alt={alt(n)} className="h-36 w-full rounded-lg object-cover" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14 text-center">
        <blockquote
          className="font-display text-[clamp(1.3rem,3.4vw,2rem)] italic leading-snug"
          style={{ color: INK }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: ORANGE }}
        >
          {T0.name}
        </p>
      </section>

      <footer style={{ backgroundColor: GREEN }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-6 py-9">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <span className="font-display text-xl" style={{ color: CREAM }}>
              {siteConfig.name}
            </span>
          </div>
          <p
            className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em]"
            style={{ color: 'rgba(247,241,227,.8)' }}
          >
            {siteConfig.email}
            <br />
            {siteConfig.areaServed}
          </p>
        </div>
      </footer>
    </Frame>
  );
}

// ═══ 48 — Storybook ════════════════════════════════════════════════════════════════════
// Bright, warm and illustrated, aimed squarely at the kids' and beginner classes. The logo
// becomes a character rather than a mark.
export function Art48() {
  const blob = (c: string) => ({
    background: c,
    borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%',
  });
  return (
    <Frame id="48" bg="#fff8e8">
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-12 w-auto" />
            <span className="font-display text-2xl" style={{ color: GREEN }}>
              {siteConfig.name}
            </span>
          </div>
          <nav className="hidden gap-6 text-sm font-bold sm:flex" style={{ color: '#8a6a3a' }}>
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-10">
        <div
          aria-hidden
          className="absolute -left-24 top-10 h-72 w-72 opacity-60"
          style={blob('#ffe2b0')}
        />
        <div
          aria-hidden
          className="absolute -right-20 bottom-0 h-80 w-80 opacity-50"
          style={blob('#cfe6c8')}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
              Once around the hoop…
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.95]"
              style={{ color: GREEN }}
            >
              Anyone can hoop!
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: '#5d4a2e' }}>
              Hoop classes for grown-ups and little ones in {siteConfig.areaServed}. No experience,
              no coordination — just turn up curious.
            </p>
            <span
              className="mt-7 inline-block rounded-full px-8 py-4 text-base font-bold shadow-[0_6px_0_rgba(0,0,0,.15)]"
              style={{ backgroundColor: ORANGE, color: '#fff8e8' }}
            >
              Come and play →
            </span>
          </div>
          <div className="relative flex justify-center">
            <div aria-hidden className="absolute h-[42vh] w-[42vh]" style={blob('#ffd79a')} />
            <img
              src={LOGO}
              alt="Flowsha"
              width={670}
              height={896}
              className="relative h-[46vh] w-auto"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className="rounded-[2rem] p-7 shadow-[0_8px_0_rgba(0,0,0,.08)]"
              style={{ backgroundColor: ['#ffe9c4', '#d9ecd2', '#ffdcc8'][i] }}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full font-display text-xl"
                style={{ backgroundColor: GREEN, color: CREAM }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-2xl" style={{ color: GREEN }}>
                {o.title}
              </h3>
              <p className="mt-2 leading-relaxed" style={{ color: '#5d4a2e' }}>
                {o.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-[2rem] p-8" style={{ backgroundColor: '#f1e6cf' }}>
          <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            Hello, I&rsquo;m Osha
          </p>
          <p className="mt-4 text-[16px] leading-[1.8]" style={{ color: '#5d4a2e' }}>
            {aboutParagraphs[0]}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 5, 2, 9].map((n, i) => (
            <img
              key={n}
              src={g(n)}
              alt={alt(n)}
              className={`h-40 w-full rounded-[1.5rem] object-cover ${['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'][i]}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14 text-center">
        <blockquote
          className="font-display text-[clamp(1.4rem,3.6vw,2.2rem)] leading-snug"
          style={{ color: GREEN }}
        >
          “{T1.quote.split('.')[0]}.”
        </blockquote>
        <p className="mt-3 font-bold" style={{ color: ORANGE }}>
          — {T1.name}
        </p>
      </section>

      <footer style={{ backgroundColor: '#d9ecd2' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-6 py-9">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <span className="font-display text-2xl" style={{ color: GREEN }}>
              {siteConfig.name}
            </span>
          </div>
          <p className="text-sm font-bold leading-loose" style={{ color: '#5d4a2e' }}>
            {siteConfig.email}
            <br />
            {siteConfig.areaServed}
          </p>
        </div>
      </footer>
    </Frame>
  );
}

// ═══ 49 — Blueprint ════════════════════════════════════════════════════════════════════
// The hoop as an engineered object: draughting grid, dimension lines, spec tables. Makes
// "handmade" read as "made properly", which is the shop's real selling point.
export function Art49() {
  const CY = '#7fd4e8';
  const grid = {
    backgroundImage:
      'linear-gradient(rgba(127,212,232,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(127,212,232,.10) 1px, transparent 1px)',
    backgroundSize: '26px 26px, 26px 26px',
  };
  return (
    <Frame id="49" bg="#0b1a28">
      <div style={grid}>
        <header className="border-b" style={{ borderColor: 'rgba(127,212,232,.25)' }}>
          <div
            className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: CY }}
          >
            <span>Flowsha · drawing no. 001</span>
            <span className="hidden gap-5 sm:flex">
              {NAV.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* The specimen, dimensioned. */}
            <div className="relative flex justify-center">
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ borderColor: 'rgba(127,212,232,.35)', borderStyle: 'dashed' }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-px w-[46vh] -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: 'rgba(127,212,232,.35)' }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[46vh] w-px -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: 'rgba(127,212,232,.35)' }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-[calc(50%-23vh-18px)] -translate-x-1/2 font-mono text-[10px]"
                style={{ color: CY }}
              >
                ⌀ made to height
              </span>
              <img
                src={LOGO}
                alt="Flowsha"
                width={670}
                height={896}
                className="relative h-[42vh] w-auto"
              />
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.26em]"
                style={{ color: CY }}
              >
                Section A · Southampton
              </p>
              <h1
                className="mt-4 font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.92]"
                style={{ color: CREAM }}
              >
                Built, not bought.
              </h1>
              <p
                className="mt-5 max-w-md text-[15px] leading-relaxed"
                style={{ color: 'rgba(247,241,227,.72)' }}
              >
                Hoops measured to your height, taped by hand and balanced for how you move. Plus
                classes and performance.
              </p>
              <span
                className="mt-7 inline-block border px-7 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ borderColor: CY, color: CY }}
              >
                Request a spec
              </span>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl border-y px-6 py-10"
          style={{ borderColor: 'rgba(127,212,232,.22)' }}
        >
          <div className="grid gap-8 md:grid-cols-3">
            {OFFERS.map((o, i) => (
              <div key={o.title}>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: CY }}
                >
                  Item {String(i + 1).padStart(3, '0')}
                </p>
                <h3 className="mt-2 font-display text-xl" style={{ color: CREAM }}>
                  {o.title}
                </h3>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed"
                  style={{ color: 'rgba(247,241,227,.68)' }}
                >
                  {o.blurb}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1fr_.8fr]">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.26em]"
                style={{ color: CY }}
              >
                Notes · the maker
              </p>
              <p
                className="mt-4 text-[15px] leading-[1.85]"
                style={{ color: 'rgba(247,241,227,.78)' }}
              >
                {aboutParagraphs[0]}
              </p>
            </div>
            <dl className="font-mono text-[11px] uppercase tracking-[0.1em]">
              {[
                ['Material', 'Polypro / HDPE'],
                ['Joint', 'Push-fit · riveted'],
                ['Tape', 'Shiny · gaffer · grip'],
                ['Tolerance', 'Made to you'],
                ['Origin', siteConfig.areaServed],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b py-2.5"
                  style={{ borderColor: 'rgba(127,212,232,.2)', color: 'rgba(247,241,227,.6)' }}
                >
                  <dt>{k}</dt>
                  <dd style={{ color: CY }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[1, 5, 2, 9].map((n) => (
              <figure key={n}>
                <img
                  src={g(n)}
                  alt={alt(n)}
                  className="h-36 w-full object-cover"
                  style={{ border: '1px solid rgba(127,212,232,.3)' }}
                />
                <figcaption
                  className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em]"
                  style={{ color: 'rgba(127,212,232,.7)' }}
                >
                  Ref {n}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-14 text-center">
          <blockquote
            className="font-display text-[clamp(1.3rem,3.4vw,2rem)] italic leading-snug"
            style={{ color: CREAM }}
          >
            “{T0.quote.split('.')[0]}.”
          </blockquote>
          <p
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: CY }}
          >
            Verified — {T0.name}
          </p>
        </section>

        <footer className="border-t" style={{ borderColor: 'rgba(127,212,232,.25)' }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-6 py-8">
            <div className="flex items-center gap-4">
              <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
              <span className="font-display text-xl" style={{ color: CREAM }}>
                {siteConfig.name}
              </span>
            </div>
            <p
              className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em]"
              style={{ color: CY }}
            >
              {siteConfig.email}
              <br />
              Drawn in {siteConfig.areaServed}
            </p>
          </div>
        </footer>
      </div>
    </Frame>
  );
}

// ═══ 50 — Timeline scrapbook ═══════════════════════════════════════════════════════════
// Osha's story as the spine of the page — a decade of hooping laid out as a route, with the
// logo as the milestone marker. Sells the person, which is what actually sells classes.
export function Art50() {
  const stops = [
    ['A decade ago', 'First hoop', aboutParagraphs[0].split('.').slice(1, 3).join('.') + '.', 1],
    ['Since then', 'The community', aboutParagraphs[1] ?? '', 5],
    ['Now', 'Teaching', aboutParagraphs[2] ?? '', 2],
    ['Next', 'Your turn', aboutParagraphs[3] ?? '', 9],
  ] as const;
  return (
    <Frame id="50" bg="#f7f2e7">
      <header
        className="sticky top-0 z-20 border-b backdrop-blur"
        style={{ borderColor: 'rgba(28,26,23,.14)', backgroundColor: 'rgba(247,242,231,.9)' }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-11 w-auto" />
            <span className="font-display text-xl" style={{ color: GREEN }}>
              {siteConfig.name}
            </span>
          </div>
          <nav
            className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.18em] sm:flex"
            style={{ color: 'rgba(28,26,23,.65)' }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <img
          src={LOGO}
          alt="Flowsha"
          width={670}
          height={896}
          className="mx-auto h-[38vh] w-auto"
        />
        <h1
          className="mt-8 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.94]"
          style={{ color: INK }}
        >
          Ten years of going round in circles.
        </h1>
        <p
          className="mx-auto mt-5 max-w-lg text-lg leading-relaxed"
          style={{ color: 'rgba(28,26,23,.78)' }}
        >
          Hoop classes, performance and handmade hoops in {siteConfig.areaServed}. This is how it
          started.
        </p>
      </section>

      {/* The timeline spine */}
      <section className="mx-auto max-w-3xl px-6 pb-10">
        <div className="relative border-l-2 pl-8" style={{ borderColor: 'rgba(76,114,82,.35)' }}>
          {stops.map(([when, what, text, img], i) => (
            <div key={when} className="relative pb-12">
              <span
                aria-hidden
                className="absolute -left-[41px] top-1 grid h-6 w-6 place-items-center rounded-full"
                style={{ backgroundColor: i % 2 ? ORANGE : GREEN, color: CREAM, fontSize: 11 }}
              >
                {i + 1}
              </span>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: ORANGE }}
              >
                {when}
              </p>
              <h3 className="mt-1.5 font-display text-2xl" style={{ color: GREEN }}>
                {what}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.8]" style={{ color: 'rgba(28,26,23,.8)' }}>
                {text}
              </p>
              <img
                src={g(img)}
                alt={alt(img)}
                className={`mt-4 h-44 w-full max-w-sm rounded-lg object-cover shadow-md ${i % 2 ? '-rotate-1' : 'rotate-1'}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Offerings */}
      <section
        className="border-y"
        style={{ borderColor: 'rgba(28,26,23,.14)', backgroundColor: '#efe8d8' }}
      >
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em]"
            style={{ color: ORANGE }}
          >
            Come along
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {OFFERS.map((o) => (
              <div key={o.title} className="rounded-xl bg-white/70 p-5">
                <h3 className="font-display text-lg" style={{ color: GREEN }}>
                  {o.title}
                </h3>
                <p
                  className="mt-1.5 text-[13.5px] leading-relaxed"
                  style={{ color: 'rgba(28,26,23,.75)' }}
                >
                  {o.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <blockquote
          className="font-display text-[clamp(1.3rem,3.6vw,2.1rem)] italic leading-snug"
          style={{ color: INK }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          {T0.name}
        </p>
        <span
          className="mt-8 inline-block rounded-full px-8 py-3.5 text-sm font-semibold"
          style={{ backgroundColor: GREEN, color: CREAM }}
        >
          Book a workshop
        </span>
      </section>

      <footer style={{ backgroundColor: '#efe8d8' }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-5 px-6 py-9">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <div>
              <p className="font-display text-xl" style={{ color: GREEN }}>
                {siteConfig.name}
              </p>
              <p className="font-display italic" style={{ color: ORANGE }}>
                {siteConfig.tagline}
              </p>
            </div>
          </div>
          <p
            className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em]"
            style={{ color: 'rgba(28,26,23,.65)' }}
          >
            {siteConfig.email}
            <br />
            {siteConfig.areaServed}
          </p>
        </div>
      </footer>
    </Frame>
  );
}
