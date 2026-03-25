"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Zap,
  School,
  Train,
  Trees,
  Building2,
  Shield,
  AlertTriangle,
  Sparkles,
  Flame,
  Thermometer,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import {
  TerritoryInsights,
  DemandLevel,
  generateTerritoryInsights,
  type DnaCategoryId,
} from "@/lib/ai/territory-analysis";
import { PropertyCategory } from "@/lib/utils/property-category";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

interface TerritoryCommanderProps {
  location: string;
  propertyCategory: PropertyCategory;
  propertyPrice?: number;
}

const DNA_ICON: Record<DnaCategoryId, LucideIcon> = {
  education: School,
  transport: Train,
  green: Trees,
  business: Building2,
  security: Shield,
};

const DEMAND_ICON: Record<DemandLevel, LucideIcon> = {
  hot: Flame,
  warm: Thermometer,
  cold: Snowflake,
};

export function TerritoryCommander({
  location,
  propertyCategory,
  propertyPrice,
}: TerritoryCommanderProps) {
  const { locale } = useLocale();
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).prospectingModals.territoryCommanderLabels,
    [locale]
  );

  const [insights, setInsights] = useState<TerritoryInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const territoryData = generateTerritoryInsights(
        location,
        propertyCategory,
        locale as Locale,
        propertyPrice
      );

      setInsights(territoryData);
      setIsLoading(false);
    };

    loadInsights();
  }, [location, propertyCategory, propertyPrice, locale]);

  const categoryLabels = useMemo(
    (): Record<DnaCategoryId, string> => ({
      education: t.categoryEducation,
      transport: t.categoryTransport,
      green: t.categoryGreen,
      business: t.categoryBusiness,
      security: t.categorySecurity,
    }),
    [t]
  );

  if (isLoading || !insights) {
    return (
      <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" aria-hidden />
            {t.cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDemandColor = (level: DemandLevel) => {
    switch (level) {
      case "hot":
        return "bg-red-500 text-white";
      case "warm":
        return "bg-orange-500 text-white";
      case "cold":
        return "bg-blue-500 text-white";
    }
  };

  const demandLabel = (level: DemandLevel) => {
    if (level === "hot") return t.demandHot;
    if (level === "warm") return t.demandWarm;
    return t.demandCold;
  };

  const getVelocityColor = (category: string) => {
    if (category === "ultra-fast" || category === "fast") return "text-green-400";
    if (category === "slow" || category === "very-slow") return "text-red-400";
    return "text-yellow-400";
  };

  const getVelocityLabel = (category: string) => {
    const labels: Record<string, string> = {
      "ultra-fast": t.velocityUltraFast,
      fast: t.velocityFast,
      normal: t.velocityNormal,
      slow: t.velocitySlow,
      "very-slow": t.velocityVerySlow,
    };
    return labels[category] || category;
  };

  const DemandIcon = DEMAND_ICON[insights.demandPulse.level];

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/50">
              <MapPin className="h-6 w-6 text-cyan-400" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-xl text-white">{t.cardTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{insights.location}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" aria-hidden />
              {t.demandPulse}
            </h3>
            <Badge className={`${getDemandColor(insights.demandPulse.level)} text-sm font-bold flex items-center gap-1`}>
              <DemandIcon className="h-4 w-4" aria-hidden />
              {demandLabel(insights.demandPulse.level)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{t.demandScoreLabel}</span>
              <span className="text-sm font-semibold text-cyan-400">
                {insights.demandPulse.score}/100
              </span>
            </div>
            <div className="relative h-8 bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 rounded-lg overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white/30 backdrop-blur-sm transition-all duration-500"
                style={{ width: `${insights.demandPulse.score}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-full bg-white shadow-lg"
                style={{ left: `${insights.demandPulse.score}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{insights.demandPulse.description}</p>

            <div className="flex items-center gap-2">
              {insights.demandPulse.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-400" aria-hidden />
              ) : insights.demandPulse.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-400" aria-hidden />
              ) : (
                <Minus className="h-4 w-4 text-gray-400" aria-hidden />
              )}
              <span className="text-xs text-gray-400">
                {t.trendLabel}{" "}
                {insights.demandPulse.trend === "up"
                  ? t.trendUp
                  : insights.demandPulse.trend === "down"
                    ? t.trendDown
                    : t.trendStable}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" aria-hidden />
            {t.neighborhoodDna}
          </h3>

          {insights.neighborhoodDNA.strengths.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">{t.strengths}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.neighborhoodDNA.strengths.map((strength, idx) => {
                  const Icon = DNA_ICON[strength.category] ?? Zap;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-green-400 shrink-0" aria-hidden />
                          <span className="text-sm font-semibold text-white">
                            {categoryLabels[strength.category]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">{strength.description}</p>
                        <Progress value={strength.score} className="h-1.5 bg-green-500/20" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {insights.neighborhoodDNA.weaknesses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">{t.weaknesses}</p>
              <div className="space-y-2">
                {insights.neighborhoodDNA.weaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" aria-hidden />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {categoryLabels[weakness.category]}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            weakness.impact === "high"
                              ? "border-red-500/50 text-red-400"
                              : weakness.impact === "medium"
                                ? "border-orange-500/50 text-orange-400"
                                : "border-yellow-500/50 text-yellow-400"
                          }`}
                        >
                          {weakness.impact === "high"
                            ? t.high
                            : weakness.impact === "medium"
                              ? t.medium
                              : t.low}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{weakness.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{t.overallDnaScore}</span>
              <span className="text-lg font-bold text-cyan-400">
                {insights.neighborhoodDNA.overallScore}/100
              </span>
            </div>
            <Progress value={insights.neighborhoodDNA.overallScore} className="h-2 bg-purple-500/20" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" aria-hidden />
            {t.soldVelocity}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">{t.avgSaleTime}</p>
              <p className="text-2xl font-bold text-cyan-400">{insights.soldVelocity.averageDays}</p>
              <p className="text-xs text-gray-500">{t.days}</p>
            </div>
            <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">{t.category}</p>
              <p
                className={`text-lg font-bold ${getVelocityColor(insights.soldVelocity.velocityCategory)}`}
              >
                {getVelocityLabel(insights.soldVelocity.velocityCategory)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg space-y-2">
            <p className="text-xs text-gray-400 mb-2">{t.vsCityAvg}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{t.cityAverage}</span>
              <span className="text-sm font-semibold text-gray-400">
                {insights.soldVelocity.comparison.cityAverage} {t.days}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{t.neighborhoodAverage}</span>
              <span className="text-sm font-semibold text-cyan-400">
                {insights.soldVelocity.comparison.neighborhoodAverage} {t.days}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-cyan-500/20">
              {insights.soldVelocity.trend === "faster" ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-400" aria-hidden />
                  <span className="text-xs text-green-400">{t.fasterThanCity}</span>
                </>
              ) : insights.soldVelocity.trend === "slower" ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-400" aria-hidden />
                  <span className="text-xs text-red-400">{t.slowerThanCity}</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-gray-400" aria-hidden />
                  <span className="text-xs text-gray-400">{t.inlineWithCity}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {insights.commercialIntelligence && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-400" aria-hidden />
              {t.commercialIntel}
            </h3>

            {insights.commercialIntelligence.recommendedActivities.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">{t.recommendedTargets}</p>
                <div className="grid grid-cols-1 gap-3">
                  {insights.commercialIntelligence.recommendedActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{activity.activity}</p>
                          <p className="text-xs text-gray-300 mt-1">{activity.reason}</p>
                        </div>
                        <Badge className="bg-purple-500 text-white">
                          {activity.opportunityScore}/100
                        </Badge>
                      </div>
                      <Progress value={activity.opportunityScore} className="h-1.5 bg-purple-500/20" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.commercialIntelligence.marketGaps.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">{t.marketGaps}</p>
                <div className="space-y-2">
                  {insights.commercialIntelligence.marketGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-amber-400">{gap.category}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            gap.potential === "high"
                              ? "border-green-500/50 text-green-400"
                              : gap.potential === "medium"
                                ? "border-yellow-500/50 text-yellow-400"
                                : "border-white/10 text-white/40"
                          }`}
                        >
                          {gap.potential === "high"
                            ? t.high
                            : gap.potential === "medium"
                              ? t.medium
                              : t.low}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{gap.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">{t.footTraffic}</p>
                <p
                  className={`text-sm font-bold ${
                    insights.commercialIntelligence.footTraffic === "high"
                      ? "text-green-400"
                      : insights.commercialIntelligence.footTraffic === "medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {insights.commercialIntelligence.footTraffic === "high"
                    ? t.high
                    : insights.commercialIntelligence.footTraffic === "medium"
                      ? t.medium
                      : t.low}
                </p>
              </div>
              <div className="p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">{t.competitionLevel}</p>
                <p
                  className={`text-sm font-bold ${
                    insights.commercialIntelligence.competitionLevel === "high"
                      ? "text-red-400"
                      : insights.commercialIntelligence.competitionLevel === "medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {insights.commercialIntelligence.competitionLevel === "high"
                    ? t.high
                    : insights.commercialIntelligence.competitionLevel === "medium"
                      ? t.medium
                      : t.low}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-400 mb-1">{t.ariaMarketInsight}</p>
              <p className="text-sm text-gray-300">{insights.marketAdvice}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-semibold text-cyan-400 mb-1">{t.ariaStrategyTitle}</p>
              <p className="text-sm text-gray-300 italic">&quot;{insights.neighborhoodPitch}&quot;</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
