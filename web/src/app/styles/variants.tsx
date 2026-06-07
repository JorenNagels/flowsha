/* eslint-disable @next/next/no-img-element */
// Homepage style explorations for Flowsha. Each variant is a complete, self-contained
// homepage rendered in a distinct personality — all share the brand's earthy palette
// (cream / sand / forest / sage / clay / terracotta / mustard) but lean on it with
// different weights, contrast and mood. Click through them via the toolbar on /styles.
//
// These are throwaway prototypes for picking a direction: plain <img>, inline copy,
// no SEO concerns. The chosen look gets rebuilt into the real components afterwards.

import { testimonials, galleryImages, aboutParagraphs } from '@/lib/data';
import { siteConfig } from '@/lib/site';

// These variants use plain <img> with string srcs, which Next.js does NOT rewrite
// with basePath (unlike <ExportedImage>/static imports). On GitHub Pages the site is
// served under /flowsha, so we must prepend the basePath manually or the images 404.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const g = (i: number) => `${basePath}${galleryImages[i].src}`;

const offerings = [
  {
    title: 'Classes',
    blurb:
      'Group workshops and private lessons for adults and young people. No experience or coordination needed — just turn up curious.',
    href: '/workshops/',
    cta: 'Book a workshop',
    img: g(1),
  },
  {
    title: 'Performances',
    blurb: 'Hoop acts for festivals, parties, and events.',
    href: '/performances/',
    cta: 'Performance enquiries',
    img: g(5),
  },
  {
    title: 'Handmade Hoops',
    blurb:
      'Hoops made by hand for every level — from your first beginner hoop to fast dance hoops. Plus accessories and re-taping.',
    href: '/shop/',
    cta: 'Shop hoops',
    img: g(2),
  },
];

const reviews = testimonials.slice(0, 3);

// ---------------------------------------------------------------------------
// 1 — Editorial Calm
// Magazine restraint: thin rules, generous whitespace, serif headlines, clay on
// cream. The "grown-up, considered" end of the palette.
// ---------------------------------------------------------------------------
function EditorialCalm() {
  return (
    <div className="bg-cream text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-clay/20 px-6 py-6">
        <span className="font-display text-2xl tracking-tight text-forest-dark">Flowsha</span>
        <nav className="hidden gap-8 text-sm font-medium text-ink/70 sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
        </nav>
        <span className="rounded-full border border-clay/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-clay">
          Contact
        </span>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            {siteConfig.offerings}
          </p>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] text-forest-dark">
            Find your flow.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            Hula hoop workshops, performances and handmade hoops in Southampton — relaxed,
            beginner-friendly, and full of curiosity.
          </p>
          <div className="mt-9 flex gap-4">
            <span className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-cream">
              Book a workshop
            </span>
            <span className="rounded-full border border-clay/40 px-7 py-3 text-sm font-semibold text-clay">
              Shop hoops
            </span>
          </div>
        </div>
        <div className="relative">
          <img src={g(0)} alt="" className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-mustard px-6 py-4 font-display text-xl text-forest-dark shadow-lg">
            est. 2020
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl border-t border-clay/20 px-6 py-20">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-3">
          {offerings.map((o, i) => (
            <div key={o.title}>
              <p className="font-display text-5xl text-clay/30">0{i + 1}</p>
              <h2 className="mt-3 font-display text-2xl text-forest-dark">{o.title}</h2>
              <p className="mt-3 text-ink/70">{o.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-terracotta">{o.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sage">
              Meet your guide
            </p>
            <h2 className="font-display text-4xl text-forest-dark">Hi, I’m Osha</h2>
            <p className="mt-5 text-ink/75">{aboutParagraphs[0]}</p>
          </div>
          <img src={g(8)} alt="" className="aspect-square w-full rounded-[2rem] object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {reviews.map((t) => (
            <figure key={t.name} className="border-l-2 border-mustard pl-5">
              <blockquote className="font-display text-lg italic leading-relaxed text-forest-dark">
                “{t.quote.slice(0, 120)}…”
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold uppercase tracking-widest text-clay">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-t border-clay/20 px-6 py-20 text-center">
        <h2 className="font-display text-4xl text-forest-dark">Ready to find your flow?</h2>
        <span className="mt-7 inline-block rounded-full bg-terracotta px-8 py-3 text-sm font-semibold text-cream">
          Get in touch
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2 — Bold Terracotta
// High-contrast confidence: full-bleed terracotta blocks, chunky type, cream
// reversed out. The loudest, most commercial reading of the palette.
// ---------------------------------------------------------------------------
function BoldTerracotta() {
  return (
    <div className="bg-cream text-ink">
      <header className="flex items-center justify-between bg-terracotta px-6 py-5 text-cream">
        <span className="font-display text-2xl">Flowsha</span>
        <nav className="hidden gap-7 text-sm font-bold sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="bg-terracotta px-6 pb-24 pt-10 text-cream">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[clamp(3rem,11vw,8rem)] font-semibold leading-[0.85]">
            FIND
            <br />
            YOUR <span className="text-mustard">FLOW</span>
          </h1>
          <div className="mt-10 grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <p className="max-w-lg text-xl leading-relaxed text-cream/90">
              Hula hoop workshops, performances & handmade hoops in Southampton. Relaxed,
              beginner-friendly, no experience required.
            </p>
            <span className="inline-block rounded-full bg-cream px-9 py-4 text-base font-bold text-terracotta">
              Book a workshop →
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {offerings.map((o, i) => (
            <div
              key={o.title}
              className={`rounded-3xl p-8 ${
                i === 1 ? 'bg-forest text-cream' : 'bg-sand text-ink'
              }`}
            >
              <h2 className="font-display text-3xl">{o.title}</h2>
              <p className={`mt-3 ${i === 1 ? 'text-cream/85' : 'text-ink/75'}`}>{o.blurb}</p>
              <p
                className={`mt-5 text-sm font-bold ${i === 1 ? 'text-mustard' : 'text-terracotta'}`}
              >
                {o.cta} →
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-2">
        <img src={g(0)} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" />
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-terracotta">
            Meet your guide
          </p>
          <h2 className="mt-2 font-display text-5xl text-forest-dark">Hi, I’m Osha</h2>
          <p className="mt-5 text-lg text-ink/75">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {reviews.map((t) => (
            <div key={t.name}>
              <p className="font-display text-5xl text-mustard">“</p>
              <p className="text-cream/85">{t.quote.slice(0, 130)}…</p>
              <p className="mt-3 font-bold">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mustard px-6 py-20 text-center text-forest-dark">
        <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold">
          Ready to play?
        </h2>
        <span className="mt-7 inline-block rounded-full bg-forest-dark px-10 py-4 text-base font-bold text-cream">
          Get in touch
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3 — Groovy 70s  (playful / explorer)
// Retro flower-power: mustard + terracotta, arched type, spinning hoops, sticker
// badges, rounded everything. Warm and unmistakably fun.
// ---------------------------------------------------------------------------
function Groovy70s() {
  return (
    <div className="bg-mustard/30 text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="rounded-full bg-terracotta px-5 py-2 font-display text-xl text-cream">
          Flowsha
        </span>
        <nav className="hidden gap-2 text-sm font-bold text-forest-dark sm:flex">
          {['About', 'Workshops', 'Shows', 'Shop', 'Hi!'].map((n) => (
            <span key={n} className="rounded-full bg-cream px-4 py-2">
              {n}
            </span>
          ))}
        </nav>
      </header>

      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="fv-spin pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full border-[16px] border-dashed border-terracotta/40" />
        <div className="fv-spin pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full border-[14px] border-dotted border-forest/40" />
        <p className="font-script text-3xl text-terracotta">welcome to</p>
        <h1 className="mx-auto max-w-3xl font-display text-[clamp(3rem,10vw,7rem)] font-semibold uppercase leading-[0.85] text-forest-dark">
          Find your groove
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-ink/75">
          Hula hoop classes, far-out performances & handmade hoops. Come play, flow & connect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-terracotta px-8 py-3 font-bold text-cream shadow-[4px_4px_0_0_#3f5a3a]">
            Book a class
          </span>
          <span className="rounded-full bg-forest px-8 py-3 font-bold text-cream shadow-[4px_4px_0_0_#d2703a]">
            Shop hoops
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {offerings.map((o, i) => {
            const tones = ['bg-terracotta', 'bg-forest', 'bg-clay'];
            return (
              <div
                key={o.title}
                className={`rounded-[2.5rem] ${tones[i]} p-8 text-cream`}
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-2xl">
                  {['🌀', '🔥', '⭕'][i]}
                </div>
                <h2 className="font-display text-2xl">{o.title}</h2>
                <p className="mt-2 text-cream/85">{o.blurb}</p>
                <p className="mt-4 font-bold text-mustard">{o.cta} →</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 rounded-[3rem] bg-cream p-10 md:grid-cols-2">
          <img
            src={g(0)}
            alt=""
            className="aspect-square w-full rounded-full object-cover ring-8 ring-mustard"
          />
          <div>
            <p className="font-script text-3xl text-terracotta">hey, I’m</p>
            <h2 className="font-display text-5xl uppercase text-forest-dark">Osha</h2>
            <p className="mt-4 text-ink/75">{aboutParagraphs[0]}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto pb-2">
          {reviews.map((t, i) => (
            <div
              key={t.name}
              className="min-w-[260px] flex-1 rounded-[2rem] bg-cream p-6"
              style={{ transform: `rotate(${i % 2 ? -1 : 1}deg)` }}
            >
              <p className="text-ink/80">“{t.quote.slice(0, 110)}…”</p>
              <p className="mt-3 font-script text-2xl text-terracotta">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-16 text-center text-cream">
        <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase">Let’s flow</h2>
        <span className="mt-6 inline-block rounded-full bg-mustard px-10 py-4 font-bold text-forest-dark">
          Say hello →
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4 — Zen Minimal
// Almost nothing but air: sage + cream, hairline rules, small type, one calm
// image. The wellness / retreat reading of the brand.
// ---------------------------------------------------------------------------
function ZenMinimal() {
  return (
    <div className="bg-cream text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <span className="font-display text-lg tracking-[0.2em] text-forest-dark">FLOWSHA</span>
        <nav className="flex gap-6 text-xs font-medium uppercase tracking-widest text-sage">
          <span>Work</span>
          <span>Shop</span>
          <span>Hello</span>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-sage">Hula hoop · Southampton</p>
        <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[1.05] text-forest-dark">
          Find your flow,
          <br />
          one slow circle
          <br />
          at a time.
        </h1>
        <div className="mx-auto my-12 h-px w-16 bg-clay/30" />
        <p className="mx-auto max-w-md leading-loose text-ink/65">
          Relaxed, beginner-friendly workshops, gentle performances and handmade hoops. No
          experience, no pressure — just curiosity.
        </p>
        <span className="mt-10 inline-block border-b border-forest pb-1 text-sm font-medium tracking-widest text-forest">
          BOOK A WORKSHOP
        </span>
      </section>

      <section className="mx-auto max-w-4xl px-6">
        <img src={g(0)} alt="" className="aspect-[16/9] w-full object-cover" />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        {offerings.map((o, i) => (
          <div
            key={o.title}
            className="flex items-baseline justify-between border-b border-clay/15 py-8"
          >
            <div>
              <h2 className="font-display text-2xl text-forest-dark">{o.title}</h2>
              <p className="mt-2 max-w-md text-sm text-ink/60">{o.blurb}</p>
            </div>
            <span className="text-xs uppercase tracking-widest text-sage">0{i + 1}</span>
          </div>
        ))}
      </section>

      <section className="bg-sage/15 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-sage">Meet your guide</p>
          <h2 className="mt-4 font-display text-3xl font-normal text-forest-dark">Osha</h2>
          <p className="mt-6 leading-loose text-ink/65">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl font-normal italic leading-relaxed text-forest-dark">
          “{reviews[0].quote.slice(0, 140)}…”
        </p>
        <p className="mt-6 text-xs uppercase tracking-widest text-sage">— {reviews[0].name}</p>
      </section>

      <section className="px-6 pb-28 text-center">
        <h2 className="font-display text-3xl font-normal text-forest-dark">
          Ready to begin?
        </h2>
        <span className="mt-6 inline-block border-b border-forest pb-1 text-sm tracking-widest text-forest">
          GET IN TOUCH
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5 — Organic Curves
// Soft and bodily: blob shapes, overlapping rounded sections, sage→forest, big
// rounded photos. The "movement / flow" reading made literal.
// ---------------------------------------------------------------------------
function OrganicCurves() {
  const blob = '60% 40% 55% 45% / 50% 55% 45% 50%';
  return (
    <div className="bg-sand text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-forest-dark">flowsha</span>
        <nav className="hidden gap-7 text-sm font-semibold text-sage sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div className="relative z-10">
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] text-forest-dark">
            Find your <span className="font-script italic text-terracotta">flow</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/75">
            Hula hoop workshops, performances and handmade hoops — relaxed, playful and made for
            every body.
          </p>
          <span className="mt-8 inline-block rounded-full bg-forest px-8 py-3.5 font-semibold text-cream">
            Come play →
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute inset-0 scale-110 bg-mustard/50"
            style={{ borderRadius: blob }}
          />
          <img
            src={g(0)}
            alt=""
            className="relative aspect-square w-full object-cover"
            style={{ borderRadius: blob }}
          />
        </div>
      </section>

      <section className="relative mt-10 bg-sage/25 px-6 py-24">
        <div
          className="absolute -top-10 left-0 h-20 w-full bg-sage/25"
          style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }}
        />
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {offerings.map((o) => (
            <div key={o.title} className="rounded-[2.5rem] bg-cream p-8 text-center">
              <img
                src={o.img}
                alt=""
                className="mx-auto mb-5 aspect-square w-28 object-cover"
                style={{ borderRadius: blob }}
              />
              <h2 className="font-display text-2xl text-forest-dark">{o.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{o.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-terracotta">{o.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_1.1fr]">
        <img
          src={g(8)}
          alt=""
          className="aspect-[4/5] w-full object-cover"
          style={{ borderRadius: '55% 45% 60% 40% / 45% 50% 50% 55%' }}
        />
        <div>
          <p className="font-script text-3xl text-terracotta">hi, I’m</p>
          <h2 className="font-display text-5xl text-forest-dark">Osha</h2>
          <p className="mt-5 text-ink/75">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="bg-forest px-6 py-24 text-cream">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl italic leading-relaxed">
            “{reviews[0].quote.slice(0, 150)}…”
          </p>
          <p className="mt-5 font-script text-2xl text-mustard">{reviews[0].name}</p>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-4xl text-forest-dark">Ready to find your flow?</h2>
        <span className="mt-6 inline-block rounded-full bg-terracotta px-9 py-3.5 font-semibold text-cream">
          Get in touch
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6 — After Dark
// Moody and premium: forest-dark canvas, cream text, mustard glow. Built for the
// LED & fire performance side of the business.
// ---------------------------------------------------------------------------
function AfterDark() {
  return (
    <div className="bg-forest-dark text-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-cream">Flowsha</span>
        <nav className="hidden gap-7 text-sm font-medium text-cream/70 sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
        </nav>
        <span className="rounded-full border border-mustard/60 px-4 py-1.5 text-xs font-semibold text-mustard">
          Contact
        </span>
      </header>

      <section className="relative flex min-h-[78vh] items-center overflow-hidden px-6">
        <img src={g(0)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/60 to-forest-dark/30" />
        <div className="fv-float pointer-events-none absolute right-10 top-20 h-64 w-64 rounded-full bg-mustard/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-mustard">
            {siteConfig.offerings}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-cream">
            Find your <span className="italic text-mustard">flow</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream/80">
            Hula hoop workshops, LED & fire performances, and handmade hoops in Southampton.
          </p>
          <div className="mt-9 flex gap-4">
            <span className="rounded-full bg-mustard px-8 py-3.5 font-semibold text-forest-dark">
              Book a workshop
            </span>
            <span className="rounded-full border border-cream/40 px-8 py-3.5 font-semibold text-cream">
              See performances
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {offerings.map((o) => (
            <div
              key={o.title}
              className="rounded-3xl border border-cream/10 bg-forest/40 p-8 transition-colors hover:border-mustard/50"
            >
              <h2 className="font-display text-2xl text-cream">{o.title}</h2>
              <p className="mt-3 text-cream/70">{o.blurb}</p>
              <p className="mt-5 text-sm font-semibold text-mustard">{o.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 md:grid-cols-2">
        <img
          src={g(8)}
          alt=""
          className="aspect-[4/5] w-full rounded-3xl object-cover ring-1 ring-mustard/30"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-mustard">
            Meet your guide
          </p>
          <h2 className="mt-3 font-display text-5xl text-cream">Hi, I’m Osha</h2>
          <p className="mt-5 text-cream/75">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="border-y border-cream/10 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {reviews.map((t) => (
            <div key={t.name}>
              <p className="text-cream/80">“{t.quote.slice(0, 120)}…”</p>
              <p className="mt-3 text-sm font-semibold tracking-widest text-mustard">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-cream">
          Light up your event.
        </h2>
        <span className="mt-7 inline-block rounded-full bg-mustard px-10 py-4 font-semibold text-forest-dark">
          Enquire now
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7 — Scrapbook  (playful / explorer)
// Handmade craft: taped + rotated photos, handwritten script, doodle borders,
// torn-paper feel. Leans hardest into the "made by hand, made for play" story.
// ---------------------------------------------------------------------------
function Scrapbook() {
  return (
    <div className="bg-cream text-ink [background-image:radial-gradient(theme(colors.clay/10)_1px,transparent_1px)] [background-size:18px_18px]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-script text-4xl text-terracotta">Flowsha</span>
        <nav className="hidden gap-6 text-sm font-bold text-forest-dark underline decoration-mustard decoration-wavy underline-offset-4 sm:flex">
          <span>about</span>
          <span>classes</span>
          <span>shows</span>
          <span>hoops</span>
          <span>hi!</span>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <div>
          <span className="inline-block -rotate-2 rounded bg-mustard px-3 py-1 font-bold uppercase tracking-widest text-forest-dark">
            Southampton · hula hoop
          </span>
          <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] text-forest-dark">
            Find your{' '}
            <span className="font-script italic text-terracotta underline decoration-wavy decoration-mustard">
              flow
            </span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink/75">
            Come play! Workshops, performances & handmade hoops — no experience, no pressure, lots
            of laughs.
          </p>
          <span className="mt-7 inline-block rotate-1 rounded-xl border-2 border-dashed border-forest bg-cream px-7 py-3 font-bold text-forest shadow-[3px_3px_0_0_#d2703a]">
            ✏️ Book a workshop
          </span>
        </div>
        <div className="relative h-[420px]">
          {[g(0), g(2), g(5)].map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="absolute h-56 w-56 border-8 border-white object-cover shadow-xl"
              style={{
                transform: `rotate(${[-6, 5, -3][i]}deg)`,
                top: `${[0, 90, 180][i]}px`,
                left: `${[30, 160, 60][i]}px`,
                zIndex: i,
              }}
            />
          ))}
          <span className="absolute left-24 top-2 z-10 h-6 w-20 rotate-[-8deg] bg-mustard/70" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-script text-4xl text-terracotta">what I do</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {offerings.map((o, i) => (
            <div
              key={o.title}
              className="border-2 border-forest-dark bg-white p-6 shadow-[5px_5px_0_0_#3f5a3a]"
              style={{ transform: `rotate(${[-1.5, 1, -0.5][i]}deg)` }}
            >
              <img src={o.img} alt="" className="mb-4 h-36 w-full border-4 border-white object-cover shadow" />
              <h3 className="font-display text-xl text-forest-dark">{o.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{o.blurb}</p>
              <p className="mt-3 font-bold text-terracotta">{o.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-[auto_1fr]">
        <img
          src={g(8)}
          alt=""
          className="h-64 w-64 -rotate-3 border-8 border-white object-cover shadow-xl"
        />
        <div>
          <p className="font-script text-4xl text-terracotta">hey, I’m Osha!</p>
          <p className="mt-4 text-ink/75">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
          {reviews.map((t, i) => (
            <div
              key={t.name}
              className="max-w-xs bg-mustard/40 p-5 shadow-md"
              style={{ transform: `rotate(${[2, -2, 1][i]}deg)` }}
            >
              <p className="text-sm text-ink/80">“{t.quote.slice(0, 100)}…”</p>
              <p className="mt-2 font-script text-2xl text-terracotta">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="font-display text-4xl text-forest-dark">come hoop with me!</h2>
        <span className="mt-6 inline-block -rotate-1 rounded-xl bg-terracotta px-9 py-4 font-bold text-cream shadow-[4px_4px_0_0_#3f5a3a]">
          say hello →
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8 — Bento Grid
// Modern & structured: asymmetric tiles of mixed sizes and tones, image + copy +
// stat cells packed edge to edge. The "app/startup" reading of the palette.
// ---------------------------------------------------------------------------
function BentoGrid() {
  return (
    <div className="bg-sand text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-forest-dark">Flowsha</span>
        <nav className="hidden gap-7 text-sm font-semibold text-ink/70 sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
        </nav>
        <span className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream">
          Contact
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid auto-rows-[170px] grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-3xl bg-forest p-8 text-cream">
            <p className="text-xs font-semibold uppercase tracking-widest text-mustard">
              {siteConfig.offerings}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]">
              Find your flow.
            </h1>
            <span className="self-start rounded-full bg-mustard px-6 py-2.5 text-sm font-semibold text-forest-dark">
              Book a workshop →
            </span>
          </div>
          <div className="col-span-2 row-span-2 overflow-hidden rounded-3xl">
            <img src={g(0)} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-terracotta p-6 text-cream">
            <p className="font-display text-4xl">100s</p>
            <p className="text-sm text-cream/85">of hoops spun</p>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-mustard p-6 text-forest-dark">
            <p className="font-display text-4xl">5★</p>
            <p className="text-sm">loved by classes</p>
          </div>
          <div className="col-span-2 overflow-hidden rounded-3xl">
            <img src={g(5)} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {offerings.map((o, i) => (
            <div
              key={o.title}
              className={`rounded-3xl p-7 ${
                ['bg-cream', 'bg-clay text-cream', 'bg-cream'][i]
              }`}
            >
              <h2 className="font-display text-2xl">{o.title}</h2>
              <p className={`mt-3 text-sm ${i === 1 ? 'text-cream/80' : 'text-ink/70'}`}>
                {o.blurb}
              </p>
              <p
                className={`mt-4 text-sm font-semibold ${i === 1 ? 'text-mustard' : 'text-terracotta'}`}
              >
                {o.cta} →
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col justify-center rounded-3xl bg-forest p-8 text-cream md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-mustard">
              Meet Osha
            </p>
            <p className="mt-3 text-cream/85">{aboutParagraphs[0].slice(0, 160)}…</p>
          </div>
          {reviews.slice(0, 2).map((t) => (
            <div key={t.name} className="rounded-3xl bg-cream p-7">
              <p className="text-sm text-ink/75">“{t.quote.slice(0, 130)}…”</p>
              <p className="mt-3 text-sm font-semibold text-terracotta">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-terracotta px-6 py-14 text-center text-cream">
          <h2 className="font-display text-4xl">Ready to find your flow?</h2>
          <span className="rounded-full bg-cream px-9 py-3.5 font-semibold text-terracotta">
            Get in touch
          </span>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9 — Sunset Gradient
// Warm and welcoming: cream→mustard→terracotta gradients, soft glows, friendly
// rounded cards. The "feel-good, approachable" reading.
// ---------------------------------------------------------------------------
function SunsetGradient() {
  return (
    <div className="bg-gradient-to-b from-cream via-mustard/25 to-terracotta/30 text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-forest-dark">Flowsha</span>
        <nav className="hidden gap-7 text-sm font-semibold text-forest-dark/80 sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="fv-float pointer-events-none absolute left-1/2 top-1/2 -z-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/40 blur-3xl" />
        <div className="relative">
          <p className="font-script text-3xl text-terracotta">welcome to Flowsha</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] text-forest-dark">
            Find your flow
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-ink/75">
            Sunny, relaxed hula hoop workshops, performances and handmade hoops in Southampton. No
            experience needed — just good vibes.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <span className="rounded-full bg-terracotta px-8 py-3.5 font-semibold text-cream shadow-lg shadow-terracotta/30">
              Book a workshop
            </span>
            <span className="rounded-full bg-cream/80 px-8 py-3.5 font-semibold text-forest backdrop-blur">
              Shop hoops
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {offerings.map((o) => (
            <div
              key={o.title}
              className="rounded-[2rem] bg-cream/70 p-8 backdrop-blur transition-transform hover:-translate-y-1"
            >
              <img src={o.img} alt="" className="mb-5 aspect-video w-full rounded-2xl object-cover" />
              <h2 className="font-display text-2xl text-forest-dark">{o.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{o.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-terracotta">{o.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <img src={g(8)} alt="" className="aspect-square w-full rounded-[2.5rem] object-cover shadow-xl" />
        <div>
          <p className="font-script text-3xl text-terracotta">hi, I’m</p>
          <h2 className="font-display text-5xl text-forest-dark">Osha</h2>
          <p className="mt-5 text-ink/75">{aboutParagraphs[0]}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {reviews.map((t) => (
            <div key={t.name} className="rounded-[2rem] bg-cream/70 p-6 backdrop-blur">
              <p className="text-sm text-ink/75">“{t.quote.slice(0, 110)}…”</p>
              <p className="mt-3 font-script text-2xl text-terracotta">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-forest-dark">
          Let’s find your flow together.
        </h2>
        <span className="mt-7 inline-block rounded-full bg-forest px-10 py-4 font-semibold text-cream">
          Get in touch
        </span>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10 — Big Type
// Type as the hero: oversized Fraunces, a scrolling marquee, minimal imagery.
// Confident, design-forward, lets the palette sit in the type itself.
// ---------------------------------------------------------------------------
function BigType() {
  const marquee = 'FIND YOUR FLOW · PLAY · FLOW · CONNECT · ';
  return (
    <div className="bg-cream text-forest-dark">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl">Flowsha</span>
        <nav className="hidden gap-7 text-sm font-semibold sm:flex">
          <span>About</span>
          <span>Workshops</span>
          <span>Performances</span>
          <span>Shop</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="px-6 pt-10">
        <h1 className="font-display text-[clamp(3.5rem,16vw,13rem)] font-semibold leading-[0.82] tracking-tight">
          FIND
          <br />
          YOUR
          <br />
          <span className="text-terracotta">FLOW.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-forest-dark/20 pt-6">
          <p className="max-w-md text-lg text-ink/75">
            Hula hoop workshops, performances and handmade hoops in Southampton. Relaxed,
            beginner-friendly, full of curiosity.
          </p>
          <span className="rounded-full bg-forest-dark px-8 py-3.5 font-semibold text-cream">
            Book a workshop →
          </span>
        </div>
      </section>

      <div className="my-12 overflow-hidden border-y-2 border-forest-dark py-4">
        <div className="fv-marquee flex whitespace-nowrap font-display text-3xl font-semibold uppercase text-terracotta">
          <span>{marquee.repeat(6)}</span>
          <span>{marquee.repeat(6)}</span>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6">
        <img src={g(0)} alt="" className="aspect-[21/9] w-full rounded-3xl object-cover" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        {offerings.map((o, i) => (
          <div
            key={o.title}
            className="group flex items-center justify-between gap-6 border-b border-forest-dark/20 py-8"
          >
            <div className="flex items-baseline gap-6">
              <span className="font-display text-2xl text-clay/40">0{i + 1}</span>
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none transition-colors group-hover:text-terracotta">
                {o.title}
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-ink/70 md:block">{o.blurb}</p>
          </div>
        ))}
      </section>

      <section className="bg-forest-dark px-6 py-24 text-cream">
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-snug">
            “{reviews[0].quote}”
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-mustard">
            — {reviews[0].name}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-none">
          LET’S PLAY.
        </h2>
        <span className="mt-7 inline-block rounded-full bg-terracotta px-10 py-4 font-semibold text-cream">
          Get in touch →
        </span>
      </section>
    </div>
  );
}

export type Variant = {
  id: string;
  name: string;
  vibe: string;
  Component: React.FC;
};

export const variants: Variant[] = [
  { id: 'editorial', name: 'Editorial Calm', vibe: 'Magazine restraint, lots of air', Component: EditorialCalm },
  { id: 'bold', name: 'Bold Terracotta', vibe: 'Loud, high-contrast, commercial', Component: BoldTerracotta },
  { id: 'groovy', name: 'Groovy 70s', vibe: 'Playful retro flower-power', Component: Groovy70s },
  { id: 'zen', name: 'Zen Minimal', vibe: 'Calm, airy, wellness', Component: ZenMinimal },
  { id: 'organic', name: 'Organic Curves', vibe: 'Soft blobs, movement made literal', Component: OrganicCurves },
  { id: 'dark', name: 'After Dark', vibe: 'Moody, premium, LED & fire', Component: AfterDark },
  { id: 'scrapbook', name: 'Scrapbook', vibe: 'Handmade, taped photos, doodles', Component: Scrapbook },
  { id: 'bento', name: 'Bento Grid', vibe: 'Modern asymmetric tiles', Component: BentoGrid },
  { id: 'sunset', name: 'Sunset Gradient', vibe: 'Warm, welcoming, feel-good', Component: SunsetGradient },
  { id: 'bigtype', name: 'Big Type', vibe: 'Type as hero, design-forward', Component: BigType },
];
