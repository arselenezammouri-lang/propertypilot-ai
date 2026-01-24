"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Phone, Box, Target, Building2, Map, FileText, Sparkles, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

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
  const { toast } = useToast();
  const [modules, setModules] = useState<WorkspaceModule[]>([]);
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWorkspaceSettings();
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
        const allModules: WorkspaceModule[] = [
          {
            id: 'scraper',
            name: 'Scraper Globale',
            description: 'Scansione automatica di Idealista, Zillow, Immobiliare.it',
            icon: <Zap className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('scraper') || (isTrial && !enabledModules.includes('scraper')),
            trialEnabled: isTrial,
          },
          {
            id: 'ai_voice',
            name: 'AI Voice Calling',
            description: 'Chiamate automatiche con Bland AI',
            icon: <Phone className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('ai_voice') || (isTrial && !enabledModules.includes('ai_voice')),
            trialEnabled: isTrial,
          },
          {
            id: '3d_staging',
            name: '3D Virtual Staging',
            description: 'Generazione visioni 3D post-ristrutturazione',
            icon: <Box className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('3d_staging') || (isTrial && !enabledModules.includes('3d_staging')),
            trialEnabled: isTrial,
          },
          {
            id: 'price_sniper',
            name: 'Price Drop Sniper',
            description: 'Rilevamento automatico ribassi di prezzo',
            icon: <Target className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('price_sniper') || (isTrial && !enabledModules.includes('price_sniper')),
            trialEnabled: isTrial,
          },
          {
            id: 'commercial',
            name: 'Commercial Intelligence',
            description: 'Analisi immobili commerciali e Business Features',
            icon: <Building2 className="h-5 w-5" />,
            requiredPlan: 'AGENCY',
            enabled: enabledModules.includes('commercial') || (isTrial && !enabledModules.includes('commercial')),
            trialEnabled: isTrial,
          },
          {
            id: 'territory_map',
            name: 'Territory Commander',
            description: 'Mappa tattica e analisi territorio',
            icon: <Map className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('territory_map') || (isTrial && !enabledModules.includes('territory_map')),
            trialEnabled: isTrial,
          },
          {
            id: 'smart_briefing',
            name: 'AI Smart Briefing',
            description: 'Riassunto automatico vantaggi/difetti/target',
            icon: <FileText className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('smart_briefing') || (isTrial && !enabledModules.includes('smart_briefing')),
            trialEnabled: isTrial,
          },
          {
            id: 'xray_vision',
            name: 'AI X-Ray Vision',
            description: 'Analisi tecnica immagini per difetti/pregi',
            icon: <Sparkles className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('xray_vision') || (isTrial && !enabledModules.includes('xray_vision')),
            trialEnabled: isTrial,
          },
          {
            id: 'competitor_radar',
            name: 'Competitor Radar',
            description: 'Rilevamento mandati in scadenza',
            icon: <TrendingDown className="h-5 w-5" />,
            requiredPlan: 'PRO',
            enabled: enabledModules.includes('competitor_radar') || (isTrial && !enabledModules.includes('competitor_radar')),
            trialEnabled: isTrial,
          },
        ];

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
        const userPlanIndex = planHierarchy.indexOf(profile.subscription_plan || 'FREE');
        const requiredPlanIndex = planHierarchy.indexOf(workspaceModule.requiredPlan);

        if (userPlanIndex < requiredPlanIndex) {
          toast({
            title: "Piano insufficiente",
            description: `Questo modulo richiede il piano ${workspaceModule.requiredPlan}. Aggiorna il tuo account.`,
            variant: "destructive",
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

      toast({
        title: "Modulo aggiornato",
        description: `${workspaceModule.name} ${!workspaceModule.enabled ? 'attivato' : 'disattivato'}.`,
      });
    } catch (error) {
      console.error('[WORKSPACE] Error saving:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le impostazioni.",
        variant: "destructive",
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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Caricamento impostazioni...</p>
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
              <h1 className="text-4xl font-bold text-white">Feature Control Center</h1>
              <p className="text-muted-foreground mt-1">
                Personalizza la tua dashboard attivando o disattivando i moduli
              </p>
            </div>
          </div>

          {isTrial && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300">
                🎉 <strong>Trial Attivo</strong> - Hai accesso a tutti i moduli per i prossimi {7 - Math.floor((Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24))} giorni. Dopo il trial, solo i moduli del tuo piano saranno disponibili.
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
            <CardTitle className="text-lg text-white">💡 Come funziona</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• I moduli disattivati scompariranno dalla barra laterale della dashboard</li>
              <li>• Durante il trial, tutti i moduli sono disponibili</li>
              <li>• Dopo il trial, solo i moduli inclusi nel tuo piano possono essere attivati</li>
              <li>• Le impostazioni vengono salvate automaticamente</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

