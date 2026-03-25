"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { STRIPE_PLANS } from "@/lib/stripe/config";

interface AriaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  currentUsage: number;
  limit: number;
}

export function AriaLimitModal({
  isOpen,
  onClose,
  currentPlan,
  currentUsage,
  limit,
}: AriaLimitModalProps) {
  const { locale, currency } = useLocaleContext();

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).ariaLimitModal,
    [locale]
  );
  const billingT = useMemo(
    () => getTranslation(locale as SupportedLocale).billing,
    [locale]
  );

  const tierKey =
    currentPlan === "free" || currentPlan === "starter" || currentPlan === "pro"
      ? currentPlan
      : "starter";

  const upgradeCfg = t.upgrades[tierKey];

  const priceDisplay = useMemo(() => {
    const amount = STRIPE_PLANS[upgradeCfg.next].price;
    return `${formatCurrencyForLocale(amount, locale as Locale, currency)}${billingT.perMonth}`;
  }, [upgradeCfg.next, locale, currency, billingT.perMonth]);

  const descText = useMemo(
    () =>
      t.desc
        .replace("{used}", String(currentUsage))
        .replace("{lim}", String(limit))
        .replace("{plan}", currentPlan),
    [t.desc, currentUsage, limit, currentPlan]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {isOpen ? (
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background to-royal-purple/5 border-royal-purple/20">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-royal-purple/20 to-electric-blue/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-purple to-electric-blue flex items-center justify-center animate-pulse">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              <span className="gradient-text-purple">{t.title}</span>
            </DialogTitle>
            <DialogDescription className="text-base mt-2">{descText}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gradient-to-r from-royal-purple/10 to-electric-blue/10 rounded-xl p-6 border border-royal-purple/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sunset-gold to-amber-500 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{upgradeCfg.nextPlan}</h3>
                    <p className="text-sm text-muted-foreground">{priceDisplay}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-sunset-gold/20 text-sunset-gold px-2 py-1 rounded-full font-semibold">
                    {t.recommended}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {upgradeCfg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-muted-foreground italic">
                {t.ariaQuote.replace("{name}", upgradeCfg.nextPlan)}
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" type="button">
              {t.later}
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 text-white"
              asChild
            >
              <Link href="/pricing">
                {t.upgradeTo.replace("{name}", upgradeCfg.nextPlan)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
