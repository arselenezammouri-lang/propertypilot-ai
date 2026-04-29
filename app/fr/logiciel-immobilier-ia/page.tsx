import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users, Phone, Zap, Globe, BarChart3, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Logiciel Immobilier IA | PropertyPilot AI — Plateforme #1 en France",
  description: "Le logiciel immobilier IA le plus avancé de France. Générez des annonces professionnelles en 30 secondes, gérez vos leads avec un CRM IA, automatisez vos suivis. Utilisé par 200+ agences.",
  keywords: ["logiciel immobilier IA", "intelligence artificielle immobilier", "logiciel agence immobilière", "générateur annonces immobilières", "CRM immobilier", "IA immobilier France", "SeLoger IA", "LeBonCoin automatisation"],
  openGraph: { title: "Logiciel Immobilier IA #1 en France | PropertyPilot AI", description: "Générez des annonces en 30 secondes. CRM intelligent. Voice AI. Utilisé par 200+ agences françaises.", locale: "fr_FR", type: "website" },
  alternates: {
    canonical: "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia",
    languages: { "it": "https://propertypilot-ai.vercel.app/it/software-immobiliare-ai", "en": "https://propertypilot-ai.vercel.app/en/ai-real-estate-software", "fr": "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia", "es": "https://propertypilot-ai.vercel.app/es/software-inmobiliario-ia", "de": "https://propertypilot-ai.vercel.app/de/immobilien-software-ki" },
  },
};

const features = [
  { icon: Sparkles, title: "Moteur IA d'Annonces", desc: "Générez des descriptions professionnelles en 3 styles (Luxe, Investissement, Standard) en français, anglais, italien, espagnol, allemand et arabe. Optimisées pour SeLoger, LeBonCoin et PAP." },
  { icon: Users, title: "CRM Intelligent", desc: "Pipeline Kanban avec scoring IA des leads. Chaque contact est qualifié automatiquement. Suivis intelligents et attribution automatique à vos agents." },
  { icon: Phone, title: "Agent Vocal IA", desc: "Laissez l'IA passer vos appels. Qualifiez les leads, planifiez des visites, relancez — 24h/24, dans toutes les langues." },
  { icon: Zap, title: "Automatisations", desc: "Définissez vos règles une fois, laissez l'IA gérer le reste. Attribution automatique, envoi de suivis, mise à jour des statuts." },
  { icon: BarChart3, title: "Moteur de Prospection", desc: "Trouvez les baisses de prix, annonces expirées et opportunités cachées avant vos concurrents. Surveillez SeLoger, LeBonCoin et tous les portails français." },
  { icon: Globe, title: "6 Langues Professionnelles", desc: "Pas Google Translate. Traductions IA professionnelles en français, anglais, italien, espagnol, allemand et arabe." },
];

const testimonials = [
  { name: "Pierre D.", role: "Chef d'équipe, Paris", text: "Nous sommes passés de 3 outils à PropertyPilot seul. CRM, annonces, prospection — tout en un seul endroit." },
  { name: "Sophie L.", role: "Directrice d'agence, Lyon", text: "L'Agent Vocal IA est incroyable. Il prend des rendez-vous pendant que je dors. Mon pipeline n'a jamais été aussi rempli." },
  { name: "Thomas B.", role: "Agent, Marseille", text: "PropertyPilot a réduit mon temps de rédaction d'annonces de 2 heures à 5 minutes. Je peux me concentrer sur la conclusion des ventes." },
];

export default function FranceLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PropertyPilot AI",
    description: "Le logiciel immobilier IA le plus avancé de France.",
    url: "https://propertypilot-ai.vercel.app/fr/logiciel-immobilier-ia",
    applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "fr",
    offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: "0", highPrice: "897", offerCount: "4" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "89", bestRating: "5" },
    areaServed: { "@type": "Country", name: "France" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Building2 className="w-4 h-4 text-background" /></div><span className="text-base font-semibold">PropertyPilot</span></Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Tarifs</Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Connexion</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90">Essai Gratuit</Link>
            </div>
          </div>
        </nav>

        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"><span className="text-lg">🇫🇷</span> Le #1 Logiciel Immobilier IA en France</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">Le système d&apos;exploitation IA<br />pour les agences immobilières</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Générez des annonces professionnelles en 30 secondes. Gérez vos leads avec un CRM intelligent. Automatisez vos suivis et appels. <span className="text-foreground font-medium">Utilisé par 200+ agences en France.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Commencer l&apos;essai gratuit <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted">Voir la démo</Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">7 jours gratuits • Aucune carte bancaire requise</p>
          </div>
        </section>

        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[{ v: "200+", l: "Agences en France" }, { v: "10+", l: "Heures gagnées par semaine" }, { v: "3x", l: "Plus rapide pour les annonces" }, { v: "85%", l: "Réduction du travail répétitif" }].map(s => (
              <div key={s.l}><div className="text-3xl sm:text-4xl font-bold">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold mb-4">Tout ce dont vous avez besoin, sur une seule plateforme</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Arrêtez d&apos;utiliser 5 outils différents. PropertyPilot combine génération IA, CRM, prospection et automatisations.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (
                <div key={f.title} className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors">
                  <f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Les agences françaises adorent PropertyPilot</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.name} className="p-6 rounded-2xl border border-border/60 bg-card">
                  <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à transformer votre agence ?</h2>
            <p className="text-lg text-muted-foreground mb-8">Rejoignez 200+ agences en France qui utilisent déjà l&apos;IA pour conclure plus de ventes.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-foreground/90">Commencer l&apos;essai gratuit <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <footer className="py-10 border-t border-border/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 PropertyPilot AI. Tous droits réservés.</span>
            <div className="flex items-center gap-4"><Link href="/privacy" className="hover:text-foreground">Confidentialité</Link><Link href="/terms" className="hover:text-foreground">Conditions</Link><Link href="/contact" className="hover:text-foreground">Contact</Link></div>
          </div>
        </footer>
      </div>
    </>
  );
}
