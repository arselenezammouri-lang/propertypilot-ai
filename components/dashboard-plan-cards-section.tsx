"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Rocket, Zap, Check, ArrowRight } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import { STRIPE_PLANS, STRIPE_ONE_TIME_PACKAGES } from "@/lib/stripe/config";

type Plan = "free" | "starter" | "pro" | "agency";

interface DashboardPlanCardsSectionProps {
  currentPlan: Plan;
}

export function DashboardPlanCardsSection({ currentPlan }: DashboardPlanCardsSectionProps) {
  const { locale, currency } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
  const d = t.dashboard;
  const pc = d.planCards;
  const cta = t.landing?.pricing?.cta;
  const perMonth = t.landing?.pricing?.perMonth ?? "/month";
  const fmt = (amount: number) => formatCurrencyForLocale(amount, locale as Locale, currency);

  return (
    <>
      <div className="mb-10 md:mb-14">
        <div className="futuristic-card p-8 md:p-10 border-2 border-royal-purple/30 shadow-glow-purple hover-lift animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center shadow-glow-purple">
                <Sparkles className="h-8 w-8 text-royal-purple" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black gradient-text-purple mb-2">
                  {currentPlan === "free" ? "Free" : currentPlan === "starter" ? "Starter" : currentPlan === "pro" ? "Pro" : "Agency"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentPlan === "free" && `${d.planFree} - ${d.startFree}`}
                  {currentPlan === "starter" && `${d.planStarter} - ${fmt(STRIPE_PLANS.starter.price)}${perMonth}`}
                  {currentPlan === "pro" && `${d.planPro} - ${fmt(STRIPE_PLANS.pro.price)}${perMonth}`}
                  {currentPlan === "agency" && `${d.planAgency} - ${fmt(STRIPE_PLANS.agency.price)}${perMonth}`}
                </p>
              </div>
            </div>
            {currentPlan === "free" && (
              <Link href="/dashboard/billing">
                <Button className="neon-button text-lg px-8 py-6">
                  <Rocket className="mr-2 h-5 w-5" />
                  {d.choosePlan}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Crown className="h-8 w-8 text-royal-purple" />
          <span>{d.chooseYourPlan}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "free" ? "border-royal-purple/50 shadow-glow-purple" : "border-white/10"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "free" && (
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-royal-purple to-electric-blue text-white">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500/30 to-gray-700/20 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Free</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forBeginners}</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">{d.freePrice}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planFree}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.generateNewListing}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.aiScraper}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.linkAnalysis}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.premiumPdfCards}</span></li>
            </ul>
            {currentPlan === "free" ? (
              <Button className="w-full" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button variant="outline" className="w-full border-white/20 hover:border-white/40">{d.startFree}</Button>
              </Link>
            )}
          </div>

          <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "starter" ? "border-electric-blue/50 shadow-glow-blue" : "border-white/10"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "starter" && (
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-electric-blue to-cyan-500 text-white">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/30 to-electric-blue/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-blue">
              <Rocket className="h-6 w-6 text-electric-blue" />
            </div>
            <h3 className="text-2xl font-black text-electric-blue mb-2">Starter</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forBeginners}</p>
            <div className="mb-6">
              <span className="text-4xl font-black gradient-text-purple">{fmt(STRIPE_PLANS.starter.price)}</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planStarter}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.allFreeFeatures}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.leadScoringAi}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.perfectCopy20}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.translator12Languages}</span></li>
            </ul>
            {currentPlan === "starter" ? (
              <Button className="w-full bg-electric-blue" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-electric-blue to-cyan-500 hover:opacity-90 text-white">
                  {currentPlan === "free" ? (cta?.chooseStarter ?? "Choose Starter") : d.upgradeToStarter}
                </Button>
              </Link>
            )}
          </div>

          <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "pro" ? "border-sunset-gold/50 shadow-glow-gold" : "border-white/10"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "pro" && (
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-sunset-gold to-amber-500 text-black">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-sunset-gold/30 to-sunset-gold/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-gold">
              <Zap className="h-6 w-6 text-sunset-gold" />
            </div>
            <h3 className="text-2xl font-black gradient-text-gold mb-2">Pro</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forProfs}</p>
            <div className="mb-6">
              <span className="text-4xl font-black gradient-text-gold">{fmt(STRIPE_PLANS.pro.price)}</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planPro}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.allStarterFeatures}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.fullCrmPipeline}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.virtualStaging3d}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.aiVoiceCallingMonthly}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.agencyAssistantAi}</span></li>
            </ul>
            {currentPlan === "pro" ? (
              <Button className="w-full bg-sunset-gold text-black" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-sunset-gold to-amber-500 hover:opacity-90 text-black font-bold">
                  {currentPlan === "free" || currentPlan === "starter" ? (cta?.choosePro ?? "Choose Pro") : d.upgradeToPro}
                </Button>
              </Link>
            )}
          </div>

          <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "agency" ? "border-royal-purple/50 shadow-glow-purple" : "border-white/10"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "agency" && (
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-royal-purple to-pink-500 text-white">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-purple">
              <Crown className="h-6 w-6 text-royal-purple" />
            </div>
            <h3 className="text-2xl font-black gradient-text-purple mb-2">Agency</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forTeam}</p>
            <div className="mb-6">
              <span className="text-4xl font-black gradient-text-purple">{fmt(STRIPE_PLANS.agency.price)}</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planAgency}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.allProFeatures}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.unlimitedAiVoiceCalling}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.auraVrVirtualTour}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.teamUpToAgents}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.omnichannelSuite}</span></li>
            </ul>
            {currentPlan === "agency" ? (
              <Button className="w-full bg-royal-purple" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-royal-purple to-pink-500 hover:opacity-90 text-white font-bold">
                  {cta?.chooseAgency ?? "Choose Agency"}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="futuristic-card p-6 md:p-8 border-2 border-yellow-500/30 hover:border-yellow-500 shadow-glow-yellow hover-lift mt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-glow-yellow mx-auto">
              <Rocket className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{pc.agencyBoostTitle}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pc.agencyBoostSubtitle}</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">{fmt(STRIPE_ONE_TIME_PACKAGES.boost.price)}</span>
              <span className="text-lg text-muted-foreground"> {pc.oneTime}</span>
            </div>
            <ul className="space-y-2 mb-6 text-left">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.boostSetupComplete}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.boostOnboarding}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.boostLaunchSupport}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{pc.boostCustomConfig}</span></li>
            </ul>
            <Link href="/api/stripe/checkout-oneshot?package=agency_boost">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold">
                {pc.buyAgencyBoost}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
