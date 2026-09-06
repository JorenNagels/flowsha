import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import JsonLd from '@/components/JsonLd';
import { sizeGuide } from '@/lib/data';
import { pageMetadata, siteConfig } from '@/lib/site';
import { SIZES, TUBING } from '@flowsha/shared';

export const metadata: Metadata = pageMetadata({
  title: 'Hula Hoop Size Guide | What Size Hoop Do I Need?',
  description:
    'How to choose a hula hoop size. Bigger hoops spin slower and are easier to learn on; smaller hoops suit tricks. Sizes from 24″ to 38″, with tubing guidance.',
  path: '/shop/size-guide/',
});

// A how-to is the honest shape for this page, and it is eligible for rich results.
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to choose a hula hoop size',
  description: sizeGuide.intro,
  step: sizeGuide.steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteConfig.url}/shop/` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Size guide',
      item: `${siteConfig.url}/shop/size-guide/`,
    },
  ],
};

export default function SizeGuidePage() {
  return (
    <>
      <JsonLd data={howToJsonLd} />
      <JsonLd data={breadcrumb} />

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cream/55">
          <a href="/shop/" className="hover:text-terracotta-light">
            Shop
          </a>
          <span aria-hidden="true"> / </span>
          <span className="text-cream/80">Size guide</span>
        </nav>

        <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4rem)]">
          What size hoop do I need?
        </FadeIn>
        <FadeIn as="p" className="mb-10 text-lg text-cream/85">
          {sizeGuide.intro}
        </FadeIn>

        <ol className="space-y-6">
          {sizeGuide.steps.map((s, i) => (
            <FadeIn
              as="li"
              key={s.title}
              className="rounded-3xl border border-cream/10 bg-forest/40 p-6"
            >
              <h2 className="font-display text-xl text-cream">
                <span className="text-terracotta">{i + 1}.</span> {s.title}
              </h2>
              <p className="mt-2 text-cream/80">{s.body}</p>
            </FadeIn>
          ))}
        </ol>

        <FadeIn className="mt-12">
          <h2 className="font-display text-2xl text-cream">Sizes I make</h2>
          <p className="mt-2 text-cream/70">
            Every size from {SIZES[0].label} to {SIZES[SIZES.length - 1].label}, in 1″ steps.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <li
                key={s.inches}
                className="rounded-full border border-cream/20 px-3 py-1.5 text-sm text-cream/80"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="mt-12">
          <h2 className="font-display text-2xl text-cream">Tubing</h2>
          <dl className="mt-4 space-y-4">
            {TUBING.map((t) => (
              <div key={t.id} className="rounded-2xl border border-cream/10 bg-forest/40 p-5">
                <dt className="font-semibold text-cream">{t.label}</dt>
                <dd className="mt-1 text-cream/80">{t.description}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn className="mt-12 rounded-3xl border border-terracotta-light/30 bg-forest/40 p-6">
          <p className="text-cream/85">{sizeGuide.note}</p>
          <a
            href="/contact/?type=shop"
            className="mt-4 inline-block text-sm font-semibold text-terracotta-light underline"
          >
            Message me
          </a>
        </FadeIn>
      </section>
    </>
  );
}
