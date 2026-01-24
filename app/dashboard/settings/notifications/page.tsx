"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BellRing,
  Smartphone,
  Mail,
  Zap,
  Check,
  Loader2,
} from "lucide-react";

interface NotificationSettings {
  morning_briefing_enabled: boolean;
  morning_briefing_email: boolean;
  morning_briefing_whatsapp: boolean;
  briefing_time: string; // HH:MM format
}

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    morning_briefing_enabled: false,
    morning_briefing_email: false,
    morning_briefing_whatsapp: false,
    briefing_time: "08:00",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/notifications");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Impostazioni salvate",
          description: "Le tue preferenze di notifica sono state aggiornate",
        });
      } else {
        toast({
          title: "Errore",
          description: data.error || "Impossibile salvare le impostazioni",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: settings.morning_briefing_email,
          whatsapp: settings.morning_briefing_whatsapp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Notifica di prova inviata!",
          description: "Controlla la tua email e WhatsApp",
        });
      } else {
        toast({
          title: "Errore",
          description: data.error || "Impossibile inviare la notifica di prova",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive",
      });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BellRing className="h-8 w-8 text-purple-400" />
              AI Morning Intel
            </h1>
            <p className="text-muted-foreground mt-1">
              Configura le tue notifiche giornaliere di intelligence
            </p>
          </div>
        </div>

        {/* Main Settings Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Briefing Mattutino
            </CardTitle>
            <CardDescription>
              Ricevi ogni mattina le top 3 opportunità immobiliari della tua zona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="briefing-enabled" className="text-base font-semibold cursor-pointer">
                  Attiva AI Morning Intel
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Ricevi un briefing quotidiano con le migliori opportunità
                </p>
              </div>
              <Switch
                id="briefing-enabled"
                checked={settings.morning_briefing_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, morning_briefing_enabled: checked })
                }
              />
            </div>

            {/* Email Notification */}
            {settings.morning_briefing_enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                      <Label htmlFor="briefing-email" className="text-base font-semibold cursor-pointer">
                        Notifica via Email
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ricevi il briefing nella tua casella email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="briefing-email"
                    checked={settings.morning_briefing_email}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, morning_briefing_email: checked })
                    }
                  />
                </div>

                {/* WhatsApp Notification */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Smartphone className="h-5 w-5 text-green-400" />
                    <div>
                      <Label htmlFor="briefing-whatsapp" className="text-base font-semibold cursor-pointer">
                        Notifica via WhatsApp
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ricevi il briefing direttamente su WhatsApp
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="briefing-whatsapp"
                    checked={settings.morning_briefing_whatsapp}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, morning_briefing_whatsapp: checked })
                    }
                  />
                </div>

                {/* Time Selection */}
                <div className="p-4 border rounded-lg">
                  <Label htmlFor="briefing-time" className="text-base font-semibold mb-2 block">
                    Orario del Briefing
                  </Label>
                  <input
                    id="briefing-time"
                    type="time"
                    value={settings.briefing_time}
                    onChange={(e) =>
                      setSettings({ ...settings, briefing_time: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md bg-background"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Scegli l'orario in cui vuoi ricevere il briefing quotidiano
                  </p>
                </div>
              </div>
            )}

            {/* Test Notification Button */}
            {settings.morning_briefing_enabled && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleSendTest}
                  disabled={sendingTest || (!settings.morning_briefing_email && !settings.morning_briefing_whatsapp)}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  {sendingTest ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Invia Prova sul mio Cellulare
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ricevi subito un esempio di notifica per vedere quanto è professionale
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Card */}
        {settings.morning_briefing_enabled && (
          <Card>
            <CardHeader>
              <CardTitle>Anteprima Messaggio</CardTitle>
              <CardDescription>
                Ecco come apparirà il tuo briefing mattutino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 font-mono text-sm">
                <div className="font-bold text-purple-400">🔥 TOP 3 OPPORTUNITÀ DI OGGI</div>
                <div className="space-y-2 text-gray-300">
                  <div>• [Link Report PDF 1] - Prezzo -20%</div>
                  <div>• [Link Report PDF 2] - Urgenza Alta</div>
                  <div>• [Link Report PDF 3] - Target Investitori</div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Questi deal sono stati inviati anche a [X] agenzie partner nella tua zona. Affrettati!
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => router.back()}>
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Salva Impostazioni
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

