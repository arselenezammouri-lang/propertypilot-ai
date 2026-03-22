/** `/dashboard/emotional-listing` */

export type EmotionalListingTxIconKey = 'tag' | 'keyRound' | 'palmtree';
export type EmotionalListingTargetIconKey = 'users' | 'sparkles' | 'trendingUp' | 'crown';
export type EmotionalListingToneIconKey = 'heart' | 'crown' | 'home';
export type EmotionalListingVariantId = 'storytelling' | 'luxury' | 'familyWarm';

export type EmotionalListingPageUi = {
  backToDashboard: string;
  heroTitle: string;
  heroSubtitle: string;
  /** Text only; page shows Heart icon beside badge */
  heroBadge: string;
  formTitle: string;
  formSubtitle: string;
  listingType: string;
  selectTransaction: string;
  propertyTypeLabel: string;
  propertyTypePlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  priceLabel: string;
  pricePlaceholder: string;
  featuresLabel: string;
  featuresPlaceholder: string;
  strengthsLabel: string;
  strengthsPlaceholder: string;
  targetLabel: string;
  selectTarget: string;
  toneLabel: string;
  selectTone: string;
  generateIdle: string;
  generateLoading: string;
  emptyTitle: string;
  emptySubtitle: string;
  loadingTitle: string;
  loadingSubtitle: string;
  creativeTip: string;
  versionLabel: string;
  copyAll: string;
  sectionTitle: string;
  sectionApertura: string;
  sectionSensoriale: string;
  sectionNarrativa: string;
  sectionHighlights: string;
  sectionImmagina: string;
  sectionCta: string;
  variantTabs: Array<{
    id: EmotionalListingVariantId;
    label: string;
    description: string;
  }>;
  transactionOptions: Array<{
    value: string;
    label: string;
    iconKey: EmotionalListingTxIconKey;
  }>;
  targetOptions: Array<{
    value: 'famiglie' | 'giovani' | 'investitori' | 'luxury';
    label: string;
    iconKey: EmotionalListingTargetIconKey;
  }>;
  toneOptions: Array<{
    value: 'emozionale' | 'luxury' | 'caldo';
    label: string;
    iconKey: EmotionalListingToneIconKey;
  }>;
  propertyTypeRequired: string;
  locationRequired: string;
  featuresRequired: string;
  strengthsRequired: string;
  priceRequired: string;
  successTitle: string;
  successCached: string;
  successDesc: string;
  errorGeneric: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  /** Full export: heading before bullet list */
  copyExportHighlightsTitle: string;
};

const VARIANT_GRADIENT: Record<EmotionalListingVariantId, string> = {
  storytelling: 'from-rose-500 to-pink-500',
  luxury: 'from-amber-500 to-yellow-500',
  familyWarm: 'from-sky-500 to-blue-500',
};

export function emotionalListingVariantGradient(id: EmotionalListingVariantId): string {
  return VARIANT_GRADIENT[id];
}

export const emotionalListingPageUiIt: EmotionalListingPageUi = {
  backToDashboard: 'Torna alla dashboard',
  heroTitle: 'Emotional Listing AI',
  heroSubtitle: 'Descrizioni emozionali che toccano il cuore dei tuoi acquirenti',
  heroBadge: 'Emotional AI',
  formTitle: 'Dati immobile',
  formSubtitle: 'Inserisci le informazioni per generare descrizioni emozionali',
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo di transazione',
  propertyTypeLabel: 'Tipo di immobile *',
  propertyTypePlaceholder: 'es. Villa con giardino e piscina',
  locationLabel: 'Località *',
  locationPlaceholder: 'es. Lago di Como',
  priceLabel: 'Prezzo *',
  pricePlaceholder: 'es. €1.200.000',
  featuresLabel: 'Caratteristiche *',
  featuresPlaceholder:
    'es. 5 camere, 3 bagni, giardino 2000 mq, piscina infinity, vista lago...',
  strengthsLabel: 'Punti di forza *',
  strengthsPlaceholder:
    'es. Vista mozzafiato, privacy assoluta, finiture di pregio, domotica...',
  targetLabel: 'Target',
  selectTarget: 'Seleziona target',
  toneLabel: 'Tono',
  selectTone: 'Seleziona tono',
  generateIdle: 'Genera 3 versioni emozionali',
  generateLoading: 'Generazione in corso...',
  emptyTitle: 'Nessuna descrizione generata',
  emptySubtitle:
    'Compila il form con i dati dell’immobile e clicca «Genera» per creare 3 descrizioni emozionali.',
  loadingTitle: 'Generazione in corso...',
  loadingSubtitle: 'Stiamo creando descrizioni emozionali coinvolgenti',
  creativeTip: 'Consiglio creativo',
  versionLabel: 'Versione',
  copyAll: 'Copia tutto',
  sectionTitle: 'Titolo',
  sectionApertura: 'Apertura emozionale',
  sectionSensoriale: 'Testo sensoriale',
  sectionNarrativa: 'Descrizione narrativa',
  sectionHighlights: 'Emotional highlights',
  sectionImmagina: 'Immagina questo…',
  sectionCta: 'CTA emozionale',
  variantTabs: [
    { id: 'storytelling', label: 'Storytelling', description: 'Narrativa immersiva' },
    { id: 'luxury', label: 'Luxury', description: 'Esclusivo e raffinato' },
    { id: 'familyWarm', label: 'Family warm', description: 'Caldo e accogliente' },
  ],
  transactionOptions: [
    { value: 'vendita', label: 'Vendita', iconKey: 'tag' },
    { value: 'affitto', label: 'Affitto', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Affitto breve / turistico', iconKey: 'palmtree' },
  ],
  targetOptions: [
    { value: 'famiglie', label: 'Famiglie', iconKey: 'users' },
    { value: 'giovani', label: 'Giovani professionisti', iconKey: 'sparkles' },
    { value: 'investitori', label: 'Investitori', iconKey: 'trendingUp' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
  ],
  toneOptions: [
    { value: 'emozionale', label: 'Emozionale', iconKey: 'heart' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
    { value: 'caldo', label: 'Caldo e accogliente', iconKey: 'home' },
  ],
  propertyTypeRequired: 'Inserisci il tipo di immobile (min 3 caratteri)',
  locationRequired: 'Inserisci la località',
  featuresRequired: 'Descrivi le caratteristiche (min 10 caratteri)',
  strengthsRequired: 'Descrivi i punti di forza (min 10 caratteri)',
  priceRequired: 'Inserisci il prezzo',
  successTitle: 'Annuncio emozionale — pronto',
  successCached: 'Risultato dalla cache (24h)',
  successDesc: '3 versioni emozionali pronte all’uso',
  errorGeneric: 'Errore nella generazione',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  copyExportHighlightsTitle: 'EMOTIONAL HIGHLIGHTS',
};

export const emotionalListingPageUiEn: EmotionalListingPageUi = {
  backToDashboard: 'Back to dashboard',
  heroTitle: 'Emotional Listing AI',
  heroSubtitle: 'Emotional descriptions that resonate with your buyers',
  heroBadge: 'Emotional AI',
  formTitle: 'Property data',
  formSubtitle: 'Enter details to generate emotional descriptions',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  propertyTypeLabel: 'Property type *',
  propertyTypePlaceholder: 'e.g. Villa with garden and pool',
  locationLabel: 'Location *',
  locationPlaceholder: 'e.g. Lake Como',
  priceLabel: 'Price *',
  pricePlaceholder: 'e.g. $1,200,000',
  featuresLabel: 'Features *',
  featuresPlaceholder:
    'e.g. 5 beds, 3 baths, 2000 sqm garden, infinity pool, lake view...',
  strengthsLabel: 'Key strengths *',
  strengthsPlaceholder:
    'e.g. Breathtaking view, total privacy, premium finishes, smart home...',
  targetLabel: 'Target',
  selectTarget: 'Select target',
  toneLabel: 'Tone',
  selectTone: 'Select tone',
  generateIdle: 'Generate 3 emotional versions',
  generateLoading: 'Generating...',
  emptyTitle: 'No description yet',
  emptySubtitle:
    'Fill in the property details and click Generate to create 3 emotional descriptions.',
  loadingTitle: 'Generating...',
  loadingSubtitle: 'We are creating engaging emotional descriptions',
  creativeTip: 'Creative tip',
  versionLabel: 'Version',
  copyAll: 'Copy all',
  sectionTitle: 'Title',
  sectionApertura: 'Emotional opening',
  sectionSensoriale: 'Sensory copy',
  sectionNarrativa: 'Narrative description',
  sectionHighlights: 'Emotional highlights',
  sectionImmagina: 'Imagine this…',
  sectionCta: 'Emotional CTA',
  variantTabs: [
    { id: 'storytelling', label: 'Storytelling', description: 'Immersive narrative' },
    { id: 'luxury', label: 'Luxury', description: 'Exclusive and refined' },
    { id: 'familyWarm', label: 'Family warm', description: 'Warm and welcoming' },
  ],
  transactionOptions: [
    { value: 'vendita', label: 'Sale', iconKey: 'tag' },
    { value: 'affitto', label: 'Long-term rental', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Short-term / vacation rental', iconKey: 'palmtree' },
  ],
  targetOptions: [
    { value: 'famiglie', label: 'Families', iconKey: 'users' },
    { value: 'giovani', label: 'Young professionals', iconKey: 'sparkles' },
    { value: 'investitori', label: 'Investors', iconKey: 'trendingUp' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
  ],
  toneOptions: [
    { value: 'emozionale', label: 'Emotional', iconKey: 'heart' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
    { value: 'caldo', label: 'Warm', iconKey: 'home' },
  ],
  propertyTypeRequired: 'Enter property type (min 3 characters)',
  locationRequired: 'Enter the location',
  featuresRequired: 'Describe features (min 10 characters)',
  strengthsRequired: 'Describe key strengths (min 10 characters)',
  priceRequired: 'Enter the price',
  successTitle: 'Emotional listing — ready',
  successCached: 'Result from cache (24h)',
  successDesc: '3 emotional versions ready to use',
  errorGeneric: 'Generation error',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard',
  copyFailed: 'Unable to copy text',
  copyExportHighlightsTitle: 'EMOTIONAL HIGHLIGHTS',
};
