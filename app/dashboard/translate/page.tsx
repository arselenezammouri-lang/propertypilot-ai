'use client';

import { useMemo, useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  Languages,
  Sparkles,
  Copy,
  Check,
  Loader2,
  BookOpen,
  Lightbulb,
  Search,
  Tag,
  KeyRound,
  Palmtree,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAPIErrorHandler } from "@/components/error-boundary";
import { fetchApi } from '@/lib/api/client';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { Badge } from '@/components/ui/badge';
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';
import { getTranslation } from '@/lib/i18n/dictionary';
import type { TranslateListingTxIconKey } from '@/lib/i18n/translate-listing-page-ui';

const TRANSLATE_TX_ICON: Record<TranslateListingTxIconKey, typeof Tag> = {
  tag: Tag,
  keyRound: KeyRound,
  palmtree: Palmtree,
};


interface TranslationResult {
  linguaTarget: {
    code: string;
    name: string;
    country: string;
  };
  tono: string;
  titoloOriginale: string;
  titoloTradotto: string;
  descrizioneOriginale: string;
  descrizioneTradotta: string;
  versioneSEO: string;
  vocabolarioAdattato: string[];
  noteCulturali: string[];
  cached?: boolean;
}

export default function TranslatePage() {
  const { locale } = useLocale();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const t = useMemo(() => getTranslation(locale).dashboard.translateListingPage, [locale]);

  const tones = useMemo(
    () => [
      {
        value: 'standard' as const,
        label: t.toneStandard,
        description: t.toneStandardDesc,
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        value: 'luxury' as const,
        label: t.toneLuxury,
        description: t.toneLuxuryDesc,
        gradient: 'from-amber-500 to-yellow-400',
      },
    ],
    [t.toneLuxury, t.toneLuxuryDesc, t.toneStandard, t.toneStandardDesc]
  );

  const [tipoTransazione, setTipoTransazione] = useState('vendita');
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [caratteristiche, setCaratteristiche] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTone, setSelectedTone] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const handleTranslate = async () => {
    if (!titolo.trim() || titolo.length < 5) {
      const v = validationToast(feedbackLocale, 'translateListing', t.titleRequiredDesc);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }
    if (!descrizione.trim() || descrizione.length < 20) {
      const v = validationToast(feedbackLocale, 'translateListing', t.descRequiredDesc);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<TranslationResult>('/api/translate-listing', {
        method: 'POST',
        body: JSON.stringify({
          tipoTransazione,
          titolo,
          descrizione,
          caratteristiche: caratteristiche || undefined,
          linguaTarget: selectedLanguage,
          tono: selectedTone,
        }),
      });

      if (!res.success) {
        const fail = apiFailureToast(feedbackLocale, 'translateListing', {
          status: res.status,
          error: res.error,
          message: res.message,
        }, t.errorGeneric);
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        return;
      }

      const data = res.data as TranslationResult;
      setResult(data);
      toast({
        title: t.successTitle,
        description: data.cached
          ? t.successCached
          : t.successDescFresh.replace('{lang}', data.linguaTarget.name),
      });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'translateListing');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({ title: t.copied, description: t.copiedDesc });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, 'translateListing', t.copyFailed);
      toast({ title: c.title, description: c.description, variant: 'destructive' });
    }
  };

  const selectedLangInfo = t.targetLanguages.find((l) => l.code === selectedLanguage);

  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const planBadgeLabel =
    usage.plan === 'agency'
      ? dash.planAgency
      : usage.plan === 'pro'
        ? dash.planPro
        : usage.plan === 'starter'
          ? dash.planStarter
          : dash.planFree;

  const backLabel = t.backToDashboard;

  return (
    <DashboardPageShell className="max-w-6xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        data-testid="button-back"
        aria-label={backLabel}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        actions={
          <Badge className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 text-xs">
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.heroBadge}
          </Badge>
        }
      />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-lg" data-testid="card-form">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Languages className="h-5 w-5 text-emerald-500" />
                  {t.formTitle}
                </CardTitle>
                <CardDescription>
                  {t.formSubtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.listingType}</Label>
                  <Select
                    value={tipoTransazione}
                    onValueChange={(value) => setTipoTransazione(value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-900" data-testid="select-tipo-transazione">
                      <SelectValue placeholder={t.selectTransaction} />
                    </SelectTrigger>
                    <SelectContent>
                      {t.transactionOptions.map((option) => {
                        const TxIcon = TRANSLATE_TX_ICON[option.iconKey];
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <TxIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                              <span>{option.label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titolo">{t.titleLabel}</Label>
                  <Input
                    id="titolo"
                    placeholder={t.titlePlaceholder}
                    value={titolo}
                    onChange={(e) => setTitolo(e.target.value)}
                    className="bg-white dark:bg-slate-900"
                    data-testid="input-titolo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descrizione">{t.descriptionLabel}</Label>
                  <Textarea
                    id="descrizione"
                    placeholder={t.descriptionPlaceholder}
                    value={descrizione}
                    onChange={(e) => setDescrizione(e.target.value)}
                    rows={6}
                    className="bg-white dark:bg-slate-900 resize-none"
                    data-testid="input-descrizione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caratteristiche">{t.featuresLabel}</Label>
                  <Textarea
                    id="caratteristiche"
                    placeholder={t.featuresPlaceholder}
                    value={caratteristiche}
                    onChange={(e) => setCaratteristiche(e.target.value)}
                    rows={3}
                    className="bg-white dark:bg-slate-900 resize-none"
                    data-testid="input-caratteristiche"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-lg" data-testid="card-language">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-cyan-500" />
                  {t.targetLanguage}
                </CardTitle>
                <CardDescription>
                  {t.selectLanguage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {t.targetLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        selectedLanguage === lang.code
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                      }`}
                      data-testid={`button-lang-${lang.code}`}
                    >
                      <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate w-full text-center">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-lg" data-testid="card-tone">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {t.toneLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTone === tone.value
                          ? `border-transparent bg-gradient-to-br ${tone.gradient} text-white shadow-lg`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                      data-testid={`button-tone-${tone.value}`}
                    >
                      <div className="font-semibold">{tone.label}</div>
                      <div className={`text-xs mt-1 ${selectedTone === tone.value ? 'text-white/80' : 'text-slate-500'}`}>
                        {tone.description}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleTranslate}
              disabled={isLoading || !titolo.trim() || !descrizione.trim()}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25"
              data-testid="button-translate"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t.translateLoading}
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5 mr-2" />
                  {t.translateIdle} {selectedLangInfo?.name ?? ''}
                </>
              )}
            </Button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {isLoading && (
              <Card className="border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30"></div>
                      <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <Globe className="h-8 w-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {t.loadingText}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {t.loadingSubtext} {selectedLangInfo?.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && !result && (
              <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <Languages className="h-10 w-10 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                        {t.emptyTitle}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-md">
                        {t.emptySubtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {t.targetLanguages.slice(0, 6).map((lang) => (
                        <span key={lang.code} className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                          {lang.name}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-300">
                        {t.moreLanguages}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20">
                  <Globe className="h-10 w-10 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <div>
                    <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {t.resultTitle} {result.linguaTarget.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t.market} {result.linguaTarget.country} • {t.tone}{' '}
                      {result.tono === 'luxury' ? t.toneValueLuxury : t.toneValueStandard}
                      {result.cached && ` • ${t.cache}`}
                    </p>
                  </div>
                </div>

                <Card className="border-emerald-200 dark:border-emerald-800/50 shadow-lg overflow-hidden group" data-testid="card-title-translated">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Languages className="h-5 w-5 text-emerald-500" />
                        {t.translatedTitle}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result.titoloTradotto, 'titolo')}
                        className="flex-shrink-0"
                        data-testid="button-copy-title"
                      >
                        {copiedField === 'titolo' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                      {result.titoloTradotto}
                    </p>
                    <p className="text-sm text-slate-500 mt-2 line-through">
                      {t.originalLabel} {result.titoloOriginale}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden group" data-testid="card-description-translated">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        {t.translatedDesc}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result.descrizioneTradotta, 'descrizione')}
                        className="flex-shrink-0"
                        data-testid="button-copy-description"
                      >
                        {copiedField === 'descrizione' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {result.descrizioneTradotta}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800/50 shadow-lg overflow-hidden group" data-testid="card-seo">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Search className="h-5 w-5 text-amber-500" />
                          {t.seoVersion}
                        </CardTitle>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          {t.seoRankingBadge}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result.versioneSEO, 'seo')}
                        className="flex-shrink-0"
                        data-testid="button-copy-seo"
                      >
                        {copiedField === 'seo' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardDescription>
                      {t.seoOptimized} {result.linguaTarget.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {result.versioneSEO}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-purple-200 dark:border-purple-800/50 shadow-lg overflow-hidden" data-testid="card-vocabulary">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                        {t.vocabTitle}
                      </CardTitle>
                      <CardDescription>
                        {t.vocabDesc} {result.linguaTarget.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.vocabolarioAdattato.map((term, i) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-teal-200 dark:border-teal-800/50 shadow-lg overflow-hidden" data-testid="card-cultural">
                    <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-teal-500" />
                        {t.culturalTitle}
                      </CardTitle>
                      <CardDescription>
                        {t.culturalDesc} {result.linguaTarget.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.noteCulturali.map((note, i) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-teal-500 mt-1 shrink-0" aria-hidden>
                              •
                            </span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
    </DashboardPageShell>
  );
}
