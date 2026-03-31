/**
 * PropertyPilot AI - Global Geo-Detection Engine
 * Automatically detects user region and adapts the platform experience
 */

export type Region = 'usa' | 'europe' | 'middleeast' | 'global';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED';

export interface GeoConfig {
  region: Region;
  currency: Currency;
  currencySymbol: string;
  primaryPortals: string[];
  secondaryPortals: string[];
  defaultLanguage: string;
  taxInfo: string;
  measurementUnit: 'sqft' | 'sqm';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
  phoneFormat: string;
}

const REGION_CONFIGS: Record<Region, GeoConfig> = {
  usa: {
    region: 'usa',
    currency: 'USD',
    currencySymbol: '$',
    primaryPortals: ['Zillow', 'MLS', 'Realtor.com', 'Redfin'],
    secondaryPortals: ['Trulia', 'Homes.com'],
    defaultLanguage: 'en',
    taxInfo: 'US tax regulations apply. Consult a CPA for 1099 requirements.',
    measurementUnit: 'sqft',
    dateFormat: 'MM/DD/YYYY',
    phoneFormat: '+1 (XXX) XXX-XXXX',
  },
  europe: {
    region: 'europe',
    currency: 'EUR',
    currencySymbol: '€',
    primaryPortals: ['Idealista', 'Immobiliare.it', 'Casa.it', 'Fotocasa'],
    secondaryPortals: ['Subito.it', 'Rightmove', 'SeLoger'],
    defaultLanguage: 'it',
    taxInfo: 'EU VAT regulations apply. Consult local tax advisor for invoicing requirements.',
    measurementUnit: 'sqm',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+39 XXX XXX XXXX',
  },
  middleeast: {
    region: 'middleeast',
    currency: 'AED',
    currencySymbol: 'AED',
    primaryPortals: ['PropertyFinder', 'Bayut', 'Dubizzle'],
    secondaryPortals: ['JustProperty', 'Propertyscanner'],
    defaultLanguage: 'ar',
    taxInfo: 'UAE has 0% income tax. DLD fees apply for property transactions.',
    measurementUnit: 'sqft',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+971 XX XXX XXXX',
  },
  global: {
    region: 'global',
    currency: 'USD',
    currencySymbol: '$',
    primaryPortals: ['Zillow', 'Idealista', 'PropertyFinder'],
    secondaryPortals: ['MLS', 'Immobiliare.it', 'Bayut'],
    defaultLanguage: 'en',
    taxInfo: 'Consult local tax advisor for applicable regulations.',
    measurementUnit: 'sqm',
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '+1 XXX XXX XXXX',
  },
};

const COUNTRY_TO_REGION: Record<string, Region> = {
  US: 'usa', CA: 'usa',
  IT: 'europe', ES: 'europe', FR: 'europe', DE: 'europe', PT: 'europe',
  GB: 'europe', NL: 'europe', BE: 'europe', AT: 'europe', CH: 'europe',
  PL: 'europe', CZ: 'europe', GR: 'europe', IE: 'europe', SE: 'europe',
  AE: 'middleeast', SA: 'middleeast', QA: 'middleeast', KW: 'middleeast',
  BH: 'middleeast', OM: 'middleeast',
};

const TIMEZONE_TO_REGION: Record<string, Region> = {
  'America/New_York': 'usa',
  'America/Chicago': 'usa',
  'America/Denver': 'usa',
  'America/Los_Angeles': 'usa',
  'America/Toronto': 'usa',
  'Europe/Rome': 'europe',
  'Europe/Madrid': 'europe',
  'Europe/Paris': 'europe',
  'Europe/Berlin': 'europe',
  'Europe/London': 'europe',
  'Europe/Amsterdam': 'europe',
  'Europe/Lisbon': 'europe',
  'Asia/Dubai': 'middleeast',
  'Asia/Riyadh': 'middleeast',
  'Asia/Qatar': 'middleeast',
};

export function detectRegionFromTimezone(timezone: string): Region {
  return TIMEZONE_TO_REGION[timezone] || 'global';
}

export function detectRegionFromCountryCode(countryCode: string): Region {
  return COUNTRY_TO_REGION[countryCode?.toUpperCase()] || 'global';
}

export function detectRegionFromIP(ipInfo: { country?: string; timezone?: string }): Region {
  if (ipInfo.country) {
    return detectRegionFromCountryCode(ipInfo.country);
  }
  if (ipInfo.timezone) {
    return detectRegionFromTimezone(ipInfo.timezone);
  }
  return 'global';
}

export function getGeoConfig(region: Region): GeoConfig {
  return REGION_CONFIGS[region] || REGION_CONFIGS.global;
}

export function formatPrice(amount: number, config: GeoConfig): string {
  const formatter = new Intl.NumberFormat(
    config.region === 'usa' ? 'en-US' : config.region === 'europe' ? 'de-DE' : 'en-AE',
    {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
  return formatter.format(amount);
}

export function formatArea(sqm: number, config: GeoConfig): string {
  if (config.measurementUnit === 'sqft') {
    const sqft = Math.round(sqm * 10.764);
    return `${sqft.toLocaleString()} sq ft`;
  }
  return `${sqm.toLocaleString()} m²`;
}

export function getAITaxAdvice(region: Region): string {
  const config = getGeoConfig(region);
  return config.taxInfo;
}

export function detectRegionFromBrowser(): Region {
  if (typeof window === 'undefined') return 'global';
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return detectRegionFromTimezone(timezone);
  } catch {
    return 'global';
  }
}

export function getPortalPriority(region: Region): { primary: string[]; secondary: string[] } {
  const config = getGeoConfig(region);
  return {
    primary: config.primaryPortals,
    secondary: config.secondaryPortals,
  };
}
