"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyPilotLogo } from "@/components/logo";
import {
  Sparkles,
  Globe,
  Zap,
  Check,
  Minus,
  ArrowRight,
  Phone,
  Bot,
  BarChart3,
  FileText,
  Users,
  Star,
  Crown,
  Building2,
  Rocket,
  Shield,
  Clock,
  MessageCircle,
  Mail,
  Smartphone,
  TrendingUp,
  Target,
  Workflow,
  Languages,
  MapPin,
  Play,
  ChevronRight,
  Award,
  Brain,
  PhoneCall,
  Search,
  Calendar,
  CheckCircle2,
  Radio,
  Filter,
  CalendarCheck,
  Radar,
  Sparkle,
  Loader2,
  Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { InteractiveSearchHook } from "@/components/interactive-search-hook";
import { SuccessStories } from "@/components/success-stories";

const AriaCoach = dynamic(() => import("@/components/aria-coach").then((m) => ({ default: m.AriaCoach })), {
  ssr: false,
  loading: () => null,
});
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { Currency, convertCurrency, formatCurrency } from "@/lib/utils/currency";
import { Menu, X } from "lucide-react";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { Locale } from "@/lib/i18n/config";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

export default function PlatformPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundwaveHeights, setSoundwaveHeights] = useState<number[]>([20, 25, 30, 35, 30, 25, 20]); // Default values for SSR
  const heroRef = useRef<HTMLDivElement>(null);

  // Use global locale context — single source of truth for the entire SaaS
  const { locale: currentLocale, currency: selectedCurrency, setLocale: handleLocaleChange, setCurrency: handleCurrencyChange } = useLocaleContext();

  // Get translations
  const t = getTranslation(currentLocale as SupportedLocale);

  // Chiudi menu mobile quando si clicca fuori
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setIsVisible(true);
    
    // Soundwave: use stable heights to avoid Hydration mismatch (no random on mount)
    
    // Smooth Scroll
    document.documentElement.style.scrollBehavior = "smooth";
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-on-scroll").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#000000] text-white relative overflow-hidden font-sans ${currentLocale === "ar" ? "rtl" : "ltr"}`}>
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9333ea]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <PropertyPilotLogo className="h-8 w-8" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              PropertyPilot AI
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-sm text-gray-400">{t.landing.nav.tagline}</span>
            
            {/* Language Selector - 7 lingue (IT, EN, ES, FR, DE, AR, PT) + Currency + Theme Toggle */}
            <LocaleCurrencySelector 
              currentLocale={currentLocale}
              currentCurrency={selectedCurrency}
              onLocaleChange={handleLocaleChange}
              onCurrencyChange={handleCurrencyChange}
            />
            <ThemeToggle />
            
            <a href="#features">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                {t.landing.nav.features}
              </Button>
            </a>
            <a href="#pricing">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                {t.landing.nav.pricing}
              </Button>
            </a>
            <Link href="/compliance">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                {t.landing.nav.compliance}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                {t.landing.nav.login}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-[#9333ea] to-[#9333ea]/80 hover:from-[#9333ea] hover:to-[#9333ea]/90 text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                {t.landing.nav.getStarted}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <LocaleCurrencySelector 
              currentLocale={currentLocale}
              currentCurrency={selectedCurrency}
              onLocaleChange={handleLocaleChange}
              onCurrencyChange={handleCurrencyChange}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/5 backdrop-blur-md border-b border-white/10 animate-fade-in-down">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  {t.landing.nav.features}
                </Button>
              </a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  {t.landing.nav.pricing}
                </Button>
              </a>
              <Link href="/compliance" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  {t.landing.nav.compliance}
                </Button>
              </Link>
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  {t.landing.nav.login}
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/80 hover:from-[#9333ea] hover:to-[#9333ea]/90 text-white">
                  {t.landing.nav.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Apple Style */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative pt-24 sm:pt-32 md:pt-40 pb-24 px-4 overflow-hidden`}
      >
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            {/* Badge Powered by GPT-4 */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 mb-8 relative backdrop-blur-md">
              <Brain className="h-4 w-4 text-[#06b6d4]" />
              <span className="text-sm font-medium text-[#06b6d4]">{t.landing.hero.poweredBy}</span>
              <div className="absolute inset-0 rounded-full bg-[#06b6d4]/20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Gigantic Title with Metallic AI Reflection */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold mb-6 leading-[1.1]">
              <span className="bg-gradient-to-r from-[#06b6d4] via-[#9333ea] to-[#9333ea] bg-clip-text text-transparent">
                {t.landing.hero.titlePart1}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent animate-gradient">
                {t.landing.hero.titlePart2}{" "}
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#06b6d4] via-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
                  {t.landing.hero.titleAI}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine"></div>
              </span>
            </h1>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mb-8 text-lg">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 border-2 border-[#0a0a0a]"></div>
                  ))}
                </div>
                <span className="text-gray-300 font-semibold">
                  {t.landing.hero.socialProof}{" "}
                  <span className="text-[#06b6d4]">{t.landing.hero.socialProofAgencies}</span>{" "}
                  {t.landing.hero.socialProofLocation}
                </span>
              </div>
            </div>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t.landing.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth/signup" aria-label="Sign up for PropertyPilot AI">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-7 bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] relative overflow-hidden group transition-all active:scale-95"
                  aria-label={t.landing.hero.ctaStart}
                >
                  <span className="relative z-10 flex items-center">
                    {t.landing.hero.ctaStart}
                    <ArrowRight className={`${currentLocale === "ar" ? "mr-3" : "ml-3"} h-6 w-6`} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#9333ea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-lg bg-[#06b6d4]/30 blur-2xl animate-pulse"></div>
                </Button>
              </Link>
              <Link href="/dashboard" aria-label="View demo dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-12 py-7 border-white/20 text-white/90 hover:bg-white/5 backdrop-blur-md transition-all active:scale-95 hover:border-white/30 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                  aria-label={t.landing.hero.ctaDemo}
                >
                  {t.landing.hero.ctaDemo}
                  <Play className={`${currentLocale === "ar" ? "mr-3" : "ml-3"} h-6 w-6`} />
                </Button>
              </Link>
            </div>

            {/* Trusted By Section */}
            <div className="mt-20 fade-on-scroll">
              <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">{t.landing.hero.trustedBy}</p>
              <div className="flex items-center justify-center gap-8 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="text-2xl font-bold text-gray-400">Idealista</div>
                <div className="text-2xl font-bold text-gray-400">Immobiliare.it</div>
                <div className="text-2xl font-bold text-gray-400">Zillow</div>
                <div className="text-2xl font-bold text-gray-400">MLS</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-400 mt-2">{t.landing.hero.stats.automation}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-400 mt-2">{t.landing.hero.stats.listingsPerDay}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">80%</div>
                <div className="text-sm text-gray-400 mt-2">{t.landing.hero.stats.conversionRate}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Interactive Search Hook */}
      <InteractiveSearchHook />

      {/* Why PropertyPilot AI Section - Diamond Polish */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-gradient-to-b from-[#000000] to-[#080808] relative"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.landing.features.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: t.landing.features.aiListing.title,
                description: t.landing.features.aiListing.description,
                benefit: t.landing.features.aiListing.benefit,
              },
              {
                icon: BarChart3,
                title: t.landing.features.crmAI.title,
                description: t.landing.features.crmAI.description,
                benefit: t.landing.features.crmAI.benefit,
              },
              {
                icon: Globe,
                title: t.landing.features.globalReach.title,
                description: t.landing.features.globalReach.description,
                benefit: t.landing.features.globalReach.benefit,
              },
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="glass-card fade-on-scroll border-white/10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/20 to-[#9333ea]/10 flex items-center justify-center mb-4 border border-[#9333ea]/30 backdrop-blur-md">
                    <feature.icon className="h-8 w-8 text-[#9333ea]" />
                  </div>
                  <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <div className="bg-[#9333ea]/10 rounded-lg p-3 border border-[#9333ea]/20 backdrop-blur-sm">
                    <p className="text-sm text-[#06b6d4] font-semibold">💡 {feature.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Il Motore di Ricerca che non dorme mai - Bento Grid with Border Beam */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#000000] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/10 via-transparent to-[#06b6d4]/10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#06b6d4] via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.landing.searchEngine.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t.landing.searchEngine.subtitle} <span className="text-[#06b6d4] font-bold">{t.landing.searchEngine.exclusive}</span> {t.landing.searchEngine.exclusiveInPlan}
            </p>
            <div className="mt-4 inline-block px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <span className="text-sm text-[#06b6d4] font-semibold">{t.landing.searchEngine.benefit}</span>
            </div>
          </div>

          {/* Bento Grid with Border Beam */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-on-scroll">
            {/* Step 1: Scansione Globale */}
            <Card className="glass-card border-white/10 hover:border-[#9333ea]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/30 to-[#9333ea]/10 flex items-center justify-center mb-4 border border-[#9333ea]/30">
                  <Radar className="h-8 w-8 text-[#9333ea] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#9333ea] mb-2">STEP 1</div>
                <CardTitle className="text-xl text-white">{t.landing.searchEngine.step1.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {t.landing.searchEngine.step1.description}
                </p>
                {/* Progress Bar Animation */}
                <div className="w-full h-2 bg-[#9333ea]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9333ea] to-[#06b6d4] rounded-full animate-progress"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{t.landing.searchEngine.step1.status}</p>
              </CardContent>
            </Card>

            {/* Step 2: Filtrazione IA */}
            <Card className="glass-card border-white/10 hover:border-[#06b6d4]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/30 to-[#06b6d4]/10 flex items-center justify-center mb-4 border border-[#06b6d4]/30">
                  <Filter className="h-8 w-8 text-[#06b6d4] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#06b6d4] mb-2">STEP 2</div>
                <CardTitle className="text-xl text-white">{t.landing.searchEngine.step2.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {t.landing.searchEngine.step2.description}
                </p>
                {/* Score Animation */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#06b6d4]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#06b6d4] to-[#9333ea] rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-xs font-bold text-[#06b6d4]">85/100</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{t.landing.searchEngine.step2.status}</p>
              </CardContent>
            </Card>

            {/* Step 3: Chiamata Automatica */}
            <Card className="glass-card border-white/10 hover:border-[#9333ea]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/30 to-[#06b6d4]/20 flex items-center justify-center mb-4 border border-[#9333ea]/30">
                  <PhoneCall className="h-8 w-8 text-[#06b6d4] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#06b6d4] mb-2">STEP 3</div>
                <CardTitle className="text-xl text-white">{t.landing.searchEngine.step3.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {t.landing.searchEngine.step3.description}
                </p>
                {/* Sound Wave Animation */}
                <div className="flex items-end justify-center gap-1 h-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-[#06b6d4] to-[#9333ea] rounded-full animate-soundwave"
                      style={{
                        height: `${soundwaveHeights[i - 1]}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{t.landing.searchEngine.step3.status}</p>
              </CardContent>
            </Card>

            {/* Step 4: Appuntamento in Agenda */}
            <Card className="glass-card border-white/10 hover:border-[#06b6d4]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/30 to-[#9333ea]/20 flex items-center justify-center mb-4 border border-[#06b6d4]/30">
                  <CalendarCheck className="h-8 w-8 text-[#9333ea] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#9333ea] mb-2">STEP 4</div>
                <CardTitle className="text-xl text-white">{t.landing.searchEngine.step4.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {t.landing.searchEngine.step4.description}
                </p>
                {/* Calendar Check Animation */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Calendar className="h-8 w-8 text-[#06b6d4]" />
                    <CheckCircle2 className="h-5 w-5 text-green-400 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{t.landing.searchEngine.step4.status}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Il tuo nuovo Martedì mattina */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-[#000000] relative"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.landing.tuesdayMorning.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t.landing.tuesdayMorning.subtitle}
            </p>
          </div>

          <div className="space-y-8 fade-on-scroll">
            {[
              { time: t.landing.tuesdayMorning.time1, title: t.landing.tuesdayMorning.time1Title, description: t.landing.tuesdayMorning.time1Desc },
              { time: t.landing.tuesdayMorning.time2, title: t.landing.tuesdayMorning.time2Title, description: t.landing.tuesdayMorning.time2Desc },
              { time: t.landing.tuesdayMorning.time3, title: t.landing.tuesdayMorning.time3Title, description: t.landing.tuesdayMorning.time3Desc },
            ].map((item, idx) => (
              <Card 
                key={idx}
                className="glass-card border-white/10 hover:border-[#9333ea]/30"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/20 to-[#06b6d4]/20 flex items-center justify-center border border-[#9333ea]/30">
                        <Clock className="h-8 w-8 text-[#06b6d4]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[#9333ea] mb-2">{item.time}</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-gradient-to-b from-[#000000] to-[#080808]"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.landing.testimonials.title}
            </h2>
            <p className="text-xl text-gray-400">
              {t.landing.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t.landing.testimonials.testimonial1.name,
                role: t.landing.testimonials.testimonial1.role,
                content: t.landing.testimonials.testimonial1.content,
                rating: 5,
              },
              {
                name: t.landing.testimonials.testimonial2.name,
                role: t.landing.testimonials.testimonial2.role,
                content: t.landing.testimonials.testimonial2.content,
                rating: 5,
              },
              {
                name: t.landing.testimonials.testimonial3.name,
                role: t.landing.testimonials.testimonial3.role,
                content: t.landing.testimonials.testimonial3.content,
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card 
                key={idx} 
                className="glass-card border-white/10 hover:border-[#9333ea]/30 fade-on-scroll"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Aria - Your AI Success Partner Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#000000] relative"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9333ea]/10 border border-[#9333ea]/30 mb-6 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-[#9333ea]" />
              <span className="text-sm font-medium text-[#9333ea]">{t.landing.aria.badge}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">
              {t.landing.aria.title}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t.landing.aria.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 fade-on-scroll">
            {[
              {
                icon: Clock,
                title: t.landing.aria.mentoring.title,
                description: t.landing.aria.mentoring.description,
                benefit: t.landing.aria.mentoring.benefit,
              },
              {
                icon: Zap,
                title: t.landing.aria.onboarding.title,
                description: t.landing.aria.onboarding.description,
                benefit: t.landing.aria.onboarding.benefit,
              },
              {
                icon: Heart,
                title: t.landing.aria.support.title,
                description: t.landing.aria.support.description,
                benefit: t.landing.aria.support.benefit,
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="glass-card border-white/10 hover:border-[#9333ea]/30 fade-on-scroll"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/20 to-[#06b6d4]/20 flex items-center justify-center mb-4 border border-[#9333ea]/30">
                    <feature.icon className="h-8 w-8 text-[#9333ea]" />
                  </div>
                  <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <div className="bg-[#9333ea]/10 rounded-lg p-3 border border-[#9333ea]/20 backdrop-blur-sm">
                    <p className="text-sm text-[#06b6d4] font-semibold">💡 {feature.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 fade-on-scroll">
            <p className="text-lg text-gray-300 mb-6">
              {t.landing.aria.available}
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <MessageCircle className="h-5 w-5 text-[#9333ea]" />
              <span className="text-sm text-white/90">{t.landing.aria.availableFree}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Table - Elite - Diamond Polish */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 bg-gradient-to-b from-[#000000] to-[#080808] relative"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from:white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.landing.pricing.title}
            </h2>
            <p className="text-xl text-gray-400 font-light">
              {t.landing.pricing.subtitle}
            </p>
          </div>

          {/* Pricing Table - Responsive */}
          <div className="overflow-x-auto fade-on-scroll scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
            <div className="min-w-[1000px] md:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">{t.landing.pricing.feature}</th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">FREE</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(0, selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">{t.landing.pricing.perMonth}</div>
                      </div>
                    </th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">STARTER</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(197, "EUR", selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">{t.landing.pricing.perMonth}</div>
                      </div>
                    </th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">PRO</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(497, "EUR", selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">{t.landing.pricing.perMonth}</div>
                      </div>
                    </th>
                    <th className="text-center p-4 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#9333ea] to-[#06b6d4] text-white text-xs font-bold rounded-full z-10 backdrop-blur-md border border-white/20">
                        {t.landing.pricing.bestValue}
                      </div>
                      <div className="glass-card border-2 border-[#9333ea]/50 rounded-lg p-4 shadow-[0_0_30px_rgba(147,51,234,0.3)] relative">
                        <div className="text-2xl font-bold text:white mb-1">AGENCY</div>
                        <div className="text-xs text-[#06b6d4] mb-1 font-semibold">{t.landing.pricing.agencySubtitle}</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(897, "EUR", selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">{t.landing.pricing.perMonth}</div>
                        <div className="text-xs text-[#06b6d4] mt-1 font-semibold">{t.landing.pricing.agencyExtra}</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: t.landing.pricing.features.listingsPerMonth, free: "5", starter: "50", pro: "200", agency: t.landing.pricing.plans.unlimited },
                    { feature: t.landing.pricing.features.aiGeneration, free: "✓", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.aiStyles, free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.multilingual, free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.pdf, free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.crm, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.kanban, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.leadScoring, free: "—", starter: "✓", pro: `✓ ${t.landing.pricing.plans.advanced}`, agency: `✓ ${t.landing.pricing.plans.advanced}` },
                    { feature: t.landing.pricing.features.briefing, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.staging, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.followup, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.automations, free: "—", starter: "—", pro: "20", agency: t.landing.pricing.plans.unlimited },
                    { feature: t.landing.pricing.features.forms, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.whiteLabel, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.assistant, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.multiUser, free: "—", starter: "—", pro: "—", agency: currentLocale === "en" ? "Up to 10 agents" : currentLocale === "es" ? "Hasta 10 agentes" : currentLocale === "fr" ? "Jusqu'à 10 agents" : currentLocale === "de" ? "Bis zu 10 Agenten" : currentLocale === "ar" ? "حتى 10 وكلاء" : currentLocale === "pt" ? "Até 10 agentes" : "Fino a 10 agenti" },
                    { feature: t.landing.pricing.features.roles, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.distribution, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.reports, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.multiOffice, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.auraVR, free: "—", starter: "—", pro: <span className="text-gray-400">{t.landing.pricing.plans.viewer}</span>, agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.unlimited}</span> },
                    { feature: t.landing.pricing.features.voiceCalling, free: "—", starter: "—", pro: currentLocale === "en" ? "30/month" : currentLocale === "es" ? "30/mes" : currentLocale === "fr" ? "30/mois" : currentLocale === "de" ? "30/Monat" : currentLocale === "ar" ? "30/شهر" : currentLocale === "pt" ? "30/mês" : "30/mese", agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.unlimited}</span> },
                    { feature: t.landing.pricing.features.messaging, free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.exclusive}</span> },
                    { feature: t.landing.pricing.features.manualOverride, free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.exclusive}</span> },
                    { feature: t.landing.pricing.features.humanOverride, free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: t.landing.pricing.features.autoProspecting, free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.active}</span> },
                    { feature: t.landing.pricing.features.scraping, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.dashboard, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.calendar, free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ {t.landing.pricing.plans.exclusive}</span> },
                    { feature: t.landing.pricing.features.notifications, free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: t.landing.pricing.features.support, free: t.landing.pricing.plans.community, starter: t.landing.pricing.plans.email, pro: t.landing.pricing.plans.priority, agency: t.landing.pricing.plans.dedicated },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300 font-medium text-sm">{row.feature}</td>
                      <td className="p-4 text-center">
                        <span className={row.free === "✓" ? "text-green-400" : row.free === "—" ? "text-gray-600/50" : "text-gray-300 font-light"}>
                          {row.free}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={row.starter === "✓" ? "text-green-400" : row.starter === "—" ? "text-gray-600/50" : "text-gray-300 font-light"}>
                          {row.starter}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={row.pro === "✓" ? "text-green-400" : row.pro === "—" ? "text-gray-600/50" : "text-gray-300 font-light"}>
                          {row.pro}
                        </span>
                      </td>
                      <td className="p-4 text-center bg-[#9333ea]/5">
                        <span className={typeof row.agency === "string" && row.agency === "✓" ? "text-green-400" : typeof row.agency === "string" && row.agency === "—" ? "text-gray-600/50" : "text-gray-300 font-light"}>
                          {row.agency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 fade-on-scroll">
            <Link href="/auth/signup" className="w-full">
              <Button variant="outline" className="w-full border-white/20 text-white/90 hover:bg:white/5 backdrop-blur-md transition-all active:scale-95 hover:border-white/30">
                {t.landing.pricing.cta.startFree}
              </Button>
            </Link>
            <Link href="/auth/signup?plan=starter" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text:white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                {t.landing.pricing.cta.chooseStarter}
              </Button>
            </Link>
            <Link href="/auth/signup?plan=pro" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text:white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                {t.landing.pricing.cta.choosePro}
              </Button>
            </Link>
            <Link href="/auth/signup?plan=agency" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#06b6d4] to-[#06b6d4]/90 hover:from-[#06b6d4] hover:to-[#06b6d4] text-black font-bold border-0 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all active:scale-95">
                {t.landing.pricing.cta.chooseAgency}
              </Button>
            </Link>
          </div>

          {/* Agency Boost - Titanium Package - Gold animated border + pulsating glow */}
          <div className="mt-16 fade-on-scroll">
            <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent relative overflow-hidden border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.4),0_0_100px_rgba(251,191,36,0.2)] hover:shadow-[0_0_70px_rgba(245,158,11,0.6),0_0_120px_rgba(251,191,36,0.3)] transition-all duration-500 hover:border-amber-400/80 ring-2 ring-amber-400/30 ring-offset-2 ring-offset-[#000000] agency-boost-card">
              <div className="absolute -top-3 right-4 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full z-10 backdrop-blur-md border border-white/20">
                PREMIUM SERVICE
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-8 w-8 text-orange-400" />
                    <h3 className="text-3xl font-bold text-white">Agency Boost</h3>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full border border-orange-500/30">
                      Titanium
                    </span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    {currentLocale === "en" 
                      ? "Done-for-you setup package with premium onboarding and dedicated support"
                      : currentLocale === "es"
                      ? 'Paquete de configuración "done-for-you" con incorporación premium y soporte dedicado'
                      : currentLocale === "fr"
                      ? 'Package de configuration "done-for-you" avec intégration premium et support dédié'
                      : currentLocale === "de"
                      ? "Done-for-you Setup-Paket mit Premium-Onboarding und dediziertem Support"
                      : currentLocale === "ar"
                      ? "حزمة الإعداد الجاهزة مع الدعم المخصص"
                      : 'Pacchetto setup completo "done-for-you" con onboarding premium e supporto dedicato'}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <span>{currentLocale === "en" ? 'Complete setup "done-for-you"' : currentLocale === "es" ? 'Configuración completa "done-for-you"' : currentLocale === "fr" ? 'Configuration complète "done-for-you"' : currentLocale === "de" ? 'Vollständige Einrichtung "done-for-you"' : currentLocale === "ar" ? "إعداد كامل جاهز" : 'Setup completo "done-for-you"'}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <span>{currentLocale === "en" ? "Guided implementation and onboarding" : currentLocale === "es" ? "Implementación y incorporación guiada" : currentLocale === "fr" ? "Implémentation et intégration guidées" : currentLocale === "de" ? "Geführte Implementierung und Onboarding" : currentLocale === "ar" ? "تنفيذ وإعداد موجه" : "Implementazione e onboarding guidato"}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <span>{currentLocale === "en" ? "Premium support for launch" : currentLocale === "es" ? "Soporte premium para el lanzamiento" : currentLocale === "fr" ? "Support premium pour le lancement" : currentLocale === "de" ? "Premium-Support für den Start" : currentLocale === "ar" ? "دعم مميز للإطلاق" : "Supporto premium per il lancio"}</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-5xl font-extrabold text-white mb-2">
                      {formatCurrency(convertCurrency(2497, "EUR", selectedCurrency), selectedCurrency)}
                    </div>
                    <div className="text-gray-400 font-light">
                      {currentLocale === "en" ? "One-time payment" : currentLocale === "es" ? "Pago único" : currentLocale === "fr" ? "Paiement unique" : currentLocale === "de" ? "Einmalige Zahlung" : currentLocale === "ar" ? "دفعة واحدة" : "Pagamento una tantum"}
                    </div>
                  </div>
                  <Link href="/api/stripe/checkout-oneshot?package=boost">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold border-0 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] transition-all active:scale-95 py-6 text-lg">
                      {currentLocale === "en" ? "Get Agency Boost" : currentLocale === "es" ? "Obtener Agency Boost" : currentLocale === "fr" ? "Obtenir Agency Boost" : currentLocale === "de" ? "Agency Boost erhalten" : currentLocale === "ar" ? "احصل على Agency Boost" : "Acquista Agency Boost"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#000000] to-[#080808]">
        <div className="container mx-auto max-w-4xl text-center fade-on-scroll">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl mb-4 text-white">
                {t.landing.cta.title}
              </CardTitle>
              <CardDescription className="text-xl text-gray-300">
                {t.landing.cta.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-7 bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] transition-all active:scale-95"
                >
                  {t.landing.cta.button}
                  <ArrowRight className={`${currentLocale === "ar" ? "mr-3" : "ml-3"} h-6 w-6`} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#000000] border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <PropertyPilotLogo className="h-6 w-6" />
                <span className="text-xl font-bold text-white">PropertyPilot AI</span>
              </div>
              <p className="text-gray-400 text-sm font-light">
                {t.landing.footer.tagline}
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.landing.footer.product}</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/pricing" className="hover:text-[#9333ea] transition-colors">{t.landing.footer.pricing}</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#9333ea] transition-colors">{t.landing.footer.dashboard}</Link></li>
                <li><Link href="/features" className="hover:text-[#9333ea] transition-colors">{t.landing.footer.features}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.landing.footer.company}</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/about" className="hover:text-purple-400 transition-colors">{t.landing.footer.about}</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">{t.landing.footer.contact}</Link></li>
                <li><Link href="/blog" className="hover:text-purple-400 transition-colors">{t.landing.footer.blog}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.landing.footer.support}</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">{t.landing.footer.privacy}</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400 transition-colors">{t.landing.footer.terms}</Link></li>
                <li><Link href="/refund" className="hover:text-purple-400 transition-colors">{t.landing.footer.refund}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center">
            <p className="text-gray-400 text-sm font-light">
              &copy; {new Date().getFullYear()} PropertyPilot AI. {t.landing.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Aria Coach - Floating AI Assistant */}
      <AriaCoach />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .fade-on-scroll {
          opacity: 0;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        @keyframes soundwave {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
        .animate-soundwave {
          animation: soundwave 1s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 50px rgba(245,158,11,0.4), 0 0 100px rgba(251,191,36,0.2); }
          50% { box-shadow: 0 0 70px rgba(245,158,11,0.6), 0 0 120px rgba(251,191,36,0.35); }
        }
        .agency-boost-card {
          animation: glow-pulse 2.5s ease-in-out infinite;
        }
        @keyframes border-beam {
          0% {
            border-image-source: linear-gradient(90deg, transparent, transparent);
          }
          50% {
            border-image-source: linear-gradient(90deg, rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.5));
          }
          100% {
            border-image-source: linear-gradient(90deg, transparent, transparent);
          }
        }
        .border-beam {
          position: relative;
        }
        .border-beam::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.5), transparent);
          background-size: 200% 100%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-beam 3s linear infinite;
        }
        .agency-glow::after {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%);
          filter: blur(20px);
          z-index: -1;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

