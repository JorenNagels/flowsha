import type { CustomProduct } from '@flowsha/shared';
import ExportedImage from '@/components/ExportedImage';
import FadeIn from '@/components/FadeIn';
import JsonLd from '@/components/JsonLd';
import HoopConfigurator from '@/components/shop/HoopConfigurator';
import { productJsonLd } from '@/lib/shopJsonLd';
import { breadcrumbJsonLd, siteConfig } from '@/lib/site';

// Shared shell for the two made-to-order product pages. Both are fully static —
// the only client component is the configurator — so a crawler sees the whole
// page, which is the entire point of keeping these on the static export.
export default function ProductPageLayout({
  product,
  image,
  imageAlt,
}: {
  product: CustomProduct;
  image: string;
  imageAlt: string;
}) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteConfig.url}/shop/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${siteConfig.url}/shop/${product.slug}/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumb} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cream/55">
          <a href="/shop/" className="hover:text-terracotta-light">
            Shop
          </a>
          <span aria-hidden="true"> / </span>
          <span className="text-cream/80">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-start">
          <div className="order-2 md:order-1">
            <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
              {product.name}
            </FadeIn>
            <FadeIn as="p" className="mb-6 max-w-2xl text-lg text-cream/85">
              {product.tagline}
            </FadeIn>
            {product.description.map((para) => (
              <FadeIn as="p" key={para} className="mb-4 max-w-2xl text-cream/80">
                {para}
              </FadeIn>
            ))}

            <FadeIn className="mt-8 rounded-2xl border border-cream/10 bg-forest/30 p-5 text-sm text-cream/70">
              <p>
                Made to order by hand in Southampton. UK delivery or free local collection. You have
                14 days from delivery to change your mind — see{' '}
                <a href="/returns/" className="text-terracotta-light underline">
                  returns &amp; cancellations
                </a>
                .
              </p>
            </FadeIn>
          </div>

          <FadeIn className="order-1 md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest">
              <ExportedImage
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        <div className="mt-12">
          <HoopConfigurator productId={product.id} />
        </div>
      </section>
    </>
  );
}
