'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Zap,
  Plus,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  Target,
  GitBranch,
  Activity,
  AlertTriangle,
  Loader2,
  UserPlus,
  BarChart3,
  Globe,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';
import { formatDateForLocale, formatDateTimeForLocale } from '@/lib/i18n/intl';
import { useAPIErrorHandler } from '@/components/error-boundary';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { ContextualHelpTrigger } from '@/components/contextual-help-trigger';
import Link from 'next/link';
import {
  apiFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';
import type {
  AutomationRule,
  AutomationTriggerType,
  AutomationConditionOperator,
  AutomationActionType,
  AutomationLog,
} from '@/lib/types/database.types';
import type { CrmAutomationTriggerIconKey } from '@/lib/i18n/crm-automation-rules-page-ui';

const CRM_TRIGGER_ICON_BY_KEY: Record<CrmAutomationTriggerIconKey, LucideIcon> = {
  userPlus: UserPlus,
  barChart3: BarChart3,
  refreshCw: RefreshCw,
  zap: Zap,
  globe: Globe,
  mail: Mail,
  messageSquare: MessageSquare,
  smartphone: Smartphone,
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
  const { locale, timezone } = useLocale();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const ui = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.crmAutomationRulesPage,
    [locale]
  );

  const TRIGGER_LABELS = ui.triggers;
  const OPERATOR_LABELS = ui.operators;
  const ACTION_LABELS = ui.actions;

  const FIELD_OPTIONS = useMemo(
    () =>
      [
        { value: 'lead_score' as const, label: ui.fieldLeadScore, type: 'number' as const },
        {
          value: 'status' as const,
          label: ui.fieldStatus,
          type: 'select' as const,
          options: ['new', 'contacted', 'followup', 'closed', 'lost'] as const,
        },
        {
          value: 'priorita' as const,
          label: ui.fieldPriority,
          type: 'select' as const,
          options: ['low', 'medium', 'high'] as const,
        },
        {
          value: 'market' as const,
          label: ui.fieldMarket,
          type: 'select' as const,
          options: ['italy', 'usa'] as const,
        },
        { value: 'source' as const, label: ui.fieldSource, type: 'text' as const },
        { value: 'messaggio' as const, label: ui.fieldMessage, type: 'text' as const },
      ] as const,
    [ui]
  );

  const t = ui;
  
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('rules');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const fetchRules = useCallback(async () => {
    try {
      const res = await fetchApi<{ rules?: AutomationRule[] }>('/api/automations/rules');
      if (res.success && res.data != null) {
        setRules((res.data.rules ?? []) as AutomationRule[]);
      } else if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          'crmAutomationRules',
          { status: res.status, error: res.error, message: res.message },
          t.cannotLoadRules
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
      }
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'crmAutomationRules');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [feedbackLocale, toast, handleAPIError, t.cannotLoadRules]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetchApi<{ logs?: AutomationLog[] }>('/api/automations/execute-rule?limit=50');
      if (res.success && res.data != null) {
        setLogs(res.data.logs ?? []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }, []);

  useEffect(() => {
    void fetchRules();
    void fetchLogs();
  }, [fetchRules, fetchLogs]);

  const handleCreateRule = async () => {
    if (!formData.name.trim()) {
      const v = validationToast(feedbackLocale, 'crmAutomationRules', t.ruleNameRequired);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
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
        const fail = apiFailureToast(
          feedbackLocale,
          'crmAutomationRules',
          { status: res.status, error: res.error, message: res.message },
          t.createError
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
      }
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'crmAutomationRules');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
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
        const fail = apiFailureToast(
          feedbackLocale,
          'crmAutomationRules',
          { status: res.status, error: res.error, message: res.message },
          t.updateError
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
      }
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'crmAutomationRules');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
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
        const fail = apiFailureToast(
          feedbackLocale,
          'crmAutomationRules',
          { status: res.status, error: res.error, message: res.message },
          t.deleteError
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
      }
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'crmAutomationRules');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
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

  const formatConditionValue = (field: string, raw: string) => {
    if (field === 'status') {
      const k = raw as keyof typeof ui.statusLabels;
      return ui.statusLabels[k] ?? raw;
    }
    if (field === 'priorita') {
      const k = raw as keyof typeof ui.priorityLabels;
      return ui.priorityLabels[k] ?? raw;
    }
    if (field === 'market') {
      const k = raw as keyof typeof ui.marketLabels;
      return ui.marketLabels[k] ?? raw;
    }
    return raw;
  };

  const formatCondition = (condition: any) => {
    if (!condition) return t.noCondition;
    const field = FIELD_OPTIONS.find((f) => f.value === condition.field)?.label || condition.field;
    const operator = OPERATOR_LABELS[condition.operator as AutomationConditionOperator] || condition.operator;
    const displayVal = formatConditionValue(String(condition.field), String(condition.value));
    return `${field} ${operator} "${displayVal}"`;
  };

  const formatAction = (action: any) => {
    if (!action) return t.noAction;
    const actionInfo = ACTION_LABELS[action.type as AutomationActionType];
    if (!actionInfo) return action.type;
    if (!action.value) return actionInfo.label;
    const raw = String(action.value);
    let display = raw;
    if (action.type === 'update_status') display = formatConditionValue('status', raw);
    else if (action.type === 'update_priority') display = formatConditionValue('priorita', raw);
    return `${actionInfo.label}: "${display}"`;
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

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  if (loading) {
    return (
      <DashboardPageShell className="max-w-7xl">
        <div className="space-y-6">
          <DashboardCardSkeleton />
          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Zap className="h-5 w-5 text-violet-400" />
                {t.pageTitle}
              </CardTitle>
              <CardDescription className="text-slate-400">{t.pageSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <ListSkeleton items={6} />
            </CardContent>
          </Card>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back"
        aria-label={t.backAria}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backLink}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-crm-automation-rules"
        subtitle={t.pageSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        contextualHelp={<ContextualHelpTrigger docSlug="crm/pipeline" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-gradient-to-r from-violet-500 to-purple-500 text-xs text-white">
              {t.pageBadge}
            </Badge>
            <Button variant="outline" size="sm" className="border-white/20 text-white/90" asChild>
              <Link href="/dashboard/automations">{t.workflowsLink}</Link>
            </Button>
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
                      {Object.entries(TRIGGER_LABELS).map(([key, { label, description, iconKey }]) => {
                        const TriggerIcon = CRM_TRIGGER_ICON_BY_KEY[iconKey];
                        return (
                          <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                            <span className="flex items-center gap-2">
                              <TriggerIcon className="h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                              <span>{label}</span>
                              <span className="text-white/40 text-xs">- {description}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
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
                          {(() => {
                            const fieldDef = FIELD_OPTIONS.find(
                              (f) => f.value === formData.condition_field
                            );
                            const opts =
                              fieldDef &&
                              fieldDef.type === "select" &&
                              "options" in fieldDef
                                ? fieldDef.options
                                : [];
                            return opts.map((opt: string) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {formatConditionValue(formData.condition_field, opt)}
                              </SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={formData.condition_value}
                        onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                        placeholder={
                          formData.condition_field === 'lead_score'
                            ? t.conditionValueExampleScore
                            : t.conditionValuePlaceholder
                        }
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
                            {(['new', 'contacted', 'followup', 'closed', 'lost'] as const).map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {ui.statusLabels[opt]}
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
                            {(['low', 'medium', 'high'] as const).map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {ui.priorityLabels[opt]}
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
        }
      />

      <p className="mb-6 max-w-2xl text-sm text-white/55">{t.workflowsHint}</p>

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
              {t.tabRules.replace('{count}', String(rules.length))}
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60" data-testid="tab-logs">
              <Activity className="h-4 w-4 mr-2" />
              {t.tabLogs.replace('{count}', String(logs.length))}
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
                              <Badge className="bg-violet-500/20 text-violet-400 inline-flex items-center gap-1">
                                {(() => {
                                  const trig = TRIGGER_LABELS[rule.trigger_type];
                                  const TriggerIcon = trig
                                    ? CRM_TRIGGER_ICON_BY_KEY[trig.iconKey]
                                    : Zap;
                                  return (
                                    <>
                                      <TriggerIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                      {trig?.label}
                                    </>
                                  );
                                })()}
                              </Badge>
                            </div>
                            {rule.description && (
                              <p className="text-white/60 text-sm mb-2">{rule.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-white/50">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {t.executions.replace('{count}', String(rule.execution_count || 0))}
                              </span>
                              {rule.last_executed_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {t.lastExec}{' '}
                                  {formatDateForLocale(
                                    rule.last_executed_at,
                                    locale as Locale,
                                    timezone
                                  )}
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
                            aria-label={
                              expandedRules.has(rule.id) ? t.collapseRuleAria : t.expandRuleAria
                            }
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
                            aria-label={t.deleteRuleAria}
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
                              {formatDateTimeForLocale(log.created_at, locale as Locale, timezone)}
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
    </DashboardPageShell>
  );
}
