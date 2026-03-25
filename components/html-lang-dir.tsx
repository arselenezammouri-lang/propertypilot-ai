"use client";

import { useEffect } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

const STORAGE_KEY = "propertypilot_locale";
const VALID_LOCALES: Locale[] = ["it", "en", "es", "fr", "de", "pt", "ar"];

/**
 * Syncs document.documentElement.lang and dir (RTL for ar) with the user's saved locale.
 * Runs on mount so the first paint after hydration respects locale; SSR remains lang="en" without middleware.
 */
export function HtmlLangDir() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      const locale = saved && VALID_LOCALES.includes(saved) ? saved : defaultLocale;
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    } catch {
      document.documentElement.lang = defaultLocale;
      document.documentElement.dir = "ltr";
    }
  }, []);
  return null;
}
