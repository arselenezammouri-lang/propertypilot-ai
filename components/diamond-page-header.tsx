"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { PropertyPilotLogo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

export function DiamondPageHeader() {
  const { locale, currency, setLocale, setCurrency } = useLocaleContext();
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#000000]/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
            <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
            <div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                PropertyPilot AI
              </span>
              <span className="text-xs text-white/50 hidden sm:block">
                Pilot Your Agency to the Next Level
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-2 md:gap-4">
            <LocaleCurrencySelector
              currentLocale={locale}
              currentCurrency={currency}
              onLocaleChange={setLocale}
              onCurrencyChange={setCurrency}
            />
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 border border-white/10 hover:border-white/20" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Torna alla Home</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
