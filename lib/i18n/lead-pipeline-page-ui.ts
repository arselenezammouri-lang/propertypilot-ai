/** Copy for `/dashboard/leads/pipeline` (Kanban). IT + EN; merge EN for other locales. */
export type LeadPipelinePageUi = {
  loadingPipeline: string;
  heroTitle: string;
  heroBadge: string;
  heroSubtitle: string;
  tableView: string;
  refresh: string;
  noLeads: string;
  openLead: string;
  notAnalyzed: string;
  errorTitle: string;
  loadError: string;
  statusUpdated: string;
  /** Use {label} for column name */
  movedTo: string;
  automationApplied: string;
  /** Use {count} */
  automationRules: string;
  updateError: string;
  statusNew: string;
  statusContacted: string;
  statusFollowup: string;
  statusClosed: string;
  statusLost: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  backToDashboardAria: string;
  dashboardLink: string;
  legendHot: string;
  legendWarm: string;
  legendCold: string;
};

const it: LeadPipelinePageUi = {
  loadingPipeline: 'Caricamento pipeline...',
  heroTitle: 'Pipeline lead',
  heroBadge: 'CRM 2.5',
  heroSubtitle: 'Trascina i lead tra le colonne per aggiornare lo stato',
  tableView: 'Vista tabella',
  refresh: 'Aggiorna',
  noLeads: 'Nessun lead',
  openLead: 'Apri lead',
  notAnalyzed: 'Non analizzato',
  errorTitle: 'Errore',
  loadError: 'Impossibile caricare i lead',
  statusUpdated: 'Stato aggiornato',
  movedTo: 'Lead spostato in «{label}»',
  automationApplied: 'Automazione applicata',
  automationRules: '{count} regola/e eseguita/e',
  updateError: 'Impossibile aggiornare lo stato del lead',
  statusNew: 'Nuovi',
  statusContacted: 'Contattati',
  statusFollowup: 'Follow-up',
  statusClosed: 'Chiusi',
  statusLost: 'Persi',
  priorityLow: 'Bassa',
  priorityMedium: 'Media',
  priorityHigh: 'Alta',
  backToDashboardAria: 'Torna alla dashboard',
  dashboardLink: 'Dashboard',
  legendHot: 'Punteggio 80-100 (Hot)',
  legendWarm: 'Punteggio 50-79 (Warm)',
  legendCold: 'Punteggio 0-49 (Cold)',
};

const en: LeadPipelinePageUi = {
  loadingPipeline: 'Loading pipeline...',
  heroTitle: 'Leads pipeline',
  heroBadge: 'CRM 2.5',
  heroSubtitle: 'Drag leads between columns to update their status',
  tableView: 'Table view',
  refresh: 'Refresh',
  noLeads: 'No leads',
  openLead: 'Open lead',
  notAnalyzed: 'Not analyzed',
  errorTitle: 'Error',
  loadError: 'Cannot load leads',
  statusUpdated: 'Status updated',
  movedTo: 'Lead moved to "{label}"',
  automationApplied: 'Automation applied',
  automationRules: '{count} rule(s) executed',
  updateError: 'Cannot update lead status',
  statusNew: 'New',
  statusContacted: 'Contacted',
  statusFollowup: 'Follow-up',
  statusClosed: 'Closed',
  statusLost: 'Lost',
  priorityLow: 'Low',
  priorityMedium: 'Medium',
  priorityHigh: 'High',
  backToDashboardAria: 'Back to dashboard',
  dashboardLink: 'Dashboard',
  legendHot: 'Score 80-100 (Hot)',
  legendWarm: 'Score 50-79 (Warm)',
  legendCold: 'Score 0-49 (Cold)',
};

export const leadPipelinePageUiIt = it;
export const leadPipelinePageUiEn = en;
