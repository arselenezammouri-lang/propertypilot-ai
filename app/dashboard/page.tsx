import React from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import NextDynamic from "next/dynamic";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardStatsCards } from "@/components/dashboard-stats-cards";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import { DashboardProTips } from "@/components/dashboard-pro-tips";
import { DeferredMount } from "@/components/deferred-mount";
import { DeferIdleMount } from "@/components/defer-idle-mount";
import { resolveUiSubscriptionPlan } from "@/lib/utils/effective-plan";
import { isFounderSubscriptionPreviewAllowed } from "@/lib/utils/local-dev-host";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";

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

const DashboardOnboardingChecklist = NextDynamic(
  () => import("@/components/dashboard-onboarding-checklist").then((mod) => ({ default: mod.DashboardOnboardingChecklist })),
  { ssr: false, loading: () => null }
);

const DASHBOARD_LOCALES: SupportedLocale[] = ["it", "en", "es", "fr", "de", "ar", "pt"];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("propertypilot_locale")?.value;
  const uiLocale: SupportedLocale =
    rawLocale && DASHBOARD_LOCALES.includes(rawLocale as SupportedLocale)
      ? (rawLocale as SupportedLocale)
      : "it";
  const homeCopy = getTranslation(uiLocale).dashboard;

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

  const bl = homeCopy.planBadgeLabels;
  const planBadgeLabel =
    currentPlan === "agency"
      ? bl.agency
      : currentPlan === "pro"
        ? bl.pro
        : currentPlan === "starter"
          ? bl.starter
          : bl.free;

  const sec = homeCopy.homeSections;
  const load = homeCopy.deferredLoading;

  // Render dashboard (shell: header, main, wrapper from app/dashboard/layout.tsx)
  return (
    <>
      <div className="w-full py-8 md:py-12">
        <DashboardPageHeader
          title={homeCopy.commandCenterTitle}
          subtitle={homeCopy.commandCenterSubtitle}
          planBadge={{ label: planBadgeLabel, variant: "outline" }}
          contextualHelp={<ContextualHelpTrigger docSlug="getting-started/welcome" />}
          actions={
            <Button
              asChild
              className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] text-white border-0 shadow-lg hover:opacity-95"
            >
              <Link href="/dashboard/listings">
                <Plus className="h-4 w-4 mr-2" />
                {homeCopy.newListingCta}
              </Link>
            </Button>
          }
        />

        <DashboardOnboardingChecklist />

        {/* STATS GRID - Premium Futuristic Cards */}
        <section className="dashboard-section" aria-label={sec.planStats}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <DashboardStatsCards currentPlan={currentPlan} limits={limits} />
              {(currentPlan === "pro" || currentPlan === "agency") && (
                <DeferredMount
                  minHeight="220px"
                  rootMargin="320px 0px"
                  loadingLabel={load.stats3d}
                >
                  <Dashboard3DStats />
                </DeferredMount>
              )}
            </div>
          </section>

          {/* 💰 PROFIT + REFERRAL + USAGE - Card uguale altezza */}
          <section className="dashboard-section" aria-label={sec.roiUsage}>
            <DeferredMount
              minHeight="min(320px, 70vh)"
              rootMargin="480px 0px 240px 0px"
              loadingLabel={load.roiUsage}
            >
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
            </DeferredMount>
          </section>

          {/* 🌅 AI MORNING INTEL BRIEFING */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label={sec.morningIntel}>
              <DeferredMount
                minHeight="200px"
                rootMargin="400px 0px"
                loadingLabel={load.morningIntel}
              >
                <MorningBriefingBox />
              </DeferredMount>
            </section>
          )}

          {/* 🌍 REGIONAL PORTALS */}
          <section className="dashboard-section" aria-label={sec.regionalPortals}>
            <DeferredMount
              minHeight="160px"
              rootMargin="400px 0px"
              loadingLabel={load.regionalPortals}
            >
              <RegionalPortals />
            </DeferredMount>
          </section>

          {/* 🌍 GLOBAL LIVE FEED */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label={sec.liveFeed}>
              <DeferredMount
                minHeight="240px"
                rootMargin="400px 0px"
                loadingLabel={load.liveFeed}
              >
                <GlobalLiveFeed />
              </DeferredMount>
            </section>
          )}

          {/* 🎯 PIANO ATTUALE + 📋 TUTTI I PIANI */}
          <section className="dashboard-section" aria-label={sec.plansPricing}>
            <DeferredMount
              minHeight="380px"
              rootMargin="520px 0px 240px 0px"
              loadingLabel={load.plans}
            >
              <DashboardPlanCardsSection currentPlan={currentPlan} />
            </DeferredMount>
          </section>

          {/* 🚀 ALL TOOLS */}
          <section className="dashboard-section" aria-label={sec.toolsFeatures}>
            <DeferredMount
              minHeight="min(420px, 85vh)"
              rootMargin="600px 0px 320px 0px"
              loadingLabel={load.tools}
            >
              <DashboardPlanFeatures currentPlan={currentPlan} />
            </DeferredMount>
          </section>

          {/* 🎯 SNIPER STATS */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <section className="dashboard-section" aria-label={sec.sniperStats}>
              <DeferredMount
                minHeight="200px"
                rootMargin="400px 0px"
                loadingLabel={load.priceSniper}
              >
                <SniperStats />
              </DeferredMount>
            </section>
          )}
      </div>

      <DeferredMount
        minHeight="140px"
        rootMargin="200px 0px"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        loadingLabel={load.proTips}
      >
        <DashboardProTips />
      </DeferredMount>

      {/* Aria Coach — caricato dopo idle per non competere con il primo paint (C5) */}
      <DeferIdleMount delayMs={2500}>
        <AriaCoach
          userName={profile?.full_name || undefined}
          userPlan={currentPlan as "free" | "starter" | "pro" | "agency"}
        />
      </DeferIdleMount>
    </>
  );
}
