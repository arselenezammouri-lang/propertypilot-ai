import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { scoreRealEstateLead, LeadScoreResult } from '@/lib/ai/leadScoring';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { formatErrorResponse, isOpenAIQuotaError } from '@/lib/errors/api-errors';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const LEAD_SCORE_RATE_LIMIT_PER_MINUTE = 10;

const leadScoreRequestSchema = z.object({
  nomeLead: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  tempistiche: z.string().min(1, 'Le tempistiche sono obbligatorie').max(500),
  messaggioLead: z.string().min(20, 'Il messaggio deve contenere almeno 20 caratteri').max(5000),
  tipoImmobile: z.string().min(1, 'Il tipo di immobile è obbligatorio').max(200),
  mercato: z.enum(['italia', 'usa']).default('italia'),
  lead_id: z.string().uuid('ID lead non valido').optional(), // Opzionale: se presente, aggiorna il database
});

export type LeadScoreRequest = z.infer<typeof leadScoreRequestSchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const validationResult = leadScoreRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { nomeLead, budget, tempistiche, messaggioLead, tipoImmobile, mercato, lead_id } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // STEP 0: Check PRO or AGENCY subscription (CRITICAL SECURITY CHECK)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Il Lead Scoring AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare la priorità automatica dei lead.'
        },
        { status: 403 }
      );
    }

    const clientIp = getClientIp(request);

    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      const retryAfter = userRateLimit.resetAt 
        ? Math.ceil((userRateLimit.resetAt.getTime() - Date.now()) / 1000)
        : 60;
      
      return NextResponse.json(
        {
          success: false,
          error: userRateLimit.message || `Limite di ${LEAD_SCORE_RATE_LIMIT_PER_MINUTE} analisi al minuto raggiunto.`,
          retryAfter,
        },
        { status: 429 }
      );
    }

    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: ipRateLimit.message || 'Troppe richieste da questo IP.',
            retryAfter: 60,
          },
          { status: 429 }
        );
      }
    }

    const cacheContent = `${mercato}:${messaggioLead.substring(0, 200)}:${tipoImmobile}:${tempistiche}`;
    const cachePromptType = 'lead_score';
    
    try {
      const cacheService = getAICacheService();
      const cachedResult = await cacheService.get(cacheContent, cachePromptType);
      
      if (cachedResult) {
        logger.debug('[LEAD SCORE API] Cache hit', { userId: user.id });
        
        await logGeneration(user.id, clientIp);
        
        // AUTO-UPDATE DATABASE: Anche per i risultati in cache, aggiorna il database se lead_id è presente
        if (lead_id) {
          try {
            const cachedResultData = cachedResult as LeadScoreResult;
            const { error: updateError } = await supabase
              .from('leads')
              .update({ 
                lead_score: cachedResultData.leadScore,
                updated_at: new Date().toISOString(),
              })
              .eq('id', lead_id)
              .eq('user_id', user.id);

            if (!updateError) {
              logger.info('[LEAD SCORE API] Automatically updated lead with cached score', {
                leadId: lead_id,
                score: cachedResultData.leadScore,
              });
            }
          } catch (dbError) {
            logger.error('[LEAD SCORE API] Database update error (cached)', dbError);
          }
        }
        
        return NextResponse.json({
          success: true,
          data: cachedResult as LeadScoreResult,
          cached: true,
          processingTimeMs: Date.now() - startTime,
          databaseUpdated: !!lead_id,
        });
      }
    } catch (cacheError) {
      logger.warn('[LEAD SCORE API] Cache read error', { error: cacheError });
    }

    logger.debug('[LEAD SCORE API] Analyzing lead', {
      market: mercato,
      propertyType: tipoImmobile,
    });

    let result: LeadScoreResult;

    try {
      result = await scoreRealEstateLead({
        nomeLead,
        budget,
        tempistiche,
        messaggioLead,
        tipoImmobile,
        mercato,
      });
    } catch (aiError: any) {
      logger.error('[LEAD SCORE API] AI generation error', aiError);
      
      if (isOpenAIQuotaError(aiError)) {
        return NextResponse.json(
          formatErrorResponse(aiError),
          { status: 503 }
        );
      }

      if (aiError.message?.includes('timeout') || aiError.code === 'ETIMEDOUT') {
        return NextResponse.json(
          {
            success: false,
            error: 'L\'analisi sta impiegando troppo tempo. Riprova tra qualche secondo.',
            suggestion: 'Il servizio AI è temporaneamente sovraccarico.',
          },
          { status: 504 }
        );
      }

      throw aiError;
    }

    try {
      const cacheService = getAICacheService();
      await cacheService.set(cacheContent, cachePromptType, result, 24 * 60 * 60);
      logger.debug('[LEAD SCORE API] Cached result');
    } catch (cacheError) {
      logger.warn('[LEAD SCORE API] Cache write error', { error: cacheError });
    }

    await logGeneration(user.id, clientIp);

    // AUTO-UPDATE DATABASE: Se lead_id è presente, aggiorna il database automaticamente
    if (lead_id) {
      try {
        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            lead_score: result.leadScore,
            // Nota: Il campo 'categoria' non esiste ancora nella tabella leads.
            // Per ora aggiorniamo solo lead_score. Il campo categoria può essere aggiunto in seguito.
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead_id)
          .eq('user_id', user.id); // Sicurezza: verifica che il lead appartenga all'utente

        if (updateError) {
          logger.error('[LEAD SCORE API] Error updating lead in database', updateError);
          // Non blocchiamo la risposta, lo score è stato calcolato correttamente
        } else {
          logger.info('[LEAD SCORE API] Automatically updated lead with score', {
            leadId: lead_id,
            score: result.leadScore,
          });
        }
      } catch (dbError) {
        logger.error('[LEAD SCORE API] Database update error', dbError);
        // Non blocchiamo la risposta, lo score è stato calcolato correttamente
      }
    }

    const processingTimeMs = Date.now() - startTime;
    logger.info('[LEAD SCORE API] Successfully analyzed lead', {
      processingTimeMs,
    });

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
      processingTimeMs,
      databaseUpdated: !!lead_id,
    });

  } catch (error: any) {
    logger.error('[LEAD SCORE API] Unexpected error', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Errore durante l\'analisi del lead. Riprova più tardi.',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
