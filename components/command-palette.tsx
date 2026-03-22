"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { HelpCircle, LogOut } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { Badge } from "@/components/ui/badge";
import { getDashboardNavGroups, type DashboardNavItem } from "@/lib/dashboard/nav-config";
import {
  getCommandPaletteGuideLinks,
  getCommandPaletteQuickLinks,
  type CommandPaletteExtraItem,
} from "@/lib/dashboard/command-palette-extras";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const t = useMemo(() => getTranslation(locale as SupportedLocale), [locale]);
  const nav = t.dashboardNav;
  const cp = nav.commandPalette;

  const navGroups = useMemo(() => getDashboardNavGroups(nav), [nav]);
  const quickLinks = useMemo(() => getCommandPaletteQuickLinks(t.commandPaletteExtras), [t.commandPaletteExtras]);
  const guideLinks = useMemo(() => getCommandPaletteGuideLinks(t.commandPaletteExtras), [t.commandPaletteExtras]);

  const handleSelect = useCallback(
    (item: DashboardNavItem) => {
      setOpen(false);
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router]
  );

  const handleSelectExtra = useCallback(
    (item: CommandPaletteExtraItem) => {
      setOpen(false);
      if (item.kind === "internal") {
        router.push(item.path);
        return;
      }
      if (typeof window !== "undefined") {
        window.open(
          item.path.startsWith("http") ? item.path : `${window.location.origin}${item.path}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    },
    [router]
  );

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={cp.placeholder} />
      <CommandList>
        <CommandEmpty>{cp.noResults}</CommandEmpty>
        <CommandGroup heading={cp.quickLinksHeading}>
          {quickLinks.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.description} ${item.keywords}`}
              onSelect={() => handleSelectExtra(item)}
              className="flex cursor-pointer items-center gap-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{item.label}</span>
                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={cp.guidesHeading}>
          {guideLinks.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.description} ${item.keywords}`}
              onSelect={() => handleSelectExtra(item)}
              className="flex cursor-pointer items-center gap-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant="outline" className="h-5 border-white/20 px-1.5 text-[10px] text-muted-foreground">
                    ↗
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {item.description} · {cp.opensNewTab}
                </p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        {navGroups.map((group, groupIdx) => (
          <div key={group.jtbdId}>
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
                        <Badge className={`${item.badgeColor} text-white text-[10px] px-1.5 py-0 h-4`}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading={cp.quickActionsHeading}>
          <CommandItem
            value={`${cp.help} ${cp.helpDesc}`}
            onSelect={() => {
              setOpen(false);
              router.push("/docs");
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm">{cp.help}</span>
              <p className="text-xs text-muted-foreground truncate">{cp.helpDesc}</p>
            </div>
          </CommandItem>
          <CommandItem
            value={`${cp.signOut} ${cp.signOutDesc}`}
            onSelect={() => {
              setOpen(false);
              const form = document.createElement("form");
              form.method = "POST";
              form.action = "/auth/signout";
              document.body.appendChild(form);
              form.submit();
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm">{cp.signOut}</span>
              <p className="text-xs text-muted-foreground truncate">{cp.signOutDesc}</p>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
