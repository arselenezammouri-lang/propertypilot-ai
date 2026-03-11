"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatDateTimeForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import { useToast } from "@/hooks/use-toast";
import { useAPIErrorHandler } from "@/components/error-boundary";

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
  const { locale } = useLocaleContext();
  const { toast } = useToast();
  const [rule, setRule] = useState<AutopilotRule | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const { handleAPIError } = useAPIErrorHandler();

  const t = {
    it: {
      title: "Autopilot Mandati 24/7",
      subtitle: "Lo scraper e il Voice AI lavorano ogni giorno per trovare nuovi incarichi e creare lead in automatico.",
      active: "Autopilot attivo",
      rulePlaceholder: "Nome regola (es. Mandati Milano Centro)",
      city: "Città",
      region: "Regione/Provincia",
      minPrice: "Prezzo minimo",
      maxPrice: "Prezzo massimo",
      runHour: "Ora di esecuzione (UTC)",
      dailyLimit: "Max nuovi lead al giorno",
      saving: "Salvataggio...",
      save: "Salva regola Autopilot",
      lastRuns: "Ultimi run",
      noRuns: "Nessun run registrato.",
      opportunities: "opportunità",
      leads: "lead",
      recentActions: "Azioni recenti",
      noActions: "Nessuna azione registrata.",
      defaultRule: "Autopilot Mandati",
      loadError: "Impossibile caricare la configurazione Autopilot.",
      saveSuccess: "Regola Autopilot salvata",
      saveError: "Errore nel salvataggio della regola Autopilot.",
    },
    en: {
      title: "Mandate Autopilot 24/7",
      subtitle: "Scraper and Voice AI work every day to find new mandates and create leads automatically.",
      active: "Autopilot enabled",
      rulePlaceholder: "Rule name (e.g. Milan Center Mandates)",
      city: "City",
      region: "Region/Province",
      minPrice: "Minimum price",
      maxPrice: "Maximum price",
      runHour: "Run time (UTC)",
      dailyLimit: "Max new leads per day",
      saving: "Saving...",
      save: "Save Autopilot rule",
      lastRuns: "Latest runs",
      noRuns: "No runs recorded.",
      opportunities: "opportunities",
      leads: "leads",
      recentActions: "Recent actions",
      noActions: "No actions recorded.",
      defaultRule: "Mandate Autopilot",
      loadError: "Unable to load Autopilot configuration.",
      saveSuccess: "Autopilot rule saved",
      saveError: "Error while saving Autopilot rule.",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    try {
      const { data: rules, error: rulesError } = await supabase
        .from("prospecting_autopilot_rules")
        .select("*")
        .limit(1);

      if (rulesError) throw rulesError;

      if (rules && rules.length > 0) {
        setRule(rules[0] as AutopilotRule);
      } else {
        setRule({
          name: t.defaultRule,
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

      const { data: recentRuns, error: runsError } = await supabase
        .from("autopilot_runs")
        .select("*")
        .order("run_at", { ascending: false })
        .limit(10);

      if (runsError) throw runsError;
      setRuns(recentRuns ?? []);

      const { data: recentActions, error: actionsError } = await supabase
        .from("autopilot_actions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (actionsError) throw actionsError;
      setActions(recentActions ?? []);
    } catch (error: any) {
      const friendly = handleAPIError(error, t.loadError);
      toast({
        title: "Autopilot",
        description: friendly,
        variant: "destructive",
      });
    }
  };

  const updateField = (patch: Partial<AutopilotRule>) => {
    setRule((prev) => ({ ...(prev ?? { name: t.defaultRule, portals: [] as string[] } as AutopilotRule), ...patch }));
  };

  const handleSave = async () => {
    if (!rule) return;
    setSaving(true);
    const supabase = createClient();

    try {
      if (rule.id) {
        const { error } = await supabase
          .from("prospecting_autopilot_rules")
          .update(rule)
          .eq("id", rule.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("prospecting_autopilot_rules")
          .insert(rule)
          .select("*")
          .single();

        if (error) throw error;
        setRule(data as AutopilotRule);
      }
      toast({
        title: "Autopilot",
        description: t.saveSuccess,
      });
    } catch (error: any) {
      const friendly = handleAPIError(error, t.saveError);
      toast({
        title: "Autopilot",
        description: friendly,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rule && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.active}</span>
                <Switch
                  checked={rule.active}
                  onCheckedChange={(v) => updateField({ active: v })}
                />
              </div>

              <Input
                placeholder={t.rulePlaceholder}
                value={rule.name}
                onChange={(e) => updateField({ name: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder={t.city}
                  value={rule.city ?? ""}
                  onChange={(e) => updateField({ city: e.target.value || null })}
                />
                <Input
                  placeholder={t.region}
                  value={rule.region ?? ""}
                  onChange={(e) => updateField({ region: e.target.value || null })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t.minPrice}
                  value={rule.min_price ?? ""}
                  onChange={(e) => updateField({ min_price: e.target.value ? Number(e.target.value) : null })}
                />
                <Input
                  type="number"
                  placeholder={t.maxPrice}
                  value={rule.max_price ?? ""}
                  onChange={(e) => updateField({ max_price: e.target.value ? Number(e.target.value) : null })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">{t.runHour}</p>
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
                  <p className="text-sm font-medium mb-1">{t.dailyLimit}</p>
                  <Input
                    type="number"
                    value={rule.daily_limit}
                    onChange={(e) => updateField({ daily_limit: Number(e.target.value || 0) })}
                  />
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? t.saving : t.save}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.lastRuns}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {runs.length === 0 && <p className="text-muted-foreground">{t.noRuns}</p>}
          {runs.map((r) => (
            <div key={r.id} className="flex justify-between border-b border-border/20 py-1">
              <span>{formatDateTimeForLocale(r.run_at, locale as Locale)}</span>
              <span>{r.status}</span>
              <span>{r.total_opportunities} {t.opportunities}</span>
              <span>{r.total_leads_created} {t.leads}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.recentActions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {actions.length === 0 && <p className="text-muted-foreground">{t.noActions}</p>}
          {actions.map((a) => (
            <div key={a.id} className="flex justify-between border-b border-border/20 py-1">
              <span>{formatDateTimeForLocale(a.created_at, locale as Locale)}</span>
              <span>{a.action_type}</span>
              <span>{a.action_status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

