import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/safe-logger';
import { supabaseService } from '@/lib/supabase/service';
import { STRIPE_PLANS } from '@/lib/stripe/config';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
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
