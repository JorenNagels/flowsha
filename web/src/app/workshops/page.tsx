import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { groupWorkshop, privateLessons, workshopTypes } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hula Hoop Workshops & Private Lessons',
  description:
    'Relaxed, beginner-friendly hula hoop workshops (£15pp) and private lessons (from £30) with Osha of Flowsha. Group classes, festivals, retreats and wellness events. No experience needed.',
  alternates: { canonical: '/workshops/' },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Hula hoop workshops and private lessons',
  provider: {
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: siteConfig.url,
  },
  areaServed: siteConfig.areaServedTowns.map((name) => ({ '@type': 'City', name })),
  description:
    'Beginner and intermediate hula hoop workshops, private lessons, festival workshops and wellness retreats.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Group Workshop (1.5 hours)',
      price: '15',
      priceCurrency: 'GBP',
      description: 'Per person, 1.5 hour group hula hoop workshop.',
    },
    {
      '@type': 'Offer',
      name: 'Private Lesson (1 hour)',
      price: '50',
      priceCurrency: 'GBP',
      description: 'One-to-one private hula hoop lesson.',
    },
  ],
};

export default function WorkshopsPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
        >
          Workshops
        </FadeIn>
        <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          Come and play
        </FadeIn>
        <FadeIn as="p" className="max-w-2xl text-lg text-ink/85">
          First time with a hoop, or after something more advanced? Sessions are relaxed and
          low-pressure. No experience or coordination needed, and no pressure to be good at it.
        </FadeIn>

        {/* Workshop types */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workshopTypes.map((w) => (
            <FadeIn key={w.title}>
              <div className="flex h-full flex-col rounded-3xl border border-clay/15 bg-sand/60 p-7">
                <h2 className="font-display text-xl text-forest">{w.title}</h2>
                <p className="mt-2 text-ink/80">{w.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-sand px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <FadeIn as="h2" className="mb-8 text-center font-display text-[clamp(1.8rem,5vw,2.8rem)]">
            Pricing
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Group */}
            <FadeIn>
              <div className="flex h-full flex-col rounded-3xl bg-forest-dark p-8 text-cream">
                <h3 className="font-display text-2xl text-cream">{groupWorkshop.name}</h3>
                <p className="mt-1 text-cream/70">{groupWorkshop.duration}</p>
                <p className="mt-4 font-display text-5xl text-mustard">
                  {groupWorkshop.price}
                  <span className="ml-2 align-middle text-base text-cream/70">
                    {groupWorkshop.note}
                  </span>
                </p>
                <p className="mt-4 flex-1 text-cream/80">
                  A friendly group class, and a good way to try hooping with other people and pick
                  up some tricks together.
                </p>
                <div className="mt-6">
                  <CtaButton href="/contact/?type=workshop" variant="light">
                    Book a workshop
                  </CtaButton>
                </div>
              </div>
            </FadeIn>

            {/* Private */}
            <FadeIn>
              <div className="flex h-full flex-col rounded-3xl border border-clay/20 bg-cream p-8">
                <h3 className="font-display text-2xl text-forest">Private Lessons</h3>
                <p className="mt-1 text-ink/60">One-to-one, tailored entirely to you</p>
                <ul className="mt-5 space-y-3">
                  {privateLessons.map((p) => (
                    <li
                      key={p.duration}
                      className="flex items-center justify-between border-b border-clay/15 pb-3"
                    >
                      <span className="text-ink/80">{p.duration}</span>
                      <span className="font-display text-2xl text-terracotta">{p.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex-1" />
                <CtaButton href="/contact/?type=workshop" variant="primary">
                  Enquire about a lesson
                </CtaButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
