"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PendingCheckoutBanner } from "./pending-checkout-banner";
import { OnboardingWizard } from "./onboarding-wizard";
import { AriaLimitModal } from "./aria-limit-modal";
import { TierPreviewToggle, PreviewTier } from "./tier-preview-toggle";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

function formatLimitNearDesc(template: string, used: number, lim: number): string {
  return template.replace(/\{used\}/g, String(used)).replace(/\{lim\}/g, String(lim));
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { hasReachedLimit, isNearLimit, currentUsage, limit, plan } = useUsageLimits();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { locale } = useLocale();
  const d = getTranslation(locale as SupportedLocale).dashboardToasts;

  useEffect(() => {
    const success = searchParams.get('success');
    const boost = searchParams.get('boost');
    const canceled = searchParams.get('canceled');

    if (boost === 'success') {
      toast({ title: d.boostActivated, description: d.boostDesc, duration: 8000 });
      window.history.replaceState({}, '', '/dashboard');
    } else if (success === 'true') {
      const upgradedPlan = localStorage.getItem('upgradedPlan');
      if (upgradedPlan === 'agency') {
        toast({ title: d.agencyActive, description: d.agencyDesc, duration: 8000 });
        localStorage.removeItem('upgradedPlan');
      } else {
        toast({ title: d.paymentDone, description: d.paymentDesc, duration: 5000 });
      }
      window.history.replaceState({}, '', '/dashboard');
    }

    if (canceled === 'true') {
      toast({ title: d.checkoutCanceled, description: d.checkoutCanceledDesc, variant: 'default', duration: 4000 });
      window.history.replaceState({}, '', '/dashboard');
    }

    const limitReached = searchParams.get('limit_reached');
    if (limitReached === 'true') {
      setShowLimitModal(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, toast, locale]);

  useEffect(() => {
    if (isNearLimit && !hasReachedLimit && plan !== 'agency') {
      const hasShownNearLimitWarning = sessionStorage.getItem('nearLimitWarningShown');
      if (!hasShownNearLimitWarning) {
        toast({ title: d.limitNear, description: formatLimitNearDesc(d.limitNearDesc, currentUsage, limit), duration: 6000 });
        sessionStorage.setItem('nearLimitWarningShown', 'true');
      }
    }
    
    if (hasReachedLimit && plan !== 'agency') {
      setShowLimitModal(true);
    }
  }, [isNearLimit, hasReachedLimit, currentUsage, limit, plan, toast, locale]);

  const handleTierPreview = (tier: PreviewTier) => {
    if (typeof window !== 'undefined') {
      if (tier === 'real') {
        localStorage.removeItem('preview_tier');
      } else {
        localStorage.setItem('preview_tier', tier);
      }
      window.dispatchEvent(new CustomEvent('tier-preview-change', { detail: tier }));
    }
  };

  return (
    <>
      <OnboardingWizard />
      <PendingCheckoutBanner />
      <TierPreviewToggle 
        currentRealTier={plan}
        onTierChange={handleTierPreview}
      />
      <AriaLimitModal 
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentPlan={plan}
        currentUsage={currentUsage}
        limit={limit}
      />
      {children}
    </>
  );
}
