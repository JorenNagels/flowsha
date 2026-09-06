import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

const routes = [
  '/',
  '/about/',
  '/workshops/',
  '/shop/',
  '/shop/simple-spiral/',
  '/shop/all-shiny/',
  '/shop/ready-made/',
  '/shop/size-guide/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/returns/',
  '/delivery/',
];

// Legal pages stay in the sitemap but at low priority — they're not what we
// want ranking for.
const lowPriorityRoutes = new Set(['/privacy/', '/terms/', '/returns/', '/delivery/']);

// Committed content date. Using a fixed date (rather than build time) means the
// sitemap only signals "changed" when we actually bump this on a content update,
// instead of restamping every URL as changed on every deploy. Bump when content
// changes materially.
const lastModified = '2026-08-22';

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : lowPriorityRoutes.has(route) ? 0.3 : 0.8,
  }));
}
