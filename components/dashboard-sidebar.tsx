"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Users,
  BarChart3,
  Zap,
  Hash,
  Type,
  Heart,
  Video,
  User,
  Globe,
  Palette,
  Bot,
  Target,
  Mail,
  CreditCard,
  Settings,
  Gift,
  Search,
  Folder,
  PenTool,
  Sparkles,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Home },
      { label: "Saved Listings", href: "/dashboard/listings", icon: Folder },
    ],
  },
  {
    title: "AI Content",
    items: [
      { label: "Generate Listing", href: "/dashboard/perfect-copy", icon: Sparkles },
      { label: "Titles A/B Test", href: "/dashboard/titles", icon: Type },
      { label: "Social Posts", href: "/dashboard/social-posts", icon: Hash },
      { label: "Hashtags", href: "/dashboard/hashtags", icon: Hash },
      { label: "Video Scripts", href: "/dashboard/video-scripts", icon: Video },
      { label: "Agent Bio", href: "/dashboard/agent-bio", icon: User },
      { label: "Emotional Copy", href: "/dashboard/emotional-listing", icon: Heart },
      { label: "Translate", href: "/dashboard/translate", icon: Globe },
    ],
  },
  {
    title: "CRM",
    items: [
      { label: "Leads", href: "/dashboard/leads", icon: Users },
      { label: "Lead Score", href: "/dashboard/lead-score", icon: Target, badge: "Pro" },
      { label: "Follow-up Emails", href: "/dashboard/followup-emails", icon: Mail },
      { label: "Automations", href: "/dashboard/automations", icon: Zap, badge: "Pro" },
    ],
  },
  {
    title: "Prospecting",
    items: [
      { label: "Market Search", href: "/dashboard/prospecting", icon: Search },
      { label: "Scraper", href: "/dashboard/scraper", icon: Globe },
      { label: "Analyze Link", href: "/dashboard/analyze", icon: BarChart3 },
      { label: "Auditor", href: "/dashboard/auditor", icon: Shield },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Referral", href: "/dashboard/referral", icon: Gift },
      { label: "Settings", href: "/dashboard/settings/workspace", icon: Settings },`n      { label: "Admin", href: "/dashboard/admin", icon: Shield, badge: "Founder" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Collapse toggle — desktop only */}
      <div className="hidden lg:flex border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[18px] left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <span className="text-sm font-semibold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-card border-r border-border z-30 transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/**
 * Helper: returns margin-left class for main content based on sidebar state
 */
export function useSidebarOffset(): string {
  return "lg:ml-60";
}
