"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Zap,
  ArrowRight,
  Check,
  Building2,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  href: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: "generate",
    title: "Generate your first listing",
    description: "Enter a property's details and watch AI create a professional listing in seconds.",
    icon: FileText,
    action: "Generate now",
    href: "/dashboard/listings",
  },
  {
    id: "lead",
    title: "Add your first lead",
    description: "Start building your pipeline. Add a contact and let AI score them automatically.",
    icon: Users,
    action: "Add a lead",
    href: "/dashboard/leads",
  },
  {
    id: "explore",
    title: "Explore AI tools",
    description: "Try hashtag generation, social posts, video scripts, and more from the dashboard.",
    icon: Zap,
    action: "Explore tools",
    href: "/dashboard",
  },
];

export function OnboardingFlow({ userName }: { userName?: string }) {
  const [visible, setVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen onboarding
    const dismissed = localStorage.getItem("pp_onboarding_dismissed");
    const completed = localStorage.getItem("pp_onboarding_completed");
    if (!dismissed && !completed) {
      // Show after a brief delay so dashboard renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }

    // Load completed steps
    try {
      const saved = JSON.parse(localStorage.getItem("pp_onboarding_steps") || "[]");
      setCompletedSteps(saved);
    } catch {}
  }, []);

  const completeStep = (stepId: string) => {
    const updated = [...new Set([...completedSteps, stepId])];
    setCompletedSteps(updated);
    localStorage.setItem("pp_onboarding_steps", JSON.stringify(updated));

    if (updated.length >= STEPS.length) {
      localStorage.setItem("pp_onboarding_completed", "true");
    }
  };

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("pp_onboarding_dismissed", "true");
  };

  const handleAction = (step: OnboardingStep) => {
    completeStep(step.id);
    setVisible(false);
    router.push(step.href);
  };

  if (!visible) return null;

  const step = STEPS[currentStep];
  const progress = completedSteps.length / STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Building2 className="w-5 h-5 text-background" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {userName ? `Welcome, ${userName.split(" ")[0]}!` : "Welcome to PropertyPilot!"}
              </h2>
              <p className="text-sm text-muted-foreground">Let's get you set up in 2 minutes</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progress * 100, 5)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedSteps.length} of {STEPS.length} steps completed
          </p>
        </div>

        {/* Steps */}
        <div className="px-8 pb-4">
          {STEPS.map((s, i) => {
            const isCompleted = completedSteps.includes(s.id);
            const isCurrent = i === currentStep;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all mb-2 ${
                  isCurrent
                    ? "bg-muted/80 border border-border"
                    : "hover:bg-muted/40"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-600"
                      : isCurrent
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {s.title}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.description}
                    </p>
                  )}
                </div>
                {isCurrent && !isCompleted && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action */}
        <div className="px-8 pb-8 flex items-center gap-3">
          <Button
            onClick={() => handleAction(step)}
            className="flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-medium"
          >
            {step.action}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={dismiss}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline checklist for the dashboard (shows after modal is dismissed)
 */
export function OnboardingChecklist() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem("pp_onboarding_completed");
    const hidden = localStorage.getItem("pp_onboarding_checklist_hidden");
    if (completed || hidden) {
      setDismissed(true);
      return;
    }

    const onboardingDismissed = localStorage.getItem("pp_onboarding_dismissed");
    if (onboardingDismissed) {
      setDismissed(false);
    }

    try {
      const saved = JSON.parse(localStorage.getItem("pp_onboarding_steps") || "[]");
      setCompletedSteps(saved);
    } catch {}
  }, []);

  const hideChecklist = () => {
    setDismissed(true);
    localStorage.setItem("pp_onboarding_checklist_hidden", "true");
  };

  if (dismissed) return null;

  const allDone = completedSteps.length >= STEPS.length;

  return (
    <div className="pp-card p-5 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Getting started</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allDone ? "All done! You're ready to go." : `${completedSteps.length}/${STEPS.length} completed`}
          </p>
        </div>
        <button
          onClick={hideChecklist}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {STEPS.map((s) => {
          const isCompleted = completedSteps.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => router.push(s.href)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/50 transition-colors text-sm"
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                isCompleted ? "bg-emerald-500 border-emerald-500" : "border-border"
              }`}>
                {isCompleted && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={isCompleted ? "line-through text-muted-foreground" : ""}>{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
