/**
 * `/dashboard/hashtags` — AI hashtag generator
 */

export type HashtagsPageUi = {
  backToDashboard: string;
  heroTitle: string;
  heroSubtitle: string;
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
  strengthsLabel: string;
  strengthsPlaceholder: string;
  toneLabel: string;
  selectTone: string;
  marketLabel: string;
  selectMarket: string;
  generateIdle: string;
  generateLoading: string;
  emptyTitle: string;
  emptySubtitle: string;
  loadingTitle: string;
  loadingSubtitle: string;
  strategicTip: string;
  readyMixes: string;
  viralFocus: string;
  balanced: string;
  localFocus: string;
  copyAll: string;
  clickToCopy: string;
  usaMarketMsg: string;
  propertyTypeRequired: string;
  locationRequired: string;
  strengthsRequired: string;
  priceRequired: string;
  successTitle: string;
  successCached: string;
  successDesc: string;
  errorGeneric: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  tabVirali: string;
  tabNicchia: string;
  tabLocalSeo: string;
  tabUsa: string;
  tabViraliDesc: string;
  tabNicchiaDesc: string;
  tabLocalSeoDesc: string;
  tabUsaDesc: string;
  /** Card heading; placeholder `{count}` */
  hashtagTitleVirali: string;
  hashtagTitleNicchia: string;
  hashtagTitleLocalSeo: string;
  hashtagTitleUsa: string;
  /** Mix card title; placeholder `{label}` = A | B | C */
  mixTitleTemplate: string;
  toneProfessionale: string;
  toneEmozionale: string;
  toneLuxury: string;
  toneVirale: string;
  marketItaly: string;
  marketUsa: string;
};

export const hashtagsPageUiIt: HashtagsPageUi = {
  backToDashboard: 'Torna alla dashboard',
  heroTitle: 'Hashtag AI generator',
  heroSubtitle: 'Genera hashtag ottimizzati per massimizzare il reach dei tuoi post',
  heroBadge: 'Viral booster AI',
  formTitle: 'Dati immobile',
  formSubtitle: 'Inserisci le informazioni per generare hashtag personalizzati',
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  propertyTypeLabel: 'Tipo di immobile *',
  propertyTypePlaceholder: 'es. Attico con terrazzo',
  locationLabel: 'Località *',
  locationPlaceholder: 'es. Milano Centro',
  priceLabel: 'Prezzo *',
  pricePlaceholder: 'es. €450.000',
  strengthsLabel: 'Punti di forza *',
  strengthsPlaceholder: 'es. Vista panoramica, terrazzo 50mq, finiture di pregio...',
  toneLabel: 'Tono',
  selectTone: 'Seleziona tono',
  marketLabel: 'Mercato',
  selectMarket: 'Seleziona mercato',
  generateIdle: 'Genera 50+ hashtag',
  generateLoading: 'Generazione in corso...',
  emptyTitle: 'Nessun hashtag generato',
  emptySubtitle:
    'Compila il form con i dati dell’immobile e clicca «Genera» per creare oltre 50 hashtag ottimizzati.',
  loadingTitle: 'Generazione in corso...',
  loadingSubtitle: 'Stiamo creando hashtag ottimizzati per il tuo immobile',
  strategicTip: 'Consiglio strategico',
  readyMixes: 'Mix pronti all’uso',
  viralFocus: 'Focus virale',
  balanced: 'Equilibrato',
  localFocus: 'Focus locale',
  copyAll: 'Copia tutti',
  clickToCopy: 'Clicca per copiare tutti gli hashtag',
  usaMarketMsg: 'Seleziona «USA» come mercato per generare hashtag americani',
  propertyTypeRequired: 'Inserisci il tipo di immobile (min 3 caratteri)',
  locationRequired: 'Inserisci la località',
  strengthsRequired: 'Descrivi i punti di forza (min 10 caratteri)',
  priceRequired: 'Inserisci il prezzo',
  successTitle: 'Hashtag — set pronto',
  successCached: 'Risultato dalla cache (24h)',
  successDesc: 'Oltre 50 hashtag pronti per i tuoi post',
  errorGeneric: 'Errore nella generazione',
  copied: 'Copiato!',
  copiedDesc: 'Hashtag copiati negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  tabVirali: 'Virali',
  tabNicchia: 'Nicchia',
  tabLocalSeo: 'Local SEO',
  tabUsa: 'USA',
  tabViraliDesc: '15 hashtag ad alto reach',
  tabNicchiaDesc: '15 hashtag specifici',
  tabLocalSeoDesc: '10 hashtag locali',
  tabUsaDesc: '15 hashtag americani',
  hashtagTitleVirali: '{count} Hashtag virali',
  hashtagTitleNicchia: '{count} Hashtag di nicchia',
  hashtagTitleLocalSeo: '{count} Hashtag local SEO',
  hashtagTitleUsa: '{count} Hashtag USA',
  mixTitleTemplate: 'Mix {label}',
  toneProfessionale: 'Professionale',
  toneEmozionale: 'Emozionale',
  toneLuxury: 'Luxury',
  toneVirale: 'Virale',
  marketItaly: 'Italia',
  marketUsa: 'USA',
};

export const hashtagsPageUiEn: HashtagsPageUi = {
  backToDashboard: 'Back to dashboard',
  heroTitle: 'Hashtag AI generator',
  heroSubtitle: 'Generate optimized hashtags to maximize the reach of your posts',
  heroBadge: 'Viral booster AI',
  formTitle: 'Property data',
  formSubtitle: 'Enter information to generate personalized hashtags',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  propertyTypeLabel: 'Property type *',
  propertyTypePlaceholder: 'e.g. Penthouse with terrace',
  locationLabel: 'Location *',
  locationPlaceholder: 'e.g. Milan city center',
  priceLabel: 'Price *',
  pricePlaceholder: 'e.g. $450,000',
  strengthsLabel: 'Key strengths *',
  strengthsPlaceholder: 'e.g. Panoramic view, 50 sqm terrace, premium finishes...',
  toneLabel: 'Tone',
  selectTone: 'Select tone',
  marketLabel: 'Market',
  selectMarket: 'Select market',
  generateIdle: 'Generate 50+ hashtags',
  generateLoading: 'Generating...',
  emptyTitle: 'No hashtags generated',
  emptySubtitle:
    'Fill the form with property data and click “Generate” to create over 50 optimized hashtags.',
  loadingTitle: 'Generating...',
  loadingSubtitle: 'We are creating optimized hashtags for your property',
  strategicTip: 'Strategic tip',
  readyMixes: 'Ready-to-use mixes',
  viralFocus: 'Viral focus',
  balanced: 'Balanced',
  localFocus: 'Local focus',
  copyAll: 'Copy all',
  clickToCopy: 'Click to copy all hashtags',
  usaMarketMsg: 'Select “USA” as market to generate American hashtags',
  propertyTypeRequired: 'Enter property type (min 3 characters)',
  locationRequired: 'Enter the location',
  strengthsRequired: 'Describe key strengths (min 10 characters)',
  priceRequired: 'Enter the price',
  successTitle: 'Hashtags — set ready',
  successCached: 'Result from cache (24h)',
  successDesc: 'Over 50 hashtags ready for your posts',
  errorGeneric: 'Generation error',
  copied: 'Copied!',
  copiedDesc: 'Hashtags copied to clipboard',
  copyFailed: 'Unable to copy text',
  tabVirali: 'Viral',
  tabNicchia: 'Niche',
  tabLocalSeo: 'Local SEO',
  tabUsa: 'USA',
  tabViraliDesc: '15 high-reach hashtags',
  tabNicchiaDesc: '15 specific hashtags',
  tabLocalSeoDesc: '10 local hashtags',
  tabUsaDesc: '15 US hashtags',
  hashtagTitleVirali: '{count} viral hashtags',
  hashtagTitleNicchia: '{count} niche hashtags',
  hashtagTitleLocalSeo: '{count} local SEO hashtags',
  hashtagTitleUsa: '{count} US hashtags',
  mixTitleTemplate: 'Mix {label}',
  toneProfessionale: 'Professional',
  toneEmozionale: 'Emotional',
  toneLuxury: 'Luxury',
  toneVirale: 'Viral',
  marketItaly: 'Italy',
  marketUsa: 'USA',
};
