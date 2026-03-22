/** Copy for `/dashboard/agency-branding` — white-label PDF branding. IT + EN. */
export type AgencyBrandingPageUi = {
  backToDashboard: string;
  backAria: string;
  pageTitle: string;
  pageSubtitle: string;
  /** Badge in page chrome (emoji + label) */
  badgeWhiteLabel: string;
  agencyInfoTitle: string;
  agencyInfoDesc: string;
  agencyNameLabel: string;
  agencyNamePlaceholder: string;
  logoUrlLabel: string;
  logoUrlPlaceholder: string;
  logoUrlHelper: string;
  logoAlt: string;
  websiteLabel: string;
  websitePlaceholder: string;
  contactsTitle: string;
  contactsDesc: string;
  contactNameLabel: string;
  contactNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  colorsTitle: string;
  colorsDesc: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  saving: string;
  updateBranding: string;
  saveBranding: string;
  previewTitle: string;
  previewDesc: string;
  previewRibbon: string;
  previewPropertyTitle: string;
  previewPriceSample: string;
  previewFeatures: string[];
  previewAgencyName: string;
  previewContact: string;
  previewPhone: string;
  previewWebsite: string;
  previewDesc2: string;
  brandingConfigured: string;
  agencyNameRequired: string;
  saved: string;
  savedDesc: string;
  saveError: string;
  loadForbidden: string;
  loadErrorGeneric: string;
};

const it: AgencyBrandingPageUi = {
  backToDashboard: 'Torna alla dashboard',
  backAria: 'Torna alla dashboard',
  pageTitle: 'Branding agenzia',
  pageSubtitle: 'Personalizza le schede PDF con il tuo brand white label',
  badgeWhiteLabel: '🏢 White label',
  agencyInfoTitle: 'Informazioni agenzia',
  agencyInfoDesc: 'Dati base della tua agenzia immobiliare',
  agencyNameLabel: 'Nome agenzia *',
  agencyNamePlaceholder: 'es. Immobiliare Rossi',
  logoUrlLabel: 'URL logo (opzionale)',
  logoUrlPlaceholder: 'https://example.com/logo.png',
  logoUrlHelper:
    "Inserisci l'URL del logo della tua agenzia (formato PNG o JPG consigliato)",
  logoAlt: 'Logo',
  websiteLabel: 'Sito web (opzionale)',
  websitePlaceholder: 'https://www.tuaagenzia.it',
  contactsTitle: 'Contatti',
  contactsDesc: 'Informazioni di contatto per le schede PDF',
  contactNameLabel: 'Nome referente',
  contactNamePlaceholder: 'es. Mario Rossi',
  phoneLabel: 'Telefono',
  phonePlaceholder: '+39 02 1234567',
  emailLabel: 'Email',
  emailPlaceholder: 'info@agenzia.it',
  colorsTitle: 'Colori brand',
  colorsDesc: 'Personalizza i colori delle tue schede PDF',
  primaryColor: 'Colore primario',
  secondaryColor: 'Colore secondario',
  accentColor: 'Colore accento',
  saving: 'Salvataggio…',
  updateBranding: 'Aggiorna branding',
  saveBranding: 'Salva branding',
  previewTitle: 'Anteprima scheda PDF',
  previewDesc: 'Ecco come apparirà la tua scheda white label',
  previewRibbon: 'White label',
  previewPropertyTitle: 'Titolo immobile',
  previewPriceSample: '350.000 €',
  previewFeatures: ['100 mq', '3 locali', '2 bagni'],
  previewAgencyName: 'Nome agenzia',
  previewContact: 'Nome referente',
  previewPhone: '+39 000 0000000',
  previewWebsite: 'www.agenzia.it',
  previewDesc2:
    'Splendido appartamento in zona centrale, luminoso e ristrutturato con finiture di pregio. Ideale per famiglie…',
  brandingConfigured:
    'Branding configurato — usa «White label» nella generazione PDF',
  agencyNameRequired: "Inserisci il nome dell'agenzia",
  saved: 'Branding salvato!',
  savedDesc: 'Il profilo della tua agenzia è stato salvato con successo.',
  saveError: 'Errore nel salvataggio',
  loadForbidden:
    'Il branding white label richiede piano PRO o AGENCY con pagamento attivo.',
  loadErrorGeneric: 'Impossibile caricare il branding.',
};

const en: AgencyBrandingPageUi = {
  backToDashboard: 'Back to dashboard',
  backAria: 'Back to dashboard',
  pageTitle: 'Agency branding',
  pageSubtitle: 'Customize PDF sheets with your white-label brand',
  badgeWhiteLabel: '🏢 White label',
  agencyInfoTitle: 'Agency information',
  agencyInfoDesc: 'Basic data for your real estate agency',
  agencyNameLabel: 'Agency name *',
  agencyNamePlaceholder: 'e.g. Rossi Real Estate',
  logoUrlLabel: 'Logo URL (optional)',
  logoUrlPlaceholder: 'https://example.com/logo.png',
  logoUrlHelper: 'Enter your agency logo URL (PNG or JPG recommended)',
  logoAlt: 'Logo',
  websiteLabel: 'Website (optional)',
  websitePlaceholder: 'https://www.youragency.com',
  contactsTitle: 'Contacts',
  contactsDesc: 'Contact information for PDF sheets',
  contactNameLabel: 'Contact name',
  contactNamePlaceholder: 'e.g. John Smith',
  phoneLabel: 'Phone',
  phonePlaceholder: '+1 555 1234567',
  emailLabel: 'Email',
  emailPlaceholder: 'info@agency.com',
  colorsTitle: 'Brand colors',
  colorsDesc: 'Customize the colors of your PDF sheets',
  primaryColor: 'Primary color',
  secondaryColor: 'Secondary color',
  accentColor: 'Accent color',
  saving: 'Saving…',
  updateBranding: 'Update branding',
  saveBranding: 'Save branding',
  previewTitle: 'PDF sheet preview',
  previewDesc: "Here's how your white-label sheet will look",
  previewRibbon: 'White label',
  previewPropertyTitle: 'Property title',
  previewPriceSample: '$350,000',
  previewFeatures: ['100 sq m', '3 rooms', '2 baths'],
  previewAgencyName: 'Agency name',
  previewContact: 'Contact name',
  previewPhone: '+1 000 0000000',
  previewWebsite: 'www.agency.com',
  previewDesc2:
    'Splendid apartment in a central area, bright and renovated with quality finishes. Ideal for families…',
  brandingConfigured: 'Branding saved — use “White label” when generating PDFs',
  agencyNameRequired: 'Enter the agency name',
  saved: 'Branding saved!',
  savedDesc: 'Your agency profile was saved successfully.',
  saveError: 'Save error',
  loadForbidden:
    'White-label branding requires an active PRO or AGENCY plan with confirmed billing.',
  loadErrorGeneric: 'Could not load branding.',
};

export const agencyBrandingPageUiIt = it;
export const agencyBrandingPageUiEn = en;
