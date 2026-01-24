"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";

interface PredatorLiveBadgeProps {
  className?: string;
}

/**
 * Badge "LIVE: X Predatori Online" per creare senso di community d'élite
 * Mostrato solo al primo accesso (usando localStorage)
 */
export function PredatorLiveBadge({ className }: PredatorLiveBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [predatorCount, setPredatorCount] = useState(124);

  useEffect(() => {
    // Controlla se è il primo accesso (non mostrato prima)
    const hasSeenBadge = localStorage.getItem('predator-badge-seen');
    
    if (!hasSeenBadge) {
      setIsVisible(true);
      
      // Simula variazione dinamica del numero (124-135)
      const interval = setInterval(() => {
        setPredatorCount((prev) => {
          const variation = Math.floor(Math.random() * 12) - 6; // -6 a +6
          const newCount = Math.max(120, Math.min(140, prev + variation));
          return newCount;
        });
      }, 5000); // Aggiorna ogni 5 secondi

      // Nascondi dopo 10 secondi e marca come visto
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('predator-badge-seen', 'true');
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(hideTimeout);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`absolute top-4 right-4 z-50 ${className}`}>
      <Badge 
        className="bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold px-4 py-2 shadow-lg shadow-purple-500/50 border border-cyan-400/50 animate-pulse"
      >
        <Zap className="h-3 w-3 mr-1.5 inline-block animate-pulse" />
        <span className="text-xs sm:text-sm">
          LIVE: <span className="font-black">{predatorCount}</span> Predatori Online
        </span>
        <Users className="h-3 w-3 ml-1.5 inline-block" />
      </Badge>
    </div>
  );
}
