import { getBaseUrl } from '@/lib/env';
import {
  buildAboutPageMetadata,
  buildAuthForgotPasswordPageMetadata,
  buildAuthLoginPageMetadata,
  buildAuthResetPasswordPageMetadata,
  buildAuthSignupPageMetadata,
  buildBlogIndexMetadata,
  buildBlogPostPageMetadata,
  buildCanonicalPath,
  buildCompliancePageMetadata,
  buildContactAliasPageMetadata,
  buildContactPageMetadata,
  buildDemoPageMetadata,
  buildDevTestErrorPageMetadata,
  buildDocArticlePageMetadata,
  buildDocsHubPageMetadata,
  buildPricingPageMetadata,
} from '@/lib/i18n/page-metadata-builders';

describe('page-metadata-builders', () => {
  it('buildCanonicalPath normalizes base and root', () => {
    const base = getBaseUrl().replace(/\/$/, '');
    expect(buildCanonicalPath('/')).toBe(`${base}/`);
    expect(buildCanonicalPath('/about')).toBe(`${base}/about`);
    expect(buildCanonicalPath('pricing')).toBe(`${base}/pricing`);
  });

  it('about title uses marketing about title', () => {
    const it = buildAboutPageMetadata('it');
    expect(it.title).toBe('Chi siamo');
    expect(typeof it.description).toBe('string');
    expect((it.description as string).length).toBeGreaterThan(10);
    expect(it.alternates?.canonical).toMatch(/\/about$/);
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
    expect(en.alternates?.canonical).toContain(slug);
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

  it('forgot and reset password metadata are localized with canonical', () => {
    const itF = buildAuthForgotPasswordPageMetadata('it');
    const enF = buildAuthForgotPasswordPageMetadata('en');
    expect(itF.title).not.toBe(enF.title);
    expect(itF.alternates?.canonical).toMatch(/\/auth\/forgot-password$/);
    const itR = buildAuthResetPasswordPageMetadata('it');
    expect(itR.alternates?.canonical).toMatch(/\/auth\/reset-password$/);
    expect((itR.description as string).length).toBeGreaterThan(15);
  });

  it('dev test-error metadata is noindex with canonical', () => {
    const meta = buildDevTestErrorPageMetadata('en');
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates?.canonical).toMatch(/\/dashboard\/test-error$/);
  });

  it('auth login and signup metadata differ by locale and set canonical', () => {
    expect(buildAuthLoginPageMetadata('it').title).not.toBe(
      buildAuthLoginPageMetadata('en').title
    );
    expect(buildAuthLoginPageMetadata('en').alternates?.canonical).toMatch(/\/auth\/login$/);
    expect(buildAuthSignupPageMetadata('it').title).not.toBe(
      buildAuthSignupPageMetadata('en').title
    );
    expect(buildAuthSignupPageMetadata('en').alternates?.canonical).toMatch(/\/auth\/signup$/);
  });

  it('contact alias uses same title as contatti but canonical /contatti', () => {
    const itAlias = buildContactAliasPageMetadata('it');
    const itMain = buildContactPageMetadata('it');
    expect(itAlias.title).toBe(itMain.title);
    expect(itAlias.alternates?.canonical).toMatch(/\/contatti$/);
  });

  it('compliance page metadata is localized with canonical', () => {
    const itC = buildCompliancePageMetadata('it');
    const enC = buildCompliancePageMetadata('en');
    expect(itC.title).not.toBe(enC.title);
    expect(itC.alternates?.canonical).toMatch(/\/compliance$/);
    expect((itC.description as string).length).toBeGreaterThan(20);
  });
});
