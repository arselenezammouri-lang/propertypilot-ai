"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Home, FileText, Users, BarChart2, Settings, Sparkles, Mail, Globe,
  Map, Target, Zap, Brain, Image as ImageIcon, Building2, TrendingDown,
  CreditCard, Share2, Layers, MessageSquare, Search, User, Bot,
  BookOpen, Shield, Phone, FileSearch, ImagePlus, Store, TrendingUp,
  LineChart, Plug,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

interface PaletteItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  group: string;
}

function getItems(isIt: boolean): PaletteItem[] {
  return [
    // Overview
    { id: "dashboard", label: "Dashboard", description: isIt ? "Dashboard principale" : "Main dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" />, group: isIt ? "Panoramica" : "Overview" },
    { id: "onboarding", label: "Onboarding", description: isIt ? "Configura la tua agenzia" : "Set up your agency", href: "/dashboard/onboarding", icon: <Sparkles className="h-4 w-4" />, group: isIt ? "Panoramica" : "Overview" },
    { id: "analytics", label: "Analytics", description: isIt ? "Statistiche e metriche" : "Stats and metrics", href: "/dashboard/analytics", icon: <BarChart2 className="h-4 w-4" />, group: isIt ? "Panoramica" : "Overview" },
    { id: "listings", label: isIt ? "Annunci Salvati" : "Saved Listings", description: isIt ? "I tuoi annunci salvati" : "Your saved listings", href: "/dashboard/listings", icon: <FileText className="h-4 w-4" />, group: isIt ? "Panoramica" : "Overview" },
    // AI Content
    { id: "ai-listings", label: "AI Listings", description: isIt ? "Genera annunci AI professionali" : "Generate professional AI listings", href: "/dashboard/ai-listings", icon: <Sparkles className="h-4 w-4" />, badge: "AI", badgeColor: "bg-purple-500", group: isIt ? "Contenuti AI" : "AI Content" },
    { id: "social-posts", label: isIt ? "Social & Video" : "Social & Video", description: isIt ? "Post social, hashtags, script video" : "Social posts, hashtags, video scripts", href: "/dashboard/social-posts", icon: <Share2 className="h-4 w-4" />, badge: "AI", badgeColor: "bg-pink-500", group: isIt ? "Contenuti AI" : "AI Content" },
    { id: "agent-bio", label: isIt ? "Bio Agente" : "Agent Bio", description: isIt ? "Bio professionale" : "Professional bio", href: "/dashboard/agent-bio", icon: <User className="h-4 w-4" />, group: isIt ? "Contenuti AI" : "AI Content" },
    { id: "translate", label: isIt ? "Traduci" : "Translate", description: isIt ? "Traduci in 6 lingue" : "Translate to 6 languages", href: "/dashboard/translate", icon: <Globe className="h-4 w-4" />, group: isIt ? "Contenuti AI" : "AI Content" },
    { id: "pdf", label: isIt ? "Genera PDF" : "Generate PDF", description: isIt ? "Brochure professionale" : "Professional brochure", href: "/dashboard/pdf", icon: <FileText className="h-4 w-4" />, badge: "PRO", badgeColor: "bg-amber-500", group: isIt ? "Contenuti AI" : "AI Content" },
    // Visual AI
    { id: "visual-ai", label: "Visual AI Suite", description: isIt ? "Staging, enhancement, planimetrie" : "Staging, enhancement, floor plans", href: "/dashboard/visual-ai", icon: <ImagePlus className="h-4 w-4" />, badge: "AI", badgeColor: "bg-purple-500", group: "Visual AI" },
    // CRM
    { id: "leads", label: "CRM Leads", description: isIt ? "Gestisci tutti i tuoi lead" : "Manage all your leads", href: "/dashboard/leads", icon: <Users className="h-4 w-4" />, group: "CRM" },
    { id: "lead-score", label: "Lead Score", description: isIt ? "Punteggio AI per lead" : "AI lead scoring", href: "/dashboard/lead-score", icon: <Brain className="h-4 w-4" />, badge: "PRO", badgeColor: "bg-amber-500", group: "CRM" },
    { id: "followup-emails", label: isIt ? "Email Follow-up" : "Follow-up Emails", description: isIt ? "Email professionali" : "Professional follow-ups", href: "/dashboard/followup-emails", icon: <Mail className="h-4 w-4" />, group: "CRM" },
    { id: "automations", label: isIt ? "Automazioni" : "Automations", description: isIt ? "Speed-to-lead automatico" : "Speed-to-lead automation", href: "/dashboard/automations", icon: <Zap className="h-4 w-4" />, badge: "PRO", badgeColor: "bg-amber-500", group: "CRM" },
    { id: "opportunities", label: isIt ? "Opportunità" : "Opportunities", description: isIt ? "Deal con market gap" : "Deals with market gap", href: "/dashboard/opportunities", icon: <Target className="h-4 w-4" />, group: "CRM" },
    // Communication
    { id: "voice-ai", label: "Voice AI", description: isIt ? "Chiamate AI multilingue" : "Multilingual AI calls", href: "/dashboard/voice-campaigns", icon: <Phone className="h-4 w-4" />, group: isIt ? "Comunicazione" : "Communication" },
    { id: "whatsapp", label: "WhatsApp AI", description: isIt ? "Conversazioni WhatsApp AI" : "AI WhatsApp conversations", href: "/dashboard/whatsapp", icon: <MessageSquare className="h-4 w-4" />, group: isIt ? "Comunicazione" : "Communication" },
    { id: "agency-assistant", label: isIt ? "Assistente AI" : "AI Assistant", description: isIt ? "AI dedicata alla tua agenzia" : "AI for your agency", href: "/dashboard/agency-assistant", icon: <Bot className="h-4 w-4" />, badge: "AI", badgeColor: "bg-purple-500", group: isIt ? "Comunicazione" : "Communication" },
    // Compliance & Docs
    { id: "compliance", label: "Compliance Shield", description: isIt ? "Conformità 6 Paesi EU" : "Compliance for 6 EU countries", href: "/dashboard/compliance", icon: <Shield className="h-4 w-4" />, group: isIt ? "Compliance" : "Compliance" },
    { id: "documents", label: "Document AI", description: isIt ? "Estrai dati da documenti" : "Extract data from documents", href: "/dashboard/documents", icon: <FileSearch className="h-4 w-4" />, badge: "AI", badgeColor: "bg-purple-500", group: isIt ? "Compliance" : "Compliance" },
    // Valuation
    { id: "cma", label: isIt ? "Report CMA" : "CMA Reports", description: isIt ? "Valutazione con comparabili" : "Valuation with comparables", href: "/dashboard/cma", icon: <BarChart2 className="h-4 w-4" />, group: isIt ? "Valutazione" : "Valuation" },
    // Market Intelligence
    { id: "prospecting", label: isIt ? "Ricerca Mercato" : "Market Search", description: isIt ? "Trova immobili su portali" : "Find properties on portals", href: "/dashboard/prospecting", icon: <Search className="h-4 w-4" />, badge: "PRO", badgeColor: "bg-amber-500", group: "Market" },
    { id: "predictive-leads", label: isIt ? "Lead Predittivi" : "Predictive Leads", description: isIt ? "AI identifica chi venderà" : "AI predicts who will list", href: "/dashboard/predictive-leads", icon: <TrendingUp className="h-4 w-4" />, badge: "PRO", badgeColor: "bg-amber-500", group: "Market" },
    { id: "marketplace", label: "Marketplace", description: isIt ? "Immobili cross-border" : "Cross-border properties", href: "/dashboard/marketplace", icon: <Store className="h-4 w-4" />, group: "Market" },
    { id: "market-reports", label: isIt ? "Report Mercato" : "Market Reports", description: isIt ? "Intelligence settimanale" : "Weekly market intelligence", href: "/dashboard/market-reports", icon: <LineChart className="h-4 w-4" />, group: "Market" },
    { id: "map", label: isIt ? "Mappa" : "Map", description: isIt ? "Mappa immobili" : "Property map", href: "/dashboard/map", icon: <Map className="h-4 w-4" />, group: "Market" },
    // Portals
    { id: "portals", label: isIt ? "Connessioni Portali" : "Portal Connections", description: isIt ? "Immobiliare, Idealista, ImmoScout24" : "Connect portals", href: "/dashboard/portals", icon: <Globe className="h-4 w-4" />, group: isIt ? "Portali" : "Portals" },
    { id: "integrations", label: isIt ? "MCP / Integrazioni" : "MCP / Integrations", description: isIt ? "Connetti AI assistant" : "Connect AI assistants", href: "/dashboard/integrations", icon: <Plug className="h-4 w-4" />, group: isIt ? "Portali" : "Portals" },
    // Agency
    { id: "branding", label: "Branding", description: isIt ? "Logo, colori, portale clienti" : "Logo, colors, client portal", href: "/dashboard/branding", icon: <Building2 className="h-4 w-4" />, badge: "AGENCY", badgeColor: "bg-rose-500", group: isIt ? "Agenzia" : "Agency" },
    { id: "packages", label: isIt ? "Pacchetti" : "Packages", description: isIt ? "Pacchetti servizi" : "Service packages", href: "/dashboard/packages", icon: <Layers className="h-4 w-4" />, group: isIt ? "Agenzia" : "Agency" },
    // Account
    { id: "billing", label: isIt ? "Abbonamento" : "Billing", description: isIt ? "Gestisci piano" : "Manage plan", href: "/dashboard/billing", icon: <CreditCard className="h-4 w-4" />, group: "Account" },
    { id: "referral", label: "Referral", description: isIt ? "Invita e guadagna" : "Invite and earn", href: "/dashboard/referral", icon: <Share2 className="h-4 w-4" />, group: "Account" },
    { id: "settings", label: isIt ? "Impostazioni" : "Settings", description: isIt ? "Preferenze workspace" : "Workspace settings", href: "/dashboard/settings/workspace", icon: <Settings className="h-4 w-4" />, group: "Account" },
    { id: "docs", label: isIt ? "Documentazione" : "Documentation", description: isIt ? "Guide e tutorial" : "Guides and tutorials", href: "/docs", icon: <BookOpen className="h-4 w-4" />, group: "Account" },
  ];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const { locale } = useLocale();
  const isIt = locale !== "en";
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const allItems = getItems(isIt);
  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.group.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation inside palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        itemRefs.current[highlighted]?.click();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [filtered.length, highlighted]
  );

  // Scroll highlighted item into view
  useEffect(() => {
    itemRefs.current[highlighted]?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  // Group items for display
  const groups: Record<string, PaletteItem[]> = {};
  filtered.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });

  let flatIndex = 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            placeholder={isIt ? "Cerca funzionalità..." : "Search features..."}
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {isIt ? "Nessun risultato trovato." : "No results found."}
            </div>
          ) : (
            Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName} className="mb-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {groupName}
                </div>
                {items.map((item) => {
                  const idx = flatIndex++;
                  return (
                    <Link
                      key={item.id}
                      ref={(el) => { itemRefs.current[idx] = el; }}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        idx === highlighted
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge className={`${item.badgeColor} text-white text-[10px] px-1.5 py-0 h-4`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>↑↓ {isIt ? "naviga" : "navigate"}</span>
          <span>↵ {isIt ? "seleziona" : "select"}</span>
          <span>esc {isIt ? "chiudi" : "close"}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
