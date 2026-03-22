/** Copy for `/dashboard/perfect-copy`. IT + EN. Form values match API payloads. */
export type PerfectCopySelectOption = { value: string; label: string };
export type PerfectCopyIconOption = PerfectCopySelectOption & { icon: string };
export type PerfectCopyToneOption = PerfectCopySelectOption & { description: string };

export type PerfectCopyPageUi = {
  backToDashboard: string;
  backAria: string;
  heroTitle: string;
  heroBadge: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  listingTypeLabel: string;
  selectListingType: string;
  propertyTypeLabel: string;
  selectPropertyType: string;
  locationLabel: string;
  locationPlaceholder: string;
  featuresLabel: string;
  featuresPlaceholder: string;
  strengthsLabel: string;
  strengthsPlaceholder: string;
  targetLabel: string;
  selectTarget: string;
  priceLabel: string;
  pricePlaceholder: string;
  toneLabel: string;
  portalLabel: string;
  featuresHelp: string;
  targetHelp: string;
  variantsIncluded: string;
  variantsDesc: string;
  generateIdle: string;
  generateLoading: string;
  emptyTitle: string;
  emptySubtitle: string;
  loadingTitle: string;
  loadingSubtitle: string;
  expertTip: string;
  portalAdaptation: string;
  copyAll: string;
  sectionTitle: string;
  sectionDesc: string;
  sectionHighlights: string;
  sectionWhy: string;
  sectionCta: string;
  sectionMeta: string;
  metaChars: string;
  tabPro: string;
  tabEmotivo: string;
  tabBreve: string;
  tabSeo: string;
  tabLuxury: string;
  requiredFieldsDesc: string;
  errorGeneric: string;
  successTitle: string;
  successDesc: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  copyPackTitle: string;
  copyPackDescription: string;
  copyPackHighlights: string;
  copyPackWhyBuy: string;
  copyPackCta: string;
  copyPackMeta: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  tipoTransazione: PerfectCopyIconOption[];
  tipiImmobile: PerfectCopySelectOption[];
  targetCliente: PerfectCopyIconOption[];
  toni: PerfectCopyToneOption[];
  portali: PerfectCopySelectOption[];
};

const it: PerfectCopyPageUi = {
  backToDashboard: 'Torna alla dashboard',
  backAria: 'Torna alla dashboard',
  heroTitle: 'Perfect Real Estate Copy 2.0',
  heroBadge: '🚀 Power feature',
  heroSubtitle: 'Genera 5 varianti professionali del tuo annuncio in un click',
  formTitle: 'Dati immobile',
  formSubtitle: 'Inserisci i dettagli per generare annunci perfetti',
  listingTypeLabel: 'Tipo annuncio *',
  selectListingType: 'Vendita o affitto?',
  propertyTypeLabel: 'Tipo immobile *',
  selectPropertyType: 'Seleziona tipo',
  locationLabel: 'Zona / località *',
  locationPlaceholder: 'Es: Centro Storico, Milano',
  featuresLabel: 'Caratteristiche principali *',
  featuresPlaceholder:
    'Es: 120 mq, 3 camere, 2 bagni, terrazzo, box auto, ristrutturato 2023…',
  strengthsLabel: 'Punti di forza',
  strengthsPlaceholder:
    'Es: Vista panoramica, silenzioso, luminoso, vicino metro…',
  targetLabel: 'Target cliente *',
  selectTarget: 'Seleziona target',
  priceLabel: 'Fascia di prezzo',
  pricePlaceholder: 'Es: €350.000 - €400.000',
  toneLabel: 'Tono principale',
  portalLabel: 'Portale target',
  featuresHelp:
    "Includi metratura, distribuzione, piano, bagno, balcone/terrazzo, anno ristrutturazione, classe energetica: l'AI userà questi dettagli per bullet e titoli credibili.",
  targetHelp:
    'Il target orienta tono e promesse: un investitore vuole rendimento e dati; una famiglia vuole spazi e vicinanza a scuole/verde.',
  variantsIncluded: '5 varianti premium incluse',
  variantsDesc: 'Professionale, Emotivo, Breve, SEO e Luxury',
  generateIdle: 'Genera 5 varianti',
  generateLoading: 'Generazione in corso…',
  emptyTitle: 'Il tuo annuncio perfetto ti aspetta',
  emptySubtitle:
    'Compila il form e genera automaticamente 5 varianti professionali: Professionale, Emotivo, Breve, SEO e Luxury.',
  loadingTitle: 'Generazione AI in corso…',
  loadingSubtitle: 'Stiamo creando 5 varianti ottimizzate del tuo annuncio',
  expertTip: "Consiglio dell'esperto",
  portalAdaptation: 'Adattamento portale:',
  copyAll: 'Copia tutto',
  sectionTitle: 'Titolo',
  sectionDesc: 'Descrizione completa',
  sectionHighlights: 'Highlights',
  sectionWhy: 'Perché comprarlo',
  sectionCta: 'Call to action',
  sectionMeta: 'Meta description SEO',
  metaChars: 'caratteri',
  tabPro: 'Pro',
  tabEmotivo: 'Emotivo',
  tabBreve: 'Breve',
  tabSeo: 'SEO',
  tabLuxury: 'Luxury',
  requiredFieldsDesc:
    'Compila tipo immobile, zona, caratteristiche e target cliente.',
  errorGeneric: 'Errore durante la generazione',
  successTitle: 'Perfect Copy — annunci pronti',
  successDesc:
    'Tutte le varianti sono pronte. Scegli una scheda e copia il testo dove ti serve.',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti.',
  copyFailed: 'Impossibile copiare. Riprova.',
  copyPackTitle: 'TITOLO',
  copyPackDescription: 'DESCRIZIONE',
  copyPackHighlights: 'HIGHLIGHTS',
  copyPackWhyBuy: 'PERCHÉ COMPRARLO',
  copyPackCta: 'CALL TO ACTION',
  copyPackMeta: 'META DESCRIPTION SEO',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  tipoTransazione: [
    { value: 'vendita', label: 'Vendita', icon: '🏷️' },
    { value: 'affitto', label: 'Affitto', icon: '🔑' },
    { value: 'affitto_breve', label: 'Affitto breve / turistico', icon: '🏖️' },
  ],
  tipiImmobile: [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'casa', label: 'Casa indipendente' },
    { value: 'villa', label: 'Villa' },
    { value: 'attico', label: 'Attico' },
    { value: 'loft', label: 'Loft' },
    { value: 'bilocale', label: 'Bilocale' },
    { value: 'trilocale', label: 'Trilocale' },
    { value: 'monolocale', label: 'Monolocale' },
    { value: 'rustico', label: 'Rustico' },
    { value: 'casale', label: 'Casale' },
    { value: 'palazzo', label: 'Palazzo / stabile' },
    { value: 'locale_commerciale', label: 'Locale commerciale' },
    { value: 'ufficio', label: 'Ufficio' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'garage', label: 'Garage / box' },
  ],
  targetCliente: [
    { value: 'famiglie', label: 'Famiglie', icon: '👨‍👩‍👧‍👦' },
    { value: 'giovani_coppie', label: 'Giovani coppie', icon: '💑' },
    { value: 'investitori', label: 'Investitori', icon: '📈' },
    { value: 'studenti', label: 'Studenti / universitari', icon: '🎓' },
    { value: 'professionisti', label: 'Professionisti / lavoratori', icon: '💼' },
    { value: 'pensionati', label: 'Pensionati', icon: '🏖️' },
    { value: 'luxury', label: 'Clientela luxury', icon: '💎' },
    { value: 'stranieri', label: 'Clienti stranieri', icon: '🌍' },
    { value: 'turisti', label: 'Turisti / vacanzieri', icon: '✈️' },
    { value: 'aziende', label: 'Aziende / corporate', icon: '🏢' },
  ],
  toni: [
    {
      value: 'professionale',
      label: 'Professionale',
      description: 'Formale e informativo',
    },
    {
      value: 'emotivo',
      label: 'Emotivo',
      description: 'Coinvolgente e aspirazionale',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Esclusivo e prestigioso',
    },
  ],
  portali: [
    { value: 'generico', label: 'Generico (tutti i portali)' },
    { value: 'immobiliare', label: 'Immobiliare.it' },
    { value: 'idealista', label: 'Idealista.it' },
    { value: 'casa', label: 'Casa.it' },
    { value: 'subito', label: 'Subito.it' },
    { value: 'zillow', label: 'Zillow.com (USA)' },
  ],
};

const en: PerfectCopyPageUi = {
  backToDashboard: 'Back to dashboard',
  backAria: 'Back to dashboard',
  heroTitle: 'Perfect Real Estate Copy 2.0',
  heroBadge: '🚀 Power feature',
  heroSubtitle: 'Generate 5 professional variants of your listing in one click',
  formTitle: 'Property data',
  formSubtitle: 'Enter details to generate perfect listings',
  listingTypeLabel: 'Listing type *',
  selectListingType: 'Sale or rental?',
  propertyTypeLabel: 'Property type *',
  selectPropertyType: 'Select type',
  locationLabel: 'Area / location *',
  locationPlaceholder: 'e.g. Downtown, Miami',
  featuresLabel: 'Main features *',
  featuresPlaceholder:
    'e.g. 120 sqm, 3 beds, 2 baths, terrace, parking, renovated 2023…',
  strengthsLabel: 'Key strengths',
  strengthsPlaceholder: 'e.g. Panoramic view, quiet, bright, near subway…',
  targetLabel: 'Target client *',
  selectTarget: 'Select target',
  priceLabel: 'Price range',
  pricePlaceholder: 'e.g. $350,000 - $400,000',
  toneLabel: 'Main tone',
  portalLabel: 'Target portal',
  featuresHelp:
    'Include sqm, layout, floor, bathrooms, balcony/terrace, renovation year, energy class — the AI uses these for credible bullets and headlines.',
  targetHelp:
    'Target shapes tone and promises: investors want yield and data; families want space and schools/green nearby.',
  variantsIncluded: '5 premium variants included',
  variantsDesc: 'Professional, Emotional, Brief, SEO and Luxury',
  generateIdle: 'Generate 5 variants',
  generateLoading: 'Generating…',
  emptyTitle: 'Your perfect listing awaits',
  emptySubtitle:
    'Fill the form and automatically generate 5 professional variants: Professional, Emotional, Brief, SEO and Luxury.',
  loadingTitle: 'AI generation in progress…',
  loadingSubtitle: 'We are creating 5 optimized variants of your listing',
  expertTip: 'Expert tip',
  portalAdaptation: 'Portal adaptation:',
  copyAll: 'Copy all',
  sectionTitle: 'Title',
  sectionDesc: 'Full description',
  sectionHighlights: 'Highlights',
  sectionWhy: 'Why buy it',
  sectionCta: 'Call to action',
  sectionMeta: 'SEO meta description',
  metaChars: 'characters',
  tabPro: 'Pro',
  tabEmotivo: 'Emotional',
  tabBreve: 'Brief',
  tabSeo: 'SEO',
  tabLuxury: 'Luxury',
  requiredFieldsDesc:
    'Fill in property type, location, features and target client.',
  errorGeneric: 'Error during generation',
  successTitle: 'Perfect Copy — listings ready',
  successDesc:
    'All variants are ready. Pick a tab and copy the text wherever you need it.',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard.',
  copyFailed: 'Unable to copy. Try again.',
  copyPackTitle: 'TITLE',
  copyPackDescription: 'DESCRIPTION',
  copyPackHighlights: 'HIGHLIGHTS',
  copyPackWhyBuy: 'WHY BUY IT',
  copyPackCta: 'CALL TO ACTION',
  copyPackMeta: 'SEO META DESCRIPTION',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  tipoTransazione: [
    { value: 'vendita', label: 'Sale', icon: '🏷️' },
    { value: 'affitto', label: 'Rental', icon: '🔑' },
    { value: 'affitto_breve', label: 'Short-term / vacation rental', icon: '🏖️' },
  ],
  tipiImmobile: [
    { value: 'appartamento', label: 'Apartment' },
    { value: 'casa', label: 'Detached house' },
    { value: 'villa', label: 'Villa' },
    { value: 'attico', label: 'Penthouse' },
    { value: 'loft', label: 'Loft' },
    { value: 'bilocale', label: '1-bedroom apt' },
    { value: 'trilocale', label: '2-bedroom apt' },
    { value: 'monolocale', label: 'Studio' },
    { value: 'rustico', label: 'Rustic' },
    { value: 'casale', label: 'Farmhouse' },
    { value: 'palazzo', label: 'Palace / building' },
    { value: 'locale_commerciale', label: 'Commercial space' },
    { value: 'ufficio', label: 'Office' },
    { value: 'terreno', label: 'Land' },
    { value: 'garage', label: 'Garage / parking' },
  ],
  targetCliente: [
    { value: 'famiglie', label: 'Families', icon: '👨‍👩‍👧‍👦' },
    { value: 'giovani_coppie', label: 'Young couples', icon: '💑' },
    { value: 'investitori', label: 'Investors', icon: '📈' },
    { value: 'studenti', label: 'Students', icon: '🎓' },
    { value: 'professionisti', label: 'Professionals', icon: '💼' },
    { value: 'pensionati', label: 'Retirees', icon: '🏖️' },
    { value: 'luxury', label: 'Luxury clients', icon: '💎' },
    { value: 'stranieri', label: 'Foreign buyers', icon: '🌍' },
    { value: 'turisti', label: 'Tourists / vacationers', icon: '✈️' },
    { value: 'aziende', label: 'Companies / corporate', icon: '🏢' },
  ],
  toni: [
    {
      value: 'professionale',
      label: 'Professional',
      description: 'Formal and informative',
    },
    {
      value: 'emotivo',
      label: 'Emotional',
      description: 'Engaging and aspirational',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Exclusive and prestigious',
    },
  ],
  portali: [
    { value: 'generico', label: 'Generic (all portals)' },
    { value: 'immobiliare', label: 'Immobiliare.it' },
    { value: 'idealista', label: 'Idealista.it' },
    { value: 'casa', label: 'Casa.it' },
    { value: 'subito', label: 'Subito.it' },
    { value: 'zillow', label: 'Zillow.com (USA)' },
  ],
};

export const perfectCopyPageUiIt = it;
export const perfectCopyPageUiEn = en;
