"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Sparkles, 
  Globe, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  Star,
  Rocket,
  Crown,
  Building2,
  Calendar,
  MessageCircle,
  Mail,
  Smartphone,
  BarChart3,
  Target,
  Workflow,
  Languages,
  MapPin,
  Play,
  Check,
  ChevronRight,
  Shield,
  Award
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AgencyLogos = () => {
  const logos = [
    { name: "Keller Williams", svg: (
      <svg viewBox="0 0 120 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <text x="0" y="22" fontSize="16" fontWeight="bold" fontFamily="sans-serif">KW</text>
        <rect x="30" y="5" width="2" height="20" />
        <text x="38" y="22" fontSize="12" fontFamily="sans-serif">KELLER WILLIAMS</text>
      </svg>
    )},
    { name: "RE/MAX", svg: (
      <svg viewBox="0 0 100 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <text x="0" y="22" fontSize="18" fontWeight="bold" fontFamily="sans-serif">RE/MAX</text>
      </svg>
    )},
    { name: "Century 21", svg: (
      <svg viewBox="0 0 100 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <text x="0" y="22" fontSize="14" fontWeight="bold" fontFamily="sans-serif">CENTURY 21</text>
      </svg>
    )},
    { name: "Coldwell Banker", svg: (
      <svg viewBox="0 0 130 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <text x="0" y="22" fontSize="13" fontWeight="bold" fontFamily="sans-serif">COLDWELL BANKER</text>
      </svg>
    )},
    { name: "eXp Realty", svg: (
      <svg viewBox="0 0 100 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <text x="0" y="22" fontSize="16" fontWeight="bold" fontFamily="sans-serif">eXp</text>
        <text x="35" y="22" fontSize="12" fontFamily="sans-serif">REALTY</text>
      </svg>
    )},
    { name: "Immobiliare.it", svg: (
      <svg viewBox="0 0 120 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <rect x="0" y="5" width="20" height="20" rx="3" />
        <text x="25" y="22" fontSize="12" fontFamily="sans-serif">immobiliare.it</text>
      </svg>
    )},
    { name: "Idealista", svg: (
      <svg viewBox="0 0 90 30" className="h-6 md:h-8 w-auto opacity-40 hover:opacity-70 transition-opacity" fill="currentColor">
        <circle cx="10" cy="15" r="8" />
        <text x="22" y="22" fontSize="14" fontFamily="sans-serif">idealista</text>
      </svg>
    )}
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
      {logos.map((logo, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-muted-foreground"
          data-testid={`logo-${logo.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
        >
          {logo.svg}
        </motion.div>
      ))}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER - Glassmorphism Premium */}
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <img src="/logo.png" alt="PropertyPilot AI" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Link href="/demo">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-sunset-gold transition-colors" data-testid="button-demo">
                  Demo
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-royal-purple transition-colors" data-testid="button-pricing">
                  Pricing
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-royal-purple transition-colors" data-testid="button-login">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="neon-button" data-testid="button-signup">
                  Start Free
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO - USA + Global Focus with Enhanced Animations */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--royal-purple)/0.15),transparent_50%)] animate-pulse-glow" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM2RTNBRkYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 ai-badge mb-6"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-sm font-bold">Built for Real Estate • Powered by GPT-4</span>
              </motion.div>
              
              {/* Main Headline - LARGER with animated gradient */}
              <motion.h1 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight" 
                data-testid="text-hero-title"
              >
                <span className="inline-block bg-gradient-to-r from-royal-purple via-electric-blue to-neon-aqua bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  The AI Operating System
                </span>
                <br />
                <span className="text-foreground">for Real Estate Agencies</span>
              </motion.h1>
              
              {/* Sub-headline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed" 
                data-testid="text-hero-subtitle"
              >
                Close more deals, write better listings, and automate follow-ups.
                <br className="hidden sm:inline" />
                <span className="text-electric-blue font-semibold">Built for agents and teams in the US, Europe, and beyond.</span>
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/auth/signup">
                  <Button size="lg" className="neon-button text-lg px-10 py-7 w-full sm:w-auto group shadow-lg shadow-royal-purple/25" data-testid="button-cta-signup">
                    Start Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-7 w-full sm:w-auto border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all group" 
                    data-testid="button-book-demo"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book a Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Language note */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-muted-foreground mt-6"
              >
                <Globe className="inline h-4 w-4 mr-1" />
                Also available in Italian and 12+ languages for your listings.
              </motion.p>
            </div>

            {/* Right: Dashboard Preview with ENHANCED GLOW */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Enhanced multi-layer glow effect */}
                <div className="absolute -inset-8 bg-gradient-to-r from-royal-purple/30 via-electric-blue/30 to-neon-aqua/30 rounded-3xl blur-3xl animate-pulse-glow" />
                <div className="absolute -inset-4 bg-gradient-to-r from-royal-purple/20 via-electric-blue/20 to-neon-aqua/20 rounded-3xl blur-2xl" />
                
                {/* Glass card with dashboard mockup */}
                <div className="relative glass rounded-2xl p-6 border border-silver-frost/30 shadow-2xl">
                  <div className="bg-background/80 rounded-xl p-4 space-y-4">
                    {/* Mock dashboard header */}
                    <div className="flex items-center justify-between border-b border-silver-frost/20 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs text-muted-foreground">PropertyPilot AI Dashboard</span>
                    </div>
                    
                    {/* Mock stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-royal-purple/20 to-transparent rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-royal-purple">247</p>
                        <p className="text-xs text-muted-foreground">Leads</p>
                      </div>
                      <div className="bg-gradient-to-br from-neon-aqua/20 to-transparent rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-neon-aqua">89</p>
                        <p className="text-xs text-muted-foreground">Listings</p>
                      </div>
                      <div className="bg-gradient-to-br from-sunset-gold/20 to-transparent rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-sunset-gold">$2.4M</p>
                        <p className="text-xs text-muted-foreground">Pipeline</p>
                      </div>
                    </div>

                    {/* Mock AI generation */}
                    <div className="bg-gradient-to-r from-electric-blue/10 to-royal-purple/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-electric-blue" />
                        <span className="text-sm font-medium">AI Listing Generator</span>
                      </div>
                      <div className="h-2 bg-silver-frost/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-electric-blue to-royal-purple rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2 group">
              <CheckCircle className="h-5 w-5 text-neon-aqua" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <CheckCircle className="h-5 w-5 text-neon-aqua" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <Star className="h-5 w-5 text-sunset-gold fill-sunset-gold" />
              <span>Premium AI Technology</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF STRIP with SVG Logos */}
      <section className="py-12 border-y border-silver-frost/20 bg-luxury-indigo/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider"
          >
            Trusted by agents and agencies in 12+ countries
          </motion.p>
          <AgencyLogos />
        </div>
      </section>

      {/* SECTION 3: WHY PROPERTYPILOT AI - 3 PILLARS with Enhanced Design */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Why <span className="gradient-text-purple">PropertyPilot AI</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three powerful engines to transform your real estate business
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 md:gap-10"
          >
            {/* Pillar 1: AI Listing Engine */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="card-pillar-listing"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-transparent to-royal-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-8 h-full hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/30 to-royal-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow-aqua">
                  <FileText className="h-8 w-8 text-electric-blue" />
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-purple">AI Listing Engine</h3>
                <p className="text-muted-foreground mb-6">
                  Write perfect MLS & Zillow-ready listings in seconds. Titles, descriptions, hashtags, video scripts, and luxury PDF brochures.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>A/B tested titles for high CTR</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>SEO-optimized descriptions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>Professional PDF brochures</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Pillar 2: CRM & Automation Engine */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="card-pillar-crm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/10 via-transparent to-sunset-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-8 h-full hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-purple/30 to-sunset-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow-purple">
                  <Workflow className="h-8 w-8 text-royal-purple" />
                </div>
                <h3 className="text-2xl font-bold mb-4 gradient-text-gold">CRM & Automation</h3>
                <p className="text-muted-foreground mb-6">
                  Visual pipelines, lead scoring, automated follow-ups via email, SMS, and WhatsApp.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>Kanban lead pipeline</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>AI-powered lead scoring</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>Multi-channel automation</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Pillar 3: Global & Multi-Language */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="card-pillar-global"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-aqua/10 via-transparent to-electric-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-8 h-full hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-aqua/30 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow-aqua">
                  <Globe className="h-8 w-8 text-neon-aqua" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neon-aqua">Global & Multi-Language</h3>
                <p className="text-muted-foreground mb-6">
                  Listings and marketing content in 12+ languages. Perfect for cross-border clients, expats, and international investors.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>12+ languages supported</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>International portal formats</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-neon-aqua flex-shrink-0" />
                    <span>Cross-border ready</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: FEATURE DEEP DIVE with Alternating Backgrounds & Animations */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Everything You Need to <span className="gradient-text-purple">Close More Deals</span>
            </h2>
          </motion.div>

          {/* Feature 4.1: Listing Suite Pro - Dark stripe */}
          <div className="relative py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5 rounded-3xl mb-8" data-testid="feature-listing-suite">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 ai-badge mb-4">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-semibold">Listing Suite Pro</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Create <span className="gradient-text-purple">Perfect Listings</span> in Seconds
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">AI titles A/B tested for high CTR</p>
                      <p className="text-sm text-muted-foreground">Get 5 headline variations optimized for clicks</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">Descriptions optimized for MLS & portals</p>
                      <p className="text-sm text-muted-foreground">Zillow, Immobiliare.it, Idealista, Casa.it & more</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">Luxury PDF brochures included</p>
                      <p className="text-sm text-muted-foreground">White-label templates with your branding</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-1 lg:order-2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-electric-blue/10 to-royal-purple/10 rounded-3xl blur-xl" />
                  <div className="relative glass rounded-2xl p-6 border border-silver-frost/30 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-silver-frost/20">
                        <Sparkles className="h-5 w-5 text-electric-blue" />
                        <span className="font-medium">AI Listing Generator</span>
                      </div>
                      <div className="bg-background/60 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">Generated Title:</p>
                        <p className="font-medium text-electric-blue">&quot;Stunning 4BR Modern Home with Pool & City Views&quot;</p>
                      </div>
                      <div className="bg-background/60 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">SEO Description:</p>
                        <p className="text-sm">Welcome to this breathtaking 4-bedroom residence featuring contemporary design, floor-to-ceiling windows...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature 4.2: CRM & Pipeline - Light stripe */}
          <div className="relative py-16 mb-8" data-testid="feature-crm-pipeline">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-royal-purple/10 to-sunset-gold/10 rounded-3xl blur-xl" />
                  <div className="relative glass rounded-2xl p-6 border border-silver-frost/30 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-silver-frost/20">
                        <BarChart3 className="h-5 w-5 text-royal-purple" />
                        <span className="font-medium">Lead Pipeline</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {["New", "Contacted", "Follow-Up", "Closed"].map((stage, i) => (
                          <div key={stage} className="flex-shrink-0 w-28 bg-background/60 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-2">{stage}</p>
                            <div className={`h-2 rounded-full ${i === 3 ? 'bg-neon-aqua' : 'bg-silver-frost/30'}`} />
                            <p className="text-lg font-bold mt-2">{[12, 8, 5, 24][i]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 ai-badge mb-4">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-semibold">CRM & Pipeline</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  <span className="gradient-text-gold">Manage Every Lead</span> with Precision
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sunset-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-sunset-gold" />
                    </div>
                    <div>
                      <p className="font-medium">Kanban pipeline for visual tracking</p>
                      <p className="text-sm text-muted-foreground">New / Contacted / Follow-Up / Closed / Lost</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sunset-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-sunset-gold" />
                    </div>
                    <div>
                      <p className="font-medium">Lead notes, history, and AI scoring</p>
                      <p className="text-sm text-muted-foreground">Hot / Warm / Cold classification with 0-100 score</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sunset-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-sunset-gold" />
                    </div>
                    <div>
                      <p className="font-medium">Smart automations that work 24/7</p>
                      <p className="text-sm text-muted-foreground">Auto-assign, status changes, follow-up triggers</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Feature 4.3: Communication Hub - Dark stripe */}
          <div className="relative py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5 rounded-3xl" data-testid="feature-communication-hub">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 ai-badge mb-4">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Communication Hub</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  All Your <span className="text-neon-aqua">Messages in One Place</span>
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">Email, SMS, WhatsApp from one place</p>
                      <p className="text-sm text-muted-foreground">Unified inbox for all lead communications</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">AI-generated scripts with tone selection</p>
                      <p className="text-sm text-muted-foreground">Professional, luxury, emotional, urgent</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-aqua/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-neon-aqua" />
                    </div>
                    <div>
                      <p className="font-medium">Full message history per lead</p>
                      <p className="text-sm text-muted-foreground">Never lose context on any conversation</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-1 lg:order-2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-neon-aqua/10 to-electric-blue/10 rounded-3xl blur-xl" />
                  <div className="relative glass rounded-2xl p-6 border border-silver-frost/30 shadow-xl">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-silver-frost/20">
                        <MessageCircle className="h-5 w-5 text-neon-aqua" />
                        <span className="font-medium">Message Center</span>
                      </div>
                      <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
                        <Mail className="h-5 w-5 text-electric-blue" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Email sent to John D.</p>
                          <p className="text-xs text-muted-foreground">2 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
                        <SiWhatsapp className="h-5 w-5 text-green-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">WhatsApp to Maria S.</p>
                          <p className="text-xs text-muted-foreground">15 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
                        <Smartphone className="h-5 w-5 text-royal-purple" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">SMS reminder to Team</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BUILT FOR AGENTS & TEAMS */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: For Everyone */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              data-testid="section-solo-agents"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                For solo agents, small teams, and <span className="gradient-text-purple">growing agencies</span>
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-royal-purple/10 flex items-center justify-center flex-shrink-0">
                    <Rocket className="h-6 w-6 text-electric-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Solo Agents</p>
                    <p className="text-muted-foreground">Get a personal AI assistant for every listing. Work faster, close more.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-purple/20 to-sunset-gold/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-royal-purple" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Teams</p>
                    <p className="text-muted-foreground">Share leads, notes, and automations in one workspace. Stay aligned.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunset-gold/20 to-neon-aqua/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-sunset-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Agencies</p>
                    <p className="text-muted-foreground">Manage up to 10+ agents with roles, reporting, and lead distribution.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Right: Enterprise Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative" 
              data-testid="card-enterprise"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-royal-purple/20 to-sunset-gold/20 rounded-3xl blur-xl" />
              <div className="relative futuristic-card p-8 border-2 border-royal-purple/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-royal-purple/20 rounded-full mb-6">
                  <Building2 className="h-4 w-4 text-royal-purple" />
                  <span className="text-sm font-semibold text-royal-purple">For Teams & Brokerages</span>
                </div>
                <h3 className="text-2xl font-bold mb-6">Agency Features</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-neon-aqua" />
                    <span>Lead routing and assignment rules</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-neon-aqua" />
                    <span>Multi-agent activity reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-neon-aqua" />
                    <span>White-label PDFs and branding</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-neon-aqua" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/demo">
                  <Button className="w-full neon-button py-6 text-lg group" data-testid="button-agency-demo">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book an Agency Demo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: GLOBAL MAP / INTERNATIONAL with World Map Background */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* World map silhouette background */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="500" cy="250" rx="450" ry="200" fill="url(#worldGlow)" />
            <defs>
              <radialGradient id="worldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--royal-purple))" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              From Milan to Miami: <span className="gradient-text-purple">One Platform</span> for Global Real Estate
            </h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              PropertyPilot AI is already used by agents in multiple countries. We&apos;re ready for your market.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" 
            data-testid="section-global-markets"
          >
            <motion.div variants={fadeInUp} className="futuristic-card p-6 text-center hover-lift">
              <div className="text-5xl mb-4">🇺🇸</div>
              <h3 className="font-bold text-lg mb-2">US & Canada</h3>
              <p className="text-sm text-muted-foreground">MLS & Zillow-style listings</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="futuristic-card p-6 text-center hover-lift">
              <div className="text-5xl mb-4">🇮🇹</div>
              <h3 className="font-bold text-lg mb-2">Italy</h3>
              <p className="text-sm text-muted-foreground">Immobiliare.it, Casa.it, Idealista</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="futuristic-card p-6 text-center hover-lift">
              <div className="text-5xl mb-4">🇪🇸 🇵🇹</div>
              <h3 className="font-bold text-lg mb-2">Spain & Portugal</h3>
              <p className="text-sm text-muted-foreground">International buyers & investors</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="futuristic-card p-6 text-center hover-lift">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-bold text-lg mb-2">Dubai, France, UK, LATAM</h3>
              <p className="text-sm text-muted-foreground">12+ languages for your listings</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: PRICING PREVIEW with Enhanced UI */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5" id="pricing-preview">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Simple, <span className="gradient-text-purple">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your business
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Starter */}
            <motion.div 
              variants={fadeInUp}
              className="futuristic-card p-6 hover-lift border border-silver-frost/30" 
              data-testid="card-pricing-starter"
            >
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-5 w-5 text-electric-blue" />
                <h3 className="font-bold text-lg">Starter</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">€97</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">AI listing tools for solo agents</p>
              <Link href="/auth/signup">
                <Button className="w-full py-5" variant="outline" data-testid="button-starter-signup">
                  Start Free
                </Button>
              </Link>
            </motion.div>

            {/* Pro - Recommended with MOST POPULAR badge */}
            <motion.div 
              variants={fadeInUp}
              className="futuristic-card p-6 border-2 border-sunset-gold/50 hover-lift relative bg-gradient-to-b from-sunset-gold/5 to-transparent" 
              data-testid="card-pricing-pro"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-sunset-gold to-royal-purple text-white text-xs font-bold rounded-full shadow-lg shadow-sunset-gold/25 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" />
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4 mt-2">
                <Crown className="h-5 w-5 text-sunset-gold" />
                <h3 className="font-bold text-lg">Pro</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">€297</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">CRM, automations & AI tools</p>
              <Link href="/pricing#pro">
                <Button className="w-full neon-button py-5" data-testid="button-pro-details">
                  See Pro Details
                </Button>
              </Link>
            </motion.div>

            {/* Agency */}
            <motion.div 
              variants={fadeInUp}
              className="futuristic-card p-6 hover-lift border border-silver-frost/30" 
              data-testid="card-pricing-agency"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-royal-purple" />
                <h3 className="font-bold text-lg">Agency</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">€497</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">For teams up to 10 agents</p>
              <Link href="/demo">
                <Button className="w-full py-5" variant="outline" data-testid="button-agency-demo-pricing">
                  Book Demo
                </Button>
              </Link>
            </motion.div>

            {/* Agency Boost */}
            <motion.div 
              variants={fadeInUp}
              className="futuristic-card p-6 hover-lift bg-gradient-to-br from-sunset-gold/10 to-transparent border border-sunset-gold/20" 
              data-testid="card-pricing-boost"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-sunset-gold" />
                <h3 className="font-bold text-lg">Agency Boost</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">€2,497</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Done-for-you setup package</p>
              <Link href="/demo">
                <Button className="w-full bg-gradient-to-r from-sunset-gold to-royal-purple text-white hover:opacity-90 py-5" data-testid="button-boost-details">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/pricing">
              <Button variant="link" className="text-royal-purple hover:text-electric-blue" data-testid="link-full-pricing">
                View full pricing details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: HOW IT WORKS */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Get Started in <span className="gradient-text-purple">3 Simple Steps</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center" data-testid="step-1">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-electric-blue/30 to-royal-purple/20 flex items-center justify-center shadow-glow-aqua">
                <span className="text-2xl font-bold text-electric-blue">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
              <p className="text-muted-foreground">Start free, no credit card required</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center" data-testid="step-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-purple/30 to-sunset-gold/20 flex items-center justify-center shadow-glow-purple">
                <span className="text-2xl font-bold text-royal-purple">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Your Leads & Listings</h3>
              <p className="text-muted-foreground">Import or paste your existing content</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center" data-testid="step-3">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-sunset-gold/30 to-neon-aqua/20 flex items-center justify-center shadow-glow-gold">
                <span className="text-2xl font-bold text-sunset-gold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Let AI Do the Heavy Lifting</h3>
              <p className="text-muted-foreground">Listings, follow-ups, and CRM in one place</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="neon-button text-lg px-8 py-6 group" data-testid="button-start-2-min">
                Start Free in 2 Minutes
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: TESTIMONIALS with Enhanced Design + 4th Testimonial */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Loved by Agents <span className="gradient-text-purple">Worldwide</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* US Testimonial */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="testimonial-us"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-royal-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-6 h-full rounded-2xl border border-silver-frost/30">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-sunset-gold fill-sunset-gold" />
                  ))}
                </div>
                <p className="text-base mb-6 leading-relaxed">
                  &quot;PropertyPilot AI transformed how I write listings. I save hours every week and my clients love the professional descriptions.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue/30 to-royal-purple/20 flex items-center justify-center">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Sarah M.</p>
                    <p className="text-xs text-muted-foreground">Realtor, Miami FL</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Italian Testimonial */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="testimonial-it"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/10 to-sunset-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-6 h-full rounded-2xl border border-silver-frost/30">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-sunset-gold fill-sunset-gold" />
                  ))}
                </div>
                <p className="text-base mb-6 leading-relaxed">
                  &quot;Finalmente un tool che capisce il mercato italiano! I titoli e le descrizioni sono perfetti per Immobiliare.it e Idealista.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-purple/30 to-sunset-gold/20 flex items-center justify-center">
                    <span className="text-lg">🇮🇹</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Marco R.</p>
                    <p className="text-xs text-muted-foreground">Agente, Milano</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Spanish Testimonial */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="testimonial-es"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-aqua/10 to-electric-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-6 h-full rounded-2xl border border-silver-frost/30">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-sunset-gold fill-sunset-gold" />
                  ))}
                </div>
                <p className="text-base mb-6 leading-relaxed">
                  &quot;The multi-language feature is incredible. I work with international buyers and PropertyPilot AI makes it seamless.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-aqua/30 to-electric-blue/20 flex items-center justify-center">
                    <span className="text-lg">🇪🇸</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Elena G.</p>
                    <p className="text-xs text-muted-foreground">Agent, Barcelona</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4th Testimonial - US Agent */}
            <motion.div 
              variants={fadeInUp}
              className="relative group" 
              data-testid="testimonial-us-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sunset-gold/10 to-royal-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative futuristic-card p-6 h-full rounded-2xl border border-silver-frost/30">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-sunset-gold fill-sunset-gold" />
                  ))}
                </div>
                <p className="text-base mb-6 leading-relaxed">
                  &quot;The CRM pipeline changed how I manage leads. AI scoring tells me exactly who to call first. My close rate went up 30%.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset-gold/30 to-royal-purple/20 flex items-center justify-center">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">James T.</p>
                    <p className="text-xs text-muted-foreground">Broker, Austin TX</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA with Enhanced Design & Trust Badges */}
      <section className="relative py-28 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-royal-purple/5 to-background" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--royal-purple)/0.2),transparent_60%)]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Ready to upgrade your real estate business with <span className="gradient-text-purple">AI</span>?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of agents already using PropertyPilot AI to close more deals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-royal-purple via-electric-blue to-neon-aqua text-white shadow-xl shadow-royal-purple/30 hover:shadow-royal-purple/50 hover:scale-105 transition-all duration-300 group" data-testid="button-final-cta">
                Start Free Now
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10" data-testid="button-final-demo">
                <Play className="mr-2 h-5 w-5" />
                See a Demo
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-neon-aqua" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-neon-aqua" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-sunset-gold" />
              <span>Trusted by agents in 12+ countries</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-silver-frost/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/logo.png" alt="PropertyPilot AI" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold gradient-text-purple">PropertyPilot AI</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                The AI-powered operating system for real estate agencies. Write better listings, manage leads, and close more deals.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors" data-testid="footer-link-pricing">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="footer-link-demo">Demo</Link></li>
                <li><Link href="/#features" className="hover:text-foreground transition-colors" data-testid="footer-link-features">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Get Started</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/auth/signup" className="hover:text-foreground transition-colors" data-testid="footer-link-signup">Sign Up</Link></li>
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors" data-testid="footer-link-login">Login</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-silver-frost/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PropertyPilot AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with AI in the USA & Europe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
