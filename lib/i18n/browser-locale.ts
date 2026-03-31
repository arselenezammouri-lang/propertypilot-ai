/**
 * Browser Locale Detection
 * Rileva la lingua del browser e la allinea con il sistema i18n
 */

import { Locale, defaultLocale } from './config';
import { SupportedLocale } from './dictionary';

/**
 * Mappa le lingue del browser ai locale supportati
 */
const browserLocaleMap: Record<string, Locale> = {
  'it': 'it',
  'it-IT': 'it',
  'it-CH': 'it',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'en-AU': 'en',
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'es-CL': 'es',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'fr-CH': 'fr',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'ar': 'ar',
  'ar-AE': 'ar',
  'ar-SA': 'ar',
  'ar-QA': 'ar',
  'ar-KW': 'ar',
  'ar-BH': 'ar',
  'ar-OM': 'ar',
  'pt': 'pt',
  'pt-PT': 'pt',
  'pt-BR': 'pt',
};

/**
 * Mappa i locale ai codici per Speech Recognition API
 */
export const speechRecognitionLocaleMap: Record<Locale, string> = {
  'it': 'it-IT',
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'ar': 'ar-AE',
  'pt': 'pt-PT',
};

/**
 * Rileva la lingua del browser
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // 1. Prova a leggere da localStorage (preferenza utente)
  const savedLocale = localStorage.getItem('propertypilot_locale') as Locale;
  if (savedLocale && ['it', 'en', 'es', 'fr', 'de', 'ar', 'pt'].includes(savedLocale)) {
    return savedLocale;
  }

  // 2. Rileva dalla lingua del browser
  const browserLang = navigator.language || (navigator as any).userLanguage || defaultLocale;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Mappa diretta
  if (browserLocaleMap[browserLang]) {
    return browserLocaleMap[browserLang];
  }
  
  // Mappa per codice lingua base
  if (browserLocaleMap[langCode]) {
    return browserLocaleMap[langCode];
  }

  // Fallback a default
  return defaultLocale;
}

/**
 * Converte Locale in SupportedLocale (per compatibilità con dictionary)
 */
export function localeToSupportedLocale(locale: Locale): SupportedLocale {
  const map: Record<Locale, SupportedLocale> = {
    'it': 'it',
    'en': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'ar': 'ar',
    'pt': 'pt',
  };
  return map[locale] || 'en';
}

/**
 * Ottiene il codice per Speech Recognition API
 */
export function getSpeechRecognitionLocale(locale: Locale): string {
  return speechRecognitionLocaleMap[locale] || 'en-US';
}
