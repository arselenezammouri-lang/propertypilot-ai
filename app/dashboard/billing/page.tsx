'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, AlertCircle, Check, ExternalLink, Crown, Zap, Sparkles, TrendingUp, Shield, Rocket, Building2, Gift } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '@/lib/types/database.types';
import { fetchApi } from '@/lib/api/client';
import { STRIPE_PLANS, STRIPE_ONE_TIME_PACKAGES, PlanType } from '@/lib/stripe/config';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation, SupportedLocale } from '@/lib/i18n/dictionary';
import { formatCurrencyForLocale, formatDateForLocale } from '@/lib/i18n/intl';
import { Locale } from '@/lib/i18n/config';

export default function BillingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { locale, currency } = useLocaleContext();
  const translation = getTranslation(locale as SupportedLocale);
  const billingT = translation.billing;

  const { data: subscriptionData, isLoading, error } = useQuery<{ success: boolean; data: Subscription }>({
    queryKey: ['/api/user/subscription'],
    retry: 1,
  });

  const subscription = subscriptionData?.data;
  const rawStatus = subscription?.status || 'free';
  const isFreePlan = rawStatus === 'free';
  const currentPlan = isFreePlan ? null : (rawStatus as PlanType);
  const freePlanConfig = {
    name: billingT.freePlanName,
    price: 0,
    priceId: null,
    tagline: billingT.noActiveSubscription,
    features: [billingT.viewPlans, billingT.subscribeToUnlock],
    limits: {
      listingsPerMonth: 0,
    },
  };
  const planConfig = currentPlan ? STRIPE_PLANS[currentPlan] : freePlanConfig;
  const formatPlanPrice = (amount: number) =>
    `${formatCurrencyForLocale(amount, locale as Locale, currency)}${billingT.perMonth}`;

  if (error && !subscription) {
    console.warn('[BILLING] Subscription fetch failed, showing default Free plan:', error);
  }

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<{ message?: string }>('/api/stripe/cancel-subscription', { method: 'POST' });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
      toast({
        title: billingT.cancelledTitle,
        description: data.message,
        duration: 8000,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: translation.common.error,
        description: error.message || billingT.cancelError,
        duration: 8000,
      });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<{ message?: string }>('/api/stripe/reactivate-subscription', { method: 'POST' });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
      toast({
        title: billingT.reactivatedTitle,
        description: data.message,
        duration: 8000,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: translation.common.error,
        description: error.message || billingT.reactivateError,
        duration: 8000,
      });
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<{ url?: string }>('/api/stripe/portal', { method: 'POST' });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: translation.common.error,
        description: error.message || billingT.portalError,
        duration: 8000,
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planType: SubscriptionStatus) => {
      const res = await fetchApi<{ url?: string }>('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ planType }),
      });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data, variables) => {
      if (variables === 'agency') {
        localStorage.setItem('upgradedPlan', 'agency');
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: translation.common.error,
        description: error.message || billingT.startCheckoutError,
        duration: 8000,
      });
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planType: SubscriptionStatus) => {
      const res = await fetchApi<{ isUpgrade?: boolean; message?: string }>('/api/stripe/upgrade', {
        method: 'POST',
        body: JSON.stringify({ planType }),
      });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data) => {
      toast({
        title: data?.isUpgrade ? billingT.completedUpgradeTitle : billingT.changedPlanTitle,
        description: `${data?.message ?? ''} ${billingT.reloadMessage}`,
        duration: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: billingT.upgradeErrorTitle,
        description: error.message || billingT.upgradeError,
        duration: 8000,
      });
    },
  });

  const boostCheckoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<{ url?: string }>('/api/stripe/checkout-oneshot', {
        method: 'POST',
        body: JSON.stringify({ packageId: 'boost' }),
      });
      if (!res.success) throw new Error(res.message || res.error);
      return res.data ?? {};
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: translation.common.error,
        description: error.message || billingT.startCheckoutError,
        duration: 8000,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-royal-purple" data-testid="loading-spinner" />
      </div>
    );
  }

  // Errore caricamento abbonamento: mostriamo piano Free e messaggio soft, senza bloccare
  if (error && !subscription) {
    return (
      <div className="container max-w-6xl py-10 space-y-6">
        <h1 className="text-4xl font-extrabold mb-3" data-testid="heading-billing">
          {billingT.title} <span className="gradient-text-purple">{billingT.titleAccent}</span>
        </h1>
        <div className="futuristic-card p-6 border-orange-500/30 flex flex-col items-center justify-center min-h-[280px] gap-4">
          <p className="text-muted-foreground text-center">
            {locale === 'it' ? 'Impossibile caricare l\'abbonamento. Mostriamo il piano Free.' : 'Unable to load subscription. Showing Free plan.'}
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] })}
            variant="outline"
            className="border-royal-purple/30"
          >
            {locale === 'it' ? 'Riprova' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (subscription?.cancel_at_period_end) {
      return <Badge variant="destructive" className="text-base px-4 py-1.5" data-testid="badge-status">{billingT.expiring}</Badge>;
    }
    
    switch (currentPlan) {
      case 'starter':
        return <Badge variant="default" className="bg-electric-blue text-white text-base px-4 py-1.5" data-testid="badge-status">🚀 Starter</Badge>;
      case 'pro':
        return <Badge variant="default" className="bg-sunset-gold text-black text-base px-4 py-1.5" data-testid="badge-status">⚡ Pro</Badge>;
      case 'agency':
        return <Badge variant="default" className="bg-royal-purple text-white text-base px-4 py-1.5" data-testid="badge-status">👑 Agency</Badge>;
      default:
        return <Badge variant="secondary" className="text-base px-4 py-1.5" data-testid="badge-status">{billingT.freePlanName}</Badge>;
    }
  };

  const getPlanTheme = () => {
    switch (currentPlan) {
      case 'starter':
        return {
          cardClass: 'border-2 border-electric-blue/30 shadow-glow-blue',
          iconBg: 'from-electric-blue/30 to-electric-blue/10',
          iconColor: 'text-electric-blue',
          textGradient: 'text-electric-blue',
          glow: 'shadow-glow-blue'
        };
      case 'pro':
        return {
          cardClass: 'border-2 border-sunset-gold/30 shadow-glow-gold',
          iconBg: 'from-sunset-gold/30 to-sunset-gold/10',
          iconColor: 'text-sunset-gold',
          textGradient: 'gradient-text-gold',
          glow: 'shadow-glow-gold'
        };
      case 'agency':
        return {
          cardClass: 'border-2 border-royal-purple/30 shadow-glow-purple',
          iconBg: 'from-royal-purple/30 to-royal-purple/10',
          iconColor: 'text-royal-purple',
          textGradient: 'gradient-text-purple',
          glow: 'shadow-glow-purple'
        };
      default:
        return {
          cardClass: 'border-silver-frost/30',
          iconBg: 'from-silver-frost/20 to-silver-frost/5',
          iconColor: 'text-muted-foreground',
          textGradient: 'text-foreground',
          glow: ''
        };
    }
  };

  const theme = getPlanTheme();

  const getPlanIcon = () => {
    switch (currentPlan) {
      case 'agency':
        return <Crown className={`h-7 w-7 md:h-8 md:w-8 ${theme.iconColor}`} />;
      case 'pro':
        return <Zap className={`h-7 w-7 md:h-8 md:w-8 ${theme.iconColor}`} />;
      case 'starter':
        return <Rocket className={`h-7 w-7 md:h-8 md:w-8 ${theme.iconColor}`} />;
      default:
        return <Shield className={`h-7 w-7 md:h-8 md:w-8 ${theme.iconColor}`} />;
    }
  };

  return (
    <div className="container max-w-6xl py-10 space-y-10 md:py-12 md:space-y-12">
      <div className="text-center md:text-left animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4" data-testid="heading-billing">
          {billingT.title} <span className="gradient-text-purple">{billingT.titleAccent}</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground" data-testid="text-description">
          {billingT.subtitle}
        </p>
      </div>

      <div className={`futuristic-card p-8 md:p-10 ${theme.cardClass} hover-lift animate-fade-in-up delay-100 relative overflow-hidden`} data-testid="card-current-plan">
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${theme.iconBg} rounded-bl-[6rem] opacity-50`} />
        
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.glow}`}>
                {getPlanIcon()}
              </div>
              <div>
                <h2 className={`text-3xl md:text-4xl font-black ${theme.textGradient} capitalize`} data-testid="text-plan-name">
                  {billingT.currentPlanPrefix} {planConfig.name}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-medium" data-testid="text-plan-price">
                  {isFreePlan ? billingT.noSubscription : formatPlanPrice(planConfig.price)}
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid gap-5 mb-8">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-neon-aqua mt-0.5" />
              <div>
                <p className="font-bold text-lg" data-testid="text-limits">
                  {planConfig.limits.listingsPerMonth === -1
                    ? billingT.unlimitedListings
                    : `${planConfig.limits.listingsPerMonth} ${billingT.listingsPerMonth}`}
                </p>
              </div>
            </div>
            {planConfig.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-6 w-6 text-neon-aqua mt-0.5" />
                <p className="text-lg" data-testid={`text-feature-${index}`}>{feature}</p>
              </div>
            ))}
          </div>

          {subscription?.current_period_end && !isFreePlan && (
            <div className="pt-6 border-t border-silver-frost/30 space-y-3 mb-8">
              <div className="flex items-center gap-3 text-base">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">{billingT.nextRenewal}</span>
                <span className="font-bold" data-testid="text-renewal-date">
                  {formatDateForLocale(subscription.current_period_end, locale as Locale)}
                </span>
              </div>
              {subscription.cancel_at_period_end && (
                <div className="flex items-start gap-3 text-base text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="font-medium" data-testid="text-cancel-warning">
                    {billingT.cancelWarning}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-silver-frost/30 flex flex-wrap gap-4">
            {isFreePlan && (
              <>
                <Button
                  onClick={() => checkoutMutation.mutate('starter')}
                  disabled={checkoutMutation.isPending}
                  data-testid="button-upgrade-starter"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-electric-blue/30 hover:border-electric-blue hover:bg-electric-blue/10 transition-all"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Rocket className="h-5 w-5 mr-2" />
                  )}
                  {billingT.switchToStarter} {formatCurrencyForLocale(197, locale as Locale, currency)}
                </Button>
                <Button
                  onClick={() => checkoutMutation.mutate('pro')}
                  disabled={checkoutMutation.isPending}
                  data-testid="button-upgrade-pro"
                  className="neon-button text-lg px-8 py-6 group"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {billingT.switchToPro} {formatCurrencyForLocale(497, locale as Locale, currency)}
                  <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button
                  onClick={() => checkoutMutation.mutate('agency')}
                  disabled={checkoutMutation.isPending}
                  data-testid="button-upgrade-agency"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Building2 className="h-5 w-5 mr-2" />
                  )}
                  {billingT.switchToAgency} {formatCurrencyForLocale(897, locale as Locale, currency)}
                </Button>
              </>
            )}

            {currentPlan === 'starter' && (
              <>
                <Button
                  onClick={() => upgradeMutation.mutate('pro')}
                  disabled={upgradeMutation.isPending}
                  data-testid="button-upgrade-pro"
                  className="neon-button text-lg px-8 py-6 group"
                >
                  {upgradeMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {billingT.upgradeToPro} {formatCurrencyForLocale(497, locale as Locale, currency)}
                  <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button
                  onClick={() => upgradeMutation.mutate('agency')}
                  disabled={upgradeMutation.isPending}
                  data-testid="button-upgrade-agency"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all"
                >
                  {upgradeMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Building2 className="h-5 w-5 mr-2" />
                  )}
                  {billingT.upgradeToAgency} {formatCurrencyForLocale(897, locale as Locale, currency)}
                </Button>
              </>
            )}

            {currentPlan === 'pro' && (
              <>
                <Button
                  onClick={() => upgradeMutation.mutate('agency')}
                  disabled={upgradeMutation.isPending}
                  data-testid="button-upgrade-agency"
                  className="neon-button text-lg px-8 py-6 group"
                >
                  {upgradeMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Crown className="h-5 w-5 mr-2" />
                  )}
                  {billingT.upgradeToAgency} {formatCurrencyForLocale(897, locale as Locale, currency)}
                  <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </>
            )}

            {!isFreePlan && (
              <>
                {subscription?.cancel_at_period_end ? (
                  <Button
                    onClick={() => reactivateMutation.mutate()}
                    disabled={reactivateMutation.isPending}
                    data-testid="button-reactivate"
                    className="neon-button text-lg px-8 py-6"
                  >
                    {reactivateMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Check className="h-5 w-5 mr-2" />
                    )}
                    {billingT.reactivateSubscription}
                  </Button>
                ) : (
                  <Button
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                    data-testid="button-cancel"
                    variant="destructive"
                    className="text-lg px-8 py-6"
                  >
                    {cancelMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    {billingT.cancelSubscription}
                  </Button>
                )}
                
                <Button
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                  data-testid="button-portal"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all"
                >
                  {portalMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="h-5 w-5 mr-2" />
                  )}
                  {billingT.managePayments}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {(isFreePlan || currentPlan === 'starter') && (
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3 animate-fade-in-up delay-200">
            <TrendingUp className="h-8 w-8 text-royal-purple" />
            <span>{billingT.unlockPremium}</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {isFreePlan && (
              <div className="futuristic-card p-6 md:p-8 border-2 border-electric-blue/30 shadow-glow-blue hover-lift animate-fade-in-up delay-300 relative overflow-hidden group" data-testid="card-plan-starter">
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-electric-blue/30 to-transparent rounded-bl-[4rem] opacity-50 group-hover:opacity-70 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/30 to-electric-blue/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-blue">
                    <Rocket className="h-6 w-6 text-electric-blue" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-electric-blue mb-2">Starter</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-4">{billingT.starterForBeginners}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-black gradient-text-purple">{formatCurrencyForLocale(197, locale as Locale, currency)}</span>
                    <span className="text-lg text-muted-foreground">{billingT.perMonth}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {STRIPE_PLANS.starter.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-neon-aqua mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => checkoutMutation.mutate('starter')}
                    disabled={checkoutMutation.isPending}
                    data-testid="button-choose-starter"
                    variant="outline"
                    className="w-full text-base py-5 border-2 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 transition-all"
                  >
                    {checkoutMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Rocket className="h-5 w-5 mr-2" />
                    )}
                    {translation.landing.pricing.cta.chooseStarter}
                  </Button>
                </div>
              </div>
            )}

            <div className="futuristic-card p-6 md:p-8 border-2 border-sunset-gold/50 shadow-glow-gold hover-lift animate-fade-in-up delay-350 relative overflow-hidden group" data-testid="card-plan-pro">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-sunset-gold/30 to-transparent rounded-bl-[4rem] opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="absolute top-3 right-3">
                <span className="premium-badge shadow-glow-gold text-xs">
                  ⭐ {billingT.recommended}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-sunset-gold/30 to-sunset-gold/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-gold">
                  <Zap className="h-6 w-6 text-sunset-gold" />
                </div>
                
                <h3 className="text-2xl font-black gradient-text-gold mb-2">Pro</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">{billingT.proForProfessionals}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-black gradient-text-gold">{formatCurrencyForLocale(497, locale as Locale, currency)}</span>
                  <span className="text-lg text-muted-foreground">{billingT.perMonth}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {STRIPE_PLANS.pro.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-aqua mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => currentPlan === 'starter' ? upgradeMutation.mutate('pro') : checkoutMutation.mutate('pro')}
                  disabled={checkoutMutation.isPending || upgradeMutation.isPending}
                  data-testid="button-choose-pro"
                  className="neon-button w-full text-base py-5 group"
                >
                  {(checkoutMutation.isPending || upgradeMutation.isPending) ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {currentPlan === 'starter' ? billingT.upgradeToPro : translation.landing.pricing.cta.choosePro}
                  <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="futuristic-card p-6 md:p-8 border-2 border-royal-purple/30 shadow-glow-purple hover-lift animate-fade-in-up delay-400 relative overflow-hidden group" data-testid="card-plan-agency">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-royal-purple/30 to-transparent rounded-bl-[4rem] opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-purple">
                  <Building2 className="h-6 w-6 text-royal-purple" />
                </div>
                
                <h3 className="text-2xl font-black gradient-text-purple mb-2">Agency</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">{billingT.agencyForTeams}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-black gradient-text-purple">{formatCurrencyForLocale(897, locale as Locale, currency)}</span>
                  <span className="text-lg text-gray-100">{billingT.perMonth}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {STRIPE_PLANS.agency.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-aqua mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => (currentPlan === 'starter' || currentPlan === 'pro') ? upgradeMutation.mutate('agency') : checkoutMutation.mutate('agency')}
                  disabled={checkoutMutation.isPending || upgradeMutation.isPending}
                  data-testid="button-choose-agency"
                  variant="outline"
                  className="w-full text-base py-5 border-2 border-royal-purple/50 hover:border-royal-purple hover:bg-royal-purple/10 transition-all"
                >
                  {(checkoutMutation.isPending || upgradeMutation.isPending) ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Building2 className="h-5 w-5 mr-2" />
                  )}
                  {(currentPlan === 'starter' || currentPlan === 'pro') ? billingT.upgradeToAgency : translation.landing.pricing.cta.chooseAgency}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agency Boost - One-Time Package */}
      <div className="animate-fade-in-up delay-500">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Gift className="h-8 w-8 text-sunset-gold" />
          <span>{billingT.specialPackage}</span>
        </h2>
        
        <div className="futuristic-card p-8 md:p-10 border-2 border-orange-500/50 shadow-glow-gold hover-lift relative overflow-hidden group" data-testid="card-boost-package">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/30 to-transparent rounded-bl-[6rem] opacity-50 group-hover:opacity-70 transition-opacity" />
          
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-sunset-gold to-orange-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-glow-gold">
              UNA TANTUM
            </span>
          </div>
          
          <div className="relative grid md:grid-cols-2 gap-8">
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-glow-gold">
                <Zap className="h-7 w-7 text-orange-500" />
              </div>
              
              <h3 className="text-3xl font-black gradient-text-gold mb-2">Agency Boost</h3>
              <p className="text-lg text-muted-foreground font-medium mb-4">
                {STRIPE_ONE_TIME_PACKAGES.boost.tagline}
              </p>
              
              <div className="mb-6">
                <span className="text-5xl font-black gradient-text-gold">{formatCurrencyForLocale(STRIPE_ONE_TIME_PACKAGES.boost.price, locale as Locale, currency)}</span>
                <span className="text-lg text-muted-foreground ml-2">{billingT.oneTime}</span>
              </div>
              
              <Button
                onClick={() => boostCheckoutMutation.mutate()}
                disabled={boostCheckoutMutation.isPending}
                data-testid="button-buy-boost"
                className="neon-button text-lg px-8 py-6 group"
              >
                {boostCheckoutMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Zap className="h-5 w-5 mr-2" />
                )}
                {billingT.buyAgencyBoost}
                <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-muted-foreground">{billingT.whatIncludes}</h4>
              <ul className="space-y-3">
                {STRIPE_ONE_TIME_PACKAGES.boost.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-neon-aqua mt-0.5 flex-shrink-0" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
