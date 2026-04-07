"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  FileText,
  Users,
  BarChart3,
  Zap,
  Globe,
  Clock,
  Star,
  Building2,
  Bot,
  Target,
  ChevronRight,
} from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: "197",
    period: "/mo",
    description: "Save 10+ hours/week on listings and lead management",
    features: [
      "50 AI listings/month",
      "AI Listing Engine (3 styles)",
      "Lead Score Base",
      "PDF exports",
      "Multi-language (IT, EN, ES)",
      "Email support",
    ],
    cta: "Start with Starter",
    href: "/auth/signup?plan=starter",
    featured: false,
  },
  {
    name: "Pro",
    price: "497",
    period: "/mo",
    description: "Your complete AI office — listings, CRM, voice calling, automations",
    features: [
      "200 AI listings/month",
      "Everything in Starter",
      "Full CRM + Pipeline",
      "AI Follow-up emails",
      "Virtual Staging 3D",
      "AI Voice Calling (30/mo)",
      "Smart Lead Capture",
      "Automations (20/mo)",
      "Priority support",
    ],
    cta: "Go Pro",
    href: "/auth/signup?plan=pro",
    featured: true,
  },
  {
    name: "Agency",
    price: "897",
    period: "/mo",
    description: "Unlimited AI power for your entire team — the unfair advantage",
    features: [
      "Unlimited AI listings",
      "Everything in Pro",
      "Unlimited Voice AI calls",
      "AI Smart Messaging",
      "Team up to 10 agents",
      "Auto-Prospecting 24/7",
      "Calendar Sync",
      "Dedicated support",
    ],
    cta: "Scale with Agency",
    href: "/auth/signup?plan=agency",
    featured: false,
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "AI Listing Engine",
    description: "Generate professional property listings in seconds. 3 styles — Luxury, Investment, Standard — optimized for every portal.",
  },
  {
    icon: Users,
    title: "Smart CRM",
    description: "Track every lead from first contact to closing. Kanban pipeline, AI lead scoring, automated follow-ups.",
  },
  {
    icon: Bot,
    title: "AI Voice Agent",
    description: "Let AI make calls for you. Qualify leads, book viewings, follow up — 24/7, in any language.",
  },
  {
    icon: BarChart3,
    title: "Prospecting Engine",
    description: "Find price drops, expired listings, and hidden opportunities before your competitors do.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Work in Italian, English, French, Spanish, German, or Arabic. Your listings, your language.",
  },
  {
    icon: Target,
    title: "Automations",
    description: "Set rules once, let AI handle the rest. Auto-assign leads, send follow-ups, update statuses.",
  },
];

const STATS = [
  { value: "10+", label: "Hours saved per week" },
  { value: "3x", label: "Faster listing creation" },
  { value: "50%", label: "More leads contacted" },
  { value: "6", label: "Languages supported" },
];

const TESTIMONIALS = [
  {
    quote: "PropertyPilot cut my listing time from 2 hours to 5 minutes. I can focus on what matters — closing deals.",
    author: "Marco R.",
    role: "Agent, Milano",
    rating: 5,
  },
  {
    quote: "The AI Voice Agent is incredible. It books viewings while I sleep. My pipeline has never been this full.",
    author: "Sofia L.",
    role: "Agency Owner, Barcelona",
    rating: 5,
  },
  {
    quote: "We moved from 3 tools to just PropertyPilot. CRM, listings, prospecting — everything in one place.",
    author: "Pierre D.",
    role: "Team Lead, Paris",
    rating: 5,
  },
];

export default function LandingPage() {
  const { locale } = useLocaleContext();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="pp-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm h-9">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot opacity-50" />
        <div className="pp-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="pp-badge mb-6 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              AI-powered real estate platform
            </div>
            <h1 className="pp-heading-xl mb-6 animate-fade-in-up">
              The operating system for{" "}
              <span className="text-gradient-blue">modern real estate</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
              Generate listings in seconds. Manage leads intelligently. Close more deals. Used by 500+ agencies across Italy, France, and Spain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-sm">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up delay-300">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="pp-section border-t border-border/40">
        <div className="pp-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="pp-badge mb-4">
              <Bot className="w-3.5 h-3.5" />
              Everything you need
            </div>
            <h2 className="pp-heading-lg mb-4">
              One platform. Every tool.
            </h2>
            <p className="text-lg text-muted-foreground">
              Stop juggling 5 different tools. PropertyPilot combines AI content generation,
              CRM, prospecting, and automation in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="pp-feature-card hover-lift">
                <div className="pp-feature-icon">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="pp-section bg-muted/30 border-y border-border/40">
        <div className="pp-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="pp-heading-lg mb-4">From signup to results in 2 minutes</h2>
            <p className="text-lg text-muted-foreground">
              No complex setup. No training needed. Just start generating.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Describe your property", desc: "Enter the basics — type, location, features, price. That's it." },
              { step: "02", title: "AI generates everything", desc: "Professional listing, SEO titles, social posts, translations — all in seconds." },
              { step: "03", title: "Publish and track", desc: "Copy to any portal. Track leads. Let AI handle follow-ups." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="pp-section">
        <div className="pp-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="pp-heading-lg mb-4">Trusted by agents across Europe</h2>
            <p className="text-lg text-muted-foreground">
              Real estate professionals love PropertyPilot.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="pp-card p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-semibold">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="pp-section bg-muted/30 border-y border-border/40">
        <div className="pp-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="pp-badge mb-4">Simple pricing</div>
            <h2 className="pp-heading-lg mb-4">
              Choose the plan that fits your agency
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`pp-pricing-card ${plan.featured ? "featured" : ""}`}
              >
                {plan.featured && (
                  <div className="pp-pricing-popular">Most Popular</div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold tracking-tight">€{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full h-11 rounded-lg text-sm font-medium ${
                      plan.featured
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-transparent text-foreground border border-border hover:bg-accent"
                    }`}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include a 7-day free trial. No credit card required. The average agent saves 40+ hours/month — that’s €2,000+ in time value alone.
          </p>
        </div>
      </section>

      {/* ─── EUROPEAN COVERAGE ─── */}
      <section className="pp-section bg-muted/30">
        <div className="pp-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="pp-heading-lg mb-3">
              Built for European real estate
            </h2>
            <p className="text-muted-foreground mb-10">
              Optimized for the portals, languages, and regulations of every major European market.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { flag: "🇮🇹", country: "Italy", portals: "Immobiliare.it, Casa.it" },
                { flag: "🇫🇷", country: "France", portals: "SeLoger, LeBonCoin" },
                { flag: "🇪🇸", country: "Spain", portals: "Idealista, Fotocasa" },
                { flag: "🇩🇪", country: "Germany", portals: "ImmoScout24" },
                { flag: "🇬🇧", country: "UK", portals: "Rightmove, Zoopla" },
                { flag: "🇵🇹", country: "Portugal", portals: "Idealista PT" },
              ].map((item) => (
                <div key={item.country} className="pp-card p-4 text-center hover-lift">
                  <span className="text-3xl block mb-2">{item.flag}</span>
                  <p className="text-sm font-semibold">{item.country}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.portals}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              6 languages: Italian, English, French, Spanish, German, Arabic — professional AI translations, not Google Translate.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="pp-section">
        <div className="pp-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="pp-heading-lg mb-4">
              Ready to transform your agency?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join 500+ agencies across Europe already using AI to close more deals, faster. Start your free trial today.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 py-12">
        <div className="pp-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="text-sm font-semibold">PropertyPilot AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PropertyPilot AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
