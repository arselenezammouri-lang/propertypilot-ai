import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';
import { docArticles } from '@/lib/docs/doc-content';
import { marketingBlogUiEn } from '@/lib/i18n/marketing-pages-ui';

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

function makeEntry(
  base: string,
  pathname: string,
  changeFrequency: ChangeFreq,
  priority: number
): MetadataRoute.Sitemap[number] {
  const url = pathname === '/' ? base : `${base}${pathname}`;
  return {
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

/** Marketing + docs + auth recovery URLs for `app/sitemap.ts`. No `/dashboard/*`. */
export function buildPublicSitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl().replace(/\/$/, '');

  const staticEntries: Array<{ path: string; changeFrequency: ChangeFreq; priority: number }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/pricing', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/platform', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/contatti', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/demo', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/compliance', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.88 },
    { path: '/docs', changeFrequency: 'weekly', priority: 0.82 },
    { path: '/auth/login', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/auth/signup', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/auth/forgot-password', changeFrequency: 'monthly', priority: 0.55 },
    { path: '/auth/reset-password', changeFrequency: 'monthly', priority: 0.45 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/refund', changeFrequency: 'monthly', priority: 0.5 },
  ];

  const out: MetadataRoute.Sitemap = staticEntries.map((e) =>
    makeEntry(base, e.path, e.changeFrequency, e.priority)
  );

  for (const post of marketingBlogUiEn.posts) {
    out.push(makeEntry(base, `/blog/${post.slug}`, 'monthly', 0.72));
  }

  for (const slug of Object.keys(docArticles)) {
    out.push(makeEntry(base, `/docs/${slug}`, 'monthly', 0.68));
  }

  return out;
}
