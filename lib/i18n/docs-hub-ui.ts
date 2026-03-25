/** /docs hub — section cards, search chrome, quick links (IT/EN) */

export type DocsHubArticle = {
  id: string;
  title: string;
  description: string;
  slug: string;
};

export type DocsHubSection = {
  id: string;
  title: string;
  articles: DocsHubArticle[];
};

export type DocsHubUi = {
  pageTitle: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  articleSingular: string;
  articlePlural: string;
  quickStartTitle: string;
  quickStartDesc: string;
  quickStartBtn: string;
  bestPracticesTitle: string;
  bestPracticesDesc: string;
  bestPracticesBtn: string;
  goalsTitle: string;
  goalsDesc: string;
  goalsBtn: string;
  backToDocs: string;
  sections: DocsHubSection[];
};

const sectionsIt: DocsHubSection[] = [
  {
    id: 'getting-started',
    title: 'Per iniziare',
    articles: [
      {
        id: 'welcome',
        title: 'Benvenuto in PropertyPilot AI',
        description: 'Guida introduttiva alla piattaforma',
        slug: 'getting-started/welcome',
      },
      {
        id: 'first-listing',
        title: 'Crea il tuo primo annuncio',
        description: 'Genera un annuncio AI in 2 minuti',
        slug: 'getting-started/first-listing',
      },
      {
        id: 'workspace-setup',
        title: 'Configura il tuo Workspace',
        description: 'Personalizza la dashboard',
        slug: 'getting-started/workspace-setup',
      },
      {
        id: 'perfect-copy-guide',
        title: 'Perfect Copy — guida rapida',
        description: 'Campi del form, varianti e salvataggio in libreria',
        slug: 'getting-started/perfect-copy',
      },
    ],
  },
  {
    id: 'crm',
    title: 'CRM e lead',
    articles: [
      {
        id: 'pipeline-guide',
        title: 'Pipeline lead (Kanban)',
        description: 'Trascina i lead tra le colonne e aggiorna lo stato',
        slug: 'crm/pipeline',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    articles: [
      {
        id: 'billing-guide',
        title: 'Piano e fatturazione',
        description: 'Upgrade, portale Stripe e stato abbonamento',
        slug: 'account/billing-guide',
      },
    ],
  },
  {
    id: 'prospecting',
    title: 'Motore di prospecting',
    articles: [
      {
        id: 'scraper-guide',
        title: 'Guida allo Scraper Globale',
        description: 'Come trovare immobili su Idealista, Zillow, Immobiliare.it',
        slug: 'prospecting/scraper-guide',
      },
      {
        id: 'arbitrage',
        title: "Guida all'Arbitraggio",
        description: 'Identifica opportunità di mercato e calcola il Market Gap',
        slug: 'prospecting/arbitrage',
      },
      {
        id: 'filters',
        title: 'Filtri di Ricerca Avanzati',
        description: 'Configura filtri automatici per trovare i migliori deal',
        slug: 'prospecting/filters',
      },
    ],
  },
  {
    id: 'ai-voice',
    title: 'Chiamate vocali IA',
    articles: [
      {
        id: 'voice-setup',
        title: 'Configurazione Chiamate AI',
        description: 'Imposta Bland AI e inizia a chiamare',
        slug: 'ai-voice/voice-setup',
      },
      {
        id: 'call-scripts',
        title: 'Script di Chiamata Personalizzati',
        description: 'Crea script efficaci per ottenere mandati',
        slug: 'ai-voice/call-scripts',
      },
      {
        id: 'obstacle-handling',
        title: 'Gestione Obiezioni',
        description: "Come l'IA gestisce le obiezioni dei proprietari",
        slug: 'ai-voice/obstacle-handling',
      },
    ],
  },
  {
    id: '3d-staging',
    title: 'Home staging 3D',
    articles: [
      {
        id: 'staging-guide',
        title: 'Guida al 3D Staging',
        description: 'Genera visioni post-ristrutturazione per convincere i clienti',
        slug: '3d-staging/staging-guide',
      },
      {
        id: 'whatsapp-integration',
        title: 'Invio via WhatsApp',
        description: 'Condividi progetti 3D con proprietari e clienti',
        slug: '3d-staging/whatsapp-integration',
      },
    ],
  },
  {
    id: 'aura-vr',
    title: 'Aura VR',
    articles: [
      {
        id: 'vr-guide',
        title: 'Guida Aura VR',
        description: 'Tour immersivo 360° da foto per WhatsApp e presentazioni',
        slug: 'aura-vr/vr-guide',
      },
    ],
  },
  {
    id: 'price-sniper',
    title: 'Price Drop Sniper',
    articles: [
      {
        id: 'sniper-guide',
        title: 'Come funziona lo Sniper',
        description: 'Rileva ribassi di prezzo in tempo reale',
        slug: 'price-sniper/sniper-guide',
      },
      {
        id: 'sniper-strategy',
        title: 'Strategia Sniper',
        description: 'Approccia proprietari dopo un ribasso',
        slug: 'price-sniper/sniper-strategy',
      },
    ],
  },
  {
    id: 'commercial',
    title: 'Intelligence commerciale',
    articles: [
      {
        id: 'commercial-guide',
        title: 'Analisi Immobili Commerciali',
        description: 'Identifica attività consigliate e gap di mercato',
        slug: 'commercial/commercial-guide',
      },
      {
        id: 'business-features',
        title: 'Funzionalità chiave per il commerciale',
        description: 'Rileva canna fumaria, vetrina, categoria C3',
        slug: 'commercial/business-features',
      },
    ],
  },
  {
    id: 'territory',
    title: 'Territory Commander',
    articles: [
      {
        id: 'territory-guide',
        title: 'Analisi del Territorio',
        description: 'Domanda, DNA quartiere, velocità vendita',
        slug: 'territory/territory-guide',
      },
      {
        id: 'map-usage',
        title: 'Uso della Mappa Tattica',
        description: 'Naviga i deal sulla mappa interattiva',
        slug: 'territory/map-usage',
      },
    ],
  },
  {
    id: 'smart-briefing',
    title: 'Briefing intelligente IA',
    articles: [
      {
        id: 'briefing-guide',
        title: 'Guida al Smart Briefing',
        description: 'Vantaggi, difetti, target automatici',
        slug: 'smart-briefing/briefing-guide',
      },
      {
        id: 'client-ready',
        title: 'Copia per il Cliente',
        description: 'Genera riassunti WhatsApp-ready',
        slug: 'smart-briefing/client-ready',
      },
    ],
  },
  {
    id: 'xray',
    title: 'Visione a raggi X IA',
    articles: [
      {
        id: 'xray-guide',
        title: 'Analisi Tecnica Immagini',
        description: "Rileva difetti e pregi con l'IA",
        slug: 'xray/xray-guide',
      },
      {
        id: 'renovation-quote',
        title: 'Budget Riqualificazione',
        description: 'Calcola costi di ristrutturazione',
        slug: 'xray/renovation-quote',
      },
    ],
  },
  {
    id: 'competitor',
    title: 'Radar competitor',
    articles: [
      {
        id: 'radar-guide',
        title: 'Rilevamento Mandati in Scadenza',
        description: 'Trova immobili fermi da 120+ giorni',
        slug: 'competitor/radar-guide',
      },
    ],
  },
];

const sectionsEn: DocsHubSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to PropertyPilot AI',
        description: 'Introduction guide to the platform',
        slug: 'getting-started/welcome',
      },
      {
        id: 'first-listing',
        title: 'Create your first listing',
        description: 'Generate an AI listing in 2 minutes',
        slug: 'getting-started/first-listing',
      },
      {
        id: 'workspace-setup',
        title: 'Set up your Workspace',
        description: 'Customize your dashboard',
        slug: 'getting-started/workspace-setup',
      },
      {
        id: 'perfect-copy-guide',
        title: 'Perfect Copy — quick guide',
        description: 'Form fields, variants, and saving to your library',
        slug: 'getting-started/perfect-copy',
      },
    ],
  },
  {
    id: 'crm',
    title: 'CRM & leads',
    articles: [
      {
        id: 'pipeline-guide',
        title: 'Lead pipeline (Kanban)',
        description: 'Drag leads between columns to update status',
        slug: 'crm/pipeline',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    articles: [
      {
        id: 'billing-guide',
        title: 'Plan and billing',
        description: 'Upgrades, Stripe portal, and subscription status',
        slug: 'account/billing-guide',
      },
    ],
  },
  {
    id: 'prospecting',
    title: 'Prospecting Engine',
    articles: [
      {
        id: 'scraper-guide',
        title: 'Global Scraper Guide',
        description: 'How to find properties on Idealista, Zillow, Immobiliare.it',
        slug: 'prospecting/scraper-guide',
      },
      {
        id: 'arbitrage',
        title: 'Arbitrage Guide',
        description: 'Identify market opportunities and calculate the Market Gap',
        slug: 'prospecting/arbitrage',
      },
      {
        id: 'filters',
        title: 'Advanced Search Filters',
        description: 'Set up automatic filters to find the best deals',
        slug: 'prospecting/filters',
      },
    ],
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Calling',
    articles: [
      {
        id: 'voice-setup',
        title: 'AI Call Setup',
        description: 'Set up Bland AI and start calling',
        slug: 'ai-voice/voice-setup',
      },
      {
        id: 'call-scripts',
        title: 'Custom Call Scripts',
        description: 'Create effective scripts to win mandates',
        slug: 'ai-voice/call-scripts',
      },
      {
        id: 'obstacle-handling',
        title: 'Objection Handling',
        description: 'How AI handles owner objections',
        slug: 'ai-voice/obstacle-handling',
      },
    ],
  },
  {
    id: '3d-staging',
    title: '3D Virtual Staging',
    articles: [
      {
        id: 'staging-guide',
        title: '3D Staging Guide',
        description: 'Generate post-renovation visualizations to convince clients',
        slug: '3d-staging/staging-guide',
      },
      {
        id: 'whatsapp-integration',
        title: 'Send via WhatsApp',
        description: 'Share 3D projects with owners and clients',
        slug: '3d-staging/whatsapp-integration',
      },
    ],
  },
  {
    id: 'aura-vr',
    title: 'Aura VR',
    articles: [
      {
        id: 'vr-guide',
        title: 'Aura VR Guide',
        description: '360° immersive tour from photos for WhatsApp and decks',
        slug: 'aura-vr/vr-guide',
      },
    ],
  },
  {
    id: 'price-sniper',
    title: 'Price Drop Sniper',
    articles: [
      {
        id: 'sniper-guide',
        title: 'How the Sniper works',
        description: 'Detect price drops in real time',
        slug: 'price-sniper/sniper-guide',
      },
      {
        id: 'sniper-strategy',
        title: 'Sniper Strategy',
        description: 'Approach owners after a price drop',
        slug: 'price-sniper/sniper-strategy',
      },
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Intelligence',
    articles: [
      {
        id: 'commercial-guide',
        title: 'Commercial Property Analysis',
        description: 'Identify recommended businesses and market gaps',
        slug: 'commercial/commercial-guide',
      },
      {
        id: 'business-features',
        title: 'Key business features',
        description: 'Detect chimney, storefront, C3 category',
        slug: 'commercial/business-features',
      },
    ],
  },
  {
    id: 'territory',
    title: 'Territory Commander',
    articles: [
      {
        id: 'territory-guide',
        title: 'Territory Analysis',
        description: 'Demand, neighborhood DNA, sales velocity',
        slug: 'territory/territory-guide',
      },
      {
        id: 'map-usage',
        title: 'Tactical Map Usage',
        description: 'Navigate deals on the interactive map',
        slug: 'territory/map-usage',
      },
    ],
  },
  {
    id: 'smart-briefing',
    title: 'AI Smart Briefing',
    articles: [
      {
        id: 'briefing-guide',
        title: 'Smart Briefing Guide',
        description: 'Pros, cons, automatic target audience',
        slug: 'smart-briefing/briefing-guide',
      },
      {
        id: 'client-ready',
        title: 'Client-Ready Copy',
        description: 'Generate WhatsApp-ready summaries',
        slug: 'smart-briefing/client-ready',
      },
    ],
  },
  {
    id: 'xray',
    title: 'AI X-Ray Vision',
    articles: [
      {
        id: 'xray-guide',
        title: 'Technical Image Analysis',
        description: 'Detect defects and features with AI',
        slug: 'xray/xray-guide',
      },
      {
        id: 'renovation-quote',
        title: 'Renovation Budget',
        description: 'Calculate renovation costs',
        slug: 'xray/renovation-quote',
      },
    ],
  },
  {
    id: 'competitor',
    title: 'Competitor Radar',
    articles: [
      {
        id: 'radar-guide',
        title: 'Expiring Mandate Detection',
        description: 'Find properties stagnant for 120+ days',
        slug: 'competitor/radar-guide',
      },
    ],
  },
];

export const docsHubUiIt: DocsHubUi = {
  pageTitle: 'Centro documentazione',
  pageSubtitle: 'Guide complete per dominare PropertyPilot AI',
  searchPlaceholder: 'Cerca nelle guide…',
  articleSingular: 'articolo',
  articlePlural: 'articoli',
  quickStartTitle: 'Avvio rapido',
  quickStartDesc: 'Nuovo su PropertyPilot? Inizia da qui.',
  quickStartBtn: 'Inizia qui',
  bestPracticesTitle: 'Best practice',
  bestPracticesDesc: 'Strategie avanzate per massimizzare i risultati.',
  bestPracticesBtn: 'Scopri strategie',
  goalsTitle: 'Obiettivi',
  goalsDesc: "Come ottenere mandati con l'IA in 7 giorni.",
  goalsBtn: 'Ottieni mandati',
  backToDocs: 'Torna alla documentazione',
  sections: sectionsIt,
};

export const docsHubUiEn: DocsHubUi = {
  pageTitle: 'Documentation Hub',
  pageSubtitle: 'Complete guides to master PropertyPilot AI',
  searchPlaceholder: 'Search guides…',
  articleSingular: 'article',
  articlePlural: 'articles',
  quickStartTitle: 'Quick start',
  quickStartDesc: 'New to PropertyPilot? Start here.',
  quickStartBtn: 'Start here',
  bestPracticesTitle: 'Best practices',
  bestPracticesDesc: 'Advanced strategies to maximize results.',
  bestPracticesBtn: 'Discover strategies',
  goalsTitle: 'Goals',
  goalsDesc: 'How to win mandates with AI in 7 days.',
  goalsBtn: 'Win mandates',
  backToDocs: 'Back to documentation',
  sections: sectionsEn,
};
