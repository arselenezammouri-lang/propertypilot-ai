"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingDown, History, AlertTriangle } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { useAPIErrorHandler } from "@/components/error-boundary";

interface SniperStats {
  price_drops_today: number;
  expiration_opportunities: number;
}

export function SniperStats() {
  const { locale } = useLocaleContext();
  const [stats, setStats] = useState<SniperStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAPIError } = useAPIErrorHandler();
  const t = getTranslation(locale as SupportedLocale).dashboard.sniperStats;

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/prospecting/price-drops");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || t.loadError);
      }
    } catch (err: any) {
      console.error("Error fetching sniper stats:", err);
      setError(handleAPIError(err, t.loadError));
    } finally {
      setLoading(false);
    }
  }, [handleAPIError, t.loadError]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-400">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.priceDropsToday}</p>
              <h3 className="text-3xl md:text-4xl font-black text-red-400">—</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500/30 to-red-500/10 rounded-2xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">{t.detected}</p>
        </div>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-450">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.expirations}</p>
              <h3 className="text-3xl md:text-4xl font-black text-cyan-400">—</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 rounded-2xl flex items-center justify-center">
              <History className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">{t.opportunities}</p>
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <Card className="futuristic-card p-8 md:p-10 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || t.loadError}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Ribassi Rilevati Oggi */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-400" data-testid="card-price-drops">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.priceDropsToday}</p>
            <h3 className="text-3xl md:text-4xl font-black text-red-400">
              {stats.price_drops_today}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500/30 to-red-500/10 rounded-2xl flex items-center justify-center shadow-glow-red">
            <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {t.last48h}
        </p>
      </div>

      {/* Opportunità di Scadenza */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-450" data-testid="card-expiration-opportunities">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.expirations}</p>
            <h3 className="text-3xl md:text-4xl font-black text-cyan-400">
              {stats.expiration_opportunities}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 rounded-2xl flex items-center justify-center shadow-glow-cyan">
            <History className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {t.offline120}
        </p>
      </div>
    </>
  );
}

