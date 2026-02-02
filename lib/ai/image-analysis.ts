/**
 * AI Image Analysis - X-Ray Vision
 * Analisi tecnica avanzata delle immagini immobiliari
 */

export interface ImageDefect {
  id: string;
  type: 'defect' | 'premium';
  category: string;
  description: string;
  location: { x: number; y: number }; // Percentuali (0-100)
  severity: 'low' | 'medium' | 'high';
  estimatedCost?: number; // Per difetti
  valueIncrease?: number; // Per pregi
  confidence: number; // 0-100
}

export interface RenovationQuote {
  totalCost: number;
  items: Array<{
    category: string;
    description: string;
    cost: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  estimatedROI: number; // ROI stimato dopo ristrutturazione
  timeEstimate: string; // "2-3 mesi"
}

/**
 * Analizza un'immagine e rileva difetti/pregi
 * (Mock per ora, in produzione userà OpenAI Vision API)
 */
export async function analyzePropertyImage(
  imageUrl: string,
  propertyType: 'residential' | 'commercial'
): Promise<ImageDefect[]> {
  // Simula analisi AI (in produzione: OpenAI Vision API)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock data basato su pattern comuni
  const mockDefects: ImageDefect[] = [
    {
      id: '1',
      type: 'defect',
      category: 'Infissi',
      description: 'Infissi datati, probabile dispersione termica',
      location: { x: 15, y: 30 },
      severity: 'high',
      estimatedCost: 8000,
      confidence: 85,
    },
    {
      id: '2',
      type: 'premium',
      category: 'Pavimento',
      description: 'Parquet in ottimo stato, valore aggiunto',
      location: { x: 60, y: 70 },
      severity: 'low',
      valueIncrease: 5000,
      confidence: 90,
    },
    {
      id: '3',
      type: 'defect',
      category: 'Umidità',
      description: 'Possibile umidità di risalita, verifica necessaria',
      location: { x: 25, y: 85 },
      severity: 'medium',
      estimatedCost: 3500,
      confidence: 75,
    },
    {
      id: '4',
      type: 'premium',
      category: 'Marmo',
      description: 'Rivestimento in marmo di pregio',
      location: { x: 75, y: 25 },
      severity: 'low',
      valueIncrease: 8000,
      confidence: 95,
    },
    {
      id: '5',
      type: 'defect',
      category: 'Impianto Elettrico',
      description: 'Quadro elettrico datato, necessaria revisione',
      location: { x: 85, y: 60 },
      severity: 'high',
      estimatedCost: 2500,
      confidence: 80,
    },
  ];

  return mockDefects;
}

/**
 * Genera preventivo di ristrutturazione
 */
export function generateRenovationQuote(defects: ImageDefect[]): RenovationQuote {
  const defectItems = defects
    .filter((d) => d.type === 'defect')
    .map((d) => ({
      category: d.category,
      description: d.description,
      cost: d.estimatedCost || 0,
      priority: (d.severity === 'high' ? 'high' : d.severity === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    }))
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const totalCost = defectItems.reduce((sum, item) => sum + item.cost, 0);
  
  // Calcola ROI stimato (valore aggiunto - costi)
  const valueIncrease = defects
    .filter((d) => d.type === 'premium')
    .reduce((sum, d) => sum + (d.valueIncrease || 0), 0);
  
  const estimatedROI = valueIncrease > 0 
    ? ((valueIncrease - totalCost) / totalCost) * 100 
    : -50; // ROI negativo se solo costi

  // Stima tempo basata su complessità
  const highPriorityCount = defectItems.filter((i) => i.priority === 'high').length;
  const timeEstimate = highPriorityCount > 2 
    ? '3-4 mesi' 
    : highPriorityCount > 0 
    ? '2-3 mesi' 
    : '1-2 mesi';

  return {
    totalCost,
    items: defectItems,
    estimatedROI,
    timeEstimate,
  };
}

/**
 * Genera insight di Aria basato sull'analisi
 */
export function generateAriaInsight(
  defects: ImageDefect[],
  quote: RenovationQuote,
  propertyPrice: number
): string {
  const highSeverityDefects = defects.filter((d) => d.type === 'defect' && d.severity === 'high');
  const premiumFeatures = defects.filter((d) => d.type === 'premium');
  
  let insight = '';

  if (highSeverityDefects.length > 0) {
    const mainDefect = highSeverityDefects[0];
    const defectPercentage = (mainDefect.estimatedCost || 0) / propertyPrice * 100;
    
    insight += `Capo, questa casa ha un potenziale enorme, ma ${mainDefect.category.toLowerCase()} `;
    insight += `mangiano il ${defectPercentage.toFixed(1)}% del valore. `;
    insight += `Usalo come leva per abbassare il prezzo di €${Math.round(mainDefect.estimatedCost || 0) / 1000}k. `;
  }

  if (premiumFeatures.length > 0) {
    const totalValueIncrease = premiumFeatures.reduce((sum, p) => sum + (p.valueIncrease || 0), 0);
    insight += `Inoltre, ho rilevato elementi di pregio che aumentano il valore di €${Math.round(totalValueIncrease / 1000)}k. `;
  }

  if (quote.estimatedROI > 20) {
    insight += `Il ROI dopo ristrutturazione è del ${quote.estimatedROI.toFixed(0)}%. Affare d'oro! 🏆`;
  } else if (quote.estimatedROI > 0) {
    insight += `Il ROI è positivo (${quote.estimatedROI.toFixed(0)}%), ma valuta bene i tempi di ristrutturazione.`;
  } else {
    insight += `Attenzione: il ROI è negativo. Valuta se il prezzo d'acquisto compensa i costi di ristrutturazione.`;
  }

  return insight;
}

