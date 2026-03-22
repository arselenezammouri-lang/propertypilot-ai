/**
 * PropertyPilot AI - Internationalization Dictionary
 * Support: IT, EN, ES, FR, DE, PT, AR
 */

import type { PlanFeaturesUi } from '@/lib/i18n/plan-features-ui';
import { planFeaturesUiEn, planFeaturesUiIt } from '@/lib/i18n/plan-features-ui';
import type { LeadsPageUi } from '@/lib/i18n/leads-page-ui';
import { leadsPageUiEn, leadsPageUiIt } from '@/lib/i18n/leads-page-ui';
import type { LeadDetailPageUi } from '@/lib/i18n/lead-detail-page-ui';
import { leadDetailPageUiEn, leadDetailPageUiIt } from '@/lib/i18n/lead-detail-page-ui';
import type { CommunicationsHubUi } from '@/lib/i18n/communications-hub-ui';
import { communicationsHubUiEn, communicationsHubUiIt } from '@/lib/i18n/communications-hub-ui';
import type { LeadPipelinePageUi } from '@/lib/i18n/lead-pipeline-page-ui';
import { leadPipelinePageUiEn, leadPipelinePageUiIt } from '@/lib/i18n/lead-pipeline-page-ui';
import type { CrmApiKeysPageUi } from '@/lib/i18n/crm-api-keys-page-ui';
import { crmApiKeysPageUiEn, crmApiKeysPageUiIt } from '@/lib/i18n/crm-api-keys-page-ui';
import type { CrmAutomationRulesPageUi } from '@/lib/i18n/crm-automation-rules-page-ui';
import {
  crmAutomationRulesPageUiEn,
  crmAutomationRulesPageUiIt,
} from '@/lib/i18n/crm-automation-rules-page-ui';
import type { WorkflowAutomationsPageUi } from '@/lib/i18n/workflow-automations-page-ui';
import {
  workflowAutomationsPageUiEn,
  workflowAutomationsPageUiIt,
} from '@/lib/i18n/workflow-automations-page-ui';

export type SupportedLocale = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ar';

export interface TranslationDictionary {
  // Dashboard General
    dashboard: {
      title: string;
      subtitle: string;
      loading: string;
      error: string;
      success: string;
      generate: string;
      signOut: string;
      currentPlan: string;
      dashboardAI: string;
      thisMonth: string;
      saved: string;
      noSavedListings: string;
      planFree: string;
      planStarter: string;
      planPro: string;
      planAgency: string;
      remainingListings: string;
      unlimitedAvailable: string;
      chooseYourPlan: string;
      activeBadge: string;
      yourCurrentPlan: string;
      forBeginners: string;
      forProfs: string;
      forTeam: string;
      freePrice: string;
      choosePlan: string;
      startFree: string;
      upgradeToStarter: string;
      upgradeToPro: string;
      upgradeToAgency: string;
      mapTitle: string;
      mapSubtitle: string;
      mapGhostListings: string;
      mapRefresh: string;
      mapLegend: string;
      mapTopDeal: string;
      mapHighUrgency: string;
      mapWarm: string;
      mapCold: string;
      mapCallLaunched: string;
      mapCallError: string;
      mapLanciaChiamata: string;
      /** Predator / territory map page (`/dashboard/map`) */
      mapPage: {
        loadError: string;
        callStartedDesc: string;
        paywallSubtitle: string;
        paywallCardDesc: string;
        unlockAgency: string;
        backToProspecting: string;
        backAria: string;
        topDealsOnly: string;
        topDealsOnlyShort: string;
        ghostShort: string;
        mapTitleShort: string;
        kpiMappedListings: string;
        kpiTopDeals: string;
        kpiHighUrgency: string;
        emptyNoListings: string;
        emptyNoGhosts: string;
        emptyEnableGhostHint: string;
        closeDetailAria: string;
        badgeTopDeal: string;
        badgeHighUrgency: string;
        urgencyScoreTitle: string;
        ghostListingDays: string;
        marketGapTitle: string;
        marketGapVsArea: string;
        preview3dTitle: string;
        quickActionsTitle: string;
        callingInProgress: string;
        whatsappProjectCta: string;
        viewOriginalListing: string;
      };
      /** `/dashboard/opportunities` */
      opportunitiesPage: {
        title: string;
        subtitle: string;
        type: string;
        underpriced: string;
        old: string;
        uncontacted: string;
        city: string;
        cityPlaceholder: string;
        oldDays: string;
        loading: string;
        refresh: string;
        results: string;
        noResults: string;
        selectListing: string;
        loadingResults: string;
        loadFailed: string;
        unknown: string;
        status: string;
        na: string;
        filtersTitle: string;
        filtersDescription: string;
      };
      /** `/dashboard/autopilot` */
      autopilotPage: {
        title: string;
        subtitle: string;
        active: string;
        rulePlaceholder: string;
        city: string;
        region: string;
        minPrice: string;
        maxPrice: string;
        runHour: string;
        dailyLimit: string;
        saving: string;
        save: string;
        lastRuns: string;
        noRuns: string;
        opportunities: string;
        leads: string;
        recentActions: string;
        noActions: string;
        defaultRule: string;
        loadError: string;
        saveSuccess: string;
        saveError: string;
        saveToastTitle: string;
        configCardTitle: string;
        configCardDescription: string;
      };
      /** `/dashboard/settings/workspace` — moduli e preferenze */
      workspacePage: {
        loading: string;
        heroTitle: string;
        heroSubtitle: string;
        trialActive: string;
        trialDesc: string;
        howItWorks: string;
        howItWorksBullets: string[];
        prefsTitle: string;
        prefsSubtitle: string;
        timezoneLabel: string;
        timezoneHint: string;
        previewLabel: string;
        insufficientPlan: string;
        insufficientPlanDesc: string;
        moduleUpdated: string;
        moduleEnabled: string;
        moduleDisabled: string;
        errorTitle: string;
        saveError: string;
        trialBadge: string;
        modules: {
          scraper: { name: string; desc: string };
          ai_voice: { name: string; desc: string };
          '3d_staging': { name: string; desc: string };
          price_sniper: { name: string; desc: string };
          commercial: { name: string; desc: string };
          territory_map: { name: string; desc: string };
          smart_briefing: { name: string; desc: string };
          xray_vision: { name: string; desc: string };
          competitor_radar: { name: string; desc: string };
        };
        timezoneRegions: {
          EU: string;
          US: string;
          NA: string;
          LATAM: string;
          ME: string;
          APAC: string;
          UTC: string;
        };
      };
      /** `/dashboard/leads` — Lead Manager + AI */
      leadsPage: LeadsPageUi;
      /** `/dashboard/leads/pipeline` — Kanban */
      leadPipelinePage: LeadPipelinePageUi;
      /** `/dashboard/crm/settings` — API keys & embed */
      crmApiKeysPage: CrmApiKeysPageUi;
      /** `/dashboard/crm/automations` — if/then CRM rules */
      crmAutomationRulesPage: CrmAutomationRulesPageUi;
      /** `/dashboard/automations` — scheduled workflows */
      workflowAutomationsPage: WorkflowAutomationsPageUi;
      /** `/dashboard/leads/[id]` */
      leadDetailPage: LeadDetailPageUi;
      /** Hub comunicazioni nel dettaglio lead */
      communicationsHub: CommunicationsHubUi;
      /** Badge temporaneo su mappa prospecting */
      predatorLiveBadge: {
        livePrefix: string;
        predatorsOnline: string;
      };
      onboardingChecklist: {
        title: string;
        subtitle: string;
        dismiss: string;
        dismissAria: string;
        progress: string;
        allDone: string;
        steps: {
          generate: { title: string; description: string; cta: string };
          library: { title: string; description: string; cta: string };
          pipeline: { title: string; description: string; cta: string };
          billing: { title: string; description: string; cta: string };
          workspace: { title: string; description: string; cta: string };
        };
      };
      contextualHelp: {
        openGuideAria: string;
        openGuideTooltip: string;
        fieldHintAria: string;
      };
      /** Home /dashboard — Fase D1 (IT/EN in repo; altre lingue → merge da EN) */
      commandCenterTitle: string;
      commandCenterSubtitle: string;
      newListingCta: string;
      /** Live feed widget (dashboard home) */
      liveFeed: {
        deal: string;
        call: string;
        staging: string;
        priceDrop: string;
        subtitle: string;
        cta: string;
        infixDeal: string;
        infixCall: string;
        infixStaging: string;
        priceDropLine: string;
      };
      /** Suggerimenti in fondo alla dashboard */
      proTips: {
        ariaSection: string;
        title: string;
        tip1: string;
        tip2: string;
        tip3: string;
      };
      docsHubOpen: string;
      stats3d: {
        projects3d: string;
        generated: string;
        whatsappOpen: string;
        openRate: string;
        aiViews: string;
        /** Placeholders: {opened}, {sent} */
        openedOfSent: string;
        noMessages: string;
      };
      sniperStats: {
        title: string;
        priceDropsToday: string;
        detected: string;
        expirations: string;
        opportunities: string;
        last48h: string;
        offline120: string;
        loadError: string;
      };
      regionalPortals: {
        title: string;
        primaryMarkets: string;
        secondaryMarkets: string;
        currency: string;
        units: string;
        regionUsa: string;
        regionEurope: string;
        regionMiddleEast: string;
        regionGlobal: string;
        unitSqft: string;
        unitSqm: string;
      };
      profitDashboard: {
        title: string;
        hoursSaved: string;
        hours: string;
        perListing: string;
        valueGenerated: string;
        estimatedValue: string;
        generatedListings: string;
        amazing: string;
        saved10Hours: string;
      };
      morningBriefing: {
        na: string;
        sent: string;
        sentDesc: string;
        error: string;
        sendError: string;
        connectionError: string;
        title: string;
        subtitle: string;
        configure: string;
        priceDown: string;
        highUrgency: string;
        target: string;
        fomo: string;
        partnerAgencies: string;
        sendTest: string;
      };
      competitorRadar: {
        na: string;
        title: string;
        subtitle: string;
        removed: string;
        stale: string;
        aiNote: string;
        offlineFor: string;
        days: string;
        viewAll: string;
        refreshAria: string;
      };
      /** Card piani su /dashboard — allineate a Stripe config; prezzi da formattare con valuta utente */
      planCards: {
        generateNewListing: string;
        aiScraper: string;
        linkAnalysis: string;
        premiumPdfCards: string;
        allFreeFeatures: string;
        leadScoringAi: string;
        perfectCopy20: string;
        translator12Languages: string;
        allStarterFeatures: string;
        fullCrmPipeline: string;
        virtualStaging3d: string;
        aiVoiceCallingMonthly: string;
        agencyAssistantAi: string;
        allProFeatures: string;
        unlimitedAiVoiceCalling: string;
        auraVrVirtualTour: string;
        teamUpToAgents: string;
        omnichannelSuite: string;
        agencyBoostTitle: string;
        agencyBoostSubtitle: string;
        oneTime: string;
        boostSetupComplete: string;
        boostOnboarding: string;
        boostLaunchSupport: string;
        boostCustomConfig: string;
        buyAgencyBoost: string;
      };
      /** Griglia "Tutti gli strumenti" (DashboardPlanFeatures) — IT/EN autorevoli; altre lingue da EN */
      planFeatures: PlanFeaturesUi;
    };

  // Auth (Login / Signup)
  auth: {
    backToHome: string;
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      forgotPassword: string;
      signIn: string;
      signingIn: string;
      newTo: string;
      createFreeAccount: string;
      secureNote: string;
    };
    signup: {
      title: string;
      subtitle: string;
      fullName: string;
      email: string;
      password: string;
      minChars: string;
      freePlanIncludes: string;
      listingsPerMonth: string;
      allAIFeatures: string;
      noCreditCard: string;
      createFreeAccount: string;
      creatingAccount: string;
      alreadyHaveAccount: string;
      signInInstead: string;
      termsAgreeBefore: string;
      termsAgreeAnd: string;
    };
    toast: {
      error: string;
      fillAllFields: string;
      tooManyAttempts: string;
      rateLimitMsg: string;
      welcomeBack: string;
      completePayment: string;
      loginSuccess: string;
      accountCreated: string;
      redirectPayment: string;
      welcomePropertyPilot: string;
      turnstileRequired: string;
      turnstileFailed: string;
      turnstileLoadFailed: string;
      turnstileMisconfigured: string;
    };
  };
  
  // Aura VR Generator
  auraVR: {
    title: string;
    subtitle: string;
    startScan: string;
    processing: {
      analyzing: string;
      mapping: string;
      rendering: string;
      optimizing: string;
      preparing: string;
      finalizing: string;
      complete: string;
    };
    progress: {
      analyzingSub: string;
      mappingSub: string;
      renderingSub: string;
      optimizingSub: string;
      preparingSub: string;
      finalizingSub: string;
      completeSub: string;
    };
    result: {
      title: string;
      subtitle: string;
      linkLabel: string;
      copyLink: string;
      shareWhatsApp: string;
      generateNew: string;
      videoSource: string;
      tourTime: string;
    };
    aria: {
      message: string;
      stats: string;
      action: string;
    };
  };
  
  // Demo page
  demo: {
    nav: { pricing: string; login: string; startFree: string };
    hero: { badge: string; title: string; subtitle: string };
    calendly: { chooseDate: string; demoFree: string; preferContact: string; whatsapp: string; sendEmail: string };
    valuePoints: { sectionTitle: string; sectionSubtitle: string; bookNow: string };
    valuePointsList: Array<{ title: string; description: string }>;
    testimonials: { title: string; subtitle: string };
    footer: { home: string; pricing: string; contact: string; login: string };
  };

  // Contact page
  contact: {
    title: string;
    subtitle: string;
    support: { title: string; desc: string };
    sales: { title: string; desc: string };
    demo: { title: string; desc: string; cta: string };
    form: { title: string; name: string; email: string; subject: string; message: string; namePlaceholder: string; emailPlaceholder: string; subjectPlaceholder: string; messagePlaceholder: string; submit: string };
    validation: { nameMin: string; emailInvalid: string; messageMin: string; checkFields: string };
    toast: { successTitle: string; successDesc: string; errorTitle: string; errorDesc: string; validationTitle: string };
    home: string;
  };

  // Error / 404 pages
  errors: {
    somethingWentWrong: string;
    unexpectedError: string;
    unknownError: string;
    errorId: string;
    tryAgain: string;
    backToHome: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
    dashboard: string;
  };

  // Common Actions
  common: {
    copy: string;
    share: string;
    send: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    loading: string;
    error: string;
  };

  billing: {
    title: string;
    titleAccent: string;
    subtitle: string;
    noSubscription: string;
    noActiveSubscription: string;
    viewPlans: string;
    subscribeToUnlock: string;
    currentPlanPrefix: string;
    perMonth: string;
    unlimitedListings: string;
    listingsPerMonth: string;
    nextRenewal: string;
    cancelWarning: string;
    managePayments: string;
    unlockPremium: string;
    specialPackage: string;
    oneTime: string;
    whatIncludes: string;
    buyAgencyBoost: string;
    starterForBeginners: string;
    proForProfessionals: string;
    agencyForTeams: string;
    recommended: string;
    freePlanName: string;
    expiring: string;
    reactivateSubscription: string;
    cancelSubscription: string;
    cancelledTitle: string;
    reactivatedTitle: string;
    completedUpgradeTitle: string;
    changedPlanTitle: string;
    upgradeErrorTitle: string;
    startCheckoutError: string;
    cancelError: string;
    reactivateError: string;
    portalError: string;
    upgradeError: string;
    reloadMessage: string;
    switchToStarter: string;
    switchToPro: string;
    switchToAgency: string;
    upgradeToPro: string;
    upgradeToAgency: string;
    /** Trust line — Stripe handles cards & Customer Portal */
    stripeTrust: string;
    /** Soft error when GET /api/user/subscription fails (billing page) */
    subscriptionFetchErrorBody: string;
    retry: string;
  };

  /** Toasts shown by DashboardClientWrapper (payment success, limit warning, etc.). Use {used} and {lim} in limitNearDesc. */
  dashboardToasts: {
    boostActivated: string;
    boostDesc: string;
    agencyActive: string;
    agencyDesc: string;
    paymentDone: string;
    paymentDesc: string;
    checkoutCanceled: string;
    checkoutCanceledDesc: string;
    limitNear: string;
    limitNearDesc: string;
  };
  
  // Landing Page
  landing: {
    nav: {
      tagline: string;
      features: string;
      pricing: string;
      compliance: string;
      login: string;
      getStarted: string;
    };
      hero: {
        poweredBy: string;
        titlePart1: string;
        titlePart2: string;
        titleAI: string;
        socialProof: string;
        socialProofAgencies: string;
        socialProofLocation: string;
        subtitle: string;
        ctaStart: string;
        ctaDemo: string;
        trustedBy: string;
        stats: {
          automation: string;
          listingsPerDay: string;
          conversionRate: string;
        };
      };
    features: {
      title: string;
      subtitle: string;
      aiListing: {
        title: string;
        description: string;
        benefit: string;
      };
      crmAI: {
        title: string;
        description: string;
        benefit: string;
      };
      globalReach: {
        title: string;
        description: string;
        benefit: string;
      };
    };
      searchEngine: {
        title: string;
        subtitle: string;
        exclusive: string;
        exclusiveInPlan: string;
        benefit: string;
      step1: {
        title: string;
        description: string;
        status: string;
      };
      step2: {
        title: string;
        description: string;
        status: string;
      };
      step3: {
        title: string;
        description: string;
        status: string;
      };
      step4: {
        title: string;
        description: string;
        status: string;
      };
    };
    tuesdayMorning: {
      title: string;
      subtitle: string;
      time1: string;
      time1Title: string;
      time1Desc: string;
      time2: string;
      time2Title: string;
      time2Desc: string;
      time3: string;
      time3Title: string;
      time3Desc: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
      testimonial1: {
        name: string;
        role: string;
        content: string;
      };
      testimonial2: {
        name: string;
        role: string;
        content: string;
      };
      testimonial3: {
        name: string;
        role: string;
        content: string;
      };
    };
    aria: {
      badge: string;
      title: string;
      subtitle: string;
      mentoring: {
        title: string;
        description: string;
        benefit: string;
      };
      onboarding: {
        title: string;
        description: string;
        benefit: string;
      };
      support: {
        title: string;
        description: string;
        benefit: string;
      };
      available: string;
      availableFree: string;
    };
    pricing: {
      title: string;
      subtitle: string;
      feature: string;
      bestValue: string;
      perMonth: string;
      agencySubtitle: string;
      agencyExtra: string;
      features: {
        listingsPerMonth: string;
        aiGeneration: string;
        aiStyles: string;
        multilingual: string;
        pdf: string;
        crm: string;
        kanban: string;
        leadScoring: string;
        briefing: string;
        staging: string;
        followup: string;
        automations: string;
        forms: string;
        whiteLabel: string;
        assistant: string;
        multiUser: string;
        roles: string;
        distribution: string;
        reports: string;
        multiOffice: string;
        auraVR: string;
        voiceCalling: string;
        messaging: string;
        manualOverride: string;
        humanOverride: string;
        autoProspecting: string;
        scraping: string;
        dashboard: string;
        calendar: string;
        notifications: string;
        support: string;
      };
      plans: {
        free: string;
        starter: string;
        pro: string;
        agency: string;
        unlimited: string;
        advanced: string;
        exclusive: string;
        active: string;
        viewer: string;
        community: string;
        email: string;
        priority: string;
        dedicated: string;
      };
      cta: {
        startFree: string;
        chooseStarter: string;
        choosePro: string;
        chooseAgency: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
    footer: {
      tagline: string;
      product: string;
      company: string;
      support: string;
      pricing: string;
      dashboard: string;
      features: string;
      about: string;
      contact: string;
      blog: string;
      privacy: string;
      terms: string;
      refund: string;
      copyright: string;
    };
    pricingPage: {
      badge: string;
      mainTitle: string;
      mainTitle2: string;
      subtitle: string;
      trustCancel: string;
      trustTrial: string;
      trustSupport: string;
      demo: string;
      whyChoose: string;
      whySubtitle: string;
      faqTitle: string;
      faqSubtitle: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaStartFree: string;
      ctaWatchDemo: string;
      features: Array<{ title: string; desc: string }>;
      faqs: Array<{ question: string; answer: string }>;
    };
  };
}

// Allow per-lingua dictionaries to omit or partially define nested keys
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const translations: Record<SupportedLocale, DeepPartial<TranslationDictionary>> = {
  it: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Pannello di controllo',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      generate: 'Genera',
      signOut: 'Esci',
      currentPlan: 'Piano Attuale',
      dashboardAI: 'Dashboard AI',
      thisMonth: 'Questo Mese',
      saved: 'Salvati',
      noSavedListings: 'Nessun annuncio salvato',
      planFree: '5 annunci al mese',
      planStarter: '50 annunci al mese',
      planPro: '200 annunci al mese',
      planAgency: 'Annunci illimitati',
      remainingListings: 'annunci rimanenti',
      unlimitedAvailable: 'Annunci illimitati disponibili',
      chooseYourPlan: 'Scegli il Tuo Piano',
      activeBadge: 'Attivo',
      yourCurrentPlan: 'Il tuo piano attuale',
      forBeginners: 'Per iniziare',
      forProfs: 'Per professionisti',
      forTeam: 'Per team',
      freePrice: 'Gratis',
      choosePlan: 'Scegli Piano',
      startFree: 'Inizia Gratis',
      upgradeToStarter: 'Upgrade a Starter',
      upgradeToPro: 'Upgrade a Pro',
      upgradeToAgency: 'Upgrade a Agency',
      mapTitle: 'Predator Command Map',
      mapSubtitle: 'Mappa tattica degli affari più urgenti',
      mapGhostListings: 'Ghost Listings (>90 giorni)',
      mapRefresh: 'Aggiorna',
      mapLegend: 'Legenda',
      mapTopDeal: 'TOP DEAL (Arbitraggio >15%)',
      mapHighUrgency: 'ALTA URGENZA (Urgenza >70)',
      mapWarm: 'CALDO (Urgenza 30-70)',
      mapCold: 'FREDDO (Urgenza <30)',
      mapCallLaunched: 'Chiamata avviata',
      mapCallError: 'Errore nell\'avvio della chiamata',
      mapLanciaChiamata: 'Lancia Chiamata Predator',
      mapPage: {
        loadError: 'Errore nel caricamento delle liste',
        callStartedDesc: 'La chiamata AI è stata avviata con successo',
        paywallSubtitle:
          'Disponibile solo con piano Agency. Sblocca la mappa e tutte le funzionalità Diamond.',
        paywallCardDesc: 'Disponibile solo con piano Agency.',
        unlockAgency: 'Sblocca con Agency',
        backToProspecting: 'Torna al Prospecting',
        backAria: 'Indietro',
        topDealsOnly: 'Solo TOP DEAL',
        topDealsOnlyShort: 'TOP',
        ghostShort: 'Ghost',
        mapTitleShort: 'Predator Map',
        kpiMappedListings: 'Immobili mappati',
        kpiTopDeals: 'Top Deals',
        kpiHighUrgency: 'Alta urgenza',
        emptyNoListings: 'Nessun immobile trovato',
        emptyNoGhosts: 'Nessun Ghost Listing disponibile',
        emptyEnableGhostHint: 'Attiva il filtro Ghost Listings per vedere più opzioni',
        closeDetailAria: 'Chiudi dettaglio',
        badgeTopDeal: 'TOP DEAL',
        badgeHighUrgency: 'HIGH URGENCY',
        urgencyScoreTitle: 'Urgency Score',
        ghostListingDays: 'Ghost Listing: {days} giorni sul mercato',
        marketGapTitle: 'GAP DI MERCATO',
        marketGapVsArea: 'vs Media Zona',
        preview3dTitle: 'Anteprima 3D',
        quickActionsTitle: 'Azioni Rapide',
        callingInProgress: 'Chiamata in corso...',
        whatsappProjectCta: 'Invia WhatsApp Progetto',
        viewOriginalListing: 'Vedi annuncio originale →',
      },
      opportunitiesPage: {
        title: 'Radar Opportunità',
        subtitle:
          'Trova immobili sotto-prezzo, annunci vecchi o mai contattati per nuovi mandati.',
        type: 'Tipo opportunità',
        underpriced: 'Sotto-prezzo',
        old: 'Annunci vecchi',
        uncontacted: 'Mai contattati',
        city: 'Città (opzionale)',
        cityPlaceholder: 'Milano',
        oldDays: 'Vecchi da almeno (giorni)',
        loading: 'Caricamento...',
        refresh: 'Aggiorna',
        results: 'Risultati',
        noResults: 'Nessuna opportunità trovata con i filtri correnti.',
        selectListing: 'Seleziona un annuncio per aprire i dettagli.',
        loadingResults: 'Caricamento opportunità...',
        loadFailed: 'Impossibile caricare le opportunità.',
        unknown: 'sconosciuto',
        status: 'Stato',
        na: 'n.d.',
        filtersTitle: 'Filtri ricerca',
        filtersDescription: 'Affina il tipo di opportunità e la zona.',
      },
      autopilotPage: {
        title: 'Autopilot Mandati 24/7',
        subtitle:
          'Lo scraper e il Voice AI lavorano ogni giorno per trovare nuovi incarichi e creare lead in automatico.',
        active: 'Autopilot attivo',
        rulePlaceholder: 'Nome regola (es. Mandati Milano Centro)',
        city: 'Città',
        region: 'Regione/Provincia',
        minPrice: 'Prezzo minimo',
        maxPrice: 'Prezzo massimo',
        runHour: 'Ora di esecuzione (UTC)',
        dailyLimit: 'Max nuovi lead al giorno',
        saving: 'Salvataggio...',
        save: 'Salva regola Autopilot',
        lastRuns: 'Ultimi run',
        noRuns: 'Nessun run registrato.',
        opportunities: 'opportunità',
        leads: 'lead',
        recentActions: 'Azioni recenti',
        noActions: 'Nessuna azione registrata.',
        defaultRule: 'Autopilot Mandati',
        loadError: 'Impossibile caricare la configurazione Autopilot.',
        saveSuccess: 'Regola Autopilot salvata',
        saveError: 'Errore nel salvataggio della regola Autopilot.',
        saveToastTitle: 'Autopilot mandati',
        configCardTitle: 'Configurazione regola',
        configCardDescription: 'Attiva Autopilot, zone e limiti giornalieri.',
      },
      workspacePage: {
        loading: 'Caricamento impostazioni...',
        heroTitle: 'Feature Control Center',
        heroSubtitle:
          'Personalizza la tua dashboard attivando o disattivando i moduli',
        trialActive: 'Trial Attivo',
        trialDesc:
          'Hai accesso a tutti i moduli per i prossimi {days} giorni. Dopo il trial, solo i moduli del tuo piano saranno disponibili.',
        howItWorks: '💡 Come funziona',
        howItWorksBullets: [
          'I moduli disattivati scompariranno dalla barra laterale della dashboard',
          'Durante il trial, tutti i moduli sono disponibili',
          'Dopo il trial, solo i moduli inclusi nel tuo piano possono essere attivati',
          'Le impostazioni vengono salvate automaticamente',
        ],
        prefsTitle: 'Lingua, valuta e fuso orario',
        prefsSubtitle:
          'Stesse preferenze dell’header: qui le imposti in un unico posto. Il fuso orario influisce su date e orari nella dashboard (es. fatturazione, automazioni).',
        timezoneLabel: 'Fuso orario',
        timezoneHint:
          'Salvato su questo browser. Se il tuo fuso non è in elenco, scegli UTC e segnala al supporto.',
        previewLabel: 'Anteprima ora locale',
        insufficientPlan: 'Piano insufficiente',
        insufficientPlanDesc: 'Questo modulo richiede il piano {plan}. Aggiorna il tuo account.',
        moduleUpdated: 'Modulo aggiornato',
        moduleEnabled: 'attivato',
        moduleDisabled: 'disattivato',
        errorTitle: 'Errore',
        saveError: 'Impossibile salvare le impostazioni.',
        trialBadge: 'Trial',
        modules: {
          scraper: {
            name: 'Scraper Globale',
            desc: 'Scansione automatica di Idealista, Zillow, Immobiliare.it',
          },
          ai_voice: {
            name: 'AI Voice Calling',
            desc: 'Chiamate automatiche con Bland AI',
          },
          '3d_staging': {
            name: '3D Virtual Staging',
            desc: 'Generazione visioni 3D post-ristrutturazione',
          },
          price_sniper: {
            name: 'Price Drop Sniper',
            desc: 'Rilevamento automatico ribassi di prezzo',
          },
          commercial: {
            name: 'Commercial Intelligence',
            desc: 'Analisi immobili commerciali e Business Features',
          },
          territory_map: {
            name: 'Territory Commander',
            desc: 'Mappa tattica e analisi territorio',
          },
          smart_briefing: {
            name: 'AI Smart Briefing',
            desc: 'Riassunto automatico vantaggi/difetti/target',
          },
          xray_vision: {
            name: 'AI X-Ray Vision',
            desc: 'Analisi tecnica immagini per difetti/pregi',
          },
          competitor_radar: {
            name: 'Competitor Radar',
            desc: 'Rilevamento mandati in scadenza',
          },
        },
        timezoneRegions: {
          EU: 'Europa',
          US: 'Stati Uniti',
          NA: 'Nord America',
          LATAM: 'LATAM',
          ME: 'Medio Oriente',
          APAC: 'APAC',
          UTC: 'UTC',
        },
      },
      leadsPage: leadsPageUiIt,
      leadPipelinePage: leadPipelinePageUiIt,
      crmApiKeysPage: crmApiKeysPageUiIt,
      crmAutomationRulesPage: crmAutomationRulesPageUiIt,
      workflowAutomationsPage: workflowAutomationsPageUiIt,
      leadDetailPage: leadDetailPageUiIt,
      communicationsHub: communicationsHubUiIt,
      predatorLiveBadge: {
        livePrefix: 'LIVE:',
        predatorsOnline: 'Predatori online',
      },
      onboardingChecklist: {
        title: 'I tuoi primi 5 passi',
        subtitle: 'Completa questa checklist per sbloccare valore subito. Puoi nasconderla quando vuoi: i progressi restano salvati su questo browser.',
        dismiss: 'Nascondi',
        dismissAria: 'Nascondi checklist onboarding',
        progress: '{done} di {total} completati',
        allDone: 'Ottimo lavoro — hai completato tutti i passi.',
        steps: {
          generate: {
            title: 'Genera il primo annuncio con l\'AI',
            description: 'Parti da Perfect Copy o dagli strumenti di copy: titoli, descrizioni e varianti in pochi minuti.',
            cta: 'Vai a Perfect Copy',
          },
          library: {
            title: 'Salva un annuncio in libreria',
            description: 'Tieni i migliori testi e riutilizzali per i portali o i clienti.',
            cta: 'Apri libreria',
          },
          pipeline: {
            title: 'Organizza i lead in pipeline',
            description: 'Sposta i lead tra le colonne e tieni sotto controllo follow-up e priorità.',
            cta: 'Apri pipeline',
          },
          billing: {
            title: 'Verifica piano e fatturazione',
            description: 'Controlla il piano attivo e come gestire upgrade o fatture.',
            cta: 'Apri fatturazione',
          },
          workspace: {
            title: 'Configura il workspace',
            description: 'Attiva i moduli che usi ogni giorno (CRM, voice, mappe, ecc.).',
            cta: 'Impostazioni workspace',
          },
        },
      },
      contextualHelp: {
        openGuideAria: 'Apri la guida in una nuova scheda',
        openGuideTooltip: 'Apre la documentazione per questa funzione (nuova scheda).',
        fieldHintAria: 'Suggerimento sul campo',
      },
      commandCenterTitle: 'Command Center',
      commandCenterSubtitle:
        'Panoramica del piano, utilizzo e strumenti AI per annunci, lead e prospecting — in un solo posto.',
      newListingCta: 'Nuovo annuncio',
      liveFeed: {
        deal: 'Deal Oro',
        call: 'Chiamata AI',
        staging: 'Virtual Staging',
        priceDrop: 'Price Drop',
        subtitle: 'Attività globale in tempo reale',
        cta: 'Sei parte di un network globale di elite. Non restare indietro.',
        infixDeal: 'rilevato a',
        infixCall: 'fissata con successo a',
        infixStaging: 'generato per immobile a',
        priceDropLine: 'Price Drop Sniper attivato a',
      },
      proTips: {
        ariaSection: 'Suggerimenti Pro',
        title: 'Suggerimenti Pro per Annunci Migliori',
        tip1: 'Includi dettagli specifici su posizione, servizi e caratteristiche uniche',
        tip2: 'Usa metrature accurate e numero stanze per risultati AI migliori',
        tip3: 'Genera più versioni e scegli quella che si adatta meglio alle tue esigenze',
      },
      docsHubOpen: 'Apri Documentation Hub',
      stats3d: {
        projects3d: 'Progetti 3D',
        generated: 'Generati',
        whatsappOpen: 'Apertura WhatsApp',
        openRate: 'Tasso di apertura',
        aiViews: 'Visioni AI generate',
        openedOfSent: '{opened} aperti su {sent} inviati',
        noMessages: 'Nessun messaggio inviato ancora',
      },
      sniperStats: {
        title: 'Statistiche Sniper',
        priceDropsToday: 'Ribassi Oggi',
        detected: 'Rilevati',
        expirations: 'Scadenze',
        opportunities: 'Opportunità',
        last48h: 'Rilevati nelle ultime 48h',
        offline120: 'Immobili offline 120+ giorni',
        loadError: 'Impossibile caricare le statistiche Sniper.',
      },
      regionalPortals: {
        title: 'Portali Prioritari',
        primaryMarkets: 'Mercati Primari',
        secondaryMarkets: 'Mercati Secondari',
        currency: 'Valuta',
        units: 'Unità',
        regionUsa: 'Stati Uniti',
        regionEurope: 'Europa',
        regionMiddleEast: 'Medio Oriente',
        regionGlobal: 'Globale',
        unitSqft: 'sq ft',
        unitSqm: 'm²',
      },
      profitDashboard: {
        title: 'Il Tuo ROI Questo Mese',
        hoursSaved: 'Ore Risparmiate',
        hours: 'ore',
        perListing: 'min per annuncio',
        valueGenerated: 'Valore Generato',
        estimatedValue: 'annuncio stimato',
        generatedListings: 'Annunci generati',
        amazing: 'Fantastico!',
        saved10Hours: 'Hai risparmiato più di 10 ore questo mese',
      },
      morningBriefing: {
        na: 'N/A',
        sent: 'Notifica di prova inviata!',
        sentDesc: 'Controlla la tua email e WhatsApp',
        error: 'Errore',
        sendError: 'Impossibile inviare la notifica',
        connectionError: 'Errore di connessione',
        title: 'Il tuo Briefing di Oggi',
        subtitle: 'Top 3 opportunità con Market Gap più alto (ultime 24h)',
        configure: 'Configura',
        priceDown: 'Prezzo',
        highUrgency: 'Urgenza Alta',
        target: 'Target',
        fomo: 'Questi deal sono stati inviati anche a',
        partnerAgencies: 'agenzie partner nella tua zona. Affrettati!',
        sendTest: 'Invia Prova sul mio Cellulare',
      },
      competitorRadar: {
        na: 'N/A',
        title: 'Radar Scadenze',
        subtitle: 'Immobili offline o fermi da 120+ giorni',
        removed: 'Rimosso',
        stale: 'Fermo',
        aiNote: 'Nota AI',
        offlineFor: 'Offline da',
        days: 'giorni',
        viewAll: 'Vedi tutti',
        refreshAria: 'Aggiorna elenco',
      },
      planCards: {
        generateNewListing: 'Genera Nuovo Annuncio',
        aiScraper: 'AI Scraper',
        linkAnalysis: 'Analisi da Link',
        premiumPdfCards: 'Schede PDF Premium',
        allFreeFeatures: 'Tutte le funzionalità Free',
        leadScoringAi: 'Lead Scoring AI',
        perfectCopy20: 'Perfect Copy 2.0',
        translator12Languages: 'Traduttore 12 Lingue',
        allStarterFeatures: 'Tutte le funzionalità Starter',
        fullCrmPipeline: 'CRM Completo + Pipeline',
        virtualStaging3d: 'Virtual Staging 3D',
        aiVoiceCallingMonthly: 'AI Voice Calling (30/mese)',
        agencyAssistantAi: 'Agency Assistant AI',
        allProFeatures: 'Tutte le funzionalità Pro',
        unlimitedAiVoiceCalling: 'AI Voice Calling Illimitato',
        auraVrVirtualTour: 'Aura VR: Virtual Tour',
        teamUpToAgents: 'Team fino a 10 agenti',
        omnichannelSuite: 'Omnichannel Suite',
        agencyBoostTitle: 'Agency Boost',
        agencyBoostSubtitle: 'Setup done-for-you',
        oneTime: 'una tantum',
        boostSetupComplete: 'Setup completo done-for-you',
        boostOnboarding: 'Implementazione e onboarding guidato',
        boostLaunchSupport: 'Supporto premium per il lancio',
        boostCustomConfig: 'Configurazione personalizzata',
        buyAgencyBoost: 'Acquista Agency Boost',
      },
      planFeatures: planFeaturesUiIt,
    },
    auth: {
      backToHome: 'Torna alla Home',
      login: {
        title: 'Bentornato 👋',
        subtitle: 'Accedi per continuare',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Password dimenticata?',
        signIn: 'Accedi',
        signingIn: 'Accesso in corso...',
        newTo: 'Nuovo su PropertyPilot AI?',
        createFreeAccount: 'Crea un account gratuito',
        secureNote: 'Login sicuro • I tuoi dati sono protetti con crittografia standard',
      },
      signup: {
        title: 'Crea il tuo account ✨',
        subtitle: 'Inizia a generare annunci professionali con l\'AI',
        fullName: 'Nome completo',
        email: 'Email',
        password: 'Password',
        minChars: 'Almeno 6 caratteri',
        freePlanIncludes: 'Il piano gratuito include:',
        listingsPerMonth: '5 annunci al mese',
        allAIFeatures: 'Tutte le funzionalità AI',
        noCreditCard: 'Nessuna carta richiesta',
        createFreeAccount: 'Crea account gratuito',
        creatingAccount: 'Creazione account...',
        alreadyHaveAccount: 'Hai già un account?',
        signInInstead: 'Accedi invece',
        termsAgreeBefore: 'Registrandoti accetti i nostri ',
        termsAgreeAnd: ' e ',
      },
      toast: {
        error: 'Errore',
        fillAllFields: 'Compila tutti i campi richiesti.',
        tooManyAttempts: 'Troppi tentativi',
        rateLimitMsg: 'Abbiamo rilevato troppi tentativi. Per la tua sicurezza, riprova tra qualche minuto.',
        welcomeBack: 'Bentornato! 🎉',
        completePayment: 'Completa il pagamento nella dashboard.',
        loginSuccess: 'Accesso effettuato con successo.',
        accountCreated: 'Account creato! 🎉',
        redirectPayment: 'Verrai reindirizzato per completare il pagamento.',
        welcomePropertyPilot: 'Benvenuto in PropertyPilot AI!',
        turnstileRequired: 'Completa il controllo di sicurezza prima di continuare.',
        turnstileFailed: 'Verifica di sicurezza non riuscita. Riprova.',
        turnstileLoadFailed: 'Impossibile caricare il controllo di sicurezza. Aggiorna la pagina o riprova più tardi.',
        turnstileMisconfigured: 'Verifica di sicurezza non configurata correttamente sul server. Contatta il supporto.',
      },
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Trasforma un video dello smartphone in un tour VR immersivo 3D',
      startScan: 'Inizia Scansione Aura VR',
      processing: {
        analyzing: '📹 Analisi video in corso...',
        mapping: '🏠 Mappatura stanze in corso...',
        rendering: '🎥 Rendering Cinematico 3D...',
        optimizing: '✨ Ottimizzazione VR per mobile...',
        preparing: '🌐 Preparazione link VR...',
        finalizing: '⚡ Finalizzazione tour immersivo...',
        complete: '✅ Tour VR pronto!',
      },
      progress: {
        analyzingSub: 'Rilevamento frame chiave',
        mappingSub: 'Ricostruzione spaziale 3D',
        renderingSub: 'Generazione texture immersive',
        optimizingSub: 'Compressione e streaming',
        preparingSub: 'Configurazione accesso pubblico',
        finalizingSub: 'Aggiunta effetti cinematici',
        completeSub: 'Link generato con successo',
      },
      result: {
        title: 'Tour VR Generato!',
        subtitle: 'Il tuo tour immersivo è pronto per essere condiviso',
        linkLabel: 'Link VR:',
        copyLink: 'Copia Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Genera nuovo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR in 60s',
      },
      aria: {
        message: 'Aria: Ottimo lavoro!',
        stats: 'Questa scansione attirerà il',
        action: 'di visite in più. Vuoi che la invii io ai tuoi lead caldi?',
      },
    },
    errors: {
      somethingWentWrong: 'Qualcosa è andato storto',
      unexpectedError: 'Si è verificato un errore imprevisto. Non ti preoccupare, i tuoi dati sono al sicuro.',
      unknownError: 'Errore sconosciuto',
      errorId: 'ID Errore',
      tryAgain: 'Riprova',
      backToHome: 'Torna alla Home',
      pageNotFound: 'Pagina non trovata',
      pageNotFoundDesc: 'La pagina che stai cercando non esiste o è stata spostata.',
      dashboard: 'Dashboard',
    },
    demo: {
      nav: { pricing: 'Prezzi', login: 'Login', startFree: 'Inizia Gratis' },
      hero: { badge: 'Prenota in 30 secondi', title: 'Prenota una Demo Gratuita', subtitle: 'Scopri come PropertyPilot AI può trasformare la tua agenzia immobiliare. 30 minuti con un nostro esperto per vedere la piattaforma in azione.' },
      calendly: { chooseDate: 'Scegli Data e Ora', demoFree: 'Demo gratuita di 30 minuti', preferContact: 'Preferisci contattarci direttamente?', whatsapp: 'Scrivi su WhatsApp', sendEmail: 'Invia Email' },
      valuePoints: { sectionTitle: 'Cosa scoprirai nella Demo', sectionSubtitle: 'Una panoramica completa delle funzionalità che renderanno la tua agenzia più efficiente.', bookNow: 'Prenota Ora la Tua Demo' },
      valuePointsList: [
        { title: 'AI Generativa Avanzata', description: 'Crea annunci professionali, titoli A/B, descrizioni SEO e contenuti marketing in pochi secondi.' },
        { title: 'CRM 4.0 Dinamico', description: 'Gestisci i tuoi lead con pipeline Kanban, lead scoring AI e enrichment automatico.' },
        { title: 'Automazioni Intelligenti', description: '20+ automazioni AI per follow-up, email, WhatsApp e gestione lead senza sforzo.' },
        { title: 'Lead Scoring AI', description: 'Identifica i lead più caldi con punteggi 0-100 e prioritizza le tue attività.' },
        { title: 'Communication Hub', description: 'Email, SMS e WhatsApp integrati in un\'unica dashboard con template AI.' },
        { title: 'Branding Personalizzato', description: 'PDF white-label, schede immobili professionali e materiali con il tuo brand.' },
      ],
      testimonials: { title: 'Cosa dicono i nostri Clienti', subtitle: 'Agenti e agenzie che hanno già trasformato il loro business con PropertyPilot AI' },
      footer: { home: 'Home', pricing: 'Prezzi', contact: 'Contatti', login: 'Login' },
    },
    contact: {
      title: 'Contattaci',
      subtitle: 'Siamo qui per aiutarti. Contatta il nostro team per qualsiasi domanda.',
      support: { title: 'Supporto Clienti', desc: 'Hai bisogno di assistenza tecnica o domande sul tuo account? Il nostro team di supporto è pronto ad aiutarti.' },
      sales: { title: 'Richieste Commerciali', desc: 'Interessato ai piani Business o Enterprise? Parliamo delle tue esigenze aziendali.' },
      demo: { title: 'Vuoi una Demo?', desc: 'Scopri come PropertyPilot AI può trasformare il tuo business immobiliare. Prenota una demo gratuita con il nostro team.', cta: 'Prenota Demo Gratuita' },
      form: { title: 'Inviaci un Messaggio', name: 'Nome', email: 'Email', subject: 'Oggetto', message: 'Messaggio', namePlaceholder: 'Il tuo nome', emailPlaceholder: 'la.tua@email.com', subjectPlaceholder: 'Oggetto del messaggio', messagePlaceholder: 'Scrivi qui il tuo messaggio...', submit: 'Invia Messaggio' },
      validation: { nameMin: 'Il nome deve avere almeno 2 caratteri', emailInvalid: "Inserisci un'email valida", messageMin: 'Il messaggio deve avere almeno 10 caratteri', checkFields: 'Controlla i campi evidenziati.' },
      toast: { successTitle: 'Messaggio inviato!', successDesc: 'Ti risponderemo entro 24 ore.', errorTitle: 'Errore', errorDesc: 'Impossibile inviare il messaggio. Riprova più tardi.', validationTitle: 'Errore di validazione' },
      home: 'Home',
    },
    common: {
      copy: 'Copia',
      share: 'Condividi',
      send: 'Invia',
      cancel: 'Annulla',
      confirm: 'Conferma',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      view: 'Visualizza',
      loading: 'Caricamento...',
      error: 'Errore',
    },
    billing: {
      title: 'Gestione',
      titleAccent: 'Abbonamento',
      subtitle: 'Visualizza e gestisci il tuo piano di abbonamento',
      noSubscription: 'Nessun abbonamento',
      noActiveSubscription: 'Nessun abbonamento attivo',
      viewPlans: 'Visualizza i piani disponibili',
      subscribeToUnlock: 'Abbonati per sbloccare le funzionalità',
      currentPlanPrefix: 'Piano',
      perMonth: '/mese',
      unlimitedListings: 'Annunci illimitati',
      listingsPerMonth: 'annunci al mese',
      nextRenewal: 'Prossimo rinnovo:',
      cancelWarning: "L'abbonamento verrà cancellato alla fine del periodo di fatturazione. Tornerai al piano gratuito.",
      managePayments: 'Gestisci Pagamenti',
      unlockPremium: 'Sblocca Funzionalità Premium',
      specialPackage: 'Pacchetto Speciale',
      oneTime: 'una tantum',
      whatIncludes: 'Cosa include:',
      buyAgencyBoost: 'Acquista Agency Boost',
      starterForBeginners: 'Per iniziare',
      proForProfessionals: 'Per professionisti',
      agencyForTeams: 'Per team',
      recommended: 'Consigliato',
      freePlanName: 'Gratuito',
      expiring: 'In scadenza',
      reactivateSubscription: 'Riattiva Abbonamento',
      cancelSubscription: 'Cancella Abbonamento',
      cancelledTitle: 'Abbonamento cancellato',
      reactivatedTitle: 'Abbonamento riattivato',
      completedUpgradeTitle: 'Upgrade completato!',
      changedPlanTitle: 'Piano modificato!',
      upgradeErrorTitle: 'Errore Upgrade',
      startCheckoutError: 'Impossibile avviare il checkout.',
      cancelError: "Impossibile cancellare l'abbonamento.",
      reactivateError: "Impossibile riattivare l'abbonamento.",
      portalError: 'Impossibile aprire il portale pagamenti.',
      upgradeError: "Impossibile completare l'upgrade.",
      reloadMessage: 'Ricaricamento pagina...',
      switchToStarter: 'Passa a Starter',
      switchToPro: 'Passa a Pro',
      switchToAgency: 'Passa a Agency',
      upgradeToPro: 'Upgrade a Pro',
      upgradeToAgency: 'Upgrade a Agency',
      stripeTrust:
        'Pagamenti sicuri elaborati da Stripe. Carte, metodi di pagamento e fatture si gestiscono nel portale cliente Stripe.',
      subscriptionFetchErrorBody:
        'Impossibile caricare l\'abbonamento. Mostriamo il piano Free.',
      retry: 'Riprova',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost attivato!',
      boostDesc: "Setup \"done-for-you\" confermato. Il nostro team ti contatterà per l'onboarding.",
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Accesso Premium Confermato - Benvenuto nel Network Globale PropertyPilot!',
      paymentDone: '✅ Pagamento completato!',
      paymentDesc: 'Il tuo piano è stato attivato con successo.',
      checkoutCanceled: 'Checkout annullato',
      checkoutCanceledDesc: 'Puoi riprovare quando vuoi dalla pagina Billing.',
      limitNear: '⚠️ Limite quasi raggiunto!',
      limitNearDesc: 'Hai usato {used} dei tuoi {lim} annunci mensili (80%+). Considera un upgrade per continuare.',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Features',
        pricing: 'Pricing',
        compliance: 'Compliance',
        login: 'Login',
        getStarted: 'Get Started',
      },
      hero: {
        poweredBy: 'Powered by GPT-4',
        titlePart1: 'Il tuo Agente',
        titlePart2: 'Immobiliare',
        titleAI: 'AI',
        socialProof: 'Scelto da',
        socialProofAgencies: '+500 agenzie',
        socialProofLocation: 'in Europa',
        subtitle: "L'unico Sistema Operativo AI che trova, analizza e ottiene mandati in totale autonomia",
        ctaStart: 'Inizia Gratis',
        ctaDemo: 'Vedi Demo',
        trustedBy: 'Compatibile con i principali portali',
        stats: {
          automation: 'Automazione',
          listingsPerDay: 'Annunci/Giorno',
          conversionRate: 'Conversion Rate',
        },
      },
      features: {
        title: 'Why PropertyPilot AI?',
        subtitle: 'La piattaforma AI completa per agenti immobiliari che vogliono scalare',
        aiListing: {
          title: 'AI Listing Engine',
          description: 'Genera annunci professionali in secondi con stili personalizzati (Luxury, Investment, Standard Pro). Multi-lingua e ottimizzato per Zillow, Idealista, Immobiliare.',
          benefit: 'Risparmia 5 ore a settimana su scrittura annunci',
        },
        crmAI: {
          title: 'CRM AI Intelligence',
          description: 'Lead Scoring automatico, follow-up AI multi-canale (WhatsApp, Email, SMS). Categorizza lead HOT/WARM/COLD e suggerisce azioni prioritarie.',
          benefit: 'Aumenta conversioni del 40% con prioritizzazione AI',
        },
        globalReach: {
          title: 'Global Reach',
          description: 'Operiamo su USA (Zillow, MLS), Italia (Idealista, Immobiliare), Spagna (Idealista.es). Terminologia localizzata e formati di mercato.',
          benefit: 'Espandi il tuo business in 3 continenti',
        },
      },
      searchEngine: {
        title: 'Il Motore di Ricerca che non dorme mai',
        subtitle: 'Disponibile',
        exclusive: 'ESCLUSIVAMENTE',
        exclusiveInPlan: 'nel piano AGENCY',
        benefit: 'Risparmia 20 ore di telefonate a settimana',
        step1: {
          title: 'Scansione Globale',
          description: "L'AI scansiona automaticamente Idealista, Immobiliare, Zillow e MLS 24/7, trovando migliaia di annunci ogni giorno.",
          status: 'Scansione in corso...',
        },
        step2: {
          title: 'Filtrazione IA',
          description: 'Ogni annuncio riceve un Lead Score AI (0-100). Solo i "TOP DEAL" (80+) vengono selezionati per le chiamate.',
          status: 'TOP DEAL rilevato',
        },
        step3: {
          title: 'Chiamata Automatica',
          description: 'Voice AI (Bland AI) chiama i proprietari, gestisce obiezioni e propone appuntamenti in modo naturale e persuasivo.',
          status: 'Chiamata in corso...',
        },
        step4: {
          title: 'Appuntamento in Agenda',
          description: "L'appuntamento viene automaticamente aggiunto al tuo Google Calendar e ricevi una notifica email con tutti i dettagli.",
          status: 'Appuntamento confermato',
        },
      },
      tuesdayMorning: {
        title: 'Il tuo nuovo Martedì mattina',
        subtitle: 'Immagina di svegliarti con il lavoro già fatto',
        time1: 'Ore 08:00',
        time1Title: "L'IA ha già analizzato 500 annunci",
        time1Desc: "Mentre dormivi, il sistema ha scansionato Idealista, Immobiliare, Zillow e MLS. Ogni annuncio è stato analizzato e classificato con un Lead Score AI.",
        time2: 'Ore 08:30',
        time2Title: '3 proprietari hanno confermato la visita',
        time2Desc: 'Voice AI ha chiamato i proprietari dei TOP DEAL (score 80+). Tre hanno già confermato la disponibilità per una visita questa settimana.',
        time3: 'Ore 09:00',
        time3Title: "Ti svegli e apri l'agenda già piena",
        time3Desc: 'Apri PropertyPilot AI e trovi 3 appuntamenti già in calendario, con tutti i dettagli dell\'immobile, contatti del proprietario e note AI.',
      },
      testimonials: {
        title: 'Loved by Agents Worldwide',
        subtitle: 'Migliaia di agenti immobiliari si fidano di PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agente Immobiliare, Milano',
          content: 'PropertyPilot AI ha triplicato i miei affari. Il Lead Scoring AI mi dice esattamente su quali lead concentrarmi.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Real Estate Agent, Miami',
          content: 'La funzione di generazione annunci è incredibile. Creo listing professionali in 30 secondi invece di ore.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agente, Barcelona',
          content: 'Il CRM AI è un game-changer. I follow-up automatici mi fanno risparmiare 10 ore a settimana.',
        },
      },
      aria: {
        badge: 'Disponibile in tutti i piani',
        title: 'Aria - Your AI Success Partner',
        subtitle: 'Il tuo coach personale, sempre disponibile. Onboarding, strategia, motivazione: tutto in una chat.',
        mentoring: {
          title: 'Mentoring 24/7',
          description: 'Mai più solo nelle trattative. Aria ti guida passo dopo passo, anche quando il cliente fa obiezioni difficili.',
          benefit: 'Riduci lo stress e aumenta la sicurezza',
        },
        onboarding: {
          title: 'Onboarding Istantaneo',
          description: 'Impara a dominare PropertyPilot in 5 minuti parlando con Aria. Nessun tutorial lungo, solo conversazione naturale.',
          benefit: 'Diventa produttivo da subito',
        },
        support: {
          title: 'Supporto Psicologico',
          description: "L'alleata che ti motiva a chiudere quel mandato quando la sfida si fa dura. Aria conosce la psicologia delle vendite.",
          benefit: 'Mantieni alta la motivazione',
        },
        available: 'Aria è sempre disponibile. Clicca sulla bolla in basso a destra per iniziare.',
        availableFree: 'Disponibile anche nel piano FREE',
      },
      pricing: {
        title: 'Prezzi',
        subtitle: 'Confronta i piani e scegli quello perfetto per il tuo business',
        feature: 'Funzionalità',
        bestValue: 'BEST VALUE',
        perMonth: '/mese',
        agencySubtitle: 'Omnichannel Domination Suite',
        agencyExtra: '+ Modulo Commerciale & Arbitraggio Esteso',
        features: {
          listingsPerMonth: 'Annunci al mese',
          aiGeneration: 'Generazione Annunci AI',
          aiStyles: 'Stili AI (Luxury, Investment, Pro)',
          multilingual: 'Multi-lingua (IT, EN, ES)',
          pdf: 'PDF Professionali',
          crm: 'CRM Completo',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Lead Scoring AI Base',
          briefing: 'Smart Briefing Multi-Categoria',
          staging: 'Virtual Staging 3D',
          followup: 'Follow-up AI Multi-canale',
          automations: 'Automazioni AI',
          forms: 'Smart Lead Capture Forms',
          whiteLabel: 'White-label PDF',
          assistant: 'Agency Assistant AI',
          multiUser: 'Multi-utente',
          roles: 'Ruoli e Permessi',
          distribution: 'Distribuzione Lead Automatica',
          reports: 'Report Attività Team',
          multiOffice: 'Integrazione Multi-sede',
          auraVR: '🥽 Aura VR: Cinematic Virtual Tour Generation',
          voiceCalling: 'AI Voice Calling (Bland AI)',
          messaging: 'AI Smart Messaging (SMS/WhatsApp AI)',
          manualOverride: 'Manual Override: Accesso diretto dati proprietario',
          humanOverride: "Libertà d'intervento umano",
          autoProspecting: 'Auto-Prospecting 24/7',
          scraping: 'Scraping Intelligente',
          dashboard: 'Dashboard War Room',
          calendar: 'Google Calendar Integration',
          notifications: 'Notifiche Email Automatiche',
          support: 'Supporto',
        },
        plans: {
          free: 'FREE',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Illimitati',
          advanced: 'Avanzato',
          exclusive: 'ESCLUSIVO',
          active: 'Attivo',
          viewer: 'Visualizzatore',
          community: 'Community',
          email: 'Email',
          priority: 'Prioritario',
          dedicated: 'Dedicato 24/7',
        },
        cta: {
          startFree: 'Inizia Gratis',
          chooseStarter: 'Scegli Starter',
          choosePro: 'Scegli Pro',
          chooseAgency: 'Scegli Agency',
        },
      },
      cta: {
        title: 'Pronto a moltiplicare i tuoi affari?',
        subtitle: 'Unisciti a centinaia di agenti che già usano PropertyPilot AI',
        button: 'Get Started Gratis',
      },
      footer: {
        tagline: 'Il tuo Agente Immobiliare AI che lavora 24/7',
        product: 'Prodotto',
        company: 'Azienda',
        support: 'Supporto',
        pricing: 'Pricing',
        dashboard: 'Dashboard',
        features: 'Features',
        about: 'Chi Siamo',
        contact: 'Contatti',
        blog: 'Blog',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        refund: 'Refund Policy',
        copyright: 'Tutti i diritti riservati.',
      },
      pricingPage: {
        badge: 'Prezzi Trasparenti',
        mainTitle: 'Scegli il Piano',
        mainTitle2: 'Perfetto per Te',
        subtitle: 'Piani pensati per ogni fase del tuo business immobiliare. Inizia gratis, scala quando sei pronto.',
        trustCancel: 'Cancella quando vuoi',
        trustTrial: 'Prova gratuita 7 giorni',
        trustSupport: 'Supporto in italiano',
        demo: 'Demo',
        whyChoose: 'Perché Scegliere PropertyPilot AI?',
        whySubtitle: 'Funzionalità premium per ogni professionista del real estate',
        faqTitle: 'Domande Frequenti',
        faqSubtitle: 'Tutto quello che devi sapere sui nostri piani',
        ctaTitle: 'Pronto a Trasformare i Tuoi Annunci?',
        ctaSubtitle: 'Inizia gratis oggi e scopri come l\'AI può elevare il tuo business immobiliare.',
        ctaStartFree: 'Inizia Gratis',
        ctaWatchDemo: 'Guarda la Demo',
        features: [
          { title: 'AI GPT-4 Premium', desc: 'Modelli AI più avanzati del mercato' },
          { title: '100% Italiano', desc: 'Contenuti ottimizzati per il mercato italiano' },
          { title: 'Generazione Istantanea', desc: 'Risultati in meno di 30 secondi' },
          { title: 'Facile da Usare', desc: 'Nessuna competenza tecnica richiesta' },
          { title: 'Annunci Professionali', desc: 'Qualità da agenzia di comunicazione' },
          { title: 'Multi-Agenzia', desc: 'Gestisci più sedi con un solo account' },
        ],
        faqs: [
          { question: "Posso cambiare piano in qualsiasi momento?", answer: "Sì, puoi effettuare l'upgrade o il downgrade del tuo piano in qualsiasi momento. Le modifiche saranno applicate al prossimo ciclo di fatturazione." },
          { question: "C'è un periodo di prova gratuito?", answer: "Sì, offriamo 7 giorni di prova gratuita su tutti i piani a pagamento. Nessuna carta di credito richiesta per iniziare." },
          { question: "Cosa succede se supero i limiti del mio piano?", answer: "Ti avviseremo quando ti avvicini ai limiti. Potrai facilmente fare upgrade al piano superiore per continuare a crescere." },
          { question: "Come funziona il piano Agency?", answer: "Il piano Agency è pensato per team e multi-agenzie. Include annunci illimitati, tutte le funzionalità e supporto dedicato." },
          { question: "Posso annullare l'abbonamento?", answer: "Sì, puoi annullare in qualsiasi momento dalla dashboard. L'accesso rimarrà attivo fino alla fine del periodo già pagato." },
          { question: "Offrite supporto in italiano?", answer: "Assolutamente sì! Il nostro team di supporto è completamente italiano e disponibile via email e chat." },
        ],
      },
    },
  },
  
  en: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Control Panel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      generate: 'Generate',
      signOut: 'Sign Out',
      currentPlan: 'Current Plan',
      dashboardAI: 'Dashboard AI',
      thisMonth: 'This Month',
      saved: 'Saved',
      noSavedListings: 'No saved listings',
      planFree: '5 listings per month',
      planStarter: '50 listings per month',
      planPro: '200 listings per month',
      planAgency: 'Unlimited listings',
      remainingListings: 'listings remaining',
      unlimitedAvailable: 'Unlimited listings available',
      chooseYourPlan: 'Choose Your Plan',
      activeBadge: 'Active',
      yourCurrentPlan: 'Your current plan',
      forBeginners: 'To get started',
      forProfs: 'For professionals',
      forTeam: 'For teams',
      freePrice: 'Free',
      choosePlan: 'Choose Plan',
      startFree: 'Start Free',
      upgradeToStarter: 'Upgrade to Starter',
      upgradeToPro: 'Upgrade to Pro',
      upgradeToAgency: 'Upgrade to Agency',
      mapTitle: 'Predator Command Map',
      mapSubtitle: 'Tactical map of the most urgent deals',
      mapGhostListings: 'Ghost Listings (>90 days)',
      mapRefresh: 'Refresh',
      mapLegend: 'Legend',
      mapTopDeal: 'TOP DEAL (Arbitrage >15%)',
      mapHighUrgency: 'HIGH URGENCY (Score >70)',
      mapWarm: 'WARM (Score 30-70)',
      mapCold: 'COLD (Score <30)',
      mapCallLaunched: 'Call started',
      mapCallError: 'Error starting call',
      mapLanciaChiamata: 'Launch Predator Call',
      mapPage: {
        loadError: 'Error loading map data',
        callStartedDesc: 'AI call started successfully',
        paywallSubtitle:
          'Available on Agency plan only. Unlock the map and all Diamond features.',
        paywallCardDesc: 'Available on Agency plan only.',
        unlockAgency: 'Upgrade to Agency',
        backToProspecting: 'Back to Prospecting',
        backAria: 'Back',
        topDealsOnly: 'Top deals only',
        topDealsOnlyShort: 'TOP',
        ghostShort: 'Ghost',
        mapTitleShort: 'Predator Map',
        kpiMappedListings: 'Mapped listings',
        kpiTopDeals: 'Top deals',
        kpiHighUrgency: 'High urgency',
        emptyNoListings: 'No listings found',
        emptyNoGhosts: 'No ghost listings available',
        emptyEnableGhostHint: 'Enable Ghost Listings to see more options',
        closeDetailAria: 'Close detail',
        badgeTopDeal: 'TOP DEAL',
        badgeHighUrgency: 'HIGH URGENCY',
        urgencyScoreTitle: 'Urgency score',
        ghostListingDays: 'Ghost listing: {days} days on market',
        marketGapTitle: 'Market gap',
        marketGapVsArea: 'vs area average',
        preview3dTitle: '3D preview',
        quickActionsTitle: 'Quick actions',
        callingInProgress: 'Calling…',
        whatsappProjectCta: 'Send WhatsApp project',
        viewOriginalListing: 'View original listing →',
      },
      opportunitiesPage: {
        title: 'Opportunity Radar',
        subtitle:
          'Find underpriced properties, old listings, or never-contacted owners for new mandates.',
        type: 'Opportunity type',
        underpriced: 'Underpriced',
        old: 'Old listings',
        uncontacted: 'Never contacted',
        city: 'City (optional)',
        cityPlaceholder: 'Milan',
        oldDays: 'Older than (days)',
        loading: 'Loading...',
        refresh: 'Refresh',
        results: 'Results',
        noResults: 'No opportunities found with the current filters.',
        selectListing: 'Select a listing to open details.',
        loadingResults: 'Loading opportunities...',
        loadFailed: 'Could not load opportunities.',
        unknown: 'unknown',
        status: 'Status',
        na: 'n/a',
        filtersTitle: 'Search filters',
        filtersDescription: 'Refine opportunity type and area.',
      },
      autopilotPage: {
        title: 'Mandate Autopilot 24/7',
        subtitle:
          'Scraper and Voice AI work every day to find new mandates and create leads automatically.',
        active: 'Autopilot enabled',
        rulePlaceholder: 'Rule name (e.g. Milan Center Mandates)',
        city: 'City',
        region: 'Region/Province',
        minPrice: 'Minimum price',
        maxPrice: 'Maximum price',
        runHour: 'Run time (UTC)',
        dailyLimit: 'Max new leads per day',
        saving: 'Saving...',
        save: 'Save Autopilot rule',
        lastRuns: 'Latest runs',
        noRuns: 'No runs recorded.',
        opportunities: 'opportunities',
        leads: 'leads',
        recentActions: 'Recent actions',
        noActions: 'No actions recorded.',
        defaultRule: 'Mandate Autopilot',
        loadError: 'Unable to load Autopilot configuration.',
        saveSuccess: 'Autopilot rule saved',
        saveError: 'Error while saving Autopilot rule.',
        saveToastTitle: 'Mandate autopilot',
        configCardTitle: 'Rule configuration',
        configCardDescription: 'Enable Autopilot, areas, and daily limits.',
      },
      workspacePage: {
        loading: 'Loading settings...',
        heroTitle: 'Feature Control Center',
        heroSubtitle: 'Customize your dashboard by enabling or disabling modules',
        trialActive: 'Trial active',
        trialDesc:
          'You have access to all modules for the next {days} days. After the trial, only the modules in your plan will be available.',
        howItWorks: '💡 How it works',
        howItWorksBullets: [
          'Disabled modules will disappear from the dashboard sidebar',
          'During the trial, all modules are available',
          'After the trial, only modules included in your plan can be enabled',
          'Settings are saved automatically',
        ],
        prefsTitle: 'Language, currency & timezone',
        prefsSubtitle:
          'Same choices as the header — manage them in one place. Timezone affects dates and times across the dashboard (billing, automations, etc.).',
        timezoneLabel: 'Time zone',
        timezoneHint:
          'Saved in this browser. If your zone is missing, pick UTC and contact support.',
        previewLabel: 'Local time preview',
        insufficientPlan: 'Insufficient plan',
        insufficientPlanDesc: 'This module requires the {plan} plan. Upgrade your account.',
        moduleUpdated: 'Module updated',
        moduleEnabled: 'enabled',
        moduleDisabled: 'disabled',
        errorTitle: 'Error',
        saveError: 'Unable to save settings.',
        trialBadge: 'Trial',
        modules: {
          scraper: {
            name: 'Global Scraper',
            desc: 'Automatic scanning of Idealista, Zillow, Immobiliare.it',
          },
          ai_voice: {
            name: 'AI Voice Calling',
            desc: 'Automatic calls with Bland AI',
          },
          '3d_staging': {
            name: '3D Virtual Staging',
            desc: '3D visualization generation post-renovation',
          },
          price_sniper: {
            name: 'Price Drop Sniper',
            desc: 'Automatic price drop detection',
          },
          commercial: {
            name: 'Commercial Intelligence',
            desc: 'Commercial property analysis and Business Features',
          },
          territory_map: {
            name: 'Territory Commander',
            desc: 'Tactical map and territory analysis',
          },
          smart_briefing: {
            name: 'AI Smart Briefing',
            desc: 'Automatic summary of pros/cons/target',
          },
          xray_vision: {
            name: 'AI X-Ray Vision',
            desc: 'Technical image analysis for defects/features',
          },
          competitor_radar: {
            name: 'Competitor Radar',
            desc: 'Expiring mandate detection',
          },
        },
        timezoneRegions: {
          EU: 'Europe',
          US: 'United States',
          NA: 'North America',
          LATAM: 'LATAM',
          ME: 'Middle East',
          APAC: 'APAC',
          UTC: 'UTC',
        },
      },
      leadsPage: leadsPageUiEn,
      leadPipelinePage: leadPipelinePageUiEn,
      crmApiKeysPage: crmApiKeysPageUiEn,
      crmAutomationRulesPage: crmAutomationRulesPageUiEn,
      workflowAutomationsPage: workflowAutomationsPageUiEn,
      leadDetailPage: leadDetailPageUiEn,
      communicationsHub: communicationsHubUiEn,
      predatorLiveBadge: {
        livePrefix: 'LIVE:',
        predatorsOnline: 'Predators online',
      },
      onboardingChecklist: {
        title: 'Your first 5 steps',
        subtitle: 'Complete this checklist to get value fast. You can hide it anytime — progress is saved in this browser.',
        dismiss: 'Hide',
        dismissAria: 'Hide onboarding checklist',
        progress: '{done} of {total} done',
        allDone: 'Great — you completed every step.',
        steps: {
          generate: {
            title: 'Generate your first listing with AI',
            description: 'Start with Perfect Copy or other copy tools: titles, descriptions, and variants in minutes.',
            cta: 'Open Perfect Copy',
          },
          library: {
            title: 'Save a listing to your library',
            description: 'Keep your best drafts and reuse them for portals or clients.',
            cta: 'Open library',
          },
          pipeline: {
            title: 'Organize leads in the pipeline',
            description: 'Move leads across stages and stay on top of follow-ups.',
            cta: 'Open pipeline',
          },
          billing: {
            title: 'Review plan and billing',
            description: 'See your active plan and how upgrades or invoices work.',
            cta: 'Open billing',
          },
          workspace: {
            title: 'Configure your workspace',
            description: 'Enable the modules you use daily (CRM, voice, maps, and more).',
            cta: 'Workspace settings',
          },
        },
      },
      contextualHelp: {
        openGuideAria: 'Open the guide in a new tab',
        openGuideTooltip: 'Opens documentation for this feature (new tab).',
        fieldHintAria: 'Field hint',
      },
      commandCenterTitle: 'Command Center',
      commandCenterSubtitle:
        'Your plan, usage, and AI tools for listings, leads, and prospecting — in one place.',
      newListingCta: 'New listing',
      liveFeed: {
        deal: 'Golden Deal',
        call: 'AI Call',
        staging: 'Virtual Staging',
        priceDrop: 'Price Drop',
        subtitle: 'Global real-time activity',
        cta: 'You are part of a global elite network. Do not fall behind.',
        infixDeal: 'detected in',
        infixCall: 'successfully scheduled in',
        infixStaging: 'generated for property in',
        priceDropLine: 'Price Drop Sniper activated in',
      },
      proTips: {
        ariaSection: 'Pro Tips',
        title: 'Pro Tips for Better Listings',
        tip1: 'Include specific details about location, amenities, and unique features',
        tip2: 'Use accurate square footage and room count for better AI results',
        tip3: 'Generate multiple versions and choose the one that best fits your needs',
      },
      docsHubOpen: 'Open Documentation Hub',
      stats3d: {
        projects3d: '3D Projects',
        generated: 'Generated',
        whatsappOpen: 'WhatsApp Open Rate',
        openRate: 'Open rate',
        aiViews: 'AI views generated',
        openedOfSent: '{opened} opened out of {sent} sent',
        noMessages: 'No messages sent yet',
      },
      sniperStats: {
        title: 'Sniper stats',
        priceDropsToday: 'Price Drops Today',
        detected: 'Detected',
        expirations: 'Expirations',
        opportunities: 'Opportunities',
        last48h: 'Detected in the last 48h',
        offline120: 'Properties offline 120+ days',
        loadError: 'Unable to load Sniper statistics.',
      },
      regionalPortals: {
        title: 'Priority Portals',
        primaryMarkets: 'Primary Markets',
        secondaryMarkets: 'Secondary Markets',
        currency: 'Currency',
        units: 'Units',
        regionUsa: 'United States',
        regionEurope: 'Europe',
        regionMiddleEast: 'Middle East',
        regionGlobal: 'Global',
        unitSqft: 'sq ft',
        unitSqm: 'm²',
      },
      profitDashboard: {
        title: 'Your ROI This Month',
        hoursSaved: 'Hours Saved',
        hours: 'hrs',
        perListing: 'min per listing',
        valueGenerated: 'Value Generated',
        estimatedValue: 'estimated per listing',
        generatedListings: 'Listings generated',
        amazing: 'Amazing!',
        saved10Hours: 'You saved more than 10 hours this month',
      },
      morningBriefing: {
        na: 'N/A',
        sent: 'Test notification sent!',
        sentDesc: 'Check your email and WhatsApp',
        error: 'Error',
        sendError: 'Unable to send notification',
        connectionError: 'Connection error',
        title: 'Your Briefing Today',
        subtitle: 'Top 3 opportunities with the highest market gap (last 24h)',
        configure: 'Configure',
        priceDown: 'Price',
        highUrgency: 'High Urgency',
        target: 'Target',
        fomo: 'These deals have also been sent to',
        partnerAgencies: 'partner agencies in your area. Move fast!',
        sendTest: 'Send Test to My Phone',
      },
      competitorRadar: {
        na: 'N/A',
        title: 'Expiration Radar',
        subtitle: 'Properties offline or stale for 120+ days',
        removed: 'Removed',
        stale: 'Stale',
        aiNote: 'AI note',
        offlineFor: 'Offline for',
        days: 'days',
        viewAll: 'View all',
        refreshAria: 'Refresh list',
      },
      planCards: {
        generateNewListing: 'Generate New Listing',
        aiScraper: 'AI Scraper',
        linkAnalysis: 'Link Analysis',
        premiumPdfCards: 'Premium PDF Cards',
        allFreeFeatures: 'All Free features',
        leadScoringAi: 'Lead Scoring AI',
        perfectCopy20: 'Perfect Copy 2.0',
        translator12Languages: '12 Language Translator',
        allStarterFeatures: 'All Starter features',
        fullCrmPipeline: 'Full CRM + Pipeline',
        virtualStaging3d: 'Virtual Staging 3D',
        aiVoiceCallingMonthly: 'AI Voice Calling (30/month)',
        agencyAssistantAi: 'Agency Assistant AI',
        allProFeatures: 'All Pro features',
        unlimitedAiVoiceCalling: 'Unlimited AI Voice Calling',
        auraVrVirtualTour: 'Aura VR: Virtual Tour',
        teamUpToAgents: 'Team up to 10 agents',
        omnichannelSuite: 'Omnichannel Suite',
        agencyBoostTitle: 'Agency Boost',
        agencyBoostSubtitle: 'Done-for-you setup',
        oneTime: 'one-time',
        boostSetupComplete: 'Full done-for-you setup',
        boostOnboarding: 'Guided implementation and onboarding',
        boostLaunchSupport: 'Premium launch support',
        boostCustomConfig: 'Custom configuration',
        buyAgencyBoost: 'Buy Agency Boost',
      },
      planFeatures: planFeaturesUiEn,
    },
    auth: {
      backToHome: 'Back to home',
      login: {
        title: 'Welcome back 👋',
        subtitle: 'Sign in to your account to continue',
        email: 'Email address',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        newTo: 'New to PropertyPilot AI?',
        createFreeAccount: 'Create free account',
        secureNote: 'Secure login • Your data is protected with industry-standard encryption',
      },
      signup: {
        title: 'Create your account ✨',
        subtitle: 'Start generating professional property listings with AI',
        fullName: 'Full Name',
        email: 'Email address',
        password: 'Password',
        minChars: 'Must be at least 6 characters',
        freePlanIncludes: 'Free plan includes:',
        listingsPerMonth: '5 listings per month',
        allAIFeatures: 'All AI features',
        noCreditCard: 'No credit card required',
        createFreeAccount: 'Create Free Account',
        creatingAccount: 'Creating account...',
        alreadyHaveAccount: 'Already have an account?',
        signInInstead: 'Sign in instead',
        termsAgreeBefore: 'By signing up, you agree to our ',
        termsAgreeAnd: ' and ',
      },
      toast: {
        error: 'Error',
        fillAllFields: 'Please fill in all required fields.',
        tooManyAttempts: 'Too many attempts',
        rateLimitMsg: 'We detected too many attempts. For your security, try again in a few minutes.',
        welcomeBack: 'Welcome back! 🎉',
        completePayment: 'Complete payment in the dashboard.',
        loginSuccess: 'Successfully signed in.',
        accountCreated: 'Account created! 🎉',
        redirectPayment: 'You will be redirected to complete payment.',
        welcomePropertyPilot: 'Welcome to PropertyPilot AI!',
        turnstileRequired: 'Please complete the security check before continuing.',
        turnstileFailed: 'Security verification failed. Please try again.',
        turnstileLoadFailed: 'Could not load the security check. Refresh the page or try again later.',
        turnstileMisconfigured: 'Security check is misconfigured on the server. Please contact support.',
      },
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Transform a smartphone video into an immersive 3D VR tour',
      startScan: 'Start Aura VR Scan',
      processing: {
        analyzing: '📹 Analyzing video...',
        mapping: '🏠 Mapping rooms...',
        rendering: '🎥 Cinematic 3D Rendering...',
        optimizing: '✨ Optimizing VR for mobile...',
        preparing: '🌐 Preparing VR link...',
        finalizing: '⚡ Finalizing immersive tour...',
        complete: '✅ VR Tour Ready!',
      },
      progress: {
        analyzingSub: 'Key frame detection',
        mappingSub: '3D spatial reconstruction',
        renderingSub: 'Generating immersive textures',
        optimizingSub: 'Compression and streaming',
        preparingSub: 'Configuring public access',
        finalizingSub: 'Adding cinematic effects',
        completeSub: 'Link generated successfully',
      },
      result: {
        title: 'VR Tour Generated!',
        subtitle: 'Your immersive tour is ready to share',
        linkLabel: 'VR Link:',
        copyLink: 'Copy Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generate new tour',
        videoSource: 'Smartphone video',
        tourTime: 'VR Tour in 60s',
      },
      aria: {
        message: 'Aria: Great work!',
        stats: 'This scan will attract',
        action: 'more visits. Would you like me to send it to your hot leads?',
      },
    },
    errors: {
      somethingWentWrong: 'Something went wrong',
      unexpectedError: 'An unexpected error occurred. Don\'t worry, your data is safe.',
      unknownError: 'Unknown error',
      errorId: 'Error ID',
      tryAgain: 'Try again',
      backToHome: 'Back to Home',
      pageNotFound: 'Page not found',
      pageNotFoundDesc: 'The page you are looking for does not exist or has been moved.',
      dashboard: 'Dashboard',
    },
    demo: {
      nav: { pricing: 'Pricing', login: 'Login', startFree: 'Start Free' },
      hero: { badge: 'Book in 30 seconds', title: 'Book a Free Demo', subtitle: 'Discover how PropertyPilot AI can transform your real estate agency. 30 minutes with our expert to see the platform in action.' },
      calendly: { chooseDate: 'Choose Date & Time', demoFree: 'Free 30-minute demo', preferContact: 'Prefer to contact us directly?', whatsapp: 'WhatsApp', sendEmail: 'Send Email' },
      valuePoints: { sectionTitle: 'What You\'ll Discover in the Demo', sectionSubtitle: 'A complete overview of the features that will make your agency more efficient.', bookNow: 'Book Your Demo Now' },
      valuePointsList: [
        { title: 'Advanced Generative AI', description: 'Create professional listings, A/B titles, SEO descriptions and marketing content in seconds.' },
        { title: 'Dynamic CRM 4.0', description: 'Manage your leads with Kanban pipeline, AI lead scoring and automatic enrichment.' },
        { title: 'Smart Automations', description: '20+ AI automations for follow-up, email, WhatsApp and effortless lead management.' },
        { title: 'AI Lead Scoring', description: 'Identify the hottest leads with 0-100 scores and prioritize your activities.' },
        { title: 'Communication Hub', description: 'Email, SMS and WhatsApp integrated in one dashboard with AI templates.' },
        { title: 'Custom Branding', description: 'White-label PDFs, professional property sheets and materials with your brand.' },
      ],
      testimonials: { title: 'What Our Customers Say', subtitle: 'Agents and agencies who have already transformed their business with PropertyPilot AI' },
      footer: { home: 'Home', pricing: 'Pricing', contact: 'Contact', login: 'Login' },
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We\'re here to help. Contact our team for any questions.',
      support: { title: 'Customer Support', desc: 'Need technical assistance or questions about your account? Our support team is ready to help.' },
      sales: { title: 'Sales Enquiries', desc: 'Interested in Business or Enterprise plans? Let\'s discuss your business needs.' },
      demo: { title: 'Want a Demo?', desc: 'Discover how PropertyPilot AI can transform your real estate business. Book a free demo with our team.', cta: 'Book Free Demo' },
      form: { title: 'Send Us a Message', name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', namePlaceholder: 'Your name', emailPlaceholder: 'your@email.com', subjectPlaceholder: 'Message subject', messagePlaceholder: 'Write your message here...', submit: 'Send Message' },
      validation: { nameMin: 'Name must be at least 2 characters', emailInvalid: 'Enter a valid email', messageMin: 'Message must be at least 10 characters', checkFields: 'Check the highlighted fields.' },
      toast: { successTitle: 'Message sent!', successDesc: 'We\'ll get back to you within 24 hours.', errorTitle: 'Error', errorDesc: 'Unable to send message. Please try again.', validationTitle: 'Validation error' },
      home: 'Home',
    },
    common: {
      copy: 'Copy',
      share: 'Share',
      send: 'Send',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      loading: 'Loading...',
      error: 'Error',
    },
    billing: {
      title: 'Subscription',
      titleAccent: 'Management',
      subtitle: 'View and manage your subscription plan',
      noSubscription: 'No subscription',
      noActiveSubscription: 'No active subscription',
      viewPlans: 'View available plans',
      subscribeToUnlock: 'Subscribe to unlock premium features',
      currentPlanPrefix: 'Plan',
      perMonth: '/month',
      unlimitedListings: 'Unlimited listings',
      listingsPerMonth: 'listings per month',
      nextRenewal: 'Next renewal:',
      cancelWarning: 'Your subscription will be cancelled at the end of the billing period. You will return to the free plan.',
      managePayments: 'Manage Payments',
      unlockPremium: 'Unlock Premium Features',
      specialPackage: 'Special Package',
      oneTime: 'one-time',
      whatIncludes: "What's included:",
      buyAgencyBoost: 'Buy Agency Boost',
      starterForBeginners: 'To get started',
      proForProfessionals: 'For professionals',
      agencyForTeams: 'For teams',
      recommended: 'Recommended',
      freePlanName: 'Free',
      expiring: 'Expiring',
      reactivateSubscription: 'Reactivate Subscription',
      cancelSubscription: 'Cancel Subscription',
      cancelledTitle: 'Subscription cancelled',
      reactivatedTitle: 'Subscription reactivated',
      completedUpgradeTitle: 'Upgrade completed!',
      changedPlanTitle: 'Plan changed!',
      upgradeErrorTitle: 'Upgrade Error',
      startCheckoutError: 'Unable to start checkout.',
      cancelError: 'Unable to cancel subscription.',
      reactivateError: 'Unable to reactivate subscription.',
      portalError: 'Unable to open billing portal.',
      upgradeError: 'Unable to complete upgrade.',
      reloadMessage: 'Reloading page...',
      switchToStarter: 'Switch to Starter',
      switchToPro: 'Switch to Pro',
      switchToAgency: 'Switch to Agency',
      upgradeToPro: 'Upgrade to Pro',
      upgradeToAgency: 'Upgrade to Agency',
      stripeTrust:
        'Secure payments powered by Stripe. Cards, payment methods, and invoices are managed in the Stripe customer portal.',
      subscriptionFetchErrorBody: 'Unable to load subscription. Showing Free plan.',
      retry: 'Retry',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Features',
        pricing: 'Pricing',
        compliance: 'Compliance',
        login: 'Login',
        getStarted: 'Get Started',
      },
      hero: {
        poweredBy: 'Powered by GPT-4',
        titlePart1: 'Your Real Estate',
        titlePart2: 'Agent',
        titleAI: 'AI',
        socialProof: 'Trusted by',
        socialProofAgencies: '+500 agencies',
        socialProofLocation: 'in Europe',
        subtitle: 'The only AI Operating System that finds, analyzes, and secures mandates completely autonomously',
        ctaStart: 'Start Free',
        ctaDemo: 'View Demo',
        trustedBy: 'Compatible with major portals',
        stats: {
          automation: 'Automation',
          listingsPerDay: 'Listings/Day',
          conversionRate: 'Conversion Rate',
        },
      },
      features: {
        title: 'Why PropertyPilot AI?',
        subtitle: 'The complete AI platform for real estate agents who want to scale',
        aiListing: {
          title: 'AI Listing Engine',
          description: 'Generate professional listings in seconds with custom styles (Luxury, Investment, Standard Pro). Multi-language and optimized for Zillow, Idealista, Immobiliare.',
          benefit: 'Save 5 hours per week on listing writing',
        },
        crmAI: {
          title: 'CRM AI Intelligence',
          description: 'Automatic Lead Scoring, multi-channel AI follow-up (WhatsApp, Email, SMS). Categorizes HOT/WARM/COLD leads and suggests priority actions.',
          benefit: 'Increase conversions by 40% with AI prioritization',
        },
        globalReach: {
          title: 'Global Reach',
          description: 'We operate in USA (Zillow, MLS), Italy (Idealista, Immobiliare), Spain (Idealista.es). Localized terminology and market formats.',
          benefit: 'Expand your business across 3 continents',
        },
      },
      searchEngine: {
        title: 'The Search Engine That Never Sleeps',
        subtitle: 'Available',
        exclusive: 'EXCLUSIVELY',
        exclusiveInPlan: 'in the AGENCY plan',
        benefit: 'Save 20 hours of phone calls per week',
        step1: {
          title: 'Global Scan',
          description: 'AI automatically scans Idealista, Immobiliare, Zillow, and MLS 24/7, finding thousands of listings every day.',
          status: 'Scanning in progress...',
        },
        step2: {
          title: 'AI Filtering',
          description: 'Each listing receives an AI Lead Score (0-100). Only "TOP DEAL" (80+) are selected for calls.',
          status: 'TOP DEAL detected',
        },
        step3: {
          title: 'Automatic Call',
          description: 'Voice AI (Bland AI) calls owners, handles objections, and proposes appointments naturally and persuasively.',
          status: 'Call in progress...',
        },
        step4: {
          title: 'Appointment in Calendar',
          description: 'The appointment is automatically added to your Google Calendar and you receive an email notification with all details.',
          status: 'Appointment confirmed',
        },
      },
      tuesdayMorning: {
        title: 'Your New Tuesday Morning',
        subtitle: 'Imagine waking up with the work already done',
        time1: '08:00 AM',
        time1Title: 'AI has already analyzed 500 listings',
        time1Desc: 'While you slept, the system scanned Idealista, Immobiliare, Zillow, and MLS. Each listing was analyzed and classified with an AI Lead Score.',
        time2: '08:30 AM',
        time2Title: '3 owners have confirmed the visit',
        time2Desc: 'Voice AI called the owners of TOP DEALs (score 80+). Three have already confirmed availability for a visit this week.',
        time3: '09:00 AM',
        time3Title: 'You wake up and open your already full calendar',
        time3Desc: 'Open PropertyPilot AI and find 3 appointments already scheduled, with all property details, owner contacts, and AI notes.',
      },
      testimonials: {
        title: 'Loved by Agents Worldwide',
        subtitle: 'Thousands of real estate agents trust PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Real Estate Agent, Milan',
          content: 'PropertyPilot AI has tripled my business. The AI Lead Scoring tells me exactly which leads to focus on.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Real Estate Agent, Miami',
          content: 'The listing generation feature is incredible. I create professional listings in 30 seconds instead of hours.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agent, Barcelona',
          content: 'The AI CRM is a game-changer. Automatic follow-ups save me 10 hours per week.',
        },
      },
      aria: {
        badge: 'Available in all plans',
        title: 'Aria - Your AI Success Partner',
        subtitle: 'Your personal coach, always available. Onboarding, strategy, motivation: everything in one chat.',
        mentoring: {
          title: '24/7 Mentoring',
          description: 'Never alone in negotiations again. Aria guides you step by step, even when the client raises difficult objections.',
          benefit: 'Reduce stress and increase confidence',
        },
        onboarding: {
          title: 'Instant Onboarding',
          description: 'Learn to master PropertyPilot in 5 minutes by talking to Aria. No long tutorials, just natural conversation.',
          benefit: 'Become productive immediately',
        },
        support: {
          title: 'Psychological Support',
          description: 'The ally that motivates you to close that mandate when the challenge gets tough. Aria knows sales psychology.',
          benefit: 'Keep motivation high',
        },
        available: 'Aria is always available. Click the bubble in the bottom right to start.',
        availableFree: 'Also available in the FREE plan',
      },
      pricing: {
        title: 'Pricing',
        subtitle: 'Compare plans and choose the perfect one for your business',
        feature: 'Feature',
        bestValue: 'BEST VALUE',
        perMonth: '/month',
        agencySubtitle: 'Omnichannel Domination Suite',
        agencyExtra: '+ Commercial Module & Extended Arbitrage',
        features: {
          listingsPerMonth: 'Listings per month',
          aiGeneration: 'AI Listing Generation',
          aiStyles: 'AI Styles (Luxury, Investment, Pro)',
          multilingual: 'Multi-language (IT, EN, ES)',
          pdf: 'Professional PDFs',
          crm: 'Complete CRM',
          kanban: 'Kanban Pipeline',
          leadScoring: 'Base AI Lead Scoring',
          briefing: 'Multi-Category Smart Briefing',
          staging: '3D Virtual Staging',
          followup: 'Multi-channel AI Follow-up',
          automations: 'AI Automations',
          forms: 'Smart Lead Capture Forms',
          whiteLabel: 'White-label PDF',
          assistant: 'Agency Assistant AI',
          multiUser: 'Multi-user',
          roles: 'Roles and Permissions',
          distribution: 'Automatic Lead Distribution',
          reports: 'Team Activity Reports',
          multiOffice: 'Multi-office Integration',
          auraVR: '🥽 Aura VR: Cinematic Virtual Tour Generation',
          voiceCalling: 'AI Voice Calling (Bland AI)',
          messaging: 'AI Smart Messaging (SMS/WhatsApp AI)',
          manualOverride: 'Manual Override: Direct owner data access',
          humanOverride: 'Human intervention freedom',
          autoProspecting: '24/7 Auto-Prospecting',
          scraping: 'Intelligent Scraping',
          dashboard: 'War Room Dashboard',
          calendar: 'Google Calendar Integration',
          notifications: 'Automatic Email Notifications',
          support: 'Support',
        },
        plans: {
          free: 'FREE',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Unlimited',
          advanced: 'Advanced',
          exclusive: 'EXCLUSIVE',
          active: 'Active',
          viewer: 'Viewer',
          community: 'Community',
          email: 'Email',
          priority: 'Priority',
          dedicated: 'Dedicated 24/7',
        },
        cta: {
          startFree: 'Start Free',
          chooseStarter: 'Choose Starter',
          choosePro: 'Choose Pro',
          chooseAgency: 'Choose Agency',
        },
      },
      cta: {
        title: 'Ready to multiply your business?',
        subtitle: 'Join hundreds of agents already using PropertyPilot AI',
        button: 'Get Started Free',
      },
      footer: {
        tagline: 'Your Real Estate AI Agent that works 24/7',
        product: 'Product',
        company: 'Company',
        support: 'Support',
        pricing: 'Pricing',
        dashboard: 'Dashboard',
        features: 'Features',
        about: 'About Us',
        contact: 'Contact',
        blog: 'Blog',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        refund: 'Refund Policy',
        copyright: 'All rights reserved.',
      },
      pricingPage: {
        badge: 'Transparent Pricing',
        mainTitle: 'Choose the',
        mainTitle2: 'Perfect Plan for You',
        subtitle: 'Plans designed for every stage of your real estate business. Start free, scale when ready.',
        trustCancel: 'Cancel anytime',
        trustTrial: '7-day free trial',
        trustSupport: 'Support in your language',
        demo: 'Demo',
        whyChoose: 'Why Choose PropertyPilot AI?',
        whySubtitle: 'Premium features for every real estate professional',
        faqTitle: 'Frequently Asked Questions',
        faqSubtitle: 'Everything you need to know about our plans',
        ctaTitle: 'Ready to Transform Your Listings?',
        ctaSubtitle: 'Start free today and discover how AI can elevate your real estate business.',
        ctaStartFree: 'Start Free',
        ctaWatchDemo: 'Watch Demo',
        features: [
          { title: 'AI GPT-4 Premium', desc: 'Most advanced AI models on the market' },
          { title: '100% Localized', desc: 'Content optimized for your market' },
          { title: 'Instant Generation', desc: 'Results in under 30 seconds' },
          { title: 'Easy to Use', desc: 'No technical skills required' },
          { title: 'Professional Listings', desc: 'Agency-level communication quality' },
          { title: 'Multi-Agency', desc: 'Manage multiple offices with one account' },
        ],
        faqs: [
          { question: "Can I change my plan at any time?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will apply at the next billing cycle." },
          { question: "Is there a free trial?", answer: "Yes, we offer a 7-day free trial on all paid plans. No credit card required to start." },
          { question: "What happens if I exceed my plan limits?", answer: "We'll notify you when you approach limits. You can easily upgrade to a higher plan to keep growing." },
          { question: "How does the Agency plan work?", answer: "The Agency plan is designed for teams and multi-agencies. It includes unlimited listings, all features, and dedicated support." },
          { question: "Can I cancel my subscription?", answer: "Yes, you can cancel anytime from the dashboard. Access remains active until the end of your paid period." },
          { question: "Do you offer support in my language?", answer: "Absolutely! Our support team is available via email and chat in your preferred language." },
        ],
      },
    },
  },
  
  es: {
    dashboard: {
      title: 'Panel de Control',
      subtitle: 'Tablero de mandos',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      currentPlan: 'Plan Actual',
      dashboardAI: 'Dashboard IA',
      thisMonth: 'Este Mes',
      saved: 'Guardados',
      noSavedListings: 'Ningún anuncio guardado',
      planFree: '5 anuncios al mes',
      planStarter: '50 anuncios al mes',
      planPro: '200 anuncios al mes',
      planAgency: 'Anuncios ilimitados',
      remainingListings: 'anuncios restantes',
      unlimitedAvailable: 'Anuncios ilimitados disponibles',
      chooseYourPlan: 'Elige tu Plan',
      activeBadge: 'Activo',
      yourCurrentPlan: 'Tu plan actual',
      forBeginners: 'Para empezar',
      forProfs: 'Para profesionales',
      forTeam: 'Para equipos',
      freePrice: 'Gratis',
      choosePlan: 'Elegir Plan',
      startFree: 'Empezar Gratis',
      upgradeToStarter: 'Pasar a Starter',
      upgradeToPro: 'Pasar a Pro',
      upgradeToAgency: 'Pasar a Agency',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    auraVR: {
      title: 'Generador Aura VR',
      subtitle: 'Transforma un video del smartphone en un tour VR inmersivo 3D',
      startScan: 'Iniciar Escaneo Aura VR',
      processing: {
        analyzing: '📹 Analizando video...',
        mapping: '🏠 Mapeando habitaciones...',
        rendering: '🎥 Renderizado Cinematográfico 3D...',
        optimizing: '✨ Optimizando VR para móvil...',
        preparing: '🌐 Preparando enlace VR...',
        finalizing: '⚡ Finalizando tour inmersivo...',
        complete: '✅ ¡Tour VR Listo!',
      },
      progress: {
        analyzingSub: 'Detección de frames clave',
        mappingSub: 'Reconstrucción espacial 3D',
        renderingSub: 'Generando texturas inmersivas',
        optimizingSub: 'Compresión y streaming',
        preparingSub: 'Configurando acceso público',
        finalizingSub: 'Añadiendo efectos cinematográficos',
        completeSub: 'Enlace generado con éxito',
      },
      result: {
        title: '¡Tour VR Generado!',
        subtitle: 'Tu tour inmersivo está listo para compartir',
        linkLabel: 'Enlace VR:',
        copyLink: 'Copiar Enlace',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generar nuevo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR en 60s',
      },
      aria: {
        message: 'Aria: ¡Excelente trabajo!',
        stats: 'Este escaneo atraerá un',
        action: 'más de visitas. ¿Quieres que lo envíe a tus leads calientes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartir',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Características',
        pricing: 'Precios',
        compliance: 'Cumplimiento',
        login: 'Iniciar Sesión',
        getStarted: 'Comenzar',
      },
      hero: {
        poweredBy: 'Impulsado por GPT-4',
        titlePart1: 'Tu Agente',
        titlePart2: 'Inmobiliario',
        titleAI: 'IA',
        socialProof: 'Elegido por',
        socialProofAgencies: '+500 agencias',
        socialProofLocation: 'en Europa',
        subtitle: 'El único Sistema Operativo IA que encuentra, analiza y obtiene mandatos de forma totalmente autónoma',
        ctaStart: 'Empezar Gratis',
        ctaDemo: 'Ver Demo',
        trustedBy: 'Compatible con los principales portales',
        stats: {
          automation: 'Automatización',
          listingsPerDay: 'Anuncios/Día',
          conversionRate: 'Tasa de Conversión',
        },
      },
      features: {
        title: '¿Por qué PropertyPilot AI?',
        subtitle: 'La plataforma IA completa para agentes inmobiliarios que quieren escalar',
        aiListing: {
          title: 'Motor de Anuncios IA',
          description: 'Genera anuncios profesionales en segundos con estilos personalizados (Lujo, Inversión, Estándar Pro). Multiidioma y optimizado para Zillow, Idealista, Immobiliare.',
          benefit: 'Ahorra 5 horas a la semana en escritura de anuncios',
        },
        crmAI: {
          title: 'Inteligencia CRM IA',
          description: 'Puntuación de Leads automática, seguimiento IA multicanal (WhatsApp, Email, SMS). Categoriza leads CALIENTES/TIBIOS/FRÍOS y sugiere acciones prioritarias.',
          benefit: 'Aumenta conversiones en un 40% con priorización IA',
        },
        globalReach: {
          title: 'Alcance Global',
          description: 'Operamos en USA (Zillow, MLS), Italia (Idealista, Immobiliare), España (Idealista.es). Terminología localizada y formatos de mercado.',
          benefit: 'Expande tu negocio en 3 continentes',
        },
      },
      searchEngine: {
        title: 'El Motor de Búsqueda que Nunca Duerme',
        subtitle: 'Disponible',
        exclusive: 'EXCLUSIVAMENTE',
        exclusiveInPlan: 'en el plan AGENCY',
        benefit: 'Ahorra 20 horas de llamadas telefónicas a la semana',
        step1: {
          title: 'Escaneo Global',
          description: 'La IA escanea automáticamente Idealista, Immobiliare, Zillow y MLS 24/7, encontrando miles de anuncios cada día.',
          status: 'Escaneo en curso...',
        },
        step2: {
          title: 'Filtrado IA',
          description: 'Cada anuncio recibe una Puntuación de Lead IA (0-100). Solo los "TOP DEAL" (80+) se seleccionan para llamadas.',
          status: 'TOP DEAL detectado',
        },
        step3: {
          title: 'Llamada Automática',
          description: 'Voice IA (Bland AI) llama a los propietarios, gestiona objeciones y propone citas de forma natural y persuasiva.',
          status: 'Llamada en curso...',
        },
        step4: {
          title: 'Cita en Agenda',
          description: 'La cita se añade automáticamente a tu Google Calendar y recibes una notificación por email con todos los detalles.',
          status: 'Cita confirmada',
        },
      },
      tuesdayMorning: {
        title: 'Tu Nuevo Martes por la Mañana',
        subtitle: 'Imagina despertar con el trabajo ya hecho',
        time1: '08:00',
        time1Title: 'La IA ya ha analizado 500 anuncios',
        time1Desc: 'Mientras dormías, el sistema escaneó Idealista, Immobiliare, Zillow y MLS. Cada anuncio fue analizado y clasificado con una Puntuación de Lead IA.',
        time2: '08:30',
        time2Title: '3 propietarios han confirmado la visita',
        time2Desc: 'Voice IA llamó a los propietarios de TOP DEALs (puntuación 80+). Tres ya han confirmado disponibilidad para una visita esta semana.',
        time3: '09:00',
        time3Title: 'Te despiertas y abres la agenda ya llena',
        time3Desc: 'Abre PropertyPilot AI y encuentra 3 citas ya programadas, con todos los detalles de la propiedad, contactos del propietario y notas IA.',
      },
      testimonials: {
        title: 'Amado por Agentes en Todo el Mundo',
        subtitle: 'Miles de agentes inmobiliarios confían en PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agente Inmobiliario, Milán',
          content: 'PropertyPilot AI ha triplicado mis negocios. La Puntuación de Leads IA me dice exactamente en qué leads concentrarme.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Agente Inmobiliario, Miami',
          content: 'La función de generación de anuncios es increíble. Creo anuncios profesionales en 30 segundos en lugar de horas.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agente, Barcelona',
          content: 'El CRM IA es un cambio de juego. Los seguimientos automáticos me ahorran 10 horas a la semana.',
        },
      },
      aria: {
        badge: 'Disponible en todos los planes',
        title: 'Aria - Tu Socio de Éxito IA',
        subtitle: 'Tu coach personal, siempre disponible. Onboarding, estrategia, motivación: todo en un chat.',
        mentoring: {
          title: 'Mentoría 24/7',
          description: 'Nunca más solo en las negociaciones. Aria te guía paso a paso, incluso cuando el cliente plantea objeciones difíciles.',
          benefit: 'Reduce el estrés y aumenta la confianza',
        },
        onboarding: {
          title: 'Onboarding Instantáneo',
          description: 'Aprende a dominar PropertyPilot en 5 minutos hablando con Aria. Sin tutoriales largos, solo conversación natural.',
          benefit: 'Conviértete en productivo de inmediato',
        },
        support: {
          title: 'Apoyo Psicológico',
          description: 'La aliada que te motiva a cerrar ese mandato cuando el desafío se vuelve difícil. Aria conoce la psicología de las ventas.',
          benefit: 'Mantén alta la motivación',
        },
        available: 'Aria está siempre disponible. Haz clic en la burbuja en la esquina inferior derecha para comenzar.',
        availableFree: 'También disponible en el plan GRATIS',
      },
      pricing: {
        title: 'Precios',
        subtitle: 'Compara los planes y elige el perfecto para tu negocio',
        feature: 'Característica',
        bestValue: 'MEJOR VALOR',
        perMonth: '/mes',
        agencySubtitle: 'Suite de Dominación Omnicanal',
        agencyExtra: '+ Módulo Comercial y Arbitraje Extendido',
        features: {
          listingsPerMonth: 'Anuncios al mes',
          aiGeneration: 'Generación de Anuncios IA',
          aiStyles: 'Estilos IA (Lujo, Inversión, Pro)',
          multilingual: 'Multiidioma (IT, EN, ES)',
          pdf: 'PDFs Profesionales',
          crm: 'CRM Completo',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Puntuación de Leads IA Base',
          briefing: 'Briefing Inteligente Multi-Categoría',
          staging: 'Virtual Staging 3D',
          followup: 'Seguimiento IA Multicanal',
          automations: 'Automatizaciones IA',
          forms: 'Formularios de Captura de Leads Inteligentes',
          whiteLabel: 'PDF White-label',
          assistant: 'Asistente IA de Agencia',
          multiUser: 'Multi-usuario',
          roles: 'Roles y Permisos',
          distribution: 'Distribución Automática de Leads',
          reports: 'Informes de Actividad del Equipo',
          multiOffice: 'Integración Multi-sede',
          auraVR: '🥽 Aura VR: Generación de Tour Virtual Cinematográfico',
          voiceCalling: 'Llamadas de Voz IA (Bland AI)',
          messaging: 'Mensajería Inteligente IA (SMS/WhatsApp IA)',
          manualOverride: 'Anulación Manual: Acceso directo a datos del propietario',
          humanOverride: 'Libertad de intervención humana',
          autoProspecting: 'Auto-Prospección 24/7',
          scraping: 'Scraping Inteligente',
          dashboard: 'Dashboard War Room',
          calendar: 'Integración con Google Calendar',
          notifications: 'Notificaciones por Email Automáticas',
          support: 'Soporte',
        },
        plans: {
          free: 'GRATIS',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Ilimitados',
          advanced: 'Avanzado',
          exclusive: 'EXCLUSIVO',
          active: 'Activo',
          viewer: 'Visualizador',
          community: 'Comunidad',
          email: 'Email',
          priority: 'Prioritario',
          dedicated: 'Dedicado 24/7',
        },
        cta: {
          startFree: 'Empezar Gratis',
          chooseStarter: 'Elegir Starter',
          choosePro: 'Elegir Pro',
          chooseAgency: 'Elegir Agency',
        },
      },
      cta: {
        title: '¿Listo para multiplicar tus negocios?',
        subtitle: 'Únete a cientos de agentes que ya usan PropertyPilot AI',
        button: 'Empezar Gratis',
      },
      footer: {
        tagline: 'Tu Agente Inmobiliario IA que trabaja 24/7',
        product: 'Producto',
        company: 'Empresa',
        support: 'Soporte',
        pricing: 'Precios',
        dashboard: 'Panel',
        features: 'Características',
        about: 'Sobre Nosotros',
        contact: 'Contacto',
        blog: 'Blog',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        refund: 'Política de Reembolso',
        copyright: 'Todos los derechos reservados.',
      },
      pricingPage: {
        badge: 'Precios Transparentes',
        mainTitle: 'Elige el Plan',
        mainTitle2: 'Perfecto para Ti',
        subtitle: 'Planes diseñados para cada etapa de tu negocio inmobiliario. Empieza gratis, escala cuando estés listo.',
        trustCancel: 'Cancela cuando quieras',
        trustTrial: 'Prueba gratuita 7 días',
        trustSupport: 'Soporte en tu idioma',
        demo: 'Demo',
        whyChoose: '¿Por Qué Elegir PropertyPilot AI?',
        whySubtitle: 'Funciones premium para cada profesional inmobiliario',
        faqTitle: 'Preguntas Frecuentes',
        faqSubtitle: 'Todo lo que necesitas saber sobre nuestros planes',
        ctaTitle: '¿Listo para Transformar tus Anuncios?',
        ctaSubtitle: 'Empieza gratis hoy y descubre cómo la IA puede elevar tu negocio inmobiliario.',
        ctaStartFree: 'Empieza Gratis',
        ctaWatchDemo: 'Ver Demo',
        features: [
          { title: 'IA GPT-4 Premium', desc: 'Modelos de IA más avanzados del mercado' },
          { title: '100% Localizado', desc: 'Contenido optimizado para tu mercado' },
          { title: 'Generación Instantánea', desc: 'Resultados en menos de 30 segundos' },
          { title: 'Fácil de Usar', desc: 'Sin conocimientos técnicos requeridos' },
          { title: 'Anuncios Profesionales', desc: 'Calidad de agencia de comunicación' },
          { title: 'Multi-Agencia', desc: 'Gestiona varias oficinas con una sola cuenta' },
        ],
        faqs: [
          { question: "¿Puedo cambiar de plan en cualquier momento?", answer: "Sí, puedes hacer upgrade o downgrade de tu plan cuando quieras. Los cambios se aplicarán en el próximo ciclo de facturación." },
          { question: "¿Hay periodo de prueba gratuito?", answer: "Sí, ofrecemos 7 días de prueba gratuita en todos los planes de pago. No se requiere tarjeta de crédito para empezar." },
          { question: "¿Qué pasa si supero los límites de mi plan?", answer: "Te avisaremos cuando te acerques a los límites. Podrás hacer upgrade fácilmente para seguir creciendo." },
          { question: "¿Cómo funciona el plan Agency?", answer: "El plan Agency está pensado para equipos y multi-agencies. Incluye anuncios ilimitados, todas las funciones y soporte dedicado." },
          { question: "¿Puedo cancelar mi suscripción?", answer: "Sí, puedes cancelar en cualquier momento desde el panel. El acceso permanece activo hasta el final del periodo ya pagado." },
          { question: "¿Ofrecen soporte en mi idioma?", answer: "¡Por supuesto! Nuestro equipo de soporte está disponible por email y chat en tu idioma." },
        ],
      },
    },
  },
  
  fr: {
    dashboard: {
      title: 'Tableau de Bord',
      subtitle: 'Panneau de contrôle',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      currentPlan: 'Plan Actuel',
      dashboardAI: 'Dashboard IA',
      thisMonth: 'Ce Mois-ci',
      saved: 'Enregistrés',
      noSavedListings: 'Aucune annonce enregistrée',
      planFree: '5 annonces par mois',
      planStarter: '50 annonces par mois',
      planPro: '200 annonces par mois',
      planAgency: 'Annonces illimitées',
      remainingListings: 'annonces restantes',
      unlimitedAvailable: 'Annonces illimitées disponibles',
      chooseYourPlan: 'Choisissez Votre Plan',
      activeBadge: 'Actif',
      yourCurrentPlan: 'Votre plan actuel',
      forBeginners: 'Pour commencer',
      forProfs: 'Pour les professionnels',
      forTeam: 'Pour les équipes',
      freePrice: 'Gratuit',
      choosePlan: 'Choisir le Plan',
      startFree: 'Commencer Gratuit',
      upgradeToStarter: 'Passer à Starter',
      upgradeToPro: 'Passer à Pro',
      upgradeToAgency: 'Passer à Agency',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    auraVR: {
      title: 'Générateur Aura VR',
      subtitle: 'Transformez une vidéo smartphone en visite VR immersive 3D',
      startScan: 'Démarrer Scan Aura VR',
      processing: {
        analyzing: '📹 Analyse vidéo en cours...',
        mapping: '🏠 Cartographie des pièces...',
        rendering: '🎥 Rendu Cinématique 3D...',
        optimizing: '✨ Optimisation VR pour mobile...',
        preparing: '🌐 Préparation du lien VR...',
        finalizing: '⚡ Finalisation de la visite immersive...',
        complete: '✅ Visite VR Prête!',
      },
      progress: {
        analyzingSub: 'Détection des images clés',
        mappingSub: 'Reconstruction spatiale 3D',
        renderingSub: 'Génération de textures immersives',
        optimizingSub: 'Compression et streaming',
        preparingSub: 'Configuration de l\'accès public',
        finalizingSub: 'Ajout d\'effets cinématographiques',
        completeSub: 'Lien généré avec succès',
      },
      result: {
        title: 'Visite VR Générée!',
        subtitle: 'Votre visite immersive est prête à être partagée',
        linkLabel: 'Lien VR:',
        copyLink: 'Copier le Lien',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Générer une nouvelle visite',
        videoSource: 'Vidéo smartphone',
        tourTime: 'Visite VR en 60s',
      },
      aria: {
        message: 'Aria: Excellent travail!',
        stats: 'Ce scan attirera',
        action: 'de visites en plus. Voulez-vous que je l\'envoie à vos leads chauds?',
      },
    },
    common: {
      copy: 'Copier',
      share: 'Partager',
      send: 'Envoyer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        compliance: 'Conformité',
        login: 'Connexion',
        getStarted: 'Commencer',
      },
      hero: {
        poweredBy: 'Alimenté par GPT-4',
        titlePart1: 'Votre Agent',
        titlePart2: 'Immobilier',
        titleAI: 'IA',
        socialProof: 'Choisi par',
        socialProofAgencies: '+500 agences',
        socialProofLocation: 'en Europe',
        subtitle: 'Le seul Système d\'Exploitation IA qui trouve, analyse et obtient des mandats de manière totalement autonome',
        ctaStart: 'Commencer Gratuitement',
        ctaDemo: 'Voir la Démo',
        trustedBy: 'Compatible avec les principaux portails',
        stats: {
          automation: 'Automatisation',
          listingsPerDay: 'Annonces/Jour',
          conversionRate: 'Taux de Conversion',
        },
      },
      features: {
        title: 'Pourquoi PropertyPilot AI?',
        subtitle: 'La plateforme IA complète pour les agents immobiliers qui veulent évoluer',
        aiListing: {
          title: 'Moteur d\'Annonces IA',
          description: 'Générez des annonces professionnelles en secondes avec des styles personnalisés (Luxe, Investissement, Standard Pro). Multilingue et optimisé pour Zillow, Idealista, Immobiliare.',
          benefit: 'Économisez 5 heures par semaine sur l\'écriture d\'annonces',
        },
        crmAI: {
          title: 'Intelligence CRM IA',
          description: 'Scoring de Leads automatique, suivi IA multicanal (WhatsApp, Email, SMS). Catégorise les leads CHAUD/TIÈDE/FROID et suggère des actions prioritaires.',
          benefit: 'Augmentez les conversions de 40% avec la priorisation IA',
        },
        globalReach: {
          title: 'Portée Mondiale',
          description: 'Nous opérons aux USA (Zillow, MLS), en Italie (Idealista, Immobiliare), en Espagne (Idealista.es). Terminologie localisée et formats de marché.',
          benefit: 'Développez votre activité sur 3 continents',
        },
      },
      searchEngine: {
        title: 'Le Moteur de Recherche qui ne Dort Jamais',
        subtitle: 'Disponible',
        exclusive: 'EXCLUSIVEMENT',
        exclusiveInPlan: 'dans le plan AGENCY',
        benefit: 'Économisez 20 heures d\'appels téléphoniques par semaine',
        step1: {
          title: 'Scan Global',
          description: 'L\'IA scanne automatiquement Idealista, Immobiliare, Zillow et MLS 24/7, trouvant des milliers d\'annonces chaque jour.',
          status: 'Scan en cours...',
        },
        step2: {
          title: 'Filtrage IA',
          description: 'Chaque annonce reçoit un Score de Lead IA (0-100). Seuls les "TOP DEAL" (80+) sont sélectionnés pour les appels.',
          status: 'TOP DEAL détecté',
        },
        step3: {
          title: 'Appel Automatique',
          description: 'Voice IA (Bland AI) appelle les propriétaires, gère les objections et propose des rendez-vous de manière naturelle et persuasive.',
          status: 'Appel en cours...',
        },
        step4: {
          title: 'Rendez-vous dans l\'Agenda',
          description: 'Le rendez-vous est automatiquement ajouté à votre Google Calendar et vous recevez une notification email avec tous les détails.',
          status: 'Rendez-vous confirmé',
        },
      },
      tuesdayMorning: {
        title: 'Votre Nouveau Mardi Matin',
        subtitle: 'Imaginez vous réveiller avec le travail déjà fait',
        time1: '08h00',
        time1Title: 'L\'IA a déjà analysé 500 annonces',
        time1Desc: 'Pendant que vous dormiez, le système a scanné Idealista, Immobiliare, Zillow et MLS. Chaque annonce a été analysée et classée avec un Score de Lead IA.',
        time2: '08h30',
        time2Title: '3 propriétaires ont confirmé la visite',
        time2Desc: 'Voice IA a appelé les propriétaires des TOP DEALs (score 80+). Trois ont déjà confirmé leur disponibilité pour une visite cette semaine.',
        time3: '09h00',
        time3Title: 'Vous vous réveillez et ouvrez l\'agenda déjà plein',
        time3Desc: 'Ouvrez PropertyPilot AI et trouvez 3 rendez-vous déjà programmés, avec tous les détails du bien, contacts du propriétaire et notes IA.',
      },
      testimonials: {
        title: 'Aimé par les Agents du Monde Entier',
        subtitle: 'Des milliers d\'agents immobiliers font confiance à PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agent Immobilier, Milan',
          content: 'PropertyPilot AI a triplé mes affaires. Le Scoring de Leads IA me dit exactement sur quels leads me concentrer.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Agent Immobilier, Miami',
          content: 'La fonction de génération d\'annonces est incroyable. Je crée des annonces professionnelles en 30 secondes au lieu d\'heures.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agent, Barcelone',
          content: 'Le CRM IA est un changement de jeu. Les suivis automatiques me font économiser 10 heures par semaine.',
        },
      },
      aria: {
        badge: 'Disponible dans tous les plans',
        title: 'Aria - Votre Partenaire de Succès IA',
        subtitle: 'Votre coach personnel, toujours disponible. Onboarding, stratégie, motivation: tout dans un chat.',
        mentoring: {
          title: 'Mentorat 24/7',
          description: 'Plus jamais seul dans les négociations. Aria vous guide étape par étape, même quand le client soulève des objections difficiles.',
          benefit: 'Réduisez le stress et augmentez la confiance',
        },
        onboarding: {
          title: 'Onboarding Instantané',
          description: 'Apprenez à maîtriser PropertyPilot en 5 minutes en parlant à Aria. Pas de longs tutoriels, juste une conversation naturelle.',
          benefit: 'Devenez productif immédiatement',
        },
        support: {
          title: 'Soutien Psychologique',
          description: 'L\'alliée qui vous motive à conclure ce mandat quand le défi devient difficile. Aria connaît la psychologie des ventes.',
          benefit: 'Maintenez la motivation élevée',
        },
        available: 'Aria est toujours disponible. Cliquez sur la bulle en bas à droite pour commencer.',
        availableFree: 'Également disponible dans le plan GRATUIT',
      },
      pricing: {
        title: 'Tarifs',
        subtitle: 'Comparez les plans et choisissez celui parfait pour votre entreprise',
        feature: 'Fonctionnalité',
        bestValue: 'MEILLEURE VALEUR',
        perMonth: '/mois',
        agencySubtitle: 'Suite de Domination Omnicanale',
        agencyExtra: '+ Module Commercial et Arbitrage Étendu',
        features: {
          listingsPerMonth: 'Annonces par mois',
          aiGeneration: 'Génération d\'Annonces IA',
          aiStyles: 'Styles IA (Luxe, Investissement, Pro)',
          multilingual: 'Multilingue (IT, EN, ES)',
          pdf: 'PDFs Professionnels',
          crm: 'CRM Complet',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Scoring de Leads IA de Base',
          briefing: 'Briefing Intelligent Multi-Catégorie',
          staging: 'Virtual Staging 3D',
          followup: 'Suivi IA Multicanal',
          automations: 'Automatisations IA',
          forms: 'Formulaires de Capture de Leads Intelligents',
          whiteLabel: 'PDF White-label',
          assistant: 'Assistant IA d\'Agence',
          multiUser: 'Multi-utilisateur',
          roles: 'Rôles et Permissions',
          distribution: 'Distribution Automatique des Leads',
          reports: 'Rapports d\'Activité de l\'Équipe',
          multiOffice: 'Intégration Multi-sites',
          auraVR: '🥽 Aura VR: Génération de Visite Virtuelle Cinématique',
          voiceCalling: 'Appels Vocaux IA (Bland AI)',
          messaging: 'Messagerie Intelligente IA (SMS/WhatsApp IA)',
          manualOverride: 'Surcharge Manuelle: Accès direct aux données du propriétaire',
          humanOverride: 'Liberté d\'intervention humaine',
          autoProspecting: 'Auto-Prospection 24/7',
          scraping: 'Scraping Intelligent',
          dashboard: 'Tableau de Bord War Room',
          calendar: 'Intégration Google Calendar',
          notifications: 'Notifications Email Automatiques',
          support: 'Support',
        },
        plans: {
          free: 'GRATUIT',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Illimité',
          advanced: 'Avancé',
          exclusive: 'EXCLUSIF',
          active: 'Actif',
          viewer: 'Visualiseur',
          community: 'Communauté',
          email: 'Email',
          priority: 'Prioritaire',
          dedicated: 'Dédié 24/7',
        },
        cta: {
          startFree: 'Commencer Gratuitement',
          chooseStarter: 'Choisir Starter',
          choosePro: 'Choisir Pro',
          chooseAgency: 'Choisir Agency',
        },
      },
      cta: {
        title: 'Prêt à multiplier vos affaires?',
        subtitle: 'Rejoignez des centaines d\'agents qui utilisent déjà PropertyPilot AI',
        button: 'Commencer Gratuitement',
      },
      footer: {
        tagline: 'Votre Agent Immobilier IA qui travaille 24/7',
        product: 'Produit',
        company: 'Entreprise',
        support: 'Support',
        pricing: 'Tarifs',
        dashboard: 'Tableau de Bord',
        features: 'Fonctionnalités',
        about: 'À Propos',
        contact: 'Contact',
        blog: 'Blog',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        refund: 'Politique de Remboursement',
        copyright: 'Tous droits réservés.',
      },
      pricingPage: {
        badge: 'Tarifs Transparents',
        mainTitle: 'Choisissez le Plan',
        mainTitle2: 'Parfait pour Vous',
        subtitle: 'Plans conçus pour chaque étape de votre activité immobilière. Commencez gratuitement, scalez quand vous êtes prêt.',
        trustCancel: 'Annulez quand vous voulez',
        trustTrial: 'Essai gratuit 7 jours',
        trustSupport: 'Support dans votre langue',
        demo: 'Démo',
        whyChoose: 'Pourquoi Choisir PropertyPilot AI?',
        whySubtitle: 'Fonctionnalités premium pour chaque professionnel immobilier',
        faqTitle: 'Questions Fréquentes',
        faqSubtitle: 'Tout ce que vous devez savoir sur nos offres',
        ctaTitle: 'Prêt à Transformer vos Annonces?',
        ctaSubtitle: 'Commencez gratuitement aujourd\'hui et découvrez comment l\'IA peut faire grandir votre activité immobilière.',
        ctaStartFree: 'Commencer Gratuitement',
        ctaWatchDemo: 'Voir la Démo',
        features: [
          { title: 'IA GPT-4 Premium', desc: 'Modèles IA les plus avancés du marché' },
          { title: '100% Localisé', desc: 'Contenu optimisé pour votre marché' },
          { title: 'Génération Instantanée', desc: 'Résultats en moins de 30 secondes' },
          { title: 'Facile à Utiliser', desc: 'Aucune compétence technique requise' },
          { title: 'Annonces Professionnelles', desc: 'Qualité d\'agence de communication' },
          { title: 'Multi-Agence', desc: 'Gérez plusieurs bureaux avec un seul compte' },
        ],
        faqs: [
          { question: "Puis-je changer de forfait à tout moment?", answer: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Les modifications s'appliqueront au prochain cycle de facturation." },
          { question: "Y a-t-il une période d'essai gratuite?", answer: "Oui, nous offrons 7 jours d'essai gratuit sur tous les forfaits payants. Aucune carte de crédit requise pour commencer." },
          { question: "Que se passe-t-il si je dépasse les limites de mon forfait?", answer: "Nous vous avertirons lorsque vous vous approcherez des limites. Vous pourrez facilement passer à un forfait supérieur." },
          { question: "Comment fonctionne le forfait Agency?", answer: "Le forfait Agency est conçu pour les équipes et multi-agences. Il inclut des annonces illimitées, toutes les fonctionnalités et un support dédié." },
          { question: "Puis-je annuler mon abonnement?", answer: "Oui, vous pouvez annuler à tout moment depuis le tableau de bord. L'accès restera actif jusqu'à la fin de la période déjà payée." },
          { question: "Offrez-vous un support dans ma langue?", answer: "Absolument! Notre équipe support est disponible par email et chat dans votre langue." },
        ],
      },
    },
  },
  
  de: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Kontrollpanel',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      currentPlan: 'Aktueller Plan',
      dashboardAI: 'Dashboard KI',
      thisMonth: 'Dieser Monat',
      saved: 'Gespeichert',
      noSavedListings: 'Keine gespeicherten Anzeigen',
      planFree: '5 Anzeigen pro Monat',
      planStarter: '50 Anzeigen pro Monat',
      planPro: '200 Anzeigen pro Monat',
      planAgency: 'Unbegrenzte Anzeigen',
      remainingListings: 'Anzeigen verbleibend',
      unlimitedAvailable: 'Unbegrenzte Anzeigen verfügbar',
      chooseYourPlan: 'Wählen Sie Ihren Plan',
      activeBadge: 'Aktiv',
      yourCurrentPlan: 'Ihr aktueller Plan',
      forBeginners: 'Zum Einstieg',
      forProfs: 'Für Profis',
      forTeam: 'Für Teams',
      freePrice: 'Kostenlos',
      choosePlan: 'Plan wählen',
      startFree: 'Kostenlos starten',
      upgradeToStarter: 'Auf Starter upgraden',
      upgradeToPro: 'Auf Pro upgraden',
      upgradeToAgency: 'Auf Agency upgraden',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Verwandeln Sie ein Smartphone-Video in eine immersive 3D-VR-Tour',
      startScan: 'Aura VR Scan starten',
      processing: {
        analyzing: '📹 Video wird analysiert...',
        mapping: '🏠 Räume werden kartiert...',
        rendering: '🎥 Kinematisches 3D-Rendering...',
        optimizing: '✨ VR-Optimierung für Mobilgeräte...',
        preparing: '🌐 VR-Link wird vorbereitet...',
        finalizing: '⚡ Immersive Tour wird finalisiert...',
        complete: '✅ VR-Tour bereit!',
      },
      progress: {
        analyzingSub: 'Schlüsselbild-Erkennung',
        mappingSub: '3D-Raumrekonstruktion',
        renderingSub: 'Generierung immersiver Texturen',
        optimizingSub: 'Komprimierung und Streaming',
        preparingSub: 'Konfiguration des öffentlichen Zugangs',
        finalizingSub: 'Hinzufügen kinematischer Effekte',
        completeSub: 'Link erfolgreich generiert',
      },
      result: {
        title: 'VR-Tour generiert!',
        subtitle: 'Ihre immersive Tour ist bereit zum Teilen',
        linkLabel: 'VR-Link:',
        copyLink: 'Link kopieren',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Neue Tour generieren',
        videoSource: 'Smartphone-Video',
        tourTime: 'VR-Tour in 60s',
      },
      aria: {
        message: 'Aria: Große Arbeit!',
        stats: 'Dieser Scan wird',
        action: 'mehr Besuche anziehen. Soll ich es an Ihre heißen Leads senden?',
      },
    },
    common: {
      copy: 'Kopieren',
      share: 'Teilen',
      send: 'Senden',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Funktionen',
        pricing: 'Preise',
        compliance: 'Compliance',
        login: 'Anmelden',
        getStarted: 'Loslegen',
      },
      hero: {
        poweredBy: 'Angetrieben von GPT-4',
        titlePart1: 'Ihr Immobilien',
        titlePart2: 'Makler',
        titleAI: 'KI',
        socialProof: 'Vertraut von',
        socialProofAgencies: '+500 Agenturen',
        socialProofLocation: 'in Europa',
        subtitle: 'Das einzige KI-Betriebssystem, das Mandate vollständig autonom findet, analysiert und erhält',
        ctaStart: 'Kostenlos Starten',
        ctaDemo: 'Demo Ansehen',
        trustedBy: 'Kompatibel mit führenden Portalen',
        stats: {
          automation: 'Automatisierung',
          listingsPerDay: 'Anzeigen/Tag',
          conversionRate: 'Konversionsrate',
        },
      },
      features: {
        title: 'Warum PropertyPilot AI?',
        subtitle: 'Die vollständige KI-Plattform für Immobilienmakler, die skalieren möchten',
        aiListing: {
          title: 'KI-Anzeigen-Engine',
          description: 'Erstellen Sie professionelle Anzeigen in Sekunden mit benutzerdefinierten Stilen (Luxus, Investition, Standard Pro). Mehrsprachig und optimiert für Zillow, Idealista, Immobiliare.',
          benefit: 'Sparen Sie 5 Stunden pro Woche beim Schreiben von Anzeigen',
        },
        crmAI: {
          title: 'CRM-KI-Intelligenz',
          description: 'Automatisches Lead-Scoring, mehrkanaliges KI-Follow-up (WhatsApp, E-Mail, SMS). Kategorisiert HEISSE/WARME/KALTE Leads und schlägt Prioritätsaktionen vor.',
          benefit: 'Steigern Sie Conversions um 40% mit KI-Priorisierung',
        },
        globalReach: {
          title: 'Globale Reichweite',
          description: 'Wir operieren in den USA (Zillow, MLS), Italien (Idealista, Immobiliare), Spanien (Idealista.es). Lokalisierte Terminologie und Marktformate.',
          benefit: 'Erweitern Sie Ihr Geschäft auf 3 Kontinenten',
        },
      },
      searchEngine: {
        title: 'Die Suchmaschine, die Nie Schläft',
        subtitle: 'Verfügbar',
        exclusive: 'AUSSCHLIESSLICH',
        exclusiveInPlan: 'im AGENCY-Plan',
        benefit: 'Sparen Sie 20 Stunden Telefonanrufe pro Woche',
        step1: {
          title: 'Globale Suche',
          description: 'Die KI scannt automatisch Idealista, Immobiliare, Zillow und MLS 24/7 und findet täglich Tausende von Anzeigen.',
          status: 'Suche läuft...',
        },
        step2: {
          title: 'KI-Filterung',
          description: 'Jede Anzeige erhält einen KI-Lead-Score (0-100). Nur "TOP DEAL" (80+) werden für Anrufe ausgewählt.',
          status: 'TOP DEAL erkannt',
        },
        step3: {
          title: 'Automatischer Anruf',
          description: 'Voice-KI (Bland AI) ruft Eigentümer an, behandelt Einwände und schlägt Termine natürlich und überzeugend vor.',
          status: 'Anruf läuft...',
        },
        step4: {
          title: 'Termin im Kalender',
          description: 'Der Termin wird automatisch zu Ihrem Google Kalender hinzugefügt und Sie erhalten eine E-Mail-Benachrichtigung mit allen Details.',
          status: 'Termin bestätigt',
        },
      },
      tuesdayMorning: {
        title: 'Ihr Neuer Dienstagmorgen',
        subtitle: 'Stellen Sie sich vor, Sie wachen auf und die Arbeit ist bereits erledigt',
        time1: '08:00 Uhr',
        time1Title: 'KI hat bereits 500 Anzeigen analysiert',
        time1Desc: 'Während Sie schliefen, scannte das System Idealista, Immobiliare, Zillow und MLS. Jede Anzeige wurde analysiert und mit einem KI-Lead-Score klassifiziert.',
        time2: '08:30 Uhr',
        time2Title: '3 Eigentümer haben den Besichtigungstermin bestätigt',
        time2Desc: 'Voice-KI rief die Eigentümer von TOP DEALs (Score 80+) an. Drei haben bereits die Verfügbarkeit für eine Besichtigung diese Woche bestätigt.',
        time3: '09:00 Uhr',
        time3Title: 'Sie wachen auf und öffnen den bereits vollen Kalender',
        time3Desc: 'Öffnen Sie PropertyPilot AI und finden Sie 3 bereits geplante Termine mit allen Immobiliendetails, Eigentümerkontakten und KI-Notizen.',
      },
      testimonials: {
        title: 'Geliebt von Maklern Weltweit',
        subtitle: 'Tausende von Immobilienmaklern vertrauen PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Immobilienmakler, Mailand',
          content: 'PropertyPilot AI hat mein Geschäft verdreifacht. Das KI-Lead-Scoring sagt mir genau, auf welche Leads ich mich konzentrieren soll.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Immobilienmaklerin, Miami',
          content: 'Die Anzeigenerstellungsfunktion ist unglaublich. Ich erstelle professionelle Anzeigen in 30 Sekunden statt Stunden.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Makler, Barcelona',
          content: 'Das KI-CRM ist ein Game-Changer. Automatische Follow-ups sparen mir 10 Stunden pro Woche.',
        },
      },
      aria: {
        badge: 'Verfügbar in allen Plänen',
        title: 'Aria - Ihr KI-Erfolgspartner',
        subtitle: 'Ihr persönlicher Coach, immer verfügbar. Onboarding, Strategie, Motivation: alles in einem Chat.',
        mentoring: {
          title: 'Mentoring 24/7',
          description: 'Nie wieder allein in Verhandlungen. Aria führt Sie Schritt für Schritt, auch wenn der Kunde schwierige Einwände erhebt.',
          benefit: 'Reduzieren Sie Stress und steigern Sie das Vertrauen',
        },
        onboarding: {
          title: 'Sofortiges Onboarding',
          description: 'Lernen Sie PropertyPilot in 5 Minuten zu beherrschen, indem Sie mit Aria sprechen. Keine langen Tutorials, nur natürliche Gespräche.',
          benefit: 'Werden Sie sofort produktiv',
        },
        support: {
          title: 'Psychologische Unterstützung',
          description: 'Die Verbündete, die Sie motiviert, dieses Mandat abzuschließen, wenn die Herausforderung schwierig wird. Aria kennt die Verkaufspsychologie.',
          benefit: 'Halten Sie die Motivation hoch',
        },
        available: 'Aria ist immer verfügbar. Klicken Sie auf die Blase unten rechts, um zu beginnen.',
        availableFree: 'Auch im KOSTENLOSEN Plan verfügbar',
      },
      pricing: {
        title: 'Preise',
        subtitle: 'Vergleichen Sie Pläne und wählen Sie den perfekten für Ihr Unternehmen',
        feature: 'Funktion',
        bestValue: 'BESTER WERT',
        perMonth: '/Monat',
        agencySubtitle: 'Omnichannel-Dominanz-Suite',
        agencyExtra: '+ Kommerzielles Modul & Erweiterte Arbitrage',
        features: {
          listingsPerMonth: 'Anzeigen pro Monat',
          aiGeneration: 'KI-Anzeigenerstellung',
          aiStyles: 'KI-Stile (Luxus, Investition, Pro)',
          multilingual: 'Mehrsprachig (IT, EN, ES)',
          pdf: 'Professionelle PDFs',
          crm: 'Vollständiges CRM',
          kanban: 'Kanban-Pipeline',
          leadScoring: 'Basis-KI-Lead-Scoring',
          briefing: 'Multi-Kategorie Smart Briefing',
          staging: '3D Virtual Staging',
          followup: 'Mehrkanaliges KI-Follow-up',
          automations: 'KI-Automatisierungen',
          forms: 'Intelligente Lead-Capture-Formulare',
          whiteLabel: 'White-Label-PDF',
          assistant: 'Agentur-Assistenten-KI',
          multiUser: 'Multi-User',
          roles: 'Rollen und Berechtigungen',
          distribution: 'Automatische Lead-Verteilung',
          reports: 'Team-Aktivitätsberichte',
          multiOffice: 'Multi-Standort-Integration',
          auraVR: '🥽 Aura VR: Kinematische Virtual-Tour-Generierung',
          voiceCalling: 'KI-Sprachanrufe (Bland AI)',
          messaging: 'KI-Smart-Messaging (SMS/WhatsApp KI)',
          manualOverride: 'Manuelle Überschreibung: Direkter Zugriff auf Eigentümerdaten',
          humanOverride: 'Freiheit menschlicher Intervention',
          autoProspecting: '24/7 Auto-Prospektion',
          scraping: 'Intelligentes Scraping',
          dashboard: 'War Room Dashboard',
          calendar: 'Google Kalender-Integration',
          notifications: 'Automatische E-Mail-Benachrichtigungen',
          support: 'Support',
        },
        plans: {
          free: 'KOSTENLOS',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Unbegrenzt',
          advanced: 'Erweitert',
          exclusive: 'EXKLUSIV',
          active: 'Aktiv',
          viewer: 'Betrachter',
          community: 'Community',
          email: 'E-Mail',
          priority: 'Priorität',
          dedicated: 'Dediziert 24/7',
        },
        cta: {
          startFree: 'Kostenlos Starten',
          chooseStarter: 'Starter Wählen',
          choosePro: 'Pro Wählen',
          chooseAgency: 'Agency Wählen',
        },
      },
      cta: {
        title: 'Bereit, Ihr Geschäft zu multiplizieren?',
        subtitle: 'Schließen Sie sich Hunderten von Maklern an, die bereits PropertyPilot AI verwenden',
        button: 'Kostenlos Loslegen',
      },
      footer: {
        tagline: 'Ihr Immobilien-KI-Agent, der 24/7 arbeitet',
        product: 'Produkt',
        company: 'Unternehmen',
        support: 'Support',
        pricing: 'Preise',
        dashboard: 'Dashboard',
        features: 'Funktionen',
        about: 'Über Uns',
        contact: 'Kontakt',
        blog: 'Blog',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen',
        refund: 'Rückerstattungsrichtlinie',
        copyright: 'Alle Rechte vorbehalten.',
      },
      pricingPage: {
        badge: 'Transparente Preise',
        mainTitle: 'Wähle den',
        mainTitle2: 'Perfekten Plan für Dich',
        subtitle: 'Pläne für jede Phase deines Immobiliengeschäfts. Starte kostenlos, skaliere wenn bereit.',
        trustCancel: 'Jederzeit kündbar',
        trustTrial: '7 Tage kostenlos testen',
        trustSupport: 'Support in deiner Sprache',
        demo: 'Demo',
        whyChoose: 'Warum PropertyPilot AI?',
        whySubtitle: 'Premium-Funktionen für jeden Immobilienprofi',
        faqTitle: 'Häufig Gestellte Fragen',
        faqSubtitle: 'Alles was Sie über unsere Pläne wissen müssen',
        ctaTitle: 'Bereit, Ihre Anzeigen zu Transformieren?',
        ctaSubtitle: 'Starten Sie heute kostenlos und entdecken Sie, wie KI Ihr Immobiliengeschäft voranbringen kann.',
        ctaStartFree: 'Kostenlos Starten',
        ctaWatchDemo: 'Demo Ansehen',
        features: [
          { title: 'KI GPT-4 Premium', desc: 'Fortschrittlichste KI-Modelle am Markt' },
          { title: '100% Lokalisiert', desc: 'Inhalte optimiert für Ihren Markt' },
          { title: 'Sofortige Generierung', desc: 'Ergebnisse in unter 30 Sekunden' },
          { title: 'Einfach zu Benutzen', desc: 'Keine technischen Kenntnisse erforderlich' },
          { title: 'Professionelle Anzeigen', desc: 'Qualität einer Kommunikationsagentur' },
          { title: 'Multi-Agentur', desc: 'Mehrere Standorte mit einem Konto verwalten' },
        ],
        faqs: [
          { question: "Kann ich meinen Plan jederzeit wechseln?", answer: "Ja, Sie können jederzeit upgraden oder downgraden. Änderungen gelten im nächsten Abrechnungszyklus." },
          { question: "Gibt es eine kostenlose Testphase?", answer: "Ja, wir bieten 7 Tage kostenlose Testphase bei allen kostenpflichtigen Plänen. Keine Kreditkarte erforderlich." },
          { question: "Was passiert, wenn ich meine Planlimits überschreite?", answer: "Wir benachrichtigen Sie, wenn Sie sich den Limits nähern. Sie können einfach auf einen höheren Plan upgraden." },
          { question: "Wie funktioniert der Agency-Plan?", answer: "Der Agency-Plan ist für Teams und Multi-Agenturen. Er umfasst unbegrenzte Anzeigen, alle Funktionen und dedizierten Support." },
          { question: "Kann ich mein Abo kündigen?", answer: "Ja, Sie können jederzeit im Dashboard kündigen. Der Zugang bleibt bis zum Ende des bezahlten Zeitraums aktiv." },
          { question: "Bieten Sie Support in meiner Sprache?", answer: "Absolut! Unser Support-Team ist per E-Mail und Chat in Ihrer Sprache erreichbar." },
        ],
      },
    },
  },
  
  pt: {
    dashboard: {
      title: 'Painel',
      subtitle: 'Painel de controle',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      generate: 'Gerar',
      signOut: 'Sair',
      currentPlan: 'Plano Atual',
      dashboardAI: 'Dashboard AI',
      thisMonth: 'Este Mês',
      saved: 'Salvos',
      noSavedListings: 'Nenhum anúncio salvo',
      planFree: '5 anúncios por mês',
      planStarter: '50 anúncios por mês',
      planPro: '200 anúncios por mês',
      planAgency: 'Anúncios ilimitados',
      remainingListings: 'anúncios restantes',
      unlimitedAvailable: 'Anúncios ilimitados disponíveis',
      chooseYourPlan: 'Escolha o Seu Plano',
      activeBadge: 'Ativo',
      yourCurrentPlan: 'O seu plano atual',
      forBeginners: 'Para começar',
      forProfs: 'Para profissionais',
      forTeam: 'Para equipas',
      freePrice: 'Grátis',
      choosePlan: 'Escolher Plano',
      startFree: 'Começar Grátis',
      upgradeToStarter: 'Mudar para Starter',
      upgradeToPro: 'Mudar para Pro',
      upgradeToAgency: 'Mudar para Agency',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    auraVR: {
      title: 'Gerador Aura VR',
      subtitle: 'Transforme um vídeo de smartphone em um tour VR imersivo 3D',
      startScan: 'Iniciar Varredura Aura VR',
      processing: {
        analyzing: '📹 Analisando vídeo...',
        mapping: '🏠 Mapeando cômodos...',
        rendering: '🎥 Renderização Cinematográfica 3D...',
        optimizing: '✨ Otimizando VR para mobile...',
        preparing: '🌐 Preparando link VR...',
        finalizing: '⚡ Finalizando tour imersivo...',
        complete: '✅ Tour VR Pronto!',
      },
      progress: {
        analyzingSub: 'Detecção de frames-chave',
        mappingSub: 'Reconstrução espacial 3D',
        renderingSub: 'Gerando texturas imersivas',
        optimizingSub: 'Compressão e streaming',
        preparingSub: 'Configurando acesso público',
        finalizingSub: 'Adicionando efeitos cinematográficos',
        completeSub: 'Link gerado com sucesso',
      },
      result: {
        title: 'Tour VR Gerado!',
        subtitle: 'Seu tour imersivo está pronto para compartilhar',
        linkLabel: 'Link VR:',
        copyLink: 'Copiar Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Gerar novo tour',
        videoSource: 'Vídeo smartphone',
        tourTime: 'Tour VR em 60s',
      },
      aria: {
        message: 'Aria: Ótimo trabalho!',
        stats: 'Este scan atrairá',
        action: 'mais visitas. Quer que eu envie para seus leads quentes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartilhar',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
    },
    landing: {
      pricingPage: {
        badge: 'Preços Transparentes',
        mainTitle: 'Escolha o Plano',
        mainTitle2: 'Perfeito para Você',
        subtitle: 'Planos pensados para cada fase do seu negócio imobiliário. Comece grátis, escale quando estiver pronto.',
        trustCancel: 'Cancele quando quiser',
        trustTrial: 'Teste grátis 7 dias',
        trustSupport: 'Suporte no seu idioma',
        demo: 'Demo',
        whyChoose: 'Por Que Escolher PropertyPilot AI?',
        whySubtitle: 'Recursos premium para cada profissional imobiliário',
        faqTitle: 'Perguntas Frequentes',
        faqSubtitle: 'Tudo que você precisa saber sobre nossos planos',
        ctaTitle: 'Pronto para Transformar seus Anúncios?',
        ctaSubtitle: 'Comece grátis hoje e descubra como a IA pode elevar seu negócio imobiliário.',
        ctaStartFree: 'Começar Grátis',
        ctaWatchDemo: 'Ver Demo',
        features: [
          { title: 'IA GPT-4 Premium', desc: 'Modelos de IA mais avançados do mercado' },
          { title: '100% Localizado', desc: 'Conteúdo otimizado para seu mercado' },
          { title: 'Geração Instantânea', desc: 'Resultados em menos de 30 segundos' },
          { title: 'Fácil de Usar', desc: 'Nenhuma habilidade técnica necessária' },
          { title: 'Anúncios Profissionais', desc: 'Qualidade de agência de comunicação' },
          { title: 'Multi-Agência', desc: 'Gerencie vários escritórios com uma conta' },
        ],
        faqs: [
          { question: "Posso mudar de plano a qualquer momento?", answer: "Sim, você pode fazer upgrade ou downgrade quando quiser. As alterações se aplicam no próximo ciclo de cobrança." },
          { question: "Há período de teste gratuito?", answer: "Sim, oferecemos 7 dias de teste grátis em todos os planos pagos. Nenhum cartão necessário para começar." },
          { question: "O que acontece se eu ultrapassar os limites?", answer: "Te avisaremos quando você se aproximar. Você pode facilmente fazer upgrade para continuar crescendo." },
          { question: "Como funciona o plano Agency?", answer: "O plano Agency é para equipes e multi-agências. Inclui anúncios ilimitados, todos os recursos e suporte dedicado." },
          { question: "Posso cancelar minha assinatura?", answer: "Sim, você pode cancelar a qualquer momento no painel. O acesso permanece até o fim do período já pago." },
          { question: "Oferecem suporte no meu idioma?", answer: "Com certeza! Nosso suporte está disponível por email e chat no seu idioma." },
        ],
      },
    },
  },
  
  ar: {
    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'لوحة التحكم الرئيسية',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      generate: 'إنشاء',
      signOut: 'خروج',
      currentPlan: 'الخطة الحالية',
      dashboardAI: 'لوحة التحكم',
      thisMonth: 'هذا الشهر',
      saved: 'المحفوظة',
      noSavedListings: 'لا إعلانات محفوظة',
      planFree: '5 إعلانات شهرياً',
      planStarter: '50 إعلان شهرياً',
      planPro: '200 إعلان شهرياً',
      planAgency: 'إعلانات غير محدودة',
      remainingListings: 'إعلانات متبقية',
      unlimitedAvailable: 'إعلانات غير محدودة متاحة',
      chooseYourPlan: 'اختر خطتك',
      activeBadge: 'نشط',
      yourCurrentPlan: 'خطتك الحالية',
      forBeginners: 'للبدء',
      forProfs: 'للمحترفين',
      forTeam: 'للفرق',
      freePrice: 'مجاني',
      choosePlan: 'اختر الخطة',
      startFree: 'ابدأ مجاناً',
      upgradeToStarter: 'الترقية إلى Starter',
      upgradeToPro: 'الترقية إلى Pro',
      upgradeToAgency: 'الترقية إلى Agency',
    },
    dashboardToasts: {
      boostActivated: '🎉 Agency Boost Activated!',
      boostDesc: 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
      agencyActive: '🎉 Agency Intelligence Active',
      agencyDesc: 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
      paymentDone: '✅ Payment completed!',
      paymentDesc: 'Your plan has been activated successfully.',
      checkoutCanceled: 'Checkout canceled',
      checkoutCanceledDesc: 'You can try again anytime from the Billing page.',
      limitNear: '⚠️ Limit almost reached!',
      limitNearDesc: "You've used {used} of your {lim} monthly listings (80%+). Consider upgrading to continue.",
    },
    auraVR: {
      title: 'مولد Aura VR',
      subtitle: 'حول فيديو الهاتف الذكي إلى جولة VR ثلاثية الأبعاد غامرة',
      startScan: 'بدء مسح Aura VR',
      processing: {
        analyzing: '📹 جاري تحليل الفيديو...',
        mapping: '🏠 جاري رسم الخرائط للغرف...',
        rendering: '🎥 عرض سينمائي ثلاثي الأبعاد...',
        optimizing: '✨ تحسين VR للهواتف المحمولة...',
        preparing: '🌐 تحضير رابط VR...',
        finalizing: '⚡ إنهاء الجولة الغامرة...',
        complete: '✅ جولة VR جاهزة!',
      },
      progress: {
        analyzingSub: 'اكتشاف الإطارات الرئيسية',
        mappingSub: 'إعادة بناء مكاني ثلاثي الأبعاد',
        renderingSub: 'إنشاء نسيج غامر',
        optimizingSub: 'الضغط والبث',
        preparingSub: 'تكوين الوصول العام',
        finalizingSub: 'إضافة تأثيرات سينمائية',
        completeSub: 'تم إنشاء الرابط بنجاح',
      },
      result: {
        title: 'تم إنشاء جولة VR!',
        subtitle: 'جولتك الغامرة جاهزة للمشاركة',
        linkLabel: 'رابط VR:',
        copyLink: 'نسخ الرابط',
        shareWhatsApp: 'واتساب',
        generateNew: 'إنشاء جولة جديدة',
        videoSource: 'فيديو الهاتف الذكي',
        tourTime: 'جولة VR في 60 ثانية',
      },
      aria: {
        message: 'آريا: عمل رائع!',
        stats: 'هذا المسح سيجذب',
        action: 'زيارات إضافية. هل تريد أن أرسله إلى عملائك المحتملين؟',
      },
    },
    common: {
      copy: 'نسخ',
      share: 'مشاركة',
      send: 'إرسال',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'المميزات',
        pricing: 'الأسعار',
        compliance: 'الامتثال',
        login: 'تسجيل الدخول',
        getStarted: 'ابدأ الآن',
      },
      hero: {
        poweredBy: 'مدعوم بـ GPT-4',
        titlePart1: 'وكيلك',
        titlePart2: 'العقاري',
        titleAI: 'الذكي',
        socialProof: 'موثوق من قبل',
        socialProofAgencies: '+500 وكالة',
        socialProofLocation: 'في أوروبا',
        subtitle: 'نظام التشغيل الذكي الوحيد الذي يجد ويحلل ويحصل على التفويضات بشكل مستقل تماماً',
        ctaStart: 'ابدأ مجاناً',
        ctaDemo: 'شاهد العرض التوضيحي',
        trustedBy: 'متوافق مع البوابات الرئيسية',
        stats: {
          automation: 'الأتمتة',
          listingsPerDay: 'إعلان/يوم',
          conversionRate: 'معدل التحويل',
        },
      },
      features: {
        title: 'لماذا PropertyPilot AI?',
        subtitle: 'المنصة الذكية الشاملة لوكلاء العقارات الذين يريدون التوسع',
        aiListing: {
          title: 'محرك الإعلانات الذكي',
          description: 'أنشئ إعلانات احترافية في ثوانٍ بأنماط مخصصة (الفاخر، الاستثماري، الاحترافي القياسي). متعدد اللغات ومحسّن لـ Zillow و Idealista و Immobiliare.',
          benefit: 'وفر 5 ساعات أسبوعياً في كتابة الإعلانات',
        },
        crmAI: {
          title: 'ذكاء CRM الذكي',
          description: 'تقييم العملاء المحتملين تلقائياً، متابعة ذكية متعددة القنوات (واتساب، بريد إلكتروني، رسائل نصية). تصنف العملاء المحتملين الساخنين/الدافئين/الباردين وتقترح إجراءات أولوية.',
          benefit: 'زِد التحويلات بنسبة 40% مع تحديد الأولويات الذكي',
        },
        globalReach: {
          title: 'الوصول العالمي',
          description: 'نعمل في الولايات المتحدة (Zillow و MLS) وإيطاليا (Idealista و Immobiliare) وإسبانيا (Idealista.es). مصطلحات محلية وأشكال سوق.',
          benefit: 'وسّع عملك في 3 قارات',
        },
      },
      searchEngine: {
        title: 'محرك البحث الذي لا ينام أبداً',
        subtitle: 'متاح',
        exclusive: 'حصرياً',
        exclusiveInPlan: 'في خطة AGENCY',
        benefit: 'وفر 20 ساعة من المكالمات الهاتفية أسبوعياً',
        step1: {
          title: 'المسح الشامل',
          description: 'يُمسح الذكي تلقائياً Idealista و Immobiliare و Zillow و MLS على مدار الساعة، ويجد آلاف الإعلانات كل يوم.',
          status: 'جاري المسح...',
        },
        step2: {
          title: 'التصفية الذكية',
          description: 'يحصل كل إعلان على تقييم عميل محتمل ذكي (0-100). يتم اختيار "الصفقات المميزة" (80+) فقط للمكالمات.',
          status: 'تم اكتشاف صفقة مميزة',
        },
        step3: {
          title: 'المكالمة التلقائية',
          description: 'المكالمات الصوتية الذكية (Bland AI) تتصل بالمالكين وتتعامل مع الاعتراضات وتقترح مواعيد بشكل طبيعي ومقنع.',
          status: 'جاري الاتصال...',
        },
        step4: {
          title: 'الموعد في التقويم',
          description: 'يُضاف الموعد تلقائياً إلى Google Calendar الخاص بك وتتلقى إشعاراً بريدياً بجميع التفاصيل.',
          status: 'تم تأكيد الموعد',
        },
      },
      tuesdayMorning: {
        title: 'صباح الثلاثاء الجديد',
        subtitle: 'تخيل الاستيقاظ والعمل قد اكتمل بالفعل',
        time1: '08:00',
        time1Title: 'حلل الذكي بالفعل 500 إعلان',
        time1Desc: 'بينما كنت نائماً، مسح النظام Idealista و Immobiliare و Zillow و MLS. تم تحليل كل إعلان وتصنيفه بتقييم عميل محتمل ذكي.',
        time2: '08:30',
        time2Title: '3 ملاك أكدوا الزيارة',
        time2Desc: 'اتصلت المكالمات الصوتية الذكية بملاك الصفقات المميزة (تقييم 80+). أكد ثلاثة بالفعل توفرهم لزيارة هذا الأسبوع.',
        time3: '09:00',
        time3Title: 'تستيقظ ويفتح التقويم ممتلئاً بالفعل',
        time3Desc: 'افتح PropertyPilot AI وستجد 3 مواعيد مجدولة بالفعل، مع جميع تفاصيل العقار واتصالات المالك وملاحظات الذكي.',
      },
      testimonials: {
        title: 'محبوب من الوكلاء حول العالم',
        subtitle: 'آلاف وكلاء العقارات يثقون بـ PropertyPilot AI',
        testimonial1: {
          name: 'ماركو روسي',
          role: 'وكيل عقاري، ميلانو',
          content: 'ضاعف PropertyPilot AI أعمالي ثلاث مرات. يخبرني تقييم العملاء المحتملين الذكي بالضبط على أي عملاء محتملين أركز.',
        },
        testimonial2: {
          name: 'سارة جونسون',
          role: 'وكيلة عقارية، ميامي',
          content: 'ميزة إنشاء الإعلانات مذهلة. أنشئ إعلانات احترافية في 30 ثانية بدلاً من ساعات.',
        },
        testimonial3: {
          name: 'كارلوس غارسيا',
          role: 'وكيل، برشلونة',
          content: 'CRM الذكي هو تغيير جذري. توفر المتابعات التلقائية 10 ساعات أسبوعياً.',
        },
      },
      aria: {
        badge: 'متاح في جميع الخطط',
        title: 'آريا - شريكك الذكي للنجاح',
        subtitle: 'مدربك الشخصي، متاح دائماً. التعريف، الاستراتيجية، التحفيز: كل شيء في محادثة واحدة.',
        mentoring: {
          title: 'الإرشاد على مدار الساعة',
          description: 'لم تعد وحدك في المفاوضات. ترشدك آريا خطوة بخطوة، حتى عندما يطرح العميل اعتراضات صعبة.',
          benefit: 'قلل التوتر وزد الثقة',
        },
        onboarding: {
          title: 'التعريف الفوري',
          description: 'تعلم إتقان PropertyPilot في 5 دقائق بالتحدث مع آريا. لا دروس طويلة، فقط محادثة طبيعية.',
          benefit: 'كن منتجاً على الفور',
        },
        support: {
          title: 'الدعم النفسي',
          description: 'الحليف الذي يحفزك لإغلاق ذلك التفويض عندما يصبح التحدي صعباً. تعرف آريا على نفسية المبيعات.',
          benefit: 'حافظ على الدافع عالياً',
        },
        available: 'آريا متاحة دائماً. انقر على الفقاعة في الأسفل يميناً للبدء.',
        availableFree: 'متاح أيضاً في الخطة المجانية',
      },
      pricing: {
        title: 'الأسعار',
        subtitle: 'قارن الخطط واختر المثالي لعملك',
        feature: 'الميزة',
        bestValue: 'أفضل قيمة',
        perMonth: '/شهر',
        agencySubtitle: 'مجموعة الهيمنة متعددة القنوات',
        agencyExtra: '+ الوحدة التجارية والتحكيم الممتد',
        features: {
          listingsPerMonth: 'إعلانات شهرياً',
          aiGeneration: 'إنشاء إعلانات ذكي',
          aiStyles: 'أنماط ذكية (فاخر، استثماري، احترافي)',
          multilingual: 'متعدد اللغات (IT, EN, ES)',
          pdf: 'ملفات PDF احترافية',
          crm: 'CRM كامل',
          kanban: 'خط أنابيب Kanban',
          leadScoring: 'تقييم العملاء المحتملين الذكي الأساسي',
          briefing: 'إحاطة ذكية متعددة الفئات',
          staging: 'Virtual Staging ثلاثي الأبعاد',
          followup: 'متابعة ذكية متعددة القنوات',
          automations: 'أتمتة ذكية',
          forms: 'نماذج التقاط العملاء المحتملين الذكية',
          whiteLabel: 'PDF White-label',
          assistant: 'مساعد الوكالة الذكي',
          multiUser: 'متعدد المستخدمين',
          roles: 'الأدوار والصلاحيات',
          distribution: 'توزيع العملاء المحتملين التلقائي',
          reports: 'تقارير نشاط الفريق',
          multiOffice: 'تكامل متعدد المكاتب',
          auraVR: '🥽 Aura VR: إنشاء جولة افتراضية سينمائية',
          voiceCalling: 'مكالمات صوتية ذكية (Bland AI)',
          messaging: 'رسائل ذكية (SMS/واتساب ذكي)',
          manualOverride: 'تجاوز يدوي: الوصول المباشر لبيانات المالك',
          humanOverride: 'حرية التدخل البشري',
          autoProspecting: 'البحث التلقائي على مدار الساعة',
          scraping: 'استخراج ذكي',
          dashboard: 'لوحة تحكم War Room',
          calendar: 'تكامل Google Calendar',
          notifications: 'إشعارات بريد إلكتروني تلقائية',
          support: 'الدعم',
        },
        plans: {
          free: 'مجاني',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'غير محدود',
          advanced: 'متقدم',
          exclusive: 'حصري',
          active: 'نشط',
          viewer: 'عارض',
          community: 'مجتمع',
          email: 'بريد إلكتروني',
          priority: 'أولوية',
          dedicated: 'مخصص على مدار الساعة',
        },
        cta: {
          startFree: 'ابدأ مجاناً',
          chooseStarter: 'اختر Starter',
          choosePro: 'اختر Pro',
          chooseAgency: 'اختر Agency',
        },
      },
      cta: {
        title: 'جاهز لمضاعفة أعمالك?',
        subtitle: 'انضم إلى مئات الوكلاء الذين يستخدمون بالفعل PropertyPilot AI',
        button: 'ابدأ مجاناً',
      },
      footer: {
        tagline: 'وكيلك العقاري الذكي الذي يعمل على مدار الساعة',
        product: 'المنتج',
        company: 'الشركة',
        support: 'الدعم',
        pricing: 'الأسعار',
        dashboard: 'لوحة التحكم',
        features: 'المميزات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        blog: 'المدونة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        refund: 'سياسة الاسترداد',
        copyright: 'جميع الحقوق محفوظة.',
      },
      pricingPage: {
        badge: 'أسعار شفافة',
        mainTitle: 'اختر الخطة',
        mainTitle2: 'المثالية لك',
        subtitle: 'خطط مصممة لكل مرحلة من مراحل عملك العقاري. ابدأ مجاناً، وسّع عندما تكون جاهزاً.',
        trustCancel: 'إلغاء في أي وقت',
        trustTrial: 'تجربة مجانية 7 أيام',
        trustSupport: 'دعم بلغتك',
        demo: 'عرض توضيحي',
        whyChoose: 'لماذا PropertyPilot AI?',
        whySubtitle: 'ميزات ممتازة لكل محترف عقاري',
        faqTitle: 'الأسئلة الشائعة',
        faqSubtitle: 'كل ما تحتاج معرفته عن خططنا',
        ctaTitle: 'مستعد لتحويل إعلاناتك?',
        ctaSubtitle: 'ابدأ مجاناً اليوم واكتشف كيف يمكن للذكاء الاصطناعي رفع أعمالك العقارية.',
        ctaStartFree: 'ابدأ مجاناً',
        ctaWatchDemo: 'شاهد العرض',
        features: [
          { title: 'ذكاء اصطناعي GPT-4 ممتاز', desc: 'أحدث نماذج الذكاء الاصطناعي في السوق' },
          { title: '100% محلي', desc: 'محتوى محسن لسوقك' },
          { title: 'إنشاء فوري', desc: 'نتائج في أقل من 30 ثانية' },
          { title: 'سهل الاستخدام', desc: 'لا توجد مهارات تقنية مطلوبة' },
          { title: 'إعلانات احترافية', desc: 'جودة وكالة اتصالات' },
          { title: 'متعدد الوكالات', desc: 'إدارة مكاتب متعددة بحساب واحد' },
        ],
        faqs: [
          { question: "هل يمكنني تغيير خطتي في أي وقت?", answer: "نعم، يمكنك الترقية أو التخفيض متى شئت. التغييرات ستُطبق في دورة الفوترة التالية." },
          { question: "هل هناك فترة تجريبية مجانية?", answer: "نعم، نقدم 7 أيام تجربة مجانية لجميع الخطط المدفوعة. لا حاجة لبطاقة ائتمان للبدء." },
          { question: "ماذا يحدث إذا تجاوزت حدود خطتي?", answer: "سننبهك عند الاقتراب من الحدود. يمكنك بسهولة الترقية للمتابعة." },
          { question: "كيف يعمل plan Agency?", answer: "خطة Agency مصممة للفرق والوكالات المتعددة. تشمل إعلانات غير محدودة وكل الميزات ودعم مخصص." },
          { question: "هل يمكنني إلغاء اشتراكي?", answer: "نعم، يمكنك الإلغاء في أي وقت من لوحة التحكم. سيبقى الوصول نشطاً حتى نهاية الفترة المدفوعة." },
          { question: "هل تقدمون دعماً بلغتي?", answer: "بالتأكيد! فريق الدعم متاح عبر البريد وال chat بلغتك." },
        ],
      },
    },
  },
};

/**
 * Deep merge: locale object over base, but nested objects are merged (no whole-section replace).
 * Evita "undefined" quando una lingua ha solo chiavi parziali (es. dashboard solo title/subtitle).
 */
function deepMerge<T extends object>(base: T, partial: DeepPartial<T>): T {
  const out = { ...base };
  for (const key of Object.keys(partial) as (keyof T)[]) {
    const baseVal = (base as Record<string, unknown>)[key as string];
    const partVal = (partial as Record<string, unknown>)[key as string];
    if (partVal === undefined) continue;
    if (
      partVal !== null &&
      typeof partVal === 'object' &&
      !Array.isArray(partVal) &&
      baseVal !== null &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      (out as Record<string, unknown>)[key as string] = deepMerge(
        baseVal as object,
        partVal as object
      );
    } else {
      (out as Record<string, unknown>)[key as string] = partVal;
    }
  }
  return out;
}

/**
 * Get translation for a specific locale. Deep merge so missing keys fall back to English.
 */
export function getTranslation(locale: SupportedLocale): TranslationDictionary {
  const baseTranslation = translations.en as TranslationDictionary;
  const localeTranslation = translations[locale] || {};
  return deepMerge(baseTranslation, localeTranslation as DeepPartial<TranslationDictionary>) as TranslationDictionary;
}

/**
 * Detect locale from location string (simple heuristic)
 */
export function detectLocaleFromLocation(location: string): SupportedLocale {
  const loc = location.toLowerCase();
  
  // Spanish countries/cities
  if (/\b(madrid|barcelona|valencia|sevilla|málaga|españa|spain|mexico|méxico|buenos aires|argentina|colombia|chile)\b/i.test(loc)) {
    return 'es';
  }
  
  // French countries/cities
  if (/\b(paris|lyon|marseille|france|france|quebec|montreal|belgium|belgique|switzerland|suisse)\b/i.test(loc)) {
    return 'fr';
  }
  
  // German countries/cities
  if (/\b(berlin|münchen|hamburg|frankfurt|germany|deutschland|austria|österreich|zurich|zürich)\b/i.test(loc)) {
    return 'de';
  }
  
  // Portuguese countries/cities
  if (/\b(lisboa|porto|brazil|brasil|portugal|rio de janeiro|são paulo)\b/i.test(loc)) {
    return 'pt';
  }
  
  // Arabic countries/cities (Middle East)
  if (/\b(dubai|doha|qatar|uae|emirates|saudi|riyadh|jeddah|kuwait|bahrain|oman|muscat|abu dhabi|sharjah|ajman)\b/i.test(loc)) {
    return 'ar';
  }
  
  // Italian cities (fallback to IT if contains Italian city names)
  if (/\b(roma|milano|napoli|torino|firenze|venezia|genova|bologna|italia|italy)\b/i.test(loc)) {
    return 'it';
  }
  
  // Default to English for US/UK/other English-speaking regions
  return 'en';
}
