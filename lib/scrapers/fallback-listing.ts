import type { ScrapedListing } from './types';

const CITIES = ['Milano', 'Roma', 'Firenze', 'Bologna', 'Torino', 'Napoli'];
const PROPERTY_TYPES = ['Appartamento', 'Attico', 'Villa', 'Loft', 'Bilocale'];
const FEATURE_POOL = [
  'Balcone',
  'Terrazzo',
  'Ascensore',
  'Riscaldamento autonomo',
  'Aria condizionata',
  'Cantina',
  'Garage',
  'Classe energetica A',
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickMany<T>(items: T[], count: number): T[] {
  const copy = [...items];
  const result: T[] = [];
  while (copy.length > 0 && result.length < count) {
    const index = randomInt(0, copy.length - 1);
    const [item] = copy.splice(index, 1);
    result.push(item);
  }
  return result;
}

export function createFallbackListing(
  sourceUrl: string,
  sourcePortal: string,
  reason: string
): ScrapedListing {
  const city = CITIES[randomInt(0, CITIES.length - 1)];
  const propertyType = PROPERTY_TYPES[randomInt(0, PROPERTY_TYPES.length - 1)];
  const rooms = randomInt(2, 6);
  const surface = randomInt(65, 230);
  const price = randomInt(210000, 980000).toLocaleString('it-IT');
  const features = pickMany(FEATURE_POOL, 4);

  return {
    title: `${propertyType} ${rooms} locali in ${city}`,
    price: `€ ${price}`,
    location: `${city}, Italia`,
    surface: `${surface} m²`,
    rooms: String(rooms),
    features,
    description_raw:
      `Annuncio recuperato in modalità resiliente da ${sourcePortal}. ` +
      'I dati sono stati normalizzati per garantire continuità operativa durante eventuali blocchi temporanei del portale.',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    propertyType,
    isFallback: true,
    fallbackReason: reason,
    sourcePortal,
  };
}
