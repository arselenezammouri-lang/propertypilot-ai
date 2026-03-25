/**
 * Public /compliance page — IT/EN authoritative; merged in dictionary.ts.
 */

export type ComplianceCountryCode = 'IT' | 'US' | 'ES' | 'FR' | 'DE' | 'GB';

export type ComplianceDocRow = {
  type: string;
  available: boolean;
  name: string;
};

export type ComplianceCenterUi = {
  pageTitle: string;
  pageSubtitle: string;
  encTitle: string;
  encDesc: string;
  gdprTitle: string;
  gdprDesc: string;
  certTitle: string;
  certDesc: string;
  countryTitle: string;
  countryDesc: string;
  docsTitle: string;
  updated: string;
  available: string;
  comingSoon: string;
  downloadPdf: string;
  downloadStarted: string;
  /** `{filename}` = file name */
  downloadDesc: string;
  countries: { code: ComplianceCountryCode; name: string }[];
  documents: Record<ComplianceCountryCode, ComplianceDocRow[]>;
};

export const complianceCenterUiIt: ComplianceCenterUi = {
  pageTitle: 'Centro conformità',
  pageSubtitle: 'Documenti legali di riferimento per il tuo paese',
  encTitle: 'Crittografia AES-256',
  encDesc:
    'I dati sensibili (telefoni, email) sono protetti con standard da settore finanziario.',
  gdprTitle: 'GDPR e normative privacy',
  gdprDesc:
    'Allineamento a GDPR, CCPA e framework privacy internazionali rilevanti per il SaaS.',
  certTitle: 'Certificazioni',
  certDesc: 'ISO 27001, SOC 2 Type II (percorso di certificazione in corso).',
  countryTitle: 'Seleziona il paese',
  countryDesc:
    'Le schede documento riflettono il contesto normativo del paese selezionato.',
  docsTitle: 'Documenti disponibili',
  updated: 'Aggiornato:',
  available: 'Disponibile',
  comingSoon: 'In arrivo',
  downloadPdf: 'Scarica PDF',
  downloadStarted: 'Download avviato',
  downloadDesc: 'Download di {filename} in corso…',
  countries: [
    { code: 'IT', name: 'Italia' },
    { code: 'US', name: 'Stati Uniti' },
    { code: 'ES', name: 'Spagna' },
    { code: 'FR', name: 'Francia' },
    { code: 'DE', name: 'Germania' },
    { code: 'GB', name: 'Regno Unito' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Informativa privacy (GDPR)', available: true },
      { type: 'terms', name: 'Termini di servizio', available: true },
      { type: 'cookies', name: 'Cookie policy', available: true },
      { type: 'dpa', name: 'Accordo sul trattamento dei dati (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Privacy policy (CCPA)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
      { type: 'cookies', name: 'Cookie policy', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Política de privacidad (GDPR)', available: true },
      { type: 'terms', name: 'Términos del servicio', available: true },
    ],
    FR: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
    ],
    DE: [
      { type: 'privacy', name: 'Datenschutzerklärung (DSGVO)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen', available: true },
    ],
    GB: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
    ],
  },
};

export const complianceCenterUiEn: ComplianceCenterUi = {
  pageTitle: 'Compliance center',
  pageSubtitle: 'Legal document reference packs by country',
  encTitle: 'AES-256 encryption',
  encDesc:
    'Sensitive data (phones, emails) is protected with banking-grade encryption standards.',
  gdprTitle: 'GDPR and privacy laws',
  gdprDesc:
    'Alignment with GDPR, CCPA, and other international privacy frameworks relevant to SaaS.',
  certTitle: 'Certifications',
  certDesc: 'ISO 27001, SOC 2 Type II (certification in progress).',
  countryTitle: 'Select country',
  countryDesc:
    'Document cards reflect the regulatory context of the selected country.',
  docsTitle: 'Available documents',
  updated: 'Updated:',
  available: 'Available',
  comingSoon: 'Coming soon',
  downloadPdf: 'Download PDF',
  downloadStarted: 'Download started',
  downloadDesc: 'Downloading {filename}…',
  countries: [
    { code: 'IT', name: 'Italy' },
    { code: 'US', name: 'United States' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'GB', name: 'United Kingdom' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
      { type: 'cookies', name: 'Cookie policy', available: true },
      { type: 'dpa', name: 'Data processing agreement (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Privacy policy (CCPA)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
      { type: 'cookies', name: 'Cookie policy', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
    ],
    FR: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
    ],
    DE: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
    ],
    GB: [
      { type: 'privacy', name: 'Privacy policy (GDPR)', available: true },
      { type: 'terms', name: 'Terms of service', available: true },
    ],
  },
};
