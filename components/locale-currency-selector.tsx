"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, DollarSign } from "lucide-react";
import { Locale, localeNames, localeFlags, locales } from "@/lib/i18n/config";
import { Currency, currencySymbols, currencyNames, currencies } from "@/lib/utils/currency";

interface LocaleCurrencySelectorProps {
  currentLocale?: Locale;
  currentCurrency?: Currency;
  onLocaleChange?: (locale: Locale) => void;
  onCurrencyChange?: (currency: Currency) => void;
}

export function LocaleCurrencySelector({
  currentLocale = 'it',
  currentCurrency = 'EUR',
  onLocaleChange,
  onCurrencyChange,
}: LocaleCurrencySelectorProps) {
  const [locale, setLocale] = useState<Locale>(currentLocale);
  const [currency, setCurrency] = useState<Currency>(currentCurrency);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    if (onLocaleChange) {
      onLocaleChange(newLocale);
    }
    // Salva in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('propertypilot_locale', newLocale);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
    // Salva in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('propertypilot_currency', newCurrency);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <Select value={locale} onValueChange={handleLocaleChange}>
        <SelectTrigger className="w-[140px] h-9 bg-transparent border-purple-500/30 text-white hover:border-purple-500/50">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-400" />
            <SelectValue>
              <span className="flex items-center gap-1">
                <span>{localeFlags[locale]}</span>
                <span className="hidden sm:inline">{localeNames[locale]}</span>
              </span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#0a0a0a] border-purple-500/30">
          {locales.map((loc) => (
            <SelectItem
              key={loc}
              value={loc}
              className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
            >
              <span className="flex items-center gap-2">
                <span>{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Currency Selector */}
      <Select value={currency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[120px] h-9 bg-transparent border-purple-500/30 text-white hover:border-purple-500/50">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-cyan-400" />
            <SelectValue>
              <span className="flex items-center gap-1">
                <span>{currencySymbols[currency]}</span>
                <span className="hidden sm:inline">{currency}</span>
              </span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#0a0a0a] border-purple-500/30">
          {currencies.map((curr) => (
            <SelectItem
              key={curr}
              value={curr}
              className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
            >
              <span className="flex items-center gap-2">
                <span>{currencySymbols[curr]}</span>
                <span>{curr} - {currencyNames[curr]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

