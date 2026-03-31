"use client";

import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { Locale } from "@/lib/i18n/config";

/**
 * Hook per ottenere la lingua corrente e reagire ai cambi dal selettore nell'header.
 * Usato da ARIA, Demo modal, e tutti i componenti che devono seguire la lingua selezionata.
 * Legge dal LocaleContext globale (in app/layout.tsx) per propagare il cambio a tutto il SaaS.
 */
export function useLocale(): Locale {
  const { locale } = useLocaleContext();
  return locale;
}
