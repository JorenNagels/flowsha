import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow every crawler (search + AI answer engines) everywhere except the
    // internal /styles explorer and the hidden /feedback survey. Both also carry
    // a noindex meta tag; this disallow is belt-and-suspenders so they never get
    // crawled or surfaced.
    rules: { userAgent: '*', allow: '/', disallow: ['/styles/', '/feedback/'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
