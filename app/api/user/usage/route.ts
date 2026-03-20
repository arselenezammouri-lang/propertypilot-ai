import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { logger } from '@/lib/utils/safe-logger';
import { supabaseService } from '@/lib/supabase/service';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { isFounderEmail } from '@/lib/utils/founder-access';
import { isFounderSubscriptionPreviewAllowed } from '@/lib/utils/local-dev-host';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user } = auth;

    const host =
      request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
    if (isFounderEmail(user.email) && isFounderSubscriptionPreviewAllowed(host)) {
      return NextResponse.json({
        plan: 'agency',
        currentUsage: 0,
        limit: -1,
        hasReachedLimit: false,
        isNearLimit: false,
        remainingGenerations: -1,
        percentageUsed: 0,
        founder_override: true,
        localhost_preview: true,
      });
    }

    let subscription = null;
    
    const { data: subData, error: subError } = await supabaseService
      .from('subscriptions')
      .select('status, generations_count')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      if (subError.code === '42703') {
        logger.warn('Subscriptions table schema mismatch, using defaults', { endpoint: '/api/user/usage' });
      } else {
        logger.error('Error fetching subscription', subError, { endpoint: '/api/user/usage' });
      }
    } else {
      subscription = subData;
    }

    if (!subscription) {
      const { data: newSub, error: createError } = await supabaseService
        .from('subscriptions')
        .insert({ user_id: user.id, status: 'free', generations_count: 0 })
        .select('status, generations_count')
        .single();
      
      if (!createError) {
        subscription = newSub;
      }
    }

    const plan = subscription?.status || 'free';
    const currentUsage = subscription?.generations_count || 0;
    
    const planLimits = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]?.limits || { listingsPerMonth: 5 };
    const limit = planLimits.listingsPerMonth;

    const hasReachedLimit = limit !== -1 && currentUsage >= limit;
    const isNearLimit = limit !== -1 && currentUsage >= limit * 0.8;
    const remainingGenerations = limit === -1 ? -1 : Math.max(0, limit - currentUsage);
    const percentageUsed = limit === -1 ? 0 : Math.min(100, (currentUsage / limit) * 100);

    return NextResponse.json({
      plan,
      currentUsage,
      limit,
      hasReachedLimit,
      isNearLimit,
      remainingGenerations,
      percentageUsed,
    });
  } catch (error) {
    logger.error('Error in usage endpoint', error, { endpoint: '/api/user/usage' });
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
