"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";

export function DashboardHelpButton() {
  const { locale } = useLocaleContext();
  const handleOpenDocs = () => {
    window.open('/docs', '_blank');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleOpenDocs}
      className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-border hover:border-primary/30 hover:bg-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/20 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      title={locale === "it" ? "Apri Documentation Hub" : "Open Documentation Hub"}
      aria-label={locale === "it" ? "Apri Documentation Hub" : "Open Documentation Hub"}
    >
      <HelpCircle className="h-6 w-6 text-purple-400" />
    </Button>
  );
}

