/** Copy for `/dashboard/scraper` — AI listing import + comprehensive generation. IT + EN. */

export type ListingScraperPageUi = {
  pageTitle: string;
  pageDesc: string;
  urlCardTitle: string;
  urlCardDesc: string;
  urlInputPlaceholder: string;
  analyzing: string;
  analyzeBtn: string;
  aiLoading: string;
  aiLoadingDesc: string;
  scrapedTitle: string;
  surface: string;
  rooms: string;
  originalDesc: string;
  features: string;
  /** replace('{n}', String(n)) */
  moreFeatures: string;
  aiGeneratedTitle: string;
  saving: string;
  saveToLibrary: string;
  professionalTitle: string;
  professionalDesc: string;
  shortTitle: string;
  shortDesc: string;
  emotionalTitle: string;
  emotionalDesc: string;
  titlesTitle: string;
  titlesDesc: string;
  videoScriptTitle: string;
  videoScriptDesc: string;
  emailTitle: string;
  emailDesc: string;
  strengthsTitle: string;
  weaknessesTitle: string;
  stagingTitle: string;
  portalTitle: string;
  portalDesc: string;
  urlRequiredDesc: string;
  scrapeError: string;
  scrapeSuccess: string;
  scrapeSuccessDesc: string;
  aiGenerationError: string;
  aiSuccess: string;
  aiSuccessDesc: string;
  noDataDesc: string;
  unnamedListing: string;
  saveError: string;
  saved: string;
  savedDesc: string;
  /** Appended before server suggestion in error toast: "{base}\\n\\n{hint} {suggestion}" */
  suggestionHint: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  backAria: string;
  backLink: string;
};

const it: ListingScraperPageUi = {
  pageTitle: 'Analisi annuncio AI',
  pageDesc:
    'Importa annunci da portali immobiliari e genera contenuti professionali con AI',
  urlCardTitle: 'URL annuncio',
  urlCardDesc:
    'Supportati: Immobiliare.it, Idealista.it, Casa.it, Subito.it',
  urlInputPlaceholder: 'https://www.immobiliare.it/annunci/12345…',
  analyzing: 'Analisi…',
  analyzeBtn: 'Analizza annuncio',
  aiLoading: 'Generazione contenuti AI in corso…',
  aiLoadingDesc:
    'Stiamo creando descrizioni, titoli, email, video script e molto altro.',
  scrapedTitle: 'Dati estratti',
  surface: 'Superficie',
  rooms: 'Locali',
  originalDesc: 'Descrizione originale',
  features: 'Caratteristiche',
  moreFeatures: '+{n} altre',
  aiGeneratedTitle: 'Contenuti AI generati',
  saving: 'Salvataggio…',
  saveToLibrary: 'Salva nella libreria',
  professionalTitle: 'Descrizione professionale',
  professionalDesc: '150-200 parole, SEO ottimizzato',
  shortTitle: 'Descrizione breve',
  shortDesc: 'Max 50 parole per portali',
  emotionalTitle: 'Descrizione emozionale',
  emotionalDesc: 'Storytelling e lifestyle',
  titlesTitle: 'Titoli accattivanti',
  titlesDesc: '5 varianti SEO-friendly',
  videoScriptTitle: 'Script video (Reels/TikTok)',
  videoScriptDesc: '30-45 secondi per social media',
  emailTitle: 'Email follow-up',
  emailDesc: 'Template per potenziali acquirenti',
  strengthsTitle: 'Punti di forza',
  weaknessesTitle: 'Punti di debolezza',
  stagingTitle: 'Suggerimenti home staging',
  portalTitle: 'Descrizione per portali',
  portalDesc: 'Ottimizzata per Immobiliare.it, Idealista',
  urlRequiredDesc: "Inserisci l'URL di un annuncio immobiliare.",
  scrapeError: 'Errore durante lo scraping',
  scrapeSuccess: 'Scraping completato!',
  scrapeSuccessDesc:
    'Dati estratti con successo. Generazione contenuti AI in corso…',
  aiGenerationError: 'Errore durante la generazione AI',
  aiSuccess: 'Contenuti AI generati!',
  aiSuccessDesc: 'Tutti i contenuti sono stati creati con successo.',
  noDataDesc: 'Genera prima i contenuti AI.',
  unnamedListing: 'Annuncio senza titolo',
  saveError: 'Errore durante il salvataggio',
  saved: 'Salvato!',
  savedDesc: "L'annuncio è stato salvato nella tua libreria.",
  suggestionHint: '💡',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  backAria: 'Torna alla dashboard',
  backLink: 'Dashboard',
};

const en: ListingScraperPageUi = {
  pageTitle: 'AI listing analysis',
  pageDesc:
    'Import listings from real estate portals and generate professional content with AI',
  urlCardTitle: 'Listing URL',
  urlCardDesc: 'Supported: Immobiliare.it, Idealista.it, Casa.it, Subito.it',
  urlInputPlaceholder: 'https://www.immobiliare.it/annunci/12345…',
  analyzing: 'Analyzing…',
  analyzeBtn: 'Analyze listing',
  aiLoading: 'Generating AI content…',
  aiLoadingDesc:
    "We're creating descriptions, titles, emails, video scripts, and much more.",
  scrapedTitle: 'Extracted data',
  surface: 'Surface',
  rooms: 'Rooms',
  originalDesc: 'Original description',
  features: 'Features',
  moreFeatures: '+{n} more',
  aiGeneratedTitle: 'Generated AI content',
  saving: 'Saving…',
  saveToLibrary: 'Save to library',
  professionalTitle: 'Professional description',
  professionalDesc: '150-200 words, SEO optimized',
  shortTitle: 'Short description',
  shortDesc: 'Max 50 words for portals',
  emotionalTitle: 'Emotional description',
  emotionalDesc: 'Storytelling and lifestyle',
  titlesTitle: 'Catchy titles',
  titlesDesc: '5 SEO-friendly variants',
  videoScriptTitle: 'Video script (Reels/TikTok)',
  videoScriptDesc: '30-45 seconds for social media',
  emailTitle: 'Follow-up email',
  emailDesc: 'Template for potential buyers',
  strengthsTitle: 'Strengths',
  weaknessesTitle: 'Weaknesses',
  stagingTitle: 'Home staging tips',
  portalTitle: 'Portal description',
  portalDesc: 'Optimized for Immobiliare.it, Idealista',
  urlRequiredDesc: 'Enter the URL of a real estate listing.',
  scrapeError: 'Scraping error',
  scrapeSuccess: 'Scraping complete!',
  scrapeSuccessDesc: 'Data extracted successfully. Generating AI content…',
  aiGenerationError: 'AI generation error',
  aiSuccess: 'AI content generated!',
  aiSuccessDesc: 'All content has been created successfully.',
  noDataDesc: 'Generate AI content first.',
  unnamedListing: 'Untitled listing',
  saveError: 'Save error',
  saved: 'Saved!',
  savedDesc: 'The listing has been saved to your library.',
  suggestionHint: '💡',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  backAria: 'Back to dashboard',
  backLink: 'Dashboard',
};

export const listingScraperPageUiIt = it;
export const listingScraperPageUiEn = en;
