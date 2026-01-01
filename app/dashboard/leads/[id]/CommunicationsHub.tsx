'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, MessageCircle, Smartphone, Sparkles, Send, Copy, Check, 
  Loader2, Clock, User, ChevronDown, ChevronUp, RefreshCw,
  FileText, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Lead, CommunicationLog, CommunicationTone, CommunicationChannel } from '@/lib/types/database.types';

interface CommunicationsHubProps {
  lead: Lead;
}

const toneOptions: { value: CommunicationTone; label: string }[] = [
  { value: 'professional', label: 'Professionale' },
  { value: 'emotional', label: 'Emozionale' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'casual', label: 'Informale' },
  { value: 'urgent', label: 'Urgente' },
];

const purposeOptions = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'first_contact', label: 'Primo Contatto' },
  { value: 'appointment', label: 'Appuntamento' },
  { value: 'offer', label: 'Offerta' },
  { value: 'thank_you', label: 'Ringraziamento' },
  { value: 'reminder', label: 'Promemoria' },
];

const channelConfig: Record<CommunicationChannel, { icon: any; label: string; color: string; gradient: string }> = {
  email: { icon: Mail, label: 'Email', color: 'text-blue-400', gradient: 'from-blue-600 to-indigo-600' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-400', gradient: 'from-green-600 to-emerald-600' },
  sms: { icon: Smartphone, label: 'SMS', color: 'text-amber-400', gradient: 'from-amber-600 to-orange-600' },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Copiato!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

export default function CommunicationsHub({ lead }: CommunicationsHubProps) {
  const { toast } = useToast();
  const [activeChannel, setActiveChannel] = useState<CommunicationChannel>('email');
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  
  const [emailSubject, setEmailSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<CommunicationTone>('professional');
  const [purpose, setPurpose] = useState('follow_up');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [lead.id]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/communications/logs?lead_id=${lead.id}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGeneratedVariants([]);
    try {
      const res = await fetch('/api/communications/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          channel: activeChannel,
          tone,
          purpose,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore nella generazione');
      }

      const data = await res.json();
      
      if (activeChannel === 'email' && data.subject) {
        setEmailSubject(data.subject);
      }
      setMessage(data.message || '');
      
      if (data.variants && data.variants.length > 0) {
        setGeneratedVariants(data.variants);
      }

      toast({
        title: 'Messaggio generato!',
        description: data.cached ? 'Dalla cache (24h)' : `${data.character_count} caratteri`,
      });
    } catch (error: any) {
      toast({ title: 'Errore', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: 'Errore', description: 'Inserisci un messaggio', variant: 'destructive' });
      return;
    }

    if (activeChannel === 'sms' && message.length > 160) {
      toast({ 
        title: 'SMS troppo lungo', 
        description: `${message.length}/160 caratteri. Riduci il testo.`,
        variant: 'destructive' 
      });
      return;
    }

    setIsSending(true);
    try {
      const endpoint = `/api/communications/send-${activeChannel}`;
      const body: any = {
        lead_id: lead.id,
        message,
      };

      if (activeChannel === 'email') {
        if (!emailSubject.trim()) {
          toast({ title: 'Errore', description: 'Inserisci l\'oggetto email', variant: 'destructive' });
          setIsSending(false);
          return;
        }
        body.subject = emailSubject;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore nell\'invio');
      }

      const data = await res.json();
      
      if (activeChannel === 'whatsapp' && data.whatsapp_url) {
        window.open(data.whatsapp_url, '_blank');
        toast({ title: 'WhatsApp aperto!', description: 'Invia il messaggio dalla finestra WhatsApp' });
      } else {
        toast({ title: 'Inviato!', description: data.message });
      }

      setMessage('');
      setEmailSubject('');
      setGeneratedVariants([]);
      fetchLogs();
    } catch (error: any) {
      toast({ title: 'Errore', description: error.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const getChannelStats = () => {
    const stats = { email: 0, whatsapp: 0, sms: 0 };
    logs.forEach(log => {
      if (log.channel in stats) {
        stats[log.channel as keyof typeof stats]++;
      }
    });
    return stats;
  };

  const stats = getChannelStats();

  return (
    <Card className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-400" />
          Communication Hub
          <Badge className="bg-indigo-500/20 text-indigo-300 text-xs">CRM 4.0</Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Invia email, WhatsApp e SMS con AI - tutto in un unico posto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(channelConfig).map(([channel, config]) => {
            const Icon = config.icon;
            return (
              <div 
                key={channel}
                className={`bg-slate-900/50 p-3 rounded-lg text-center cursor-pointer transition-all ${
                  activeChannel === channel ? 'ring-2 ring-indigo-500' : 'hover:bg-slate-900/70'
                }`}
                onClick={() => setActiveChannel(channel as CommunicationChannel)}
                data-testid={`channel-${channel}`}
              >
                <Icon className={`h-5 w-5 mx-auto mb-1 ${config.color}`} />
                <p className="text-white font-semibold">{stats[channel as keyof typeof stats]}</p>
                <p className="text-slate-400 text-xs">{config.label}</p>
              </div>
            );
          })}
        </div>

        {/* Compose Section */}
        <div className="space-y-4 bg-slate-900/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center gap-2">
              {(() => {
                const Icon = channelConfig[activeChannel].icon;
                return <Icon className={`h-4 w-4 ${channelConfig[activeChannel].color}`} />;
              })()}
              Nuovo {channelConfig[activeChannel].label}
            </h4>
            <div className="flex items-center gap-2">
              <Select value={tone} onValueChange={(v) => setTone(v as CommunicationTone)}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs" data-testid="select-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs" data-testid="select-purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purposeOptions.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeChannel === 'email' && (
            <Input
              placeholder="Oggetto email..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              data-testid="input-email-subject"
            />
          )}

          <div className="relative">
            <Textarea
              placeholder={
                activeChannel === 'sms' 
                  ? 'Messaggio SMS (max 160 caratteri)...' 
                  : `Scrivi il tuo ${channelConfig[activeChannel].label}...`
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px] resize-none"
              maxLength={activeChannel === 'sms' ? 160 : undefined}
              data-testid="textarea-message"
            />
            {activeChannel === 'sms' && (
              <div className={`absolute bottom-2 right-2 text-xs ${message.length > 160 ? 'text-red-400' : 'text-slate-400'}`}>
                {message.length}/160
              </div>
            )}
          </div>

          {/* Generated Variants */}
          {generatedVariants.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-medium">Varianti generate:</p>
              {generatedVariants.map((variant, i) => (
                <div key={i} className="bg-slate-800/50 p-2 rounded text-slate-300 text-sm flex items-start justify-between gap-2">
                  <span className="flex-1">{variant}</span>
                  <div className="flex gap-1">
                    <CopyButton text={variant} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setMessage(variant)}
                      className="h-7 px-2 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Usa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
              data-testid="button-generate-ai"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Genera con AI
                </>
              )}
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !message.trim()}
              className={`flex-1 bg-gradient-to-r ${channelConfig[activeChannel].gradient} hover:opacity-90 text-white`}
              data-testid="button-send-message"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {activeChannel === 'whatsapp' ? 'Apri WhatsApp' : 'Invia'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Logs Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowLogs(!showLogs)}
          className="w-full text-slate-400 hover:text-white"
          data-testid="button-toggle-logs"
        >
          <Clock className="mr-2 h-4 w-4" />
          Storico Comunicazioni ({logs.length})
          {showLogs ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>

        {/* Logs List */}
        {showLogs && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoadingLogs ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400 mx-auto" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-slate-400 text-center py-4 text-sm">Nessuna comunicazione registrata</p>
            ) : (
              logs.map((log) => {
                const config = channelConfig[log.channel];
                const Icon = config.icon;
                return (
                  <div key={log.id} className="bg-slate-900/50 p-3 rounded-lg flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-slate-800`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {log.subject && (
                        <p className="text-white text-sm font-medium truncate">{log.subject}</p>
                      )}
                      <p className="text-slate-300 text-sm line-clamp-2">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${
                          log.status === 'sent' ? 'border-green-500/50 text-green-400' :
                          log.status === 'delivered' ? 'border-emerald-500/50 text-emerald-400' :
                          log.status === 'failed' ? 'border-red-500/50 text-red-400' :
                          'border-yellow-500/50 text-yellow-400'
                        }`}>
                          {log.status}
                        </Badge>
                        <span className="text-slate-500 text-xs">
                          {new Date(log.created_at).toLocaleString('it-IT')}
                        </span>
                      </div>
                    </div>
                    <CopyButton text={log.message} />
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
