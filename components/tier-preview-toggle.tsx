"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  Crown, 
  Building2, 
  User,
  ChevronDown,
  Lock,
  Unlock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type PreviewTier = "real" | "free" | "starter" | "pro" | "agency";

interface TierPreviewToggleProps {
  currentRealTier: string;
  onTierChange: (tier: PreviewTier) => void;
}

const TIER_CONFIG = {
  real: { label: "Vista Reale", icon: Eye, color: "bg-white/10", textColor: "text-white" },
  free: { label: "FREE", icon: User, color: "bg-gray-500", textColor: "text-gray-300" },
  starter: { label: "STARTER", icon: Sparkles, color: "bg-purple-500", textColor: "text-purple-300" },
  pro: { label: "PRO", icon: Crown, color: "bg-cyan-500", textColor: "text-cyan-300" },
  agency: { label: "AGENCY", icon: Building2, color: "bg-amber-500", textColor: "text-amber-300" },
};

const TIER_FEATURES = {
  free: {
    limits: { listings: 5, aiTools: 3 },
    locked: ["CRM", "Pipeline", "Automazioni", "Communication Hub", "Lead Scoring AI", "Agency Branding"],
    unlocked: ["Generatore Base", "Titoli AI", "Audit Base"]
  },
  starter: {
    limits: { listings: 50, aiTools: 10 },
    locked: ["CRM", "Pipeline", "Automazioni", "Communication Hub"],
    unlocked: ["Tutti gli AI Tools", "PDF Professionali", "Hashtag AI", "Aria Coach"]
  },
  pro: {
    limits: { listings: 200, aiTools: -1 },
    locked: ["Multi-utente", "Report Team"],
    unlocked: ["CRM Completo", "Pipeline Kanban", "20 Automazioni", "Lead Scoring AI", "Communication Hub"]
  },
  agency: {
    limits: { listings: -1, aiTools: -1 },
    locked: [],
    unlocked: ["TUTTO ILLIMITATO", "10 Utenti", "Multi-sede", "Supporto Prioritario"]
  }
};

export function TierPreviewToggle({ currentRealTier, onTierChange }: TierPreviewToggleProps) {
  const [previewTier, setPreviewTier] = useState<PreviewTier>("real");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tier_preview_visible");
      setIsVisible(stored === "true");
    }
  }, []);

  const handleTierSelect = (tier: PreviewTier) => {
    setPreviewTier(tier);
    onTierChange(tier);
    if (typeof window !== "undefined") {
      if (tier === "real") {
        localStorage.removeItem("preview_tier");
      } else {
        localStorage.setItem("preview_tier", tier);
      }
    }
  };

  const toggleVisibility = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    if (typeof window !== "undefined") {
      localStorage.setItem("tier_preview_visible", String(newVisible));
    }
  };

  const currentConfig = TIER_CONFIG[previewTier];
  const Icon = currentConfig.icon;

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleVisibility}
        className="fixed top-20 right-4 z-50 bg-black/50 border border-purple-500/30 hover:bg-purple-500/20 text-white/60 hover:text-white"
      >
        <Eye className="h-4 w-4 mr-2" />
        Preview Mode
      </Button>
    );
  }

  const tierFeatures = previewTier !== "real" ? TIER_FEATURES[previewTier as keyof typeof TIER_FEATURES] : null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl w-72">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Simulatore Vista</p>
              <p className="text-xs text-purple-400">Piano: {currentRealTier.toUpperCase()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            className="h-6 w-6 text-white/40 hover:text-white"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-between ${currentConfig.color} border-white/10 ${currentConfig.textColor} hover:bg-white/10`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {currentConfig.label}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-black/95 border-purple-500/30">
            <DropdownMenuLabel className="text-white/60">Simula Vista Piano</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {(Object.keys(TIER_CONFIG) as PreviewTier[]).map((tier) => {
              const config = TIER_CONFIG[tier];
              const TierIcon = config.icon;
              return (
                <DropdownMenuItem
                  key={tier}
                  onClick={() => handleTierSelect(tier)}
                  className={`cursor-pointer ${previewTier === tier ? "bg-purple-500/20" : ""}`}
                >
                  <TierIcon className={`h-4 w-4 mr-2 ${config.textColor}`} />
                  <span className={config.textColor}>{config.label}</span>
                  {previewTier === tier && (
                    <Badge className="ml-auto bg-purple-500 text-white text-xs">Attivo</Badge>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {tierFeatures && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Limite Annunci:</span>
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                {tierFeatures.limits.listings === -1 ? "∞" : tierFeatures.limits.listings}/mese
              </Badge>
            </div>

            {tierFeatures.unlocked.length > 0 && (
              <div>
                <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                  <Unlock className="h-3 w-3" /> Sbloccato
                </p>
                <div className="flex flex-wrap gap-1">
                  {tierFeatures.unlocked.slice(0, 4).map((feature) => (
                    <Badge key={feature} className="bg-green-500/20 text-green-300 text-[10px] border-green-500/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tierFeatures.locked.length > 0 && (
              <div>
                <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Bloccato
                </p>
                <div className="flex flex-wrap gap-1">
                  {tierFeatures.locked.slice(0, 4).map((feature) => (
                    <Badge key={feature} className="bg-red-500/20 text-red-300 text-[10px] border-red-500/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
