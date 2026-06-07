import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import Gallery from '@/components/Gallery';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { performanceTypes } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hoop Performances | LED, Fire & Daytime Acts',
  description:
    'Book Flowsha for mesmerising LED, fire and daytime hula hoop performances at festivals, parties and events across the UK. Atmosphere, wonder and a touch of magic.',
  alternates: { canonical: '/performances/' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Performances',
      item: `${siteConfig.url}/performances/`,
    },
  ],
};

export default function PerformancesPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
        >
          Performances
        </FadeIn>
        <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          Hooping for your event
        </FadeIn>
        <FadeIn as="p" className="max-w-2xl text-lg text-cream/85">
          LED flow, fire hooping or daytime sets, depending on what suits your event. I’ll bring
          something that pulls a crowd and adds a bit of atmosphere.
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {performanceTypes.map((p) => (
            <FadeIn key={p.title}>
              <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-7 transition-colors hover:border-mustard/50">
                <h2 className="font-display text-xl text-cream">{p.title}</h2>
                <p className="mt-2 text-cream/80">{p.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <FadeIn as="h2" className="mb-8 font-display text-[clamp(1.8rem,5vw,2.6rem)]">
            A few moments
          </FadeIn>
        </div>
        <div className="pl-6 pr-6 sm:pl-8">
          <Gallery />
        </div>
        {/* Video reels can be embedded here once available. */}
      </section>

      {/* Booking CTA */}
      <section className="bg-forest-dark px-6 py-16 text-center text-cream sm:px-8">
        <FadeIn as="h2" className="font-display text-[clamp(1.8rem,5vw,2.8rem)] text-cream">
          Booking a performance?
        </FadeIn>
        <FadeIn as="p" className="mx-auto mt-3 max-w-xl text-cream/85">
          Tell me the date, the location and what you’ve got in mind, and I’ll come back to you with
          availability and prices.
        </FadeIn>
        <FadeIn className="mt-7">
          <CtaButton href="/contact/?type=performance" variant="light">
            Performance booking enquiries
          </CtaButton>
        </FadeIn>
      </section>
    </>
  );
}
