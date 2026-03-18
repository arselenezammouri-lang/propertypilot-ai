import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateComprehensiveContent } from '@/lib/ai/generateListingContent';
import { 
  checkUserRateLimit, 
  checkIpRateLimit, 
  logGeneration, 
  incrementGenerationCount,
  getClientIp 
} from '@/lib/utils/rate-limit';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { repairMissingStripeSubscription } from '@/lib/utils/subscription-sync';
import { formatErrorResponse, isOpenAIQuotaError } from '@/lib/errors/api-errors';
import { apiWrapper } from '@/lib/utils/api-wrapper';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

export const POST = apiWrapper(
  async (request: NextRequest, { user, supabase, body }) => {
    // STEP 1: Rate limiting - User (10/min)
    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: userRateLimit.message,
          resetAt: userRateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // STEP 2: Rate limiting - IP (20/min)
    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: ipRateLimit.message
          },
          { status: 429 }
        );
      }
    }

    // STEP 3: Parse input (ScrapedListing or PropertyInput)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // STEP 4: Check subscription limits
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('status, generations_count, stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      logger.warn('[COMPREHENSIVE AI] Subscription fetch failed, fallback to FREE', {
        userId: user.id,
        errorCode: subscriptionError.code,
        errorMessage: subscriptionError.message,
      });
    }

    const subscription = subscriptionData ?? {
      status: 'free',
      generations_count: 0,
      stripe_subscription_id: null,
      stripe_customer_id: null,
    };

    let currentPlan = subscription?.status || 'free';
    if (
      (currentPlan === 'starter' || currentPlan === 'pro' || currentPlan === 'agency') &&
      !subscription?.stripe_subscription_id
    ) {
      const repair = await repairMissingStripeSubscription({
        userId: user.id,
        currentStatus: currentPlan,
        stripeCustomerId: subscription?.stripe_customer_id ?? null,
        supabase,
      });
      currentPlan = repair.repaired ? repair.status : 'free';
    }

    const planLimits = STRIPE_PLANS[currentPlan as keyof typeof STRIPE_PLANS]?.limits;
    const monthlyLimit = planLimits?.listingsPerMonth ?? 5;
    const currentUsage = subscription?.generations_count || 0;

    if (monthlyLimit !== -1 && currentUsage >= monthlyLimit) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached',
          message: `Hai raggiunto il limite mensile di ${monthlyLimit} generazioni. Aggiorna il tuo piano per continuare.`,
          currentPlan,
          usage: currentUsage,
          limit: monthlyLimit
        },
        { status: 403 }
      );
    }

    // STEP 5: Generate comprehensive AI content
    const startTime = Date.now();
    logger.debug('[COMPREHENSIVE AI] Starting generation...', {
      userId: user.id,
    });
    
    const generatedContent = await generateComprehensiveContent(body);
    
    const duration = Date.now() - startTime;
    logger.info('[COMPREHENSIVE AI] Generation completed', {
      durationMs: duration,
      userId: user.id,
    });

    // STEP 6: Log generation and increment counter
    await logGeneration(user.id, clientIp);
    await incrementGenerationCount(user.id);

    return NextResponse.json({
      success: true,
      data: generatedContent,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
      },
    });
  },
  {
    method: 'POST',
    // FREE plan includes AI Generation (5 listings/month).
    requireSubscription: false,
  }
);
