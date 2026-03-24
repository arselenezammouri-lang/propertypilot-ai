import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/signout',
          // Next.js build output — not meaningful for crawlers as standalone URLs
          '/_next/',
          // Alias redirects to /contatti; canonical is the Italian URL
          '/contact',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
