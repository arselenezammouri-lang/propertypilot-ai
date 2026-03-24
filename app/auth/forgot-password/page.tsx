"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { getBaseUrl } from "@/lib/env";

export default function ForgotPasswordPage() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const tr = getTranslation(locale as SupportedLocale);
  const t = tr.authPasswordRecovery.forgot;
  const errorTitle = tr.auth.toast.error;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) {
      toast({ title: errorTitle, description: t.emailRequired, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${getBaseUrl().replace(/\/$/, "")}/auth/reset-password`,
      });

      if (error) throw error;
      setSent(true);
      toast({ title: t.sentTitle, description: t.sentDesc });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : tr.authPasswordRecovery.genericError;
      toast({ title: errorTitle, description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-[#000000] p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link
        href="/auth/login"
        className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{tr.authPasswordRecovery.backToLogin}</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.pageTitle}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {sent ? t.descSent : t.descDefault}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">{tr.authPasswordRecovery.backToLogin}</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-white">{t.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.sendLoading : t.sendIdle}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
