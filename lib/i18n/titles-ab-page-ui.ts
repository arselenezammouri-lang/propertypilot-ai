/**
 * `/dashboard/titles` — A/B title generator
 */

import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Crown,
  Heart,
  MousePointerClick,
  Search,
  Zap,
} from 'lucide-react';

export type TitlesAbTipoImmobile = 'casa' | 'appartamento' | 'villa' | 'locale' | 'terreno' | 'ufficio';
export type TitlesAbTono = 'professionale' | 'emotivo' | 'luxury';
export type TitlesAbCategoryKey = 'titoli' | 'clickbait' | 'luxury' | 'seo';

export type TitlesAbPageUi = {
  generateError: string;
  successTitle: string;
  successDesc: string;
  locationRequiredDesc: string;
  pointsRequiredDesc: string;
  copied: string;
  copiedDesc: string;
  copyFailedDesc: string;
  subtitleBadge: string;
  heroTitle: string;
  heroDescription: string;
  backToDashboard: string;
  propertyData: string;
  propertyDataDesc: string;
  listingType: string;
  selectTransaction: string;
  propertyType: string;
  selectPropertyType: string;
  locationLabel: string;
  locationPlaceholder: string;
  priceLabel: string;
  pricePlaceholder: string;
  sizeLabel: string;
  sizePlaceholder: string;
  roomsLabel: string;
  roomsPlaceholder: string;
  keyPointsLabel: string;
  keyPointsPlaceholder: string;
  toneLabel: string;
  generateButtonIdle: string;
  generateButtonLoading: string;
  emptyTitle: string;
  emptySubtitle: string;
  loadingTitle: string;
  loadingSubtitle: string;
  bestTitleHeading: string;
  propertyTypes: Array<{ value: TitlesAbTipoImmobile; label: string }>;
  tones: Array<{
    value: TitlesAbTono;
    label: string;
    description: string;
  }>;
  categories: Array<{
    key: TitlesAbCategoryKey;
    label: string;
    description: string;
    badge: string;
  }>;
};

const categoryIcons: Record<TitlesAbCategoryKey, LucideIcon> = {
  titoli: MousePointerClick,
  clickbait: Zap,
  luxury: Crown,
  seo: Search,
};

const categoryGradients: Record<TitlesAbCategoryKey, string> = {
  titoli: 'from-indigo-500 to-purple-500',
  clickbait: 'from-orange-500 to-red-500',
  luxury: 'from-amber-500 to-yellow-500',
  seo: 'from-emerald-500 to-teal-500',
};

const categoryShadows: Record<TitlesAbCategoryKey, string> = {
  titoli: 'shadow-indigo-500/20',
  clickbait: 'shadow-orange-500/20',
  luxury: 'shadow-amber-500/20',
  seo: 'shadow-emerald-500/20',
};

export function getTitlesAbCategoryVisuals() {
  return { categoryIcons, categoryGradients, categoryShadows };
}

export const toneIconsForTitlesAb = {
  professionale: Building2,
  emotivo: Heart,
  luxury: Crown,
} as const;

export const titlesAbPageUiIt: TitlesAbPageUi = {
  generateError: 'Errore nella generazione',
  successTitle: 'Titoli A/B — generazione pronta',
  successDesc: '19 titoli ad alto CTR sono pronti per essere utilizzati.',
  locationRequiredDesc: "Inserisci la località dell'immobile",
  pointsRequiredDesc:
    "Descrivi almeno i punti chiave dell'immobile (min 10 caratteri)",
  copied: 'Copiato!',
  copiedDesc: 'Titolo copiato negli appunti',
  copyFailedDesc: 'Impossibile copiare il testo',
  subtitleBadge: 'CTR +40%',
  heroTitle: 'Generatore titoli A/B',
  heroDescription:
    'Genera 19 titoli ad alto conversion rate ottimizzati per massimizzare i click sui tuoi annunci',
  backToDashboard: 'Torna alla dashboard',
  propertyData: 'Dati immobile',
  propertyDataDesc: 'Inserisci le informazioni per generare titoli ottimizzati',
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  propertyType: 'Tipo immobile *',
  selectPropertyType: 'Seleziona tipo',
  locationLabel: 'Località *',
  locationPlaceholder: 'Es: Milano Centro',
  priceLabel: 'Prezzo',
  pricePlaceholder: '€ 350.000',
  sizeLabel: 'Superficie',
  sizePlaceholder: '120 mq',
  roomsLabel: 'Camere',
  roomsPlaceholder: '3',
  keyPointsLabel: "Punti chiave dell'immobile *",
  keyPointsPlaceholder:
    'Descrivi le caratteristiche principali: balcone, garage, giardino, vista, ristrutturato, luminoso...',
  toneLabel: 'Tono dei titoli',
  generateButtonIdle: 'Genera 19 titoli A/B',
  generateButtonLoading: 'Generazione titoli...',
  emptyTitle: 'I tuoi titoli appariranno qui',
  emptySubtitle:
    'Compila il form e clicca «Genera 19 titoli A/B» per creare titoli ad alto CTR',
  loadingTitle: 'Generazione titoli AI...',
  loadingSubtitle: 'Stiamo creando 19 titoli ottimizzati per il massimo CTR',
  bestTitleHeading: 'Miglior titolo consigliato',
  propertyTypes: [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'villa', label: 'Villa' },
    { value: 'locale', label: 'Locale commerciale' },
    { value: 'ufficio', label: 'Ufficio' },
    { value: 'terreno', label: 'Terreno' },
  ],
  tones: [
    {
      value: 'professionale',
      label: 'Professionale',
      description: 'Chiaro e informativo',
    },
    {
      value: 'emotivo',
      label: 'Emotivo',
      description: 'Aspirazionale e coinvolgente',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Esclusivo e prestigioso',
    },
  ],
  categories: [
    {
      key: 'titoli',
      label: 'Titoli alto CTR',
      description: '10 titoli ottimizzati per massimizzare i click',
      badge: 'CTR +40%',
    },
    {
      key: 'clickbait',
      label: 'Clickbait soft',
      description: 'Attirano curiosità senza essere spam',
      badge: 'Virale',
    },
    {
      key: 'luxury',
      label: 'Luxury',
      description: 'Per immobili di alto livello e clienti facoltosi',
      badge: 'Premium',
    },
    {
      key: 'seo',
      label: 'SEO optimized',
      description: 'Ottimizzati per Google e portali immobiliari',
      badge: 'Ranking',
    },
  ],
};

export const titlesAbPageUiEn: TitlesAbPageUi = {
  generateError: 'Generation error',
  successTitle: 'A/B titles — generation ready',
  successDesc: '19 high-CTR titles are ready to use.',
  locationRequiredDesc: 'Enter the property location',
  pointsRequiredDesc: 'Describe at least the key points of the property (min 10 characters)',
  copied: 'Copied!',
  copiedDesc: 'Title copied to clipboard',
  copyFailedDesc: 'Unable to copy text',
  subtitleBadge: 'CTR +40%',
  heroTitle: 'A/B title generator',
  heroDescription:
    'Generate 19 high-converting titles optimized to maximize clicks on your listings',
  backToDashboard: 'Back to dashboard',
  propertyData: 'Property data',
  propertyDataDesc: 'Enter the information to generate optimized titles',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  propertyType: 'Property type *',
  selectPropertyType: 'Select type',
  locationLabel: 'Location *',
  locationPlaceholder: 'e.g. Downtown Milan',
  priceLabel: 'Price',
  pricePlaceholder: '$ 350,000',
  sizeLabel: 'Size',
  sizePlaceholder: '120 sqm',
  roomsLabel: 'Bedrooms',
  roomsPlaceholder: '3',
  keyPointsLabel: 'Key features of the property *',
  keyPointsPlaceholder:
    'Describe the main features: balcony, garage, garden, view, renovated, bright...',
  toneLabel: 'Title tone',
  generateButtonIdle: 'Generate 19 A/B titles',
  generateButtonLoading: 'Generating titles...',
  emptyTitle: 'Your titles will appear here',
  emptySubtitle: 'Fill the form and click “Generate 19 A/B titles” to create high-CTR titles',
  loadingTitle: 'AI title generation...',
  loadingSubtitle: 'We are creating 19 titles optimized for maximum CTR',
  bestTitleHeading: 'Recommended best title',
  propertyTypes: [
    { value: 'appartamento', label: 'Apartment' },
    { value: 'casa', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'locale', label: 'Commercial space' },
    { value: 'ufficio', label: 'Office' },
    { value: 'terreno', label: 'Land' },
  ],
  tones: [
    {
      value: 'professionale',
      label: 'Professional',
      description: 'Clear and informative',
    },
    {
      value: 'emotivo',
      label: 'Emotional',
      description: 'Aspirational and engaging',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Exclusive and prestigious',
    },
  ],
  categories: [
    {
      key: 'titoli',
      label: 'High-CTR titles',
      description: '10 titles optimized to maximize clicks',
      badge: 'CTR +40%',
    },
    {
      key: 'clickbait',
      label: 'Soft clickbait',
      description: 'Spark curiosity without feeling spammy',
      badge: 'Viral',
    },
    {
      key: 'luxury',
      label: 'Luxury',
      description: 'For high-end properties and affluent buyers',
      badge: 'Premium',
    },
    {
      key: 'seo',
      label: 'SEO optimized',
      description: 'Optimized for Google and real estate portals',
      badge: 'Ranking',
    },
  ],
};
