"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Phone, Box, Target, Building2, Map, FileText, Sparkles, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { createClient } from "@/lib/supabase/client";
import { resolveUiSubscriptionPlan } from "@/lib/utils/effective-plan";
import { isLocalDevHostname } from "@/lib/utils/local-dev-host";

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
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();

  const t = {
    loading: isItalian ? "Caricamento impostazioni..." : "Loading settings...",
    heroTitle: "Feature Control Center",
    heroSubtitle: isItalian ? "Personalizza la tua dashboard attivando o disattivando i moduli" : "Customize your dashboard by enabling or disabling modules",
    trialActive: isItalian ? "Trial Attivo" : "Trial Active",
    trialDesc: (days: number) => isItalian
      ? `Hai accesso a tutti i moduli per i prossimi ${days} giorni. Dopo il trial, solo i moduli del tuo piano saranno disponibili.`
      : `You have access to all modules for the next ${days} days. After the trial, only the modules in your plan will be available.`,
    howItWorks: isItalian ? "💡 Come funziona" : "💡 How it works",
    howItWorksList: isItalian
      ? [
          "I moduli disattivati scompariranno dalla barra laterale della dashboard",
          "Durante il trial, tutti i moduli sono disponibili",
          "Dopo il trial, solo i moduli inclusi nel tuo piano possono essere attivati",
          "Le impostazioni vengono salvate automaticamente",
        ]
      : [
          "Disabled modules will disappear from the dashboard sidebar",
          "During the trial, all modules are available",
          "After the trial, only modules included in your plan can be enabled",
          "Settings are saved automatically",
        ],
    insufficientPlan: isItalian ? "Piano insufficiente" : "Insufficient plan",
    insufficientPlanDesc: (plan: string) => isItalian
      ? `Questo modulo richiede il piano ${plan}. Aggiorna il tuo account.`
      : `This module requires the ${plan} plan. Upgrade your account.`,
    moduleUpdated: isItalian ? "Modulo aggiornato" : "Module updated",
    moduleEnabled: isItalian ? "attivato" : "enabled",
    moduleDisabled: isItalian ? "disattivato" : "disabled",
    errorTitle: isItalian ? "Errore" : "Error",
    saveError: isItalian ? "Impossibile salvare le impostazioni." : "Unable to save settings.",
    // module names
    modules: {
      scraper: { name: isItalian ? "Scraper Globale" : "Global Scraper", desc: isItalian ? "Scansione automatica di Idealista, Zillow, Immobiliare.it" : "Automatic scanning of Idealista, Zillow, Immobiliare.it" },
      ai_voice: { name: "AI Voice Calling", desc: isItalian ? "Chiamate automatiche con Bland AI" : "Automatic calls with Bland AI" },
      "3d_staging": { name: "3D Virtual Staging", desc: isItalian ? "Generazione visioni 3D post-ristrutturazione" : "3D visualization generation post-renovation" },
      price_sniper: { name: "Price Drop Sniper", desc: isItalian ? "Rilevamento automatico ribassi di prezzo" : "Automatic price drop detection" },
      commercial: { name: "Commercial Intelligence", desc: isItalian ? "Analisi immobili commerciali e Business Features" : "Commercial property analysis and Business Features" },
      territory_map: { name: "Territory Commander", desc: isItalian ? "Mappa tattica e analisi territorio" : "Tactical map and territory analysis" },
      smart_briefing: { name: "AI Smart Briefing", desc: isItalian ? "Riassunto automatico vantaggi/difetti/target" : "Automatic summary of pros/cons/target" },
      xray_vision: { name: "AI X-Ray Vision", desc: isItalian ? "Analisi tecnica immagini per difetti/pregi" : "Technical image analysis for defects/features" },
      competitor_radar: { name: "Competitor Radar", desc: isItalian ? "Rilevamento mandati in scadenza" : "Expiring mandate detection" },
    } as Record<string, { name: string; desc: string }>,
  };

  const [modules, setModules] = useState<WorkspaceModule[]>([]);
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWorkspaceSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const loadWorkspaceSettings = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Controlla se è in trial (primi 7 giorni)
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at, subscription_plan')
        .eq('id', user.id)
        .single();

      if (profile) {
        const daysSinceSignup = Math.floor(
          (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        setIsTrial(daysSinceSignup <= 7);

        // Carica moduli abilitati dall'utente
        const { data: workspace } = await supabase
          .from('user_workspace_settings')
          .select('enabled_modules')
          .eq('user_id', user.id)
          .single();

        const enabledModules = workspace?.enabled_modules || [];

        // Definisci tutti i moduli
        const moduleList = [
          { id: 'scraper', icon: <Zap className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'ai_voice', icon: <Phone className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: '3d_staging', icon: <Box className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'price_sniper', icon: <Target className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'commercial', icon: <Building2 className="h-5 w-5" />, requiredPlan: 'AGENCY' as const },
          { id: 'territory_map', icon: <Map className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'smart_briefing', icon: <FileText className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'xray_vision', icon: <Sparkles className="h-5 w-5" />, requiredPlan: 'PRO' as const },
          { id: 'competitor_radar', icon: <TrendingDown className="h-5 w-5" />, requiredPlan: 'PRO' as const },
        ];

        const allModules: WorkspaceModule[] = moduleList.map(m => ({
          id: m.id,
          name: t.modules[m.id]?.name || m.id,
          description: t.modules[m.id]?.desc || '',
          icon: m.icon,
          requiredPlan: m.requiredPlan,
          enabled: enabledModules.includes(m.id) || (isTrial && !enabledModules.includes(m.id)),
          trialEnabled: isTrial,
        }));

        setModules(allModules);
      }
    } catch (error) {
      console.error('[WORKSPACE] Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

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
        const localDevHost =
          typeof window !== "undefined" && isLocalDevHostname(window.location.hostname);
        const effective = resolveUiSubscriptionPlan(user.email, profile.subscription_plan, {
          localDevHost,
        });
        const userPlanIndex = planHierarchy.indexOf(effective.toUpperCase());
        const requiredPlanIndex = planHierarchy.indexOf(workspaceModule.requiredPlan);

        if (userPlanIndex < requiredPlanIndex) {
          toast({ title: t.insufficientPlan, description: t.insufficientPlanDesc(workspaceModule.requiredPlan), variant: "destructive" });
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
      toast({ title: t.errorTitle, description: t.saveError, variant: "destructive" });
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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Settings className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{t.heroTitle}</h1>
              <p className="text-muted-foreground mt-1">
                {t.heroSubtitle}
              </p>
            </div>
          </div>

          {isTrial && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300">
                🎉 <strong>{t.trialActive}</strong> - {t.trialDesc(7)}
              </p>
            </div>
          )}
        </div>

        {/* Modules List */}
        <div className="space-y-4">
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
                          <Badge className="bg-cyan-500 text-white text-xs">Trial</Badge>
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
        </div>

        {/* Info Box */}
        <Card className="mt-8 border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">{t.howItWorks}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-300">
              {t.howItWorksList.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

