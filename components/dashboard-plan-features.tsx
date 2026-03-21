"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Lock, 
  Check, 
  Sparkles, 
  Zap, 
  Crown,
  Users,
  Phone,
  Bot,
  FileText,
  Target,
  Settings,
  MessageSquare,
  Video,
  Globe,
  Share2,
  Mail,
  Link2,
  Award,
  BarChart3,
  Rocket,
  ChevronRight,
  ChevronLeft,
  MousePointerClick,
  Hash,
  Heart,
  User,
  Building2,
  Radar,
  Map
} from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
// import { STRIPE_PLANS } from "@/lib/stripe/config"; // Not used currently

type PlanType = "free" | "starter" | "pro" | "agency";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  availableIn: PlanType[];
  locked?: boolean;
}

const ALL_FEATURES: Feature[] = [
  // FREE Features
  {
    id: "generate",
    name: "Genera Nuovo Annuncio",
    description: "Crea contenuti professionali con l'AI in pochi secondi",
    icon: <Zap className="h-6 w-6" />,
    href: "/dashboard/listings",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "scraper",
    name: "AI Scraper",
    description: "Importa annunci da Immobiliare, Idealista, Casa, Subito",
    icon: <Link2 className="h-6 w-6" />,
    href: "/dashboard/scraper",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "analyze",
    name: "Analisi da Link",
    description: "Incolla un link e ottieni analisi + riscrittura AI istantanea",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/analyze",
    availableIn: ["free", "starter", "pro", "agency"],
  },
  {
    id: "pdf",
    name: "Schede PDF Premium",
    description: "Genera schede immobiliari professionali stile Canva",
    icon: <FileText className="h-6 w-6" />,
    href: "/dashboard/pdf",
    availableIn: ["starter", "pro", "agency"],
  },
  
  // STARTER Features (include FREE + new)
  {
    id: "lead-score",
    name: "Lead Scoring AI",
    description: "Analizza i lead con punteggio 0-100, priorità d'azione e template risposta",
    icon: <Target className="h-6 w-6" />,
    href: "/dashboard/lead-score",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "perfect-copy",
    name: "Perfect Copy 2.0",
    description: "5 varianti premium: Professionale, Emotivo, Breve, SEO, Luxury",
    icon: <Crown className="h-6 w-6" />,
    href: "/dashboard/perfect-copy",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "translate",
    name: "Traduttore 12 Lingue",
    description: "Traduci annunci in 12 lingue con adattamento culturale e SEO locale",
    icon: <Globe className="h-6 w-6" />,
    href: "/dashboard/translate",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "social-posts",
    name: "Post Social AI",
    description: "Genera post per Instagram, Facebook e TikTok",
    icon: <Share2 className="h-6 w-6" />,
    href: "/dashboard/social-posts",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "titles",
    name: "Titoli A/B ad Alto CTR",
    description: "19 titoli ottimizzati: clickbait, luxury, SEO",
    icon: <MousePointerClick className="h-6 w-6" />,
    href: "/dashboard/titles",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "hashtags",
    name: "Hashtag AI Generator",
    description: "50+ hashtag ottimizzati per massimizzare il reach social",
    icon: <Hash className="h-6 w-6" />,
    href: "/dashboard/hashtags",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "emotional-listing",
    name: "Emotional Listing AI",
    description: "Descrizioni emozionali che toccano il cuore degli acquirenti",
    icon: <Heart className="h-6 w-6" />,
    href: "/dashboard/emotional-listing",
    availableIn: ["starter", "pro", "agency"],
  },
  {
    id: "refine-listing",
    name: "Perfect Again AI",
    description: "Raffina e migliora i tuoi annunci esistenti con l'AI",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/refine-listing",
    availableIn: ["starter", "pro", "agency"],
  },
  
  // PRO Features (include STARTER + new)
  {
    id: "auditor",
    name: "Audit Immobiliare AI",
    description: "Audit completo: struttura, SEO, emozioni, red flags e versione ottimizzata",
    icon: <Award className="h-6 w-6" />,
    href: "/dashboard/auditor",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agent-bio",
    name: "Agent BIO AI Creator",
    description: "5 bio professionali: Pro, Emotiva, Luxury, Social, Website SEO",
    icon: <User className="h-6 w-6" />,
    href: "/dashboard/agent-bio",
    availableIn: ["pro", "agency"],
  },
  {
    id: "followup-emails",
    name: "Follow-Up Email AI",
    description: "6 email professionali per convertire i tuoi lead immobiliari",
    icon: <Mail className="h-6 w-6" />,
    href: "/dashboard/followup-emails",
    availableIn: ["pro", "agency"],
  },
  {
    id: "video-scripts",
    name: "Video Scripts AI",
    description: "Script video professionali con timestamp e indicazioni visive",
    icon: <Video className="h-6 w-6" />,
    href: "/dashboard/video-scripts",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agency-branding",
    name: "Agency Branding",
    description: "Personalizza il branding della tua agenzia",
    icon: <Building2 className="h-6 w-6" />,
    href: "/dashboard/agency-branding",
    availableIn: ["pro", "agency"],
  },
  {
    id: "crm",
    name: "Lead Manager + AI",
    description: "Email, WhatsApp, SMS con AI - Pipeline, automazioni, form capture",
    icon: <Users className="h-6 w-6" />,
    href: "/dashboard/leads",
    availableIn: ["pro", "agency"],
  },
  {
    id: "virtual-staging",
    name: "Virtual Staging 3D",
    description: "Staging professionale 3D per i tuoi immobili",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["pro", "agency"],
  },
  {
    id: "voice-calling",
    name: "AI Voice Calling",
    description: "Chiamate AI automatiche ai proprietari (30/mese)",
    icon: <Phone className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["pro", "agency"],
  },
  {
    id: "agency-assistant",
    name: "Agency Assistant AI",
    description: "Chatbot per annunci, email, social e strategia immobiliare",
    icon: <Bot className="h-6 w-6" />,
    href: "/dashboard/agency-assistant",
    availableIn: ["pro", "agency"],
  },
  {
    id: "automations",
    name: "Workflow automazioni",
    description: "Follow-up pianificati, reminder visite, contenuti settimanali (tabella automations)",
    icon: <Settings className="h-6 w-6" />,
    href: "/dashboard/automations",
    availableIn: ["pro", "agency"],
  },
  {
    id: "crm-automation-rules",
    name: "Regole automazione CRM",
    description: "If/then su eventi lead: nuovo lead, cambio stato, score, notifiche",
    icon: <Zap className="h-6 w-6" />,
    href: "/dashboard/crm/automations",
    availableIn: ["pro", "agency"],
  },
  
  // AGENCY Features (include PRO + new)
  {
    id: "unlimited-voice",
    name: "AI Voice Calling Illimitato",
    description: "Chiamate AI automatiche 24/7 senza limiti",
    icon: <Phone className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "team-management",
    name: "Gestione Team Multi-utente",
    description: "Team fino a 10 agenti, ruoli e permessi avanzati",
    icon: <Users className="h-6 w-6" />,
    href: "/dashboard/settings/workspace",
    availableIn: ["agency"],
  },
  {
    id: "aura-vr",
    name: "Aura VR: Virtual Tour Generation",
    description: "Generazione illimitata di tour virtuali cinematografici",
    icon: <Video className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "prospecting",
    name: "War Room Prospecting",
    description: "Dashboard intelligence per deal immobiliari con AI",
    icon: <Radar className="h-6 w-6" />,
    href: "/dashboard/prospecting",
    availableIn: ["agency"],
  },
  {
    id: "map",
    name: "Mappa Territorio AI",
    description: "Visualizza immobili e opportunità sulla mappa",
    icon: <Map className="h-6 w-6" />,
    href: "/dashboard/map",
    availableIn: ["agency"],
  },
];

const PLAN_ORDER: PlanType[] = ["free", "starter", "pro", "agency"];

interface DashboardPlanFeaturesProps {
  currentPlan: PlanType;
  onPlanChange?: (plan: PlanType) => void;
}

export function DashboardPlanFeatures({ currentPlan, onPlanChange }: DashboardPlanFeaturesProps) {
  const { locale } = useLocaleContext();
  const [viewingPlan, setViewingPlan] = useState<PlanType>(currentPlan);
  const t = {
    it: {
      plan: "Piano",
      free: "Gratis",
      freeLimit: "5 annunci/mese",
      starterLimit: "50 annunci/mese",
      proLimit: "200 annunci/mese",
      agencyLimit: "Illimitati",
      currentPlan: "Il tuo piano attuale",
      requiresHigherPlan: "Richiede piano superiore",
      open: "Apri",
      unlock: "Sblocca",
      higherPlans: "Funzionalità disponibili nei piani superiori",
      unlockPlan: "Sblocca Piano",
    },
    en: {
      plan: "Plan",
      free: "Free",
      freeLimit: "5 listings/month",
      starterLimit: "50 listings/month",
      proLimit: "200 listings/month",
      agencyLimit: "Unlimited",
      currentPlan: "Your current plan",
      requiresHigherPlan: "Requires higher plan",
      open: "Open",
      unlock: "Unlock",
      higherPlans: "Features available in higher plans",
      unlockPlan: "Unlock Plan",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];
  const featureTranslations: Record<string, { name: string; description: string }> = locale === "it"
    ? {}
    : {
        "generate": { name: "Generate New Listing", description: "Create professional AI-powered content in seconds" },
        "scraper": { name: "AI Scraper", description: "Import listings from Immobiliare, Idealista, Casa, and Subito" },
        "analyze": { name: "Link Analysis", description: "Paste a link and get instant AI analysis and rewrite" },
        "pdf": { name: "Premium PDF Sheets", description: "Generate professional Canva-style property sheets" },
        "lead-score": { name: "AI Lead Scoring", description: "Analyze leads with 0-100 score, action priority, and reply templates" },
        "perfect-copy": { name: "Perfect Copy 2.0", description: "5 premium variants: Professional, Emotional, Short, SEO, Luxury" },
        "translate": { name: "12-Language Translator", description: "Translate listings into 12 languages with cultural and local SEO adaptation" },
        "social-posts": { name: "AI Social Posts", description: "Generate posts for Instagram, Facebook, and TikTok" },
        "titles": { name: "High CTR A/B Titles", description: "19 optimized titles: clickbait, luxury, SEO" },
        "hashtags": { name: "AI Hashtag Generator", description: "50+ optimized hashtags to maximize social reach" },
        "emotional-listing": { name: "Emotional Listing AI", description: "Emotional descriptions that connect with buyers" },
        "refine-listing": { name: "Perfect Again AI", description: "Refine and improve your existing listings with AI" },
        "auditor": { name: "AI Property Audit", description: "Full audit: structure, SEO, emotions, red flags, and optimized version" },
        "agent-bio": { name: "Agent BIO AI Creator", description: "5 professional bios: Pro, Emotional, Luxury, Social, Website SEO" },
        "followup-emails": { name: "AI Follow-Up Email", description: "6 professional emails to convert your real estate leads" },
        "video-scripts": { name: "AI Video Scripts", description: "Professional video scripts with timestamps and visual directions" },
        "agency-branding": { name: "Agency Branding", description: "Customize your agency branding" },
        "crm": { name: "Lead Manager + AI", description: "Email, WhatsApp, SMS with AI - pipeline, automations, capture forms" },
        "virtual-staging": { name: "3D Virtual Staging", description: "Professional 3D staging for your properties" },
        "voice-calling": { name: "AI Voice Calling", description: "Automatic AI owner calls (30/month)" },
        "agency-assistant": { name: "Agency Assistant AI", description: "Chatbot for listings, email, social, and real estate strategy" },
        "automations": { name: "Automation workflows", description: "Scheduled follow-ups, visit reminders, and weekly content (automations table)" },
        "crm-automation-rules": { name: "CRM automation rules", description: "If/then on lead events: new lead, status change, score, notifications" },
        "unlimited-voice": { name: "Unlimited AI Voice Calling", description: "24/7 automatic AI calling without limits" },
        "team-management": { name: "Multi-user Team Management", description: "Teams up to 10 agents, advanced roles and permissions" },
        "aura-vr": { name: "Aura VR: Virtual Tour Generation", description: "Unlimited cinematic virtual tour generation" },
        "prospecting": { name: "War Room Prospecting", description: "AI-powered intelligence dashboard for property deals" },
        "map": { name: "AI Territory Map", description: "View properties and opportunities on the map" },
      };
  
  const currentPlanIndex = PLAN_ORDER.indexOf(viewingPlan);
  const nextPlan = currentPlanIndex < PLAN_ORDER.length - 1 ? PLAN_ORDER[currentPlanIndex + 1] : null;
  const prevPlan = currentPlanIndex > 0 ? PLAN_ORDER[currentPlanIndex - 1] : null;
  
  const planFeatures = ALL_FEATURES.filter(f => f.availableIn.includes(viewingPlan));
  const lockedFeatures = ALL_FEATURES.filter(f => 
    !f.availableIn.includes(viewingPlan) && 
    f.availableIn.some(p => PLAN_ORDER.indexOf(p) > currentPlanIndex)
  );
  
  const planInfo = viewingPlan === "free" 
    ? { name: "Free", price: t.free, color: "from-gray-500 to-gray-700", limit: t.freeLimit }
    : viewingPlan === "starter"
    ? { name: "Starter", price: "€197/mese", color: "from-blue-500 to-cyan-500", limit: t.starterLimit }
    : viewingPlan === "pro"
    ? { name: "Pro", price: "€497/mese", color: "from-purple-500 to-pink-500", limit: t.proLimit }
    : { name: "Agency", price: "€897/mese", color: "from-amber-500 to-orange-500", limit: t.agencyLimit };
  
  const handleNextPlan = () => {
    if (nextPlan) {
      setViewingPlan(nextPlan);
      onPlanChange?.(nextPlan);
    }
  };
  
  const handlePrevPlan = () => {
    if (prevPlan) {
      setViewingPlan(prevPlan);
      onPlanChange?.(prevPlan);
    }
  };
  
  const isFeatureLocked = (feature: Feature) => {
    return !feature.availableIn.includes(currentPlan);
  };
  
  return (
    <div className="relative">
      {/* Plan Navigation - Top Right */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${planInfo.color} flex items-center justify-center shadow-lg`}>
              {viewingPlan === "free" ? <Sparkles className="h-6 w-6 text-white" /> :
               viewingPlan === "starter" ? <Zap className="h-6 w-6 text-white" /> :
               viewingPlan === "pro" ? <Crown className="h-6 w-6 text-white" /> :
               <Rocket className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t.plan} {planInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">{planInfo.limit}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          {prevPlan && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPlan}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {nextPlan && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPlan}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="text-sm mr-2">{t.plan} {nextPlan === "starter" ? "Starter" : nextPlan === "pro" ? "Pro" : "Agency"}</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Current Plan Badge */}
      {viewingPlan === currentPlan && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${planInfo.color}/20 border border-white/20 mb-6`}>
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{t.currentPlan}</span>
        </div>
      )}
      
      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {planFeatures.map((feature) => {
          const locked = isFeatureLocked(feature);
          const featureCopy = featureTranslations[feature.id] || feature;
          
          return (
            <Card 
              key={feature.id}
              className={`relative overflow-hidden border transition-all ${
                locked 
                  ? "border-white/[0.06] bg-white/[0.02] opacity-60" 
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400 font-medium">{t.requiresHigherPlan}</p>
                  </div>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planInfo.color}/20 flex items-center justify-center mb-4 ${
                  locked ? "opacity-50" : ""
                }`}>
                  <div className={locked ? "text-gray-500" : ""}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${locked ? "text-gray-500" : ""}`}>
                  {featureCopy.name}
                </h3>
                <p className={`text-sm mb-4 ${locked ? "text-gray-600" : "text-muted-foreground"}`}>
                  {featureCopy.description}
                </p>
                
                {!locked ? (
                  <Link href={feature.href}>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:border-white/40"
                      size="sm"
                    >
                      {t.open}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/billing">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/[0.08] text-white/30 hover:border-white/20"
                      size="sm"
                      disabled
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t.unlock}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Locked Features Preview */}
      {lockedFeatures.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-bold text-muted-foreground">
              {t.higherPlans}
            </h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedFeatures.slice(0, 6).map((feature) => {
              const featureCopy = featureTranslations[feature.id] || feature;
              return (
                <Card 
                  key={feature.id}
                  className="border border-white/[0.06] bg-white/[0.02] opacity-70"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                        <div className="text-white/30">{feature.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white/40">{featureCopy.name}</h4>
                        <p className="text-xs text-white/25 mt-1">{featureCopy.description}</p>
                      </div>
                      <Lock className="h-4 w-4 text-white/25" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {nextPlan && (
            <div className="mt-6 text-center">
              <Link href="/dashboard/billing">
                <Button 
                  className={`bg-gradient-to-r ${planInfo.color} hover:opacity-90 text-white`}
                  size="lg"
                >
                  {t.unlockPlan} {nextPlan === "starter" ? "Starter" : nextPlan === "pro" ? "Pro" : "Agency"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
