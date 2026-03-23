/** Job-to-be-done bucket for sidebar / command palette (aligned with `nav-config` groups). IT/EN here; ES–AR in `dashboard-nav-command-palette-locales.ts`. */
export type DashboardJtbdId = 'content' | 'crm' | 'intel' | 'brand' | 'account';

export type DashboardNavItemCopy = {
  label: string;
  description?: string;
};

export type DashboardNavGroupCopy = {
  heading: string;
  items: Record<string, DashboardNavItemCopy>;
};

/** JTBD groups + command palette chrome + sidebar / mobile drawer chrome */
export type DashboardNavUi = {
  jtbd: Record<DashboardJtbdId, DashboardNavGroupCopy>;
  commandPalette: {
    placeholder: string;
    noResults: string;
    hint: string;
    hintOpen: string;
    signOut: string;
    signOutDesc: string;
    help: string;
    helpDesc: string;
    quickLinksHeading: string;
    guidesHeading: string;
    opensNewTab: string;
    quickActionsHeading: string;
  };
  layout: {
    sidebarAriaLabel: string;
    sidebarKicker: string;
    sidebarSubtitle: string;
    mobileOpenMenuAria: string;
    mobileCloseMenuAria: string;
    mobileTitle: string;
    mobileSubtitle: string;
    mobileNavAriaLabel: string;
    menuButtonLabel: string;
  };
};

const jtbdIt: Record<DashboardJtbdId, DashboardNavGroupCopy> = {
  content: {
    heading: 'Contenuti & annunci',
    items: {
      listings: {
        label: 'Genera Annuncio',
        description: 'Crea annunci AI in 30 secondi',
      },
      'perfect-copy': {
        label: 'Perfect Copy',
        description: 'Copy persuasivo con Hook + Body + CTA',
      },
      titles: { label: 'Genera Titoli', description: "10 titoli irresistibili con l'AI" },
      'emotional-listing': { label: 'Annuncio Emozionale', description: 'Storytelling che vende' },
      'refine-listing': {
        label: 'Raffina Annuncio',
        description: 'Migliora e ottimizza testi esistenti',
      },
      translate: { label: 'Traduci Annuncio', description: 'Traduci in 10+ lingue' },
      'social-posts': {
        label: 'Social Posts',
        description: 'Post per Instagram, Facebook, LinkedIn',
      },
      hashtags: {
        label: 'Hashtags',
        description: 'Set hashtag ottimizzati per ogni piattaforma',
      },
      'followup-emails': {
        label: 'Email Follow-up',
        description: 'Email professionali per ogni fase',
      },
      'video-scripts': { label: 'Script Video', description: 'Script per Reels e TikTok' },
      'agent-bio': {
        label: 'Bio Agente',
        description: 'Bio professionale per il tuo profilo',
      },
      pdf: {
        label: 'Genera PDF',
        description: 'Brochure professionale pronta in secondi',
      },
    },
  },
  crm: {
    heading: 'Lead, CRM & prospecting',
    items: {
      prospecting: {
        label: 'Prospecting Engine',
        description: 'Trova immobili su Idealista, Zillow, Immobiliare.it',
      },
      leads: { label: 'CRM Leads', description: 'Gestisci tutti i tuoi lead' },
      pipeline: { label: 'Pipeline Leads', description: 'Kanban board dei tuoi lead' },
      'workflow-automations': {
        label: 'Workflow automazioni',
        description: 'Follow-up, reminder e contenuti ricorrenti',
      },
      'crm-automations': {
        label: 'Regole CRM (if/then)',
        description: 'Trigger su eventi lead: stato, score, email…',
      },
      map: { label: 'Mappa Tattica', description: 'Visualizza deal sulla mappa interattiva' },
      'lead-score': { label: 'Lead Score AI', description: 'Punteggio AI per ogni lead' },
      opportunities: {
        label: 'Opportunità',
        description: 'Deal con Market Gap identificato',
      },
    },
  },
  intel: {
    heading: 'Intelligence & ricerca',
    items: {
      analyze: { label: 'Analisi Immobile', description: 'X-Ray AI su foto e planimetrie' },
      auditor: {
        label: 'AI Auditor',
        description: 'Analisi qualità annunci esistenti',
      },
      autopilot: { label: 'Autopilot', description: 'Prospecting automatico 24/7' },
      scraper: {
        label: 'Scraper Globale',
        description: 'Cerca immobili su portali mondiali',
      },
    },
  },
  brand: {
    heading: 'Brand & crescita',
    items: {
      'agency-branding': {
        label: 'Brand Agenzia',
        description: 'Logo, colori e stile del tuo brand',
      },
      'agency-assistant': {
        label: 'Assistente Agenzia',
        description: 'AI dedicata alla tua agenzia',
      },
      packages: {
        label: 'Pacchetti Servizi',
        description: 'Crea pacchetti da vendere ai clienti',
      },
      referral: {
        label: 'Programma Referral',
        description: 'Guadagna invitando colleghi',
      },
    },
  },
  account: {
    heading: 'Account & workspace',
    items: {
      dashboard: { label: 'Dashboard', description: 'Torna alla dashboard principale' },
      'settings-workspace': {
        label: 'Impostazioni Workspace',
        description: 'Nome agenzia, lingue, preferenze',
      },
      billing: {
        label: 'Abbonamento & Fatturazione',
        description: 'Gestisci il tuo piano',
      },
      compliance: { label: 'Compliance', description: 'GDPR, CCPA e documenti legali' },
      docs: { label: 'Documentazione', description: 'Guide e tutorial' },
    },
  },
};

const jtbdEn: Record<DashboardJtbdId, DashboardNavGroupCopy> = {
  content: {
    heading: 'Listings & content',
    items: {
      listings: {
        label: 'Generate Listing',
        description: 'Create AI listings in 30 seconds',
      },
      'perfect-copy': {
        label: 'Perfect Copy',
        description: 'Persuasive copy with Hook + Body + CTA',
      },
      titles: { label: 'Generate Titles', description: '10 irresistible AI titles' },
      'emotional-listing': { label: 'Emotional Listing', description: 'Storytelling that sells' },
      'refine-listing': {
        label: 'Refine Listing',
        description: 'Improve and optimize existing texts',
      },
      translate: { label: 'Translate Listing', description: 'Translate into 10+ languages' },
      'social-posts': {
        label: 'Social Posts',
        description: 'Posts for Instagram, Facebook, LinkedIn',
      },
      hashtags: {
        label: 'Hashtags',
        description: 'Optimized hashtag sets for each platform',
      },
      'followup-emails': {
        label: 'Follow-up Emails',
        description: 'Professional emails for every stage',
      },
      'video-scripts': { label: 'Video Scripts', description: 'Scripts for Reels and TikTok' },
      'agent-bio': {
        label: 'Agent Bio',
        description: 'Professional bio for your profile',
      },
      pdf: {
        label: 'Generate PDF',
        description: 'Professional brochure ready in seconds',
      },
    },
  },
  crm: {
    heading: 'Leads, CRM & prospecting',
    items: {
      prospecting: {
        label: 'Prospecting Engine',
        description: 'Find properties on Idealista, Zillow, Immobiliare.it',
      },
      leads: { label: 'CRM Leads', description: 'Manage all your leads' },
      pipeline: { label: 'Leads Pipeline', description: 'Kanban board of your leads' },
      'workflow-automations': {
        label: 'Automation workflows',
        description: 'Follow-up, reminders, and recurring content',
      },
      'crm-automations': {
        label: 'CRM rules (if/then)',
        description: 'Triggers on lead events: status, score, email…',
      },
      map: { label: 'Tactical Map', description: 'View deals on the interactive map' },
      'lead-score': { label: 'Lead Score AI', description: 'AI score for each lead' },
      opportunities: {
        label: 'Opportunities',
        description: 'Deals with identified Market Gap',
      },
    },
  },
  intel: {
    heading: 'Intelligence & research',
    items: {
      analyze: { label: 'Property Analysis', description: 'AI X-Ray on photos and floor plans' },
      auditor: {
        label: 'AI Auditor',
        description: 'Quality analysis of existing listings',
      },
      autopilot: { label: 'Autopilot', description: 'Automatic prospecting 24/7' },
      scraper: {
        label: 'Global Scraper',
        description: 'Search properties on global portals',
      },
    },
  },
  brand: {
    heading: 'Brand & growth',
    items: {
      'agency-branding': {
        label: 'Agency Branding',
        description: 'Logo, colors and style of your brand',
      },
      'agency-assistant': {
        label: 'Agency Assistant',
        description: 'AI dedicated to your agency',
      },
      packages: {
        label: 'Service Packages',
        description: 'Create packages to sell to clients',
      },
      referral: {
        label: 'Referral Program',
        description: 'Earn by inviting colleagues',
      },
    },
  },
  account: {
    heading: 'Account & workspace',
    items: {
      dashboard: { label: 'Dashboard', description: 'Back to main dashboard' },
      'settings-workspace': {
        label: 'Workspace Settings',
        description: 'Agency name, languages, preferences',
      },
      billing: {
        label: 'Subscription & Billing',
        description: 'Manage your plan',
      },
      compliance: { label: 'Compliance', description: 'GDPR, CCPA and legal documents' },
      docs: { label: 'Documentation', description: 'Guides and tutorials' },
    },
  },
};

export const dashboardNavUiIt: DashboardNavUi = {
  jtbd: jtbdIt,
  commandPalette: {
    placeholder: 'Cerca strumenti, pagine, azioni…',
    noResults: 'Nessun risultato trovato.',
    hint: 'Premi',
    hintOpen: 'per aprire il Command Center',
    signOut: 'Esci',
    signOutDesc: 'Chiudi sessione su questo dispositivo',
    help: 'Centro assistenza',
    helpDesc: 'Guide e FAQ',
    quickLinksHeading: 'Collegamenti veloci',
    guidesHeading: 'Guide (nuova scheda)',
    opensNewTab: 'Si apre in una nuova scheda',
    quickActionsHeading: 'Azioni rapide',
  },
  layout: {
    sidebarAriaLabel: 'Navigazione area lavoro',
    sidebarKicker: 'Area lavoro',
    sidebarSubtitle: 'Strumenti per ruolo',
    mobileOpenMenuAria: 'Apri menu area lavoro',
    mobileCloseMenuAria: 'Chiudi menu',
    mobileTitle: 'Area lavoro',
    mobileSubtitle: 'Stessi gruppi della barra laterale desktop',
    mobileNavAriaLabel: 'Navigazione mobile',
    menuButtonLabel: 'Menu',
  },
};

export const dashboardNavUiEn: DashboardNavUi = {
  jtbd: jtbdEn,
  commandPalette: {
    placeholder: 'Search tools, pages, actions…',
    noResults: 'No results found.',
    hint: 'Press',
    hintOpen: 'to open Command Center',
    signOut: 'Sign out',
    signOutDesc: 'Sign out on this device',
    help: 'Help center',
    helpDesc: 'Guides and FAQ',
    quickLinksHeading: 'Quick links',
    guidesHeading: 'Guides (new tab)',
    opensNewTab: 'Opens in a new tab',
    quickActionsHeading: 'Quick actions',
  },
  layout: {
    sidebarAriaLabel: 'Workspace navigation',
    sidebarKicker: 'Workspace',
    sidebarSubtitle: 'Tools by job',
    mobileOpenMenuAria: 'Open workspace menu',
    mobileCloseMenuAria: 'Close menu',
    mobileTitle: 'Workspace',
    mobileSubtitle: 'Same groups as the desktop sidebar',
    mobileNavAriaLabel: 'Mobile navigation',
    menuButtonLabel: 'Menu',
  },
};

export type CommandPaletteQuickLinkId =
  | 'ql-listings'
  | 'ql-perfect-copy'
  | 'ql-pipeline'
  | 'ql-lead-score'
  | 'ql-billing'
  | 'ql-workspace'
  | 'ql-home';

export type CommandPaletteGuideLinkId =
  | 'g-hub'
  | 'g-welcome'
  | 'g-first-listing'
  | 'g-workspace-doc'
  | 'g-perfect-copy'
  | 'g-pipeline'
  | 'g-billing'
  | 'g-arbitrage';

export type CommandPaletteExtraStrings = {
  quick: Record<CommandPaletteQuickLinkId, { label: string; description: string; keywords: string }>;
  guides: Record<CommandPaletteGuideLinkId, { label: string; description: string; keywords: string }>;
};

export const commandPaletteExtrasIt: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Libreria annunci',
      description: 'Annunci salvati e bozze',
      keywords: 'libreria salvati annunci listing',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: '5 varianti di copy in un colpo',
      keywords: 'copy annuncio varianti',
    },
    'ql-pipeline': {
      label: 'Pipeline lead',
      description: 'Kanban stato lead',
      keywords: 'kanban crm lead',
    },
    'ql-lead-score': {
      label: 'Lead Score AI',
      description: 'Punteggio intelligenza lead',
      keywords: 'score punteggio lead',
    },
    'ql-billing': {
      label: 'Fatturazione',
      description: 'Piano, Stripe, fatture',
      keywords: 'abbonamento piano stripe fattura',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Moduli e preferenze agenzia',
      keywords: 'impostazioni moduli agenzia',
    },
    'ql-home': {
      label: 'Command Center (home)',
      description: 'Dashboard principale',
      keywords: 'home principale panoramica',
    },
  },
  guides: {
    'g-hub': {
      label: 'Hub documentazione',
      description: 'Tutte le guide e le FAQ',
      keywords: 'docs aiuto help faq',
    },
    'g-welcome': {
      label: 'Guida: Benvenuto',
      description: 'Introduzione alla piattaforma',
      keywords: 'inizio intro onboarding',
    },
    'g-first-listing': {
      label: 'Guida: Primo annuncio',
      description: 'Flusso rapido per generare copy',
      keywords: 'primo annuncio generare tutorial',
    },
    'g-workspace-doc': {
      label: 'Guida: Workspace',
      description: 'Moduli e personalizzazione',
      keywords: 'workspace moduli impostazioni',
    },
    'g-perfect-copy': {
      label: 'Guida: Perfect Copy',
      description: 'Campi del form e varianti',
      keywords: 'perfect copy form varianti',
    },
    'g-pipeline': {
      label: 'Guida: Pipeline Kanban',
      description: 'Trascinamento stati e CRM',
      keywords: 'pipeline kanban lead crm',
    },
    'g-billing': {
      label: 'Guida: Piano e fatturazione',
      description: 'Stripe e abbonamento',
      keywords: 'fatturazione stripe piano abbonamento',
    },
    'g-arbitrage': {
      label: 'Guida: Arbitraggio / Market Gap',
      description: 'Opportunità e pricing',
      keywords: 'arbitraggio market gap deal',
    },
  },
};

export const commandPaletteExtrasEn: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Listings library',
      description: 'Saved listings and drafts',
      keywords: 'library saved drafts listings',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: 'Five copy variants at once',
      keywords: 'copy listing variants',
    },
    'ql-pipeline': {
      label: 'Lead pipeline',
      description: 'Kanban lead stages',
      keywords: 'kanban crm leads',
    },
    'ql-lead-score': {
      label: 'Lead Score AI',
      description: 'AI lead scoring',
      keywords: 'score rating lead',
    },
    'ql-billing': {
      label: 'Billing',
      description: 'Plan, Stripe, invoices',
      keywords: 'subscription plan stripe invoice',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Agency modules and preferences',
      keywords: 'settings modules agency',
    },
    'ql-home': {
      label: 'Command Center (home)',
      description: 'Main dashboard',
      keywords: 'home overview main',
    },
  },
  guides: {
    'g-hub': {
      label: 'Documentation hub',
      description: 'All guides and FAQs',
      keywords: 'docs help faq support',
    },
    'g-welcome': {
      label: 'Guide: Welcome',
      description: 'Platform introduction',
      keywords: 'start intro onboarding',
    },
    'g-first-listing': {
      label: 'Guide: First listing',
      description: 'Quick flow to generate copy',
      keywords: 'first listing generate tutorial',
    },
    'g-workspace-doc': {
      label: 'Guide: Workspace setup',
      description: 'Modules and customization',
      keywords: 'workspace modules settings',
    },
    'g-perfect-copy': {
      label: 'Guide: Perfect Copy',
      description: 'Form fields and variants',
      keywords: 'perfect copy form variants',
    },
    'g-pipeline': {
      label: 'Guide: Kanban pipeline',
      description: 'Drag status and CRM',
      keywords: 'pipeline kanban leads crm',
    },
    'g-billing': {
      label: 'Guide: Plan & billing',
      description: 'Stripe and subscription',
      keywords: 'billing stripe plan subscription',
    },
    'g-arbitrage': {
      label: 'Guide: Arbitrage / Market Gap',
      description: 'Opportunities and pricing',
      keywords: 'arbitrage market gap deal',
    },
  },
};
