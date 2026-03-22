"use client";

import { Sparkles } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";

export function DashboardProTips() {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale).dashboard.proTips;

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      aria-label={t.ariaSection}
    >
      <div className="futuristic-card p-8 md:p-10 bg-gradient-to-br from-royal-purple/10 to-electric-blue/5 border-royal-purple/30 animate-fade-in-up delay-600">
        <div className="flex items-start space-x-5">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-purple">
            <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-royal-purple" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text-purple">{t.title}</h3>
            <ul className="space-y-3 text-base md:text-lg text-muted-foreground">
              <li className="flex items-start space-x-3">
                <span className="text-neon-aqua mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip1}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-electric-blue mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip2}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-sunset-gold mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
