"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import { 
  Sparkles, 
  Briefcase,
  Heart,
  Crown,
  Search,
  Copy, 
  Check, 
  Loader2,
  ArrowLeft,
  AlertCircle,
  Wand2,
  FileText
} from "lucide-react";
import Link from "next/link";

interface RefinedListing {
  titolo: string;
  descrizione: string;
  highlights: string[];
  cta: string;
  metaDescription: string;
}

interface RefineListingResult {
  professional: RefinedListing;
  emotional: RefinedListing;
  luxury: RefinedListing;
  seo: RefinedListing;
  analisiOriginale: string;
  cached?: boolean;
}

interface FormData {
  tipoTransazione: string;
  originalText: string;
  propertyType: string;
  location: string;
  tone: "professional" | "emotional" | "luxury" | "seo";
}

export default function RefineListingPage() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";
  const feedbackLocale = isItalian ? "it" : "en";
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RefineListingResult | null>(null);
  const [activeTab, setActiveTab] = useState("professional");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const t = {
    textTooShortDesc: isItalian ? "L'annuncio originale deve avere almeno 50 caratteri" : "The original listing must be at least 50 characters",
    propertyTypeRequired: isItalian ? "Inserisci il tipo di immobile" : "Enter the property type",
    locationRequired: isItalian ? "Inserisci la località" : "Enter the location",
    refineError: isItalian ? "Errore nel raffinamento" : "Refinement error",
    successTitle: isItalian ? "Perfect Again — pronto" : "Perfect Again — ready",
    cacheResult: isItalian ? "Risultato dalla cache (24h)" : "Result from cache (24h)",
    ready4: isItalian ? "4 versioni migliorate pronte all'uso" : "4 improved versions ready to use",
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedDesc: isItalian ? "Testo copiato negli appunti" : "Text copied to clipboard",
    copyFailed: isItalian ? "Impossibile copiare il testo" : "Unable to copy text",
    back: isItalian ? "Torna alla dashboard" : "Back to dashboard",
    pageTitle: "Perfect Again AI",
    pageSubtitle: isItalian ? "Raffina e migliora completamente i tuoi annunci esistenti" : "Refine and improve your existing listings",
    listingToImprove: isItalian ? "Annuncio da Migliorare" : "Listing to Improve",
    listingToImproveDesc: isItalian ? "Incolla il tuo annuncio esistente e lascia che l'AI lo perfezioni" : "Paste your existing listing and let AI perfect it",
    listingType: isItalian ? "Tipo Annuncio" : "Listing Type",
    selectTransaction: isItalian ? "Seleziona tipo transazione" : "Select transaction type",
    originalText: isItalian ? "Testo Annuncio Originale *" : "Original Listing Text *",
    originalPlaceholder: isItalian ? "Incolla qui il tuo annuncio esistente che vuoi migliorare... (min 50 caratteri)" : "Paste your existing listing to improve... (min 50 characters)",
    chars: isItalian ? "caratteri" : "characters",
    propertyType: isItalian ? "Tipo Immobile *" : "Property Type *",
    propertyTypePlaceholder: isItalian ? "es. Appartamento" : "e.g. Apartment",
    location: isItalian ? "Località *" : "Location *",
    locationPlaceholder: isItalian ? "es. Milano Centro" : "e.g. Downtown",
    preferredTone: isItalian ? "Tono Preferito" : "Preferred Tone",
    selectTone: isItalian ? "Seleziona tono" : "Select tone",
    refining: isItalian ? "Raffinamento in corso..." : "Refining...",
    refineButton: isItalian ? "Perfeziona Annuncio" : "Perfect Listing",
    noResult: isItalian ? "Nessun annuncio raffinato" : "No refined listing",
    noResultDesc: isItalian ? 'Incolla il tuo annuncio esistente e clicca "Perfeziona" per generare 4 versioni migliorate: Professional, Emotional, Luxury e SEO.' : 'Paste your existing listing and click "Perfect" to generate 4 improved versions: Professional, Emotional, Luxury and SEO.',
    version: isItalian ? "Versione" : "Version",
    copyAll: isItalian ? "Copia Tutto" : "Copy All",
    improvedTitle: isItalian ? "Titolo Migliorato" : "Improved Title",
    improvedDesc: isItalian ? "Descrizione Migliorata" : "Improved Description",
    highlights5: isItalian ? "✨ 5 Highlights" : "✨ 5 Highlights",
    ctaImproved: isItalian ? "🎯 CTA Migliorata" : "🎯 Improved CTA",
    metaSeo: isItalian ? "Meta Description SEO" : "Meta Description SEO",
    originalAnalysis: isItalian ? "Analisi Annuncio Originale" : "Original Listing Analysis",
    highlightsHeading: isItalian ? "HIGHLIGHTS:" : "HIGHLIGHTS:",
    ctaHeading: isItalian ? "CTA:" : "CTA:",
    metaHeading: isItalian ? "META DESCRIPTION:" : "META DESCRIPTION:",
  };

  const tipoTransazioneOptions = isItalian
    ? [
        { value: "vendita", label: "Vendita", icon: "🏷️" },
        { value: "affitto", label: "Affitto", icon: "🔑" },
        { value: "affitto_breve", label: "Affitto Breve / Turistico", icon: "🏖️" },
      ]
    : [
        { value: "vendita", label: "Sale", icon: "🏷️" },
        { value: "affitto", label: "Rent", icon: "🔑" },
        { value: "affitto_breve", label: "Short-term / Vacation Rent", icon: "🏖️" },
      ];

  const refineTabs = isItalian
    ? [
        { id: "professional", label: "Professional", icon: Briefcase, description: "Autorevole e credibile", gradient: "from-blue-500 to-indigo-500" },
        { id: "emotional", label: "Emotional", icon: Heart, description: "Coinvolgente ed evocativo", gradient: "from-rose-500 to-pink-500" },
        { id: "luxury", label: "Luxury", icon: Crown, description: "Esclusivo e raffinato", gradient: "from-amber-500 to-yellow-500" },
        { id: "seo", label: "SEO Boosted", icon: Search, description: "Ottimizzato per Google", gradient: "from-emerald-500 to-teal-500" },
      ] as const
    : [
        { id: "professional", label: "Professional", icon: Briefcase, description: "Authoritative and credible", gradient: "from-blue-500 to-indigo-500" },
        { id: "emotional", label: "Emotional", icon: Heart, description: "Engaging and evocative", gradient: "from-rose-500 to-pink-500" },
        { id: "luxury", label: "Luxury", icon: Crown, description: "Exclusive and refined", gradient: "from-amber-500 to-yellow-500" },
        { id: "seo", label: "SEO Boosted", icon: Search, description: "Optimized for Google", gradient: "from-emerald-500 to-teal-500" },
      ] as const;

  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    originalText: "",
    propertyType: "",
    location: "",
    tone: "professional",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.originalText.trim() || formData.originalText.length < 50) {
      const v = validationToast(feedbackLocale, "refineListing", t.textTooShortDesc);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.propertyType.trim()) {
      const v = validationToast(feedbackLocale, "refineListing", t.propertyTypeRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.location.trim()) {
      const v = validationToast(feedbackLocale, "refineListing", t.locationRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<RefineListingResult>("/api/refine-listing", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        const fail = apiFailureToast(feedbackLocale, "refineListing", {
          status: res.status,
          error: res.error,
          message: res.message,
        }, t.refineError);
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      const data = res.data as RefineListingResult;
      setResult(data);
      setActiveTab("professional");
      toast({
        title: t.successTitle,
        description: data.cached ? t.cacheResult : t.ready4,
      });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "refineListing");
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: t.copied,
        description: t.copiedDesc,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, "refineListing", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const copyFullListing = (listing: RefinedListing, version: string) => {
    const fullText = `${listing.titolo}\n\n` +
      `${listing.descrizione}\n\n` +
      `✨ ${t.highlightsHeading}\n${listing.highlights.map(h => `• ${h}`).join('\n')}\n\n` +
      `🎯 ${t.ctaHeading} ${listing.cta}\n\n` +
      `📝 ${t.metaHeading}\n${listing.metaDescription}`;
    
    copyToClipboard(fullText, `full-${version}`);
  };

  const renderListingCard = (listing: RefinedListing, version: string) => {
    const tabInfo = refineTabs.find((tab) => tab.id === version) || refineTabs[0];
    const Icon = tabInfo.icon;
    
    return (
      <Card className="border-2 border-violet-200 dark:border-violet-800">
        <CardHeader className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Icon className="h-5 w-5" />
              {t.version} {tabInfo.label}
            </CardTitle>
            <Button
              onClick={() => copyFullListing(listing, version)}
              className={`bg-gradient-to-r ${tabInfo.gradient} hover:opacity-90 text-white`}
              data-testid={`button-copy-full-${version}`}
            >
              {copiedField === `full-${version}` ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {t.copyAll}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Wand2 className="h-3 w-3" /> {t.improvedTitle}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.titolo, `title-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-title-${version}`}
              >
                {copiedField === `title-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {listing.titolo}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" /> {t.improvedDesc}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.descrizione, `desc-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-desc-${version}`}
              >
                {copiedField === `desc-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {listing.descrizione}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                {t.highlights5}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.highlights.map(h => `• ${h}`).join('\n'), `highlights-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-highlights-${version}`}
              >
                {copiedField === `highlights-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <ul className="space-y-2">
              {listing.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${tabInfo.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                {t.ctaImproved}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.cta, `cta-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-cta-${version}`}
              >
                {copiedField === `cta-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className={`text-lg font-semibold bg-gradient-to-r ${tabInfo.gradient} bg-clip-text text-transparent`}>
              {listing.cta}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Search className="h-3 w-3" /> {t.metaSeo}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.metaDescription, `meta-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-meta-${version}`}
              >
                {copiedField === `meta-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-foreground">
                {listing.metaDescription}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {listing.metaDescription.length}/160 {t.chars}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  return (
    <DashboardPageShell className="max-w-6xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        aria-label={t.back}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs">
            ✨ Perfect Again AI
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-violet-200 dark:border-violet-800">
          <CardHeader className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-violet-600" />
              {t.listingToImprove}
            </CardTitle>
            <CardDescription>
              {t.listingToImproveDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t.listingType}</Label>
              <Select
                value={formData.tipoTransazione}
                onValueChange={(value) => handleInputChange("tipoTransazione", value)}
              >
                <SelectTrigger data-testid="select-tipo-transazione">
                  <SelectValue placeholder={t.selectTransaction} />
                </SelectTrigger>
                <SelectContent>
                  {tipoTransazioneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalText">{t.originalText}</Label>
              <Textarea
                id="originalText"
                placeholder={t.originalPlaceholder}
                value={formData.originalText}
                onChange={(e) => handleInputChange("originalText", e.target.value)}
                rows={8}
                className="resize-none"
                data-testid="input-original-text"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.originalText.length}/3000 {t.chars}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyType">{t.propertyType}</Label>
                <Input
                  id="propertyType"
                  placeholder={t.propertyTypePlaceholder}
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange("propertyType", e.target.value)}
                  data-testid="input-property-type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t.location}</Label>
                <Input
                  id="location"
                  placeholder={t.locationPlaceholder}
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  data-testid="input-location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">{t.preferredTone}</Label>
              <Select
                value={formData.tone}
                onValueChange={(value: FormData["tone"]) => 
                  handleInputChange("tone", value)
                }
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder={t.selectTone} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="emotional">💗 Emotional</SelectItem>
                  <SelectItem value="luxury">👑 Luxury</SelectItem>
                  <SelectItem value="seo">🔍 SEO Boosted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
              data-testid="button-refine-listing"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.refining}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.refineButton}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {t.noResult}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t.noResultDesc}
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="py-16 space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <Loader2 className="h-12 w-12 text-violet-500 animate-spin" />
                </div>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="h-4 bg-card/50 rounded w-full animate-pulse" />
                  <div className="h-4 bg-card/30 rounded w-5/6 mx-auto animate-pulse" />
                  <div className="h-4 bg-card/30 rounded w-4/6 mx-auto animate-pulse" />
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.analisiOriginale && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {t.originalAnalysis}
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {result.analisiOriginale}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
                  {refineTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-900/30"
                        data-testid={`tab-${tab.id}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{tab.description}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="professional" className="mt-4">
                  {renderListingCard(result.professional, "professional")}
                </TabsContent>
                <TabsContent value="emotional" className="mt-4">
                  {renderListingCard(result.emotional, "emotional")}
                </TabsContent>
                <TabsContent value="luxury" className="mt-4">
                  {renderListingCard(result.luxury, "luxury")}
                </TabsContent>
                <TabsContent value="seo" className="mt-4">
                  {renderListingCard(result.seo, "seo")}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
}
