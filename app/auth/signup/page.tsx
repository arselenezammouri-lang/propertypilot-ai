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
import { Home, ArrowLeft, User, Mail, Lock, Sparkles, CheckCircle } from "lucide-react";

function SignupClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();
  
  const selectedPlan = searchParams.get('plan');
  const selectedPackage = searchParams.get('package');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedPlan && ['starter', 'pro', 'agency'].includes(selectedPlan)) {
      localStorage.setItem('pendingPlan', selectedPlan);
      localStorage.removeItem('pendingPackage');
    } else if (selectedPackage === 'boost') {
      localStorage.setItem('pendingPackage', 'boost');
      localStorage.removeItem('pendingPlan');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        try {
          await fetch('/api/auth/setup-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName }),
          });
        } catch (setupError) {
          console.error('User setup error:', setupError);
        }
      }

      toast({
        title: "Account creato! 🎉",
        description: selectedPlan || selectedPackage 
          ? "Verrai reindirizzato per completare il pagamento." 
          : "Benvenuto in PropertyPilot AI!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 dark:opacity-20" />
      
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
        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95 dark:bg-card/90">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">
              Create your account ✨
            </CardTitle>
            <CardDescription className="text-center text-base">
              Start generating professional property listings with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Mario Rossi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-10 h-11"
                    data-testid="input-fullname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mario@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 h-11"
                    data-testid="input-password"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
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
