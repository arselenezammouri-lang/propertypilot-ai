import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardProBanner } from "@/components/demo-modal";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";
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

  // Get current plan: prefer profile.subscription_plan (synced by Stripe webhook), fallback to subscription.status
  const planValue = (profile as any)?.subscription_plan || subscription?.status || "free";
  const currentPlan: "free" | "starter" | "pro" | "agency" = 
    (planValue === "free" || planValue === "starter" || planValue === "pro" || planValue === "agency") 
      ? planValue 
      : "free";
  
  const planLimits = {
    free: { listings: 5, used: 0 },
    starter: { listings: 50, used: 0 },
    pro: { listings: 200, used: 0 },
    agency: { listings: -1, used: 0 }
  } as const;

  const limits = planLimits[currentPlan] || planLimits.free;
  const showUpgradeBanner = currentPlan === "free" || currentPlan === "starter";

  // Render dashboard
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Mesh Gradient Background - Same as Landing Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9333ea]/10 rounded-full blur-3xl"></div>
      </div>
      <DashboardHeader />

      {/* MAIN DASHBOARD CONTENT */}
      <main className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* PENDING CHECKOUT BANNER - Client Component */}
          <DashboardClientWrapper>
            <></>
          </DashboardClientWrapper>
          

          {/* STATS GRID - Premium Futuristic Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
          <DashboardStatsCards currentPlan={currentPlan} limits={limits} />

          {/* Progetti 3D Generati & WhatsApp Stats - Solo per PRO/AGENCY */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <Dashboard3DStats />
          )}
        </div>

        {/* 💰 PROFIT DASHBOARD - ROI Tracking */}
        <div className="mb-10 md:mb-14">
          <div className="grid md:grid-cols-3 gap-6">
            <ProfitDashboard />
            <ReferralSection />
            <UsageIndicator />
          </div>
        </div>

        {/* 🌅 AI MORNING INTEL BRIEFING */}
        {(currentPlan === "pro" || currentPlan === "agency") && (
          <MorningBriefingBox />
        )}

        {/* 🌍 REGIONAL PORTALS - Geo-Aware */}
        <div className="mb-10 md:mb-14">
          <DashboardClientWrapper>
            <RegionalPortals />
          </DashboardClientWrapper>
        </div>

        {/* 🌍 GLOBAL LIVE FEED */}
        {(currentPlan === "pro" || currentPlan === "agency") && (
          <div className="mb-10 md:mb-14">
            <GlobalLiveFeed />
          </div>
        )}

        {/* 🎯 PIANO ATTUALE + 📋 TUTTI I PIANI (i18n client) */}
        <DashboardPlanCardsSection currentPlan={currentPlan} />

        {/* 🚀 ALL TOOLS - Interactive Plan Features Navigator */}
        <div className="mb-10 md:mb-14">
          <DashboardPlanFeatures currentPlan={currentPlan} />
        </div>

        {/* 🎯 SNIPER STATS */}
        {(currentPlan === "pro" || currentPlan === "agency") && (
          <div className="mb-10 md:mb-14">
            <SniperStats />
          </div>
        )}

        </div>

        <DashboardProTips />

        {/* Aria Coach - Con limiti per piano FREE (1 ora/giorno) */}
        <AriaCoach 
          userName={profile?.full_name || undefined} 
          userPlan={currentPlan as "free" | "starter" | "pro" | "agency"} 
        />

      </main>
    </div>
  );
}
