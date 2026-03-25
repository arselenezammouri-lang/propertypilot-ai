"use client";

import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

type FieldHelpLabelProps = {
  htmlFor?: string;
  children: ReactNode;
  /** Testo breve nel tooltip (stessa lingua della pagina) */
  help: string;
  className?: string;
};

/**
 * Label + icona ? con tooltip (campi complessi — Fase C2).
 */
export function FieldHelpLabel({ htmlFor, children, help, className }: FieldHelpLabelProps) {
  const { locale } = useLocale();
  const t = getTranslation(locale as SupportedLocale).dashboard.contextualHelp;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="mb-0">
        {children}
      </Label>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t.fieldHintAria}
          >
            <HelpCircle className="h-4 w-4" aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">{help}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
