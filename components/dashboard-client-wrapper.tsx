"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PendingCheckoutBanner } from "./pending-checkout-banner";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      // Verifica se è un upgrade ad Agency
      const plan = localStorage.getItem('upgradedPlan');
      if (plan === 'agency') {
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
      // Rimuovi il parametro dall'URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, toast]);

  return (
    <>
      <PendingCheckoutBanner />
      {children}
    </>
  );
}
