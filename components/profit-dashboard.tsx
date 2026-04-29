"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Sparkles, Target } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

interface ProfitStats {
  hoursSaved: number;
  valueGenerated: number;
  generationsThisMonth: number;
  avgTimePerGeneration: number;
}

export function ProfitDashboard() {
  const { locale, currency } = useLocaleContext();
  const [stats, setStats] = useState<ProfitStats>({
    hoursSaved: 0,
    valueGenerated: 0,
    generationsThisMonth: 0,
    avgTimePerGeneration: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const t = {
    it: {
      title: "Il Tuo ROI Questo Mese",
      hoursSaved: "Ore Risparmiate",
      hours: "ore",
      perListing: "min per annuncio",
      valueGenerated: "Valore Generato",
      estimatedValue: "annuncio stimato",
      generatedListings: "Annunci generati",
      amazing: "Fantastico!",
      saved10Hours: "Hai risparmiato più di 10 ore questo mese",
    },
    en: {
      title: "Your ROI This Month",
      hoursSaved: "Hours Saved",
      hours: "hrs",
      perListing: "min per listing",
      valueGenerated: "Value Generated",
      estimatedValue: "estimated per listing",
      generatedListings: "Listings generated",
      amazing: "Amazing!",
      saved10Hours: "You saved more than 10 hours this month",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/usage');
      if (response.ok) {
        const data = await response.json();
        const generations = data.currentUsage || 0;
        
        const TIME_SAVED_PER_GENERATION = 45;
        const VALUE_PER_GENERATION = 25;
        
        const hoursSaved = Math.round((generations * TIME_SAVED_PER_GENERATION) / 60 * 10) / 10;
        const valueGenerated = generations * VALUE_PER_GENERATION;

        setStats({
          hoursSaved,
          valueGenerated,
          generationsThisMonth: generations,
          avgTimePerGeneration: TIME_SAVED_PER_GENERATION,
        });
      }
    } catch (error) {
      console.error('Error fetching profit stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="glass border-border animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-muted/50 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-muted/50 rounded"></div>
            <div className="h-20 bg-muted/50 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col pp-card border-border overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <CardTitle className="text-base font-semibold">{t.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="relative flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{t.hoursSaved}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{stats.hoursSaved}</span>
              <span className="text-sm text-muted-foreground">{t.hours}</span>
            </div>
            <p className="text-xs text-muted/300 mt-1">
              ~{stats.avgTimePerGeneration} {t.perListing}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400/10 to-transparent border border-amber-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{t.valueGenerated}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{formatCurrencyForLocale(stats.valueGenerated, locale as Locale, currency)}</span>
            </div>
            <p className="text-xs text-muted/300 mt-1">
              {formatCurrencyForLocale(25, locale as Locale, currency)}/{t.estimatedValue}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">{t.generatedListings}</span>
            </div>
            <span className="text-lg font-bold text-foreground">{stats.generationsThisMonth}</span>
          </div>
        </div>

        {stats.hoursSaved > 10 && (
          <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-amber-100 border border-blue-600/30">
            <p className="text-xs text-center">
              <span className="text-amber-500 font-semibold">{t.amazing}</span>{' '}
              <span className="text-muted-foreground">{t.saved10Hours}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
