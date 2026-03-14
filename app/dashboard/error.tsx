"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Card className="max-w-lg mx-auto border-destructive/50 bg-card/80">
        <CardHeader>
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-10 w-10 flex-shrink-0" aria-hidden />
            <div>
              <CardTitle className="text-xl">Qualcosa è andato storto</CardTitle>
              <CardDescription>
                Si è verificato un errore nella dashboard. Puoi riprovare o tornare alla home.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} variant="default" className="gap-2" data-testid="error-retry">
            <RefreshCw className="h-4 w-4" />
            Riprova
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard" data-testid="error-back-dashboard">
              <Home className="h-4 w-4" />
              Torna alla Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
