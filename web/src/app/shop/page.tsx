import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { shopCategories } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hoop Shop | Handmade Hula Hoops & Accessories',
  description:
    'Handmade hula hoops for every level: beginner, intermediate, kids, dance and fully custom, plus accessories and re-taping, from Flowsha.',
  alternates: { canonical: '/shop/' },
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Flowsha handmade hula hoops',
  itemListElement: shopCategories.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.title,
    description: c.blurb,
  })),
};

export default function ShopPage() {
  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
        >
          Hoop Shop
        </FadeIn>
        <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          Handmade hoops
        </FadeIn>
        <FadeIn as="p" className="max-w-2xl text-lg text-ink/85">
          Every hoop is made by hand. If you’re not sure what you need, tell me your height and what
          you want to do with it and I’ll point you to the right one.
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopCategories.map((c) => (
            <FadeIn key={c.title}>
              <div className="flex h-full flex-col rounded-3xl border border-clay/15 bg-sand/60 p-7">
                <h2 className="font-display text-xl text-forest">{c.title}</h2>
                <p className="mt-2 flex-1 text-ink/80">{c.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Size guide */}
        <FadeIn className="mt-12 rounded-3xl bg-sand p-8">
          <h2 className="font-display text-2xl text-forest">Finding your size</h2>
          <p className="mt-3 max-w-2xl text-ink/80">
            As a rough guide, bigger and heavier hoops spin slower and are easier to learn on, while
            smaller, lighter ones move faster and suit trickier moves. Not sure? Message me your
            height and experience and I’ll help you choose.
          </p>
        </FadeIn>
      </section>

      {/* Ordering CTA — real cart/checkout comes later. */}
      <section className="bg-terracotta px-6 py-16 text-center text-cream sm:px-8">
        <FadeIn as="h2" className="font-display text-[clamp(1.8rem,5vw,2.8rem)] text-cream">
          Order your hoop
        </FadeIn>
        <FadeIn as="p" className="mx-auto mt-3 max-w-xl text-cream/90">
          There’s no online checkout yet. For now, message me what you’re after, including fully
          custom hoops, and I’ll sort it out.
        </FadeIn>
        <FadeIn className="mt-7">
          <CtaButton href={`/contact/?type=shop`} variant="light">
            Enquire to order
          </CtaButton>
        </FadeIn>
        <FadeIn as="p" className="mt-4 text-sm text-cream/80">
          Or email{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
        </FadeIn>
      </section>
    </>
  );
}
