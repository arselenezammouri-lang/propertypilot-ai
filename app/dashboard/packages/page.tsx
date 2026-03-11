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
import { useLocaleContext } from "@/components/providers/locale-provider";

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
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('packages');

  const t = {
    purchaseComplete: isItalian ? "Acquisto completato!" : "Purchase complete!",
    purchaseCompleteDesc: isItalian ? "Grazie per aver acquistato Agency Boost. Trovi i dettagli nei tuoi acquisti." : "Thank you for purchasing Agency Boost. Find the details in your purchases.",
    purchaseCanceled: isItalian ? "Acquisto annullato" : "Purchase canceled",
    purchaseCanceledDesc: isItalian ? "Il pagamento è stato annullato. Puoi riprovare quando vuoi." : "The payment was canceled. You can try again whenever you want.",
    errorTitle: isItalian ? "Errore" : "Error",
    checkoutError: isItalian ? "Impossibile avviare il checkout" : "Cannot start checkout",
    pageTitle: isItalian ? "Pacchetti Premium" : "Premium Packages",
    pageDesc: isItalian ? "Soluzioni complete per scalare la tua agenzia con l'AI" : "Complete solutions to scale your agency with AI",
    tabPackages: isItalian ? "Pacchetti" : "Packages",
    tabPurchases: isItalian ? "I Miei Acquisti" : "My Purchases",
    oneTime: isItalian ? "una tantum" : "one-time",
    setupComplete: isItalian ? "Setup Completo" : "Complete Setup",
    onboarding: isItalian ? "Onboarding" : "Onboarding",
    premiumSupport: isItalian ? "Supporto Premium" : "Premium Support",
    included: isItalian ? "Incluso" : "Included",
    purchasedOn: isItalian ? "Acquistato il" : "Purchased on",
    active: isItalian ? "Attivo" : "Active",
    processing: isItalian ? "Elaborazione..." : "Processing...",
    buyAgencyBoost: isItalian ? "Acquista Agency Boost" : "Buy Agency Boost",
    noPurchases: isItalian ? "Nessun acquisto" : "No purchases",
    noPurchasesDesc: isItalian ? "Non hai ancora acquistato nessun pacchetto premium." : "You haven't purchased any premium packages yet.",
    explorePackages: isItalian ? "Esplora i Pacchetti" : "Explore Packages",
    packageScale: isItalian ? "Pacchetto Scala in 7 Giorni" : "Scale in 7 Days Package",
    featureSetup: isItalian ? "Setup completo CRM + automazioni" : "Full CRM setup + automations",
    featureLeads: isItalian ? "10 moduli acquisizione lead" : "10 lead acquisition modules",
    featureFollowUp: isItalian ? "3 script follow-up personalizzati" : "3 personalized follow-up scripts",
    featureTraining: isItalian ? "1 ora formazione video + Consulenza 1:1" : "1 hour video training + 1:1 consulting",
  };

  const { data: purchasesData, isLoading: loadingPurchases } = useQuery<{ purchases: Purchase[] }>({
    queryKey: ['/api/purchases'],
  });

  const boostPackage = STRIPE_ONE_TIME_PACKAGES.boost;

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: t.purchaseComplete,
        description: t.purchaseCompleteDesc,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/purchases'] });
      setActiveTab('purchases');
      window.history.replaceState({}, '', '/dashboard/packages');
    } else if (canceled === 'true') {
      toast({
        title: t.purchaseCanceled,
        description: t.purchaseCanceledDesc,
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
      throw new Error(data.error || t.checkoutError);
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t.errorTitle,
        description: error instanceof Error ? error.message : t.checkoutError,
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
              {purchase.status === 'completed' ? t.active : purchase.status}
            </Badge>
          </div>
          <CardDescription>
            {t.purchasedOn} {new Date(purchase.created_at).toLocaleDateString(isItalian ? 'it-IT' : 'en-US')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {deliverables.setupComplete && (
              <div>
                <p className="text-muted-foreground">{t.setupComplete}</p>
                <p className="font-medium text-green-600">{t.included}</p>
              </div>
            )}
            {deliverables.onboarding && (
              <div>
                <p className="text-muted-foreground">{t.onboarding}</p>
                <p className="font-medium text-green-600">{t.included}</p>
              </div>
            )}
            {deliverables.premiumSupport && (
              <div>
                <p className="text-muted-foreground">{t.premiumSupport}</p>
                <p className="font-medium text-green-600">{t.included}</p>
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
        <h1 className="text-3xl font-bold mb-2">{t.pageTitle}</h1>
        <p className="text-muted-foreground">
          {t.pageDesc}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages" data-testid="tab-packages">
            <Sparkles className="h-4 w-4 mr-2" />
            {t.tabPackages}
          </TabsTrigger>
          <TabsTrigger value="purchases" data-testid="tab-purchases">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {t.tabPurchases}
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
                  {t.packageScale}
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
                <span className="text-muted-foreground text-sm">{t.oneTime}</span>
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
                  <span className="text-sm text-muted-foreground">{t.featureSetup}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">{t.featureLeads}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">{t.featureFollowUp}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-sunset-gold" />
                  <span className="text-sm text-muted-foreground">{t.featureTraining}</span>
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
                    {t.processing}
                  </>
                ) : (
                  <>
                    {t.buyAgencyBoost}
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
                <h3 className="text-lg font-medium mb-2">{t.noPurchases}</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {t.noPurchasesDesc}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('packages')}
                >
                  {t.explorePackages}
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
