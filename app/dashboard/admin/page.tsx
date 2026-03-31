import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  FileText,
  UserPlus,
  BarChart3,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Founder email — only this account can access admin
const FOUNDER_EMAILS = [
  "arselenezammouri@gmail.com",
  "arselen@propertypilot.ai","arselenezammouri-lang@users.noreply.github.com",
];

async function getAdminStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Total users
  const { count: totalUsers } = await supabaseService
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // New users last 7 days
  const { count: newUsersWeek } = await supabaseService
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  // New users last 24h
  const { count: newUsersDay } = await supabaseService
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneDayAgo);

  // Subscriptions breakdown
  const { data: subs } = await supabaseService
    .from("subscriptions")
    .select("status, stripe_subscription_id");

  const subBreakdown = {
    free: 0,
    starter: 0,
    pro: 0,
    agency: 0,
    total_paid: 0,
  };

  const MRR_PRICES: Record<string, number> = {
    starter: 197,
    pro: 497,
    agency: 897,
  };

  let mrr = 0;

  if (subs) {
    for (const s of subs) {
      const plan = s.status || "free";
      if (plan in subBreakdown) {
        subBreakdown[plan as keyof typeof subBreakdown]++;
      }
      if (plan !== "free" && s.stripe_subscription_id) {
        subBreakdown.total_paid++;
        mrr += MRR_PRICES[plan] || 0;
      }
    }
  }

  // Total generations (all time)
  const { data: genData } = await supabaseService
    .from("subscriptions")
    .select("generations_count");

  let totalGenerations = 0;
  if (genData) {
    for (const g of genData) {
      totalGenerations += g.generations_count || 0;
    }
  }

  // Total saved listings
  const { count: totalListings } = await supabaseService
    .from("saved_listings")
    .select("id", { count: "exact", head: true });

  // Total leads
  const { count: totalLeads } = await supabaseService
    .from("leads")
    .select("id", { count: "exact", head: true });

  // Recent signups (last 20)
  const { data: recentUsers } = await supabaseService
    .from("profiles")
    .select("id, email, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Recent subscriptions with details
  const { data: recentSubs } = await supabaseService
    .from("subscriptions")
    .select("user_id, status, stripe_subscription_id, generations_count, updated_at")
    .order("updated_at", { ascending: false })
    .limit(20);

  return {
    totalUsers: totalUsers || 0,
    newUsersWeek: newUsersWeek || 0,
    newUsersDay: newUsersDay || 0,
    subBreakdown,
    mrr,
    totalGenerations,
    totalListings: totalListings || 0,
    totalLeads: totalLeads || 0,
    recentUsers: recentUsers || [],
    recentSubs: recentSubs || [],
  };
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !FOUNDER_EMAILS.includes(user.email || "")) {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: `+${stats.newUsersDay} today, +${stats.newUsersWeek} this week`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "MRR",
      value: `€${stats.mrr.toLocaleString()}`,
      sub: `${stats.subBreakdown.total_paid} paying customers`,
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "AI Generations",
      value: stats.totalGenerations.toLocaleString(),
      sub: "All time",
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Saved Listings",
      value: stats.totalListings.toLocaleString(),
      sub: `${stats.totalLeads} leads in CRM`,
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Business metrics for PropertyPilot AI — founder access only
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="pp-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="pp-card p-6">
          <h2 className="text-sm font-semibold mb-4">Subscription Breakdown</h2>
          <div className="space-y-3">
            {[
              { plan: "Free", count: stats.subBreakdown.free, color: "bg-gray-200" },
              { plan: "Starter (€197)", count: stats.subBreakdown.starter, color: "bg-blue-400" },
              { plan: "Pro (€497)", count: stats.subBreakdown.pro, color: "bg-violet-500" },
              { plan: "Agency (€897)", count: stats.subBreakdown.agency, color: "bg-amber-400" },
            ].map((item) => {
              const total = stats.totalUsers || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.plan}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{item.plan}</span>
                    <span className="font-medium">
                      {item.count} <span className="text-muted-foreground">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="pp-card p-6">
          <h2 className="text-sm font-semibold mb-4">Revenue Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Monthly Recurring Revenue</span>
              <span className="text-xl font-bold">€{stats.mrr.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Annual Run Rate</span>
              <span className="text-lg font-semibold">€{(stats.mrr * 12).toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Avg Revenue Per User</span>
              <span className="text-lg font-semibold">
                €{stats.subBreakdown.total_paid > 0
                  ? Math.round(stats.mrr / stats.subBreakdown.total_paid)
                  : 0}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Free → Paid Conversion</span>
              <span className="text-lg font-semibold">
                {stats.totalUsers > 0
                  ? Math.round((stats.subBreakdown.total_paid / stats.totalUsers) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="pp-card overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Recent Signups
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-6 py-3 font-medium">{u.full_name || "—"}</td>
                  <td className="px-6 py-3 text-muted-foreground">{u.email || "—"}</td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
              {stats.recentUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="pp-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Active Subscriptions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">User ID</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Generations</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Stripe</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSubs.map((s) => (
                <tr key={s.user_id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-6 py-3 font-mono text-xs">{s.user_id?.slice(0, 8)}...</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "agency"
                          ? "bg-amber-100 text-amber-700"
                          : s.status === "pro"
                          ? "bg-violet-100 text-violet-700"
                          : s.status === "starter"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status || "free"}
                    </span>
                  </td>
                  <td className="px-6 py-3">{s.generations_count || 0}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">
                    {s.stripe_subscription_id ? "✓ Linked" : "—"}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {s.updated_at
                      ? new Date(s.updated_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
              {stats.recentSubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No subscriptions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
