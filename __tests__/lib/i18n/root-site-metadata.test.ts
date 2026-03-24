import { buildMarketingHomeMetadata, buildRootSiteMetadata } from '@/lib/i18n/root-site-metadata';

describe('root-site-metadata', () => {
  it('root default title differs by locale', () => {
    const it = buildRootSiteMetadata('it');
    const en = buildRootSiteMetadata('en');
    expect(it.title).toBeDefined();
    expect(en.title).toBeDefined();
    expect(JSON.stringify(it.title)).not.toBe(JSON.stringify(en.title));
  });

  it('marketing home title segment matches hero parts', () => {
    const it = buildMarketingHomeMetadata('it');
    expect(it.title).toContain('AI');
    expect((it.description as string).length).toBeGreaterThan(20);
  });
});
