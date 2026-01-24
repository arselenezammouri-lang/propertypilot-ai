"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function DashboardHelpButton() {
  const handleOpenDocs = () => {
    window.open('/docs', '_blank');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleOpenDocs}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/20"
      title="Apri Documentation Hub"
    >
      <HelpCircle className="h-6 w-6 text-purple-400" />
    </Button>
  );
}

