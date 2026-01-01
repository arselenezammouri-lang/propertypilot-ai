"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Sparkles, X, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLAN_DETAILS: Record<string, { name: string; price: string; color: string }> = {
  starter: { name: "Starter", price: "€97/mese", color: "from-blue-500 to-cyan-500" },
  pro: { name: "Pro", price: "€297/mese", color: "from-purple-500 to-pink-500" },
  agency: { name: "Agency", price: "€497/mese", color: "from-amber-500 to-orange-500" },
  boost: { name: "Agency Boost", price: "€2.497", color: "from-emerald-500 to-teal-500" },
};

export function PendingCheckoutBanner() {
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [pendingPackage, setPendingPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();

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
        throw new Error(data.error || "Errore durante la sincronizzazione");
      }

      toast({
        title: "Sincronizzazione completata!",
        description: `Piano attuale: ${data.plan?.toUpperCase() || 'FREE'}`,
      });

      if (data.plan && data.plan !== 'free') {
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("pendingPackage");
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
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
        throw new Error("Piano non valido");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante la creazione del checkout");
      }

      if (data.url) {
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("pendingPackage");
        window.location.href = data.url;
      } else {
        throw new Error("URL checkout non ricevuto");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile avviare il pagamento",
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

  const planKey = pendingPlan || pendingPackage || "starter";
  const details = PLAN_DETAILS[planKey] || PLAN_DETAILS.starter;

  return (
    <Card className="mb-8 border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10 animate-fade-in-up overflow-hidden relative" data-testid="pending-checkout-banner">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors z-10"
        aria-label="Chiudi"
        data-testid="button-dismiss-checkout"
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
                Completa l'attivazione del piano {details.name}
              </h3>
              <p className="text-muted-foreground">
                Hai selezionato il piano <strong>{details.name}</strong> ({details.price}). 
                Clicca il pulsante per completare il pagamento e attivare tutte le funzionalità.
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
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Caricamento...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Vai al Pagamento
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
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sincronizzazione...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Già pagato? Sincronizza
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
