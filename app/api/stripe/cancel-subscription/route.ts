import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe } from '@/lib/stripe/config';

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
      .select('stripe_subscription_id, stripe_customer_id, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Nessun abbonamento trovato' },
        { status: 404 }
      );
    }

    if (subscription.status === 'free') {
      return NextResponse.json(
        { error: 'Hai già il piano gratuito' },
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
      cancel_at_period_end: true,
    });

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[CANCEL SUB] DB update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Abbonamento cancellato. Resterà attivo fino alla fine del periodo di fatturazione.',
    });

  } catch (error: any) {
    console.error('[CANCEL SUBSCRIPTION] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Errore durante la cancellazione',
        message: error.message || 'Si è verificato un errore. Riprova più tardi.'
      },
      { status: 500 }
    );
  }
}
