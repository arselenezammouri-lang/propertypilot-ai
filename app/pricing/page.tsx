"use client";

import Link from "next/link";
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
  Gift,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import type { PricingPagePlansUi } from "@/lib/i18n/pricing-page-plans-ui";

const PLAN_STATIC = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 197,
    icon: Rocket,
    gradient: "from-electric-blue to-royal-purple",
    borderColor: "border-electric-blue/40",
    bgClass: "bg-background",
    popular: false,
    isSubscription: true,
    isElite: false,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 497,
    icon: Crown,
    gradient: "from-sunset-gold via-royal-purple to-sunset-gold",
    borderColor: "border-sunset-gold",
    bgClass: "bg-gradient-to-b from-sunset-gold/10 via-sunset-gold/5 to-background",
    popular: true,
    isSubscription: true,
    isElite: false,
  },
  {
    id: "agency" as const,
    name: "Agency",
    price: 897,
    icon: Building2,
    gradient: "from-neon-aqua via-electric-blue to-royal-purple",
    borderColor: "border-neon-aqua/50",
    bgClass: "bg-background",
    popular: false,
    isSubscription: true,
    isElite: false,
  },
  {
    id: "boost" as const,
    name: "Agency Boost",
    price: 2497,
    icon: Sparkles,
    gradient: "from-[#FFD700] via-[#FFA500] to-[#FFD700]",
    borderColor: "border-[#FFD700]",
    bgClass: "bg-gradient-to-b from-[#FFD700]/15 via-[#FFA500]/10 to-background",
    popular: false,
    isSubscription: false,
    isElite: true,
  },
];

function mergePlanCopy(
  p: (typeof PLAN_STATIC)[number],
  cards: PricingPagePlansUi
): typeof PLAN_STATIC[number] & {
  tagline: string;
  period: string;
  includes: string[];
  cta: string;
} {
  const card =
    p.id === "starter"
      ? cards.starter
      : p.id === "pro"
        ? cards.pro
        : p.id === "agency"
          ? cards.agency
          : cards.boost;
  return {
    ...p,
    tagline: card.tagline,
    period: card.period,
    includes: card.includes,
    cta: card.cta,
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const testId = `faq-toggle-${question.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`;

  return (
    <div className="border-b border-silver-frost/20 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
        data-testid={testId}
      >
        <span className="text-lg font-semibold pr-4 group-hover:text-royal-purple transition-colors">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}>
        <p className="text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { locale: currentLocale, currency } = useLocaleContext();

  const handlePlanClick = async (planId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (planId === "boost") {
        window.location.href = `/api/stripe/checkout-oneshot?package=boost`;
      } else {
        window.location.href = `/api/stripe/checkout?plan=${planId.toUpperCase()}`;
      }
    } else {
      if (planId === "boost") {
        window.location.href = `/auth/signup?package=boost`;
      } else {
        window.location.href = `/auth/signup?plan=${planId}`;
      }
    }
  };

  const t = useMemo(() => getTranslation(currentLocale as SupportedLocale), [currentLocale]);
  const pp = t.landing?.pricingPage;
  const cards = t.pricingPagePlans;

  const localizedPlans = useMemo(
    () => PLAN_STATIC.map((p) => mergePlanCopy(p, cards)),
    [cards]
  );

  const localizedFaqs = pp?.faqs ?? [];

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <MarketingNavHeader />

      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--royal-purple)/0.2),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 ai-badge mb-6 animate-fade-in-up">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-bold">{pp?.badge ?? "—"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up delay-100" data-testid="text-pricing-title">
            <span className="gradient-text-purple">{pp?.mainTitle ?? "—"}</span>
            <br />
            <span className="text-foreground">{pp?.mainTitle2 ?? ""}</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
            {pp?.subtitle ?? ""}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up delay-300">
            <div className="flex items-center gap-2" data-testid="trust-cancel">
              <Shield className="h-5 w-5 text-neon-aqua" />
              <span>{pp?.trustCancel}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-trial">
              <Clock className="h-5 w-5 text-electric-blue" />
              <span>{pp?.trustTrial}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="trust-support">
              <Headphones className="h-5 w-5 text-royal-purple" />
              <span>{pp?.trustSupport}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {localizedPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2 border-2 ${plan.borderColor} ${plan.bgClass} ${
                  plan.popular
                    ? "shadow-[0_0_40px_rgba(255,193,7,0.2)] md:scale-105 z-10"
                    : plan.isElite
                      ? "shadow-[0_0_50px_rgba(255,215,0,0.3)] ring-2 ring-[#FFD700]/50"
                      : "shadow-lg hover:shadow-xl"
                }`}
                data-testid={`card-pricing-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunset-gold via-royal-purple to-sunset-gold text-white rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-white" />
                      {cards.popularBadge}
                    </span>
                  </div>
                )}

                {plan.isElite && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-black rounded-full shadow-[0_0_30px_rgba(255,215,0,0.6),0_0_60px_rgba(255,215,0,0.3)] animate-pulse border-2 border-[#FFD700]/50">
                        <Gift className="h-5 w-5 animate-bounce" />
                        {cards.eliteOfferBadge}
                        <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: "3s" }} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-full blur-md opacity-50 -z-10 animate-pulse" />
                    </div>
                  </div>
                )}

                <div className="mb-6 pt-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className={`text-2xl font-bold mb-1 ${plan.popular ? "gradient-text-gold" : ""}`}>{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-extrabold">
                      {formatCurrencyForLocale(plan.price, currentLocale as Locale, currency)}
                    </span>
                    <span className="text-lg text-muted-foreground whitespace-nowrap">{plan.period}</span>
                  </div>
                  {plan.price > 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">{cards.vatExcluded}</p>
                  ) : null}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.includes.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-sunset-gold" : "text-neon-aqua"}`}
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  type="button"
                  onClick={() => void handlePlanClick(plan.id)}
                  className={`w-full text-base py-6 font-bold group ${
                    plan.popular
                      ? "bg-gradient-to-r from-sunset-gold via-royal-purple to-sunset-gold hover:opacity-90 text-white shadow-lg"
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

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5 dark:bg-luxury-indigo/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="gradient-text-purple">{pp?.whyChoose}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{pp?.whySubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(pp?.features ?? []).map((feat, index) => {
              const icons = [Sparkles, Shield, Clock, Rocket, Crown, Building2];
              const Icon = icons[index] ?? Sparkles;
              return (
                <div
                  key={`${feat.title}-${index}`}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-silver-frost/20 hover:border-royal-purple/30 transition-colors"
                  data-testid={`feature-${feat.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-purple/20 to-electric-blue/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-royal-purple" />
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

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="gradient-text-purple">{pp?.faqTitle}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{pp?.faqSubtitle}</p>
          </div>

          <div className="bg-background rounded-2xl border border-silver-frost/20 p-6 md:p-8">
            {localizedFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-royal-purple/10 via-background to-sunset-gold/10 border border-silver-frost/20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{pp?.ctaTitle}</h2>
            <p className="text-lg text-muted-foreground mb-8">{pp?.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="neon-button text-lg py-6 px-8" data-testid="button-cta-signup">
                  {pp?.ctaStartFree}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-2" data-testid="button-cta-demo">
                  {pp?.ctaWatchDemo}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-silver-frost/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {cards.footerCopyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              {cards.footerPrivacy}
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              {cards.footerTerms}
            </Link>
            <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
              {cards.footerRefund}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
