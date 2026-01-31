"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
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

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "AI listing tools for solo agents",
    price: 197,
    period: "/ mese",
    icon: Rocket,
    gradient: "from-electric-blue to-royal-purple",
    borderColor: "border-electric-blue/40",
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
    gradient: "from-sunset-gold via-royal-purple to-sunset-gold",
    borderColor: "border-sunset-gold",
    bgClass: "bg-gradient-to-b from-sunset-gold/10 via-sunset-gold/5 to-background",
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
    gradient: "from-neon-aqua via-electric-blue to-royal-purple",
    borderColor: "border-neon-aqua/50",
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
    gradient: "from-sunset-gold to-orange-500",
    borderColor: "border-orange-500/50",
    bgClass: "bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-background",
    includes: [
      "Setup completo \"done-for-you\"",
      "Implementazione e onboarding guidato",
      "Supporto premium per il lancio",
    ],
    cta: "Acquista Agency Boost",
    popular: false,
    isSubscription: false,
  },
];

const faqs = [
  {
    question: "Posso cambiare piano in qualsiasi momento?",
    answer: "Sì, puoi effettuare l'upgrade o il downgrade del tuo piano in qualsiasi momento. Le modifiche saranno applicate al prossimo ciclo di fatturazione."
  },
  {
    question: "C'è un periodo di prova gratuito?",
    answer: "Sì, offriamo 7 giorni di prova gratuita su tutti i piani a pagamento. Nessuna carta di credito richiesta per iniziare."
  },
  {
    question: "Cosa succede se supero i limiti del mio piano?",
    answer: "Ti avviseremo quando ti avvicini ai limiti. Potrai facilmente fare upgrade al piano superiore per continuare a crescere."
  },
  {
    question: "Come funziona il piano Agency?",
    answer: "Il piano Agency è pensato per team e multi-agenzie. Include annunci illimitati, tutte le funzionalità e supporto dedicato."
  },
  {
    question: "Posso annullare l'abbonamento?",
    answer: "Sì, puoi annullare in qualsiasi momento dalla dashboard. L'accesso rimarrà attivo fino alla fine del periodo già pagato."
  },
  {
    question: "Offrite supporto in italiano?",
    answer: "Assolutamente sì! Il nostro team di supporto è completamente italiano e disponibile via email e chat."
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-silver-frost/20 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="text-lg font-semibold pr-4 group-hover:text-royal-purple transition-colors">
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

  const handlePlanClick = async (planId: string, isSubscription: boolean) => {
    console.log(`Plan selected: ${planId}, isSubscription: ${isSubscription}`);
    
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // User is logged in, redirect to Stripe checkout
      if (planId === "boost") {
        window.location.href = `/api/stripe/checkout?package=boost`;
      } else {
        window.location.href = `/api/stripe/checkout?plan=${planId}`;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <img src="/logo.png" alt="PropertyPilot AI" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Link href="/demo">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-sunset-gold transition-colors" data-testid="button-demo">
                  Demo
                </Button>
              </Link>
              <Link href="/#features">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-royal-purple transition-colors" data-testid="button-features">
                  Funzionalità
                </Button>
              </Link>
              <Link href="/contatti">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-royal-purple transition-colors" data-testid="button-contatti">
                  Contatti
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-royal-purple transition-colors" data-testid="button-login">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="neon-button" data-testid="button-signup">
                  Inizia Gratis
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--royal-purple)/0.2),transparent_60%)]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 ai-badge mb-6 animate-fade-in-up">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-bold">Prezzi Trasparenti</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up delay-100" data-testid="text-pricing-title">
            <span className="gradient-text-purple">Scegli il Piano</span>
            <br />
            <span className="text-foreground">Perfetto per Te</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
            Piani pensati per ogni fase del tuo business immobiliare.
            <br className="hidden md:inline" />
            Inizia gratis, scala quando sei pronto.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-300">
            <div className="flex items-center gap-2" data-testid="trust-cancel">
              <Shield className="h-5 w-5 text-neon-aqua" />
              <span>Cancella quando vuoi</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-trial">
              <Clock className="h-5 w-5 text-electric-blue" />
              <span>Prova gratuita 7 giorni</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-support">
              <Headphones className="h-5 w-5 text-royal-purple" />
              <span>Supporto in italiano</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards - 4 Plans */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2 border-2 ${plan.borderColor} ${plan.bgClass} ${
                  plan.popular 
                    ? 'shadow-[0_0_40px_rgba(255,193,7,0.2)] md:scale-105 z-10' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
                data-testid={`card-pricing-${plan.id}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunset-gold via-royal-purple to-sunset-gold text-white rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-white" />
                      Consigliato
                    </span>
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
                      €{plan.price}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">IVA esclusa</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.includes.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-sunset-gold' : 'text-neon-aqua'
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
                      ? 'bg-gradient-to-r from-sunset-gold via-royal-purple to-sunset-gold hover:opacity-90 text-white shadow-lg' 
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
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5 dark:bg-luxury-indigo/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="gradient-text-purple">Perché Scegliere PropertyPilot AI?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Funzionalità premium per ogni professionista del real estate
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Sparkles, title: "AI GPT-4 Premium", desc: "Modelli AI più avanzati del mercato" },
              { icon: Shield, title: "100% Italiano", desc: "Contenuti ottimizzati per il mercato italiano" },
              { icon: Clock, title: "Generazione Istantanea", desc: "Risultati in meno di 30 secondi" },
              { icon: Rocket, title: "Facile da Usare", desc: "Nessuna competenza tecnica richiesta" },
              { icon: Crown, title: "Annunci Professionali", desc: "Qualità da agenzia di comunicazione" },
              { icon: Building2, title: "Multi-Agenzia", desc: "Gestisci più sedi con un solo account" },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-silver-frost/20 hover:border-royal-purple/30 transition-colors"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-purple/20 to-electric-blue/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-royal-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="gradient-text-purple">Domande Frequenti</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tutto quello che devi sapere sui nostri piani
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-silver-frost/20 p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-royal-purple/10 via-background to-sunset-gold/10 border border-silver-frost/20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Pronto a <span className="gradient-text-gold">Trasformare</span> i Tuoi Annunci?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Inizia gratis oggi e scopri come l'AI può elevare il tuo business immobiliare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="neon-button text-lg py-6 px-8" data-testid="button-cta-signup">
                  Inizia Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-2" data-testid="button-cta-demo">
                  Guarda la Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-silver-frost/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 PropertyPilot AI. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Termini di Servizio
            </Link>
            <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
              Politica Rimborsi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
