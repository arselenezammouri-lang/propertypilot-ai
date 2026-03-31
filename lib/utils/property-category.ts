/**
 * Property Category Utilities
 * Gestione delle categorie immobiliari: Vendite, Affitti, Commerciale
 */

export type PropertyCategory = 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL';

export interface CategoryConfig {
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

export const CATEGORY_CONFIG: Record<PropertyCategory, CategoryConfig> = {
  RESIDENTIAL_SALE: {
    label: 'Vendite',
    emoji: '🏠',
    description: 'Immobili residenziali in vendita',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
  },
  RESIDENTIAL_RENT: {
    label: 'Affitti',
    emoji: '🔑',
    description: 'Immobili residenziali in affitto',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30',
  },
  COMMERCIAL: {
    label: 'Commerciale',
    emoji: '🏢',
    description: 'Locali commerciali e uffici',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
  },
};

/**
 * Calcola Expected Yield per affitti
 */
export function calculateExpectedYield(
  monthlyRent: number,
  purchasePrice: number
): number {
  if (!monthlyRent || !purchasePrice || purchasePrice === 0) return 0;
  const annualRent = monthlyRent * 12;
  return (annualRent / purchasePrice) * 100;
}

/**
 * Estrae Key Business Features da un annuncio commerciale
 */
export function extractBusinessFeatures(description: string): string[] {
  const features: string[] = [];
  const lowerDesc = description.toLowerCase();

  // Categoria catastale
  if (lowerDesc.includes('categoria c3') || lowerDesc.includes('cat. c3')) {
    features.push('Categoria C3');
  }
  if (lowerDesc.includes('categoria c1') || lowerDesc.includes('cat. c1')) {
    features.push('Categoria C1');
  }

  // Caratteristiche fisiche
  if (lowerDesc.includes('vetrina') || lowerDesc.includes('vetrina su strada')) {
    features.push('Vetrina su strada');
  }
  if (lowerDesc.includes('canna fumaria') || lowerDesc.includes('canna fumaria')) {
    features.push('Canna fumaria');
  }
  if (lowerDesc.includes('magazzino') || lowerDesc.includes('deposito')) {
    features.push('Magazzino/Deposito');
  }
  if (lowerDesc.includes('ufficio') || lowerDesc.includes('uffici')) {
    features.push('Uffici');
  }
  if (lowerDesc.includes('parcheggio') || lowerDesc.includes('posto auto')) {
    features.push('Parcheggio');
  }

  // Zona
  if (lowerDesc.includes('centro storico') || lowerDesc.includes('centro città')) {
    features.push('Centro storico');
  }
  if (lowerDesc.includes('alto passaggio') || lowerDesc.includes('zona pedonale')) {
    features.push('Alto passaggio pedonale');
  }

  return features;
}

/**
 * Determina la categoria da un annuncio basandosi su keywords
 */
export function detectCategoryFromText(
  title: string,
  description: string
): PropertyCategory {
  const text = `${title} ${description}`.toLowerCase();

  // Keywords per affitti
  const rentKeywords = [
    'affitto',
    'affittasi',
    'in affitto',
    'locazione',
    'canone',
    'mensile',
    '€/mese',
    'euro al mese',
  ];

  // Keywords per commerciale
  const commercialKeywords = [
    'locale commerciale',
    'negozio',
    'ufficio',
    'magazzino',
    'attività',
    'categoria c',
    'vetrina',
    'negozio',
    'bar',
    'ristorante',
    'commerciale',
  ];

  if (rentKeywords.some((keyword) => text.includes(keyword))) {
    return 'RESIDENTIAL_RENT';
  }

  if (commercialKeywords.some((keyword) => text.includes(keyword))) {
    return 'COMMERCIAL';
  }

  // Default: vendita residenziale
  return 'RESIDENTIAL_SALE';
}

