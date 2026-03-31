"use client";

import Link from "next/link";
import {
  Sparkles,
  Type,
  Hash,
  Video,
  Heart,
  Globe,
  Users,
  Search,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

interface QuickAction {
  label: string;
  labelIt: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  descriptionIt: string;
  color: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Generate Listing",
    labelIt: "Genera Annuncio",
    href: "/dashboard/perfect-copy",
    icon: Sparkles,
    description: "AI-powered property copy in seconds",
    descriptionIt: "Copia immobiliare AI in secondi",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "A/B Titles",
    labelIt: "Titoli A/B",
    href: "/dashboard/titles",
    icon: Type,
    description: "5 high-CTR title variants",
    descriptionIt: "5 varianti ad alto CTR",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "Social Posts",
    labelIt: "Post Social",
    href: "/dashboard/social-posts",
    icon: Hash,
    description: "Instagram, Facebook, LinkedIn",
    descriptionIt: "Instagram, Facebook, LinkedIn",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    label: "Video Script",
    labelIt: "Script Video",
    href: "/dashboard/video-scripts",
    icon: Video,
    description: "Reels and TikTok scripts",
    descriptionIt: "Script per Reels e TikTok",
    color: "bg-red-500/10 text-red-600",
  },
  {
    label: "Manage Leads",
    labelIt: "Gestisci Lead",
    href: "/dashboard/leads",
    icon: Users,
    description: "CRM pipeline and scoring",
    descriptionIt: "Pipeline CRM e scoring",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Market Search",
    labelIt: "Cerca Mercato",
    href: "/dashboard/prospecting",
    icon: Search,
    description: "Find opportunities first",
    descriptionIt: "Trova opportunità per primo",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export function QuickActions() {
  const { locale } = useLocaleContext();
  const isIt = locale === "it";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">
          {isIt ? "Azioni rapide" : "Quick actions"}
        </h2>
        <Link
          href="/dashboard/listings"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {isIt ? "Vedi tutti gli strumenti" : "View all tools"}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="pp-card p-4 hover-lift group text-center"
          >
            <div
              className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium mb-0.5 truncate">
              {isIt ? action.labelIt : action.label}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {isIt ? action.descriptionIt : action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
