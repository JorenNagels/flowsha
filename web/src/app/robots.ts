import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow every crawler (search + AI answer engines) everywhere except internal
    // /styles, the hidden /feedback survey + /waiver form, and the private
    // /login + /dashboard. All carry a noindex meta tag too; this disallow is
    // belt-and-suspenders so they never get crawled or surfaced.
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/styles/', '/feedback/', '/waiver/', '/login/', '/dashboard/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
