import type { ComplianceCenterUi } from '@/lib/i18n/compliance-center-ui';

export const complianceCenterUiEs: ComplianceCenterUi = {
  pageTitle: 'Centro de cumplimiento',
  pageSubtitle: 'Paquetes de referencia legal por país',
  encTitle: 'Cifrado AES-256',
  encDesc:
    'Los datos sensibles (teléfonos, correos) están protegidos con estándares de nivel bancario.',
  gdprTitle: 'RGPD y privacidad',
  gdprDesc:
    'Alineación con RGPD, CCPA y otros marcos internacionales aplicables al SaaS.',
  certTitle: 'Certificaciones',
  certDesc: 'ISO 27001, SOC 2 Tipo II (certificación en curso).',
  countryTitle: 'Selecciona el país',
  countryDesc:
    'Las fichas reflejan el marco normativo del país seleccionado.',
  docsTitle: 'Documentos disponibles',
  updated: 'Actualizado:',
  available: 'Disponible',
  comingSoon: 'Próximamente',
  downloadPdf: 'Descargar PDF',
  downloadStarted: 'Descarga iniciada',
  downloadDesc: 'Descargando {filename}…',
  countries: [
    { code: 'IT', name: 'Italia' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'ES', name: 'España' },
    { code: 'FR', name: 'Francia' },
    { code: 'DE', name: 'Alemania' },
    { code: 'GB', name: 'Reino Unido' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Política de privacidad (RGPD)', available: true },
      { type: 'terms', name: 'Términos del servicio', available: true },
      { type: 'cookies', name: 'Política de cookies', available: true },
      { type: 'dpa', name: 'Acuerdo de tratamiento de datos (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Política de privacidad (CCPA)', available: true },
      { type: 'terms', name: 'Términos del servicio', available: true },
      { type: 'cookies', name: 'Política de cookies', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Política de privacidad (RGPD)', available: true },
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
      { type: 'privacy', name: 'Política de privacidad (RGPD)', available: true },
      { type: 'terms', name: 'Términos del servicio', available: true },
    ],
  },
};

export const complianceCenterUiFr: ComplianceCenterUi = {
  pageTitle: 'Centre de conformité',
  pageSubtitle: 'Référentiels juridiques par pays',
  encTitle: 'Chiffrement AES-256',
  encDesc:
    'Les données sensibles (téléphones, e-mails) sont protégées selon des standards de niveau bancaire.',
  gdprTitle: 'RGPD et vie privée',
  gdprDesc:
    'Alignement sur le RGPD, le CCPA et d’autres cadres internationaux pertinents pour le SaaS.',
  certTitle: 'Certifications',
  certDesc: 'ISO 27001, SOC 2 Type II (certification en cours).',
  countryTitle: 'Choisir le pays',
  countryDesc:
    'Les fiches reflètent le contexte réglementaire du pays sélectionné.',
  docsTitle: 'Documents disponibles',
  updated: 'Mis à jour :',
  available: 'Disponible',
  comingSoon: 'Bientôt',
  downloadPdf: 'Télécharger le PDF',
  downloadStarted: 'Téléchargement lancé',
  downloadDesc: 'Téléchargement de {filename}…',
  countries: [
    { code: 'IT', name: 'Italie' },
    { code: 'US', name: 'États-Unis' },
    { code: 'ES', name: 'Espagne' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'GB', name: 'Royaume-Uni' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
      { type: 'cookies', name: 'Politique relative aux cookies', available: true },
      { type: 'dpa', name: 'Accord de traitement des données (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Politique de confidentialité (CCPA)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
      { type: 'cookies', name: 'Politique relative aux cookies', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
    ],
    FR: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
    ],
    DE: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
    ],
    GB: [
      { type: 'privacy', name: 'Politique de confidentialité (RGPD)', available: true },
      { type: 'terms', name: "Conditions d'utilisation", available: true },
    ],
  },
};

export const complianceCenterUiDe: ComplianceCenterUi = {
  pageTitle: 'Compliance-Center',
  pageSubtitle: 'Rechtliche Referenzpakete nach Land',
  encTitle: 'AES-256-Verschlüsselung',
  encDesc:
    'Sensible Daten (Telefon, E-Mail) sind nach branchenüblichen Standards geschützt.',
  gdprTitle: 'DSGVO und Datenschutz',
  gdprDesc:
    'Ausrichtung auf DSGVO, CCPA und weitere für SaaS relevante internationale Rahmenwerke.',
  certTitle: 'Zertifizierungen',
  certDesc: 'ISO 27001, SOC 2 Type II (Zertifizierung läuft).',
  countryTitle: 'Land auswählen',
  countryDesc:
    'Die Dokumentkarten spiegeln den Regulierungskontext des gewählten Landes wider.',
  docsTitle: 'Verfügbare Dokumente',
  updated: 'Aktualisiert:',
  available: 'Verfügbar',
  comingSoon: 'Demnächst',
  downloadPdf: 'PDF herunterladen',
  downloadStarted: 'Download gestartet',
  downloadDesc: '{filename} wird heruntergeladen…',
  countries: [
    { code: 'IT', name: 'Italien' },
    { code: 'US', name: 'USA' },
    { code: 'ES', name: 'Spanien' },
    { code: 'FR', name: 'Frankreich' },
    { code: 'DE', name: 'Deutschland' },
    { code: 'GB', name: 'Vereinigtes Königreich' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Datenschutzerklärung (DSGVO)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen', available: true },
      { type: 'cookies', name: 'Cookie-Richtlinie', available: true },
      { type: 'dpa', name: 'Auftragsverarbeitungsvertrag (AVV)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Datenschutzerklärung (CCPA)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen', available: true },
      { type: 'cookies', name: 'Cookie-Richtlinie', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Datenschutzerklärung (EU/GDPR, Spanien)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen (Spanien)', available: true },
    ],
    FR: [
      { type: 'privacy', name: 'Datenschutzerklärung (EU/GDPR, Frankreich)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen (Frankreich)', available: true },
    ],
    DE: [
      { type: 'privacy', name: 'Datenschutzerklärung (EU/DSGVO, Deutschland)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen (Deutschland)', available: true },
    ],
    GB: [
      { type: 'privacy', name: 'Datenschutzerklärung (UK/GDPR)', available: true },
      { type: 'terms', name: 'Nutzungsbedingungen (UK)', available: true },
    ],
  },
};

export const complianceCenterUiPt: ComplianceCenterUi = {
  pageTitle: 'Centro de conformidade',
  pageSubtitle: 'Pacotes de referência legal por país',
  encTitle: 'Encriptação AES-256',
  encDesc:
    'Os dados sensíveis (telefones, e-mails) estão protegidos com padrões de nível bancário.',
  gdprTitle: 'RGPD e privacidade',
  gdprDesc:
    'Alinhamento com RGPD, CCPA e outros quadros internacionais relevantes para SaaS.',
  certTitle: 'Certificações',
  certDesc: 'ISO 27001, SOC 2 Tipo II (certificação em curso).',
  countryTitle: 'Selecionar país',
  countryDesc:
    'As fichas refletem o enquadramento regulatório do país selecionado.',
  docsTitle: 'Documentos disponíveis',
  updated: 'Atualizado:',
  available: 'Disponível',
  comingSoon: 'Em breve',
  downloadPdf: 'Descarregar PDF',
  downloadStarted: 'Download iniciado',
  downloadDesc: 'A descarregar {filename}…',
  countries: [
    { code: 'IT', name: 'Itália' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'ES', name: 'Espanha' },
    { code: 'FR', name: 'França' },
    { code: 'DE', name: 'Alemanha' },
    { code: 'GB', name: 'Reino Unido' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'Política de privacidade (RGPD)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
      { type: 'cookies', name: 'Política de cookies', available: true },
      { type: 'dpa', name: 'Acordo de tratamento de dados (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'Política de privacidade (CCPA)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
      { type: 'cookies', name: 'Política de cookies', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'Política de privacidade (RGPD)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
    ],
    FR: [
      { type: 'privacy', name: 'Política de privacidade (RGPD)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
    ],
    DE: [
      { type: 'privacy', name: 'Política de privacidade (RGPD)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
    ],
    GB: [
      { type: 'privacy', name: 'Política de privacidade (RGPD)', available: true },
      { type: 'terms', name: 'Termos de serviço', available: true },
    ],
  },
};

export const complianceCenterUiAr: ComplianceCenterUi = {
  pageTitle: 'مركز الامتثال',
  pageSubtitle: 'حزم مرجعية للوثائق القانونية حسب البلد',
  encTitle: 'تشفير AES-256',
  encDesc:
    'البيانات الحساسة (الهواتف والبريد) محمية بمعايير على مستوى القطاع المالي.',
  gdprTitle: 'الخصوصية والامتثال',
  gdprDesc:
    'مواءمة مع GDPR وCCPA وأطر دولية أخرى ذات صلة بخدمات السحابة (SaaS).',
  certTitle: 'الشهادات',
  certDesc: 'ISO 27001، SOC 2 من النوع الثاني (قيد الاعتماد).',
  countryTitle: 'اختر البلد',
  countryDesc: 'تعكس البطاقات السياق التنظيمي للبلد المحدد.',
  docsTitle: 'الوثائق المتاحة',
  updated: 'آخر تحديث:',
  available: 'متاح',
  comingSoon: 'قريباً',
  downloadPdf: 'تنزيل PDF',
  downloadStarted: 'بدأ التنزيل',
  downloadDesc: 'جاري تنزيل {filename}…',
  countries: [
    { code: 'IT', name: 'إيطاليا' },
    { code: 'US', name: 'الولايات المتحدة' },
    { code: 'ES', name: 'إسبانيا' },
    { code: 'FR', name: 'فرنسا' },
    { code: 'DE', name: 'ألمانيا' },
    { code: 'GB', name: 'المملكة المتحدة' },
  ],
  documents: {
    IT: [
      { type: 'privacy', name: 'سياسة الخصوصية (GDPR)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
      { type: 'cookies', name: 'سياسة ملفات تعريف الارتباط', available: true },
      { type: 'dpa', name: 'اتفاقية معالجة البيانات (DPA)', available: true },
    ],
    US: [
      { type: 'privacy', name: 'سياسة الخصوصية (CCPA)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
      { type: 'cookies', name: 'سياسة ملفات تعريف الارتباط', available: true },
    ],
    ES: [
      { type: 'privacy', name: 'سياسة الخصوصية (GDPR)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
    ],
    FR: [
      { type: 'privacy', name: 'سياسة الخصوصية (GDPR)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
    ],
    DE: [
      { type: 'privacy', name: 'سياسة الخصوصية (GDPR)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
    ],
    GB: [
      { type: 'privacy', name: 'سياسة الخصوصية (GDPR)', available: true },
      { type: 'terms', name: 'شروط الخدمة', available: true },
    ],
  },
};
