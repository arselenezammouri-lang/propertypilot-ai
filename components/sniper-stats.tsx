"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingDown, History } from "lucide-react";

interface SniperStats {
  price_drops_today: number;
  expiration_opportunities: number;
}

export function SniperStats() {
  const [stats, setStats] = useState<SniperStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/prospecting/price-drops");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching sniper stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-400">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Ribassi Oggi</p>
              <h3 className="text-3xl md:text-4xl font-black text-red-400">—</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500/30 to-red-500/10 rounded-2xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">Rilevati</p>
        </div>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-450">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Scadenze</p>
              <h3 className="text-3xl md:text-4xl font-black text-cyan-400">—</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 rounded-2xl flex items-center justify-center">
              <History className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">Opportunità</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Ribassi Rilevati Oggi */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-400" data-testid="card-price-drops">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Ribassi Oggi</p>
            <h3 className="text-3xl md:text-4xl font-black text-red-400">
              {stats.price_drops_today}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500/30 to-red-500/10 rounded-2xl flex items-center justify-center shadow-glow-red">
            <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          Rilevati nelle ultime 48h
        </p>
      </div>

      {/* Opportunità di Scadenza */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-450" data-testid="card-expiration-opportunities">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Scadenze</p>
            <h3 className="text-3xl md:text-4xl font-black text-cyan-400">
              {stats.expiration_opportunities}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 rounded-2xl flex items-center justify-center shadow-glow-cyan">
            <History className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          Immobili offline 120+ giorni
        </p>
      </div>
    </>
  );
}

