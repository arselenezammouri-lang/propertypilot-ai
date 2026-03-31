/**
 * Smart Briefing Multidimensionale
 * Analisi AI specifica per categoria immobiliare
 */

import { PropertyCategory } from '@/lib/utils/property-category';
import { extractBusinessFeatures } from '@/lib/utils/property-category';
import { calculateExpectedYield } from '@/lib/utils/property-category';

export interface SmartBriefingResult {
  advantages: string[];
  disadvantages: string[];
  target: string[];
  categorySpecific: {
    expectedYield?: number;
    businessFeatures?: string[];
    rentalAdvice?: string;
    commercialAdvice?: string;
  };
  hasRealAdvantage: boolean;
  clientReadySummary: string;
}

/**
 * Genera Smart Briefing basato sulla categoria
 */
export async function generateMultiCategoryBriefing(
  title: string,
  description: string,
  price: number,
  location: string,
  category: PropertyCategory,
  marketAvgPrice?: number
): Promise<SmartBriefingResult> {
  const lowerDesc = description.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Analisi base (vantaggi/difetti/target)
  const advantages: string[] = [];
  const disadvantages: string[] = [];
  const target: string[] = [];

  // Analisi per categoria
  let expectedYield: number | undefined;
  let businessFeatures: string[] = [];
  let rentalAdvice: string | undefined;
  let commercialAdvice: string | undefined;

  if (category === 'RESIDENTIAL_RENT') {
    // Calcola Expected Yield se abbiamo prezzo affitto e valore stimato
    if (price && marketAvgPrice) {
      expectedYield = calculateExpectedYield(price, marketAvgPrice);
    }

    // Analisi per affitti
    if (lowerDesc.includes('arredato') || lowerTitle.includes('arredato')) {
      advantages.push('Arredato e pronto all\'uso');
    }
    if (lowerDesc.includes('ristrutturato') || lowerTitle.includes('ristrutturato')) {
      advantages.push('Ristrutturato di recente');
    }
    if (lowerDesc.includes('balcone') || lowerDesc.includes('terrazzo')) {
      advantages.push('Spazio esterno');
    }
    if (lowerDesc.includes('ascensore')) {
      advantages.push('Con ascensore');
    } else if (lowerDesc.includes('piano terra') || lowerDesc.includes('primo piano')) {
      advantages.push('Piano comodo');
    }

    // Target per affitti
    if (lowerDesc.includes('monolocale') || lowerDesc.includes('bilocale')) {
      target.push('Studenti');
      target.push('Giovani professionisti');
      rentalAdvice = 'Ottimo per studenti o giovani professionisti. Contratto transitorio consigliato per massimizzare il rendimento.';
    } else if (lowerDesc.includes('villa') || lowerDesc.includes('casa indipendente')) {
      target.push('Famiglie');
      rentalAdvice = 'Ideale per famiglie. Contratto a lungo termine consigliato per stabilità.';
    } else {
      target.push('Coppie');
      target.push('Piccole famiglie');
      rentalAdvice = 'Perfetto per coppie o piccole famiglie. Contratto standard 4+4 anni.';
    }

    // Difetti comuni per affitti
    if (lowerDesc.includes('spese condominiali') && lowerDesc.includes('alte')) {
      disadvantages.push('Spese condominiali elevate');
    }
    if (lowerDesc.includes('piano terra') && !lowerDesc.includes('giardino')) {
      disadvantages.push('Piano terra senza giardino');
    }

  } else if (category === 'COMMERCIAL') {
    // Estrai business features
    businessFeatures = extractBusinessFeatures(description);

    // Analisi commerciale
    if (lowerDesc.includes('vetrina') || lowerDesc.includes('vetrina su strada')) {
      advantages.push('Vetrina su strada principale');
    }
    if (lowerDesc.includes('canna fumaria')) {
      advantages.push('Canna fumaria presente');
    }
    if (lowerDesc.includes('centro storico') || lowerDesc.includes('centro città')) {
      advantages.push('Zona centrale ad alto passaggio');
    }
    if (lowerDesc.includes('parcheggio') || lowerDesc.includes('posto auto')) {
      advantages.push('Parcheggio disponibile');
    }

    // Target commerciale
    if (lowerDesc.includes('bar') || lowerDesc.includes('caffè') || lowerDesc.includes('ristorante')) {
      target.push('Food & Beverage');
      commercialAdvice = 'Ideale per attività Food & Beverage. Zona ad alto passaggio pedonale.';
    } else if (lowerDesc.includes('negozio') || lowerDesc.includes('retail')) {
      target.push('Retail');
      commercialAdvice = 'Perfetto per negozi retail. Vetrina su strada principale.';
    } else if (lowerDesc.includes('ufficio') || lowerDesc.includes('uffici')) {
      target.push('Uffici');
      commercialAdvice = 'Ideale per uffici professionali. Zona centrale e ben collegata.';
    } else {
      target.push('Attività commerciali');
      commercialAdvice = 'Versatile per diverse attività commerciali.';
    }

    // Difetti commerciali
    if (!lowerDesc.includes('canna fumaria') && (lowerDesc.includes('bar') || lowerDesc.includes('ristorante'))) {
      disadvantages.push('Nessuna canna fumaria (limitante per ristoranti)');
    }
    if (lowerDesc.includes('piano superiore') && !lowerDesc.includes('ascensore')) {
      disadvantages.push('Piano superiore senza ascensore');
    }

  } else {
    // RESIDENTIAL_SALE - Logica esistente
    if (price && marketAvgPrice && price < marketAvgPrice * 0.9) {
      advantages.push(`Sotto prezzo di mercato (-${Math.round(((marketAvgPrice - price) / marketAvgPrice) * 100)}%)`);
    }
    if (lowerDesc.includes('ampio') || lowerDesc.includes('spazioso')) {
      advantages.push('Ampia metratura');
    }
    if (lowerDesc.includes('centro') || lowerDesc.includes('centrale')) {
      advantages.push('Posizione centrale');
    }

    if (!lowerDesc.includes('ascensore') && (lowerDesc.includes('piano') || lowerDesc.includes('piani'))) {
      disadvantages.push('Nessun ascensore');
    }
    if (lowerDesc.includes('spese condominiali') && lowerDesc.includes('alte')) {
      disadvantages.push('Spese condominiali elevate');
    }

    if (lowerDesc.includes('villa') || lowerDesc.includes('casa indipendente')) {
      target.push('Famiglie');
    } else if (lowerDesc.includes('monolocale') || lowerDesc.includes('bilocale')) {
      target.push('Giovani coppie');
      target.push('Investitori');
    } else {
      target.push('Famiglie');
      target.push('Investitori');
    }
  }

  // Genera summary per il cliente
  let clientReadySummary = `📍 ${location}\n\n`;
  
  if (category === 'RESIDENTIAL_RENT' && expectedYield) {
    clientReadySummary += `💰 Rendimento annuo: ${expectedYield.toFixed(1)}%\n`;
  }
  
  if (advantages.length > 0) {
    clientReadySummary += `✅ Vantaggi: ${advantages.slice(0, 3).join(', ')}\n`;
  }
  
  if (target.length > 0) {
    clientReadySummary += `🎯 Target: ${target.join(', ')}\n`;
  }

  return {
    advantages,
    disadvantages,
    target,
    categorySpecific: {
      expectedYield,
      businessFeatures,
      rentalAdvice,
      commercialAdvice,
    },
    hasRealAdvantage: advantages.length > 0 || expectedYield !== undefined || businessFeatures.length > 0,
    clientReadySummary,
  };
}

