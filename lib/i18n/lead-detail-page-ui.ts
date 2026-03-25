/** Copy for `/dashboard/leads/[id]`. IT + EN; merge EN for other locales. */
export type LeadDetailPageUi = {
  copySuccessTitle: string;
  copySuccessDesc: string;
  clipboardFailureDesc: string;
  statusNew: string;
  statusContacted: string;
  statusFollowup: string;
  statusClosed: string;
  statusLost: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  backToLeads: string;
  headerSubtitle: string;
  analyzeBtn: string;
  regenerateBtn: string;
  enrichBtn: string;
  leadInfoTitle: string;
  followupBtn: string;
  noEmail: string;
  noPhone: string;
  fromCache: string;
  aiInsightsTitle: string;
  notFound: string;
  backToList: string;
  psychoTitle: string;
  buyerType: string;
  motivations: string;
  decisionStyle: string;
  painPoints: string;
  preferenceTitle: string;
  propertyType: string;
  budgetSectionTitle: string;
  timeline: string;
  location: string;
  priorityFeatures: string;
  scoringTitle: string;
  scoreLabel: string;
  priorityLabel: string;
  urgencyLabel: string;
  conversionProb: string;
  strongPoints: string;
  weakPoints: string;
  strategyTitle: string;
  approach: string;
  talkingPoints: string;
  objections: string;
  proposedProps: string;
  notesTitle: string;
  noNotes: string;
  automationsTitle: string;
  noAutomations: string;
  aiActivityTitle: string;
  aiActivityDesc: string;
  aiActivityEnrichment: string;
  aiActivityFromCache: string;
  aiActivityNoEvents: string;
  moreAiActions: string;
  success: string;
  error: string;
  ruleLabel: string;
  triggerLabel: string;
  loadError: string;
  enrichError: string;
  analysisComplete: string;
  fromCacheDesc: string;
  analysisDone: string;
  budgetCapacity: string;
  budgetFlexibility: string;
  buyerPersonaTitle: string;
  ageLabel: string;
  professionLabel: string;
  familyLabel: string;
  keyValuesLabel: string;
  purchaseTriggersLabel: string;
  strategyFrequency: string;
  strategyChannel: string;
  objectionsCardTitle: string;
  objectionsCardDesc: string;
  answerLabel: string;
  strategyShortLabel: string;
  leadQualityScore: string;
  generatedLabel: string;
  enrichEmptyTitle: string;
  enrichEmptyDesc: string;
  enrichAnalyzing: string;
  enrichStart: string;
  appliedAutomationsTitle: string;
  appliedAutomationsDesc: string;
  triggerStatusChanged: string;
  triggerNewLead: string;
  triggerScoreUpdated: string;
  scoreHot: string;
  scoreWarm: string;
  scoreCold: string;
};

const it: LeadDetailPageUi = {
  copySuccessTitle: 'Copiato!',
  copySuccessDesc: 'Testo copiato negli appunti',
  clipboardFailureDesc: 'Impossibile copiare il testo',
  statusNew: 'Nuovo',
  statusContacted: 'Contattato',
  statusFollowup: 'Follow-up',
  statusClosed: 'Chiuso',
  statusLost: 'Perso',
  priorityLow: 'Bassa',
  priorityMedium: 'Media',
  priorityHigh: 'Alta',
  backToLeads: 'Torna ai Lead',
  headerSubtitle: 'CRM 2.5 - Smart Lead Capture + AI',
  analyzeBtn: 'Analisi in corso...',
  regenerateBtn: 'Rigenera analisi AI',
  enrichBtn: 'Arricchisci lead con AI',
  leadInfoTitle: 'Informazioni lead',
  followupBtn: 'Email di follow-up AI',
  noEmail: 'Non fornita',
  noPhone: 'Non fornito',
  fromCache: 'Dalla cache (24h)',
  aiInsightsTitle: 'AI Lead Insights',
  notFound: 'Lead non trovato',
  backToList: 'Torna alla lista',
  psychoTitle: 'Profilo psicografico',
  buyerType: 'Tipo acquirente:',
  motivations: 'Motivazioni:',
  decisionStyle: 'Stile decisionale:',
  painPoints: 'Pain point:',
  preferenceTitle: 'Preferenze immobiliari',
  propertyType: 'Tipo immobile:',
  budgetSectionTitle: 'Budget',
  timeline: 'Timeline:',
  location: 'Zona preferita:',
  priorityFeatures: 'Caratteristiche prioritarie:',
  scoringTitle: 'Scoring e priorità',
  scoreLabel: 'Score:',
  priorityLabel: 'Priorità:',
  urgencyLabel: 'Urgenza:',
  conversionProb: 'P. conversione:',
  strongPoints: 'Punti forti:',
  weakPoints: 'Punti deboli:',
  strategyTitle: 'Strategia consigliata',
  approach: 'Approccio:',
  talkingPoints: 'Punti chiave:',
  objections: 'Obiezioni previste:',
  proposedProps: 'Immobili da proporre:',
  notesTitle: 'Note e attività',
  noNotes: 'Nessuna nota ancora',
  automationsTitle: 'Log automazioni',
  noAutomations: 'Nessuna automazione eseguita',
  aiActivityTitle: 'Attività AI su questo lead',
  aiActivityDesc:
    'Riepilogo di analisi, automazioni e azioni AI collegate a questo lead.',
  aiActivityEnrichment: 'Analisi Lead Insights completata',
  aiActivityFromCache: 'dato recuperato da cache',
  aiActivityNoEvents: 'Nessuna attività AI registrata finora.',
  moreAiActions: '+{count} altre azioni AI...',
  success: 'Successo',
  error: 'Errore',
  ruleLabel: 'Regola',
  triggerLabel: 'Trigger:',
  loadError: 'Impossibile caricare i dati del lead',
  enrichError: "Errore nell'arricchimento del lead",
  analysisComplete: 'Analisi completata!',
  fromCacheDesc: 'Dati recuperati dalla cache',
  analysisDone: 'Analisi AI completata in {ms}ms',
  budgetCapacity: 'Capacità:',
  budgetFlexibility: 'Flessibilità:',
  buyerPersonaTitle: 'Buyer persona',
  ageLabel: 'Età:',
  professionLabel: 'Professione:',
  familyLabel: 'Famiglia:',
  keyValuesLabel: 'Valori chiave:',
  purchaseTriggersLabel: 'Trigger acquisto:',
  strategyFrequency: 'Frequenza:',
  strategyChannel: 'Canale:',
  objectionsCardTitle: 'Obiezioni probabili e risposte AI',
  objectionsCardDesc: 'Anticipa le obiezioni e preparati con risposte efficaci',
  answerLabel: 'Risposta:',
  strategyShortLabel: 'Strategia:',
  leadQualityScore: 'Punteggio qualità lead',
  generatedLabel: 'Generato:',
  enrichEmptyTitle: "Arricchisci questo lead con l'AI",
  enrichEmptyDesc:
    'Ottieni un profilo psicografico completo, probabilità di chiusura, budget stimato, obiezioni probabili con risposte pronte e una strategia di follow-up personalizzata.',
  enrichAnalyzing: 'Analisi AI in corso...',
  enrichStart: 'Avvia analisi AI',
  appliedAutomationsTitle: 'Automazioni applicate',
  appliedAutomationsDesc: 'Storico delle regole di automazione eseguite su questo lead',
  triggerStatusChanged: 'Status cambiato',
  triggerNewLead: 'Nuovo lead',
  triggerScoreUpdated: 'Score aggiornato',
  scoreHot: 'Hot',
  scoreWarm: 'Warm',
  scoreCold: 'Cold',
};

const en: LeadDetailPageUi = {
  copySuccessTitle: 'Copied!',
  copySuccessDesc: 'Text copied to clipboard',
  clipboardFailureDesc: 'Unable to copy text',
  statusNew: 'New',
  statusContacted: 'Contacted',
  statusFollowup: 'Follow-up',
  statusClosed: 'Closed',
  statusLost: 'Lost',
  priorityLow: 'Low',
  priorityMedium: 'Medium',
  priorityHigh: 'High',
  backToLeads: 'Back to leads',
  headerSubtitle: 'CRM 2.5 - Smart Lead Capture + AI',
  analyzeBtn: 'Analyzing...',
  regenerateBtn: 'Regenerate AI analysis',
  enrichBtn: 'Enrich lead with AI',
  leadInfoTitle: 'Lead information',
  followupBtn: 'Follow-up email AI',
  noEmail: 'Not provided',
  noPhone: 'Not provided',
  fromCache: 'From cache (24h)',
  aiInsightsTitle: 'AI Lead Insights',
  notFound: 'Lead not found',
  backToList: 'Back to list',
  psychoTitle: 'Psychographic profile',
  buyerType: 'Buyer type:',
  motivations: 'Motivations:',
  decisionStyle: 'Decision style:',
  painPoints: 'Pain points:',
  preferenceTitle: 'Property preferences',
  propertyType: 'Property type:',
  budgetSectionTitle: 'Budget',
  timeline: 'Timeline:',
  location: 'Preferred area:',
  priorityFeatures: 'Priority features:',
  scoringTitle: 'Scoring & priority',
  scoreLabel: 'Score:',
  priorityLabel: 'Priority:',
  urgencyLabel: 'Urgency:',
  conversionProb: 'Conv. probability:',
  strongPoints: 'Strong points:',
  weakPoints: 'Weak points:',
  strategyTitle: 'Recommended strategy',
  approach: 'Approach:',
  talkingPoints: 'Key points:',
  objections: 'Expected objections:',
  proposedProps: 'Properties to propose:',
  notesTitle: 'Notes & activities',
  noNotes: 'No notes yet',
  automationsTitle: 'Automation logs',
  noAutomations: 'No automations executed',
  aiActivityTitle: 'AI activity on this lead',
  aiActivityDesc: 'Summary of analysis, automations, and AI actions related to this lead.',
  aiActivityEnrichment: 'Lead Insights analysis completed',
  aiActivityFromCache: 'data retrieved from cache',
  aiActivityNoEvents: 'No AI activity recorded yet.',
  moreAiActions: '+{count} more AI actions...',
  success: 'Success',
  error: 'Error',
  ruleLabel: 'Rule',
  triggerLabel: 'Trigger:',
  loadError: 'Cannot load lead data',
  enrichError: 'Error enriching lead',
  analysisComplete: 'Analysis complete!',
  fromCacheDesc: 'Data retrieved from cache',
  analysisDone: 'AI analysis completed in {ms}ms',
  budgetCapacity: 'Capacity:',
  budgetFlexibility: 'Flexibility:',
  buyerPersonaTitle: 'Buyer persona',
  ageLabel: 'Age:',
  professionLabel: 'Profession:',
  familyLabel: 'Family:',
  keyValuesLabel: 'Key values:',
  purchaseTriggersLabel: 'Purchase triggers:',
  strategyFrequency: 'Frequency:',
  strategyChannel: 'Channel:',
  objectionsCardTitle: 'Likely objections & AI responses',
  objectionsCardDesc: 'Anticipate objections and prepare effective responses',
  answerLabel: 'Answer:',
  strategyShortLabel: 'Strategy:',
  leadQualityScore: 'Lead quality score',
  generatedLabel: 'Generated:',
  enrichEmptyTitle: 'Enrich this lead with AI',
  enrichEmptyDesc:
    'Get a full psychographic profile, closing probability, estimated budget, likely objections with ready answers, and a personalized follow-up strategy.',
  enrichAnalyzing: 'AI analysis in progress...',
  enrichStart: 'Start AI analysis',
  appliedAutomationsTitle: 'Applied automations',
  appliedAutomationsDesc: 'History of automation rules executed on this lead',
  triggerStatusChanged: 'Status changed',
  triggerNewLead: 'New lead',
  triggerScoreUpdated: 'Score updated',
  scoreHot: 'Hot',
  scoreWarm: 'Warm',
  scoreCold: 'Cold',
};

export const leadDetailPageUiIt = it;
export const leadDetailPageUiEn = en;
