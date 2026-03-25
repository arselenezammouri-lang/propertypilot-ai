/**
 * Copy for dashboard "All tools" grid (DashboardPlanFeatures).
 * IT + EN authoritative here; ES/FR/DE/PT/AR in `plan-features-locales.ts` (wired in dictionary).
 */
export type PlanFeaturesChrome = {
  plan: string;
  planNames: { free: string; starter: string; pro: string; agency: string };
  free: string;
  freeLimit: string;
  starterLimit: string;
  proLimit: string;
  agencyLimit: string;
  currentPlan: string;
  requiresHigherPlan: string;
  open: string;
  unlock: string;
  higherPlans: string;
  unlockPlan: string;
};

export type PlanFeatureItemCopy = { name: string; description: string };

export type PlanFeaturesUi = {
  chrome: PlanFeaturesChrome;
  items: Record<string, PlanFeatureItemCopy>;
};

const chromeIt: PlanFeaturesChrome = {
  plan: 'Piano',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Gratis',
  freeLimit: '5 annunci/mese',
  starterLimit: '50 annunci/mese',
  proLimit: '200 annunci/mese',
  agencyLimit: 'Illimitati',
  currentPlan: 'Il tuo piano attuale',
  requiresHigherPlan: 'Richiede piano superiore',
  open: 'Apri',
  unlock: 'Sblocca',
  higherPlans: 'Funzionalità disponibili nei piani superiori',
  unlockPlan: 'Sblocca Piano',
};

const chromeEn: PlanFeaturesChrome = {
  plan: 'Plan',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Free',
  freeLimit: '5 listings/month',
  starterLimit: '50 listings/month',
  proLimit: '200 listings/month',
  agencyLimit: 'Unlimited',
  currentPlan: 'Your current plan',
  requiresHigherPlan: 'Requires higher plan',
  open: 'Open',
  unlock: 'Unlock',
  higherPlans: 'Features available in higher plans',
  unlockPlan: 'Unlock Plan',
};

const itemsIt: Record<string, PlanFeatureItemCopy> = {
  generate: {
    name: 'Genera Nuovo Annuncio',
    description: "Crea contenuti professionali con l'AI in pochi secondi",
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Importa annunci da Immobiliare, Idealista, Casa, Subito',
  },
  analyze: {
    name: 'Analisi da Link',
    description: 'Incolla un link e ottieni analisi + riscrittura AI istantanea',
  },
  pdf: {
    name: 'Schede PDF Premium',
    description: 'Genera schede immobiliari professionali stile Canva',
  },
  'lead-score': {
    name: 'Lead Scoring AI',
    description: "Analizza i lead con punteggio 0-100, priorità d'azione e template risposta",
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 varianti premium: Professionale, Emotivo, Breve, SEO, Luxury',
  },
  translate: {
    name: 'Traduttore 12 Lingue',
    description: 'Traduci annunci in 12 lingue con adattamento culturale e SEO locale',
  },
  'social-posts': {
    name: 'Post Social AI',
    description: 'Genera post per Instagram, Facebook e TikTok',
  },
  titles: {
    name: 'Titoli A/B ad Alto CTR',
    description: '19 titoli ottimizzati: clickbait, luxury, SEO',
  },
  hashtags: {
    name: 'Hashtag AI Generator',
    description: '50+ hashtag ottimizzati per massimizzare il reach social',
  },
  'emotional-listing': {
    name: 'Emotional Listing AI',
    description: 'Descrizioni emozionali che toccano il cuore degli acquirenti',
  },
  'refine-listing': {
    name: 'Perfect Again AI',
    description: "Raffina e migliora i tuoi annunci esistenti con l'AI",
  },
  auditor: {
    name: 'Audit Immobiliare AI',
    description: 'Audit completo: struttura, SEO, emozioni, red flags e versione ottimizzata',
  },
  'agent-bio': {
    name: 'Agent BIO AI Creator',
    description: '5 bio professionali: Pro, Emotiva, Luxury, Social, Website SEO',
  },
  'followup-emails': {
    name: 'Follow-Up Email AI',
    description: '6 email professionali per convertire i tuoi lead immobiliari',
  },
  'video-scripts': {
    name: 'Video Scripts AI',
    description: 'Script video professionali con timestamp e indicazioni visive',
  },
  'agency-branding': {
    name: 'Agency Branding',
    description: 'Personalizza il branding della tua agenzia',
  },
  crm: {
    name: 'Lead Manager + AI',
    description: 'Email, WhatsApp, SMS con AI - Pipeline, automazioni, form capture',
  },
  'virtual-staging': {
    name: 'Virtual Staging 3D',
    description: 'Staging professionale 3D per i tuoi immobili',
  },
  'voice-calling': {
    name: 'AI Voice Calling',
    description: 'Chiamate AI automatiche ai proprietari (30/mese)',
  },
  'agency-assistant': {
    name: 'Agency Assistant AI',
    description: 'Chatbot per annunci, email, social e strategia immobiliare',
  },
  automations: {
    name: 'Workflow automazioni',
    description: 'Follow-up pianificati, reminder visite, contenuti settimanali (tabella automations)',
  },
  'crm-automation-rules': {
    name: 'Regole automazione CRM',
    description: 'If/then su eventi lead: nuovo lead, cambio stato, score, notifiche',
  },
  'unlimited-voice': {
    name: 'AI Voice Calling Illimitato',
    description: 'Chiamate AI automatiche 24/7 senza limiti',
  },
  'team-management': {
    name: 'Gestione Team Multi-utente',
    description: 'Team fino a 10 agenti, ruoli e permessi avanzati',
  },
  'aura-vr': {
    name: 'Aura VR: Virtual Tour Generation',
    description: 'Generazione illimitata di tour virtuali cinematografici',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'Dashboard intelligence per deal immobiliari con AI',
  },
  map: {
    name: 'Mappa Territorio AI',
    description: 'Visualizza immobili e opportunità sulla mappa',
  },
};

const itemsEn: Record<string, PlanFeatureItemCopy> = {
  generate: {
    name: 'Generate New Listing',
    description: 'Create professional AI-powered content in seconds',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Import listings from Immobiliare, Idealista, Casa, and Subito',
  },
  analyze: {
    name: 'Link Analysis',
    description: 'Paste a link and get instant AI analysis and rewrite',
  },
  pdf: {
    name: 'Premium PDF Sheets',
    description: 'Generate professional Canva-style property sheets',
  },
  'lead-score': {
    name: 'AI Lead Scoring',
    description: 'Analyze leads with 0-100 score, action priority, and reply templates',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 premium variants: Professional, Emotional, Short, SEO, Luxury',
  },
  translate: {
    name: '12-Language Translator',
    description: 'Translate listings into 12 languages with cultural and local SEO adaptation',
  },
  'social-posts': {
    name: 'AI Social Posts',
    description: 'Generate posts for Instagram, Facebook, and TikTok',
  },
  titles: {
    name: 'High CTR A/B Titles',
    description: '19 optimized titles: clickbait, luxury, SEO',
  },
  hashtags: {
    name: 'AI Hashtag Generator',
    description: '50+ optimized hashtags to maximize social reach',
  },
  'emotional-listing': {
    name: 'Emotional Listing AI',
    description: 'Emotional descriptions that connect with buyers',
  },
  'refine-listing': {
    name: 'Perfect Again AI',
    description: 'Refine and improve your existing listings with AI',
  },
  auditor: {
    name: 'AI Property Audit',
    description: 'Full audit: structure, SEO, emotions, red flags, and optimized version',
  },
  'agent-bio': {
    name: 'Agent BIO AI Creator',
    description: '5 professional bios: Pro, Emotional, Luxury, Social, Website SEO',
  },
  'followup-emails': {
    name: 'AI Follow-Up Email',
    description: '6 professional emails to convert your real estate leads',
  },
  'video-scripts': {
    name: 'AI Video Scripts',
    description: 'Professional video scripts with timestamps and visual directions',
  },
  'agency-branding': {
    name: 'Agency Branding',
    description: 'Customize your agency branding',
  },
  crm: {
    name: 'Lead Manager + AI',
    description: 'Email, WhatsApp, SMS with AI — pipeline, automations, capture forms',
  },
  'virtual-staging': {
    name: '3D Virtual Staging',
    description: 'Professional 3D staging for your properties',
  },
  'voice-calling': {
    name: 'AI Voice Calling',
    description: 'Automatic AI owner calls (30/month)',
  },
  'agency-assistant': {
    name: 'Agency Assistant AI',
    description: 'Chatbot for listings, email, social, and real estate strategy',
  },
  automations: {
    name: 'Automation workflows',
    description: 'Scheduled follow-ups, visit reminders, and weekly content (automations table)',
  },
  'crm-automation-rules': {
    name: 'CRM automation rules',
    description: 'If/then on lead events: new lead, status change, score, notifications',
  },
  'unlimited-voice': {
    name: 'Unlimited AI Voice Calling',
    description: '24/7 automatic AI calling without limits',
  },
  'team-management': {
    name: 'Multi-user team management',
    description: 'Teams up to 10 agents, advanced roles and permissions',
  },
  'aura-vr': {
    name: 'Aura VR: Virtual Tour Generation',
    description: 'Unlimited cinematic virtual tour generation',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'AI-powered intelligence dashboard for property deals',
  },
  map: {
    name: 'AI Territory Map',
    description: 'View properties and opportunities on the map',
  },
};

export const planFeaturesUiIt: PlanFeaturesUi = { chrome: chromeIt, items: itemsIt };
export const planFeaturesUiEn: PlanFeaturesUi = { chrome: chromeEn, items: itemsEn };
