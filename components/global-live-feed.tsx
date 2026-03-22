"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Globe, Zap, Building2, Phone, Palette, TrendingDown, type LucideIcon } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { formatDateTimeForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

interface LiveActivity {
  id: string;
  type: "deal" | "call" | "staging" | "price_drop";
  message: string;
  location: string;
  timestamp: Date;
  country?: string;
}

const cities = [
  { name: "Milano", country: "IT", coords: { lat: 45.4642, lng: 9.19 } },
  { name: "Roma", country: "IT", coords: { lat: 41.9028, lng: 12.4964 } },
  { name: "Barcelona", country: "ES", coords: { lat: 41.3851, lng: 2.1734 } },
  { name: "Madrid", country: "ES", coords: { lat: 40.4168, lng: -3.7038 } },
  { name: "Miami", country: "US", coords: { lat: 25.7617, lng: -80.1918 } },
  { name: "New York", country: "US", coords: { lat: 40.7128, lng: -74.006 } },
  { name: "Los Angeles", country: "US", coords: { lat: 34.0522, lng: -118.2437 } },
  { name: "London", country: "GB", coords: { lat: 51.5074, lng: -0.1278 } },
  { name: "Paris", country: "FR", coords: { lat: 48.8566, lng: 2.3522 } },
  { name: "Dubai", country: "AE", coords: { lat: 25.2048, lng: 55.2708 } },
];

const ACTIVITY_ICON: Record<LiveActivity["type"], LucideIcon> = {
  deal: Building2,
  call: Phone,
  staging: Palette,
  price_drop: TrendingDown,
};

export function GlobalLiveFeed() {
  const { locale, timezone } = useLocaleContext();
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeLocations, setActiveLocations] = useState<Set<string>>(new Set());
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.liveFeed,
    [locale]
  );
  const ln = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.liveNetwork,
    [locale]
  );

  useEffect(() => {
    generateInitialActivities();

    const interval = setInterval(() => {
      generateNewActivity();
    }, Math.random() * 10000 + 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init and interval on mount only
  }, []);

  const generateInitialActivities = () => {
    const initial: LiveActivity[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(generateRandomActivity());
    }
    setActivities(initial);
  };

  const generateRandomActivity = (): LiveActivity => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const types = ["deal", "call", "staging", "price_drop"] as const;
    const activityType = types[Math.floor(Math.random() * types.length)];

    const messages = {
      deal: `${t.deal} ${t.infixDeal} ${city.name}`,
      call: `${t.call} ${t.infixCall} ${city.name}`,
      staging: `${t.staging} ${t.infixStaging} ${city.name}`,
      price_drop: `${t.priceDropLine} ${city.name}`,
    };

    const newActivity: LiveActivity = {
      id: Date.now().toString() + Math.random(),
      type: activityType,
      message: messages[activityType],
      location: city.name,
      timestamp: new Date(),
      country: city.country,
    };

    setActiveLocations((prev) => {
      const next = new Set(prev);
      next.add(city.name);
      setTimeout(() => {
        setActiveLocations((current) => {
          const updated = new Set(current);
          updated.delete(city.name);
          return updated;
        });
      }, 3000);
      return next;
    });

    return newActivity;
  };

  const generateNewActivity = () => {
    const newActivity = generateRandomActivity();
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  };

  const formatTime = (date: Date) => formatDateTimeForLocale(date, locale as Locale, timezone);

  return (
    <Card className="border-cyan-500/30 bg-[#0a0a0a]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-green-500/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400 animate-pulse" aria-hidden />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-cyan-400">{ln.cardTitle}</CardTitle>
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Activity className="h-3 w-3 mr-1" aria-hidden />
                  {ln.liveBadge}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white animate-pulse">
            <Zap className="h-3 w-3 mr-1" aria-hidden />
            {ln.liveBadge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-32 bg-[#111111] border border-cyan-500/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="h-16 w-16 text-cyan-500/20" aria-hidden />
          </div>
          {cities.map((city) => {
            const isActive = activeLocations.has(city.name);
            const left = 30 + (city.coords.lng % 40);
            const top = 30 + (city.coords.lat % 40);
            return (
              <div
                key={city.name}
                className={`absolute w-2 h-2 rounded-full transition-all ${
                  isActive
                    ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"
                    : "bg-cyan-500/30"
                }`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={city.name}
              />
            );
          })}
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {activities.map((activity) => {
            const Icon = ACTIVITY_ICON[activity.type];
            const color =
              activity.type === "deal"
                ? "text-amber-400"
                : activity.type === "call"
                  ? "text-green-400"
                  : activity.type === "staging"
                    ? "text-purple-400"
                    : "text-red-400";
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 bg-[#111111] border border-cyan-500/10 rounded hover:border-cyan-500/30 transition-colors"
              >
                <span className={`mt-0.5 shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${color}`}>{formatTime(activity.timestamp)}</span>
                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                      {activity.type === "deal"
                        ? t.deal
                        : activity.type === "call"
                          ? t.call
                          : activity.type === "staging"
                            ? t.staging
                            : t.priceDrop}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 font-mono">{activity.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-cyan-500/20 text-center">
          <p className="text-xs text-cyan-400 font-semibold">{t.cta}</p>
        </div>
      </CardContent>
    </Card>
  );
}
