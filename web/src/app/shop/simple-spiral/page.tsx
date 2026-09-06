import type { Metadata } from 'next';
import ProductPageLayout from '@/components/shop/ProductPageLayout';
import { findProductBySlug } from '@/lib/shopJsonLd';
import { pageMetadata } from '@/lib/site';

const product = findProductBySlug('simple-spiral');

export const metadata: Metadata = pageMetadata({
  title: 'Simple Spiral Hoop | Custom Handmade Hula Hoop',
  description:
    'A handmade hula hoop wrapped in a spiral of shiny tape over gaffer tape. Choose your size, tubing and colours. Made to order in Southampton, UK delivery.',
  path: '/shop/simple-spiral/',
});

export default function SimpleSpiralPage() {
  return (
    <ProductPageLayout
      product={product}
      image="/images/gallery/hoop-21.jpg"
      imageAlt="A handmade Simple Spiral hula hoop, shiny tape spiralling over a dark gaffer base"
    />
  );
}
