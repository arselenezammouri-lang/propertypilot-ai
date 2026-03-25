/**
 * AI Territory Analysis - Territory Commander
 * Mock analysis; copy localized via getTerritoryAnalysisStrings(locale).
 */

import type { Locale } from '@/lib/i18n/config';
import type {
  DnaCategoryId,
  TerritoryAnalysisStrings,
} from '@/lib/i18n/territory-analysis-strings';
import { getTerritoryAnalysisStrings } from '@/lib/i18n/territory-analysis-strings';

export type DemandLevel = 'cold' | 'warm' | 'hot';

export type { DnaCategoryId };

export interface DemandPulse {
  level: DemandLevel;
  score: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  velocity: number;
}

export interface NeighborhoodDNA {
  strengths: Array<{
    category: DnaCategoryId;
    icon: string;
    description: string;
    score: number;
  }>;
  weaknesses: Array<{
    category: DnaCategoryId;
    description: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  overallScore: number;
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
    opportunityScore: number;
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

function locHasAny(locationLower: string, keys: string[]): boolean {
  return keys.some((k) => locationLower.includes(k));
}

const EDU_KEYS = [
  'scuola',
  'liceo',
  'università',
  'universita',
  'school',
  'university',
  'college',
  'escuela',
  'universidad',
  'école',
  'ecole',
  'université',
  'universite',
  'schule',
  'universität',
  'universitat',
  'escola',
  'faculdade',
  'مدرسة',
  'جامعة',
];

const TRANSPORT_KEYS = [
  'metro',
  'tram',
  'stazione',
  'station',
  'fermata',
  'subway',
  'underground',
  'treno',
  'train',
  'bahnhof',
  'gare',
  'métro',
  'estación',
  'estacion',
  'tren',
  'محطة',
  'قطار',
];

const GREEN_KEYS = [
  'parco',
  'giardino',
  'verde',
  'park',
  'garden',
  'jardin',
  'jardín',
  'parc',
  'grün',
  'grun',
  'حديقة',
  'green',
];

const BUSINESS_KEYS = [
  'centro',
  'commerciale',
  'negozi',
  'uffici',
  'ufficio',
  'shopping',
  'downtown',
  'office',
  'commerce',
  'geschäft',
  'geschaft',
  'retail',
  'centro comercial',
  'zona comercial',
  'تجاري',
];

const HOT_ZONE_KEYS = [
  'centro',
  'milano',
  'roma centro',
  'navigli',
  'trastevere',
  'downtown',
  'midtown',
  'cbd',
  'city center',
  'centre ville',
  'centro ciudad',
  'وسط',
];

const WARM_ZONE_KEYS = ['zona', 'quartiere', 'neighborhood', 'district', 'barrio', 'quartier', 'stadtteil', 'bairro', 'periferia', 'suburb'];

export function analyzeDemandPulse(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL',
  strings: TerritoryAnalysisStrings,
  priceRange?: { min: number; max: number }
): DemandPulse {
  const locationLower = location.toLowerCase();

  let score = 50;
  let level: DemandLevel = 'warm';
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let velocity = 90;

  if (locHasAny(locationLower, HOT_ZONE_KEYS)) {
    score = 85;
    level = 'hot';
    trend = 'up';
    velocity = 45;
  } else if (locHasAny(locationLower, WARM_ZONE_KEYS)) {
    score = 60;
    level = 'warm';
    trend = 'stable';
    velocity = 75;
  } else {
    score = 35;
    level = 'cold';
    trend = 'down';
    velocity = 120;
  }

  if (propertyType === 'RESIDENTIAL_RENT') {
    score += 10;
    velocity = Math.max(30, velocity - 20);
  } else if (propertyType === 'COMMERCIAL') {
    score -= 5;
    velocity += 30;
  }

  void priceRange;

  return {
    level,
    score,
    description: strings.demandDescriptions[level],
    trend,
    velocity,
  };
}

export function generateNeighborhoodDNA(
  location: string,
  strings: TerritoryAnalysisStrings
): NeighborhoodDNA {
  const locationLower = location.toLowerCase();
  const strengths: NeighborhoodDNA['strengths'] = [];
  const weaknesses: NeighborhoodDNA['weaknesses'] = [];

  if (locHasAny(locationLower, EDU_KEYS)) {
    strengths.push({
      category: 'education',
      icon: '',
      description: strings.dna.educationStrengthDesc,
      score: 85,
    });
  } else {
    weaknesses.push({
      category: 'education',
      description: strings.dna.educationWeaknessDesc,
      impact: 'low',
    });
  }

  if (locHasAny(locationLower, TRANSPORT_KEYS)) {
    strengths.push({
      category: 'transport',
      icon: '',
      description: strings.dna.transportStrengthDesc,
      score: 90,
    });
  } else {
    weaknesses.push({
      category: 'transport',
      description: strings.dna.transportWeaknessDesc,
      impact: 'medium',
    });
  }

  if (locHasAny(locationLower, GREEN_KEYS)) {
    strengths.push({
      category: 'green',
      icon: '',
      description: strings.dna.greenStrengthDesc,
      score: 75,
    });
  }

  if (locHasAny(locationLower, BUSINESS_KEYS)) {
    strengths.push({
      category: 'business',
      icon: '',
      description: strings.dna.businessStrengthDesc,
      score: 80,
    });
  }

  if (locHasAny(locationLower, WARM_ZONE_KEYS) && !locationLower.includes('periferia') && !locationLower.includes('suburb')) {
    strengths.push({
      category: 'security',
      icon: '',
      description: strings.dna.securityStrengthDesc,
      score: 70,
    });
  }

  const overallScore =
    strengths.length > 0
      ? Math.round(strengths.reduce((sum, s) => sum + s.score, 0) / strengths.length)
      : 50;

  return {
    strengths,
    weaknesses,
    overallScore,
  };
}

export function calculateSoldVelocity(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL',
  strings: TerritoryAnalysisStrings
): SoldVelocity {
  const demandPulse = analyzeDemandPulse(location, propertyType, strings);
  const averageDays = demandPulse.velocity;

  let velocityCategory: SoldVelocity['velocityCategory'] = 'normal';
  if (averageDays < 30) velocityCategory = 'ultra-fast';
  else if (averageDays < 60) velocityCategory = 'fast';
  else if (averageDays < 90) velocityCategory = 'normal';
  else if (averageDays < 150) velocityCategory = 'slow';
  else velocityCategory = 'very-slow';

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

const COMMERCIAL_CENTRE_KEYS = [
  'centro',
  'downtown',
  'city center',
  'centre ville',
  'cbd',
  'uffici',
  'ufficio',
  'office',
  'مكتب',
];

const COMMERCIAL_EDU_KEYS = [...EDU_KEYS];

const RESIDENTIAL_KEYS = [
  'residenziale',
  'residential',
  'quartiere',
  'neighborhood',
  'barrio',
  'quartier',
  'wohn',
  'bairro',
  'سكني',
];

const PHARMACY_KEYS = ['farmacia', 'pharmacy', 'pharmacie', 'apotheke', 'farmácia', 'صيدلية'];

const FOOD_KEYS = ['food', 'ristorant', 'restaurant', 'gastro', 'مطعم'];

const PED_KEYS = ['pedonale', 'pedestrian', 'peatonal', 'piéton', 'fußgänger'];

export function generateCommercialIntelligence(
  location: string,
  strings: TerritoryAnalysisStrings
): CommercialIntelligence {
  const locationLower = location.toLowerCase();

  const recommendedActivities: CommercialIntelligence['recommendedActivities'] = [];
  const marketGaps: CommercialIntelligence['marketGaps'] = [];

  if (locHasAny(locationLower, COMMERCIAL_CENTRE_KEYS)) {
    recommendedActivities.push({
      activity: strings.commercial.coworkingActivity,
      reason: strings.commercial.coworkingReason,
      opportunityScore: 85,
    });
  }

  if (locHasAny(locationLower, COMMERCIAL_EDU_KEYS)) {
    recommendedActivities.push({
      activity: strings.commercial.barActivity,
      reason: strings.commercial.barReason,
      opportunityScore: 80,
    });
  }

  if (locHasAny(locationLower, RESIDENTIAL_KEYS)) {
    recommendedActivities.push({
      activity: strings.commercial.pharmacyActivity,
      reason: strings.commercial.pharmacyReason,
      opportunityScore: 75,
    });
  }

  if (!locHasAny(locationLower, PHARMACY_KEYS) && locHasAny(locationLower, RESIDENTIAL_KEYS)) {
    marketGaps.push({
      category: strings.commercial.gapPharmacyCategory,
      description: strings.commercial.gapPharmacyDesc,
      potential: 'high',
    });
  }

  if (locHasAny(locationLower, HOT_ZONE_KEYS) && !locHasAny(locationLower, FOOD_KEYS)) {
    marketGaps.push({
      category: strings.commercial.gapFoodCategory,
      description: strings.commercial.gapFoodDesc,
      potential: 'high',
    });
  }

  let footTraffic: 'high' | 'medium' | 'low' = 'medium';
  if (locHasAny(locationLower, [...HOT_ZONE_KEYS, ...PED_KEYS])) {
    footTraffic = 'high';
  } else if (locationLower.includes('periferia') || locationLower.includes('suburb')) {
    footTraffic = 'low';
  }

  let competitionLevel: 'low' | 'medium' | 'high' = 'medium';
  if (locHasAny(locationLower, [...HOT_ZONE_KEYS]) || locationLower.includes('commerciale') || locationLower.includes('commercial')) {
    competitionLevel = 'high';
  } else if (locationLower.includes('periferia') || locationLower.includes('suburb')) {
    competitionLevel = 'low';
  }

  return {
    recommendedActivities,
    marketGaps,
    footTraffic,
    competitionLevel,
  };
}

export function generateNeighborhoodPitch(
  insights: Omit<TerritoryInsights, 'neighborhoodPitch' | 'commercialIntelligence'>,
  strings: TerritoryAnalysisStrings
): string {
  let pitch = '';
  const days = String(insights.soldVelocity.averageDays);
  const p = strings.pitch;

  if (insights.demandPulse.level === 'hot') {
    pitch += p.hotIntro.replace('{days}', days);
  } else if (insights.demandPulse.level === 'warm') {
    pitch += p.warmIntro.replace('{days}', days);
  } else {
    pitch += p.coldIntro.replace('{days}', days);
  }

  if (insights.neighborhoodDNA.strengths.length > 0) {
    const topStrengths = insights.neighborhoodDNA.strengths.slice(0, 3);
    const count = String(insights.neighborhoodDNA.strengths.length);
    pitch += p.strengthsPrefix.replace('{count}', count);
    pitch +=
      topStrengths.map((s) => strings.categoryNames[s.category]).join(', ') + '. ';
  }

  if (insights.soldVelocity.trend === 'faster') {
    const daysDiff = String(
      insights.soldVelocity.comparison.cityAverage - insights.soldVelocity.comparison.neighborhoodAverage
    );
    pitch += p.fasterThanCity.replace('{daysDiff}', daysDiff);
  }

  if (insights.demandPulse.level === 'hot' && insights.neighborhoodDNA.overallScore > 75) {
    pitch += p.hotClosing.replace('{count}', String(insights.neighborhoodDNA.strengths.length));
  } else if (insights.demandPulse.level === 'warm') {
    pitch += p.warmClosing.replace('{days}', days);
  } else {
    pitch += p.coldClosing;
  }

  return pitch;
}

export function generateTerritoryInsights(
  location: string,
  propertyType: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL',
  locale: Locale,
  price?: number
): TerritoryInsights {
  const strings = getTerritoryAnalysisStrings(locale);
  const demandPulse = analyzeDemandPulse(
    location,
    propertyType,
    strings,
    price ? { min: price * 0.8, max: price * 1.2 } : undefined
  );
  const neighborhoodDNA = generateNeighborhoodDNA(location, strings);
  const soldVelocity = calculateSoldVelocity(location, propertyType, strings);

  let marketAdvice = '';
  const d = String(soldVelocity.averageDays);
  if (demandPulse.level === 'hot') {
    marketAdvice = strings.marketAdvice.hot.replace('{days}', d);
  } else if (demandPulse.level === 'warm') {
    marketAdvice = strings.marketAdvice.warm.replace('{days}', d);
  } else {
    marketAdvice = strings.marketAdvice.cold.replace('{days}', d);
  }

  if (neighborhoodDNA.overallScore > 75) {
    marketAdvice += strings.marketAdvice.strongDnaSuffix.replace(
      '{count}',
      String(neighborhoodDNA.strengths.length)
    );
  }

  let commercialIntelligence: CommercialIntelligence | undefined;
  if (propertyType === 'COMMERCIAL') {
    commercialIntelligence = generateCommercialIntelligence(location, strings);
  }

  const baseInsights = {
    location,
    demandPulse,
    neighborhoodDNA,
    soldVelocity,
    marketAdvice,
  };

  const neighborhoodPitch = generateNeighborhoodPitch(baseInsights, strings);

  return {
    ...baseInsights,
    commercialIntelligence,
    neighborhoodPitch,
  };
}
