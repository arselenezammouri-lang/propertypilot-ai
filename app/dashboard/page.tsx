import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardProBanner } from "@/components/demo-modal";
import NextDynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { STRIPE_ONE_TIME_PACKAGES } from "@/lib/stripe/config";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardStatsCards } from "@/components/dashboard-stats-cards";
import { DashboardProTips } from "@/components/dashboard-pro-tips";
import { isLocalMockModeEnabled } from "@/lib/utils/local-dev";
import { LOCAL_MOCK_USER_ID, getLocalMockPlan } from "@/lib/api/local-mock-service";
import { 
  Home, 
  FileText, 
  CreditCard, 
  Settings, 
  TrendingUp,
  ArrowRight,
  Zap,
  Plus,
  Link2,
  Award,
  Rocket,
  Crown,
  Target,
  BarChart3,
  Gift,
  Share2,
  MousePointerClick,
  Globe,
  User,
  Users,
  Mail,
  Video,
  Bot,
  MessageSquare,
  Check
} from "lucide-react";

export const dynamic = 'force-dynamic';

// Lazy load heavy components
const Dashboard3DStats = NextDynamic(() => import("@/components/dashboard-3d-stats").then(mod => ({ default: mod.Dashboard3DStats })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const MorningBriefingBox = NextDynamic(() => import("@/components/morning-briefing-box").then(mod => ({ default: mod.MorningBriefingBox })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const SniperStats = NextDynamic(() => import("@/components/sniper-stats").then(mod => ({ default: mod.SniperStats })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const RegionalPortals = NextDynamic(() => import("@/components/regional-portals").then(mod => ({ default: mod.RegionalPortals })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const GlobalLiveFeed = NextDynamic(() => import("@/components/global-live-feed").then(mod => ({ default: mod.GlobalLiveFeed })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const DashboardHelpButton = NextDynamic(() => import("@/components/dashboard-help-button").then(mod => ({ default: mod.DashboardHelpButton })), {
  ssr: false,
});

const DashboardPlanFeatures = NextDynamic(() => import("@/components/dashboard-plan-features").then(mod => ({ default: mod.DashboardPlanFeatures })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const DashboardPlanCardsSection = NextDynamic(() => import("@/components/dashboard-plan-cards-section").then(mod => ({ default: mod.DashboardPlanCardsSection })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const AriaCoach = NextDynamic(() => import("@/components/aria-coach").then(mod => ({ default: mod.AriaCoach })), {
  loading: () => <div className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-muted/40 animate-pulse" />,
  ssr: false,
});

const ReferralSection = NextDynamic(() => import("@/components/referral-section").then(mod => ({ default: mod.ReferralSection })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const ProfitDashboard = NextDynamic(() => import("@/components/profit-dashboard").then(mod => ({ default: mod.ProfitDashboard })), {
  loading: () => <div className="pp-card p-8 animate-pulse bg-muted/40" />,
  ssr: false,
});

const UsageIndicator = NextDynamic(() => import("@/components/usage-indicator").then(mod => ({ default: mod.UsageIndicator })), {
  loading: () => <div className="pp-card p-4 animate-pulse" />,
  ssr: false,
});

const OnboardingFlow = NextDynamic(() => import("@/components/onboarding-flow").then(mod => ({ default: mod.OnboardingFlow })), {
  ssr: false,
});

const OnboardingChecklist = NextDynamic(() => import("@/components/onboarding-flow").then(mod => ({ default: mod.OnboardingChecklist })), {
  ssr: false,
});

const UpgradeInline = NextDynamic(() => import("@/components/upgrade-prompt").then(mod => ({ default: mod.UpgradeInline })), {
  ssr: false,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const localMockMode = isLocalMockModeEnabled();
  const localMockPlan = getLocalMockPlan();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if ((error || !user) && !localMockMode) {
    redirect("/auth/login");
  }

  const resolvedUserId = user?.id ?? LOCAL_MOCK_USER_ID;

  const profile = user
    ? (
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", resolvedUserId)
        .maybeSingle()
    ).data
    : { full_name: "Founder (Local Mock)" };

  const subscription = user
    ? (
      await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", resolvedUserId)
        .maybeSingle()
    ).data
    : {
      status: localMockPlan,
      stripe_subscription_id: localMockPlan === "free" ? null : "sub_local_mock_agency",
      generations_count: 0,
    };

  const paidStatuses = new Set(['starter', 'pro', 'agency']);
  const rawStatus = subscription?.status || 'free';
  const isStripeVerifiedPaid =
    paidStatuses.has(rawStatus) ? Boolean(subscription?.stripe_subscription_id) : true;

  // Security: never expose paid UI if DB has paid status without Stripe linkage.
  const planValue = isStripeVerifiedPaid ? rawStatus : 'free';
  const currentPlan: "free" | "starter" | "pro" | "agency" = 
    (planValue === "free" || planValue === "starter" || planValue === "pro" || planValue === "agency") 
      ? planValue 
      : "free";
  
  const actualUsage = (subscription as any)?.generations_count || 0;

  const planLimits = {
    free: { listings: 5, used: actualUsage },
    starter: { listings: 50, used: actualUsage },
    pro: { listings: 200, used: actualUsage },
    agency: { listings: -1, used: actualUsage }
  };

  const limits = planLimits[currentPlan] || planLimits.free;
  const showUpgradeBanner = currentPlan === "free" || currentPlan === "starter";

  // Query real saved listings count
  let savedCount = 0;
  if (user) {
    const { count } = await supabase
      .from("saved_listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", resolvedUserId);
    savedCount = count || 0;
  }

  // Render dashboard (shell: header, main, wrapper from app/dashboard/layout.tsx)
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ONBOARDING CHECKLIST (shows until user completes or dismisses) */}
        <OnboardingChecklist />

        {/* STATS GRID */}
        <section className="dashboard-section" aria-label="Piano e statistiche">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardStatsCards currentPlan={currentPlan} limits={limits} savedCount={savedCount} />
              {(currentPlan === "pro" || currentPlan === "agency") && (
                <Dashboard3DStats />
              )}
            </div>
          </section>

          {/* UPGRADE PROMPT — only for free and starter */}
          {(currentPlan === "free" || currentPlan === "starter") && (
            <section className="dashboard-section">
              <UpgradeInline currentPlan={currentPlan} />
            </section>
          )}

          {/* PROFIT + REFERRAL + USAGE */}
          <section className="dashboard-section" aria-label="ROI e utilizzo">
            <div className="dashboard-card-row">
              <div className="dashboard-card-equal">
                <ProfitDashboard />
              </div>
              <div className="dashboard-card-equal">
                <ReferralSection />
              </div>
              <div className="dashboard-card-equal">
                <UsageIndicator />
              </div>
            </div>
          </section>

          {/* 🌅 AI MORNING INTEL BRIEFING */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label="Morning briefing">
              <MorningBriefingBox />
            </section>
          )}

          {/* 🌍 REGIONAL PORTALS */}
          <section className="dashboard-section" aria-label="Portali regionali">
            <RegionalPortals />
          </section>

          {/* 🌍 GLOBAL LIVE FEED */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label="Live feed">
              <GlobalLiveFeed />
            </section>
          )}

          {/* 🎯 PIANO ATTUALE + 📋 TUTTI I PIANI */}
          <section className="dashboard-section" aria-label="Piani e prezzi">
            <DashboardPlanCardsSection currentPlan={currentPlan} />
          </section>

          {/* 🚀 ALL TOOLS */}
          <section className="dashboard-section" aria-label="Strumenti e funzionalità">
            <DashboardPlanFeatures currentPlan={currentPlan} />
          </section>

          {/* 🎯 SNIPER STATS */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label="Statistiche sniper">
              <SniperStats />
            </section>
          )}
      </div>

      <DashboardProTips />

      {/* Aria Coach */}
      <AriaCoach 
        userName={profile?.full_name || undefined} 
        userPlan={currentPlan as "free" | "starter" | "pro" | "agency"} 
      />

      {/* Onboarding modal — shows on first visit */}
      <OnboardingFlow userName={profile?.full_name || undefined} />
    </>
  );
}
