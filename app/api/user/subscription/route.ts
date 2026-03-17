import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { requireStripe } from '@/lib/stripe/config';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/safe-logger';
import { repairMissingStripeSubscription } from '@/lib/utils/subscription-sync';

export const dynamic = "force-dynamic";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const PAID_STATUSES = ['starter', 'pro', 'agency'];

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      logger.error('[GET SUBSCRIPTION] Error', error, { userId: user.id });
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    if (!subscription) {
      const { data: newSubscription, error: insertError} = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'free',
        })
        .select()
        .single();

      if (insertError) {
        logger.error('[CREATE SUBSCRIPTION] Error', insertError, { userId: user.id });
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...newSubscription,
          cancel_at_period_end: false,
          stripe_verified: false,
        },
      });
    }

    if (PAID_STATUSES.includes(subscription.status) && subscription.stripe_subscription_id) {
      try {
        // Check if Stripe is configured (will be checked by requireStripe, but we catch the error)
        
        const stripe = requireStripe();
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
        
        const isActive = stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing';
        
        if (!isActive) {
          logger.debug('[SUBSCRIPTION SYNC] Downgrading inactive subscription', {
            userId: user.id,
            dbStatus: subscription.status,
            stripeStatus: stripeSubscription.status,
          });
          
          const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          if (updateError) {
            logger.error('[SUBSCRIPTION SYNC] Failed to downgrade', updateError, { userId: user.id });
          }

          return NextResponse.json({
            success: true,
            data: {
              ...subscription,
              status: 'free',
              cancel_at_period_end: false,
              stripe_verified: true,
              stripe_status: stripeSubscription.status,
              sync_action: 'downgraded_inactive',
            },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            ...subscription,
            cancel_at_period_end: subscription.cancel_at_period_end ?? stripeSubscription.cancel_at_period_end,
            stripe_verified: true,
            stripe_status: stripeSubscription.status,
          },
        });
      } catch (stripeError: any) {
        if (stripeError.code === 'resource_missing') {
          logger.debug('[SUBSCRIPTION SYNC] Cleaning invalid subscription', {
            userId: user.id,
            stripeSubscriptionId: subscription.stripe_subscription_id,
          });
          
          const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'free',
              stripe_subscription_id: null,
              price_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          if (updateError) {
            logger.error('[SUBSCRIPTION SYNC] Failed to clean up invalid subscription', updateError, { userId: user.id });
          }

          return NextResponse.json({
            success: true,
            data: {
              ...subscription,
              status: 'free',
              stripe_subscription_id: null,
              cancel_at_period_end: false,
              stripe_verified: true,
              sync_action: 'cleaned_invalid_subscription',
            },
          });
        }
        
        logger.error('[SUBSCRIPTION VERIFY] Stripe error', stripeError as Error, { userId: user.id });
        return NextResponse.json({
          success: true,
          data: {
            ...subscription,
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            stripe_verified: false,
            stripe_error: stripeError.message,
          },
        });
      }
    }

    if (PAID_STATUSES.includes(subscription.status) && !subscription.stripe_subscription_id) {
      logger.debug('[SUBSCRIPTION SYNC] Attempting repair for orphan subscription', {
        userId: user.id,
        status: subscription.status,
      });

      const repair = await repairMissingStripeSubscription({
        userId: user.id,
        currentStatus: subscription.status,
        stripeCustomerId: subscription.stripe_customer_id ?? null,
        supabase,
      });

      if (repair.repaired && repair.status !== 'free') {
        return NextResponse.json({
          success: true,
          data: {
            ...subscription,
            status: repair.status,
            stripe_subscription_id: repair.stripeSubscriptionId,
            cancel_at_period_end: false,
            stripe_verified: true,
            sync_action: repair.reason,
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          ...subscription,
          status: 'free',
          stripe_subscription_id: null,
          cancel_at_period_end: false,
          stripe_verified: true,
          sync_action: repair.reason,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...subscription,
        cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        stripe_verified: subscription.status === 'free',
      },
    });

  } catch (error: any) {
    logger.error('[USER SUBSCRIPTION API] Error', error as Error, { component: 'user-subscription' });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Si è verificato un errore.'
      },
      { status: 500 }
    );
  }
}
