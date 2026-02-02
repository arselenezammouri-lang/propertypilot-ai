'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Region,
  GeoConfig,
  getGeoConfig,
  detectRegionFromBrowser,
  formatPrice as formatPriceFn,
  formatArea as formatAreaFn,
  getPortalPriority
} from '@/lib/geo/geo-detection';

interface GeoContextValue {
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

const GeoContext = createContext<GeoContextValue | undefined>(undefined);

const STORAGE_KEY = 'propertypilot-region';

export function GeoProvider({ children }: { children: ReactNode }) {
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

  const value: GeoContextValue = {
    region,
    config,
    isLoading,
    formatPrice: (amount: number) => formatPriceFn(amount, config),
    formatArea: (sqm: number) => formatAreaFn(sqm, config),
    primaryPortals: portals.primary,
    secondaryPortals: portals.secondary,
    isUSA: region === 'usa',
    isEurope: region === 'europe',
    isMiddleEast: region === 'middleeast',
    setRegion,
  };

  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}

export function useGeo(): GeoContextValue {
  const context = useContext(GeoContext);
  if (context === undefined) {
    throw new Error('useGeo must be used within a GeoProvider');
  }
  return context;
}

export default GeoContext;
