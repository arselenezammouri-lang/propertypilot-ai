import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { ScraperFactory } from '@/lib/scrapers/factory';
import { auditListing, AuditOptions, AuditResult } from '@/lib/ai/auditListing';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { formatErrorResponse, isOpenAIQuotaError, ScraperBlockedError } from '@/lib/errors/api-errors';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const AUDIT_RATE_LIMIT_PER_MINUTE = 10;

const auditRequestSchema = z.object({
  text: z.string().min(50, 'Il testo deve contenere almeno 50 caratteri').max(50000).optional(),
  url: z.string().url('URL non valido').optional(),
  imageUrl: z.string().url('URL immagine non valido').optional(),
  mercato: z.enum(['italia', 'usa']).default('italia'),
  obiettivo: z.enum(['seo', 'vendita', 'luxury', 'social']).default('vendita'),
}).refine(
  (data) => data.text || data.url,
  { message: 'Devi fornire il testo dell\'annuncio o un URL' }
).refine(
  (data) => !(data.text && data.url),
  { message: 'Fornisci solo testo O URL, non entrambi' }
);

export type AuditRequest = z.infer<typeof auditRequestSchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const validationResult = auditRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { text, url, imageUrl, mercato, obiettivo } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Check PRO or AGENCY subscription (Audit Immobiliare AI is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'L\'Audit Immobiliare AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
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
          error: userRateLimit.message || `Limite di ${AUDIT_RATE_LIMIT_PER_MINUTE} analisi al minuto raggiunto.`,
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

    let listingText = '';
    let sourceUrl: string | null = null;

    if (url) {
      logger.debug('[AUDIT API] Processing URL', { url });
      
      try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          return NextResponse.json(
            { success: false, error: 'Solo URL HTTP/HTTPS sono supportati' },
            { status: 400 }
          );
        }
      } catch (e) {
        return NextResponse.json(
          { success: false, error: 'Formato URL non valido' },
          { status: 400 }
        );
      }

      try {
        const scraper = ScraperFactory.getScraper(url);
        
        if (!scraper) {
          const supportedDomains = ScraperFactory.getSupportedDomains();
          return NextResponse.json(
            { 
              success: false, 
              error: `Questo portale non è ancora supportato. Portali supportati: ${supportedDomains.join(', ')}` 
            },
            { status: 400 }
          );
        }
        
        const scrapedResult = await scraper.scrape(url);

        if (!scrapedResult.success || !scrapedResult.data) {
          return NextResponse.json(
            { 
              success: false, 
              error: scrapedResult.error || 'Impossibile estrarre contenuto dall\'URL' 
            },
            { status: 400 }
          );
        }

        const data = scrapedResult.data;
        listingText = `${data.title}\n\n`;
        
        if (data.price) listingText += `Prezzo: ${data.price}\n`;
        if (data.location) listingText += `Località: ${data.location}\n`;
        if (data.surface) listingText += `Superficie: ${data.surface}\n`;
        if (data.rooms) listingText += `Locali: ${data.rooms}\n`;
        if (data.features && data.features.length > 0) {
          listingText += `Caratteristiche: ${data.features.join(', ')}\n`;
        }
        
        listingText += `\n${data.description_raw || ''}`;
        sourceUrl = url;

        logger.debug('[AUDIT API] Successfully extracted content from URL', { length: listingText.length });
      } catch (error: any) {
        logger.error('[AUDIT API] Scraping error', error as Error, { url });
        
        const errorString = error.message?.toLowerCase() || '';
        if (errorString.includes('403') || errorString.includes('forbidden')) {
          const portalName = new URL(url).hostname.replace('www.', '');
          const scraperError = new ScraperBlockedError(portalName);
          
          return NextResponse.json(
            {
              success: false,
              ...formatErrorResponse(scraperError)
            },
            { status: scraperError.statusCode }
          );
        }
        
        return NextResponse.json(
          { 
            success: false, 
            error: error.message || 'Errore durante l\'estrazione del contenuto dall\'URL',
            suggestion: 'Prova a usare la funzione "Inserisci Testo" invece dell\'URL.'
          },
          { status: 500 }
        );
      }
    } else {
      listingText = text!.trim();
      logger.debug('[AUDIT API] Processing direct text input', { length: listingText.length });
    }

    if (listingText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Il testo dell\'annuncio deve contenere almeno 50 caratteri' },
        { status: 400 }
      );
    }

    const cacheService = getAICacheService();
    const cacheKey = `${listingText.substring(0, 200)}_${mercato}_${obiettivo}`;
    const cachePromptType = 'audit_listing_v2';

    try {
      const cachedResult = await cacheService.get(cacheKey, cachePromptType);
      if (cachedResult) {
        logger.debug('[AUDIT API] Cache HIT - returning cached result');
        
        const duration = Date.now() - startTime;
        return NextResponse.json({
          success: true,
          data: cachedResult as AuditResult,
          meta: {
            sourceUrl,
            imageUrl,
            mercato,
            obiettivo,
            analyzedAt: new Date().toISOString(),
            duration,
            textLength: listingText.length,
            cached: true,
          },
        });
      }
    } catch (cacheError) {
      logger.warn('[AUDIT API] Cache read error', { error: cacheError });
    }

    logger.debug('[AUDIT API] Starting AI audit analysis', { mercato, obiettivo });
    
    const auditOptions: AuditOptions = {
      mercato,
      obiettivo,
      imageUrl,
    };
    
    const auditResult = await auditListing(listingText, auditOptions);
    
    const duration = Date.now() - startTime;
    logger.debug('[AUDIT API] Audit completed successfully', { duration });

    try {
      await cacheService.set(cacheKey, cachePromptType, auditResult, 24 * 60 * 60);
      logger.debug('[AUDIT API] Result cached for 24h');
    } catch (cacheError) {
      logger.warn('[AUDIT API] Cache write error', { error: cacheError });
    }

    await logGeneration(user.id, clientIp);

    return NextResponse.json({
      success: true,
      data: auditResult,
      meta: {
        sourceUrl,
        imageUrl,
        mercato,
        obiettivo,
        analyzedAt: new Date().toISOString(),
        duration,
        textLength: listingText.length,
        cached: false,
      },
    });

  } catch (error: any) {
    logger.error('[AUDIT API] Unexpected error', error as Error, { component: 'audit-listing' });
    
    if (isOpenAIQuotaError(error)) {
      const formattedError = formatErrorResponse(error);
      return NextResponse.json(
        { 
          success: false,
          ...formattedError
        },
        { status: 503 }
      );
    }
    
    const formattedError = formatErrorResponse(error, 'Analisi AI');
    return NextResponse.json(
      { 
        success: false,
        ...formattedError
      },
      { status: 500 }
    );
  }
}
