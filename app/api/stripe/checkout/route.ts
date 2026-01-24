import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, getOrCreateCustomer, PLAN_TO_PRICE_ID } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  plan: z.enum(['STARTER', 'PRO', 'AGENCY']),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = checkoutSchema.parse(body);

    // Recupera profilo utente
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Ottieni o crea customer Stripe
    const customer = await getOrCreateCustomer(
      user.id,
      profile.email || user.email || '',
      profile.full_name || undefined
    );

    // Salva customer ID se non presente
    if (!profile.stripe_customer_id) {
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id);
    }

    // Ottieni Price ID
    const priceId = PLAN_TO_PRICE_ID[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Crea checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      user.id,
      `${request.nextUrl.origin}/dashboard?success=true`,
      `${request.nextUrl.origin}/dashboard?canceled=true`,
      {
        plan,
        email: profile.email || user.email || '',
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[STRIPE CHECKOUT] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
