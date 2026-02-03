import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Globe,
  Zap,
  TrendingUp,
  Check,
  ArrowRight,
  Phone,
  Bot,
  BarChart3,
  Crown,
  Diamond,
  Building2,
  Users,
  Shield,
  Rocket,
  Target,
  Clock,
  Star,
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <header className="relative z-50 border-b border-white/[0.08] backdrop-blur-xl bg-black/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-purple to-electric-blue flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              PropertyPilot AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">
              Accedi
            </Link>
            <Button className="bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 text-white border-0" asChild>
              <Link href="/auth/signup">
                Inizia Gratis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-royal-purple/20 to-electric-blue/20 border border-white/[0.1] mb-8 animate-fade-in">
            <Diamond className="h-4 w-4 text-sunset-gold animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-sunset-gold to-amber-400 bg-clip-text text-transparent">
              AI Operating System for Real Estate
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Il Sistema Operativo AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-royal-purple via-electric-blue to-neon-aqua bg-clip-text text-transparent animate-gradient-x">
              per Agenzie Immobiliari
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            Genera annunci professionali, chiama proprietari con Voice AI, 
            gestisci lead con CRM 4.0. Tutto automatizzato, 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 shadow-glow-purple" asChild>
              <Link href="/auth/signup">
                Inizia Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white/20 hover:bg-white/5 hover:border-white/30" asChild>
              <Link href="/demo">
                <Sparkles className="mr-2 h-5 w-5" />
                Vedi Demo Live
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "27+", label: "AI Tools", icon: Bot },
              { value: "24/7", label: "Automazione", icon: Clock },
              { value: "€0", label: "Setup", icon: Rocket },
              { value: "100%", label: "Cloud", icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="futuristic-card p-6 text-center group hover:border-royal-purple/30 transition-all">
                <stat.icon className="h-6 w-6 mx-auto mb-3 text-royal-purple group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Copertura Globale
            </h2>
            <p className="text-xl text-white/50">
              Operiamo su tutti i principali portali immobiliari internazionali
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { flag: "🇺🇸", country: "Stati Uniti", portals: ["Zillow", "MLS", "Redfin", "Realtor.com"] },
              { flag: "🇮🇹", country: "Italia", portals: ["Immobiliare.it", "Idealista", "Casa.it", "Subito.it"] },
              { flag: "🇪🇸", country: "Spagna", portals: ["Idealista.es", "Fotocasa", "Pisos.com", "Habitaclia"] },
            ].map((region, i) => (
              <div key={i} className="futuristic-card p-8 group hover:border-electric-blue/30 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{region.flag}</span>
                  <h3 className="text-2xl font-bold text-white">{region.country}</h3>
                </div>
                <ul className="space-y-3">
                  {region.portals.map((portal, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/70">
                      <Check className="h-5 w-5 text-neon-aqua" />
                      <span>{portal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Come Funziona
            </h2>
            <p className="text-xl text-white/50">
              Automatizza ogni aspetto del tuo business immobiliare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "Scraping Intelligente",
                description: "L'AI analizza migliaia di annunci ogni giorno e identifica le migliori opportunità di mercato.",
                gradient: "from-royal-purple to-electric-blue"
              },
              {
                icon: Phone,
                title: "Voice AI Prospecting",
                description: "L'agente vocale chiama proprietari, gestisce obiezioni e fissa appuntamenti automaticamente 24/7.",
                gradient: "from-electric-blue to-neon-aqua"
              },
              {
                icon: BarChart3,
                title: "Lead Scoring AI",
                description: "Ogni lead riceve un punteggio 0-100. Focus automatico sugli 'Affari Oro' (80+).",
                gradient: "from-neon-aqua to-sunset-gold"
              },
            ].map((feature, i) => (
              <div key={i} className="futuristic-card p-8 group hover:border-white/20 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunset-gold/10 border border-sunset-gold/20 mb-6">
              <Crown className="h-4 w-4 text-sunset-gold" />
              <span className="text-sm font-medium text-sunset-gold">Piani Premium</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Scegli il Tuo Piano
            </h2>
            <p className="text-xl text-white/50">
              Investi nel futuro della tua agenzia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Starter",
                price: "€197",
                period: "/mese",
                description: "Per agenti singoli",
                features: ["50 annunci/mese", "Titoli A/B AI", "Descrizioni AI", "Analisi Annuncio", "Hashtag AI", "PDF Professionali"],
                cta: "Scegli Starter",
                highlighted: false,
                gradient: "from-white/10 to-white/5"
              },
              {
                name: "Pro",
                price: "€497",
                period: "/mese",
                description: "Per professionisti",
                badge: "CONSIGLIATO",
                features: ["200 annunci/mese", "Tutto di Starter", "CRM Completo", "Pipeline Kanban", "Lead Scoring AI", "Email/SMS/WhatsApp", "20 Automazioni AI"],
                cta: "Scegli Pro",
                highlighted: true,
                gradient: "from-royal-purple/20 to-electric-blue/20"
              },
              {
                name: "Agency",
                price: "€897",
                period: "/mese",
                description: "Per team e agenzie",
                features: ["Annunci Illimitati", "Tutto di Pro", "10 utenti inclusi", "Ruoli Admin/Agent", "Distribuzione lead auto", "Report team", "Supporto prioritario"],
                cta: "Scegli Agency",
                highlighted: false,
                gradient: "from-white/10 to-white/5"
              },
              {
                name: "Agency Boost",
                price: "€2.497",
                period: "una tantum",
                description: "Scala in 7 giorni",
                badge: "PREMIUM",
                features: ["Setup CRM completo", "10 moduli lead capture", "3 script follow-up", "1 ora formazione", "Consulenza 1:1", "Branding custom"],
                cta: "Contattaci",
                highlighted: false,
                gradient: "from-sunset-gold/20 to-amber-500/10"
              },
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`futuristic-card p-6 relative ${plan.highlighted ? 'border-royal-purple/50 shadow-glow-purple' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.badge === 'PREMIUM' ? 'bg-gradient-to-r from-sunset-gold to-amber-500 text-black' : 'bg-gradient-to-r from-royal-purple to-electric-blue text-white'}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-4">{plan.description}</p>
                  <div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-white/50 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="h-4 w-4 text-neon-aqua shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                  asChild
                >
                  <Link href={`/auth/signup?plan=${plan.name.toLowerCase()}`}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="futuristic-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-royal-purple/10 via-electric-blue/10 to-neon-aqua/10" />
            <div className="relative z-10">
              <Diamond className="h-12 w-12 mx-auto mb-6 text-sunset-gold animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Pronto a Dominare il Mercato?
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
                Unisciti a centinaia di agenti che già usano PropertyPilot AI per chiudere più affari
              </p>
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 shadow-glow-purple" asChild>
                <Link href="/auth/signup">
                  Inizia Gratis Ora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/[0.08] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-purple to-electric-blue flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white/80">PropertyPilot AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Termini</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Rimborsi</Link>
            </div>
            <p className="text-sm text-white/40">
              © 2026 PropertyPilot AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
