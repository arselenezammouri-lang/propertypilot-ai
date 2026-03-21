"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDashboardNavGroups } from "@/lib/dashboard/nav-config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CLOSE_EVENT = "dashboard-mobile-nav-close";

function closeDashboardMobileNav(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CLOSE_EVENT));
  }
}

/**
 * Mobile / tablet drawer with the same JTBD groups as the desktop sidebar (Fase A5).
 */
export function DashboardMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useLocale();
  const isIt = locale !== "en";
  const groups = getDashboardNavGroups(isIt);

  useEffect(() => {
    const onClose = () => setOpen(false);
    window.addEventListener(CLOSE_EVENT, onClose);
    return () => window.removeEventListener(CLOSE_EVENT, onClose);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden min-h-9 border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
          aria-label={isIt ? "Apri menu area lavoro" : "Open workspace menu"}
          data-testid="button-dashboard-mobile-nav"
        >
          <Menu className="h-4 w-4 mr-2" />
          {isIt ? "Menu" : "Menu"}
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed left-0 top-0 z-50 flex h-full max-h-none w-[min(100vw-1rem,320px)] translate-x-0 translate-y-0 flex-col rounded-none border-r border-white/10 bg-[#0a0a0a] p-0 text-white shadow-2xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-none sm:rounded-none [&>button]:hidden">
        <DialogHeader className="px-4 py-4 border-b border-white/10 text-left space-y-1">
          <DialogTitle className="text-base text-white">
            {isIt ? "Area lavoro" : "Workspace"}
          </DialogTitle>
          <p className="text-xs text-white/50 font-normal">
            {isIt ? "Stessi gruppi della barra laterale desktop" : "Same groups as the desktop sidebar"}
          </p>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[calc(100vh-5.5rem)]">
          <nav className="px-2 py-3 space-y-5 pb-8" aria-label={isIt ? "Navigazione mobile" : "Mobile navigation"}>
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
                          onClick={() => closeDashboardMobileNav()}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-2.5 min-h-11 text-sm transition-colors",
                            active
                              ? "bg-white/10 text-white"
                              : "text-white/75 hover:text-white hover:bg-white/[0.06]"
                          )}
                        >
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                            {item.icon}
                          </span>
                          <span className="min-w-0 flex-1 font-medium leading-snug">{item.label}</span>
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
      </DialogContent>
    </Dialog>
  );
}
