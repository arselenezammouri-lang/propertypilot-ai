'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Mail, Phone, MessageSquare, Calendar, 
  TrendingUp, Target, DollarSign, Home, AlertTriangle, 
  UserCircle, Lightbulb, Sparkles, Copy, Check, Loader2,
  Brain, Shield, Zap, Clock, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLocaleContext } from '@/components/providers/locale-provider';
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
  const { locale } = useLocaleContext();
  const isIt = locale === 'it';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: isIt ? 'Copiato!' : 'Copied!', description: label || (isIt ? 'Testo copiato negli appunti' : 'Text copied to clipboard') });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 px-2 text-xs"
      data-testid={`copy-${label?.toLowerCase().replace(/\s/g, '-') || 'text'}`}
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
  const { locale } = useLocaleContext();
  const isItalian = locale === 'it';
  const { toast } = useToast();
  const leadId = params.id as string;

  const statusLabels: Record<string, string> = {
    new: isItalian ? 'Nuovo' : 'New',
    contacted: isItalian ? 'Contattato' : 'Contacted',
    followup: 'Follow-up',
    closed: isItalian ? 'Chiuso' : 'Closed',
    lost: isItalian ? 'Perso' : 'Lost',
  };

  const priorityLabels: Record<string, string> = {
    low: isItalian ? 'Bassa' : 'Low',
    medium: isItalian ? 'Media' : 'Medium',
    high: isItalian ? 'Alta' : 'High',
  };

  const t = {
    backToLeads: isItalian ? 'Torna ai Lead' : 'Back to Leads',
    headerSubtitle: 'CRM 2.5 - Smart Lead Capture + AI',
    analyzeBtn: isItalian ? 'Analisi in corso...' : 'Analyzing...',
    regenerateBtn: isItalian ? 'Rigenera Analisi AI' : 'Regenerate AI Analysis',
    enrichBtn: isItalian ? 'Arricchisci Lead con AI' : 'Enrich Lead with AI',
    leadInfoTitle: isItalian ? 'Informazioni Lead' : 'Lead Information',
    noEmail: isItalian ? 'Non fornita' : 'Not provided',
    noPhone: isItalian ? 'Non fornito' : 'Not provided',
    fromCache: isItalian ? 'Dalla cache (24h)' : 'From cache (24h)',
    aiInsightsTitle: 'AI Lead Insights',
    notFound: isItalian ? 'Lead non trovato' : 'Lead not found',
    backToList: isItalian ? 'Torna alla lista' : 'Back to list',
    // enrichment sections
    psychoTitle: isItalian ? 'Profilo Psicografico' : 'Psychographic Profile',
    buyerType: isItalian ? 'Tipo Acquirente:' : 'Buyer Type:',
    motivations: isItalian ? 'Motivazioni:' : 'Motivations:',
    decisionStyle: isItalian ? 'Stile Decisionale:' : 'Decision Style:',
    painPoints: 'Pain Points:',
    preferenceTitle: isItalian ? 'Preferenze Immobiliari' : 'Property Preferences',
    propertyType: isItalian ? 'Tipo Immobile:' : 'Property Type:',
    budget: 'Budget:',
    timeline: isItalian ? 'Timeline:' : 'Timeline:',
    location: isItalian ? 'Zona Preferita:' : 'Preferred Area:',
    priorityFeatures: isItalian ? 'Caratteristiche Prioritarie:' : 'Priority Features:',
    scoringTitle: isItalian ? 'Scoring & Priorità' : 'Scoring & Priority',
    score: 'Score:',
    priority: isItalian ? 'Priorità:' : 'Priority:',
    urgency: isItalian ? 'Urgenza:' : 'Urgency:',
    conversionProb: isItalian ? 'P. Conversione:' : 'Conv. Probability:',
    strongPoints: isItalian ? 'Punti Forti:' : 'Strong Points:',
    weakPoints: isItalian ? 'Punti Deboli:' : 'Weak Points:',
    strategyTitle: isItalian ? 'Strategia Consigliata' : 'Recommended Strategy',
    approach: isItalian ? 'Approccio:' : 'Approach:',
    talkingPoints: isItalian ? 'Punti Chiave:' : 'Key Points:',
    objections: isItalian ? 'Obiezioni Previste:' : 'Expected Objections:',
    proposedProps: isItalian ? 'Immobili da Proporre:' : 'Properties to Propose:',
    notesTitle: isItalian ? 'Note & Attività' : 'Notes & Activities',
    noNotes: isItalian ? 'Nessuna nota ancora' : 'No notes yet',
    automationsTitle: isItalian ? 'Log Automazioni' : 'Automation Logs',
    noAutomations: isItalian ? 'Nessuna automazione eseguita' : 'No automations executed',
    success: isItalian ? 'Successo' : 'Success',
    error: isItalian ? 'Errore' : 'Error',
    ruleLabel: isItalian ? 'Regola' : 'Rule',
    triggerLabel: isItalian ? 'Trigger:' : 'Trigger:',
    // toasts
    loadError: isItalian ? 'Impossibile caricare i dati del lead' : 'Cannot load lead data',
    analysisComplete: isItalian ? 'Analisi completata!' : 'Analysis complete!',
    fromCacheDesc: isItalian ? 'Dati recuperati dalla cache' : 'Data retrieved from cache',
    analysisDone: (ms: number) => isItalian ? `Analisi AI completata in ${ms}ms` : `AI analysis completed in ${ms}ms`,
    copied: isItalian ? 'Copiato!' : 'Copied!',
    copiedDesc: isItalian ? 'Testo copiato negli appunti' : 'Text copied to clipboard',
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
      const [leadRes, notesRes, enrichRes, logsRes] = await Promise.all([
        fetch(`/api/leads/${leadId}`),
        fetch(`/api/leads/add-note?lead_id=${leadId}`),
        fetch(`/api/leads/enrich?lead_id=${leadId}`),
        fetch(`/api/automations/execute-rule?lead_id=${leadId}&limit=10`),
      ]);

      if (leadRes.ok) {
        const leadData = await leadRes.json();
        setLead(leadData.data);
      }

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
      toast({ title: t.error, description: t.loadError, variant: 'destructive' });
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nell\'arricchimento');
      }

      const result = await response.json();
      setEnrichment(result.data);
      setEnrichmentCached(result.cached);
      toast({ title: t.analysisComplete, description: result.cached ? t.fromCacheDesc : t.analysisDone(result.duration) });
    } catch (error: any) {
      toast({ title: t.error, description: error.message, variant: 'destructive' });
    } finally {
      setIsEnriching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="text-center text-white">
          <p>{t.notFound}</p>
          <Link href="/dashboard/leads">
            <Button className="mt-4">{t.backToList}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { emoji: '🔥', label: 'Hot', color: 'bg-red-500' };
    if (score >= 40) return { emoji: '⭐', label: 'Warm', color: 'bg-yellow-500' };
    return { emoji: '❄️', label: 'Cold', color: 'bg-blue-500' };
  };

  const scoreBadge = getScoreBadge(lead.lead_score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {lead.nome}
                <Badge className={`${scoreBadge.color} text-white`}>
                  {scoreBadge.emoji} {lead.lead_score}
                </Badge>
              </h1>
              <p className="text-slate-400">{t.headerSubtitle}</p>
            </div>
          </div>

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
        </div>

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
              <span>{new Date(lead.created_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}</span>
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
                title={t.conversionProb} 
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
                title={t.budget} 
                icon={DollarSign}
                gradient="bg-gradient-to-br from-amber-600/90 to-orange-700/90"
              >
                <div className="space-y-3">
                  <div className="text-2xl font-bold">{enrichment.budget_analysis.fascia_prezzo}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold block">{isItalian ? 'Capacità:' : 'Capacity:'}</span>
                      {enrichment.budget_analysis.capacita_investimento}
                    </div>
                    <div>
                      <span className="font-semibold block">{isItalian ? 'Flessibilità:' : 'Flexibility:'}</span>
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
                      {enrichment.fascia_immobile.tipologie_consigliate.map((t, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{t}</Badge>
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
                title="Buyer Persona" 
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
                    <div><span className="font-semibold">{isItalian ? 'Età:' : 'Age:'}</span> {enrichment.buyer_persona.eta_stimata}</div>
                    <div><span className="font-semibold">{isItalian ? 'Professione:' : 'Profession:'}</span> {enrichment.buyer_persona.professione_probabile}</div>
                    <div className="col-span-2"><span className="font-semibold">{isItalian ? 'Famiglia:' : 'Family:'}</span> {enrichment.buyer_persona.situazione_familiare}</div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{isItalian ? 'Valori Chiave:' : 'Key Values:'}</span>
                    <div className="flex flex-wrap gap-1">
                      {enrichment.buyer_persona.valori_chiave.map((v, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/20 text-white text-xs">{v}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">{isItalian ? 'Trigger Acquisto:' : 'Purchase Triggers:'}</span>
                    <ul className="list-disc list-inside text-sm">
                      {enrichment.buyer_persona.trigger_acquisto.map((t, i) => (
                        <li key={i}>{t}</li>
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
                    <div><span className="font-semibold">{isItalian ? 'Frequenza:' : 'Frequency:'}</span> {enrichment.strategia_followup.frequenza_contatto}</div>
                    <div><span className="font-semibold">{isItalian ? 'Canale:' : 'Channel:'}</span> {enrichment.strategia_followup.canale_preferito}</div>
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
                  {isItalian ? 'Obiezioni Probabili e Risposte AI' : 'Likely Objections & AI Responses'}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {isItalian ? 'Anticipa le obiezioni e preparati con risposte efficaci' : 'Anticipate objections and prepare effective responses'}
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
                        <span className="font-semibold text-green-300">{isItalian ? 'Risposta:' : 'Answer:'}</span> {ob.risposta_suggerita}
                      </div>
                      <div className="text-white/70 text-xs">
                        <span className="font-semibold">{isItalian ? 'Strategia:' : 'Strategy:'}</span> {ob.strategia}
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
                      <p className="text-slate-400 text-sm">{isItalian ? 'Punteggio Qualità Lead' : 'Lead Quality Score'}</p>
                      <p className="text-2xl font-bold text-white">{enrichment.punteggio_qualita.score}/100</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300">{enrichment.punteggio_qualita.interpretazione}</p>
                    <p className="text-slate-500 text-sm">{isItalian ? 'Generato:' : 'Generated:'} {new Date(enrichment.generato_il).toLocaleString(locale === 'it' ? 'it-IT' : 'en-US')}</p>
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
                {isItalian ? "Arricchisci questo Lead con l'AI" : 'Enrich this Lead with AI'}
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                {isItalian
                  ? 'Ottieni un profilo psicografico completo, probabilità di chiusura, budget stimato, obiezioni probabili con risposte pronte e una strategia di follow-up personalizzata.'
                  : 'Get a complete psychographic profile, closing probability, estimated budget, likely objections with ready answers, and a personalized follow-up strategy.'}
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
                    {isItalian ? 'Analisi AI in corso...' : 'AI analysis in progress...'}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    {isItalian ? 'Avvia Analisi AI' : 'Start AI Analysis'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Automation Logs Section */}
        {automationLogs.length > 0 && (
          <Card className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-400" />
                {isItalian ? 'Automazioni Applicate' : 'Applied Automations'} ({automationLogs.length})
                <Badge className="bg-violet-500/20 text-violet-300 text-xs">CRM 3.0</Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {isItalian ? 'Storico delle regole di automazione eseguite su questo lead' : 'History of automation rules executed on this lead'}
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
                        {t.triggerLabel} {log.trigger_type === 'status_changed' ? (isItalian ? 'Status cambiato' : 'Status changed') :
                                 log.trigger_type === 'new_lead' ? (isItalian ? 'Nuovo lead' : 'New lead') :
                                 log.trigger_type === 'score_updated' ? (isItalian ? 'Score aggiornato' : 'Score updated') :
                                 log.trigger_type}
                      </p>
                      {log.error_message && (
                        <p className="text-red-400 text-xs mt-1">{log.error_message}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {new Date(log.created_at).toLocaleString(locale === 'it' ? 'it-IT' : 'en-US')}
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
                    {new Date(note.created_at).toLocaleString(locale === 'it' ? 'it-IT' : 'en-US')}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}