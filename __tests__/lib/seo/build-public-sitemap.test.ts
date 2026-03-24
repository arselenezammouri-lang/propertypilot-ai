import { buildPublicSitemap } from '@/lib/seo/build-public-sitemap';
import { docArticles } from '@/lib/docs/doc-content';
import { marketingBlogUiEn } from '@/lib/i18n/marketing-pages-ui';

describe('buildPublicSitemap', () => {
  it('includes platform, blog index, docs index, and excludes dashboard', () => {
    const urls = buildPublicSitemap().map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/platform') || u.includes('/platform'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/blog') && !u.includes('/blog/'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/docs') && !u.includes('/docs/'))).toBe(true);
    expect(urls.some((u) => u.includes('/dashboard'))).toBe(false);
  });

  it('has one entry per blog post slug and per doc article', () => {
    const urls = buildPublicSitemap().map((e) => e.url);
    for (const post of marketingBlogUiEn.posts) {
      expect(urls.filter((u) => u.endsWith(`/blog/${post.slug}`)).length).toBe(1);
    }
    for (const slug of Object.keys(docArticles)) {
      expect(urls.filter((u) => u.endsWith(`/docs/${slug}`)).length).toBe(1);
    }
  });
});
