import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ScraperFactory } from '@/lib/scrapers/factory';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { formatErrorResponse, ScraperBlockedError, isScraperBlockedError } from '@/lib/errors/api-errors';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

// Rate limiting for scraping: 10 requests per minute per user
const SCRAPER_RATE_LIMIT_PER_MINUTE = 10;

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
          message: userRateLimit.message || 'Troppi tentativi. Riprova tra 1 minuto.',
          resetAt: userRateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // STEP 3: Rate limiting - IP (20/min global protection)
    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'Troppi tentativi da questo indirizzo IP. Riprova tra 1 minuto.'
          },
          { status: 429 }
        );
      }
    }

    // STEP 4: Parse and validate input
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      
      // Only allow http/https
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: 'Invalid URL protocol. Only HTTP/HTTPS allowed.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // STEP 5: Check if domain is supported
    if (!ScraperFactory.isSupportedDomain(url)) {
      const supportedDomains = ScraperFactory.getSupportedDomains();
      return NextResponse.json(
        { 
          error: 'Unsupported domain',
          message: `Questo portale non è ancora supportato. Portali supportati: ${supportedDomains.join(', ')}`,
          supportedDomains
        },
        { status: 400 }
      );
    }

    // STEP 6: Get appropriate scraper
    const scraper = ScraperFactory.getScraper(url);
    if (!scraper) {
      return NextResponse.json(
        { error: 'Failed to initialize scraper' },
        { status: 500 }
      );
    }

    // STEP 7: Perform scraping
    logger.debug('[SCRAPER] Starting scrape for URL', { url });
    const startTime = Date.now();
    
    const result = await scraper.scrape(url);
    
    const duration = Date.now() - startTime;
    logger.debug('[SCRAPER] Scraping completed', { duration, url });

    // STEP 8: Handle scraping result
    if (!result.success || !result.data) {
      logger.error('[SCRAPER] Scraping failed', new Error(result.error || 'Unknown error'), { url });
      
      // Check if it's a 403 blocked error
      const errorString = result.error?.toLowerCase() || '';
      if (errorString.includes('403') || errorString.includes('forbidden')) {
        const portalName = new URL(url).hostname.replace('www.', '');
        const error = new ScraperBlockedError(portalName);
        
        return NextResponse.json(
          formatErrorResponse(error),
          { status: error.statusCode }
        );
      }
      
      // Translate technical error to user-friendly Italian
      let userMessage = 'Impossibile estrarre i dati dall\'annuncio. Verifica che l\'URL sia corretto.';
      if (errorString.includes('404') || errorString.includes('not found')) {
        userMessage = 'L\'annuncio non è stato trovato. Potrebbe essere stato rimosso o l\'URL non è corretto.';
      } else if (errorString.includes('timeout') || errorString.includes('timed out')) {
        userMessage = 'Il sito impiega troppo tempo a rispondere. Riprova tra qualche minuto.';
      }
      
      return NextResponse.json(
        { 
          error: 'Scraping failed',
          message: userMessage,
          suggestion: 'Prova con un URL diverso oppure usa la funzione "Inserisci Testo" per inserire manualmente i dati.',
          duration
        },
        { status: 500 }
      );
    }

    // STEP 9: Log scraping attempt for rate limiting
    await logGeneration(user.id, clientIp);

    // STEP 10: Return normalized JSON
    return NextResponse.json({
      success: true,
      data: result.data,
      meta: {
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
        duration,
      },
    });

  } catch (error: any) {
    logger.error('[SCRAPER API] Unexpected error', error as Error, { component: 'scrape-listing' });
    
    // Handle specific error types
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { 
          error: 'Request timeout',
          message: 'Il sito potrebbe essere temporaneamente non disponibile.',
          suggestion: 'Riprova tra qualche secondo oppure usa la funzione "Inserisci Testo".'
        },
        { status: 504 }
      );
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: 'Connection failed',
          message: 'Impossibile raggiungere il sito. Verifica che l\'URL sia corretto.',
          suggestion: 'Controlla l\'URL oppure usa la funzione "Inserisci Testo".'
        },
        { status: 503 }
      );
    }

    // Use centralized error formatting
    const formattedError = formatErrorResponse(error, 'Scraping');
    return NextResponse.json(
      formattedError,
      { status: 500 }
    );
  }
}
