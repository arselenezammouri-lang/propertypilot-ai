"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Link2, 
  Search,
  Loader2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  FileEdit,
  Copy,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";

interface ScrapedData {
  title: string;
  price: string;
  location: string;
  surface: string;
  rooms: string;
  features: string[];
  description_raw: string;
  images: string[];
  propertyType?: string;
}

interface Analysis {
  qualityScore: number;
  strengths: string[];
  weaknesses: string[];
  seoAnalysis: {
    score: number;
    keywords: string[];
    suggestions: string[];
  };
  targetBuyer: string;
  improvements: string[];
  rewrittenListing: {
    professional: string;
    short: string;
    titles: string[];
  };
}

export default function AnalyzePage() {
  const { locale } = useLocaleContext();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isItalian = locale === "it";
  const feedbackLocale = isItalian ? "it" : "en";
  const usage = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();
  const t = {
    enterUrl: isItalian ? "Inserisci un URL" : "Enter a URL",
    pasteUrl: isItalian ? "Incolla il link dell'annuncio da analizzare" : "Paste the listing URL to analyze",
    analysisError: isItalian ? "Errore durante l'analisi" : "Error during analysis",
    analysisDone: isItalian ? "Analisi completata!" : "Analysis completed!",
    fromCache: isItalian ? "Risultati dalla cache" : "Results from cache",
    newAnalysis: isItalian ? "Nuova analisi generata" : "New analysis generated",
    error: isItalian ? "Errore" : "Error",
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedToClipboard: (label: string) => isItalian ? `${label} copiato negli appunti` : `${label} copied to clipboard`,
    copyFailed: isItalian ? "Impossibile copiare il testo" : "Unable to copy text",
    back: isItalian ? "Dashboard" : "Dashboard",
    headerSubtitle: isItalian ? "Analisi Automatica" : "Automatic Analysis",
    heroTitleLead: isItalian ? "Analisi" : "Automatic",
    heroTitleAccent: isItalian ? "Automatica" : "Link Analysis",
    heroTitleTail: isItalian ? "da Link" : "",
    heroSubtitle: isItalian
      ? "Incolla un link e ottieni analisi, suggerimenti e riscrittura AI in secondi"
      : "Paste a link and get analysis, suggestions, and AI rewriting in seconds",
    urlPlaceholder: isItalian
      ? "Incolla qui il link dell'annuncio (Immobiliare.it, Idealista, Casa.it, Subito.it, Zillow)"
      : "Paste the listing URL here (Immobiliare.it, Idealista, Casa.it, Subito.it, Zillow)",
    analyzing: isItalian ? "Analizzo..." : "Analyzing...",
    analyze: isItalian ? "Analizza" : "Analyze",
    qualityScore: isItalian ? "Punteggio Qualità" : "Quality Score",
    seoScore: isItalian ? "Punteggio SEO" : "SEO Score",
    outOf100: isItalian ? "su 100" : "out of 100",
    idealBuyer: isItalian ? "Buyer Ideale" : "Ideal Buyer",
    extractedData: isItalian ? "Dati Estratti" : "Extracted Data",
    title: isItalian ? "Titolo" : "Title",
    price: isItalian ? "Prezzo" : "Price",
    location: isItalian ? "Località" : "Location",
    surface: isItalian ? "Superficie" : "Area",
    rooms: isItalian ? "Locali" : "Rooms",
    type: isItalian ? "Tipo" : "Type",
    notAvailable: isItalian ? "N/D" : "N/A",
    analysis: isItalian ? "Analisi" : "Analysis",
    improvements: isItalian ? "Miglioramenti" : "Improvements",
    rewrite: isItalian ? "Riscrittura AI" : "AI Rewrite",
    strengths: isItalian ? "Punti di Forza" : "Strengths",
    weaknesses: isItalian ? "Punti Deboli" : "Weaknesses",
    seoAnalysis: isItalian ? "Analisi SEO" : "SEO Analysis",
    detectedKeywords: isItalian ? "Keywords rilevate:" : "Detected keywords:",
    seoSuggestions: isItalian ? "Suggerimenti SEO:" : "SEO suggestions:",
    improvementSuggestions: isItalian ? "Suggerimenti di Miglioramento" : "Improvement Suggestions",
    professionalListing: isItalian ? "Annuncio Professionale (Riscritto)" : "Professional Listing (Rewritten)",
    shortVersion: isItalian ? "Versione Breve (Max 50 parole)" : "Short Version (Max 50 words)",
    catchyTitles: isItalian ? "5 Titoli Accattivanti" : "5 Catchy Titles",
    copy: isItalian ? "Copia" : "Copy",
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      const v = validationToast(feedbackLocale, "linkAnalysis", t.pasteUrl);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedData(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "linkAnalysis",
          { status: response.status, error: data.error, message: data.message },
          t.analysisError
        );
        setError(fail.description);
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      setScrapedData(data.scrapedData);
      setAnalysis(data.analysis);

      toast({
        title: t.analysisDone,
        description: data.fromCache ? t.fromCache : t.newAnalysis,
      });
    } catch (err: unknown) {
      const net = networkFailureToast(feedbackLocale, "linkAnalysis");
      const friendly = handleAPIError(err, net.description);
      setError(friendly);
      toast({ title: net.title, description: friendly, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        toast({
          title: t.copied,
          description: t.copiedToClipboard(label),
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: t.copied,
          description: t.copiedToClipboard(label),
        });
      }
    } catch {
      const c = clipboardFailureToast(feedbackLocale, "linkAnalysis", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    if (score >= 40) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  const heroTitle = `${t.heroTitleLead} ${t.heroTitleAccent}${t.heroTitleTail ? ` ${t.heroTitleTail}` : ""}`;

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back-dashboard"
        aria-label={t.back}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={heroTitle}
        titleDataTestId="heading-analyze-link"
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <Badge variant="outline" className="border-neon-aqua/40 text-xs text-neon-aqua">
            {t.headerSubtitle}
          </Badge>
        }
      />

        <div className="futuristic-card p-8 mb-8 animate-fade-in-up" data-testid="card-analyze-input">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder={t.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14 text-lg border-royal-purple/30 focus:border-royal-purple bg-background/50"
                disabled={isLoading}
                data-testid="input-analyze-url"
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="h-14 px-8 bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 transition-all text-lg font-semibold shadow-glow-purple"
              data-testid="button-analyze"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t.analyze}
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-neon-aqua/30 text-neon-aqua">
              <Globe className="mr-1 h-3 w-3" /> Immobiliare.it
            </Badge>
            <Badge variant="outline" className="border-electric-blue/30 text-electric-blue">
              <Globe className="mr-1 h-3 w-3" /> Idealista.it
            </Badge>
            <Badge variant="outline" className="border-royal-purple/30 text-royal-purple">
              <Globe className="mr-1 h-3 w-3" /> Casa.it
            </Badge>
            <Badge variant="outline" className="border-sunset-gold/30 text-sunset-gold">
              <Globe className="mr-1 h-3 w-3" /> Subito.it
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-500">
              <Globe className="mr-1 h-3 w-3" /> Zillow.com (USA)
            </Badge>
          </div>
        </div>

        {error && (
          <div className="futuristic-card p-6 mb-8 border-red-500/30 bg-red-500/10 animate-fade-in-up" data-testid="card-error">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-500">{t.error}</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="futuristic-card p-12 animate-fade-in-up" data-testid="card-loading">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-ai-aurora rounded-2xl flex items-center justify-center animate-pulse shadow-glow-purple">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-card/50 rounded-lg w-48 mb-2 animate-pulse" />
                  <div className="h-4 bg-card/30 rounded-lg w-64 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-card/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-card/30 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-card/30 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {scrapedData && analysis && !isLoading && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className={`futuristic-card p-8 text-center border ${getScoreBg(analysis.qualityScore)}`} data-testid="card-quality-score">
                <Award className={`h-12 w-12 mx-auto mb-4 ${getScoreColor(analysis.qualityScore)}`} />
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.qualityScore}</p>
                <p className={`text-6xl font-black ${getScoreColor(analysis.qualityScore)}`}>
                  {analysis.qualityScore}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{t.outOf100}</p>
                <Progress value={analysis.qualityScore} className="mt-4" />
              </div>

              <div className={`futuristic-card p-8 text-center border ${getScoreBg(analysis.seoAnalysis.score)}`} data-testid="card-seo-score">
                <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${getScoreColor(analysis.seoAnalysis.score)}`} />
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.seoScore}</p>
                <p className={`text-6xl font-black ${getScoreColor(analysis.seoAnalysis.score)}`}>
                  {analysis.seoAnalysis.score}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{t.outOf100}</p>
                <Progress value={analysis.seoAnalysis.score} className="mt-4" />
              </div>

              <div className="futuristic-card p-8 border-neon-aqua/30" data-testid="card-target-buyer">
                <Target className="h-12 w-12 mx-auto mb-4 text-neon-aqua" />
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.idealBuyer}</p>
                <p className="text-lg font-semibold">{analysis.targetBuyer}</p>
              </div>
            </div>

            <div className="futuristic-card p-6 border-silver-frost/30" data-testid="card-scraped-data">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-electric-blue" />
                {t.extractedData}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.title}</p>
                  <p className="font-semibold">{scrapedData.title || t.notAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.price}</p>
                  <p className="font-semibold text-sunset-gold">{scrapedData.price || t.notAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                  <p className="font-semibold">{scrapedData.location || t.notAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.surface}</p>
                  <p className="font-semibold">{scrapedData.surface || t.notAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.rooms}</p>
                  <p className="font-semibold">{scrapedData.rooms || t.notAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.type}</p>
                  <p className="font-semibold">{scrapedData.propertyType || t.notAvailable}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-14 bg-background/50 border border-silver-frost/30">
                <TabsTrigger value="analysis" className="text-base data-[state=active]:bg-royal-purple data-[state=active]:text-white" data-testid="tab-analysis">
                  <Search className="mr-2 h-4 w-4" />
                  {t.analysis}
                </TabsTrigger>
                <TabsTrigger value="improvements" className="text-base data-[state=active]:bg-electric-blue data-[state=active]:text-white" data-testid="tab-improvements">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {t.improvements}
                </TabsTrigger>
                <TabsTrigger value="rewrite" className="text-base data-[state=active]:bg-neon-aqua data-[state=active]:text-white" data-testid="tab-rewrite">
                  <FileEdit className="mr-2 h-4 w-4" />
                  {t.rewrite}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6" data-testid="content-analysis">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="futuristic-card p-6 border-green-500/30">
                    <h4 className="font-bold text-green-500 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {t.strengths} ({analysis.strengths.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="futuristic-card p-6 border-red-500/30">
                    <h4 className="font-bold text-red-500 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {t.weaknesses} ({analysis.weaknesses.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="futuristic-card p-6 border-electric-blue/30">
                  <h4 className="font-bold text-electric-blue mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t.seoAnalysis}
                  </h4>
                  {analysis.seoAnalysis.keywords.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">{t.detectedKeywords}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.seoAnalysis.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary" className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.seoAnalysis.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{t.seoSuggestions}</p>
                      <ul className="space-y-2">
                        {analysis.seoAnalysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-electric-blue mt-0.5 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="improvements" className="space-y-6" data-testid="content-improvements">
                <div className="futuristic-card p-6 border-sunset-gold/30">
                  <h4 className="font-bold text-sunset-gold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    {t.improvementSuggestions}
                  </h4>
                  <ul className="space-y-3">
                    {analysis.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-sunset-gold/10 rounded-lg border border-sunset-gold/20">
                        <div className="w-6 h-6 rounded-full bg-sunset-gold/30 flex items-center justify-center text-sm font-bold text-sunset-gold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="rewrite" className="space-y-6" data-testid="content-rewrite">
                <div className="futuristic-card p-6 border-neon-aqua/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-neon-aqua flex items-center gap-2">
                      <FileEdit className="h-5 w-5" />
                      {t.professionalListing}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.rewrittenListing.professional, isItalian ? "Annuncio professionale" : "Professional listing")}
                      className="border-neon-aqua/30 hover:border-neon-aqua"
                      data-testid="button-copy-professional"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t.copy}
                    </Button>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {analysis.rewrittenListing.professional}
                  </p>
                </div>

                <div className="futuristic-card p-6 border-electric-blue/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-electric-blue flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {t.shortVersion}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.rewrittenListing.short, isItalian ? "Versione breve" : "Short version")}
                      className="border-electric-blue/30 hover:border-electric-blue"
                      data-testid="button-copy-short"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t.copy}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {analysis.rewrittenListing.short}
                  </p>
                </div>

                <div className="futuristic-card p-6 border-royal-purple/30">
                  <h4 className="font-bold text-royal-purple mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {t.catchyTitles}
                  </h4>
                  <div className="space-y-3">
                    {analysis.rewrittenListing.titles.map((title, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-royal-purple/10 rounded-lg border border-royal-purple/20">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-royal-purple/30 flex items-center justify-center text-sm font-bold text-royal-purple">
                            {i + 1}
                          </span>
                          <span className="font-medium">{title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(title, isItalian ? `Titolo ${i + 1}` : `Title ${i + 1}`)}
                          className="hover:bg-royal-purple/20"
                          data-testid={`button-copy-title-${i}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
    </DashboardPageShell>
  );
}
