"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Rocket, Zap, Check, ArrowRight } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

type Plan = "free" | "starter" | "pro" | "agency";

interface DashboardPlanCardsSectionProps {
  currentPlan: Plan;
}

export function DashboardPlanCardsSection({ currentPlan }: DashboardPlanCardsSectionProps) {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
  const d = t.dashboard;
  const cta = t.landing?.pricing?.cta;
  const perMonth = t.landing?.pricing?.perMonth ?? "/month";

  return (
    <>
      <div className="mb-10 md:mb-14">
        <div className="pp-card p-8 md:p-10 border-2 border-blue-600/30 shadow-sm hover-lift animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/30 to-blue-600/10 rounded-2xl flex items-center justify-center shadow-sm">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gradient-blue mb-2">
                  {currentPlan === "free" ? "Free" : currentPlan === "starter" ? "Starter" : currentPlan === "pro" ? "Pro" : "Agency"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentPlan === "free" && `${d.planFree} - ${d.startFree}`}
                  {currentPlan === "starter" && `${d.planStarter} - €197${perMonth}`}
                  {currentPlan === "pro" && `${d.planPro} - €497${perMonth}`}
                  {currentPlan === "agency" && `${d.planAgency} - €897${perMonth}`}
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
          <Crown className="h-8 w-8 text-blue-600" />
          <span>{d.chooseYourPlan}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`pp-card p-6 md:p-8 border-2 ${currentPlan === "free" ? "border-blue-600/50 shadow-sm" : "border-border"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "free" && (
              <div className="absolute top-4 right-4">
                <span className="pp-badge bg-gradient-to-r from-blue-600 to-blue-500 text-foreground">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500/30 to-gray-700/20 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">Free</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forBeginners}</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-foreground">{d.freePrice}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planFree}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Genera Nuovo Annuncio" : "Generate New Listing"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">AI Scraper</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Analisi da Link" : "Link Analysis"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Schede PDF Premium" : "Premium PDF Cards"}</span></li>
            </ul>
            {currentPlan === "free" ? (
              <Button className="w-full" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button variant="outline" className="w-full border-border hover:border-border">{d.startFree}</Button>
              </Link>
            )}
          </div>

          <div className={`pp-card p-6 md:p-8 border-2 ${currentPlan === "starter" ? "border-blue-500/50 shadow-sm" : "border-border"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "starter" && (
              <div className="absolute top-4 right-4">
                <span className="pp-badge bg-gradient-to-r from-blue-500 to-cyan-500 text-foreground">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Rocket className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-blue-500 mb-2">Starter</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forBeginners}</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-gradient-blue">€197</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planStarter}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Tutte le funzionalità Free" : "All Free features"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Lead Scoring AI</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Perfect Copy 2.0</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Traduttore 12 Lingue" : "12 Language Translator"}</span></li>
            </ul>
            {currentPlan === "starter" ? (
              <Button className="w-full bg-blue-500" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-foreground">
                  {currentPlan === "free" ? (cta?.chooseStarter ?? "Choose Starter") : d.upgradeToStarter}
                </Button>
              </Link>
            )}
          </div>

          <div className={`pp-card p-6 md:p-8 border-2 ${currentPlan === "pro" ? "border-amber-300 shadow-sm" : "border-border"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "pro" && (
              <div className="absolute top-4 right-4">
                <span className="pp-badge bg-gradient-to-r from-amber-400 to-amber-500 text-black">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black gradient-text-gold mb-2">Pro</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forProfs}</p>
            <div className="mb-6">
              <span className="text-4xl font-black gradient-text-gold">€497</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planPro}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Tutte le funzionalità Starter" : "All Starter features"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "CRM Completo + Pipeline" : "Full CRM + Pipeline"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Virtual Staging 3D</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">AI Voice Calling (30/mese)</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Agency Assistant AI</span></li>
            </ul>
            {currentPlan === "pro" ? (
              <Button className="w-full bg-amber-400 text-black" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 text-black font-bold">
                  {currentPlan === "free" || currentPlan === "starter" ? (cta?.choosePro ?? "Choose Pro") : d.upgradeToPro}
                </Button>
              </Link>
            )}
          </div>

          <div className={`pp-card p-6 md:p-8 border-2 ${currentPlan === "agency" ? "border-blue-600/50 shadow-sm" : "border-border"} hover-lift relative overflow-hidden group`}>
            {currentPlan === "agency" && (
              <div className="absolute top-4 right-4">
                <span className="pp-badge bg-gradient-to-r from-blue-600 to-pink-500 text-foreground">✓ {d.activeBadge}</span>
              </div>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600/30 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Crown className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-gradient-blue mb-2">Agency</h3>
            <p className="text-sm text-muted-foreground mb-4">{d.forTeam}</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-gradient-blue">€897</span>
              <span className="text-lg text-muted-foreground">{perMonth}</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{d.planAgency}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Tutte le funzionalità Pro" : "All Pro features"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "AI Voice Calling Illimitato" : "Unlimited AI Voice Calling"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Aura VR: Virtual Tour</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Team fino a 10 agenti" : "Team up to 10 agents"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-sm">Omnichannel Suite</span></li>
            </ul>
            {currentPlan === "agency" ? (
              <Button className="w-full bg-blue-600" disabled>✓ {d.yourCurrentPlan}</Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-pink-500 hover:opacity-90 text-foreground font-bold">
                  {cta?.chooseAgency ?? "Choose Agency"}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="pp-card p-6 md:p-8 border-2 border-yellow-500/30 hover:border-yellow-500 shadow-glow-yellow hover-lift mt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-glow-yellow mx-auto">
              <Rocket className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">Agency Boost</h3>
            <p className="text-sm text-muted-foreground mb-4">Done-for-you Setup</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-foreground">€2,497</span>
              <span className="text-lg text-muted-foreground"> {locale === "it" ? "una tantum" : "one-time"}</span>
            </div>
            <ul className="space-y-2 mb-6 text-left">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Setup completo done-for-you" : "Full done-for-you setup"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Implementazione e onboarding guidato" : "Guided implementation and onboarding"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Supporto premium per il lancio" : "Premium launch support"}</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{locale === "it" ? "Configurazione personalizzata" : "Custom configuration"}</span></li>
            </ul>
            <Link href="/api/stripe/checkout-oneshot?package=agency_boost">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-foreground font-bold">
                {locale === "it" ? "Acquista Agency Boost" : "Buy Agency Boost"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
