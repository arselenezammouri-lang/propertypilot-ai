"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Sparkles, X, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { STRIPE_ONE_TIME_PACKAGES, STRIPE_PLANS } from "@/lib/stripe/config";

type PlanKey = "starter" | "pro" | "agency" | "boost";

export function PendingCheckoutBanner() {
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [pendingPackage, setPendingPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();
  const { locale, currency } = useLocaleContext();

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).pendingCheckoutBanner,
    [locale]
  );
  const billingT = useMemo(
    () => getTranslation(locale as SupportedLocale).billing,
    [locale]
  );

  const syncErrorRef = useRef(t.syncError);
  syncErrorRef.current = t.syncError;
  const invalidPlanRef = useRef(t.invalidPlan);
  invalidPlanRef.current = t.invalidPlan;
  const checkoutErrorRef = useRef(t.checkoutError);
  checkoutErrorRef.current = t.checkoutError;
  const checkoutUrlMissingRef = useRef(t.checkoutUrlMissing);
  checkoutUrlMissingRef.current = t.checkoutUrlMissing;
  const paymentErrorRef = useRef(t.paymentError);
  paymentErrorRef.current = t.paymentError;

  const planDetails = useMemo(() => {
    const fmt = (amount: number, suffix: string) =>
      `${formatCurrencyForLocale(amount, locale as Locale, currency)}${suffix}`;
    return {
      starter: {
        name: t.planNames.starter,
        price: fmt(STRIPE_PLANS.starter.price, billingT.perMonth),
        color: "from-blue-500 to-cyan-500" as const,
      },
      pro: {
        name: t.planNames.pro,
        price: fmt(STRIPE_PLANS.pro.price, billingT.perMonth),
        color: "from-purple-500 to-pink-500" as const,
      },
      agency: {
        name: t.planNames.agency,
        price: fmt(STRIPE_PLANS.agency.price, billingT.perMonth),
        color: "from-amber-500 to-orange-500" as const,
      },
      boost: {
        name: t.planNames.boost,
        price: formatCurrencyForLocale(
          STRIPE_ONE_TIME_PACKAGES.boost.price,
          locale as Locale,
          currency
        ),
        color: "from-emerald-500 to-teal-500" as const,
      },
    } satisfies Record<
      PlanKey,
      { name: string; price: string; color: string }
    >;
  }, [t.planNames, locale, currency, billingT.perMonth]);

  useEffect(() => {
    const plan = localStorage.getItem("pendingPlan");
    const pkg = localStorage.getItem("pendingPackage");
    if (plan) setPendingPlan(plan);
    if (pkg) setPendingPackage(pkg);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/stripe/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || syncErrorRef.current);
      }

      toast({
        title: t.syncDone,
        description: t.syncPlan.replace("{plan}", data.plan?.toUpperCase() || "FREE"),
      });

      if (data.plan && data.plan !== "free") {
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("pendingPackage");
        window.location.reload();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : syncErrorRef.current;
      toast({
        title: t.errorTitle,
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      let endpoint = "/api/stripe/checkout";
      let body: Record<string, string> = {};

      if (pendingPlan && ["starter", "pro", "agency"].includes(pendingPlan)) {
        body = { planType: pendingPlan };
      } else if (pendingPackage === "boost") {
        endpoint = "/api/stripe/checkout-oneshot";
        body = { packageId: "boost" };
      } else {
        throw new Error(invalidPlanRef.current);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || checkoutErrorRef.current);
      }

      if (data.url) {
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("pendingPackage");
        window.location.href = data.url;
      } else {
        throw new Error(checkoutUrlMissingRef.current);
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const message =
        error instanceof Error ? error.message : paymentErrorRef.current;
      toast({
        title: t.errorTitle,
        description: message || paymentErrorRef.current,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.removeItem("pendingPlan");
    localStorage.removeItem("pendingPackage");
    setDismissed(true);
  };

  if (dismissed || (!pendingPlan && !pendingPackage)) {
    return null;
  }

  const planKey = (pendingPlan || pendingPackage || "starter") as PlanKey;
  const details = planDetails[planKey] ?? planDetails.starter;

  return (
    <Card
      className="mb-8 border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10 animate-fade-in-up overflow-hidden relative"
      data-testid="pending-checkout-banner"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors z-10"
        aria-label={t.closeLabel}
        data-testid="button-dismiss-checkout"
        type="button"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${details.color} shadow-lg`}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">
                {t.activatePlan.replace("{name}", details.name)}
              </h3>
              <p className="text-muted-foreground">
                {t.activateDesc.replace("{name}", details.name).replace("{price}", details.price)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCheckout}
              disabled={isLoading || isSyncing}
              size="lg"
              className={`bg-gradient-to-r ${details.color} hover:opacity-90 text-white shadow-lg min-w-[200px]`}
              data-testid="button-complete-checkout"
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {t.goToPayment}
                </>
              )}
            </Button>

            <Button
              onClick={handleSync}
              disabled={isLoading || isSyncing}
              size="lg"
              variant="outline"
              className="min-w-[180px]"
              data-testid="button-sync-subscription"
              type="button"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.syncing}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  {t.alreadyPaid}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
