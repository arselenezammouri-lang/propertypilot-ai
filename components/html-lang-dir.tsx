"use client";

import { useEffect } from "react";
import { Locale } from "@/lib/i18n/config";

const STORAGE_KEY = "propertypilot_locale";
const VALID_LOCALES: Locale[] = ["it", "en", "es", "fr", "de", "pt"];

/**
 * Syncs document.documentElement.lang with the user's saved locale.
 * Runs on mount so the first paint after hydration respects locale.
 */
export function HtmlLangDir() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      const locale = saved && VALID_LOCALES.includes(saved) ? saved : "en";
      document.documentElement.lang = locale;
    } catch {
      document.documentElement.lang = "en";
    }
  }, []);
  return null;
}
