/**
 * AI Urgency Analysis
 * Analizza il testo dell'annuncio per rilevare segnali di urgenza
 */

export interface UrgencyAnalysisResult {
  urgencyScore: number; // 0-100
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedKeywords: string[];
  reasoning: string;
}

/**
 * Analizza urgenza basandosi su parole chiave e pattern
 */
export function analyzeUrgency(
  title: string,
  description: string,
  price: number | null,
  daysOnMarket?: number
): UrgencyAnalysisResult {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Parole chiave di urgenza con pesi
  const urgencyKeywords = [
    { word: 'urgente', weight: 30 },
    { word: 'urgent', weight: 30 },
    { word: 'affare', weight: 25 },
    { word: 'deal', weight: 25 },
    { word: 'trattabile', weight: 20 },
    { word: 'negoziabile', weight: 20 },
    { word: 'negoziabile', weight: 20 },
    { word: 'trasferimento', weight: 25 },
    { word: 'relocation', weight: 25 },
    { word: 'deve vendere', weight: 30 },
    { word: 'must sell', weight: 30 },
    { word: 'svendita', weight: 25 },
    { word: 'sotto prezzo', weight: 20 },
    { word: 'underpriced', weight: 20 },
    { word: 'occasione', weight: 15 },
    { word: 'opportunity', weight: 15 },
    { word: 'immediata', weight: 25 },
    { word: 'immediate', weight: 25 },
    { word: 'rapida', weight: 15 },
    { word: 'quick', weight: 15 },
    { word: 'divorzio', weight: 20 },
    { word: 'divorce', weight: 20 },
    { word: 'eredità', weight: 15 },
    { word: 'inheritance', weight: 15 },
    { word: 'liquidazione', weight: 25 },
    { word: 'liquidation', weight: 25 },
  ];

  let urgencyScore = 0;
  const detectedKeywords: string[] = [];

  // Analizza parole chiave
  urgencyKeywords.forEach(({ word, weight }) => {
    if (text.includes(word)) {
      urgencyScore += weight;
      detectedKeywords.push(word);
    }
  });

  // Bonus per giorni sul mercato (>90 giorni = ghost listing)
  if (daysOnMarket && daysOnMarket > 90) {
    urgencyScore += 20;
  }

  // Bonus per prezzo basso (se disponibile)
  // Questo è un mock - in produzione si confronta con media zona
  if (price && price < 200000) {
    urgencyScore += 10; // Prezzo basso può indicare urgenza
  }

  // Normalizza a 0-100
  urgencyScore = Math.min(100, urgencyScore);

  // Determina livello
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  if (urgencyScore >= 70) {
    urgencyLevel = 'critical';
  } else if (urgencyScore >= 50) {
    urgencyLevel = 'high';
  } else if (urgencyScore >= 30) {
    urgencyLevel = 'medium';
  } else {
    urgencyLevel = 'low';
  }

  // Genera reasoning
  let reasoning = '';
  if (urgencyLevel === 'critical') {
    reasoning = 'Urgenza CRITICA: Segnali multipli di fretta di vendere';
  } else if (urgencyLevel === 'high') {
    reasoning = 'Alta urgenza: Proprietario probabilmente motivato';
  } else if (urgencyLevel === 'medium') {
    reasoning = 'Urgenza media: Alcuni segnali di disponibilità';
  } else {
    reasoning = 'Urgenza bassa: Nessun segnale particolare';
  }

  if (daysOnMarket && daysOnMarket > 90) {
    reasoning += ` (Ghost Listing: ${daysOnMarket} giorni sul mercato)`;
  }

  return {
    urgencyScore,
    urgencyLevel,
    detectedKeywords: [...new Set(detectedKeywords)], // Rimuovi duplicati
    reasoning,
  };
}

