'use client';

/**
 * PropertyPilot AI - useGeoConfig Hook
 * Provides region-aware configuration for the entire application
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Region,
  GeoConfig,
  getGeoConfig,
  detectRegionFromBrowser,
  formatPrice,
  formatArea,
  getPortalPriority
} from '@/lib/geo/geo-detection';

interface UseGeoConfigResult {
  region: Region;
  config: GeoConfig;
  isLoading: boolean;
  formatPrice: (amount: number) => string;
  formatArea: (sqm: number) => string;
  primaryPortals: string[];
  secondaryPortals: string[];
  isUSA: boolean;
  isEurope: boolean;
  isMiddleEast: boolean;
  setRegion: (region: Region) => void;
}

const STORAGE_KEY = 'propertypilot-region';

export function useGeoConfig(): UseGeoConfigResult {
  const [region, setRegionState] = useState<Region>('global');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRegion = localStorage.getItem(STORAGE_KEY) as Region | null;
    
    if (savedRegion && ['usa', 'europe', 'middleeast', 'global'].includes(savedRegion)) {
      setRegionState(savedRegion);
    } else {
      const detected = detectRegionFromBrowser();
      setRegionState(detected);
      localStorage.setItem(STORAGE_KEY, detected);
    }
    
    setIsLoading(false);
  }, []);

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem(STORAGE_KEY, newRegion);
  };

  const config = useMemo(() => getGeoConfig(region), [region]);
  const portals = useMemo(() => getPortalPriority(region), [region]);

  return {
    region,
    config,
    isLoading,
    formatPrice: (amount: number) => formatPrice(amount, config),
    formatArea: (sqm: number) => formatArea(sqm, config),
    primaryPortals: portals.primary,
    secondaryPortals: portals.secondary,
    isUSA: region === 'usa',
    isEurope: region === 'europe',
    isMiddleEast: region === 'middleeast',
    setRegion,
  };
}

export default useGeoConfig;
