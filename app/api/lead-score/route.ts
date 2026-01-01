import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { scoreRealEstateLead, LeadScoreResult } from '@/lib/ai/leadScoring';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { formatErrorResponse, isOpenAIQuotaError } from '@/lib/errors/api-errors';
import { getAICacheService } from '@/lib/cache/ai-cache';

const LEAD_SCORE_RATE_LIMIT_PER_MINUTE = 10;

const leadScoreRequestSchema = z.object({
  nomeLead: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  tempistiche: z.string().min(1, 'Le tempistiche sono obbligatorie').max(500),
  messaggioLead: z.string().min(20, 'Il messaggio deve contenere almeno 20 caratteri').max(5000),
  tipoImmobile: z.string().min(1, 'Il tipo di immobile è obbligatorio').max(200),
  mercato: z.enum(['italia', 'usa']).default('italia'),
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

    const { nomeLead, budget, tempistiche, messaggioLead, tipoImmobile, mercato } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
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
        console.log(`[LEAD SCORE API] Cache hit`);
        
        await logGeneration(user.id, clientIp);
        
        return NextResponse.json({
          success: true,
          data: cachedResult as LeadScoreResult,
          cached: true,
          processingTimeMs: Date.now() - startTime,
        });
      }
    } catch (cacheError) {
      console.warn('[LEAD SCORE API] Cache read error:', cacheError);
    }

    console.log(`[LEAD SCORE API] Analyzing lead for user ${user.id}`);
    console.log(`[LEAD SCORE API] Market: ${mercato}, Type: ${tipoImmobile}`);

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
      console.error('[LEAD SCORE API] AI generation error:', aiError);
      
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
      console.log(`[LEAD SCORE API] Cached result`);
    } catch (cacheError) {
      console.warn('[LEAD SCORE API] Cache write error:', cacheError);
    }

    await logGeneration(user.id, clientIp);

    const processingTimeMs = Date.now() - startTime;
    console.log(`[LEAD SCORE API] Successfully analyzed lead in ${processingTimeMs}ms`);

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
      processingTimeMs,
    });

  } catch (error: any) {
    console.error('[LEAD SCORE API] Unexpected error:', error);
    
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
