"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { Heart, Target, Zap, Globe, Shield } from "lucide-react";

export function AboutPageContent() {
  const { locale } = useLocaleContext();
  const copy = useMemo(() => getTranslation(locale as SupportedLocale).marketingAbout, [locale]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#06b6d4]/50 bg-[#06b6d4]/10 flex items-center justify-center">
            <Heart className="h-7 w-7 text-[#06b6d4]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {copy.title}{" "}
              <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                PropertyPilot AI
              </span>
            </h1>
            <p className="text-white/60 mt-1">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#9333ea]" />
            {copy.missionTitle}
          </h2>
          <p className="text-white/70 leading-relaxed">{copy.missionBody}</p>
        </section>

        <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#06b6d4]" />
            {copy.whatTitle}
          </h2>
          <p className="text-white/70 leading-relaxed">{copy.whatBody}</p>
        </section>

        <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#9333ea]" />
            {copy.marketsTitle}
          </h2>
          <p className="text-white/70 leading-relaxed">{copy.marketsBody}</p>
        </section>

        <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#06b6d4]" />
            {copy.securityTitle}
          </h2>
          <p className="text-white/70 leading-relaxed">
            {copy.securityBody}{" "}
            <Link href="/privacy" className="text-[#9333ea] hover:text-[#a855f7] underline">
              {copy.privacyLink}
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/contatti">
          <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-white/10">{copy.contact}</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            {copy.home}
          </Button>
        </Link>
      </div>
    </main>
  );
}
