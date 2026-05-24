"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Building2,
  Sparkles,
  Globe,
  Mail,
  BarChart3,
  MessageCircle,
  Target,
  ArrowRight,
  Rocket,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  checkKey: string;
  cta: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete Agency Profile",
    description: "Add your agency name, logo, contact details, and service areas. This powers your branding across all features.",
    href: "/dashboard/settings/profile",
    icon: Building2,
    checkKey: "profile_completed",
    cta: "Set Up Profile",
  },
  {
    id: "listing",
    title: "Create Your First AI Listing",
    description: "Generate a professional property listing in seconds. Choose from 3 writing styles and 6 languages.",
    href: "/dashboard/ai-listings",
    icon: Sparkles,
    checkKey: "first_listing_created",
    cta: "Create Listing",
  },
  {
    id: "portal",
    title: "Connect a Portal",
    description: "Link your account to Immobiliare.it, Idealista, ImmoScout24, or any of our 16 supported portals.",
    href: "/dashboard/portals",
    icon: Globe,
    checkKey: "portal_connected",
    cta: "Connect Portal",
  },
  {
    id: "email",
    title: "Set Up Email Signature",
    description: "Configure your email templates and signature for automated follow-ups and campaigns.",
    href: "/dashboard/settings/workspace",
    icon: Mail,
    checkKey: "email_configured",
    cta: "Configure Email",
  },
  {
    id: "cma",
    title: "Generate Your First CMA",
    description: "Create a Comparative Market Analysis with automated valuations, comparables, and branded PDF reports.",
    href: "/dashboard/cma",
    icon: BarChart3,
    checkKey: "first_cma_generated",
    cta: "Create CMA",
  },
  {
    id: "whatsapp",
    title: "Configure WhatsApp AI",
    description: "Connect your WhatsApp Business account and let AI handle inquiries 24/7 in 6 languages.",
    href: "/dashboard/whatsapp",
    icon: MessageCircle,
    checkKey: "whatsapp_configured",
    cta: "Set Up WhatsApp",
  },
  {
    id: "scoring",
    title: "Set Lead Scoring Rules",
    description: "Configure speed-to-lead automation: auto-call hot leads, WhatsApp warm leads, email nurture.",
    href: "/dashboard/automations",
    icon: Target,
    checkKey: "scoring_configured",
    cta: "Configure Scoring",
  },
];

export default function OnboardingPage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load completion state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_onboarding");
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const toggleStep = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      localStorage.setItem("pp_onboarding", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const completedCount = completedSteps.size;
  const totalSteps = STEPS.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const allDone = completedCount === totalSteps;

  if (loading) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          {allDone ? "🎉 You're All Set!" : "Get Started with PropertyPilot"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {allDone
            ? "Your agency is fully configured. Explore all features from the dashboard."
            : "Complete these steps to unlock the full power of AI for your agency."
          }
        </p>
      </div>

      {/* Progress */}
      <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {allDone ? (
              <Trophy className="w-5 h-5 text-amber-400" />
            ) : (
              <Rocket className="w-5 h-5 text-indigo-400" />
            )}
            <span className="font-semibold">
              {completedCount}/{totalSteps} steps completed
            </span>
          </div>
          <Badge
            variant="outline"
            className={
              allDone
                ? "text-emerald-400 border-emerald-500/30"
                : "text-indigo-400 border-indigo-500/30"
            }
          >
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isComplete = completedSteps.has(step.id);
          return (
            <Card
              key={step.id}
              className={`p-5 bg-card/50 backdrop-blur transition-all ${
                isComplete
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border/50 hover:border-indigo-500/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Check button */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className="mt-0.5 flex-shrink-0"
                  aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/40 hover:text-indigo-400 transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      Step {index + 1}
                    </span>
                    <step.icon className={`w-4 h-4 ${isComplete ? "text-emerald-400" : "text-indigo-400"}`} />
                  </div>
                  <h3 className={`font-semibold ${isComplete ? "line-through text-muted-foreground" : ""}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Action */}
                {!isComplete && (
                  <Link href={step.href} className="flex-shrink-0">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      {step.cta} <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Completion CTA */}
      {allDone && (
        <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/30 text-center">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Agency Setup Complete!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You&apos;re ready to generate listings, score leads, and close deals faster with AI.
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
