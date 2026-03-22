/** `/dashboard/video-scripts` */

export type VideoScriptTabId =
  | 'script15s'
  | 'script30s'
  | 'script60s'
  | 'scriptLuxury'
  | 'hooksVirali';

export type VideoScriptsTargetBuyer = 'famiglie' | 'investitori' | 'luxury' | 'studenti';
export type VideoScriptsTone = 'professionale' | 'energico' | 'luxury' | 'emozionale';

export type VideoScriptsPageUi = {
  backToDashboard: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  formTitle: string;
  formSubtitle: string;
  typeLabel: string;
  typePlaceholder: string;
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
  filmingTip: string;
  scriptLabel: string;
  sceneLabel: string;
  scenesLabel: string;
  hookLabel: string;
  ctaLabel: string;
  hashtagsLabel: string;
  copyScript: string;
  copyAll: string;
  viralHooksTitle: string;
  openingsLabel: string;
  hooksDesc: string;
  typeRequired: string;
  locationRequired: string;
  priceRequired: string;
  featuresRequired: string;
  strengthsRequired: string;
  errorGeneric: string;
  successTitle: string;
  successCached: string;
  successDesc: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  /** Full export title line; `{duration}` */
  copyExportTitle: string;
  copyExportHook: string;
  copyExportScenes: string;
  copyExportCta: string;
  copyExportHashtags: string;
  /**
   * One scene block. Placeholders: `{timestamp}`, `{num}`, `{testo}`, `{visive}`
   * Use `{scene}` for localized "Scene" word in header part if needed — we use sceneLabel + num separately in template:
   * "[{timestamp}] {sceneLabel} {num}\n{textPrefix}: {testo}\n{visualPrefix}: {visive}"
   */
  copySceneBlock: string;
  sceneWord: string;
  copyTextPrefix: string;
  copyVisualPrefix: string;
  scriptTabs: Array<{
    id: VideoScriptTabId;
    label: string;
    description: string;
  }>;
  targetBuyerOptions: Array<{ value: VideoScriptsTargetBuyer; label: string }>;
  toneOptions: Array<{ value: VideoScriptsTone; label: string }>;
};

export const videoScriptsPageUiIt: VideoScriptsPageUi = {
  backToDashboard: 'Torna alla dashboard',
  heroTitle: 'Video Script AI',
  heroSubtitle: 'Genera script professionali per i tuoi video immobiliari',
  heroBadge: 'Video Creator AI',
  formTitle: 'Dati immobile',
  formSubtitle: 'Inserisci le informazioni per generare script video personalizzati',
  typeLabel: 'Tipo di immobile *',
  typePlaceholder: 'es. Attico con terrazzo panoramico',
  locationLabel: 'Località *',
  locationPlaceholder: 'es. Milano Centro',
  priceLabel: 'Prezzo *',
  pricePlaceholder: 'es. €450.000',
  featuresLabel: 'Caratteristiche principali *',
  featuresPlaceholder:
    'es. 3 camere, 2 bagni, terrazzo 50 mq, vista Duomo, ascensore...',
  strengthsLabel: 'Punti di forza *',
  strengthsPlaceholder:
    'es. Posizione esclusiva, finiture di pregio, luminosità eccezionale...',
  targetLabel: 'Target buyer',
  selectTarget: 'Seleziona target',
  toneLabel: 'Tono video',
  selectTone: 'Seleziona tono',
  generateIdle: 'Genera 5 script video',
  generateLoading: 'Generazione in corso...',
  emptyTitle: 'Nessuno script generato',
  emptySubtitle:
    'Compila il form e clicca «Genera» per creare script video con timestamp e indicazioni visive.',
  loadingTitle: 'Generazione in corso...',
  loadingSubtitle: 'Stiamo creando 5 script video personalizzati',
  filmingTip: 'Consiglio per le riprese',
  scriptLabel: 'Script',
  sceneLabel: 'Scena',
  scenesLabel: 'Scene',
  hookLabel: 'Hook iniziale',
  ctaLabel: 'Call to action',
  hashtagsLabel: 'Hashtag consigliati',
  copyScript: 'Copia script',
  copyAll: 'Copia tutti',
  viralHooksTitle: '5 hook virali',
  openingsLabel: 'Aperture video',
  hooksDesc:
    "Frasi d'apertura testate per massimizzare engagement e watch time",
  typeRequired: 'Inserisci il tipo di immobile (min 5 caratteri)',
  locationRequired: 'Inserisci la località',
  priceRequired: 'Inserisci il prezzo',
  featuresRequired: 'Descrivi le caratteristiche (min 10 caratteri)',
  strengthsRequired: 'Descrivi i punti di forza (min 10 caratteri)',
  errorGeneric: 'Errore nella generazione',
  successTitle: 'Script generati con successo!',
  successCached: 'Risultato dalla cache (24h)',
  successDesc: '5 script video pronti per le riprese',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  copyExportTitle: 'VIDEO SCRIPT — {duration}',
  copyExportHook: 'HOOK',
  copyExportScenes: 'SCENE',
  copyExportCta: 'CTA',
  copyExportHashtags: 'HASHTAG',
  copySceneBlock:
    '[{timestamp}] {sceneWord} {num}\n{textPrefix}: {testo}\n{visualPrefix}: {visive}',
  sceneWord: 'Scena',
  copyTextPrefix: 'Testo',
  copyVisualPrefix: 'Indicazioni visive',
  scriptTabs: [
    {
      id: 'script15s',
      label: '15 secondi',
      description: 'TikTok / Reels',
    },
    {
      id: 'script30s',
      label: '30 secondi',
      description: 'Reels / Shorts',
    },
    {
      id: 'script60s',
      label: '60 secondi',
      description: 'Tour completo',
    },
    {
      id: 'scriptLuxury',
      label: 'Luxury',
      description: 'Cinematografico',
    },
    {
      id: 'hooksVirali',
      label: 'Hook',
      description: '5 aperture',
    },
  ],
  targetBuyerOptions: [
    { value: 'famiglie', label: 'Famiglie' },
    { value: 'investitori', label: 'Investitori' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'studenti', label: 'Studenti' },
  ],
  toneOptions: [
    { value: 'professionale', label: 'Professionale' },
    { value: 'energico', label: 'Energico' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'emozionale', label: 'Emozionale' },
  ],
};

export const videoScriptsPageUiEn: VideoScriptsPageUi = {
  backToDashboard: 'Back to dashboard',
  heroTitle: 'Video Script AI',
  heroSubtitle: 'Generate professional scripts for your real estate videos',
  heroBadge: 'Video Creator AI',
  formTitle: 'Property data',
  formSubtitle: 'Enter details to generate personalized video scripts',
  typeLabel: 'Property type *',
  typePlaceholder: 'e.g. Penthouse with panoramic terrace',
  locationLabel: 'Location *',
  locationPlaceholder: 'e.g. Downtown Miami',
  priceLabel: 'Price *',
  pricePlaceholder: 'e.g. $450,000',
  featuresLabel: 'Main features *',
  featuresPlaceholder:
    'e.g. 3 beds, 2 baths, 50 sqm terrace, skyline view, elevator...',
  strengthsLabel: 'Key strengths *',
  strengthsPlaceholder:
    'e.g. Exclusive location, premium finishes, exceptional light...',
  targetLabel: 'Target buyer',
  selectTarget: 'Select target',
  toneLabel: 'Video tone',
  selectTone: 'Select tone',
  generateIdle: 'Generate 5 video scripts',
  generateLoading: 'Generating...',
  emptyTitle: 'No script yet',
  emptySubtitle:
    'Fill in the form and click Generate to create scripts with timestamps and visual cues.',
  loadingTitle: 'Generating...',
  loadingSubtitle: 'We are creating 5 personalized video scripts',
  filmingTip: 'Filming tip',
  scriptLabel: 'Script',
  sceneLabel: 'Scene',
  scenesLabel: 'Scenes',
  hookLabel: 'Opening hook',
  ctaLabel: 'Call to action',
  hashtagsLabel: 'Suggested hashtags',
  copyScript: 'Copy script',
  copyAll: 'Copy all',
  viralHooksTitle: '5 viral hooks',
  openingsLabel: 'Video openings',
  hooksDesc: 'Tested opening lines to maximize engagement and watch time',
  typeRequired: 'Enter property type (min 5 characters)',
  locationRequired: 'Enter the location',
  priceRequired: 'Enter the price',
  featuresRequired: 'Describe features (min 10 characters)',
  strengthsRequired: 'Describe key strengths (min 10 characters)',
  errorGeneric: 'Generation error',
  successTitle: 'Scripts generated successfully!',
  successCached: 'Result from cache (24h)',
  successDesc: '5 video scripts ready to film',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard',
  copyFailed: 'Unable to copy text',
  copyExportTitle: 'VIDEO SCRIPT — {duration}',
  copyExportHook: 'HOOK',
  copyExportScenes: 'SCENES',
  copyExportCta: 'CTA',
  copyExportHashtags: 'HASHTAGS',
  copySceneBlock:
    '[{timestamp}] {sceneWord} {num}\n{textPrefix}: {testo}\n{visualPrefix}: {visive}',
  sceneWord: 'Scene',
  copyTextPrefix: 'Script',
  copyVisualPrefix: 'Visual cues',
  scriptTabs: [
    { id: 'script15s', label: '15 seconds', description: 'TikTok / Reels' },
    { id: 'script30s', label: '30 seconds', description: 'Reels / Shorts' },
    { id: 'script60s', label: '60 seconds', description: 'Full tour' },
    {
      id: 'scriptLuxury',
      label: 'Luxury',
      description: 'Cinematic',
    },
    { id: 'hooksVirali', label: 'Hooks', description: '5 openings' },
  ],
  targetBuyerOptions: [
    { value: 'famiglie', label: 'Families' },
    { value: 'investitori', label: 'Investors' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'studenti', label: 'Students' },
  ],
  toneOptions: [
    { value: 'professionale', label: 'Professional' },
    { value: 'energico', label: 'Energetic' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'emozionale', label: 'Emotional' },
  ],
};
