// Database types matching Supabase schema

export interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'free' | 'starter' | 'pro' | 'agency';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyInput {
  location: string;
  propertyType: string;
  size?: number;
  rooms?: number;
  price?: string;
  features?: string;
  notes?: string;
  style?: 'luxury' | 'investment' | 'standard';
  market?: 'usa' | 'italy';
}

export interface GeneratedContent {
  professional: string;
  short: string;
  titles: string[];
  english: string;
}

export interface SavedListing {
  id: number;
  user_id: string;
  title: string;
  property_data: PropertyInput;
  generated_content: GeneratedContent;
  created_at: string;
  updated_at: string;
}

export interface InsertSavedListing {
  title: string;
  property_data: PropertyInput;
  generated_content: GeneratedContent;
}

export interface AgencyBranding {
  id: number;
  user_id: string;
  agency_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsertAgencyBranding {
  agency_name: string;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  website_url?: string | null;
}

export type AutomationType = 'followup' | 'reminder' | 'weekly-content';
export type AutomationRepeatInterval = 'once' | 'daily' | 'weekly';
export type AutomationStatus = 'active' | 'paused' | 'completed' | 'failed';

export interface FollowupPayload {
  client_name: string;
  client_email: string;
  property_type: string;
  property_location?: string;
  delay_hours: number;
  email_type: 'immediate' | '24h' | '72h' | 'appointment' | 'post-visit' | 'luxury';
}

export interface ReminderPayload {
  client_name: string;
  client_email: string;
  property_type: string;
  property_location: string;
  visit_date: string;
  reminder_type: '3h' | '24h';
}

export interface WeeklyContentPayload {
  content_types: ('social_post' | 'newsletter' | 'ab_titles')[];
  property_focus?: string;
  target_market?: 'ita' | 'usa' | 'international';
}

export type AutomationPayload = FollowupPayload | ReminderPayload | WeeklyContentPayload;

export interface Automation {
  id: string;
  user_id: string;
  type: AutomationType;
  name: string;
  payload: AutomationPayload;
  next_run: string | null;
  last_run: string | null;
  repeat_interval: AutomationRepeatInterval;
  status: AutomationStatus;
  execution_count: number;
  last_result: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsertAutomation {
  type: AutomationType;
  name: string;
  payload: AutomationPayload;
  next_run?: string | null;
  repeat_interval: AutomationRepeatInterval;
}

export interface AutomationLog {
  id: string;
  automation_id: string;
  user_id: string;
  executed_at: string;
  status: 'success' | 'failed';
  result: string | null;
  error: string | null;
}

// ============================================
// CRM LIGHT - Lead Management Types
// ============================================

export type LeadPriority = 'low' | 'medium' | 'high';
export type LeadStatus = 'new' | 'contacted' | 'followup' | 'closed' | 'lost';
export type LeadMarket = 'italy' | 'usa';

export interface Lead {
  id: string;
  user_id: string;
  nome: string;
  email: string | null;
  telefono: string | null;
  messaggio: string | null;
  priorita: LeadPriority;
  status: LeadStatus;
  lead_score: number;
  market: LeadMarket;
  created_at: string;
  updated_at: string;
}

export interface InsertLead {
  nome: string;
  email?: string | null;
  telefono?: string | null;
  messaggio?: string | null;
  priorita?: LeadPriority;
  status?: LeadStatus;
  lead_score?: number;
  market?: LeadMarket;
}

export interface UpdateLead {
  nome?: string;
  email?: string | null;
  telefono?: string | null;
  messaggio?: string | null;
  priorita?: LeadPriority;
  status?: LeadStatus;
  lead_score?: number;
  market?: LeadMarket;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  nota: string;
  created_at: string;
}

export interface InsertLeadNote {
  lead_id: string;
  nota: string;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status: LeadStatus | null;
  new_status: LeadStatus;
  changed_at: string;
}

// Lead with related data for detailed view
export interface LeadWithDetails extends Lead {
  notes?: LeadNote[];
  status_history?: LeadStatusHistory[];
}

// ============================================
// CRM 2.0 - Lead Enrichment AI Types
// ============================================

export interface LeadEnrichmentResult {
  profilo_psicografico: {
    tipo_acquirente: string;
    motivazioni_principali: string[];
    stile_decisionale: string;
    priorita_vita: string[];
    pain_points: string[];
  };
  probabilita_chiusura: {
    percentuale: number;
    livello: 'molto_alta' | 'alta' | 'media' | 'bassa' | 'molto_bassa';
    fattori_positivi: string[];
    fattori_negativi: string[];
  };
  budget_analysis: {
    budget_stimato_min: number;
    budget_stimato_max: number;
    fascia_prezzo: string;
    capacita_investimento: string;
    flessibilita_budget: string;
  };
  fascia_immobile: {
    tipologie_consigliate: string[];
    zone_ideali: string[];
    caratteristiche_prioritarie: string[];
    elementi_da_evitare: string[];
  };
  obiezioni_probabili: Array<{
    obiezione: string;
    probabilita: 'alta' | 'media' | 'bassa';
    risposta_suggerita: string;
    strategia: string;
  }>;
  buyer_persona: {
    nome_persona: string;
    descrizione_breve: string;
    eta_stimata: string;
    professione_probabile: string;
    situazione_familiare: string;
    valori_chiave: string[];
    canali_preferiti: string[];
    trigger_acquisto: string[];
  };
  strategia_followup: {
    approccio_consigliato: string;
    frequenza_contatto: string;
    canale_preferito: string;
    messaggi_chiave: string[];
    tempistiche: string;
    azioni_prioritarie: string[];
  };
  punteggio_qualita: {
    score: number;
    interpretazione: string;
  };
  generato_il: string;
}

export interface LeadEnrichment {
  id: string;
  lead_id: string;
  user_id: string;
  enrichment_data: LeadEnrichmentResult;
  created_at: string;
  expires_at: string;
}

// ============================================
// CRM 2.5 - Smart Lead Capture API Keys
// ============================================

export interface UserApiKey {
  id: string;
  user_id: string;
  name: string;
  api_key: string;
  is_active: boolean;
  auto_lead_score: boolean;
  auto_followup: boolean;
  default_market: LeadMarket;
  leads_captured: number;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface InsertUserApiKey {
  name: string;
  auto_lead_score?: boolean;
  auto_followup?: boolean;
  default_market?: LeadMarket;
}

export interface UpdateUserApiKey {
  name?: string;
  is_active?: boolean;
  auto_lead_score?: boolean;
  auto_followup?: boolean;
  default_market?: LeadMarket;
}

export interface LeadCapturePayload {
  nome: string;
  email?: string;
  telefono?: string;
  messaggio?: string;
  property_url?: string;
  source?: string;
  market?: LeadMarket;
}

// ============================================
// CRM 3.0 - Automation Center Types
// ============================================

export type AutomationTriggerType = 'new_lead' | 'score_updated' | 'status_changed' | 'priority_changed' | 'market_changed' | 'email_sent' | 'whatsapp_sent' | 'sms_sent';

export type AutomationConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'not_contains';

export interface AutomationCondition {
  field: string;
  operator: AutomationConditionOperator;
  value: string | number | boolean;
}

export interface AutomationConditionGroup {
  all?: AutomationCondition[];
  any?: AutomationCondition[];
  field?: string;
  operator?: AutomationConditionOperator;
  value?: string | number | boolean;
}

export type AutomationActionType = 'update_status' | 'update_priority' | 'assign_to' | 'send_email' | 'send_whatsapp' | 'send_sms' | 'add_note' | 'trigger_lead_score' | 'trigger_enrichment';

export interface AutomationAction {
  type: AutomationActionType;
  value?: string;
  template?: string;
}

export interface AutomationActionGroup {
  actions?: AutomationAction[];
  type?: AutomationActionType;
  value?: string;
  template?: string;
}

export interface AutomationRule {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  trigger_type: AutomationTriggerType;
  condition: AutomationConditionGroup;
  action: AutomationActionGroup;
  is_active: boolean;
  execution_count: number;
  last_executed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsertAutomationRule {
  name: string;
  description?: string;
  trigger_type: AutomationTriggerType;
  condition: AutomationConditionGroup;
  action: AutomationActionGroup;
  is_active?: boolean;
}

export interface UpdateAutomationRule {
  name?: string;
  description?: string;
  trigger_type?: AutomationTriggerType;
  condition?: AutomationConditionGroup;
  action?: AutomationActionGroup;
  is_active?: boolean;
}

export interface AutomationAssignment {
  id: string;
  user_id: string;
  lead_id: string;
  assigned_to: string;
  assigned_by: string | null;
  rule_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface AutomationLog {
  id: string;
  user_id: string;
  rule_id: string;
  lead_id: string | null;
  trigger_type: AutomationTriggerType;
  condition_matched: AutomationConditionGroup | null;
  action_applied: AutomationActionGroup | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export interface AutomationExecuteRequest {
  trigger_type: AutomationTriggerType;
  lead_id: string;
  lead_data: Partial<Lead>;
  previous_data?: Partial<Lead>;
}

// =====================================================
// CRM 4.0 - Communication Hub Types
// =====================================================

export type CommunicationChannel = 'email' | 'whatsapp' | 'sms';
export type CommunicationDirection = 'outbound' | 'inbound';
export type CommunicationStatus = 'sent' | 'delivered' | 'failed' | 'pending';
export type CommunicationTone = 'professional' | 'emotional' | 'luxury' | 'casual' | 'urgent';

export interface CommunicationLog {
  id: string;
  lead_id: string;
  user_id: string;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  subject: string | null;
  message: string;
  metadata: Record<string, unknown>;
  status: CommunicationStatus;
  created_at: string;
}

export interface InsertCommunicationLog {
  lead_id: string;
  channel: CommunicationChannel;
  direction?: CommunicationDirection;
  subject?: string;
  message: string;
  metadata?: Record<string, unknown>;
  status?: CommunicationStatus;
}

export interface CommunicationTemplate {
  id: string;
  user_id: string;
  channel: CommunicationChannel;
  name: string;
  subject: string | null;
  content: string;
  tone: CommunicationTone;
  variables: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface InsertCommunicationTemplate {
  channel: CommunicationChannel;
  name: string;
  subject?: string;
  content: string;
  tone?: CommunicationTone;
  variables?: string[];
}

export interface UpdateCommunicationTemplate {
  name?: string;
  subject?: string;
  content?: string;
  tone?: CommunicationTone;
  variables?: string[];
  is_active?: boolean;
}

export interface SendEmailRequest {
  lead_id: string;
  subject: string;
  message: string;
  template_id?: string;
  generate_ai?: boolean;
  tone?: CommunicationTone;
}

export interface SendWhatsAppRequest {
  lead_id: string;
  message: string;
  template_id?: string;
  generate_ai?: boolean;
  tone?: CommunicationTone;
}

export interface SendSMSRequest {
  lead_id: string;
  message: string;
  template_id?: string;
  generate_ai?: boolean;
}

export interface AIMessageGenerateRequest {
  lead_id: string;
  channel: CommunicationChannel;
  context?: string;
  tone?: CommunicationTone;
  max_length?: number;
}

export interface AIMessageGenerateResponse {
  subject?: string;
  message: string;
  variants?: string[];
  character_count?: number;
}
