"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden group gap-2 border border-white/[0.08] hover:border-white/20 transition-all"
      data-testid="button-theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Moon className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-medium hidden sm:inline">Ombra</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-yellow-400" />
          <span className="text-xs font-medium hidden sm:inline">Luce</span>
        </>
      )}
    </Button>
  );
}
