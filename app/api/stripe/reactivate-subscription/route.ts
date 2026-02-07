import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe } from '@/lib/stripe/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Nessun abbonamento trovato' },
        { status: 404 }
      );
    }

    if (!subscription.cancel_at_period_end) {
      return NextResponse.json(
        { error: 'L\'abbonamento non è programmato per la cancellazione' },
        { status: 400 }
      );
    }

    if (!subscription.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'ID abbonamento Stripe non trovato' },
        { status: 400 }
      );
    }

    const stripe = requireStripe();
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: false })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[REACTIVATE SUB] DB update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Abbonamento riattivato con successo!',
    });

  } catch (error: any) {
    console.error('[REACTIVATE SUBSCRIPTION] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Errore durante la riattivazione',
        message: error.message || 'Si è verificato un errore. Riprova più tardi.'
      },
      { status: 500 }
    );
  }
}
