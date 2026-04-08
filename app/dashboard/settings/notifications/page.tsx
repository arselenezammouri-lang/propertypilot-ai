"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
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
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();

  const t = {
    pageTitle: "AI Morning Intel",
    pageSubtitle: isItalian
      ? "Configura le tue notifiche giornaliere di intelligence"
      : "Configure your daily intelligence notifications",
    cardTitle: isItalian ? "Briefing Mattutino" : "Morning Briefing",
    cardDesc: isItalian
      ? "Ricevi ogni mattina le top 3 opportunità immobiliari della tua zona"
      : "Receive the top 3 real estate opportunities in your area every morning",
    enableLabel: isItalian ? "Attiva AI Morning Intel" : "Enable AI Morning Intel",
    enableDesc: isItalian
      ? "Ricevi un briefing quotidiano con le migliori opportunità"
      : "Receive a daily briefing with the best opportunities",
    emailLabel: isItalian ? "Notifica via Email" : "Email Notification",
    emailDesc: isItalian ? "Ricevi il briefing nella tua casella email" : "Receive the briefing in your inbox",
    whatsappLabel: isItalian ? "Notifica via WhatsApp" : "WhatsApp Notification",
    whatsappDesc: isItalian ? "Ricevi il briefing direttamente su WhatsApp" : "Receive the briefing directly on WhatsApp",
    timeLabel: isItalian ? "Orario del Briefing" : "Briefing Time",
    timeDesc: isItalian
      ? "Scegli l'orario in cui vuoi ricevere il briefing quotidiano"
      : "Choose the time you want to receive the daily briefing",
    sendTestIdle: isItalian ? "Invia Prova sul mio Cellulare" : "Send Test to My Phone",
    sendTestLoading: isItalian ? "Invio in corso..." : "Sending...",
    sendTestDesc: isItalian
      ? "Ricevi subito un esempio di notifica per vedere quanto è professionale"
      : "Receive a notification example right now to see how professional it looks",
    previewTitle: isItalian ? "Anteprima Messaggio" : "Message Preview",
    previewDesc: isItalian
      ? "Ecco come apparirà il tuo briefing mattutino"
      : "This is how your morning briefing will appear",
    previewHeader: isItalian ? "🔥 TOP 3 OPPORTUNITÀ DI OGGI" : "🔥 TOP 3 OPPORTUNITIES TODAY",
    previewFooter: isItalian
      ? "Questi deal sono stati inviati anche a [X] agenzie partner nella tua zona. Affrettati!"
      : "These deals have also been sent to [X] partner agencies in your area. Hurry!",
    cancel: isItalian ? "Annulla" : "Cancel",
    saveIdle: isItalian ? "Salva Impostazioni" : "Save Settings",
    saveLoading: isItalian ? "Salvataggio..." : "Saving...",
    // toasts
    savedTitle: isItalian ? "Impostazioni salvate" : "Settings saved",
    savedDesc: isItalian ? "Le tue preferenze di notifica sono state aggiornate" : "Your notification preferences have been updated",
    errorTitle: isItalian ? "Errore" : "Error",
    saveError: isItalian ? "Impossibile salvare le impostazioni" : "Unable to save settings",
    connectionError: isItalian ? "Errore di connessione" : "Connection error",
    testSentTitle: isItalian ? "Notifica di prova inviata!" : "Test notification sent!",
    testSentDesc: isItalian ? "Controlla la tua email e WhatsApp" : "Check your email and WhatsApp",
    testError: isItalian ? "Impossibile inviare la notifica di prova" : "Unable to send test notification",
  };
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
        toast({ title: t.savedTitle, description: t.savedDesc });
      } else {
        toast({ title: t.errorTitle, description: data.error || t.saveError, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t.errorTitle, description: t.connectionError, variant: "destructive" });
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
        toast({ title: t.testSentTitle, description: t.testSentDesc });
      } else {
        toast({ title: t.errorTitle, description: data.error || t.testError, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t.errorTitle, description: t.connectionError, variant: "destructive" });
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
          <Link href="/dashboard/settings/workspace">
            <Button variant="ghost" size="icon" aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BellRing className="h-8 w-8 text-purple-400" />
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Main Settings Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              {t.cardTitle}
            </CardTitle>
            <CardDescription>
              {t.cardDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="briefing-enabled" className="text-base font-semibold cursor-pointer">
                  {t.enableLabel}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.enableDesc}
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
              <div className="space-y-4 pl-4 border-l-2 border-border">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                      <Label htmlFor="briefing-email" className="text-base font-semibold cursor-pointer">
                        {t.emailLabel}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t.emailDesc}
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
                        {t.whatsappLabel}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t.whatsappDesc}
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
                    {t.timeLabel}
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
                    {t.timeDesc}
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
                      {t.sendTestLoading}
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4 mr-2" />
                      {t.sendTestIdle}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {t.sendTestDesc}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Card */}
        {settings.morning_briefing_enabled && (
          <Card>
            <CardHeader>
              <CardTitle>{t.previewTitle}</CardTitle>
              <CardDescription>
                {t.previewDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 font-mono text-sm">
                <div className="font-bold text-purple-400">{t.previewHeader}</div>
                <div className="space-y-2 text-gray-300">
                  <div>• [Link Report PDF 1] - Prezzo -20%</div>
                  <div>• [Link Report PDF 2] - Urgenza Alta</div>
                  <div>• [Link Report PDF 3] - Target Investitori</div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {t.previewFooter}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => router.back()}>
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.saveLoading}
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {t.saveIdle}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

