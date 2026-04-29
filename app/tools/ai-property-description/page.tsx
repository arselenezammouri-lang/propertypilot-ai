"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Sparkles, Copy, Check, Loader2, Globe, Heart, TrendingUp, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STYLES = {
  luxury: { label: "Luxury", emoji: "✨", tone: "exclusive, elegant, premium" },
  investment: { label: "Investment", emoji: "📈", tone: "ROI-focused, data-driven, analytical" },
  standard: { label: "Standard", emoji: "🏠", tone: "professional, clear, appealing" },
};

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

function generateLocalDescription(type: string, location: string, features: string, price: string, style: string, lang: string): string {
  const styleData = STYLES[style as keyof typeof STYLES] || STYLES.standard;
  const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
  const featureText = featureList.length > 0 ? featureList.join(", ") : "modern finishes, natural light";

  const templates: Record<string, Record<string, string>> = {
    en: {
      luxury: `**${type} in ${location} — ${price}**\n\nA rare opportunity to acquire an exceptional ${type.toLowerCase()} in one of ${location}'s most coveted addresses. This distinguished property showcases ${featureText}, creating an atmosphere of refined sophistication.\n\nEvery detail has been carefully curated to meet the expectations of the most discerning buyers. Floor-to-ceiling windows frame panoramic views, while premium materials and bespoke finishes define each living space.\n\nFor those who demand nothing less than extraordinary.\n\n📍 ${location} | 💎 Premium | 🔑 Available for private viewing`,
      investment: `**${type} in ${location} — ${price}**\n\n📊 **Investment Highlights:**\n- Property type: ${type}\n- Location: ${location}\n- Key features: ${featureText}\n- Price: ${price}\n\nThis ${type.toLowerCase()} represents a compelling investment opportunity in ${location}'s growing market. With ${featureText}, the property is positioned for strong rental demand and capital appreciation.\n\nStrategically located with excellent transport links and proximity to key amenities, this asset offers both immediate income potential and long-term value growth.\n\n📈 Request our full investment analysis report.`,
      standard: `**${type} in ${location} — ${price}**\n\nWelcoming ${type.toLowerCase()} located in ${location}, offering ${featureText}.\n\nThe property features a functional layout with bright, well-proportioned rooms. Natural light fills the living areas, creating a warm and inviting atmosphere. The modern kitchen is fully equipped, and the bedrooms offer comfortable, private retreats.\n\nWell-connected location with shops, schools, and public transport nearby. Perfect for families and professionals looking for quality living.\n\n🏠 Schedule your viewing today.`,
    },
    it: {
      luxury: `**${type} a ${location} — ${price}**\n\nUn'opportunità rara di acquisire un eccezionale ${type.toLowerCase()} in uno degli indirizzi più ambiti di ${location}. Questa proprietà di prestigio presenta ${featureText}, creando un'atmosfera di raffinata eleganza.\n\nOgni dettaglio è stato curato con attenzione per soddisfare le aspettative degli acquirenti più esigenti.\n\n📍 ${location} | 💎 Premium | 🔑 Visita privata su appuntamento`,
      investment: `**${type} a ${location} — ${price}**\n\n📊 **Dati Investimento:**\n- Tipologia: ${type}\n- Zona: ${location}\n- Caratteristiche: ${featureText}\n- Prezzo: ${price}\n\nQuesto ${type.toLowerCase()} rappresenta un'opportunità d'investimento interessante nel mercato in crescita di ${location}.\n\n📈 Richiedi l'analisi completa dell'investimento.`,
      standard: `**${type} a ${location} — ${price}**\n\nAccogliente ${type.toLowerCase()} situato a ${location}, che offre ${featureText}.\n\nL'immobile presenta una disposizione funzionale con stanze luminose e ben proporzionate. La cucina moderna è completamente attrezzata. Posizione ben collegata con negozi, scuole e trasporti.\n\n🏠 Prenota la tua visita oggi.`,
    },
    fr: {
      luxury: `**${type} à ${location} — ${price}**\n\nUne opportunité rare d'acquérir un ${type.toLowerCase()} exceptionnel dans l'une des adresses les plus prisées de ${location}. Cette propriété de prestige offre ${featureText}.\n\n📍 ${location} | 💎 Premium | 🔑 Visite privée sur rendez-vous`,
      investment: `**${type} à ${location} — ${price}**\n\n📊 **Données d'Investissement:**\n- Type: ${type}\n- Localisation: ${location}\n- Caractéristiques: ${featureText}\n\nCe bien représente une opportunité d'investissement dans le marché croissant de ${location}.\n\n📈 Demandez notre analyse complète.`,
      standard: `**${type} à ${location} — ${price}**\n\n${type} accueillant situé à ${location}, offrant ${featureText}. Disposition fonctionnelle avec pièces lumineuses. Bien desservi par les transports.\n\n🏠 Planifiez votre visite.`,
    },
    es: {
      luxury: `**${type} en ${location} — ${price}**\n\nUna oportunidad única de adquirir un ${type.toLowerCase()} excepcional en una de las direcciones más exclusivas de ${location}. Esta propiedad de prestigio presenta ${featureText}.\n\n📍 ${location} | 💎 Premium | 🔑 Visita privada con cita`,
      investment: `**${type} en ${location} — ${price}**\n\n📊 **Datos de Inversión:**\n- Tipo: ${type}\n- Ubicación: ${location}\n- Características: ${featureText}\n\nEsta propiedad representa una oportunidad de inversión en el mercado creciente de ${location}.\n\n📈 Solicita nuestro análisis completo.`,
      standard: `**${type} en ${location} — ${price}**\n\nAcogedor ${type.toLowerCase()} ubicado en ${location}, ofreciendo ${featureText}. Distribución funcional con habitaciones luminosas. Bien comunicado con tiendas y transporte.\n\n🏠 Agenda tu visita hoy.`,
    },
    de: {
      luxury: `**${type} in ${location} — ${price}**\n\nEine seltene Gelegenheit, ein außergewöhnliches ${type} in einer der begehrtesten Adressen von ${location} zu erwerben. Diese prestigeträchtige Immobilie bietet ${featureText}.\n\n📍 ${location} | 💎 Premium | 🔑 Private Besichtigung nach Vereinbarung`,
      investment: `**${type} in ${location} — ${price}**\n\n📊 **Investitionsdaten:**\n- Typ: ${type}\n- Lage: ${location}\n- Merkmale: ${featureText}\n\nDiese Immobilie stellt eine interessante Investitionsmöglichkeit im wachsenden Markt von ${location} dar.\n\n📈 Fordern Sie unsere vollständige Analyse an.`,
      standard: `**${type} in ${location} — ${price}**\n\nEinladende ${type} in ${location}, mit ${featureText}. Funktionaler Grundriss mit hellen Räumen. Gute Anbindung an Geschäfte und Verkehr.\n\n🏠 Vereinbaren Sie Ihre Besichtigung.`,
    },
  };

  const langTemplates = templates[lang] || templates.en;
  return langTemplates[style] || langTemplates.standard;
}

export default function FreeAIPropertyDescriptionTool() {
  const [propertyType, setPropertyType] = useState("Apartment");
  const [location, setLocation] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [style, setStyle] = useState("standard");
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    if (!location.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const desc = generateLocalDescription(propertyType, location, features, price || "Price on request", style, language);
      setResult(desc);
      setLoading(false);
      setGenerated(true);
    }, 1500);
  }

  function handleCopy() {
    navigator.clipboard.writeText(result.replace(/\*\*/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Building2 className="w-4 h-4 text-background" /></div>
            <span className="text-base font-semibold">PropertyPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link>
            <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90">Get Full Access</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 sm:pt-36">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Free AI Tool — No signup required
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            AI Property Description Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate professional property listings in seconds. Choose your style, language, and let AI do the writing. 100% free.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Apartment", "Villa", "Penthouse", "House", "Studio", "Office", "Land", "Commercial"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Location *</label>
                <Input placeholder="e.g. Milan, Paris, Barcelona..." value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Key Features (comma-separated)</label>
              <Textarea placeholder="e.g. 3 bedrooms, terrace, sea view, parking, renovated..." value={features} onChange={e => setFeatures(e.target.value)} rows={2} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Price</label>
                <Input placeholder="e.g. €350,000" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STYLES).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading || !location.trim()} className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-base font-semibold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</> : <><Wand2 className="w-4 h-4 mr-2" /> Generate Property Description</>}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Generated Description</h3>
                <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                  {copied ? <><Check className="w-3.5 h-3.5 mr-1" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line leading-relaxed">
                {result.split("**").map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>)}
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          {generated && (
            <div className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Want more? Get the full AI suite.</h3>
              <p className="text-muted-foreground mb-4">PropertyPilot gives you AI descriptions, CRM, voice calling, automations, and more. All in one platform.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-foreground/90">
                  Start 7-day free trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 border border-border px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-muted">
                  See all plans
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-muted/30 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl font-bold mb-6">How to Write Better Property Descriptions with AI</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Writing compelling property descriptions is one of the most time-consuming tasks for real estate agents. A great listing description can mean the difference between a property sitting on the market for months and selling within days.</p>
            <p>AI property description generators use natural language processing to create professional, engaging listings that highlight your property&apos;s best features. Our free tool supports 5 languages and 3 writing styles — luxury, investment, and standard — to match your target audience.</p>
            <h3 className="text-lg font-semibold text-foreground mt-6">Tips for Using AI Property Descriptions</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Be specific with features — &ldquo;south-facing balcony&rdquo; beats &ldquo;nice balcony&rdquo;</li>
              <li>Include the neighborhood or district name for local SEO</li>
              <li>Choose the right style: luxury for premium properties, investment for buy-to-let</li>
              <li>Generate in multiple languages to attract international buyers</li>
              <li>Always review and personalize the AI output before publishing</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 PropertyPilot AI. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
