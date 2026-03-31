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
  const isIt = locale !== "en";
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  function openCommandPalette() {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: logo area — offset for mobile hamburger */}
        <div className="flex items-center gap-2.5 pl-10 lg:pl-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              PropertyPilot
            </span>
          </Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Command palette */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground h-8 px-3 rounded-lg"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">{isIt ? "Cerca..." : "Search..."}</span>
            <kbd className="hidden lg:inline-flex text-[10px] text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5 font-mono ml-1">
              {isMac ? "⌘" : "Ctrl"}K
            </kbd>
          </Button>

          <LanguageSelector />
          <ThemeToggle />

          {/* Quick generate */}
          <Link href="/dashboard/perfect-copy">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium"
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.dashboard.generate}</span>
            </Button>
          </Link>

          {/* Sign out */}
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              {t.dashboard.signOut}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
