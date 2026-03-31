/**
 * AI Territory Analysis - Territory Commander
 * Analisi avanzata del territorio e della domanda immobiliare
 */

export type DemandLevel = 'cold' | 'warm' | 'hot';

export interface DemandPulse {
  level: DemandLevel;
  score: number; // 0-100
  description: string;
  trend: 'up' | 'down' | 'stable';
  velocity: number; // giorni medi per vendita
}

export interface NeighborhoodDNA {
  strengths: Array<{
    category: string;
    icon: string;
    description: string;
    score: number; // 0-100
  }>;
  weaknesses: Array<{
    category: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  overallScore: number; // 0-100
}

export interface SoldVelocity {
  averageDays: number;
  trend: 'faster' | 'slower' | 'stable';
  comparison: {
    cityAverage: number;
    neighborhoodAverage: number;
  };
  velocityCategory: 'ultra-fast' | 'fast' | 'normal' | 'slow' | 'very-slow';
}

export interface CommercialIntelligence {
  recommendedActivities: Array<{
    activity: string;
    reason: string;
    opportunityScore: number; // 0-100
  }>;
  marketGaps: Array<{
    category: string;
    description: string;
    potential: 'high' | 'medium' | 'low';
  }>;
  footTraffic: 'high' | 'medium' | 'low';
  competitionLevel: 'low' | 'medium' | 'high';
}

export interface TerritoryInsights {
  location: string;
  demandPulse: DemandPulse;
  neighborhoodDNA: NeighborhoodDNA;
  soldVelocity: SoldVelocity;
  marketAdvice: string;
  commercialIntelligence?: CommercialIntelligence;
  neighborhoodPitch: string;
}

/**
 * Analizza la domanda per un tipo di immobile in una zona
 */
export function analyzeDemandPulse(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL',
  priceRange?: { min: number; max: number }
): DemandPulse {
  // Mock analysis (in produzione: integrare con dati reali da portali)
  const locationLower = location.toLowerCase();
  
  // Logica semplificata per determinare domanda
  let score = 50; // Base
  let level: DemandLevel = 'warm';
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let velocity = 90; // giorni medi

  // Zone calde (centro città, zone trendy)
  if (
    locationLower.includes('centro') ||
    locationLower.includes('milano') ||
    locationLower.includes('roma centro') ||
    locationLower.includes('navigli') ||
    locationLower.includes('trastevere')
  ) {
    score = 85;
    level = 'hot';
    trend = 'up';
    velocity = 45;
  }
  // Zone tiepide (periferie ben collegate)
  else if (
    locationLower.includes('zona') ||
    locationLower.includes('quartiere') ||
    locationLower.includes('periferia')
  ) {
    score = 60;
    level = 'warm';
    trend = 'stable';
    velocity = 75;
  }
  // Zone fredde (periferie lontane)
  else {
    score = 35;
    level = 'cold';
    trend = 'down';
    velocity = 120;
  }

  // Aggiusta per tipo immobile
  if (propertyType === 'RESIDENTIAL_RENT') {
    score += 10; // Affitti sempre più richiesti
    velocity = Math.max(30, velocity - 20);
  } else if (propertyType === 'COMMERCIAL') {
    score -= 5; // Commerciale più difficile
    velocity += 30;
  }

  const descriptions = {
    hot: 'Bollente - Domanda altissima, immobili venduti in poche settimane',
    warm: 'Tiepida - Domanda buona, tempi di vendita nella media',
    cold: 'Fredda - Domanda bassa, tempi di vendita lunghi',
  };

  return {
    level,
    score,
    description: descriptions[level],
    trend,
    velocity,
  };
}

/**
 * Genera Neighborhood DNA - punti di forza del quartiere
 */
export function generateNeighborhoodDNA(location: string): NeighborhoodDNA {
  const locationLower = location.toLowerCase();
  const strengths: NeighborhoodDNA['strengths'] = [];
  const weaknesses: NeighborhoodDNA['weaknesses'] = [];

  // Analisi scuole
  if (locationLower.includes('scuola') || locationLower.includes('liceo') || locationLower.includes('università')) {
    strengths.push({
      category: 'Istruzione',
      icon: '🎓',
      description: 'Presenza di scuole e università nelle vicinanze',
      score: 85,
    });
  } else {
    weaknesses.push({
      category: 'Istruzione',
      description: 'Poche scuole nelle immediate vicinanze',
      impact: 'low',
    });
  }

  // Analisi trasporti
  if (
    locationLower.includes('metro') ||
    locationLower.includes('tram') ||
    locationLower.includes('stazione') ||
    locationLower.includes('fermata')
  ) {
    strengths.push({
      category: 'Trasporti',
      icon: '🚇',
      description: 'Ottimi collegamenti con mezzi pubblici',
      score: 90,
    });
  } else {
    weaknesses.push({
      category: 'Trasporti',
      description: 'Collegamenti pubblici limitati',
      impact: 'medium',
    });
  }

  // Analisi parchi
  if (locationLower.includes('parco') || locationLower.includes('giardino') || locationLower.includes('verde')) {
    strengths.push({
      category: 'Verde',
      icon: '🌳',
      description: 'Aree verdi e parchi nelle vicinanze',
      score: 75,
    });
  }

  // Analisi business density
  if (
    locationLower.includes('centro') ||
    locationLower.includes('commerciale') ||
    locationLower.includes('negozi') ||
    locationLower.includes('uffici')
  ) {
    strengths.push({
      category: 'Business',
      icon: '🏢',
      description: 'Alta densità commerciale e uffici',
      score: 80,
    });
  }

  // Analisi sicurezza (mock)
  if (locationLower.includes('zona') && !locationLower.includes('periferia')) {
    strengths.push({
      category: 'Sicurezza',
      icon: '🛡️',
      description: 'Zona residenziale tranquilla',
      score: 70,
    });
  }

  // Calcola overall score
  const overallScore = strengths.length > 0
    ? Math.round(strengths.reduce((sum, s) => sum + s.score, 0) / strengths.length)
    : 50;

  return {
    strengths,
    weaknesses,
    overallScore,
  };
}

/**
 * Calcola Sold Velocity - tempo medio di vendita
 */
export function calculateSoldVelocity(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL'
): SoldVelocity {
  const demandPulse = analyzeDemandPulse(location, propertyType);
  const averageDays = demandPulse.velocity;

  // Calcola categoria velocità
  let velocityCategory: SoldVelocity['velocityCategory'] = 'normal';
  if (averageDays < 30) velocityCategory = 'ultra-fast';
  else if (averageDays < 60) velocityCategory = 'fast';
  else if (averageDays < 90) velocityCategory = 'normal';
  else if (averageDays < 150) velocityCategory = 'slow';
  else velocityCategory = 'very-slow';

  // Mock comparison (in produzione: dati reali)
  const cityAverage = propertyType === 'RESIDENTIAL_RENT' ? 40 : 90;
  const neighborhoodAverage = averageDays;

  let trend: 'faster' | 'slower' | 'stable' = 'stable';
  if (neighborhoodAverage < cityAverage * 0.8) trend = 'faster';
  else if (neighborhoodAverage > cityAverage * 1.2) trend = 'slower';

  return {
    averageDays,
    trend,
    comparison: {
      cityAverage,
      neighborhoodAverage,
    },
    velocityCategory,
  };
}

/**
 * Genera Commercial Intelligence per immobili commerciali
 */
export function generateCommercialIntelligence(location: string): CommercialIntelligence {
  const locationLower = location.toLowerCase();
  
  const recommendedActivities: CommercialIntelligence['recommendedActivities'] = [];
  const marketGaps: CommercialIntelligence['marketGaps'] = [];
  
  // Analisi attività consigliate
  if (locationLower.includes('centro') || locationLower.includes('uffici')) {
    recommendedActivities.push({
      activity: 'Coworking',
      reason: 'Zona centrale con alta densità di professionisti',
      opportunityScore: 85,
    });
  }
  
  if (locationLower.includes('scuola') || locationLower.includes('università')) {
    recommendedActivities.push({
      activity: 'Bar/Caffetteria',
      reason: 'Alta presenza di studenti e giovani',
      opportunityScore: 80,
    });
  }
  
  if (locationLower.includes('residenziale') || locationLower.includes('quartiere')) {
    recommendedActivities.push({
      activity: 'Farmacia',
      reason: 'Zona residenziale con potenziale bisogno di servizi sanitari',
      opportunityScore: 75,
    });
  }
  
  // Analisi gap di mercato
  if (!locationLower.includes('farmacia') && (locationLower.includes('residenziale') || locationLower.includes('quartiere'))) {
    marketGaps.push({
      category: 'Farmacie',
      description: 'Mancanza di farmacie in zona - Opportunità di mercato',
      potential: 'high',
    });
  }
  
  if (locationLower.includes('centro') && !locationLower.includes('food')) {
    marketGaps.push({
      category: 'Food & Beverage',
      description: 'Alta domanda per ristoranti e bar in zona centrale',
      potential: 'high',
    });
  }
  
  // Analisi foot traffic
  let footTraffic: 'high' | 'medium' | 'low' = 'medium';
  if (locationLower.includes('centro') || locationLower.includes('pedonale')) {
    footTraffic = 'high';
  } else if (locationLower.includes('periferia') || locationLower.includes('zona')) {
    footTraffic = 'low';
  }
  
  // Analisi competizione
  let competitionLevel: 'low' | 'medium' | 'high' = 'medium';
  if (locationLower.includes('centro') || locationLower.includes('commerciale')) {
    competitionLevel = 'high';
  } else if (locationLower.includes('periferia')) {
    competitionLevel = 'low';
  }
  
  return {
    recommendedActivities,
    marketGaps,
    footTraffic,
    competitionLevel,
  };
}

/**
 * Genera Pitch di Quartiere per Aria
 */
export function generateNeighborhoodPitch(
  insights: Omit<TerritoryInsights, 'neighborhoodPitch' | 'commercialIntelligence'>
): string {
  let pitch = '';
  
  // Inizio con domanda
  if (insights.demandPulse.level === 'hot') {
    pitch += `🔥 Zona BOLLENTE! La domanda è altissima - gli immobili qui si vendono in media in ${insights.soldVelocity.averageDays} giorni. `;
  } else if (insights.demandPulse.level === 'warm') {
    pitch += `🌡️ Zona TIEPIDA con buona domanda - tempi di vendita nella media (${insights.soldVelocity.averageDays} giorni). `;
  } else {
    pitch += `❄️ Zona FREDDA - tempi di vendita più lunghi (${insights.soldVelocity.averageDays} giorni), ma opportunità per investitori pazienti. `;
  }
  
  // Aggiungi punti di forza
  if (insights.neighborhoodDNA.strengths.length > 0) {
    const topStrengths = insights.neighborhoodDNA.strengths.slice(0, 3);
    pitch += `Il quartiere ha ${insights.neighborhoodDNA.strengths.length} punti di forza: `;
    pitch += topStrengths.map(s => s.category.toLowerCase()).join(', ') + '. ';
  }
  
  // Aggiungi velocità
  if (insights.soldVelocity.trend === 'faster') {
    pitch += `I tempi di vendita sono ${insights.soldVelocity.comparison.cityAverage - insights.soldVelocity.comparison.neighborhoodAverage} giorni più veloci della media città - segno di mercato dinamico. `;
  }
  
  // Conclusione strategica
  if (insights.demandPulse.level === 'hot' && insights.neighborhoodDNA.overallScore > 75) {
    pitch += `Usa questi dati per convincere: "Questa zona è tra le più richieste della città, con ${insights.neighborhoodDNA.strengths.length} vantaggi strategici. Gli immobili qui si vendono rapidamente - non perdere l'opportunità."`;
  } else if (insights.demandPulse.level === 'warm') {
    pitch += `Pitch strategico: "Zona in crescita con ottime infrastrutture. Tempi di vendita nella media, ma con il prezzo giusto e un buon staging, puoi chiudere in ${insights.soldVelocity.averageDays} giorni."`;
  } else {
    pitch += `Pitch per investitori: "Zona con potenziale inespresso. Prezzo competitivo e investimento mirato possono trasformare questo immobile in un affare d'oro."`;
  }
  
  return pitch;
}

/**
 * Genera insight completo del territorio
 */
export function generateTerritoryInsights(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL',
  price?: number
): TerritoryInsights {
  const demandPulse = analyzeDemandPulse(location, propertyType, price ? { min: price * 0.8, max: price * 1.2 } : undefined);
  const neighborhoodDNA = generateNeighborhoodDNA(location);
  const soldVelocity = calculateSoldVelocity(location, propertyType);

  // Genera consiglio di mercato
  let marketAdvice = '';
  if (demandPulse.level === 'hot') {
    marketAdvice = `🔥 Zona BOLLENTE! La domanda è altissima. Prezzi competitivi e tempi di esposizione brevi (${soldVelocity.averageDays} giorni). Ottima opportunità per vendite rapide.`;
  } else if (demandPulse.level === 'warm') {
    marketAdvice = `🌡️ Zona TIEPIDA. Domanda buona ma non eccezionale. Tempi di vendita nella media (${soldVelocity.averageDays} giorni). Strategia: prezzo competitivo e staging professionale.`;
  } else {
    marketAdvice = `❄️ Zona FREDDA. Domanda bassa, tempi di vendita lunghi (${soldVelocity.averageDays} giorni). Strategia: prezzo aggressivo o investimento in migliorie per aumentare appeal.`;
  }

  if (neighborhoodDNA.overallScore > 75) {
    marketAdvice += ` Il quartiere ha un DNA forte (${neighborhoodDNA.strengths.length} punti di forza). Usa questi come leva di vendita.`;
  }

  // Commercial Intelligence (solo per commerciale)
  let commercialIntelligence: CommercialIntelligence | undefined;
  if (propertyType === 'COMMERCIAL') {
    commercialIntelligence = generateCommercialIntelligence(location);
  }

  // Genera base insights
  const baseInsights = {
    location,
    demandPulse,
    neighborhoodDNA,
    soldVelocity,
    marketAdvice,
  };

  // Genera Pitch di Quartiere
  const neighborhoodPitch = generateNeighborhoodPitch(baseInsights);

  return {
    ...baseInsights,
    commercialIntelligence,
    neighborhoodPitch,
  };
}

