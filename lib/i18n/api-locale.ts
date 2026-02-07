/**
 * API Locale Helper
 * Funzioni per ottenere la lingua dell'utente nelle API routes
 */

import { SupportedLocale } from './dictionary';
import { Locale } from './config';

/**
 * Ottiene la lingua dell'utente da:
 * 1. Header della richiesta (se presente)
 * 2. Profilo utente (se presente)
 * 3. Default: 'it'
 */
export async function getUserLocale(
  request: Request,
  userId?: string,
  supabase?: any
): Promise<SupportedLocale> {
  // 1. Prova a leggere da header
  const headerLocale = request.headers.get('x-user-locale') || 
                       request.headers.get('accept-language');
  
  if (headerLocale) {
    const langCode = headerLocale.split(',')[0].split('-')[0].toLowerCase();
    if (['it', 'en', 'es', 'fr', 'de', 'ar'].includes(langCode)) {
      return langCode as SupportedLocale;
    }
  }

  // 2. Prova a leggere dal profilo utente (se supabase e userId forniti)
  if (supabase && userId) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('locale, country, city')
        .eq('id', userId)
        .single();
      
      if (profile?.locale && ['it', 'en', 'es', 'fr', 'de', 'ar'].includes(profile.locale)) {
        return profile.locale as SupportedLocale;
      }
    } catch (error) {
      // Ignora errori, usa default
    }
  }

  // 3. Default
  return 'it';
}

/**
 * Traduzioni messaggi errore comuni
 */
export const errorMessages: Record<SupportedLocale, Record<string, string>> = {
  it: {
    unauthorized: 'Non autorizzato',
    notFound: 'Non trovato',
    invalidRequest: 'Richiesta non valida',
    internalError: 'Errore interno del server',
    rateLimit: 'Troppe richieste. Riprova tra un minuto.',
    subscriptionRequired: 'Abbonamento richiesto',
    invalidData: 'Dati non validi',
  },
  en: {
    unauthorized: 'Unauthorized',
    notFound: 'Not found',
    invalidRequest: 'Invalid request',
    internalError: 'Internal server error',
    rateLimit: 'Too many requests. Please try again in a minute.',
    subscriptionRequired: 'Subscription required',
    invalidData: 'Invalid data',
  },
  es: {
    unauthorized: 'No autorizado',
    notFound: 'No encontrado',
    invalidRequest: 'Solicitud no válida',
    internalError: 'Error interno del servidor',
    rateLimit: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.',
    subscriptionRequired: 'Suscripción requerida',
    invalidData: 'Datos no válidos',
  },
  fr: {
    unauthorized: 'Non autorisé',
    notFound: 'Non trouvé',
    invalidRequest: 'Requête non valide',
    internalError: 'Erreur interne du serveur',
    rateLimit: 'Trop de requêtes. Réessayez dans une minute.',
    subscriptionRequired: 'Abonnement requis',
    invalidData: 'Données non valides',
  },
  de: {
    unauthorized: 'Nicht autorisiert',
    notFound: 'Nicht gefunden',
    invalidRequest: 'Ungültige Anfrage',
    internalError: 'Interner Serverfehler',
    rateLimit: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.',
    subscriptionRequired: 'Abonnement erforderlich',
    invalidData: 'Ungültige Daten',
  },
  ar: {
    unauthorized: 'غير مصرح',
    notFound: 'غير موجود',
    invalidRequest: 'طلب غير صالح',
    internalError: 'خطأ داخلي في الخادم',
    rateLimit: 'طلبات كثيرة جداً. يرجى المحاولة مرة أخرى بعد دقيقة.',
    subscriptionRequired: 'اشتراك مطلوب',
    invalidData: 'بيانات غير صالحة',
  },
};

/**
 * Ottiene un messaggio di errore tradotto
 */
export function getErrorMessage(
  locale: SupportedLocale,
  key: string
): string {
  return errorMessages[locale]?.[key] || errorMessages['it'][key] || key;
}
