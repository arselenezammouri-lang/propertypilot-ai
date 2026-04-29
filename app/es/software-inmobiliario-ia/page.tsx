import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users, Phone, Zap, Globe, BarChart3, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Software Inmobiliario IA | PropertyPilot AI — Plataforma #1 en España",
  description: "El software inmobiliario con inteligencia artificial más avanzado de España. Genera anuncios profesionales en 30 segundos, gestiona leads con CRM IA, automatiza seguimientos. Usado por 150+ agencias.",
  keywords: ["software inmobiliario IA", "inteligencia artificial inmobiliaria", "software agencia inmobiliaria", "generador anuncios inmobiliarios", "CRM inmobiliario", "IA inmobiliaria España", "Idealista IA", "Fotocasa automatización"],
  openGraph: { title: "Software Inmobiliario IA #1 en España | PropertyPilot AI", description: "Genera anuncios en 30 segundos. CRM inteligente. Voice AI. Usado por 150+ agencias españolas.", locale: "es_ES", type: "website" },
  alternates: {
    canonical: "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia",
    languages: { "it": "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai", "en": "https://propertypilot-ai.vercel.app/en/ai-real-estate-software", "fr": "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia", "es": "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia", "de": "https://propertypilot-ai.vercel.app/de/immobilien-software-ki" },
  },
};

const features = [
  { icon: Sparkles, title: "Motor IA de Anuncios", desc: "Genera descripciones profesionales en 3 estilos (Lujo, Inversión, Estándar) en español, inglés, italiano, francés, alemán y árabe. Optimizados para Idealista, Fotocasa y Habitaclia." },
  { icon: Users, title: "CRM Inteligente", desc: "Pipeline Kanban con scoring IA de leads. Cada contacto se califica automáticamente. Seguimientos inteligentes y asignación automática a tus agentes." },
  { icon: Phone, title: "Agente de Voz IA", desc: "Deja que la IA haga las llamadas por ti. Califica leads, agenda visitas, haz seguimiento — 24/7, en cualquier idioma." },
  { icon: Zap, title: "Automatizaciones", desc: "Configura reglas una vez, deja que la IA gestione el resto. Auto-asignación de leads, envío de seguimientos, actualización de estados." },
  { icon: BarChart3, title: "Motor de Prospección", desc: "Encuentra bajadas de precio, anuncios caducados y oportunidades ocultas antes que tus competidores. Monitorea Idealista, Fotocasa y todos los portales españoles." },
  { icon: Globe, title: "6 Idiomas Profesionales", desc: "No es Google Translate. Traducciones IA profesionales en español, inglés, italiano, francés, alemán y árabe." },
];

const testimonials = [
  { name: "Carlos M.", role: "Agente, Madrid", text: "PropertyPilot redujo mi tiempo de creación de anuncios de 2 horas a 5 minutos. Puedo centrarme en lo que importa: cerrar operaciones." },
  { name: "Sofía L.", role: "Propietaria de Agencia, Barcelona", text: "El Agente de Voz IA es increíble. Agenda visitas mientras duermo. Mi pipeline nunca ha estado tan lleno." },
  { name: "Miguel A.", role: "Jefe de Equipo, Valencia", text: "Pasamos de 3 herramientas a solo PropertyPilot. CRM, anuncios, prospección — todo en un solo lugar." },
];

export default function SpainLandingPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PropertyPilot AI", description: "El software inmobiliario IA más avanzado de España.", url: "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia", applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "es", offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: "0", highPrice: "897", offerCount: "4" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "73", bestRating: "5" }, areaServed: { "@type": "Country", name: "Spain" } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Building2 className="w-4 h-4 text-background" /></div><span className="text-base font-semibold">PropertyPilot</span></Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Precios</Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Acceder</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90">Prueba Gratis</Link>
            </div>
          </div>
        </nav>

        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"><span className="text-lg">🇪🇸</span> El #1 Software Inmobiliario IA en España</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">El sistema operativo IA<br />para agencias inmobiliarias</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Genera anuncios profesionales en 30 segundos. Gestiona leads con CRM inteligente. Automatiza seguimientos y llamadas. <span className="text-foreground font-medium">Usado por 150+ agencias en España.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Empezar prueba gratuita <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted">Ver la demo</Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">7 días gratis • Sin tarjeta de crédito • Cancela cuando quieras</p>
          </div>
        </section>

        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[{ v: "150+", l: "Agencias en España" }, { v: "10+", l: "Horas ahorradas por semana" }, { v: "3x", l: "Más rápido creando anuncios" }, { v: "85%", l: "Reducción de trabajo repetitivo" }].map(s => (
              <div key={s.l}><div className="text-3xl sm:text-4xl font-bold">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold mb-4">Todo lo que necesitas, en una sola plataforma</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Deja de usar 5 herramientas diferentes. PropertyPilot combina generación IA, CRM, prospección y automatizaciones.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (<div key={f.title} className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors"><f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p></div>))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Las agencias españolas adoran PropertyPilot</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map(t => (<div key={t.name} className="p-6 rounded-2xl border border-border/60 bg-card"><div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div><p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Listo para transformar tu agencia?</h2>
            <p className="text-lg text-muted-foreground mb-8">Únete a 150+ agencias en España que ya usan IA para cerrar más operaciones, más rápido.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Empezar prueba gratuita <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <footer className="py-10 border-t border-border/40"><div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"><span>© 2026 PropertyPilot AI. Todos los derechos reservados.</span><div className="flex items-center gap-4"><Link href="/privacy" className="hover:text-foreground">Privacidad</Link><Link href="/terms" className="hover:text-foreground">Términos</Link><Link href="/contact" className="hover:text-foreground">Contacto</Link></div></div></footer>
      </div>
    </>
  );
}
