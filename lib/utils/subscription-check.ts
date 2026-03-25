import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from '@/lib/types/database.types';
import { headers } from 'next/headers';
import { isFounderEmail } from '@/lib/utils/founder-access';
import { isFounderSubscriptionPreviewAllowed } from '@/lib/utils/local-dev-host';

async function hasFounderAgencyOverride(supabase: SupabaseClient): Promise<boolean> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
    if (!isFounderSubscriptionPreviewAllowed(host)) return false;
    const { data, error } = await supabase.auth.getUser();
    if (error) return false;
    const email = data.user?.email?.toLowerCase();
    return isFounderEmail(email);
  } catch {
    return false;
  }
}

const ACTIVE_SUBSCRIPTION_REQUIRED =
  'Questa funzionalità richiede un abbonamento attivo. Aggiorna il tuo piano per continuare.';
const INVALID_SUBSCRIPTION_TYPE = ACTIVE_SUBSCRIPTION_REQUIRED;
const INVALID_PAYMENT_CONFIRMATION =
  'Abbonamento non valido. Il pagamento non risulta confermato. Contatta il supporto.';
const PRO_OR_AGENCY_REQUIRED =
  'Il Lead Scoring AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare la priorità automatica dei lead.';

/**
 * Verifica che l'utente abbia un abbonamento attivo prima di permettere l'uso di funzionalità premium.
 * 
 * Controlli effettuati:
 * 1. Lo status deve essere uno dei piani a pagamento ('starter', 'pro', 'agency')
 * 2. Deve esistere un stripe_subscription_id valido (conferma pagamento Stripe)
 * 
 * @param supabase - Client Supabase autenticato
 * @param userId - ID dell'utente da verificare
 * @returns Oggetto con allowed (boolean), planType (string), e opzionalmente error (string)
 */
export async function requireActiveSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; planType: string; error?: string }> {
  try {
    if (await hasFounderAgencyOverride(supabase)) {
      return {
        allowed: true,
        planType: 'agency',
      };
    }
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id, price_id')
      .eq('user_id', userId)
      .single();

    const isMissingRowError =
      subError && (subError.code === 'PGRST116' || String(subError.message || '').toLowerCase().includes('not found'));

    if (subError && !isMissingRowError) {
      console.error('[SUBSCRIPTION CHECK] Error fetching subscription:', subError);
      return {
        allowed: false,
        planType: 'free',
        error: ACTIVE_SUBSCRIPTION_REQUIRED
      };
    }

    if (!subscription) {
      return {
        allowed: false,
        planType: 'free',
        error: ACTIVE_SUBSCRIPTION_REQUIRED
      };
    }

    const planType = subscription.status || 'free';

    if (planType === 'free') {
      return {
        allowed: false,
        planType: 'free',
        error: ACTIVE_SUBSCRIPTION_REQUIRED
      };
    }

    const paidPlans: SubscriptionStatus[] = ['starter', 'pro', 'agency'];
    if (!paidPlans.includes(planType as SubscriptionStatus)) {
      console.warn('[SUBSCRIPTION CHECK] Invalid plan type:', planType);
      return {
        allowed: false,
        planType: planType,
        error: INVALID_SUBSCRIPTION_TYPE
      };
    }

    if (!subscription.stripe_subscription_id) {
      return {
        allowed: false,
        planType: planType,
        error: INVALID_PAYMENT_CONFIRMATION
      };
    }

    return {
      allowed: true,
      planType: planType
    };

  } catch (error) {
    console.error('[SUBSCRIPTION CHECK] Unexpected error:', error);
    return {
      allowed: false,
      planType: 'free',
      error: ACTIVE_SUBSCRIPTION_REQUIRED
    };
  }
}

/**
 * Verifica che l'utente abbia un abbonamento PRO o AGENCY (non STARTER).
 * Utilizzato per funzionalità premium avanzate come Lead Scoring AI.
 * 
 * Controlli effettuati:
 * 1. Lo status deve essere 'pro' o 'agency' (non 'starter' o 'free')
 * 2. Deve esistere un stripe_subscription_id valido (conferma pagamento Stripe)
 * 
 * @param supabase - Client Supabase autenticato
 * @param userId - ID dell'utente da verificare
 * @returns Oggetto con allowed (boolean), planType (string), e opzionalmente error (string)
 */
export async function requireProOrAgencySubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; planType: string; error?: string }> {
  try {
    if (await hasFounderAgencyOverride(supabase)) {
      return {
        allowed: true,
        planType: 'agency',
      };
    }
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id, price_id')
      .eq('user_id', userId)
      .single();

    const isMissingRowError =
      subError && (subError.code === 'PGRST116' || String(subError.message || '').toLowerCase().includes('not found'));

    if (subError && !isMissingRowError) {
      console.error('[SUBSCRIPTION CHECK PRO/AGENCY] Error fetching subscription:', subError);
      return {
        allowed: false,
        planType: 'free',
        error: PRO_OR_AGENCY_REQUIRED
      };
    }

    if (!subscription) {
      return {
        allowed: false,
        planType: 'free',
        error: PRO_OR_AGENCY_REQUIRED
      };
    }

    const planType = subscription.status || 'free';

    if (planType === 'free' || planType === 'starter') {
      return {
        allowed: false,
        planType: planType,
        error: PRO_OR_AGENCY_REQUIRED
      };
    }

    const premiumPlans: SubscriptionStatus[] = ['pro', 'agency'];
    if (!premiumPlans.includes(planType as SubscriptionStatus)) {
      console.warn('[SUBSCRIPTION CHECK PRO/AGENCY] Invalid plan type:', planType);
      return {
        allowed: false,
        planType: planType,
        error: PRO_OR_AGENCY_REQUIRED
      };
    }

    if (!subscription.stripe_subscription_id) {
      return {
        allowed: false,
        planType: planType,
        error: INVALID_PAYMENT_CONFIRMATION
      };
    }

    return {
      allowed: true,
      planType: planType
    };

  } catch (error) {
    console.error('[SUBSCRIPTION CHECK PRO/AGENCY] Unexpected error:', error);
    return {
      allowed: false,
      planType: 'free',
      error: PRO_OR_AGENCY_REQUIRED
    };
  }
}

