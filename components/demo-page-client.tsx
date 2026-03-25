"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PropertyPilotLogo } from "@/components/logo";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import {
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock,
  Star,
  Quote,
  Rocket,
  Crown,
  Building2,
  BarChart3,
  Mail,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const valuePointIcons = [Sparkles, Users, Zap, BarChart3, Mail, Crown];

const TRUST_ICON_BY_KEY = {
  clock: Clock,
  shield: Shield,
  users: Users,
  trendingUp: TrendingUp,
} as const;

const TRUST_COLOR_BY_KEY: Record<keyof typeof TRUST_ICON_BY_KEY, string> = {
  clock: "text-neon-aqua",
  shield: "text-electric-blue",
  users: "text-royal-purple",
  trendingUp: "text-sunset-gold",
};

export function DemoPageClient() {
  const { locale, currency, setLocale, setCurrency } = useLocaleContext();
  const t = useMemo(() => getTranslation(locale as SupportedLocale), [locale]);
  const d = t.demo;
  const calendlyUrl = "https://calendly.com/propertypilot-ai/demo";
  const whatsappNumber = "+393401234567";
  const whatsappMessage = encodeURIComponent(d.whatsappPrefill);

  const trustStats = useMemo(
    () =>
      d.trustStats.map((row) => ({
        ...row,
        Icon: TRUST_ICON_BY_KEY[row.iconKey],
        colorClass: TRUST_COLOR_BY_KEY[row.iconKey],
      })),
    [d.trustStats]
  );

  const footerRights = t.landing?.footer?.copyright ?? "";

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
              <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground">{t.landing?.nav?.tagline}</p>
              </div>
            </Link>

            <nav className="flex items-center space-x-2 md:space-x-4">
              <LocaleCurrencySelector
                currentLocale={locale}
                currentCurrency={currency}
                onLocaleChange={setLocale}
                onCurrencyChange={setCurrency}
              />
              <ThemeToggle />
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex hover:text-royal-purple transition-colors"
                  data-testid="button-pricing"
                >
                  {d.nav.pricing}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex hover:text-royal-purple transition-colors"
                  data-testid="button-login"
                >
                  {d.nav.login}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="neon-button" data-testid="button-signup">
                  {d.nav.startFree}
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--royal-purple)/0.1),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center space-x-2 ai-badge mb-6 animate-fade-in-up">
              <Calendar size={18} className="animate-pulse" />
              <span className="text-sm font-bold">{d.hero.badge}</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up delay-100"
              data-testid="text-demo-title"
            >
              {d.hero.title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-200">
              {d.hero.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div
              id="calendly"
              className="futuristic-card p-6 md:p-8 border-2 border-sunset-gold/30 shadow-glow-gold animate-fade-in-up delay-300"
              data-testid="card-calendly"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunset-gold to-royal-purple flex items-center justify-center shadow-glow-gold">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text-gold">{d.calendly.chooseDate}</h2>
                  <p className="text-sm text-muted-foreground">{d.calendly.demoFree}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl border border-border/50 overflow-hidden" style={{ minHeight: "600px" }}>
                <iframe
                  src={calendlyUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title={d.calendlyIframeTitle}
                  className="w-full"
                  data-testid="iframe-calendly"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4 text-center">{d.calendly.preferContact}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-bold" data-testid="button-whatsapp">
                      <SiWhatsapp className="mr-2 h-5 w-5" />
                      {d.calendly.whatsapp}
                    </Button>
                  </a>
                  <Link href="/contatti">
                    <Button variant="outline" className="w-full sm:w-auto border-2" data-testid="button-contact">
                      <Mail className="mr-2 h-5 w-5" />
                      {d.calendly.sendEmail}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-up delay-400">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{d.valuePoints.sectionTitle}</h2>
                <p className="text-muted-foreground">{d.valuePoints.sectionSubtitle}</p>
              </div>

              <div className="grid gap-4">
                {d.valuePointsList.map((point, index) => (
                  <div
                    key={`${point.title}-${index}`}
                    className="futuristic-card p-4 md:p-5 hover-lift border border-electric-blue/20 group"
                    data-testid={`card-value-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue/20 to-royal-purple/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {React.createElement(valuePointIcons[index] ?? Sparkles, {
                          className: "h-5 w-5 text-electric-blue",
                        })}
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 group-hover:text-electric-blue transition-colors">{point.title}</h3>
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <a href="#calendly">
                  <Button className="neon-button w-full text-lg py-6 shadow-glow-gold" size="lg" data-testid="button-book-now">
                    {d.valuePoints.bookNow}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-luxury-indigo/5 dark:bg-luxury-indigo/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 animate-fade-in-up" data-testid="text-testimonials-title">
              {d.testimonials.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-100">{d.testimonials.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {d.testimonialsList.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="futuristic-card p-6 md:p-8 hover-lift animate-fade-in-up border border-royal-purple/20"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`card-testimonial-${index}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-sunset-gold fill-sunset-gold" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-royal-purple/20" />
                  <p className="text-muted-foreground italic pl-6">&quot;{testimonial.quote}&quot;</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-royal-purple flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {trustStats.map((stat, index) => (
              <div key={stat.label} className="text-center group" data-testid={`stat-demo-${index}`}>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.Icon className={stat.colorClass} size={28} />
                </div>
                <div className="text-3xl md:text-4xl font-black gradient-text-purple mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cyber-glow opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 animate-fade-in-up" data-testid="text-cta-title">
            {d.finalCta.titleLead}
            <span className="gradient-text-gold">{d.finalCta.titleAccent}</span>
            {d.finalCta.titleTail}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
            {d.finalCta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <a href="#calendly">
              <Button className="neon-button text-lg px-10 py-6" size="lg" data-testid="button-final-cta">
                {d.finalCta.bookDemo}
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                size="lg"
                data-testid="button-whatsapp-cta"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" />
                {d.calendly.whatsapp}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-silver-frost/30 bg-luxury-indigo/5 dark:bg-luxury-indigo/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <PropertyPilotLogo className="w-10 h-10 flex-shrink-0" />
              <div>
                <p className="font-bold gradient-text-purple">PropertyPilot AI</p>
                <p className="text-xs text-muted-foreground">
                  {d.footerCopyrightLine.replace("{year}", String(new Date().getFullYear())).replace("{rights}", footerRights)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                {d.footer.home}
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                {d.footer.pricing}
              </Link>
              <Link href="/contatti" className="hover:text-foreground transition-colors">
                {d.footer.contact}
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                {d.footer.login}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
