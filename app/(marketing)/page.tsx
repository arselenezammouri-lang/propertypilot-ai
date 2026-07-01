"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, Check, Globe, Sparkles, Phone, Shield,
  FileSearch, ImagePlus, Zap, MessageCircle, BarChart3,
  Building2, Bot, Target, ChevronRight, Users, Lock,
  Home, FileText, Leaf, Calculator, TrendingUp, Star,
  Mail, Play, ChevronDown, ExternalLink, Crown, Rocket,
  Eye, Award, Scale, Landmark, Gift
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { MarketingNavHeader } from "@/components/marketing-nav-header";
import { PropertyPilotLogo } from "@/components/logo";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left group">
        <span className="font-medium text-foreground group-hover:text-primary transition-colors pr-4">{q}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-muted-foreground text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function LandingPage() {
  const { locale } = useLocale();
  const it = locale === 'it';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNavHeader />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-background to-background" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {it ? 'Piattaforma AI per il Real Estate EU' : 'AI Platform for EU Real Estate'}
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              {it ? (
                <><span className="text-foreground">L'AI che </span><span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">vende case</span><span className="text-foreground"> per te.</span></>
              ) : (
                <><span className="text-foreground">The AI that </span><span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">sells properties</span><span className="text-foreground"> for you.</span></>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {it
                ? 'Genera annunci in 8 secondi. Pubblica su 16 portali EU. Chiama lead con Voice AI. Tutto GDPR-native, in 6 lingue.'
                : 'Generate listings in 8 seconds. Publish to 16 EU portals. Call leads with Voice AI. All GDPR-native, in 6 languages.'}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link href="/auth/signup">
                  {it ? 'Prova gratis 14 giorni' : 'Start free 14-day trial'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <Link href="/demo">
                  <Play className="h-4 w-4 mr-2" />
                  {it ? 'Guarda demo' : 'Watch demo'}
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-blue-500" />EU-hosted</span>
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" />GDPR-native</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-purple-500" />AI-powered</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" />{it ? 'Nessuna carta richiesta' : 'No credit card'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <section className="border-y border-border/30 bg-muted/30 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">{it ? 'Costruito su tecnologie fidate da' : 'Built on trusted technologies'}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8 opacity-60">
            {['Vercel', 'Supabase', 'Stripe', 'OpenAI', 'Google Cloud'].map(name => (
              <span key={name} className="text-sm font-semibold text-muted-foreground tracking-wide">{name}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: '100+', l: it ? 'Funzionalità' : 'Features' },
              { n: '16', l: it ? 'Portali EU' : 'EU Portals' },
              { n: '27', l: it ? 'Integrazioni' : 'Integrations' },
              { n: '6', l: it ? 'Lingue' : 'Languages' },
            ].map(s => (
              <div key={s.l}>
                <p className="text-3xl font-bold text-foreground">{s.n}</p>
                <p className="text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRY IT NOW ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {it ? 'Prova ADESSO — Senza registrazione' : 'Try NOW — No signup required'}
            </h2>
            <p className="text-muted-foreground text-lg">{it ? '6 strumenti gratuiti. Nessuna carta. Nessun impegno.' : '6 free tools. No card. No commitment.'}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, name: it ? 'Valutazione Istantanea' : 'Instant Valuation', desc: it ? 'Stima qualsiasi immobile EU in 3 secondi' : 'Estimate any EU property in 3 seconds', href: '/tools/instant-valuation', color: 'text-emerald-500' },
              { icon: Leaf, name: it ? 'Impronta CO₂' : 'Carbon Footprint', desc: it ? 'Calcola emissioni + incentivi green EU' : 'Calculate emissions + EU green incentives', href: '/tools/carbon-footprint', color: 'text-green-500' },
              { icon: Landmark, name: it ? 'Calcolatore Mutuo' : 'Mortgage Calculator', desc: it ? 'Mutui con regole fiscali 6 paesi' : 'Mortgages with 6-country tax rules', href: '/tools/mortgage-calculator', color: 'text-blue-500' },
              { icon: BarChart3, name: it ? 'Calcolatore ROI' : 'ROI Calculator', desc: it ? 'Analisi investimento immobiliare' : 'Real estate investment analysis', href: '/tools/roi-calculator', color: 'text-purple-500' },
              { icon: Calculator, name: it ? 'Costi Trasferimento' : 'Transfer Costs', desc: it ? 'Tasse acquisto per paese EU' : 'Purchase taxes per EU country', href: '/tools/cma-calculator', color: 'text-orange-500' },
              { icon: Sparkles, name: it ? 'Descrizione AI' : 'AI Description', desc: it ? 'Descrizione portale in 8 secondi' : 'Portal description in 8 seconds', href: '/tools/ai-property-description', color: 'text-indigo-500' },
            ].map(tool => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full hover:border-primary/40 transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl bg-muted ${tool.color}`}><Icon className="h-5 w-5" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{tool.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 12 FEATURE CATEGORIES ═══ */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {it ? 'Tutto ciò che serve alla tua agenzia' : 'Everything your agency needs'}
            </h2>
            <p className="text-muted-foreground text-lg">{it ? '100+ funzionalità in 12 categorie. Una piattaforma unica.' : '100+ features in 12 categories. One platform.'}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { icon: Home, name: 'AI Listings', count: 8, items: [it ? 'Generazione 6 lingue' : '6-language generation', it ? 'SEO ottimizzato' : 'SEO optimized', it ? 'Compliance check' : 'Compliance check', it ? 'Multi-portale' : 'Multi-portal'], color: 'from-blue-500 to-indigo-500' },
              { icon: Users, name: 'CRM & Leads', count: 10, items: [it ? 'Pipeline AI scoring' : 'AI scoring pipeline', it ? 'Predictive leads' : 'Predictive leads', 'Speed-to-Lead', 'Import CSV/Excel'], color: 'from-emerald-500 to-teal-500' },
              { icon: BarChart3, name: it ? 'Analisi & Valutazioni' : 'Analysis & Valuations', count: 8, items: ['CMA + Google Maps', 'Instant AVM', 'ROI + Monte Carlo', 'Market Intelligence'], color: 'from-purple-500 to-violet-500' },
              { icon: ImagePlus, name: 'Visual AI', count: 6, items: ['Virtual staging', it ? 'Rimozione oggetti' : 'Object removal', it ? 'Sostituzione cielo' : 'Sky replacement', '4x upscale'], color: 'from-pink-500 to-rose-500' },
              { icon: Phone, name: 'Voice AI', count: 5, items: ['Bland AI agent', 'ElevenLabs cloning', it ? 'Voice tour narrazione' : 'Voice tour narration', it ? 'Auto-scheduling' : 'Auto-scheduling'], color: 'from-orange-500 to-amber-500' },
              { icon: MessageCircle, name: 'WhatsApp & Chat', count: 6, items: ['WhatsApp Business AI', it ? 'Chatbot multi-canale' : 'Multi-channel chatbot', it ? 'Auto-traduzione' : 'Auto-translate', it ? 'Analisi sentimento' : 'Sentiment analysis'], color: 'from-green-500 to-emerald-500' },
              { icon: Globe, name: it ? 'Portali (16+)' : 'Portals (16+)', count: 16, items: ['Immobiliare, Idealista', 'ImmoScout24, EstateSync', 'SeLoger, Rightmove', it ? '+ 10 altri EU' : '+ 10 more EU'], color: 'from-cyan-500 to-blue-500' },
              { icon: Zap, name: it ? 'Automazioni' : 'Automations', count: 10, items: [it ? '10+ template' : '10+ templates', 'Email drip campaigns', 'Follow-up sequences', it ? 'Trigger comportamentali' : 'Behavioral triggers'], color: 'from-yellow-500 to-orange-500' },
              { icon: FileText, name: it ? 'Documenti & E-Sign' : 'Documents & E-Sign', count: 7, items: [it ? '22 template legali' : '22 legal templates', 'DocuSign / YouSign', 'eIDAS compliant', it ? 'Mandati multi-paese' : 'Multi-country mandates'], color: 'from-slate-500 to-zinc-500' },
              { icon: Building2, name: 'Team & White-label', count: 6, items: [it ? '5 ruoli utente' : '5 user roles', it ? 'Portale clienti branded' : 'Branded client portal', 'Custom domain', 'API + Webhooks'], color: 'from-indigo-500 to-blue-500' },
              { icon: Shield, name: it ? 'Sicurezza & Compliance' : 'Security & Compliance', count: 8, items: ['GDPR-native', '2FA + audit log', 'EU AI Act disclosure', it ? 'Crittografia AES-256' : 'AES-256 encryption'], color: 'from-red-500 to-rose-500' },
              { icon: Target, name: it ? 'Marketing Tools' : 'Marketing Tools', count: 6, items: ['Social publishing', 'Email campaigns', it ? 'Programma referral' : 'Referral program', it ? 'Retention flows' : 'Retention flows'], color: 'from-fuchsia-500 to-pink-500' },
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <Card key={cat.name} className="hover:border-primary/30 transition-all group overflow-hidden">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{cat.count} {it ? 'funzionalità' : 'features'}</p>
                    <ul className="space-y-1">
                      {cat.items.map(item => (
                        <li key={item} className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {it ? 'Perché le agenzie EU scelgono PropertyPilot' : 'Why EU agencies choose PropertyPilot'}
            </h2>
            <p className="text-muted-foreground">{it ? 'Comparazione onesta con CRM generici e tool USA' : 'Honest comparison with generic CRMs and US tools'}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">{it ? 'Funzionalità' : 'Feature'}</th>
                  <th className="py-3 px-4 font-bold text-primary bg-primary/5">PropertyPilot</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">Zoho</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground">HubSpot</th>
                  <th className="py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Pipedrive</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [it ? 'AI Listings 6 lingue' : 'AI Listings 6 langs', '✅', '❌', '❌', '❌'],
                  [it ? '16 portali EU' : '16 EU portals', '✅', '❌', '❌', '❌'],
                  ['Voice AI', '✅', '❌', '❌', '❌'],
                  ['WhatsApp AI', '✅', '❌', '⚠️', '❌'],
                  [it ? 'Compliance Shield EU' : 'EU Compliance Shield', '✅', '❌', '❌', '❌'],
                  ['Virtual Staging AI', '✅', '❌', '❌', '❌'],
                  ['GDPR-native EU', '✅', '⚠️', '⚠️', '⚠️'],
                  [it ? 'Specifico immobiliare' : 'Real estate specific', '✅', '❌', '❌', '❌'],
                  [it ? 'Prezzo Starter' : 'Starter price', '€197', '€14', '€45', '€14'],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="py-3 px-4 text-foreground font-medium">{row[0]}</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-medium">{row[1]}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row[2]}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row[3]}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden md:table-cell">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
            {it
              ? 'PropertyPilot è progettato ESCLUSIVAMENTE per agenzie immobiliari europee. Non un CRM generico adattato.'
              : 'PropertyPilot is built EXCLUSIVELY for European real estate agencies. Not a generic CRM adapted.'}
          </p>
        </div>
      </section>

      {/* ═══ EARLY ACCESS ═══ */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {it ? 'Programma Early Access' : 'Early Access Program'}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {it
              ? 'Cerchiamo le prime 20 agenzie partner in Europa. Sconto 50% per 6 mesi, onboarding personalizzato, canale diretto con il founder.'
              : "We're looking for the first 20 partner agencies in Europe. 50% off for 6 months, personalized onboarding, direct channel with the founder."}
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link href="/auth/signup">
              {it ? 'Applica per Early Access' : 'Apply for Early Access'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {it ? 'Prezzi trasparenti' : 'Transparent pricing'}
            </h2>
            <p className="text-muted-foreground">{it ? 'Nessuna sorpresa. Cancella quando vuoi.' : 'No surprises. Cancel anytime.'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: 197, icon: Rocket, features: [it ? '50 AI listings/mese' : '50 AI listings/mo', it ? '1 portale' : '1 portal', it ? 'Lead Scoring' : 'Lead Scoring', it ? '1 utente' : '1 user'], popular: false },
              { name: 'Pro', price: 497, icon: Crown, features: [it ? '200 AI listings' : '200 AI listings', it ? 'Tutti i 16 portali' : 'All 16 portals', 'Voice + WhatsApp AI', it ? '5 utenti' : '5 users'], popular: true },
              { name: 'Agency', price: 897, icon: Building2, features: [it ? 'UNLIMITED tutto' : 'UNLIMITED everything', 'White-label + API', it ? '25 utenti' : '25 users', it ? 'Support dedicato 4h' : 'Dedicated support 4h'], popular: false },
            ].map(plan => {
              const Icon = plan.icon;
              return (
                <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/10 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3"><Star className="h-3 w-3 mr-1 fill-current" />{it ? 'Più scelto' : 'Most popular'}</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-3xl font-extrabold text-foreground mt-2">€{plan.price}<span className="text-base font-normal text-muted-foreground">/{it ? 'mese' : 'mo'}</span></p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'} asChild>
                      <Link href="/auth/signup">{it ? 'Prova gratis 14 giorni' : 'Start free 14-day trial'}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {it ? 'IVA esclusa. Risparmia 20% con fatturazione annuale.' : 'VAT excluded. Save 20% with annual billing.'}
            <Link href="/pricing" className="text-primary ml-2 hover:underline">{it ? 'Tutti i piani →' : 'All plans →'}</Link>
          </p>
        </div>
      </section>

      {/* ═══ TRUST & SECURITY ═══ */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">{it ? 'Sicurezza e privacy. Priorità assoluta.' : 'Security and privacy. Absolute priority.'}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe, title: 'EU-Hosted', desc: it ? 'Server Vercel + Supabase Ireland. Mai fuori dall\'UE.' : 'Vercel + Supabase Ireland servers. Never outside EU.' },
              { icon: Shield, title: 'GDPR-Native', desc: it ? 'Cookie consent granulare, right to be forgotten, data portability.' : 'Granular cookie consent, right to be forgotten, data portability.' },
              { icon: Lock, title: it ? 'Bank-Grade' : 'Bank-Grade', desc: it ? 'AES-256 encryption. 2FA. OWASP Top 10.' : 'AES-256 encryption. 2FA. OWASP Top 10.' },
              { icon: Scale, title: 'EU AI Act', desc: it ? 'Trasparenza AI completa. Opt-out disponibile.' : 'Full AI transparency. Opt-out available.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-emerald-500/10">
                  <CardContent className="p-5 text-center">
                    <Icon className="h-6 w-6 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-center mt-6"><Link href="/security" className="text-sm text-primary hover:underline">{it ? 'Vedi pagina sicurezza →' : 'See security page →'}</Link></p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">{it ? 'Domande frequenti' : 'FAQ'}</h2>
          {[
            [it ? 'Devo inserire la carta di credito?' : 'Do I need a credit card?', it ? 'No. La prova gratuita di 14 giorni non richiede carta di credito.' : 'No. The 14-day free trial requires no credit card.'],
            [it ? 'Quali paesi supporta?' : 'Which countries are supported?', it ? 'Italia, Francia, Spagna, Germania, UK, Portogallo. 6 lingue complete.' : 'Italy, France, Spain, Germany, UK, Portugal. 6 full languages.'],
            [it ? 'Come funziona la pubblicazione portali?' : 'How does portal publishing work?', it ? 'Compili una volta, pubblichi su 16+ portali contemporaneamente con 1 click.' : 'Fill in once, publish to 16+ portals simultaneously with 1 click.'],
            [it ? 'In cosa è diverso da HubSpot o Zoho?' : 'How is it different from HubSpot or Zoho?', it ? 'PropertyPilot è progettato ESCLUSIVAMENTE per agenzie immobiliari EU. AI native, portali EU, GDPR compliance. Non un CRM generico.' : 'PropertyPilot is built EXCLUSIVELY for EU real estate agencies. Native AI, EU portals, GDPR compliance. Not a generic CRM.'],
            [it ? 'Posso importare i miei clienti?' : 'Can I import my existing clients?', it ? 'Sì, tramite CSV/Excel con rilevamento duplicati automatico.' : 'Yes, via CSV/Excel with automatic duplicate detection.'],
            [it ? 'Posso cancellare quando voglio?' : 'Can I cancel anytime?', it ? 'Sì. Nessun contratto vincolante. Cancelli dal dashboard billing in 2 click.' : 'Yes. No binding contract. Cancel from dashboard billing in 2 clicks.'],
            [it ? 'Che dati sono al sicuro?' : 'Is my data safe?', it ? 'Server EU (Ireland). GDPR native. AES-256 encryption. Zero data venduti a terzi.' : 'EU servers (Ireland). GDPR native. AES-256 encryption. Zero data sold to third parties.'],
            [it ? "C'è un piano per grandi agenzie?" : 'Is there a plan for large agencies?', it ? 'Sì. Agency (€897/mese) copre 25 utenti. Per volumi superiori contattaci.' : 'Yes. Agency (€897/mo) covers 25 users. For larger volumes contact us.'],
          ].map(([q, a]) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {it ? 'Pronto a rivoluzionare la tua agenzia?' : 'Ready to revolutionize your agency?'}
          </h2>
          <p className="text-blue-200/80 text-lg mb-8">
            {it ? 'Prova PropertyPilot gratis per 14 giorni. Nessuna carta di credito.' : 'Try PropertyPilot free for 14 days. No credit card required.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="text-base px-8 h-12 bg-white text-slate-900 hover:bg-white/90" asChild>
              <Link href="/auth/signup">{it ? 'Inizia gratis ora' : 'Start free now'}<ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/demo"><Mail className="h-4 w-4 mr-2" />{it ? 'Prenota demo con founder' : 'Book demo with founder'}</Link>
            </Button>
          </div>
          <p className="text-blue-300/60 text-sm mt-6">
            {it ? 'Domande? support@propertypilot.ai — Rispondiamo entro 24h' : 'Questions? support@propertypilot.ai — We respond within 24h'}
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PropertyPilotLogo className="h-6 w-6" />
              <span className="font-bold text-foreground">PropertyPilot AI</span>
            </div>
            <p className="text-sm text-muted-foreground">{it ? "L'AI che vende case per te." : 'The AI that sells properties for you.'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{it ? 'Prodotto' : 'Product'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-primary">Features</Link></li>
              <li><Link href="/changelog" className="hover:text-primary">Changelog</Link></li>
              <li><Link href="/docs/api" className="hover:text-primary">API Docs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{it ? 'Azienda' : 'Company'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">{it ? 'Chi siamo' : 'About'}</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary">{it ? 'Contatti' : 'Contact'}</Link></li>
              <li><Link href="/demo" className="hover:text-primary">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{it ? 'Supporto' : 'Support'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/status" className="hover:text-primary">Status</Link></li>
              <li><Link href="/security" className="hover:text-primary">{it ? 'Sicurezza' : 'Security'}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">{it ? 'Termini' : 'Terms'}</Link></li>
              <li><Link href="/ai-disclosure" className="hover:text-primary">AI Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PropertyPilot AI. {it ? 'Tutti i diritti riservati.' : 'All rights reserved.'} Milano, Italia 🇮🇹
        </div>
      </footer>
    </main>
  );
}
