import { getTranslation } from '@/lib/i18n/dictionary';

describe('dashboard home copy (D1)', () => {
  it('it and en expose command center strings', () => {
    const it = getTranslation('it').dashboard;
    const en = getTranslation('en').dashboard;
    expect(it.commandCenterTitle).toBeTruthy();
    expect(it.commandCenterSubtitle).toBeTruthy();
    expect(it.newListingCta).toBeTruthy();
    expect(en.commandCenterTitle).toBeTruthy();
    expect(en.commandCenterSubtitle).toContain('plan');
    expect(en.newListingCta).toMatch(/listing/i);
  });

  it('non-english locales inherit from merge (es has strings)', () => {
    const es = getTranslation('es').dashboard;
    expect(es.commandCenterTitle).toBeTruthy();
    expect(es.newListingCta).toBeTruthy();
  });

  it('liveFeed and proTips exist for it and en', () => {
    const it = getTranslation('it').dashboard;
    const en = getTranslation('en').dashboard;
    expect(it.liveFeed.priceDropLine).toContain('Price Drop');
    expect(en.liveFeed.infixDeal).toBe('detected in');
    expect(it.proTips.title).toBeTruthy();
    expect(en.proTips.ariaSection).toBe('Pro Tips');
    expect(it.docsHubOpen).toContain('Documentation');
  });

  it('stats3d, sniperStats, regionalPortals keys for EN', () => {
    const d = getTranslation('en').dashboard;
    expect(d.stats3d.openedOfSent).toContain('{opened}');
    expect(d.sniperStats.title).toBeTruthy();
    expect(d.regionalPortals.regionEurope).toBe('Europe');
    expect(d.regionalPortals.unitSqm).toBe('m²');
  });

  it('profitDashboard and morningBriefing for IT/EN', () => {
    const it = getTranslation('it').dashboard;
    const en = getTranslation('en').dashboard;
    expect(it.profitDashboard.title).toContain('ROI');
    expect(en.profitDashboard.hours).toBe('hrs');
    expect(it.morningBriefing.sendTest).toBeTruthy();
    expect(en.morningBriefing.subtitle).toContain('market gap');
  });

  it('competitorRadar and planCards for EN', () => {
    const d = getTranslation('en').dashboard;
    expect(d.competitorRadar.refreshAria).toBe('Refresh list');
    expect(d.planCards.buyAgencyBoost).toContain('Agency Boost');
    expect(d.planCards.allFreeFeatures).toContain('Free');
  });

  it('planFeatures (all-tools grid) for IT/EN and merge for ES', () => {
    const it = getTranslation('it').dashboard.planFeatures;
    const en = getTranslation('en').dashboard.planFeatures;
    expect(it.chrome.plan).toBe('Piano');
    expect(en.chrome.plan).toBe('Plan');
    expect(it.items.generate.name).toContain('Annuncio');
    expect(en.items.generate.name).toMatch(/listing/i);
    const es = getTranslation('es').dashboard.planFeatures;
    expect(es.chrome.plan).toBe('Plan');
    expect(es.items.generate.name).toMatch(/listing/i);
  });
});
