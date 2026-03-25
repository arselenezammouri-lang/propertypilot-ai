'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Link2,
  Search,
  Sparkles,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Video,
  Mail,
  TrendingUp,
  TrendingDown,
  Home,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import { ScrapedListing } from '@/lib/scrapers/types';
import { GeneratedContent } from '@/lib/ai/generateListingContent';
import { fetchApi } from '@/lib/api/client';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { useAPIErrorHandler } from '@/components/error-boundary';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { ContextualHelpTrigger } from '@/components/contextual-help-trigger';
import {
  apiFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';

export default function ScraperPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useLocale();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.listingScraperPage,
    [locale]
  );

  const urlRequiredDescRef = useRef(t.urlRequiredDesc);
  urlRequiredDescRef.current = t.urlRequiredDesc;
  const scrapeErrorRef = useRef(t.scrapeError);
  scrapeErrorRef.current = t.scrapeError;
  const aiGenerationErrorRef = useRef(t.aiGenerationError);
  aiGenerationErrorRef.current = t.aiGenerationError;
  const noDataDescRef = useRef(t.noDataDesc);
  noDataDescRef.current = t.noDataDesc;
  const saveErrorRef = useRef(t.saveError);
  saveErrorRef.current = t.saveError;

  const [url, setUrl] = useState('');
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [scrapedData, setScrapedData] = useState<ScrapedListing | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');

  const handleScrape = async () => {
    if (!url.trim()) {
      const v = validationToast(feedbackLocale, 'listingScraper', urlRequiredDescRef.current);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsScrapingLoading(true);
    setScrapedData(null);
    setGeneratedContent(null);

    try {
      const res = await fetchApi<ScrapedListing>('/api/scrape-listing', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      if (!res.success) {
        const suggestion = (res as { suggestion?: string }).suggestion;
        const fail = apiFailureToast(
          feedbackLocale,
          'listingScraper',
          { status: res.status, error: res.error, message: res.message },
          scrapeErrorRef.current
        );
        const desc = suggestion
          ? `${fail.description}\n\n${t.suggestionHint} ${suggestion}`
          : fail.description;
        toast({ title: fail.title, description: desc, variant: 'destructive', duration: 8000 });
        return;
      }

      const scraped = res.data;
      setScrapedData(scraped);
      setSourceUrl(url);
      toast({
        title: t.scrapeSuccess,
        description: t.scrapeSuccessDesc,
        duration: 5000,
      });
      await handleGenerateAI(scraped);
    } catch (error: unknown) {
      console.error('[SCRAPER UI] Error:', error);
      const net = networkFailureToast(feedbackLocale, 'listingScraper');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsScrapingLoading(false);
    }
  };

  const handleGenerateAI = async (data: ScrapedListing) => {
    setIsAiLoading(true);
    try {
      const res = await fetchApi<GeneratedContent>('/api/generate-comprehensive', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          'listingScraper',
          { status: res.status, error: res.error, message: res.message },
          aiGenerationErrorRef.current
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive', duration: 8000 });
        return;
      }
      setGeneratedContent(res.data!);
      toast({
        title: t.aiSuccess,
        description: t.aiSuccessDesc,
        duration: 5000,
      });
    } catch (error: unknown) {
      console.error('[AI GENERATION] Error:', error);
      const net = networkFailureToast(feedbackLocale, 'listingScraper');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!scrapedData || !generatedContent) {
      const v = validationToast(feedbackLocale, 'listingScraper', noDataDescRef.current);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetchApi<unknown>('/api/listings/save', {
        method: 'POST',
        body: JSON.stringify({
          title: scrapedData.title || t.unnamedListing,
          property_data: scrapedData,
          generated_content: generatedContent,
          source_url: sourceUrl,
        }),
      });

      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          'listingScraper',
          { status: res.status, error: res.error, message: res.message },
          saveErrorRef.current
        );
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        return;
      }

      toast({
        title: t.saved,
        description: t.savedDesc,
      });

      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 1500);
    } catch (error: unknown) {
      console.error('[SAVE] Error:', error);
      const net = networkFailureToast(feedbackLocale, 'listingScraper');
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const planBadgeLabel = useMemo(() => {
    const p = usage.plan;
    if (p === 'agency') return t.planAgency;
    if (p === 'pro') return t.planPro;
    if (p === 'starter') return t.planStarter;
    return t.planFree;
  }, [usage.plan, t]);

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back-dashboard"
        aria-label={t.backAria}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backLink}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-scraper"
        subtitle={t.pageDesc}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        contextualHelp={<ContextualHelpTrigger docSlug="prospecting/scraper-guide" />}
        actions={<Sparkles className="h-8 w-8 text-violet-400" aria-hidden />}
      />

      <Card className="mb-8" data-testid="card-url-input">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {t.urlCardTitle}
          </CardTitle>
          <CardDescription>{t.urlCardDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder={t.urlInputPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              className="flex-1"
              data-testid="input-url"
            />
            <Button onClick={handleScrape} disabled={isScrapingLoading || isAiLoading} data-testid="button-scrape">
              {isScrapingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t.analyzeBtn}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAiLoading && (
        <Card className="mb-8 border-primary" data-testid="card-ai-loading">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{t.aiLoading}</h3>
              <p className="text-muted-foreground">{t.aiLoadingDesc}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {scrapedData && !isAiLoading && (
        <Card className="mb-8" data-testid="card-scraped-preview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t.scrapedTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" data-testid="text-scraped-title">
                    {scrapedData.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scrapedData.price && (
                      <Badge variant="secondary" data-testid="badge-price">
                        {scrapedData.price}
                      </Badge>
                    )}
                    {scrapedData.location && (
                      <Badge variant="outline" data-testid="badge-location">
                        {scrapedData.location}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {scrapedData.surface && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t.surface}</p>
                      <p className="font-medium" data-testid="text-surface">
                        {scrapedData.surface}
                      </p>
                    </div>
                  )}
                  {scrapedData.rooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t.rooms}</p>
                      <p className="font-medium" data-testid="text-rooms">
                        {scrapedData.rooms}
                      </p>
                    </div>
                  )}
                </div>

                {scrapedData.description_raw && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.originalDesc}</p>
                    <p className="text-sm line-clamp-4" data-testid="text-description-raw">
                      {scrapedData.description_raw}
                    </p>
                  </div>
                )}
              </div>

              <div>
                {scrapedData.features && scrapedData.features.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t.features}</p>
                    <div className="flex flex-wrap gap-2">
                      {scrapedData.features.slice(0, 6).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs" data-testid={`badge-feature-${idx}`}>
                          {feature}
                        </Badge>
                      ))}
                      {scrapedData.features.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          {t.moreFeatures.replace('{n}', String(scrapedData.features.length - 6))}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedContent && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t.aiGeneratedTitle}</h2>
            <Button onClick={handleSaveToLibrary} disabled={isSaving} size="lg" data-testid="button-save-library">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.saveToLibrary}
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {t.professionalTitle}
                </CardTitle>
                <CardDescription>{t.professionalDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-professional">
                  {generatedContent.professional}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-short">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {t.shortTitle}
                </CardTitle>
                <CardDescription>{t.shortDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm" data-testid="text-short">
                  {generatedContent.short}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-emotional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  {t.emotionalTitle}
                </CardTitle>
                <CardDescription>{t.emotionalDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-emotional">
                  {generatedContent.emotional}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-titles">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  {t.titlesTitle}
                </CardTitle>
                <CardDescription>{t.titlesDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.titles.map((title, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-title-${idx}`}>
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-video-script" className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-600" />
                  {t.videoScriptTitle}
                </CardTitle>
                <CardDescription>{t.videoScriptDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-video-script">
                  {generatedContent.videoScript}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-email" className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  {t.emailTitle}
                </CardTitle>
                <CardDescription>{t.emailDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-email">
                  {generatedContent.emailFollowUp}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-strengths">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  {t.strengthsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-strength-${idx}`}>
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-weaknesses">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  {t.weaknessesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-weakness-${idx}`}>
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-home-staging">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-indigo-600" />
                  {t.stagingTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.homeStaging.map((suggestion, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-staging-${idx}`}>
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-portal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-600" />
                  {t.portalTitle}
                </CardTitle>
                <CardDescription>{t.portalDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-portal">
                  {generatedContent.portalDescription}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardPageShell>
  );
}
