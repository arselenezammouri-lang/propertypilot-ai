"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, defaultLocale } from "./config";
import { Currency } from "@/lib/utils/currency";

interface LocaleContextValue {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  currency: "EUR",
  setLocale: () => {},
  setCurrency: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [mounted, setMounted] = useState(false);

  // Read from localStorage on first mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("propertypilot_locale") as Locale;
    if (savedLocale && ["it", "en", "es", "fr", "de", "ar", "pt"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    const savedCurrency = localStorage.getItem("propertypilot_currency") as Currency;
    if (savedCurrency && ["EUR", "USD", "GBP"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
    setMounted(true);
  }, []);

  // Listen for locale-change events dispatched by LocaleCurrencySelector
  useEffect(() => {
    const handler = (e: Event) => {
      const newLocale = (e as CustomEvent<Locale>).detail;
      if (newLocale && ["it", "en", "es", "fr", "de", "ar", "pt"].includes(newLocale)) {
        setLocaleState(newLocale);
        // Update document dir/lang for RTL support
        document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLocale;
      }
    };
    window.addEventListener("locale-change", handler);
    return () => window.removeEventListener("locale-change", handler);
  }, []);

  // Listen for currency-change events
  useEffect(() => {
    const handler = (e: Event) => {
      const newCurrency = (e as CustomEvent<Currency>).detail;
      if (newCurrency && ["EUR", "USD", "GBP"].includes(newCurrency)) {
        setCurrencyState(newCurrency);
      }
    };
    window.addEventListener("currency-change", handler);
    return () => window.removeEventListener("currency-change", handler);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("propertypilot_locale", newLocale);
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLocale;
      window.dispatchEvent(new CustomEvent("locale-change", { detail: newLocale }));
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("propertypilot_currency", newCurrency);
      window.dispatchEvent(new CustomEvent("currency-change", { detail: newCurrency }));
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, currency, setLocale, setCurrency }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook to get and set the current locale from any component in the app.
 * Works on client only (returns defaultLocale on server).
 */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
