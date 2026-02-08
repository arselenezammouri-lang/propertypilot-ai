'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Sparkles, Loader2, ShoppingBag, ArrowRight, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { STRIPE_ONE_TIME_PACKAGES } from '@/lib/stripe/config';

export const dynamic = 'force-dynamic';

interface Purchase {
  id: string;
  package_id: string;
  package_name: string;
  amount: number;
  status: string;
  deliverables: Record<string, number | boolean>;
  deliverables_used: Record<string, number>;
  created_at: string;
}

function PackagesPageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('packages');

  const { data: purchasesData, isLoading: loadingPurchases } = useQuery<{ purchases: Purchase[] }>({
    queryKey: ['/api/purchases'],
  });

  const boostPackage = STRIPE_ONE_TIME_PACKAGES.boost;

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: 'Acquisto completato!',
        description: `Grazie per aver acquistato Agency Boost. Trovi i dettagli nei tuoi acquisti.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/purchases'] });
      setActiveTab('purchases');
      window.history.replaceState({}, '', '/dashboard/packages');
    } else if (canceled === 'true') {
      toast({
        title: 'Acquisto annullato',
        description: 'Il pagamento è stato annullato. Puoi riprovare quando vuoi.',
        variant: 'destructive',
      });
      window.history.replaceState({}, '', '/dashboard/packages');
    }
  }, [searchParams, toast, queryClient]);

  const handlePurchase = async () => {
    setLoadingPackage('boost');
    
    try {
      const response = await fetch('/api/stripe/checkout-oneshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: 'boost' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Impossibile avviare il checkout',
        variant: 'destructive',
      });
    } finally {
      setLoadingPackage(null);
    }
  };

  const renderPurchaseCard = (purchase: Purchase) => {
    const deliverables = purchase.deliverables || {};
    const used = purchase.deliverables_used || {};
    
    return (
      <Card key={purchase.id} className="border" data-testid={`purchase-${purchase.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{purchase.package_name}</CardTitle>
            <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
              {purchase.status === 'completed' ? 'Attivo' : purchase.status}
            </Badge>
          </div>
          <CardDescription>
            Acquistato il {new Date(purchase.created_at).toLocaleDateString('it-IT')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {deliverables.setupComplete && (
              <div>
                <p className="text-muted-foreground">Setup Completo</p>
                <p className="font-medium text-green-600">Incluso</p>
              </div>
            )}
            {deliverables.onboarding && (
              <div>
                <p className="text-muted-foreground">Onboarding</p>
                <p className="font-medium text-green-600">Incluso</p>
              </div>
            )}
            {deliverables.premiumSupport && (
              <div>
                <p className="text-muted-foreground">Supporto Premium</p>
                <p className="font-medium text-green-600">Incluso</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pacchetti Premium</h1>
        <p className="text-muted-foreground">
          Soluzioni complete per scalare la tua agenzia con l'AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages" data-testid="tab-packages">
            <Sparkles className="h-4 w-4 mr-2" />
            Pacchetti
          </TabsTrigger>
          <TabsTrigger value="purchases" data-testid="tab-purchases">
            <ShoppingBag className="h-4 w-4 mr-2" />
            I Miei Acquisti
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-8">
          <Card 
            className="relative overflow-hidden border-2 border-sunset-gold/50 hover:border-sunset-gold transition-all duration-300 hover:shadow-xl max-w-xl mx-auto"
            data-testid="package-card-boost"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sunset-gold to-orange-500" />
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-sunset-gold to-orange-500 text-white border-0"
                >
                  Pacchetto Scala in 7 Giorni
                </Badge>
                <div className="p-2 rounded-full bg-gradient-to-r from-sunset-gold to-orange-500">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mt-3 gradient-text-gold">{boostPackage.name}</CardTitle>
              <CardDescription className="text-sm">{boostPackage.tagline}</CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-sunset-gold to-orange-500 bg-clip-text text-transparent">
                  €{boostPackage.price}
                </span>
                <span className="text-muted-foreground text-sm">una tantum</span>
              </div>

              <ul className="space-y-3">
                {boostPackage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">Setup completo CRM + automazioni</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">10 moduli acquisizione lead</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">3 script follow-up personalizzati</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">1 ora formazione video + Consulenza 1:1</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-sunset-gold to-orange-500 hover:opacity-90 text-white text-lg py-6"
                onClick={handlePurchase}
                disabled={loadingPackage === 'boost'}
                data-testid="btn-purchase-boost"
              >
                {loadingPackage === 'boost' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Elaborazione...
                  </>
                ) : (
                  <>
                    Acquista Agency Boost
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          {loadingPurchases ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : purchasesData?.purchases && purchasesData.purchases.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {purchasesData.purchases.map(renderPurchaseCard)}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nessun acquisto</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Non hai ancora acquistato nessun pacchetto premium.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('packages')}
                >
                  Esplora i Pacchetti
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4 max-w-4xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PackagesPageContent />
    </Suspense>
  );
}
