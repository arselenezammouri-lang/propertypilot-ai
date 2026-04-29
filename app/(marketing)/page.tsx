"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Users,
  BarChart3,
  Zap,
  Globe,
  Star,
  Building2,
  Bot,
  Target,
  ChevronRight,
  Sparkles,
  Phone,
} from "lucide-react";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Data ─── */
const PLANS = [
  {
    name: "Starter", price: "197", period: "/mo",
    description: "AI listing tools for solo agents",
    features: ["50 AI listings/month", "AI Listing Engine (3 styles)", "Lead Score Base", "PDF exports", "Multi-language (6 langs)", "Email support"],
    cta: "Start with Starter", href: "/auth/signup?plan=starter", featured: false,
  },
  {
    name: "Pro", price: "497", period: "/mo",
    description: "CRM, voice AI & automations",
    features: ["200 AI listings/month", "Everything in Starter", "Full CRM + Pipeline", "AI Voice Calling (30/mo)", "Virtual Staging 3D", "Automations (20/mo)", "AI Follow-up emails", "Priority support"],
    cta: "Go Pro", href: "/auth/signup?plan=pro", featured: true,
  },
  {
    name: "Agency", price: "897", period: "/mo",
    description: "Unlimited power for your team",
    features: ["Unlimited AI listings", "Everything in Pro", "Unlimited Voice AI", "Team up to 10 agents", "Auto-Prospecting 24/7", "Calendar Sync", "API access", "Dedicated support"],
    cta: "Scale with Agency", href: "/auth/signup?plan=agency", featured: false,
  },
];

const FEATURES = [
  { icon: Sparkles, title: "AI Listing Engine", description: "Generate professional listings in 3 styles — Luxury, Investment, Standard — optimized for every portal. 30 seconds, not 2 hours." },
  { icon: Users, title: "Smart CRM", description: "Kanban pipeline with AI lead scoring. Every contact qualified automatically. Never miss a follow-up again." },
  { icon: Phone, title: "Voice AI Agent", description: "AI makes calls for you. Qualify leads, book viewings, follow up — 24/7, in any language. Your tireless assistant." },
  { icon: BarChart3, title: "Prospecting Engine", description: "Find price drops, expired listings, and hidden opportunities before your competitors. Real-time monitoring." },
  { icon: Globe, title: "6 Languages", description: "Professional AI translations. Italian, English, French, Spanish, German, Arabic. Not Google Translate." },
  { icon: Target, title: "Automations", description: "Set rules once, AI handles the rest. Auto-assign leads, send follow-ups, update statuses. Work smarter." },
];

const TESTIMONIALS = [
  { quote: "PropertyPilot cut my listing time from 2 hours to 5 minutes. I can focus on what matters — closing deals.", author: "Marco R.", role: "Agent, Milano" },
  { quote: "The AI Voice Agent is incredible. It books viewings while I sleep. My pipeline has never been this full.", author: "Sofia L.", role: "Agency Owner, Barcelona" },
  { quote: "We moved from 3 tools to just PropertyPilot. CRM, listings, prospecting — everything in one place.", author: "Pierre D.", role: "Team Lead, Paris" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans relative">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/30">
        <div className="pp-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-4 h-4 text-white" />
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
              <Button variant="ghost" size="sm" className="text-sm h-9 text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <button className="btn-primary-gradient text-sm h-9 px-5">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-36 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px]" />

        <div className="pp-container relative">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={stagger}>
            <motion.div custom={0} variants={fadeUp} className="pp-badge mb-8">
              <Zap className="w-3.5 h-3.5" />
              The AI operating system for real estate
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="pp-heading-xl mb-6">
              Close more deals with{" "}
              <span className="text-gradient">AI-powered</span>{" "}
              real estate tools
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Generate listings in seconds. Score leads automatically. Let AI handle calls and follow-ups.
              Used by <span className="text-foreground font-medium">500+ agencies</span> across Europe.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <button className="btn-primary-gradient h-12 px-8 text-base gap-2">
                  Start free trial <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/demo">
                <button className="btn-glass h-12 px-8 text-base text-muted-foreground hover:text-foreground gap-2">
                  See the demo <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            <motion.p custom={4} variants={fadeUp} className="text-xs text-muted-foreground mt-5">
              7-day free trial · No credit card required · Cancel anytime
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: "10+", label: "Hours saved per week" },
              { value: "3x", label: "Faster listing creation" },
              { value: "50%", label: "More leads contacted" },
              { value: "6", label: "Languages supported" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="pp-section relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="pp-badge mb-4"><Bot className="w-3.5 h-3.5" />Everything you need</div>
            <h2 className="pp-heading-lg mb-4">One platform. Every tool.</h2>
            <p className="text-lg text-muted-foreground">Stop juggling 5 different tools. PropertyPilot combines AI generation, CRM, prospecting, and automation.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="pp-feature-card hover-lift" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <div className="pp-feature-icon"><f.icon className="w-5 h-5" /></div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="pp-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-transparent" />
        <div className="pp-container relative">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-4">From signup to results in 2 minutes</h2>
            <p className="text-lg text-muted-foreground">No complex setup. No training needed. Just start generating.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Describe your property", desc: "Enter the basics — type, location, features, price. That's it." },
              { step: "02", title: "AI generates everything", desc: "Professional listing, SEO titles, social posts, translations — in seconds." },
              { step: "03", title: "Publish and track", desc: "Copy to any portal. Track leads. Let AI handle follow-ups." },
            ].map((item, i) => (
              <motion.div key={item.step} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-bold mx-auto mb-5 shadow-lg shadow-indigo-500/20">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="pp-section">
        <div className="pp-container">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-4">Trusted by agents across Europe</h2>
            <p className="text-lg text-muted-foreground">Real estate professionals love PropertyPilot.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.author} className="pp-glass-card p-6 flex flex-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm leading-relaxed flex-1 mb-4 text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div><div className="text-sm font-semibold">{t.author}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="pp-section relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pp-badge mb-4">Simple pricing</div>
            <h2 className="pp-heading-lg mb-4">Choose the plan that fits your agency</h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} className={`pp-pricing-card ${plan.featured ? "featured" : ""}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {plan.featured && <div className="pp-pricing-popular">Most Popular</div>}
                <div className="mb-6 pt-2">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold tracking-tight">€{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /><span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  {plan.featured ? (
                    <button className="btn-primary-gradient w-full h-11 text-sm gap-1">{plan.cta} <ChevronRight className="w-4 h-4" /></button>
                  ) : (
                    <button className="btn-glass w-full h-11 text-sm text-muted-foreground hover:text-foreground gap-1">{plan.cta} <ChevronRight className="w-4 h-4" /></button>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">All plans include 7-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* ─── EUROPE ─── */}
      <section className="pp-section">
        <div className="pp-container">
          <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-3">Built for European real estate</h2>
            <p className="text-muted-foreground mb-10">Optimized for every major European market&apos;s portals, languages, and regulations.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { flag: "🇮🇹", country: "Italy", portals: "Immobiliare.it" },
                { flag: "🇫🇷", country: "France", portals: "SeLoger" },
                { flag: "🇪🇸", country: "Spain", portals: "Idealista" },
                { flag: "🇩🇪", country: "Germany", portals: "ImmoScout24" },
                { flag: "🇬🇧", country: "UK", portals: "Rightmove" },
                { flag: "🇵🇹", country: "Portugal", portals: "Idealista PT" },
              ].map((item, i) => (
                <motion.div key={item.country} className="pp-glass-card p-4 text-center hover-lift" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <span className="text-3xl block mb-2">{item.flag}</span>
                  <p className="text-sm font-semibold">{item.country}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.portals}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="pp-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.04] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-4">Ready to transform your agency?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join 500+ agencies across Europe already using AI to close more deals, faster.</p>
            <Link href="/auth/signup">
              <button className="btn-primary-gradient h-13 px-10 text-base gap-2">
                Get started free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/30 py-12">
        <div className="pp-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">PropertyPilot AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 PropertyPilot AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
