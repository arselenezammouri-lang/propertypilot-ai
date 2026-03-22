'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Target,
  DollarSign,
  Home,
  AlertTriangle,
  UserCircle,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Brain,
  Shield,
  Zap,
  Clock,
  RefreshCw,
  Flame,
  Star,
  Snowflake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAPIErrorHandler } from '@/components/error-boundary';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { formatDateForLocale, formatDateTimeForLocale } from '@/lib/i18n/intl';
import type { Locale } from '@/lib/i18n/config';
import { fetchApi } from '@/lib/api/client';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
} from '@/lib/i18n/api-feature-feedback';
import type { Lead, LeadEnrichmentResult, LeadNote } from '@/lib/types/database.types';
import CommunicationsHub from './CommunicationsHub';

// Status/priority colors are locale-independent
const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  followup: 'bg-purple-500',
  closed: 'bg-green-500',
  lost: 'bg-red-500',
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-orange-500',
  high: 'bg-red-600',
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { locale } = useLocale();
  const feedbackLocale = (locale === 'it' ? 'it' : 'en') as 'it' | 'en';
  const ld = getTranslation(locale as SupportedLocale).dashboard.leadDetailPage;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: ld.copySuccessTitle,
        description: label || ld.copySuccessDesc,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, 'leadDetail', ld.clipboardFailureDesc);
      toast({ title: c.title, description: c.description, variant: 'destructive' });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 px-2 text-xs"
      data-testid={`copy-${label?.toLowerCase().replace(/\s/g, '-') || 'text'}`}
      aria-label={copied ? (label ? `Copied: ${label}` : "Copied") : (label ? `Copy: ${label}` : "Copy")}
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function EnrichmentSection({ 
  title, 
  icon: Icon, 
  children,
  gradient 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card className={`border-0 shadow-lg ${gradient}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white/90">
        {children}
      </CardContent>
    </Card>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, timezone } = useLocale();
  const feedbackLocale = (locale === 'it' ? 'it' : 'en') as 'it' | 'en';
  const t = getTranslation(locale as SupportedLocale).dashboard.leadDetailPage;
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();
  const leadId = params.id as string;

  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    contacted: t.statusContacted,
    followup: t.statusFollowup,
    closed: t.statusClosed,
    lost: t.statusLost,
  };

  const priorityLabels: Record<string, string> = {
    low: t.priorityLow,
    medium: t.priorityMedium,
    high: t.priorityHigh,
  };

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [enrichment, setEnrichment] = useState<LeadEnrichmentResult | null>(null);
  const [automationLogs, setAutomationLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentCached, setEnrichmentCached] = useState(false);

  useEffect(() => {
    fetchLeadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch on leadId change only
  }, [leadId]);

  const fetchLeadData = async () => {
    try {
      const leadApi = await fetchApi<Lead>(`/api/leads/${leadId}`);
      if (!leadApi.success) {
        if (leadApi.status === 401) {
          router.push('/auth/login');
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          'leadDetail',
          { status: leadApi.status, error: leadApi.error, message: leadApi.message },
          t.loadError
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        setLead(null);
        return;
      }
      setLead(leadApi.data as Lead);

      const [notesRes, enrichRes, logsRes] = await Promise.all([
        fetch(`/api/leads/add-note?lead_id=${leadId}`),
        fetch(`/api/leads/enrich?lead_id=${leadId}`),
        fetch(`/api/automations/execute-rule?lead_id=${leadId}&limit=10`),
      ]);

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.data || []);
      }

      if (enrichRes.ok) {
        const enrichData = await enrichRes.json();
        if (enrichData.exists && enrichData.data) {
          setEnrichment(enrichData.data);
          setEnrichmentCached(true);
        }
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAutomationLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error('Error fetching lead data:', error);
      const net = networkFailureToast(feedbackLocale, 'leadDetail');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrichLead = async () => {
    setIsEnriching(true);
    try {
      const response = await fetch('/api/leads/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId }),
      });
      const body = (await response.json()) as {
        data?: LeadEnrichmentResult;
        cached?: boolean;
        duration?: number;
        error?: string;
        message?: string;
      };

      if (!response.ok || !body.data) {
        const fail = apiFailureToast(
          feedbackLocale,
          'leadDetail',
          { status: response.status, error: body.error, message: body.message },
          t.enrichError
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        return;
      }

      setEnrichment(body.data);
      setEnrichmentCached(Boolean(body.cached));
      toast({
        title: t.analysisComplete,
        description: body.cached
          ? t.fromCacheDesc
          : t.analysisDone.replace('{ms}', String(body.duration ?? 0)),
      });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'leadDetail');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setIsEnriching(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell className="max-w-7xl">
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardPageShell>
    );
  }

  if (!lead) {
    return (
      <DashboardPageShell className="max-w-7xl">
        <div className="py-12 text-center text-white">
          <p>{t.notFound}</p>
          <Link href="/dashboard/leads">
            <Button className="mt-4">{t.backToList}</Button>
          </Link>
        </div>
      </DashboardPageShell>
    );
  }

  const getScoreBadge = (score: number | null) => {
    const s = score ?? 0;
    if (s >= 70) return { Icon: Flame, label: t.scoreHot, color: 'bg-red-500' };
    if (s >= 40) return { Icon: Star, label: t.scoreWarm, color: 'bg-yellow-500' };
    return { Icon: Snowflake, label: t.scoreCold, color: 'bg-blue-500' };
  };

  const scoreBadge = getScoreBadge(lead.lead_score);
  const ScoreTierIcon = scoreBadge.Icon;

  const planBadgeLabel =
    usage.plan === 'agency'
      ? 'Agency'
      : usage.plan === 'pro'
        ? 'Pro'
        : usage.plan === 'starter'
          ? 'Starter'
          : 'Free';

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard/leads"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back"
        aria-label={t.backToList}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToLeads}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={lead.nome}
        titleDataTestId="heading-lead-detail"
        subtitle={t.headerSubtitle}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${scoreBadge.color} text-white gap-1.5`}>
              <ScoreTierIcon className="h-4 w-4 shrink-0" aria-hidden />
              {lead.lead_score ?? '—'}
            </Badge>
            <Button
              onClick={handleEnrichLead}
              disabled={isEnriching}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              data-testid="button-enrich-lead"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.analyzeBtn}
                </>
              ) : enrichment ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t.regenerateBtn}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t.enrichBtn}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              data-testid="button-followup-email"
              onClick={() => {
                const params = new URLSearchParams({
                  leadName: lead.nome || '',
                  propertyTitle: (lead as any).property_title || '',
                  propertyLocation: (lead as any).property_location || '',
                  propertyPrice: (lead as any).property_price || '',
                });
                router.push(`/dashboard/followup-emails?${params.toString()}`);
              }}
            >
              {t.followupBtn}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Lead Info Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500" />
              {t.leadInfoTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="h-4 w-4 text-emerald-500" />
              <span>{lead.email || t.noEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="h-4 w-4 text-emerald-500" />
              <span>{lead.telefono || t.noPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColors[lead.status]} text-white`}>
                {statusLabels[lead.status]}
              </Badge>
              <Badge className={`${priorityColors[lead.priorita]} text-white`}>
                {priorityLabels[lead.priorita]}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span>{formatDateForLocale(lead.created_at, locale as Locale, timezone)}</span>
            </div>
            {lead.messaggio && (
              <div className="col-span-full">
                <div className="flex items-start gap-3 text-slate-300 bg-slate-900/50 p-4 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-emerald-500 mt-1" />
                  <p className="whitespace-pre-wrap">{lead.messaggio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Communication Hub - CRM 4.0 */}
        <CommunicationsHub lead={lead} />

        {/* AI Enrichment Results */}
        {enrichment ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-violet-500" />
                {t.aiInsightsTitle}
              </h2>
              {enrichmentCached && (
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  <Clock className="h-3 w-3 mr-1" /> {t.fromCache}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profilo Psicografico */}
              <EnrichmentSection 
                title={t.psychoTitle} 
                icon={UserCircle}
                gradient="bg-gradient-to-br from-violet-600/90 to-purple-700/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.buyerType}</span>
                    <div className="flex items-center gap-1">
                      <span>{enrichment.profilo_psicografico.tipo_acquirente}</span>
                      <CopyButton text={enrichment.profilo_psicografico.tipo_acquirente} label="tipo-acquirente" />
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.motivations}</span>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {enrichment.profilo_psicografico.motivazioni_principali.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">{t.decisionStyle}</span> {enrichment.profilo_psicografico.stile_decisionale}
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.painPoints}</span>
                    <div className="flex flex-wrap gap-1">
                      {enrichment.profilo_psicografico.pain_points.map((p, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </EnrichmentSection>

              {/* Probabilità Chiusura */}
              <EnrichmentSection 
                title={t.scoringTitle} 
                icon={Target}
                gradient="bg-gradient-to-br from-emerald-600/90 to-teal-700/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold">{enrichment.probabilita_chiusura.percentuale}%</div>
                    <Badge className={`
                      ${enrichment.probabilita_chiusura.percentuale >= 70 ? 'bg-green-500' : 
                        enrichment.probabilita_chiusura.percentuale >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                    `}>
                      {enrichment.probabilita_chiusura.livello.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <span className="font-semibold text-green-300 block mb-1">{t.strongPoints}</span>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {enrichment.probabilita_chiusura.fattori_positivi.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-red-300 block mb-1">{t.weakPoints}</span>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {enrichment.probabilita_chiusura.fattori_negativi.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </EnrichmentSection>

              {/* Budget Analysis */}
              <EnrichmentSection 
                title={t.budgetSectionTitle} 
                icon={DollarSign}
                gradient="bg-gradient-to-br from-amber-600/90 to-orange-700/90"
              >
                <div className="space-y-3">
                  <div className="text-2xl font-bold">{enrichment.budget_analysis.fascia_prezzo}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold block">{t.budgetCapacity}</span>
                      {enrichment.budget_analysis.capacita_investimento}
                    </div>
                    <div>
                      <span className="font-semibold block">{t.budgetFlexibility}</span>
                      {enrichment.budget_analysis.flessibilita_budget}
                    </div>
                  </div>
                </div>
              </EnrichmentSection>

              {/* Fascia Immobile */}
              <EnrichmentSection 
                title={t.preferenceTitle} 
                icon={Home}
                gradient="bg-gradient-to-br from-blue-600/90 to-indigo-700/90"
              >
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block mb-1">{t.propertyType}</span>
                    <div className="flex flex-wrap gap-1">
                      {enrichment.fascia_immobile.tipologie_consigliate.map((typ, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{typ}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.location}</span>
                    <div className="flex flex-wrap gap-1">
                      {enrichment.fascia_immobile.zone_ideali.map((z, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{z}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.priorityFeatures}</span>
                    <ul className="list-disc list-inside text-sm">
                      {enrichment.fascia_immobile.caratteristiche_prioritarie.slice(0, 4).map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </EnrichmentSection>

              {/* Buyer Persona */}
              <EnrichmentSection 
                title={t.buyerPersonaTitle} 
                icon={UserCircle}
                gradient="bg-gradient-to-br from-pink-600/90 to-rose-700/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{enrichment.buyer_persona.nome_persona}</div>
                    <CopyButton text={enrichment.buyer_persona.descrizione_breve} label="buyer-persona" />
                  </div>
                  <p className="text-sm italic">{enrichment.buyer_persona.descrizione_breve}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-semibold">{t.ageLabel}</span> {enrichment.buyer_persona.eta_stimata}</div>
                    <div><span className="font-semibold">{t.professionLabel}</span> {enrichment.buyer_persona.professione_probabile}</div>
                    <div className="col-span-2"><span className="font-semibold">{t.familyLabel}</span> {enrichment.buyer_persona.situazione_familiare}</div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.keyValuesLabel}</span>
                    <div className="flex flex-wrap gap-1">
                      {enrichment.buyer_persona.valori_chiave.map((v, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{v}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.purchaseTriggersLabel}</span>
                    <ul className="list-disc list-inside text-sm">
                      {enrichment.buyer_persona.trigger_acquisto.map((trig, i) => (
                        <li key={i}>{trig}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </EnrichmentSection>

              {/* Strategia Follow-up */}
              <EnrichmentSection 
                title={t.strategyTitle} 
                icon={Zap}
                gradient="bg-gradient-to-br from-cyan-600/90 to-sky-700/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.approach}</span>
                    <CopyButton text={enrichment.strategia_followup.approccio_consigliato} label="approccio" />
                  </div>
                  <p className="text-sm bg-white/10 p-2 rounded">{enrichment.strategia_followup.approccio_consigliato}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-semibold">{t.strategyFrequency}</span> {enrichment.strategia_followup.frequenza_contatto}</div>
                    <div><span className="font-semibold">{t.strategyChannel}</span> {enrichment.strategia_followup.canale_preferito}</div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{t.talkingPoints}</span>
                    <ol className="list-decimal list-inside text-sm space-y-1">
                      {enrichment.strategia_followup.azioni_prioritarie.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </EnrichmentSection>
            </div>

            {/* Obiezioni Probabili - Full Width */}
            <Card className="bg-gradient-to-br from-red-600/90 to-rose-700/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5" />
                  {t.objectionsCardTitle}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {t.objectionsCardDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrichment.obiezioni_probabili.map((ob, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`
                            ${ob.probabilita === 'alta' ? 'bg-red-500' : 
                              ob.probabilita === 'media' ? 'bg-yellow-500' : 'bg-green-500'}
                          `}>
                            {ob.probabilita}
                          </Badge>
                          <span className="font-semibold text-white">{ob.obiezione}</span>
                        </div>
                        <CopyButton text={ob.risposta_suggerita} label={`obiezione-${i}`} />
                      </div>
                        <div className="text-white/90 text-sm">
                        <span className="font-semibold text-green-300">{t.answerLabel}</span> {ob.risposta_suggerita}
                      </div>
                      <div className="text-white/70 text-xs">
                        <span className="font-semibold">{t.strategyShortLabel}</span> {ob.strategia}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Punteggio Qualità */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-emerald-500" />
                    <div>
                      <p className="text-slate-400 text-sm">{t.leadQualityScore}</p>
                      <p className="text-2xl font-bold text-white">{enrichment.punteggio_qualita.score}/100</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300">{enrichment.punteggio_qualita.interpretazione}</p>
                    <p className="text-slate-500 text-sm">
                      {t.generatedLabel}{' '}
                      {formatDateTimeForLocale(enrichment.generato_il, locale as Locale, timezone)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 border-dashed">
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t.enrichEmptyTitle}
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                {t.enrichEmptyDesc}
              </p>
              <Button
                onClick={handleEnrichLead}
                disabled={isEnriching}
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                data-testid="button-enrich-empty"
              >
                {isEnriching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.enrichAnalyzing}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    {t.enrichStart}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Activity Summary */}
        {(enrichment || automationLogs.length > 0) && (
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-400" />
                {t.aiActivityTitle}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.aiActivityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {enrichment && (
                <div className="flex items-start gap-2">
                  <span className="mt-1">✨</span>
                  <div>
                    <p className="text-slate-200">{t.aiActivityEnrichment}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTimeForLocale(enrichment.generato_il, locale as Locale, timezone)}
                      {enrichmentCached ? ` • ${t.aiActivityFromCache}` : ""}
                    </p>
                  </div>
                </div>
              )}
              {automationLogs.length > 0 ? (
                <div className="space-y-2">
                  {automationLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-slate-300">
                      <span className="mt-1">⚡</span>
                      <div>
                        <p className="text-xs text-slate-500">
                          {formatDateTimeForLocale(log.created_at, locale as Locale, timezone)}
                        </p>
                        <p className="text-sm">
                          {log.automations_rules?.name || t.ruleLabel} • {log.trigger_type}
                        </p>
                      </div>
                    </div>
                  ))}
                  {automationLogs.length > 3 && (
                    <p className="text-xs text-slate-500">
                      +{automationLogs.length - 3}{" "}
                      {t.moreAiActions.replace('{count}', String(automationLogs.length - 3))}
                    </p>
                  )}
                </div>
              ) : !enrichment ? (
                <p className="text-slate-400 text-sm">{t.aiActivityNoEvents}</p>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Automation Logs Section */}
        {automationLogs.length > 0 && (
          <Card className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-400" />
                {t.appliedAutomationsTitle} ({automationLogs.length})
                <Badge className="bg-violet-500/20 text-violet-300 text-xs">CRM 3.0</Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.appliedAutomationsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {automationLogs.map((log) => (
                <div key={log.id} className="bg-slate-900/50 p-3 rounded-lg flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${log.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {log.success ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-slate-200 text-sm font-medium">
                        {log.automations_rules?.name || t.ruleLabel}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {t.triggerLabel}{' '}
                        {log.trigger_type === 'status_changed'
                          ? t.triggerStatusChanged
                          : log.trigger_type === 'new_lead'
                            ? t.triggerNewLead
                            : log.trigger_type === 'score_updated'
                              ? t.triggerScoreUpdated
                              : log.trigger_type}
                      </p>
                      {log.error_message && (
                        <p className="text-red-400 text-xs mt-1">{log.error_message}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {formatDateTimeForLocale(log.created_at, locale as Locale, timezone)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        {notes.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
                {t.notesTitle} ({notes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-slate-300 text-sm">{note.nota}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {formatDateTimeForLocale(note.created_at, locale as Locale, timezone)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageShell>
  );
}