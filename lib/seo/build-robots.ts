import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

/**
 * Force `Disallow: /` for preview/staging (no sitemap).
 * Set `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=true` on any host that must not be indexed.
 * Preview deployments on Vercel set `VERCEL_ENV=preview` and are blocked automatically.
 */
export function shouldBlockAllIndexing(): boolean {
  const explicit = process.env.NEXT_PUBLIC_BLOCK_SEARCH_INDEXING?.trim().toLowerCase();
  if (explicit === 'true' || explicit === '1' || explicit === 'yes') {
    return true;
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return true;
  }
  return false;
}

const PRODUCTION_DISALLOW = [
  '/api/',
  '/dashboard/',
  '/auth/signout',
  '/_next/',
  '/contact',
] as const;

export function buildRobotsMetadata(): MetadataRoute.Robots {
  if (shouldBlockAllIndexing()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: ['/'],
        },
      ],
    };
  }

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...PRODUCTION_DISALLOW],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
