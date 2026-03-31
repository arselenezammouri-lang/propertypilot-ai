'use client';

import { useGeo } from '@/contexts/geo-context';
import { ExternalLink, Globe, TrendingUp } from 'lucide-react';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';

interface PortalInfo {
  name: string;
  url: string;
  logo: string;
}

const PORTAL_DATA: Record<string, PortalInfo> = {
  'Zillow': { name: 'Zillow', url: 'https://zillow.com', logo: '🏠' },
  'MLS': { name: 'MLS', url: 'https://mls.com', logo: '📋' },
  'Realtor.com': { name: 'Realtor.com', url: 'https://realtor.com', logo: '🏡' },
  'Redfin': { name: 'Redfin', url: 'https://redfin.com', logo: '🔴' },
  'Idealista': { name: 'Idealista', url: 'https://idealista.it', logo: '🇮🇹' },
  'Immobiliare.it': { name: 'Immobiliare.it', url: 'https://immobiliare.it', logo: '🏢' },
  'Casa.it': { name: 'Casa.it', url: 'https://casa.it', logo: '🏠' },
  'Fotocasa': { name: 'Fotocasa', url: 'https://fotocasa.es', logo: '📷' },
  'PropertyFinder': { name: 'PropertyFinder', url: 'https://propertyfinder.ae', logo: '🌴' },
  'Bayut': { name: 'Bayut', url: 'https://bayut.com', logo: '🏗️' },
  'Dubizzle': { name: 'Dubizzle', url: 'https://dubizzle.com', logo: '🌆' },
};

export function RegionalPortals() {
  const { primaryPortals, secondaryPortals, region, config, isLoading } = useGeo();
  const { locale } = useLocaleContext();

  if (isLoading) {
    return (
      <div className="pp-card p-4 animate-pulse">
        <div className="h-4 bg-muted/50 rounded w-32 mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 w-20 bg-muted/30 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const regionLabels: Record<string, string> = {
    usa: 'United States',
    europe: 'Europe',
    middleeast: 'Middle East',
    global: 'Global',
  };
  const t = {
    it: {
      title: 'Portali Prioritari',
      primaryMarkets: 'Mercati Primari',
      secondaryMarkets: 'Mercati Secondari',
      currency: 'Valuta',
      units: 'Unità',
    },
    en: {
      title: 'Priority Portals',
      primaryMarkets: 'Primary Markets',
      secondaryMarkets: 'Secondary Markets',
      currency: 'Currency',
      units: 'Units',
    },
  }[(locale === 'it' ? 'it' : 'en') as 'it' | 'en'];

  return (
    <div className="pp-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{t.title}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
          {regionLabels[region]}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {t.primaryMarkets}
          </p>
          <div className="flex flex-wrap gap-2">
            {primaryPortals.map(portal => {
              const info = PORTAL_DATA[portal];
              return (
                <a
                  key={portal}
                  href={info?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 hover:bg-muted/50 
                           border border-border hover:border-border rounded-lg 
                           text-xs font-medium transition-all group"
                >
                  <span>{info?.logo || '🌐'}</span>
                  <span>{portal}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>
        
        {secondaryPortals.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">{t.secondaryMarkets}</p>
            <div className="flex flex-wrap gap-2">
              {secondaryPortals.slice(0, 3).map(portal => {
                const info = PORTAL_DATA[portal];
                return (
                  <span
                    key={portal}
                    className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 
                             border border-border/50 rounded text-xs text-muted-foreground"
                  >
                    <span>{info?.logo || '🌐'}</span>
                    <span>{portal}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-amber-500 font-medium">{config.currencySymbol}</span>
          {' '}{t.currency} • {config.measurementUnit === 'sqft' ? 'sq ft' : 'm²'} {t.units}
        </p>
      </div>
    </div>
  );
}

export default RegionalPortals;
