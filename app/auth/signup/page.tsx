"use client";

import { useState, Suspense } from "react";
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
import { Home, ArrowLeft, User, Mail, Lock, Sparkles, CheckCircle, Eye, EyeOff, Shield, Check } from "lucide-react";

function SignupClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
  const selectedReferralCode = searchParams.get('ref');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validazione esplicita dei campi
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedFullName = fullName?.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedFullName) {
      toast({
        title: t.auth.toast.error,
        description: t.auth.toast.fillAllFields,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (selectedPlan && ['starter', 'pro', 'agency'].includes(selectedPlan)) {
      localStorage.setItem('pendingPlan', selectedPlan);
      localStorage.removeItem('pendingPackage');
    } else if (selectedPackage === 'boost') {
      localStorage.setItem('pendingPackage', 'boost');
      localStorage.removeItem('pendingPlan');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            full_name: trimmedFullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Wait a moment for cookies to sync, then setup user profile
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let setupSuccess = false;
        
        try {
          const setupResponse = await fetch('/api/auth/setup-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // CRITICAL: Include cookies in request
            body: JSON.stringify({
              fullName: trimmedFullName,
              referralCode: selectedReferralCode?.trim() || null,
            }),
          });

          if (setupResponse.ok) {
            setupSuccess = true;
          } else {
            // If 401, try creating profile directly via client (fallback)
            if (setupResponse.status === 401) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  full_name: trimmedFullName || data.user.user_metadata?.full_name || null,
                })
                .select()
                .single();
              
              if (!profileError) {
                setupSuccess = true;
              }
            }
          }
        } catch {
          // Don't block signup - profile might be created via database trigger or retry later
        }
      }

      toast({
        title: t.auth.toast.accountCreated,
        description: selectedPlan || selectedPackage 
          ? t.auth.toast.redirectPayment 
          : t.auth.toast.welcomePropertyPilot,
      });

      // Small delay before redirect to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Full page navigation to ensure cookies are sent
      window.location.href = "/dashboard";
    } catch (error: any) {
      // Handle rate limit error with user-friendly message
      const errorMessage = error.message || '';
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                         errorMessage.toLowerCase().includes('too many') ||
                         errorMessage.toLowerCase().includes('email rate limit');
      
      toast({
        title: isRateLimit ? t.auth.toast.tooManyAttempts : t.auth.toast.error,
        description: isRateLimit ? t.auth.toast.rateLimitMsg : (errorMessage || "Failed to create account"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden font-['Inter_Tight',sans-serif]">
      {/* Mesh Gradient Background - Same as Landing Page */}
      
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
              <Home className="text-foreground" size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold gradient-text">PropertyPilot AI</h1>
              <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
            </div>
          </Link>
        </div>

        {/* Signup Card */}
        <Card className="border border-border shadow-2xl backdrop-blur-md bg-card">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-foreground">
              {t.auth.signup.title}
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              {t.auth.signup.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} method="post" action="#" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  {t.auth.signup.fullName}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Mario Rossi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="pl-10 h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:ring-ring/20"
                    data-testid="input-fullname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t.auth.signup.email}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mario@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="pl-10 h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:ring-ring/20"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t.auth.signup.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="pl-10 pr-10 h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:ring-ring/20"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>{t.auth.signup.minChars}</span>
                </p>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>{t.auth.signup.freePlanIncludes}</span>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{t.auth.signup.listingsPerMonth}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{t.auth.signup.allAIFeatures}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{t.auth.signup.noCreditCard}</span>
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" 
                disabled={loading}
                data-testid="button-signup"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.auth.signup.creatingAccount}</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.auth.signup.createFreeAccount}
                  </>
                )}
              </Button>


              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  256-bit encryption
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  GDPR
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Cancel anytime
                </span>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t.auth.signup.alreadyHaveAccount}
                    </span>
                </div>
              </div>

              <div className="text-center">
                <Link href={`/auth/login${(() => {
                  const params = new URLSearchParams();
                  if (selectedPlan) params.set('plan', selectedPlan);
                  if (selectedPackage) params.set('package', selectedPackage);
                  if (selectedReferralCode) params.set('ref', selectedReferralCode);
                  const query = params.toString();
                  return query ? `?${query}` : '';
                })()}`}>
                  <Button 
                    variant="outline" 
                    className="w-full h-11" 
                    type="button"
                    data-testid="button-login-redirect"
                  >
                    {t.auth.signup.signInInstead}
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                {t.auth.signup.termsAgreeBefore}
                <Link href="/terms" className="text-primary hover:underline">{t.landing?.footer?.terms ?? 'Terms of Service'}</Link>
                {t.auth.signup.termsAgreeAnd}
                <Link href="/privacy" className="text-primary hover:underline">{t.landing?.footer?.privacy ?? 'Privacy Policy'}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupClient />
    </Suspense>
  );
}
