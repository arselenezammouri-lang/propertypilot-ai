/**
 * Copy for `/dashboard/auditor` — AI listing audit (structure, SEO, emotion, red flags).
 * API payload fields (mercato, obiettivo, tipoTransazione) stay Italian keys; UI is localized.
 */

export type ListingAuditorGoalKey = 'vendita' | 'seo' | 'luxury' | 'social';
export type ListingAuditorMarketKey = 'italia' | 'usa';
export type ListingAuditorTransactionKey = 'vendita' | 'affitto' | 'affitto_breve';

export type ListingAuditorPageUi = {
  copied: string;
  copiedDesc: string;
  copyError: string;
  minText: string;
  urlRequiredDesc: string;
  analysisError: string;
  communicationError: string;
  premiumRequired: string;
  premiumRequiredDesc: string;
  analysisDone: string;
  /** replace('{score}', String(score)) */
  analysisDoneDetail: string;
  qualityScore: string;
  connectionFailed: string;
  excellent: string;
  great: string;
  good: string;
  fair: string;
  passable: string;
  needsWork: string;
  back: string;
  backAria: string;
  heroSubtitle: string;
  auditPageTitle: string;
  paywallTitle: string;
  paywallDescription: string;
  analyzeListing: string;
  analyzeListingDesc: string;
  listingType: string;
  selectTransaction: string;
  market: string;
  goal: string;
  insertText: string;
  listingUrl: string;
  textareaPlaceholder: string;
  /** replace('{count}', String(textInput.length)) */
  charactersProgress: string;
  urlPlaceholder: string;
  urlSupportedHint: string;
  imageUrl: string;
  imagePlaceholder: string;
  analyzing: string;
  startAudit: string;
  expertBadge: string;
  tabText: string;
  tabUrl: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  suggestionHint: string;
  qualityScoreHeading: string;
  outOf100: string;
  breakdownStructure: string;
  breakdownSeo: string;
  breakdownEmotions: string;
  breakdownPersuasion: string;
  structuralAuditTitle: string;
  structuralSections: {
    titolo: string;
    apertura: string;
    corpo: string;
    callToAction: string;
  };
  problemsLabel: string;
  suggestionsLabel: string;
  seoAuditTitle: string;
  keywordsMissing: string;
  keywordsPresent: string;
  h1Optimization: string;
  readabilityIssues: string;
  recommendedMetaDescription: string;
  emotionalAuditTitle: string;
  /** replace('{score}', String(connessioneEmotiva)) */
  connectionScore: string;
  toneAnalysis: string;
  currentTone: string;
  idealTone: string;
  emotionalWeaknesses: string;
  missingSensations: string;
  narrativeOpportunities: string;
  redFlagsTitle: string;
  redFlagsDesc: string;
  gravita: { critica: string; alta: string; media: string };
  solutionLabel: string;
  impactIfUnresolved: string;
  aiSuggestionsTitle: string;
  /** Use before impattoPrevisto text from API */
  expectedImpactPrefix: string;
  optimizedVersionTitle: string;
  optimizedTitleLabel: string;
  descriptionLabel: string;
  highlightsLabel: string;
  callToActionLabel: string;
  metaDescriptionSeoLabel: string;
  targetBuyerTitle: string;
  marketAnalysisTitle: string;
  goals: Record<
    ListingAuditorGoalKey,
    { label: string; description: string }
  >;
  markets: Record<ListingAuditorMarketKey, { label: string; portali: string }>;
  transactionTypes: Record<
    ListingAuditorTransactionKey,
    { label: string; icon: string }
  >;
};

const it: ListingAuditorPageUi = {
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti',
  copyError: 'Impossibile copiare',
  minText: 'Inserisci almeno 50 caratteri di testo',
  urlRequiredDesc: "Inserisci l'URL dell'annuncio da analizzare",
  analysisError: "Errore durante l'analisi",
  communicationError:
    'Errore di comunicazione con il server. Riprova tra qualche secondo.',
  premiumRequired: 'Piano Premium richiesto',
  premiumRequiredDesc:
    "L'Audit immobiliare AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
  analysisDone: 'Analisi completata!',
  analysisDoneDetail: '{qualityScore}: {score}/100',
  qualityScore: 'Punteggio qualità',
  connectionFailed: 'Impossibile connettersi al server.',
  excellent: 'Eccellente',
  great: 'Ottimo',
  good: 'Buono',
  fair: 'Discreto',
  passable: 'Sufficiente',
  needsWork: 'Da migliorare',
  back: 'Dashboard',
  backAria: 'Torna alla dashboard',
  heroSubtitle:
    'Analisi professionale completa: struttura, SEO, emozioni, red flag e versione ottimizzata',
  auditPageTitle: 'Audit immobiliare AI',
  paywallTitle: 'Audit immobiliare AI',
  paywallDescription:
    "Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare l'audit completo.",
  analyzeListing: 'Analizza il tuo annuncio',
  analyzeListingDesc:
    "Incolla il testo o inserisci l'URL per ricevere un audit completo",
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  market: 'Mercato di riferimento',
  goal: 'Obiettivo principale',
  insertText: 'Inserisci testo',
  listingUrl: 'URL annuncio',
  textareaPlaceholder:
    "Incolla qui il testo completo dell'annuncio immobiliare (minimo 50 caratteri)…",
  charactersProgress: 'Caratteri: {count}/50 minimo',
  urlPlaceholder: 'https://www.immobiliare.it/annunci/…',
  urlSupportedHint:
    'Supportati: Immobiliare.it, Idealista.it, Casa.it, Subito.it, Zillow.com',
  imageUrl: 'URL immagine (opzionale)',
  imagePlaceholder: 'https://esempio.com/immagine.jpg',
  analyzing: 'Analisi in corso… (30-60 sec)',
  startAudit: 'Avvia audit completo',
  expertBadge: 'Expert',
  tabText: 'Inserisci testo',
  tabUrl: 'URL annuncio',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  suggestionHint: '💡',
  qualityScoreHeading: 'Punteggio qualità',
  outOf100: '/100',
  breakdownStructure: 'Struttura',
  breakdownSeo: 'SEO',
  breakdownEmotions: 'Emozioni',
  breakdownPersuasion: 'Persuasività',
  structuralAuditTitle: 'Audit strutturale',
  structuralSections: {
    titolo: '📌 Titolo',
    apertura: '🚀 Apertura',
    corpo: '📝 Corpo',
    callToAction: '🎯 Call to action',
  },
  problemsLabel: 'Problemi:',
  suggestionsLabel: 'Suggerimenti:',
  seoAuditTitle: 'Audit SEO',
  keywordsMissing: 'Keywords mancanti',
  keywordsPresent: 'Keywords presenti',
  h1Optimization: 'Ottimizzazione H1',
  readabilityIssues: 'Problemi di leggibilità',
  recommendedMetaDescription: 'Meta description consigliata',
  emotionalAuditTitle: 'Audit emozioni',
  connectionScore: 'Connessione: {score}/100',
  toneAnalysis: 'Analisi del tono',
  currentTone: 'Tono attuale:',
  idealTone: 'Tono ideale:',
  emotionalWeaknesses: 'Punti deboli emotivi',
  missingSensations: 'Sensazioni mancanti',
  narrativeOpportunities: '✨ Opportunità narrative',
  redFlagsTitle: '🚨 Interventi critici (red flag)',
  redFlagsDesc: 'Problemi urgenti da risolvere prima di pubblicare',
  gravita: { critica: 'Critica', alta: 'Alta', media: 'Media' },
  solutionLabel: '✅ Soluzione:',
  impactIfUnresolved: '⚠️ Impatto se non risolto:',
  aiSuggestionsTitle: 'Suggerimenti AI strategici',
  expectedImpactPrefix: '📈 Impatto previsto:',
  optimizedVersionTitle: 'Versione ottimizzata (mini Perfect Copy)',
  optimizedTitleLabel: 'Titolo ottimizzato',
  descriptionLabel: 'Descrizione',
  highlightsLabel: 'Highlights',
  callToActionLabel: 'Call to action',
  metaDescriptionSeoLabel: 'Meta description SEO',
  targetBuyerTitle: 'Target acquirente',
  marketAnalysisTitle: 'Analisi di mercato',
  goals: {
    vendita: { label: 'Vendita', description: 'Massimizza conversioni' },
    seo: { label: 'SEO', description: 'Visibilità portali' },
    luxury: { label: 'Luxury', description: 'Target alto spendente' },
    social: { label: 'Social', description: 'Engagement social' },
  },
  markets: {
    italia: { label: '🇮🇹 Italia', portali: 'Immobiliare, Idealista, Casa, Subito' },
    usa: { label: '🇺🇸 USA', portali: 'Zillow, Realtor, Redfin, Trulia' },
  },
  transactionTypes: {
    vendita: { label: 'Vendita', icon: '🏷️' },
    affitto: { label: 'Affitto', icon: '🔑' },
    affitto_breve: { label: 'Affitto breve / turistico', icon: '🏖️' },
  },
};

const en: ListingAuditorPageUi = {
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard',
  copyError: 'Unable to copy',
  minText: 'Enter at least 50 characters of text',
  urlRequiredDesc: 'Enter the listing URL to analyze',
  analysisError: 'Error during analysis',
  communicationError:
    'Communication error with the server. Please try again in a few seconds.',
  premiumRequired: 'Premium plan required',
  premiumRequiredDesc:
    'AI Real Estate Audit is a Premium feature. Upgrade your account to the PRO or AGENCY plan.',
  analysisDone: 'Analysis completed!',
  analysisDoneDetail: '{qualityScore}: {score}/100',
  qualityScore: 'Quality score',
  connectionFailed: 'Unable to connect to the server.',
  excellent: 'Excellent',
  great: 'Great',
  good: 'Good',
  fair: 'Fair',
  passable: 'Passable',
  needsWork: 'Needs improvement',
  back: 'Dashboard',
  backAria: 'Back to dashboard',
  heroSubtitle:
    'Complete professional analysis: structure, SEO, emotions, red flags, and optimized copy',
  auditPageTitle: 'AI Real Estate Audit',
  paywallTitle: 'AI Real Estate Audit',
  paywallDescription:
    'This feature is only available for PRO and AGENCY users. Upgrade your account to unlock the full audit.',
  analyzeListing: 'Analyze your listing',
  analyzeListingDesc: 'Paste the text or enter the URL to receive a full audit',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  market: 'Target market',
  goal: 'Primary goal',
  insertText: 'Paste text',
  listingUrl: 'Listing URL',
  textareaPlaceholder:
    'Paste the full property listing text here (minimum 50 characters)…',
  charactersProgress: 'Characters: {count}/50 minimum',
  urlPlaceholder: 'https://www.immobiliare.it/annunci/…',
  urlSupportedHint:
    'Supported: Immobiliare.it, Idealista.it, Casa.it, Subito.it, Zillow.com',
  imageUrl: 'Image URL (optional)',
  imagePlaceholder: 'https://example.com/image.jpg',
  analyzing: 'Analyzing… (30–60 sec)',
  startAudit: 'Start full audit',
  expertBadge: 'Expert',
  tabText: 'Paste text',
  tabUrl: 'Listing URL',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  suggestionHint: '💡',
  qualityScoreHeading: 'Quality score',
  outOf100: '/100',
  breakdownStructure: 'Structure',
  breakdownSeo: 'SEO',
  breakdownEmotions: 'Emotion',
  breakdownPersuasion: 'Persuasion',
  structuralAuditTitle: 'Structural audit',
  structuralSections: {
    titolo: '📌 Title',
    apertura: '🚀 Opening',
    corpo: '📝 Body',
    callToAction: '🎯 Call to action',
  },
  problemsLabel: 'Issues:',
  suggestionsLabel: 'Suggestions:',
  seoAuditTitle: 'SEO audit',
  keywordsMissing: 'Missing keywords',
  keywordsPresent: 'Present keywords',
  h1Optimization: 'H1 optimization',
  readabilityIssues: 'Readability issues',
  recommendedMetaDescription: 'Recommended meta description',
  emotionalAuditTitle: 'Emotional audit',
  connectionScore: 'Connection: {score}/100',
  toneAnalysis: 'Tone analysis',
  currentTone: 'Current tone:',
  idealTone: 'Ideal tone:',
  emotionalWeaknesses: 'Emotional weaknesses',
  missingSensations: 'Missing sensations',
  narrativeOpportunities: '✨ Narrative opportunities',
  redFlagsTitle: '🚨 Critical fixes (red flags)',
  redFlagsDesc: 'Urgent issues to fix before publishing',
  gravita: { critica: 'Critical', alta: 'High', media: 'Medium' },
  solutionLabel: '✅ Fix:',
  impactIfUnresolved: '⚠️ Impact if ignored:',
  aiSuggestionsTitle: 'Strategic AI suggestions',
  expectedImpactPrefix: '📈 Expected impact:',
  optimizedVersionTitle: 'Optimized version (mini Perfect Copy)',
  optimizedTitleLabel: 'Optimized title',
  descriptionLabel: 'Description',
  highlightsLabel: 'Highlights',
  callToActionLabel: 'Call to action',
  metaDescriptionSeoLabel: 'SEO meta description',
  targetBuyerTitle: 'Target buyer',
  marketAnalysisTitle: 'Market analysis',
  goals: {
    vendita: { label: 'Sales', description: 'Maximize conversions' },
    seo: { label: 'SEO', description: 'Portal visibility' },
    luxury: { label: 'Luxury', description: 'High-spending audience' },
    social: { label: 'Social', description: 'Social engagement' },
  },
  markets: {
    italia: { label: '🇮🇹 Italy', portali: 'Immobiliare, Idealista, Casa, Subito' },
    usa: { label: '🇺🇸 USA', portali: 'Zillow, Realtor, Redfin, Trulia' },
  },
  transactionTypes: {
    vendita: { label: 'Sale', icon: '🏷️' },
    affitto: { label: 'Rent', icon: '🔑' },
    affitto_breve: { label: 'Short-term / vacation rental', icon: '🏖️' },
  },
};

export const listingAuditorPageUiIt = it;
export const listingAuditorPageUiEn = en;
