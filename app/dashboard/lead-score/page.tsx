'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation } from '@/lib/i18n/dictionary';
import type { LeadScoreFactorApiName } from '@/lib/i18n/lead-score-page-ui';
import { useAPIErrorHandler } from '@/components/error-boundary';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import Link from 'next/link';
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';
import {
  Target,
  Flame,
  Thermometer,
  Snowflake,
  Clock,
  Wallet,
  Calendar,
  Heart,
  MessageSquare,
  AlertTriangle,
  Copy,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Mail,
  User,
  RefreshCw,
  Loader2,
  Lightbulb,
  FileText,
} from 'lucide-react';

interface LeadFactor {
  nome: string;
  punteggio: number;
  motivazione: string;
}

interface ActionPriority {
  priorita: number;
  azione: string;
  motivazione: string;
  tempistica: string;
}

interface LeadResponse {
  breve: string;
  lungo: string;
  oggetto: string;
}

interface PerfectCopySuggestion {
  tipo: string;
  descrizione: string;
  motivazione: string;
}

interface LeadScoreResult {
  leadScore: number;
  categoria: 'hot' | 'warm' | 'cold';
  categoriaLabel: string;
  categoriaEmoji: string;
  sintesiAnalisi: string;
  breakdown: LeadFactor[];
  prioritaAzione: ActionPriority[];
  rispostaBrieveTemplate: LeadResponse;
  rispostaLungaTemplate: LeadResponse;
  suggerimentiPerfectCopy: PerfectCopySuggestion[];
  profiloLead: string;
  rischioPerditaLead: string;
  followUpStrategy: string;
}

interface LeadScoreResponse {
  success: boolean;
  data?: LeadScoreResult;
  cached?: boolean;
  processingTimeMs?: number;
  error?: string;
  message?: string;
}

const FACTOR_ICONS: Record<LeadScoreFactorApiName, typeof Clock> = {
  'Urgenza Percepita': Clock,
  'Budget e Compatibilità': Wallet,
  Tempistiche: Calendar,
  Motivazione: Heart,
  'Chiarezza Messaggio': MessageSquare,
};

export default function LeadScorePage() {
  const { locale } = useLocaleContext();
  const feedbackLocale = locale === 'it' ? 'it' : 'en';
  const lsp = useMemo(() => getTranslation(locale).dashboard.leadScorePage, [locale]);
  const usage = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();
  const [mercato, setMercato] = useState<'italia' | 'usa'>('italia');
  const [messaggioLead, setMessaggioLead] = useState<string>('');
  const [tipoImmobile, setTipoImmobile] = useState<string>('appartamento');
  const [tempistiche, setTempistiche] = useState<string>(() => {
    const t0 = getTranslation(locale).dashboard.leadScorePage;
    return t0.timingOptions[t0.timingOptions.length - 1] ?? '';
  });
  useEffect(() => {
    const last = lsp.timingOptions[lsp.timingOptions.length - 1] ?? '';
    setTempistiche((prev) => (lsp.timingOptions.includes(prev) ? prev : last));
  }, [lsp.timingOptions]);
  const [budget, setBudget] = useState<string>('');
  const [nomeLead, setNomeLead] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LeadScoreResult | null>(null);
  const [cached, setCached] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  const { toast } = useToast();
  const t = lsp;
  const marketOptions = useMemo(
    () => [
      { value: 'italia' as const, label: lsp.marketItaly },
      { value: 'usa' as const, label: lsp.marketUsa },
    ],
    [lsp.marketItaly, lsp.marketUsa]
  );
  const propertyTypes = t.propertyTypes;
  const timingOptions = t.timingOptions;

  const handleSubmit = async () => {
    if (!messaggioLead.trim()) {
      const v = validationToast(feedbackLocale, 'leadScoring', t.requiredMessage);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    if (messaggioLead.trim().length < 20) {
      const v = validationToast(feedbackLocale, 'leadScoring', t.messageTooShortDesc);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/lead-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mercato,
          messaggioLead: messaggioLead.trim(),
          tipoImmobile,
          tempistiche,
          budget: budget.trim() || undefined,
          nomeLead: nomeLead.trim() || undefined,
        }),
      });

      const data = (await response.json()) as LeadScoreResponse;

      if (!response.ok || !data.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          'leadScoring',
          {
            status: response.status,
            error: data.error,
            message: data.message,
          },
          t.analysisErrorGeneric
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        return;
      }

      setResult(data.data || null);
      setCached(data.cached || false);
      setProcessingTime(data.processingTimeMs || null);

      toast({
        title: t.analysisDone,
        description: data.cached
          ? lsp.cacheBadge
          : t.analysisInSeconds.replace(
              '{seconds}',
              String(Math.round((data.processingTimeMs || 0) / 1000))
            ),
      });
    } catch (error: unknown) {
      const net = networkFailureToast(feedbackLocale, 'leadScoring');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t.copied,
        description: t.copiedWithLabel.replace('{label}', label),
      });
    } catch {
      const c = clipboardFailureToast(
        feedbackLocale,
        'leadScoring',
        t.copyFailed
      );
      toast({ title: c.title, description: c.description, variant: 'destructive' });
    }
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'hot': return <Flame className="w-6 h-6 text-red-500" />;
      case 'warm': return <Thermometer className="w-6 h-6 text-orange-500" />;
      case 'cold': return <Snowflake className="w-6 h-6 text-blue-400" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'hot': return 'from-red-500 to-orange-500';
      case 'warm': return 'from-orange-400 to-yellow-500';
      case 'cold': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryBadge = (categoria: string, label: string) => {
    switch (categoria) {
      case 'hot':
        return { label: label || lsp.categoryHot, color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'warm':
        return { label: label || lsp.categoryWarm, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'cold':
        return { label: label || lsp.categoryCold, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default:
        return { label: lsp.categoryDefault, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFactorScoreColor = (score: number, max: number = 20) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const planBadgeLabel =
    usage.plan === 'agency'
      ? lsp.planAgency
      : usage.plan === 'pro'
        ? lsp.planPro
        : usage.plan === 'starter'
          ? lsp.planStarter
          : lsp.planFree;

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {lsp.backToDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-lead-score"
        subtitle={t.pageSubtitle}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        actions={
          <Badge className="flex items-center gap-1 border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-xs text-cyan-200">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {lsp.headerPriorityBadge}
          </Badge>
        }
      />

      <div className="space-y-8">
        {/* Input Form */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              {t.analyzeLead}
            </CardTitle>
            <CardDescription>
              {t.analyzeLeadDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Row 1: Mercato, Tipo Immobile, Tempistiche */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t.referenceMarket}</Label>
                <Select value={mercato} onValueChange={(v) => setMercato(v as 'italia' | 'usa')}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-mercato">
                    <SelectValue placeholder={t.selectMarket} />
                  </SelectTrigger>
                  <SelectContent>
                    {marketOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.propertyType}</Label>
                <Select value={tipoImmobile} onValueChange={setTipoImmobile}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-tipo-immobile">
                    <SelectValue placeholder={t.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.timing}</Label>
                <Select value={tempistiche} onValueChange={setTempistiche}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-tempistiche">
                    <SelectValue placeholder={t.selectTiming} />
                  </SelectTrigger>
                  <SelectContent>
                    {timingOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Nome Lead e Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t.leadName}</Label>
                <input
                  type="text"
                  value={nomeLead}
                  onChange={(e) => setNomeLead(e.target.value)}
                  placeholder={t.leadNamePlaceholder}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500"
                  data-testid="input-nome-lead"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.statedBudget}</Label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={t.budgetPlaceholder}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500"
                  data-testid="input-budget"
                />
              </div>
            </div>
            
            {/* Messaggio Lead */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                {t.leadMessage} <span className="text-red-400">*</span>
              </Label>
              <Textarea
                value={messaggioLead}
                onChange={(e) => setMessaggioLead(e.target.value)}
                placeholder={t.leadMessagePlaceholder}
                className="min-h-[150px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                data-testid="textarea-messaggio-lead"
              />
              <p className="text-xs text-slate-500">
                {messaggioLead.length} {t.characters} • {t.minimum20}
              </p>
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || messaggioLead.trim().length < 20}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/25"
              data-testid="button-analizza-lead"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.analyzeWithAi}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            
            {/* Score Overview */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(result.categoria)}`} />
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Main Score */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      {getCategoryIcon(result.categoria)}
                      <Badge className={getCategoryBadge(result.categoria, result.categoriaLabel).color}>
                        {getCategoryBadge(result.categoria, result.categoriaLabel).label}
                      </Badge>
                    </div>
                    <div className={`text-6xl font-bold ${getScoreColor(result.leadScore)}`}>
                      {result.leadScore}
                    </div>
                    <p className="text-slate-400 mt-2">{t.leadScoreLabel}</p>
                    <Progress 
                      value={result.leadScore} 
                      className="w-full mt-4 h-3"
                    />
                  </div>
                  
                  {/* Summary */}
                  <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      {t.analysisSummary}
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {result.sintesiAnalisi}
                    </p>
                    
                    {/* Profile & Risk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-1 mb-2">
                          <User className="w-4 h-4" /> {t.leadProfile}
                        </h4>
                        <p className="text-sm text-slate-400">{result.profiloLead}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-red-500/20">
                        <h4 className="text-sm font-medium text-red-400 flex items-center gap-1 mb-2">
                          <AlertTriangle className="w-4 h-4" /> {t.lossRisk}
                        </h4>
                        <p className="text-sm text-slate-400">{result.rischioPerditaLead}</p>
                      </div>
                    </div>
                    
                    {cached && (
                      <Badge className="mt-4 flex items-center gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {lsp.cacheBadge}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factor Breakdown */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  {t.factorBreakdown}
                </CardTitle>
                <CardDescription>
                  {t.factorBreakdownDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.breakdown.map((factor, index) => {
                    const factorKey = factor.nome as LeadScoreFactorApiName;
                    const IconComponent = FACTOR_ICONS[factorKey] ?? Target;
                    const factorLabel = t.factorLabels[factorKey] ?? factor.nome;
                    return (
                      <div 
                        key={index}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-cyan-400" />
                            <span className="font-medium text-white text-sm">{factorLabel}</span>
                          </div>
                          <span className={`text-lg font-bold ${getFactorScoreColor(factor.punteggio)}`}>
                            {factor.punteggio}/20
                          </span>
                        </div>
                        <Progress value={(factor.punteggio / 20) * 100} className="h-2 mb-3" />
                        <p className="text-sm text-slate-400">{factor.motivazione}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Priorities */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                  {t.actionPriorities}
                </CardTitle>
                <CardDescription>
                  {t.actionPrioritiesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.prioritaAzione.map((action, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {action.priorita}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{action.azione}</span>
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {action.tempistica}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{action.motivazione}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Follow-up Strategy */}
                {result.followUpStrategy && (
                  <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {t.followUpStrategy}
                    </h4>
                    <p className="text-sm text-slate-300">{result.followUpStrategy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Templates */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  {t.responseTemplates}
                </CardTitle>
                <CardDescription>
                  {t.responseTemplatesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Risposta Breve */}
                  <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {t.quickReply}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${t.emailSubjectLabel}: ${result.rispostaBrieveTemplate.oggetto}\n\n${result.rispostaBrieveTemplate.lungo}`,
                          t.quickReply
                        )}
                        className="text-slate-400 hover:text-white"
                        data-testid="button-copy-risposta-breve"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.emailSubjectLabel}</p>
                        <p className="text-white font-medium">{result.rispostaBrieveTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.shortVersion}</p>
                        <p className="text-slate-300">{result.rispostaBrieveTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.fullVersion}</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaBrieveTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risposta Lunga/Professionale */}
                  <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="flex items-center gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {t.professionalReply}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${t.emailSubjectLabel}: ${result.rispostaLungaTemplate.oggetto}\n\n${result.rispostaLungaTemplate.lungo}`,
                          t.professionalReply
                        )}
                        className="text-slate-400 hover:text-white"
                        data-testid="button-copy-risposta-lunga"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.emailSubjectLabel}</p>
                        <p className="text-white font-medium">{result.rispostaLungaTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.intro}</p>
                        <p className="text-slate-300">{result.rispostaLungaTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.fullEmail}</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaLungaTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perfect Copy Suggestions */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  {t.perfectCopy}
                </CardTitle>
                <CardDescription>
                  {t.perfectCopyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.suggerimentiPerfectCopy.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-slate-800/50 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          {suggestion.tipo}
                        </Badge>
                      </div>
                      <p className="text-white font-medium mb-2">{suggestion.descrizione}</p>
                      <p className="text-sm text-slate-400">{suggestion.motivazione}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Info */}
            {processingTime && (
              <div className="text-center text-sm text-slate-500">
                {(cached ? t.processingFooterCached : t.processingFooterFresh).replace(
                  '{seconds}',
                  (processingTime / 1000).toFixed(1)
                )}
              </div>
            )}
            
            {/* New Analysis Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setMessaggioLead('');
                  setBudget('');
                  setNomeLead('');
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                data-testid="button-nuova-analisi"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.newAnalysis}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
}
