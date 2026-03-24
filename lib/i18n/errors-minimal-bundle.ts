/**
 * Minimal `errors` strings for `app/global-error.tsx` only (cannot use LocaleProvider).
 * Kept in sync with `TranslationDictionary.errors` / `common-errors-locales.ts`.
 */

import type { Locale } from '@/lib/i18n/config';

export type ErrorsMinimalUi = {
  somethingWentWrong: string;
  unexpectedError: string;
  unknownError: string;
  errorId: string;
  tryAgain: string;
  backToHome: string;
};

export const ERRORS_MINIMAL: Record<Locale, ErrorsMinimalUi> = {
  it: {
    somethingWentWrong: 'Qualcosa è andato storto',
    unexpectedError:
      'Si è verificato un errore imprevisto. Non ti preoccupare, i tuoi dati sono al sicuro.',
    unknownError: 'Errore sconosciuto',
    errorId: 'ID Errore',
    tryAgain: 'Riprova',
    backToHome: 'Torna alla Home',
  },
  en: {
    somethingWentWrong: 'Something went wrong',
    unexpectedError: "An unexpected error occurred. Don't worry, your data is safe.",
    unknownError: 'Unknown error',
    errorId: 'Error ID',
    tryAgain: 'Try again',
    backToHome: 'Back to Home',
  },
  es: {
    somethingWentWrong: 'Algo salió mal',
    unexpectedError: 'Ocurrió un error inesperado. No te preocupes, tus datos están a salvo.',
    unknownError: 'Error desconocido',
    errorId: 'ID de error',
    tryAgain: 'Reintentar',
    backToHome: 'Volver al inicio',
  },
  fr: {
    somethingWentWrong: 'Une erreur s’est produite',
    unexpectedError:
      'Une erreur inattendue est survenue. Ne vous inquiétez pas, vos données sont en sécurité.',
    unknownError: 'Erreur inconnue',
    errorId: 'ID d’erreur',
    tryAgain: 'Réessayer',
    backToHome: 'Retour à l’accueil',
  },
  de: {
    somethingWentWrong: 'Etwas ist schiefgelaufen',
    unexpectedError:
      'Ein unerwarteter Fehler ist aufgetreten. Keine Sorge, Ihre Daten sind sicher.',
    unknownError: 'Unbekannter Fehler',
    errorId: 'Fehler-ID',
    tryAgain: 'Erneut versuchen',
    backToHome: 'Zur Startseite',
  },
  pt: {
    somethingWentWrong: 'Algo correu mal',
    unexpectedError:
      'Ocorreu um erro inesperado. Não se preocupe, os seus dados estão seguros.',
    unknownError: 'Erro desconhecido',
    errorId: 'ID do erro',
    tryAgain: 'Tentar novamente',
    backToHome: 'Voltar ao início',
  },
  ar: {
    somethingWentWrong: 'حدث خطأ ما',
    unexpectedError: 'حدث خطأ غير متوقع. لا تقلق، بياناتك آمنة.',
    unknownError: 'خطأ غير معروف',
    errorId: 'معرّف الخطأ',
    tryAgain: 'إعادة المحاولة',
    backToHome: 'العودة للرئيسية',
  },
};
