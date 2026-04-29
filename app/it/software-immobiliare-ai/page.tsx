import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Building2, Globe, Sparkles, Zap, Users, BarChart3, Phone, Shield, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Software Immobiliare AI | PropertyPilot AI — Piattaforma #1 in Italia",
  description: "Il software immobiliare con intelligenza artificiale più avanzato d'Italia. Genera annunci professionali in 30 secondi, gestisci lead con CRM AI, automatizza follow-up. Usato da 500+ agenzie.",
  keywords: [
    "software immobiliare AI",
    "intelligenza artificiale immobiliare",
    "software agenzie immobiliari",
    "generatore annunci immobiliari",
    "CRM immobiliare",
    "AI immobiliare Italia",
    "PropertyPilot",
    "Immobiliare.it AI",
    "Casa.it automazione",
    "gestionale immobiliare intelligente",
  ],
  openGraph: {
    title: "Software Immobiliare AI #1 in Italia | PropertyPilot AI",
    description: "Genera annunci in 30 secondi. CRM intelligente. Voice AI. Usato da 500+ agenzie italiane.",
    locale: "it_IT",
    type: "website",
  },
  alternates: {
    canonical: "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai",
    languages: {
      "it": "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai",
      "en": "https://propertypilot-ai.vercel.app/en/ai-real-estate-software",
      "fr": "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia",
      "es": "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia",
      "de": "https://propertypilot-ai.vercel.app/de/immobilien-software-ki",
    },
  },
};

const features = [
  { icon: Sparkles, title: "Motore AI per Annunci", desc: "Genera descrizioni professionali in 3 stili (Luxury, Investment, Standard) in italiano, inglese, francese, spagnolo, tedesco e arabo. Ottimizzati per Immobiliare.it, Casa.it e Subito.it." },
  { icon: Users, title: "CRM Intelligente", desc: "Pipeline Kanban con lead scoring AI. Ogni contatto viene qualificato automaticamente. Follow-up intelligenti e assegnazione automatica ai tuoi agenti." },
  { icon: Phone, title: "Voice AI Agent", desc: "Lascia che l'AI faccia le chiamate per te. Qualifica lead, prenota visite, segui i contatti — 24/7, in qualsiasi lingua. Come avere un assistente instancabile." },
  { icon: Zap, title: "Automazioni", desc: "Imposta regole una volta, lascia che l'AI gestisca il resto. Auto-assegnazione lead, invio follow-up, aggiornamento stati. Fino a 20 automazioni al mese." },
  { icon: BarChart3, title: "Prospecting Engine", desc: "Trova ribassi di prezzo, annunci scaduti e opportunità nascoste prima dei tuoi competitor. Monitora Immobiliare.it, Casa.it e tutti i portali italiani." },
  { icon: Globe, title: "6 Lingue Professionali", desc: "Non Google Translate. Traduzioni AI professionali in italiano, inglese, francese, spagnolo, tedesco e arabo. Perfette per acquirenti internazionali." },
];

const testimonials = [
  { name: "Marco R.", role: "Agente, Milano", text: "PropertyPilot ha tagliato il mio tempo per gli annunci da 2 ore a 5 minuti. Posso concentrarmi su quello che conta: chiudere le trattative." },
  { name: "Giulia M.", role: "Titolare Agenzia, Roma", text: "Il Voice AI Agent è incredibile. Prenota visite mentre dormo. La mia pipeline non è mai stata così piena." },
  { name: "Alessandro T.", role: "Team Lead, Firenze", text: "Siamo passati da 3 strumenti a solo PropertyPilot. CRM, annunci, prospecting — tutto in un unico posto. Risparmiamo €500/mese." },
];

const stats = [
  { value: "500+", label: "Agenzie in Italia" },
  { value: "10+", label: "Ore risparmiate a settimana" },
  { value: "3x", label: "Più veloce nella creazione annunci" },
  { value: "85%", label: "Riduzione lavoro ripetitivo" },
];

const portals = [
  { name: "Immobiliare.it", desc: "Annunci ottimizzati per il portale #1 in Italia" },
  { name: "Casa.it", desc: "Formattazione e SEO specifici per Casa.it" },
  { name: "Idealista", desc: "Supporto completo per Idealista Italia" },
  { name: "Subito.it", desc: "Annunci brevi e efficaci per Subito" },
];

export default function ItalyLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PropertyPilot AI",
    description: "Il software immobiliare con intelligenza artificiale più avanzato d'Italia.",
    url: "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "it",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "0",
      highPrice: "897",
      offerCount: "4",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
    },
    areaServed: { "@type": "Country", name: "Italy" },
    availableLanguage: ["Italian", "English", "French", "Spanish", "German", "Arabic"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Building2 className="w-4 h-4 text-background" />
              </div>
              <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Prezzi</Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Accedi</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
                Prova Gratis
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="text-lg">🇮🇹</span> Il #1 Software Immobiliare AI in Italia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Il sistema operativo AI<br />per le agenzie immobiliari
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Genera annunci professionali in 30 secondi. Gestisci lead con CRM intelligente. Automatizza follow-up e chiamate. 
              <span className="text-foreground font-medium"> Usato da 500+ agenzie in Italia.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90 transition-colors">
                Inizia la prova gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted transition-colors">
                Vedi la demo
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">7 giorni gratis • Nessuna carta di credito richiesta • Cancella quando vuoi</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tutto ciò di cui hai bisogno, in un'unica piattaforma</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Smetti di usare 5 strumenti diversi. PropertyPilot combina generazione AI, CRM, prospecting e automazioni.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                  <f.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Italian Portals */}
        <section className="py-16 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ottimizzato per i portali italiani</h2>
              <p className="text-muted-foreground">Annunci formattati e ottimizzati specificamente per ogni portale.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {portals.map((p) => (
                <div key={p.name} className="p-5 rounded-xl border border-border/60 bg-card text-center">
                  <div className="text-lg font-bold mb-1">{p.name}</div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Le agenzie italiane adorano PropertyPilot</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="p-6 rounded-2xl border border-border/60 bg-card">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Prezzi semplici e trasparenti</h2>
            <p className="text-muted-foreground mb-10">Inizia gratis. Upgrade quando sei pronto. Cancella quando vuoi.</p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Starter", price: "€197", desc: "50 annunci AI, Lead Score, PDF export", cta: "Inizia con Starter" },
                { name: "Pro", price: "€497", desc: "200 annunci, CRM, Voice AI, Automazioni", cta: "Passa a Pro", popular: true },
                { name: "Agency", price: "€897", desc: "Illimitato, 10 agenti, Auto-Prospecting, API", cta: "Scala con Agency" },
              ].map((p) => (
                <div key={p.name} className={`p-6 rounded-2xl border bg-card ${p.popular ? "border-primary ring-2 ring-primary/20" : "border-border/60"}`}>
                  {p.popular && <div className="text-xs font-medium text-primary mb-2">⭐ Più Popolare</div>}
                  <div className="text-lg font-bold">{p.name}</div>
                  <div className="text-3xl font-bold my-3">{p.price}<span className="text-sm font-normal text-muted-foreground">/mese</span></div>
                  <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
                  <Link href={`/auth/signup?plan=${p.name.toLowerCase()}`} className={`inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${p.popular ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border hover:bg-muted"}`}>
                    {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">Tutti i piani includono 7 giorni di prova gratuita. L&apos;agente medio risparmia 40+ ore/mese.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto a trasformare la tua agenzia?</h2>
            <p className="text-lg text-muted-foreground mb-8">Unisciti a 500+ agenzie in Italia che usano già l&apos;AI per chiudere più trattative, più velocemente.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90 transition-colors">
              Inizia la prova gratuita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 PropertyPilot AI. Tutti i diritti riservati.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Termini</Link>
              <Link href="/contact" className="hover:text-foreground">Contatti</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
