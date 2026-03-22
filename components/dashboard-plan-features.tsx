"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Lock,
  Check,
  Sparkles,
  Zap,
  Crown,
  Users,
  Phone,
  Bot,
  FileText,
  Target,
  Settings,
  Video,
  Globe,
  Share2,
  Mail,
  Link2,
  Award,
  Rocket,
  ChevronRight,
  ChevronLeft,
  MousePointerClick,
  Hash,
  Heart,
  User,
  Building2,
  Radar,
  Map,
} from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import type { Locale } from "@/lib/i18n/config";
import { STRIPE_PLANS } from "@/lib/stripe/config";

type PlanType = "free" | "starter" | "pro" | "agency";

interface FeatureDef {
  id: string;
  icon: React.ReactNode;
  href: string;
  availableIn: PlanType[];
  locked?: boolean;
}

const ALL_FEATURES: FeatureDef[] = [
  {
    id: "generate",
    icon: <Zap className="h-6 w-6" />,
    href: "/dashboard/listings",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "scraper",
    icon: <Link2 className="h-6 w-6" />,
    href: "/dashboard/scraper",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "analyze",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/analyze",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "pdf",
    icon: <FileText className="h-6 w-6" />,
    href: "/dashboard/pdf",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "lead-score",
    icon: <Target className="h-6 w-6" />,
    href: "/dashboard/lead-score",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "perfect-copy",
    icon: <Crown className="h-6 w-6" />,
    href: "/dashboard/perfect-copy",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "translate",
    icon: <Globe className="h-6 w-6" />,
    href: "/dashboard/translate",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "social-posts",
    icon: <Share2 className="h-6 w-6" />,
    href: "/dashboard/social-posts",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "titles",
    icon: <MousePointerClick className="h-6 w-6" />,
    href: "/dashboard/titles",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "hashtags",
    icon: <Hash className="h-6 w-6" />,
    href: "/dashboard/hashtags",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "emotional-listing",
    icon: <Heart className="h-6 w-6" />,
    href: "/dashboard/emotional-listing",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "refine-listing",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/refine-listing",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "auditor",
    icon: <Award className="h-6 w-6" />,
    href: "/dashboard/auditor",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agent-bio",
    icon: <User className="h-6 w-6" />,
    href: "/dashboard/agent-bio",
    availableIn: ["pro", "agency"],
  },
  {
    id: "followup-emails",
    icon: <Mail className="h-6 w-6" />,
    href: "/dashboard/followup-emails",
    availableIn: ["pro", "agency"],
  },
  {
    id: "video-scripts",
    icon: <Video className="h-6 w-6" />,
    href: "/dashboard/video-scripts",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agency-branding",
    icon: <Building2 className="h-6 w-6" />,
    href: "/dashboard/agency-branding",
    availableIn: ["pro", "agency"],
  },
  {
    id: "crm",
    icon: <Users className="h-6 w-6" />,
    href: "/dashboard/leads",
    availableIn: ["pro", "agency"],
  },
  {
    id: "virtual-staging",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["pro", "agency"],
  },
  {
    id: "voice-calling",
    icon: <Phone className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agency-assistant",
    icon: <Bot className="h-6 w-6" />,
    href: "/dashboard/agency-assistant",
    availableIn: ["pro", "agency"],
  },
  {
    id: "automations",
    icon: <Settings className="h-6 w-6" />,
    href: "/dashboard/automations",
    availableIn: ["pro", "agency"],
  },
  {
    id: "crm-automation-rules",
    icon: <Zap className="h-6 w-6" />,
    href: "/dashboard/crm/automations",
    availableIn: ["pro", "agency"],
  },
  {
    id: "unlimited-voice",
    icon: <Phone className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "team-management",
    icon: <Users className="h-6 w-6" />,
    href: "/dashboard/settings/workspace",
    availableIn: ["agency"],
  },
  {
    id: "aura-vr",
    icon: <Video className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "prospecting",
    icon: <Radar className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "map",
    icon: <Map className="h-6 w-6" />,
    href: "/dashboard/map",
    availableIn: ["agency"],
  },
];

const PLAN_ORDER: PlanType[] = ["free", "starter", "pro", "agency"];

interface DashboardPlanFeaturesProps {
  currentPlan: PlanType;
  onPlanChange?: (plan: PlanType) => void;
}

export function DashboardPlanFeatures({ currentPlan, onPlanChange }: DashboardPlanFeaturesProps) {
  const { locale, currency } = useLocaleContext();
  const tDic = getTranslation(locale as SupportedLocale);
  const { chrome: ch, items: itemCopy } = tDic.dashboard.planFeatures;
  const perMonth = tDic.billing.perMonth;
  const fmt = (amount: number) => formatCurrencyForLocale(amount, locale as Locale, currency);

  const [viewingPlan, setViewingPlan] = useState<PlanType>(currentPlan);

  const currentPlanIndex = PLAN_ORDER.indexOf(viewingPlan);
  const nextPlan = currentPlanIndex < PLAN_ORDER.length - 1 ? PLAN_ORDER[currentPlanIndex + 1] : null;
  const prevPlan = currentPlanIndex > 0 ? PLAN_ORDER[currentPlanIndex - 1] : null;

  const planFeatures = ALL_FEATURES.filter((f) => f.availableIn.includes(viewingPlan));
  const lockedFeatures = ALL_FEATURES.filter(
    (f) =>
      !f.availableIn.includes(viewingPlan) && f.availableIn.some((p) => PLAN_ORDER.indexOf(p) > currentPlanIndex)
  );

  const planInfo =
    viewingPlan === "free"
      ? { name: ch.planNames.free, price: ch.free, color: "from-gray-500 to-gray-700", limit: ch.freeLimit }
      : viewingPlan === "starter"
        ? {
            name: ch.planNames.starter,
            price: `${fmt(STRIPE_PLANS.starter.price)}${perMonth}`,
            color: "from-blue-500 to-cyan-500",
            limit: ch.starterLimit,
          }
        : viewingPlan === "pro"
          ? {
              name: ch.planNames.pro,
              price: `${fmt(STRIPE_PLANS.pro.price)}${perMonth}`,
              color: "from-purple-500 to-pink-500",
              limit: ch.proLimit,
            }
          : {
              name: ch.planNames.agency,
              price: `${fmt(STRIPE_PLANS.agency.price)}${perMonth}`,
              color: "from-amber-500 to-orange-500",
              limit: ch.agencyLimit,
            };

  const handleNextPlan = () => {
    if (nextPlan) {
      setViewingPlan(nextPlan);
      onPlanChange?.(nextPlan);
    }
  };

  const handlePrevPlan = () => {
    if (prevPlan) {
      setViewingPlan(prevPlan);
      onPlanChange?.(prevPlan);
    }
  };

  const isFeatureLocked = (feature: FeatureDef) => {
    return !feature.availableIn.includes(currentPlan);
  };

  const copyFor = (id: string) => itemCopy[id] ?? { name: id, description: "" };

  const nextPlanLabel =
    nextPlan === "starter" ? ch.planNames.starter : nextPlan === "pro" ? ch.planNames.pro : nextPlan === "agency" ? ch.planNames.agency : "";

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${planInfo.color} flex items-center justify-center shadow-lg`}
            >
              {viewingPlan === "free" ? (
                <Sparkles className="h-6 w-6 text-white" />
              ) : viewingPlan === "starter" ? (
                <Zap className="h-6 w-6 text-white" />
              ) : viewingPlan === "pro" ? (
                <Crown className="h-6 w-6 text-white" />
              ) : (
                <Rocket className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {ch.plan} {planInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">{planInfo.limit}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prevPlan && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPlan}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {nextPlan && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPlan}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="text-sm mr-2">
                {ch.plan} {nextPlanLabel}
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {viewingPlan === currentPlan && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${planInfo.color}/20 border border-white/20 mb-6`}
        >
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{ch.currentPlan}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {planFeatures.map((feature) => {
          const locked = isFeatureLocked(feature);
          const featureCopy = copyFor(feature.id);

          return (
            <Card
              key={feature.id}
              className={`relative overflow-hidden border transition-all ${
                locked
                  ? "border-white/[0.06] bg-white/[0.02] opacity-60"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400 font-medium">{ch.requiresHigherPlan}</p>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planInfo.color}/20 flex items-center justify-center mb-4 ${
                    locked ? "opacity-50" : ""
                  }`}
                >
                  <div className={locked ? "text-gray-500" : ""}>{feature.icon}</div>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${locked ? "text-gray-500" : ""}`}>{featureCopy.name}</h3>
                <p className={`text-sm mb-4 ${locked ? "text-gray-600" : "text-muted-foreground"}`}>
                  {featureCopy.description}
                </p>

                {!locked ? (
                  <Link href={feature.href}>
                    <Button variant="outline" className="w-full border-white/20 hover:border-white/40" size="sm">
                      {ch.open}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/billing">
                    <Button
                      variant="outline"
                      className="w-full border-white/[0.08] text-white/30 hover:border-white/20"
                      size="sm"
                      disabled
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {ch.unlock}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lockedFeatures.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-bold text-muted-foreground">{ch.higherPlans}</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedFeatures.slice(0, 6).map((feature) => {
              const featureCopy = copyFor(feature.id);
              return (
                <Card key={feature.id} className="border border-white/[0.06] bg-white/[0.02] opacity-70">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                        <div className="text-white/30">{feature.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white/40">{featureCopy.name}</h4>
                        <p className="text-xs text-white/25 mt-1">{featureCopy.description}</p>
                      </div>
                      <Lock className="h-4 w-4 text-white/25" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {nextPlan && (
            <div className="mt-6 text-center">
              <Link href="/dashboard/billing">
                <Button className={`bg-gradient-to-r ${planInfo.color} hover:opacity-90 text-white`} size="lg">
                  {ch.unlockPlan} {nextPlanLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
