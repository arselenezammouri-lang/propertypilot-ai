"use client";

import { useState, useCallback, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { Home, ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { TurnstileWidget, getTurnstileSiteKey } from "@/components/turnstile-widget";

function LoginClient() {
  const turnstileSiteKey = useMemo(() => getTurnstileSiteKey(), []);
  const turnstileRequired = turnstileSiteKey.length > 0;
  const [turnstileToken, setTurnstileToken] = useState<string | null>(() =>
    turnstileRequired ? null : "dev-skip"
  );
  const [turnstileLoadFailed, setTurnstileLoadFailed] = useState(false);
  const onTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { locale, currency, setLocale, setCurrency } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
  const supabase = createClient();
  
  const selectedPlan = searchParams.get('plan');
  const selectedPackage = searchParams.get('package');
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);

    // Validazione esplicita dei campi
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        title: t.auth.toast.error,
        description: t.auth.toast.fillAllFields,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (turnstileLoadFailed) {
      toast({
        title: t.auth.toast.error,
        description: t.auth.toast.turnstileLoadFailed,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (turnstileRequired && !turnstileToken) {
      toast({
        title: t.auth.toast.error,
        description: t.auth.toast.turnstileRequired,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (turnstileRequired && turnstileToken) {
      try {
        const vr = await fetch("/api/auth/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const body = await vr.json().catch(() => ({}));
        if (!vr.ok || !body.ok) {
          const desc =
            vr.status === 503 && body.error === "turnstile_misconfigured"
              ? t.auth.toast.turnstileMisconfigured
              : t.auth.toast.turnstileFailed;
          toast({
            title: t.auth.toast.error,
            description: desc,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } catch {
        toast({
          title: t.auth.toast.error,
          description: t.auth.toast.turnstileFailed,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    if (selectedPlan && ['starter', 'pro', 'agency'].includes(selectedPlan)) {
      localStorage.setItem('pendingPlan', selectedPlan);
      localStorage.removeItem('pendingPackage');
    } else if (selectedPackage === 'boost') {
      localStorage.setItem('pendingPackage', 'boost');
      localStorage.removeItem('pendingPlan');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) throw error;

      if (data.user) {
        try {
          await fetch('/api/auth/setup-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
        } catch {
          // Non-critical: setup-user error doesn't block login
        }
      }
      toast({
        title: t.auth.toast.welcomeBack,
        description: selectedPlan || selectedPackage 
          ? t.auth.toast.completePayment 
          : t.auth.toast.loginSuccess,
      });

      // Respect redirect from middleware (e.g. after protected route access)
      const target = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
        ? redirectTo
        : "/dashboard";
      window.location.href = target;
    } catch (error: any) {
      // Handle rate limit error with user-friendly message
      const errorMessage = error.message || '';
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                         errorMessage.toLowerCase().includes('too many') ||
                         errorMessage.toLowerCase().includes('email rate limit');
      
      toast({
        title: isRateLimit ? t.auth.toast.tooManyAttempts : t.auth.toast.error,
        description: isRateLimit ? t.auth.toast.rateLimitMsg : (errorMessage || "Invalid email or password"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden font-['Inter_Tight',sans-serif]">
      {/* Mesh Gradient Background - Same as Landing Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9333ea]/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Language + Theme - top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LocaleCurrencySelector currentLocale={locale} currentCurrency={currency} onLocaleChange={setLocale} onCurrencyChange={setCurrency} />
        <ThemeToggle />
      </div>

      {/* Back to home - top left */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        data-testid="link-back-home"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t.auth.backToHome}</span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Home className="text-white" size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold gradient-text">PropertyPilot AI</h1>
              <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border border-white/10 shadow-2xl backdrop-blur-md bg-[#0a0a0a]/95 dark:bg-[#0a0a0a]/95">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              {t.auth.login.title}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-300">
              {t.auth.login.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} method="post" action="#" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  {t.auth.login.email}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mario@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#9333ea] focus:ring-[#9333ea]"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white">
                  {t.auth.login.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#9333ea] focus:ring-[#9333ea]"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#9333ea] hover:text-[#a855f7] transition-colors"
                  >
                    {t.auth.login.forgotPassword}
                  </Link>
                </div>
              </div>

              {turnstileRequired ? (
                <TurnstileWidget
                  siteKey={turnstileSiteKey}
                  onToken={onTurnstileToken}
                  theme="dark"
                  className="flex justify-center min-h-[65px]"
                  onLoadError={() => setTurnstileLoadFailed(true)}
                />
              ) : null}

              <Button 
                type="submit" 
                className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" 
                disabled={
                  loading ||
                  turnstileLoadFailed ||
                  (turnstileRequired && !turnstileToken)
                }
                data-testid="button-login"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.auth.login.signingIn}</span>
                  </div>
                ) : (
                  <span>{t.auth.login.signIn}</span>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t.auth.login.newTo}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link href={`/auth/signup${selectedPlan ? `?plan=${selectedPlan}` : selectedPackage ? `?package=${selectedPackage}` : ''}`}>
                  <Button 
                    variant="outline" 
                    className="w-full h-11" 
                    type="button"
                    data-testid="button-signup-redirect"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.auth.login.createFreeAccount}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust indicator */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {t.auth.login.secureNote}
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
