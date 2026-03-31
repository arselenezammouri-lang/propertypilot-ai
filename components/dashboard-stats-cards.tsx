"use client";

import { Crown, CreditCard, BarChart3, FileText } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

interface DashboardStatsCardsProps {
  currentPlan: string;
  limits: { used: number; listings: number };
  savedCount?: number;
}

export function DashboardStatsCards({ currentPlan, limits, savedCount = 0 }: DashboardStatsCardsProps) {
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
      {/* Current Plan */}
      <div className="pp-stat-card animate-fade-in-up" data-testid="card-current-plan">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.currentPlan}
          </p>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-bold capitalize flex items-center gap-2 mb-1">
          {currentPlan}
          {currentPlan !== "free" && <Crown className="h-4 w-4 text-amber-500" />}
        </h3>
        <p className="text-sm text-muted-foreground">{planDesc}</p>
      </div>

      {/* This Month */}
      <div className="pp-stat-card animate-fade-in-up delay-100" data-testid="card-listings-count">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.thisMonth}
          </p>
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">
          {limits.used}
          {limits.listings > 0 && (
            <span className="text-base text-muted-foreground font-normal ml-1">/ {limits.listings}</span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{remainingText}</p>
      </div>

      {/* Saved Listings */}
      <div className="pp-stat-card animate-fade-in-up delay-200" data-testid="card-saved-listings">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.saved}
          </p>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{savedCount}</h3>
        <p className="text-sm text-muted-foreground">
          {savedCount > 0
            ? (locale === 'it' ? `${savedCount} annunci salvati` : `${savedCount} saved listings`)
            : t.dashboard.noSavedListings}
        </p>
      </div>
    </>
  );
}
