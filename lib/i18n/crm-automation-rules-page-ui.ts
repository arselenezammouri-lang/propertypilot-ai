/**
 * Copy for `/dashboard/crm/automations` — if/then CRM rules (not workflow automations).
 * IT + EN; other locales deep-merge from EN in `dictionary.ts`.
 */
import type {
  AutomationActionType,
  AutomationConditionOperator,
  AutomationTriggerType,
} from '@/lib/types/database.types';

export type CrmAutomationRulesPageUi = {
  pageTitle: string;
  pageBadge: string;
  pageSubtitle: string;
  workflowsLink: string;
  workflowsHint: string;
  backAria: string;
  backLink: string;
  newRule: string;
  createRuleTitle: string;
  createRuleDesc: string;
  ruleNameLabel: string;
  ruleNamePlaceholder: string;
  descLabel: string;
  descPlaceholder: string;
  triggerSection: string;
  conditionSection: string;
  actionSection: string;
  selectStatus: string;
  selectPriority: string;
  selectValue: string;
  valueLabel: string;
  conditionValuePlaceholder: string;
  conditionValueExampleScore: string;
  cancel: string;
  creatingRule: string;
  createRule: string;
  statsTotalRules: string;
  statsActiveRules: string;
  statsTotalExec: string;
  statsRecentLogs: string;
  tabRules: string;
  tabLogs: string;
  noRules: string;
  noRulesDesc: string;
  createFirstRule: string;
  active: string;
  inactive: string;
  executions: string;
  lastExec: string;
  conditionLabel: string;
  actionLabel: string;
  noCondition: string;
  noAction: string;
  noLogs: string;
  noLogsDesc: string;
  success: string;
  error: string;
  triggerLabel: string;
  howItWorksTitle: string;
  howItWorksList: string[];
  ruleNameRequired: string;
  deleteConfirm: string;
  successTitle: string;
  errorTitle: string;
  createError: string;
  updateError: string;
  deleteError: string;
  ruleDefault: string;
  cannotLoadRules: string;
  expandRuleAria: string;
  collapseRuleAria: string;
  deleteRuleAria: string;
  triggers: Record<
    AutomationTriggerType,
    { label: string; description: string; icon: string }
  >;
  operators: Record<AutomationConditionOperator, string>;
  actions: Record<
    AutomationActionType,
    { label: string; description: string; needsValue: boolean }
  >;
  fieldLeadScore: string;
  fieldStatus: string;
  fieldPriority: string;
  fieldMarket: string;
  fieldSource: string;
  fieldMessage: string;
  statusLabels: Record<'new' | 'contacted' | 'followup' | 'closed' | 'lost', string>;
  priorityLabels: Record<'low' | 'medium' | 'high', string>;
  marketLabels: Record<'italy' | 'usa', string>;
};

const it: CrmAutomationRulesPageUi = {
  pageTitle: 'Regole automazione CRM',
  pageBadge: 'CRM 3.0',
  pageSubtitle:
    'If/then su eventi lead — distinto dai workflow follow-up / reminder nella sezione Automazioni.',
  workflowsLink: 'Workflow automazioni',
  workflowsHint:
    'Per follow-up pianificati, reminder visite e contenuti ricorrenti apri i workflow.',
  backAria: 'Torna alla dashboard',
  backLink: 'Dashboard',
  newRule: 'Nuova Regola',
  createRuleTitle: 'Crea Nuova Regola',
  createRuleDesc: 'Definisci trigger, condizione e azione per la tua automazione',
  ruleNameLabel: 'Nome Regola *',
  ruleNamePlaceholder: 'Es: Lead Hot → Follow-up',
  descLabel: 'Descrizione (opzionale)',
  descPlaceholder: 'Descrivi cosa fa questa regola...',
  triggerSection: 'TRIGGER',
  conditionSection: 'CONDIZIONE',
  actionSection: 'AZIONE',
  selectStatus: 'Seleziona status...',
  selectPriority: 'Seleziona priorità...',
  selectValue: 'Seleziona...',
  valueLabel: 'Valore...',
  conditionValuePlaceholder: 'Valore...',
  conditionValueExampleScore: 'Es: 70',
  cancel: 'Annulla',
  creatingRule: 'Creazione...',
  createRule: 'Crea Regola',
  statsTotalRules: 'Regole Totali',
  statsActiveRules: 'Regole Attive',
  statsTotalExec: 'Esecuzioni Totali',
  statsRecentLogs: 'Log Recenti',
  tabRules: 'Regole ({count})',
  tabLogs: 'Log Esecuzioni ({count})',
  noRules: 'Nessuna regola creata',
  noRulesDesc: 'Crea la tua prima automazione per gestire i lead automaticamente',
  createFirstRule: 'Crea Prima Regola',
  active: 'Attiva',
  inactive: 'Disattivata',
  executions: '{count} esecuzioni',
  lastExec: 'Ultima:',
  conditionLabel: 'Condizione:',
  actionLabel: 'Azione:',
  noCondition: 'Nessuna condizione',
  noAction: 'Nessuna azione',
  noLogs: 'Nessun log disponibile',
  noLogsDesc: 'I log delle esecuzioni appariranno qui',
  success: 'Successo',
  error: 'Errore',
  triggerLabel: 'Trigger:',
  howItWorksTitle: 'Come funzionano le automazioni',
  howItWorksList: [
    'Le regole vengono eseguite automaticamente quando un lead soddisfa le condizioni',
    'Puoi creare fino a 20 regole per account',
    "Ogni regola può avere un trigger, una condizione e un'azione",
    'I log mostrano tutte le esecuzioni delle regole',
  ],
  ruleNameRequired: 'Inserisci un nome per la regola',
  deleteConfirm: 'Sei sicuro di voler eliminare questa regola?',
  successTitle: 'Successo!',
  errorTitle: 'Errore',
  createError: 'Errore nella creazione della regola',
  updateError: "Errore nell'aggiornamento",
  deleteError: "Errore nell'eliminazione",
  ruleDefault: 'Regola',
  cannotLoadRules: 'Impossibile caricare le regole',
  expandRuleAria: 'Espandi dettagli regola',
  collapseRuleAria: 'Comprimi dettagli regola',
  deleteRuleAria: 'Elimina regola',
  triggers: {
    new_lead: {
      label: 'Nuovo Lead',
      description: 'Quando arriva un nuovo lead',
      icon: '🆕',
    },
    score_updated: {
      label: 'Score Aggiornato',
      description: 'Quando il lead score cambia',
      icon: '📊',
    },
    status_changed: {
      label: 'Status Cambiato',
      description: 'Quando lo status del lead cambia',
      icon: '🔄',
    },
    priority_changed: {
      label: 'Priorità Cambiata',
      description: 'Quando la priorità cambia',
      icon: '⚡',
    },
    market_changed: {
      label: 'Mercato Cambiato',
      description: 'Quando il mercato di riferimento cambia',
      icon: '🌍',
    },
    email_sent: {
      label: 'Email Inviata',
      description: "Quando viene inviata un'email al lead",
      icon: '📧',
    },
    whatsapp_sent: {
      label: 'WhatsApp Inviato',
      description: 'Quando viene inviato un messaggio WhatsApp',
      icon: '💬',
    },
    sms_sent: {
      label: 'SMS Inviato',
      description: 'Quando viene inviato un SMS al lead',
      icon: '📱',
    },
  },
  operators: {
    eq: 'è uguale a',
    neq: 'è diverso da',
    gt: 'è maggiore di',
    gte: 'è maggiore o uguale a',
    lt: 'è minore di',
    lte: 'è minore o uguale a',
    contains: 'contiene',
    not_contains: 'non contiene',
  },
  actions: {
    update_status: {
      label: 'Aggiorna Status',
      description: 'Cambia lo status del lead',
      needsValue: true,
    },
    update_priority: {
      label: 'Aggiorna Priorità',
      description: 'Cambia la priorità del lead',
      needsValue: true,
    },
    assign_to: {
      label: 'Assegna a',
      description: 'Assegna il lead a un agente',
      needsValue: true,
    },
    add_note: {
      label: 'Aggiungi Nota',
      description: 'Aggiunge una nota automatica',
      needsValue: true,
    },
    send_email: {
      label: 'Invia Email',
      description: "Invia un'email template",
      needsValue: true,
    },
    send_whatsapp: {
      label: 'Invia WhatsApp',
      description: 'Invia un messaggio WhatsApp template',
      needsValue: true,
    },
    send_sms: {
      label: 'Invia SMS',
      description: 'Invia un SMS template',
      needsValue: true,
    },
    trigger_lead_score: {
      label: 'Calcola Lead Score',
      description: 'Attiva il calcolo AI del lead score',
      needsValue: false,
    },
    trigger_enrichment: {
      label: 'Arricchisci Lead',
      description: "Attiva l'arricchimento AI del lead",
      needsValue: false,
    },
  },
  fieldLeadScore: 'Lead Score',
  fieldStatus: 'Status',
  fieldPriority: 'Priorità',
  fieldMarket: 'Mercato',
  fieldSource: 'Fonte',
  fieldMessage: 'Messaggio',
  statusLabels: {
    new: 'Nuovo',
    contacted: 'Contattato',
    followup: 'Follow-up',
    closed: 'Chiuso',
    lost: 'Perso',
  },
  priorityLabels: {
    low: 'Bassa',
    medium: 'Media',
    high: 'Alta',
  },
  marketLabels: {
    italy: 'Italia',
    usa: 'USA',
  },
};

const en: CrmAutomationRulesPageUi = {
  pageTitle: 'CRM automation rules',
  pageBadge: 'CRM 3.0',
  pageSubtitle:
    'If/then on lead events — separate from follow-up / reminder workflows under Automations.',
  workflowsLink: 'Automation workflows',
  workflowsHint:
    'For scheduled follow-ups, visit reminders, and recurring content, open workflows.',
  backAria: 'Back to dashboard',
  backLink: 'Dashboard',
  newRule: 'New Rule',
  createRuleTitle: 'Create New Rule',
  createRuleDesc: 'Define trigger, condition and action for your automation',
  ruleNameLabel: 'Rule Name *',
  ruleNamePlaceholder: 'e.g. Hot Lead → Follow-up',
  descLabel: 'Description (optional)',
  descPlaceholder: 'Describe what this rule does...',
  triggerSection: 'TRIGGER',
  conditionSection: 'CONDITION',
  actionSection: 'ACTION',
  selectStatus: 'Select status...',
  selectPriority: 'Select priority...',
  selectValue: 'Select...',
  valueLabel: 'Value...',
  conditionValuePlaceholder: 'Value...',
  conditionValueExampleScore: 'e.g. 70',
  cancel: 'Cancel',
  creatingRule: 'Creating...',
  createRule: 'Create Rule',
  statsTotalRules: 'Total Rules',
  statsActiveRules: 'Active Rules',
  statsTotalExec: 'Total Executions',
  statsRecentLogs: 'Recent Logs',
  tabRules: 'Rules ({count})',
  tabLogs: 'Execution Logs ({count})',
  noRules: 'No rules created',
  noRulesDesc: 'Create your first automation to manage leads automatically',
  createFirstRule: 'Create First Rule',
  active: 'Active',
  inactive: 'Inactive',
  executions: '{count} executions',
  lastExec: 'Last:',
  conditionLabel: 'Condition:',
  actionLabel: 'Action:',
  noCondition: 'No condition',
  noAction: 'No action',
  noLogs: 'No logs available',
  noLogsDesc: 'Execution logs will appear here',
  success: 'Success',
  error: 'Error',
  triggerLabel: 'Trigger:',
  howItWorksTitle: 'How automations work',
  howItWorksList: [
    'Rules run automatically when a lead meets the conditions',
    'You can create up to 20 rules per account',
    'Each rule can have a trigger, a condition, and an action',
    'Logs show every rule execution',
  ],
  ruleNameRequired: 'Enter a name for the rule',
  deleteConfirm: 'Are you sure you want to delete this rule?',
  successTitle: 'Success!',
  errorTitle: 'Error',
  createError: 'Error creating the rule',
  updateError: 'Update error',
  deleteError: 'Deletion error',
  ruleDefault: 'Rule',
  cannotLoadRules: 'Cannot load rules',
  expandRuleAria: 'Expand rule details',
  collapseRuleAria: 'Collapse rule details',
  deleteRuleAria: 'Delete rule',
  triggers: {
    new_lead: {
      label: 'New Lead',
      description: 'When a new lead arrives',
      icon: '🆕',
    },
    score_updated: {
      label: 'Score Updated',
      description: 'When the lead score changes',
      icon: '📊',
    },
    status_changed: {
      label: 'Status Changed',
      description: 'When the lead status changes',
      icon: '🔄',
    },
    priority_changed: {
      label: 'Priority Changed',
      description: 'When the priority changes',
      icon: '⚡',
    },
    market_changed: {
      label: 'Market Changed',
      description: 'When the reference market changes',
      icon: '🌍',
    },
    email_sent: {
      label: 'Email Sent',
      description: 'When an email is sent to the lead',
      icon: '📧',
    },
    whatsapp_sent: {
      label: 'WhatsApp Sent',
      description: 'When a WhatsApp message is sent',
      icon: '💬',
    },
    sms_sent: {
      label: 'SMS Sent',
      description: 'When an SMS is sent to the lead',
      icon: '📱',
    },
  },
  operators: {
    eq: 'equals',
    neq: 'not equals',
    gt: 'is greater than',
    gte: 'is greater than or equal to',
    lt: 'is less than',
    lte: 'is less than or equal to',
    contains: 'contains',
    not_contains: 'does not contain',
  },
  actions: {
    update_status: {
      label: 'Update Status',
      description: 'Change the lead status',
      needsValue: true,
    },
    update_priority: {
      label: 'Update Priority',
      description: 'Change the lead priority',
      needsValue: true,
    },
    assign_to: {
      label: 'Assign to',
      description: 'Assign the lead to an agent',
      needsValue: true,
    },
    add_note: {
      label: 'Add Note',
      description: 'Adds an automatic note',
      needsValue: true,
    },
    send_email: {
      label: 'Send Email',
      description: 'Send a template email',
      needsValue: true,
    },
    send_whatsapp: {
      label: 'Send WhatsApp',
      description: 'Send a WhatsApp template message',
      needsValue: true,
    },
    send_sms: {
      label: 'Send SMS',
      description: 'Send a template SMS',
      needsValue: true,
    },
    trigger_lead_score: {
      label: 'Calculate Lead Score',
      description: 'Trigger the AI lead score calculation',
      needsValue: false,
    },
    trigger_enrichment: {
      label: 'Enrich Lead',
      description: 'Trigger AI lead enrichment',
      needsValue: false,
    },
  },
  fieldLeadScore: 'Lead Score',
  fieldStatus: 'Status',
  fieldPriority: 'Priority',
  fieldMarket: 'Market',
  fieldSource: 'Source',
  fieldMessage: 'Message',
  statusLabels: {
    new: 'New',
    contacted: 'Contacted',
    followup: 'Follow-up',
    closed: 'Closed',
    lost: 'Lost',
  },
  priorityLabels: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  marketLabels: {
    italy: 'Italy',
    usa: 'USA',
  },
};

export const crmAutomationRulesPageUiIt = it;
export const crmAutomationRulesPageUiEn = en;
