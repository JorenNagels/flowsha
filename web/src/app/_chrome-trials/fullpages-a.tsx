/* eslint-disable @next/next/no-img-element */
// Trials 41–45: five complete homepages, not hero-and-a-bit. Same art-direction approach as
// 31–40, but each one runs the whole page — nav, hero, offerings, Osha's story, gallery, a
// testimonial, a booking CTA and a footer.
//
// All copy is the real content from src/lib/data.ts, so these can be judged on how the
// actual words sit in each layout rather than on placeholder rhythm.
//
// Everything is CSS. Server components throughout; nothing here needs a hook.

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

function Frame({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <Switcher current={id} />
      {children}
    </div>
  );
}

// ═══ 41 — Editorial magazine ═══════════════════════════════════════════════════════════
// A culture magazine: masthead, cover, feature spread with drop cap, photo essay, back page.
export function Art41() {
  return (
    <Frame id="41" bg="#f4f1ea">
      {/* Masthead */}
      <header className="border-b-[3px]" style={{ borderColor: INK }}>
        <div
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: INK }}
        >
          <span>Issue 01 · Southampton</span>
          <span>{siteConfig.areaServed}</span>
        </div>
        <div className="border-t" style={{ borderColor: INK }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
            <span
              className="font-display text-[clamp(1.4rem,3vw,2rem)] uppercase tracking-[0.14em]"
              style={{ color: INK }}
            >
              Flowsha
            </span>
            <nav
              className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.18em] sm:flex"
              style={{ color: 'rgba(28,26,23,.7)' }}
            >
              {NAV.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Cover */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-8 md:grid-cols-[1fr_.85fr]">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: ORANGE }}
            >
              The hooping issue
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.86]"
              style={{ color: INK }}
            >
              Plastic circles,
              <br />
              serious joy.
            </h1>
            <p
              className="mt-6 max-w-md text-lg leading-relaxed"
              style={{ color: 'rgba(28,26,23,.8)' }}
            >
              Osha teaches hooping in Southampton — classes for anyone, fire and LED shows for
              anywhere, and hoops made one at a time by hand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span
                className="px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                Book a workshop
              </span>
              <span
                className="border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ borderColor: INK, color: INK }}
              >
                Read her story
              </span>
            </div>
          </div>
          <div className="relative flex items-end justify-center">
            <img src={LOGO} alt="Flowsha" width={670} height={896} className="h-[46vh] w-auto" />
          </div>
        </div>
      </section>

      {/* Feature spread with drop cap */}
      <section
        className="mx-auto mt-16 max-w-6xl border-y-2 px-6 py-12"
        style={{ borderColor: INK }}
      >
        <p
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: ORANGE }}
        >
          Feature · Meet Osha
        </p>
        <div className="gap-10 md:columns-2">
          <p
            className="mb-4 text-[15px] leading-[1.75] [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:font-display [&::first-letter]:text-[4.2rem] [&::first-letter]:leading-[0.8]"
            style={{ color: 'rgba(28,26,23,.86)' }}
          >
            {aboutParagraphs[0]}
          </p>
          <p className="mb-4 text-[15px] leading-[1.75]" style={{ color: 'rgba(28,26,23,.86)' }}>
            {aboutParagraphs[2]}
          </p>
        </div>
      </section>

      {/* Offerings as an index */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: ORANGE }}>
          Inside
        </p>
        <ol className="mt-5 border-t" style={{ borderColor: 'rgba(28,26,23,.28)' }}>
          {OFFERS.map((o, i) => (
            <li
              key={o.title}
              className="flex gap-5 border-b py-5"
              style={{ borderColor: 'rgba(28,26,23,.28)' }}
            >
              <span className="font-mono text-[11px] tabular-nums" style={{ color: ORANGE }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-[clamp(1.3rem,3vw,1.9rem)]" style={{ color: INK }}>
                  {o.title}
                </h3>
                <p
                  className="mt-1.5 max-w-2xl text-[15px] leading-relaxed"
                  style={{ color: 'rgba(28,26,23,.75)' }}
                >
                  {o.blurb}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Photo essay */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 5, 2, 9].map((n, i) => (
            <figure key={n} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <img
                src={g(n)}
                alt={alt(n)}
                className={`w-full object-cover ${i === 0 ? 'h-full min-h-[240px]' : 'h-40'}`}
              />
              <figcaption
                className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: 'rgba(28,26,23,.55)' }}
              >
                Fig. {i + 1}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="mx-auto max-w-4xl px-6 py-14 text-center">
        <blockquote
          className="font-display text-[clamp(1.5rem,4vw,2.6rem)] italic leading-tight"
          style={{ color: INK }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <cite
          className="mt-5 block font-mono text-[11px] uppercase not-italic tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          — {T0.name}
        </cite>
      </section>

      {/* Back page */}
      <footer className="border-t-[3px]" style={{ borderColor: INK }}>
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
          <div>
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <p className="mt-3 font-display text-xl" style={{ color: INK }}>
              {siteConfig.name}
            </p>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'rgba(28,26,23,.6)' }}
            >
              {siteConfig.tagline}
            </p>
          </div>
          <div
            className="font-mono text-[11px] uppercase leading-loose tracking-[0.16em]"
            style={{ color: 'rgba(28,26,23,.7)' }}
          >
            {NAV.map((n) => (
              <span key={n} className="block">
                {n}
              </span>
            ))}
          </div>
          <div
            className="font-mono text-[11px] uppercase leading-loose tracking-[0.16em]"
            style={{ color: 'rgba(28,26,23,.7)' }}
          >
            <span className="block">{siteConfig.email}</span>
            <span className="block">{siteConfig.areaServed}</span>
          </div>
        </div>
      </footer>
    </Frame>
  );
}

// ═══ 42 — Vinyl record ═════════════════════════════════════════════════════════════════
// The site as an album: sleeve front, tracklist, liner notes, side A / side B.
export function Art42() {
  return (
    <Frame id="42" bg="#141210">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: CREAM }}
          >
            Flowsha · LP01
          </span>
          <nav
            className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.18em] sm:flex"
            style={{ color: 'rgba(247,241,227,.6)' }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* Sleeve + spinning record */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            className="relative aspect-square w-full max-w-[440px] shadow-2xl"
            style={{ backgroundColor: GREEN }}
          >
            <img
              src={LOGO}
              alt="Flowsha"
              width={670}
              height={896}
              className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2"
            />
            <span
              className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ color: 'rgba(247,241,227,.75)' }}
            >
              Flow · Play · Connect
            </span>
          </div>
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: ORANGE }}
            >
              Side A · Southampton
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.9]"
              style={{ color: CREAM }}
            >
              Flow · Play · Connect
            </h1>
            <p className="mt-5 max-w-md text-lg" style={{ color: 'rgba(247,241,227,.75)' }}>
              Hoop classes, fire and LED performance, and handmade hoops. Recorded live in
              Hampshire.
            </p>
            <span
              className="mt-8 inline-block rounded-full px-8 py-3 text-sm font-semibold"
              style={{ backgroundColor: ORANGE, color: INK }}
            >
              Book a workshop
            </span>
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <p
          className="border-b border-white/15 pb-3 font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: 'rgba(247,241,227,.5)' }}
        >
          Tracklist
        </p>
        <ol>
          {OFFERS.map((o, i) => (
            <li key={o.title} className="flex items-baseline gap-5 border-b border-white/10 py-4">
              <span className="font-mono text-[11px] tabular-nums" style={{ color: ORANGE }}>
                A{i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-xl" style={{ color: CREAM }}>
                  {o.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'rgba(247,241,227,.65)' }}>
                  {o.blurb}
                </p>
              </div>
              <span className="font-mono text-[11px]" style={{ color: 'rgba(247,241,227,.4)' }}>
                {['60', '75', '90'][i]}:00
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Liner notes + sleeve back photos */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: ORANGE }}
            >
              Liner notes
            </p>
            <p
              className="mt-4 text-[15px] leading-[1.8]"
              style={{ color: 'rgba(247,241,227,.78)' }}
            >
              {aboutParagraphs[0]}
            </p>
            <p
              className="mt-4 text-[15px] leading-[1.8]"
              style={{ color: 'rgba(247,241,227,.78)' }}
            >
              {aboutParagraphs[3]}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 5, 2, 9].map((n) => (
              <img key={n} src={g(n)} alt={alt(n)} className="h-32 w-full object-cover" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 px-6 py-12">
        <blockquote
          className="mx-auto max-w-3xl text-center font-display text-[clamp(1.3rem,3.4vw,2.1rem)] italic leading-snug"
          style={{ color: CREAM }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          {T0.name}
        </p>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <div>
              <p className="font-display text-xl" style={{ color: CREAM }}>
                {siteConfig.name}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'rgba(247,241,227,.55)' }}
              >
                {siteConfig.email}
              </p>
            </div>
          </div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(247,241,227,.4)' }}
          >
            ℗ Flowsha · {siteConfig.areaServed}
          </p>
        </div>
      </footer>
    </Frame>
  );
}

// ═══ 43 — Botanical field guide ════════════════════════════════════════════════════════
// The figure genuinely reads as leaves and stems, so: a herbarium plate. Pressed-specimen
// layout, fine rules, latinate labels, cream paper.
export function Art43() {
  const plates = [
    ['Beginnerus simplex', OFFERS[0].title, OFFERS[0].blurb, 1],
    ['Intermedia fluens', OFFERS[1].title, OFFERS[1].blurb, 5],
    [
      'Circulus manufactus',
      OFFERS[2]?.title ?? 'Handmade Hoops',
      OFFERS[2]?.blurb ?? 'Made by hand.',
      2,
    ],
  ] as const;
  return (
    <Frame id="43" bg="#f6f2e4">
      <header className="mx-auto max-w-5xl px-8 pt-8">
        <div
          className="flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: 'rgba(28,26,23,.35)' }}
        >
          <span className="font-display text-lg italic" style={{ color: GREEN }}>
            Flowsha — a field guide
          </span>
          <nav
            className="hidden gap-6 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex"
            style={{ color: 'rgba(28,26,23,.6)' }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* Plate I — the specimen */}
      <section className="mx-auto max-w-5xl px-8 py-12">
        <div className="border p-8" style={{ borderColor: 'rgba(28,26,23,.3)' }}>
          <div className="flex justify-center">
            <img src={LOGO} alt="Flowsha" width={670} height={896} className="h-[44vh] w-auto" />
          </div>
          <div
            className="mt-8 grid gap-4 border-t pt-5 sm:grid-cols-[1fr_auto]"
            style={{ borderColor: 'rgba(28,26,23,.3)' }}
          >
            <div>
              <p
                className="font-display text-[clamp(1.5rem,4vw,2.4rem)] italic leading-tight"
                style={{ color: INK }}
              >
                Homo circulus flowsha
              </p>
              <p
                className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: 'rgba(28,26,23,.65)' }}
              >
                Common name: hooper · Habitat: {siteConfig.areaServed}
              </p>
            </div>
            <p
              className="font-mono text-[10px] uppercase leading-loose tracking-[0.18em]"
              style={{ color: 'rgba(28,26,23,.55)' }}
            >
              Plate I<br />
              Coll. Osha
              <br />
              Hoop · tape · motion
            </p>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mx-auto max-w-5xl px-8 pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: ORANGE }}>
          Notes on the collector
        </p>
        <div className="mt-4 gap-8 md:columns-2">
          <p className="mb-4 text-[15px] leading-[1.8]" style={{ color: 'rgba(28,26,23,.85)' }}>
            {aboutParagraphs[0]}
          </p>
          <p className="text-[15px] leading-[1.8]" style={{ color: 'rgba(28,26,23,.85)' }}>
            {aboutParagraphs[2]}
          </p>
        </div>
      </section>

      {/* Specimen plates */}
      <section className="mx-auto max-w-5xl px-8 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {plates.map(([latin, title, blurb, img]) => (
            <figure
              key={latin}
              className="border p-4"
              style={{ borderColor: 'rgba(28,26,23,.28)' }}
            >
              <img src={g(img)} alt={alt(img)} className="h-40 w-full object-cover" />
              <figcaption className="mt-3">
                <p className="font-display italic" style={{ color: GREEN }}>
                  {latin}
                </p>
                <p
                  className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: INK }}
                >
                  {title}
                </p>
                <p
                  className="mt-2 text-[13px] leading-relaxed"
                  style={{ color: 'rgba(28,26,23,.72)' }}
                >
                  {blurb}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-8 pb-12 text-center">
        <blockquote
          className="font-display text-[clamp(1.3rem,3.4vw,2rem)] italic leading-snug"
          style={{ color: INK }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          Field note — {T0.name}
        </p>
      </section>

      <footer
        className="mx-auto max-w-5xl border-t px-8 py-8"
        style={{ borderColor: 'rgba(28,26,23,.3)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <p className="font-display text-lg italic" style={{ color: GREEN }}>
              {siteConfig.name}
            </p>
          </div>
          <p
            className="font-mono text-[10px] uppercase leading-loose tracking-[0.18em]"
            style={{ color: 'rgba(28,26,23,.6)' }}
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

// ═══ 44 — Terminal ═════════════════════════════════════════════════════════════════════
// Everything monospace, ASCII rules, offerings as commands. Unexpected for a hooping site,
// which is exactly why it is memorable.
export function Art44() {
  const P = ({ children }: { children: React.ReactNode }) => (
    <span style={{ color: '#5fd6a8' }}>{children}</span>
  );
  return (
    <Frame id="44" bg="#0c0f0d">
      <div
        className="mx-auto max-w-5xl px-6 py-8 font-mono text-[13px] leading-relaxed"
        style={{ color: '#c9e6d6' }}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span>
            <P>osha@flowsha</P>:<span style={{ color: ORANGE }}>~</span>$ whoami
          </span>
          <span className="hidden gap-4 sm:flex" style={{ color: 'rgba(201,230,214,.55)' }}>
            {NAV.map((n) => (
              <span key={n}>./{n.toLowerCase().replace(' ', '-')}</span>
            ))}
          </span>
        </div>

        <section className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <pre
              className="whitespace-pre-wrap text-[clamp(1.1rem,3.6vw,2.1rem)] leading-[1.15]"
              style={{ color: CREAM }}
            >{`flow · play · connect`}</pre>
            <p className="mt-5 max-w-md" style={{ color: 'rgba(201,230,214,.75)' }}>
              &gt; hula hoop workshops, fire &amp; LED performance, and handmade hoops.
              <br />
              &gt; location: {siteConfig.areaServed}
              <br />
              &gt; status: <span style={{ color: '#5fd6a8' }}>taking bookings</span>
            </p>
            <span
              className="mt-7 inline-block border px-6 py-2.5 text-[12px] uppercase tracking-[0.16em]"
              style={{ borderColor: '#5fd6a8', color: '#5fd6a8' }}
            >
              $ book --workshop
            </span>
          </div>
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="h-[42vh] w-auto justify-self-center"
          />
        </section>

        <p
          className="mt-12 border-b border-white/10 pb-2"
          style={{ color: 'rgba(201,230,214,.5)' }}
        >
          <P>osha@flowsha</P>:<span style={{ color: ORANGE }}>~</span>$ ls ./offerings
        </p>
        <div className="mt-4 space-y-3">
          {OFFERS.map((o, i) => (
            <div key={o.title} className="grid gap-1 sm:grid-cols-[auto_1fr]">
              <span className="sm:w-40" style={{ color: ORANGE }}>
                drwxr-xr-x {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span style={{ color: CREAM }}>{o.title.toLowerCase().replace(/ /g, '-')}/</span>
                <span className="block" style={{ color: 'rgba(201,230,214,.7)' }}>
                  # {o.blurb}
                </span>
              </span>
            </div>
          ))}
        </div>

        <p
          className="mt-12 border-b border-white/10 pb-2"
          style={{ color: 'rgba(201,230,214,.5)' }}
        >
          <P>osha@flowsha</P>:<span style={{ color: ORANGE }}>~</span>$ cat about.txt
        </p>
        <p className="mt-4 max-w-3xl" style={{ color: 'rgba(201,230,214,.78)' }}>
          {aboutParagraphs[0]}
        </p>

        <p
          className="mt-12 border-b border-white/10 pb-2"
          style={{ color: 'rgba(201,230,214,.5)' }}
        >
          <P>osha@flowsha</P>:<span style={{ color: ORANGE }}>~</span>$ open ./gallery
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[1, 5, 2, 9].map((n) => (
            <img key={n} src={g(n)} alt={alt(n)} className="h-32 w-full object-cover opacity-90" />
          ))}
        </div>

        <p
          className="mt-12 border-b border-white/10 pb-2"
          style={{ color: 'rgba(201,230,214,.5)' }}
        >
          <P>osha@flowsha</P>:<span style={{ color: ORANGE }}>~</span>$ tail -1 reviews.log
        </p>
        <p className="mt-4 max-w-3xl" style={{ color: CREAM }}>
          [{T0.name}] “{T0.quote.split('.')[0]}.”
        </p>

        <footer className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-14 w-auto" />
            <span style={{ color: CREAM }}>{siteConfig.name}</span>
          </div>
          <span style={{ color: 'rgba(201,230,214,.5)' }}>{siteConfig.email}</span>
        </footer>
      </div>
    </Frame>
  );
}

// ═══ 45 — Risograph duotone ════════════════════════════════════════════════════════════
// Two inks only — brand green and brand orange — overprinting on paper, with halftone
// texture and deliberate misregistration. Indie-press, and it costs no new colours.
export function Art45() {
  // Halftone dots as a repeating radial-gradient; the grain is a second, offset layer.
  const dots = (colour: string, size: number) => ({
    backgroundImage: `radial-gradient(${colour} 32%, transparent 33%)`,
    backgroundSize: `${size}px ${size}px`,
  });
  return (
    <Frame id="45" bg="#efe9da">
      <header className="border-b-4" style={{ borderColor: GREEN }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span
            className="font-display text-xl uppercase tracking-[0.18em]"
            style={{ color: GREEN }}
          >
            Flowsha
          </span>
          <nav
            className="hidden gap-5 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex"
            style={{ color: ORANGE }}
          >
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 py-12">
        <div aria-hidden className="absolute inset-0 opacity-[0.18]" style={dots(GREEN, 7)} />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div className="relative flex justify-center">
            {/* Misregistered orange plate, then the green plate on top. */}
            <img
              src={LOGO}
              alt=""
              aria-hidden
              width={670}
              height={896}
              className="absolute h-[44vh] w-auto -translate-x-2 translate-y-1.5 opacity-70"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(56%) sepia(48%) saturate(900%) hue-rotate(340deg)',
              }}
            />
            <img
              src={LOGO}
              alt="Flowsha"
              width={670}
              height={896}
              className="relative h-[44vh] w-auto mix-blend-multiply"
            />
          </div>
          <div>
            <h1
              className="font-display text-[clamp(2.4rem,7vw,4.6rem)] uppercase leading-[0.86]"
              style={{ color: GREEN }}
            >
              Two
              <br />
              <span style={{ color: ORANGE }}>inks.</span>
              <br />
              One hoop.
            </h1>
            <p
              className="mt-6 max-w-sm text-[15px] leading-relaxed"
              style={{ color: 'rgba(28,26,23,.82)' }}
            >
              Hoop classes, fire &amp; LED shows, and hoops made by hand — printed, taped and spun
              in {siteConfig.areaServed}.
            </p>
            <span
              className="mt-7 inline-block px-7 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ backgroundColor: ORANGE, color: '#efe9da' }}
            >
              Book a workshop
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className="relative overflow-hidden p-5"
              style={{
                backgroundColor: i === 1 ? GREEN : 'transparent',
                border: `3px solid ${i === 1 ? GREEN : ORANGE}`,
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.14]"
                style={dots(i === 1 ? '#efe9da' : GREEN, 6)}
              />
              <h3
                className="relative font-display text-xl uppercase tracking-tight"
                style={{ color: i === 1 ? '#efe9da' : GREEN }}
              >
                {o.title}
              </h3>
              <p
                className="relative mt-2 text-[13.5px] leading-relaxed"
                style={{ color: i === 1 ? 'rgba(239,233,218,.85)' : 'rgba(28,26,23,.78)' }}
              >
                {o.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-12" style={{ backgroundColor: GREEN }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.16]" style={dots('#efe9da', 8)} />
        <div className="relative mx-auto max-w-4xl px-6">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.26em]"
            style={{ color: ORANGE }}
          >
            Meet Osha
          </p>
          <p className="mt-4 text-[15px] leading-[1.8]" style={{ color: 'rgba(239,233,218,.9)' }}>
            {aboutParagraphs[0]}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 5, 2, 9].map((n) => (
            <img
              key={n}
              src={g(n)}
              alt={alt(n)}
              className="h-36 w-full object-cover mix-blend-multiply grayscale-[0.35]"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14 text-center">
        <blockquote
          className="font-display text-[clamp(1.3rem,3.6vw,2.2rem)] uppercase leading-tight"
          style={{ color: GREEN }}
        >
          “{T0.quote.split('.')[0]}.”
        </blockquote>
        <p
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          {T0.name}
        </p>
      </section>

      <footer className="border-t-4" style={{ borderColor: ORANGE }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-5 px-6 py-8">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-16 w-auto" />
            <span
              className="font-display text-xl uppercase tracking-[0.16em]"
              style={{ color: GREEN }}
            >
              {siteConfig.name}
            </span>
          </div>
          <p
            className="font-mono text-[10px] uppercase leading-loose tracking-[0.2em]"
            style={{ color: ORANGE }}
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
