import OpenAI from 'openai';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LeadFactor {
  nome: string;
  punteggio: number;
  motivazione: string;
}

export interface ActionPriority {
  priorita: number;
  azione: string;
  motivazione: string;
  tempistica: string;
}

export interface LeadResponse {
  breve: string;
  lungo: string;
  oggetto: string;
}

export interface PerfectCopySuggestion {
  tipo: string;
  descrizione: string;
  motivazione: string;
}

export interface LeadScoreResult {
  leadScore: number;
  categoria: 'hot' | 'warm' | 'cold';
  categoriaLabel: string;
  categoriaEmoji: string;
  sintesiAnalisi: string;
  breakdown: LeadFactor[];
  prioritaAzione: ActionPriority[];
  rispostaBrieveTemplate: LeadResponse;
  rispostaLungaTemplate: LeadResponse;
  suggerimentiPerfectCopy: PerfectCopySuggestion[];
  profiloLead: string;
  rischioPerditaLead: string;
  followUpStrategy: string;
}

export interface LeadScoreInput {
  nomeLead?: string;
  budget?: string;
  tempistiche: string;
  messaggioLead: string;
  tipoImmobile: string;
  mercato: 'italia' | 'usa';
}

const MARKET_CONTEXT = {
  italia: {
    currency: '€',
    style: 'professionale ma cordiale, usa il Lei, enfatizza servizio personalizzato',
    saluti: ['Gentile', 'Egregio/a', 'Buongiorno'],
    chiusure: ['Cordiali saluti', 'A presto', 'Resto a disposizione'],
  },
  usa: {
    currency: '$',
    style: 'friendly but professional, direct, value-focused',
    saluti: ['Dear', 'Hello', 'Hi'],
    chiusure: ['Best regards', 'Looking forward to hearing from you', 'Best'],
  },
};

export async function scoreRealEstateLead(input: LeadScoreInput): Promise<LeadScoreResult> {
  const marketContext = MARKET_CONTEXT[input.mercato];
  const leadName = input.nomeLead || (input.mercato === 'italia' ? 'Potenziale Cliente' : 'Potential Client');

  const systemPrompt = `Sei un esperto analista di lead immobiliari con oltre 20 anni di esperienza nel mercato ${input.mercato === 'italia' ? 'italiano' : 'statunitense'}. 
Analizza il messaggio del lead e fornisci un punteggio dettagliato basato sulla probabilità di conversione.

CONTESTO MERCATO:
- Valuta: ${marketContext.currency}
- Stile comunicazione: ${marketContext.style}
- Lead: ${leadName}
- Budget dichiarato: ${input.budget || 'Non specificato'}
- Tempistiche: ${input.tempistiche}
- Tipo immobile cercato: ${input.tipoImmobile}

CRITERI DI VALUTAZIONE (5 fattori, 0-20 punti ciascuno):
1. URGENZA PERCEPITA (0-20): Quanto è urgente la ricerca? Segnali di urgenza immediata vs ricerca esplorativa
2. BUDGET E COMPATIBILITÀ (0-20): Budget realistico per il mercato? Coerenza con le richieste?
3. TEMPISTICHE (0-20): Entro quando vogliono concludere? Tempistiche chiare e realistiche?
4. MOTIVAZIONE (0-20): Quanto è motivato? Segnali di commitment, serietà della richiesta?
5. CHIAREZZA MESSAGGIO (0-20): Richiesta precisa? Informazioni complete? Professionalità?

CATEGORIE LEAD:
- 🔥 HOT LEAD (80-100): Pronto all'acquisto, alta urgenza, budget chiaro, motivazione forte - Da chiamare entro 5 minuti
- ⭐ WARM LEAD (50-79): Interessato ma ha bisogno di nurturing, potenziale medio-alto
- ❄️ COLD LEAD (0-49): Ricerca esplorativa, bassa urgenza, richiede qualificazione

Rispondi SOLO con un JSON valido senza markdown.`;

  const userPrompt = `MESSAGGIO DEL LEAD DA ANALIZZARE:
"""
${input.messaggioLead}
"""

Analizza questo lead e genera un JSON con questa struttura ESATTA:
{
  "leadScore": <numero 0-100>,
  "categoria": "<hot|warm|cold>",
  "categoriaLabel": "<🔥 Hot Lead - Da chiamare entro 5 minuti|⭐ Warm Lead|❄️ Cold Lead>",
  "sintesiAnalisi": "<sintesi in 2-3 frasi della qualità del lead>",
  "breakdown": [
    {
      "nome": "Urgenza Percepita",
      "punteggio": <0-20>,
      "motivazione": "<spiegazione specifica basata sul messaggio>"
    },
    {
      "nome": "Budget e Compatibilità",
      "punteggio": <0-20>,
      "motivazione": "<spiegazione>"
    },
    {
      "nome": "Tempistiche",
      "punteggio": <0-20>,
      "motivazione": "<spiegazione>"
    },
    {
      "nome": "Motivazione",
      "punteggio": <0-20>,
      "motivazione": "<spiegazione>"
    },
    {
      "nome": "Chiarezza Messaggio",
      "punteggio": <0-20>,
      "motivazione": "<spiegazione>"
    }
  ],
  "prioritaAzione": [
    {
      "priorita": 1,
      "azione": "<azione specifica, concreta e persuasiva in linguaggio naturale. Es: 'Chiama subito al telefono per fissare una visita oggi pomeriggio' o 'Invia la brochure PDF della villa via WhatsApp con un messaggio personalizzato' - NON generico come 'contattare il lead'>",
      "motivazione": "<perché questa azione è efficace per questo lead specifico, citando elementi del messaggio>",
      "tempistica": "<quando fare questa azione: per HOT LEAD usa 'entro 5 minuti', per WARM usa 'entro 2 ore', per COLD usa 'entro 24 ore'>"
    },
    ... (5 azioni totali)
  ],
  "rispostaBrieveTemplate": {
    "oggetto": "<oggetto email>",
    "breve": "<risposta breve 2-3 frasi, pronta all'uso>",
    "lungo": "<versione più dettagliata>"
  },
  "rispostaLungaTemplate": {
    "oggetto": "<oggetto email professionale>",
    "breve": "<intro 2-3 frasi>",
    "lungo": "<risposta completa professionale con tutti i dettagli, 150-200 parole>"
  },
  "suggerimentiPerfectCopy": [
    {
      "tipo": "<tipo contenuto: Scheda PDF, Post Social, Email Follow-up, Brochure, Video Script>",
      "descrizione": "<descrizione del contenuto da creare>",
      "motivazione": "<perché questo contenuto aiuterebbe con questo lead>"
    },
    ... (3 suggerimenti)
  ],
  "profiloLead": "<descrizione del profilo ideale del lead basato sull'analisi>",
  "rischioPerditaLead": "<analisi del rischio di perdere questo lead e cosa potrebbe causarlo>",
  "followUpStrategy": "<strategia di follow-up consigliata per i prossimi 7-14 giorni>"
}

IMPORTANTE:
- Adatta il tono al mercato ${input.mercato === 'italia' ? 'italiano (formale ma cordiale)' : 'USA (friendly e diretto)'}
- Le risposte template devono essere pronte all'uso, professionali
- I suggerimenti Perfect Copy devono essere specifici per questo lead
- Sii specifico e concreto nelle motivazioni, citando elementi del messaggio
- Le azioni in "prioritaAzione" devono essere SCRITTE IN LINGUAGGIO UMANO E PERSUASIVO:
  * Usa verbi d'azione concreti: "Chiama", "Invia", "Fissa", "Proponi"
  * Specifica il canale: "via WhatsApp", "al telefono", "via email"
  * Per HOT LEAD (80-100): usa tempistica "entro 5 minuti" e azioni immediate
  * Per WARM LEAD (50-79): usa tempistica "entro 2 ore" e azioni di nurturing
  * Per COLD LEAD (0-49): usa tempistica "entro 24 ore" e azioni di qualificazione
  * NON usare frasi generiche come "contattare il lead" o "inviare informazioni"
  * Scrivi come parlerebbe un agente immobiliare esperto al suo collega`;

  const generateScore = async (signal: AbortSignal) => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    try {
      const parsed = JSON.parse(cleanContent);
      
      const categoria = parsed.categoria || 'cold';
      let categoriaEmoji = '❄️';
      let categoriaLabelDefault = '❄️ Cold Lead';
      if (categoria === 'hot') {
        categoriaEmoji = '🔥';
        categoriaLabelDefault = '🔥 Hot Lead - Da chiamare entro 5 minuti';
      } else if (categoria === 'warm') {
        categoriaEmoji = '⭐';
        categoriaLabelDefault = '⭐ Warm Lead';
      }

      return {
        leadScore: parsed.leadScore || 0,
        categoria: categoria as 'hot' | 'warm' | 'cold',
        categoriaLabel: parsed.categoriaLabel || categoriaLabelDefault,
        categoriaEmoji,
        sintesiAnalisi: parsed.sintesiAnalisi || '',
        breakdown: parsed.breakdown || [],
        prioritaAzione: parsed.prioritaAzione || [],
        rispostaBrieveTemplate: parsed.rispostaBrieveTemplate || { oggetto: '', breve: '', lungo: '' },
        rispostaLungaTemplate: parsed.rispostaLungaTemplate || { oggetto: '', breve: '', lungo: '' },
        suggerimentiPerfectCopy: parsed.suggerimentiPerfectCopy || [],
        profiloLead: parsed.profiloLead || '',
        rischioPerditaLead: parsed.rischioPerditaLead || '',
        followUpStrategy: parsed.followUpStrategy || '',
      };
    } catch (parseError) {
      console.error('Lead scoring JSON parse error:', parseError);
      throw new Error('Errore nel parsing della risposta AI. Riprova.');
    }
  };

  return await withRetryAndTimeout(generateScore, {
    maxRetries: 3,
    timeoutMs: 45000,
    baseDelayMs: 2000,
  });
}
