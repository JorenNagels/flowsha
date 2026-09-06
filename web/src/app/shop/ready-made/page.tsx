import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import JsonLd from '@/components/JsonLd';
import ReadyMadeList from '@/components/shop/ReadyMadeList';
import { pageMetadata, siteConfig } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Ready-Made Hoops | One-Off Handmade Hula Hoops',
  description:
    'One-off handmade hula hoops, ready to post today. Each one is unique — when it’s gone, it’s gone. UK delivery or free collection in Southampton.',
  path: '/shop/ready-made/',
});

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteConfig.url}/shop/` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Ready-made',
      item: `${siteConfig.url}/shop/ready-made/`,
    },
  ],
};

export default function ReadyMadePage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cream/55">
          <a href="/shop/" className="hover:text-terracotta-light">
            Shop
          </a>
          <span aria-hidden="true"> / </span>
          <span className="text-cream/80">Ready-made</span>
        </nav>

        <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4rem)]">
          Ready-made hoops
        </FadeIn>
        <FadeIn as="p" className="mb-10 max-w-2xl text-lg text-cream/85">
          Hoops I’ve already made, photographed and can post straight away. Each one is a one-off,
          so when it’s gone it’s gone.
        </FadeIn>

        <ReadyMadeList />
      </section>
    </>
  );
}
