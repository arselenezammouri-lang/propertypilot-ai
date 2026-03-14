"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetPasswordClient() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  const t = {
    backToLogin: isItalian ? "Torna al Login" : "Back to Login",
    pageTitle: isItalian ? "Nuova password" : "New password",
    pageDesc: isItalian
      ? "Inserisci la nuova password per il tuo account."
      : "Enter the new password for your account.",
    passwordLabel: isItalian ? "Nuova password" : "New password",
    passwordPlaceholder: isItalian ? "Minimo 8 caratteri" : "At least 8 characters",
    confirmLabel: isItalian ? "Conferma password" : "Confirm password",
    confirmPlaceholder: isItalian ? "Ripeti la password" : "Repeat the password",
    updateIdle: isItalian ? "Aggiorna password" : "Update password",
    updateLoading: isItalian ? "Aggiornamento..." : "Updating...",
    successTitle: isItalian ? "Password aggiornata!" : "Password updated!",
    redirecting: isItalian ? "Reindirizzamento al login..." : "Redirecting to login...",
    errorTitle: isItalian ? "Errore" : "Error",
    minLength: isItalian ? "La password deve avere almeno 8 caratteri." : "Password must be at least 8 characters.",
    passwordMismatch: isItalian ? "Le password non coincidono." : "Passwords do not match.",
    updatedTitle: isItalian ? "Password aggiornata" : "Password updated",
    updatedDesc: isItalian
      ? "Ora puoi accedere con la nuova password."
      : "You can now sign in with your new password.",
  };

  const hash = typeof window !== "undefined" ? window.location.hash : "";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = password?.trim();
    const confirm = confirmPassword?.trim();

    if (!pwd || pwd.length < 8) {
      toast({ title: t.errorTitle, description: t.minLength, variant: "destructive" });
      return;
    }
    if (pwd !== confirm) {
      toast({ title: t.errorTitle, description: t.passwordMismatch, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      setSuccess(true);
      toast({ title: t.updatedTitle, description: t.updatedDesc });
      setTimeout(() => router.replace("/auth/login"), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (isItalian ? "Si è verificato un errore." : "An error occurred.");
      toast({ title: t.errorTitle, description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl" />
        </div>
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <Link href="/auth/login" className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /><span>{t.backToLogin}</span>
        </Link>
        <div className="w-full max-w-md relative z-10">
          <Card className="border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{t.successTitle}</h2>
                <p className="text-gray-400">{t.redirecting}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-[#000000] p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Link href="/auth/login" className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /><span>{t.backToLogin}</span>
      </Link>
      <div className="w-full max-w-md relative z-10">
        <Card className="border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.pageTitle}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {t.pageDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-password" className="text-white">{t.passwordLabel}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-confirm" className="text-white">{t.confirmLabel}</Label>
                <Input
                  id="reset-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.updateLoading : t.updateIdle}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  );
}
