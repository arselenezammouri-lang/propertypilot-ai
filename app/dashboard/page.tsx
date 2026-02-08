import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegionSelector } from "@/components/region-selector";
import { LanguageSelector } from "@/components/language-selector";
import { DashboardProBanner } from "@/components/demo-modal";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";
import NextDynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { STRIPE_ONE_TIME_PACKAGES } from "@/lib/stripe/config";
import Link from "next/link";
import { 
  Home, 
  FileText, 
  CreditCard, 
  Settings, 
  Sparkles,
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
      {/* FUTURISTIC DASHBOARD HEADER - Same style as Landing Page */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <img src="/logo.png" alt="PropertyPilot AI" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground font-medium">Dashboard AI</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-1.5 md:space-x-3">
              <LanguageSelector />
              <RegionSelector />
              <ThemeToggle />
              <Link href="/dashboard/listings" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" className="hover:text-royal-purple transition-colors" data-testid="button-generate">
                  <Zap className="mr-2 h-4 w-4" />
                  Genera
                </Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm" className="border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all" data-testid="button-signout">
                  Esci
                </Button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* PENDING CHECKOUT BANNER - Client Component */}
          <DashboardClientWrapper>
            <></>
          </DashboardClientWrapper>
          

          {/* STATS GRID - Premium Futuristic Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
          {/* Current Plan Card - Royal Purple */}
          <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up" data-testid="card-current-plan">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-royal-purple/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="flex items-start justify-between mb-6 relative">
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Piano Attuale</p>
                <h3 className="text-3xl md:text-4xl font-black capitalize gradient-text-purple flex items-center gap-2">
                  {currentPlan}
                  {currentPlan !== "free" && <Crown className="h-6 w-6 text-sunset-gold" />}
                </h3>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center shadow-glow-purple">
                <CreditCard className="h-6 w-6 md:h-7 md:w-7 text-royal-purple" />
              </div>
            </div>
            <p className="text-base text-muted-foreground font-medium relative">
              {currentPlan === "free" && "5 annunci al mese"}
              {currentPlan === "starter" && "50 annunci al mese"}
              {currentPlan === "pro" && "200 annunci al mese"}
              {currentPlan === "agency" && "Annunci illimitati"}
            </p>
          </div>

          {/* Listings This Month Card - Electric Blue */}
          <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-100" data-testid="card-listings-count">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-blue/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="flex items-start justify-between mb-6 relative">
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Questo Mese</p>
                <h3 className="text-3xl md:text-4xl font-black text-electric-blue">
                  {limits.used}
                  {limits.listings > 0 && (
                    <span className="text-xl text-muted-foreground font-semibold">/{limits.listings}</span>
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-electric-blue/30 to-electric-blue/10 rounded-2xl flex items-center justify-center shadow-glow-blue">
                <BarChart3 className="h-6 w-6 md:h-7 md:w-7 text-electric-blue" />
              </div>
            </div>
            <p className="text-base text-muted-foreground font-medium relative">
              {limits.listings === -1 
                ? "Annunci illimitati disponibili" 
                : `${limits.listings - limits.used} annunci rimanenti`
              }
            </p>
          </div>

          {/* Saved Listings Card - Neon Aqua */}
          <div className="futuristic-card p-8 md:p-10 relative overflow-hidden group hover-lift animate-fade-in-up delay-200" data-testid="card-saved-listings">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-aqua/30 to-transparent rounded-bl-[5rem] opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="flex items-start justify-between mb-6 relative">
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Salvati</p>
                <h3 className="text-3xl md:text-4xl font-black text-neon-aqua">0</h3>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-neon-aqua/30 to-neon-aqua/10 rounded-2xl flex items-center justify-center shadow-glow-aqua">
                <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-neon-aqua" />
              </div>
            </div>
            <p className="text-base text-muted-foreground font-medium relative">
              Nessun annuncio salvato
            </p>
          </div>

          {/* Progetti 3D Generati & WhatsApp Stats - Solo per PRO/AGENCY */}
          {(currentPlan === "pro" || currentPlan === "agency") && (
            <Dashboard3DStats />
          )}
        </div>

        {/* 💰 PROFIT DASHBOARD - ROI Tracking */}
        <div className="mb-10 md:mb-14">
          <div className="grid md:grid-cols-2 gap-6">
            <ProfitDashboard />
            <ReferralSection />
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

        {/* 🎯 PIANO ATTUALE - FREE in Evidenza */}
        <div className="mb-10 md:mb-14">
          <div className="futuristic-card p-8 md:p-10 border-2 border-royal-purple/30 shadow-glow-purple hover-lift animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center shadow-glow-purple">
                  <Sparkles className="h-8 w-8 text-royal-purple" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black gradient-text-purple mb-2">
                    Piano {currentPlan === "free" ? "Free" : currentPlan === "starter" ? "Starter" : currentPlan === "pro" ? "Pro" : "Agency"}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {currentPlan === "free" && "5 annunci al mese - Inizia Gratis"}
                    {currentPlan === "starter" && "50 annunci al mese - €197/mese"}
                    {currentPlan === "pro" && "200 annunci al mese - €497/mese"}
                    {currentPlan === "agency" && "Annunci illimitati - €897/mese"}
                  </p>
                </div>
              </div>
              {currentPlan === "free" && (
                <Link href="/dashboard/billing">
                  <Button className="neon-button text-lg px-8 py-6">
                    <Rocket className="mr-2 h-5 w-5" />
                    Scegli Piano
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 📋 TUTTI I PIANI CON FUNZIONALITÀ */}
        <div className="mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
            <Crown className="h-8 w-8 text-royal-purple" />
            <span>Scegli il Tuo Piano</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* PIANO FREE */}
            <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "free" ? "border-royal-purple/50 shadow-glow-purple" : "border-white/10"} hover-lift relative overflow-hidden group`}>
              {currentPlan === "free" && (
                <div className="absolute top-4 right-4">
                  <span className="premium-badge bg-gradient-to-r from-royal-purple to-electric-blue text-white">
                    ✓ Attivo
                  </span>
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500/30 to-gray-700/20 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Free</h3>
              <p className="text-sm text-muted-foreground mb-4">Per iniziare</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Gratis</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">5 annunci al mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Genera Nuovo Annuncio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI Scraper</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analisi da Link</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Schede PDF Premium</span>
                </li>
              </ul>
              {currentPlan === "free" ? (
                <Button className="w-full" disabled>
                  ✓ Il tuo piano attuale
                </Button>
              ) : (
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="w-full border-white/20 hover:border-white/40">
                    Inizia Gratis
                  </Button>
                </Link>
              )}
            </div>

            {/* PIANO STARTER */}
            <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "starter" ? "border-electric-blue/50 shadow-glow-blue" : "border-white/10"} hover-lift relative overflow-hidden group`}>
              {currentPlan === "starter" && (
                <div className="absolute top-4 right-4">
                  <span className="premium-badge bg-gradient-to-r from-electric-blue to-cyan-500 text-white">
                    ✓ Attivo
                  </span>
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/30 to-electric-blue/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-blue">
                <Rocket className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="text-2xl font-black text-electric-blue mb-2">Starter</h3>
              <p className="text-sm text-muted-foreground mb-4">Per iniziare</p>
              <div className="mb-6">
                <span className="text-4xl font-black gradient-text-purple">€197</span>
                <span className="text-lg text-muted-foreground">/mese</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">50 annunci al mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tutte le funzionalità Free</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Lead Scoring AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Perfect Copy 2.0</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Traduttore 12 Lingue</span>
                </li>
              </ul>
              {currentPlan === "starter" ? (
                <Button className="w-full bg-electric-blue" disabled>
                  ✓ Il tuo piano attuale
                </Button>
              ) : (
                <Link href="/dashboard/billing">
                  <Button className="w-full bg-gradient-to-r from-electric-blue to-cyan-500 hover:opacity-90 text-white">
                    {currentPlan === "free" ? "Scegli Starter" : "Upgrade a Starter"}
                  </Button>
                </Link>
              )}
            </div>

            {/* PIANO PRO */}
            <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "pro" ? "border-sunset-gold/50 shadow-glow-gold" : "border-white/10"} hover-lift relative overflow-hidden group`}>
              {currentPlan === "pro" && (
                <div className="absolute top-4 right-4">
                  <span className="premium-badge bg-gradient-to-r from-sunset-gold to-amber-500 text-black">
                    ✓ Attivo
                  </span>
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-sunset-gold/30 to-sunset-gold/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-gold">
                <Zap className="h-6 w-6 text-sunset-gold" />
              </div>
              <h3 className="text-2xl font-black gradient-text-gold mb-2">Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">Per professionisti</p>
              <div className="mb-6">
                <span className="text-4xl font-black gradient-text-gold">€497</span>
                <span className="text-lg text-muted-foreground">/mese</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">200 annunci al mese</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tutte le funzionalità Starter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">CRM Completo + Pipeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Virtual Staging 3D</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI Voice Calling (30/mese)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Agency Assistant AI</span>
                </li>
              </ul>
              {currentPlan === "pro" ? (
                <Button className="w-full bg-sunset-gold text-black" disabled>
                  ✓ Il tuo piano attuale
                </Button>
              ) : (
                <Link href="/dashboard/billing">
                  <Button className="w-full bg-gradient-to-r from-sunset-gold to-amber-500 hover:opacity-90 text-black font-bold">
                    {currentPlan === "free" || currentPlan === "starter" ? "Scegli Pro" : "Upgrade a Pro"}
                  </Button>
                </Link>
              )}
            </div>

            {/* PIANO AGENCY */}
            <div className={`futuristic-card p-6 md:p-8 border-2 ${currentPlan === "agency" ? "border-royal-purple/50 shadow-glow-purple" : "border-white/10"} hover-lift relative overflow-hidden group`}>
              {currentPlan === "agency" && (
                <div className="absolute top-4 right-4">
                  <span className="premium-badge bg-gradient-to-r from-royal-purple to-pink-500 text-white">
                    ✓ Attivo
                  </span>
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-purple">
                <Crown className="h-6 w-6 text-royal-purple" />
              </div>
              <h3 className="text-2xl font-black gradient-text-purple mb-2">Agency</h3>
              <p className="text-sm text-muted-foreground mb-4">Per team</p>
              <div className="mb-6">
                <span className="text-4xl font-black gradient-text-purple">€897</span>
                <span className="text-lg text-muted-foreground">/mese</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Annunci illimitati</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tutte le funzionalità Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI Voice Calling Illimitato</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Aura VR: Virtual Tour</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Team fino a 10 agenti</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-neon-aqua mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Omnichannel Suite</span>
                </li>
              </ul>
              {currentPlan === "agency" ? (
                <Button className="w-full bg-royal-purple" disabled>
                  ✓ Il tuo piano attuale
                </Button>
              ) : (
                <Link href="/dashboard/billing">
                  <Button className="w-full bg-gradient-to-r from-royal-purple to-pink-500 hover:opacity-90 text-white font-bold">
                    Scegli Agency
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Agency Boost - One-Time Package */}
          <div className="futuristic-card p-6 md:p-8 border-2 border-yellow-500/30 hover:border-yellow-500 shadow-glow-yellow hover-lift">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-glow-yellow mx-auto">
                <Rocket className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Agency Boost</h3>
              <p className="text-sm text-muted-foreground mb-4">Done-for-you Setup</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">€2,497</span>
                <span className="text-lg text-muted-foreground"> una tantum</span>
              </div>
              <ul className="space-y-2 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Setup completo "done-for-you"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Implementazione e onboarding guidato</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Supporto premium per il lancio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Configurazione personalizzata</span>
                </li>
              </ul>
              <Link href={`/api/stripe/checkout-oneshot?package=agency_boost`}>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold">
                  Acquista Agency Boost
                </Button>
              </Link>
            </div>
          </div>
        </div>

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

        {/* PRO TIPS SECTION - Futuristic Info Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="futuristic-card p-8 md:p-10 bg-gradient-to-br from-royal-purple/10 to-electric-blue/5 border-royal-purple/30 animate-fade-in-up delay-600">
          <div className="flex items-start space-x-5">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-purple">
              <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-royal-purple" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text-purple">Suggerimenti Pro per Annunci Migliori</h3>
              <ul className="space-y-3 text-base md:text-lg text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <span className="text-neon-aqua mt-1.5 text-xl font-bold">•</span>
                  <span>Includi dettagli specifici su posizione, servizi e caratteristiche uniche</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-electric-blue mt-1.5 text-xl font-bold">•</span>
                  <span>Usa metrature accurate e numero stanze per risultati AI migliori</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-sunset-gold mt-1.5 text-xl font-bold">•</span>
                  <span>Genera più versioni e scegli quella che si adatta meglio alle tue esigenze</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div>

        {/* Aria Coach - Con limiti per piano FREE (1 ora/giorno) */}
        <AriaCoach 
          userName={profile?.full_name || undefined} 
          userPlan={currentPlan as "free" | "starter" | "pro" | "agency"} 
        />

      </main>
    </div>
  );
}
