"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Sparkles, TrendingUp } from "lucide-react";

interface SuccessStory {
  id: string;
  agent: string;
  location: string;
  feature: string;
  result: string;
  icon: React.ReactNode;
  color: string;
}

const successStories: SuccessStory[] = [
  {
    id: "1",
    agent: "Marco R.",
    location: "Parigi",
    feature: "Price Drop Sniper",
    result: "Mandato esclusivo preso in 24h",
    icon: <Target className="h-5 w-5" />,
    color: "text-red-400",
  },
  {
    id: "2",
    agent: "Giulia B.",
    location: "Roma",
    feature: "Virtual Staging 3D",
    result: "Vendita chiusa in 2 settimane",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-purple-400",
  },
  {
    id: "3",
    agent: "Luca M.",
    location: "Milano",
    feature: "AI Morning Intel",
    result: "3 mandati questa settimana",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-cyan-400",
  },
  {
    id: "4",
    agent: "Sarah K.",
    location: "Miami",
    feature: "Competitor Radar",
    result: "Mandato da immobile offline 150 giorni",
    icon: <Trophy className="h-5 w-5" />,
    color: "text-amber-400",
  },
];

export function SuccessStories() {
  return (
    <div className="w-full py-16 bg-gradient-to-b from-purple-500/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Successi Recenti
          </h2>
          <p className="text-xl text-muted-foreground">
            Agenti che stanno chiudendo affari con PropertyPilot AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="border-purple-500/20 bg-gradient-to-br from-background to-purple-500/5 hover:border-purple-500/40 transition-all hover:shadow-xl hover-lift"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Icon & Feature */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center ${story.color}`}>
                      {story.icon}
                    </div>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {story.feature}
                    </Badge>
                  </div>

                  {/* Agent & Location */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Agente</p>
                    <p className="text-lg font-bold">{story.agent}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">📍 {story.location}</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="pt-3 border-t border-purple-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Risultato</p>
                    <p className="text-base font-semibold text-green-400">
                      ✓ {story.result}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

