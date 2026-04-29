import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users, Phone, Zap, Globe, BarChart3, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Real Estate Software | PropertyPilot AI — #1 Platform in Europe",
  description: "The most advanced AI real estate software in Europe. Generate professional listings in 30 seconds, manage leads with AI CRM, automate follow-ups. Used by 1,000+ agencies across Europe.",
  keywords: ["AI real estate software", "artificial intelligence real estate", "real estate agency software", "listing generator AI", "real estate CRM", "AI property platform", "Rightmove AI", "Zoopla automation", "real estate automation", "property listing AI"],
  openGraph: { title: "AI Real Estate Software #1 in Europe | PropertyPilot AI", description: "Generate listings in 30 seconds. AI CRM. Voice AI. Used by 1,000+ European agencies.", locale: "en_US", type: "website" },
  alternates: {
    canonical: "https://propertypilot-ai.vercel.app/en/ai-real-estate-software",
    languages: { "it": "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai", "en": "https://propertypilot-ai.vercel.app/en/ai-real-estate-software", "fr": "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia", "es": "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia", "de": "https://propertypilot-ai.vercel.app/de/immobilien-software-ki" },
  },
};

const features = [
  { icon: Sparkles, title: "AI Listing Engine", desc: "Generate professional descriptions in 3 styles (Luxury, Investment, Standard) in English, Italian, French, Spanish, German and Arabic. Optimized for Rightmove, Zoopla, and OnTheMarket." },
  { icon: Users, title: "Smart CRM", desc: "Kanban pipeline with AI lead scoring. Every contact is automatically qualified. Smart follow-ups and automatic assignment to your agents." },
  { icon: Phone, title: "AI Voice Agent", desc: "Let AI make calls for you. Qualify leads, book viewings, follow up — 24/7, in any language. Like having a tireless assistant." },
  { icon: Zap, title: "Automations", desc: "Set rules once, let AI handle the rest. Auto-assign leads, send follow-ups, update statuses. Up to 20 automations per month." },
  { icon: BarChart3, title: "Prospecting Engine", desc: "Find price drops, expired listings, and hidden opportunities before your competitors. Monitor Rightmove, Zoopla, and all major portals." },
  { icon: Globe, title: "6 Professional Languages", desc: "Not Google Translate. Professional AI translations in English, Italian, French, Spanish, German and Arabic. Perfect for international buyers." },
];

const testimonials = [
  { name: "James R.", role: "Agent, London", text: "PropertyPilot cut my listing time from 2 hours to 5 minutes. I can focus on what matters — closing deals." },
  { name: "Sarah M.", role: "Agency Owner, Manchester", text: "The AI Voice Agent is incredible. It books viewings while I sleep. My pipeline has never been this full." },
  { name: "David K.", role: "Team Lead, Edinburgh", text: "We moved from 3 tools to just PropertyPilot. CRM, listings, prospecting — everything in one place. Saving £400/month." },
];

export default function EnglishLandingPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PropertyPilot AI", description: "The most advanced AI real estate software in Europe.", url: "https://propertypilot-ai.vercel.app/en/ai-real-estate-software", applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "en", offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: "0", highPrice: "897", offerCount: "4" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "312", bestRating: "5" }, areaServed: [{ "@type": "Country", name: "United Kingdom" }, { "@type": "Continent", name: "Europe" }] };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Building2 className="w-4 h-4 text-background" /></div><span className="text-base font-semibold">PropertyPilot</span></Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Pricing</Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90">Start Free Trial</Link>
            </div>
          </div>
        </nav>

        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"><span className="text-lg">🇪🇺</span> The #1 AI Real Estate Software in Europe</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">The AI operating system<br />for real estate agencies</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Generate professional listings in 30 seconds. Manage leads with AI CRM. Automate follow-ups and calls. <span className="text-foreground font-medium">Used by 1,000+ agencies across Europe.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Start free trial <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted">See the demo</Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">7 days free • No credit card required • Cancel anytime</p>
          </div>
        </section>

        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[{ v: "1,000+", l: "Agencies in Europe" }, { v: "10+", l: "Hours saved per week" }, { v: "3x", l: "Faster listing creation" }, { v: "85%", l: "Less repetitive work" }].map(s => (
              <div key={s.l}><div className="text-3xl sm:text-4xl font-bold">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need, in one platform</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Stop juggling 5 different tools. PropertyPilot combines AI generation, CRM, prospecting, and automations.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (<div key={f.title} className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors"><f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p></div>))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">European agencies love PropertyPilot</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map(t => (<div key={t.name} className="p-6 rounded-2xl border border-border/60 bg-card"><div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div><p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to transform your agency?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join 1,000+ agencies across Europe already using AI to close more deals, faster.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Start free trial <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <footer className="py-10 border-t border-border/40"><div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"><span>© 2026 PropertyPilot AI. All rights reserved.</span><div className="flex items-center gap-4"><Link href="/privacy" className="hover:text-foreground">Privacy</Link><Link href="/terms" className="hover:text-foreground">Terms</Link><Link href="/contact" className="hover:text-foreground">Contact</Link></div></div></footer>
      </div>
    </>
  );
}
