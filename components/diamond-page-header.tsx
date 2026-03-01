"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PropertyPilotLogo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";

export function DiamondPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#000000]/90">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
            <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12" />
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              PropertyPilot AI
            </span>
          </Link>
          <nav className="flex items-center space-x-2 md:space-x-4">
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
