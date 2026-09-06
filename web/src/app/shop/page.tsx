import type { Metadata } from 'next';
import ExportedImage from '@/components/ExportedImage';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { shopImage, shopServices } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata, siteConfig } from '@/lib/site';
import { CUSTOM_PRODUCTS } from '@flowsha/shared';

export const metadata: Metadata = pageMetadata({
  title: 'Hoop Shop | Handmade Hula Hoops, Made to Order',
  description:
    'Handmade hula hoops made to order in Southampton. Choose your size, tubing and tapes, or take a one-off ready-made hoop. UK delivery or free local collection.',
  path: '/shop/',
});

// ItemList is safe here: these two products are statically rendered, so the
// crawler sees exactly what a visitor sees. Ready-made stock is client-fetched
// and deliberately carries no Product markup.
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Flowsha handmade hula hoops',
  itemListElement: CUSTOM_PRODUCTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    description: p.tagline,
    url: `${siteConfig.url}/shop/${p.slug}/`,
  })),
};

export default function ShopPage() {
  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd('Shop', '/shop/')} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-center">
          <div className="order-2 md:order-1">
            <FadeIn
              as="p"
              className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-light"
            >
              Hoop Shop
            </FadeIn>
            <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
              Handmade hoops
            </FadeIn>
            <FadeIn as="p" className="max-w-2xl text-lg text-cream/85">
              Every hoop is made by hand, to order. Choose the size, the tubing and the tapes and
              I’ll build it for you — or take one of the one-off hoops I’ve already made.
            </FadeIn>
          </div>

          <FadeIn className="order-1 md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest">
              <ExportedImage
                src={shopImage}
                alt="Osha holding four brightly coloured handmade Flowsha hoops in a sunlit park"
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        {/* The two made-to-order products */}
        <h2 className="mt-16 font-display text-2xl text-cream">Made to order</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {CUSTOM_PRODUCTS.map((p) => (
            <FadeIn key={p.id}>
              <a
                href={`/shop/${p.slug}/`}
                className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-7 transition-colors hover:border-terracotta-light/50"
              >
                <h3 className="font-display text-xl text-cream">{p.name}</h3>
                <p className="mt-2 flex-1 text-cream/80">{p.tagline}</p>
                <span className="mt-4 text-sm font-semibold text-terracotta-light">
                  Configure yours →
                </span>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Ready-made + size guide */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <FadeIn>
            <a
              href="/shop/ready-made/"
              className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-7 transition-colors hover:border-terracotta-light/50"
            >
              <h3 className="font-display text-xl text-cream">Ready-made hoops</h3>
              <p className="mt-2 flex-1 text-cream/80">
                One-off hoops I’ve already built and photographed. When one’s gone, it’s gone.
              </p>
              <span className="mt-4 text-sm font-semibold text-terracotta-light">
                See what’s available →
              </span>
            </a>
          </FadeIn>

          <FadeIn>
            <a
              href="/shop/size-guide/"
              className="flex h-full flex-col rounded-3xl border border-cream/10 bg-forest/40 p-7 transition-colors hover:border-terracotta-light/50"
            >
              <h3 className="font-display text-xl text-cream">Finding your size</h3>
              <p className="mt-2 flex-1 text-cream/80">
                Bigger hoops spin slower and are easier to learn on. Here’s how to pick.
              </p>
              <span className="mt-4 text-sm font-semibold text-terracotta-light">
                Read the size guide →
              </span>
            </a>
          </FadeIn>
        </div>

        {/* Enquiry-only services */}
        {shopServices.map((s) => (
          <FadeIn
            key={s.title}
            className="mt-6 rounded-3xl border border-cream/10 bg-forest/40 p-8"
          >
            <h2 className="font-display text-2xl text-cream">{s.title}</h2>
            <p className="mt-3 max-w-2xl text-cream/80">{s.blurb}</p>
            <a
              href={s.href}
              className="mt-4 inline-block text-sm font-semibold text-terracotta-light underline"
            >
              {s.cta}
            </a>
          </FadeIn>
        ))}
      </section>

      <section className="bg-terracotta-deep px-6 py-16 text-center text-cream sm:px-8">
        <FadeIn as="h2" className="font-display text-[clamp(1.8rem,5vw,2.8rem)] text-cream">
          Not sure what you need?
        </FadeIn>
        <FadeIn as="p" className="mx-auto mt-3 max-w-xl text-cream">
          Tell me your height and what you’d like to do with the hoop, and I’ll tell you what I’d
          make you.
        </FadeIn>
        <FadeIn className="mt-7">
          <CtaButton href="/contact/?type=shop" variant="light">
            Message me
          </CtaButton>
        </FadeIn>
        <FadeIn as="p" className="mt-4 text-sm text-cream">
          Or email{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
        </FadeIn>
      </section>
    </>
  );
}
