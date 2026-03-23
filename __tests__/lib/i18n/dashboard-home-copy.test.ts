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
    expect(it.agencyBoost.productName.length).toBeGreaterThan(3);
    expect(en.plans.free).toMatch(/free/i);
    const es = getTranslation('es').landing.pricing;
    const pt = getTranslation('pt').landing.pricing;
    expect(es.tableCells.multiUserAgency).toContain('10');
    expect(pt.agencyBoost.oneTimePayment.length).toBeGreaterThan(5);
    expect(es.agencyBoost.productName.length).toBeGreaterThan(3);
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

  it('marketing home trusted logos, hero stat values, step2 demo score label', () => {
    const it = getTranslation('it').landing;
    expect(it.hero.trustedPortalLogos).toHaveLength(4);
    expect(it.hero.trustedPortalLogos[0]).toMatch(/Idealista/i);
    expect(it.hero.statsValues.automation).toContain('24');
    expect(it.hero.statsValues.conversionRate.length).toBeGreaterThan(0);
    expect(it.searchEngine.step2.demoScoreLabel).toContain('{score}');
    const ar = getTranslation('ar').landing;
    expect(ar.hero.statsValues.conversionRate).toContain('80');
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

  it('liveFeed native ES/FR/DE/PT/AR (not EN merge)', () => {
    const es = getTranslation('es').dashboard.liveFeed;
    const en = getTranslation('en').dashboard.liveFeed;
    expect(es.infixDeal).toContain('detectada');
    expect(es.subtitle.toLowerCase()).toMatch(/global|tiempo|real/);
    expect(es.cta).not.toBe(en.cta);
    expect(getTranslation('fr').dashboard.liveFeed.infixCall).toContain('planifi');
    expect(getTranslation('de').dashboard.liveFeed.infixDeal).toContain('erkannt');
    expect(getTranslation('pt').dashboard.liveFeed.priceDrop.toLowerCase()).toMatch(/preço|preco/);
    expect(getTranslation('ar').dashboard.liveFeed.subtitle.length).toBeGreaterThan(5);
  });

  it('liveNetwork for ES and AR', () => {
    expect(getTranslation('es').dashboard.liveNetwork.liveBadge).toBe('EN VIVO');
    expect(getTranslation('ar').dashboard.liveNetwork.cardTitle).toContain('PropertyPilot');
  });

  it('dashboardToasts native per locale (no emoji titles; placeholders in limitNearDesc)', () => {
    const en = getTranslation('en').dashboardToasts;
    expect(en.boostActivated).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(en.limitNearDesc).toContain('{used}');
    expect(en.limitNearDesc).toContain('{lim}');

    const it = getTranslation('it').dashboardToasts;
    expect(it.agencyActive.toLowerCase()).toMatch(/attiv|intelligence/);
    expect(it.checkoutCanceledDesc.toLowerCase()).toMatch(/fatturaz|billing/);

    const es = getTranslation('es').dashboardToasts;
    expect(es.paymentDone.toLowerCase()).toMatch(/pago|complet/);
    expect(es.boostDesc).not.toBe(en.boostDesc);

    expect(getTranslation('fr').dashboardToasts.checkoutCanceled.toLowerCase()).toMatch(/annul|paiement/);
    expect(getTranslation('de').dashboardToasts.limitNear.toLowerCase()).toMatch(/limit|erreicht/);
    expect(getTranslation('pt').dashboardToasts.agencyDesc.toLowerCase()).toMatch(/bem-vindo|propertypilot/);
    expect(getTranslation('ar').dashboardToasts.paymentDone.length).toBeGreaterThan(3);
  });

  it('stats3d, sniperStats, regionalPortals keys for EN', () => {
    const d = getTranslation('en').dashboard;
    expect(d.stats3d.openedOfSent).toContain('{opened}');
    expect(d.sniperStats.title).toBeTruthy();
    expect(d.regionalPortals.regionEurope).toBe('Europe');
    expect(d.regionalPortals.unitSqm).toBe('m²');
  });

  it('stats3d, sniperStats, regionalPortals, profitDashboard native ES/DE/PT/AR', () => {
    const en = getTranslation('en').dashboard;
    const es = getTranslation('es').dashboard;
    expect(es.stats3d.projects3d.toLowerCase()).toMatch(/proyecto/);
    expect(es.sniperStats.loadError).not.toBe(en.sniperStats.loadError);
    expect(es.regionalPortals.title.toLowerCase()).toMatch(/portal/);
    expect(es.profitDashboard.hours).toBe('h');
    expect(es.profitDashboard.title.toLowerCase()).toMatch(/roi/);

    const de = getTranslation('de').dashboard;
    expect(de.stats3d.whatsappOpen).toContain('WhatsApp');
    expect(de.sniperStats.offline120.toLowerCase()).toMatch(/offline|objekt/);
    expect(de.regionalPortals.primaryMarkets.toLowerCase()).toMatch(/prim/);
    expect(de.profitDashboard.amazing).toBe('Großartig!');

    const pt = getTranslation('pt').dashboard;
    expect(pt.stats3d.noMessages.toLowerCase()).toMatch(/mensagem|ainda/);
    expect(pt.sniperStats.title).toContain('Sniper');
    expect(pt.profitDashboard.saved10Hours.toLowerCase()).toMatch(/10|hora/);

    const ar = getTranslation('ar').dashboard;
    expect(ar.regionalPortals.regionMiddleEast.length).toBeGreaterThan(3);
    expect(ar.profitDashboard.title.length).toBeGreaterThan(5);
    expect(ar.sniperStats.last48h).toContain('48');
  });

  it('profitDashboard and morningBriefing for IT/EN', () => {
    const it = getTranslation('it').dashboard;
    const en = getTranslation('en').dashboard;
    expect(it.profitDashboard.title).toContain('ROI');
    expect(en.profitDashboard.hours).toBe('hrs');
    expect(it.morningBriefing.sendTest).toBeTruthy();
    expect(en.morningBriefing.subtitle).toContain('market gap');
  });

  it('morningBriefing + competitorRadar native ES/FR/DE/PT/AR', () => {
    const en = getTranslation('en').dashboard;
    const es = getTranslation('es').dashboard;
    expect(es.morningBriefing.title.toLowerCase()).toMatch(/briefing|hoy/);
    expect(es.morningBriefing.subtitle).not.toBe(en.morningBriefing.subtitle);
    expect(es.competitorRadar.title.toLowerCase()).toMatch(/radar/);
    expect(es.competitorRadar.refreshAria.toLowerCase()).toMatch(/actualizar|lista/);

    expect(getTranslation('fr').dashboard.morningBriefing.fomo.toLowerCase()).toMatch(/offres|envoy/);
    expect(getTranslation('de').dashboard.competitorRadar.offlineFor.toLowerCase()).toMatch(/offline|seit/);
    expect(getTranslation('pt').dashboard.morningBriefing.sendTest.toLowerCase()).toMatch(/telemóvel|telefone|móvel/);
    expect(getTranslation('ar').dashboard.competitorRadar.subtitle.length).toBeGreaterThan(10);
    expect(getTranslation('ar').dashboard.morningBriefing.configure.length).toBeGreaterThan(2);
  });

  it('competitorRadar and planCards for EN', () => {
    const d = getTranslation('en').dashboard;
    expect(d.competitorRadar.refreshAria).toBe('Refresh list');
    expect(d.planCards.buyAgencyBoost).toContain('Agency Boost');
    expect(d.planCards.allFreeFeatures).toContain('Free');
  });

  it('planCards + onboardingChecklist native ES/FR/DE/PT/AR', () => {
    const en = getTranslation('en').dashboard;
    const es = getTranslation('es').dashboard;
    expect(es.planCards.generateNewListing.toLowerCase()).toMatch(/generar|anuncio/);
    expect(es.planCards.buyAgencyBoost).not.toBe(en.planCards.buyAgencyBoost);
    expect(es.onboardingChecklist.progress).toContain('{done}');
    expect(es.onboardingChecklist.steps.generate.cta).toContain('Perfect Copy');

    expect(getTranslation('fr').dashboard.planCards.oneTime.toLowerCase()).toMatch(/unique|paiement/);
    expect(getTranslation('de').dashboard.onboardingChecklist.dismiss).toBe('Ausblenden');
    expect(getTranslation('pt').dashboard.planCards.linkAnalysis.toLowerCase()).toMatch(/link|análise/);
    expect(getTranslation('ar').dashboard.onboardingChecklist.title.length).toBeGreaterThan(5);
    expect(getTranslation('ar').dashboard.planCards.teamUpToAgents).toContain('10');
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
    expect(enB.planBadgeStarter).toMatch(/Starter/i);
    expect(itB.planBadgeAgency).toMatch(/Agency/i);
    const itW = getTranslation('it').dashboard.workspacePage;
    expect(itW.heroTitle).toContain('Control');
    expect(itW.trialDesc).toContain('{days}');
    expect(itW.modules.scraper.name).toBeTruthy();
  });

  it('leadsPage and predatorLiveBadge for IT/EN', () => {
    const itL = getTranslation('it').dashboard.leadsPage;
    const enL = getTranslation('en').dashboard.leadsPage;
    expect(itL.leadManagerTitle).toContain('Lead');
    expect(itL.marketItalyCode).toBe('IT');
    expect(enL.badgeTopDeal).toMatch(/TOP/i);
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

  it('leadDetailPage + communicationsHub native ES/FR/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.leadDetailPage.enrichStart.toLowerCase()).toMatch(/ia|ai/);
    expect(es.communicationsHub.generateWithAI.toLowerCase()).toMatch(/ia|ai/);
    expect(getTranslation('fr').dashboard.leadDetailPage.backToLeads.toLowerCase()).toMatch(/lead/);
    expect(getTranslation('ar').dashboard.communicationsHub.hubTitle.length).toBeGreaterThan(2);
  });

  it('leadPipelinePage for IT/EN', () => {
    const itP = getTranslation('it').dashboard.leadPipelinePage;
    const enP = getTranslation('en').dashboard.leadPipelinePage;
    expect(itP.movedTo).toContain('{label}');
    expect(enP.automationRules).toContain('{count}');
    expect(enP.legendHot).toContain('Hot');
    expect(itP.heroBadge).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(enP.automationApplied).not.toMatch(/⚡/);
  });

  it('leadsPage + leadPipelinePage native ES/FR/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.leadsPage.addLead.toLowerCase()).toMatch(/lead|añadir/);
    expect(es.leadPipelinePage.heroSubtitle.toLowerCase()).toMatch(/arrastr|columna/);
    expect(getTranslation('fr').dashboard.leadsPage.marketItaly).toMatch(/Italie/i);
    expect(getTranslation('ar').dashboard.leadPipelinePage.dashboardLink.length).toBeGreaterThan(2);
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
    expect(itR.triggers.new_lead.iconKey).toBe('userPlus');
    expect(enR.triggers.email_sent.iconKey).toBe('mail');
    expect(itR.howItWorksList.length).toBeGreaterThanOrEqual(4);
  });

  it('crmApiKeysPage + crmAutomationRulesPage native ES/DE/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.crmApiKeysPage.leadsCaptured).toContain('{count}');
    expect(es.crmAutomationRulesPage.tabRules).toContain('{count}');
    expect(es.crmAutomationRulesPage.triggers.new_lead.iconKey).toBe('userPlus');
    expect(getTranslation('de').dashboard.crmApiKeysPage.pageTitle.toLowerCase()).toMatch(/crm/);
    expect(getTranslation('ar').dashboard.crmAutomationRulesPage.pageTitle.length).toBeGreaterThan(3);
  });

  it('workflowAutomationsPage for IT/EN', () => {
    const itW = getTranslation('it').dashboard.workflowAutomationsPage;
    const enW = getTranslation('en').dashboard.workflowAutomationsPage;
    expect(itW.activeCount).toContain('{count}');
    expect(enW.automationTypes.followup.label.length).toBeGreaterThan(3);
    expect(itW.emailTypes.length).toBeGreaterThanOrEqual(6);
    expect(enW.repeatIntervals.map((x) => x.value)).toEqual(['once', 'daily', 'weekly']);
  });

  it('workflowAutomationsPage native ES/FR/AR', () => {
    const es = getTranslation('es').dashboard.workflowAutomationsPage;
    expect(es.crmRulesLink.toLowerCase()).toMatch(/crm/);
    expect(es.pageSubtitle.length).toBeGreaterThan(40);
    expect(getTranslation('fr').dashboard.workflowAutomationsPage.submitCreate.length).toBeGreaterThan(5);
    expect(getTranslation('ar').dashboard.workflowAutomationsPage.yourAutomations.length).toBeGreaterThan(3);
  });

  it('agencyBrandingPage for IT/EN', () => {
    const itB = getTranslation('it').dashboard.agencyBrandingPage;
    const enB = getTranslation('en').dashboard.agencyBrandingPage;
    expect(itB.previewFeatures.length).toBe(3);
    expect(enB.previewPriceSample).toMatch(/\$|€/);
    expect(itB.loadErrorGeneric.length).toBeGreaterThan(5);
    expect(enB.emailLabel.toLowerCase()).toContain('mail');
    expect(itB.badgeWhiteLabel).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(enB.badgeWhiteLabel.toLowerCase()).toContain('white');
  });

  it('notificationsSettingsPage for IT/EN', () => {
    const itN = getTranslation('it').dashboard.notificationsSettingsPage;
    const enN = getTranslation('en').dashboard.notificationsSettingsPage;
    expect(itN.previewSampleLines.length).toBe(3);
    expect(enN.previewHeader).toContain('TOP 3');
    expect(itN.previewHeader).not.toMatch(/🔥/);
    expect(itN.planPro).toBe('Pro');
    expect(enN.testChannelsRequired.toLowerCase()).toMatch(/email|whatsapp/);
  });

  it('agencyBranding + notifications + packages native ES/DE/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.agencyBrandingPage.pageTitle.length).toBeGreaterThan(5);
    expect(es.notificationsSettingsPage.previewHeader).toContain('TOP 3');
    expect(es.packagesPage.boostTagline.length).toBeGreaterThan(8);
    expect(getTranslation('de').dashboard.packagesPage.tabPackages.length).toBeGreaterThan(3);
    expect(getTranslation('ar').dashboard.notificationsSettingsPage.cardTitle.length).toBeGreaterThan(3);
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
    expect(itP.tipoTransazione[0].iconKey).toBe('tag');
    expect(itP.targetCliente[0].iconKey).toBe('users');
    expect(itP.heroBadge).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });

  it('agencyAssistant + referral + perfectCopy native ES/FR/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.agencyAssistantPage.title).toContain('Assistant');
    expect(es.referralPage.programTitle.toLowerCase()).toMatch(/refer|programa/);
    expect(es.perfectCopyPage.copyPackTitle).toBe('TÍTULO');
    expect(getTranslation('fr').dashboard.perfectCopyPage.heroBadge.length).toBeGreaterThan(5);
    expect(getTranslation('ar').dashboard.referralPage.step1Title.length).toBeGreaterThan(3);
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
    expect(itP.eliteDealBadge).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(enP.callNow.toUpperCase()).toContain('CALL');
    expect(itP.nextAction.priceDrop.reasoning).toContain('{pct}');
    expect(enP.nextAction.estMinutes).toContain('{n}');
    const esP = getTranslation('es').dashboard.prospectingPage;
    expect(esP.heroTitle.toLowerCase()).toMatch(/arbitr|comando|centro/);
    expect(esP.nextAction.monitor.action).not.toBe(enP.nextAction.monitor.action);
    expect(esP.nextAction.priceDrop.action.toLowerCase()).toMatch(/informe|reporte/);
    const frP = getTranslation('fr').dashboard.prospectingPage;
    expect(frP.nextAction.estMinutes).toContain('{n}');
    expect(frP.colNextAction.toLowerCase()).toMatch(/action|prochaine/);
    expect(getTranslation('de').dashboard.prospectingPage.heroTitle).toMatch(/Arbitrage|Kommando/i);
    expect(getTranslation('ar').dashboard.prospectingPage.colNextAction.length).toBeGreaterThan(3);
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

  it('refine, translate, listings library, titles, hashtags, social posts (IT/EN + ES native)', () => {
    const itD = getTranslation('it').dashboard;
    const enD = getTranslation('en').dashboard;
    expect(itD.refineListingPage.transactionOptions[0].iconKey).toBe('tag');
    expect(enD.translateListingPage.successDescFresh).toContain('{lang}');
    expect(itD.listingsLibraryPage.sizeUnitSuffix).toBe('m²');
    expect(enD.titlesAbPage.generateButtonIdle.toLowerCase()).toMatch(/19|a\/b|title/);
    expect(itD.hashtagsPage.hashtagTitleVirali).toContain('{count}');
    expect(enD.socialPostsPage.heroBadge).toContain('IG');

    const es = getTranslation('es').dashboard;
    expect(es.refineListingPage.pageTitle).toContain('Perfect Again');
    expect(es.translateListingPage.heroTitle.toLowerCase()).toMatch(/traductor|multiling/);
    expect(es.listingsLibraryPage.pageTitle.toLowerCase()).toMatch(/anuncios guardados/);
    expect(es.titlesAbPage.heroTitle.toLowerCase()).toMatch(/título|generador/);
    expect(es.hashtagsPage.marketItaly.toLowerCase()).toMatch(/italia/);
    expect(es.socialPostsPage.heroBadge).toContain('TikTok');
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

  it('transactionTypes + leadScorePage (IT/EN; ES native bundle)', () => {
    const itD = getTranslation('it').dashboard;
    const enD = getTranslation('en').dashboard;
    expect(itD.transactionTypes.vendita).toMatch(/Vendita/i);
    expect(enD.transactionTypes.affitto_breve.toLowerCase()).toMatch(/short|vacation|rental/);
    expect(itD.leadScorePage.marketItaly).toMatch(/Italia/i);
    expect(enD.leadScorePage.categoryHot.toLowerCase()).toMatch(/hot/);
    expect(itD.leadScorePage.headerPriorityBadge.length).toBeGreaterThan(3);
    expect(itD.leadScorePage.analysisInSeconds).toContain('{seconds}');
    expect(enD.leadScorePage.factorLabels['Urgenza Percepita'].toLowerCase()).toMatch(/perceived|urgency/);
    const esD = getTranslation('es').dashboard;
    expect(esD.transactionTypes.vendita.toLowerCase()).toMatch(/venta/);
    expect(esD.transactionTypes.vendita).not.toBe(enD.transactionTypes.vendita);
    expect(esD.leadScorePage.pageTitle.toLowerCase()).toMatch(/lead|scoring/);
    expect(esD.leadScorePage.cacheBadge.toLowerCase()).toMatch(/caché|cache/);
    expect(esD.leadScorePage.cacheBadge).not.toBe(enD.leadScorePage.cacheBadge);
  });

  it('mapPage + opportunities + autopilot native for ES/FR/DE/PT/AR', () => {
    const es = getTranslation('es').dashboard;
    expect(es.mapPage.paywallSubtitle.toLowerCase()).toMatch(/agency|plan/);
    expect(es.opportunitiesPage.title.toLowerCase()).toMatch(/radar|oportunidad/);
    expect(es.autopilotPage.title.toLowerCase()).toMatch(/autopilot|mandat/);
    expect(getTranslation('fr').dashboard.mapPage.backToProspecting.toLowerCase()).toMatch(
      /prospecting|retour/
    );
    expect(getTranslation('de').dashboard.opportunitiesPage.cityPlaceholder).toBe('Berlin');
    expect(getTranslation('pt').dashboard.transactionTypes.affitto.toLowerCase()).toMatch(/arrend/);
    expect(getTranslation('ar').dashboard.mapPage.unlockAgency.length).toBeGreaterThan(3);
  });
});
