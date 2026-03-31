/**
 * Utility per calcolare il GAP di mercato
 */

export interface ListingData {
  price: number | null;
  surface?: number | null;
  raw_data?: {
    surface?: number;
  };
}

export function calculateMarketGap(listing: ListingData): number | null {
  if (!listing.price) return null;
  
  const surface = listing.surface || listing.raw_data?.surface;
  if (!surface || surface === 0) return null;
  
  const pricePerSqm = listing.price / surface;
  // Mock: assumiamo media zona = prezzo attuale * 1.22 (22% sopra)
  const marketAvgPricePerSqm = pricePerSqm * 1.22;
  const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
  
  return gap > 0 ? gap : null;
}

