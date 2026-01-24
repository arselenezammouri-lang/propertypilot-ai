/**
 * Currency Formatter Utility
 * Formatta i prezzi in base alla location (USA vs Europa)
 */

/**
 * Rileva la valuta in base alla location
 */
export function detectCurrency(location: string): 'USD' | 'EUR' {
  const locationLower = location.toLowerCase();
  
  // USA locations
  if (
    locationLower.includes('miami') ||
    locationLower.includes('florida') ||
    locationLower.includes('fl') ||
    locationLower.includes('usa') ||
    locationLower.includes('united states') ||
    locationLower.includes('new york') ||
    locationLower.includes('ny') ||
    locationLower.includes('california') ||
    locationLower.includes('ca') ||
    locationLower.includes('texas') ||
    locationLower.includes('tx') ||
    locationLower.includes('zillow')
  ) {
    return 'USD';
  }
  
  // Default: EUR (Europa)
  return 'EUR';
}

/**
 * Formatta un prezzo in base alla location
 */
export function formatPriceByLocation(
  price: number | null | undefined,
  location: string
): string {
  if (!price) return 'N/A';
  
  const currency = detectCurrency(location);
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } else {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}

/**
 * Formatta un prezzo con valuta esplicita
 */
export function formatPrice(
  price: number | null | undefined,
  currency: 'USD' | 'EUR' = 'EUR'
): string {
  if (!price) return 'N/A';
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } else {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}

/**
 * Ottiene il simbolo valuta in base alla location
 */
export function getCurrencySymbol(location: string): string {
  return detectCurrency(location) === 'USD' ? '$' : '€';
}
