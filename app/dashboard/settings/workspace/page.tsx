"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { Settings, Zap, Phone, Box, Target, Building2, Map as MapIcon, FileText, Sparkles, TrendingDown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { DASHBOARD_TIMEZONE_OPTIONS, type DashboardTimezone } from "@/lib/i18n/timezones";
import { formatDateTimeForLocale } from "@/lib/i18n/intl";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { resolveUiSubscriptionPlan } from "@/lib/utils/effective-plan";
import { isFounderSubscriptionPreviewAllowed } from "@/lib/utils/local-dev-host";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  premiumFeatureToast,
} from "@/lib/i18n/api-feature-feedback";

interface WorkspaceModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiredPlan: 'FREE' | 'STARTER' | 'PRO' | 'AGENCY';
  enabled: boolean;
  trialEnabled?: boolean;
}

export default function WorkspaceSettingsPage() {
  const { locale, currency, timezone, setLocale, setCurrency, setTimezone } = useLocale();
  const feedbackLocale = locale;
  const t = getTranslation(locale as SupportedLocale).dashboard.workspacePage;
  const { toast } = useToast();
  const { plan, isLoading: planLoading } = useUsageLimits();

  const trialDays = 7;

  const [modules, setModules] = useState<WorkspaceModule[]>([]);
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const timezoneGroups = useMemo(() => {
    const regions = getTranslation(locale as SupportedLocale).dashboard.workspacePage.timezoneRegions;
    const labels: Record<string, string> = {
      EU: regions.EU,
      US: regions.US,
      NA: regions.NA,
      LATAM: regions.LATAM,
      ME: regions.ME,
      APAC: regions.APAC,
      UTC: regions.UTC,
    };
    const byRegion = new globalThis.Map<string, (typeof DASHBOARD_TIMEZONE_OPTIONS)[number][]>();
    for (const opt of DASHBOARD_TIMEZONE_OPTIONS) {
      const list = byRegion.get(opt.region) ?? [];
      list.push(opt);
      byRegion.set(opt.region, list);
    }
    return Array.from(byRegion.entries()).map(([region, opts]) => ({
      region,
      label: labels[region] ?? region,
      opts,
    }));
  }, [locale]);

  const timePreview = useMemo(
    () => formatDateTimeForLocale(new Date(), locale as Locale, timezone),
    [locale, timezone]
  );

  useEffect(() => {
    const wp = getTranslation(locale as SupportedLocale).dashboard.workspacePage;
    const loadWorkspaceSettings = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at, subscription_plan')
          .eq('id', user.id)
          .single();

        if (profile) {
          const daysSinceSignup = Math.floor(
            (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          const inTrial = daysSinceSignup <= 7;
          setIsTrial(inTrial);

          const { data: workspace } = await supabase
            .from('user_workspace_settings')
            .select('enabled_modules')
            .eq('user_id', user.id)
            .single();

          const enabledModules = workspace?.enabled_modules || [];

          const moduleList = [
            { id: 'scraper' as const, icon: <Zap className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'ai_voice' as const, icon: <Phone className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: '3d_staging' as const, icon: <Box className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'price_sniper' as const, icon: <Target className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'commercial' as const, icon: <Building2 className="h-5 w-5" />, requiredPlan: 'AGENCY' as const },
            { id: 'territory_map' as const, icon: <MapIcon className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'smart_briefing' as const, icon: <FileText className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'xray_vision' as const, icon: <Sparkles className="h-5 w-5" />, requiredPlan: 'PRO' as const },
            { id: 'competitor_radar' as const, icon: <TrendingDown className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          ];

          const allModules: WorkspaceModule[] = moduleList.map((m) => ({
            id: m.id,
            name: wp.modules[m.id].name,
            description: wp.modules[m.id].desc,
            icon: m.icon,
            requiredPlan: m.requiredPlan,
            enabled: enabledModules.includes(m.id) || (inTrial && !enabledModules.includes(m.id)),
            trialEnabled: inTrial,
          }));

          setModules(allModules);
        }
      } catch (error) {
        console.error('[WORKSPACE] Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadWorkspaceSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount + locale for copy
  }, [locale]);

  const handleToggleModule = async (moduleId: string) => {
    const workspaceModule = modules.find((m) => m.id === moduleId);
    if (!workspaceModule) return;

    // Se è in trial, può disattivare ma non attivare moduli non inclusi nel piano
    if (!isTrial && workspaceModule.requiredPlan !== 'FREE') {
      // Controlla piano utente
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (profile) {
        const planHierarchy = ['FREE', 'STARTER', 'PRO', 'AGENCY'];
        const localDevHost = isFounderSubscriptionPreviewAllowed(
          typeof window !== "undefined" ? window.location.host : ""
        );
        const effective = resolveUiSubscriptionPlan(user.email, profile.subscription_plan, {
          localDevHost,
        });
        const userPlanIndex = planHierarchy.indexOf(effective.toUpperCase());
        const requiredPlanIndex = planHierarchy.indexOf(workspaceModule.requiredPlan);

        if (userPlanIndex < requiredPlanIndex) {
          toast({
            variant: "destructive",
            ...premiumFeatureToast(
              feedbackLocale,
              "workspaceModules",
              t.insufficientPlanDesc.replace("{plan}", workspaceModule.requiredPlan)
            ),
          });
          return;
        }
      }
    }

    // Toggle locale
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, enabled: !m.enabled } : m
      )
    );

    // Salva su Supabase
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const enabledModules = modules
        .map((m) => (m.id === moduleId ? !m.enabled : m.enabled) ? m.id : null)
        .filter(Boolean) as string[];

      const { error } = await supabase
        .from('user_workspace_settings')
        .upsert({
          user_id: user.id,
          enabled_modules: enabledModules,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({ title: t.moduleUpdated, description: `${workspaceModule.name} ${!workspaceModule.enabled ? t.moduleEnabled : t.moduleDisabled}.` });
    } catch (error) {
      console.error('[WORKSPACE] Error saving:', error);
      toast({
        variant: "destructive",
        ...apiFailureToast(feedbackLocale, "workspaceModules", {}, t.saveError),
      });
      // Revert
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId ? { ...m, enabled: !m.enabled } : m
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardPageShell className="flex min-h-[50vh] flex-col items-center justify-center text-white">
        <Settings className="h-8 w-8 animate-spin text-purple-400" aria-hidden />
        <p className="mt-4 text-sm text-white/60">{t.loading}</p>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-500/30 to-cyan-500/30">
              <Settings className="h-6 w-6 text-purple-400" aria-hidden />
            </span>
            <span>{t.heroTitle}</span>
          </span>
        }
        titleDataTestId="heading-workspace-settings"
        subtitle={t.heroSubtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: "secondary" } : undefined
        }
      />

      {isTrial ? (
        <div className="mb-8 rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4">
          <p className="text-sm text-purple-200">
            <strong>{t.trialActive}</strong> —{" "}
            {t.trialDesc.replace("{days}", String(trialDays))}
          </p>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl w-full space-y-4">
        <Card className="border-white/10 bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Clock className="h-5 w-5 text-cyan-400" aria-hidden />
              {t.prefsTitle}
            </CardTitle>
            <CardDescription className="text-white/60">{t.prefsSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <LocaleCurrencySelector
                currentLocale={locale}
                currentCurrency={currency}
                onLocaleChange={setLocale}
                onCurrencyChange={setCurrency}
              />
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-2 max-w-md">
              <Label htmlFor="workspace-timezone" className="text-white/90">
                {t.timezoneLabel}
              </Label>
              <Select value={timezone} onValueChange={(v) => setTimezone(v as DashboardTimezone)}>
                <SelectTrigger
                  id="workspace-timezone"
                  className="h-11 min-h-11 touch-manipulation border-white/20 bg-white/5 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(24rem,70vh)]">
                  {timezoneGroups.map(({ region, label, opts }) => (
                    <SelectGroup key={region}>
                      <SelectLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </SelectLabel>
                      {opts.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="min-h-11 touch-manipulation">
                          {o.value.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/50">{t.timezoneHint}</p>
            </div>
            <p className="text-sm text-white/70">
              <span className="text-white/50">{t.previewLabel}:</span>{" "}
              <span className="font-medium text-cyan-200 tabular-nums">{timePreview}</span>
            </p>
          </CardContent>
        </Card>
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`border ${
                module.enabled
                  ? 'border-purple-500/50 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10'
                  : 'border-gray-800 bg-[#0a0a0a]'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      module.enabled
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                        {module.trialEnabled && (
                          <Badge className="bg-cyan-500 text-white text-xs">{t.trialBadge}</Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            module.requiredPlan === 'AGENCY'
                              ? 'border-purple-500/50 text-purple-400'
                              : module.requiredPlan === 'PRO'
                              ? 'border-cyan-500/50 text-cyan-400'
                              : 'border-gray-500/50 text-gray-400'
                          }`}
                        >
                          {module.requiredPlan}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{module.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={module.enabled}
                    onCheckedChange={() => handleToggleModule(module.id)}
                    disabled={saving}
                    className="ml-4"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Info Box */}
        <Card className="mt-8 border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">{t.howItWorks}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-300">
              {t.howItWorksBullets.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}

