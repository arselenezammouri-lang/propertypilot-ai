"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

type AutopilotRule = {
  id?: string;
  name: string;
  active: boolean;
  city: string | null;
  region: string | null;
  portals: string[];
  min_price: number | null;
  max_price: number | null;
  run_hour_utc: number;
  daily_limit: number;
};

export default function AutopilotPage() {
  const [rule, setRule] = useState<AutopilotRule | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();

    const { data: rules } = await supabase
      .from("prospecting_autopilot_rules")
      .select("*")
      .limit(1);

    if (rules && rules.length > 0) {
      setRule(rules[0] as AutopilotRule);
    } else {
      setRule({
        name: "Autopilot Mandati",
        active: false,
        city: null,
        region: null,
        portals: ["idealista", "immobiliare"],
        min_price: null,
        max_price: null,
        run_hour_utc: 7,
        daily_limit: 10,
      });
    }

    const { data: recentRuns } = await supabase
      .from("autopilot_runs")
      .select("*")
      .order("run_at", { ascending: false })
      .limit(10);

    setRuns(recentRuns ?? []);

    const { data: recentActions } = await supabase
      .from("autopilot_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    setActions(recentActions ?? []);
  };

  const updateField = (patch: Partial<AutopilotRule>) => {
    setRule((prev) => ({ ...(prev ?? { name: "Autopilot Mandati", portals: [] as string[] } as AutopilotRule), ...patch }));
  };

  const handleSave = async () => {
    if (!rule) return;
    setSaving(true);
    const supabase = createClient();

    try {
      if (rule.id) {
        await supabase
          .from("prospecting_autopilot_rules")
          .update(rule)
          .eq("id", rule.id);
      } else {
        const { data, error } = await supabase
          .from("prospecting_autopilot_rules")
          .insert(rule)
          .select("*")
          .single();

        if (error) throw error;
        setRule(data as AutopilotRule);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Autopilot Mandati 24/7</CardTitle>
          <CardDescription>
            Lo scraper e il Voice AI lavorano ogni giorno per trovare nuovi incarichi e creare lead in automatico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rule && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autopilot attivo</span>
                <Switch
                  checked={rule.active}
                  onCheckedChange={(v) => updateField({ active: v })}
                />
              </div>

              <Input
                placeholder="Nome regola (es. Mandati Milano Centro)"
                value={rule.name}
                onChange={(e) => updateField({ name: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Città"
                  value={rule.city ?? ""}
                  onChange={(e) => updateField({ city: e.target.value || null })}
                />
                <Input
                  placeholder="Regione/Provincia"
                  value={rule.region ?? ""}
                  onChange={(e) => updateField({ region: e.target.value || null })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Prezzo minimo"
                  value={rule.min_price ?? ""}
                  onChange={(e) => updateField({ min_price: e.target.value ? Number(e.target.value) : null })}
                />
                <Input
                  type="number"
                  placeholder="Prezzo massimo"
                  value={rule.max_price ?? ""}
                  onChange={(e) => updateField({ max_price: e.target.value ? Number(e.target.value) : null })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Ora di esecuzione (UTC)</p>
                  <Select
                    value={String(rule.run_hour_utc)}
                    onValueChange={(v) => updateField({ run_hour_utc: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, h) => (
                        <SelectItem key={h} value={String(h)}>{`${h}:00`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Max nuovi lead al giorno</p>
                  <Input
                    type="number"
                    value={rule.daily_limit}
                    onChange={(e) => updateField({ daily_limit: Number(e.target.value || 0) })}
                  />
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva regola Autopilot"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ultimi run</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {runs.length === 0 && <p className="text-muted-foreground">Nessun run registrato.</p>}
          {runs.map((r) => (
            <div key={r.id} className="flex justify-between border-b border-border/20 py-1">
              <span>{new Date(r.run_at).toLocaleString()}</span>
              <span>{r.status}</span>
              <span>{r.total_opportunities} opportunità</span>
              <span>{r.total_leads_created} lead</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Azioni recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {actions.length === 0 && <p className="text-muted-foreground">Nessuna azione registrata.</p>}
          {actions.map((a) => (
            <div key={a.id} className="flex justify-between border-b border-border/20 py-1">
              <span>{new Date(a.created_at).toLocaleString()}</span>
              <span>{a.action_type}</span>
              <span>{a.action_status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

