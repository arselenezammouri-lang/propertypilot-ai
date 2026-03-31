"use client";

import { Sparkles } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

export function DashboardProTips() {
  const { locale } = useLocaleContext();

  const t = {
    it: {
      title: "Suggerimenti Pro per Annunci Migliori",
      tip1: "Includi dettagli specifici su posizione, servizi e caratteristiche uniche",
      tip2: "Usa metrature accurate e numero stanze per risultati AI migliori",
      tip3: "Genera più versioni e scegli quella che si adatta meglio alle tue esigenze",
    },
    en: {
      title: "Pro Tips for Better Listings",
      tip1: "Include specific details about location, amenities, and unique features",
      tip2: "Use accurate square footage and room count for better AI results",
      tip3: "Generate multiple versions and choose the one that best fits your needs",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" aria-label={locale === "it" ? "Suggerimenti Pro" : "Pro Tips"}>
      <div className="pp-card p-8 md:p-10 bg-gradient-to-br from-blue-600/10 to-blue-500/5 border-blue-600/30 animate-fade-in-up delay-600">
        <div className="flex items-start space-x-5">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient-blue">{t.title}</h3>
            <ul className="space-y-3 text-base md:text-lg text-muted-foreground">
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip1}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip2}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-amber-500 mt-1.5 text-xl font-bold">•</span>
                <span>{t.tip3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
