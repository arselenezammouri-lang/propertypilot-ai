"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, PartyPopper, X } from "lucide-react";

export function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (success === "true" || canceled === "true") {
      setShow(true);
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [success, canceled]);

  if (!show) return null;

  if (canceled === "true") {
    return (
      <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Payment canceled</p>
            <p className="text-xs text-muted-foreground">No worries — you can upgrade anytime from the billing page.</p>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm flex items-center gap-2">
            Payment successful! <PartyPopper className="w-4 h-4" />
          </p>
          <p className="text-xs text-muted-foreground">Your plan is now active. Start using all your new features.</p>
        </div>
      </div>
      <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
    </div>
  );
}
