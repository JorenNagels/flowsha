import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow every crawler (search + AI answer engines) everywhere except internal
    // /styles and the /1…/5 chrome trials, the hidden /feedback survey + /waiver
    // form, and the private /login + /dashboard. All carry a noindex meta tag too;
    // this disallow is belt-and-suspenders so they never get crawled or surfaced.
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/styles/',
        '/1/',
        '/2/',
        '/3/',
        '/4/',
        '/5/',
        '/6/',
        '/7/',
        '/8/',
        '/9/',
        '/10/',
        '/11/',
        '/12/',
        '/13/',
        '/14/',
        '/15/',
        '/16/',
        '/17/',
        '/18/',
        '/19/',
        '/20/',
        '/21/',
        '/22/',
        '/23/',
        '/24/',
        '/25/',
        '/26/',
        '/27/',
        '/28/',
        '/29/',
        '/30/',
        '/31/',
        '/32/',
        '/33/',
        '/34/',
        '/35/',
        '/36/',
        '/37/',
        '/38/',
        '/39/',
        '/40/',
        '/41/',
        '/42/',
        '/43/',
        '/44/',
        '/45/',
        '/46/',
        '/47/',
        '/48/',
        '/49/',
        '/50/',
        // Per-visitor pages with nothing to rank for.
        '/shop/cart/',
        '/shop/thank-you/',
        '/feedback/',
        '/waiver/',
        '/login/',
        '/dashboard/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
