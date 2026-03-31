'use client';

import { useState } from 'react';
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

interface MaskedApiKey extends Omit<UserApiKey, 'api_key'> {
  api_key: string;
}

export default function CRMSettingsPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const t = {
    pageTitle: "CRM Settings",
    pageBadge: "🔑 API Keys",
    pageSubtitle: isItalian
      ? "Gestisci le API keys per i form di lead capture esterni"
      : "Manage API keys for external lead capture forms",
    apiKeysTitle: "API Keys",
    apiKeysDesc: isItalian
      ? "Crea chiavi API per integrare form di lead capture nel tuo sito"
      : "Create API keys to integrate lead capture forms on your website",
    newApiKey: isItalian ? "Nuova API Key" : "New API Key",
    dialogCreateTitle: isItalian ? "Crea Nuova API Key" : "Create New API Key",
    dialogCreateDesc: isItalian
      ? "Configura una nuova chiave per catturare lead dal tuo sito"
      : "Configure a new key to capture leads from your website",
    keyCreatedSuccess: isItalian ? "API Key creata con successo!" : "API Key created successfully!",
    keyCreatedHint: isItalian
      ? "Copia questa chiave ora. Non sarà più visibile in seguito."
      : "Copy this key now. It won't be visible again.",
    done: isItalian ? "Fatto" : "Done",
    keyNameLabel: isItalian ? "Nome API Key *" : "API Key Name *",
    keyNamePlaceholder: isItalian ? "es. Form Sito Web, Landing Page..." : "e.g. Website Form, Landing Page...",
    defaultMarket: isItalian ? "Mercato Default" : "Default Market",
    autoLeadScore: isItalian ? "Lead Score Automatico" : "Auto Lead Score",
    autoLeadScoreDesc: isItalian ? "Analizza automaticamente ogni lead con AI" : "Automatically analyze each lead with AI",
    autoFollowup: isItalian ? "Follow-up Automatico" : "Auto Follow-up",
    autoFollowupDesc: isItalian ? "Invia email di follow-up AI automatiche" : "Send automatic AI follow-up emails",
    cancel: isItalian ? "Annulla" : "Cancel",
    createApiKey: isItalian ? "Crea API Key" : "Create API Key",
    noKeys: isItalian ? "Nessuna API key creata" : "No API keys created",
    noKeysHint: isItalian
      ? "Crea la tua prima chiave per iniziare a catturare lead"
      : "Create your first key to start capturing leads",
    active: isItalian ? "Attiva" : "Active",
    inactive: isItalian ? "Disattivata" : "Inactive",
    leadsCaptured: (n: number) => isItalian ? `${n} leads catturati` : `${n} leads captured`,
    lastUsed: isItalian ? "Ultimo uso:" : "Last used:",
    delete: isItalian ? "Elimina" : "Delete",
    deleteConfirm: isItalian
      ? "Sei sicuro di voler eliminare questa API key?"
      : "Are you sure you want to delete this API key?",
    embedCode: isItalian ? "Codice Embed Form" : "Embed Form Code",
    embedCodeDesc: isItalian
      ? "Copia questo codice e incollalo nel tuo sito web"
      : "Copy this code and paste it into your website",
    copy: isItalian ? "Copia" : "Copy",
    howToUse: isItalian ? "Come usare:" : "How to use:",
    howToUseSteps: isItalian
      ? [
          "Copia il codice sopra",
          "Incollalo prima del tag </body> del tuo sito",
          'Il form apparirà nel div con id "propertypilot-lead-form"',
          "I lead saranno automaticamente salvati nel tuo CRM",
        ]
      : [
          "Copy the code above",
          "Paste it before the </body> tag on your website",
          'The form will appear in the div with id "propertypilot-lead-form"',
          "Leads will be automatically saved to your CRM",
        ],
    securityTitle: isItalian ? "Sicurezza API" : "API Security",
    securityDesc: isItalian ? "Informazioni importanti sulla sicurezza" : "Important security information",
    securityItems: isItalian
      ? [
          "Le API keys sono visibili solo al momento della creazione",
          "Rate limit: 30 richieste al minuto per API key",
          "CORS abilitato per richieste cross-origin",
        ]
      : [
          "API keys are only visible at the moment of creation",
          "Rate limit: 30 requests per minute per API key",
          "CORS enabled for cross-origin requests",
        ],
    securityWarning: isItalian
      ? "Non condividere le chiavi API in repository pubblici"
      : "Do not share API keys in public repositories",
    // toasts
    keyCreatedTitle: isItalian ? "API Key creata!" : "API Key created!",
    keyCreatedDesc: isItalian
      ? "Copia la chiave ora, non sarà più visibile in seguito."
      : "Copy the key now, it won't be visible later.",
    keyUpdated: isItalian ? "API Key aggiornata" : "API Key updated",
    keyDeleted: isItalian ? "API Key eliminata" : "API Key deleted",
    copied: isItalian ? "Copiato negli appunti!" : "Copied to clipboard!",
    keyNameRequired: isItalian ? "Inserisci un nome per la API key" : "Enter a name for the API key",
  };
  
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
      if (!res.success) throw new Error(res.error || res.message || 'Errore nella creazione');
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
      toast({ title: isItalian ? 'Errore' : 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateKeyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; is_active?: boolean; auto_lead_score?: boolean; auto_followup?: boolean }) => {
      const res = await fetchApi<unknown>('/api/crm/api-keys', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...updates })
      });
      if (!res.success) throw new Error(res.error || res.message || 'Errore nell\'aggiornamento');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/api-keys'] });
      toast({ title: t.keyUpdated });
    }
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
      toast({ title: isItalian ? 'Errore' : 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const copyToClipboard = async (text: string, keyId?: string) => {
    await navigator.clipboard.writeText(text);
    if (keyId) {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
    toast({ title: t.copied });
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({ title: t.keyNameRequired, variant: 'destructive' });
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
    return `<!-- PropertyPilot AI Lead Capture Form -->
<div id="propertypilot-lead-form"></div>
<script>
(function() {
  var config = {
    apiKey: '${apiKey}',
    endpoint: '${appUrl}/api/public/lead-capture',
    formId: 'propertypilot-lead-form',
    theme: 'dark', // 'light' or 'dark'
    labels: {
      nome: 'Nome e Cognome',
      email: 'Email',
      telefono: 'Telefono',
      messaggio: 'Messaggio',
      submit: 'Invia Richiesta'
    },
    onSuccess: function(_response) {
      // Lead captured successfully
    },
    onError: function(error) {
      console.error('Errore:', error);
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
        alert('Grazie! Ti contatteremo presto.');
      } else {
        config.onError(result.error);
        alert('Errore: ' + result.error);
      }
    })
    .catch(function(err) {
      config.onError(err);
      alert('Errore di connessione. Riprova.');
    });
  });
})();
</script>`;
  };

  const apiKeys = apiKeysData?.apiKeys || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-foreground" data-testid="button-back" aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t.pageTitle}
              </h1>
              <Badge className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-foreground border-0">
                {t.pageBadge}
              </Badge>
            </div>
            <p className="text-slate-400 mt-1">
              {t.pageSubtitle}
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-violet-950/50 via-purple-950/30 to-fuchsia-950/50 border-violet-500/30 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                  <Key className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-foreground">{t.apiKeysTitle}</CardTitle>
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
                <DialogContent className="bg-card border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{t.dialogCreateTitle}</DialogTitle>
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
                            className="font-mono text-sm bg-muted border-slate-600"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => copyToClipboard(newlyCreatedKey)}
                            className="border-emerald-500/50 hover:bg-emerald-500/10"
                            data-testid="button-copy-new-key"
                            aria-label="Copy API key"
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
                          className="bg-muted border-slate-600 mt-1"
                          data-testid="input-key-name"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-slate-300">{t.defaultMarket}</Label>
                        <Select value={newKeyMarket} onValueChange={(v: LeadMarket) => setNewKeyMarket(v)}>
                          <SelectTrigger className="bg-muted border-slate-600 mt-1" data-testid="select-market">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-muted border-slate-600">
                            <SelectItem value="italy">🇮🇹 Italia</SelectItem>
                            <SelectItem value="usa">🇺🇸 USA</SelectItem>
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
                    className="p-4 rounded-xl bg-muted/50 border border-slate-700/50 hover:border-violet-500/30 transition-colors"
                    data-testid={`api-key-card-${key.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-foreground">{key.name}</h3>
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
                          <code className="text-sm font-mono text-slate-400 bg-card px-2 py-1 rounded">
                            {key.api_key}
                          </code>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            {t.leadsCaptured(key.leads_captured)}
                          </span>
                          {key.auto_lead_score && (
                            <span className="flex items-center gap-1 text-cyan-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              Auto Score
                            </span>
                          )}
                          {key.auto_followup && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Zap className="h-3.5 w-3.5" />
                              Auto Follow-up
                            </span>
                          )}
                          {key.last_used_at && (
                            <span>
                              {t.lastUsed} {new Date(key.last_used_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
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
                          Embed
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
                          aria-label="Delete API key"
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

        <Card className="bg-muted/40 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <CardTitle className="text-foreground text-lg">{t.securityTitle}</CardTitle>
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
          <DialogContent className="bg-card border-slate-700 max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
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
              <AlertDialogTitle>{isItalian ? 'Elimina API Key?' : 'Delete API Key?'}</AlertDialogTitle>
              <AlertDialogDescription>
                {keyToDelete ? (isItalian ? `Sei sicuro di voler eliminare "${keyToDelete.name}"? I form che la usano smetteranno di funzionare.` : `Are you sure you want to delete "${keyToDelete.name}"? Forms using it will stop working.`) : ''}
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
                {deleteKeyMutation.isPending ? (isItalian ? 'Eliminazione...' : 'Deleting...') : t.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
