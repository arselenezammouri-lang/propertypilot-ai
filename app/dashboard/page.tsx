import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardProBanner } from "@/components/demo-modal";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";
import { Dashboard3DStats } from "@/components/dashboard-3d-stats";
import { MorningBriefingBox } from "@/components/morning-briefing-box";
import { SniperStats } from "@/components/sniper-stats";
import { GlobalLiveFeed } from "@/components/global-live-feed";
import { DashboardHelpButton } from "@/components/dashboard-help-button";
import { DashboardPlanFeatures } from "@/components/dashboard-plan-features";
import { AriaCoach } from "@/components/aria-coach";
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
            
            <nav className="flex items-center space-x-2 md:space-x-4">
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

        {/* 🌅 AI MORNING INTEL BRIEFING */}
        {(currentPlan === "pro" || currentPlan === "agency") && (
          <MorningBriefingBox />
        )}

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
                    {currentPlan !== "agency" ? "Scegli Agency" : "Upgrade a Agency"}
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

        {/* ⚡ OLD QUICK ACTIONS - HIDDEN (replaced by DashboardPlanFeatures) */}
        <div className="hidden">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3">
            <Target className="h-7 w-7 text-royal-purple" />
            <span>Azioni Rapide</span>
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
            {/* Generate New Listing - Primary CTA */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-royal-purple/30 hover:border-royal-purple shadow-glow-purple hover-lift animate-fade-in-up delay-300" data-testid="card-action-generate">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-purple">
                <Zap className="h-7 w-7 md:h-8 md:w-8 text-royal-purple" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 gradient-text-purple">
                Genera Nuovo Annuncio
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Crea contenuti professionali con l'AI in pochi secondi
              </p>
              <Link href="/dashboard/listings">
                <Button className="neon-button w-full group/btn text-lg py-6" data-testid="button-start-generating">
                  <Plus className="mr-2 h-5 w-5" />
                  Inizia a Generare
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* AI Scraper - Neon Aqua Theme */}
            <div className="futuristic-card p-8 md:p-10 group hover:border-neon-aqua/50 hover-lift animate-fade-in-up delay-350" data-testid="card-action-scraper">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-neon-aqua/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-aqua">
                <Link2 className="h-7 w-7 md:h-8 md:w-8 text-neon-aqua" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-neon-aqua">
                AI Scraper
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Importa annunci da Immobiliare, Idealista, Casa, Subito
              </p>
              <Link href="/dashboard/scraper">
                <Button variant="outline" className="w-full text-lg py-6 border-2 border-neon-aqua/30 hover:border-neon-aqua hover:bg-neon-aqua/10 transition-all" data-testid="button-start-scraper">
                  <Link2 className="mr-2 h-5 w-5" />
                  Avvia Scraper
                </Button>
              </Link>
            </div>

            {/* AI Analyze - NEW FEATURE - Gradient Theme */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-neon-aqua/50 hover:border-neon-aqua shadow-glow-aqua hover-lift animate-fade-in-up delay-360 relative overflow-hidden" data-testid="card-action-analyze">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-neon-aqua to-electric-blue text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-neon-aqua/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-aqua">
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-neon-aqua" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-neon-aqua to-electric-blue bg-clip-text text-transparent">
                Analisi da Link
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Incolla un link e ottieni analisi + riscrittura AI istantanea
              </p>
              <Link href="/dashboard/analyze">
                <Button className="neon-button w-full group/btn text-lg py-6" data-testid="button-start-analyze">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analizza Link
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* AI Auditor - Expert Feature with Blue/Gold Theme */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-blue-500/50 hover:border-amber-500 shadow-glow-blue hover-lift animate-fade-in-up delay-375 relative overflow-hidden" data-testid="card-action-auditor">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-white">
                  🔥 Expert
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/30 to-amber-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }}>
                <Award className="h-7 w-7 md:h-8 md:w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Audit Immobiliare AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Audit completo: struttura, SEO, emozioni, red flags e versione ottimizzata
              </p>
              <Link href="/dashboard/auditor">
                <Button className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-500 hover:via-purple-500 hover:to-amber-400 text-white font-bold group/btn" data-testid="button-start-auditor">
                  <Award className="mr-2 h-5 w-5" />
                  Avvia Audit Expert
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Lead Scoring AI - Priority Feature with Cyan/Purple Theme */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-cyan-500/50 hover:border-cyan-400 hover-lift animate-fade-in-up delay-380 relative overflow-hidden" data-testid="card-action-lead-score" style={{ boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white">
                  🎯 Priority
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500/30 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}>
                <Target className="h-7 w-7 md:h-8 md:w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Lead Scoring AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Analizza i lead con punteggio 0-100, priorità d'azione e template risposta
              </p>
              <Link href="/dashboard/lead-score">
                <Button className="w-full text-lg py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold group/btn" data-testid="button-start-lead-score">
                  <Target className="mr-2 h-5 w-5" />
                  Analizza Lead
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* CRM 4.0 - Communication Hub + Automation + AI Enrichment with Emerald/Violet Theme */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-emerald-500/50 hover:border-violet-400 hover-lift animate-fade-in-up delay-385 relative overflow-hidden" data-testid="card-action-crm" style={{ boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500 text-white">
                  📬 CRM 4.0
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500/30 to-violet-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}>
                <Users className="h-7 w-7 md:h-8 md:w-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Lead Manager + AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Email, WhatsApp, SMS con AI - Pipeline, automazioni, form capture
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard/leads">
                  <Button className="w-full text-sm py-4 bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500 hover:from-emerald-400 hover:via-indigo-400 hover:to-violet-400 text-white font-bold" data-testid="button-start-crm">
                    <Users className="mr-1.5 h-4 w-4" />
                    Tabella
                  </Button>
                </Link>
                <Link href="/dashboard/leads/pipeline">
                  <Button variant="outline" className="w-full text-sm py-4 border-2 border-violet-500/50 text-violet-400 hover:bg-violet-500/10 font-bold" data-testid="button-start-pipeline">
                    Pipeline
                  </Button>
                </Link>
                <Link href="/dashboard/crm/automations">
                  <Button variant="outline" className="w-full text-sm py-4 border-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-bold" data-testid="button-crm-automations">
                    ⚡ Automazioni
                  </Button>
                </Link>
                <Link href="/dashboard/crm/settings">
                  <Button variant="outline" className="w-full text-sm py-4 border-2 border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 font-bold" data-testid="button-crm-settings">
                    🔑 API
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upgrade Plan (for free users) - Sunset Gold Theme */}
            {currentPlan === "free" && (
              <div className="futuristic-card p-8 md:p-10 border-2 border-sunset-gold/50 bg-gradient-luxury-gold shadow-glow-gold group hover-lift animate-fade-in-up delay-400" data-testid="card-action-upgrade">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-sunset-gold/40 to-royal-purple/30 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-gold">
                  <Crown className="h-7 w-7 md:h-8 md:w-8 text-sunset-gold dark:text-sunset-gold" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="premium-badge shadow-glow-gold">
                    ⭐ Consigliato
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 gradient-text-gold">
                  Passa a Pro
                </h3>
                <p className="text-foreground/90 dark:text-foreground/80 mb-6 md:mb-8 leading-relaxed text-lg font-medium">
                  Ottieni più annunci e sblocca funzionalità premium
                </p>
                <Link href="/dashboard/billing">
                  <Button className="neon-button w-full text-lg py-6 group/btn" data-testid="button-view-plans">
                    <Rocket className="mr-2 h-5 w-5" />
                    Vedi i Piani
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Manage Subscription (for paid users) */}
            {currentPlan !== "free" && (
              <div className="futuristic-card p-8 md:p-10 group hover-lift animate-fade-in-up delay-400" data-testid="card-action-billing">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-purple">
                  <Settings className="h-7 w-7 md:h-8 md:w-8 text-royal-purple" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 gradient-text-purple">
                  Gestisci Abbonamento
                </h3>
                <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                  Visualizza dettagli fatturazione e gestisci il tuo piano
                </p>
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="w-full text-lg py-6 border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all" data-testid="button-billing-settings">
                    <Settings className="mr-2 h-5 w-5" />
                    Impostazioni Fatturazione
                  </Button>
                </Link>
              </div>
            )}

            {/* PDF Generator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-sunset-gold/50 hover:border-sunset-gold shadow-glow-gold hover-lift animate-fade-in-up delay-480 relative overflow-hidden" data-testid="card-action-pdf">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-sunset-gold to-royal-purple text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-sunset-gold/30 to-royal-purple/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-gold">
                <FileText className="h-7 w-7 md:h-8 md:w-8 text-sunset-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 gradient-text-gold">
                Schede PDF Premium
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Genera schede immobiliari professionali stile Canva
              </p>
              <Link href="/dashboard/pdf">
                <Button className="neon-button w-full group/btn text-lg py-6" data-testid="button-generate-pdf">
                  <FileText className="mr-2 h-5 w-5" />
                  Genera PDF
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social Posts Generator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-pink-500/50 hover:border-pink-500 hover-lift animate-fade-in-up delay-490 relative overflow-hidden" data-testid="card-action-social">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500/30 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)' }}>
                <Share2 className="h-7 w-7 md:h-8 md:w-8 text-pink-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Post Social AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Genera post per Instagram, Facebook e TikTok in un click
              </p>
              <Link href="/dashboard/social-posts">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white" data-testid="button-generate-social">
                  <Share2 className="mr-2 h-5 w-5" />
                  Genera Post
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Titles A/B Generator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-indigo-500/50 hover:border-indigo-500 hover-lift animate-fade-in-up delay-495 relative overflow-hidden" data-testid="card-action-titles">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
                <MousePointerClick className="h-7 w-7 md:h-8 md:w-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Titoli A/B
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                19 titoli ad alto CTR: clickbait, luxury, SEO + miglior consiglio
              </p>
              <Link href="/dashboard/titles">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white" data-testid="button-generate-titles">
                  <MousePointerClick className="mr-2 h-5 w-5" />
                  Genera Titoli
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Multilingual Translator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-emerald-500/50 hover:border-emerald-500 hover-lift animate-fade-in-up delay-498 relative overflow-hidden" data-testid="card-action-translate">
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                <Globe className="h-7 w-7 md:h-8 md:w-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Traduttore 12 Lingue
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Traduci annunci in 12 lingue con adattamento culturale e SEO locale
              </p>
              <Link href="/dashboard/translate">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white" data-testid="button-translate">
                  <Globe className="mr-2 h-5 w-5" />
                  Traduci Annuncio
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Perfect Real Estate Copy 2.0 - POWER FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-amber-500/50 hover:border-amber-500 hover-lift animate-fade-in-up delay-499 relative overflow-hidden" data-testid="card-action-perfect-copy" style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white">
                  🚀 Power Feature
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
                <Crown className="h-7 w-7 md:h-8 md:w-8 text-amber-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Perfect Copy 2.0
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                5 varianti premium: Professionale, Emotivo, Breve, SEO, Luxury
              </p>
              <Link href="/dashboard/perfect-copy">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white" data-testid="button-perfect-copy">
                  <Crown className="mr-2 h-5 w-5" />
                  Genera 5 Varianti
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Agent BIO AI Creator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-blue-500/50 hover:border-blue-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-agent-bio" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
                  ✨ Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/30 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
                <User className="h-7 w-7 md:h-8 md:w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Agent BIO AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                5 bio professionali: Pro, Emotiva, Luxury, Social e Website SEO
              </p>
              <Link href="/dashboard/agent-bio">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white" data-testid="button-agent-bio">
                  <User className="mr-2 h-5 w-5" />
                  Genera Bio Agente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Follow-Up Email AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-red-500/50 hover:border-red-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-followup-email" style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white">
                  🔥 Lead Converter
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
                <Mail className="h-7 w-7 md:h-8 md:w-8 text-red-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Follow-Up Email AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                6 email professionali per convertire i tuoi lead immobiliari
              </p>
              <Link href="/dashboard/followup-emails">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white" data-testid="button-followup-email">
                  <Mail className="mr-2 h-5 w-5" />
                  Genera Email Follow-Up
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Video Scripts AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-purple-500/50 hover:border-purple-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-video-scripts" style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white">
                  🎬 Video Creator
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}>
                <Video className="h-7 w-7 md:h-8 md:w-8 text-purple-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Video Scripts AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Script video professionali con timestamp e indicazioni visive
              </p>
              <Link href="/dashboard/video-scripts">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white" data-testid="button-video-scripts">
                  <Video className="mr-2 h-5 w-5" />
                  Genera Script Video
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Hashtag AI Generator - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-yellow-500/50 hover:border-yellow-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-hashtags" style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white">
                  ⚡ Viral Booster
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}>
                <Target className="h-7 w-7 md:h-8 md:w-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Hashtag AI Generator
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                50+ hashtag ottimizzati per massimizzare il reach social
              </p>
              <Link href="/dashboard/hashtags">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 text-white" data-testid="button-hashtags">
                  <Target className="mr-2 h-5 w-5" />
                  Genera Hashtag Virali
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Emotional Listing AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-rose-500/50 hover:border-rose-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-emotional-listing" style={{ boxShadow: '0 0 30px rgba(244, 63, 94, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white">
                  💛 Emotional AI
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-rose-500/30 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)' }}>
                <Crown className="h-7 w-7 md:h-8 md:w-8 text-rose-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Emotional Listing AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Descrizioni emozionali che toccano il cuore degli acquirenti
              </p>
              <Link href="/dashboard/emotional-listing">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600 text-white" data-testid="button-emotional-listing">
                  <Crown className="mr-2 h-5 w-5" />
                  Genera Descrizioni Emozionali
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Perfect Again AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-violet-500/50 hover:border-violet-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-refine-listing" style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white">
                  ✨ Perfect Again AI
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-500/30 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-violet-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Perfect Again AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Raffina e migliora completamente i tuoi annunci esistenti
              </p>
              <Link href="/dashboard/refine-listing">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white" data-testid="button-refine-listing">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Perfeziona Annuncio
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Agency Assistant AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-blue-500/50 hover:border-blue-500 hover-lift animate-fade-in-up delay-500 relative overflow-hidden" data-testid="card-action-agency-assistant" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 text-white">
                  🤖 Nuovo
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
                <Bot className="h-7 w-7 md:h-8 md:w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                Agency Assistant AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Chatbot per annunci, email, social e strategia immobiliare
              </p>
              <Link href="/dashboard/agency-assistant">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 hover:from-blue-600 hover:via-violet-600 hover:to-purple-700 text-white" data-testid="button-agency-assistant">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Parla con l'Assistente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Automazioni AI - NEW FEATURE */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-teal-500/50 hover:border-teal-500 hover-lift animate-fade-in-up delay-510 relative overflow-hidden" data-testid="card-action-automations" style={{ boxShadow: '0 0 30px rgba(20, 184, 166, 0.2)' }}>
              <div className="absolute top-4 right-4">
                <span className="premium-badge bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 text-white">
                  ⚙️ Automazioni
                </span>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal-400/30 via-cyan-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all" style={{ boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}>
                <Settings className="h-7 w-7 md:h-8 md:w-8 text-teal-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Automazioni AI
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Follow-up, reminder e contenuti generati automaticamente
              </p>
              <Link href="/dashboard/automations">
                <Button className="w-full group/btn text-lg py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 hover:from-teal-500 hover:via-cyan-600 hover:to-emerald-600 text-white" data-testid="button-automations">
                  <Settings className="mr-2 h-5 w-5" />
                  Gestisci Automazioni
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* My Saved Listings */}
            <div className="futuristic-card p-8 md:p-10 group hover-lift animate-fade-in-up delay-500" data-testid="card-action-saved">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-neon-aqua/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-aqua">
                <FileText className="h-7 w-7 md:h-8 md:w-8 text-neon-aqua" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-neon-aqua">
                Annunci Salvati
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Accedi e gestisci tutti i tuoi annunci salvati
              </p>
              <Link href="/dashboard/listings">
                <Button variant="outline" className="w-full text-lg py-6 border-2 border-neon-aqua/30 hover:border-neon-aqua hover:bg-neon-aqua/10 transition-all" data-testid="button-view-listings">
                  <FileText className="mr-2 h-5 w-5" />
                  Vedi Annunci
                </Button>
              </Link>
            </div>

            {/* Premium Packages - High Ticket */}
            <div className="futuristic-card p-8 md:p-10 group border-2 border-sunset-gold/30 hover:border-sunset-gold hover-lift animate-fade-in-up delay-550" data-testid="card-action-packages">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-sunset-gold/30 to-royal-purple/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-glow-gold">
                <Gift className="h-7 w-7 md:h-8 md:w-8 text-sunset-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 gradient-text-gold">
                Pacchetti Premium
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-8 leading-relaxed text-lg">
                Soluzioni complete per agenzie: €197 - €897/mese + Pacchetti Premium
              </p>
              <Link href="/dashboard/packages">
                <Button variant="outline" className="w-full text-lg py-6 border-2 border-sunset-gold/30 hover:border-sunset-gold hover:bg-sunset-gold/10 transition-all" data-testid="button-view-packages">
                  <Gift className="mr-2 h-5 w-5" />
                  Scopri Pacchetti
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
