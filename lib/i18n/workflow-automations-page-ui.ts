/** Copy for `/dashboard/automations` — scheduled workflows (not CRM if/then). IT + EN. */
export type WorkflowAutomationTypeId = 'followup' | 'reminder' | 'weekly-content';

export type WorkflowAutomationsPageUi = {
  premiumRequired: string;
  success: string;
  deleted: string;
  executed: string;
  executionDone: string;
  error: string;
  enterName: string;
  fillRequired: string;
  selectContent: string;
  active: string;
  paused: string;
  completed: string;
  failed: string;
  notAvailable: string;
  dashboard: string;
  backAria: string;
  pageTitle: string;
  pageSubtitle: string;
  crmRulesLink: string;
  crmRulesHint: string;
  newAutomation: string;
  createAutomation: string;
  configureAutomation: string;
  selectAutomationType: string;
  backToSelection: string;
  automationName: string;
  automationNamePlaceholder: string;
  clientName: string;
  clientEmail: string;
  propertyType: string;
  area: string;
  emailType: string;
  selectType: string;
  sendInHours: string;
  visitDate: string;
  reminderType: string;
  select: string;
  contentTypes: string;
  propertyFocus: string;
  targetMarket: string;
  selectMarket: string;
  repeat: string;
  selectRepeat: string;
  creating: string;
  submitCreate: string;
  paywallTitle: string;
  paywallDescription: string;
  noAutomations: string;
  lastResult: string;
  resultTitle: string;
  close: string;
  activeCount: string;
  yourAutomations: string;
  yourAutomationsDesc: string;
  noAutomationDesc: string;
  createFirstAutomation: string;
  daily: string;
  weekly: string;
  type: string;
  nextRun: string;
  lastRun: string;
  runs: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  reminder3hBefore: string;
  reminder24hBefore: string;
  contentSocialPost: string;
  contentNewsletter: string;
  contentAbTitles: string;
  marketItaly: string;
  marketUsa: string;
  marketInternational: string;
  placeholderClientName: string;
  placeholderClientEmail: string;
  placeholderPropertyType: string;
  placeholderArea: string;
  placeholderPropertyFocus: string;
  automationTypes: Record<
    WorkflowAutomationTypeId,
    { label: string; description: string }
  >;
  emailTypes: Array<{ value: string; label: string }>;
  repeatIntervals: Array<{ value: 'once' | 'daily' | 'weekly'; label: string }>;
};

const it: WorkflowAutomationsPageUi = {
  premiumRequired:
    'Le Automazioni AI sono una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
  success: 'Successo!',
  deleted: 'Eliminata!',
  executed: 'Eseguita!',
  executionDone: 'Automazione completata con successo',
  error: 'Errore',
  enterName: "Inserisci un nome per l'automazione",
  fillRequired: 'Compila tutti i campi obbligatori',
  selectContent: 'Seleziona almeno un tipo di contenuto',
  active: 'Attiva',
  paused: 'In pausa',
  completed: 'Completata',
  failed: 'Fallita',
  notAvailable: 'N/D',
  dashboard: 'Dashboard',
  backAria: 'Torna alla dashboard',
  pageTitle: 'Workflow automazioni',
  pageSubtitle:
    'Follow-up pianificati, reminder visite e contenuti ricorrenti — distinto dalle regole if/then sul CRM.',
  crmRulesLink: 'Regole CRM (if/then)',
  crmRulesHint:
    'Per trigger su eventi lead (nuovo lead, cambio stato, score), usa le regole CRM.',
  newAutomation: 'Nuova Automazione',
  createAutomation: 'Crea Automazione',
  configureAutomation: 'Configura una nuova automazione per la tua agenzia',
  selectAutomationType: 'Seleziona il tipo di automazione:',
  backToSelection: 'Torna alla selezione',
  automationName: 'Nome Automazione *',
  automationNamePlaceholder: 'Es. Follow-up Mario Rossi',
  clientName: 'Nome Cliente *',
  clientEmail: 'Email Cliente *',
  propertyType: 'Tipo Immobile',
  area: 'Zona',
  emailType: 'Tipo Email',
  selectType: 'Seleziona tipo',
  sendInHours: 'Invio tra (ore)',
  visitDate: 'Data Visita *',
  reminderType: 'Tipo Promemoria',
  select: 'Seleziona',
  contentTypes: 'Tipi di Contenuto *',
  propertyFocus: 'Focus proprietà',
  targetMarket: 'Mercato Target',
  selectMarket: 'Seleziona mercato',
  repeat: 'Ripetizione',
  selectRepeat: 'Seleziona ripetizione',
  creating: 'Creazione in corso...',
  submitCreate: 'Crea Automazione',
  paywallTitle: 'Workflow automazioni',
  paywallDescription:
    'Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare le automazioni complete.',
  noAutomations: 'Nessuna automazione',
  lastResult: 'Ultimo risultato:',
  resultTitle: 'Risultato Automazione',
  close: 'Chiudi',
  activeCount: '{count} attive',
  yourAutomations: 'Le Tue Automazioni',
  yourAutomationsDesc: 'Gestisci le automazioni attive per la tua agenzia',
  noAutomationDesc: 'Crea la tua prima automazione per iniziare',
  createFirstAutomation: 'Crea Prima Automazione',
  daily: 'Giornaliero',
  weekly: 'Settimanale',
  type: 'Tipo',
  nextRun: 'Prossima esecuzione',
  lastRun: 'Ultima esecuzione',
  runs: 'Esecuzioni',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  reminder3hBefore: '3 ore prima',
  reminder24hBefore: '24 ore prima',
  contentSocialPost: 'Post social',
  contentNewsletter: 'Newsletter',
  contentAbTitles: 'Titoli A/B',
  marketItaly: 'Italia',
  marketUsa: 'USA',
  marketInternational: 'Internazionale',
  placeholderClientName: 'Mario Rossi',
  placeholderClientEmail: 'mario@email.com',
  placeholderPropertyType: 'Appartamento, villa…',
  placeholderArea: 'Milano Centro',
  placeholderPropertyFocus: 'Es. ville di lusso',
  automationTypes: {
    followup: {
      label: 'Follow-up automatico lead',
      description: 'Invia email di follow-up automatiche ai tuoi lead',
    },
    reminder: {
      label: 'Reminder appuntamenti',
      description: 'Promemoria automatici per visite immobiliari',
    },
    'weekly-content': {
      label: 'Contenuti settimanali',
      description: 'Genera automaticamente post social, newsletter e titoli',
    },
  },
  emailTypes: [
    { value: 'immediate', label: 'Risposta immediata' },
    { value: '24h', label: 'Follow-up 24h' },
    { value: '72h', label: 'Follow-up 72h' },
    { value: 'appointment', label: 'Appuntamento' },
    { value: 'post-visit', label: 'Post-visita' },
    { value: 'luxury', label: 'Lead luxury' },
  ],
  repeatIntervals: [
    { value: 'once', label: 'Una volta' },
    { value: 'daily', label: 'Giornaliero' },
    { value: 'weekly', label: 'Settimanale' },
  ],
};

const en: WorkflowAutomationsPageUi = {
  premiumRequired:
    'AI Automations are a Premium feature. Upgrade your account to the PRO or AGENCY plan.',
  success: 'Success!',
  deleted: 'Deleted!',
  executed: 'Executed!',
  executionDone: 'Automation completed successfully',
  error: 'Error',
  enterName: 'Enter a name for the automation',
  fillRequired: 'Fill in all required fields',
  selectContent: 'Select at least one content type',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  failed: 'Failed',
  notAvailable: 'N/A',
  dashboard: 'Dashboard',
  backAria: 'Back to dashboard',
  pageTitle: 'Automation workflows',
  pageSubtitle:
    'Scheduled follow-ups, visit reminders, and recurring content — separate from CRM if/then rules.',
  crmRulesLink: 'CRM rules (if/then)',
  crmRulesHint:
    'For triggers on lead events (new lead, status change, score), use CRM rules.',
  newAutomation: 'New automation',
  createAutomation: 'Create automation',
  configureAutomation: 'Configure a new automation for your agency',
  selectAutomationType: 'Select the automation type:',
  backToSelection: 'Back to selection',
  automationName: 'Automation name *',
  automationNamePlaceholder: 'e.g. Mario Rossi follow-up',
  clientName: 'Client name *',
  clientEmail: 'Client email *',
  propertyType: 'Property type',
  area: 'Area',
  emailType: 'Email type',
  selectType: 'Select type',
  sendInHours: 'Send in (hours)',
  visitDate: 'Visit date *',
  reminderType: 'Reminder type',
  select: 'Select',
  contentTypes: 'Content types *',
  propertyFocus: 'Property focus',
  targetMarket: 'Target market',
  selectMarket: 'Select market',
  repeat: 'Repeat',
  selectRepeat: 'Select repeat',
  creating: 'Creating...',
  submitCreate: 'Create automation',
  paywallTitle: 'Automation workflows',
  paywallDescription:
    'This feature is only available for PRO and AGENCY users. Upgrade your account to unlock full automations.',
  noAutomations: 'No automations',
  lastResult: 'Last result:',
  resultTitle: 'Automation result',
  close: 'Close',
  activeCount: '{count} active',
  yourAutomations: 'Your automations',
  yourAutomationsDesc: 'Manage active automations for your agency',
  noAutomationDesc: 'Create your first automation to get started',
  createFirstAutomation: 'Create first automation',
  daily: 'Daily',
  weekly: 'Weekly',
  type: 'Type',
  nextRun: 'Next run',
  lastRun: 'Last run',
  runs: 'Runs',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  reminder3hBefore: '3 hours before',
  reminder24hBefore: '24 hours before',
  contentSocialPost: 'Social posts',
  contentNewsletter: 'Newsletter',
  contentAbTitles: 'A/B titles',
  marketItaly: 'Italy',
  marketUsa: 'USA',
  marketInternational: 'International',
  placeholderClientName: 'John Smith',
  placeholderClientEmail: 'john@email.com',
  placeholderPropertyType: 'Apartment, villa…',
  placeholderArea: 'Downtown',
  placeholderPropertyFocus: 'e.g. luxury villas',
  automationTypes: {
    followup: {
      label: 'Automatic lead follow-up',
      description: 'Send automatic follow-up emails to your leads',
    },
    reminder: {
      label: 'Appointment reminders',
      description: 'Automatic reminders for property visits',
    },
    'weekly-content': {
      label: 'Weekly content',
      description: 'Automatically generate social posts, newsletters, and titles',
    },
  },
  emailTypes: [
    { value: 'immediate', label: 'Immediate response' },
    { value: '24h', label: '24h follow-up' },
    { value: '72h', label: '72h follow-up' },
    { value: 'appointment', label: 'Appointment' },
    { value: 'post-visit', label: 'Post-visit' },
    { value: 'luxury', label: 'Luxury lead' },
  ],
  repeatIntervals: [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ],
};

export const workflowAutomationsPageUiIt = it;
export const workflowAutomationsPageUiEn = en;
