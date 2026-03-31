/**
 * AI Property Scoring
 * Analyzes external listings and assigns a lead score (0-100)
 * based on pricing, urgency signals, and listing quality
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PropertyScoringInput {
  title: string;
  price: number | null;
  location: string;
  description?: string;
  features?: string[];
  propertyType?: string;
}

export interface PropertyScoringResult {
  leadScore: number; // 0-100
  reasoning: string;
  signals: {
    underpriced: boolean;
    urgent: boolean;
    high_quality: boolean;
    good_location: boolean;
  };
}

/**
 * Analyzes a property listing and assigns a lead score
 */
export async function scorePropertyListing(
  input: PropertyScoringInput
): Promise<PropertyScoringResult> {
  try {
    const priceText = input.price 
      ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(input.price)
      : 'Non specificato';

    const description = input.description || '';
    const features = input.features?.join(', ') || 'Nessuna caratteristica specificata';
    
    const systemPrompt = `Sei un esperto di valutazione immobiliare AI. Analizza gli annunci immobiliari e assegna un punteggio da 0 a 100 basato su:

1. **POTENZIALE DI VENDITA RAPIDA (40 punti)**
   - Segnali di urgenza: "vendita immediata", "urgente", "svendita", "deve vendere", "presto disponibile"
   - Motivi di vendita: divorzio, trasferimento, ereditarietà, cambio lavoro
   - Prezzo sotto mercato: confronto con zone simili

2. **QUALITÀ DELL'IMMOBILE (30 punti)**
   - Caratteristiche premium: piscina, giardino, ristrutturato, classe energetica alta
   - Stato: "nuovo", "appena ristrutturato", "prestigioso", "di lusso"
   - Zona: "centro", "servitissima", "prestigiosa", "residenziale esclusiva"

3. **POTENZIALE INVESTIMENTO (20 punti)**
   - ROI potenziale
   - Zona in crescita
   - Affittabilità

4. **COMPLETEZZA ANNUNCIO (10 punti)**
   - Descrizione dettagliata
   - Foto disponibili
   - Dati completi

Rispondi SOLO con JSON valido, nessun testo aggiuntivo.`;

    const userPrompt = `Analizza questo annuncio immobiliare:

**Titolo:** ${input.title}
**Prezzo:** ${priceText}
**Località:** ${input.location}
**Tipo:** ${input.propertyType || 'Non specificato'}
**Descrizione:** ${description.substring(0, 1000)}${description.length > 1000 ? '...' : ''}
**Caratteristiche:** ${features}

Assegna un punteggio da 0 a 100 e indica:
- leadScore: numero da 0 a 100
- reasoning: breve spiegazione (max 100 caratteri)
- signals: {
    underpriced: true/false (prezzo sotto mercato),
    urgent: true/false (segnali di urgenza),
    high_quality: true/false (immobile di qualità),
    good_location: true/false (zona prestigiosa/centrale)
  }

Rispondi SOLO con JSON valido:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Validate and normalize score
    let score = parseInt(parsed.leadScore || parsed.lead_score || '50', 10);
    if (isNaN(score) || score < 0) score = 0;
    if (score > 100) score = 100;

    return {
      leadScore: score,
      reasoning: parsed.reasoning || 'Analisi completata',
      signals: {
        underpriced: parsed.signals?.underpriced === true,
        urgent: parsed.signals?.urgent === true,
        high_quality: parsed.signals?.high_quality === true,
        good_location: parsed.signals?.good_location === true,
      },
    };

  } catch (error: any) {
    console.error('[PROPERTY SCORING] Error:', error);
    
    // Fallback: base score on simple heuristics
    let fallbackScore = 50;
    
    if (input.description) {
      const descLower = input.description.toLowerCase();
      if (descLower.includes('urgent') || descLower.includes('immediat')) {
        fallbackScore += 20;
      }
      if (descLower.includes('svendit') || descLower.includes('sotto')) {
        fallbackScore += 15;
      }
    }

    return {
      leadScore: Math.min(100, fallbackScore),
      reasoning: 'Analisi base (fallback)',
      signals: {
        underpriced: false,
        urgent: false,
        high_quality: false,
        good_location: false,
      },
    };
  }
}

