import {
  buildAboutPageMetadata,
  buildBlogIndexMetadata,
  buildBlogPostPageMetadata,
} from '@/lib/i18n/page-metadata-builders';

describe('page-metadata-builders', () => {
  it('about title uses marketing about title', () => {
    const it = buildAboutPageMetadata('it');
    expect(it.title).toBe('Chi siamo');
    expect(typeof it.description).toBe('string');
    expect((it.description as string).length).toBeGreaterThan(10);
  });

  it('blog title uses localized metaTitle', () => {
    expect(buildBlogIndexMetadata('en').title).toBe('Real estate blog');
    expect(buildBlogIndexMetadata('it').title).toBe('Blog immobiliare');
  });

  it('blog post metadata uses known title and excerpt', () => {
    const slug = 'come-scrivere-annunci-che-convertono';
    const en = buildBlogPostPageMetadata('en', slug);
    expect(en.title).toBe('How to write listings that convert');
    expect((en.description as string).length).toBeGreaterThan(10);
    const it = buildBlogPostPageMetadata('it', slug);
    expect(it.title).toBe('Come scrivere annunci che convertono');
  });
});
