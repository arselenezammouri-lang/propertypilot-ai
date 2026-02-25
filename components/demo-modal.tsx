"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Locale, demoTranslations } from "@/lib/i18n/config";
import { useLocale } from "@/hooks/use-locale";

const whatsappMessages: Record<Locale, string> = {
  it: "Ciao! Vorrei prenotare una demo di PropertyPilot AI.",
  en: "Hi! I'd like to book a PropertyPilot AI demo.",
  es: "¡Hola! Me gustaría reservar una demo de PropertyPilot AI.",
  fr: "Bonjour! Je voudrais réserver une démo de PropertyPilot AI.",
  de: "Hallo! Ich möchte eine PropertyPilot AI Demo buchen.",
  ar: "مرحباً! أود حجز عرض توضيحي لـ PropertyPilot AI.",
  pt: "Olá! Gostaria de marcar uma demo do PropertyPilot AI.",
};

export function DemoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale();
  const [mounted, setMounted] = useState(false);
  const whatsappNumber = "+393401234567";
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40" suppressHydrationWarning>
        <Button
          className="group relative overflow-hidden bg-gradient-to-r from-electric-blue via-royal-purple to-sunset-gold text-white font-bold px-4 py-4 sm:px-6 sm:py-6 rounded-full shadow-2xl text-sm sm:text-base"
          size="lg"
          aria-label="Open demo booking modal"
          disabled
        >
          <span className="relative flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Book Demo
          </span>
        </Button>
      </div>
    );
  }
  
  const t = demoTranslations[currentLocale] || demoTranslations['en'];
  const whatsappMessage = encodeURIComponent(whatsappMessages[currentLocale] || whatsappMessages['en']);

  return (
    <>
      {/* Fixed Button - Bottom Right - Responsive positioning */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-fade-in-up" suppressHydrationWarning>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="group relative overflow-hidden bg-gradient-to-r from-electric-blue via-royal-purple to-sunset-gold text-white font-bold px-4 py-4 sm:px-6 sm:py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              size="lg"
              data-testid="button-demo-modal-trigger"
              aria-label="Open demo booking modal"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sunset-gold via-royal-purple to-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center">
                <Calendar className="mr-2 h-5 w-5 animate-pulse" />
                {t.bookDemo}
              </span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg border-2 border-sunset-gold/30 bg-background/95 backdrop-blur-xl shadow-glow-gold" aria-labelledby="demo-modal-title" aria-describedby="demo-modal-description">
            <DialogHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-gold via-royal-purple to-electric-blue flex items-center justify-center mb-4 shadow-glow-gold" aria-hidden="true">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <DialogTitle id="demo-modal-title" className="text-2xl md:text-3xl font-bold">
                <span className="gradient-text-gold">{t.bookDemoTitle}</span>
              </DialogTitle>
              <DialogDescription id="demo-modal-description" className="text-base text-muted-foreground">
                {t.bookDemoDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Value Points */}
              <div className="space-y-3">
                {[t.point1, t.point2, t.point3, t.point4].map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <Link href="/demo" onClick={() => setIsOpen(false)} aria-label="Go to demo booking page">
                  <Button className="w-full neon-button text-lg py-6 shadow-glow-gold" size="lg" data-testid="button-go-to-demo" aria-label="Choose date and time for demo">
                    {t.chooseDate}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label="Contact us on WhatsApp"
                >
                  <Button variant="outline" className="w-full py-6 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold" size="lg" data-testid="button-whatsapp-modal" aria-label="Contact us on WhatsApp">
                    <SiWhatsapp className="mr-2 h-5 w-5" />
                    {t.contactWhatsApp}
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
              <Sparkles className="h-4 w-4 text-sunset-gold" />
              <span className="text-xs text-muted-foreground">
                {t.trustBadge}
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export function UpgradeBanner({ 
  feature,
  plan = "Pro",
  className = ""
}: { 
  feature?: string;
  plan?: string;
  className?: string;
}) {
  const locale = useLocale();
  const t = demoTranslations[locale] || demoTranslations["en"];
  const planWord = (t as Record<string, string>).planWord || "Plan";
  const featureText = feature ?? t.proFeature;
  return (
    <div className={`futuristic-card p-4 md:p-6 border-2 border-sunset-gold/30 bg-gradient-to-r from-sunset-gold/5 via-background to-royal-purple/5 ${className}`} data-testid="banner-upgrade">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunset-gold to-royal-purple flex items-center justify-center shadow-glow-gold flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base">
              {featureText} <span className="text-sunset-gold">{planWord} {plan}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {t.unlockFeature}
            </p>
          </div>
        </div>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-sunset-gold to-royal-purple hover:opacity-90 text-white font-bold px-6" data-testid="button-upgrade-now">
            {t.updateNow}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function ProFeaturePaywall({
  title,
  description,
  children,
  isLocked = true,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isLocked?: boolean;
}) {
  const locale = useLocale();
  const t = demoTranslations[locale] || demoTranslations["en"];
  const displayTitle = title ?? t.proFeature;
  const displayDesc = description ?? t.proFeatureDesc;

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative" data-testid="paywall-pro">
      {/* Blurred Content */}
      <div className="relative">
        {children && (
          <div className="blur-sm pointer-events-none select-none opacity-50">
            {children}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-sunset-gold/30">
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sunset-gold/20 to-royal-purple/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-sunset-gold" />
            </div>
            <h3 className="text-lg font-bold mb-2 gradient-text-gold">{displayTitle}</h3>
            <p className="text-sm text-muted-foreground mb-4">{displayDesc}</p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-sunset-gold to-royal-purple hover:opacity-90 text-white font-bold" data-testid="button-unlock-feature">
                {t.unlockWithPro}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardProBanner() {
  const locale = useLocale();
  const t = demoTranslations[locale] || demoTranslations["en"];
  return (
    <div className="futuristic-card p-6 md:p-8 border-2 border-sunset-gold shadow-glow-gold bg-gradient-to-r from-sunset-gold/10 via-background to-royal-purple/10 mb-6" data-testid="banner-dashboard-pro">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunset-gold via-royal-purple to-sunset-gold flex items-center justify-center shadow-glow-gold flex-shrink-0">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-sunset-gold/20 text-sunset-gold px-2 py-0.5 rounded-full">
                {t.recommended}
              </span>
            </div>
            <h3 className="text-xl font-bold gradient-text-gold">{t.choosePlan}</h3>
            <p className="text-sm text-muted-foreground">
              {t.unlockAdvanced}
            </p>
          </div>
        </div>
        
        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Starter Plan */}
          <div className="futuristic-card p-4 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:border-blue-500/50 transition-all">
            <div className="text-center mb-3">
              <h4 className="text-lg font-bold text-blue-400 mb-1">Starter</h4>
              <p className="text-2xl font-black text-blue-300">€197</p>
              <p className="text-xs text-muted-foreground">/mo</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mb-4">
              <li>• 50 listings/mo</li>
              <li>• AI Listing Engine</li>
              <li>• Lead Score Base</li>
            </ul>
            <Link href="/pricing?plan=starter" className="block">
              <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-sm py-2" size="sm">
                {t.chooseStarter}
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="futuristic-card p-4 border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/70 transition-all relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-sunset-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {t.popular}
            </span>
            <div className="text-center mb-3 mt-2">
              <h4 className="text-lg font-bold gradient-text-purple mb-1">Pro</h4>
              <p className="text-2xl font-black gradient-text-purple">€497</p>
              <p className="text-xs text-muted-foreground">/mo</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mb-4">
              <li>• 200 listings/mo</li>
              <li>• CRM + Pipeline</li>
              <li>• Virtual Staging 3D</li>
              <li>• AI Voice Calling</li>
            </ul>
            <Link href="/pricing?plan=pro" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white text-sm py-2" size="sm">
                {t.choosePro}
              </Button>
            </Link>
          </div>

          {/* Agency Plan */}
          <div className="futuristic-card p-4 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:border-amber-500/50 transition-all">
            <div className="text-center mb-3">
              <h4 className="text-lg font-bold text-amber-400 mb-1">Agency</h4>
              <p className="text-2xl font-black text-amber-300">€897</p>
              <p className="text-xs text-muted-foreground">/mo</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mb-4">
              <li>• Unlimited listings</li>
              <li>• Team up to 10 agents</li>
              <li>• Unlimited Voice AI</li>
              <li>• Multi-user</li>
            </ul>
            <Link href="/pricing?plan=agency" className="block">
              <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-sm py-2" size="sm">
                {t.chooseAgency}
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/pricing">
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground" size="sm">
              {t.comparePlans}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
