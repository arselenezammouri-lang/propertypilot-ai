"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, FileText, Rocket, ArrowRight, ArrowLeft, CheckCircle, PartyPopper, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";

interface OnboardingWizardProps {
  onComplete?: () => void;
}

const ONBOARDING_SEEN_KEY = "propertypilot_onboarding_seen";

type StepDef = {
  icon: typeof Home;
  gradient: string;
  title: string;
  description: string;
  details: string[];
};

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isClosingRef = useRef(false);
  const onboardingEnabled = process.env.NEXT_PUBLIC_ENABLE_ONBOARDING === "true";
  const router = useRouter();
  const { locale } = useLocaleContext();
  const w = useMemo(() => getTranslation(locale as SupportedLocale).onboardingWizard, [locale]);

  const ONBOARDING_STEPS: StepDef[] = useMemo(
    () => [
      {
        icon: Home,
        gradient: "from-royal-purple to-electric-blue",
        title: w.steps[0].title,
        description: w.steps[0].description,
        details: w.steps[0].details,
      },
      {
        icon: FileText,
        gradient: "from-electric-blue to-neon-aqua",
        title: w.steps[1].title,
        description: w.steps[1].description,
        details: w.steps[1].details,
      },
      {
        icon: Rocket,
        gradient: "from-sunset-gold to-amber-500",
        title: w.steps[2].title,
        description: w.steps[2].description,
        details: w.steps[2].details,
      },
    ],
    [w]
  );

  const markOnboardingSeen = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
  }, []);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      if (!onboardingEnabled || typeof window === "undefined") {
        return;
      }

      const alreadySeen = localStorage.getItem(ONBOARDING_SEEN_KEY) === "true";
      if (alreadySeen) {
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileError && profile && profile.onboarding_completed === false) {
        setIsOpen(true);
      }
    } catch {
      // Silently fail - onboarding is not critical
    } finally {
      setIsLoading(false);
    }
  }, [onboardingEnabled]);

  useEffect(() => {
    void checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  const completeOnboarding = useCallback(
    async (reason: "completed" | "dismissed") => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      markOnboardingSeen();

      setIsOpen(false);
      onComplete?.();

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
        }
      } catch {
        // Silently fail
      } finally {
        isClosingRef.current = false;
      }
    },
    [markOnboardingSeen, onComplete]
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      return;
    }
    if (isOpen) {
      void completeOnboarding("dismissed");
    }
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      void completeOnboarding("completed");
      router.push("/dashboard/listings?onboarding=true");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    void completeOnboarding("dismissed");
  };

  if (!onboardingEnabled) return null;
  if (isLoading) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {isOpen ? (
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background to-royal-purple/5 border-royal-purple/20">
          <DialogHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg animate-pulse`}
              >
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-gradient-to-r from-royal-purple to-electric-blue"
                      : index < currentStep
                        ? "bg-neon-aqua"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <DialogTitle className="text-2xl font-bold">
              <span className="gradient-text-purple">{step.title}</span>
            </DialogTitle>
            <DialogDescription className="text-base mt-2">{step.description}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ul className="space-y-3">
              {step.details.map((detail, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-silver-frost/10"
                >
                  <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {isLastStep && (
            <div className="flex items-center justify-center gap-2 py-2">
              <PartyPopper className="h-5 w-5 text-sunset-gold animate-bounce" />
              <span className="text-sm font-medium text-sunset-gold">{w.readyToStart}</span>
              <PartyPopper className="h-5 w-5 text-sunset-gold animate-bounce" />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex gap-2 w-full">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep} className="flex-1" type="button">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {w.back}
                </Button>
              )}
              {currentStep === 0 && (
                <Button variant="ghost" onClick={skipOnboarding} className="flex-1 text-muted-foreground" type="button">
                  {w.skip}
                </Button>
              )}
              <Button
                onClick={nextStep}
                className={`flex-1 bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white`}
                type="button"
              >
                {isLastStep ? (
                  <>
                    {w.createFirstListing}
                    <Zap className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {w.next}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
