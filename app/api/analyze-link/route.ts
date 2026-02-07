import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ScraperFactory } from '@/lib/scrapers/factory';
import { ScrapedListing } from '@/lib/scrapers/types';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { createOpenAIWithTimeout, withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp } from '@/lib/utils/rate-limit';
import { z } from 'zod';
import { logger } from '@/lib/utils/safe-logger';

const openai = createOpenAIWithTimeout(process.env.OPENAI_API_KEY!);
const aiCache = getAICacheService();

const analyzeLinkSchema = z.object({
  url: z.string().url('URL non valido'),
});

export interface ListingAnalysis {
  qualityScore: number;
  strengths: string[];
  weaknesses: string[];
  seoAnalysis: {
    score: number;
    keywords: string[];
    suggestions: string[];
  };
  targetBuyer: string;
  improvements: string[];
  rewrittenListing: {
    professional: string;
    short: string;
    titles: string[];
  };
}

export interface AnalyzeLinkResponse {
  success: boolean;
  scrapedData?: ScrapedListing;
  analysis?: ListingAnalysis;
  error?: string;
  fromCache?: boolean;
  supportedDomains?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeLinkResponse>> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Devi effettuare il login per usare questa funzione' },
        { status: 401 }
      );
    }

    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: userRateLimit.message },
        { status: 429 }
      );
    }

    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          { success: false, error: ipRateLimit.message },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const validated = analyzeLinkSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Inserisci un URL valido' },
        { status: 400 }
      );
    }

    const { url } = validated.data;

    const scraper = ScraperFactory.getScraper(url);
    if (!scraper) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Portale non supportato. Usa: Immobiliare.it, Idealista.it, Casa.it, Subito.it o Zillow.com',
          supportedDomains: ScraperFactory.getSupportedDomains(),
        },
        { status: 400 }
      );
    }

    logger.debug('[ANALYZE-LINK] Scraping URL', { url });
    const scrapeResult = await scraper.scrape(url);

    if (!scrapeResult.success || !scrapeResult.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: scrapeResult.error || 'Impossibile estrarre i dati dall\'annuncio. Verifica che il link sia corretto.',
        },
        { status: 422 }
      );
    }

    const scrapedData = scrapeResult.data;
    logger.debug('[ANALYZE-LINK] Scraped data', {
      title: scrapedData.title,
      price: scrapedData.price,
      location: scrapedData.location,
    });

    const descriptionForCache = scrapedData.description_raw?.trim() || scrapedData.title || '';
    if (!descriptionForCache) {
      logger.error('[ANALYZE-LINK] No content available for analysis', new Error('No content'), { url });
      return NextResponse.json(
        { success: false, error: 'L\'annuncio non contiene abbastanza contenuto per l\'analisi.' },
        { status: 422 }
      );
    }
    
    const cacheKey = `${scrapedData.title}:${descriptionForCache.substring(0, 200)}`;
    const cachedAnalysis = await aiCache.get(cacheKey, 'analyze_listing');
    
    let analysis: ListingAnalysis;
    let fromCache = false;

    if (cachedAnalysis) {
      logger.debug('[ANALYZE-LINK] Using cached analysis');
      analysis = cachedAnalysis;
      fromCache = true;
    } else {
      logger.debug('[ANALYZE-LINK] Generating AI analysis');
      analysis = await generateListingAnalysis(scrapedData);
      await aiCache.set(cacheKey, 'analyze_listing', analysis);
    }

    return NextResponse.json({
      success: true,
      scrapedData,
      analysis,
      fromCache,
    });

  } catch (error: any) {
    logger.error('[ANALYZE-LINK] Error', error as Error, { component: 'analyze-link' });
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { success: false, error: 'Servizio temporaneamente non disponibile. Riprova più tardi.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Si è verificato un errore. Riprova.' },
      { status: 500 }
    );
  }
}

async function generateListingAnalysis(listing: ScrapedListing): Promise<ListingAnalysis> {
  const listingContext = buildListingContext(listing);

  const [qualityAnalysis, rewrittenContent] = await Promise.all([
    analyzeListingQuality(listingContext),
    generateRewrittenContent(listingContext),
  ]);

  return {
    ...qualityAnalysis,
    rewrittenListing: rewrittenContent,
  };
}

function buildListingContext(listing: ScrapedListing): string {
  const parts: string[] = [];
  
  parts.push(`TITOLO: ${listing.title}`);
  parts.push(`PREZZO: ${listing.price}`);
  parts.push(`LOCALITÀ: ${listing.location}`);
  if (listing.surface) parts.push(`SUPERFICIE: ${listing.surface}`);
  if (listing.rooms) parts.push(`LOCALI: ${listing.rooms}`);
  if (listing.propertyType) parts.push(`TIPO: ${listing.propertyType}`);
  if (listing.features.length > 0) parts.push(`CARATTERISTICHE: ${listing.features.join(', ')}`);
  parts.push(`\nDESCRIZIONE ORIGINALE:\n${listing.description_raw}`);
  
  return parts.join('\n');
}

interface QualityAnalysis {
  qualityScore: number;
  strengths: string[];
  weaknesses: string[];
  seoAnalysis: {
    score: number;
    keywords: string[];
    suggestions: string[];
  };
  targetBuyer: string;
  improvements: string[];
}

async function analyzeListingQuality(listingContext: string): Promise<QualityAnalysis> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto analista di annunci immobiliari italiani. Analizza l'annuncio fornito e restituisci un JSON con questa struttura esatta:

{
  "qualityScore": <numero da 0 a 100>,
  "strengths": ["punto forte 1", "punto forte 2", ...],
  "weaknesses": ["punto debole 1", "punto debole 2", ...],
  "seoAnalysis": {
    "score": <numero da 0 a 100>,
    "keywords": ["keyword1", "keyword2", ...],
    "suggestions": ["suggerimento SEO 1", "suggerimento SEO 2", ...]
  },
  "targetBuyer": "<descrizione del buyer ideale>",
  "improvements": ["miglioramento 1", "miglioramento 2", ...]
}

Criteri di valutazione:
- Qualità della descrizione (chiarezza, completezza, persuasività)
- Uso di keywords SEO rilevanti
- Struttura e formattazione
- Evidenziazione dei punti di forza
- Chiamata all'azione
- Errori grammaticali o di stile

Rispondi SOLO con il JSON, senza testo aggiuntivo.`,
        },
        {
          role: 'user',
          content: listingContext,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    try {
      const parsed = JSON.parse(content);
      return {
        qualityScore: parsed.qualityScore || 50,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        seoAnalysis: parsed.seoAnalysis || { score: 50, keywords: [], suggestions: [] },
        targetBuyer: parsed.targetBuyer || 'Non specificato',
        improvements: parsed.improvements || [],
      };
    } catch (e) {
      logger.error('[ANALYZE-LINK] Failed to parse quality analysis', e as Error);
      return {
        qualityScore: 50,
        strengths: ['Analisi non disponibile'],
        weaknesses: ['Analisi non disponibile'],
        seoAnalysis: { score: 50, keywords: [], suggestions: [] },
        targetBuyer: 'Non specificato',
        improvements: ['Riprova l\'analisi'],
      };
    }
  });
}

interface RewrittenContent {
  professional: string;
  short: string;
  titles: string[];
}

async function generateRewrittenContent(listingContext: string): Promise<RewrittenContent> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un copywriter immobiliare esperto. Basandoti sui dati dell'annuncio, crea contenuti ottimizzati. Restituisci un JSON con questa struttura:

{
  "professional": "<annuncio professionale 150-200 parole, SEO ottimizzato, persuasivo>",
  "short": "<versione breve max 50 parole per portali come Subito>",
  "titles": ["titolo 1", "titolo 2", "titolo 3", "titolo 4", "titolo 5"]
}

Regole:
- Italiano professionale e persuasivo
- Non inventare dettagli non presenti nei dati
- Evidenzia punti di forza
- Keywords SEO naturali
- Niente emoji
- 5 titoli diversi, max 8 parole ciascuno

Rispondi SOLO con il JSON.`,
        },
        {
          role: 'user',
          content: listingContext,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    try {
      const parsed = JSON.parse(content);
      return {
        professional: parsed.professional || 'Contenuto non disponibile',
        short: parsed.short || 'Contenuto non disponibile',
        titles: Array.isArray(parsed.titles) ? parsed.titles.slice(0, 5) : ['Titolo non disponibile'],
      };
    } catch (e) {
      logger.error('[ANALYZE-LINK] Failed to parse rewritten content', e as Error);
      return {
        professional: 'Contenuto non disponibile',
        short: 'Contenuto non disponibile',
        titles: ['Titolo non disponibile'],
      };
    }
  });
}
