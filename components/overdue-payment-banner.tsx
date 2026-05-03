"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OverduePaymentBanner() {
  const [show, setShow] = useState(false);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  async function checkPaymentStatus() {
    try {
      const res = await fetch("/api/user/subscription");
      if (!res.ok) return;
      const data = await res.json();
      const fails = data.payment_failed_count || 0;
      if (fails > 0) {
        setFailCount(fails);
        setShow(true);
      }
    } catch { /* silent */ }
  }

  if (!show) return null;

  return (
    <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between ${failCount >= 3 ? "border-red-500/40 bg-red-500/10" : "border-amber-500/30 bg-amber-500/5"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${failCount >= 3 ? "bg-red-500/20" : "bg-amber-500/10"}`}>
          <AlertTriangle className={`w-5 h-5 ${failCount >= 3 ? "text-red-400" : "text-amber-400"}`} />
        </div>
        <div>
          <p className="font-semibold text-sm">
            {failCount >= 3 ? "Account downgraded — payment failed" : "Payment issue — please update your card"}
          </p>
          <p className="text-xs text-muted-foreground">
            {failCount >= 3
              ? "Your subscription has been paused. Update your payment method to reactivate."
              : `Payment attempt ${failCount} of 3 failed. Please update your card to avoid service interruption.`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/dashboard/billing">
          <Button size="sm" className="h-8 text-xs gap-1 bg-foreground text-background">
            <CreditCard className="w-3 h-3" /> Update Card
          </Button>
        </Link>
        <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
