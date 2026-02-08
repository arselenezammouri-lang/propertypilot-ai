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
import { Home, ArrowLeft, User, Mail, Lock, Sparkles, CheckCircle, Eye, EyeOff } from "lucide-react";

function SignupClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();
  
  const selectedPlan = searchParams.get('plan');
  const selectedPackage = searchParams.get('package');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validazione esplicita dei campi
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedFullName = fullName?.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedFullName) {
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
      console.log('[SIGNUP] Attempting signup with email:', trimmedEmail);
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
            body: JSON.stringify({ fullName: trimmedFullName }),
          });

          if (setupResponse.ok) {
            const setupData = await setupResponse.json();
            console.log('User setup completed:', setupData);
            setupSuccess = true;
          } else {
            const errorData = await setupResponse.json().catch(() => ({}));
            console.error('User setup API error:', errorData);
            
            // If 401, try creating profile directly via client (fallback)
            if (setupResponse.status === 401) {
              console.log('[SIGNUP] Attempting client-side profile creation as fallback...');
              
              // Try to create profile directly using client Supabase (if RLS allows)
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  full_name: trimmedFullName || data.user.user_metadata?.full_name || null,
                })
                .select()
                .single();
              
              if (!profileError) {
                console.log('[SIGNUP] Profile created via client fallback');
                setupSuccess = true;
              } else {
                console.error('[SIGNUP] Client-side profile creation also failed:', profileError);
                // Profile might be created via database trigger, so we continue anyway
              }
            }
          }
        } catch (setupError: any) {
          console.error('User setup error:', setupError);
          // Don't block signup - profile might be created via database trigger or retry later
        }
        
        // If setup didn't succeed, show warning but don't block
        if (!setupSuccess) {
          console.warn('[SIGNUP] Profile setup may not have completed. User can retry from dashboard.');
        }
      }

      toast({
        title: "Account creato! 🎉",
        description: selectedPlan || selectedPackage 
          ? "Verrai reindirizzato per completare il pagamento." 
          : "Benvenuto in PropertyPilot AI!",
      });

      // Small delay before redirect to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 200));
      
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle rate limit error with user-friendly message
      const errorMessage = error.message || '';
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                         errorMessage.toLowerCase().includes('too many') ||
                         errorMessage.toLowerCase().includes('email rate limit');
      
      toast({
        title: isRateLimit ? "Troppi tentativi" : "Errore",
        description: isRateLimit 
          ? "Abbiamo rilevato troppi tentativi. Per la tua sicurezza, riprova tra qualche minuto o usa un altro metodo."
          : errorMessage || "Failed to create account",
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

        {/* Signup Card */}
        <Card className="border border-white/10 shadow-2xl backdrop-blur-md bg-[#0a0a0a]/95 dark:bg-[#0a0a0a]/95">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
              Create your account ✨
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-300">
              Start generating professional property listings with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} method="post" action="#" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-white">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Mario Rossi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#9333ea] focus:ring-[#9333ea]"
                    data-testid="input-fullname"
                  />
                </div>
              </div>

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
                    minLength={6}
                    autoComplete="new-password"
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
                <p className="text-xs text-gray-400 flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Must be at least 6 characters</span>
                </p>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Free plan includes:</span>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>5 listings per month</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>All AI features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>No credit card required</span>
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Free Account
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link href={`/auth/login${selectedPlan ? `?plan=${selectedPlan}` : selectedPackage ? `?package=${selectedPackage}` : ''}`}>
                  <Button 
                    variant="outline" 
                    className="w-full h-11" 
                    type="button"
                    data-testid="button-login-redirect"
                  >
                    Accedi invece
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupClient />
    </Suspense>
  );
}
