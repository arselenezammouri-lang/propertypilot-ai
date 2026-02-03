"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Sparkles, Target } from "lucide-react";

interface ProfitStats {
  hoursSaved: number;
  valueGenerated: number;
  generationsThisMonth: number;
  avgTimePerGeneration: number;
}

export function ProfitDashboard() {
  const [stats, setStats] = useState<ProfitStats>({
    hoursSaved: 0,
    valueGenerated: 0,
    generationsThisMonth: 0,
    avgTimePerGeneration: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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
      <Card className="glass border-white/10 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-white/10 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/10 rounded"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-aqua/5 via-transparent to-electric-blue/5 pointer-events-none" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-neon-aqua" />
          <CardTitle className="text-base font-semibold">Il Tuo ROI Questo Mese</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-neon-aqua/10 to-transparent border border-neon-aqua/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-neon-aqua" />
              <span className="text-xs text-silver-frost/60 uppercase tracking-wide">Ore Risparmiate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{stats.hoursSaved}</span>
              <span className="text-sm text-silver-frost/60">ore</span>
            </div>
            <p className="text-xs text-silver-frost/50 mt-1">
              ~{stats.avgTimePerGeneration} min per annuncio
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-sunset-gold/10 to-transparent border border-sunset-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-sunset-gold" />
              <span className="text-xs text-silver-frost/60 uppercase tracking-wide">Valore Generato</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">€{stats.valueGenerated.toLocaleString('it-IT')}</span>
            </div>
            <p className="text-xs text-silver-frost/50 mt-1">
              €25/annuncio stimato
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-electric-blue" />
              <span className="text-sm text-silver-frost/80">Annunci generati</span>
            </div>
            <span className="text-lg font-bold text-white">{stats.generationsThisMonth}</span>
          </div>
        </div>

        {stats.hoursSaved > 10 && (
          <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-royal-purple/20 to-sunset-gold/20 border border-royal-purple/30">
            <p className="text-xs text-center">
              <span className="text-sunset-gold font-semibold">Fantastico!</span>{' '}
              <span className="text-silver-frost/80">Hai risparmiato più di 10 ore questo mese</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
