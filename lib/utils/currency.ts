/**
 * Multi-Currency Engine
 * Conversione valuta in tempo reale (USD, EUR, GBP)
 */

export type Currency = 'USD' | 'EUR' | 'GBP';

export const currencies: Currency[] = ['USD', 'EUR', 'GBP'];

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
};

// Tassi di cambio mock (in produzione: API esterna come exchangerate-api.com)
const exchangeRates: Record<Currency, Record<Currency, number>> = {
  USD: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
  },
  EUR: {
    USD: 1.09,
    EUR: 1,
    GBP: 0.86,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    GBP: 1,
  },
};

/**
 * Converte un importo da una valuta all'altra
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  return amount * exchangeRates[from][to];
}

/**
 * Sanitize locale for Intl APIs (BCP 47: use hyphen, not underscore)
 */
function safeLocale(locale: string): string {
  const normalized = locale.replace(/_/g, '-');
  try {
    new Intl.NumberFormat(normalized);
    return normalized;
  } catch {
    return 'en-US';
  }
}

/**
 * Formatta un importo nella valuta specificata
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: string = 'en-US'
): string {
  const currencyMap: Record<Currency, string> = {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  };

  return new Intl.NumberFormat(safeLocale(locale), {
    style: 'currency',
    currency: currencyMap[currency],
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Aggiorna i tassi di cambio (in produzione: chiamata API)
 */
export async function updateExchangeRates(): Promise<void> {
  // In produzione: fetch da exchangerate-api.com o simile
  // Per ora usa i tassi mock
}

