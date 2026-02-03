import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, generations_count')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json(
        { error: 'Errore nel recupero dei dati' },
        { status: 500 }
      );
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
    console.error('Error in usage endpoint:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
