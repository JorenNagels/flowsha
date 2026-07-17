import type { Metadata } from 'next';

// Central site configuration. Edit brand-level copy, domain, contact and socials here.
export const siteConfig = {
  name: 'Flowsha',
  founder: 'Osha',
  // Live domain (registered + DNS in Route 53, served via CloudFront).
  url: 'https://flowsha.co.uk',
  tagline: 'flow • play • connect',
  offerings: 'Classes • Performances • Handmade Hoops',
  // Homepage meta description — kept under ~160 chars so Google doesn't truncate
  // it, with the priority keywords front-loaded.
  description:
    'Hula hoop workshops, performances and handmade hoops with Osha of Flowsha in Southampton, Hampshire. Beginner-friendly classes, LED & fire booking, custom hoops.',
  // Live contact + socials. Email is a Zoho mailbox on the domain; SES sends from it.
  email: 'hello@flowsha.co.uk',
  // Local SEO — based in Southampton, serving Hampshire & the South.
  // Human-readable label (used in Footer copy + as a fallback in metadata).
  areaServed: 'Southampton & Hampshire',
  // Structured catchment for JSON-LD `areaServed`. Southampton first (the open
  // lane — no city-based hooping rival), then the surrounding towns where the
  // nearest competitors trade (Romsey, Winchester, Bournemouth/Dorset).
  areaServedTowns: [
    'Southampton',
    'Eastleigh',
    'Romsey',
    'Winchester',
    'Fareham',
    'Portsmouth',
    'Bournemouth',
  ],
  // Topics for `knowsAbout` — reinforces the niche to search engines.
  knowsAbout: [
    'Hula hoop classes',
    'Hoop dance',
    'Flow arts',
    'Fire hoop performance',
    'LED hoop performance',
    'Handmade hula hoops',
  ],
  // Rough guide for the `priceRange` field (£ = budget, ££ = mid).
  priceRange: '££',
  location: {
    city: 'Southampton',
    region: 'Hampshire',
    country: 'United Kingdom',
    countryCode: 'GB',
    // Approx Southampton city-centre coordinates for LocalBusiness geo.
    latitude: 50.9097,
    longitude: -1.4044,
  },
  socials: {
    instagram: 'https://www.instagram.com/flowshaosha',
  },
} as const;

export const ogImage = '/images/og/flowsha-og.jpg';

// Per-page metadata builder. The root layout's `openGraph`/`twitter` blocks are
// NOT deep-merged into child pages, so without this every page inherited the
// homepage's social card (same og:title, description and og:url). This derives a
// page-specific canonical, Open Graph and Twitter card from the page's own
// title/description/path so shares of any page reflect that page.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// BreadcrumbList JSON-LD (Home → current page). Helps search + AI engines place
// the page within the site. `path` is the trailing-slash route, e.g. '/shop/'.
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name, item: `${siteConfig.url}${path}` },
    ],
  };
}
