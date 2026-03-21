import type { ReactNode } from "react";
import {
  BookOpen,
  Copy,
  CreditCard,
  FileText,
  Home,
  Layers,
  Sparkles,
  Brain,
  Settings,
  Target,
} from "lucide-react";

export type CommandPaletteExtraItem = {
  id: string;
  label: string;
  description: string;
  /** Extra tokens for cmdk search (space-separated) */
  keywords: string;
  icon: ReactNode;
  kind: "internal" | "external";
  path: string;
};

/**
 * Voci aggiuntive per la command palette (Fase C3): collegamenti veloci + guide in nuova scheda.
 */
export function getCommandPaletteQuickLinks(isIt: boolean): CommandPaletteExtraItem[] {
  return [
    {
      id: "ql-listings",
      label: isIt ? "Libreria annunci" : "Listings library",
      description: isIt ? "Annunci salvati e bozze" : "Saved listings and drafts",
      keywords: isIt ? "libreria salvati annunci listing" : "library saved drafts listings",
      icon: <FileText className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/listings",
    },
    {
      id: "ql-perfect-copy",
      label: "Perfect Copy",
      description: isIt ? "5 varianti di copy in un colpo" : "Five copy variants at once",
      keywords: isIt ? "copy annuncio varianti" : "copy listing variants",
      icon: <Copy className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/perfect-copy",
    },
    {
      id: "ql-pipeline",
      label: isIt ? "Pipeline lead" : "Lead pipeline",
      description: isIt ? "Kanban stato lead" : "Kanban lead stages",
      keywords: isIt ? "kanban crm lead" : "kanban crm leads",
      icon: <Layers className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/leads/pipeline",
    },
    {
      id: "ql-lead-score",
      label: "Lead Score AI",
      description: isIt ? "Punteggio intelligenza lead" : "AI lead scoring",
      keywords: isIt ? "score punteggio lead" : "score rating lead",
      icon: <Brain className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/lead-score",
    },
    {
      id: "ql-billing",
      label: isIt ? "Fatturazione" : "Billing",
      description: isIt ? "Piano, Stripe, fatture" : "Plan, Stripe, invoices",
      keywords: isIt ? "abbonamento piano stripe fattura" : "subscription plan stripe invoice",
      icon: <CreditCard className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/billing",
    },
    {
      id: "ql-workspace",
      label: isIt ? "Workspace" : "Workspace",
      description: isIt ? "Moduli e preferenze agenzia" : "Agency modules and preferences",
      keywords: isIt ? "impostazioni moduli agenzia" : "settings modules agency",
      icon: <Settings className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard/settings/workspace",
    },
    {
      id: "ql-home",
      label: isIt ? "Command Center (home)" : "Command Center (home)",
      description: isIt ? "Dashboard principale" : "Main dashboard",
      keywords: isIt ? "home principale panoramica" : "home overview main",
      icon: <Home className="h-4 w-4" />,
      kind: "internal",
      path: "/dashboard",
    },
  ];
}

export function getCommandPaletteGuideLinks(isIt: boolean): CommandPaletteExtraItem[] {
  return [
    {
      id: "g-hub",
      label: isIt ? "Hub documentazione" : "Documentation hub",
      description: isIt ? "Tutte le guide e le FAQ" : "All guides and FAQs",
      keywords: isIt ? "docs aiuto help faq" : "docs help faq support",
      icon: <BookOpen className="h-4 w-4" />,
      kind: "external",
      path: "/docs",
    },
    {
      id: "g-welcome",
      label: isIt ? "Guida: Benvenuto" : "Guide: Welcome",
      description: isIt ? "Introduzione alla piattaforma" : "Platform introduction",
      keywords: isIt ? "inizio intro onboarding" : "start intro onboarding",
      icon: <Sparkles className="h-4 w-4" />,
      kind: "external",
      path: "/docs/getting-started/welcome",
    },
    {
      id: "g-first-listing",
      label: isIt ? "Guida: Primo annuncio" : "Guide: First listing",
      description: isIt ? "Flusso rapido per generare copy" : "Quick flow to generate copy",
      keywords: isIt ? "primo annuncio generare tutorial" : "first listing generate tutorial",
      icon: <FileText className="h-4 w-4" />,
      kind: "external",
      path: "/docs/getting-started/first-listing",
    },
    {
      id: "g-workspace-doc",
      label: isIt ? "Guida: Workspace" : "Guide: Workspace setup",
      description: isIt ? "Moduli e personalizzazione" : "Modules and customization",
      keywords: isIt ? "workspace moduli impostazioni" : "workspace modules settings",
      icon: <Settings className="h-4 w-4" />,
      kind: "external",
      path: "/docs/getting-started/workspace-setup",
    },
    {
      id: "g-perfect-copy",
      label: isIt ? "Guida: Perfect Copy" : "Guide: Perfect Copy",
      description: isIt ? "Campi del form e varianti" : "Form fields and variants",
      keywords: isIt ? "perfect copy form varianti" : "perfect copy form variants",
      icon: <Copy className="h-4 w-4" />,
      kind: "external",
      path: "/docs/getting-started/perfect-copy",
    },
    {
      id: "g-pipeline",
      label: isIt ? "Guida: Pipeline Kanban" : "Guide: Kanban pipeline",
      description: isIt ? "Trascinamento stati e CRM" : "Drag status and CRM",
      keywords: isIt ? "pipeline kanban lead crm" : "pipeline kanban leads crm",
      icon: <Layers className="h-4 w-4" />,
      kind: "external",
      path: "/docs/crm/pipeline",
    },
    {
      id: "g-billing",
      label: isIt ? "Guida: Piano e fatturazione" : "Guide: Plan & billing",
      description: isIt ? "Stripe e abbonamento" : "Stripe and subscription",
      keywords: isIt ? "fatturazione stripe piano abbonamento" : "billing stripe plan subscription",
      icon: <CreditCard className="h-4 w-4" />,
      kind: "external",
      path: "/docs/account/billing-guide",
    },
    {
      id: "g-arbitrage",
      label: isIt ? "Guida: Arbitraggio / Market Gap" : "Guide: Arbitrage / Market Gap",
      description: isIt ? "Opportunità e pricing" : "Opportunities and pricing",
      keywords: isIt ? "arbitraggio market gap deal" : "arbitrage market gap deal",
      icon: <Target className="h-4 w-4" />,
      kind: "external",
      path: "/docs/prospecting/arbitrage",
    },
  ];
}
