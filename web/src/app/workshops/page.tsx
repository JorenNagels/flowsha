import type { Metadata } from 'next';
import ExportedImage from '@/components/ExportedImage';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import {
  // Pricing hidden for now — restore with the Pricing section below.
  // groupWorkshop,
  // privateLessons,
  workshopBannerImage,
  workshopImage,
  workshopTypes,
} from '@/lib/data';
import { breadcrumbJsonLd, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hula Hoop Workshops & Private Lessons',
  description:
    'Relaxed, beginner-friendly hula hoop workshops and private lessons with Osha of Flowsha. Group classes, festivals, retreats and wellness events. No experience needed.',
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
  // Pricing hidden for now — restore alongside the visible Pricing section below.
  // offers: [
  //   {
  //     '@type': 'Offer',
  //     name: 'Group Workshop (1.5 hours)',
  //     price: '15',
  //     priceCurrency: 'GBP',
  //     description: 'Per person, 1.5 hour group hula hoop workshop.',
  //   },
  //   {
  //     '@type': 'Offer',
  //     name: 'Private Lesson (1 hour)',
  //     price: '50',
  //     priceCurrency: 'GBP',
  //     description: 'One-to-one private hula hoop lesson.',
  //   },
  // ],
};

export default function WorkshopsPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd('Workshops', '/workshops/')} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-center">
          <div className="order-2 md:order-1">
            <FadeIn
              as="p"
              className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
            >
              Workshops
            </FadeIn>
            <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
              Come and play
            </FadeIn>
            <FadeIn as="p" className="max-w-2xl text-lg text-cream/85">
              First time with a hoop, or after something more advanced? Sessions are relaxed and
              low-pressure. No experience or coordination needed, and no pressure to be good at it.
            </FadeIn>
          </div>

          <FadeIn className="order-1 md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest">
              <ExportedImage
                src={workshopImage}
                alt="A group hula hoop workshop in full flow, everyone spinning hoops together in a colourfully lit studio"
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        {/* Workshop types */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workshopTypes.map((w) => (
            <FadeIn key={w.title}>
              <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-7 transition-colors hover:border-mustard/50">
                <h2 className="font-display text-xl text-cream">{w.title}</h2>
                <p className="mt-2 text-cream/80">{w.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Atmosphere banner */}
      <FadeIn className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-forest">
          <ExportedImage
            src={workshopBannerImage}
            alt="A smiling participant with arms open during a relaxed Flowsha hoop workshop"
            fill
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        </div>
      </FadeIn>

      {/* Pricing — hidden for now; restore this section (and the `groupWorkshop`/
          `privateLessons` imports + the JSON-LD `offers` above) when ready to
          publish prices again. Inner label comments removed so this block stays
          a single valid JSX comment.

      <section className="mt-16 bg-forest/30 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <FadeIn as="h2" className="mb-8 text-center font-display text-[clamp(1.8rem,5vw,2.8rem)]">
            Pricing
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
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

            <FadeIn>
              <div className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-8">
                <h3 className="font-display text-2xl text-cream">Private Lessons</h3>
                <p className="mt-1 text-cream/60">One-to-one, tailored entirely to you</p>
                <ul className="mt-5 space-y-3">
                  {privateLessons.map((p) => (
                    <li
                      key={p.duration}
                      className="flex items-center justify-between border-b border-cream/10 pb-3"
                    >
                      <span className="text-cream/80">{p.duration}</span>
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
      */}

      {/* Ask about the next workshop */}
      <section className="mt-16 bg-forest/30 px-6 py-20 text-center sm:px-8">
        <FadeIn as="h2" className="font-display text-[clamp(1.8rem,5vw,2.8rem)] text-cream">
          Ask me about my next workshop
        </FadeIn>
        <FadeIn as="p" className="mx-auto mt-3 max-w-xl text-cream/80">
          Group classes and private lessons run regularly around Southampton. Drop me a message and
          I’ll let you know what’s coming up.
        </FadeIn>
        <FadeIn className="mt-7">
          <CtaButton href="/contact/?type=workshop" variant="gold">
            Get in touch
          </CtaButton>
        </FadeIn>
      </section>
    </>
  );
}
