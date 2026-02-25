import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, getOrCreateCustomer, PLAN_TO_PRICE_ID } from '@/lib/stripe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const checkoutSchema = z.object({
  plan: z.enum(['STARTER', 'PRO', 'AGENCY']),
});

const VALID_PLANS = ['STARTER', 'PRO', 'AGENCY'] as const;

async function createSessionForPlan(request: NextRequest, plan: 'STARTER' | 'PRO' | 'AGENCY') {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { redirect: '/auth/login?redirect=' + encodeURIComponent(request.nextUrl.pathname + '?plan=' + plan) };
  const { data: profile } = await supabase.from('profiles').select('email, full_name, stripe_customer_id').eq('id', user.id).single();
  if (!profile) return { redirect: '/auth/signup?plan=' + plan };
  const customer = await getOrCreateCustomer(user.id, profile.email || user.email || '', profile.full_name || undefined);
  if (!profile.stripe_customer_id) {
    await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id);
  }
  const priceId = PLAN_TO_PRICE_ID[plan];
  if (!priceId) return { redirect: '/pricing' };
  const session = await createCheckoutSession(
    customer.id,
    priceId,
    user.id,
    `${request.nextUrl.origin}/dashboard?success=true`,
    `${request.nextUrl.origin}/dashboard?canceled=true`,
    { plan, email: profile.email || user.email || '', paymentType: 'subscription' }
  );
  return { url: session.url };
}

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get('plan')?.toUpperCase();
  if (!plan || !VALID_PLANS.includes(plan as any)) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }
  const result = await createSessionForPlan(request, plan as 'STARTER' | 'PRO' | 'AGENCY');
  if ('redirect' in result) return NextResponse.redirect(new URL(result.redirect, request.url));
  return NextResponse.redirect(result.url!);
}

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
        paymentType: 'subscription',
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    const { logger } = await import('@/lib/utils/safe-logger');
    logger.error('[STRIPE CHECKOUT] Error', error as Error, { component: 'stripe-checkout' });
    
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
