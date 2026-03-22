'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  FileText,
  Link2,
  Award,
  TrendingUp,
  Search,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Users,
  Loader2,
  Copy,
  Check,
  Globe,
  ShoppingCart,
  Crown,
  Share2,
  Heart,
  AlertCircle,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  KeyRound,
  Palmtree,
  Rocket,
  AlignLeft,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ProFeaturePaywall } from '@/components/demo-modal';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import type {
  ListingAuditorGoalKey,
  ListingAuditorMarketKey,
  ListingAuditorTransactionKey,
  ListingAuditorTxIconKey,
} from '@/lib/i18n/listing-auditor-page-ui';

const AUDITOR_TX_ICON: Record<ListingAuditorTxIconKey, LucideIcon> = {
  tag: Tag,
  keyRound: KeyRound,
  palmtree: Palmtree,
};

const STRUCTURAL_SECTION_ICON: Record<
  'titolo' | 'apertura' | 'corpo' | 'callToAction',
  LucideIcon
> = {
  titolo: FileText,
  apertura: Rocket,
  corpo: AlignLeft,
  callToAction: Target,
};
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';

interface StructuralAudit {
  titolo: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  apertura: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  corpo: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  callToAction: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
}

interface SEOAudit {
  punteggioSEO: number;
  keywordsMancanti: string[];
  ottimizzazioneH1: { presente: boolean; valutazione: string; suggerimento: string };
  problemiLeggibilita: string[];
  metaDescriptionConsigliata: string;
  keywordsPresenti: string[];
  densitaKeywords: string;
}

interface EmotionalAudit {
  tono: { attuale: string; ideale: string; valutazione: string };
  puntiDeboli: string[];
  sensazioniMancanti: string[];
  opportunitaNarrative: string[];
  connessioneEmotiva: number;
}

interface RedFlag {
  gravita: 'critica' | 'alta' | 'media';
  problema: string;
  soluzione: string;
  impatto: string;
}

interface AISuggestion {
  titolo: string;
  descrizione: string;
  priorita: number;
  impattoPrevisto: string;
}

interface OptimizedVersion {
  titolo: string;
  descrizione: string;
  highlights: string[];
  callToAction: string;
  metaDescription: string;
}

interface AuditResult {
  qualityScore: number;
  scoreBreakdown: { struttura: number; seo: number; emozioni: number; persuasivita: number };
  structuralAudit: StructuralAudit;
  seoAudit: SEOAudit;
  emotionalAudit: EmotionalAudit;
  redFlags: RedFlag[];
  suggestions: AISuggestion[];
  optimizedVersion: OptimizedVersion;
  targetBuyer: string;
  mercatoAnalisi: string;
}

const GOAL_ICONS: Record<ListingAuditorGoalKey, typeof ShoppingCart> = {
  vendita: ShoppingCart,
  seo: Search,
  luxury: Crown,
  social: Share2,
};

export default function AuditorPage() {
  const { locale } = useLocaleContext();
  const { toast } = useToast();
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mercato, setMercato] = useState<ListingAuditorMarketKey>('italia');
  const [obiettivo, setObiettivo] = useState<ListingAuditorGoalKey>('vendita');
  const [tipoTransazione, setTipoTransazione] = useState<ListingAuditorTransactionKey>('vendita');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const usage = useUsageLimits();
  const userPlan = usage.plan as 'free' | 'starter' | 'pro' | 'agency';
  const isLoadingPlan = usage.isLoading;
  const feedbackLocale = locale;

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.listingAuditorPage,
    [locale]
  );

  const MERCATI = useMemo(
    () =>
      (['italia', 'usa'] as const).map((value) => ({
        value,
        label: t.markets[value].label,
        portali: t.markets[value].portali,
      })),
    [t]
  );

  const OBIETTIVI = useMemo(
    () =>
      (['vendita', 'seo', 'luxury', 'social'] as const).map((value) => ({
        value,
        label: t.goals[value].label,
        icon: GOAL_ICONS[value],
        description: t.goals[value].description,
      })),
    [t]
  );

  const TIPO_TRANSAZIONE_OPTIONS = useMemo(
    () =>
      (['vendita', 'affitto', 'affitto_breve'] as const).map((value) => ({
        value,
        label: t.transactionTypes[value].label,
        iconKey: t.transactionTypes[value].iconKey,
      })),
    [t]
  );

  const minTextRef = useRef(t.minText);
  minTextRef.current = t.minText;
  const urlRequiredDescRef = useRef(t.urlRequiredDesc);
  urlRequiredDescRef.current = t.urlRequiredDesc;
  const communicationErrorRef = useRef(t.communicationError);
  communicationErrorRef.current = t.communicationError;
  const premiumRequiredDescRef = useRef(t.premiumRequiredDesc);
  premiumRequiredDescRef.current = t.premiumRequiredDesc;
  const analysisErrorRef = useRef(t.analysisError);
  analysisErrorRef.current = t.analysisError;

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast({ title: t.copied, description: t.copiedDesc });
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, 'listingAuditor', t.copyError);
      toast({ title: c.title, description: c.description, variant: 'destructive' });
    }
  };

  const handleAnalyze = async () => {
    if (inputMode === 'text' && (!textInput.trim() || textInput.trim().length < 50)) {
      const v = validationToast(feedbackLocale, 'listingAuditor', minTextRef.current);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    if (inputMode === 'url' && !urlInput.trim()) {
      const v = validationToast(feedbackLocale, 'listingAuditor', urlRequiredDescRef.current);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    setAuditResult(null);

    try {
      const payload = {
        ...(inputMode === 'text' ? { text: textInput } : { url: urlInput }),
        imageUrl: imageUrl || undefined,
        mercato,
        obiettivo,
        tipoTransazione,
      };

      const response = await fetch('/api/audit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        const fail = apiFailureToast(
          feedbackLocale,
          'listingAuditor',
          {},
          communicationErrorRef.current
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive', duration: 8000 });
        return;
      }

      if (!response.ok) {
        if (response.status === 403) {
          const fail = apiFailureToast(
            feedbackLocale,
            'listingAuditor',
            { status: 403, error: result.error, message: result.message },
            premiumRequiredDescRef.current
          );
          toast({
            title: t.premiumRequired,
            description: fail.description,
            variant: 'destructive',
            duration: 8000,
          });
          return;
        }

        const fail = apiFailureToast(
          feedbackLocale,
          'listingAuditor',
          { status: response.status, error: result.error, message: result.message },
          analysisErrorRef.current
        );
        const desc = result.suggestion
          ? `${fail.description}\n\n${t.suggestionHint} ${result.suggestion}`
          : fail.description;
        toast({ title: fail.title, description: desc, variant: 'destructive', duration: 8000 });
        return;
      }

      if (result.success && result.data) {
        setAuditResult(result.data);
        toast({
          title: t.analysisDone,
          description: t.analysisDoneDetail
            .replace('{qualityScore}', t.qualityScore)
            .replace('{score}', String(result.data.qualityScore)),
          duration: 5000,
        });
      }
    } catch (error: unknown) {
      const net = networkFailureToast(feedbackLocale, 'listingAuditor');
      const msg = error instanceof Error && error.message ? error.message : net.description;
      toast({
        title: net.title,
        description: msg || t.connectionFailed,
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return t.excellent;
    if (score >= 80) return t.great;
    if (score >= 70) return t.good;
    if (score >= 60) return t.fair;
    if (score >= 50) return t.passable;
    return t.needsWork;
  };

  const getGravitaColor = (gravita: string) => {
    switch (gravita) {
      case 'critica': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'alta': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default: return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    }
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, section)}
      className="h-8 px-2"
      data-testid={`button-copy-${section}`}
    >
      {copiedSection === section ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  const isLocked = userPlan !== 'pro' && userPlan !== 'agency';

  const planBadgeLabel = useMemo(() => {
    if (userPlan === 'agency') return t.planAgency;
    if (userPlan === 'pro') return t.planPro;
    if (userPlan === 'starter') return t.planStarter;
    return t.planFree;
  }, [userPlan, t]);

  const gravitaLabel = (g: string) => {
    if (g === 'critica' || g === 'alta' || g === 'media') return t.gravita[g];
    return g;
  };

  return (
    <DashboardPageShell className="relative max-w-7xl">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/grid.svg')] opacity-10" aria-hidden />
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back-dashboard"
        aria-label={t.backAria}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.auditPageTitle}
        titleDataTestId="heading-listing-auditor"
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        actions={
          <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-xs text-white">
            {t.expertBadge}
          </Badge>
        }
      />

        <ProFeaturePaywall
          title={t.paywallTitle}
          description={t.paywallDescription}
          isLocked={isLocked && !isLoadingPlan}
        >
          <Card className="mb-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30 shadow-2xl shadow-blue-500/10" data-testid="card-input">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <FileText className="h-6 w-6 text-blue-400" />
                {t.analyzeListing}
              </CardTitle>
              <CardDescription className="text-blue-200/60">
                {t.analyzeListingDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-3 mb-6">
                <Label className="text-blue-200">{t.listingType}</Label>
                <Select value={tipoTransazione} onValueChange={(v) => setTipoTransazione(v as ListingAuditorTransactionKey)}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-tipo-transazione">
                    <SelectValue placeholder={t.selectTransaction} />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPO_TRANSAZIONE_OPTIONS.map((option) => {
                      const TxIcon = AUDITOR_TX_ICON[option.iconKey];
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <TxIcon className="h-4 w-4 shrink-0 text-blue-300" aria-hidden />
                            <span>{option.label}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-blue-200">{t.market}</Label>
                <Select value={mercato} onValueChange={(v) => setMercato(v as ListingAuditorMarketKey)}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-mercato">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MERCATI.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.label}</span>
                          <span className="text-xs text-muted-foreground">{m.portali}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-blue-200">{t.goal}</Label>
                <Select value={obiettivo} onValueChange={(v) => setObiettivo(v as ListingAuditorGoalKey)}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-obiettivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OBIETTIVI.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <div className="flex items-center gap-2">
                          <o.icon className="h-4 w-4" />
                          <span className="font-medium">{o.label}</span>
                          <span className="text-xs text-muted-foreground">- {o.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'text' | 'url')}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="text" className="data-[state=active]:bg-blue-600" data-testid="tab-text">
                  <FileText className="h-4 w-4 mr-2" />
                  {t.tabText}
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-blue-600" data-testid="tab-url">
                  <Link2 className="h-4 w-4 mr-2" />
                  {t.tabUrl}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <Textarea
                  data-testid="textarea-listing"
                  placeholder={t.textareaPlaceholder}
                  className="min-h-[200px] resize-y bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <p className={`text-sm ${textInput.length < 50 ? 'text-amber-400' : 'text-blue-200/60'}`}>
                  {t.charactersProgress.replace('{count}', String(textInput.length))}
                </p>
              </TabsContent>

              <TabsContent value="url" className="space-y-4 mt-4">
                <Input
                  data-testid="input-url"
                  type="url"
                  placeholder={t.urlPlaceholder}
                  className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-sm text-blue-200/60">
                  {t.urlSupportedHint}
                </p>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Label className="text-blue-200 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {t.imageUrl}
              </Label>
              <Input
                data-testid="input-image-url"
                type="url"
                placeholder={t.imagePlaceholder}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <Button
              data-testid="button-analyze"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-500 hover:via-purple-500 hover:to-amber-400 text-white font-bold shadow-lg shadow-blue-500/25"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  {t.startAudit}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {auditResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20" data-testid="card-quality-score">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-blue-200/60 text-sm uppercase tracking-wider mb-2">{t.qualityScoreHeading}</p>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-7xl md:text-8xl font-black bg-gradient-to-r ${getScoreGradient(auditResult.qualityScore)} bg-clip-text text-transparent`} data-testid="text-quality-score">
                        {auditResult.qualityScore}
                      </span>
                      <span className="text-3xl text-blue-200/40">{t.outOf100}</span>
                    </div>
                    <Badge className={`mt-3 text-lg px-4 py-1 ${auditResult.qualityScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : auditResult.qualityScore >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {getScoreLabel(auditResult.qualityScore)}
                    </Badge>
                  </div>

                  <div className="flex-1 max-w-md space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">{t.breakdownStructure}</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.struttura}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.struttura / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">{t.breakdownSeo}</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.seo}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.seo / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">{t.breakdownEmotions}</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.emozioni}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.emozioni / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">{t.breakdownPersuasion}</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.persuasivita}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.persuasivita / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30" data-testid="card-structural-audit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  {t.structuralAuditTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(['titolo', 'apertura', 'corpo', 'callToAction'] as const).map((key) => {
                  const item = auditResult.structuralAudit[key];
                  const labels = t.structuralSections;
                  const SectionIcon = STRUCTURAL_SECTION_ICON[key];
                  return (
                    <div key={key} className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="flex items-center gap-2 font-semibold text-blue-200">
                          <SectionIcon className="h-4 w-4 shrink-0 text-blue-400" aria-hidden />
                          {labels[key]}
                        </h4>
                        <Badge className={item.punteggio >= 7 ? 'bg-emerald-500/20 text-emerald-400' : item.punteggio >= 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}>
                          {item.punteggio}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-100/80 mb-3">{item.valutazione}</p>
                      {item.problemi?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-red-400 mb-1">{t.problemsLabel}</p>
                          <ul className="text-sm text-red-300/80 space-y-1">
                            {item.problemi.map((p, i) => <li key={i} className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-0.5 shrink-0" />{p}</li>)}
                          </ul>
                        </div>
                      )}
                      {item.suggerimenti?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-emerald-400 mb-1">{t.suggestionsLabel}</p>
                          <ul className="text-sm text-emerald-300/80 space-y-1">
                            {item.suggerimenti.map((s, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-emerald-500/30" data-testid="card-seo-audit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-emerald-400" />
                    {t.seoAuditTitle}
                  </div>
                  <Badge className={auditResult.seoAudit.punteggioSEO >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {auditResult.seoAudit.punteggioSEO}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-red-500/20">
                    <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {t.keywordsMissing}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {auditResult.seoAudit.keywordsMancanti?.map((kw, i) => (
                        <Badge key={i} variant="outline" className="border-red-500/30 text-red-300">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {t.keywordsPresent}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {auditResult.seoAudit.keywordsPresenti?.map((kw, i) => (
                        <Badge key={i} variant="outline" className="border-emerald-500/30 text-emerald-300">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-200 mb-2">{t.h1Optimization}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {auditResult.seoAudit.ottimizzazioneH1?.presente ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <span className="text-sm text-blue-100/80">{auditResult.seoAudit.ottimizzazioneH1?.valutazione}</span>
                  </div>
                  <p className="flex items-start gap-2 text-sm text-amber-300/80">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    <span>
                      <span className="font-medium">{t.suggestionHint}</span>{' '}
                      {auditResult.seoAudit.ottimizzazioneH1?.suggerimento}
                    </span>
                  </p>
                </div>

                {auditResult.seoAudit.problemiLeggibilita?.length > 0 && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-amber-500/20">
                    <h4 className="font-semibold text-amber-400 mb-3">{t.readabilityIssues}</h4>
                    <ul className="space-y-2">
                      {auditResult.seoAudit.problemiLeggibilita.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-emerald-400">{t.recommendedMetaDescription}</h4>
                    <CopyButton text={auditResult.seoAudit.metaDescriptionConsigliata || ''} section="meta" />
                  </div>
                  <p className="text-sm text-emerald-100/90 italic">"{auditResult.seoAudit.metaDescriptionConsigliata}"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-pink-500/30" data-testid="card-emotional-audit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-pink-400" />
                    {t.emotionalAuditTitle}
                  </div>
                  <Badge className={auditResult.emotionalAudit.connessioneEmotiva >= 70 ? 'bg-pink-500/20 text-pink-400' : 'bg-amber-500/20 text-amber-400'}>
                    {t.connectionScore.replace('{score}', String(auditResult.emotionalAudit.connessioneEmotiva))}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-pink-500/20">
                  <h4 className="font-semibold text-pink-200 mb-3">{t.toneAnalysis}</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200/60">{t.currentTone}</span>
                      <p className="text-pink-300 font-medium">{auditResult.emotionalAudit.tono?.attuale}</p>
                    </div>
                    <div>
                      <span className="text-blue-200/60">{t.idealTone}</span>
                      <p className="text-emerald-300 font-medium">{auditResult.emotionalAudit.tono?.ideale}</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/80 mt-3">{auditResult.emotionalAudit.tono?.valutazione}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-red-500/20">
                    <h4 className="font-semibold text-red-400 mb-3">{t.emotionalWeaknesses}</h4>
                    <ul className="space-y-2">
                      {auditResult.emotionalAudit.puntiDeboli?.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-200/80">
                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-amber-500/20">
                    <h4 className="font-semibold text-amber-400 mb-3">{t.missingSensations}</h4>
                    <ul className="space-y-2">
                      {auditResult.emotionalAudit.sensazioniMancanti?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-400 mb-3">{t.narrativeOpportunities}</h4>
                  <ul className="space-y-2">
                    {auditResult.emotionalAudit.opportunitaNarrative?.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-purple-200/90">
                        <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-purple-400" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {auditResult.redFlags?.length > 0 && (
              <Card className="bg-gradient-to-br from-red-950/50 to-slate-900/90 border-2 border-red-500/50" data-testid="card-red-flags">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                    {t.redFlagsTitle}
                  </CardTitle>
                  <CardDescription className="text-red-200/60">
                    {t.redFlagsDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {auditResult.redFlags.map((rf, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${getGravitaColor(rf.gravita)}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getGravitaColor(rf.gravita)}>
                          {gravitaLabel(rf.gravita)}
                        </Badge>
                        <span className="font-semibold text-white">{rf.problema}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-emerald-400 font-medium">{t.solutionLabel}</span>
                          <p className="text-emerald-200/80 mt-1">{rf.soluzione}</p>
                        </div>
                        <div>
                          <span className="text-amber-400 font-medium">{t.impactIfUnresolved}</span>
                          <p className="text-amber-200/80 mt-1">{rf.impatto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/30" data-testid="card-suggestions">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Zap className="h-6 w-6 text-amber-400" />
                  {t.aiSuggestionsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {auditResult.suggestions?.map((s, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                        {s.priorita}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-300 mb-1">{s.titolo}</h4>
                        <p className="text-sm text-blue-100/80 mb-2">{s.descrizione}</p>
                        <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span>
                            {t.expectedImpactPrefix} {s.impattoPrevisto}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20" data-testid="card-optimized-version">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-purple-400" />
                    {t.optimizedVersionTitle}
                  </div>
                  <CopyButton 
                    text={`${auditResult.optimizedVersion.titolo}\n\n${auditResult.optimizedVersion.descrizione}\n\n${auditResult.optimizedVersion.highlights.map(h => `• ${h}`).join('\n')}\n\n${auditResult.optimizedVersion.callToAction}`}
                    section="optimized"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-300">{t.optimizedTitleLabel}</span>
                    <CopyButton text={auditResult.optimizedVersion.titolo || ''} section="title" />
                  </div>
                  <p className="text-xl font-bold text-white">{auditResult.optimizedVersion.titolo}</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-300">{t.descriptionLabel}</span>
                    <CopyButton text={auditResult.optimizedVersion.descrizione || ''} section="description" />
                  </div>
                  <p className="text-blue-100/90 whitespace-pre-line leading-relaxed">{auditResult.optimizedVersion.descrizione}</p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-emerald-300">{t.highlightsLabel}</span>
                    <CopyButton text={auditResult.optimizedVersion.highlights?.join('\n') || ''} section="highlights" />
                  </div>
                  <ul className="space-y-2">
                    {auditResult.optimizedVersion.highlights?.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-emerald-100/90">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-300">{t.callToActionLabel}</span>
                    <CopyButton text={auditResult.optimizedVersion.callToAction || ''} section="cta" />
                  </div>
                  <p className="text-lg font-semibold text-amber-200">{auditResult.optimizedVersion.callToAction}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-200">{t.metaDescriptionSeoLabel}</span>
                    <CopyButton text={auditResult.optimizedVersion.metaDescription || ''} section="seo-meta" />
                  </div>
                  <p className="text-sm text-blue-100/80 italic">"{auditResult.optimizedVersion.metaDescription}"</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30" data-testid="card-target-buyer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Users className="h-5 w-5 text-blue-400" />
                    {t.targetBuyerTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80 text-sm leading-relaxed">{auditResult.targetBuyer}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-emerald-500/30" data-testid="card-market-analysis">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Globe className="h-5 w-5 text-emerald-400" />
                    {t.marketAnalysisTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">{auditResult.mercatoAnalisi}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        </ProFeaturePaywall>
    </DashboardPageShell>
  );
}
