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
  Check
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
import { useToast } from '@/hooks/use-toast';
import type { 
  AutomationRule, 
  AutomationTriggerType, 
  AutomationConditionOperator,
  AutomationActionType,
  AutomationLog
} from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

const TRIGGER_LABELS: Record<AutomationTriggerType, { label: string; description: string; icon: string }> = {
  new_lead: { label: 'Nuovo Lead', description: 'Quando arriva un nuovo lead', icon: '🆕' },
  score_updated: { label: 'Score Aggiornato', description: 'Quando il lead score cambia', icon: '📊' },
  status_changed: { label: 'Status Cambiato', description: 'Quando lo status del lead cambia', icon: '🔄' },
  priority_changed: { label: 'Priorità Cambiata', description: 'Quando la priorità cambia', icon: '⚡' },
  market_changed: { label: 'Mercato Cambiato', description: 'Quando il mercato di riferimento cambia', icon: '🌍' },
  email_sent: { label: 'Email Inviata', description: 'Quando viene inviata un\'email al lead', icon: '📧' },
  whatsapp_sent: { label: 'WhatsApp Inviato', description: 'Quando viene inviato un messaggio WhatsApp', icon: '💬' },
  sms_sent: { label: 'SMS Inviato', description: 'Quando viene inviato un SMS al lead', icon: '📱' }
};

const OPERATOR_LABELS: Record<AutomationConditionOperator, string> = {
  eq: 'è uguale a',
  neq: 'è diverso da',
  gt: 'è maggiore di',
  gte: 'è maggiore o uguale a',
  lt: 'è minore di',
  lte: 'è minore o uguale a',
  contains: 'contiene',
  not_contains: 'non contiene'
};

const FIELD_OPTIONS = [
  { value: 'lead_score', label: 'Lead Score', type: 'number' },
  { value: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'followup', 'closed', 'lost'] },
  { value: 'priorita', label: 'Priorità', type: 'select', options: ['low', 'medium', 'high'] },
  { value: 'market', label: 'Mercato', type: 'select', options: ['italy', 'usa'] },
  { value: 'source', label: 'Fonte', type: 'text' },
  { value: 'messaggio', label: 'Messaggio', type: 'text' }
];

const ACTION_LABELS: Record<AutomationActionType, { label: string; description: string; needsValue: boolean }> = {
  update_status: { label: 'Aggiorna Status', description: 'Cambia lo status del lead', needsValue: true },
  update_priority: { label: 'Aggiorna Priorità', description: 'Cambia la priorità del lead', needsValue: true },
  assign_to: { label: 'Assegna a', description: 'Assegna il lead a un agente', needsValue: true },
  add_note: { label: 'Aggiungi Nota', description: 'Aggiunge una nota automatica', needsValue: true },
  send_email: { label: 'Invia Email', description: 'Invia un\'email template', needsValue: true },
  send_whatsapp: { label: 'Invia WhatsApp', description: 'Invia un messaggio WhatsApp template', needsValue: true },
  send_sms: { label: 'Invia SMS', description: 'Invia un SMS template', needsValue: true },
  trigger_lead_score: { label: 'Calcola Lead Score', description: 'Attiva il calcolo AI del lead score', needsValue: false },
  trigger_enrichment: { label: 'Arricchisci Lead', description: 'Attiva l\'arricchimento AI del lead', needsValue: false }
};

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
  const { toast } = useToast();
  
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const res = await fetch('/api/automations/rules');
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/automations/execute-rule?limit=50');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleCreateRule = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Errore', description: 'Inserisci un nome per la regola', variant: 'destructive' });
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

      const res = await fetch('/api/automations/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: 'Successo!', description: data.message });
        setShowCreateDialog(false);
        setFormData(initialFormData);
        fetchRules();
      } else {
        toast({ title: 'Errore', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Errore', description: 'Errore nella creazione della regola', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRule = async (ruleId: string, updates: Partial<AutomationRule>) => {
    try {
      const res = await fetch('/api/automations/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, ...updates })
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: 'Successo!', description: data.message });
        fetchRules();
      } else {
        toast({ title: 'Errore', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Errore', description: 'Errore nell\'aggiornamento', variant: 'destructive' });
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa regola?')) return;

    try {
      const res = await fetch(`/api/automations/rules?id=${ruleId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: 'Successo!', description: data.message });
        fetchRules();
      } else {
        toast({ title: 'Errore', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Errore', description: 'Errore nell\'eliminazione', variant: 'destructive' });
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
    if (!condition) return 'Nessuna condizione';
    
    const field = FIELD_OPTIONS.find(f => f.value === condition.field)?.label || condition.field;
    const operator = OPERATOR_LABELS[condition.operator as AutomationConditionOperator] || condition.operator;
    const value = condition.value;
    
    return `${field} ${operator} "${value}"`;
  };

  const formatAction = (action: any) => {
    if (!action) return 'Nessuna azione';
    
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
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
                    Automation Center
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs">
                      CRM 3.0
                    </Badge>
                  </h1>
                  <p className="text-white/60 text-sm">Crea regole automatiche per gestire i tuoi lead</p>
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
                Nuova Regola
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-400" />
                  Crea Nuova Regola
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Definisci trigger, condizione e azione per la tua automazione
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-white/80">Nome Regola *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Es: Lead Hot → Follow-up"
                      className="bg-white/5 border-white/10 text-white mt-1"
                      data-testid="input-rule-name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-white/80">Descrizione (opzionale)</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrivi cosa fa questa regola..."
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
                    <span className="font-medium">TRIGGER</span>
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
                    <span className="font-medium">CONDIZIONE</span>
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
                          <SelectValue placeholder="Seleziona..." />
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
                    <span className="font-medium">AZIONE</span>
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
                            <SelectValue placeholder="Seleziona status..." />
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
                            <SelectValue placeholder="Seleziona priorità..." />
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
                          placeholder={
                            formData.action_type === 'assign_to' ? 'Email agente...' :
                            formData.action_type === 'add_note' ? 'Testo nota...' :
                            formData.action_type === 'send_email' ? 'Template email...' : 'Valore...'
                          }
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
                  Annulla
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
                      Creazione...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Crea Regola
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
                  <p className="text-white/60 text-sm">Regole Totali</p>
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
                  <p className="text-white/60 text-sm">Regole Attive</p>
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
                  <p className="text-white/60 text-sm">Esecuzioni Totali</p>
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
                  <p className="text-white/60 text-sm">Log Recenti</p>
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
              Regole ({rules.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60" data-testid="tab-logs">
              <Activity className="h-4 w-4 mr-2" />
              Log Esecuzioni ({logs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {rules.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <Zap className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nessuna regola creata</h3>
                  <p className="text-white/60 mb-6">Crea la tua prima automazione per gestire i lead automaticamente</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    data-testid="button-create-first-rule"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crea Prima Regola
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
                                {rule.is_active ? 'Attiva' : 'Disattivata'}
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
                                {rule.execution_count || 0} esecuzioni
                              </span>
                              {rule.last_executed_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Ultima: {new Date(rule.last_executed_at).toLocaleDateString('it-IT')}
                                </span>
                              )}
                            </div>

                            {expandedRules.has(rule.id) && (
                              <div className="mt-4 p-3 rounded-lg bg-white/5 space-y-2">
                                <div className="flex items-center gap-2">
                                  <GitBranch className="h-4 w-4 text-cyan-400" />
                                  <span className="text-white/80 text-sm">
                                    <strong>Condizione:</strong> {formatCondition(rule.condition)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-emerald-400" />
                                  <span className="text-white/80 text-sm">
                                    <strong>Azione:</strong> {formatAction(rule.action)}
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
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            data-testid={`button-delete-rule-${rule.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
                  <h3 className="text-lg font-medium text-white mb-2">Nessun log disponibile</h3>
                  <p className="text-white/60">I log delle esecuzioni appariranno qui</p>
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
                                    {(log as any).automations_rules?.name || 'Regola'}
                                  </span>
                                  <Badge className={log.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                                    {log.success ? 'Successo' : 'Errore'}
                                  </Badge>
                                </div>
                                <p className="text-white/60 text-sm">
                                  Trigger: {TRIGGER_LABELS[log.trigger_type]?.label || log.trigger_type}
                                </p>
                                {log.error_message && (
                                  <p className="text-red-400 text-sm mt-1">{log.error_message}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-white/40 text-sm">
                              {new Date(log.created_at).toLocaleString('it-IT')}
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
                <h3 className="font-semibold text-white mb-2">Come funzionano le automazioni</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Le regole vengono eseguite automaticamente quando un lead soddisfa le condizioni</li>
                  <li>• Puoi creare fino a 20 regole per account</li>
                  <li>• Ogni regola può avere un trigger, una condizione e un'azione</li>
                  <li>• I log mostrano tutte le esecuzioni delle regole</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
