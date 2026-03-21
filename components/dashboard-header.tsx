"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyPilotLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegionSelector } from "@/components/region-selector";
import { LanguageSelector } from "@/components/language-selector";
import { Zap, Search } from "lucide-react";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
  const safeTagline = t?.landing?.nav?.tagline || 'AI Operating System for Real Estate';
  const safeGenerate = t?.dashboard?.generate || (locale === 'it' ? 'Genera' : 'Generate');
  const safeSignOut = t?.dashboard?.signOut || (locale === 'it' ? 'Esci' : 'Sign out');
  const isIt = locale !== 'en';
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);

  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    document.dispatchEvent(event);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10"
      data-testid="dashboard-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
              <p className="text-xs text-muted-foreground font-medium">{safeTagline}</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-1.5 md:space-x-3" aria-label={isIt ? "Navigazione principale" : "Main navigation"}>
            <DashboardMobileNav />
            {/* Command Palette trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openCommandPalette}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all rounded-lg px-3 h-9 min-h-[36px] focus-visible:ring-2 focus-visible:ring-royal-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label={isIt ? "Apri ricerca rapida" : "Open quick search"}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">{isIt ? "Cerca..." : "Search..."}</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/60 bg-muted/40 rounded px-1.5 py-0.5 font-mono ml-1">
                {isMac ? '⌘' : 'Ctrl'}K
              </kbd>
            </Button>
            <LanguageSelector />
            <RegionSelector />
            <ThemeToggle />
            <Link href="/dashboard/listings" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="min-h-[36px] hover:text-royal-purple transition-colors focus-visible:ring-2 focus-visible:ring-royal-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black" data-testid="button-generate">
                <Zap className="mr-2 h-4 w-4" />
                {safeGenerate}
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" size="sm" className="min-h-[36px] border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all focus-visible:ring-2 focus-visible:ring-royal-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black" data-testid="button-signout">
                {safeSignOut}
              </Button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}
