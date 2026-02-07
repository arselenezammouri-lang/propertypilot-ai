import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOpenAIWithTimeout, withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import type { Lead, LeadEnrichmentResult } from '@/lib/types/database.types';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const openai = createOpenAIWithTimeout(process.env.OPENAI_API_KEY!);

async function enrichLeadWithAI(lead: Lead): Promise<LeadEnrichmentResult> {
  const marketContext = lead.market === 'usa' 
    ? 'mercato immobiliare USA (Zillow, Realtor.com, stile americano)' 
    : 'mercato immobiliare italiano (Immobiliare.it, Idealista, stile italiano)';

  const prompt = `Analizza questo lead immobiliare e genera un profilo completo per aiutare l'agente a convertirlo.

DATI DEL LEAD:
- Nome: ${lead.nome}
- Email: ${lead.email || 'Non fornita'}
- Telefono: ${lead.telefono || 'Non fornito'}
- Messaggio: ${lead.messaggio || 'Nessun messaggio'}
- Priorità attuale: ${lead.priorita}
- Stato: ${lead.status}
- Lead Score: ${lead.lead_score}/100
- Mercato: ${marketContext}

Genera un'analisi JSON completa con questa struttura ESATTA:

{
  "profilo_psicografico": {
    "tipo_acquirente": "string (es: Investitore razionale, Famiglia emotiva, Primo acquirente cauto)",
    "motivazioni_principali": ["array di 3-5 motivazioni"],
    "stile_decisionale": "string (Analitico/Emotivo/Impulsivo/Collaborativo)",
    "priorita_vita": ["array di 3-4 priorità di vita"],
    "pain_points": ["array di 3-4 problemi/paure"]
  },
  "probabilita_chiusura": {
    "percentuale": number (0-100),
    "livello": "molto_alta|alta|media|bassa|molto_bassa",
    "fattori_positivi": ["array di 2-4 fattori"],
    "fattori_negativi": ["array di 2-4 fattori"]
  },
  "budget_analysis": {
    "budget_stimato_min": number,
    "budget_stimato_max": number,
    "fascia_prezzo": "string (es: €200.000 - €350.000 o $300,000 - $500,000)",
    "capacita_investimento": "string (bassa/media/alta/molto alta)",
    "flessibilita_budget": "string (rigida/moderata/flessibile)"
  },
  "fascia_immobile": {
    "tipologie_consigliate": ["array di 2-4 tipologie"],
    "zone_ideali": ["array di 3-5 zone/quartieri"],
    "caratteristiche_prioritarie": ["array di 4-6 caratteristiche"],
    "elementi_da_evitare": ["array di 2-4 elementi"]
  },
  "obiezioni_probabili": [
    {
      "obiezione": "string",
      "probabilita": "alta|media|bassa",
      "risposta_suggerita": "string (risposta professionale)",
      "strategia": "string (come gestire)"
    }
  ],
  "buyer_persona": {
    "nome_persona": "string (nome fittizio rappresentativo)",
    "descrizione_breve": "string (2-3 frasi)",
    "eta_stimata": "string (range età)",
    "professione_probabile": "string",
    "situazione_familiare": "string",
    "valori_chiave": ["array di 3-5 valori"],
    "canali_preferiti": ["array di 2-4 canali comunicazione"],
    "trigger_acquisto": ["array di 3-4 trigger]"
  },
  "strategia_followup": {
    "approccio_consigliato": "string",
    "frequenza_contatto": "string",
    "canale_preferito": "string",
    "messaggi_chiave": ["array di 3-5 messaggi"],
    "tempistiche": "string",
    "azioni_prioritarie": ["array di 3-5 azioni ordinate per priorità"]
  },
  "punteggio_qualita": {
    "score": number (0-100),
    "interpretazione": "string"
  }
}

REGOLE:
- Rispondi SOLO con JSON valido, nessun testo aggiuntivo
- Budget in ${lead.market === 'usa' ? 'USD ($)' : 'EUR (€)'}
- Adatta il linguaggio e i riferimenti al mercato ${lead.market === 'usa' ? 'americano' : 'italiano'}
- Genera almeno 4 obiezioni probabili
- Sii specifico e pratico nei suggerimenti`;

  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto analista di lead immobiliari con 20 anni di esperienza nel ${marketContext}. 
Analizzi i lead per aiutare gli agenti a convertirli in clienti.
Rispondi SEMPRE e SOLO in formato JSON valido.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content) as LeadEnrichmentResult;
    result.generato_il = new Date().toISOString();
    return result;
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
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

    const body = await request.json();
    const { lead_id } = body;

    if (!lead_id) {
      return NextResponse.json(
        { error: 'ID lead richiesto' },
        { status: 400 }
      );
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }

    const cacheService = getAICacheService();
    const cacheKey = `lead_enrich:${lead_id}:${lead.updated_at}`;
    const cachedResult = await cacheService.get(cacheKey, 'lead_enrich');

    if (cachedResult) {
      logger.debug('[LEAD ENRICH] Cache HIT', { leadId: lead_id });
      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true,
        duration: Date.now() - startTime,
      });
    }

    logger.debug('[LEAD ENRICH] Starting AI enrichment', { leadId: lead_id });
    const enrichmentResult = await enrichLeadWithAI(lead);

    await cacheService.set(cacheKey, 'lead_enrich', enrichmentResult, 24 * 60 * 60);

    const duration = Date.now() - startTime;
    logger.debug('[LEAD ENRICH] Enrichment completed', { duration, leadId: lead_id });

    return NextResponse.json({
      success: true,
      data: enrichmentResult,
      cached: false,
      duration,
    });

  } catch (error: any) {
    logger.error('[LEAD ENRICH] Error', error as Error, { component: 'lead-enrich' });
    
    if (error.status === 429 || error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'Limite API OpenAI raggiunto. Riprova più tardi.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore durante l\'arricchimento del lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');

    if (!leadId) {
      return NextResponse.json(
        { error: 'ID lead richiesto' },
        { status: 400 }
      );
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }

    const cacheService = getAICacheService();
    const cacheKey = `lead_enrich:${leadId}:${lead.updated_at}`;
    const cachedResult = await cacheService.get(cacheKey, 'lead_enrich');

    if (cachedResult) {
      return NextResponse.json({
        success: true,
        data: cachedResult,
        exists: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: null,
      exists: false,
    });

  } catch (error) {
    logger.error('[LEAD ENRICH] GET Error', error as Error, { component: 'lead-enrich' });
    return NextResponse.json(
      { error: 'Errore nel recupero dei dati di arricchimento' },
      { status: 500 }
    );
  }
}