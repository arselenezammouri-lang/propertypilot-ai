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
import { HelpCircle, LogOut } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { Badge } from "@/components/ui/badge";
import { getDashboardNavGroups, type DashboardNavItem } from "@/lib/dashboard/nav-config";

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
    signOut: isIt ? "Esci" : "Sign out",
    signOutDesc: isIt ? "Chiudi sessione su questo dispositivo" : "Sign out on this device",
    help: isIt ? "Centro assistenza" : "Help center",
    helpDesc: isIt ? "Guide e FAQ" : "Guides and FAQ",
  };

  const navGroups = getDashboardNavGroups(isIt);

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
      <CommandInput placeholder={t.placeholder} />
      <CommandList>
        <CommandEmpty>{t.noResults}</CommandEmpty>
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
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading={isIt ? "Azioni rapide" : "Quick actions"}>
          <CommandItem
            value={`${t.help} ${t.helpDesc}`}
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
              <span className="font-medium text-sm">{t.help}</span>
              <p className="text-xs text-muted-foreground truncate">{t.helpDesc}</p>
            </div>
          </CommandItem>
          <CommandItem
            value={`${t.signOut} ${t.signOutDesc}`}
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
              <span className="font-medium text-sm">{t.signOut}</span>
              <p className="text-xs text-muted-foreground truncate">{t.signOutDesc}</p>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
