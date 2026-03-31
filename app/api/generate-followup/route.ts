import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';

export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  leadName: z.string().min(2, 'Inserisci il nome del lead').max(100),
  agentName: z.string().min(2, 'Inserisci il nome dell\'agente').max(100),
  agencyName: z.string().min(2, 'Inserisci il nome dell\'agenzia').max(150),
  propertyTitle: z.string().min(5, 'Inserisci il titolo dell\'immobile').max(200),
  propertyLocation: z.string().min(2, 'Inserisci la località').max(150),
  propertyPrice: z.string().min(1, 'Inserisci il prezzo').max(50),
  reasonOfInterest: z.string().min(10, 'Descrivi il motivo di interesse').max(500),
  tone: z.enum(['professionale', 'amichevole', 'luxury']),
});

type RequestData = z.infer<typeof requestSchema>;

interface EmailVariant {
  oggetto: string;
  testoEmail: string;
  cta: string;
  ps?: string;
  versioneBreve: string;
  versioneLunga: string;
}

interface FollowUpResult {
  immediateResponse: EmailVariant;
  followUp24h: EmailVariant;
  followUp72h: EmailVariant;
  appointmentScheduling: EmailVariant;
  postVisit: EmailVariant;
  luxuryLeadFollowUp: EmailVariant;
  consiglioConversione: string;
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  professionale: 'tono formale, autorevole, focus su competenze e affidabilità',
  amichevole: 'tono caldo, accessibile, empatico, orientato alla relazione personale',
  luxury: 'tono esclusivo, sofisticato, discreto, per clientela high-net-worth',
};

async function generateImmediateResponse(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter immobiliare italiano. Genera un'EMAIL DI RISPOSTA IMMEDIATA per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Questa email viene inviata ENTRO 1 ORA dalla richiesta del lead. Deve:
- Ringraziare per l'interesse mostrato
- Confermare la disponibilità dell'immobile
- Proporre un primo contatto telefonico o visita
- Essere reattiva e professionale

GENERA:
1. OGGETTO: Accattivante, max 60 caratteri, include nome immobile
2. TESTO EMAIL: 100-150 parole, personalizzato
3. CTA: Call-to-action chiara (es. "Prenota la tua visita")
4. PS: Frase finale opzionale per creare urgenza
5. VERSIONE BREVE: 50 parole per WhatsApp/SMS
6. VERSIONE LUNGA: 200 parole con più dettagli

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generateFollowUp24h(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter immobiliare italiano. Genera un'EMAIL FOLLOW-UP 24 ORE per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Questa email viene inviata 24 ORE dopo il primo contatto. Deve:
- Ricordare gentilmente l'interesse mostrato
- Aggiungere 2-3 dettagli extra sull'immobile
- Proporre date specifiche per visita
- Non essere invadente ma persistente

GENERA:
1. OGGETTO: Personalizzato, max 60 caratteri
2. TESTO EMAIL: 100-150 parole
3. CTA: Proposta concreta
4. PS: Elemento di scarsità o urgenza soft
5. VERSIONE BREVE: 50 parole
6. VERSIONE LUNGA: 200 parole

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generateFollowUp72h(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter immobiliare italiano. Genera un'EMAIL FOLLOW-UP 72 ORE per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Questa email viene inviata 72 ORE dopo il primo contatto. Deve:
- Riconoscere che il lead potrebbe essere impegnato
- Offrire valore aggiunto (es. analisi mercato zona, finanziamento)
- Creare FOMO leggero (altri interessati)
- Proporre alternativa se questo immobile non è più d'interesse

GENERA:
1. OGGETTO: Curioso, max 60 caratteri
2. TESTO EMAIL: 100-150 parole
3. CTA: Ultima chance soft
4. PS: Offerta esclusiva o bonus
5. VERSIONE BREVE: 50 parole
6. VERSIONE LUNGA: 200 parole

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generateAppointmentScheduling(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter immobiliare italiano. Genera un'EMAIL PER FISSARE APPUNTAMENTO per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Questa email serve a FISSARE UN APPUNTAMENTO di visita. Deve:
- Proporre 3 slot temporali specifici (mattina, pomeriggio, weekend)
- Spiegare cosa vedrà durante la visita
- Fornire indirizzo e indicazioni
- Confermare i benefit della visita

GENERA:
1. OGGETTO: Orientato all'azione, max 60 caratteri
2. TESTO EMAIL: 100-150 parole con slot proposti
3. CTA: "Conferma il tuo orario preferito"
4. PS: Cosa portare o preparare
5. VERSIONE BREVE: 50 parole
6. VERSIONE LUNGA: 200 parole con più dettagli logistici

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generatePostVisit(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter immobiliare italiano. Genera un'EMAIL POST-VISITA per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Questa email viene inviata DOPO LA VISITA. Deve:
- Ringraziare per il tempo dedicato
- Chiedere feedback sulla visita
- Rispondere a eventuali dubbi emersi
- Proporre i prossimi passi (proposta, seconda visita, documenti)
- Creare urgenza se ci sono altri interessati

GENERA:
1. OGGETTO: Personalizzato post-visita, max 60 caratteri
2. TESTO EMAIL: 100-150 parole
3. CTA: Prossimo passo concreto
4. PS: Disponibilità per chiarimenti
5. VERSIONE BREVE: 50 parole
6. VERSIONE LUNGA: 200 parole con dettagli aggiuntivi

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generateLuxuryLeadFollowUp(openai: OpenAI, data: RequestData): Promise<EmailVariant> {
  const prompt = `Sei un esperto copywriter per immobili di lusso. Genera un'EMAIL LUXURY LEAD per:

LEAD: ${data.leadName}
AGENTE: ${data.agentName}
AGENZIA: ${data.agencyName}
IMMOBILE: ${data.propertyTitle}
LOCALITÀ: ${data.propertyLocation}
PREZZO: ${data.propertyPrice}
MOTIVO INTERESSE: ${data.reasonOfInterest}

Questa email è per CLIENTI ALTO PROFILO (HNWI). Deve:
- Usare linguaggio sofisticato e discreto
- Enfatizzare esclusività e privacy
- Offrire servizio white-glove personalizzato
- Proporre visita privata con servizi premium
- Menzionare discrezione e riservatezza

GENERA:
1. OGGETTO: Elegante e discreto, max 60 caratteri
2. TESTO EMAIL: 100-150 parole, tono luxury
3. CTA: Invito esclusivo
4. PS: Servizio concierge o benefit VIP
5. VERSIONE BREVE: 50 parole eleganti
6. VERSIONE LUNGA: 200 parole con dettagli premium

Rispondi SOLO in JSON valido:
{
  "oggetto": "...",
  "testoEmail": "...",
  "cta": "...",
  "ps": "...",
  "versioneBreve": "...",
  "versioneLunga": "..."
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

async function generateConversionAdvice(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente di vendita immobiliare esperto. 
Basandoti su questi dati del lead:
- Nome: ${data.leadName}
- Immobile: ${data.propertyTitle} a ${data.propertyLocation}
- Prezzo: ${data.propertyPrice}
- Motivo interesse: ${data.reasonOfInterest}

Dai UN CONSIGLIO STRATEGICO personalizzato per convertire questo lead in cliente.
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

    // SECURITY: Check active subscription
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
    
    const cacheContent = `followup:${user.id}:${data.leadName}:${data.propertyTitle.slice(0, 30)}:${data.propertyLocation}:${data.tone}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'followup-emails') as FollowUpResult | null;
    
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

    const [
      immediateResponse,
      followUp24h,
      followUp72h,
      appointmentScheduling,
      postVisit,
      luxuryLeadFollowUp,
      consiglio
    ] = await Promise.all([
      generateImmediateResponse(openai, data),
      generateFollowUp24h(openai, data),
      generateFollowUp72h(openai, data),
      generateAppointmentScheduling(openai, data),
      generatePostVisit(openai, data),
      generateLuxuryLeadFollowUp(openai, data),
      generateConversionAdvice(openai, data),
    ]);

    const result: FollowUpResult = {
      immediateResponse,
      followUp24h,
      followUp72h,
      appointmentScheduling,
      postVisit,
      luxuryLeadFollowUp,
      consiglioConversione: consiglio,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'followup-emails', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    console.error('Follow-up email generation error:', error);
    
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
      { error: 'Errore nella generazione delle email. Riprova.' },
      { status: 500 }
    );
  }
}
