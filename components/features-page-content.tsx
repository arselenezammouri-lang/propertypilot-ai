"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import {
  Sparkles,
  FileText,
  Zap,
  Globe,
  BarChart3,
  Shield,
  Bot,
  Users,
  Building2,
  Target,
  MessageCircle,
  Brain,
  Search,
} from "lucide-react";

const featureIcons = [
  Sparkles,
  FileText,
  Globe,
  BarChart3,
  Bot,
  Users,
  Building2,
  Shield,
  Target,
  MessageCircle,
  Brain,
  Search,
];

export function FeaturesPageContent() {
  const { locale } = useLocaleContext();
  const t = useMemo(() => getTranslation(locale as SupportedLocale).marketingFeatures, [locale]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
            <Zap className="h-7 w-7 text-[#9333ea]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {t.titleWord}{" "}
              <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                PropertyPilot AI
              </span>
            </h1>
            <p className="text-white/60 mt-1">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {t.features.map((feature, i) => {
          const Icon = featureIcons[i] ?? Sparkles;
          return (
            <div key={i} className="diamond-card border border-white/[0.08] rounded-xl p-6 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#9333ea]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-white/10">{t.viewPricing}</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            {t.backHome}
          </Button>
        </Link>
      </div>
    </main>
  );
}
