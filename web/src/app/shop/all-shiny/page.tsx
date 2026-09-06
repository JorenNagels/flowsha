import type { Metadata } from 'next';
import ProductPageLayout from '@/components/shop/ProductPageLayout';
import { findProductBySlug } from '@/lib/shopJsonLd';
import { pageMetadata } from '@/lib/site';

const product = findProductBySlug('all-shiny');

export const metadata: Metadata = pageMetadata({
  title: 'All Shiny Hoop | Custom Handmade Hula Hoop',
  description:
    'A handmade hula hoop covered end to end in shiny tape, with optional inside-edge grip. Choose your size, tubing and colour. Made to order in Southampton.',
  path: '/shop/all-shiny/',
});

export default function AllShinyPage() {
  return (
    <ProductPageLayout
      product={product}
      image="/images/gallery/hoop-21.jpg"
      imageAlt="A handmade All Shiny hula hoop, wrapped completely in shiny tape catching the light"
    />
  );
}
