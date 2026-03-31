'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Globe
} from 'lucide-react';
import { ScrapedListing } from '@/lib/scrapers/types';
import { GeneratedContent } from '@/lib/ai/generateListingContent';
import { fetchApi } from '@/lib/api/client';
import { useLocale } from "@/lib/i18n/locale-context";
import { useAPIErrorHandler } from "@/components/error-boundary";

function normalizeListingUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function ScraperPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { handleAPIError } = useAPIErrorHandler();

  const t = {
    pageTitle: isItalian ? "Analisi Annuncio AI" : "AI Listing Analysis",
    pageDesc: isItalian ? "Importa annunci da portali immobiliari e genera contenuti professionali con AI" : "Import listings from real estate portals and generate professional content with AI",
    urlCardTitle: isItalian ? "URL Annuncio" : "Listing URL",
    urlCardDesc: isItalian ? "Supportati: Immobiliare.it, Idealista.it, Casa.it, Subito.it" : "Supported: Immobiliare.it, Idealista.it, Casa.it, Subito.it",
    analyzing: isItalian ? "Analisi..." : "Analyzing...",
    analyzeBtn: isItalian ? "Analizza Annuncio" : "Analyze Listing",
    aiLoading: isItalian ? "Generazione contenuti AI in corso..." : "Generating AI content...",
    aiLoadingDesc: isItalian ? "Stiamo creando descrizioni, titoli, email, video script e molto altro." : "We're creating descriptions, titles, emails, video scripts and much more.",
    scrapedTitle: isItalian ? "Dati Estratti" : "Extracted Data",
    surface: isItalian ? "Superficie" : "Surface",
    rooms: isItalian ? "Locali" : "Rooms",
    originalDesc: isItalian ? "Descrizione originale" : "Original description",
    features: isItalian ? "Caratteristiche" : "Features",
    moreFeatures: (n: number) => isItalian ? `+${n} altre` : `+${n} more`,
    aiGeneratedTitle: isItalian ? "Contenuti AI Generati" : "Generated AI Content",
    saving: isItalian ? "Salvataggio..." : "Saving...",
    saveToLibrary: isItalian ? "Salva nella Libreria" : "Save to Library",
    professionalTitle: isItalian ? "Descrizione Professionale" : "Professional Description",
    professionalDesc: isItalian ? "150-200 parole, SEO ottimizzato" : "150-200 words, SEO optimized",
    shortTitle: isItalian ? "Descrizione Breve" : "Short Description",
    shortDesc: isItalian ? "Max 50 parole per portali" : "Max 50 words for portals",
    emotionalTitle: isItalian ? "Descrizione Emozionale" : "Emotional Description",
    emotionalDesc: isItalian ? "Storytelling e lifestyle" : "Storytelling and lifestyle",
    titlesTitle: isItalian ? "Titoli Accattivanti" : "Catchy Titles",
    titlesDesc: isItalian ? "5 varianti SEO-friendly" : "5 SEO-friendly variants",
    videoScriptTitle: isItalian ? "Script Video (Reels/TikTok)" : "Video Script (Reels/TikTok)",
    videoScriptDesc: isItalian ? "30-45 secondi per social media" : "30-45 seconds for social media",
    emailTitle: isItalian ? "Email Follow-up" : "Follow-up Email",
    emailDesc: isItalian ? "Template per potenziali acquirenti" : "Template for potential buyers",
    strengthsTitle: isItalian ? "Punti di Forza" : "Strengths",
    weaknessesTitle: isItalian ? "Punti di Debolezza" : "Weaknesses",
    stagingTitle: isItalian ? "Suggerimenti Home Staging" : "Home Staging Tips",
    portalTitle: isItalian ? "Descrizione per Portali" : "Portal Description",
    portalDesc: isItalian ? "Ottimizzata per Immobiliare.it, Idealista" : "Optimized for Immobiliare.it, Idealista",
    // toasts
    urlRequired: isItalian ? "URL richiesto" : "URL required",
    urlRequiredDesc: isItalian ? "Inserisci l'URL di un annuncio immobiliare." : "Enter the URL of a real estate listing.",
    serverError: isItalian ? "Errore di comunicazione con il server. Riprova tra qualche secondo." : "Server communication error. Try again in a few seconds.",
    scrapeError: isItalian ? "Errore durante lo scraping" : "Scraping error",
    scrapeSuccess: isItalian ? "Scraping completato!" : "Scraping complete!",
    scrapeSuccessDesc: isItalian ? "Dati estratti con successo. Generazione contenuti AI in corso..." : "Data extracted successfully. Generating AI content...",
    networkError: isItalian ? "Impossibile connettersi al server." : "Cannot connect to the server.",
    errorTitle: isItalian ? "Errore" : "Error",
    aiErrorTitle: isItalian ? "Errore AI" : "AI Error",
    aiGenerationError: isItalian ? "Errore durante la generazione AI" : "AI generation error",
    aiSuccess: isItalian ? "Contenuti AI generati!" : "AI content generated!",
    aiSuccessDesc: isItalian ? "Tutti i contenuti sono stati creati con successo." : "All content has been created successfully.",
    noData: isItalian ? "Nessun dato da salvare" : "No data to save",
    noDataDesc: isItalian ? "Genera prima i contenuti AI." : "Generate AI content first.",
    unnamedListing: isItalian ? "Annuncio senza titolo" : "Untitled listing",
    saveError: isItalian ? "Errore durante il salvataggio" : "Save error",
    saved: isItalian ? "Salvato!" : "Saved!",
    savedDesc: isItalian ? "L'annuncio è stato salvato nella tua libreria." : "The listing has been saved to your library.",
    saveGenericError: isItalian ? "Impossibile salvare l'annuncio." : "Cannot save the listing.",
  };
  
  const [url, setUrl] = useState('');
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [scrapedData, setScrapedData] = useState<ScrapedListing | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');

  const handleScrape = async () => {
    const normalizedUrl = normalizeListingUrl(url);
    if (!normalizedUrl) {
      toast({
        title: t.urlRequired,
        description: t.urlRequiredDesc,
        variant: 'destructive',
      });
      return;
    }

    setIsScrapingLoading(true);
    setScrapedData(null);
    setGeneratedContent(null);

    try {
      const res = await fetchApi<ScrapedListing>('/api/scrape-listing', {
        method: 'POST',
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!res.success) {
        const suggestion = (res as { suggestion?: string }).suggestion;
        toast({
          title: 'Errore',
          description: suggestion ? `${res.error ?? res.message}\n\n💡 ${suggestion}` : (res.error ?? res.message ?? t.scrapeError),
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }

      const scrapedData = res.data;
      setScrapedData(scrapedData);
      setSourceUrl(normalizedUrl);
      setUrl(normalizedUrl);
      toast({
        title: t.scrapeSuccess,
        description: t.scrapeSuccessDesc,
        duration: 5000,
      });
      await handleGenerateAI(scrapedData);

    } catch (error: any) {
      // Catch only for network/parsing errors
      console.error('[SCRAPER UI] Error:', error);
      const friendly = handleAPIError(error, t.scrapeError);
      toast({
        title: t.errorTitle,
        description: friendly || t.networkError,
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
        toast({
          title: t.aiErrorTitle,
          description: (res.error ?? res.message ?? t.aiGenerationError),
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }
      setGeneratedContent(res.data!);
      toast({
        title: t.aiSuccess,
        description: t.aiSuccessDesc,
        duration: 5000,
      });

    } catch (error: any) {
      console.error('[AI GENERATION] Error:', error);
      const friendly = handleAPIError(error, t.aiGenerationError);
      toast({
        title: t.aiErrorTitle,
        description: friendly || t.networkError,
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!scrapedData || !generatedContent) {
      toast({
        title: t.noData,
        description: t.noDataDesc,
        variant: 'destructive',
      });
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
        throw new Error(res.message ?? res.error ?? t.saveError);
      }

      toast({
        title: t.saved,
        description: t.savedDesc,
      });

      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 1500);

    } catch (error: any) {
      console.error('[SAVE] Error:', error);
      const friendly = handleAPIError(error, t.saveError);
      toast({
        title: t.errorTitle,
        description: friendly || t.saveGenericError,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <Sparkles className="inline-block mr-2 h-8 w-8 text-primary" />
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t.pageDesc}
        </p>
      </div>

      {/* URL Input */}
      <Card className="mb-8" data-testid="card-url-input">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {t.urlCardTitle}
          </CardTitle>
          <CardDescription>
            {t.urlCardDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="https://www.immobiliare.it/annunci/12345..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              className="flex-1"
              data-testid="input-url"
            />
            <Button 
              onClick={handleScrape} 
              disabled={isScrapingLoading || isAiLoading}
              data-testid="button-scrape"
            >
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

      {/* Loading State - AI Generation */}
      {isAiLoading && (
        <Card className="mb-8 border-primary" data-testid="card-ai-loading">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{t.aiLoading}</h3>
              <p className="text-muted-foreground">
                {t.aiLoadingDesc}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scraped Data Preview */}
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
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" data-testid="text-scraped-title">{scrapedData.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scrapedData.price && (
                      <Badge variant="secondary" data-testid="badge-price">{scrapedData.price}</Badge>
                    )}
                    {scrapedData.location && (
                      <Badge variant="outline" data-testid="badge-location">{scrapedData.location}</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {scrapedData.surface && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t.surface}</p>
                      <p className="font-medium" data-testid="text-surface">{scrapedData.surface}</p>
                    </div>
                  )}
                  {scrapedData.rooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t.rooms}</p>
                      <p className="font-medium" data-testid="text-rooms">{scrapedData.rooms}</p>
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

              {/* Right Column */}
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
                          {t.moreFeatures(scrapedData.features.length - 6)}
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

      {/* Generated AI Content */}
      {generatedContent && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t.aiGeneratedTitle}</h2>
            <Button 
              onClick={handleSaveToLibrary} 
              disabled={isSaving}
              size="lg"
              data-testid="button-save-library"
            >
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
            {/* Professional Listing */}
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

            {/* Short Listing */}
            <Card data-testid="card-short">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {t.shortTitle}
                </CardTitle>
                <CardDescription>{t.shortDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm" data-testid="text-short">{generatedContent.short}</p>
              </CardContent>
            </Card>

            {/* Emotional Listing */}
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

            {/* Titles */}
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

            {/* Video Script */}
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

            {/* Email Follow-up */}
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

            {/* Strengths & Weaknesses */}
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

            {/* Home Staging */}
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

            {/* Portal Description */}
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
    </div>
  );
}
