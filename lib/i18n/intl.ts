import { Locale } from '@/lib/i18n/config';

const INTL_LOCALES: Record<Locale, string> = {
  it: 'it-IT',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  ar: 'ar-AE',
};

export function toIntlLocale(locale: Locale): string {
  return INTL_LOCALES[locale] || INTL_LOCALES.en;
}

export function formatCurrencyForLocale(
  amount: number,
  locale: Locale,
  currency = 'EUR'
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateForLocale(
  value: string | number | Date,
  locale: Locale
): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTimeForLocale(
  value: string | number | Date,
  locale: Locale
): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
