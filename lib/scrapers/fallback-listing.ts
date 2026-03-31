import type { ScrapedListing } from './types';

const CITIES = [
  'Milano',
  'Roma',
  'Torino',
  'Bologna',
  'Firenze',
  'Napoli',
  'Bari',
  'Palermo',
];

const PROPERTY_TYPES = [
  'Appartamento',
  'Trilocale',
  'Bilocale',
  'Attico',
  'Villa',
];

const FEATURE_SETS = [
  ['Luminoso', 'Terrazzo', 'Ascensore', 'Doppia esposizione'],
  ['Ristrutturato', 'Cucina abitabile', 'Balcone', 'Cantina'],
  ['Piano alto', 'Vista aperta', 'Portineria', 'Aria condizionata'],
  ['Zona servita', 'Vicino metro', 'Parquet', 'Infissi nuovi'],
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function extractListingId(url: string) {
  const idMatch = url.match(/(\d{6,})/);
  return idMatch?.[1] ?? String(hashString(url)).slice(0, 8);
}

export function createFallbackListing(
  url: string,
  sourcePortal: string,
  reason = 'portal-blocked-403'
): ScrapedListing {
  const hash = hashString(url);
  const city = CITIES[hash % CITIES.length];
  const type = PROPERTY_TYPES[hash % PROPERTY_TYPES.length];
  const features = FEATURE_SETS[hash % FEATURE_SETS.length];
  const rooms = 2 + (hash % 4); // 2-5
  const surface = 55 + (hash % 95); // 55-149
  const priceValue = 165000 + (hash % 620000);
  const listingId = extractListingId(url);

  return {
    title: `${type} ${rooms} locali in ${city}`,
    price: `€ ${priceValue.toLocaleString('it-IT')}`,
    location: city,
    surface: `${surface} m²`,
    rooms: String(rooms),
    features,
    description_raw: `Dati simulati generati automaticamente per garantire continuità UI. ` +
      `Annuncio ${type.toLowerCase()} in ${city}, ${surface} m², ${rooms} locali. ` +
      `Fonte originale temporaneamente protetta (403). ID riferimento: ${listingId}.`,
    images: [],
    propertyType: type,
    isFallback: true,
    fallbackReason: reason,
    sourcePortal,
  };
}
