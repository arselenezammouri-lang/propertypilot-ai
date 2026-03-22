/**
 * `/dashboard/social-posts` — social post generator
 */

import { AlignCenter, AlignJustify, AlignLeft, Building2, Crown, Heart } from 'lucide-react';

export type SocialPostsTono = 'professionale' | 'emotivo' | 'luxury';
export type SocialPostsLunghezza = 'breve' | 'standard' | 'lunga';

export type SocialPostsPageUi = {
  generateError: string;
  successTitle: string;
  successDesc: string;
  titleRequiredDesc: string;
  descriptionRequiredDesc: string;
  copied: string;
  copiedDesc: string;
  copyFailedDesc: string;
  backDashboard: string;
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
  priceLabel: string;
  pricePlaceholder: string;
  sizeLabel: string;
  sizePlaceholder: string;
  roomsLabel: string;
  roomsPlaceholder: string;
  bathsLabel: string;
  bathsPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  toneLabel: string;
  lengthLabel: string;
  generateButtonIdle: string;
  generateButtonLoading: string;
  generatingSubtitle: string;
  emptyTitle: string;
  emptySubtitle: string;
  instagramLabel: string;
  facebookLabel: string;
  tiktokLabel: string;
  hashtagsLabel: string;
  copyPost: string;
  copyScript: string;
  copyHashtagsLabel: string;
  tones: Array<{
    value: SocialPostsTono;
    label: string;
    description: string;
  }>;
  lengths: Array<{
    value: SocialPostsLunghezza;
    label: string;
    description: string;
  }>;
};

export const socialPostToneIcons = {
  professionale: Building2,
  emotivo: Heart,
  luxury: Crown,
} as const;

export const socialPostLengthIcons = {
  breve: AlignLeft,
  standard: AlignCenter,
  lunga: AlignJustify,
} as const;

export const socialPostsPageUiIt: SocialPostsPageUi = {
  generateError: 'Errore nella generazione',
  successTitle: 'Post social — contenuti pronti',
  successDesc: 'I tuoi contenuti social sono pronti per essere copiati.',
  titleRequiredDesc: 'Inserisci un titolo di almeno 5 caratteri',
  descriptionRequiredDesc: 'Inserisci una descrizione di almeno 20 caratteri',
  copied: 'Copiato!',
  copiedDesc: 'Testo copiato negli appunti',
  copyFailedDesc: 'Impossibile copiare il testo',
  backDashboard: 'Torna alla dashboard',
  heroTitle: 'Generatore post social',
  heroSubtitle:
    'Crea contenuti virali per Instagram, Facebook e TikTok in pochi secondi',
  heroBadge: 'IG · FB · TikTok',
  formTitle: 'Informazioni immobile',
  formSubtitle: 'Inserisci i dati per generare i post social',
  listingType: 'Tipo annuncio',
  selectTransaction: 'Seleziona tipo transazione',
  titleLabel: 'Titolo *',
  titlePlaceholder: 'Es: Villa di lusso con vista mare',
  descriptionLabel: 'Descrizione *',
  descriptionPlaceholder: "Descrivi l'immobile in dettaglio...",
  priceLabel: 'Prezzo',
  pricePlaceholder: '€ 450.000',
  sizeLabel: 'Superficie',
  sizePlaceholder: '120 mq',
  roomsLabel: 'Camere',
  roomsPlaceholder: '3',
  bathsLabel: 'Bagni',
  bathsPlaceholder: '2',
  locationLabel: 'Località',
  locationPlaceholder: 'Milano',
  toneLabel: 'Tono del messaggio',
  lengthLabel: 'Lunghezza',
  generateButtonIdle: 'Genera post social',
  generateButtonLoading: 'Generazione in corso...',
  generatingSubtitle:
    'Stiamo creando post ottimizzati per ogni piattaforma',
  emptyTitle: 'I tuoi post appariranno qui',
  emptySubtitle:
    'Compila il form e clicca «Genera post social» per creare contenuti virali',
  instagramLabel: 'Post Instagram',
  facebookLabel: 'Post Facebook',
  tiktokLabel: 'Script TikTok',
  hashtagsLabel: 'Hashtag',
  copyPost: 'Copia post',
  copyScript: 'Copia script',
  copyHashtagsLabel: 'Copia hashtag',
  tones: [
    {
      value: 'professionale',
      label: 'Professionale',
      description: 'Formale e autorevole',
    },
    {
      value: 'emotivo',
      label: 'Emotivo',
      description: 'Coinvolgente e caldo',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Esclusivo e raffinato',
    },
  ],
  lengths: [
    { value: 'breve', label: 'Breve', description: '30 parole IG' },
    { value: 'standard', label: 'Standard', description: '60 parole IG' },
    { value: 'lunga', label: 'Lunga', description: '100 parole IG' },
  ],
};

export const socialPostsPageUiEn: SocialPostsPageUi = {
  generateError: 'Generation error',
  successTitle: 'Social posts — content ready',
  successDesc: 'Your social content is ready to copy.',
  titleRequiredDesc: 'Enter a title with at least 5 characters',
  descriptionRequiredDesc: 'Enter a description with at least 20 characters',
  copied: 'Copied!',
  copiedDesc: 'Text copied to clipboard',
  copyFailedDesc: 'Unable to copy text',
  backDashboard: 'Back to dashboard',
  heroTitle: 'Social post generator',
  heroSubtitle: 'Create viral content for Instagram, Facebook, and TikTok in seconds',
  heroBadge: 'IG · FB · TikTok',
  formTitle: 'Property information',
  formSubtitle: 'Enter data to generate social posts',
  listingType: 'Listing type',
  selectTransaction: 'Select transaction type',
  titleLabel: 'Title *',
  titlePlaceholder: 'e.g. Luxury villa with sea view',
  descriptionLabel: 'Description *',
  descriptionPlaceholder: 'Describe the property in detail...',
  priceLabel: 'Price',
  pricePlaceholder: '$ 450,000',
  sizeLabel: 'Size',
  sizePlaceholder: '120 sqm',
  roomsLabel: 'Bedrooms',
  roomsPlaceholder: '3',
  bathsLabel: 'Bathrooms',
  bathsPlaceholder: '2',
  locationLabel: 'Location',
  locationPlaceholder: 'Miami',
  toneLabel: 'Message tone',
  lengthLabel: 'Length',
  generateButtonIdle: 'Generate social posts',
  generateButtonLoading: 'Generating...',
  generatingSubtitle: 'Creating platform-optimized posts',
  emptyTitle: 'Your posts will appear here',
  emptySubtitle: 'Fill the form and click “Generate social posts” to create viral content',
  instagramLabel: 'Instagram post',
  facebookLabel: 'Facebook post',
  tiktokLabel: 'TikTok script',
  hashtagsLabel: 'Hashtags',
  copyPost: 'Copy post',
  copyScript: 'Copy script',
  copyHashtagsLabel: 'Copy hashtags',
  tones: [
    {
      value: 'professionale',
      label: 'Professional',
      description: 'Formal and authoritative',
    },
    {
      value: 'emotivo',
      label: 'Emotional',
      description: 'Warm and engaging',
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Exclusive and refined',
    },
  ],
  lengths: [
    { value: 'breve', label: 'Short', description: '30 IG words' },
    { value: 'standard', label: 'Standard', description: '60 IG words' },
    { value: 'lunga', label: 'Long', description: '100 IG words' },
  ],
};
