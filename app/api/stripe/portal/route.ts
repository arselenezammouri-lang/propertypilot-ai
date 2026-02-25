import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe } from '@/lib/stripe/config';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Nessun cliente Stripe trovato' },
        { status: 404 }
      );
    }

    const returnUrl = `${origin}/dashboard/billing`;

    const stripe = requireStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    });

  } catch (error: any) {
    logger.error('[STRIPE PORTAL] Error', error as Error, { component: 'stripe-portal' });
    
    return NextResponse.json(
      { 
        error: 'Errore durante la creazione del portale',
        message: error.message || 'Si è verificato un errore. Riprova più tardi.'
      },
      { status: 500 }
    );
  }
}
