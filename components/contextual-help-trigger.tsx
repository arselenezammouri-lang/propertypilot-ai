"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

export type ContextualHelpTriggerProps = {
  /** Slug sotto /docs/[slug] (es. getting-started/perfect-copy) */
  docSlug: string;
  className?: string;
};

/**
 * Pulsante "?" con tooltip: apre la guida contestuale in nuova scheda (Fase C2).
 */
export function ContextualHelpTrigger({ docSlug, className }: ContextualHelpTriggerProps) {
  const { locale } = useLocale();
  const t = getTranslation(locale as SupportedLocale).dashboard.contextualHelp;
  const href = `/docs/${docSlug}`;

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-11 w-11 min-h-11 min-w-11 shrink-0 touch-manipulation border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
            className
          )}
          asChild
        >
          <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={t.openGuideAria}>
            <HelpCircle className="h-5 w-5" aria-hidden />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs border-white/10 bg-zinc-900 text-white">
        <p className="text-xs leading-relaxed">{t.openGuideTooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
