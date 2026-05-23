"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center py-20">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={reset} variant="outline">Try Again</Button>
    </div>
  );
}
