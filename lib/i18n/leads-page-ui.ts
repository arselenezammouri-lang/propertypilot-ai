/**
 * Copy for `/dashboard/leads` (Lead Manager + AI). IT + EN; other locales merge from EN.
 */
export type LeadsPageUi = {
  premiumRequired: string;
  premiumRequiredDesc: string;
  error: string;
  loadingError: string;
  connectionError: string;
  nameRequired: string;
  leadCreated: string;
  /** Use {name} */
  leadCreatedDesc: string;
  createError: string;
  leadUpdated: string;
  /** Use {name} */
  leadUpdatedDesc: string;
  updateError: string;
  leadDeleted: string;
  /** Use {name} */
  leadDeletedDesc: string;
  deleteError: string;
  statusUpdated: string;
  statusUpdateError: string;
  detailsError: string;
  noteError: string;
  newLead: string;
  total: string;
  status: string;
  priority: string;
  market: string;
  allStatuses: string;
  allPriorities: string;
  allMarkets: string;
  noLeads: string;
  adjustFilters: string;
  addFirstLead: string;
  addLead: string;
  contacts: string;
  score: string;
  date: string;
  actions: string;
  leadManagerTitle: string;
  leadManagerDesc: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  noteAdded: string;
  noteSaved: string;
  delete: string;
  addLeadInfo: string;
  editLead: string;
  editLeadInfo: string;
  name: string;
  phone: string;
  leadMessage: string;
  leadMessagePlaceholder: string;
  cancel: string;
  saveChanges: string;
  leadDetails: string;
  created: string;
  updated: string;
  notes: string;
  areYouSure: string;
  /** Use {name} */
  deleteWarning: string;
  successLeadCreatedTitle: string;
  successLeadUpdatedTitle: string;
  successLeadDeletedTitle: string;
  successStatusTitle: string;
  successNoteTitle: string;
  fallbackLeadName: string;
  backToDashboard: string;
  pipelineKanban: string;
  /** Colonna tabella (entità lead) */
  tableColumnLead: string;
  deleting: string;
  statusNew: string;
  statusContacted: string;
  statusFollowup: string;
  statusClosed: string;
  statusLost: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  marketItaly: string;
  marketUsa: string;
};

const it: LeadsPageUi = {
  premiumRequired: 'Piano Premium richiesto',
  premiumRequiredDesc:
    'Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
  error: 'Errore',
  loadingError: 'Errore nel caricamento dei lead',
  connectionError: 'Errore di connessione',
  nameRequired: 'Il nome è obbligatorio',
  leadCreated: 'Lead creato',
  leadCreatedDesc: '{name} è stato aggiunto con successo',
  createError: 'Errore nella creazione del lead',
  leadUpdated: 'Lead aggiornato',
  leadUpdatedDesc: '{name} è stato aggiornato',
  updateError: "Errore nell'aggiornamento",
  leadDeleted: 'Lead eliminato',
  leadDeletedDesc: '{name} è stato eliminato',
  deleteError: "Errore nell'eliminazione",
  statusUpdated: 'Stato aggiornato',
  statusUpdateError: "Errore nell'aggiornamento dello stato",
  detailsError: 'Errore nel caricamento dei dettagli',
  noteError: "Errore nell'aggiunta della nota",
  newLead: 'Nuovo Lead',
  total: 'Totali',
  status: 'Stato',
  priority: 'Priorità',
  market: 'Mercato',
  allStatuses: 'Tutti gli stati',
  allPriorities: 'Tutte le priorità',
  allMarkets: 'Tutti i mercati',
  noLeads: 'Nessun lead trovato',
  adjustFilters: 'Prova a modificare i filtri di ricerca',
  addFirstLead: 'Inizia ad aggiungere i tuoi primi lead',
  addLead: 'Aggiungi Lead',
  contacts: 'Contatti',
  score: 'Score',
  date: 'Data',
  actions: 'Azioni',
  leadManagerTitle: 'Lead Manager + AI',
  leadManagerDesc:
    'Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare il CRM completo con pipeline, automazioni e AI.',
  pageSubtitle:
    'CRM con pipeline, filtri e insight AI: uno spazio unico per qualificare e seguire ogni lead.',
  searchPlaceholder: 'Cerca per nome, email o telefono...',
  noteAdded: 'Nota aggiunta',
  noteSaved: 'La nota è stata salvata',
  delete: 'Elimina',
  addLeadInfo: 'Inserisci le informazioni del nuovo lead',
  editLead: 'Modifica Lead',
  editLeadInfo: 'Modifica le informazioni del lead',
  name: 'Nome',
  phone: 'Telefono',
  leadMessage: 'Messaggio del Lead',
  leadMessagePlaceholder: 'Inserisci il messaggio ricevuto dal lead...',
  cancel: 'Annulla',
  saveChanges: 'Salva modifiche',
  leadDetails: 'Dettagli Lead',
  created: 'Creato',
  updated: 'Aggiornato',
  notes: 'Note',
  areYouSure: 'Sei sicuro?',
  deleteWarning:
    'Stai per eliminare il lead "{name}". Questa azione non può essere annullata.',
  successLeadCreatedTitle: 'CRM Lead — Lead aggiunto',
  successLeadUpdatedTitle: 'CRM Lead — Modifiche salvate',
  successLeadDeletedTitle: 'CRM Lead — Lead eliminato',
  successStatusTitle: 'CRM Lead — Stato aggiornato',
  successNoteTitle: 'CRM Lead — Nota salvata',
  fallbackLeadName: 'Lead in arrivo',
  backToDashboard: 'Torna alla dashboard',
  pipelineKanban: 'Pipeline Kanban',
  tableColumnLead: 'Lead',
  deleting: 'Eliminazione...',
  statusNew: 'Nuovo',
  statusContacted: 'Contattato',
  statusFollowup: 'Follow-up',
  statusClosed: 'Chiuso',
  statusLost: 'Perso',
  priorityLow: 'Bassa',
  priorityMedium: 'Media',
  priorityHigh: 'Alta',
  marketItaly: 'Italia',
  marketUsa: 'USA',
};

const en: LeadsPageUi = {
  premiumRequired: 'Premium plan required',
  premiumRequiredDesc:
    'Lead Manager + AI is a Premium feature. Upgrade your account to the PRO or AGENCY plan.',
  error: 'Error',
  loadingError: 'Error loading leads',
  connectionError: 'Connection error',
  nameRequired: 'Name is required',
  leadCreated: 'Lead created',
  leadCreatedDesc: '{name} was added successfully',
  createError: 'Error creating lead',
  leadUpdated: 'Lead updated',
  leadUpdatedDesc: '{name} was updated',
  updateError: 'Error updating lead',
  leadDeleted: 'Lead deleted',
  leadDeletedDesc: '{name} was deleted',
  deleteError: 'Error deleting lead',
  statusUpdated: 'Status updated',
  statusUpdateError: 'Error updating status',
  detailsError: 'Error loading details',
  noteError: 'Error adding note',
  newLead: 'New Lead',
  total: 'Total',
  status: 'Status',
  priority: 'Priority',
  market: 'Market',
  allStatuses: 'All statuses',
  allPriorities: 'All priorities',
  allMarkets: 'All markets',
  noLeads: 'No leads found',
  adjustFilters: 'Try adjusting your search filters',
  addFirstLead: 'Start by adding your first leads',
  addLead: 'Add Lead',
  contacts: 'Contacts',
  score: 'Score',
  date: 'Date',
  actions: 'Actions',
  leadManagerTitle: 'Lead Manager + AI',
  leadManagerDesc:
    'This feature is only available for PRO and AGENCY users. Upgrade your account to unlock the full CRM with pipeline, automations, and AI.',
  pageSubtitle: 'CRM with pipeline, filters, and AI insights — one place to qualify and follow every lead.',
  searchPlaceholder: 'Search by name, email, or phone...',
  noteAdded: 'Note added',
  noteSaved: 'The note has been saved',
  delete: 'Delete',
  addLeadInfo: 'Enter the new lead information',
  editLead: 'Edit Lead',
  editLeadInfo: 'Edit the lead information',
  name: 'Name',
  phone: 'Phone',
  leadMessage: 'Lead message',
  leadMessagePlaceholder: 'Enter the message received from the lead...',
  cancel: 'Cancel',
  saveChanges: 'Save changes',
  leadDetails: 'Lead details',
  created: 'Created',
  updated: 'Updated',
  notes: 'Notes',
  areYouSure: 'Are you sure?',
  deleteWarning: 'You are about to delete the lead "{name}". This action cannot be undone.',
  successLeadCreatedTitle: 'Lead CRM — Lead added',
  successLeadUpdatedTitle: 'Lead CRM — Changes saved',
  successLeadDeletedTitle: 'Lead CRM — Lead removed',
  successStatusTitle: 'Lead CRM — Status updated',
  successNoteTitle: 'Lead CRM — Note saved',
  fallbackLeadName: 'Incoming lead',
  backToDashboard: 'Back to dashboard',
  pipelineKanban: 'Kanban pipeline',
  tableColumnLead: 'Lead',
  deleting: 'Deleting…',
  statusNew: 'New',
  statusContacted: 'Contacted',
  statusFollowup: 'Follow-up',
  statusClosed: 'Closed',
  statusLost: 'Lost',
  priorityLow: 'Low',
  priorityMedium: 'Medium',
  priorityHigh: 'High',
  marketItaly: 'Italy',
  marketUsa: 'USA',
};

export const leadsPageUiIt = it;
export const leadsPageUiEn = en;
