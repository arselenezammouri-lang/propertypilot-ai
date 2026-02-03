"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PendingCheckoutBanner } from "./pending-checkout-banner";
import { OnboardingWizard } from "./onboarding-wizard";
import { AriaLimitModal } from "./aria-limit-modal";
import { useUsageLimits } from "@/hooks/use-usage-limits";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { hasReachedLimit, isNearLimit, currentUsage, limit, plan } = useUsageLimits();
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      const upgradedPlan = localStorage.getItem('upgradedPlan');
      if (upgradedPlan === 'agency') {
        toast({
          title: '🎉 Agency Intelligence Active',
          description: 'Accesso Premium Confermato - Benvenuto nel Network Globale PropertyPilot!',
          duration: 8000,
        });
        localStorage.removeItem('upgradedPlan');
      } else {
        toast({
          title: '✅ Pagamento completato!',
          description: 'Il tuo piano è stato attivato con successo.',
          duration: 5000,
        });
      }
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
        toast({
          title: '⚠️ Limite quasi raggiunto!',
          description: `Hai usato ${currentUsage} dei tuoi ${limit} annunci mensili (80%+). Considera un upgrade per continuare.`,
          duration: 6000,
        });
        sessionStorage.setItem('nearLimitWarningShown', 'true');
      }
    }
    
    if (hasReachedLimit && plan !== 'agency') {
      setShowLimitModal(true);
    }
  }, [isNearLimit, hasReachedLimit, currentUsage, limit, plan, toast]);

  return (
    <>
      <OnboardingWizard />
      <PendingCheckoutBanner />
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
