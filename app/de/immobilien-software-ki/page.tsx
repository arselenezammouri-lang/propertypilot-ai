import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users, Phone, Zap, Globe, BarChart3, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Immobilien Software KI | PropertyPilot AI — #1 Plattform in Deutschland",
  description: "Die fortschrittlichste KI-Immobiliensoftware Deutschlands. Erstellen Sie professionelle Anzeigen in 30 Sekunden, verwalten Sie Leads mit KI-CRM, automatisieren Sie Follow-ups. Von 100+ Agenturen genutzt.",
  keywords: ["Immobilien Software KI", "künstliche Intelligenz Immobilien", "Immobilienmakler Software", "Anzeigen Generator Immobilien", "CRM Immobilien", "KI Immobilien Deutschland", "ImmoScout24 KI", "Immowelt Automatisierung"],
  openGraph: { title: "Immobilien Software KI #1 in Deutschland | PropertyPilot AI", description: "Anzeigen in 30 Sekunden erstellen. Intelligentes CRM. Voice AI. Von 100+ deutschen Agenturen genutzt.", locale: "de_DE", type: "website" },
  alternates: {
    canonical: "https://propertypilot-ai.vercel.app/de/immobilien-software-ki",
    languages: { "it": "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai", "en": "https://propertypilot-ai.vercel.app/en/ai-real-estate-software", "fr": "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia", "es": "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia", "de": "https://propertypilot-ai.vercel.app/de/immobilien-software-ki" },
  },
};

const features = [
  { icon: Sparkles, title: "KI-Anzeigen-Engine", desc: "Erstellen Sie professionelle Beschreibungen in 3 Stilen (Luxus, Investment, Standard) in Deutsch, Englisch, Italienisch, Französisch, Spanisch und Arabisch. Optimiert für ImmoScout24, Immowelt und Immonet." },
  { icon: Users, title: "Intelligentes CRM", desc: "Kanban-Pipeline mit KI-Lead-Scoring. Jeder Kontakt wird automatisch qualifiziert. Intelligente Follow-ups und automatische Zuweisung an Ihre Makler." },
  { icon: Phone, title: "KI-Sprachagent", desc: "Lassen Sie die KI für Sie telefonieren. Leads qualifizieren, Besichtigungen buchen, nachfassen — 24/7, in jeder Sprache." },
  { icon: Zap, title: "Automatisierungen", desc: "Regeln einmal festlegen, KI erledigt den Rest. Auto-Zuweisung, Follow-up-Versand, Status-Updates. Bis zu 20 Automatisierungen pro Monat." },
  { icon: BarChart3, title: "Prospecting-Engine", desc: "Finden Sie Preissenkungen, abgelaufene Anzeigen und versteckte Chancen vor Ihren Wettbewerbern. Überwachen Sie ImmoScout24, Immowelt und alle deutschen Portale." },
  { icon: Globe, title: "6 Profi-Sprachen", desc: "Kein Google Translate. Professionelle KI-Übersetzungen in Deutsch, Englisch, Italienisch, Französisch, Spanisch und Arabisch." },
];

const testimonials = [
  { name: "Thomas K.", role: "Makler, München", text: "PropertyPilot hat meine Anzeigenerstellung von 2 Stunden auf 5 Minuten reduziert. Ich kann mich auf das Wesentliche konzentrieren: Abschlüsse." },
  { name: "Anna S.", role: "Agenturleiterin, Berlin", text: "Der KI-Sprachagent ist unglaublich. Er bucht Besichtigungen, während ich schlafe. Meine Pipeline war noch nie so voll." },
  { name: "Markus W.", role: "Teamleiter, Hamburg", text: "Wir haben 3 Tools durch PropertyPilot ersetzt. CRM, Anzeigen, Prospecting — alles an einem Ort. Wir sparen €500/Monat." },
];

export default function GermanyLandingPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PropertyPilot AI", description: "Die fortschrittlichste KI-Immobiliensoftware Deutschlands.", url: "https://propertypilot-ai.vercel.app/de/immobilien-software-ki", applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "de", offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: "0", highPrice: "897", offerCount: "4" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "58", bestRating: "5" }, areaServed: { "@type": "Country", name: "Germany" } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Building2 className="w-4 h-4 text-background" /></div><span className="text-base font-semibold">PropertyPilot</span></Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Preise</Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Anmelden</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90">Kostenlos testen</Link>
            </div>
          </div>
        </nav>

        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"><span className="text-lg">🇩🇪</span> Die #1 KI-Immobiliensoftware in Deutschland</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">Das KI-Betriebssystem<br />für Immobilienagenturen</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Erstellen Sie professionelle Anzeigen in 30 Sekunden. Verwalten Sie Leads mit intelligentem CRM. Automatisieren Sie Follow-ups und Anrufe. <span className="text-foreground font-medium">Von 100+ Agenturen in Deutschland genutzt.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Kostenlose Testphase starten <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted">Demo ansehen</Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">7 Tage kostenlos • Keine Kreditkarte erforderlich</p>
          </div>
        </section>

        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[{ v: "100+", l: "Agenturen in Deutschland" }, { v: "10+", l: "Stunden pro Woche gespart" }, { v: "3x", l: "Schnellere Anzeigenerstellung" }, { v: "85%", l: "Weniger Routinearbeit" }].map(s => (
              <div key={s.l}><div className="text-3xl sm:text-4xl font-bold">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold mb-4">Alles was Sie brauchen, auf einer Plattform</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Hören Sie auf, 5 verschiedene Tools zu nutzen. PropertyPilot vereint KI-Generierung, CRM, Prospecting und Automatisierungen.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (<div key={f.title} className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors"><f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p></div>))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Deutsche Agenturen lieben PropertyPilot</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map(t => (<div key={t.name} className="p-6 rounded-2xl border border-border/60 bg-card"><div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div><p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Bereit, Ihre Agentur zu transformieren?</h2>
            <p className="text-lg text-muted-foreground mb-8">Schließen Sie sich 100+ Agenturen in Deutschland an, die bereits KI nutzen, um mehr Abschlüsse zu erzielen.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Kostenlose Testphase starten <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <footer className="py-10 border-t border-border/40"><div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"><span>© 2026 PropertyPilot AI. Alle Rechte vorbehalten.</span><div className="flex items-center gap-4"><Link href="/privacy" className="hover:text-foreground">Datenschutz</Link><Link href="/terms" className="hover:text-foreground">AGB</Link><Link href="/contact" className="hover:text-foreground">Kontakt</Link></div></div></footer>
      </div>
    </>
  );
}
