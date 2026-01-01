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

    const propertyDescription = buildPropertyDescription(propertyData);

    const cachedResponse = await aiCache.get(propertyDescription, 'generate_all');
    
    let generatedContent;
    let fromCache = false;

    if (cachedResponse) {
      console.log('[GENERATE] Using cached response');
      generatedContent = cachedResponse;
      fromCache = true;
    } else {
      console.log('[GENERATE] Generating new AI content');
      const [professionalResponse, shortResponse, titlesResponse, englishResponse] = await Promise.all([
        generateProfessionalListing(propertyDescription),
        generateShortListing(propertyDescription),
        generateTitles(propertyDescription),
        generateEnglishTranslation(propertyDescription),
      ]);

      generatedContent = {
        professional: professionalResponse,
        short: shortResponse,
        titles: titlesResponse,
        english: englishResponse,
      };

      await aiCache.set(propertyDescription, 'generate_all', generatedContent);
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
  
  if (data.size) parts.push(`Superficie: ${data.size} mq`);
  if (data.rooms) parts.push(`Numero di locali: ${data.rooms}`);
  if (data.price) parts.push(`Prezzo: ${data.price}`);
  if (data.features) parts.push(`Caratteristiche: ${data.features}`);
  if (data.notes) parts.push(`Note aggiuntive: ${data.notes}`);
  
  return parts.join('\n');
}

async function generateProfessionalListing(propertyDescription: string): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto copywriter immobiliare italiano. Scrivi annunci professionali, persuasivi e ottimizzati per SEO.
        
Regole:
- Scrivi in italiano professionale
- Lunghezza: 150-200 parole
- Usa un tono elegante e persuasivo
- Evidenzia i punti di forza dell'immobile
- Includi keywords SEO naturalmente
- Usa paragrafi brevi e leggibili
- Non usare emoji
- Non inventare dettagli non forniti`,
        },
        {
          role: 'user',
          content: `Scrivi un annuncio immobiliare professionale basato su questi dati:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateShortListing(propertyDescription: string): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di annunci immobiliari brevi per portali come Subito.it e Idealista.
        
Regole:
- Scrivi in italiano conciso
- Massimo 50 parole
- Cattura l'attenzione immediatamente
- Usa frasi brevi e dirette
- Evidenzia solo i dettagli essenziali
- Non usare emoji`,
        },
        {
          role: 'user',
          content: `Scrivi un annuncio breve (max 50 parole) per:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateTitles(propertyDescription: string): Promise<string[]> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di titoli accattivanti per annunci immobiliari.
        
Regole:
- Scrivi 5 titoli diversi in italiano
- Massimo 8 parole per titolo
- Rendi ogni titolo unico e persuasivo
- Usa keywords rilevanti
- Non usare emoji
- Formatta come lista numerata (1. Titolo, 2. Titolo, etc.)`,
        },
        {
          role: 'user',
          content: `Crea 5 titoli accattivanti (max 8 parole ciascuno) per:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    const titles = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(title => title.length > 0)
      .slice(0, 5);

    return titles.length > 0 ? titles : ['Titolo non disponibile'];
  });
}

async function generateEnglishTranslation(propertyDescription: string): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional real estate copywriter specializing in English listings for international buyers.
        
Rules:
- Write in professional English
- Length: 150-200 words
- Use elegant and persuasive tone
- Highlight property strengths
- Include SEO keywords naturally
- Use short, readable paragraphs
- Don't use emojis
- Don't invent details not provided`,
        },
        {
          role: 'user',
          content: `Write a professional English property listing based on this Italian property data:\n\n${propertyDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  });
}
