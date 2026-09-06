import type { Metadata } from 'next';
import { Fraunces, Nunito } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import SiteChrome from '@/components/SiteChrome';
import { ogImage, siteConfig } from '@/lib/site';

const fraunces = Fraunces({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const nunito = Nunito({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Hula Hoop Workshops & Performances in Southampton`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'hula hoop workshops Southampton',
    'hula hoop classes Southampton',
    'hula hoop classes Hampshire',
    'learn to hoop',
    'fire hoop performer Southampton',
    'LED hoop performance',
    'handmade hula hoops',
    'flow arts',
    'Flowsha',
    'Flowsha hula hoops',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  // Both icons are declared explicitly, and both entries are required: setting `icons` at
  // all suppresses Next's file-convention detection, so naming only `apple` would silently
  // drop the favicon. The Apple icon can't use the `app/apple-icon.png` convention because
  // next-image-export-optimizer then treats it as a content image and emits eight useless
  // WEBP variants into web/public/. Both files come from `npm run prep-brand`.
  icons: {
    icon: { url: '/icon.svg', type: 'image/svg+xml' },
    apple: '/brand/apple-touch-icon.png',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  // SportsActivityLocation is the closest specific subtype for a hoop-class
  // business; LocalBusiness is kept as a second type for broad compatibility.
  '@type': ['LocalBusiness', 'SportsActivityLocation'],
  // Stable node id so other pages' structured data can reference this business.
  '@id': `${siteConfig.url}/#business`,
  name: siteConfig.name,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
  url: siteConfig.url,
  email: siteConfig.email,
  image: `${siteConfig.url}${ogImage}`,
  priceRange: siteConfig.priceRange,
  knowsAbout: siteConfig.knowsAbout,
  founder: { '@type': 'Person', name: siteConfig.founder },
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.location.city,
    addressRegion: siteConfig.location.region,
    addressCountry: siteConfig.location.countryCode,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.location.latitude,
    longitude: siteConfig.location.longitude,
  },
  // Structured catchment — Southampton first, then the surrounding towns.
  areaServed: siteConfig.areaServedTowns.map((name) => ({ '@type': 'City', name })),
  sameAs: [siteConfig.socials.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${nunito.variable}`}
    >
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
