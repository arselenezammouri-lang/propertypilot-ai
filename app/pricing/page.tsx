"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { MarketingNavHeader } from "@/components/marketing-nav-header";
import { 
  CheckCircle, 
  ArrowRight,
  Rocket,
  Sparkles,
  Crown,
  Building2,
  Star,
  Shield,
  Clock,
  Headphones,
  ChevronDown,
  Gift
} from "lucide-react";
import { useState } from "react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "AI listing tools for solo agents",
    price: 197,
    period: "/ mese",
    icon: Rocket,
    gradient: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/40",
    bgClass: "bg-background",
    includes: [
      "Strumenti AI di base per annunci",
      "Per singoli agenti",
      "Accesso alle funzioni core di generazione annunci",
    ],
    cta: "Inizia con Starter",
    popular: false,
    isSubscription: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "CRM, automations & AI tools",
    price: 497,
    period: "/ mese",
    icon: Crown,
    gradient: "from-amber-400 via-blue-600 to-amber-400",
    borderColor: "border-amber-400",
    bgClass: "bg-gradient-to-b from-amber-400/10 via-amber-50 to-background",
    includes: [
      "Tutte le funzionalità Starter",
      "CRM e automazioni",
      "Strumenti AI avanzati per agenzie",
    ],
    cta: "Passa a Pro",
    popular: true,
    isSubscription: true,
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For teams up to 10 agents",
    price: 897,
    period: "/ mese",
    icon: Building2,
    gradient: "from-emerald-500 via-blue-500 to-blue-600",
    borderColor: "border-emerald-500/50",
    bgClass: "bg-background",
    includes: [
      "Tutte le funzionalità Pro",
      "Pensato per team fino a 10 agenti",
      "Gestione multi-utente / multi-agenzia",
    ],
    cta: "Passa a Agency",
    popular: false,
    isSubscription: true,
  },
  {
    id: "boost",
    name: "Agency Boost",
    tagline: "Done-for-you setup package",
    price: 2497,
    period: "una tantum",
    icon: Sparkles,
    gradient: "from-amber-400 via-amber-500 to-amber-400",
    borderColor: "border-[#FFD700]",
    bgClass: "bg-gradient-to-b from-amber-50 via-amber-50/50 to-background",
    includes: [
      "Setup completo \"done-for-you\"",
      "Implementazione e onboarding guidato",
      "Supporto premium per il lancio",
    ],
    cta: "Acquista Agency Boost",
    popular: false,
    isSubscription: false,
    isElite: true,
  },
];

const defaultFaqs = [
  { question: "Posso cambiare piano in qualsiasi momento?", answer: "Sì, puoi effettuare l'upgrade o il downgrade del tuo piano in qualsiasi momento. Le modifiche saranno applicate al prossimo ciclo di fatturazione." },
  { question: "C'è un periodo di prova gratuito?", answer: "Sì, offriamo 7 giorni di prova gratuita su tutti i piani a pagamento. Nessuna carta di credito richiesta per iniziare." },
  { question: "Cosa succede se supero i limiti del mio piano?", answer: "Ti avviseremo quando ti avvicini ai limiti. Potrai facilmente fare upgrade al piano superiore per continuare a crescere." },
  { question: "Come funziona il piano Agency?", answer: "Il piano Agency è pensato per team e multi-agenzie. Include annunci illimitati, tutte le funzionalità e supporto dedicato." },
  { question: "Posso annullare l'abbonamento?", answer: "Sì, puoi annullare in qualsiasi momento dalla dashboard. L'accesso rimarrà attivo fino alla fine del periodo già pagato." },
  { question: "Offrite supporto in italiano?", answer: "Assolutamente sì! Il nostro team di supporto è completamente italiano e disponibile via email e chat." },
];

const defaultFaqsEn = [
  { question: "Can I change plan at any time?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to the next billing cycle." },
  { question: "Is there a free trial?", answer: "Yes, we offer a 7-day free trial on all paid plans. No credit card required to get started." },
  { question: "What happens if I exceed my plan limits?", answer: "We will warn you when you get close to your limits. You can easily upgrade to the next plan to keep growing." },
  { question: "How does the Agency plan work?", answer: "The Agency plan is designed for teams and multi-agency workflows. It includes unlimited listings, all features, and dedicated support." },
  { question: "Can I cancel my subscription?", answer: "Yes, you can cancel at any time from the dashboard. Access remains active until the end of the period you already paid for." },
  { question: "Do you offer support in English?", answer: "Absolutely. Our support team is available by email and chat to help you onboard and grow." },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border/20 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-lg font-semibold pr-4 group-hover:text-blue-600 transition-colors">
          {question}
        </span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const { locale: currentLocale, currency } = useLocaleContext();

  const handlePlanClick = async (planId: string, isSubscription: boolean) => {
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // User is logged in, redirect to Stripe checkout
      if (planId === "boost") {
        window.location.href = `/api/stripe/checkout-oneshot?package=boost`;
      } else {
        window.location.href = `/api/stripe/checkout?plan=${planId.toUpperCase()}`;
      }
    } else {
      // User is not logged in, redirect to signup
      if (planId === "boost") {
        window.location.href = `/auth/signup?package=boost`;
      } else {
        window.location.href = `/auth/signup?plan=${planId}`;
      }
    }
  };

  const t = getTranslation(currentLocale as SupportedLocale);
  const pp = t.landing?.pricingPage;
  const isItalian = currentLocale === "it";
  const localizedPlans = plans.map((plan) => {
    switch (plan.id) {
      case "starter":
        return {
          ...plan,
          tagline: isItalian ? "Strumenti AI per agenti individuali" : "AI listing tools for solo agents",
          period: isItalian ? "/ mese" : "/ month",
          includes: isItalian
            ? ["Strumenti AI di base per annunci", "Per singoli agenti", "Accesso alle funzioni core di generazione annunci"]
            : ["Core AI listing tools", "Built for solo agents", "Access to essential listing generation features"],
          cta: isItalian ? "Inizia con Starter" : "Start with Starter",
        };
      case "pro":
        return {
          ...plan,
          tagline: isItalian ? "CRM, automazioni e strumenti AI" : "CRM, automations & AI tools",
          period: isItalian ? "/ mese" : "/ month",
          includes: isItalian
            ? ["Tutte le funzionalità Starter", "CRM e automazioni", "Strumenti AI avanzati per agenzie"]
            : ["Everything in Starter", "CRM and automations", "Advanced AI tools for agencies"],
          cta: isItalian ? "Passa a Pro" : "Upgrade to Pro",
        };
      case "agency":
        return {
          ...plan,
          tagline: isItalian ? "Per team fino a 10 agenti" : "For teams up to 10 agents",
          period: isItalian ? "/ mese" : "/ month",
          includes: isItalian
            ? ["Tutte le funzionalità Pro", "Pensato per team fino a 10 agenti", "Gestione multi-utente / multi-agenzia"]
            : ["Everything in Pro", "Built for teams up to 10 agents", "Multi-user / multi-agency management"],
          cta: isItalian ? "Passa a Agency" : "Upgrade to Agency",
        };
      case "boost":
        return {
          ...plan,
          tagline: isItalian ? "Pacchetto setup done-for-you" : "Done-for-you setup package",
          period: isItalian ? "una tantum" : "one-time",
          includes: isItalian
            ? ["Setup completo \"done-for-you\"", "Implementazione e onboarding guidato", "Supporto premium per il lancio"]
            : ["Complete done-for-you setup", "Guided implementation and onboarding", "Premium launch support"],
          cta: isItalian ? "Acquista Agency Boost" : "Buy Agency Boost",
        };
      default:
        return plan;
    }
  });
  const localizedFaqs = (pp?.faqs as { question: string; answer: string }[] | undefined)
    ?? (isItalian ? defaultFaqs : defaultFaqsEn);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <MarketingNavHeader />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--blue-600)/0.2),transparent_60%)]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 ai-badge mb-6 animate-fade-in-up">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-bold">{pp?.badge ?? "Prezzi Trasparenti"}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up delay-100" data-testid="text-pricing-title">
            <span className="text-gradient-blue">{pp?.mainTitle ?? "Scegli il Piano"}</span>
            <br />
            <span className="text-foreground">{pp?.mainTitle2 ?? "Perfetto per Te"}</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
            {pp?.subtitle ?? "Piani pensati per ogni fase del tuo business immobiliare. Inizia gratis, scala quando sei pronto."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-300">
            <div className="flex items-center gap-2" data-testid="trust-cancel">
              <Shield className="h-5 w-5 text-emerald-500" />
              <span>{pp?.trustCancel ?? "Cancella quando vuoi"}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-trial">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>{pp?.trustTrial ?? "Prova gratuita 7 giorni"}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-support">
              <Headphones className="h-5 w-5 text-blue-600" />
              <span>{pp?.trustSupport ?? "Supporto in italiano"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards - 4 Plans */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {localizedPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2 border-2 ${plan.borderColor} ${plan.bgClass} ${
                  plan.popular 
                    ? 'shadow-[0_0_40px_rgba(255,193,7,0.2)] md:scale-105 z-10' 
                    : (plan as any).isElite
                    ? 'shadow-[0_0_50px_rgba(255,215,0,0.3)] ring-2 ring-[#FFD700]/50'
                    : 'shadow-lg hover:shadow-xl'
                }`}
                data-testid={`card-pricing-${plan.id}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-400 via-blue-600 to-amber-400 text-white rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-white" />
                      {isItalian ? "Consigliato" : "Recommended"}
                    </span>
                  </div>
                )}
                
                {/* Elite Badge for Agency Boost */}
                {(plan as any).isElite && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black rounded-full shadow-lg animate-pulse border border-amber-300">
                        <Gift className="h-5 w-5 animate-bounce" />
                        {isItalian ? "OFFERTA ELITE" : "ELITE OFFER"}
                        <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full blur-md opacity-50 -z-10 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6 pt-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Plan Name & Tagline */}
                <div className="mb-4">
                  <h3 className={`text-2xl font-bold mb-1 ${plan.popular ? 'gradient-text-gold' : ''}`}>
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-extrabold">
                      {formatCurrencyForLocale(plan.price, currentLocale as Locale, currency)}
                    </span>
                    <span className="text-lg text-muted-foreground whitespace-nowrap">
                      {plan.period}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{isItalian ? "IVA esclusa" : "VAT excluded"}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.includes.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-amber-500' : 'text-emerald-500'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  size="lg" 
                  onClick={() => handlePlanClick(plan.id, plan.isSubscription)}
                  className={`w-full text-base py-6 font-bold group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-amber-400 via-blue-600 to-amber-400 hover:opacity-90 text-white shadow-lg' 
                      : `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white`
                  }`}
                  data-testid={`button-pricing-${plan.id}`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-foreground/5 dark:bg-foreground/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-gradient-blue">{pp?.whyChoose ?? "Perché Scegliere PropertyPilot AI?"}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {pp?.whySubtitle ?? "Funzionalità premium per ogni professionista del real estate"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {((pp?.features ?? [
              { title: "AI GPT-4 Premium", desc: "Modelli AI più avanzati del mercato" },
              { title: "100% Italiano", desc: "Contenuti ottimizzati per il mercato italiano" },
              { title: "Generazione Istantanea", desc: "Risultati in meno di 30 secondi" },
              { title: "Facile da Usare", desc: "Nessuna competenza tecnica richiesta" },
              { title: "Annunci Professionali", desc: "Qualità da agenzia di comunicazione" },
              { title: "Multi-Agenzia", desc: "Gestisci più sedi con un solo account" },
            ]) as { title: string; desc: string }[]).map((feat, index) => {
              const icons = [Sparkles, Shield, Clock, Rocket, Crown, Building2];
              const Icon = icons[index] ?? Sparkles;
              return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/20 hover:border-blue-600/30 transition-colors"
                data-testid={`feature-${feat.title.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-gradient-blue">{pp?.faqTitle ?? "Domande Frequenti"}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {pp?.faqSubtitle ?? "Tutto quello che devi sapere sui nostri piani"}
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-border/20 p-6 md:p-8">
            {localizedFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/10 via-background to-amber-50 border border-border/20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {pp?.ctaTitle ?? "Pronto a Trasformare i Tuoi Annunci?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {pp?.ctaSubtitle ?? "Inizia gratis oggi e scopri come l'AI può elevare il tuo business immobiliare."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="neon-button text-lg py-6 px-8" data-testid="button-cta-signup">
                  {pp?.ctaStartFree ?? "Inizia Gratis"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-2" data-testid="button-cta-demo">
                  {pp?.ctaWatchDemo ?? "Guarda la Demo"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            {isItalian ? "Domande Frequenti" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: isItalian ? "Posso cancellare in qualsiasi momento?" : "Can I cancel anytime?",
                a: isItalian ? "Sì, puoi cancellare il tuo abbonamento in qualsiasi momento dalla dashboard. Nessun vincolo, nessuna penale." : "Yes, you can cancel your subscription anytime from your dashboard. No lock-in, no penalties.",
              },
              {
                q: isItalian ? "C'è un periodo di prova gratuito?" : "Is there a free trial?",
                a: isItalian ? "Sì, offriamo 7 giorni di prova gratuita su tutti i piani. Non serve carta di credito per iniziare." : "Yes, we offer a 7-day free trial on all plans. No credit card required to start.",
              },
              {
                q: isItalian ? "Quali portali immobiliari supportate?" : "Which property portals do you support?",
                a: isItalian ? "Generiamo annunci ottimizzati per Immobiliare.it, Idealista, Casa.it, SeLoger, Rightmove e altri 20+ portali europei." : "We generate listings optimized for Immobiliare.it, Idealista, Casa.it, SeLoger, Rightmove, and 20+ European portals.",
              },
              {
                q: isItalian ? "In quante lingue posso generare annunci?" : "How many languages can I generate listings in?",
                a: isItalian ? "6 lingue: Italiano, Inglese, Francese, Spagnolo, Tedesco e Arabo. Traduzioni professionali, non Google Translate." : "6 languages: Italian, English, French, Spanish, German, and Arabic. Professional translations, not Google Translate.",
              },
              {
                q: isItalian ? "Posso cambiare piano in qualsiasi momento?" : "Can I change plans anytime?",
                a: isItalian ? "Sì, puoi passare a un piano superiore o inferiore in qualsiasi momento. La differenza viene calcolata automaticamente." : "Yes, you can upgrade or downgrade anytime. The difference is automatically prorated.",
              },
              {
                q: isItalian ? "I miei dati sono sicuri?" : "Is my data secure?",
                a: isItalian ? "Assolutamente. Utilizziamo crittografia AES-256, i server sono in EU (GDPR compliant), e non condividiamo mai i tuoi dati con terze parti." : "Absolutely. We use AES-256 encryption, servers are in the EU (GDPR compliant), and we never share your data with third parties.",
              },
            ].map((item, i) => (
              <details key={i} className="group pp-card p-5 cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 PropertyPilot AI. {isItalian ? "Tutti i diritti riservati." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              {isItalian ? "Termini di Servizio" : "Terms of Service"}
            </Link>
            <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
              {isItalian ? "Politica Rimborsi" : "Refund Policy"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
