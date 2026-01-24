"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  TerritoryInsights,
  DemandLevel,
  generateTerritoryInsights,
} from "@/lib/ai/territory-analysis";
import { PropertyCategory } from "@/lib/utils/property-category";

interface TerritoryCommanderProps {
  location: string;
  propertyCategory: PropertyCategory;
  propertyPrice?: number;
}

export function TerritoryCommander({
  location,
  propertyCategory,
  propertyPrice,
}: TerritoryCommanderProps) {
  const [insights, setInsights] = useState<TerritoryInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      // Simula caricamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const territoryData = generateTerritoryInsights(
        location,
        propertyCategory,
        propertyPrice
      );
      
      setInsights(territoryData);
      setIsLoading(false);
    };

    loadInsights();
  }, [location, propertyCategory, propertyPrice]);

  if (isLoading || !insights) {
    return (
      <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Analisi del Territorio & Domanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDemandColor = (level: DemandLevel) => {
    switch (level) {
      case 'hot':
        return 'bg-red-500 text-white';
      case 'warm':
        return 'bg-orange-500 text-white';
      case 'cold':
        return 'bg-blue-500 text-white';
    }
  };

  const getDemandIcon = (level: DemandLevel) => {
    switch (level) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '🌡️';
      case 'cold':
        return '❄️';
    }
  };

  const getVelocityColor = (category: string) => {
    if (category === 'ultra-fast' || category === 'fast') return 'text-green-400';
    if (category === 'slow' || category === 'very-slow') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getVelocityLabel = (category: string) => {
    const labels: Record<string, string> = {
      'ultra-fast': 'Ultra Veloce',
      'fast': 'Veloce',
      'normal': 'Normale',
      'slow': 'Lenta',
      'very-slow': 'Molto Lenta',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Istruzione': <School className="h-4 w-4" />,
      'Trasporti': <Train className="h-4 w-4" />,
      'Verde': <Trees className="h-4 w-4" />,
      'Business': <Building2 className="h-4 w-4" />,
      'Sicurezza': <Shield className="h-4 w-4" />,
    };
    return icons[category] || <Zap className="h-4 w-4" />;
  };

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/50">
              <MapPin className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Analisi del Territorio & Domanda</CardTitle>
              <p className="text-sm text-muted-foreground">{insights.location}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demand Pulse Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Demand Pulse
            </h3>
            <Badge className={`${getDemandColor(insights.demandPulse.level)} text-sm font-bold`}>
              {getDemandIcon(insights.demandPulse.level)} {insights.demandPulse.level.toUpperCase()}
            </Badge>
          </div>

          {/* Heatmap/Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Livello di domanda</span>
              <span className="text-sm font-semibold text-cyan-400">{insights.demandPulse.score}/100</span>
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
            
            {/* Trend */}
            <div className="flex items-center gap-2">
              {insights.demandPulse.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : insights.demandPulse.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-400" />
              ) : (
                <Minus className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-400">
                Trend: {insights.demandPulse.trend === 'up' ? 'In crescita' : insights.demandPulse.trend === 'down' ? 'In calo' : 'Stabile'}
              </span>
            </div>
          </div>
        </div>

        {/* Neighborhood DNA */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Neighborhood DNA
          </h3>

          {/* Strengths */}
          {insights.neighborhoodDNA.strengths.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Punti di forza</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.neighborhoodDNA.strengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                  >
                    <div className="text-2xl">{strength.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(strength.category)}
                        <span className="text-sm font-semibold text-white">{strength.category}</span>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{strength.description}</p>
                      <Progress value={strength.score} className="h-1.5 bg-green-500/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {insights.neighborhoodDNA.weaknesses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Punti deboli</p>
              <div className="space-y-2">
                {insights.neighborhoodDNA.weaknesses.map((weakness, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{weakness.category}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            weakness.impact === 'high'
                              ? 'border-red-500/50 text-red-400'
                              : weakness.impact === 'medium'
                              ? 'border-orange-500/50 text-orange-400'
                              : 'border-yellow-500/50 text-yellow-400'
                          }`}
                        >
                          {weakness.impact === 'high' ? 'Alto' : weakness.impact === 'medium' ? 'Medio' : 'Basso'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{weakness.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Score */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">DNA Score Complessivo</span>
              <span className="text-lg font-bold text-cyan-400">{insights.neighborhoodDNA.overallScore}/100</span>
            </div>
            <Progress value={insights.neighborhoodDNA.overallScore} className="h-2 bg-purple-500/20" />
          </div>
        </div>

        {/* Sold Velocity Tracker */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            Sold Velocity Tracker
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Tempo medio vendita</p>
              <p className="text-2xl font-bold text-cyan-400">{insights.soldVelocity.averageDays}</p>
              <p className="text-xs text-gray-500">giorni</p>
            </div>
            <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Categoria</p>
              <p className={`text-lg font-bold ${getVelocityColor(insights.soldVelocity.velocityCategory)}`}>
                {getVelocityLabel(insights.soldVelocity.velocityCategory)}
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="p-4 bg-[#111111] border border-cyan-500/20 rounded-lg space-y-2">
            <p className="text-xs text-gray-400 mb-2">Confronto con media città</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Media città</span>
              <span className="text-sm font-semibold text-gray-400">{insights.soldVelocity.comparison.cityAverage} giorni</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Media quartiere</span>
              <span className="text-sm font-semibold text-cyan-400">{insights.soldVelocity.comparison.neighborhoodAverage} giorni</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-cyan-500/20">
              {insights.soldVelocity.trend === 'faster' ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400">Più veloce della media città</span>
                </>
              ) : insights.soldVelocity.trend === 'slower' ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400">Più lento della media città</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-400">In linea con la media città</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Commercial Intelligence */}
        {insights.commercialIntelligence && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-400" />
              Commercial Intelligence
            </h3>

            {/* Recommended Activities */}
            {insights.commercialIntelligence.recommendedActivities.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Target di Attività Consigliato</p>
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

            {/* Market Gaps */}
            {insights.commercialIntelligence.marketGaps.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Gap di Mercato</p>
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
                            gap.potential === 'high'
                              ? 'border-green-500/50 text-green-400'
                              : gap.potential === 'medium'
                              ? 'border-yellow-500/50 text-yellow-400'
                              : 'border-gray-500/50 text-gray-400'
                          }`}
                        >
                          {gap.potential === 'high' ? 'Alto' : gap.potential === 'medium' ? 'Medio' : 'Basso'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{gap.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foot Traffic & Competition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Passaggio Pedonale</p>
                <p className={`text-sm font-bold ${
                  insights.commercialIntelligence.footTraffic === 'high' ? 'text-green-400' :
                  insights.commercialIntelligence.footTraffic === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {insights.commercialIntelligence.footTraffic === 'high' ? 'Alto' :
                   insights.commercialIntelligence.footTraffic === 'medium' ? 'Medio' :
                   'Basso'}
                </p>
              </div>
              <div className="p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Livello Competizione</p>
                <p className={`text-sm font-bold ${
                  insights.commercialIntelligence.competitionLevel === 'high' ? 'text-red-400' :
                  insights.commercialIntelligence.competitionLevel === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {insights.commercialIntelligence.competitionLevel === 'high' ? 'Alto' :
                   insights.commercialIntelligence.competitionLevel === 'medium' ? 'Medio' :
                   'Basso'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Market Advice */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-400 mb-1">Aria Market Insight</p>
              <p className="text-sm text-gray-300">{insights.marketAdvice}</p>
            </div>
          </div>
        </div>

        {/* Aria Strategy - Pitch di Quartiere */}
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-cyan-400 mb-1">Aria Strategy - Pitch di Quartiere</p>
              <p className="text-sm text-gray-300 italic">"{insights.neighborhoodPitch}"</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

