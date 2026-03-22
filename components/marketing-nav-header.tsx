"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyPilotLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { Rocket } from "lucide-react";

/**
 * Header condiviso per tutte le pagine marketing: Logo unificato + tagline + cambio lingua + tema.
 * Garantisce coerenza PropertyPilot AI + "Pilot Your Agency to the Next Level" in tutto il SaaS.
 */
export function MarketingNavHeader() {
  const { locale: currentLocale, currency, setLocale, setCurrency } = useLocaleContext();
  const t = useMemo(() => getTranslation(currentLocale as SupportedLocale), [currentLocale]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#000000]/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <PropertyPilotLogo className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0" />
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent block">
                PropertyPilot AI
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">{t.landing.nav.tagline}</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <span className="text-xs text-gray-500 hidden lg:inline mr-2">
              {t.landing.nav.tagline}
            </span>
            <LocaleCurrencySelector
              currentLocale={currentLocale}
              currentCurrency={currency}
              onLocaleChange={setLocale}
              onCurrencyChange={setCurrency}
            />
            <ThemeToggle />
            <Link href="/#features">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-300 hover:text-white">
                {t.landing.nav.features}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-300 hover:text-white">
                {t.landing.nav.pricing}
              </Button>
            </Link>
            <Link href="/contatti">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex text-gray-300 hover:text-white">
                {t.landing.footer.contact}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                {t.landing.nav.login}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:opacity-90 text-white border-0">
                {t.landing.nav.getStarted}
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
