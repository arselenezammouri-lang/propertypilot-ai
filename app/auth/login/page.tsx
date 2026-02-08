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
import { Home, ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();
  
  const selectedPlan = searchParams.get('plan');
  const selectedPackage = searchParams.get('package');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[LOGIN] Form submitted');
    console.log('[LOGIN] Email:', email);
    console.log('[LOGIN] Password length:', password?.length);
    
    setLoading(true);

    // Validazione esplicita dei campi
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      console.log('[LOGIN] Validation failed - missing fields');
      toast({
        title: "Errore",
        description: "Per favore compila tutti i campi richiesti.",
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
      console.log('[LOGIN] Attempting login with email:', trimmedEmail);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) throw error;

      console.log('[LOGIN] Login successful, user:', data.user?.id);
      
      if (data.user) {
        try {
          console.log('[LOGIN] Calling setup-user API...');
          const setupResponse = await fetch('/api/auth/setup-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
          console.log('[LOGIN] Setup-user response:', setupResponse.status);
        } catch (setupError) {
          console.error('[LOGIN] User setup error:', setupError);
        }
      }

      console.log('[LOGIN] Showing success toast and redirecting...');
      toast({
        title: "Bentornato! 🎉",
        description: selectedPlan || selectedPackage 
          ? "Completa il pagamento nella dashboard." 
          : "Accesso effettuato con successo.",
      });

      // Use window.location for more reliable redirect
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle rate limit error with user-friendly message
      const errorMessage = error.message || '';
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                         errorMessage.toLowerCase().includes('too many') ||
                         errorMessage.toLowerCase().includes('email rate limit');
      
      toast({
        title: isRateLimit ? "Troppi tentativi" : "Errore",
        description: isRateLimit 
          ? "Abbiamo rilevato troppi tentativi. Per la tua sicurezza, riprova tra qualche minuto o usa un altro metodo."
          : errorMessage || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden font-['Inter_Tight',sans-serif]">
      {/* Mesh Gradient Background - Same as Landing Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333ea]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#06b6d4]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9333ea]/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Theme toggle - top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back to home - top left */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        data-testid="link-back-home"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to home</span>
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
              Welcome back 👋
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-300">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} method="post" action="#" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  Email address
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
                  Password
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
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" 
                disabled={loading}
                data-testid="button-login"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    New to PropertyPilot AI?
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
                    Crea un account gratuito
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust indicator */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure login • Your data is protected with industry-standard encryption
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
