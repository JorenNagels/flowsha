import Link from 'next/link';
import Hero from '@/components/Hero';
import FadeIn from '@/components/FadeIn';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { aboutParagraphs, testimonials } from '@/lib/data';
import { siteConfig } from '@/lib/site';

const offerings = [
  {
    title: 'Classes',
    blurb:
      'Group workshops and private lessons in a relaxed, friendly space. No experience or coordination needed. Just turn up curious.',
    href: '/workshops/',
    cta: 'Book a workshop',
  },
  {
    title: 'Performances',
    blurb: 'LED, fire and daytime hoop acts for festivals, parties and events.',
    href: '/performances/',
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
              <div className="flex h-full flex-col rounded-3xl border border-clay/15 bg-sand/60 p-8">
                <h2 className="font-display text-2xl text-forest">{o.title}</h2>
                <p className="mt-3 flex-1 text-ink/80">{o.blurb}</p>
                <Link
                  href={o.href}
                  className="mt-5 inline-flex items-center gap-1 font-semibold text-terracotta transition-all hover:gap-2"
                >
                  {o.cta} <span aria-hidden>→</span>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-forest-dark px-6 py-20 text-cream sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn
            as="p"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
          >
            Meet your guide
          </FadeIn>
          <FadeIn as="h2" className="mb-5 font-display text-[clamp(2rem,5vw,3rem)] text-cream">
            Hi, I’m Osha
          </FadeIn>
          <FadeIn as="p" className="text-cream/85">
            {aboutParagraphs[0]}
          </FadeIn>
          <FadeIn className="mt-8">
            <CtaButton href="/about/" variant="light">
              Read my story
            </CtaButton>
          </FadeIn>
        </div>
      </section>

      <Testimonials />

      {/* Gallery */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <FadeIn
            as="p"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
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

      {/* Closing CTA */}
      <section className="bg-terracotta px-6 py-16 text-center text-cream sm:px-8">
        <FadeIn as="h2" className="font-display text-[clamp(2rem,5vw,3.2rem)] text-cream">
          Ready to find your flow?
        </FadeIn>
        <FadeIn as="p" className="mx-auto mt-3 max-w-xl text-cream/90">
          First hoop or a booking enquiry? Either way, get in touch.
        </FadeIn>
        <FadeIn className="mt-7 flex flex-wrap justify-center gap-3">
          <CtaButton href="/workshops/" variant="light">
            Book a workshop
          </CtaButton>
          <CtaButton href="/contact/" variant="lightOutline">
            Contact me
          </CtaButton>
        </FadeIn>
      </section>
    </>
  );
}
