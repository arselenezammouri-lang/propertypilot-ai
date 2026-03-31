import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NextDynamic from "next/dynamic";
import { DashboardStatsCards } from "@/components/dashboard-stats-cards";
import { isLocalMockModeEnabled } from "@/lib/utils/local-dev";
import { LOCAL_MOCK_USER_ID, getLocalMockPlan } from "@/lib/api/local-mock-service";

export const dynamic = 'force-dynamic';

const ReferralSection = NextDynamic(() => import("@/components/referral-section").then(mod => ({ default: mod.ReferralSection })), {
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

const QuickActions = NextDynamic(() => import("@/components/quick-actions").then(mod => ({ default: mod.QuickActions })), {
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
        <section className="dashboard-section">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardStatsCards currentPlan={currentPlan} limits={limits} savedCount={savedCount} />
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="dashboard-section">
            <QuickActions />
          </section>

          {/* UPGRADE PROMPT — only for free and starter */}
          {(currentPlan === "free" || currentPlan === "starter") && (
            <section className="dashboard-section">
              <UpgradeInline currentPlan={currentPlan} />
            </section>
          )}

          {/* USAGE + REFERRAL */}
          <section className="dashboard-section" aria-label="Usage and referral">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <UsageIndicator />
              </div>
              <div>
                <ReferralSection />
              </div>
            </div>
          </section>
      </div>

      {/* Onboarding modal — shows on first visit */}
      <OnboardingFlow userName={profile?.full_name || undefined} />
    </>
  );
}
