"use client";

import { useMemo, useState } from "react";
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
import { getTranslation } from "@/lib/i18n/dictionary";
import type { RefineListingToneIconKey, RefineListingTxIconKey } from "@/lib/i18n/refine-listing-page-ui";
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
  FileText,
  Tag,
  KeyRound,
  Palmtree,
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

const REFINE_TX_ICON: Record<RefineListingTxIconKey, typeof Tag> = {
  tag: Tag,
  keyRound: KeyRound,
  palmtree: Palmtree,
};

const REFINE_TONE_ICON: Record<RefineListingToneIconKey, typeof Briefcase> = {
  briefcase: Briefcase,
  heart: Heart,
  crown: Crown,
  search: Search,
};

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

  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const t = dash.refineListingPage;

  const refineTabs = useMemo(
    () =>
      [
        {
          id: "professional" as const,
          label: t.refineTabs[0].label,
          icon: Briefcase,
          description: t.refineTabs[0].description,
          gradient: "from-blue-500 to-indigo-500",
        },
        {
          id: "emotional" as const,
          label: t.refineTabs[1].label,
          icon: Heart,
          description: t.refineTabs[1].description,
          gradient: "from-rose-500 to-pink-500",
        },
        {
          id: "luxury" as const,
          label: t.refineTabs[2].label,
          icon: Crown,
          description: t.refineTabs[2].description,
          gradient: "from-amber-500 to-yellow-500",
        },
        {
          id: "seo" as const,
          label: t.refineTabs[3].label,
          icon: Search,
          description: t.refineTabs[3].description,
          gradient: "from-emerald-500 to-teal-500",
        },
      ] as const,
    [t.refineTabs]
  );

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
      `${t.highlightsHeading}\n${listing.highlights.map(h => `• ${h}`).join('\n')}\n\n` +
      `${t.ctaHeading} ${listing.cta}\n\n` +
      `${t.metaHeading}\n${listing.metaDescription}`;
    
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
      ? dash.planAgency
      : usage.plan === "pro"
        ? dash.planPro
        : usage.plan === "starter"
          ? dash.planStarter
          : dash.planFree;

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
          <Badge className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.heroBadge}
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
                  {t.transactionOptions.map((option) => {
                    const TxIcon = REFINE_TX_ICON[option.iconKey];
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
                  {t.toneSelectItems.map((item) => {
                    const ToneIcon = REFINE_TONE_ICON[item.iconKey];
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        <span className="flex items-center gap-2">
                          <ToneIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                          <span>{item.label}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
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
