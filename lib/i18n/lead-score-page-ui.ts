/** `/dashboard/lead-score` — full page copy; factor `nome` from API is Italian (see `lib/ai/leadScoring.ts`). */

export type LeadScoreFactorApiName =
  | 'Urgenza Percepita'
  | 'Budget e Compatibilità'
  | 'Tempistiche'
  | 'Motivazione'
  | 'Chiarezza Messaggio';

export type LeadScorePageUi = {
  backToDashboard: string;
  marketItaly: string;
  marketUsa: string;
  cacheBadge: string;
  headerPriorityBadge: string;
  categoryHot: string;
  categoryWarm: string;
  categoryCold: string;
  categoryDefault: string;
  planFree: string;
  planStarter: string;
  planPro: string;
  planAgency: string;
  requiredMessage: string;
  messageTooShortDesc: string;
  analysisDone: string;
  /** Placeholder `{seconds}` */
  analysisInSeconds: string;
  copied: string;
  /** Placeholder `{label}` */
  copiedWithLabel: string;
  copyFailed: string;
  analysisErrorGeneric: string;
  pageTitle: string;
  pageSubtitle: string;
  analyzeLead: string;
  analyzeLeadDesc: string;
  referenceMarket: string;
  selectMarket: string;
  propertyType: string;
  selectType: string;
  timing: string;
  selectTiming: string;
  leadName: string;
  leadNamePlaceholder: string;
  statedBudget: string;
  budgetPlaceholder: string;
  leadMessage: string;
  leadMessagePlaceholder: string;
  characters: string;
  minimum20: string;
  analyzing: string;
  analyzeWithAi: string;
  analysisSummary: string;
  leadScoreLabel: string;
  leadProfile: string;
  lossRisk: string;
  factorBreakdown: string;
  factorBreakdownDesc: string;
  actionPriorities: string;
  actionPrioritiesDesc: string;
  followUpStrategy: string;
  responseTemplates: string;
  responseTemplatesDesc: string;
  quickReply: string;
  professionalReply: string;
  emailSubjectLabel: string;
  shortVersion: string;
  fullVersion: string;
  intro: string;
  fullEmail: string;
  perfectCopy: string;
  perfectCopyDesc: string;
  newAnalysis: string;
  timingNotSpecified: string;
  propertyTypes: Array<{ value: string; label: string }>;
  timingOptions: string[];
  factorLabels: Record<LeadScoreFactorApiName, string>;
  /** Placeholder `{seconds}` */
  processingFooterFresh: string;
  /** Placeholder `{seconds}` */
  processingFooterCached: string;
};

const factorLabelsIt: Record<LeadScoreFactorApiName, string> = {
  'Urgenza Percepita': 'Urgenza percepita',
  'Budget e Compatibilità': 'Budget e compatibilità',
  Tempistiche: 'Tempistiche',
  Motivazione: 'Motivazione',
  'Chiarezza Messaggio': 'Chiarezza messaggio',
};

const factorLabelsEn: Record<LeadScoreFactorApiName, string> = {
  'Urgenza Percepita': 'Perceived urgency',
  'Budget e Compatibilità': 'Budget fit',
  Tempistiche: 'Timeline',
  Motivazione: 'Motivation',
  'Chiarezza Messaggio': 'Message clarity',
};

export const leadScorePageUiIt: LeadScorePageUi = {
  backToDashboard: 'Torna alla dashboard',
  marketItaly: 'Italia',
  marketUsa: 'USA',
  cacheBadge: 'Risultato dalla cache (24h)',
  headerPriorityBadge: 'Priorità',
  categoryHot: 'Lead caldo',
  categoryWarm: 'Lead tiepido',
  categoryCold: 'Lead freddo',
  categoryDefault: 'Lead',
  planFree: 'Free',
  planStarter: 'Starter',
  planPro: 'Pro',
  planAgency: 'Agency',
  requiredMessage: "Inserisci il messaggio del lead per procedere con l'analisi",
  messageTooShortDesc:
    "Il messaggio deve contenere almeno 20 caratteri per un'analisi accurata",
  analysisDone: 'Analisi completata',
  analysisInSeconds: 'Analisi completata in {seconds}s',
  copied: 'Copiato!',
  copiedWithLabel: '{label} copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  analysisErrorGeneric: "Errore durante l'analisi",
  pageTitle: 'Lead Scoring AI',
  pageSubtitle:
    "Analizza automaticamente i messaggi dei tuoi lead con l'AI. Ottieni un punteggio 0-100, priorità d'azione e template di risposta personalizzati.",
  analyzeLead: 'Analizza un nuovo lead',
  analyzeLeadDesc:
    'Inserisci il messaggio del lead e le informazioni disponibili per ottenere un\'analisi completa',
  referenceMarket: 'Mercato di riferimento',
  selectMarket: 'Seleziona mercato',
  propertyType: 'Tipo immobile richiesto',
  selectType: 'Seleziona tipo',
  timing: 'Tempistiche dichiarate',
  selectTiming: 'Seleziona tempistiche',
  leadName: 'Nome del lead (opzionale)',
  leadNamePlaceholder: 'Es. Mario Rossi',
  statedBudget: 'Budget dichiarato (opzionale)',
  budgetPlaceholder: 'Es. 250.000 € - 300.000 €',
  leadMessage: 'Messaggio del lead',
  leadMessagePlaceholder:
    'Incolla qui il messaggio ricevuto dal lead (email, form di contatto, WhatsApp, ecc.)...',
  characters: 'caratteri',
  minimum20: 'Minimo 20 caratteri richiesti',
  analyzing: 'Analisi in corso...',
  analyzeWithAi: 'Analizza lead con AI',
  analysisSummary: "Sintesi dell'analisi",
  leadScoreLabel: 'Lead score',
  leadProfile: 'Profilo lead',
  lossRisk: 'Rischio perdita',
  factorBreakdown: 'Breakdown dei 5 fattori (0-20 punti ciascuno)',
  factorBreakdownDesc:
    'Analisi dettagliata dei fattori che determinano il punteggio del lead',
  actionPriorities: "Priorità d'azione",
  actionPrioritiesDesc:
    'Azioni consigliate in ordine di priorità per convertire questo lead',
  followUpStrategy: 'Strategia follow-up (7-14 giorni)',
  responseTemplates: 'Template di risposta AI',
  responseTemplatesDesc:
    'Risposte personalizzate pronte all\'uso, generate in base al profilo del lead',
  quickReply: 'Risposta rapida',
  professionalReply: 'Risposta professionale',
  emailSubjectLabel: 'OGGETTO',
  shortVersion: 'VERSIONE BREVE',
  fullVersion: 'VERSIONE COMPLETA',
  intro: 'INTRO',
  fullEmail: 'EMAIL COMPLETA',
  perfectCopy: 'Suggerimenti Perfect Copy',
  perfectCopyDesc:
    'Contenuti consigliati per aumentare le conversioni con questo lead',
  newAnalysis: 'Nuova analisi',
  timingNotSpecified: 'Non specificato',
  propertyTypes: [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'villa', label: 'Villa' },
    { value: 'attico', label: 'Attico' },
    { value: 'loft', label: 'Loft' },
    { value: 'ufficio', label: 'Ufficio' },
    { value: 'locale_commerciale', label: 'Locale commerciale' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'altro', label: 'Altro' },
  ],
  timingOptions: [
    'Immediato (entro 1 mese)',
    'Breve termine (1-3 mesi)',
    'Medio termine (3-6 mesi)',
    'Lungo termine (6+ mesi)',
    'Non specificato',
  ],
  factorLabels: factorLabelsIt,
  processingFooterFresh: 'Analisi completata in {seconds}s',
  processingFooterCached: 'Analisi completata in {seconds}s (dalla cache)',
};

export const leadScorePageUiEn: LeadScorePageUi = {
  backToDashboard: 'Back to dashboard',
  marketItaly: 'Italy',
  marketUsa: 'USA',
  cacheBadge: 'Result from cache (24h)',
  headerPriorityBadge: 'Priority',
  categoryHot: 'Hot lead',
  categoryWarm: 'Warm lead',
  categoryCold: 'Cold lead',
  categoryDefault: 'Lead',
  planFree: 'Free',
  planStarter: 'Starter',
  planPro: 'Pro',
  planAgency: 'Agency',
  requiredMessage: 'Enter the lead message to continue with the analysis',
  messageTooShortDesc:
    'The message must contain at least 20 characters for an accurate analysis',
  analysisDone: 'Analysis completed',
  analysisInSeconds: 'Analysis completed in {seconds}s',
  copied: 'Copied!',
  copiedWithLabel: '{label} copied to clipboard',
  copyFailed: 'Unable to copy text',
  analysisErrorGeneric: 'Error during analysis',
  pageTitle: 'AI lead scoring',
  pageSubtitle:
    'Automatically analyze your lead messages with AI. Get a 0-100 score, action priorities, and personalized reply templates.',
  analyzeLead: 'Analyze a new lead',
  analyzeLeadDesc:
    'Enter the lead message and available information to get a complete analysis',
  referenceMarket: 'Reference market',
  selectMarket: 'Select market',
  propertyType: 'Requested property type',
  selectType: 'Select type',
  timing: 'Declared timeline',
  selectTiming: 'Select timeline',
  leadName: 'Lead name (optional)',
  leadNamePlaceholder: 'e.g. Jane Smith',
  statedBudget: 'Declared budget (optional)',
  budgetPlaceholder: 'e.g. $250,000 - $300,000',
  leadMessage: 'Lead message',
  leadMessagePlaceholder:
    'Paste the message received from the lead (email, contact form, WhatsApp, etc.)...',
  characters: 'characters',
  minimum20: 'Minimum 20 characters required',
  analyzing: 'Analyzing...',
  analyzeWithAi: 'Analyze lead with AI',
  analysisSummary: 'Analysis summary',
  leadScoreLabel: 'Lead score',
  leadProfile: 'Lead profile',
  lossRisk: 'Risk of loss',
  factorBreakdown: '5-factor breakdown (0-20 points each)',
  factorBreakdownDesc:
    'Detailed view of the factors that determine the lead score',
  actionPriorities: 'Action priorities',
  actionPrioritiesDesc:
    'Recommended actions in priority order to convert this lead',
  followUpStrategy: 'Follow-up strategy (7-14 days)',
  responseTemplates: 'AI response templates',
  responseTemplatesDesc:
    'Ready-to-use personalized replies generated from the lead profile',
  quickReply: 'Quick reply',
  professionalReply: 'Professional reply',
  emailSubjectLabel: 'SUBJECT',
  shortVersion: 'SHORT VERSION',
  fullVersion: 'FULL VERSION',
  intro: 'INTRO',
  fullEmail: 'FULL EMAIL',
  perfectCopy: 'Perfect Copy suggestions',
  perfectCopyDesc: 'Suggested content to increase conversions with this lead',
  newAnalysis: 'New analysis',
  timingNotSpecified: 'Not specified',
  propertyTypes: [
    { value: 'appartamento', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'attico', label: 'Penthouse' },
    { value: 'loft', label: 'Loft' },
    { value: 'ufficio', label: 'Office' },
    { value: 'locale_commerciale', label: 'Commercial space' },
    { value: 'terreno', label: 'Land' },
    { value: 'altro', label: 'Other' },
  ],
  timingOptions: [
    'Immediate (within 1 month)',
    'Short term (1-3 months)',
    'Medium term (3-6 months)',
    'Long term (6+ months)',
    'Not specified',
  ],
  factorLabels: factorLabelsEn,
  processingFooterFresh: 'Analysis completed in {seconds}s',
  processingFooterCached: 'Analysis completed in {seconds}s (from cache)',
};
