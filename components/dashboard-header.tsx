"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyPilotLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegionSelector } from "@/components/region-selector";
import { LanguageSelector } from "@/components/language-selector";
import { Zap } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

export function DashboardHeader() {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
              <p className="text-xs text-muted-foreground font-medium">Pilot Your Agency to the Next Level</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-1.5 md:space-x-3">
            <LanguageSelector />
            <RegionSelector />
            <ThemeToggle />
            <Link href="/dashboard/listings" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="hover:text-royal-purple transition-colors" data-testid="button-generate">
                <Zap className="mr-2 h-4 w-4" />
                {t.dashboard.generate}
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" size="sm" className="border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all" data-testid="button-signout">
                {t.dashboard.signOut}
              </Button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}
