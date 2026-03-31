"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { Zap, Search, Home } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
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
      className="fixed top-0 left-0 right-0 z-50 pp-glass border-b border-border/50"
      data-testid="dashboard-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Home className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight hidden sm:block">
              PropertyPilot
            </span>
          </Link>

          <nav className="flex items-center gap-1.5" aria-label="Main navigation">
            <Button
              variant="ghost"
              size="sm"
              onClick={openCommandPalette}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground h-9 px-3 rounded-lg"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">{isIt ? "Cerca..." : "Search..."}</span>
              <kbd className="hidden lg:inline-flex text-[10px] text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5 font-mono ml-1">
                {isMac ? '⌘' : 'Ctrl'}K
              </kbd>
            </Button>

            <LanguageSelector />
            <ThemeToggle />

            <Link href="/dashboard/listings" className="hidden md:inline-flex">
              <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium">
                <Zap className="h-3.5 w-3.5" />
                {t.dashboard.generate}
              </Button>
            </Link>

            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground hover:text-foreground">
                {t.dashboard.signOut}
              </Button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}
