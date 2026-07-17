import Link from 'next/link';
import Hero from '@/components/Hero';
import FadeIn from '@/components/FadeIn';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import CtaButton from '@/components/CtaButton';
import ExportedImage from '@/components/ExportedImage';
import JsonLd from '@/components/JsonLd';
import { aboutImage, aboutParagraphs, testimonials } from '@/lib/data';
import { siteConfig } from '@/lib/site';

const offerings = [
  {
    title: 'Classes',
    blurb:
      'Group workshops and private lessons for adults and young people. No experience or coordination needed. Just turn up curious.',
    href: '/workshops/',
    cta: 'Book a workshop',
  },
  {
    title: 'Performances',
    blurb: 'Hoop acts for festivals, parties, and events.',
    href: '/contact/?type=performance',
    cta: 'Performance enquiries',
  },
  {
    title: 'Handmade Hoops',
    blurb:
      'Hoops made by hand for every level, from your first beginner hoop to fast dance hoops. Plus accessories and re-taping.',
    href: '/shop/',
    cta: 'Shop hoops',
  },
];

const reviewJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: String(testimonials.length),
  },
  review: testimonials.map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: t.name },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: t.quote,
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={reviewJsonLd} />
      <Hero />

      {/* Offerings */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {offerings.map((o) => (
            <FadeIn key={o.title}>
              <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-8 transition-colors hover:border-mustard/50">
                <h2 className="font-display text-2xl text-cream">{o.title}</h2>
                <p className="mt-3 flex-1 text-cream/70">{o.blurb}</p>
                <Link
                  href={o.href}
                  className="mt-5 inline-flex items-center gap-1 font-semibold text-mustard transition-all hover:gap-2"
                >
                  {o.cta} <span aria-hidden>→</span>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-forest/30 px-6 py-20 text-cream sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-forest ring-1 ring-mustard/30">
              <ExportedImage
                src={aboutImage}
                alt="Osha, founder of Flowsha, arms raised mid-performance in golden evening light"
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <div>
            <FadeIn
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
            >
              Meet your guide
            </FadeIn>
            <FadeIn as="h2" className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] text-cream">
              Hi, I’m Osha
            </FadeIn>
            <FadeIn as="p" className="mt-5 text-cream/80">
              {aboutParagraphs[0]}
            </FadeIn>
            <FadeIn className="mt-8">
              <CtaButton href="/about/" variant="light">
                Read my story
              </CtaButton>
            </FadeIn>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Gallery */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <FadeIn
            as="p"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
          >
            In the room
          </FadeIn>
          <FadeIn as="h2" className="mb-8 font-display text-[clamp(2rem,5vw,3rem)]">
            The atmosphere
          </FadeIn>
        </div>
        <FadeIn className="mr-6 sm:mr-8">
          <div className="pl-6 sm:pl-8">
            <Gallery />
          </div>
        </FadeIn>
      </section>
    </>
  );
}
