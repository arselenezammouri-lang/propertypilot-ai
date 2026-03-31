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
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { getBaseUrl } from "@/lib/env";

export default function ForgotPasswordPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const t = {
    backToLogin: isItalian ? "Torna al Login" : "Back to Login",
    pageTitle: isItalian ? "Password dimenticata?" : "Forgot password?",
    descSent: isItalian
      ? "Controlla la tua email per il link di reset."
      : "Check your email for the reset link.",
    descDefault: isItalian
      ? "Inserisci la tua email e ti invieremo un link per reimpostare la password."
      : "Enter your email and we'll send you a link to reset your password.",
    emailLabel: "Email",
    emailPlaceholder: isItalian ? "tua@email.com" : "your@email.com",
    sendIdle: isItalian ? "Invia link di reset" : "Send reset link",
    sendLoading: isItalian ? "Invio in corso..." : "Sending...",
    errorTitle: isItalian ? "Errore" : "Error",
    emailRequired: isItalian ? "Inserisci la tua email." : "Please enter your email.",
    sentTitle: isItalian ? "Email inviata" : "Email sent",
    sentDesc: isItalian
      ? "Controlla la tua casella per il link di reset password."
      : "Check your inbox for the password reset link.",
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) {
      toast({ title: t.errorTitle, description: t.emailRequired, variant: "destructive" });
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
      const msg = err instanceof Error ? err.message : (isItalian ? "Si è verificato un errore." : "An error occurred.");
      toast({ title: t.errorTitle, description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link
        href="/auth/login"
        className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.backToLogin}</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {t.pageTitle}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {sent ? t.descSent : t.descDefault}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">{t.backToLogin}</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-foreground">{t.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pl-10 bg-muted/50 border-border text-foreground"
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
