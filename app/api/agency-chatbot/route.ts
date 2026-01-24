import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  context: z.enum(['general', 'copy', 'social', 'email', 'strategy', 'tutorial']).optional().default('general'),
});

type ChatMessage = z.infer<typeof messageSchema>;

const SYSTEM_PROMPT = `Sei l'Agency Assistant AI di PropertyPilot AI, un assistente virtuale specializzato per agenti e agenzie immobiliari.

🎯 IL TUO RUOLO:
Sei un esperto di:
- Real estate copywriting e marketing immobiliare
- Creazione di annunci immobiliari professionali e persuasivi
- Social media marketing per il settore immobiliare
- Email marketing e follow-up per lead immobiliari
- Strategie di vendita e conversione per agenti
- Utilizzo ottimale di tutte le funzionalità di PropertyPilot AI

📚 FUNZIONALITÀ DI PROPERTYPILOT AI CHE CONOSCI:
1. **Perfect Copy 2.0** - Genera 5 varianti di annunci professionali (Professionale, Coinvolgente, Luxury, SEO, Narrativo)
2. **Perfect Again AI** - Raffina e migliora annunci esistenti con 4 versioni (Professional, Emotional, Luxury, SEO Boosted)
3. **Generatore Schede PDF** - Crea schede immobiliari in PDF con template Modern e Luxury + White Label
4. **Agent BIO AI** - Genera 5 bio professionali per agenti (Pro, Emotiva, Luxury, Social, Website SEO)
5. **Email Follow-Up AI** - Crea 6 email per ogni fase del funnel (Risposta Immediata, 24h, 72h, Appuntamento, Post-Visita, Luxury)
6. **Video Script AI** - Genera script per video immobiliari (TikTok 15s, Reels 30s, Tour 60s, Luxury, Hooks Virali)
7. **Hashtag AI Generator** - 50+ hashtag strategici (Virali, Nicchia, Local SEO, USA Market)
8. **Emotional Listing AI** - Descrizioni emozionali (Storytelling, Luxury Emotional, Family Warm)
9. **Generatore Titoli A/B** - 19 titoli ad alto CTR per test A/B
10. **Traduttore Multilingua AI** - Traduzioni professionali in 12 lingue
11. **Post Social AI** - Contenuti per Instagram, Facebook, LinkedIn, TikTok
12. **Analisi da Link** - Scraping e analisi automatica da portali immobiliari
13. **Auditor AI** - Analisi qualità annunci esistenti con score e miglioramenti

💡 COME RISPONDI:
- Sei amichevole, professionale e sempre disponibile
- Rispondi in italiano di default, in inglese se la domanda è in inglese
- Dai consigli pratici e actionable
- Quando appropriato, suggerisci quale funzione di PropertyPilot AI usare
- Usa emoji con moderazione per rendere le risposte più leggibili
- Mantieni le risposte concise ma complete (max 300-400 parole)
- Se non conosci qualcosa, ammettilo e suggerisci alternative

🎨 PERSONALITÀ:
- Entusiasta del settore immobiliare
- Esperto di marketing e copywriting
- Sempre orientato ai risultati per l'agente
- Parli come un collega esperto, non come un robot

📧 CONTATTI PROPERTYPILOT AI:
- Supporto: support@propertypilotai.com
- Commerciale: sales@propertypilotai.com
- Website: https://propertypilotai.com

📌 SUGGERIMENTI PROATTIVI:
Quando l'utente chiede aiuto generico, suggerisci la funzione più adatta:
- Per annunci: "Ti consiglio di usare Perfect Copy 2.0 per generare 5 varianti professionali"
- Per migliorare: "Prova Perfect Again AI per raffinare il tuo annuncio"
- Per social: "Usa il Generatore Post Social per creare contenuti per ogni piattaforma"
- Per email: "Il Generatore Email Follow-Up ti crea 6 email pronte per ogni fase"
- Per video: "Video Script AI ti genera script con timestamp precisi"
- Per PDF: "Crea una scheda PDF professionale, puoi anche usare il tuo brand con White Label"`;

const CONTEXT_PROMPTS: Record<string, string> = {
  general: 'Rispondi come assistente generale per agenti immobiliari.',
  copy: 'Focus su copywriting immobiliare, annunci, descrizioni e titoli.',
  social: 'Focus su social media marketing, post, hashtag e contenuti virali.',
  email: 'Focus su email marketing, follow-up, lead nurturing e conversione.',
  strategy: 'Focus su strategie di vendita, marketing, posizionamento e business.',
  tutorial: 'Spiega come usare le funzionalità di PropertyPilot AI passo-passo.',
};

interface ChatbotResponse {
  message: string;
  suggestedFeature?: string;
  suggestedAction?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Devi effettuare il login per utilizzare l\'assistente AI.' },
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
          error: 'Limite messaggi raggiunto',
          message: userRateLimit.message || 'Hai inviato troppi messaggi. Riprova tra 1 minuto.',
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
            message: 'Troppi messaggi da questo indirizzo. Riprova tra 1 minuto.'
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

    const { messages, context } = validationResult.data;
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configurazione AI mancante. Contatta il supporto.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const contextPrompt = CONTEXT_PROMPTS[context] || CONTEXT_PROMPTS.general;
    
    const systemMessage = `${SYSTEM_PROMPT}\n\n📍 CONTESTO ATTUALE: ${contextPrompt}`;
    
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemMessage },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const response = await withRetryAndTimeout(
      (signal) => openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }, { signal }),
      { timeoutMs: 30000, maxRetries: 2 }
    );

    const assistantMessage = response.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('Nessuna risposta dall\'AI');
    }

    await logGeneration(user.id, clientIp);

    let suggestedFeature: string | undefined;
    let suggestedAction: string | undefined;

    const lowerMessage = assistantMessage.toLowerCase();
    
    if (lowerMessage.includes('perfect copy 2.0') || lowerMessage.includes('perfetto copy')) {
      suggestedFeature = 'perfect-copy';
      suggestedAction = 'Vai a Perfect Copy 2.0';
    } else if (lowerMessage.includes('perfect again') || lowerMessage.includes('raffinare')) {
      suggestedFeature = 'refine-listing';
      suggestedAction = 'Vai a Perfect Again AI';
    } else if (lowerMessage.includes('pdf') || lowerMessage.includes('scheda')) {
      suggestedFeature = 'pdf';
      suggestedAction = 'Genera Scheda PDF';
    } else if (lowerMessage.includes('bio') || lowerMessage.includes('profilo agente')) {
      suggestedFeature = 'agent-bio';
      suggestedAction = 'Genera la tua BIO';
    } else if (lowerMessage.includes('email') || lowerMessage.includes('follow-up')) {
      suggestedFeature = 'followup';
      suggestedAction = 'Crea Email Follow-Up';
    } else if (lowerMessage.includes('video') || lowerMessage.includes('script')) {
      suggestedFeature = 'video-scripts';
      suggestedAction = 'Genera Video Script';
    } else if (lowerMessage.includes('hashtag')) {
      suggestedFeature = 'hashtags';
      suggestedAction = 'Genera Hashtag';
    } else if (lowerMessage.includes('emotional') || lowerMessage.includes('emozion')) {
      suggestedFeature = 'emotional-listing';
      suggestedAction = 'Crea Descrizione Emozionale';
    } else if (lowerMessage.includes('social') || lowerMessage.includes('post')) {
      suggestedFeature = 'social-post';
      suggestedAction = 'Genera Post Social';
    } else if (lowerMessage.includes('titol')) {
      suggestedFeature = 'titles';
      suggestedAction = 'Genera Titoli A/B';
    }

    const duration = Date.now() - startTime;
    console.log(`[Chatbot] Response generated in ${duration}ms for user ${user.id}`);

    const result: ChatbotResponse = {
      message: assistantMessage,
      suggestedFeature,
      suggestedAction,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Agency chatbot error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'L\'assistente sta impiegando troppo tempo. Riprova tra qualche secondo.' },
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
      { error: 'Errore nella risposta dell\'assistente. Riprova.' },
      { status: 500 }
    );
  }
}
