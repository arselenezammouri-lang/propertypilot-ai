"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Globe, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface LiveActivity {
  id: string;
  type: "deal" | "call" | "staging" | "price_drop";
  message: string;
  location: string;
  timestamp: Date;
  country?: string;
}

const cities = [
  { name: "Milano", country: "IT", coords: { lat: 45.4642, lng: 9.1900 } },
  { name: "Roma", country: "IT", coords: { lat: 41.9028, lng: 12.4964 } },
  { name: "Barcelona", country: "ES", coords: { lat: 41.3851, lng: 2.1734 } },
  { name: "Madrid", country: "ES", coords: { lat: 40.4168, lng: -3.7038 } },
  { name: "Miami", country: "US", coords: { lat: 25.7617, lng: -80.1918 } },
  { name: "New York", country: "US", coords: { lat: 40.7128, lng: -74.0060 } },
  { name: "Los Angeles", country: "US", coords: { lat: 34.0522, lng: -118.2437 } },
  { name: "London", country: "GB", coords: { lat: 51.5074, lng: -0.1278 } },
  { name: "Paris", country: "FR", coords: { lat: 48.8566, lng: 2.3522 } },
  { name: "Dubai", country: "AE", coords: { lat: 25.2048, lng: 55.2708 } },
];

const activityTypes = [
  {
    type: "deal" as const,
    emoji: "🏢",
    label: "Deal Oro",
    color: "text-amber-400",
  },
  {
    type: "call" as const,
    emoji: "📞",
    label: "Chiamata AI",
    color: "text-green-400",
  },
  {
    type: "staging" as const,
    emoji: "🎨",
    label: "Virtual Staging",
    color: "text-purple-400",
  },
  {
    type: "price_drop" as const,
    emoji: "📉",
    label: "Price Drop",
    color: "text-red-400",
  },
];

export function GlobalLiveFeed() {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeLocations, setActiveLocations] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    // Genera attività iniziale
    generateInitialActivities();

    // Genera nuove attività ogni 10-20 secondi
    const interval = setInterval(() => {
      generateNewActivity();
    }, Math.random() * 10000 + 10000); // 10-20 secondi

    return () => clearInterval(interval);
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
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

    const messages = {
      deal: `Deal Oro rilevato a ${city.name}`,
      call: `Chiamata AI fissata con successo a ${city.name}`,
      staging: `Virtual Staging generato per immobile a ${city.name}`,
      price_drop: `Price Drop Sniper attivato a ${city.name}`,
    };

    const newActivity: LiveActivity = {
      id: Date.now().toString() + Math.random(),
      type: activityType.type,
      message: messages[activityType.type],
      location: city.name,
      timestamp: new Date(),
      country: city.country,
    };

    // Aggiungi location attiva per la mappa
    setActiveLocations((prev) => {
      const next = new Set(prev);
      next.add(city.name);
      setTimeout(() => {
        setActiveLocations((current) => {
          const updated = new Set(current);
          updated.delete(city.name);
          return updated;
        });
      }, 3000); // Rimuovi dopo 3 secondi
      return next;
    });

    return newActivity;
  };

  const generateNewActivity = () => {
    const newActivity = generateRandomActivity();
    setActivities((prev) => {
      const updated = [newActivity, ...prev].slice(0, 10); // Mantieni max 10 attività
      return updated;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <Card className="border-cyan-500/30 bg-[#0a0a0a]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-green-500/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-cyan-400">PropertyPilot Live Network</CardTitle>
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">Attività globale in tempo reale</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini World Map */}
        <div className="relative h-32 bg-[#111111] border border-cyan-500/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="h-16 w-16 text-cyan-500/20" />
          </div>
          {/* Punti attivi sulla mappa */}
          {cities.map((city) => {
            const isActive = activeLocations.has(city.name);
            // Posizione percentuale approssimativa (mock)
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

        {/* Live Feed */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {activities.map((activity) => {
            const activityType = activityTypes.find((t) => t.type === activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 bg-[#111111] border border-cyan-500/10 rounded hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-lg">{activityType?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${activityType?.color || "text-cyan-400"}`}>
                      {formatTime(activity.timestamp)}
                    </span>
                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                      {activityType?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 font-mono">{activity.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-cyan-500/20 text-center">
          <p className="text-xs text-cyan-400 font-semibold">
            Sei parte di un network globale di elite. Non restare indietro.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

