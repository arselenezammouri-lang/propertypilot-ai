import {
  buildAboutPageMetadata,
  buildBlogIndexMetadata,
  buildBlogPostPageMetadata,
  buildContactPageMetadata,
  buildDemoPageMetadata,
  buildDocArticlePageMetadata,
  buildDocsHubPageMetadata,
  buildPricingPageMetadata,
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

  it('demo, contact, pricing metadata differ by locale', () => {
    expect(buildDemoPageMetadata('it').title).not.toBe(buildDemoPageMetadata('en').title);
    expect(buildContactPageMetadata('it').title).not.toBe(buildContactPageMetadata('en').title);
    expect(buildPricingPageMetadata('it').title).not.toBe(buildPricingPageMetadata('en').title);
    expect((buildPricingPageMetadata('en').description as string).length).toBeGreaterThan(20);
  });

  it('blog post metadata uses known title and excerpt', () => {
    const slug = 'come-scrivere-annunci-che-convertono';
    const en = buildBlogPostPageMetadata('en', slug);
    expect(en.title).toBe('How to write listings that convert');
    expect((en.description as string).length).toBeGreaterThan(10);
    const it = buildBlogPostPageMetadata('it', slug);
    expect(it.title).toBe('Come scrivere annunci che convertono');
  });

  it('docs hub metadata is localized and has canonical', () => {
    const itHub = buildDocsHubPageMetadata('it');
    const enHub = buildDocsHubPageMetadata('en');
    expect(itHub.title).not.toBe(enHub.title);
    expect(itHub.alternates?.canonical).toMatch(/\/docs$/);
  });

  it('doc article metadata resolves welcome slug', () => {
    const slug = 'getting-started/welcome';
    const meta = buildDocArticlePageMetadata('it', slug);
    expect(meta).not.toBeNull();
    expect(meta!.title).toContain('Benvenuto');
    expect(meta!.alternates?.canonical).toContain(slug);
    expect(buildDocArticlePageMetadata('it', 'non-existent-slug-xyz')).toBeNull();
  });
});
