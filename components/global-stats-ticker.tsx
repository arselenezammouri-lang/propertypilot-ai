"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Globe, Phone, Sparkles, Trophy, MapPin } from "lucide-react";
import { SupportedLocale, detectLocaleFromLocation } from "@/lib/i18n/dictionary";

interface GlobalActivity {
  id: string;
  type: 'call' | 'vr_tour' | 'mandate' | 'listing';
  location: string;
  timestamp: Date;
  locale?: SupportedLocale;
}

const MOCK_ACTIVITIES: Omit<GlobalActivity, 'id' | 'timestamp'>[] = [
  { type: 'call', location: 'Dubai, UAE', locale: 'en' },
  { type: 'vr_tour', location: 'Manhattan, New York', locale: 'en' },
  { type: 'mandate', location: 'Roma, Italia', locale: 'it' },
  { type: 'listing', location: 'Dubai, UAE', locale: 'en' },
  { type: 'call', location: 'Parigi, Francia', locale: 'fr' },
  { type: 'vr_tour', location: 'Miami Beach, FL', locale: 'en' },
  { type: 'mandate', location: 'Madrid, Spagna', locale: 'es' },
  { type: 'listing', location: 'Londra, UK', locale: 'en' },
  { type: 'call', location: 'Milano, Italia', locale: 'it' },
  { type: 'vr_tour', location: 'Los Angeles, CA', locale: 'en' },
  { type: 'mandate', location: 'Barcellona, Spagna', locale: 'es' },
  { type: 'listing', location: 'Berlino, Germania', locale: 'de' },
  { type: 'call', location: 'Singapore', locale: 'en' },
  { type: 'vr_tour', location: 'São Paulo, Brasile', locale: 'pt' },
  { type: 'mandate', location: 'Lisbona, Portogallo', locale: 'pt' },
  { type: 'listing', location: 'Tokyo, Giappone', locale: 'en' },
  { type: 'call', location: 'Sydney, Australia', locale: 'en' },
  { type: 'vr_tour', location: 'Monaco, Germania', locale: 'de' },
  { type: 'mandate', location: 'Amsterdam, Olanda', locale: 'en' },
  { type: 'listing', location: 'Zurigo, Svizzera', locale: 'de' },
];

const ACTIVITY_MESSAGES: Record<GlobalActivity['type'], Record<SupportedLocale, string>> = {
  call: {
    it: 'Ultima chiamata effettuata a',
    en: 'Latest call made in',
    es: 'Última llamada realizada en',
    fr: 'Dernier appel effectué à',
    de: 'Letzter Anruf getätigt in',
    pt: 'Última chamada realizada em',
    ar: 'آخر مكالمة في',
  },
  vr_tour: {
    it: 'Aura VR generated for',
    en: 'Aura VR generated for',
    es: 'Aura VR generated for',
    fr: 'Aura VR generated for',
    de: 'Aura VR generated for',
    pt: 'Aura VR generated for',
    ar: 'Aura VR generated for',
  },
  mandate: {
    it: 'Appointment set in',
    en: 'Appointment set in',
    es: 'Appointment set in',
    fr: 'Appointment set in',
    de: 'Appointment set in',
    pt: 'Appointment set in',
    ar: 'Appointment set in',
  },
  listing: {
    it: 'New Lead found in',
    en: 'New Lead found in',
    es: 'New Lead found in',
    fr: 'New Lead found in',
    de: 'New Lead found in',
    pt: 'New Lead found in',
    ar: 'New Lead found in',
  },
};

const ACTIVITY_ICONS = {
  call: Phone,
  vr_tour: Sparkles,
  mandate: Trophy,
  listing: Globe,
};

const ACTIVITY_COLORS = {
  call: 'text-cyan-400',
  vr_tour: 'text-purple-400',
  mandate: 'text-green-400',
  listing: 'text-blue-400',
};

export function GlobalStatsTicker() {
  const [activities, setActivities] = useState<GlobalActivity[]>([]);

  useEffect(() => {
    // Inizializza con attività mock
    const initialActivities: GlobalActivity[] = MOCK_ACTIVITIES.slice(0, 6).map((act, idx) => ({
      ...act,
      id: `activity-${idx}`,
      timestamp: new Date(Date.now() - idx * 30000), // 30 secondi di differenza
      locale: act.locale || detectLocaleFromLocation(act.location),
    }));
    setActivities(initialActivities);

    // Simula nuove attività ogni 8-12 secondi
    const interval = setInterval(() => {
      const randomActivity = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)];
      const newActivity: GlobalActivity = {
        ...randomActivity,
        id: `activity-${Date.now()}`,
        timestamp: new Date(),
        locale: randomActivity.locale || detectLocaleFromLocation(randomActivity.location),
      };

      setActivities((prev) => {
        const updated = [newActivity, ...prev].slice(0, 8); // Mantieni ultime 8 attività
        return updated;
      });
    }, 8000 + Math.random() * 4000); // 8-12 secondi

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card border-2 border-transparent bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-xl shadow-lg relative overflow-hidden">
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/20 via-[#06b6d4]/20 to-[#9333ea]/20 animate-pulse opacity-50" />
      <div className="absolute inset-[1px] bg-background/95 rounded-lg" />
      
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-5 w-5 text-[#06b6d4] animate-pulse" />
          <h4 className="text-sm font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
            Global Network Activity
          </h4>
        </div>

        {/* Ticker Container */}
        <div className="relative overflow-hidden">
          {/* Scrolling Ticker */}
          <div className="flex gap-6 animate-scroll">
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              const colorClass = ACTIVITY_COLORS[activity.type];
              const message = ACTIVITY_MESSAGES[activity.type][activity.locale || 'en'];
              
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                  <span className="text-xs text-muted-foreground">
                    {message}
                  </span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#06b6d4]" />
                    {activity.location}
                  </span>
                  <span className="text-xs text-muted-foreground/50">
                    •
                  </span>
                </div>
              );
            })}
            
            {/* Duplica per effetto loop continuo */}
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              const colorClass = ACTIVITY_COLORS[activity.type];
              const message = ACTIVITY_MESSAGES[activity.type][activity.locale || 'en'];
              
              return (
                <div
                  key={`duplicate-${activity.id}`}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                  <span className="text-xs text-muted-foreground">
                    {message}
                  </span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#06b6d4]" />
                    {activity.location}
                  </span>
                  <span className="text-xs text-muted-foreground/50">
                    •
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Card>
  );
}
