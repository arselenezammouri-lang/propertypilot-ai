"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
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
  TrendingDown,
  CreditCard,
  Share2,
  Layers,
  MessageSquare,
  Search,
  Video,
  Pen,
  BookOpen,
  Shield,
  HelpCircle,
  LogOut,
  User,
  Bot,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { debugClientLog } from "@/lib/debug/client-log";

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  badge?: string;
  badgeColor?: string;
  shortcut?: string;
}

function getCommandGroups(isIt: boolean, router: ReturnType<typeof useRouter>): CommandGroup[] {
  return [
    {
      heading: isIt ? "Strumenti AI" : "AI Tools",
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
          id: "titles",
          label: isIt ? "Genera Titoli" : "Generate Titles",
          description: isIt ? "10 titoli irresistibili con l'AI" : "10 irresistible AI titles",
          icon: <Pen className="h-4 w-4" />,
          href: "/dashboard/titles",
          badge: "AI",
          badgeColor: "bg-purple-500",
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
          id: "emotional-listing",
          label: isIt ? "Annuncio Emozionale" : "Emotional Listing",
          description: isIt ? "Storytelling che vende" : "Storytelling that sells",
          icon: <Heart className="h-4 w-4" />,
          href: "/dashboard/emotional-listing",
          badge: "AI",
          badgeColor: "bg-red-500",
        },
        {
          id: "perfect-copy",
          label: "Perfect Copy",
          description: isIt ? "Copy persuasivo con Hook + Body + CTA" : "Persuasive copy with Hook + Body + CTA",
          icon: <Copy className="h-4 w-4" />,
          href: "/dashboard/perfect-copy",
          badge: "AI",
          badgeColor: "bg-purple-500",
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
          id: "translate",
          label: isIt ? "Traduci Annuncio" : "Translate Listing",
          description: isIt ? "Traduci in 10+ lingue" : "Translate into 10+ languages",
          icon: <Globe className="h-4 w-4" />,
          href: "/dashboard/translate",
          badge: "AI",
          badgeColor: "bg-cyan-500",
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
          id: "pdf",
          label: isIt ? "Genera PDF" : "Generate PDF",
          description: isIt ? "Brochure professionale pronta in secondi" : "Professional brochure ready in seconds",
          icon: <FileText className="h-4 w-4" />,
          href: "/dashboard/pdf",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
      ],
    },
    {
      heading: isIt ? "Prospecting & CRM" : "Prospecting & CRM",
      items: [
        {
          id: "prospecting",
          label: isIt ? "Prospecting Engine" : "Prospecting Engine",
          description: isIt ? "Trova immobili su Idealista, Zillow, Immobiliare.it" : "Find properties on Idealista, Zillow, Immobiliare.it",
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
      heading: isIt ? "Analisi & Intelligence" : "Analysis & Intelligence",
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
      heading: isIt ? "Branding & Marketing" : "Branding & Marketing",
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
      heading: isIt ? "Account & Impostazioni" : "Account & Settings",
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

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const isIt = locale !== "en";

  const t = {
    placeholder: isIt ? "Cerca strumenti, pagine, azioni..." : "Search tools, pages, actions...",
    noResults: isIt ? "Nessun risultato trovato." : "No results found.",
    hint: isIt ? "Premi" : "Press",
    hintOpen: isIt ? "per aprire il Command Center" : "to open Command Center",
  };

  const commandGroups = getCommandGroups(isIt, router);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // #region agent log
        debugClientLog({
          hypothesisId: "D",
          location: "components/command-palette.tsx:389",
          message: "Command palette toggle shortcut received",
          data: {
            key: e.key,
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
          },
        });
        // #endregion
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    // #region agent log
    debugClientLog({
      hypothesisId: "D",
      location: "components/command-palette.tsx:406",
      message: "Command palette open state changed",
      data: {
        open,
      },
    });
    // #endregion
  }, [open]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t.placeholder} />
      <CommandList>
        <CommandEmpty>{t.noResults}</CommandEmpty>
        {commandGroups.map((group, groupIdx) => (
          <div key={group.heading}>
            {groupIdx > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.label} ${item.description ?? ""}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge
                          className={`${item.badgeColor} text-white text-[10px] px-1.5 py-0 h-4`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
