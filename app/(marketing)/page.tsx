"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe,
  Star,
  Sparkles,
  Phone,
  Shield,
  FileSearch,
  ImagePlus,
  Zap,
  MessageCircle,
  BarChart3,
  Store,
  TrendingUp,
  Plug,
  Smartphone,
  LineChart,
  Building2,
  Bot,
  Target,
  ChevronRight,
  Users,
} from "lucide-react";

/* ─── Animation Variants (original) ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ─── Updated Feature Data (P1-P16) ─── */
const FEATURES = [
  { icon: Sparkles, title: "AI Listing Engine", description: "Generate professional listings in 3 styles × 6 languages. Portal-optimized for Idealista, ImmoScout24, Rightmove." },
  { icon: Users, title: "Smart CRM + Lead Scoring", description: "Kanban pipeline with behavioral + engagement scoring. Speed-to-lead: auto-call 30s, WhatsApp 60s, email 90s." },
  { icon: Phone, title: "Voice AI Agent", description: "Multilingual voice calls 24/7. Inbound/outbound qualification, viewing booking, CRM sync. 6 languages." },
  { icon: ImagePlus, title: "Visual AI Suite", description: "Virtual staging (6 styles), photo enhancement (HDR, twilight), sky replacement, floor plan generation." },
  { icon: Shield, title: "Compliance Shield", description: "Pre-publish compliance for 6 EU countries. Energy class, surface rules, agency licence — block before fines." },
  { icon: FileSearch, title: "Document Intelligence", description: "Extract data from mandates, energy certs, deeds with AI. Click-to-cite sources. Save 10+ hours/week." },
  { icon: MessageCircle, title: "WhatsApp AI Agent", description: "AI-powered conversations, listing carousels, viewing booking. 24/7 multilingual auto-responses." },
  { icon: BarChart3, title: "CMA Valuations", description: "Automated property valuations with comparables, market trends, and AI citations. Branded PDF reports." },
  { icon: Globe, title: "16 Portal Integrations", description: "Publish to Immobiliare.it, Idealista, ImmoScout24, Rightmove, SeLoger, Zoopla, Fotocasa + 9 more." },
  { icon: Store, title: "Cross-Border Marketplace", description: "Match buyers across 6 EU countries. AI translation, commission escrow, international deals." },
  { icon: TrendingUp, title: "Predictive Seller Leads", description: "AI identifies homeowners likely to list. Behavioral signals, life events, market data." },
  { icon: Target, title: "Speed-to-Lead Automations", description: "Set rules once, AI handles the rest. Auto-call hot leads, nurture warm ones, re-engage cold." },
];

/* ─── Updated Plans (P1-P16 features) ─── */
const PLANS = [
  {
    name: "Starter", price: "197", period: "/mo",
    description: "AI listing tools for solo agents",
    features: ["50 AI listings/month", "20 Visual AI jobs", "Compliance Shield (6 countries)", "Document Intelligence", "10 CMA Reports", "Portal connections", "Weekly market reports", "Email support"],
    cta: "Start with Starter", href: "/auth/signup?plan=starter", featured: false,
  },
  {
    name: "Pro", price: "497", period: "/mo",
    description: "CRM, voice AI & automations",
    features: ["200 listings + full CRM", "Speed-to-Lead automation", "100 Visual AI jobs", "Voice AI (300 min/mo)", "WhatsApp AI (2K conv/mo)", "Predictive Seller Leads", "Marketplace access", "20 automations", "Priority support"],
    cta: "Go Pro", href: "/auth/signup?plan=pro", featured: true,
  },
  {
    name: "Agency", price: "897", period: "/mo",
    description: "Unlimited power for your team",
    features: ["Unlimited + 10 agents", "White-label client portal", "500 Visual AI jobs", "Voice AI (1,500 min) + cloning", "MCP Server + API access", "Custom domain", "Cross-border marketplace", "Dedicated CSM"],
    cta: "Scale with Agency", href: "/auth/signup?plan=agency", featured: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans relative">
      {/* ─── NAV (original design) ─── */}
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
            <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
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

      {/* ─── HERO (original design, updated copy) ─── */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-36 relative overflow-hidden">
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
              Built for agencies across Italy, France, Spain, Germany, UK and Portugal.
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

          {/* Updated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: "47+", label: "AI-powered tools" },
              { value: "16", label: "Portal integrations" },
              { value: "6", label: "EU countries" },
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

      {/* ─── FEATURES (12 cards — all P1-P16) ─── */}
      <section id="features" className="pp-section relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="pp-badge mb-4"><Bot className="w-3.5 h-3.5" />Everything you need</div>
            <h2 className="pp-heading-lg mb-4">One platform. Every tool.</h2>
            <p className="text-lg text-muted-foreground">12 AI-powered modules built for the European real estate market. No other platform covers this much ground.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="pp-feature-card hover-lift" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                <div className="pp-feature-icon"><f.icon className="w-5 h-5" /></div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MCP INTEGRATION (new section, old design language) ─── */}
      <section className="pp-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-transparent" />
        <div className="pp-container relative">
          <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pp-badge mb-4"><Plug className="w-3.5 h-3.5" />AI Agent Ready</div>
            <h2 className="pp-heading-lg mb-4">Connect your AI assistant to your CRM</h2>
            <p className="text-lg text-muted-foreground mb-8">
              First European real estate platform with MCP integration. Ask Claude, Cursor, or ChatGPT to query your leads, draft listings, or schedule viewings — directly from your data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Claude Desktop", "Cursor", "Windsurf", "ChatGPT", "Custom AI"].map((c) => (
                <span key={c} className="pp-glass-card px-4 py-2 text-sm">{c}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ADDITIONAL CAPABILITIES (new) ─── */}
      <section className="pp-section">
        <div className="pp-container">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <motion.div className="pp-glass-card p-6 text-center hover-lift" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
              <Smartphone className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Mobile App</h3>
              <p className="text-sm text-muted-foreground">Property capture, CRM, voice memos. iOS + Android via Expo.</p>
            </motion.div>
            <motion.div className="pp-glass-card p-6 text-center hover-lift" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <LineChart className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Weekly Market Reports</h3>
              <p className="text-sm text-muted-foreground">Auto-generated from Idealista, ImmoScout24, Rightmove indices.</p>
            </motion.div>
            <motion.div className="pp-glass-card p-6 text-center hover-lift" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}>
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">GDPR Native</h3>
              <p className="text-sm text-muted-foreground">Consent tracking, DSAR automation, per-country DPA compliance.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PRICING (original card design, updated features) ─── */}
      <section id="pricing" className="pp-section relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pp-badge mb-4"><Star className="w-3.5 h-3.5" />Simple pricing</div>
            <h2 className="pp-heading-lg mb-4">Plans that grow with you</h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you&apos;re ready. No surprises.</p>
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

      {/* ─── EUROPE (original design, updated portals) ─── */}
      <section className="pp-section">
        <div className="pp-container">
          <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-3">Built for European real estate</h2>
            <p className="text-muted-foreground mb-10">Optimized for every major European market&apos;s portals, languages, and regulations.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { flag: "🇮🇹", country: "Italy", portals: "Immobiliare · Casa.it · Idealista" },
                { flag: "🇫🇷", country: "France", portals: "SeLoger · LeBonCoin · Bien'ici" },
                { flag: "🇪🇸", country: "Spain", portals: "Idealista · Fotocasa" },
                { flag: "🇩🇪", country: "Germany", portals: "ImmoScout24 · Immowelt" },
                { flag: "🇬🇧", country: "UK", portals: "Rightmove · Zoopla · OTM" },
                { flag: "🇵🇹", country: "Portugal", portals: "Idealista PT · Imovirtual" },
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

      {/* ─── FINAL CTA (original design) ─── */}
      <section className="pp-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.04] to-transparent" />
        <div className="pp-container relative">
          <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="pp-heading-lg mb-4">Ready to transform your agency?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join the AI-powered agencies selling faster and closing more across Europe.</p>
            <Link href="/auth/signup">
              <button className="btn-primary-gradient h-13 px-10 text-base gap-2">
                Get started free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER (comprehensive, old styling) ─── */}
      <footer className="border-t border-border/30 py-12">
        <div className="pp-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-8">
            <div>
              <p className="font-semibold mb-3">Product</p>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/features" className="block hover:text-foreground transition-colors">Features</Link>
                <Link href="/pricing" className="block hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/marketplace" className="block hover:text-foreground transition-colors">Marketplace</Link>
                <Link href="/changelog" className="block hover:text-foreground transition-colors">Changelog</Link>
                <Link href="/roadmap" className="block hover:text-foreground transition-colors">Roadmap</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">Resources</p>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/blog" className="block hover:text-foreground transition-colors">Blog</Link>
                <Link href="/docs" className="block hover:text-foreground transition-colors">API Docs</Link>
                <Link href="/tools/ai-property-description" className="block hover:text-foreground transition-colors">Free AI Tool</Link>
                <Link href="/tools/mortgage-calculator" className="block hover:text-foreground transition-colors">Mortgage Calc</Link>
                <Link href="/tools/roi-calculator" className="block hover:text-foreground transition-colors">ROI Calculator</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">Company</p>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/about" className="block hover:text-foreground transition-colors">About</Link>
                <Link href="/contact" className="block hover:text-foreground transition-colors">Contact</Link>
                <Link href="/demo" className="block hover:text-foreground transition-colors">Book Demo</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">Legal</p>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/terms" className="block hover:text-foreground transition-colors">Terms</Link>
                <Link href="/privacy" className="block hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/refund" className="block hover:text-foreground transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">PropertyPilot AI</span>
            </div>
            <div className="flex items-center gap-4">
              {["🇮🇹", "🇫🇷", "🇪🇸", "🇩🇪", "🇬🇧", "🇵🇹"].map((f) => <span key={f}>{f}</span>)}
            </div>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PropertyPilot AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
