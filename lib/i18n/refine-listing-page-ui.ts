/**
 * `/dashboard/refine-listing` — Perfect Again AI
 */

export type RefineListingTxIconKey = 'tag' | 'keyRound' | 'palmtree';
export type RefineListingToneIconKey = 'briefcase' | 'heart' | 'crown' | 'search';

export type RefineListingPageUi = {
  textTooShortDesc: string;
  propertyTypeRequired: string;
  locationRequired: string;
  refineError: string;
  successTitle: string;
  cacheResult: string;
  ready4: string;
  copied: string;
  copiedDesc: string;
  copyFailed: string;
  back: string;
  heroBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  listingToImprove: string;
  listingToImproveDesc: string;
  listingType: string;
  selectTransaction: string;
  originalText: string;
  originalPlaceholder: string;
  chars: string;
  propertyType: string;
  propertyTypePlaceholder: string;
  location: string;
  locationPlaceholder: string;
  preferredTone: string;
  selectTone: string;
  refining: string;
  refineButton: string;
  noResult: string;
  noResultDesc: string;
  version: string;
  copyAll: string;
  improvedTitle: string;
  improvedDesc: string;
  highlights5: string;
  ctaImproved: string;
  metaSeo: string;
  originalAnalysis: string;
  highlightsHeading: string;
  ctaHeading: string;
  metaHeading: string;
  transactionOptions: Array<{ value: string; label: string; iconKey: RefineListingTxIconKey }>;
  refineTabs: Array<{
    id: 'professional' | 'emotional' | 'luxury' | 'seo';
    label: string;
    description: string;
  }>;
  toneSelectItems: Array<{
    value: 'professional' | 'emotional' | 'luxury' | 'seo';
    label: string;
    iconKey: RefineListingToneIconKey;
  }>;
};

export const refineListingPageUiIt: RefineListingPageUi = {
  textTooShortDesc: "L'annuncio originale deve avere almeno 50 caratteri",
  propertyTypeRequired: 'Inserisci il tipo di immobile',
  locationRequired: 'Inserisci la località',
  refineError: 'Errore nel raffinamento',
  successTitle: 'Perfect Again — pronto',
  cacheResult: 'Risultato dalla cache (24h)',
  ready4: '4 versioni migliorate pronte all’uso',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  back: 'Torna alla dashboard',
  heroBadge: 'Perfect Again AI',
  pageTitle: 'Perfect Again AI',
  pageSubtitle: 'Raffina e migliora completamente i tuoi annunci esistenti',
  listingToImprove: 'Annuncio da migliorare',
  listingToImproveDesc: "Incolla il tuo annuncio esistente e lascia che l'AI lo perfezioni",
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  originalText: 'Testo annuncio originale *',
  originalPlaceholder:
    'Incolla qui il tuo annuncio esistente che vuoi migliorare... (min 50 caratteri)',
  chars: 'caratteri',
  propertyType: 'Tipo immobile *',
  propertyTypePlaceholder: 'es. Appartamento',
  location: 'Località *',
  locationPlaceholder: 'es. Milano Centro',
  preferredTone: 'Tono preferito',
  selectTone: 'Seleziona tono',
  refining: 'Raffinamento in corso...',
  refineButton: 'Perfeziona annuncio',
  noResult: 'Nessun annuncio raffinato',
  noResultDesc:
    'Incolla il tuo annuncio esistente e clicca «Perfeziona» per generare 4 versioni migliorate: Professional, Emotional, Luxury e SEO.',
  version: 'Versione',
  copyAll: 'Copia tutto',
  improvedTitle: 'Titolo migliorato',
  improvedDesc: 'Descrizione migliorata',
  highlights5: '5 highlights',
  ctaImproved: 'CTA migliorata',
  metaSeo: 'Meta description SEO',
  originalAnalysis: 'Analisi annuncio originale',
  highlightsHeading: 'HIGHLIGHTS:',
  ctaHeading: 'CTA:',
  metaHeading: 'META DESCRIPTION:',
  transactionOptions: [
    { value: 'vendita', label: 'Vendita', iconKey: 'tag' },
    { value: 'affitto', label: 'Affitto', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Affitto breve / turistico', iconKey: 'palmtree' },
  ],
  refineTabs: [
    {
      id: 'professional',
      label: 'Professional',
      description: 'Autorevole e credibile',
    },
    {
      id: 'emotional',
      label: 'Emotional',
      description: 'Coinvolgente ed evocativo',
    },
    {
      id: 'luxury',
      label: 'Luxury',
      description: 'Esclusivo e raffinato',
    },
    {
      id: 'seo',
      label: 'SEO Boosted',
      description: 'Ottimizzato per Google',
    },
  ],
  toneSelectItems: [
    { value: 'professional', label: 'Professional', iconKey: 'briefcase' },
    { value: 'emotional', label: 'Emotional', iconKey: 'heart' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
    { value: 'seo', label: 'SEO Boosted', iconKey: 'search' },
  ],
};

export const refineListingPageUiEn: RefineListingPageUi = {
  textTooShortDesc: 'The original listing must be at least 50 characters',
  propertyTypeRequired: 'Enter the property type',
  locationRequired: 'Enter the location',
  refineError: 'Refinement error',
  successTitle: 'Perfect Again — ready',
  cacheResult: 'Result from cache (24h)',
  ready4: '4 improved versions ready to use',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard',
  copyFailed: 'Unable to copy text',
  back: 'Back to dashboard',
  heroBadge: 'Perfect Again AI',
  pageTitle: 'Perfect Again AI',
  pageSubtitle: 'Refine and improve your existing listings',
  listingToImprove: 'Listing to improve',
  listingToImproveDesc: 'Paste your existing listing and let AI perfect it',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  originalText: 'Original listing text *',
  originalPlaceholder: 'Paste your existing listing to improve... (min 50 characters)',
  chars: 'characters',
  propertyType: 'Property type *',
  propertyTypePlaceholder: 'e.g. Apartment',
  location: 'Location *',
  locationPlaceholder: 'e.g. Downtown',
  preferredTone: 'Preferred tone',
  selectTone: 'Select tone',
  refining: 'Refining...',
  refineButton: 'Perfect listing',
  noResult: 'No refined listing',
  noResultDesc:
    'Paste your existing listing and click “Perfect” to generate 4 improved versions: Professional, Emotional, Luxury, and SEO.',
  version: 'Version',
  copyAll: 'Copy all',
  improvedTitle: 'Improved title',
  improvedDesc: 'Improved description',
  highlights5: '5 highlights',
  ctaImproved: 'Improved CTA',
  metaSeo: 'Meta description SEO',
  originalAnalysis: 'Original listing analysis',
  highlightsHeading: 'HIGHLIGHTS:',
  ctaHeading: 'CTA:',
  metaHeading: 'META DESCRIPTION:',
  transactionOptions: [
    { value: 'vendita', label: 'Sale', iconKey: 'tag' },
    { value: 'affitto', label: 'Rent', iconKey: 'keyRound' },
    { value: 'affitto_breve', label: 'Short-term / vacation rent', iconKey: 'palmtree' },
  ],
  refineTabs: [
    {
      id: 'professional',
      label: 'Professional',
      description: 'Authoritative and credible',
    },
    {
      id: 'emotional',
      label: 'Emotional',
      description: 'Engaging and evocative',
    },
    {
      id: 'luxury',
      label: 'Luxury',
      description: 'Exclusive and refined',
    },
    {
      id: 'seo',
      label: 'SEO Boosted',
      description: 'Optimized for Google',
    },
  ],
  toneSelectItems: [
    { value: 'professional', label: 'Professional', iconKey: 'briefcase' },
    { value: 'emotional', label: 'Emotional', iconKey: 'heart' },
    { value: 'luxury', label: 'Luxury', iconKey: 'crown' },
    { value: 'seo', label: 'SEO Boosted', iconKey: 'search' },
  ],
};
