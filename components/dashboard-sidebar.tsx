"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDashboardNavGroups } from "@/lib/dashboard/nav-config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Desktop sidebar: job-to-be-done groups (Fase A5). Hidden below `lg`.
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isIt = locale !== "en";
  const groups = getDashboardNavGroups(isIt);

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-[260px] lg:flex-shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)]"
      aria-label={isIt ? "Navigazione area lavoro" : "Workspace navigation"}
    >
      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col max-h-[inherit]">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
            {isIt ? "Area lavoro" : "Workspace"}
          </p>
          <p className="text-sm text-white/80 mt-0.5">
            {isIt ? "Strumenti per ruolo" : "Tools by job"}
          </p>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <nav className="px-2 py-3 space-y-5">
            {groups.map((group) => (
              <div key={group.jtbdId}>
                <h2 className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {group.heading}
                </h2>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const href = item.href;
                    if (!href) return null;
                    const active =
                      pathname === href ||
                      (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                    return (
                      <li key={item.id}>
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-2 min-h-10 text-sm transition-colors",
                            active
                              ? "bg-white/10 text-white border border-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
                              active ? "bg-white/10" : "bg-white/[0.05]"
                            )}
                          >
                            {item.icon}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                          {item.badge ? (
                            <Badge
                              className={cn(
                                "flex-shrink-0 text-[9px] px-1 py-0 h-4 border-0 text-white",
                                item.badgeColor ?? "bg-white/20"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
