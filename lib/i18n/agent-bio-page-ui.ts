/** `/dashboard/agent-bio` — AI agent biography generator */

export type AgentBioTonoUi = 'professionale' | 'amichevole' | 'luxury';
export type AgentBioMercatoUi = 'italia' | 'usa' | 'internazionale';

export type AgentBioPageUi = {
  pageTitle: string;
  pageSubtitle: string;
  back: string;
  heroBadge: string;
  agentNameRequired: string;
  agencyNameRequired: string;
  specializationRequired: string;
  areaRequired: string;
  generateError: string;
  bioSuccess: string;
  cacheResult: string;
  readyVariants: string;
  copied: string;
  copiedText: string;
  copyFailed: string;
  copyAll: string;
  opening: string;
  fullBio: string;
  skills: string;
  salesApproach: string;
  ctaLabel: string;
  seoVersionLabel: string;
  seoCopyPrefix: string;
  agentData: string;
  agentDataDesc: string;
  agentName: string;
  agentNamePlaceholder: string;
  agencyName: string;
  agencyNamePlaceholder: string;
  experienceYears: string;
  serviceArea: string;
  serviceAreaPlaceholder: string;
  specializations: string;
  specializationsPlaceholder: string;
  certifications: string;
  certificationsPlaceholder: string;
  tone: string;
  targetMarket: string;
  premiumIncluded: string;
  premiumIncludedDesc: string;
  generating: string;
  generate5: string;
  readyCreate: string;
  readyCreateDesc: string;
  generating5: string;
  waitTime: string;
  brandingTip: string;
  tabPro: string;
  tabEmotional: string;
  tabLuxury: string;
  tabSocial: string;
  tabWebsite: string;
  /** Card title: prefix + localized variant name */
  bioCardTitlePrefix: string;
  toneOptions: Array<{
    value: AgentBioTonoUi;
    label: string;
    description: string;
  }>;
  marketOptions: Array<{
    value: AgentBioMercatoUi;
    label: string;
    description: string;
  }>;
  variantDisplayName: Record<
    'professionale' | 'emotiva' | 'luxury' | 'social' | 'website',
    string
  >;
};

export const agentBioPageUiIt: AgentBioPageUi = {
  pageTitle: 'Agent BIO AI Creator',
  pageSubtitle: 'Genera biografie professionali per il tuo personal branding',
  back: 'Torna alla dashboard',
  heroBadge: 'Agent Branding AI',
  agentNameRequired: "Inserisci il nome dell'agente",
  agencyNameRequired: "Inserisci il nome dell'agenzia",
  specializationRequired: 'Inserisci almeno una specializzazione',
  areaRequired: 'Inserisci la zona operativa',
  generateError: 'Errore nella generazione',
  bioSuccess: 'Bio generate con successo!',
  cacheResult: 'Risultato dalla cache (24h)',
  readyVariants: "5 varianti pronte all'uso",
  copied: 'Copiato!',
  copiedText: 'Testo copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  copyAll: 'Copia tutto',
  opening: 'Frase di apertura',
  fullBio: 'Bio completa',
  skills: 'Skills e punti di forza',
  salesApproach: 'Approccio di vendita',
  ctaLabel: 'Call to action',
  seoVersionLabel: 'Versione SEO',
  seoCopyPrefix: 'SEO:',
  agentData: 'Dati agente',
  agentDataDesc: 'Inserisci le informazioni per generare 5 varianti di bio',
  agentName: 'Nome agente',
  agentNamePlaceholder: 'es. Marco Rossi',
  agencyName: 'Nome agenzia',
  agencyNamePlaceholder: 'es. Immobiliare Premium',
  experienceYears: 'Anni di esperienza',
  serviceArea: 'Zona operativa',
  serviceAreaPlaceholder: 'es. Milano Centro, Brianza',
  specializations: 'Specializzazioni',
  specializationsPlaceholder:
    'es. Immobili di lusso, attici, ville, commerciali, nuove costruzioni',
  certifications: 'Certificazioni / premi (opzionale)',
  certificationsPlaceholder: 'es. Top Producer 2023, certificazione FIAIP',
  tone: 'Tono della bio',
  targetMarket: 'Mercato target',
  premiumIncluded: '5 varianti premium incluse',
  premiumIncludedDesc: 'Professionale, emotiva, luxury, social e website SEO',
  generating: 'Generazione in corso...',
  generate5: 'Genera 5 bio AI',
  readyCreate: 'Pronto a creare la tua bio',
  readyCreateDesc:
    'Compila il form e genera 5 versioni professionali della tua biografia per sito web, social e materiali di marketing.',
  generating5: 'Generazione delle 5 bio in corso...',
  waitTime: 'Può richiedere 15-30 secondi',
  brandingTip: 'Consiglio personal branding',
  tabPro: 'Pro',
  tabEmotional: 'Emotiva',
  tabLuxury: 'Luxury',
  tabSocial: 'Social',
  tabWebsite: 'Website',
  bioCardTitlePrefix: 'Bio',
  toneOptions: [
    {
      value: 'professionale',
      label: 'Professionale',
      description: 'Formale e autorevole',
    },
    {
      value: 'amichevole',
      label: 'Amichevole',
      description: 'Caldo e accessibile',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Esclusivo e sofisticato',
    },
  ],
  marketOptions: [
    { value: 'italia', label: 'Italia', description: 'Mercato italiano' },
    { value: 'usa', label: 'USA', description: 'Mercato statunitense' },
    {
      value: 'internazionale',
      label: 'Internazionale',
      description: 'Clientela globale',
    },
  ],
  variantDisplayName: {
    professionale: 'Professionale',
    emotiva: 'Emotiva',
    luxury: 'Luxury',
    social: 'Social',
    website: 'Website',
  },
};

export const agentBioPageUiEn: AgentBioPageUi = {
  pageTitle: 'Agent BIO AI Creator',
  pageSubtitle: 'Generate professional bios for your personal branding',
  back: 'Back to dashboard',
  heroBadge: 'Agent Branding AI',
  agentNameRequired: 'Enter the agent name',
  agencyNameRequired: 'Enter the agency name',
  specializationRequired: 'Enter at least one specialization',
  areaRequired: 'Enter the service area',
  generateError: 'Generation error',
  bioSuccess: 'Bios generated successfully!',
  cacheResult: 'Result from cache (24h)',
  readyVariants: '5 ready-to-use variants',
  copied: 'Copied!',
  copiedText: 'Text copied to clipboard',
  copyFailed: 'Unable to copy text',
  copyAll: 'Copy all',
  opening: 'Opening line',
  fullBio: 'Full bio',
  skills: 'Skills & strengths',
  salesApproach: 'Sales approach',
  ctaLabel: 'Call to action',
  seoVersionLabel: 'SEO version',
  seoCopyPrefix: 'SEO:',
  agentData: 'Agent details',
  agentDataDesc: 'Enter the information to generate 5 bio variants',
  agentName: 'Agent name',
  agentNamePlaceholder: 'e.g. Jane Smith',
  agencyName: 'Agency name',
  agencyNamePlaceholder: 'e.g. Premier Realty',
  experienceYears: 'Years of experience',
  serviceArea: 'Service area',
  serviceAreaPlaceholder: 'e.g. Downtown Miami, Coral Gables',
  specializations: 'Specializations',
  specializationsPlaceholder:
    'e.g. Luxury homes, penthouses, new development, commercial',
  certifications: 'Certifications / awards (optional)',
  certificationsPlaceholder: 'e.g. Top Producer 2023, CRS designation',
  tone: 'Bio tone',
  targetMarket: 'Target market',
  premiumIncluded: '5 premium variants included',
  premiumIncludedDesc: 'Professional, emotional, luxury, social, and website SEO',
  generating: 'Generating...',
  generate5: 'Generate 5 AI bios',
  readyCreate: 'Ready to create your bio',
  readyCreateDesc:
    'Fill in the form and generate 5 professional biography versions for your website, social, and marketing.',
  generating5: 'Generating 5 bios...',
  waitTime: 'This may take 15-30 seconds',
  brandingTip: 'Personal branding tip',
  tabPro: 'Pro',
  tabEmotional: 'Emotional',
  tabLuxury: 'Luxury',
  tabSocial: 'Social',
  tabWebsite: 'Website',
  bioCardTitlePrefix: 'Bio',
  toneOptions: [
    {
      value: 'professionale',
      label: 'Professional',
      description: 'Formal and authoritative',
    },
    {
      value: 'amichevole',
      label: 'Friendly',
      description: 'Warm and approachable',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Exclusive and sophisticated',
    },
  ],
  marketOptions: [
    { value: 'italia', label: 'Italy', description: 'Italian market' },
    { value: 'usa', label: 'USA', description: 'US market' },
    {
      value: 'internazionale',
      label: 'International',
      description: 'Global audience',
    },
  ],
  variantDisplayName: {
    professionale: 'Professional',
    emotiva: 'Emotional',
    luxury: 'Luxury',
    social: 'Social',
    website: 'Website',
  },
};
