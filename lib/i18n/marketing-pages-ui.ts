/** Public marketing pages: About, Blog index, Features */

export type MarketingAboutUi = {
  title: string;
  subtitle: string;
  missionTitle: string;
  missionBody: string;
  whatTitle: string;
  whatBody: string;
  marketsTitle: string;
  marketsBody: string;
  securityTitle: string;
  securityBody: string;
  privacyLink: string;
  contact: string;
  home: string;
};

export const marketingAboutUiIt: MarketingAboutUi = {
  title: 'Chi siamo',
  subtitle: "La nostra missione: potenziare le agenzie con l'intelligenza artificiale",
  missionTitle: 'La nostra missione',
  missionBody:
    'PropertyPilot AI nasce per dare a ogni agenzia immobiliare gli strumenti AI che prima erano riservati solo ai grandi player. Vogliamo che agenti e team possano competere sul mercato con annunci persuasivi, CRM intelligenti e automazioni che risparmiano ore di lavoro.',
  whatTitle: 'Cosa facciamo',
  whatBody:
    "Generazione annunci AI, audit listing, traduzioni multi-lingua, CRM integrato, prospecting, compliance GDPR e molto altro. Tutto in un'unica piattaforma pensata per il mercato immobiliare italiano e internazionale.",
  marketsTitle: 'Mercati',
  marketsBody:
    'Siamo attivi in Italia, USA, Spagna e altri mercati. Supportiamo 7+ lingue e multiple valute per agenti che operano a livello locale e internazionale.',
  securityTitle: 'Privacy e sicurezza',
  securityBody:
    'I tuoi dati sono al sicuro. Conformità GDPR, crittografia end-to-end e infrastruttura enterprise.',
  privacyLink: 'Privacy Policy',
  contact: 'Contattaci',
  home: 'Torna alla Home',
};

export const marketingAboutUiEn: MarketingAboutUi = {
  title: 'About',
  subtitle: 'Our mission: empower agencies with artificial intelligence',
  missionTitle: 'Our mission',
  missionBody:
    'PropertyPilot AI was built to give every real estate agency access to AI tools that were once reserved for large players only. We want agents and teams to compete with persuasive listings, intelligent CRM workflows, and automations that save hours of work.',
  whatTitle: 'What we do',
  whatBody:
    'AI listing generation, listing audits, multi-language translations, integrated CRM, prospecting, GDPR compliance, and more. Everything in one platform built for both local and international real estate markets.',
  marketsTitle: 'Markets',
  marketsBody:
    'We are active in Italy, the USA, Spain, and other markets. We support 7+ languages and multiple currencies for agents working locally and internationally.',
  securityTitle: 'Privacy and security',
  securityBody:
    'Your data stays protected. GDPR compliance, end-to-end encryption, and enterprise-grade infrastructure.',
  privacyLink: 'Privacy Policy',
  contact: 'Contact us',
  home: 'Back to Home',
};

export type MarketingBlogPostUi = { slug: string; title: string; excerpt: string; date: string };

export type MarketingBlogUi = {
  subtitle: string;
  comingSoon: string;
  backHome: string;
  posts: MarketingBlogPostUi[];
};

export const marketingBlogUiIt: MarketingBlogUi = {
  subtitle: 'Guide, tips e risorse per agenti immobiliari',
  comingSoon: 'Altri articoli in arrivo. Resta sintonizzato!',
  backHome: 'Torna alla Home',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'Come scrivere annunci che convertono',
      excerpt: "5 regole d'oro per annunci immobiliari che generano contatti.",
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'AI per agenzie immobiliari: guida pratica',
      excerpt: "Come integrare l'intelligenza artificiale nel tuo flusso di lavoro.",
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'CRM immobiliare automatizzato',
      excerpt: 'Riduci il lavoro manuale e non perdere mai un lead.',
      date: '2024-10',
    },
  ],
};

export const marketingBlogUiEn: MarketingBlogUi = {
  subtitle: 'Guides, tips, and resources for real estate agents',
  comingSoon: 'More articles are coming soon. Stay tuned!',
  backHome: 'Back to Home',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'How to write listings that convert',
      excerpt: '5 golden rules for property listings that generate leads.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'AI for real estate agencies: practical guide',
      excerpt: 'How to integrate artificial intelligence into your daily workflow.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'Automated real estate CRM',
      excerpt: 'Reduce manual work and never lose a lead again.',
      date: '2024-10',
    },
  ],
};

export type MarketingFeatureRowUi = { title: string; desc: string };

export type MarketingFeaturesUi = {
  titleWord: string;
  subtitle: string;
  viewPricing: string;
  backHome: string;
  features: MarketingFeatureRowUi[];
};

export const marketingFeaturesUiIt: MarketingFeaturesUi = {
  titleWord: 'Funzionalità',
  subtitle: 'Tutte le funzionalità AI per far crescere la tua agenzia',
  viewPricing: 'Vedi i piani',
  backHome: 'Torna alla Home',
  features: [
    {
      title: 'Generazione annunci AI',
      desc: 'Crea annunci immobiliari persuasivi in secondi. Copy ottimizzato e descrizioni che convertono.',
    },
    {
      title: 'Perfect Copy & Emotional Listing',
      desc: 'Descrizioni che evocano emozioni e vendono. Stile professionale con call-to-action efficaci.',
    },
    {
      title: 'Traduzioni multi-lingua',
      desc: 'Traduci annunci in 7+ lingue mantenendo tono e persuasività. Perfetto per mercati internazionali.',
    },
    {
      title: 'Audit annunci',
      desc: 'Analisi AI del tuo annuncio: punteggio qualità, suggerimenti di miglioramento e best practice.',
    },
    {
      title: 'Aria Assistant',
      desc: 'Assistente vocale AI che guida agenti e team. Consigli in tempo reale e supporto operativo.',
    },
    {
      title: 'CRM & lead management',
      desc: 'Gestione lead integrata, pipeline Kanban, automazioni e scoring per non perdere nessun contatto.',
    },
    {
      title: 'Prospecting & scraper',
      desc: 'Trova proprietari da contattare. Scraping intelligente e outreach automatizzato.',
    },
    {
      title: 'Compliance Center',
      desc: 'Documenti legali pre-compilati, GDPR, DPA. Mantieni la tua agenzia conforme e protetta.',
    },
    {
      title: 'Lead scoring',
      desc: 'Prioritizza i lead migliori con punteggio AI. Focus su chi converte davvero.',
    },
    {
      title: 'Follow-up automatici',
      desc: 'Email di follow-up personalizzate e sequenze automatiche per massimizzare le conversioni.',
    },
    {
      title: 'Agency Assistant',
      desc: 'Strategie AI per agenzie. Pianificazione, best practice e ottimizzazione processi.',
    },
    {
      title: 'Map prospecting',
      desc: 'Visualizza e analizza proprietà su mappa. Identifica opportunità nel tuo territorio.',
    },
  ],
};

export const marketingFeaturesUiEn: MarketingFeaturesUi = {
  titleWord: 'Features',
  subtitle: 'All the AI capabilities to grow your agency',
  viewPricing: 'View pricing',
  backHome: 'Back to Home',
  features: [
    {
      title: 'AI listing generation',
      desc: 'Create persuasive property listings in seconds with optimized copy that converts.',
    },
    {
      title: 'Perfect Copy & Emotional Listing',
      desc: 'Descriptions that create emotion and sell, with professional tone and effective calls to action.',
    },
    {
      title: 'Multi-language translations',
      desc: 'Translate listings into 7+ languages while preserving tone and persuasiveness for international markets.',
    },
    {
      title: 'Listing audit',
      desc: 'AI analysis of your listing with quality score, improvement suggestions, and best practices.',
    },
    {
      title: 'Aria Assistant',
      desc: 'AI voice assistant that guides agents and teams with real-time advice and operational support.',
    },
    {
      title: 'CRM & lead management',
      desc: 'Integrated lead management, Kanban pipeline, automations, and scoring so you never lose a contact.',
    },
    {
      title: 'Prospecting & scraper',
      desc: 'Find owners to target with smart scraping and automated outreach.',
    },
    {
      title: 'Compliance Center',
      desc: 'Pre-filled legal documents, GDPR, and DPA tools to keep your agency compliant and protected.',
    },
    {
      title: 'Lead scoring',
      desc: 'Prioritize the best leads with AI scoring and focus on the contacts most likely to convert.',
    },
    {
      title: 'Automated follow-ups',
      desc: 'Personalized follow-up emails and automated sequences to maximize conversions.',
    },
    {
      title: 'Agency Assistant',
      desc: 'AI strategies for agencies: planning, best practices, and process optimization.',
    },
    {
      title: 'Map prospecting',
      desc: 'View and analyze properties on a map to identify opportunities in your territory.',
    },
  ],
};
