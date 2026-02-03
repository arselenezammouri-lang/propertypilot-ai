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
          hasReachedLimit ? "text-destructive" : isNearLimit ? "text-sunset-gold" : "text-neon-aqua"
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
      "rounded-xl p-4 border transition-all",
      hasReachedLimit 
        ? "border-destructive/50 bg-destructive/5" 
        : isNearLimit 
          ? "border-sunset-gold/50 bg-sunset-gold/5" 
          : "border-silver-frost/20 bg-background/50",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasReachedLimit ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <TrendingUp className="h-5 w-5 text-neon-aqua" />
          )}
          <span className="font-semibold">Utilizzo Mensile</span>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-medium capitalize",
          plan === 'agency' ? "bg-royal-purple/20 text-royal-purple" :
          plan === 'pro' ? "bg-sunset-gold/20 text-sunset-gold" :
          plan === 'starter' ? "bg-electric-blue/20 text-electric-blue" :
          "bg-muted text-muted-foreground"
        )}>
          {plan}
        </span>
      </div>

      {isUnlimited ? (
        <div className="flex items-center gap-2 text-neon-aqua">
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
              hasReachedLimit ? "text-destructive" : isNearLimit ? "text-sunset-gold" : "text-foreground"
            )}>
              {remainingGenerations} rimanenti
            </span>
          </div>
          <Progress 
            value={percentageUsed} 
            className={cn(
              "h-2",
              hasReachedLimit && "[&>div]:bg-destructive",
              isNearLimit && !hasReachedLimit && "[&>div]:bg-sunset-gold"
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
