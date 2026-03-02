"use client";

import { Crown, CreditCard, BarChart3, Sparkles } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

interface DashboardStatsCardsProps {
  currentPlan: string;
  limits: { used: number; listings: number };
}

export function DashboardStatsCards({ currentPlan, limits }: DashboardStatsCardsProps) {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);

  const planDesc = {
    free: t.dashboard.planFree,
    starter: t.dashboard.planStarter,
    pro: t.dashboard.planPro,
    agency: t.dashboard.planAgency,
  }[currentPlan] ?? t.dashboard.planFree;

  const remainingText = limits.listings === -1
    ? t.dashboard.unlimitedAvailable
    : `${limits.listings - limits.used} ${t.dashboard.remainingListings}`;

  return (
    <>
      {/* Current Plan Card */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up" data-testid="card-current-plan">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-royal-purple/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.dashboard.currentPlan}</p>
            <h3 className="text-3xl md:text-4xl font-black capitalize gradient-text-purple flex items-center gap-2">
              {currentPlan}
              {currentPlan !== "free" && <Crown className="h-6 w-6 text-sunset-gold" />}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center shadow-glow-purple">
            <CreditCard className="h-6 w-6 md:h-7 md:w-7 text-royal-purple" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {planDesc}
        </p>
      </div>

      {/* This Month Card */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-100" data-testid="card-listings-count">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-blue/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.dashboard.thisMonth}</p>
            <h3 className="text-3xl md:text-4xl font-black text-electric-blue">
              {limits.used}
              {limits.listings > 0 && (
                <span className="text-xl text-muted-foreground font-semibold">/{limits.listings}</span>
              )}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-electric-blue/30 to-electric-blue/10 rounded-2xl flex items-center justify-center shadow-glow-blue">
            <BarChart3 className="h-6 w-6 md:h-7 md:w-7 text-electric-blue" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {remainingText}
        </p>
      </div>

      {/* Saved Listings Card */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-200" data-testid="card-saved-listings">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-aqua/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.dashboard.saved}</p>
            <h3 className="text-3xl md:text-4xl font-black text-neon-aqua">0</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-neon-aqua/30 to-neon-aqua/10 rounded-2xl flex items-center justify-center shadow-glow-aqua">
            <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-neon-aqua" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {t.dashboard.noSavedListings}
        </p>
      </div>
    </>
  );
}
