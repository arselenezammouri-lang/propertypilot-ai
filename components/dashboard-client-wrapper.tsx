"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PendingCheckoutBanner } from "./pending-checkout-banner";
import { OnboardingWizard } from "./onboarding-wizard";
import { AriaLimitModal } from "./aria-limit-modal";
import { TierPreviewToggle, PreviewTier } from "./tier-preview-toggle";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { hasReachedLimit, isNearLimit, currentUsage, limit, plan } = useUsageLimits();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const t = {
    boostActivated: isItalian ? '🎉 Agency Boost attivato!' : '🎉 Agency Boost Activated!',
    boostDesc: isItalian
      ? 'Setup "done-for-you" confermato. Il nostro team ti contatterà per l\'onboarding.'
      : 'Done-for-you setup confirmed. Our team will contact you for onboarding.',
    agencyActive: '🎉 Agency Intelligence Active',
    agencyDesc: isItalian
      ? 'Accesso Premium Confermato - Benvenuto nel Network Globale PropertyPilot!'
      : 'Premium Access Confirmed - Welcome to the PropertyPilot Global Network!',
    paymentDone: isItalian ? '✅ Pagamento completato!' : '✅ Payment completed!',
    paymentDesc: isItalian
      ? 'Il tuo piano è stato attivato con successo.'
      : 'Your plan has been activated successfully.',
    checkoutCanceled: isItalian ? 'Checkout annullato' : 'Checkout canceled',
    checkoutCanceledDesc: isItalian
      ? 'Puoi riprovare quando vuoi dalla pagina Billing.'
      : 'You can try again anytime from the Billing page.',
    limitNear: isItalian ? '⚠️ Limite quasi raggiunto!' : '⚠️ Limit almost reached!',
    limitNearDesc: (used: number, lim: number) =>
      isItalian
        ? `Hai usato ${used} dei tuoi ${lim} annunci mensili (80%+). Considera un upgrade per continuare.`
        : `You've used ${used} of your ${lim} monthly listings (80%+). Consider upgrading to continue.`,
  };

  useEffect(() => {
    const success = searchParams.get('success');
    const boost = searchParams.get('boost');
    const canceled = searchParams.get('canceled');

    if (boost === 'success') {
      toast({ title: t.boostActivated, description: t.boostDesc, duration: 8000 });
      window.history.replaceState({}, '', '/dashboard');
    } else if (success === 'true') {
      const upgradedPlan = localStorage.getItem('upgradedPlan');
      if (upgradedPlan === 'agency') {
        toast({ title: t.agencyActive, description: t.agencyDesc, duration: 8000 });
        localStorage.removeItem('upgradedPlan');
      } else {
        toast({ title: t.paymentDone, description: t.paymentDesc, duration: 5000 });
      }
      window.history.replaceState({}, '', '/dashboard');
    }

    if (canceled === 'true') {
      toast({ title: t.checkoutCanceled, description: t.checkoutCanceledDesc, variant: 'default', duration: 4000 });
      window.history.replaceState({}, '', '/dashboard');
    }

    const limitReached = searchParams.get('limit_reached');
    if (limitReached === 'true') {
      setShowLimitModal(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (isNearLimit && !hasReachedLimit && plan !== 'agency') {
      const hasShownNearLimitWarning = sessionStorage.getItem('nearLimitWarningShown');
      if (!hasShownNearLimitWarning) {
        toast({ title: t.limitNear, description: t.limitNearDesc(currentUsage, limit), duration: 6000 });
        sessionStorage.setItem('nearLimitWarningShown', 'true');
      }
    }
    
    if (hasReachedLimit && plan !== 'agency') {
      setShowLimitModal(true);
    }
  }, [isNearLimit, hasReachedLimit, currentUsage, limit, plan, toast]);

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
