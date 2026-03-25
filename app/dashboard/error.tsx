"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { SEO_APP_NAME } from "@/lib/i18n/root-site-metadata";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale).errors;

  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `${t.dashboardAreaErrorTitle} | ${SEO_APP_NAME}`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", t.dashboardAreaErrorDesc);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
  }, [t.dashboardAreaErrorTitle, t.dashboardAreaErrorDesc]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Card className="max-w-lg mx-auto border-destructive/50 bg-card/80">
        <CardHeader>
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-10 w-10 flex-shrink-0" aria-hidden />
            <div>
              <CardTitle className="text-xl">{t.dashboardAreaErrorTitle}</CardTitle>
              <CardDescription>{t.dashboardAreaErrorDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} variant="default" className="gap-2" data-testid="error-retry">
            <RefreshCw className="h-4 w-4" aria-hidden />
            {t.tryAgain}
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard" data-testid="error-back-dashboard">
              <Home className="h-4 w-4" aria-hidden />
              {t.backToDashboard}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
