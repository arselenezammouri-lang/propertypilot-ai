import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

/**
 * Force `Disallow: /` for preview/staging (no sitemap) + `X-Robots-Tag` in middleware.
 * - `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=true` (or `1` / `yes`) → block on any host.
 * - `VERCEL_ENV=preview` (Vercel Preview) → block even without the public flag.
 * - `false` / `0` / `no` (or unset) → do **not** block via this flag.
 * On **Vercel Production**, set `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=false` explicitly if your team
 * shares env templates across environments — avoids a mistaken `true` from another project/file.
 */
export function shouldBlockAllIndexing(): boolean {
  const explicit = process.env.NEXT_PUBLIC_BLOCK_SEARCH_INDEXING?.trim().toLowerCase();
  if (explicit === 'false' || explicit === '0' || explicit === 'no') {
    return process.env.VERCEL_ENV === 'preview';
  }
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
