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
  const onboardingEnabled = process.env.NEXT_PUBLIC_ENABLE_ONBOARDING === 'true';
  const { locale } = useLocale();
  const d = getTranslation(locale as SupportedLocale).dashboardToasts;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const warnKey = 'pp_connectivity_warn_shown';
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        const body = await res.json().catch(() => null);
        if (cancelled || !body?.checks) return;
        const bad =
          body.checks.supabase?.status !== 'ok' ||
          body.checks.environment?.status !== 'ok';
        if (bad && typeof window !== 'undefined' && !sessionStorage.getItem(warnKey)) {
          sessionStorage.setItem(warnKey, '1');
          toast({
            title: d.connectivityIssueTitle,
            description: d.connectivityIssueDesc,
            variant: 'destructive',
            duration: 12_000,
          });
        }
      } catch {
        if (!cancelled && typeof window !== 'undefined' && !sessionStorage.getItem(warnKey)) {
          sessionStorage.setItem(warnKey, '1');
          toast({
            title: d.connectivityIssueTitle,
            description: d.connectivityIssueDesc,
            variant: 'destructive',
            duration: 12_000,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast, d.connectivityIssueTitle, d.connectivityIssueDesc]);

  useEffect(() => {
    const key = 'pp_compliance_reminder_shown';
    if (typeof window !== 'undefined' && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      toast({
        title: d.complianceReminderTitle,
        description: d.complianceReminderDesc,
        duration: 10_000,
      });
    }
  }, [toast, d.complianceReminderTitle, d.complianceReminderDesc]);

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
  }, [
    searchParams,
    toast,
    d.boostActivated,
    d.boostDesc,
    d.agencyActive,
    d.agencyDesc,
    d.paymentDone,
    d.paymentDesc,
    d.checkoutCanceled,
    d.checkoutCanceledDesc,
  ]);

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
  }, [isNearLimit, hasReachedLimit, currentUsage, limit, plan, toast, d.limitNear, d.limitNearDesc]);

  useEffect(() => {
    const restorePointerEvents = () => {
      const hasOpenDialogOverlay = Boolean(
        document.querySelector('[data-state="open"][class*="fixed"][class*="inset-0"][class*="z-50"]')
      );
      if (!hasOpenDialogOverlay && document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "auto";
      }
    };

    restorePointerEvents();
    const intervalId = window.setInterval(restorePointerEvents, 1000);
    window.addEventListener("focus", restorePointerEvents);
    window.addEventListener("visibilitychange", restorePointerEvents);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", restorePointerEvents);
      window.removeEventListener("visibilitychange", restorePointerEvents);
    };
  }, []);

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
      {onboardingEnabled ? <OnboardingWizard /> : null}
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
