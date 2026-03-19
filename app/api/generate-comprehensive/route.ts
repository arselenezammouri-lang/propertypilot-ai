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
import { apiWrapper } from '@/lib/utils/api-wrapper';
import { logger } from '@/lib/utils/safe-logger';
import { isFounderEmail } from '@/lib/utils/founder-access';

export const dynamic = 'force-dynamic';

export const POST = apiWrapper(
  async (request: NextRequest, { user, supabase, body }) => {
    const founderBypass = isFounderEmail(user.email);

    // STEP 1: Rate limiting - User (10/min)
    if (!founderBypass) {
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
    }

    // STEP 2: Rate limiting - IP (20/min)
    const clientIp = getClientIp(request);
    if (clientIp && !founderBypass) {
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

    if (founderBypass) {
      return NextResponse.json({
        success: true,
        data: buildFounderFastGeneratedContent(body as Record<string, unknown>),
        meta: {
          duration: 0,
          generatedAt: new Date().toISOString(),
          founder_override: true,
        },
      });
    }

    // STEP 4: Check subscription limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, generations_count')
      .eq('user_id', user.id)
      .single();

    const currentPlan = subscription?.status || 'free';
    const planLimits = STRIPE_PLANS[currentPlan as keyof typeof STRIPE_PLANS].limits;
    const currentUsage = subscription?.generations_count || 0;

    if (!founderBypass && planLimits.listingsPerMonth !== -1 && currentUsage >= planLimits.listingsPerMonth) {
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
    if (!founderBypass) {
      await logGeneration(user.id, clientIp);
      await incrementGenerationCount(user.id);
    }

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
    requireSubscription: true,
  }
);

function buildFounderFastGeneratedContent(payload: Record<string, unknown>) {
  const title = typeof payload.title === 'string' && payload.title.trim()
    ? payload.title.trim()
    : 'Annuncio Premium';
  const location = typeof payload.location === 'string' && payload.location.trim()
    ? payload.location.trim()
    : 'zona strategica';
  const price = typeof payload.price === 'string' && payload.price.trim()
    ? payload.price.trim()
    : 'prezzo su richiesta';
  const features = Array.isArray(payload.features)
    ? payload.features.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const featureText = features.slice(0, 4).join(', ') || 'spazi ottimizzati, luce naturale, finiture curate';

  return {
    professional: `${title} in ${location}. Soluzione immobiliare ad alto potenziale con ${featureText}. Prezzo: ${price}. Ideale per chi cerca valore reale, tempi rapidi e presentazione premium.`,
    short: `${title} a ${location}, ${price}. ${featureText}.`,
    emotional: `Apri la porta, respira luce e immagina la tua prossima firma. ${title} a ${location}: ambienti che convertono visite in offerte.`,
    titles: [
      `${title}: opportunità in ${location}`,
      `${location} | proposta premium pronta vendita`,
      `Immobile strategico: ${title}`,
      `${title} con alto potenziale commerciale`,
      `${location}: annuncio ad alta conversione`,
    ],
    videoScript: `Scena 1: esterno e quartiere (${location}). Scena 2: interni principali con focus su ${featureText}. Scena 3: call to action finale con prezzo ${price} e invito a visita immediata.`,
    emailFollowUp: `Oggetto: ${title} – disponibilità visita\n\nCiao, ti confermo disponibilità per ${title} in ${location}. Punti chiave: ${featureText}. Prezzo: ${price}. Possiamo fissare una visita già nelle prossime 24 ore.`,
    strengths: ['Presentazione immediata', 'Copy orientato alla conversione', 'Messaggio chiaro per buyer qualificati'],
    weaknesses: ['Richiede verifica documentale completa', 'Da personalizzare con media proprietari'],
    homeStaging: ['Ingresso luminoso', 'Decluttering completo', 'Palette neutra', 'Focus su punti luce', 'Set fotografico ready'],
    portalDescription: `${title} in ${location}, ${price}. Caratteristiche principali: ${featureText}. Contattaci per visita e documentazione completa.`,
  };
}
