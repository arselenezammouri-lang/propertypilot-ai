"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  const [type, setType] = useState<"underpriced" | "old" | "uncontacted">("underpriced");
  const [days, setDays] = useState(14);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Opportunity[]>([]);

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
    if (!price) return "n.d.";
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Radar Opportunità</CardTitle>
          <CardDescription>
            Trova immobili sotto-prezzo, annunci vecchi o mai contattati per nuovi mandati.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Tipo opportunità</p>
            <Select
              value={type}
              onValueChange={(v) => setType(v as typeof type)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="underpriced">Sotto-prezzo</SelectItem>
                <SelectItem value="old">Annunci vecchi</SelectItem>
                <SelectItem value="uncontacted">Mai contattati</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Città (opzionale)</p>
            <Input
              placeholder="Milano"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          {type === "old" && (
            <div>
              <p className="text-sm font-medium mb-1">Vecchi da almeno (giorni)</p>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value || 0))}
              />
            </div>
          )}
          <div className="flex items-end">
            <Button onClick={load} disabled={loading}>
              {loading ? "Caricamento..." : "Aggiorna"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risultati</CardTitle>
          <CardDescription>
            {items.length === 0 && !loading
              ? "Nessuna opportunità trovata con i filtri correnti."
              : "Seleziona un annuncio per aprire i dettagli."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Caricamento opportunità...</p>}
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
                      {item.city} • {item.source || "sconosciuto"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                    {item.status && (
                      <p className="text-xs text-muted-foreground">Stato: {item.status}</p>
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

