"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { Building2, ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff, Star } from "lucide-react";

function LoginClient() {
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

  const selectedPlan = searchParams.get("plan");
  const selectedPackage = searchParams.get("package");
  const redirectTo = searchParams.get("redirectTo") || searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({ title: t.auth.toast.error, description: t.auth.toast.fillAllFields, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (selectedPlan && ["starter", "pro", "agency"].includes(selectedPlan)) {
      localStorage.setItem("pendingPlan", selectedPlan);
      localStorage.removeItem("pendingPackage");
    } else if (selectedPackage === "boost") {
      localStorage.setItem("pendingPackage", "boost");
      localStorage.removeItem("pendingPlan");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password: trimmedPassword });
      if (error) throw error;

      if (data.user) {
        try { await fetch("/api/auth/setup-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }); } catch {}
      }

      toast({ title: t.auth.toast.welcomeBack, description: selectedPlan || selectedPackage ? t.auth.toast.completePayment : t.auth.toast.loginSuccess });
      const target = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
      window.location.href = target;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "";
      const isRateLimit = errorMessage.toLowerCase().includes("rate limit") || errorMessage.toLowerCase().includes("too many");
      toast({ title: isRateLimit ? t.auth.toast.tooManyAttempts : t.auth.toast.error, description: isRateLimit ? t.auth.toast.rateLimitMsg : (errorMessage || "Invalid email or password"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-[100px]" />

      {/* Top controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <LocaleCurrencySelector currentLocale={locale} currentCurrency={currency} onLocaleChange={setLocale} onCurrencyChange={setCurrency} />
        <ThemeToggle />
      </div>
      <Link href="/" className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-20">
        <ArrowLeft className="h-4 w-4" /><span>{t.auth.backToHome}</span>
      </Link>

      {/* Left side — social proof (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 relative">
        <div className="max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">PropertyPilot AI</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
            The AI operating system<br />for <span className="text-gradient">real estate</span>
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Join 500+ agencies across Europe using AI to generate listings, score leads, and close more deals.
          </p>
          {/* Testimonial */}
          <div className="pp-glass-card p-6">
            <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;PropertyPilot cut my listing time from 2 hours to 5 minutes. The AI Voice Agent books viewings while I sleep.&rdquo;</p>
            <div className="text-sm font-semibold">Marco R.</div>
            <div className="text-xs text-muted-foreground">Agent, Milano</div>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">PropertyPilot AI</span>
          </div>

          <div className="pp-glass-card p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">{t.auth.login.title}</h1>
              <p className="text-sm text-muted-foreground">{t.auth.login.subtitle}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t.auth.login.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="mario@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20" data-testid="input-email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t.auth.login.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="pl-10 pr-10 h-11 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20" data-testid="input-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide" : "Show"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary/80">{t.auth.login.forgotPassword}</Link>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary-gradient w-full h-11 text-sm" data-testid="button-login">
                {loading ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>{t.auth.login.signingIn}</span></div>) : (<span>{t.auth.login.signIn}</span>)}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card/50 backdrop-blur px-3 text-muted-foreground">{t.auth.login.newTo}</span></div>
              </div>

              <Link href={`/auth/signup${selectedPlan ? `?plan=${selectedPlan}` : selectedPackage ? `?package=${selectedPackage}` : ""}`}>
                <button type="button" className="btn-glass w-full h-11 text-sm text-muted-foreground hover:text-foreground gap-2" data-testid="button-signup-redirect">
                  <Sparkles className="w-4 h-4" />{t.auth.login.createFreeAccount}
                </button>
              </Link>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">{t.auth.login.secureNote}</p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (<Suspense fallback={null}><LoginClient /></Suspense>);
}
