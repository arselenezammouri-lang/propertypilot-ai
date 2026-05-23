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
  User,
  Bot,
  BookOpen,
  Shield,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

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
      heading: isIt ? "Panoramica" : "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", description: isIt ? "Torna alla dashboard" : "Go to dashboard", icon: <Home className="h-4 w-4" />, href: "/dashboard", shortcut: "⌘H" },
        { id: "onboarding", label: "Onboarding", description: isIt ? "Configura la tua agenzia" : "Set up your agency", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard/onboarding" },
        { id: "analytics", label: "Analytics", description: isIt ? "Statistiche e metriche" : "Stats and metrics", icon: <BarChart2 className="h-4 w-4" />, href: "/dashboard/analytics" },
      ],
    },
    {
      heading: isIt ? "Contenuti AI" : "AI Content",
      items: [
        { id: "ai-listings", label: isIt ? "AI Listings" : "AI Listings", description: isIt ? "Genera annunci AI professionali" : "Generate professional AI listings", icon: <Sparkles className="h-4 w-4" />, href: "/dashboard/ai-listings", badge: "AI", badgeColor: "bg-purple-500" },
        { id: "social-posts", label: isIt ? "Social & Video" : "Social & Video", description: isIt ? "Post social, hashtags, script video" : "Social posts, hashtags, video scripts", icon: <Share2 className="h-4 w-4" />, href: "/dashboard/social-posts", badge: "AI", badgeColor: "bg-pink-500" },
        { id: "agent-bio", label: isIt ? "Bio Agente" : "Agent Bio", description: isIt ? "Bio professionale" : "Professional bio", icon: <User className="h-4 w-4" />, href: "/dashboard/agent-bio", badge: "AI", badgeColor: "bg-green-500" },
        { id: "translate", label: isIt ? "Traduci" : "Translate", description: isIt ? "Traduci in 6 lingue" : "Translate to 6 languages", icon: <Globe className="h-4 w-4" />, href: "/dashboard/translate", badge: "AI", badgeColor: "bg-cyan-500" },
        { id: "pdf", label: isIt ? "Genera PDF" : "Generate PDF", description: isIt ? "Brochure professionale" : "Professional brochure", icon: <FileText className="h-4 w-4" />, href: "/dashboard/pdf", badge: "PRO", badgeColor: "bg-amber-500" },
      ],
    },
    {
      heading: "Visual AI",
      items: [
        { id: "visual-ai", label: "Visual AI Suite", description: isIt ? "Staging virtuale, enhancement foto, planimetrie" : "Virtual staging, photo enhancement, floor plans", icon: <ImageIcon className="h-4 w-4" />, href: "/dashboard/visual-ai", badge: "AI", badgeColor: "bg-purple-500" },
      ],
    },
    {
      heading: isIt ? "CRM & Lead" : "CRM & Leads",
      items: [
        { id: "leads", label: "CRM Leads", description: isIt ? "Gestisci tutti i tuoi lead" : "Manage all your leads", icon: <Users className="h-4 w-4" />, href: "/dashboard/leads" },
        { id: "lead-score", label: "Lead Score", description: isIt ? "Punteggio AI per ogni lead" : "AI score for each lead", icon: <Brain className="h-4 w-4" />, href: "/dashboard/lead-score", badge: "PRO", badgeColor: "bg-amber-500" },
        { id: "followup-emails", label: isIt ? "Email Follow-up" : "Follow-up Emails", description: isIt ? "Email professionali" : "Professional follow-ups", icon: <Mail className="h-4 w-4" />, href: "/dashboard/followup-emails", badge: "AI", badgeColor: "bg-blue-500" },
        { id: "automations", label: isIt ? "Automazioni" : "Automations", description: isIt ? "Speed-to-lead e regole automatiche" : "Speed-to-lead and automatic rules", icon: <Zap className="h-4 w-4" />, href: "/dashboard/automations", badge: "PRO", badgeColor: "bg-amber-500" },
        { id: "opportunities", label: isIt ? "Opportunità" : "Opportunities", description: isIt ? "Deal con market gap" : "Deals with market gap", icon: <Target className="h-4 w-4" />, href: "/dashboard/opportunities" },
      ],
    },
    {
      heading: isIt ? "Comunicazione" : "Communication",
      items: [
        { id: "voice-ai", label: "Voice AI", description: isIt ? "Chiamate AI multilingue" : "Multilingual AI calls", icon: <FileText className="h-4 w-4" />, href: "/dashboard/voice-campaigns" },
        { id: "whatsapp", label: "WhatsApp AI", description: isIt ? "Conversazioni WhatsApp AI" : "AI WhatsApp conversations", icon: <MessageSquare className="h-4 w-4" />, href: "/dashboard/whatsapp" },
        { id: "agency-assistant", label: isIt ? "Assistente AI" : "AI Assistant", description: isIt ? "AI dedicata alla tua agenzia" : "AI dedicated to your agency", icon: <Bot className="h-4 w-4" />, href: "/dashboard/agency-assistant", badge: "AI", badgeColor: "bg-purple-500" },
      ],
    },
    {
      heading: isIt ? "Compliance & Documenti" : "Compliance & Docs",
      items: [
        { id: "compliance", label: "Compliance Shield", description: isIt ? "Controlla conformità in 6 Paesi EU" : "Check compliance in 6 EU countries", icon: <Shield className="h-4 w-4" />, href: "/dashboard/compliance" },
        { id: "documents", label: "Document AI", description: isIt ? "Estrai dati da mandati e APE" : "Extract data from mandates and certs", icon: <FileText className="h-4 w-4" />, href: "/dashboard/documents", badge: "AI", badgeColor: "bg-purple-500" },
      ],
    },
    {
      heading: isIt ? "Valutazione" : "Valuation",
      items: [
        { id: "cma", label: isIt ? "Report CMA" : "CMA Reports", description: isIt ? "Valutazione automatica con comparabili" : "Automated valuation with comparables", icon: <BarChart2 className="h-4 w-4" />, href: "/dashboard/cma" },
      ],
    },
    {
      heading: isIt ? "Market Intelligence" : "Market Intelligence",
      items: [
        { id: "prospecting", label: isIt ? "Ricerca Mercato" : "Market Search", description: isIt ? "Trova immobili su tutti i portali" : "Find properties on all portals", icon: <Search className="h-4 w-4" />, href: "/dashboard/prospecting", badge: "PRO", badgeColor: "bg-amber-500" },
        { id: "predictive-leads", label: isIt ? "Lead Predittivi" : "Predictive Leads", description: isIt ? "AI identifica chi venderà" : "AI predicts who will list", icon: <TrendingDown className="h-4 w-4" />, href: "/dashboard/predictive-leads", badge: "PRO", badgeColor: "bg-amber-500" },
        { id: "marketplace", label: "Marketplace", description: isIt ? "Immobili cross-border in 6 Paesi" : "Cross-border properties in 6 countries", icon: <Globe className="h-4 w-4" />, href: "/dashboard/marketplace" },
        { id: "market-reports", label: isIt ? "Report Mercato" : "Market Reports", description: isIt ? "Intelligence settimanale automatica" : "Auto-weekly market intelligence", icon: <BarChart2 className="h-4 w-4" />, href: "/dashboard/market-reports" },
        { id: "map", label: isIt ? "Mappa" : "Map", description: isIt ? "Visualizza immobili sulla mappa" : "View properties on map", icon: <Map className="h-4 w-4" />, href: "/dashboard/map" },
      ],
    },
    {
      heading: isIt ? "Portali & Integrazioni" : "Portals & Integrations",
      items: [
        { id: "portals", label: isIt ? "Connessioni Portali" : "Portal Connections", description: isIt ? "Collega Immobiliare, Idealista, ImmoScout24" : "Connect Immobiliare, Idealista, ImmoScout24", icon: <Globe className="h-4 w-4" />, href: "/dashboard/portals" },
        { id: "integrations", label: isIt ? "MCP / Integrazioni" : "MCP / Integrations", description: isIt ? "Connetti Claude Desktop, Cursor, AI" : "Connect Claude Desktop, Cursor, AI", icon: <Zap className="h-4 w-4" />, href: "/dashboard/integrations" },
      ],
    },
    {
      heading: isIt ? "Agenzia" : "Agency",
      items: [
        { id: "branding", label: isIt ? "Branding" : "Branding", description: isIt ? "Logo, colori, portale clienti white-label" : "Logo, colors, white-label client portal", icon: <Building2 className="h-4 w-4" />, href: "/dashboard/branding", badge: "AGENCY", badgeColor: "bg-rose-500" },
        { id: "packages", label: isIt ? "Pacchetti" : "Packages", description: isIt ? "Pacchetti servizi per clienti" : "Service packages for clients", icon: <Layers className="h-4 w-4" />, href: "/dashboard/packages" },
      ],
    },
    {
      heading: isIt ? "Account" : "Account",
      items: [
        { id: "billing", label: isIt ? "Abbonamento" : "Billing", description: isIt ? "Gestisci il tuo piano" : "Manage your plan", icon: <CreditCard className="h-4 w-4" />, href: "/dashboard/billing" },
        { id: "referral", label: "Referral", description: isIt ? "Guadagna invitando colleghi" : "Earn by inviting colleagues", icon: <Share2 className="h-4 w-4" />, href: "/dashboard/referral" },
        { id: "settings", label: isIt ? "Impostazioni" : "Settings", description: isIt ? "Preferenze workspace" : "Workspace preferences", icon: <Settings className="h-4 w-4" />, href: "/dashboard/settings/workspace", shortcut: "⌘S" },
        { id: "docs", label: isIt ? "Documentazione" : "Documentation", description: isIt ? "Guide e tutorial" : "Guides and tutorials", icon: <BookOpen className="h-4 w-4" />, href: "/docs", shortcut: "⌘D" },
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
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      // Use setTimeout to ensure dialog closes before navigation
      setTimeout(() => {
        if (item.action) {
          item.action();
        } else if (item.href) {
          router.push(item.href);
        }
      }, 100);
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
                  value={`${item.id} ${item.label} ${item.description ?? ""}`}
                  onSelect={() => handleSelect(item)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
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
