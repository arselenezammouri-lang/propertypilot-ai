"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MessageSquare, TrendingUp } from "lucide-react";

interface Stats3D {
  projects_3d_generated: number;
  whatsapp_opened: number;
  whatsapp_sent: number;
  whatsapp_open_rate: number;
}

export function Dashboard3DStats() {
  const [stats, setStats] = useState<Stats3D | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prospecting/stats-3d')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Progetti 3D</p>
              <h3 className="text-3xl md:text-4xl font-black text-purple-400">—</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-purple-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">Generati</p>
        </div>
        <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-350">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Apertura WhatsApp</p>
              <h3 className="text-3xl md:text-4xl font-black text-green-400">—%</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-green-400" />
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium relative">Tasso di apertura</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Progetti 3D Generati */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-300" data-testid="card-3d-projects">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Progetti 3D</p>
            <h3 className="text-3xl md:text-4xl font-black text-purple-400">
              {stats.projects_3d_generated}
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-2xl flex items-center justify-center shadow-glow-purple">
            <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-purple-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          Visioni AI generate
        </p>
      </div>

      {/* Tasso di Apertura WhatsApp */}
      <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-350" data-testid="card-whatsapp-rate">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Apertura WhatsApp</p>
            <h3 className="text-3xl md:text-4xl font-black text-green-400">
              {stats.whatsapp_open_rate}%
            </h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-2xl flex items-center justify-center shadow-glow-green">
            <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-green-400" />
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium relative">
          {stats.whatsapp_sent > 0 
            ? `${stats.whatsapp_opened} aperti su ${stats.whatsapp_sent} inviati`
            : 'Nessun messaggio inviato ancora'
          }
        </p>
      </div>
    </>
  );
}

