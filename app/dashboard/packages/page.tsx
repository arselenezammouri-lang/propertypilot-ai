'use client';

import { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Sparkles, Loader2, ShoppingBag, ArrowRight, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchApi } from '@/lib/api/client';
import { STRIPE_ONE_TIME_PACKAGES } from '@/lib/stripe/config';
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale, formatDateForLocale } from "@/lib/i18n/intl";
import type { Locale } from "@/lib/i18n/config";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import { Shield } from "lucide-react";
import { apiFailureToast, networkFailureToast } from "@/lib/i18n/api-feature-feedback";

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
  const { locale, currency } = useLocale();
  const feedbackLocale = locale;
  const billingT = useMemo(
    () => getTranslation(locale as SupportedLocale).billing,
    [locale]
  );
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.packagesPage,
    [locale]
  );
  const checkoutErrorRef = useRef(t.checkoutError);
  checkoutErrorRef.current = t.checkoutError;
  const { plan, isLoading: planLoading } = useUsageLimits();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('packages');

  const planBadgeLabel =
    plan === "agency"
      ? t.planAgency
      : plan === "pro"
        ? t.planPro
        : plan === "starter"
          ? t.planStarter
          : t.planFree;

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
  }, [
    searchParams,
    toast,
    queryClient,
    t.purchaseComplete,
    t.purchaseCompleteDesc,
    t.purchaseCanceled,
    t.purchaseCanceledDesc,
  ]);

  const handlePurchase = async () => {
    setLoadingPackage('boost');
    try {
      const res = await fetchApi<{ url?: string }>('/api/stripe/checkout-oneshot', {
        method: 'POST',
        body: JSON.stringify({ packageId: 'boost' }),
      });
      if (!res.success) throw new Error(res.error || res.message || checkoutErrorRef.current);
      if (res.data?.url) window.location.href = res.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        ...(error instanceof Error
          ? apiFailureToast(feedbackLocale, "premiumPackages", {}, error.message || checkoutErrorRef.current)
          : networkFailureToast(feedbackLocale, "premiumPackages")),
      });
    } finally {
      setLoadingPackage(null);
    }
  };

  const purchaseStatusLabel = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed") return t.active;
    if (s === "pending" || s === "processing") return t.statusPending;
    if (s === "failed" || s === "canceled" || s === "cancelled") return t.statusFailed;
    return status;
  };

  const renderPurchaseCard = (purchase: Purchase) => {
    const deliverables = purchase.deliverables || {};
    
    return (
      <Card key={purchase.id} className="border" data-testid={`purchase-${purchase.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{purchase.package_name}</CardTitle>
            <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
              {purchaseStatusLabel(purchase.status)}
            </Badge>
          </div>
          <CardDescription>
            {t.purchasedOn}{' '}
            {formatDateForLocale(purchase.created_at, locale as Locale)}
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
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-packages"
        subtitle={t.pageDesc}
        planBadge={
          !planLoading ? { label: planBadgeLabel, variant: "secondary" } : undefined
        }
        contextualHelp={<ContextualHelpTrigger docSlug="account/billing-guide" />}
      />

      <div
        className="mb-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70"
        data-testid="stripe-trust-banner-packages"
      >
        <Shield className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" aria-hidden />
        <p className="leading-relaxed">{billingT.stripeTrust}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 max-w-4xl mx-auto w-full">
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
              <CardTitle className="text-2xl mt-3 gradient-text-gold">{t.boostName}</CardTitle>
              <CardDescription className="text-sm">{t.boostTagline}</CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-sunset-gold to-orange-500 bg-clip-text text-transparent">
                  {formatCurrencyForLocale(boostPackage.price, locale as Locale, currency)}
                </span>
                <span className="text-muted-foreground text-sm">{t.oneTime}</span>
              </div>

              <ul className="space-y-3">
                {t.boostFeatures.map((feature, i) => (
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
    </DashboardPageShell>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <DashboardPageShell className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-royal-purple" />
      </DashboardPageShell>
    }>
      <PackagesPageContent />
    </Suspense>
  );
}
