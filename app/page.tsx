"use client";

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
import { InteractiveSearchHook } from "@/components/interactive-search-hook";
import { SuccessStories } from "@/components/success-stories";
import { AriaCoach } from "@/components/aria-coach";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { Currency, convertCurrency, formatCurrency } from "@/lib/utils/currency";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Carica valuta da localStorage al mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('propertypilot_currency') as Currency;
      if (savedCurrency && ['USD', 'EUR', 'GBP'].includes(savedCurrency)) {
        setSelectedCurrency(savedCurrency);
      }
    }
  }, []);

  // Chiudi menu mobile quando si clicca fuori
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setIsVisible(true);
    
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
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-['Inter_Tight',sans-serif]">
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
            <span className="text-sm text-gray-400">Pilot Your Agency to the Next Level</span>
            
            {/* Locale & Currency Selector */}
            <LocaleCurrencySelector 
              currentCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />
            
            <a href="#features">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                Features
              </Button>
            </a>
            <a href="#pricing">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                Pricing
              </Button>
            </a>
            <Link href="/compliance">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                Compliance
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-all active:scale-95">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-[#9333ea] to-[#9333ea]/80 hover:from-[#9333ea] hover:to-[#9333ea]/90 text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LocaleCurrencySelector 
              currentCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
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
                  Features
                </Button>
              </a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Pricing
                </Button>
              </a>
              <Link href="/compliance" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Compliance
                </Button>
              </Link>
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/80 hover:from-[#9333ea] hover:to-[#9333ea]/90 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

          {/* Hero Section - Apple Style */}
      <section ref={heroRef} className={`relative pt-24 sm:pt-32 md:pt-40 pb-24 px-4 overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            {/* Badge Powered by GPT-4 */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 mb-8 relative backdrop-blur-md">
              <Brain className="h-4 w-4 text-[#06b6d4]" />
              <span className="text-sm font-medium text-[#06b6d4]">Powered by GPT-4</span>
              <div className="absolute inset-0 rounded-full bg-[#06b6d4]/20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Gigantic Title with Metallic AI Reflection */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold mb-6 leading-[1.1]">
              <span className="bg-gradient-to-r from-[#06b6d4] via-[#9333ea] to-[#9333ea] bg-clip-text text-transparent">
                Il tuo Agente
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent animate-gradient">
                Immobiliare{" "}
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#06b6d4] via-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
                  AI
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
                <span className="text-gray-300 font-semibold">Scelto da <span className="text-[#06b6d4]">+500 agenzie</span> in Europa</span>
              </div>
            </div>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              L'unico Sistema Operativo AI che trova, analizza e ottiene mandati in totale autonomia
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-7 bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] relative overflow-hidden group transition-all active:scale-95"
                >
                  <span className="relative z-10 flex items-center">
                    Inizia Gratis
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#9333ea] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-lg bg-[#06b6d4]/30 blur-2xl animate-pulse"></div>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-12 py-7 border-white/20 text-white/90 hover:bg-white/5 backdrop-blur-md transition-all active:scale-95 hover:border-white/30 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                >
                  Vedi Demo
                  <Play className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>

            {/* Trusted By Section */}
            <div className="mt-20 fade-on-scroll">
              <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">Compatibile con i principali portali</p>
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
                <div className="text-sm text-gray-400 mt-2">Automazione</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-400 mt-2">Annunci/Giorno</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">80%</div>
                <div className="text-sm text-gray-400 mt-2">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Search Hook */}
      <InteractiveSearchHook />

      {/* Why PropertyPilot AI Section - Diamond Polish */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-[#050505] to-[#080808] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Why PropertyPilot AI?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              La piattaforma AI completa per agenti immobiliari che vogliono scalare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "AI Listing Engine",
                description: "Genera annunci professionali in secondi con stili personalizzati (Luxury, Investment, Standard Pro). Multi-lingua e ottimizzato per Zillow, Idealista, Immobiliare.",
                benefit: "Risparmia 5 ore a settimana su scrittura annunci",
              },
              {
                icon: BarChart3,
                title: "CRM AI Intelligence",
                description: "Lead Scoring automatico, follow-up AI multi-canale (WhatsApp, Email, SMS). Categorizza lead HOT/WARM/COLD e suggerisce azioni prioritarie.",
                benefit: "Aumenta conversioni del 40% con prioritizzazione AI",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Operiamo su USA (Zillow, MLS), Italia (Idealista, Immobiliare), Spagna (Idealista.es). Terminologia localizzata e formati di mercato.",
                benefit: "Espandi il tuo business in 3 continenti",
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
      </section>

      {/* Il Motore di Ricerca che non dorme mai - Bento Grid with Border Beam */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/10 via-transparent to-[#06b6d4]/10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#06b6d4] via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Il Motore di Ricerca che non dorme mai
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Disponibile <span className="text-[#06b6d4] font-bold">ESCLUSIVAMENTE</span> nel piano AGENCY
            </p>
            <div className="mt-4 inline-block px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <span className="text-sm text-[#06b6d4] font-semibold">Risparmia 20 ore di telefonate a settimana</span>
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
                <CardTitle className="text-xl text-white">Scansione Globale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  L'AI scansiona automaticamente Idealista, Immobiliare, Zillow e MLS 24/7, trovando migliaia di annunci ogni giorno.
                </p>
                {/* Progress Bar Animation */}
                <div className="w-full h-2 bg-[#9333ea]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9333ea] to-[#06b6d4] rounded-full animate-progress"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Scansione in corso...</p>
              </CardContent>
            </Card>

            {/* Step 2: Filtrazione IA */}
            <Card className="glass-card border-white/10 hover:border-[#06b6d4]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/30 to-[#06b6d4]/10 flex items-center justify-center mb-4 border border-[#06b6d4]/30">
                  <Filter className="h-8 w-8 text-[#06b6d4] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#06b6d4] mb-2">STEP 2</div>
                <CardTitle className="text-xl text-white">Filtrazione IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Ogni annuncio riceve un Lead Score AI (0-100). Solo i "TOP DEAL" (80+) vengono selezionati per le chiamate.
                </p>
                {/* Score Animation */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#06b6d4]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#06b6d4] to-[#9333ea] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-[#06b6d4]">85/100</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">TOP DEAL rilevato</p>
              </CardContent>
            </Card>

            {/* Step 3: Chiamata Automatica */}
            <Card className="glass-card border-white/10 hover:border-[#9333ea]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9333ea]/30 to-[#06b6d4]/20 flex items-center justify-center mb-4 border border-[#9333ea]/30">
                  <PhoneCall className="h-8 w-8 text-[#06b6d4] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#06b6d4] mb-2">STEP 3</div>
                <CardTitle className="text-xl text-white">Chiamata Automatica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Voice AI (Bland AI) chiama i proprietari, gestisce obiezioni e propone appuntamenti in modo naturale e persuasivo.
                </p>
                {/* Sound Wave Animation */}
                <div className="flex items-end justify-center gap-1 h-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-[#06b6d4] to-[#9333ea] rounded-full animate-soundwave"
                      style={{
                        height: `${20 + Math.random() * 30}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Chiamata in corso...</p>
              </CardContent>
            </Card>

            {/* Step 4: Appuntamento in Agenda */}
            <Card className="glass-card border-white/10 hover:border-[#06b6d4]/30">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/30 to-[#9333ea]/20 flex items-center justify-center mb-4 border border-[#06b6d4]/30">
                  <CalendarCheck className="h-8 w-8 text-[#9333ea] animate-pulse" />
                </div>
                <div className="text-xs font-bold text-[#9333ea] mb-2">STEP 4</div>
                <CardTitle className="text-xl text-white">Appuntamento in Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  L'appuntamento viene automaticamente aggiunto al tuo Google Calendar e ricevi una notifica email con tutti i dettagli.
                </p>
                {/* Calendar Check Animation */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Calendar className="h-8 w-8 text-[#06b6d4]" />
                    <CheckCircle2 className="h-5 w-5 text-green-400 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Appuntamento confermato</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Il tuo nuovo Martedì mattina */}
      <section className="py-24 px-4 bg-[#050505] relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Il tuo nuovo Martedì mattina
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Immagina di svegliarti con il lavoro già fatto
            </p>
          </div>

          <div className="space-y-8 fade-on-scroll">
            {[
              { time: "Ore 08:00", title: "L'IA ha già analizzato 500 annunci", description: "Mentre dormivi, il sistema ha scansionato Idealista, Immobiliare, Zillow e MLS. Ogni annuncio è stato analizzato e classificato con un Lead Score AI." },
              { time: "Ore 08:30", title: "3 proprietari hanno confermato la visita", description: "Voice AI ha chiamato i proprietari dei TOP DEAL (score 80+). Tre hanno già confermato la disponibilità per una visita questa settimana." },
              { time: "Ore 09:00", title: "Ti svegli e apri l'agenda già piena", description: "Apri PropertyPilot AI e trovi 3 appuntamenti già in calendario, con tutti i dettagli dell'immobile, contatti del proprietario e note AI." },
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
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#050505] to-[#080808]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Loved by Agents Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              Migliaia di agenti immobiliari si fidano di PropertyPilot AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marco Rossi",
                role: "Agente Immobiliare, Milano",
                content: "PropertyPilot AI ha triplicato i miei affari. Il Lead Scoring AI mi dice esattamente su quali lead concentrarmi.",
                rating: 5,
              },
              {
                name: "Sarah Johnson",
                role: "Real Estate Agent, Miami",
                content: "La funzione di generazione annunci è incredibile. Creo listing professionali in 30 secondi invece di ore.",
                rating: 5,
              },
              {
                name: "Carlos Garcia",
                role: "Agente, Barcelona",
                content: "Il CRM AI è un game-changer. I follow-up automatici mi fanno risparmiare 10 ore a settimana.",
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
      </section>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Aria - Your AI Success Partner Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#050505] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-on-scroll">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9333ea]/10 border border-[#9333ea]/30 mb-6 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-[#9333ea]" />
              <span className="text-sm font-medium text-[#9333ea]">Disponibile in tutti i piani</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">
              Aria - Your AI Success Partner
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Il tuo coach personale, sempre disponibile. Onboarding, strategia, motivazione: tutto in una chat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 fade-on-scroll">
            {[
              {
                icon: Clock,
                title: "Mentoring 24/7",
                description: "Mai più solo nelle trattative. Aria ti guida passo dopo passo, anche quando il cliente fa obiezioni difficili.",
                benefit: "Riduci lo stress e aumenta la sicurezza",
              },
              {
                icon: Zap,
                title: "Onboarding Istantaneo",
                description: "Impara a dominare PropertyPilot in 5 minuti parlando con Aria. Nessun tutorial lungo, solo conversazione naturale.",
                benefit: "Diventa produttivo da subito",
              },
              {
                icon: Heart,
                title: "Supporto Psicologico",
                description: "L'alleata che ti motiva a chiudere quel mandato quando la sfida si fa dura. Aria conosce la psicologia delle vendite.",
                benefit: "Mantieni alta la motivazione",
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
              Aria è sempre disponibile. Clicca sulla bolla in basso a destra per iniziare.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <MessageCircle className="h-5 w-5 text-[#9333ea]" />
              <span className="text-sm text-white/90">Disponibile anche nel piano FREE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table - Elite - Diamond Polish */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-[#050505] to-[#080808] relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 fade-on-scroll">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Prezzi
            </h2>
            <p className="text-xl text-gray-400 font-light">
              Confronta i piani e scegli quello perfetto per il tuo business
            </p>
          </div>

          {/* Pricing Table - Responsive */}
          <div className="overflow-x-auto fade-on-scroll scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
            <div className="min-w-[1000px] md:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-semibold text-sm">Funzionalità</th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">FREE</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(0, selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">/mese</div>
                      </div>
                    </th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">STARTER</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(197, 'EUR', selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">/mese</div>
                      </div>
                    </th>
                    <th className="text-center p-4">
                      <div className="glass-card border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white mb-1">PRO</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(497, 'EUR', selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">/mese</div>
                      </div>
                    </th>
                    <th className="text-center p-4 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#9333ea] to-[#06b6d4] text-white text-xs font-bold rounded-full z-10 backdrop-blur-md border border-white/20">
                        BEST VALUE
                      </div>
                      <div className="glass-card border-2 border-[#9333ea]/50 rounded-lg p-4 shadow-[0_0_30px_rgba(147,51,234,0.3)] relative">
                        <div className="text-2xl font-bold text-white mb-1">AGENCY</div>
                        <div className="text-xs text-[#06b6d4] mb-1 font-semibold">Omnichannel Domination Suite</div>
                        <div className="text-3xl font-extrabold text-white mb-2">
                          {formatCurrency(convertCurrency(897, 'EUR', selectedCurrency), selectedCurrency)}
                        </div>
                        <div className="text-sm text-gray-400 font-light">/mese</div>
                        <div className="text-xs text-[#06b6d4] mt-1 font-semibold">+ Modulo Commerciale & Arbitraggio Esteso</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Annunci al mese", free: "5", starter: "50", pro: "200", agency: "Illimitati" },
                    { feature: "Generazione Annunci AI", free: "✓", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: "Stili AI (Luxury, Investment, Pro)", free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: "Multi-lingua (IT, EN, ES)", free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: "PDF Professionali", free: "—", starter: "✓", pro: "✓", agency: "✓" },
                    { feature: "CRM Completo", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Pipeline Kanban", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Lead Scoring AI Base", free: "—", starter: "✓", pro: "✓ Avanzato", agency: "✓ Avanzato" },
                    { feature: "Smart Briefing Multi-Categoria", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Virtual Staging 3D", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Follow-up AI Multi-canale", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Automazioni AI", free: "—", starter: "—", pro: "20", agency: "Illimitate" },
                    { feature: "Smart Lead Capture Forms", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "White-label PDF", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Agency Assistant AI", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Multi-utente", free: "—", starter: "—", pro: "—", agency: "Fino a 10 agenti" },
                    { feature: "Ruoli e Permessi", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Distribuzione Lead Automatica", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Report Attività Team", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Integrazione Multi-sede", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "🥽 Aura VR: Cinematic Virtual Tour Generation", free: "—", starter: "—", pro: <span className="text-gray-400">Visualizzatore</span>, agency: <span className="font-bold text-[#06b6d4]">✓ Illimitati</span> },
                    { feature: "AI Voice Calling (Bland AI)", free: "—", starter: "—", pro: "30/mese", agency: <span className="font-bold text-[#06b6d4]">✓ Illimitato</span> },
                    { feature: "AI Smart Messaging (SMS/WhatsApp AI)", free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ ESCLUSIVO</span> },
                    { feature: "Manual Override: Accesso diretto dati proprietario", free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ ESCLUSIVO</span> },
                    { feature: "Libertà d'intervento umano", free: "—", starter: "—", pro: "✓", agency: "✓" },
                    { feature: "Auto-Prospecting 24/7", free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ Attivo</span> },
                    { feature: "Scraping Intelligente", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Dashboard War Room", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Google Calendar Integration", free: "—", starter: "—", pro: "—", agency: <span className="font-bold text-[#06b6d4]">✓ ESCLUSIVO</span> },
                    { feature: "Notifiche Email Automatiche", free: "—", starter: "—", pro: "—", agency: "✓" },
                    { feature: "Supporto", free: "Community", starter: "Email", pro: "Prioritario", agency: "Dedicato 24/7" },
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
              <Button variant="outline" className="w-full border-white/20 text-white/90 hover:bg-white/5 backdrop-blur-md transition-all active:scale-95 hover:border-white/30">
                Inizia Gratis
              </Button>
            </Link>
            <Link href="/auth/signup?plan=starter" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                Scegli Starter
              </Button>
            </Link>
            <Link href="/auth/signup?plan=pro" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all active:scale-95">
                Scegli Pro
              </Button>
            </Link>
            <Link href="/auth/signup?plan=agency" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#06b6d4] to-[#06b6d4]/90 hover:from-[#06b6d4] hover:to-[#06b6d4] text-black font-bold border-0 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all active:scale-95">
                Scegli Agency
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#050505] to-[#080808]">
        <div className="container mx-auto max-w-4xl text-center fade-on-scroll">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl mb-4 text-white">
                Pronto a moltiplicare i tuoi affari?
              </CardTitle>
              <CardDescription className="text-xl text-gray-300">
                Unisciti a centinaia di agenti che già usano PropertyPilot AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-7 bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90 hover:from-[#9333ea] hover:to-[#9333ea] text-white border-0 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] transition-all active:scale-95"
                >
                  Get Started Gratis
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#050505] border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <PropertyPilotLogo className="h-6 w-6" />
                <span className="text-xl font-bold text-white">PropertyPilot AI</span>
              </div>
              <p className="text-gray-400 text-sm font-light">
                Il tuo Agente Immobiliare AI che lavora 24/7
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Prodotto</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/pricing" className="hover:text-[#9333ea] transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#9333ea] transition-colors">Dashboard</Link></li>
                <li><Link href="/features" className="hover:text-[#9333ea] transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Azienda</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/about" className="hover:text-purple-400 transition-colors">Chi Siamo</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contatti</Link></li>
                <li><Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Supporto</h3>
              <ul className="space-y-2 text-gray-400 text-sm font-light">
                <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-purple-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center">
            <p className="text-gray-400 text-sm font-light">
              &copy; {new Date().getFullYear()} PropertyPilot AI. Tutti i diritti riservati.
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
