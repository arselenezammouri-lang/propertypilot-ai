'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  MessageCircle,
  Smartphone,
  Sparkles,
  Send,
  Copy,
  Check,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { formatDateTimeForLocale } from '@/lib/i18n/intl';
import type { Locale } from '@/lib/i18n/config';
import type { Lead, CommunicationLog, CommunicationTone, CommunicationChannel } from '@/lib/types/database.types';

interface CommunicationsHubProps {
  lead: Lead;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { locale } = useLocale();
  const ch = getTranslation(locale as SupportedLocale).dashboard.communicationsHub;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: ch.copySuccessTitle });
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
  const { locale, timezone } = useLocale();
  const ch = getTranslation(locale as SupportedLocale).dashboard.communicationsHub;

  const channelConfig: Record<
    CommunicationChannel,
    { icon: typeof Mail; labelKey: 'channelEmail' | 'channelWhatsapp' | 'channelSms'; color: string; gradient: string }
  > = {
    email: { icon: Mail, labelKey: 'channelEmail', color: 'text-blue-400', gradient: 'from-blue-600 to-indigo-600' },
    whatsapp: {
      icon: MessageCircle,
      labelKey: 'channelWhatsapp',
      color: 'text-green-400',
      gradient: 'from-green-600 to-emerald-600',
    },
    sms: { icon: Smartphone, labelKey: 'channelSms', color: 'text-amber-400', gradient: 'from-amber-600 to-orange-600' },
  };

  const channelLabel = (c: CommunicationChannel) => ch[channelConfig[c].labelKey];

  const toneOptions: { value: CommunicationTone; label: string }[] = [
    { value: 'professional', label: ch.toneProfessional },
    { value: 'emotional', label: ch.toneEmotional },
    { value: 'luxury', label: ch.toneLuxury },
    { value: 'casual', label: ch.toneCasual },
    { value: 'urgent', label: ch.toneUrgent },
  ];

  const purposeOptions = [
    { value: 'follow_up', label: ch.purposeFollowUp },
    { value: 'first_contact', label: ch.purposeFirstContact },
    { value: 'appointment', label: ch.purposeAppointment },
    { value: 'offer', label: ch.purposeOffer },
    { value: 'thank_you', label: ch.purposeThankYou },
    { value: 'reminder', label: ch.purposeReminder },
  ];

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
    void fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch on lead change only
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
        throw new Error(error.error || ch.generationError);
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
        title: ch.msgGenerated,
        description: data.cached ? ch.fromCache : ch.characters.replace('{n}', String(data.character_count ?? 0)),
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : ch.error;
      toast({ title: ch.error, description: msg, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: ch.error, description: ch.emptyMessage, variant: 'destructive' });
      return;
    }

    if (activeChannel === 'sms' && message.length > 160) {
      toast({
        title: ch.smsTooLong,
        description: ch.smsTooLongDesc.replace('{n}', String(message.length)),
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const endpoint = `/api/communications/send-${activeChannel}`;
      const body: Record<string, unknown> = {
        lead_id: lead.id,
        message,
      };

      if (activeChannel === 'email') {
        if (!emailSubject.trim()) {
          toast({ title: ch.error, description: ch.missingSubject, variant: 'destructive' });
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
        throw new Error(error.error || ch.sendError);
      }

      const data = await res.json();

      if (activeChannel === 'whatsapp' && data.whatsapp_url) {
        window.open(data.whatsapp_url, '_blank');
        toast({ title: ch.whatsappOpened, description: ch.whatsappDesc });
      } else {
        toast({ title: ch.sentTitle, description: data.message });
      }

      setMessage('');
      setEmailSubject('');
      setGeneratedVariants([]);
      void fetchLogs();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : ch.error;
      toast({ title: ch.error, description: msg, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const getChannelStats = () => {
    const stats = { email: 0, whatsapp: 0, sms: 0 };
    logs.forEach((log) => {
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
          {ch.hubTitle}
          <Badge className="bg-indigo-500/20 text-indigo-300 text-xs">{ch.hubBadge}</Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">{ch.hubDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(channelConfig) as CommunicationChannel[]).map((channel) => {
            const config = channelConfig[channel];
            const Icon = config.icon;
            return (
              <div
                key={channel}
                className={`bg-slate-900/50 p-3 rounded-lg text-center cursor-pointer transition-all ${
                  activeChannel === channel ? 'ring-2 ring-indigo-500' : 'hover:bg-slate-900/70'
                }`}
                onClick={() => setActiveChannel(channel)}
                data-testid={`channel-${channel}`}
              >
                <Icon className={`h-5 w-5 mx-auto mb-1 ${config.color}`} />
                <p className="text-white font-semibold">{stats[channel]}</p>
                <p className="text-slate-400 text-xs">{channelLabel(channel)}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 bg-slate-900/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center gap-2">
              {(() => {
                const Icon = channelConfig[activeChannel].icon;
                return <Icon className={`h-4 w-4 ${channelConfig[activeChannel].color}`} />;
              })()}
              {ch.newMessage.replace('{channel}', channelLabel(activeChannel))}
            </h4>
            <div className="flex items-center gap-2">
              <Select value={tone} onValueChange={(v) => setTone(v as CommunicationTone)}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs" data-testid="select-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((toneOpt) => (
                    <SelectItem key={toneOpt.value} value={toneOpt.value}>
                      {toneOpt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-white text-xs" data-testid="select-purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purposeOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeChannel === 'email' && (
            <Input
              placeholder={ch.emailSubjectPlaceholder}
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
                  ? ch.smsPlaceholder
                  : ch.messagePlaceholder.replace('{channel}', channelLabel(activeChannel))
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px] resize-none"
              maxLength={activeChannel === 'sms' ? 160 : undefined}
              data-testid="textarea-message"
            />
            {activeChannel === 'sms' && (
              <div
                className={`absolute bottom-2 right-2 text-xs ${message.length > 160 ? 'text-red-400' : 'text-slate-400'}`}
              >
                {message.length}/160
              </div>
            )}
          </div>

          {generatedVariants.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-medium">{ch.generatedVariants}</p>
              {generatedVariants.map((variant, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 p-2 rounded text-slate-300 text-sm flex items-start justify-between gap-2"
                >
                  <span className="flex-1">{variant}</span>
                  <div className="flex gap-1">
                    <CopyButton text={variant} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessage(variant)}
                      className="h-7 px-2 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      {ch.useVariant}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => void handleGenerateAI()}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
              data-testid="button-generate-ai"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {ch.generating}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {ch.generateWithAI}
                </>
              )}
            </Button>
            <Button
              onClick={() => void handleSend()}
              disabled={isSending || !message.trim()}
              className={`flex-1 bg-gradient-to-r ${channelConfig[activeChannel].gradient} hover:opacity-90 text-white`}
              data-testid="button-send-message"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {ch.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {activeChannel === 'whatsapp' ? ch.openWhatsApp : ch.send}
                </>
              )}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setShowLogs(!showLogs)}
          className="w-full text-slate-400 hover:text-white"
          data-testid="button-toggle-logs"
        >
          <Clock className="mr-2 h-4 w-4" />
          {ch.historyToggle.replace('{count}', String(logs.length))}
          {showLogs ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>

        {showLogs && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoadingLogs ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400 mx-auto" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-slate-400 text-center py-4 text-sm">{ch.noHistory}</p>
            ) : (
              logs.map((log) => {
                const config = channelConfig[log.channel];
                const Icon = config.icon;
                return (
                  <div key={log.id} className="bg-slate-900/50 p-3 rounded-lg flex items-start gap-3">
                    <div className="p-2 rounded-full bg-slate-800">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {log.subject && <p className="text-white text-sm font-medium truncate">{log.subject}</p>}
                      <p className="text-slate-300 text-sm line-clamp-2">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            log.status === 'sent'
                              ? 'border-green-500/50 text-green-400'
                              : log.status === 'delivered'
                                ? 'border-emerald-500/50 text-emerald-400'
                                : log.status === 'failed'
                                  ? 'border-red-500/50 text-red-400'
                                  : 'border-yellow-500/50 text-yellow-400'
                          }`}
                        >
                          {log.status}
                        </Badge>
                        <span className="text-slate-500 text-xs">
                          {formatDateTimeForLocale(log.created_at, locale as Locale, timezone)}
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
