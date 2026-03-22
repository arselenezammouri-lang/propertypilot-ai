/**
 * Fusi orari IANA comuni per agenti USA / EU / Middle East (Fase C4).
 * Valore = stringa passata a Intl (timeZone).
 */
export const DASHBOARD_TIMEZONE_OPTIONS = [
  { value: 'Europe/Rome', region: 'EU' },
  { value: 'Europe/Paris', region: 'EU' },
  { value: 'Europe/Berlin', region: 'EU' },
  { value: 'Europe/Madrid', region: 'EU' },
  { value: 'Europe/Lisbon', region: 'EU' },
  { value: 'Europe/London', region: 'EU' },
  { value: 'Europe/Amsterdam', region: 'EU' },
  { value: 'Europe/Zurich', region: 'EU' },
  { value: 'Europe/Dublin', region: 'EU' },
  { value: 'America/New_York', region: 'US' },
  { value: 'America/Chicago', region: 'US' },
  { value: 'America/Denver', region: 'US' },
  { value: 'America/Los_Angeles', region: 'US' },
  { value: 'America/Miami', region: 'US' },
  { value: 'America/Toronto', region: 'NA' },
  { value: 'America/Sao_Paulo', region: 'LATAM' },
  { value: 'Asia/Dubai', region: 'ME' },
  { value: 'Asia/Riyadh', region: 'ME' },
  { value: 'Asia/Qatar', region: 'ME' },
  { value: 'Asia/Tel_Aviv', region: 'ME' },
  { value: 'Asia/Singapore', region: 'APAC' },
  { value: 'Asia/Tokyo', region: 'APAC' },
  { value: 'Australia/Sydney', region: 'APAC' },
  { value: 'UTC', region: 'UTC' },
] as const;

export type DashboardTimezone = (typeof DASHBOARD_TIMEZONE_OPTIONS)[number]['value'];

export function isValidDashboardTimezone(value: string): value is DashboardTimezone {
  return DASHBOARD_TIMEZONE_OPTIONS.some((o) => o.value === value);
}

/** Fallback se il browser non espone un fuso valido dalla nostra lista */
export const DEFAULT_DASHBOARD_TIMEZONE: DashboardTimezone = 'UTC';
