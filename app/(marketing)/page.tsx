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
  Crown,
  Rocket,
  Play,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

/* ─── Feature Data ─── */
const FEATURES = [
  { icon: Sparkles, title: "AI Listing Engine", desc: "Generate professional listings in 3 styles × 6 languages. Portal-optimized for Idealista, ImmoScout24, Rightmove.", color: "text-violet-400" },
  { icon: ImagePlus, title: "Visual AI Suite", desc: "Virtual staging, photo enhancement, HDR, sky replacement, twilight conversion, floor plans.", color: "text-pink-400" },
  { icon: Shield, title: "Compliance Shield", desc: "Pre-publish compliance checks for Italy, France, Spain, Germany, UK, Portugal. Block non-compliant listings.", color: "text-emerald-400" },
  { icon: FileSearch, title: "Document Intelligence", desc: "Extract data from mandates, energy certificates, deeds. Click-to-cite AI with GPT-4o vision.", color: "text-orange-400" },
  { icon: Phone, title: "Voice AI Agent", desc: "Multilingual voice calls in 6 languages. Inbound/outbound, qualification, viewing booking, CRM sync.", color: "text-blue-400" },
  { icon: MessageCircle, title: "WhatsApp AI", desc: "AI-powered WhatsApp conversations. Intent detection, listing carousels, automated responses 24/7.", color: "text-green-400" },
  { icon: Zap, title: "Speed-to-Lead", desc: "Auto-call in 30s, WhatsApp in 60s, email in 90s. 2.3× more deals closed with sub-60s response.", color: "text-amber-400" },
  { icon: BarChart3, title: "CMA Valuations", desc: "Automated property valuations with comparables, market trends, AI citations. Branded PDF reports.", color: "text-cyan-400" },
  { icon: Globe, title: "16 Portal Integrations", desc: "Immobiliare.it, Idealista, ImmoScout24, Rightmove, SeLoger, Zoopla, Fotocasa + 9 more.", color: "text-indigo-400" },
  { icon: Store, title: "Cross-Border Marketplace", desc: "Match buyers across 6 EU countries. AI translation, commission escrow, international deals.", color: "text-teal-400" },
  { icon: TrendingUp, title: "Predictive Seller Leads", desc: "AI identifies homeowners likely to list. Behavioral signals, life events, market triggers.", color: "text-purple-400" },
  { icon: Plug, title: "MCP Server", desc: "Connect Claude Desktop, Cursor, or any AI assistant directly to your CRM via Model Context Protocol.", color: "text-sky-400" },
];

const STATS = [
  { value: "47+", label: "Dashboard Tools" },
  { value: "16", label: "Portal Adapters" },
  { value: "6", label: "EU Countries" },
  { value: "6", label: "Languages" },
];

const FLAGS = [
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "UK", flag: "🇬🇧", name: "UK" },
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
];

const PLANS = [
  {
    name: "Starter", price: "197", icon: Rocket, gradient: "from-blue-500 to-blue-600",
    features: ["50 AI listings/month", "20 Visual AI jobs", "Compliance Shield", "Document Intelligence", "10 CMA reports", "Portal connections", "Email support"],
    cta: "Start with Starter", href: "/auth/signup?plan=starter",
  },
  {
    name: "Pro", price: "497", icon: Crown, gradient: "from-amber-400 to-amber-500", featured: true,
    features: ["200 listings + CRM", "Speed-to-Lead automation", "100 Visual AI jobs", "Voice AI (300 min/mo)", "WhatsApp AI (2K conv)", "Predictive Seller Leads", "20 automations", "Priority support"],
    cta: "Go Pro", href: "/auth/signup?plan=pro",
  },
  {
    name: "Agency", price: "897", icon: Building2, gradient: "from-emerald-500 to-emerald-600",
    features: ["Unlimited + 10 agents", "White-label client portal", "500 Visual AI jobs", "Voice AI (1,500 min)", "MCP Server + API access", "Cross-border marketplace", "Custom domain", "Dedicated CSM"],
    cta: "Go Agency", href: "/auth/signup?plan=agency",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="font-bold text-lg">PropertyPilot<span className="text-indigo-400"> AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(245_80%_60%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(280_80%_60%/0.1),transparent_50%)]" />

        <motion.div
          className="relative max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-6">
              <Sparkles className="w-3 h-3 mr-1" /> The AI Operating System for European Real Estate
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              One Platform.
            </span>
            <br />
            <span className="text-foreground">Every European Market.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            AI-powered listings, voice agents, compliance checks, CRM, and portal publishing — 
            for agencies across Italy, France, Spain, Germany, UK and Portugal.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 h-12 text-base">
                Start Free Trial — No Credit Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-12 text-base gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Country Flags */}
          <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-6 mb-12">
            {FLAGS.map((f) => (
              <div key={f.code} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{f.flag}</span>
                <span className="text-[10px] text-muted-foreground">{f.name}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats Strip */}
          <motion.div variants={fadeUp} custom={5} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-card/50 backdrop-blur border border-border/40">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Everything You Need.
              </span>
              {" "}One Dashboard.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              12 AI-powered modules built for the European real estate market. 
              No other platform covers this much ground.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/40 hover:border-indigo-500/30 transition-all duration-300"
              >
                <feat.icon className={`w-8 h-8 ${feat.color} mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="py-16 px-4 border-y border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Built for the era of AI agents</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            The first European real estate platform with{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              MCP integration
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect Claude Desktop, Cursor, or any AI assistant directly to your CRM.
            Ask &ldquo;draft tomorrow&apos;s viewing schedule&rdquo; or &ldquo;summarise leads from Idealista this week&rdquo; — 
            and your AI agent acts on your real data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Claude Desktop", "Cursor", "Windsurf", "ChatGPT", "Custom AI"].map((client) => (
              <Badge key={client} variant="outline" className="text-xs py-1 px-3">
                {client}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Preview ─── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Simple, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-muted-foreground">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border backdrop-blur ${
                  plan.featured
                    ? "bg-gradient-to-b from-amber-500/10 to-card/50 border-amber-500/40"
                    : "bg-card/50 border-border/40"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-extrabold">€{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? "text-amber-400" : "text-emerald-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full ${
                    plan.featured
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:opacity-90"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90"
                  }`}>
                    {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              See full feature comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Mobile + Additional Features ─── */}
      <section className="py-16 px-4 border-t border-border/30">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/40 text-center">
            <Smartphone className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Mobile App</h3>
            <p className="text-sm text-muted-foreground">Property capture, CRM, voice memos. iOS + Android.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/40 text-center">
            <LineChart className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Market Reports</h3>
            <p className="text-sm text-muted-foreground">Auto-weekly intelligence from Idealista, ImmoScout24, Rightmove.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/40 text-center">
            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">GDPR Native</h3>
            <p className="text-sm text-muted-foreground">Consent tracking, DSAR automation, per-country DPA compliance.</p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to dominate your market?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the AI-powered agencies selling faster, scoring higher, and closing more across Europe.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 h-14 text-lg">
              Start Your Free Trial <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">No credit card required • 7-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/30 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-3">Product</p>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/features" className="block hover:text-foreground">Features</Link>
              <Link href="/pricing" className="block hover:text-foreground">Pricing</Link>
              <Link href="/marketplace" className="block hover:text-foreground">Marketplace</Link>
              <Link href="/changelog" className="block hover:text-foreground">Changelog</Link>
              <Link href="/roadmap" className="block hover:text-foreground">Roadmap</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Resources</p>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/blog" className="block hover:text-foreground">Blog</Link>
              <Link href="/docs" className="block hover:text-foreground">API Docs</Link>
              <Link href="/tools/ai-property-description" className="block hover:text-foreground">Free AI Tool</Link>
              <Link href="/tools/mortgage-calculator" className="block hover:text-foreground">Mortgage Calc</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Company</p>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/about" className="block hover:text-foreground">About</Link>
              <Link href="/contact" className="block hover:text-foreground">Contact</Link>
              <Link href="/demo" className="block hover:text-foreground">Book Demo</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Legal</p>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/terms" className="block hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="block hover:text-foreground">Privacy</Link>
              <Link href="/refund" className="block hover:text-foreground">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PropertyPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {FLAGS.map((f) => <span key={f.code} title={f.name}>{f.flag}</span>)}
          </div>
        </div>
      </footer>
    </main>
  );
}
