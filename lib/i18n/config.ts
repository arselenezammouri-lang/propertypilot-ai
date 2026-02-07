/**
 * Internationalization Configuration
 * Supporto per: Italiano, Inglese, Spagnolo, Francese, Tedesco, Arabo
 */

export type Locale = 'it' | 'en' | 'es' | 'fr' | 'de' | 'ar';

export const locales: Locale[] = ['it', 'en', 'es', 'fr', 'de', 'ar'];

export const defaultLocale: Locale = 'it';

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ar: '🇦🇪',
};

// Traduzioni chiave per Aria
export const ariaTranslations: Record<Locale, Record<string, string>> = {
  it: {
    welcome: "Ciao! Sono Aria, la tua AI Success Partner. Oggi il mercato è tuo!",
    analyzing: "Sto analizzando l'immobile...",
    territory_analysis: "Analisi del territorio completata",
    error: "Errore",
    microphoneError: "Impossibile accedere al microfono. Usa la tastiera.",
    recalibrating: "Aria sta ricalibrando le connessioni. Riprova tra qualche istante.",
  },
  en: {
    welcome: "Hi! I'm Aria, your AI Success Partner. Today the market is yours!",
    analyzing: "I'm analyzing the property...",
    territory_analysis: "Territory analysis completed",
    error: "Error",
    microphoneError: "Unable to access microphone. Please use the keyboard.",
    recalibrating: "Aria is recalibrating connections. Please try again in a moment.",
  },
  es: {
    welcome: "¡Hola! Soy Aria, tu AI Success Partner. ¡Hoy el mercado es tuyo!",
    analyzing: "Estoy analizando la propiedad...",
    territory_analysis: "Análisis del territorio completado",
    error: "Error",
    microphoneError: "No se puede acceder al micrófono. Por favor usa el teclado.",
    recalibrating: "Aria está recalibrando las conexiones. Por favor intenta de nuevo en un momento.",
  },
  fr: {
    welcome: "Bonjour! Je suis Aria, votre AI Success Partner. Aujourd'hui, le marché est à vous!",
    analyzing: "J'analyse la propriété...",
    territory_analysis: "Analyse du territoire terminée",
    error: "Erreur",
    microphoneError: "Impossible d'accéder au microphone. Veuillez utiliser le clavier.",
    recalibrating: "Aria recalibre les connexions. Veuillez réessayer dans un instant.",
  },
  de: {
    welcome: "Hallo! Ich bin Aria, dein AI Success Partner. Heute gehört dir der Markt!",
    analyzing: "Ich analysiere die Immobilie...",
    territory_analysis: "Gebietsanalyse abgeschlossen",
    error: "Fehler",
    microphoneError: "Mikrofonzugriff nicht möglich. Bitte verwende die Tastatur.",
    recalibrating: "Aria kalibriert die Verbindungen neu. Bitte versuche es gleich noch einmal.",
  },
  ar: {
    welcome: "مرحباً! أنا آريا، شريكك الذكي للنجاح. السوق اليوم لك!",
    analyzing: "أنا أحلل العقار...",
    territory_analysis: "اكتمل تحليل المنطقة",
    error: "خطأ",
    microphoneError: "تعذر الوصول إلى الميكروفون. يرجى استخدام لوحة المفاتيح.",
    recalibrating: "آريا تعيد معايرة الاتصالات. يرجى المحاولة مرة أخرى بعد لحظة.",
  },
};

