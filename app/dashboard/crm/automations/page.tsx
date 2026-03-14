'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ArrowLeft,
  Target,
  GitBranch,
  Activity,
  Settings,
  AlertTriangle,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DashboardCardSkeleton, ListSkeleton } from '@/components/ui/skeleton-loaders';
import { useToast } from '@/hooks/use-toast';
import { fetchApi } from '@/lib/api/client';
import { useLocale } from '@/lib/i18n/locale-context';
import type { 
  AutomationRule, 
  AutomationTriggerType, 
  AutomationConditionOperator,
  AutomationActionType,
  AutomationLog
} from '@/lib/types/database.types';

// Locale-aware label dicts are built inside the component

interface RuleFormData {
  name: string;
  description: string;
  trigger_type: AutomationTriggerType;
  condition_field: string;
  condition_operator: AutomationConditionOperator;
  condition_value: string;
  action_type: AutomationActionType;
  action_value: string;
}

const initialFormData: RuleFormData = {
  name: '',
  description: '',
  trigger_type: 'new_lead',
  condition_field: 'lead_score',
  condition_operator: 'gt',
  condition_value: '',
  action_type: 'update_status',
  action_value: ''
};

export default function AutomationCenterPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();

  const TRIGGER_LABELS: Record<AutomationTriggerType, { label: string; description: string; icon: string }> = {
    new_lead: { label: isItalian ? 'Nuovo Lead' : 'New Lead', description: isItalian ? 'Quando arriva un nuovo lead' : 'When a new lead arrives', icon: '🆕' },
    score_updated: { label: isItalian ? 'Score Aggiornato' : 'Score Updated', description: isItalian ? 'Quando il lead score cambia' : 'When the lead score changes', icon: '📊' },
    status_changed: { label: isItalian ? 'Status Cambiato' : 'Status Changed', description: isItalian ? 'Quando lo status del lead cambia' : 'When the lead status changes', icon: '🔄' },
    priority_changed: { label: isItalian ? 'Priorità Cambiata' : 'Priority Changed', description: isItalian ? 'Quando la priorità cambia' : 'When the priority changes', icon: '⚡' },
    market_changed: { label: isItalian ? 'Mercato Cambiato' : 'Market Changed', description: isItalian ? 'Quando il mercato di riferimento cambia' : 'When the reference market changes', icon: '🌍' },
    email_sent: { label: isItalian ? 'Email Inviata' : 'Email Sent', description: isItalian ? "Quando viene inviata un'email al lead" : 'When an email is sent to the lead', icon: '📧' },
    whatsapp_sent: { label: isItalian ? 'WhatsApp Inviato' : 'WhatsApp Sent', description: isItalian ? 'Quando viene inviato un messaggio WhatsApp' : 'When a WhatsApp message is sent', icon: '💬' },
    sms_sent: { label: isItalian ? 'SMS Inviato' : 'SMS Sent', description: isItalian ? 'Quando viene inviato un SMS al lead' : 'When an SMS is sent to the lead', icon: '📱' },
  };

  const OPERATOR_LABELS: Record<AutomationConditionOperator, string> = {
    eq: isItalian ? 'è uguale a' : 'equals',
    neq: isItalian ? 'è diverso da' : 'not equals',
    gt: isItalian ? 'è maggiore di' : 'is greater than',
    gte: isItalian ? 'è maggiore o uguale a' : 'is greater than or equal to',
    lt: isItalian ? 'è minore di' : 'is less than',
    lte: isItalian ? 'è minore o uguale a' : 'is less than or equal to',
    contains: isItalian ? 'contiene' : 'contains',
    not_contains: isItalian ? 'non contiene' : 'does not contain',
  };

  const FIELD_OPTIONS = [
    { value: 'lead_score', label: 'Lead Score', type: 'number' },
    { value: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'followup', 'closed', 'lost'] },
    { value: 'priorita', label: isItalian ? 'Priorità' : 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
    { value: 'market', label: isItalian ? 'Mercato' : 'Market', type: 'select', options: ['italy', 'usa'] },
    { value: 'source', label: isItalian ? 'Fonte' : 'Source', type: 'text' },
    { value: 'messaggio', label: isItalian ? 'Messaggio' : 'Message', type: 'text' },
  ];

  const ACTION_LABELS: Record<AutomationActionType, { label: string; description: string; needsValue: boolean }> = {
    update_status: { label: isItalian ? 'Aggiorna Status' : 'Update Status', description: isItalian ? 'Cambia lo status del lead' : 'Change the lead status', needsValue: true },
    update_priority: { label: isItalian ? 'Aggiorna Priorità' : 'Update Priority', description: isItalian ? 'Cambia la priorità del lead' : 'Change the lead priority', needsValue: true },
    assign_to: { label: isItalian ? 'Assegna a' : 'Assign to', description: isItalian ? 'Assegna il lead a un agente' : 'Assign the lead to an agent', needsValue: true },
    add_note: { label: isItalian ? 'Aggiungi Nota' : 'Add Note', description: isItalian ? 'Aggiunge una nota automatica' : 'Adds an automatic note', needsValue: true },
    send_email: { label: isItalian ? 'Invia Email' : 'Send Email', description: isItalian ? "Invia un'email template" : 'Send a template email', needsValue: true },
    send_whatsapp: { label: isItalian ? 'Invia WhatsApp' : 'Send WhatsApp', description: isItalian ? 'Invia un messaggio WhatsApp template' : 'Send a WhatsApp template message', needsValue: true },
    send_sms: { label: isItalian ? 'Invia SMS' : 'Send SMS', description: isItalian ? 'Invia un SMS template' : 'Send a template SMS', needsValue: true },
    trigger_lead_score: { label: isItalian ? 'Calcola Lead Score' : 'Calculate Lead Score', description: isItalian ? 'Attiva il calcolo AI del lead score' : 'Trigger the AI lead score calculation', needsValue: false },
    trigger_enrichment: { label: isItalian ? 'Arricchisci Lead' : 'Enrich Lead', description: isItalian ? "Attiva l'arricchimento AI del lead" : 'Trigger AI lead enrichment', needsValue: false },
  };

  const t = {
    pageTitle: "Automation Center",
    pageBadge: "CRM 3.0",
    pageSubtitle: isItalian ? "Crea regole automatiche per gestire i tuoi lead" : "Create automatic rules to manage your leads",
    newRule: isItalian ? "Nuova Regola" : "New Rule",
    createRuleTitle: isItalian ? "Crea Nuova Regola" : "Create New Rule",
    createRuleDesc: isItalian
      ? "Definisci trigger, condizione e azione per la tua automazione"
      : "Define trigger, condition and action for your automation",
    ruleNameLabel: isItalian ? "Nome Regola *" : "Rule Name *",
    ruleNamePlaceholder: isItalian ? "Es: Lead Hot → Follow-up" : "e.g. Hot Lead → Follow-up",
    descLabel: isItalian ? "Descrizione (opzionale)" : "Description (optional)",
    descPlaceholder: isItalian ? "Descrivi cosa fa questa regola..." : "Describe what this rule does...",
    triggerSection: "TRIGGER",
    conditionSection: isItalian ? "CONDIZIONE" : "CONDITION",
    actionSection: isItalian ? "AZIONE" : "ACTION",
    selectStatus: isItalian ? "Seleziona status..." : "Select status...",
    selectPriority: isItalian ? "Seleziona priorità..." : "Select priority...",
    selectValue: isItalian ? "Seleziona..." : "Select...",
    valueLabel: isItalian ? "Valore..." : "Value...",
    cancel: isItalian ? "Annulla" : "Cancel",
    creatingRule: isItalian ? "Creazione..." : "Creating...",
    createRule: isItalian ? "Crea Regola" : "Create Rule",
    statsTotalRules: isItalian ? "Regole Totali" : "Total Rules",
    statsActiveRules: isItalian ? "Regole Attive" : "Active Rules",
    statsTotalExec: isItalian ? "Esecuzioni Totali" : "Total Executions",
    statsRecentLogs: isItalian ? "Log Recenti" : "Recent Logs",
    tabRules: (n: number) => isItalian ? `Regole (${n})` : `Rules (${n})`,
    tabLogs: (n: number) => isItalian ? `Log Esecuzioni (${n})` : `Execution Logs (${n})`,
    noRules: isItalian ? "Nessuna regola creata" : "No rules created",
    noRulesDesc: isItalian
      ? "Crea la tua prima automazione per gestire i lead automaticamente"
      : "Create your first automation to manage leads automatically",
    createFirstRule: isItalian ? "Crea Prima Regola" : "Create First Rule",
    active: isItalian ? "Attiva" : "Active",
    inactive: isItalian ? "Disattivata" : "Inactive",
    executions: (n: number) => isItalian ? `${n} esecuzioni` : `${n} executions`,
    lastExec: isItalian ? "Ultima:" : "Last:",
    conditionLabel: isItalian ? "Condizione:" : "Condition:",
    actionLabel: isItalian ? "Azione:" : "Action:",
    noCondition: isItalian ? "Nessuna condizione" : "No condition",
    noAction: isItalian ? "Nessuna azione" : "No action",
    noLogs: isItalian ? "Nessun log disponibile" : "No logs available",
    noLogsDesc: isItalian ? "I log delle esecuzioni appariranno qui" : "Execution logs will appear here",
    success: isItalian ? "Successo" : "Success",
    error: isItalian ? "Errore" : "Error",
    triggerLabel: isItalian ? "Trigger:" : "Trigger:",
    howItWorksTitle: isItalian ? "Come funzionano le automazioni" : "How automations work",
    howItWorksList: isItalian
      ? [
          "Le regole vengono eseguite automaticamente quando un lead soddisfa le condizioni",
          "Puoi creare fino a 20 regole per account",
          "Ogni regola può avere un trigger, una condizione e un'azione",
          "I log mostrano tutte le esecuzioni delle regole",
        ]
      : [
          "Rules are automatically executed when a lead meets the conditions",
          "You can create up to 20 rules per account",
          "Each rule can have a trigger, a condition and an action",
          "Logs show all rule executions",
        ],
    // toasts
    ruleNameRequired: isItalian ? "Inserisci un nome per la regola" : "Enter a name for the rule",
    deleteConfirm: isItalian
      ? "Sei sicuro di voler eliminare questa regola?"
      : "Are you sure you want to delete this rule?",
    successTitle: isItalian ? "Successo!" : "Success!",
    errorTitle: isItalian ? "Errore" : "Error",
    createError: isItalian ? "Errore nella creazione della regola" : "Error creating the rule",
    updateError: isItalian ? "Errore nell'aggiornamento" : "Update error",
    deleteError: isItalian ? "Errore nell'eliminazione" : "Deletion error",
    ruleDefault: isItalian ? "Regola" : "Rule",
  };
  
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('rules');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRules();
    fetchLogs();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetchApi<{ rules?: AutomationRule[] }>('/api/automations/rules');
      if (res.success && res.data != null) {
        setRules((res.data.rules ?? []) as AutomationRule[]);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetchApi<{ logs?: unknown[] }>('/api/automations/execute-rule?limit=50');
      if (res.success && res.data != null) {
        setLogs(res.data.logs ?? []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleCreateRule = async () => {
    if (!formData.name.trim()) {
      toast({ title: t.errorTitle, description: t.ruleNameRequired, variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        trigger_type: formData.trigger_type,
        condition: {
          field: formData.condition_field,
          operator: formData.condition_operator,
          value: formData.condition_field === 'lead_score' ? parseInt(formData.condition_value) : formData.condition_value
        },
        action: {
          type: formData.action_type,
          value: formData.action_value || undefined
        },
        is_active: true
      };

      const res = await fetchApi<{ message?: string }>('/api/automations/rules', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        toast({ title: t.successTitle, description: res.data?.message });
        setShowCreateDialog(false);
        setFormData(initialFormData);
        fetchRules();
      } else {
        toast({ title: t.errorTitle, description: res.error || res.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: t.errorTitle, description: t.createError, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRule = async (ruleId: string, updates: Partial<AutomationRule>) => {
    try {
      const res = await fetchApi<{ message?: string }>('/api/automations/rules', {
        method: 'PATCH',
        body: JSON.stringify({ id: ruleId, ...updates })
      });
      if (res.success) {
        toast({ title: t.successTitle, description: res.data?.message });
        fetchRules();
      } else {
        toast({ title: t.errorTitle, description: res.error || res.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: t.errorTitle, description: t.updateError, variant: 'destructive' });
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm(t.deleteConfirm)) return;
    setDeletingRuleId(ruleId);
    try {
      const res = await fetchApi<{ message?: string }>(`/api/automations/rules?id=${ruleId}`, { method: 'DELETE' });
      if (res.success) {
        toast({ title: t.successTitle, description: res.data?.message });
        fetchRules();
      } else {
        toast({ title: t.errorTitle, description: res.error || res.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: t.errorTitle, description: t.deleteError, variant: 'destructive' });
    } finally {
      setDeletingRuleId(null);
    }
  };

  const toggleRuleExpanded = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const formatCondition = (condition: any) => {
    if (!condition) return t.noCondition;
    const field = FIELD_OPTIONS.find(f => f.value === condition.field)?.label || condition.field;
    const operator = OPERATOR_LABELS[condition.operator as AutomationConditionOperator] || condition.operator;
    return `${field} ${operator} "${condition.value}"`;
  };

  const formatAction = (action: any) => {
    if (!action) return t.noAction;
    const actionInfo = ACTION_LABELS[action.type as AutomationActionType];
    if (!actionInfo) return action.type;
    return action.value ? `${actionInfo.label}: "${action.value}"` : actionInfo.label;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-purple-500';
      case 'followup': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <DashboardCardSkeleton />
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-400" />
                {t.pageTitle}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.pageSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ListSkeleton items={6} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-back"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {t.pageTitle}
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs">
                      {t.pageBadge}
                    </Badge>
                  </h1>
                  <p className="text-white/60 text-sm">{t.pageSubtitle}</p>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                data-testid="button-create-rule"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.newRule}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-400" />
                  {t.createRuleTitle}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  {t.createRuleDesc}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-white/80">{t.ruleNameLabel}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.ruleNamePlaceholder}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="input-rule-name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-white/80">{t.descLabel}</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t.descPlaceholder}
                      className="bg-white/5 border-white/10 text-white mt-1 resize-none"
                      rows={2}
                      data-testid="input-rule-description"
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{t.triggerSection}</span>
                  </div>
                  <Select
                    value={formData.trigger_type}
                    onValueChange={(value) => setFormData({ ...formData, trigger_type: value as AutomationTriggerType })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {Object.entries(TRIGGER_LABELS).map(([key, { label, description, icon }]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                          <span className="flex items-center gap-2">
                            <span>{icon}</span>
                            <span>{label}</span>
                            <span className="text-white/40 text-xs">- {description}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <GitBranch className="h-4 w-4" />
                    <span className="font-medium">{t.conditionSection}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={formData.condition_field}
                      onValueChange={(value) => setFormData({ ...formData, condition_field: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-condition-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field.value} value={field.value} className="text-white hover:bg-white/10">
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.condition_operator}
                      onValueChange={(value) => setFormData({ ...formData, condition_operator: value as AutomationConditionOperator })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-condition-operator">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {FIELD_OPTIONS.find(f => f.value === formData.condition_field)?.type === 'select' ? (
                      <Select
                        value={formData.condition_value}
                        onValueChange={(value) => setFormData({ ...formData, condition_value: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-condition-value">
                          <SelectValue placeholder={t.selectValue} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                          {FIELD_OPTIONS.find(f => f.value === formData.condition_field)?.options?.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={formData.condition_value}
                        onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                        placeholder={formData.condition_field === 'lead_score' ? 'Es: 70' : 'Valore...'}
                        type={formData.condition_field === 'lead_score' ? 'number' : 'text'}
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-condition-value"
                      />
                    )}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">{t.actionSection}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={formData.action_type}
                      onValueChange={(value) => setFormData({ ...formData, action_type: value as AutomationActionType })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-action-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {Object.entries(ACTION_LABELS).map(([key, { label, description }]) => (
                          <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                            <span className="flex flex-col">
                              <span>{label}</span>
                              <span className="text-white/40 text-xs">{description}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {ACTION_LABELS[formData.action_type]?.needsValue && (
                      formData.action_type === 'update_status' ? (
                        <Select
                          value={formData.action_value}
                          onValueChange={(value) => setFormData({ ...formData, action_value: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-action-value-status">
                            <SelectValue placeholder={t.selectStatus} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/10">
                            {['new', 'contacted', 'followup', 'closed', 'lost'].map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : formData.action_type === 'update_priority' ? (
                        <Select
                          value={formData.action_value}
                          onValueChange={(value) => setFormData({ ...formData, action_value: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-action-value-priority">
                            <SelectValue placeholder={t.selectPriority} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/10">
                            {['low', 'medium', 'high'].map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={formData.action_value}
                          onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
                          placeholder={t.valueLabel}
                          className="bg-white/5 border-white/10 text-white"
                          data-testid="input-action-value"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => { setShowCreateDialog(false); setFormData(initialFormData); }}
                  className="text-white/70 hover:text-white"
                  data-testid="button-cancel-rule"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={handleCreateRule}
                  disabled={saving || !formData.name.trim()}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  data-testid="button-save-rule"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t.creatingRule}
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      {t.createRule}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{t.statsTotalRules}</p>
                  <p className="text-3xl font-bold text-white">{rules.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/20">
                  <Zap className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{t.statsActiveRules}</p>
                  <p className="text-3xl font-bold text-emerald-400">{rules.filter(r => r.is_active).length}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <Play className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{t.statsTotalExec}</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {rules.reduce((sum, r) => sum + (r.execution_count || 0), 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/20">
                  <Activity className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{t.statsRecentLogs}</p>
                  <p className="text-3xl font-bold text-amber-400">{logs.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="rules" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60" data-testid="tab-rules">
              <Zap className="h-4 w-4 mr-2" />
              {t.tabRules(rules.length)}
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60" data-testid="tab-logs">
              <Activity className="h-4 w-4 mr-2" />
              {t.tabLogs(logs.length)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {rules.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <Zap className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">{t.noRules}</h3>
                  <p className="text-white/60 mb-6">{t.noRulesDesc}</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    data-testid="button-create-first-rule"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.createFirstRule}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <Card key={rule.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${rule.is_active ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                            <Zap className={`h-5 w-5 ${rule.is_active ? 'text-emerald-400' : 'text-white/40'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">{rule.name}</h3>
                              <Badge className={rule.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}>
                                {rule.is_active ? t.active : t.inactive}
                              </Badge>
                              <Badge className="bg-violet-500/20 text-violet-400">
                                {TRIGGER_LABELS[rule.trigger_type]?.icon} {TRIGGER_LABELS[rule.trigger_type]?.label}
                              </Badge>
                            </div>
                            {rule.description && (
                              <p className="text-white/60 text-sm mb-2">{rule.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-white/50">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {t.executions(rule.execution_count || 0)}
                              </span>
                              {rule.last_executed_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {t.lastExec} {new Date(rule.last_executed_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
                                </span>
                              )}
                            </div>

                            {expandedRules.has(rule.id) && (
                              <div className="mt-4 p-3 rounded-lg bg-white/5 space-y-2">
                                <div className="flex items-center gap-2">
                                  <GitBranch className="h-4 w-4 text-cyan-400" />
                                  <span className="text-white/80 text-sm">
                                    <strong>{t.conditionLabel}</strong> {formatCondition(rule.condition)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-emerald-400" />
                                  <span className="text-white/80 text-sm">
                                    <strong>{t.actionLabel}</strong> {formatAction(rule.action)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleRuleExpanded(rule.id)}
                            className="text-white/50 hover:text-white hover:bg-white/10"
                            data-testid={`button-expand-rule-${rule.id}`}
                            aria-label={expandedRules.has(rule.id) ? "Collapse rule" : "Expand rule"}
                          >
                            {expandedRules.has(rule.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={(checked) => handleUpdateRule(rule.id, { is_active: checked })}
                            data-testid={`switch-rule-${rule.id}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRule(rule.id)}
                            disabled={deletingRuleId !== null}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            data-testid={`button-delete-rule-${rule.id}`}
                            aria-label="Delete rule"
                          >
                            {deletingRuleId === rule.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {logs.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <Activity className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">{t.noLogs}</h3>
                  <p className="text-white/60">{t.noLogsDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-white/10">
                      {logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${log.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {log.success ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-400" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white">
                                    {(log as any).automations_rules?.name || t.ruleDefault}
                                  </span>
                                  <Badge className={log.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                                    {log.success ? t.success : t.error}
                                  </Badge>
                                </div>
                                <p className="text-white/60 text-sm">
                                  {t.triggerLabel} {TRIGGER_LABELS[log.trigger_type]?.label || log.trigger_type}
                                </p>
                                {log.error_message && (
                                  <p className="text-red-400 text-sm mt-1">{log.error_message}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-white/40 text-sm">
                              {new Date(log.created_at).toLocaleString(locale === 'it' ? 'it-IT' : 'en-US')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-violet-500/20">
                <AlertTriangle className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{t.howItWorksTitle}</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  {t.howItWorksList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
