// Central site configuration. Edit brand-level copy, domain, contact and socials here.
export const siteConfig = {
  name: 'Flowsha',
  founder: 'Osha',
  // Live domain (registered + DNS in Route 53, served via CloudFront).
  url: 'https://flowsha.co.uk',
  tagline: 'Find your flow',
  subtagline: 'Play • Flow • Connect',
  offerings: 'Classes • Performances • Handmade Hoops',
  description:
    'Hula hoop workshops, performances and handmade hoops with Osha of Flowsha in Southampton, Hampshire. Relaxed, beginner-friendly classes, LED & fire performance booking, and custom hoops across Southampton and the South of England. Find your flow.',
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
