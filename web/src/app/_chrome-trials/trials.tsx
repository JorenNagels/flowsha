/* eslint-disable @next/next/no-img-element */
// Internal chrome trials — NOT public pages. All six answer one problem: the logo is a
// green figure with an orange hoop, and the site's canvas is forest-dark, so the figure
// disappears into it.
//
// Rejected already: repainting the figure cream (the industry-standard "knockout"), a
// cream plate behind it, a cream halo, flipping the chrome to cream, a fading header,
// dropping the mark for a wordmark, and swapping it for the spiral sun. The brief now is
// the **full figure, in its own two colours, unaltered**.
//
// That leaves one lever: the background. Every option here changes what sits behind the
// logo, never the logo. Contrast is the constraint — the green figure is #4c7252
// (relative luminance 0.142) and a graphic needs 3:1, so any chrome behind it has to sit
// at or below ~0.014 luminance. On the current forest-dark it's 1.6:1, which is the bug.
// Each colour below was picked to clear 3:1; the measured ratio is noted with it.
//
// Live at /1 … /6. Same throwaway-prototype rules as /styles: plain <img>, inline copy,
// noindex, no SEO concerns. Once a direction is picked it gets rebuilt into the real
// Nav/Footer/CtaButton and this folder plus the /1…/6 routes get deleted.

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Switcher } from './registry';
import { heroImage, galleryImages, navLinks } from '@/lib/data';
import { siteConfig } from '@/lib/site';

// Plain <img> srcs aren't rewritten with basePath by Next, so prepend it by hand or the
// images 404 on the staging preview, which is served under a subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');

// Candidate backgrounds, with measured contrast against the logo's green figure.
const PLUM = '#201230'; // deep aubergine — 3.2:1
const PLUM_CARD = '#33204a'; // lifted plum, for cards on a purple canvas
const VIOLET = '#1b1026'; // deeper violet, for whole-page use — 3.3:1
const ESPRESSO = '#251a13'; // warm dark brown — 3.1:1
const FOREST_DARK = '#2b402e'; // today's chrome — 1.6:1, the problem

type Trial = {
  id: string;
  name: string;
  blurb: string;
  /** What it would cost to build for real, stated plainly. */
  cost: string;
  page: string;
  headerStyle: CSSProperties;
  /** Mark sizing, and whether it hangs out of the header box. */
  markClass: string;
  breakout: boolean;
  heroGrad: string;
  cardsStyle: CSSProperties;
  cardStyle: CSSProperties;
  footerStyle: CSSProperties;
  footerMarkClass: string;
};

const OFFERINGS: [string, string][] = [
  [
    'Classes',
    'Group workshops and private lessons for adults and young people. No experience needed.',
  ],
  ['Performances', 'Hoop acts for festivals, parties, and events — fire and LED.'],
  [
    'Handmade Hoops',
    'Hoops made by hand for every level, from your first beginner hoop to fast dance hoops.',
  ],
];

/** A hero gradient that lands on the page colour, or you get a visible seam. */
const grad = (hex: string) => `linear-gradient(to top, ${hex}, ${hex}99 55%, ${hex}4d)`;
const GREEN_CARD: CSSProperties = {
  backgroundColor: '#38543c',
  border: '1px solid rgba(247,241,227,.10)',
};
const PURPLE_CARD: CSSProperties = {
  backgroundColor: PLUM_CARD,
  border: '1px solid rgba(247,241,227,.10)',
};

export const trials: Trial[] = [
  {
    id: '1',
    name: 'Aubergine chrome',
    blurb:
      'Nav and footer alone go deep aubergine; body and hero stay forest green. The full logo untouched at 3.2:1. Green and orange against purple is a complementary pairing, so the figure reads warmer and louder than it ever did on green.',
    cost: 'Two background values plus one palette token. Nothing else on the site moves.',
    page: FOREST_DARK,
    headerStyle: { backgroundColor: PLUM },
    markClass: 'h-12 w-auto',
    breakout: false,
    heroGrad: grad(FOREST_DARK),
    cardsStyle: { backgroundColor: FOREST_DARK },
    cardStyle: GREEN_CARD,
    footerStyle: { backgroundColor: PLUM },
    footerMarkClass: 'h-20 w-auto',
  },
  {
    id: '2',
    name: 'Purple canvas',
    blurb:
      'Commit to it — the whole page becomes deep violet and forest green stops being the background, becoming an accent instead. The logo is then the only green thing on the page, which is exactly why it stands out. Boldest and most distinctive of the six.',
    cost: 'A real palette change: every bg-forest-dark and bg-forest/40 across all pages, forms, dashboard and 404. Big, but it is a token find-and-replace, not a re-layout.',
    page: VIOLET,
    headerStyle: { backgroundColor: VIOLET },
    markClass: 'h-12 w-auto',
    breakout: false,
    heroGrad: grad(VIOLET),
    cardsStyle: { backgroundColor: VIOLET },
    cardStyle: PURPLE_CARD,
    footerStyle: { backgroundColor: PLUM },
    footerMarkClass: 'h-20 w-auto',
  },
  {
    id: '3',
    name: 'Oversized breakout',
    blurb:
      'Keep the green chrome exactly as it is and solve it with scale rather than colour. The figure runs at roughly double size and breaks out of the header down into the hero, so it reads as an illustration instead of an icon. Low contrast matters far less at this size.',
    cost: 'Nav and Footer, plus a taller header and an overflow fix. Zero colour changes — the palette you have today survives untouched.',
    page: FOREST_DARK,
    headerStyle: { backgroundColor: FOREST_DARK },
    markClass: 'h-[108px] w-auto',
    breakout: true,
    heroGrad: grad(FOREST_DARK),
    cardsStyle: { backgroundColor: FOREST_DARK },
    cardStyle: GREEN_CARD,
    footerStyle: { backgroundColor: FOREST_DARK },
    footerMarkClass: 'h-28 w-auto',
  },
  {
    id: '4',
    name: 'Espresso chrome',
    blurb:
      'Warm dark brown rather than purple — a deeper relative of the clay already in the palette. 3.1:1, and it makes the orange hoop glow. Stays in the earthy register the brand brief asks for, where purple is a genuine departure from it.',
    cost: 'Two background values plus one palette token — the same size of change as option 1.',
    page: FOREST_DARK,
    headerStyle: { backgroundColor: ESPRESSO },
    markClass: 'h-12 w-auto',
    breakout: false,
    heroGrad: grad(FOREST_DARK),
    cardsStyle: { backgroundColor: FOREST_DARK },
    cardStyle: GREEN_CARD,
    footerStyle: { backgroundColor: ESPRESSO },
    footerMarkClass: 'h-20 w-auto',
  },
  {
    id: '5',
    name: 'Gradient chrome',
    blurb:
      'The header runs left to right from aubergine into the current forest green. The logo sits on the dark purple end where it has contrast; the nav links stay on familiar green. A colour transition rather than a container, so nothing frames the mark.',
    cost: 'Nav and Footer only. The right-hand end has to stay dark enough for the nav links, so the gradient cannot travel far.',
    page: FOREST_DARK,
    headerStyle: {
      backgroundImage: `linear-gradient(100deg, ${PLUM} 0%, ${PLUM} 22%, ${FOREST_DARK} 62%)`,
    },
    markClass: 'h-12 w-auto',
    breakout: false,
    heroGrad: grad(FOREST_DARK),
    cardsStyle: { backgroundColor: FOREST_DARK },
    cardStyle: GREEN_CARD,
    footerStyle: {
      backgroundImage: `linear-gradient(100deg, ${PLUM} 0%, ${PLUM} 22%, ${FOREST_DARK} 62%)`,
    },
    footerMarkClass: 'h-20 w-auto',
  },
  {
    id: '6',
    name: 'Purple canvas + breakout',
    blurb:
      'The two strongest ideas together: a violet canvas so the logo is the only green on the page, and the figure at double size breaking out of the header. The most confident the logo looks anywhere in these trials.',
    cost: 'The palette change from option 2 plus the header work from option 3 — the most work of the six, and the most distinctive result.',
    page: VIOLET,
    headerStyle: { backgroundColor: VIOLET },
    markClass: 'h-[108px] w-auto',
    breakout: true,
    heroGrad: grad(VIOLET),
    cardsStyle: { backgroundColor: VIOLET },
    cardStyle: PURPLE_CARD,
    footerStyle: { backgroundColor: PLUM },
    footerMarkClass: 'h-28 w-auto',
  },
];

function Mark({ className }: { className: string }) {
  return <img src={LOGO} alt="" aria-hidden width={670} height={896} className={className} />;
}

export default function ChromeTrial({ id }: { id: string }) {
  const t = trials.find((v) => v.id === id);
  if (!t) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.page }}>
      <Switcher current={id} />

      {/* z-20 keeps a breakout mark above the hero it hangs over. */}
      <header className="relative z-20 border-b border-cream/10" style={t.headerStyle}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
          <Link href={`/${id}/`} className="group inline-flex items-center gap-3">
            <Mark
              className={`${t.markClass} ${t.breakout ? '-mb-10' : ''} transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105`}
            />
            <span className="font-display text-xl tracking-wide text-cream">{siteConfig.name}</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <span key={link.href} className="text-sm font-semibold text-cream/80">
                {link.label}
              </span>
            ))}
            <span className="rounded-full bg-terracotta-light px-5 py-2 text-sm font-semibold text-forest-dark">
              Book a workshop
            </span>
          </nav>
        </div>
      </header>

      {/* Hero. `isolate` matters: the real Hero relies on the <body> background sitting
          behind its -z-10 photo. Here everything is wrapped in a coloured div, which would
          swallow it — so the hero gets its own stacking context instead. */}
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-6 sm:px-8">
        <img
          src={asset(heroImage)}
          alt="Osha of Flowsha spinning hoops in a colourfully lit studio"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0" style={{ backgroundImage: t.heroGrad }} />
        <div className="pointer-events-none absolute -right-10 top-16 h-72 w-72 animate-float rounded-full bg-terracotta/20 blur-3xl" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
            {siteConfig.offerings}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] text-cream drop-shadow-sm">
            flow <span className="text-terracotta">•</span> play{' '}
            <span className="text-terracotta">•</span> connect
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream/80">
            Hula hoop workshops, performances, and handmade hoops in Southampton.
          </p>
          <span className="mt-9 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
            Book a workshop
          </span>
        </div>
      </section>

      {/* Offerings */}
      <section className="px-6 py-16 sm:px-8" style={t.cardsStyle}>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {OFFERINGS.map(([title, blurb], i) => (
            <div key={title} className="flex flex-col rounded-3xl p-7" style={t.cardStyle}>
              <img
                src={asset(galleryImages[i + 1].src)}
                alt={galleryImages[i + 1].alt}
                className="mb-5 h-40 w-full rounded-2xl object-cover"
              />
              <h3 className="font-display text-xl text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={t.footerStyle}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-3">
              <Mark className={t.footerMarkClass} />
              <div>
                <div className="font-display text-2xl text-cream">{siteConfig.name}</div>
                <div className="font-script text-xl italic text-terracotta-light">
                  {siteConfig.tagline}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-cream/70">
              {siteConfig.offerings}
            </p>
          </div>
          <nav className="md:justify-self-center">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-light">
              Explore
            </h2>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href} className="text-cream/80">
                  {link.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:justify-self-end">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-light">
              Find me
            </h2>
            <p className="text-cream/80">{siteConfig.email}</p>
            <p className="mt-1 text-sm text-cream/80">Based in {siteConfig.areaServed}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
