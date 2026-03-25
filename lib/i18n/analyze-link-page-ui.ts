/** Copy for `/dashboard/analyze` — link listing analysis. IT + EN. */

export type AnalyzeLinkPageUi = {
  pasteUrl: string;
  analysisError: string;
  analysisDone: string;
  fromCache: string;
  newAnalysis: string;
  error: string;
  copied: string;
  /** replace('{label}', label) */
  copiedToClipboard: string;
  copyFailed: string;
  backAria: string;
  backLink: string;
  headerSubtitle: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroTitleTail: string;
  heroSubtitle: string;
  urlPlaceholder: string;
  analyzing: string;
  analyze: string;
  qualityScore: string;
  seoScore: string;
  outOf100: string;
  idealBuyer: string;
  extractedData: string;
  title: string;
  price: string;
  location: string;
  surface: string;
  rooms: string;
  type: string;
  notAvailable: string;
  analysis: string;
  improvements: string;
  rewrite: string;
  strengths: string;
  weaknesses: string;
  seoAnalysis: string;
  detectedKeywords: string;
  seoSuggestions: string;
  improvementSuggestions: string;
  professionalListing: string;
  shortVersion: string;
  catchyTitles: string;
  copy: string;
  copyProfessionalSnippetLabel: string;
  copyShortSnippetLabel: string;
  /** replace('{n}', String(1-based index)) */
  copyTitleSnippetLabel: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  badgeImmobiliare: string;
  badgeIdealista: string;
  badgeCasa: string;
  badgeSubito: string;
  badgeZillow: string;
};

const it: AnalyzeLinkPageUi = {
  pasteUrl: "Incolla il link dell'annuncio da analizzare",
  analysisError: "Errore durante l'analisi",
  analysisDone: 'Analisi completata!',
  fromCache: 'Risultati dalla cache',
  newAnalysis: 'Nuova analisi generata',
  error: 'Errore',
  copied: 'Copiato!',
  copiedToClipboard: '{label} copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  backAria: 'Torna alla dashboard',
  backLink: 'Dashboard',
  headerSubtitle: 'Analisi automatica',
  heroTitleLead: 'Analisi',
  heroTitleAccent: 'automatica',
  heroTitleTail: 'da link',
  heroSubtitle:
    'Incolla un link e ottieni analisi, suggerimenti e riscrittura AI in secondi',
  urlPlaceholder:
    "Incolla qui il link dell'annuncio (Immobiliare.it, Idealista, Casa.it, Subito.it, Zillow)",
  analyzing: 'Analizzo…',
  analyze: 'Analizza',
  qualityScore: 'Punteggio qualità',
  seoScore: 'Punteggio SEO',
  outOf100: 'su 100',
  idealBuyer: 'Buyer ideale',
  extractedData: 'Dati estratti',
  title: 'Titolo',
  price: 'Prezzo',
  location: 'Località',
  surface: 'Superficie',
  rooms: 'Locali',
  type: 'Tipo',
  notAvailable: 'N/D',
  analysis: 'Analisi',
  improvements: 'Miglioramenti',
  rewrite: 'Riscrittura AI',
  strengths: 'Punti di forza',
  weaknesses: 'Punti deboli',
  seoAnalysis: 'Analisi SEO',
  detectedKeywords: 'Keywords rilevate:',
  seoSuggestions: 'Suggerimenti SEO:',
  improvementSuggestions: 'Suggerimenti di miglioramento',
  professionalListing: 'Annuncio professionale (riscritto)',
  shortVersion: 'Versione breve (max 50 parole)',
  catchyTitles: '5 titoli accattivanti',
  copy: 'Copia',
  copyProfessionalSnippetLabel: 'Annuncio professionale',
  copyShortSnippetLabel: 'Versione breve',
  copyTitleSnippetLabel: 'Titolo {n}',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  badgeImmobiliare: 'Immobiliare.it',
  badgeIdealista: 'Idealista.it',
  badgeCasa: 'Casa.it',
  badgeSubito: 'Subito.it',
  badgeZillow: 'Zillow.com (USA)',
};

const en: AnalyzeLinkPageUi = {
  pasteUrl: 'Paste the listing URL to analyze',
  analysisError: 'Error during analysis',
  analysisDone: 'Analysis completed!',
  fromCache: 'Results from cache',
  newAnalysis: 'New analysis generated',
  error: 'Error',
  copied: 'Copied!',
  copiedToClipboard: '{label} copied to clipboard',
  copyFailed: 'Unable to copy text',
  backAria: 'Back to dashboard',
  backLink: 'Dashboard',
  headerSubtitle: 'Automatic analysis',
  heroTitleLead: 'Automatic',
  heroTitleAccent: 'link analysis',
  heroTitleTail: '',
  heroSubtitle:
    'Paste a link and get analysis, suggestions, and AI rewriting in seconds',
  urlPlaceholder:
    'Paste the listing URL here (Immobiliare.it, Idealista, Casa.it, Subito.it, Zillow)',
  analyzing: 'Analyzing…',
  analyze: 'Analyze',
  qualityScore: 'Quality score',
  seoScore: 'SEO score',
  outOf100: 'out of 100',
  idealBuyer: 'Ideal buyer',
  extractedData: 'Extracted data',
  title: 'Title',
  price: 'Price',
  location: 'Location',
  surface: 'Area',
  rooms: 'Rooms',
  type: 'Type',
  notAvailable: 'N/A',
  analysis: 'Analysis',
  improvements: 'Improvements',
  rewrite: 'AI rewrite',
  strengths: 'Strengths',
  weaknesses: 'Weaknesses',
  seoAnalysis: 'SEO analysis',
  detectedKeywords: 'Detected keywords:',
  seoSuggestions: 'SEO suggestions:',
  improvementSuggestions: 'Improvement suggestions',
  professionalListing: 'Professional listing (rewritten)',
  shortVersion: 'Short version (max 50 words)',
  catchyTitles: '5 catchy titles',
  copy: 'Copy',
  copyProfessionalSnippetLabel: 'Professional listing',
  copyShortSnippetLabel: 'Short version',
  copyTitleSnippetLabel: 'Title {n}',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  badgeImmobiliare: 'Immobiliare.it',
  badgeIdealista: 'Idealista.it',
  badgeCasa: 'Casa.it',
  badgeSubito: 'Subito.it',
  badgeZillow: 'Zillow.com (USA)',
};

export const analyzeLinkPageUiIt = it;
export const analyzeLinkPageUiEn = en;
