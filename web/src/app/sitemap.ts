import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

const routes = ['/', '/about/', '/workshops/', '/shop/', '/contact/', '/privacy/'];

// Legal pages stay in the sitemap but at low priority — they're not what we
// want ranking for.
const lowPriorityRoutes = new Set(['/privacy/']);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : lowPriorityRoutes.has(route) ? 0.3 : 0.8,
  }));
}
