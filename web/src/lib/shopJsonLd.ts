import { CUSTOM_PRODUCTS, DELIVERY_OPTIONS, SIZES, type CustomProduct } from '@flowsha/shared';
import { siteConfig } from '@/lib/site';

// Product structured data for the two made-to-order hoops.
//
// Google flags product markup that omits shipping and returns information, so
// both are included rather than left to be "added later". The returns policy
// mirrors the real one: 14 days, applied to everything (the bespoke exemption
// does not cover goods assembled from standard stock options).

const ukDelivery = DELIVERY_OPTIONS.find((d) => d.id === 'uk-standard')!;

/** A year out — long enough not to churn, short enough that Google accepts it. */
function priceValidUntil(): string {
  return '2027-12-31';
}

export function productJsonLd(product: CustomProduct) {
  const lowest = Math.min(...SIZES.map((s) => s.basePence));
  const highest = Math.max(...SIZES.map((s) => s.basePence)) + 3000;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.tagline,
    url: `${siteConfig.url}/shop/${product.slug}/`,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: 'Hula hoops',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'GBP',
      lowPrice: (lowest / 100).toFixed(2),
      highPrice: (highest / 100).toFixed(2),
      offerCount: SIZES.length,
      availability: 'https://schema.org/MadeToOrder',
      priceValidUntil: priceValidUntil(),
      seller: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: (ukDelivery.pricePence / 100).toFixed(2),
          currency: 'GBP',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GB',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 10,
            unitCode: 'DAY',
          },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'GB',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };
}

export function findProductBySlug(slug: string): CustomProduct {
  const product = CUSTOM_PRODUCTS.find((p) => p.slug === slug);
  if (!product) throw new Error(`No shop product with slug "${slug}".`);
  return product;
}
