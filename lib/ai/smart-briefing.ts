/**
 * AI Smart Briefing
 * Analizza un annuncio immobiliare e genera un briefing con vantaggi, difetti e target
 */

export interface SmartBriefing {
  advantages: string[]; // Vantaggi (max 3)
  disadvantages: string[]; // Difetti (max 3)
  targetAudience: string[]; // Target (max 2)
  hasRealAdvantage: boolean; // True se ha almeno un vantaggio significativo
  summaryForClient: string; // Riassunto pulito per il cliente
}

/**
 * Analizza annuncio e genera briefing intelligente
 */
export function generateSmartBriefing(
  title: string,
  description: string,
  price: number | null,
  location: string,
  features?: string[],
  rawData?: any
): SmartBriefing {
  const text = `${title} ${description || ''} ${features?.join(' ') || ''}`.toLowerCase();
  const fullText = `${text} ${rawData?.description || ''}`.toLowerCase();

  // Pattern per vantaggi
  const advantagePatterns = [
    { pattern: /sotto prezzo|prezzo basso|occasione|affare/i, label: 'Sotto prezzo' },
    { pattern: /ampia metratura|grande superficie|spazioso|ampio/i, label: 'Ampia metratura' },
    { pattern: /posizione centrale|centro città|zona centrale/i, label: 'Posizione centrale' },
    { pattern: /vista|panorama|terrazza|balcone/i, label: 'Vista/Panorama' },
    { pattern: /ristrutturato|nuovo|moderno|recente/i, label: 'Ristrutturato/Moderno' },
    { pattern: /ascensore|lift/i, label: 'Con ascensore' },
    { pattern: /parcheggio|garage|box/i, label: 'Parcheggio/Garage' },
    { pattern: /giardino|terrazzo|spazio esterno/i, label: 'Giardino/Terrazzo' },
    { pattern: /cucina attrezzata|arredato|mobili/i, label: 'Cucina attrezzata' },
    { pattern: /classe energetica [a-b]|efficiente|risparmio energetico/i, label: 'Alta efficienza energetica' },
    { pattern: /piano alto|ultimo piano|attico/i, label: 'Piano alto/Attico' },
    { pattern: /zona residenziale|tranquilla|silenziosa/i, label: 'Zona residenziale tranquilla' },
    { pattern: /vicino metro|mezzi pubblici|trasporti/i, label: 'Vicino ai trasporti' },
    { pattern: /scuole|università|servizi/i, label: 'Vicino a servizi' },
  ];

  // Pattern per difetti
  const disadvantagePatterns = [
    { pattern: /no ascensore|senza ascensore|piano terra/i, label: 'No ascensore' },
    { pattern: /spese condominiali|condominio alto|spese/i, label: 'Spese condominiali alte' },
    { pattern: /piano terra|piano rialzato/i, label: 'Piano terra' },
    { pattern: /da ristrutturare|ristrutturazione|da rifare/i, label: 'Da ristrutturare' },
    { pattern: /rumoroso|rumore|traffico/i, label: 'Zona rumorosa' },
    { pattern: /piano basso|seminterrato/i, label: 'Piano basso' },
    { pattern: /senza parcheggio|no garage|no box/i, label: 'Senza parcheggio' },
    { pattern: /classe energetica [f-g]|bassa efficienza/i, label: 'Bassa efficienza energetica' },
    { pattern: /esposizione nord|poco luminoso/i, label: 'Poca luminosità' },
    { pattern: /strada principale|trafficata/i, label: 'Strada trafficata' },
    { pattern: /anni [0-9]{2}|datato|vecchio/i, label: 'Immobile datato' },
    { pattern: /difficile accesso|scale/i, label: 'Accesso difficile' },
  ];

  // Pattern per target
  const targetPatterns = [
    { pattern: /famiglia|famiglie|bambini|scuole/i, label: 'Famiglie' },
    { pattern: /investitore|investimento|rendita|affitto/i, label: 'Investitori' },
    { pattern: /studente|università|studenti/i, label: 'Studenti' },
    { pattern: /giovane|coppia|prima casa/i, label: 'Giovani coppie' },
    { pattern: /anziano|pensionato|terza età/i, label: 'Terza età' },
    { pattern: /professionista|business|ufficio/i, label: 'Professionisti' },
  ];

  const advantages: string[] = [];
  const disadvantages: string[] = [];
  const targetAudience: string[] = [];

  // Analizza vantaggi
  advantagePatterns.forEach(({ pattern, label }) => {
    if (pattern.test(fullText) && advantages.length < 3) {
      advantages.push(label);
    }
  });

  // Analizza difetti
  disadvantagePatterns.forEach(({ pattern, label }) => {
    if (pattern.test(fullText) && disadvantages.length < 3) {
      disadvantages.push(label);
    }
  });

  // Analizza target
  targetPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(fullText) && targetAudience.length < 2) {
      targetAudience.push(label);
    }
  });

  // Fallback se non trovati
  if (advantages.length === 0) {
    if (price && price < 200000) advantages.push('Prezzo competitivo');
    if (location.toLowerCase().includes('centro') || location.toLowerCase().includes('centro')) {
      advantages.push('Posizione centrale');
    }
  }

  if (disadvantages.length === 0) {
    // Nessun difetto rilevato = può essere un vantaggio
  }

  if (targetAudience.length === 0) {
    // Default basato su caratteristiche
    if (price && price < 150000) targetAudience.push('Giovani coppie');
    else if (price && price > 500000) targetAudience.push('Investitori');
    else targetAudience.push('Famiglie');
  }

  // Determina se ha vantaggio reale
  const hasRealAdvantage = advantages.length > 0 || (price !== null && price < 200000);

  // Genera riassunto per cliente
  const summaryForClient = generateClientSummary(
    title,
    location,
    price,
    advantages,
    disadvantages,
    targetAudience
  );

  return {
    advantages,
    disadvantages,
    targetAudience,
    hasRealAdvantage,
    summaryForClient,
  };
}

/**
 * Genera riassunto pulito per il cliente (senza dati sensibili)
 */
function generateClientSummary(
  title: string,
  location: string,
  price: number | null,
  advantages: string[],
  disadvantages: string[],
  targetAudience: string[]
): string {
  const priceText = price
    ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
    : 'Prezzo da definire';

  let summary = `🏠 ${title}\n`;
  summary += `📍 ${location}\n`;
  summary += `💰 ${priceText}\n\n`;

  if (advantages.length > 0) {
    summary += `✅ Vantaggi:\n`;
    advantages.forEach((adv) => {
      summary += `• ${adv}\n`;
    });
    summary += `\n`;
  }

  if (disadvantages.length > 0) {
    summary += `⚠️ Da considerare:\n`;
    disadvantages.forEach((dis) => {
      summary += `• ${dis}\n`;
    });
    summary += `\n`;
  }

  if (targetAudience.length > 0) {
    summary += `🎯 Ideale per: ${targetAudience.join(', ')}\n`;
  }

  summary += `\nVuoi maggiori dettagli? Scrivimi! 😊`;

  return summary;
}

