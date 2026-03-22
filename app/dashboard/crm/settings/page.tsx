'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { formatDateForLocale } from '@/lib/i18n/intl';
import type { Locale } from '@/lib/i18n/config';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  Shield, 
  Sparkles,
  ArrowLeft,
  Code,
  Globe,
  Zap,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { getBaseUrl } from '@/lib/env';
import { fetchApi } from '@/lib/api/client';
import type { UserApiKey, InsertUserApiKey, LeadMarket } from '@/lib/types/database.types';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import {
  apiFailureToast,
  clipboardFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';

interface MaskedApiKey extends Omit<UserApiKey, 'api_key'> {
  api_key: string;
}

export default function CRMSettingsPage() {
  const { locale, timezone } = useLocale();
  const feedbackLocale = (locale === 'it' ? 'it' : 'en') as 'it' | 'en';
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.crmApiKeysPage,
    [locale],
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { plan, isLoading: planLoading } = useUsageLimits();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyMarket, setNewKeyMarket] = useState<LeadMarket>('italy');
  const [autoLeadScore, setAutoLeadScore] = useState(false);
  const [autoFollowup, setAutoFollowup] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [selectedKeyForEmbed, setSelectedKeyForEmbed] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: apiKeysData, isLoading } = useQuery<{ apiKeys: MaskedApiKey[] }>({
    queryKey: ['/api/crm/api-keys']
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: InsertUserApiKey) => {
      const res = await fetchApi<{ apiKey: { api_key: string } }>('/api/crm/api-keys', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!res.success) throw new Error(res.error || res.message || t.createKeyError);
      return res.data as { apiKey: { api_key: string } };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/api-keys'] });
      setNewlyCreatedKey(data.apiKey.api_key);
      setNewKeyName('');
      setAutoLeadScore(false);
      setAutoFollowup(false);
      toast({ title: t.keyCreatedTitle, description: t.keyCreatedDesc });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        ...apiFailureToast(feedbackLocale, 'crmLeadCapture', {}, error.message),
      });
    }
  });

  const updateKeyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; is_active?: boolean; auto_lead_score?: boolean; auto_followup?: boolean }) => {
      const res = await fetchApi<unknown>('/api/crm/api-keys', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...updates })
      });
      if (!res.success) throw new Error(res.error || res.message || t.updateKeyError);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/api-keys'] });
      toast({ title: t.keyUpdated });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        ...apiFailureToast(feedbackLocale, 'crmLeadCapture', {}, error.message),
      });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi<unknown>(`/api/crm/api-keys?id=${id}`, { method: 'DELETE' });
      if (!res.success) throw new Error(res.error || res.message || 'delete error');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/api-keys'] });
      toast({ title: t.keyDeleted });
      setKeyToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        ...apiFailureToast(feedbackLocale, 'crmLeadCapture', {}, error.message),
      });
    }
  });

  const copyToClipboard = async (text: string, keyId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (keyId) {
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
      }
      toast({ title: t.copied });
    } catch {
      toast({
        variant: 'destructive',
        ...clipboardFailureToast(
          feedbackLocale,
          'crmLeadCapture',
          t.clipboardCopyFailed
        ),
      });
    }
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        variant: 'destructive',
        ...validationToast(feedbackLocale, 'crmLeadCapture', t.keyNameRequired),
      });
      return;
    }
    createKeyMutation.mutate({
      name: newKeyName,
      default_market: newKeyMarket,
      auto_lead_score: autoLeadScore,
      auto_followup: autoFollowup
    });
  };

  const getEmbedCode = (apiKey: string) => {
    const appUrl = getBaseUrl();
    const labelsJson = JSON.stringify({
      nome: t.embedLabelNome,
      email: t.embedLabelEmail,
      telefono: t.embedLabelTelefono,
      messaggio: t.embedLabelMessaggio,
      submit: t.embedSubmit,
    });
    const thanksJs = JSON.stringify(t.embedAlertThanks);
    const errPrefixJs = JSON.stringify(t.embedAlertError);
    const networkJs = JSON.stringify(t.embedAlertNetwork);
    const consoleErrJs = JSON.stringify(t.embedConsoleError);
    const apiKeyJs = JSON.stringify(apiKey);
    const endpointJs = JSON.stringify(`${appUrl}/api/public/lead-capture`);
    return `<!-- PropertyPilot AI Lead Capture Form -->
<div id="propertypilot-lead-form"></div>
<script>
(function() {
  var config = {
    apiKey: ${apiKeyJs},
    endpoint: ${endpointJs},
    formId: 'propertypilot-lead-form',
    theme: 'dark', // 'light' or 'dark'
    labels: ${labelsJson},
    onSuccess: function(_response) {
      // Lead captured successfully
    },
    onError: function(error) {
      console.error(${consoleErrJs}, error);
    }
  };

  var form = document.getElementById(config.formId);
  form.innerHTML = \`
    <form id="propertypilot-form" style="max-width:400px;font-family:system-ui,-apple-system,sans-serif;">
      <div style="margin-bottom:16px;">
        <label style="display:block;margin-bottom:4px;font-weight:500;">\${config.labels.nome} *</label>
        <input type="text" name="nome" required style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;"/>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;margin-bottom:4px;font-weight:500;">\${config.labels.email}</label>
        <input type="email" name="email" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;"/>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;margin-bottom:4px;font-weight:500;">\${config.labels.telefono}</label>
        <input type="tel" name="telefono" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;"/>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;margin-bottom:4px;font-weight:500;">\${config.labels.messaggio}</label>
        <textarea name="messaggio" rows="3" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;resize:vertical;"></textarea>
      </div>
      <button type="submit" style="width:100%;padding:12px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
        \${config.labels.submit}
      </button>
      <p style="text-align:center;margin-top:12px;font-size:12px;color:#666;">Powered by PropertyPilot AI</p>
    </form>
  \`;

  document.getElementById('propertypilot-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var data = {
      nome: formData.get('nome'),
      email: formData.get('email') || undefined,
      telefono: formData.get('telefono') || undefined,
      messaggio: formData.get('messaggio') || undefined,
      source: 'embed_form'
    };
    
    fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey
      },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
      if (result.success) {
        config.onSuccess(result);
        e.target.reset();
        alert(${thanksJs});
      } else {
        config.onError(result.error);
        alert(${errPrefixJs} + result.error);
      }
    })
    .catch(function(err) {
      config.onError(err);
      alert(${networkJs});
    });
  });
})();
</script>`;
  };

  const apiKeys = apiKeysData?.apiKeys || [];

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t.pageTitle}
            </span>
            <Badge className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white border-0 uppercase text-[10px] tracking-wider">
              {t.pageBadge}
            </Badge>
          </span>
        }
        titleDataTestId="heading-crm-settings"
        subtitle={t.pageSubtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: 'secondary' } : undefined
        }
        actions={
          <Link href="/dashboard/leads" aria-label={t.backAria}>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 min-h-11 w-11 touch-manipulation text-white/80 hover:text-white hover:bg-white/10"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        }
      />

      <div className="max-w-5xl mx-auto w-full">
        <Card className="bg-gradient-to-br from-violet-950/50 via-purple-950/30 to-fuchsia-950/50 border-violet-500/30 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                  <Key className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-white">{t.apiKeysTitle}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {t.apiKeysDesc}
                  </CardDescription>
                </div>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                    data-testid="button-create-api-key"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.newApiKey}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">{t.dialogCreateTitle}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {t.dialogCreateDesc}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {newlyCreatedKey ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="font-medium text-emerald-400">{t.keyCreatedSuccess}</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          {t.keyCreatedHint}
                        </p>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={newlyCreatedKey} 
                            readOnly 
                            className="font-mono text-sm bg-slate-800 border-slate-600"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => copyToClipboard(newlyCreatedKey)}
                            className="border-emerald-500/50 hover:bg-emerald-500/10"
                            data-testid="button-copy-new-key"
                            aria-label={t.copyKeyAria}
                          >
                            <Copy className="h-4 w-4 text-emerald-400" />
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => {
                            setNewlyCreatedKey(null);
                            setIsCreateDialogOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                        >
                          {t.done}
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-300">{t.keyNameLabel}</Label>
                        <Input 
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder={t.keyNamePlaceholder}
                          className="bg-slate-800 border-slate-600 mt-1"
                          data-testid="input-key-name"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-slate-300">{t.defaultMarket}</Label>
                        <Select value={newKeyMarket} onValueChange={(v: LeadMarket) => setNewKeyMarket(v)}>
                          <SelectTrigger className="bg-slate-800 border-slate-600 mt-1" data-testid="select-market">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="italy">🇮🇹 {t.marketItaly}</SelectItem>
                            <SelectItem value="usa">🇺🇸 {t.marketUsa}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                            <Label className="text-slate-300">{t.autoLeadScore}</Label>
                          </div>
                          <Switch 
                            checked={autoLeadScore} 
                            onCheckedChange={setAutoLeadScore}
                            data-testid="switch-auto-score"
                          />
                        </div>
                        <p className="text-xs text-slate-500 ml-6">
                          {t.autoLeadScoreDesc}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <Label className="text-slate-300">{t.autoFollowup}</Label>
                          </div>
                          <Switch 
                            checked={autoFollowup} 
                            onCheckedChange={setAutoFollowup}
                            data-testid="switch-auto-followup"
                          />
                        </div>
                        <p className="text-xs text-slate-500 ml-6">
                          {t.autoFollowupDesc}
                        </p>
                      </div>
                      
                      <DialogFooter className="pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="border-slate-600"
                        >
                          {t.cancel}
                        </Button>
                        <Button 
                          onClick={handleCreateKey}
                          disabled={createKeyMutation.isPending}
                          className="bg-gradient-to-r from-violet-600 to-purple-600"
                          data-testid="button-confirm-create"
                        >
                          {createKeyMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Key className="h-4 w-4 mr-2" />
                          )}
                          {t.createApiKey}
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-violet-400 animate-spin" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">{t.noKeys}</p>
                <p className="text-sm text-slate-500">
                  {t.noKeysHint}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div 
                    key={key.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-colors"
                    data-testid={`api-key-card-${key.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{key.name}</h3>
                          <Badge 
                            variant={key.is_active ? 'default' : 'secondary'}
                            className={key.is_active 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                              : 'bg-slate-700 text-slate-400'
                            }
                          >
                            {key.is_active ? t.active : t.inactive}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {key.default_market === 'italy' ? '🇮🇹' : '🇺🇸'} {key.default_market}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <code className="text-sm font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                            {key.api_key}
                          </code>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            {t.leadsCaptured.replace('{count}', String(key.leads_captured))}
                          </span>
                          {key.auto_lead_score && (
                            <span className="flex items-center gap-1 text-cyan-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              {t.autoScoreBadge}
                            </span>
                          )}
                          {key.auto_followup && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Zap className="h-3.5 w-3.5" />
                              {t.autoFollowupBadge}
                            </span>
                          )}
                          {key.last_used_at && (
                            <span>
                              {t.lastUsed}{' '}
                              {formatDateForLocale(key.last_used_at, locale as Locale, timezone)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedKeyForEmbed(key.api_key);
                            setShowEmbedCode(true);
                          }}
                          className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
                          data-testid={`button-embed-${key.id}`}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          {t.embedButton}
                        </Button>
                        
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={(checked) => 
                            updateKeyMutation.mutate({ id: key.id, is_active: checked })
                          }
                          data-testid={`switch-active-${key.id}`}
                        />
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setKeyToDelete({ id: key.id, name: key.name })}
                          disabled={deleteKeyMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          data-testid={`button-delete-${key.id}`}
                          aria-label={t.deleteKeyAria}
                        >
                          {deleteKeyMutation.isPending && keyToDelete?.id === key.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <CardTitle className="text-white text-lg">{t.securityTitle}</CardTitle>
                <CardDescription className="text-slate-400">
                  {t.securityDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-400">
            {t.securityItems.map((item, i) => (
              <p key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {item}
              </p>
            ))}
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              {t.securityWarning}
            </p>
          </CardContent>
        </Card>

        <Dialog open={showEmbedCode} onOpenChange={setShowEmbedCode}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-violet-400" />
                {t.embedCode}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {t.embedCodeDesc}
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-700 overflow-auto max-h-[50vh] text-xs text-slate-300">
                <code>{selectedKeyForEmbed ? getEmbedCode(selectedKeyForEmbed) : ''}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedKeyForEmbed && copyToClipboard(getEmbedCode(selectedKeyForEmbed))}
                className="absolute top-2 right-2 border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
                data-testid="button-copy-embed"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t.copy}
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <h4 className="font-medium text-violet-300 mb-2">{t.howToUse}</h4>
              <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
                {t.howToUseSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!keyToDelete} onOpenChange={(open) => !open && setKeyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.deleteDialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {keyToDelete
                  ? t.deleteDialogBody.replace('{name}', keyToDelete.name)
                  : ''}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteKeyMutation.isPending}>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  if (keyToDelete) deleteKeyMutation.mutate(keyToDelete.id);
                }}
                disabled={deleteKeyMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete-api-key"
              >
                {deleteKeyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deleteKeyMutation.isPending ? t.deleting : t.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardPageShell>
  );
}
