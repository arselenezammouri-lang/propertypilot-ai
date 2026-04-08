"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a stable placeholder until mounted to prevent SVG hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative overflow-hidden group gap-2 border border-border hover:border-border transition-all min-h-[36px] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        <Moon className="h-4 w-4 text-muted-foreground" suppressHydrationWarning />
        <span className="text-xs font-medium hidden sm:inline" suppressHydrationWarning>Ombra</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden group gap-2 border border-border hover:border-border transition-all min-h-[36px] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      data-testid="button-theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Moon className="h-4 w-4 text-muted-foreground" />
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
