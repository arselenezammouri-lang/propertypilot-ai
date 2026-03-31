"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("pp_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("pp_cookie_consent", "accepted");
    localStorage.setItem("pp_cookie_consent_date", new Date().toISOString());
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("pp_cookie_consent", "declined");
    localStorage.setItem("pp_cookie_consent_date", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-fade-in-up">
      <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">
            We use cookies to improve your experience. By continuing, you agree to our{" "}
            <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={decline}
            className="text-xs text-muted-foreground h-8"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="h-8 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-xs font-medium px-4"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
