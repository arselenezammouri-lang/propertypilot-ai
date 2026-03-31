"use client";

import { useUsageLimits } from '@/hooks/use-usage-limits';
import { Progress } from '@/components/ui/progress';
import { Sparkles, AlertTriangle, Infinity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageIndicatorProps {
  compact?: boolean;
  className?: string;
}

export function UsageIndicator({ compact = false, className }: UsageIndicatorProps) {
  const { currentUsage, limit, plan, isLoading, hasReachedLimit, percentageUsed, remainingGenerations } = useUsageLimits();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-muted/50 rounded-lg h-12", className)} />
    );
  }

  const isUnlimited = limit === -1;
  const isNearLimit = !isUnlimited && percentageUsed >= 80;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Sparkles className={cn(
          "h-4 w-4",
          hasReachedLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : "text-emerald-500"
        )} />
        <span className="text-muted-foreground">
          {isUnlimited ? (
            <span className="flex items-center gap-1">
              <Infinity className="h-3 w-3" /> Illimitato
            </span>
          ) : (
            `${currentUsage}/${limit} annunci`
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col rounded-xl p-5 md:p-6 border transition-all pp-card",
      hasReachedLimit 
        ? "border-destructive/50 bg-destructive/5" 
        : isNearLimit 
          ? "border-amber-300 bg-amber-400/5" 
          : "border-border bg-background/60 backdrop-blur-2xl",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasReachedLimit ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          )}
          <span className="font-semibold">Utilizzo Mensile</span>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-medium capitalize",
          plan === 'agency' ? "bg-blue-600/20 text-blue-600" :
          plan === 'pro' ? "bg-amber-400/20 text-amber-500" :
          plan === 'starter' ? "bg-blue-500/20 text-blue-500" :
          "bg-muted text-muted-foreground"
        )}>
          {plan}
        </span>
      </div>

      {isUnlimited ? (
        <div className="flex items-center gap-2 text-emerald-500">
          <Infinity className="h-5 w-5" />
          <span className="font-bold">Generazioni Illimitate</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {currentUsage} di {limit} generazioni usate
            </span>
            <span className={cn(
              "font-semibold",
              hasReachedLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : "text-foreground"
            )}>
              {remainingGenerations} rimanenti
            </span>
          </div>
          <Progress 
            value={percentageUsed} 
            className={cn(
              "h-2",
              hasReachedLimit && "[&>div]:bg-destructive",
              isNearLimit && !hasReachedLimit && "[&>div]:bg-amber-400"
            )}
          />
          {hasReachedLimit && (
            <p className="text-xs text-destructive mt-2 font-medium">
              Limite raggiunto! Passa al piano superiore per continuare.
            </p>
          )}
        </>
      )}
    </div>
  );
}
