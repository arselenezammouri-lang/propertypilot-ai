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

  it('mapPage keys for EN and placeholder in ghostListingDays', () => {
    const en = getTranslation('en').dashboard.mapPage;
    expect(en.loadError).toContain('map');
    expect(en.ghostListingDays).toContain('{days}');
    expect(en.marketGapTitle.toLowerCase()).toContain('market');
  });

  it('opportunitiesPage and autopilotPage for IT/EN', () => {
    const itO = getTranslation('it').dashboard.opportunitiesPage;
    const enO = getTranslation('en').dashboard.opportunitiesPage;
    expect(itO.filtersTitle).toContain('Filtri');
    expect(enO.filtersTitle.toLowerCase()).toContain('filter');
    const itA = getTranslation('it').dashboard.autopilotPage;
    const enA = getTranslation('en').dashboard.autopilotPage;
    expect(itA.saveToastTitle).toBeTruthy();
    expect(enA.configCardTitle).toContain('Rule');
  });

  it('billing fetch error + workspacePage for IT/EN', () => {
    const itB = getTranslation('it').billing;
    const enB = getTranslation('en').billing;
    expect(itB.retry).toBe('Riprova');
    expect(enB.subscriptionFetchErrorBody).toContain('Free');
    const itW = getTranslation('it').dashboard.workspacePage;
    expect(itW.heroTitle).toContain('Control');
    expect(itW.trialDesc).toContain('{days}');
    expect(itW.modules.scraper.name).toBeTruthy();
  });

  it('leadsPage and predatorLiveBadge for IT/EN', () => {
    const itL = getTranslation('it').dashboard.leadsPage;
    const enL = getTranslation('en').dashboard.leadsPage;
    expect(itL.leadManagerTitle).toContain('Lead');
    expect(enL.deleteWarning).toContain('{name}');
    expect(itL.leadCreatedDesc).toContain('{name}');
    const enB = getTranslation('en').dashboard.predatorLiveBadge;
    expect(enB.livePrefix).toMatch(/LIVE/i);
    expect(enB.predatorsOnline.toLowerCase()).toContain('predator');
  });

  it('leadDetailPage and communicationsHub for IT/EN', () => {
    const itD = getTranslation('it').dashboard.leadDetailPage;
    expect(itD.analysisDone).toContain('{ms}');
    const enH = getTranslation('en').dashboard.communicationsHub;
    expect(enH.newMessage).toContain('{channel}');
    expect(enH.historyToggle).toContain('{count}');
  });

  it('leadPipelinePage for IT/EN', () => {
    const itP = getTranslation('it').dashboard.leadPipelinePage;
    const enP = getTranslation('en').dashboard.leadPipelinePage;
    expect(itP.movedTo).toContain('{label}');
    expect(enP.automationRules).toContain('{count}');
    expect(enP.legendHot).toContain('Hot');
  });

  it('crmApiKeysPage for IT/EN', () => {
    const itC = getTranslation('it').dashboard.crmApiKeysPage;
    const enC = getTranslation('en').dashboard.crmApiKeysPage;
    expect(itC.leadsCaptured).toContain('{count}');
    expect(enC.deleteDialogBody).toContain('{name}');
    expect(itC.howToUseSteps.length).toBeGreaterThanOrEqual(4);
  });
});
