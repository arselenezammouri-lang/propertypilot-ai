/** Copy for `/dashboard/crm/settings` (API keys & embed). IT + EN; merge EN for other locales. */
export type CrmApiKeysPageUi = {
  pageTitle: string;
  pageBadge: string;
  pageSubtitle: string;
  apiKeysTitle: string;
  apiKeysDesc: string;
  newApiKey: string;
  dialogCreateTitle: string;
  dialogCreateDesc: string;
  keyCreatedSuccess: string;
  keyCreatedHint: string;
  done: string;
  keyNameLabel: string;
  keyNamePlaceholder: string;
  defaultMarket: string;
  marketItaly: string;
  marketUsa: string;
  autoLeadScore: string;
  autoLeadScoreDesc: string;
  autoFollowup: string;
  autoFollowupDesc: string;
  cancel: string;
  createApiKey: string;
  noKeys: string;
  noKeysHint: string;
  active: string;
  inactive: string;
  leadsCaptured: string;
  lastUsed: string;
  delete: string;
  deleteConfirm: string;
  embedCode: string;
  embedCodeDesc: string;
  copy: string;
  howToUse: string;
  howToUseSteps: string[];
  securityTitle: string;
  securityDesc: string;
  securityItems: string[];
  securityWarning: string;
  keyCreatedTitle: string;
  keyCreatedDesc: string;
  keyUpdated: string;
  keyDeleted: string;
  copied: string;
  keyNameRequired: string;
  clipboardCopyFailed: string;
  backAria: string;
  deleteDialogTitle: string;
  deleteDialogBody: string;
  deleting: string;
  embedButton: string;
  autoScoreBadge: string;
  autoFollowupBadge: string;
  copyKeyAria: string;
  deleteKeyAria: string;
  /** Snippet embed — etichette form e messaggi alert */
  embedLabelNome: string;
  embedLabelEmail: string;
  embedLabelTelefono: string;
  embedLabelMessaggio: string;
  embedSubmit: string;
  embedAlertThanks: string;
  embedAlertError: string;
  embedAlertNetwork: string;
  embedConsoleError: string;
  createKeyError: string;
  updateKeyError: string;
};

const it: CrmApiKeysPageUi = {
  pageTitle: 'Impostazioni CRM',
  pageBadge: 'API Key',
  pageSubtitle: 'Gestisci le API key per i form di lead capture esterni',
  apiKeysTitle: 'API Key',
  apiKeysDesc: 'Crea chiavi API per integrare form di lead capture nel tuo sito',
  newApiKey: 'Nuova API Key',
  dialogCreateTitle: 'Crea nuova API Key',
  dialogCreateDesc: 'Configura una nuova chiave per catturare lead dal tuo sito',
  keyCreatedSuccess: 'API Key creata con successo!',
  keyCreatedHint: 'Copia questa chiave ora. Non sarà più visibile in seguito.',
  done: 'Fatto',
  keyNameLabel: 'Nome API Key *',
  keyNamePlaceholder: 'es. Form sito web, landing page…',
  defaultMarket: 'Mercato predefinito',
  marketItaly: 'Italia',
  marketUsa: 'USA',
  autoLeadScore: 'Lead score automatico',
  autoLeadScoreDesc: 'Analizza automaticamente ogni lead con AI',
  autoFollowup: 'Follow-up automatico',
  autoFollowupDesc: 'Invia email di follow-up AI automatiche',
  cancel: 'Annulla',
  createApiKey: 'Crea API Key',
  noKeys: 'Nessuna API key creata',
  noKeysHint: 'Crea la tua prima chiave per iniziare a catturare lead',
  active: 'Attiva',
  inactive: 'Disattivata',
  leadsCaptured: '{count} lead catturati',
  lastUsed: 'Ultimo uso:',
  delete: 'Elimina',
  deleteConfirm: 'Sei sicuro di voler eliminare questa API key?',
  embedCode: 'Codice embed form',
  embedCodeDesc: 'Copia questo codice e incollalo nel tuo sito web',
  copy: 'Copia',
  howToUse: 'Come usarlo:',
  howToUseSteps: [
    'Copia il codice sopra',
    'Incollalo prima del tag </body> del tuo sito',
    'Il form apparirà nel div con id "propertypilot-lead-form"',
    'I lead saranno salvati automaticamente nel tuo CRM',
  ],
  securityTitle: 'Sicurezza API',
  securityDesc: 'Informazioni importanti sulla sicurezza',
  securityItems: [
    'Le API key sono visibili solo al momento della creazione',
    'Rate limit: 30 richieste al minuto per API key',
    'CORS abilitato per richieste cross-origin',
  ],
  securityWarning: 'Non condividere le chiavi API in repository pubblici',
  keyCreatedTitle: 'API Key creata!',
  keyCreatedDesc: 'Copia la chiave ora: non sarà più visibile in seguito.',
  keyUpdated: 'API Key aggiornata',
  keyDeleted: 'API Key eliminata',
  copied: 'Copiato negli appunti!',
  keyNameRequired: 'Inserisci un nome per la API key',
  clipboardCopyFailed: 'Impossibile copiare negli appunti.',
  backAria: 'Indietro',
  deleteDialogTitle: 'Eliminare API Key?',
  deleteDialogBody:
    'Sei sicuro di voler eliminare «{name}»? I form che la usano smetteranno di funzionare.',
  deleting: 'Eliminazione…',
  embedButton: 'Embed',
  autoScoreBadge: 'Score auto',
  autoFollowupBadge: 'Follow-up auto',
  copyKeyAria: 'Copia API key',
  deleteKeyAria: 'Elimina API key',
  embedLabelNome: 'Nome e cognome',
  embedLabelEmail: 'Email',
  embedLabelTelefono: 'Telefono',
  embedLabelMessaggio: 'Messaggio',
  embedSubmit: 'Invia richiesta',
  embedAlertThanks: 'Grazie! Ti contatteremo presto.',
  embedAlertError: 'Errore: ',
  embedAlertNetwork: 'Errore di connessione. Riprova.',
  embedConsoleError: 'Errore:',
  createKeyError: 'Errore nella creazione',
  updateKeyError: "Errore nell'aggiornamento",
};

const en: CrmApiKeysPageUi = {
  pageTitle: 'CRM settings',
  pageBadge: 'API keys',
  pageSubtitle: 'Manage API keys for external lead capture forms',
  apiKeysTitle: 'API keys',
  apiKeysDesc: 'Create API keys to integrate lead capture forms on your website',
  newApiKey: 'New API key',
  dialogCreateTitle: 'Create new API key',
  dialogCreateDesc: 'Configure a new key to capture leads from your website',
  keyCreatedSuccess: 'API key created successfully!',
  keyCreatedHint: 'Copy this key now. It will not be shown again.',
  done: 'Done',
  keyNameLabel: 'API key name *',
  keyNamePlaceholder: 'e.g. Website form, landing page…',
  defaultMarket: 'Default market',
  marketItaly: 'Italy',
  marketUsa: 'USA',
  autoLeadScore: 'Auto lead score',
  autoLeadScoreDesc: 'Automatically analyze each lead with AI',
  autoFollowup: 'Auto follow-up',
  autoFollowupDesc: 'Send automatic AI follow-up emails',
  cancel: 'Cancel',
  createApiKey: 'Create API key',
  noKeys: 'No API keys yet',
  noKeysHint: 'Create your first key to start capturing leads',
  active: 'Active',
  inactive: 'Inactive',
  leadsCaptured: '{count} leads captured',
  lastUsed: 'Last used:',
  delete: 'Delete',
  deleteConfirm: 'Are you sure you want to delete this API key?',
  embedCode: 'Embed form code',
  embedCodeDesc: 'Copy this code and paste it into your website',
  copy: 'Copy',
  howToUse: 'How to use:',
  howToUseSteps: [
    'Copy the code above',
    'Paste it before the </body> tag on your site',
    'The form will appear in the div with id "propertypilot-lead-form"',
    'Leads will be saved automatically to your CRM',
  ],
  securityTitle: 'API security',
  securityDesc: 'Important security information',
  securityItems: [
    'API keys are only visible when created',
    'Rate limit: 30 requests per minute per API key',
    'CORS enabled for cross-origin requests',
  ],
  securityWarning: 'Do not share API keys in public repositories',
  keyCreatedTitle: 'API key created!',
  keyCreatedDesc: 'Copy the key now — it will not be visible later.',
  keyUpdated: 'API key updated',
  keyDeleted: 'API key deleted',
  copied: 'Copied to clipboard!',
  keyNameRequired: 'Enter a name for the API key',
  clipboardCopyFailed: 'Could not copy to clipboard.',
  backAria: 'Back',
  deleteDialogTitle: 'Delete API key?',
  deleteDialogBody:
    'Are you sure you want to delete "{name}"? Forms using it will stop working.',
  deleting: 'Deleting…',
  embedButton: 'Embed',
  autoScoreBadge: 'Auto score',
  autoFollowupBadge: 'Auto follow-up',
  copyKeyAria: 'Copy API key',
  deleteKeyAria: 'Delete API key',
  embedLabelNome: 'Full name',
  embedLabelEmail: 'Email',
  embedLabelTelefono: 'Phone',
  embedLabelMessaggio: 'Message',
  embedSubmit: 'Send request',
  embedAlertThanks: 'Thank you! We will contact you soon.',
  embedAlertError: 'Error: ',
  embedAlertNetwork: 'Connection error. Please try again.',
  embedConsoleError: 'Error:',
  createKeyError: 'Creation failed',
  updateKeyError: 'Update failed',
};

export const crmApiKeysPageUiIt = it;
export const crmApiKeysPageUiEn = en;
