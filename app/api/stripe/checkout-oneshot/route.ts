import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe, getOneTimePackage, STRIPE_ONE_TIME_PACKAGES } from '@/lib/stripe/config';
import { logger } from '@/lib/utils/safe-logger';

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

    const { packageId } = await request.json();

    const selectedPackage = getOneTimePackage(packageId);
    
    if (!packageId || !selectedPackage) {
      return NextResponse.json(
        { 
          error: 'Invalid package ID',
          validPackages: ['boost']
        },
        { status: 400 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = subscription?.stripe_customer_id;

    const stripe = requireStripe();

    if (!customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          status: 'free',
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        logger.error('Failed to update subscription with customer ID', upsertError, { userId: user.id });
      }
    }

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/dashboard?boost=success`;
    const cancelUrl = `${origin}/dashboard/billing?canceled=true`;

    const hasPriceId = selectedPackage.priceId;
    
    const lineItems = hasPriceId 
      ? [{ price: selectedPackage.priceId as string, quantity: 1 }]
      : [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.tagline,
            },
            unit_amount: selectedPackage.price * 100,
          },
          quantity: 1,
        }];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price.toString(),
        paymentType: 'one_shot',
      },
      invoice_creation: {
        enabled: true,
      },
    });

    logger.debug('[CHECKOUT ONE-SHOT] Session created', {
      sessionId: session.id,
      userId: user.id,
      packageId: selectedPackage.id,
      amount: selectedPackage.price,
    });

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      package: {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
      }
    });
  } catch (error) {
    logger.error('Stripe one-shot checkout error', error as Error, { component: 'checkout-oneshot' });
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const pkg = request.nextUrl.searchParams.get('package');
  if (pkg && (pkg === 'boost' || pkg === 'agency_boost')) {
    const result = await createOneShotSession(request, pkg);
    if ('redirect' in result) return NextResponse.redirect(new URL(result.redirect, request.url));
    if (result.url) return NextResponse.redirect(result.url);
  }
  const packages = [{
    id: STRIPE_ONE_TIME_PACKAGES.boost.id,
    name: STRIPE_ONE_TIME_PACKAGES.boost.name,
    price: STRIPE_ONE_TIME_PACKAGES.boost.price,
    tagline: STRIPE_ONE_TIME_PACKAGES.boost.tagline,
    features: STRIPE_ONE_TIME_PACKAGES.boost.features,
  }];
  return NextResponse.json({ packages });
}

async function createOneShotSession(request: NextRequest, packageId: string): Promise<{ url?: string; redirect?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { redirect: '/auth/login?redirect=' + encodeURIComponent('/api/stripe/checkout-oneshot?package=' + packageId) };
    const selectedPackage = getOneTimePackage(packageId);
    if (!selectedPackage) return { redirect: '/pricing' };
    const { data: subscription } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    let customerId = subscription?.stripe_customer_id;
    const stripe = requireStripe();
    if (!customerId) {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      const customer = await stripe.customers.create({ email: user.email, name: profile?.full_name, metadata: { userId: user.id } });
      customerId = customer.id;
      await supabase.from('subscriptions').upsert({ user_id: user.id, stripe_customer_id: customerId, status: 'free' }, { onConflict: 'user_id' });
    }
    const origin = request.nextUrl.origin;
    const lineItems = selectedPackage.priceId
      ? [{ price: selectedPackage.priceId, quantity: 1 }]
      : [{ price_data: { currency: 'eur', product_data: { name: selectedPackage.name, description: selectedPackage.tagline }, unit_amount: selectedPackage.price * 100 }, quantity: 1 }];
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${origin}/dashboard?boost=success`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: { userId: user.id, packageId: selectedPackage.id, packageName: selectedPackage.name, packagePrice: String(selectedPackage.price), paymentType: 'one_shot' },
      invoice_creation: { enabled: true },
    });
    return { url: session.url ?? undefined };
  } catch {
    return { redirect: '/pricing' };
  }
}
