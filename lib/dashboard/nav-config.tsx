import type { ReactNode } from "react";
import type { DashboardJtbdId, DashboardNavUi } from "@/lib/i18n/dashboard-nav-ui";
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

export type { DashboardJtbdId };

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

function c(nav: DashboardNavUi, jtbd: DashboardJtbdId, id: string) {
  const copy = nav.jtbd[jtbd].items[id];
  if (!copy) {
    throw new Error(`dashboard nav copy missing: ${jtbd}/${id}`);
  }
  return copy;
}

/**
 * Single source of truth for dashboard navigation structure (Command Palette + sidebar + mobile).
 * Labels/descriptions from `dashboardNavUi` (IT/EN in repo; other locales merge from EN via dictionary).
 */
export function getDashboardNavGroups(nav: DashboardNavUi): DashboardNavGroup[] {
  return [
    {
      jtbdId: "content",
      heading: nav.jtbd.content.heading,
      items: [
        {
          id: "listings",
          ...c(nav, "content", "listings"),
          icon: <FileText className="h-4 w-4" />,
          href: "/dashboard/listings",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "perfect-copy",
          ...c(nav, "content", "perfect-copy"),
          icon: <Copy className="h-4 w-4" />,
          href: "/dashboard/perfect-copy",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "titles",
          ...c(nav, "content", "titles"),
          icon: <Pen className="h-4 w-4" />,
          href: "/dashboard/titles",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "emotional-listing",
          ...c(nav, "content", "emotional-listing"),
          icon: <Heart className="h-4 w-4" />,
          href: "/dashboard/emotional-listing",
          badge: "AI",
          badgeColor: "bg-red-500",
        },
        {
          id: "refine-listing",
          ...c(nav, "content", "refine-listing"),
          icon: <Sparkles className="h-4 w-4" />,
          href: "/dashboard/refine-listing",
          badge: "AI",
          badgeColor: "bg-violet-500",
        },
        {
          id: "translate",
          ...c(nav, "content", "translate"),
          icon: <Globe className="h-4 w-4" />,
          href: "/dashboard/translate",
          badge: "AI",
          badgeColor: "bg-cyan-500",
        },
        {
          id: "social-posts",
          ...c(nav, "content", "social-posts"),
          icon: <Share2 className="h-4 w-4" />,
          href: "/dashboard/social-posts",
          badge: "AI",
          badgeColor: "bg-pink-500",
        },
        {
          id: "hashtags",
          ...c(nav, "content", "hashtags"),
          icon: <Hash className="h-4 w-4" />,
          href: "/dashboard/hashtags",
          badge: "AI",
          badgeColor: "bg-pink-500",
        },
        {
          id: "followup-emails",
          ...c(nav, "content", "followup-emails"),
          icon: <Mail className="h-4 w-4" />,
          href: "/dashboard/followup-emails",
          badge: "AI",
          badgeColor: "bg-blue-500",
        },
        {
          id: "video-scripts",
          ...c(nav, "content", "video-scripts"),
          icon: <Video className="h-4 w-4" />,
          href: "/dashboard/video-scripts",
          badge: "AI",
          badgeColor: "bg-orange-500",
        },
        {
          id: "agent-bio",
          ...c(nav, "content", "agent-bio"),
          icon: <User className="h-4 w-4" />,
          href: "/dashboard/agent-bio",
          badge: "AI",
          badgeColor: "bg-green-500",
        },
        {
          id: "pdf",
          ...c(nav, "content", "pdf"),
          icon: <FileText className="h-4 w-4" />,
          href: "/dashboard/pdf",
          badge: "STARTER+",
          badgeColor: "bg-blue-500",
        },
      ],
    },
    {
      jtbdId: "crm",
      heading: nav.jtbd.crm.heading,
      items: [
        {
          id: "prospecting",
          ...c(nav, "crm", "prospecting"),
          icon: <Search className="h-4 w-4" />,
          href: "/dashboard/prospecting",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "leads",
          ...c(nav, "crm", "leads"),
          icon: <Users className="h-4 w-4" />,
          href: "/dashboard/leads",
        },
        {
          id: "pipeline",
          ...c(nav, "crm", "pipeline"),
          icon: <Layers className="h-4 w-4" />,
          href: "/dashboard/leads/pipeline",
        },
        {
          id: "workflow-automations",
          ...c(nav, "crm", "workflow-automations"),
          icon: <Settings className="h-4 w-4" />,
          href: "/dashboard/automations",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "crm-automations",
          ...c(nav, "crm", "crm-automations"),
          icon: <Zap className="h-4 w-4" />,
          href: "/dashboard/crm/automations",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "map",
          ...c(nav, "crm", "map"),
          icon: <Map className="h-4 w-4" />,
          href: "/dashboard/map",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
        {
          id: "lead-score",
          ...c(nav, "crm", "lead-score"),
          icon: <Brain className="h-4 w-4" />,
          href: "/dashboard/lead-score",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "opportunities",
          ...c(nav, "crm", "opportunities"),
          icon: <Target className="h-4 w-4" />,
          href: "/dashboard/opportunities",
        },
      ],
    },
    {
      jtbdId: "intel",
      heading: nav.jtbd.intel.heading,
      items: [
        {
          id: "analyze",
          ...c(nav, "intel", "analyze"),
          icon: <ImageIcon className="h-4 w-4" />,
          href: "/dashboard/analyze",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "auditor",
          ...c(nav, "intel", "auditor"),
          icon: <BarChart2 className="h-4 w-4" />,
          href: "/dashboard/auditor",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "autopilot",
          ...c(nav, "intel", "autopilot"),
          icon: <Bot className="h-4 w-4" />,
          href: "/dashboard/autopilot",
          badge: "AGENCY",
          badgeColor: "bg-rose-500",
        },
        {
          id: "scraper",
          ...c(nav, "intel", "scraper"),
          icon: <Globe className="h-4 w-4" />,
          href: "/dashboard/scraper",
          badge: "PRO",
          badgeColor: "bg-amber-500",
        },
      ],
    },
    {
      jtbdId: "brand",
      heading: nav.jtbd.brand.heading,
      items: [
        {
          id: "agency-branding",
          ...c(nav, "brand", "agency-branding"),
          icon: <Building2 className="h-4 w-4" />,
          href: "/dashboard/agency-branding",
        },
        {
          id: "agency-assistant",
          ...c(nav, "brand", "agency-assistant"),
          icon: <MessageSquare className="h-4 w-4" />,
          href: "/dashboard/agency-assistant",
          badge: "AI",
          badgeColor: "bg-purple-500",
        },
        {
          id: "packages",
          ...c(nav, "brand", "packages"),
          icon: <Layers className="h-4 w-4" />,
          href: "/dashboard/packages",
        },
        {
          id: "referral",
          ...c(nav, "brand", "referral"),
          icon: <Share2 className="h-4 w-4" />,
          href: "/dashboard/referral",
        },
      ],
    },
    {
      jtbdId: "account",
      heading: nav.jtbd.account.heading,
      items: [
        {
          id: "dashboard",
          ...c(nav, "account", "dashboard"),
          icon: <Home className="h-4 w-4" />,
          href: "/dashboard",
          shortcut: "⌘H",
        },
        {
          id: "settings-workspace",
          ...c(nav, "account", "settings-workspace"),
          icon: <Settings className="h-4 w-4" />,
          href: "/dashboard/settings/workspace",
          shortcut: "⌘S",
        },
        {
          id: "billing",
          ...c(nav, "account", "billing"),
          icon: <CreditCard className="h-4 w-4" />,
          href: "/dashboard/billing",
        },
        {
          id: "compliance",
          ...c(nav, "account", "compliance"),
          icon: <Shield className="h-4 w-4" />,
          href: "/compliance",
        },
        {
          id: "docs",
          ...c(nav, "account", "docs"),
          icon: <BookOpen className="h-4 w-4" />,
          href: "/docs",
          shortcut: "⌘D",
        },
      ],
    },
  ];
}
