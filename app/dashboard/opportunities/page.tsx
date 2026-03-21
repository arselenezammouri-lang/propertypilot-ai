"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import { useToast } from "@/hooks/use-toast";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { fetchApi } from "@/lib/api/client";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { apiFailureToast, networkFailureToast } from "@/lib/i18n/api-feature-feedback";

type Opportunity = {
  id: string;
  title: string;
  city: string;
  price: number | null;
  source: string | null;
  status: string | null;
  created_at: string | null;
};

export default function OpportunitiesPage() {
  const { locale, currency } = useLocaleContext();
  const { toast } = useToast();
  const { plan, isLoading: planLoading } = useUsageLimits();
  const feedbackLocale = (locale === "it" ? "it" : "en") as "it" | "en";
  const [type, setType] = useState<"underpriced" | "old" | "uncontacted">("underpriced");
  const [days, setDays] = useState(14);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Opportunity[]>([]);

  const t = {
    it: {
      title: "Radar Opportunità",
      subtitle: "Trova immobili sotto-prezzo, annunci vecchi o mai contattati per nuovi mandati.",
      type: "Tipo opportunità",
      underpriced: "Sotto-prezzo",
      old: "Annunci vecchi",
      uncontacted: "Mai contattati",
      city: "Città (opzionale)",
      cityPlaceholder: "Milano",
      oldDays: "Vecchi da almeno (giorni)",
      loading: "Caricamento...",
      refresh: "Aggiorna",
      results: "Risultati",
      noResults: "Nessuna opportunità trovata con i filtri correnti.",
      selectListing: "Seleziona un annuncio per aprire i dettagli.",
      loadingResults: "Caricamento opportunità...",
      loadFailed: "Impossibile caricare le opportunità.",
      unknown: "sconosciuto",
      status: "Stato",
      na: "n.d.",
    },
    en: {
      title: "Opportunity Radar",
      subtitle: "Find underpriced properties, old listings, or never-contacted owners for new mandates.",
      type: "Opportunity type",
      underpriced: "Underpriced",
      old: "Old listings",
      uncontacted: "Never contacted",
      city: "City (optional)",
      cityPlaceholder: "Milan",
      oldDays: "Older than (days)",
      loading: "Loading...",
      refresh: "Refresh",
      results: "Results",
      noResults: "No opportunities found with the current filters.",
      selectListing: "Select a listing to open details.",
      loadingResults: "Loading opportunities...",
      loadFailed: "Could not load opportunities.",
      unknown: "unknown",
      status: "Status",
      na: "n/a",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, days, city]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("type", type);
    if (type === "old") params.set("days", String(days));
    if (city) params.set("city", city);

    try {
      const res = await fetchApi<Opportunity[]>(
        `/api/opportunities?${params.toString()}`
      );
      if (res.success) {
        setItems(Array.isArray(res.data) ? res.data : []);
      } else {
        setItems([]);
        toast({
          ...apiFailureToast(
            feedbackLocale,
            "opportunityRadar",
            { status: res.status, message: res.message, error: res.error },
            t.loadFailed
          ),
          variant: "destructive",
        });
      }
    } catch {
      setItems([]);
      toast({
        ...networkFailureToast(feedbackLocale, "opportunityRadar"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return t.na;
    return formatCurrencyForLocale(price, locale as Locale, currency);
  };

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={t.title}
        titleDataTestId="heading-opportunities"
        subtitle={t.subtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: "secondary" } : undefined
        }
      />
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">
            {locale === "it" ? "Filtri ricerca" : "Search filters"}
          </CardTitle>
          <CardDescription className="text-white/60">
            {locale === "it"
              ? "Affina il tipo di opportunità e la zona."
              : "Refine opportunity type and area."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">{t.type}</p>
            <Select
              value={type}
              onValueChange={(v) => setType(v as typeof type)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="underpriced">{t.underpriced}</SelectItem>
                <SelectItem value="old">{t.old}</SelectItem>
                <SelectItem value="uncontacted">{t.uncontacted}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">{t.city}</p>
            <Input
              placeholder={t.cityPlaceholder}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          {type === "old" && (
            <div>
              <p className="text-sm font-medium mb-1">{t.oldDays}</p>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value || 0))}
              />
            </div>
          )}
          <div className="flex items-end">
            <Button onClick={load} disabled={loading}>
              {loading ? t.loading : t.refresh}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">{t.results}</CardTitle>
          <CardDescription className="text-white/60">
            {items.length === 0 && !loading
              ? t.noResults
              : t.selectListing}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-sm text-white/55">{t.loadingResults}</p>
          )}
          {!loading && items.length > 0 && (
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-white/10 py-2 cursor-pointer hover:bg-white/5 rounded-sm px-1 -mx-1"
                  onClick={() => {
                    window.location.href = `/dashboard/prospecting?listing=${item.id}`;
                  }}
                >
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/55">
                      {item.city} • {item.source || t.unknown}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatPrice(item.price)}</p>
                    {item.status && (
                      <p className="text-xs text-white/55">{t.status}: {item.status}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}

