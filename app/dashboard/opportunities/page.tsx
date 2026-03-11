"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

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
  const { locale } = useLocaleContext();
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
      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return t.na;
    return formatCurrencyForLocale(price, locale as Locale);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>
            {t.subtitle}
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

      <Card>
        <CardHeader>
          <CardTitle>{t.results}</CardTitle>
          <CardDescription>
            {items.length === 0 && !loading
              ? t.noResults
              : t.selectListing}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">{t.loadingResults}</p>}
          {!loading && items.length > 0 && (
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-border/20 py-2 cursor-pointer hover:bg-muted/10"
                  onClick={() => {
                    window.location.href = `/dashboard/prospecting?listing=${item.id}`;
                  }}
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.city} • {item.source || t.unknown}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                    {item.status && (
                      <p className="text-xs text-muted-foreground">{t.status}: {item.status}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

