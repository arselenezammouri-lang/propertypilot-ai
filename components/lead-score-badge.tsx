"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Zap, MessageCircle, Snowflake, Target } from "lucide-react";

interface LeadScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  factors?: Array<{ name: string; points: number; maxPoints: number; reason: string }>;
}

function getScoreConfig(score: number) {
  if (score >= 80) return { label: "Hot", emoji: "🔥", icon: Flame, gradient: "from-red-500 to-orange-500", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  if (score >= 60) return { label: "Warm", emoji: "⚡", icon: Zap, gradient: "from-orange-500 to-amber-500", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" };
  if (score >= 40) return { label: "Cool", emoji: "💬", icon: MessageCircle, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" };
  return { label: "Cold", emoji: "❄️", icon: Snowflake, gradient: "from-slate-500 to-gray-500", bg: "bg-muted", text: "text-muted-foreground", border: "border-border/40" };
}

export function LeadScoreBadge({ score, showLabel = true, size = "sm", factors }: LeadScoreBadgeProps) {
  const config = getScoreConfig(score);
  const Icon = config.icon;

  const badge = (
    <Badge className={`${config.bg} ${config.text} ${config.border} ${size === "md" ? "text-xs px-2.5 py-1" : "text-[10px] px-2 py-0.5"} gap-1 font-semibold`}>
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} />
      <span className="font-bold">{score}</span>
      {showLabel && <span className="font-medium">{config.label}</span>}
    </Badge>
  );

  if (!factors || factors.length === 0) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3 bg-card border-border">
          <p className="font-semibold text-xs mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" />Score Breakdown
          </p>
          <div className="space-y-1.5">
            {factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{f.name}</span>
                <span className="font-medium">+{f.points}/{f.maxPoints}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-border/40 flex justify-between text-xs font-semibold">
            <span>Total</span>
            <span className={config.text}>{score}/100</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Quick score category filter */
export function getScoreCategory(score: number): "hot" | "warm" | "cool" | "cold" {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  if (score >= 40) return "cool";
  return "cold";
}
