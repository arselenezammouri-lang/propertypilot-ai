import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';

const requestSchema = z.object({
  nomeAgente: z.string().min(2, 'Inserisci il nome dell\'agente').max(100),
  nomeAgenzia: z.string().min(2, 'Inserisci il nome dell\'agenzia').max(150),
  anniEsperienza: z.coerce.number().min(0).max(50),
  specializzazioni: z.string().min(5, 'Descrivi almeno una specializzazione').max(500),
  zonaOperativa: z.string().min(2, 'Inserisci la zona operativa').max(200),
  certificazioniPremi: z.string().max(500).optional(),
  tono: z.enum(['professionale', 'amichevole', 'luxury']),
  mercato: z.enum(['italia', 'usa', 'internazionale']).optional().default('italia'),
});

type RequestData = z.infer<typeof requestSchema>;

interface BioVariant {
  fraseApertura: string;
  bio: string;
  skillsPuntiForza: string[];
  approccioVendita: string;
  cta: string;
  seoVersion?: string;
}

interface AgentBioResult {
  professionale: BioVariant;
  emotiva: BioVariant;
  luxury: BioVariant;
  social: BioVariant;
  website: BioVariant;
  consiglioPersonalBranding: string;
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  professionale: 'tono formale, autorevole, focus su competenze e risultati',
  amichevole: 'tono caldo, accessibile, empatico, orientato alla relazione',
  luxury: 'tono esclusivo, sofisticato, discreto, per clientela high-net-worth',
};

const MARKET_ADAPTATIONS: Record<string, string> = {
  italia: 'mercato italiano, riferimenti locali, mentalità italiana sull\'acquisto immobiliare, valori familiari',
  usa: 'American real estate market, investment mindset, neighborhood focus, lifestyle emphasis, English phrasing adapted to Italian agent',
  internazionale: 'approccio internazionale, multilingue, clientela globale, investimenti cross-border',
};

async function generateProfessionale(openai: OpenAI, data: RequestData): Promise<BioVariant> {
  const prompt = `Sei un esperto di personal branding per agenti immobiliari. Genera una BIO PROFESSIONALE PREMIUM per:

AGENTE: ${data.nomeAgente}
AGENZIA: ${data.nomeAgenzia}
ESPERIENZA: ${data.anniEsperienza} anni
SPECIALIZZAZIONI: ${data.specializzazioni}
ZONA OPERATIVA: ${data.zonaOperativa}
${data.certificazioniPremi ? `CERTIFICAZIONI/PREMI: ${data.certificazioniPremi}` : ''}
MERCATO: ${MARKET_ADAPTATIONS[data.mercato || 'italia']}

GENERA una BIO PROFESSIONALE PREMIUM con:
1. FRASE DI APERTURA: Una frase d'impatto che cattura l'attenzione (max 15 parole)
2. BIO: 100-150 parole, tono autorevole, focus su competenze, risultati, professionalità
3. SKILLS E PUNTI DI FORZA: 5 competenze chiave con breve descrizione
4. APPROCCIO DI VENDITA: Come l'agente aiuta i clienti (50 parole)
5. CTA: Call-to-action professionale per contatto

Rispondi SOLO in JSON valido:
{
  "fraseApertura": "...",
  "bio": "...",
  "skillsPuntiForza": ["...", "...", "...", "...", "..."],
  "approccioVendita": "...",
  "cta": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateEmotiva(openai: OpenAI, data: RequestData): Promise<BioVariant> {
  const prompt = `Sei un esperto di storytelling per agenti immobiliari. Genera una BIO EMOTIVA E COINVOLGENTE per:

AGENTE: ${data.nomeAgente}
AGENZIA: ${data.nomeAgenzia}
ESPERIENZA: ${data.anniEsperienza} anni
SPECIALIZZAZIONI: ${data.specializzazioni}
ZONA OPERATIVA: ${data.zonaOperativa}
${data.certificazioniPremi ? `CERTIFICAZIONI/PREMI: ${data.certificazioniPremi}` : ''}
MERCATO: ${MARKET_ADAPTATIONS[data.mercato || 'italia']}

GENERA una BIO EMOTIVA E COINVOLGENTE con:
1. FRASE DI APERTURA: Una frase empatica che crea connessione (max 15 parole)
2. BIO: 100-150 parole, storytelling, passione per il lavoro, focus sulle persone
3. SKILLS E PUNTI DI FORZA: 5 qualità umane e professionali
4. APPROCCIO DI VENDITA: Come accompagna i clienti nel loro percorso (50 parole)
5. CTA: Call-to-action calorosa e invitante

Rispondi SOLO in JSON valido:
{
  "fraseApertura": "...",
  "bio": "...",
  "skillsPuntiForza": ["...", "...", "...", "...", "..."],
  "approccioVendita": "...",
  "cta": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateLuxury(openai: OpenAI, data: RequestData): Promise<BioVariant> {
  const prompt = `Sei un esperto di luxury branding per agenti immobiliari di alto profilo. Genera una BIO LUXURY per:

AGENTE: ${data.nomeAgente}
AGENZIA: ${data.nomeAgenzia}
ESPERIENZA: ${data.anniEsperienza} anni
SPECIALIZZAZIONI: ${data.specializzazioni}
ZONA OPERATIVA: ${data.zonaOperativa}
${data.certificazioniPremi ? `CERTIFICAZIONI/PREMI: ${data.certificazioniPremi}` : ''}
MERCATO: ${MARKET_ADAPTATIONS[data.mercato || 'italia']}

GENERA una BIO LUXURY per clientela HNWI (High Net Worth Individuals) con:
1. FRASE DI APERTURA: Una frase sofisticata che trasmette esclusività (max 15 parole)
2. BIO: 100-150 parole, tono esclusivo, discreto, riferimenti a immobili di pregio
3. SKILLS E PUNTI DI FORZA: 5 competenze luxury (discrezione, network esclusivo, ecc.)
4. APPROCCIO DI VENDITA: Servizio white-glove e personalizzato (50 parole)
5. CTA: Call-to-action elegante e discreta

Usa un linguaggio sofisticato, evita termini banali. Il target è clientela facoltosa.

Rispondi SOLO in JSON valido:
{
  "fraseApertura": "...",
  "bio": "...",
  "skillsPuntiForza": ["...", "...", "...", "...", "..."],
  "approccioVendita": "...",
  "cta": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateSocial(openai: OpenAI, data: RequestData): Promise<BioVariant> {
  const prompt = `Sei un esperto di social media per agenti immobiliari. Genera una BIO SOCIAL per Instagram/TikTok/LinkedIn per:

AGENTE: ${data.nomeAgente}
AGENZIA: ${data.nomeAgenzia}
ESPERIENZA: ${data.anniEsperienza} anni
SPECIALIZZAZIONI: ${data.specializzazioni}
ZONA OPERATIVA: ${data.zonaOperativa}
${data.certificazioniPremi ? `CERTIFICAZIONI/PREMI: ${data.certificazioniPremi}` : ''}
TONO: ${TONE_DESCRIPTIONS[data.tono]}

GENERA una BIO SOCIAL BREVE E D'IMPATTO con:
1. FRASE DI APERTURA: Hook accattivante per social (max 10 parole)
2. BIO: MAX 150 caratteri per Instagram bio, dinamica, con emoji strategici
3. SKILLS E PUNTI DI FORZA: 3 punti chiave ultra-brevi (tipo hashtag o keyword)
4. APPROCCIO DI VENDITA: Una frase breve e memorabile (max 20 parole)
5. CTA: Call-to-action social (es. "DM per info", "Link in bio")

Usa emoji in modo strategico ma non eccessivo. Stile moderno e social-friendly.

Rispondi SOLO in JSON valido:
{
  "fraseApertura": "...",
  "bio": "...",
  "skillsPuntiForza": ["...", "...", "..."],
  "approccioVendita": "...",
  "cta": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateWebsite(openai: OpenAI, data: RequestData): Promise<BioVariant> {
  const prompt = `Sei un esperto di copywriting SEO per siti web di agenti immobiliari. Genera una BIO WEBSITE completa per:

AGENTE: ${data.nomeAgente}
AGENZIA: ${data.nomeAgenzia}
ESPERIENZA: ${data.anniEsperienza} anni
SPECIALIZZAZIONI: ${data.specializzazioni}
ZONA OPERATIVA: ${data.zonaOperativa}
${data.certificazioniPremi ? `CERTIFICAZIONI/PREMI: ${data.certificazioniPremi}` : ''}
MERCATO: ${MARKET_ADAPTATIONS[data.mercato || 'italia']}
TONO: ${TONE_DESCRIPTIONS[data.tono]}

GENERA una BIO WEBSITE LUNGA E SEO-OPTIMIZED con:
1. FRASE DI APERTURA: Headline H1 ottimizzata SEO (max 15 parole)
2. BIO: 250-300 parole, strutturata per web, paragrafi corti, keywords naturali per SEO locale
3. SKILLS E PUNTI DI FORZA: 5 competenze dettagliate con descrizioni (per sezione "servizi")
4. APPROCCIO DI VENDITA: Sezione "perché scegliermi" (80 parole)
5. CTA: Call-to-action con urgenza soft
6. SEO VERSION: Meta description 155 caratteri + keywords suggerite

Le keywords devono includere: "${data.zonaOperativa}", "agente immobiliare", "${data.specializzazioni.split(',')[0]}"

Rispondi SOLO in JSON valido:
{
  "fraseApertura": "...",
  "bio": "...",
  "skillsPuntiForza": ["...", "...", "...", "...", "..."],
  "approccioVendita": "...",
  "cta": "...",
  "seoVersion": "Meta: ... | Keywords: ..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generatePersonalBrandingAdvice(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente di personal branding per agenti immobiliari. 
Basandoti su questi dati:
- Agente: ${data.nomeAgente}
- Esperienza: ${data.anniEsperienza} anni
- Specializzazioni: ${data.specializzazioni}
- Zona: ${data.zonaOperativa}
- Mercato: ${data.mercato}

Dai UN CONSIGLIO STRATEGICO personalizzato per migliorare il personal branding di questo agente.
Massimo 80 parole. Sii concreto e actionable.`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  return response.choices[0]?.message?.content || 'Consiglio non disponibile';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Devi effettuare il login per utilizzare questa funzione.' },
        { status: 401 }
      );
    }

    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Limite raggiunto',
          message: userRateLimit.message || 'Troppi tentativi. Riprova tra 1 minuto.',
          resetAt: userRateLimit.resetAt
        },
        { status: 429 }
      );
    }

    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Limite raggiunto',
            message: 'Troppi tentativi da questo indirizzo IP. Riprova tra 1 minuto.'
          },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: `Dati non validi: ${errors}` },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    const cacheContent = `agent-bio:${user.id}:${data.nomeAgente}:${data.nomeAgenzia}:${data.anniEsperienza}:${data.specializzazioni.slice(0, 50)}:${data.zonaOperativa}:${data.tono}:${data.mercato}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'agent-bio') as AgentBioResult | null;
    
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configurazione AI mancante. Contatta il supporto.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const [professionale, emotiva, luxury, social, website, consiglio] = await Promise.all([
      generateProfessionale(openai, data),
      generateEmotiva(openai, data),
      generateLuxury(openai, data),
      generateSocial(openai, data),
      generateWebsite(openai, data),
      generatePersonalBrandingAdvice(openai, data),
    ]);

    const result: AgentBioResult = {
      professionale,
      emotiva,
      luxury,
      social,
      website,
      consiglioPersonalBranding: consiglio,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'agent-bio', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    console.error('Agent BIO generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'Il servizio AI sta impiegando troppo tempo. Riprova tra qualche secondo.' },
          { status: 504 }
        );
      }
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Limite di richieste AI raggiunto. Riprova tra qualche minuto.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Errore nella generazione della bio. Riprova.' },
      { status: 500 }
    );
  }
}
