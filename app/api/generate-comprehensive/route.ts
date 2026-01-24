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
import { formatErrorResponse, isOpenAIQuotaError } from '@/lib/errors/api-errors';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Authentication
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // STEP 2: Rate limiting - User (10/min)
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

    // STEP 3: Rate limiting - IP (20/min)
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

    // STEP 4: Parse input (ScrapedListing or PropertyInput)
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // STEP 5: Check subscription limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, generations_count')
      .eq('user_id', user.id)
      .single();

    const currentPlan = subscription?.status || 'free';
    const planLimits = STRIPE_PLANS[currentPlan as keyof typeof STRIPE_PLANS].limits;
    const currentUsage = subscription?.generations_count || 0;

    if (planLimits.listingsPerMonth !== -1 && currentUsage >= planLimits.listingsPerMonth) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached',
          message: `Hai raggiunto il limite mensile di ${planLimits.listingsPerMonth} generazioni. Aggiorna il tuo piano per continuare.`,
          currentPlan,
          usage: currentUsage,
          limit: planLimits.listingsPerMonth
        },
        { status: 403 }
      );
    }

    // STEP 6: Generate comprehensive AI content
    console.log('[COMPREHENSIVE AI] Starting generation...');
    const startTime = Date.now();
    
    const generatedContent = await generateComprehensiveContent(body);
    
    const duration = Date.now() - startTime;
    console.log('[COMPREHENSIVE AI] Generation completed in', duration, 'ms');

    // STEP 7: Log generation and increment counter
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

  } catch (error: any) {
    console.error('[COMPREHENSIVE AI API] Error:', error);
    
    // Check if it's an OpenAI quota error
    if (isOpenAIQuotaError(error)) {
      const formattedError = formatErrorResponse(error);
      return NextResponse.json(
        formattedError,
        { status: 503 }
      );
    }

    // Handle OpenAI rate limit
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Troppe richieste AI. Riprova tra qualche secondo.',
          suggestion: 'Attendi 10-15 secondi prima di riprovare.'
        },
        { status: 429 }
      );
    }

    // Generic error handling
    const formattedError = formatErrorResponse(error, 'Generazione AI');
    return NextResponse.json(
      formattedError,
      { status: 500 }
    );
  }
}
