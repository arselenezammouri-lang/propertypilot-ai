/**
 * `/dashboard/translate` — AI multilingual listing translator
 */

export type TranslateListingTxIconKey = 'tag' | 'keyRound' | 'palmtree';

export type TranslateTargetLanguageUi = {
  code: string;
  name: string;
  /** Region / market label (no flag emoji) */
  country: string;
};

export type TranslateListingPageUi = {
  backToDashboard: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  formTitle: string;
  formSubtitle: string;
  listingType: string;
  selectTransaction: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  featuresLabel: string;
  featuresPlaceholder: string;
  targetLanguage: string;
  selectLanguage: string;
  toneLabel: string;
  toneStandard: string;
  toneLuxury: string;
  toneStandardDesc: string;
  toneLuxuryDesc: string;
  translateIdle: string;
  translateLoading: string;
  loadingText: string;
  loadingSubtext: string;
  emptyTitle: string;
  emptySubtitle: string;
  moreLanguages: string;
  resultTitle: string;
  market: string;
  tone: string;
  toneValueStandard: string;
  toneValueLuxury: string;
  cache: string;
  translatedTitle: string;
  originalLabel: string;
  translatedDesc: string;
  seoVersion: string;
  seoOptimized: string;
  seoRankingBadge: string;
  vocabTitle: string;
  vocabDesc: string;
  culturalTitle: string;
  culturalDesc: string;
  titleRequiredDesc: string;
  descRequiredDesc: string;
  errorGeneric: string;
  successTitle: string;
  successCached: string;
  /** Placeholder `{lang}` — target language display name */
  successDescFresh: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  transactionOptions: Array<{ value: string; label: string; iconKey: TranslateListingTxIconKey }>;
  targetLanguages: TranslateTargetLanguageUi[];
};

const targetLanguagesIt: TranslateTargetLanguageUi[] = [
  { code: 'en', name: 'English', country: 'USA / UK' },
  { code: 'fr', name: 'Français', country: 'Francia' },
  { code: 'es', name: 'Español', country: 'Spagna' },
  { code: 'de', name: 'Deutsch', country: 'Germania' },
  { code: 'pt', name: 'Português', country: 'Portogallo' },
  { code: 'it', name: 'Italiano', country: 'Italia' },
  { code: 'ar', name: 'العربية', country: 'Paesi arabi' },
  { code: 'zh', name: '中文', country: 'Cina' },
  { code: 'ru', name: 'Русский', country: 'Russia' },
  { code: 'nl', name: 'Nederlands', country: 'Paesi Bassi' },
  { code: 'pl', name: 'Polski', country: 'Polonia' },
  { code: 'tr', name: 'Türkçe', country: 'Turchia' },
];

const targetLanguagesEn: TranslateTargetLanguageUi[] = [
  { code: 'en', name: 'English', country: 'USA / UK' },
  { code: 'fr', name: 'Français', country: 'France' },
  { code: 'es', name: 'Español', country: 'Spain' },
  { code: 'de', name: 'Deutsch', country: 'Germany' },
  { code: 'pt', name: 'Português', country: 'Portugal' },
  { code: 'it', name: 'Italiano', country: 'Italy' },
  { code: 'ar', name: 'العربية', country: 'Arab world' },
  { code: 'zh', name: '中文', country: 'China' },
  { code: 'ru', name: 'Русский', country: 'Russia' },
  { code: 'nl', name: 'Nederlands', country: 'Netherlands' },
  { code: 'pl', name: 'Polski', country: 'Poland' },
  { code: 'tr', name: 'Türkçe', country: 'Türkiye' },
];

export const translateListingPageUiIt: TranslateListingPageUi = {
  backToDashboard: 'Torna alla dashboard',
  heroTitle: 'Traduttore multilingua AI',
  heroSubtitle:
    'Adatta titolo e descrizione al mercato di destinazione, con note culturali e SEO.',
  heroBadge: 'International ready',
  formTitle: 'Testo originale',
  formSubtitle: "Inserisci l'annuncio da tradurre",
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  titleLabel: 'Titolo annuncio *',
  titlePlaceholder: 'Es: Splendido appartamento con vista mare',
  descriptionLabel: 'Descrizione *',
  descriptionPlaceholder: "Inserisci la descrizione completa dell'immobile...",
  featuresLabel: 'Caratteristiche (opzionale)',
  featuresPlaceholder: 'Es: 3 camere, 2 bagni, terrazzo, box auto...',
  targetLanguage: 'Lingua di destinazione',
  selectLanguage: 'Seleziona la lingua di destinazione',
  toneLabel: 'Tono',
  toneStandard: 'Standard',
  toneLuxury: 'Luxury',
  toneStandardDesc: 'Professionale e chiaro',
  toneLuxuryDesc: 'Esclusivo e prestigioso',
  translateIdle: 'Traduci in',
  translateLoading: 'Traduzione in corso...',
  loadingText: 'Traduzione AI in corso...',
  loadingSubtext: "Sto adattando l'annuncio per",
  emptyTitle: 'Pronto per tradurre',
  emptySubtitle:
    'Inserisci l\'annuncio, seleziona lingua e tono, poi clicca su «Traduci».',
  moreLanguages: '+6 altre',
  resultTitle: 'Traduzione in',
  market: 'Mercato:',
  tone: 'Tono:',
  toneValueStandard: 'Standard',
  toneValueLuxury: 'Luxury',
  cache: 'Cache',
  translatedTitle: 'Titolo tradotto',
  originalLabel: 'Originale:',
  translatedDesc: 'Descrizione tradotta',
  seoVersion: 'Versione SEO ottimizzata',
  seoOptimized: 'Ottimizzata per i motori di ricerca in',
  seoRankingBadge: 'Ranking +50%',
  vocabTitle: 'Vocabolario adattato',
  vocabDesc: 'Terminologia immobiliare per',
  culturalTitle: 'Note culturali',
  culturalDesc: 'Adattamento per il mercato',
  titleRequiredDesc: 'Inserisci un titolo di almeno 5 caratteri.',
  descRequiredDesc: 'Inserisci una descrizione di almeno 20 caratteri.',
  errorGeneric: 'Errore durante la traduzione',
  successTitle: 'Traduttore annunci — traduzione pronta',
  successCached: 'Risultato caricato dalla cache.',
  successDescFresh: 'Annuncio tradotto in {lang}.',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti.',
  copyFailed: 'Impossibile copiare il testo.',
  transactionOptions: [
    { value: 'vendita', label: 'Vendita', iconKey: 'tag' },
    { value: 'affitto', label: 'Affitto', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Affitto breve / turistico', iconKey: 'palmtree' },
  ],
  targetLanguages: targetLanguagesIt,
};

export const translateListingPageUiEn: TranslateListingPageUi = {
  backToDashboard: 'Back to dashboard',
  heroTitle: 'AI multilingual translator',
  heroSubtitle: 'Adapt title and description for the target market, with cultural notes and SEO.',
  heroBadge: 'International ready',
  formTitle: 'Original text',
  formSubtitle: 'Enter the listing to translate',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  titleLabel: 'Listing title *',
  titlePlaceholder: 'e.g. Stunning apartment with sea view',
  descriptionLabel: 'Description *',
  descriptionPlaceholder: 'Enter the full property description...',
  featuresLabel: 'Features (optional)',
  featuresPlaceholder: 'e.g. 3 beds, 2 baths, terrace, parking...',
  targetLanguage: 'Target language',
  selectLanguage: 'Select the destination language',
  toneLabel: 'Tone',
  toneStandard: 'Standard',
  toneLuxury: 'Luxury',
  toneStandardDesc: 'Professional and clear',
  toneLuxuryDesc: 'Exclusive and prestigious',
  translateIdle: 'Translate to',
  translateLoading: 'Translating...',
  loadingText: 'AI translation in progress...',
  loadingSubtext: 'Adapting the listing for',
  emptyTitle: 'Ready to translate',
  emptySubtitle: 'Enter the listing, select language and tone, then click “Translate”.',
  moreLanguages: '+6 more',
  resultTitle: 'Translation in',
  market: 'Market:',
  tone: 'Tone:',
  toneValueStandard: 'Standard',
  toneValueLuxury: 'Luxury',
  cache: 'Cache',
  translatedTitle: 'Translated title',
  originalLabel: 'Original:',
  translatedDesc: 'Translated description',
  seoVersion: 'SEO-optimized version',
  seoOptimized: 'Optimized for search engines in',
  seoRankingBadge: 'Ranking +50%',
  vocabTitle: 'Adapted vocabulary',
  vocabDesc: 'Real estate terminology for',
  culturalTitle: 'Cultural notes',
  culturalDesc: 'Adaptation for the market',
  titleRequiredDesc: 'Enter a title of at least 5 characters.',
  descRequiredDesc: 'Enter a description of at least 20 characters.',
  errorGeneric: 'Error during translation',
  successTitle: 'Listing translator — translation ready',
  successCached: 'Result loaded from cache.',
  successDescFresh: 'Listing translated to {lang}.',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard.',
  copyFailed: 'Unable to copy text.',
  transactionOptions: [
    { value: 'vendita', label: 'Sale', iconKey: 'tag' },
    { value: 'affitto', label: 'Rental', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Short-term / vacation rental', iconKey: 'palmtree' },
  ],
  targetLanguages: targetLanguagesEn,
};
