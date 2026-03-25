/**
 * Portali prospecting: etichette brand + chiave icona Lucide (no emoji).
 * `source_platform` dall’API deve combaciare con queste chiavi.
 */
export type ProspectingPlatformIconKey =
  | 'home'
  | 'building2'
  | 'globe'
  | 'clipboardList'
  | 'package'
  | 'landmark';

export type ProspectingPlatformDef = {
  label: string;
  iconKey: ProspectingPlatformIconKey;
};

export const PROSPECTING_PLATFORM_KEYS = [
  'idealista',
  'immobiliare',
  'zillow',
  'mls',
  'subito',
  'casa',
] as const;

export type ProspectingPlatformKey = (typeof PROSPECTING_PLATFORM_KEYS)[number];

export const PROSPECTING_PLATFORMS: Record<ProspectingPlatformKey, ProspectingPlatformDef> = {
  idealista: { label: 'Idealista', iconKey: 'home' },
  immobiliare: { label: 'Immobiliare.it', iconKey: 'building2' },
  zillow: { label: 'Zillow', iconKey: 'globe' },
  mls: { label: 'MLS', iconKey: 'clipboardList' },
  subito: { label: 'Subito.it', iconKey: 'package' },
  casa: { label: 'Casa.it', iconKey: 'landmark' },
};

export function getProspectingPlatform(
  sourcePlatform: string | null | undefined
): ProspectingPlatformDef & { key: string } {
  const key = (sourcePlatform || '').toLowerCase().trim();
  const def = PROSPECTING_PLATFORMS[key as ProspectingPlatformKey];
  if (def) return { key, ...def };
  return {
    key: key || 'unknown',
    label: sourcePlatform || key || '—',
    iconKey: 'home',
  };
}
