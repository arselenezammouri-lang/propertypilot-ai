"use client";

import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, ArrowRight, X } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  currentPlan: string;
  feature?: string;
  context?: "limit" | "feature" | "inline";
  onClose?: () => void;
}

const PLAN_BENEFITS: Record<string, { name: string; price: string; highlights: string[] }> = {
  starter: {
    name: "Starter",
    price: "197",
    highlights: [
      "50 AI listings/month",
      "3 listing styles",
      "PDF exports",
      "Multi-language",
    ],
  },
  pro: {
    name: "Pro",
    price: "497",
    highlights: [
      "200 AI listings/month",
      "Full CRM + Pipeline",
      "AI Voice Calling",
      "Virtual Staging 3D",
      "Automations",
    ],
  },
  agency: {
    name: "Agency",
    price: "897",
    highlights: [
      "Unlimited listings",
      "Team up to 10 agents",
      "Unlimited Voice AI",
      "Auto-Prospecting 24/7",
      "Dedicated support",
    ],
  },
};

function getNextPlan(current: string): string {
  if (current === "free") return "starter";
  if (current === "starter") return "pro";
  if (current === "pro") return "agency";
  return "pro";
}

/**
 * Full-screen upgrade modal — shown when user hits plan limits
 */
export function UpgradeModal({ currentPlan, feature, onClose }: UpgradePromptProps) {
  const next = getNextPlan(currentPlan);
  const plan = PLAN_BENEFITS[next];

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
            <Crown className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-xl font-bold mb-2">
            {feature
              ? `Unlock ${feature}`
              : "You've reached your plan limit"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {feature
              ? `This feature requires the ${plan.name} plan or higher.`
              : `Upgrade to ${plan.name} to keep generating and grow your agency.`}
          </p>

          <div className="bg-muted/30 rounded-xl p-5 mb-6">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold">€{plan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2.5">
              {plan.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/api/stripe/checkout?plan=${next.toUpperCase()}`}>
            <Button className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-medium">
              Upgrade to {plan.name}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline upgrade card — embed in dashboard or tool pages
 */
export function UpgradeInline({ currentPlan }: { currentPlan: string }) {
  const next = getNextPlan(currentPlan);
  const plan = PLAN_BENEFITS[next];

  if (!plan || currentPlan === "agency") return null;

  return (
    <div className="pp-card p-5 border-primary/20 bg-primary/[0.02]">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">
            Upgrade to {plan.name} — €{plan.price}/mo
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {plan.highlights.slice(0, 3).join(" · ")}
          </p>
          <Link href={`/api/stripe/checkout?plan=${next.toUpperCase()}`}>
            <Button size="sm" className="h-8 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium">
              Upgrade now
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Feature gate — wraps content that requires a specific plan
 * Shows content normally if user has access, shows upgrade prompt if not
 */
export function FeatureGate({
  children,
  requiredPlan,
  currentPlan,
  featureName,
}: {
  children: React.ReactNode;
  requiredPlan: "starter" | "pro" | "agency";
  currentPlan: string;
  featureName: string;
}) {
  const planOrder: Record<string, number> = { free: 0, starter: 1, pro: 2, agency: 3 };
  const hasAccess = (planOrder[currentPlan] || 0) >= (planOrder[requiredPlan] || 0);

  if (hasAccess) return <>{children}</>;

  const plan = PLAN_BENEFITS[requiredPlan];

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="opacity-30 pointer-events-none select-none blur-[2px]">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-xl">
        <div className="text-center p-6 max-w-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold mb-1">{featureName}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Requires {plan?.name || requiredPlan} plan (€{plan?.price || "?"}/mo)
          </p>
          <Link href={`/api/stripe/checkout?plan=${requiredPlan.toUpperCase()}`}>
            <Button size="sm" className="h-8 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium">
              Unlock {featureName}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
