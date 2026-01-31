import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from '@/lib/types/database.types';

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
    // Recupera la subscription dal database
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id, price_id')
      .eq('user_id', userId)
      .single();

    if (subError) {
      console.error('[SUBSCRIPTION CHECK] Error fetching subscription:', subError);
      return {
        allowed: false,
        planType: 'free',
        error: 'Errore nel recupero dell\'abbonamento. Contatta il supporto.'
      };
    }

    // Se non esiste subscription, considera free
    if (!subscription) {
      return {
        allowed: false,
        planType: 'free',
        error: 'Questa funzionalità richiede un abbonamento attivo. Aggiorna il tuo piano per continuare.'
      };
    }

    const planType = subscription.status || 'free';

    // Se è free, blocca immediatamente
    if (planType === 'free') {
      return {
        allowed: false,
        planType: 'free',
        error: 'Questa funzionalità richiede un abbonamento attivo. Aggiorna il tuo piano per continuare.'
      };
    }

    // Verifica che sia un piano a pagamento valido
    const paidPlans: SubscriptionStatus[] = ['starter', 'pro', 'agency'];
    if (!paidPlans.includes(planType as SubscriptionStatus)) {
      console.warn('[SUBSCRIPTION CHECK] Invalid plan type:', planType);
      return {
        allowed: false,
        planType: planType,
        error: 'Tipo di abbonamento non valido. Contatta il supporto.'
      };
    }

    // CONTROLLO CRITICO: Deve esistere stripe_subscription_id
    // Questo conferma che il pagamento è stato processato da Stripe
    if (!subscription.stripe_subscription_id) {
      // Log dettagliato solo in sviluppo, senza esporre dati sensibili in produzione
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SUBSCRIPTION CHECK] User has paid plan but no stripe_subscription_id:', {
          userId,
          planType,
          priceId: subscription.price_id,
        });
      }
      return {
        allowed: false,
        planType: planType,
        error: 'Abbonamento non valido. Il pagamento non risulta confermato. Contatta il supporto.'
      };
    }

    // Tutti i controlli passati: abbonamento attivo e valido
    return {
      allowed: true,
      planType: planType
    };

  } catch (error) {
    console.error('[SUBSCRIPTION CHECK] Unexpected error:', error);
    return {
      allowed: false,
      planType: 'free',
      error: 'Errore nella verifica dell\'abbonamento. Riprova più tardi.'
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
    // Recupera la subscription dal database
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id, price_id')
      .eq('user_id', userId)
      .single();

    if (subError) {
      console.error('[SUBSCRIPTION CHECK PRO/AGENCY] Error fetching subscription:', subError);
      return {
        allowed: false,
        planType: 'free',
        error: 'Errore nel recupero dell\'abbonamento. Contatta il supporto.'
      };
    }

    // Se non esiste subscription, considera free
    if (!subscription) {
      return {
        allowed: false,
        planType: 'free',
        error: 'Il Lead Scoring AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare la priorità automatica dei lead.'
      };
    }

    const planType = subscription.status || 'free';

    // Blocca free e starter
    if (planType === 'free' || planType === 'starter') {
      return {
        allowed: false,
        planType: planType,
        error: 'Il Lead Scoring AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare la priorità automatica dei lead.'
      };
    }

    // Verifica che sia PRO o AGENCY
    const premiumPlans: SubscriptionStatus[] = ['pro', 'agency'];
    if (!premiumPlans.includes(planType as SubscriptionStatus)) {
      console.warn('[SUBSCRIPTION CHECK PRO/AGENCY] Invalid plan type:', planType);
      return {
        allowed: false,
        planType: planType,
        error: 'Il Lead Scoring AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare la priorità automatica dei lead.'
      };
    }

    // CONTROLLO CRITICO: Deve esistere stripe_subscription_id
    if (!subscription.stripe_subscription_id) {
      console.warn('[SUBSCRIPTION CHECK PRO/AGENCY] User has premium plan but no stripe_subscription_id:', {
        userId,
        planType,
        priceId: subscription.price_id
      });
      return {
        allowed: false,
        planType: planType,
        error: 'Abbonamento non valido. Il pagamento non risulta confermato. Contatta il supporto.'
      };
    }

    // Tutti i controlli passati: abbonamento PRO o AGENCY attivo e valido
    return {
      allowed: true,
      planType: planType
    };

  } catch (error) {
    console.error('[SUBSCRIPTION CHECK PRO/AGENCY] Unexpected error:', error);
    return {
      allowed: false,
      planType: 'free',
      error: 'Errore nella verifica dell\'abbonamento. Riprova più tardi.'
    };
  }
}

