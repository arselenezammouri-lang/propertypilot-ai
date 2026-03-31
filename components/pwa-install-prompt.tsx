"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) return;

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOSDevice && !isInStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    // Service worker registration intentionally disabled while stabilizing dashboard runtime.

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-border rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-7 w-7 text-foreground" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-foreground font-semibold text-lg mb-1">
              Aggiungi PropertyPilot alla Home
            </h3>
            <p className="text-foreground/60 text-sm mb-4">
              Usa PropertyPilot AI come un'app nativa per accesso rapido e funzionalità Voice AI in mobilità.
            </p>
            
            {isIOS ? (
              <div className="text-sm text-foreground/70 bg-muted/30 rounded-lg p-3">
                <p className="flex items-center gap-2">
                  <span>1. Tocca</span>
                  <span className="bg-muted/50 px-2 py-0.5 rounded">Condividi</span>
                  <span>in Safari</span>
                </p>
                <p className="mt-1">2. Seleziona "Aggiungi alla schermata Home"</p>
              </div>
            ) : (
              <Button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-foreground font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Installa App
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
