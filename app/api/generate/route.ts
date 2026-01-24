import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { propertyInputSchema } from '@/lib/validations/property';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { 
  checkUserRateLimit, 
  checkIpRateLimit, 
  logGeneration, 
  incrementGenerationCount,
  getClientIp 
} from '@/lib/utils/rate-limit';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { createOpenAIWithTimeout, withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import OpenAI from 'openai';

const openai = createOpenAIWithTimeout(process.env.OPENAI_API_KEY!);

const aiCache = getAICacheService();

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

    // STEP 0: Check active subscription (CRITICAL SECURITY CHECK)
    const subscriptionCheck = await requireActiveSubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        { 
          error: subscriptionCheck.error || 'Abbonamento richiesto',
          message: subscriptionCheck.error || 'Questa funzionalità richiede un abbonamento attivo.'
        },
        { status: 403 }
      );
    }

    // STEP 1: Rate limiting - Check user limit (10/min)
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

    // STEP 1: Rate limiting - Check IP limit (20/min)
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

    const body = await request.json();
    
    const validatedInput = propertyInputSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const propertyData = validatedInput.data;

    // STEP 2: Get subscription with generations_count
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, generations_count')
      .eq('user_id', user.id)
      .single();

    const currentPlan = subscription?.status || 'free';
    const planLimits = STRIPE_PLANS[currentPlan as keyof typeof STRIPE_PLANS].limits;

    // STEP 2: Check monthly limit using generations_count instead of saved_listings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Use generations_count from subscription (reset monthly by webhook or cron job)
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

    // AI Listing Engine 2.0: Extract style and market with defaults
    const style = propertyData.style || 'standard';
    const market = propertyData.market || 'italy';

    const propertyDescription = buildPropertyDescription(propertyData);
    
    // Include style and market in cache key for proper cache differentiation
    const cacheKey = `${propertyDescription}|style:${style}|market:${market}`;
    const cachedResponse = await aiCache.get(cacheKey, 'generate_all');
    
    let generatedContent;
    let fromCache = false;

    if (cachedResponse) {
      console.log('[GENERATE] Using cached response');
      generatedContent = cachedResponse;
      fromCache = true;
    } else {
      console.log('[GENERATE] Generating new AI content', { style, market });
      const [professionalResponse, shortResponse, titlesResponse, englishResponse] = await Promise.all([
        generateProfessionalListing(propertyDescription, style, market),
        generateShortListing(propertyDescription, style, market),
        generateTitles(propertyDescription, style, market),
        generateEnglishTranslation(propertyDescription, style, market),
      ]);

      generatedContent = {
        professional: professionalResponse,
        short: shortResponse,
        titles: titlesResponse,
        english: englishResponse,
      };

      await aiCache.set(cacheKey, 'generate_all', generatedContent);
    }

    await logGeneration(user.id, clientIp);
    await incrementGenerationCount(user.id);

    return NextResponse.json({
      success: true,
      data: generatedContent,
      fromCache,
      usage: {
        current: currentUsage + 1,
        limit: planLimits.listingsPerMonth,
        remaining: planLimits.listingsPerMonth === -1 ? -1 : planLimits.listingsPerMonth - currentUsage - 1,
      },
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Quota OpenAI esaurita. Contatta il supporto.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Errore nella generazione. Riprova.' },
      { status: 500 }
    );
  }
}

function buildPropertyDescription(data: any): string {
  const parts: string[] = [];
  
  parts.push(`Tipo di immobile: ${data.propertyType}`);
  parts.push(`Località: ${data.location}`);
  
  if (data.size) {
    const unit = data.market === 'usa' ? 'sq ft' : 'mq';
    parts.push(`Superficie: ${data.size} ${unit}`);
  }
  if (data.rooms) parts.push(`Numero di locali: ${data.rooms}`);
  if (data.price) parts.push(`Prezzo: ${data.price}`);
  if (data.features) parts.push(`Caratteristiche: ${data.features}`);
  if (data.notes) parts.push(`Note aggiuntive: ${data.notes}`);
  
  return parts.join('\n');
}

// AI Listing Engine 2.0: Market-specific terminology dictionaries
function getMarketTerminology(market: 'usa' | 'italy'): {
  location: string;
  size: string;
  features: string;
  highEnd: string[];
  investment: string[];
  standard: string[];
} {
  if (market === 'usa') {
    return {
      location: 'prime location',
      size: 'square feet',
      features: 'features',
      highEnd: ['high-end finishes', 'smart home technology', 'master suite', 'walk-in closet', 'open concept', 'granite countertops', 'stainless steel appliances', 'hardwood floors', 'curb appeal'],
      investment: ['ROI', 'CAP rate', 'cash flow', 'appreciation potential', 'up-and-coming area', 'tax benefits', 'rental yield', 'capital gains'],
      standard: ['great location', 'move-in ready', 'well-maintained', 'spacious', 'bright', 'updated', 'convenient'],
    };
  } else {
    return {
      location: 'zona servitissima',
      size: 'metri quadri',
      features: 'caratteristiche',
      highEnd: ['finiture di pregio', 'domotica avanzata', 'classe energetica A', 'design contemporaneo', 'ampie finestre', 'terrazza panoramica', 'zona esclusiva'],
      investment: ['rendimento', 'ROI', 'zona in espansione', 'bonus fiscali', 'potenziale di rivalutazione', 'redditività', 'plusvalenza'],
      standard: ['zona ben collegata', 'ottimo rapporto qualità/prezzo', 'ristrutturato', 'luminoso', 'spazioso', 'pronto all\'uso'],
    };
  }
}

async function generateProfessionalListing(
  propertyDescription: string, 
  style: 'luxury' | 'investment' | 'standard',
  market: 'usa' | 'italy'
): Promise<string> {
  return withRetryAndTimeout(async () => {
    const terminology = getMarketTerminology(market);
    const language = market === 'usa' ? 'English' : 'Italian';
    
    let stylePrompt = '';
    if (style === 'luxury') {
      stylePrompt = market === 'usa'
        ? `LUXURY STYLE - Write with sophisticated, emotional language. Focus on:
- High-end finishes (granite, hardwood, premium materials)
- Smart home technology and automation
- Exclusive lifestyle and prestigious location
- Master suite, walk-in closets, designer details
- Curb appeal and architectural elegance
- Luxury amenities and premium features
Use terms: ${terminology.highEnd.join(', ')}`
        : `STILE LUXURY - Scrivi con linguaggio sofisticato ed emozionale. Focus su:
- Finiture di pregio (pavimenti pregiati, design contemporaneo)
- Domotica avanzata e tecnologia smart home
- Lifestyle esclusivo e zona prestigiosa
- Spazi ampi, ampie finestre, terrazze panoramiche
- Classe energetica alta e dettagli di design
- Caratteristiche premium ed esclusività
Usa termini: ${terminology.highEnd.join(', ')}`;
    } else if (style === 'investment') {
      stylePrompt = market === 'usa'
        ? `INVESTMENT STYLE - Write with data-focused, analytical language. Focus on:
- ROI (Return on Investment) and CAP rate
- Cash flow potential and rental yield
- Appreciation potential and growth area
- Tax benefits and investment advantages
- Up-and-coming neighborhood trends
- Numbers, percentages, and financial metrics
Use terms: ${terminology.investment.join(', ')}`
        : `STILE INVESTMENT - Scrivi con linguaggio orientato ai dati e analitico. Focus su:
- ROI (Rendimento dell'investimento) e rendimento
- Potenziale di redditività e cash flow
- Potenziale di rivalutazione e zona in crescita
- Bonus fiscali e vantaggi fiscali
- Trend della zona e sviluppo urbano
- Numeri, percentuali e metriche finanziarie
Usa termini: ${terminology.investment.join(', ')}`;
    } else {
      stylePrompt = market === 'usa'
        ? `STANDARD PRO STYLE - Write optimized for real estate portals (Zillow, Realtor.com, MLS). Focus on:
- High-traffic SEO keywords (location, property type, key features)
- Clear, professional language for maximum search visibility
- Move-in ready, well-maintained, great location
- Standard real estate terminology
- Portal-optimized format with key highlights
Use terms: ${terminology.standard.join(', ')}`
        : `STILE STANDARD PRO - Scrivi ottimizzato per portali immobiliari (Idealista, Immobiliare.it, Casa.it). Focus su:
- Keywords SEO ad alto traffico (località, tipo immobile, caratteristiche chiave)
- Linguaggio chiaro e professionale per massima visibilità
- Pronto all'uso, ristrutturato, zona servitissima
- Terminologia immobiliare standard
- Formato ottimizzato per portali con punti chiave
Usa termini: ${terminology.standard.join(', ')}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert real estate copywriter specializing in ${style.toUpperCase()} style listings for the ${market.toUpperCase()} market.

${stylePrompt}

GENERAL RULES:
- Write in professional ${language}
- Length: 150-200 words
- Use ${style === 'luxury' ? 'elegant and sophisticated' : style === 'investment' ? 'data-driven and analytical' : 'clear and professional'} tone
- Highlight property strengths
- Include SEO keywords naturally
- Use short, readable paragraphs
- Do not use emojis
- Do not invent details not provided`,
        },
        {
          role: 'user',
          content: `Write a ${style} style property listing based on this data:\n\n${propertyDescription}`,
        },
      ],
      temperature: style === 'luxury' ? 0.8 : style === 'investment' ? 0.6 : 0.7,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateShortListing(
  propertyDescription: string,
  style: 'luxury' | 'investment' | 'standard',
  market: 'usa' | 'italy'
): Promise<string> {
  return withRetryAndTimeout(async () => {
    const language = market === 'usa' ? 'English' : 'Italian';
    const portalExamples = market === 'usa' 
      ? 'portals like Zillow, Realtor.com, and MLS'
      : 'portali come Subito.it, Idealista e Immobiliare.it';
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in short real estate listings for ${portalExamples}.

RULES:
- Write in concise ${language}
- Maximum 50 words
- Capture attention immediately
- Use short, direct sentences
- Highlight only essential details
- Match the ${style} style tone
- Do not use emojis`,
        },
        {
          role: 'user',
          content: `Write a short listing (max 50 words) in ${style} style for:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateTitles(
  propertyDescription: string,
  style: 'luxury' | 'investment' | 'standard',
  market: 'usa' | 'italy'
): Promise<string[]> {
  return withRetryAndTimeout(async () => {
    const language = market === 'usa' ? 'English' : 'Italian';
    const terminology = getMarketTerminology(market);
    
    const styleGuidance = style === 'luxury'
      ? `Create sophisticated, aspirational titles that evoke exclusivity and premium lifestyle.`
      : style === 'investment'
      ? `Create data-driven titles that highlight ROI, location growth, and investment potential.`
      : `Create SEO-optimized titles with high-traffic keywords for maximum portal visibility.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in high-CTR (Click-Through Rate) real estate listing titles for A/B testing.

OBJECTIVE: Create 5 different titles optimized for maximum clicks on real estate portals.

${styleGuidance}

CRITICAL RULES FOR HIGH CTR:
- Write exactly 5 titles in ${language}
- Each title: 60-80 characters (optimal for portals)
- Always include location and property type
- Use numbers when possible (e.g., "3 bedrooms", "120 sq ft")
- Create curiosity without being misleading
- Each title must be unique and different from others
- Vary the angle: one focused on location, one on features, one on price/value, etc.
- Use relevant keywords from: ${[...terminology.highEnd, ...terminology.investment, ...terminology.standard].slice(0, 5).join(', ')}
- Format as numbered list (1. Title, 2. Title, etc.)
- Do not use emojis`,
        },
        {
          role: 'user',
          content: `Create 5 high-CTR titles (60-80 chars each) in ${style} style for A/B testing:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.9, // Higher temperature for more variety
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    const titles = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(title => title.length > 0 && title.length <= 100) // Safety check
      .slice(0, 5);

    // Ensure we have exactly 5 titles
    if (titles.length < 5) {
      const fallbackTitle = market === 'usa' 
        ? 'Premium Property for Sale'
        : 'Immobile in Vendita';
      while (titles.length < 5) {
        titles.push(`${fallbackTitle} ${titles.length + 1}`);
      }
    }

    return titles;
  });
}

async function generateEnglishTranslation(
  propertyDescription: string,
  style: 'luxury' | 'investment' | 'standard',
  market: 'usa' | 'italy'
): Promise<string> {
  return withRetryAndTimeout(async () => {
    // If market is USA, the listing is already in English context
    // If market is Italy, translate to English for international buyers
    const terminology = getMarketTerminology(market);
    
    const stylePrompt = style === 'luxury'
      ? `LUXURY STYLE: Use sophisticated, emotional language. Focus on high-end finishes, smart technology, exclusive lifestyle.`
      : style === 'investment'
      ? `INVESTMENT STYLE: Use data-driven language. Focus on ROI, CAP rate, cash flow, appreciation potential, tax benefits.`
      : `STANDARD PRO STYLE: Use SEO-optimized language for portals. Focus on location, key features, move-in ready.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional real estate copywriter specializing in English listings for international buyers.

${stylePrompt}

RULES:
- Write in professional English
- Length: 150-200 words
- Use ${style === 'luxury' ? 'elegant and sophisticated' : style === 'investment' ? 'analytical and data-focused' : 'clear and professional'} tone
- Highlight property strengths
- Include SEO keywords naturally
- Use appropriate terminology: ${market === 'usa' ? terminology.highEnd.slice(0, 3).join(', ') : 'Convert Italian terms to English equivalents'}
- Use short, readable paragraphs
- Don't use emojis
- Don't invent details not provided`,
        },
        {
          role: 'user',
          content: `Write a professional English property listing in ${style} style based on this property data:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  });
}
