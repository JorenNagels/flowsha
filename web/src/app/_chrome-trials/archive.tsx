/* eslint-disable @next/next/no-img-element */
// Trials 15–24: the archive. Every option from the first two rounds, rebuilt so nothing is
// lost when showing the full set. These were each rejected at the time, but they belong in
// the record — several are the industry-standard answers, and it's useful to be able to
// show *why* they were passed over rather than just asserting it.
//
// Two of these (15 and 17) recolour or frame the artwork, which the current brief rules
// out. They're kept as reference, and each one says so in its own toolbar note.

import type { CSSProperties } from 'react';
import { heroImage, galleryImages, navLinks } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { Switcher } from './registry';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');
const SUN = asset('/brand/flowsha-sun.svg');
// Real two-tone knockout (cream figure, orange hoop) rather than a CSS filter, which
// would flatten the hoop to cream and misrepresent the option that was actually rejected.
const KNOCKOUT = asset('/brand/archive-logo-knockout.svg');

const CREAM = '#f7f1e3';
const SAND = '#efe5d1';
const FOREST_DARK = '#2b402e';
const NEAR_BLACK_GREEN = '#101a12';

type Mark = 'figure' | 'plate' | 'halo' | 'sun' | 'none' | 'cream-figure' | 'orange-figure';

type Archive = {
  id: string;
  mark: Mark;
  markSize: string;
  footerMark: Mark;
  footerMarkSize: string;
  headerStyle: CSSProperties;
  /** Gradient headers need the hero pulled up under them. */
  headerExtra?: string;
  heroExtra?: string;
  word: string;
  navLink: string;
  navCta: string;
  page: string;
  heroGrad: string;
  cardsStyle: CSSProperties;
  cardStyle: CSSProperties;
  cardTitle: string;
  cardBody: string;
  footerStyle: CSSProperties;
  footerWord: string;
  footerText: string;
  footerHead: string;
};

const grad = (hex: string) => `linear-gradient(to top, ${hex}, ${hex}99 55%, ${hex}4d)`;

const DARK_NAV = {
  headerStyle: { backgroundColor: FOREST_DARK } as CSSProperties,
  word: 'text-cream',
  navLink: 'text-cream/80',
  navCta: 'bg-terracotta-light text-forest-dark',
};
const LIGHT_NAV = {
  headerStyle: { backgroundColor: CREAM } as CSSProperties,
  word: 'text-forest-dark',
  navLink: 'text-ink/75',
  navCta: 'bg-terracotta-deep text-cream',
};
const DARK_BODY = {
  page: FOREST_DARK,
  heroGrad: grad(FOREST_DARK),
  cardsStyle: { backgroundColor: FOREST_DARK } as CSSProperties,
  cardStyle: {
    backgroundColor: '#38543c',
    border: '1px solid rgba(247,241,227,.10)',
  } as CSSProperties,
  cardTitle: 'text-cream',
  cardBody: 'text-cream/80',
};
const DARK_FOOTER = {
  footerStyle: { backgroundColor: FOREST_DARK } as CSSProperties,
  footerWord: 'text-cream',
  footerText: 'text-cream/80',
  footerHead: 'text-terracotta-light',
};
const LIGHT_FOOTER = {
  footerStyle: { backgroundColor: SAND } as CSSProperties,
  footerWord: 'text-forest-dark',
  footerText: 'text-ink/75',
  footerHead: 'text-terracotta-deep',
};

export const archive: Archive[] = [
  // 15 — Cream knockout: the industry standard, and the first thing rejected.
  {
    id: '15',
    mark: 'cream-figure',
    markSize: 'h-12 w-auto',
    footerMark: 'cream-figure',
    footerMarkSize: 'h-16 w-auto',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
  // 16 — Light chrome: cream nav, sand footer, unframed logo.
  {
    id: '16',
    mark: 'figure',
    markSize: 'h-12 w-auto',
    footerMark: 'figure',
    footerMarkSize: 'h-16 w-auto',
    ...LIGHT_NAV,
    ...DARK_BODY,
    ...LIGHT_FOOTER,
  },
  // 17 — Cream plate.
  {
    id: '17',
    mark: 'plate',
    markSize: 'h-11 w-auto',
    footerMark: 'plate',
    footerMarkSize: 'h-11 w-auto',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
  // 18 — Cream halo.
  {
    id: '18',
    mark: 'halo',
    markSize: 'h-14 w-auto',
    footerMark: 'halo',
    footerMarkSize: 'h-14 w-auto',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
  // 19 — Light-first: the whole canvas flips to cream.
  {
    id: '19',
    mark: 'figure',
    markSize: 'h-12 w-auto',
    footerMark: 'figure',
    footerMarkSize: 'h-16 w-auto',
    ...LIGHT_NAV,
    page: CREAM,
    heroGrad: grad(FOREST_DARK),
    cardsStyle: { backgroundColor: CREAM },
    cardStyle: { backgroundColor: SAND, border: '1px solid rgba(46,42,36,.10)' },
    cardTitle: 'text-forest-dark',
    cardBody: 'text-ink/75',
    ...LIGHT_FOOTER,
  },
  // 20 — Fading header: the cream bar dissolves into the hero.
  {
    id: '20',
    mark: 'figure',
    markSize: 'h-12 w-auto',
    footerMark: 'figure',
    footerMarkSize: 'h-16 w-auto',
    headerStyle: {
      backgroundImage: `linear-gradient(to bottom, ${CREAM} 0%, ${CREAM} 56%, ${CREAM}b3 78%, transparent 100%)`,
      paddingBottom: '2.25rem',
    },
    headerExtra: '-mb-24',
    heroExtra: 'pt-32',
    word: 'text-forest-dark',
    navLink: 'text-ink/80',
    navCta: 'bg-terracotta-deep text-cream',
    ...DARK_BODY,
    ...LIGHT_FOOTER,
  },
  // 21 — Wordmark only.
  {
    id: '21',
    mark: 'none',
    markSize: '',
    footerMark: 'none',
    footerMarkSize: '',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
  // 22 — Sun mark, its own orange.
  {
    id: '22',
    mark: 'sun',
    markSize: 'h-9 w-9',
    footerMark: 'sun',
    footerMarkSize: 'h-12 w-12',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
  // 23 — Near-black green chrome, full figure at 3.3:1.
  {
    id: '23',
    mark: 'figure',
    markSize: 'h-12 w-auto',
    footerMark: 'figure',
    footerMarkSize: 'h-16 w-auto',
    headerStyle: { backgroundColor: NEAR_BLACK_GREEN },
    word: 'text-cream',
    navLink: 'text-cream/80',
    navCta: 'bg-terracotta-light text-forest-dark',
    ...DARK_BODY,
    footerStyle: { backgroundColor: NEAR_BLACK_GREEN },
    footerWord: 'text-cream',
    footerText: 'text-cream/80',
    footerHead: 'text-terracotta-light',
  },
  // 24 — Mono orange figure.
  {
    id: '24',
    mark: 'orange-figure',
    markSize: 'h-12 w-auto',
    footerMark: 'orange-figure',
    footerMarkSize: 'h-16 w-auto',
    ...DARK_NAV,
    ...DARK_BODY,
    ...DARK_FOOTER,
  },
];

// Mono-orange is a CSS filter because it genuinely is a single flat colour, so a filter
// represents it faithfully. Not a shippable brand asset — if it were ever chosen,
// prep-brand.mjs would emit a real single-colour SVG.
const TO_ORANGE =
  'brightness(0) saturate(100%) invert(56%) sepia(48%) saturate(900%) hue-rotate(340deg) brightness(92%) contrast(89%)';

function MarkEl({ kind, size }: { kind: Mark; size: string }) {
  if (kind === 'none') return null;
  if (kind === 'sun') {
    return <img src={SUN} alt="" aria-hidden width={236} height={236} className={size} />;
  }
  if (kind === 'plate') {
    return (
      <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-2xl bg-cream">
        <img src={LOGO} alt="" aria-hidden width={670} height={896} className={size} />
      </span>
    );
  }
  if (kind === 'halo') {
    return (
      <span className="relative grid h-[86px] w-[100px] shrink-0 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(247,241,227,.95) 0%, rgba(247,241,227,.82) 38%, rgba(247,241,227,.35) 62%, rgba(247,241,227,0) 80%)',
          }}
        />
        <img
          src={LOGO}
          alt=""
          aria-hidden
          width={670}
          height={896}
          className={`relative ${size}`}
        />
      </span>
    );
  }
  if (kind === 'cream-figure') {
    return <img src={KNOCKOUT} alt="" aria-hidden width={670} height={896} className={size} />;
  }
  return (
    <img
      src={LOGO}
      alt=""
      aria-hidden
      width={670}
      height={896}
      className={size}
      style={kind === 'orange-figure' ? { filter: TO_ORANGE } : undefined}
    />
  );
}

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

export default function ArchiveTrial({ id }: { id: string }) {
  const t = archive.find((a) => a.id === id);
  if (!t) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.page }}>
      <Switcher current={id} />

      <header
        className={`relative z-20 border-b border-cream/10 ${t.headerExtra ?? ''}`}
        style={t.headerStyle}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
          <span className="inline-flex items-center gap-3">
            <MarkEl kind={t.mark} size={t.markSize} />
            <span className={`font-display text-xl tracking-wide ${t.word}`}>
              {siteConfig.name}
            </span>
          </span>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <span key={l.href} className={`text-sm font-semibold ${t.navLink}`}>
                {l.label}
              </span>
            ))}
            <span className={`rounded-full px-5 py-2 text-sm font-semibold ${t.navCta}`}>
              Book a workshop
            </span>
          </nav>
        </div>
      </header>

      <section
        className={`relative isolate flex min-h-[70vh] items-center overflow-hidden px-6 sm:px-8 ${t.heroExtra ?? ''}`}
      >
        <img
          src={asset(heroImage)}
          alt="Osha of Flowsha spinning hoops in a colourfully lit studio"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0" style={{ backgroundImage: t.heroGrad }} />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
            {siteConfig.offerings}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] text-cream">
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

      <section className="px-6 py-16 sm:px-8" style={t.cardsStyle}>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {OFFERINGS.map(([title, blurb], i) => (
            <div key={title} className="flex flex-col rounded-3xl p-7" style={t.cardStyle}>
              <img
                src={asset(galleryImages[i + 1].src)}
                alt={galleryImages[i + 1].alt}
                className="mb-5 h-40 w-full rounded-2xl object-cover"
              />
              <h3 className={`font-display text-xl ${t.cardTitle}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${t.cardBody}`}>{blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={t.footerStyle}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-3">
              <MarkEl kind={t.footerMark} size={t.footerMarkSize} />
              <div>
                <div className={`font-display text-2xl ${t.footerWord}`}>{siteConfig.name}</div>
                <div className={`font-script text-xl italic ${t.footerHead}`}>
                  {siteConfig.tagline}
                </div>
              </div>
            </div>
            <p className={`mt-3 text-sm uppercase tracking-[0.18em] ${t.footerText}`}>
              {siteConfig.offerings}
            </p>
          </div>
          <nav className="md:justify-self-center">
            <h2
              className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${t.footerHead}`}
            >
              Explore
            </h2>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href} className={t.footerText}>
                  {l.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:justify-self-end">
            <h2
              className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${t.footerHead}`}
            >
              Find me
            </h2>
            <p className={t.footerText}>{siteConfig.email}</p>
            <p className={`mt-1 text-sm ${t.footerText}`}>Based in {siteConfig.areaServed}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
