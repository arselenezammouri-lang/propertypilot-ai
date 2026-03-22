import { getTranslation } from '@/lib/i18n/dictionary';

describe('dashboard home copy (D1)', () => {
  it('dashboard header chrome keys for IT/EN and ES merge from EN', () => {
    const it = getTranslation('it').dashboard;
    const en = getTranslation('en').dashboard;
    expect(it.navAriaLabel.length).toBeGreaterThan(3);
    expect(en.commandPaletteOpenAria.toLowerCase()).toMatch(/search|quick|open/i);
    const es = getTranslation('es').dashboard;
    expect(es.navAriaLabel).toBe(en.navAriaLabel);
    expect(es.generate).toBeTruthy();
  });

  it('demo page extended keys for IT/EN', () => {
    const it = getTranslation('it').demo;
    const en = getTranslation('en').demo;
    expect(it.testimonialsList.length).toBe(3);
    expect(it.trustStats[0].iconKey).toBe('clock');
    expect(en.finalCta.titleAccent.length).toBeGreaterThan(2);
    expect(it.whatsappPrefill).toContain('PropertyPilot');
    expect(en.footerCopyrightLine).toContain('{year}');
  });

  it('marketing home pricing table cells + Agency Boost (IT/EN; ES/PT localized)', () => {
    const it = getTranslation('it').landing.pricing;
    const en = getTranslation('en').landing.pricing;
    expect(it.tableCells.multiUserAgency).toContain('10');
    expect(en.tableCells.voiceCallingPro.toLowerCase()).toMatch(/30/);
    expect(it.agencyBoost.cta.length).toBeGreaterThan(5);
    expect(en.agencyBoost.badgePremium.length).toBeGreaterThan(3);
    const es = getTranslation('es').landing.pricing;
    const pt = getTranslation('pt').landing.pricing;
    expect(es.tableCells.multiUserAgency).toContain('10');
    expect(pt.agencyBoost.oneTimePayment.length).toBeGreaterThan(5);
  });

  it('marketing home hero aria, feature CTAs, search-engine step label (IT/EN; PT merge)', () => {
    const it = getTranslation('it').landing;
    const en = getTranslation('en').landing;
    expect(it.hero.signupAriaLabel.length).toBeGreaterThan(10);
    expect(en.hero.demoDashboardAriaLabel.toLowerCase()).toMatch(/demo|dashboard/i);
    expect(it.features.aiListing.cta.length).toBeGreaterThan(3);
    expect(en.features.crmAI.cta.length).toBeGreaterThan(3);
    expect(it.searchEngine.stepLabel).toContain('{n}');
    expect(en.searchEngine.prospectingCycleCta).toMatch(/Scraper|Voice|CRM/i);
    const pt = getTranslation('pt').landing;
    expect(pt.hero.signupAriaLabel.length).toBeGreaterThan(8);
    expect(pt.searchEngine.stepLabel).toContain('{n}');
  });

  it('blog post page, pricing plans chrome, contact extras for IT/EN', () => {
    const it = getTranslation('it');
    const en = getTranslation('en');
    expect(it.blogPostPage.backToBlog.length).toBeGreaterThan(3);
    expect(it.blogPostPage.knownTitles['come-scrivere-annunci-che-convertono']).toContain('annunci');
    expect(en.blogPostPage.knownTitles['come-scrivere-annunci-che-convertono']).toMatch(/listing/i);
    expect(it.pricingPagePlans.starter.cta.length).toBeGreaterThan(3);
    expect(en.pricingPagePlans.footerCopyright).toContain('{year}');
    expect(it.contact.minCharsCounter).toContain('{current}');
    expect(en.contact.demoMailSubject.toLowerCase()).toMatch(/demo|property/i);
  });

  it('marketing and legal pages (IT/EN; ES merge EN)', () => {
    const it = getTranslation('it');
    const en = getTranslation('en');
    expect(it.marketingAbout.title).toContain('Chi');
    expect(en.marketingAbout.title).toMatch(/About/i);
    expect(it.marketingBlog.posts.length).toBe(3);
    expect(it.marketingFeatures.features.length).toBe(12);
    expect(it.privacyPolicyPage.sections.length).toBe(10);
    expect(en.termsPolicyPage.sections[0].title).toMatch(/Acceptance/i);
    expect(it.refundPolicyPage.guaranteeBodyStrong.length).toBeGreaterThan(5);
    expect(getTranslation('es').marketingBlog.subtitle).toBe(en.marketingBlog.subtitle);
  });

  it('errorBoundaryModule, welcomeTour, onboardingWizard for IT/EN; ES inherits EN', () => {
    const itE = getTranslation('it').errorBoundaryModule;
    const enE = getTranslation('en').errorBoundaryModule;
    expect(itE.boundary.title).toContain('storto');
    expect(enE.apiHandler.rateLimitError.toLowerCase()).toMatch(/request|too many/i);
    const wt = getTranslation('it').welcomeTour;
    expect(wt.dealLabel).toContain('{n}');
    expect(getTranslation('en').onboardingWizard.steps[0].title).toMatch(/PropertyPilot/i);
    expect(getTranslation('es').welcomeTour.welcomeTitle).toBe(getTranslation('en').welcomeTour.welcomeTitle);
  });

  it('dashboardNav and commandPaletteExtras for IT/EN; ES inherits EN nav', () => {
    const itNav = getTranslation('it').dashboardNav;
    const enNav = getTranslation('en').dashboardNav;
    expect(itNav.jtbd.content.heading).toContain('Contenuti');
    expect(enNav.jtbd.content.heading).toMatch(/Listings|content/i);
    expect(itNav.commandPalette.placeholder.length).toBeGreaterThan(5);
    expect(getTranslation('es').dashboardNav.jtbd.crm.heading).toBe(enNav.jtbd.crm.heading);
    const itExtras = getTranslation('it').commandPaletteExtras;
    expect(itExtras.quick['ql-billing'].label.length).toBeGreaterThan(2);
    expect(getTranslation('es').commandPaletteExtras.quick['ql-home'].label).toBe(
      getTranslation('en').commandPaletteExtras.quick['ql-home'].label
    );
  });

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

  it('crmAutomationRulesPage for IT/EN', () => {
    const itR = getTranslation('it').dashboard.crmAutomationRulesPage;
    const enR = getTranslation('en').dashboard.crmAutomationRulesPage;
    expect(itR.tabRules).toContain('{count}');
    expect(enR.executions).toContain('{count}');
    expect(itR.triggers.new_lead.label).toMatch(/lead/i);
    expect(enR.triggers.new_lead.label).toMatch(/lead/i);
    expect(itR.howItWorksList.length).toBeGreaterThanOrEqual(4);
  });

  it('workflowAutomationsPage for IT/EN', () => {
    const itW = getTranslation('it').dashboard.workflowAutomationsPage;
    const enW = getTranslation('en').dashboard.workflowAutomationsPage;
    expect(itW.activeCount).toContain('{count}');
    expect(enW.automationTypes.followup.label.length).toBeGreaterThan(3);
    expect(itW.emailTypes.length).toBeGreaterThanOrEqual(6);
    expect(enW.repeatIntervals.map((x) => x.value)).toEqual(['once', 'daily', 'weekly']);
  });

  it('agencyBrandingPage for IT/EN', () => {
    const itB = getTranslation('it').dashboard.agencyBrandingPage;
    const enB = getTranslation('en').dashboard.agencyBrandingPage;
    expect(itB.previewFeatures.length).toBe(3);
    expect(enB.previewPriceSample).toMatch(/\$|€/);
    expect(itB.loadErrorGeneric.length).toBeGreaterThan(5);
    expect(enB.emailLabel.toLowerCase()).toContain('mail');
  });

  it('notificationsSettingsPage for IT/EN', () => {
    const itN = getTranslation('it').dashboard.notificationsSettingsPage;
    const enN = getTranslation('en').dashboard.notificationsSettingsPage;
    expect(itN.previewSampleLines.length).toBe(3);
    expect(enN.previewHeader).toContain('TOP 3');
    expect(itN.planPro).toBe('Pro');
    expect(enN.testChannelsRequired.toLowerCase()).toMatch(/email|whatsapp/);
  });

  it('agencyAssistantPage for IT/EN', () => {
    const itA = getTranslation('it').dashboard.agencyAssistantPage;
    const enA = getTranslation('en').dashboard.agencyAssistantPage;
    expect(itA.quickSuggestions.length).toBe(6);
    expect(enA.quickSuggestions.every((q) => q.iconKey)).toBe(true);
    expect(itA.title).toContain('Assistant');
    expect(enA.backLink).toBe('Dashboard');
  });

  it('perfectCopyPage for IT/EN', () => {
    const itP = getTranslation('it').dashboard.perfectCopyPage;
    const enP = getTranslation('en').dashboard.perfectCopyPage;
    expect(itP.tipiImmobile.length).toBeGreaterThanOrEqual(15);
    expect(enP.copyPackTitle).toBe('TITLE');
    expect(itP.copyPackTitle).toBe('TITOLO');
    expect(itP.toni.length).toBe(3);
  });

  it('referralPage for IT/EN', () => {
    const itR = getTranslation('it').dashboard.referralPage;
    const enR = getTranslation('en').dashboard.referralPage;
    expect(itR.loadError.length).toBeGreaterThan(5);
    expect(enR.whatsappMessage).toContain('PropertyPilot');
    expect(itR.planPro).toBe('Pro');
  });

  it('packagesPage for IT/EN', () => {
    const itPk = getTranslation('it').dashboard.packagesPage;
    const enPk = getTranslation('en').dashboard.packagesPage;
    expect(itPk.boostFeatures.length).toBe(3);
    expect(enPk.boostTagline.length).toBeGreaterThan(5);
    expect(itPk.statusPending).toContain('sospeso');
  });

  it('prospectingPage for IT/EN', () => {
    const itP = getTranslation('it').dashboard.prospectingPage;
    const enP = getTranslation('en').dashboard.prospectingPage;
    expect(itP.callsRemaining).toContain('{n}');
    expect(enP.callsRemaining).toContain('{n}');
    expect(itP.liveFeedAiCalling).toContain('{title}');
    expect(enP.statusUpdatedDesc).toContain('{label}');
    expect(itP.imageInsightTags.length).toBeGreaterThanOrEqual(4);
  });

  it('analyzeLinkPage for IT/EN', () => {
    const itA = getTranslation('it').dashboard.analyzeLinkPage;
    const enA = getTranslation('en').dashboard.analyzeLinkPage;
    expect(itA.copiedToClipboard).toContain('{label}');
    expect(enA.heroTitleAccent.toLowerCase()).toContain('link');
    expect(itA.copyTitleSnippetLabel).toContain('{n}');
    expect(enA.badgeZillow).toContain('Zillow');
  });

  it('listingScraperPage for IT/EN', () => {
    const itS = getTranslation('it').dashboard.listingScraperPage;
    const enS = getTranslation('en').dashboard.listingScraperPage;
    expect(itS.moreFeatures).toContain('{n}');
    expect(enS.pageTitle.toLowerCase()).toContain('listing');
    expect(itS.suggestionHint).toBeTruthy();
    expect(enS.saveToLibrary.toLowerCase()).toContain('library');
  });

  it('listingAuditorPage for IT/EN', () => {
    const itA = getTranslation('it').dashboard.listingAuditorPage;
    const enA = getTranslation('en').dashboard.listingAuditorPage;
    expect(itA.analysisDoneDetail).toContain('{score}');
    expect(enA.auditPageTitle.toLowerCase()).toContain('audit');
    expect(itA.gravita.critica.length).toBeGreaterThan(2);
    expect(enA.connectionScore).toContain('{score}');
  });

  it('pendingCheckoutBanner and ariaLimitModal for IT/EN', () => {
    const itP = getTranslation('it').pendingCheckoutBanner;
    const enP = getTranslation('en').pendingCheckoutBanner;
    expect(itP.activateDesc).toContain('{name}');
    expect(enP.syncPlan).toContain('{plan}');
    const itM = getTranslation('it').ariaLimitModal;
    const enM = getTranslation('en').ariaLimitModal;
    expect(itM.desc).toContain('{used}');
    expect(enM.upgrades.free.features.length).toBe(3);
  });
});
