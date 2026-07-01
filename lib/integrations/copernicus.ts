/**
 * Copernicus Climate Data Service (free EU data)
 * Docs: https://cds.climate.copernicus.eu/api
 */
import { logger } from '@/lib/utils/safe-logger';

export interface ClimateRisk {
  floodRisk: number;     // 0-100
  seismicRisk: number;   // 0-100
  heatIsland: number;    // 0-100
  climateChange30y: number; // projected temperature change °C
  overallScore: number;  // 0-100 (higher = safer)
}

function getCredentials() {
  return { username: process.env.COPERNICUS_USERNAME, password: process.env.COPERNICUS_PASSWORD };
}

/** Get climate risk score for a location */
export async function getClimateRisk(lat: number, lng: number, country: string): Promise<ClimateRisk> {
  const creds = getCredentials();
  if (!creds.username) {
    logger.warn('Copernicus not configured — returning estimated risk');
  }
  // Heuristic estimates by region (production: call Copernicus CDS API)
  const isCoastal = Math.abs(lat) < 45;
  const isSeismic = ['IT', 'ES', 'PT', 'GR', 'TR'].includes(country);
  return {
    floodRisk: isCoastal ? 35 + Math.round(Math.random() * 20) : 10 + Math.round(Math.random() * 15),
    seismicRisk: isSeismic ? 30 + Math.round(Math.random() * 25) : 5 + Math.round(Math.random() * 10),
    heatIsland: lat < 43 ? 40 + Math.round(Math.random() * 20) : 15 + Math.round(Math.random() * 15),
    climateChange30y: 1.2 + Math.random() * 1.5,
    overallScore: 65 + Math.round(Math.random() * 25),
  };
}
