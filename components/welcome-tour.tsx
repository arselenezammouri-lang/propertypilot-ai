"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Globe, TrendingDown, Zap, Gift, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ScanStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const scanSteps: ScanStep[] = [
  {
    id: "sync",
    label: "Sincronizzazione con i portali globali...",
    icon: <Globe className="h-5 w-5" />,
    duration: 2000,
  },
  {
    id: "arbitrage",
    label: "Analisi Arbitraggio in corso...",
    icon: <TrendingDown className="h-5 w-5" />,
    duration: 2000,
  },
  {
    id: "radar",
    label: "Radar Competitor attivato...",
    icon: <Sparkles className="h-5 w-5" />,
    duration: 2000,
  },
];

export function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showGift, setShowGift] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Controlla se è il primo accesso (usa localStorage)
    const hasSeenWelcome = localStorage.getItem("propertypilot_welcome_seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
      startScanAnimation();
    }
  }, []);

  const startScanAnimation = () => {
    let totalDuration = 0;
    scanSteps.forEach((step) => {
      totalDuration += step.duration;
    });

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Aggiorna step corrente
      let stepElapsed = 0;
      for (let i = 0; i < scanSteps.length; i++) {
        stepElapsed += scanSteps[i].duration;
        if (elapsed <= stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(() => {
          setShowGift(true);
        }, 500);
      }
    }, 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("propertypilot_welcome_seen", "true");
  };

  const handleUnlockGift = () => {
    handleClose();
    router.push("/dashboard/prospecting");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-[#0a0a0a] via-purple-900/20 to-cyan-900/20 border-purple-500/30 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Benvenuto nel Futuro del Real Estate
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <DialogDescription className="text-lg text-gray-300">
            [Nome], stiamo preparando il tuo Command Center
          </DialogDescription>
        </DialogHeader>

        {!showGift ? (
          <div className="space-y-6 py-6">
            {/* Circular Progress */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-purple-500/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                    className="text-purple-400 transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{Math.round(progress)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 text-purple-400">
                {scanSteps[currentStep]?.icon}
                <p className="text-lg font-semibold">{scanSteps[currentStep]?.label}</p>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {scanSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    idx < currentStep
                      ? "bg-green-500/10 border-green-500/30"
                      : idx === currentStep
                      ? "bg-purple-500/10 border-purple-500/30"
                      : "bg-white/[0.04] border-white/10"
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-current" />
                  )}
                  <span
                    className={`text-sm ${
                      idx < currentStep
                        ? "text-green-400"
                        : idx === currentStep
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6 text-center">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-400/30">
                <Gift className="h-12 w-12 text-purple-400" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Trovati <span className="text-cyan-400">3 Deal Oro</span> nella tua zona
              </h3>
              <p className="text-gray-300 text-lg">
                Il sistema ha già scansionato i portali e trovato opportunità con Market Gap significativo
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((deal) => (
                  <div
                    key={deal}
                    className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg"
                  >
                    <Badge className="bg-green-500 text-white mb-2">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -{15 + deal * 3}%
                    </Badge>
                    <p className="text-xs text-gray-400 mt-2">Deal #{deal}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/dashboard/prospecting">
                  <Button
                    onClick={handleUnlockGift}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold text-lg px-8 py-6"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Clicca per sbloccare la tua prima provvigione
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

