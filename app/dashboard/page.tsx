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
import { headers } from "next/headers";
import { resolveUiSubscriptionPlan } from "@/lib/utils/effective-plan";
import { isFounderSubscriptionPreviewAllowed } from "@/lib/utils/local-dev-host";

export const dynamic = 'force-dynamic';

// Lazy load heavy components
const Dashboard3DStats = NextDynamic(() => import("@/components/dashboard-3d-stats").then(mod => ({ default: mod.Dashboard3DStats })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const MorningBriefingBox = NextDynamic(() => import("@/components/morning-briefing-box").then(mod => ({ default: mod.MorningBriefingBox })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const SniperStats = NextDynamic(() => import("@/components/sniper-stats").then(mod => ({ default: mod.SniperStats })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const RegionalPortals = NextDynamic(() => import("@/components/regional-portals").then(mod => ({ default: mod.RegionalPortals })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const GlobalLiveFeed = NextDynamic(() => import("@/components/global-live-feed").then(mod => ({ default: mod.GlobalLiveFeed })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const DashboardHelpButton = NextDynamic(() => import("@/components/dashboard-help-button").then(mod => ({ default: mod.DashboardHelpButton })), {
  ssr: false,
});

const DashboardPlanFeatures = NextDynamic(() => import("@/components/dashboard-plan-features").then(mod => ({ default: mod.DashboardPlanFeatures })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const DashboardPlanCardsSection = NextDynamic(() => import("@/components/dashboard-plan-cards-section").then(mod => ({ default: mod.DashboardPlanCardsSection })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const AriaCoach = NextDynamic(() => import("@/components/aria-coach").then(mod => ({ default: mod.AriaCoach })), {
  loading: () => <div className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-card/50 animate-pulse" />,
  ssr: false,
});

const ReferralSection = NextDynamic(() => import("@/components/referral-section").then(mod => ({ default: mod.ReferralSection })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const ProfitDashboard = NextDynamic(() => import("@/components/profit-dashboard").then(mod => ({ default: mod.ProfitDashboard })), {
  loading: () => <div className="futuristic-card p-8 animate-pulse bg-card/50" />,
  ssr: false,
});

const UsageIndicator = NextDynamic(() => import("@/components/usage-indicator").then(mod => ({ default: mod.UsageIndicator })), {
  loading: () => <div className="futuristic-card p-4 animate-pulse bg-card/50" />,
  ssr: false,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Piano UI: founder = agency (come /api/user/subscription), altrimenti DB
  const rawPlan = (profile as { subscription_plan?: string } | null)?.subscription_plan
    ?? subscription?.status
    ?? "free";
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "";
  const localDevHost = isFounderSubscriptionPreviewAllowed(host);
  const currentPlan = resolveUiSubscriptionPlan(user.email, rawPlan, { localDevHost });
  
  const planLimits = {
    free: { listings: 5, used: 0 },
    starter: { listings: 50, used: 0 },
    pro: { listings: 200, used: 0 },
    agency: { listings: -1, used: 0 }
  } as const;

  const limits = planLimits[currentPlan] || planLimits.free;
  const showUpgradeBanner = currentPlan === "free" || currentPlan === "starter";

  // Render dashboard (shell: header, main, wrapper from app/dashboard/layout.tsx)
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* STATS GRID - Premium Futuristic Cards */}
        <section className="dashboard-section" aria-label="Piano e statistiche">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <DashboardStatsCards currentPlan={currentPlan} limits={limits} />
              {(currentPlan === "pro" || currentPlan === "agency") && (
                <Dashboard3DStats />
              )}
            </div>
          </section>

          {/* 💰 PROFIT + REFERRAL + USAGE - Card uguale altezza */}
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

      {/* Aria Coach - Con limiti per piano FREE (1 ora/giorno) */}
      <AriaCoach 
        userName={profile?.full_name || undefined} 
        userPlan={currentPlan as "free" | "starter" | "pro" | "agency"} 
      />
    </>
  );
}
