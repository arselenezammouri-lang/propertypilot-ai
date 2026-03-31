import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { createCheckoutSession, getOrCreateCustomer, PLAN_TO_PRICE_ID } from '@/lib/stripe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const checkoutSchema = z.object({
  plan: z.enum(['STARTER', 'PRO', 'AGENCY']).optional(),
  planType: z.enum(['starter', 'pro', 'agency']).optional(),
}).refine(d => d.plan || d.planType, { message: 'plan or planType required' });

const VALID_PLANS = ['STARTER', 'PRO', 'AGENCY'] as const;

async function createSessionForPlan(request: NextRequest, plan: 'STARTER' | 'PRO' | 'AGENCY') {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { redirect: '/auth/login?redirect=' + encodeURIComponent(request.nextUrl.pathname + '?plan=' + plan) };
  }

  const email = user.email || '';
  const fullName = (user.user_metadata as any)?.full_name || undefined;

  const customer = await getOrCreateCustomer(user.id, email, fullName);
  const priceId = PLAN_TO_PRICE_ID[plan];
  if (!priceId) return { redirect: '/pricing' };
  const session = await createCheckoutSession(
    customer.id,
    priceId,
    user.id,
    `${request.nextUrl.origin}/dashboard?success=true`,
    `${request.nextUrl.origin}/dashboard?canceled=true`,
    { plan, email, paymentType: 'subscription' }
  );
  return { url: session.url };
}

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get('plan')?.toUpperCase();
  if (!plan || !VALID_PLANS.includes(plan as any)) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }
  const result = await createSessionForPlan(request, plan as 'STARTER' | 'PRO' | 'AGENCY');
  if ('redirect' in result && result.redirect) return NextResponse.redirect(new URL(result.redirect, request.url));
  return NextResponse.redirect(result.url!);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user } = auth;

    const body = await request.json();
    const parsed = checkoutSchema.parse(body);
    const planRaw = parsed.plan || (parsed.planType && parsed.planType.toUpperCase());
    if (!planRaw || !VALID_PLANS.includes(planRaw as any)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    const plan = planRaw as 'STARTER' | 'PRO' | 'AGENCY';

    const email = user.email || '';
    const fullName = (user.user_metadata as any)?.full_name || undefined;

    // Ottieni Price ID
    const priceId = PLAN_TO_PRICE_ID[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Ottieni o crea customer Stripe (non dipende più dalla tabella profiles)
    const customer = await getOrCreateCustomer(
      user.id,
      email,
      fullName
    );

    // Crea checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      user.id,
      `${request.nextUrl.origin}/dashboard?success=true`,
      `${request.nextUrl.origin}/dashboard?canceled=true`,
      {
        plan,
        email,
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
