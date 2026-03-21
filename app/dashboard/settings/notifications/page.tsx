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
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  networkFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
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
  const feedbackLocale = (isItalian ? "it" : "en") as "it" | "en";
  const { toast } = useToast();
  const { plan, isLoading: planLoading } = useUsageLimits();

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
    testChannelsRequired: isItalian
      ? "Attiva almeno Email o WhatsApp per inviare una prova."
      : "Enable at least Email or WhatsApp to send a test.",
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
    void fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetchApi<NotificationSettings>("/api/settings/notifications");
      if (res.success && res.data) {
        setSettings(res.data);
      } else if (!res.success) {
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "morningIntelNotifications",
            { status: res.status, message: res.message, error: res.error },
            isItalian ? "Impossibile caricare le notifiche." : "Could not load notification settings."
          ),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "morningIntelNotifications"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchApi<unknown>("/api/settings/notifications", {
        method: "POST",
        body: JSON.stringify(settings),
      });
      if (res.success) {
        toast({ title: t.savedTitle, description: t.savedDesc });
      } else {
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "morningIntelNotifications",
            { status: res.status, message: res.message, error: res.error },
            t.saveError
          ),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "morningIntelNotifications"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!settings.morning_briefing_email && !settings.morning_briefing_whatsapp) {
      toast({
        variant: "destructive",
        ...validationToast(feedbackLocale, "morningIntelNotifications", t.testChannelsRequired),
      });
      return;
    }
    setSendingTest(true);
    try {
      const res = await fetchApi<unknown>("/api/notifications/test", {
        method: "POST",
        body: JSON.stringify({
          email: settings.morning_briefing_email,
          whatsapp: settings.morning_briefing_whatsapp,
        }),
      });
      if (res.success) {
        toast({ title: t.testSentTitle, description: t.testSentDesc });
      } else {
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "morningIntelNotifications",
            { status: res.status, message: res.message, error: res.error },
            t.testError
          ),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "morningIntelNotifications"),
      });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <DashboardPageShell className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" aria-hidden />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex items-center gap-3">
            <BellRing className="h-8 w-8 shrink-0 text-purple-400" aria-hidden />
            <span>{t.pageTitle}</span>
          </span>
        }
        titleDataTestId="heading-notifications-settings"
        subtitle={t.pageSubtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: "secondary" } : undefined
        }
        actions={
          <Link href="/dashboard/settings/workspace" aria-label={isItalian ? "Indietro" : "Back"}>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 min-h-11 w-11 touch-manipulation text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-4xl w-full">
        <Card className="mb-6 border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-cyan-400" />
              {t.cardTitle}
            </CardTitle>
            <CardDescription className="text-white/60">
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
              <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
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
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-white">{t.previewTitle}</CardTitle>
              <CardDescription className="text-white/60">
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
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            className="min-h-11 touch-manipulation border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-h-11 touch-manipulation bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
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
    </DashboardPageShell>
  );
}

