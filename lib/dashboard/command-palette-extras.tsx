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
import type {
  CommandPaletteExtraStrings,
  CommandPaletteGuideLinkId,
  CommandPaletteQuickLinkId,
} from "@/lib/i18n/dashboard-nav-ui";

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

const QUICK_ORDER: CommandPaletteQuickLinkId[] = [
  "ql-listings",
  "ql-perfect-copy",
  "ql-pipeline",
  "ql-lead-score",
  "ql-billing",
  "ql-workspace",
  "ql-home",
];

const QUICK_ICONS: Record<CommandPaletteQuickLinkId, ReactNode> = {
  "ql-listings": <FileText className="h-4 w-4" />,
  "ql-perfect-copy": <Copy className="h-4 w-4" />,
  "ql-pipeline": <Layers className="h-4 w-4" />,
  "ql-lead-score": <Brain className="h-4 w-4" />,
  "ql-billing": <CreditCard className="h-4 w-4" />,
  "ql-workspace": <Settings className="h-4 w-4" />,
  "ql-home": <Home className="h-4 w-4" />,
};

const QUICK_PATHS: Record<CommandPaletteQuickLinkId, string> = {
  "ql-listings": "/dashboard/listings",
  "ql-perfect-copy": "/dashboard/perfect-copy",
  "ql-pipeline": "/dashboard/leads/pipeline",
  "ql-lead-score": "/dashboard/lead-score",
  "ql-billing": "/dashboard/billing",
  "ql-workspace": "/dashboard/settings/workspace",
  "ql-home": "/dashboard",
};

const GUIDE_ORDER: CommandPaletteGuideLinkId[] = [
  "g-hub",
  "g-welcome",
  "g-first-listing",
  "g-workspace-doc",
  "g-perfect-copy",
  "g-pipeline",
  "g-billing",
  "g-arbitrage",
];

const GUIDE_ICONS: Record<CommandPaletteGuideLinkId, ReactNode> = {
  "g-hub": <BookOpen className="h-4 w-4" />,
  "g-welcome": <Sparkles className="h-4 w-4" />,
  "g-first-listing": <FileText className="h-4 w-4" />,
  "g-workspace-doc": <Settings className="h-4 w-4" />,
  "g-perfect-copy": <Copy className="h-4 w-4" />,
  "g-pipeline": <Layers className="h-4 w-4" />,
  "g-billing": <CreditCard className="h-4 w-4" />,
  "g-arbitrage": <Target className="h-4 w-4" />,
};

const GUIDE_PATHS: Record<CommandPaletteGuideLinkId, string> = {
  "g-hub": "/docs",
  "g-welcome": "/docs/getting-started/welcome",
  "g-first-listing": "/docs/getting-started/first-listing",
  "g-workspace-doc": "/docs/getting-started/workspace-setup",
  "g-perfect-copy": "/docs/getting-started/perfect-copy",
  "g-pipeline": "/docs/crm/pipeline",
  "g-billing": "/docs/account/billing-guide",
  "g-arbitrage": "/docs/prospecting/arbitrage",
};

/**
 * Quick links for the command palette — copy from `getTranslation(locale).commandPaletteExtras`.
 */
export function getCommandPaletteQuickLinks(strings: CommandPaletteExtraStrings): CommandPaletteExtraItem[] {
  return QUICK_ORDER.map((id) => {
    const s = strings.quick[id];
    return {
      id,
      label: s.label,
      description: s.description,
      keywords: s.keywords,
      icon: QUICK_ICONS[id],
      kind: "internal",
      path: QUICK_PATHS[id],
    };
  });
}

export function getCommandPaletteGuideLinks(strings: CommandPaletteExtraStrings): CommandPaletteExtraItem[] {
  return GUIDE_ORDER.map((id) => {
    const s = strings.guides[id];
    return {
      id,
      label: s.label,
      description: s.description,
      keywords: s.keywords,
      icon: GUIDE_ICONS[id],
      kind: "external",
      path: GUIDE_PATHS[id],
    };
  });
}
