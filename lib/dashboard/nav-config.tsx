import type { ReactNode } from "react";
import {
  Home,
  FileText,
  Users,
  BarChart2,
  Settings,
  Sparkles,
  Hash,
  Heart,
  Copy,
  Mail,
  Globe,
  Map,
  Target,
  Zap,
  Brain,
  Image as ImageIcon,
  Building2,
  CreditCard,
  Share2,
  Layers,
  MessageSquare,
  Video,
  Pen,
  BookOpen,
  Shield,
  Bot,
  Search,
  User,
} from "lucide-react";

/** Job-to-be-done bucket for sidebar analytics / future filtering */
export type DashboardJtbdId =
  | "content"
  | "crm"
  | "intel"
  | "brand"
  | "account";

export type DashboardNavItem = {
  id: string;
  label: string;
  description?: string;
  icon: ReactNode;
  href?: string;
  action?: () => void;
  badge?: string;
  badgeColor?: string;
  shortcut?: string;
};

export type DashboardNavGroup = {
  jtbdId: DashboardJtbdId;
  heading: string;
  items: DashboardNavItem[];
};

/**
 * Single source of truth for dashboard navigation (Command Palette + sidebar + mobile drawer).
 * Headings follow enterprise “job to be done” grouping (Fase A5).
 */
export function getDashboardNavGroups(isIt: boolean): DashboardNavGroup[] {
  return [
    {
      jtbdId: "content",
      heading: isIt ? "Contenuti & annunci" : "Listings & content",
      items: [
        {
          id: "listings",
          label: isIt ? "Genera Annuncio" : "Generate Listing",
          description: isIt ? "Crea annunci AI in 30 secondi" : "Create AI listings in 30 seconds",
          icon: <FileText className="h-4 w-4" />,
          href: "/dashboard/listings",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "perfect-copy",
          label: "Perfect Copy",
          description: isIt
            ? "Copy persuasivo con Hook + Body + CTA"
            : "Persuasive copy with Hook + Body + CTA",
          icon: <Copy className="h-4 w-4" />,
          href: "/dashboard/perfect-copy",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "titles",
          label: isIt ? "Genera Titoli" : "Generate Titles",
          description: isIt ? "10 titoli irresistibili con l'AI" : "10 irresistible AI titles",
          icon: <Pen className="h-4 w-4" />,
          href: "/dashboard/titles",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "emotional-listing",
          label: isIt ? "Annuncio Emozionale" : "Emotional Listing",
          description: isIt ? "Storytelling che vende" : "Storytelling that sells",
          icon: <Heart className="h-4 w-4" />,
          href: "/dashboard/emotional-listing",
          badge: "AI",
          badgeColor: "bg-red-500",
        },
        {
          id: "refine-listing",
          label: isIt ? "Raffina Annuncio" : "Refine Listing",
          description: isIt ? "Migliora e ottimizza testi esistenti" : "Improve and optimize existing texts",
          icon: <Sparkles className="h-4 w-4" />,
          href: "/dashboard/refine-listing",
          badge: "AI",
          badgeColor: "bg-violet-500",
        },
        {
          id: "translate",
          label: isIt ? "Traduci Annuncio" : "Translate Listing",
          description: isIt ? "Traduci in 10+ lingue" : "Translate into 10+ languages",
          icon: <Globe className="h-4 w-4" />,
          href: "/dashboard/translate",
          badge: "AI",
          badgeColor: "bg-cyan-500",
        },
        {
          id: "social-posts",
          label: "Social Posts",
          description: isIt ? "Post per Instagram, Facebook, LinkedIn" : "Posts for Instagram, Facebook, LinkedIn",
          icon: <Share2 className="h-4 w-4" />,
          href: "/dashboard/social-posts",
          badge: "AI",
          badgeColor: "bg-pink-500",
        },
        {
          id: "hashtags",
          label: "Hashtags",
          description: isIt ? "Set hashtag ottimizzati per ogni piattaforma" : "Optimized hashtag sets for each platform",
          icon: <Hash className="h-4 w-4" />,
          href: "/dashboard/hashtags",
          badge: "AI",
          badgeColor: "bg-pink-500",
        },
        {
          id: "followup-emails",
          label: isIt ? "Email Follow-up" : "Follow-up Emails",
          description: isIt ? "Email professionali per ogni fase" : "Professional emails for every stage",
          icon: <Mail className="h-4 w-4" />,
          href: "/dashboard/followup-emails",
          badge: "AI",
          badgeColor: "bg-blue-500",
        },
        {
          id: "video-scripts",
          label: isIt ? "Script Video" : "Video Scripts",
          description: isIt ? "Script per Reels e TikTok" : "Scripts for Reels and TikTok",
          icon: <Video className="h-4 w-4" />,
          href: "/dashboard/video-scripts",
          badge: "AI",
          badgeColor: "bg-orange-500",
        },
        {
          id: "agent-bio",
          label: isIt ? "Bio Agente" : "Agent Bio",
          description: isIt ? "Bio professionale per il tuo profilo" : "Professional bio for your profile",
          icon: <User className="h-4 w-4" />,
          href: "/dashboard/agent-bio",
          badge: "AI",
          badgeColor: "bg-green-500",
        },
        {
          id: "pdf",
          label: isIt ? "Genera PDF" : "Generate PDF",
          description: isIt ? "Brochure professionale pronta in secondi" : "Professional brochure ready in seconds",
          icon: <FileText className="h-4 w-4" />,
          href: "/dashboard/pdf",
          badge: "STARTER+",
          badgeColor: "bg-blue-500",
        },
      ],
    },
    {
      jtbdId: "crm",
      heading: isIt ? "Lead, CRM & prospecting" : "Leads, CRM & prospecting",
      items: [
        {
          id: "prospecting",
          label: isIt ? "Prospecting Engine" : "Prospecting Engine",
          description: isIt
            ? "Trova immobili su Idealista, Zillow, Immobiliare.it"
            : "Find properties on Idealista, Zillow, Immobiliare.it",
          icon: <Search className="h-4 w-4" />,
          href: "/dashboard/prospecting",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "leads",
          label: "CRM Leads",
          description: isIt ? "Gestisci tutti i tuoi lead" : "Manage all your leads",
          icon: <Users className="h-4 w-4" />,
          href: "/dashboard/leads",
        },
        {
          id: "pipeline",
          label: isIt ? "Pipeline Leads" : "Leads Pipeline",
          description: isIt ? "Kanban board dei tuoi lead" : "Kanban board of your leads",
          icon: <Layers className="h-4 w-4" />,
          href: "/dashboard/leads/pipeline",
        },
        {
          id: "crm-automations",
          label: isIt ? "Automazioni CRM" : "CRM Automations",
          description: isIt ? "Regole automatiche per i lead" : "Automatic rules for leads",
          icon: <Zap className="h-4 w-4" />,
          href: "/dashboard/crm/automations",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "map",
          label: isIt ? "Mappa Tattica" : "Tactical Map",
          description: isIt ? "Visualizza deal sulla mappa interattiva" : "View deals on the interactive map",
          icon: <Map className="h-4 w-4" />,
          href: "/dashboard/map",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "lead-score",
          label: "Lead Score AI",
          description: isIt ? "Punteggio AI per ogni lead" : "AI score for each lead",
          icon: <Brain className="h-4 w-4" />,
          href: "/dashboard/lead-score",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "opportunities",
          label: isIt ? "Opportunità" : "Opportunities",
          description: isIt ? "Deal con Market Gap identificato" : "Deals with identified Market Gap",
          icon: <Target className="h-4 w-4" />,
          href: "/dashboard/opportunities",
        },
      ],
    },
    {
      jtbdId: "intel",
      heading: isIt ? "Intelligence & ricerca" : "Intelligence & research",
      items: [
        {
          id: "analyze",
          label: isIt ? "Analisi Immobile" : "Property Analysis",
          description: isIt ? "X-Ray AI su foto e planimetrie" : "AI X-Ray on photos and floor plans",
          icon: <ImageIcon className="h-4 w-4" />,
          href: "/dashboard/analyze",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "auditor",
          label: isIt ? "AI Auditor" : "AI Auditor",
          description: isIt ? "Analisi qualità annunci esistenti" : "Quality analysis of existing listings",
          icon: <BarChart2 className="h-4 w-4" />,
          href: "/dashboard/auditor",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "autopilot",
          label: isIt ? "Autopilot" : "Autopilot",
          description: isIt ? "Prospecting automatico 24/7" : "Automatic prospecting 24/7",
          icon: <Bot className="h-4 w-4" />,
          href: "/dashboard/autopilot",
          badge: "AGENCY",
          badgeColor: "bg-rose-500",
        },
        {
          id: "scraper",
          label: isIt ? "Scraper Globale" : "Global Scraper",
          description: isIt ? "Cerca immobili su portali mondiali" : "Search properties on global portals",
          icon: <Globe className="h-4 w-4" />,
          href: "/dashboard/scraper",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
      ],
    },
    {
      jtbdId: "brand",
      heading: isIt ? "Brand & crescita" : "Brand & growth",
      items: [
        {
          id: "agency-branding",
          label: isIt ? "Brand Agenzia" : "Agency Branding",
          description: isIt ? "Logo, colori e stile del tuo brand" : "Logo, colors and style of your brand",
          icon: <Building2 className="h-4 w-4" />,
          href: "/dashboard/agency-branding",
        },
        {
          id: "agency-assistant",
          label: isIt ? "Assistente Agenzia" : "Agency Assistant",
          description: isIt ? "AI dedicata alla tua agenzia" : "AI dedicated to your agency",
          icon: <MessageSquare className="h-4 w-4" />,
          href: "/dashboard/agency-assistant",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "packages",
          label: isIt ? "Pacchetti Servizi" : "Service Packages",
          description: isIt ? "Crea pacchetti da vendere ai clienti" : "Create packages to sell to clients",
          icon: <Layers className="h-4 w-4" />,
          href: "/dashboard/packages",
        },
        {
          id: "referral",
          label: isIt ? "Programma Referral" : "Referral Program",
          description: isIt ? "Guadagna invitando colleghi" : "Earn by inviting colleagues",
          icon: <Share2 className="h-4 w-4" />,
          href: "/dashboard/referral",
        },
      ],
    },
    {
      jtbdId: "account",
      heading: isIt ? "Account & workspace" : "Account & workspace",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          description: isIt ? "Torna alla dashboard principale" : "Back to main dashboard",
          icon: <Home className="h-4 w-4" />,
          href: "/dashboard",
          shortcut: "⌘H",
        },
        {
          id: "settings-workspace",
          label: isIt ? "Impostazioni Workspace" : "Workspace Settings",
          description: isIt ? "Nome agenzia, lingue, preferenze" : "Agency name, languages, preferences",
          icon: <Settings className="h-4 w-4" />,
          href: "/dashboard/settings/workspace",
          shortcut: "⌘S",
        },
        {
          id: "billing",
          label: isIt ? "Abbonamento & Fatturazione" : "Subscription & Billing",
          description: isIt ? "Gestisci il tuo piano" : "Manage your plan",
          icon: <CreditCard className="h-4 w-4" />,
          href: "/dashboard/billing",
        },
        {
          id: "compliance",
          label: "Compliance",
          description: isIt ? "GDPR, CCPA e documenti legali" : "GDPR, CCPA and legal documents",
          icon: <Shield className="h-4 w-4" />,
          href: "/compliance",
        },
        {
          id: "docs",
          label: isIt ? "Documentazione" : "Documentation",
          description: isIt ? "Guide e tutorial" : "Guides and tutorials",
          icon: <BookOpen className="h-4 w-4" />,
          href: "/docs",
          shortcut: "⌘D",
        },
      ],
    },
  ];
}
