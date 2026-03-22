"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import type {
  EmotionalListingTargetIconKey,
  EmotionalListingToneIconKey,
  EmotionalListingTxIconKey,
  EmotionalListingVariantId,
} from "@/lib/i18n/emotional-listing-page-ui";
import { emotionalListingVariantGradient } from "@/lib/i18n/emotional-listing-page-ui";
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
  Heart,
  Crown,
  Users,
  BookOpen,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Star,
  Quote,
  Tag,
  KeyRound,
  Palmtree,
  TrendingUp,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmotionalListing {
  titolo: string;
  aperturaEmozionale: string;
  testoSensoriale: string;
  descrizioneNarrativa: string;
  emotionalHighlights: string[];
  sezioneImmagina: string;
  ctaEmozionale: string;
}

interface EmotionalListingResult {
  storytelling: EmotionalListing;
  luxury: EmotionalListing;
  familyWarm: EmotionalListing;
  consiglioCreativo: string;
  cached?: boolean;
}

interface FormData {
  tipoTransazione: string;
  propertyType: string;
  location: string;
  features: string;
  strengths: string;
  price: string;
  targetBuyer: "famiglie" | "giovani" | "investitori" | "luxury";
  tone: "emozionale" | "luxury" | "caldo";
}

const TX_ICON: Record<EmotionalListingTxIconKey, LucideIcon> = {
  tag: Tag,
  keyRound: KeyRound,
  palmtree: Palmtree,
};

const TARGET_ICON: Record<EmotionalListingTargetIconKey, LucideIcon> = {
  users: Users,
  sparkles: Sparkles,
  trendingUp: TrendingUp,
  crown: Crown,
};

const TONE_ICON: Record<EmotionalListingToneIconKey, LucideIcon> = {
  heart: Heart,
  crown: Crown,
  home: Home,
};

const VARIANT_TAB_ICON: Record<EmotionalListingVariantId, LucideIcon> = {
  storytelling: BookOpen,
  luxury: Crown,
  familyWarm: Users,
};

export default function EmotionalListingPage() {
  const { locale } = useLocale();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const t = dash.emotionalListingPage;

  const listingTabs = useMemo(
    () =>
      t.variantTabs.map((tab) => ({
        ...tab,
        icon: VARIANT_TAB_ICON[tab.id],
        gradient: emotionalListingVariantGradient(tab.id),
      })),
    [t.variantTabs]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionalListingResult | null>(null);
  const [activeTab, setActiveTab] = useState("storytelling");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    propertyType: "",
    location: "",
    features: "",
    strengths: "",
    price: "",
    targetBuyer: "famiglie",
    tone: "emozionale",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.propertyType.trim() || formData.propertyType.length < 3) {
      const v = validationToast(feedbackLocale, "emotionalListing", t.propertyTypeRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.location.trim()) {
      const v = validationToast(feedbackLocale, "emotionalListing", t.locationRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.features.trim() || formData.features.length < 10) {
      const v = validationToast(feedbackLocale, "emotionalListing", t.featuresRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.strengths.trim() || formData.strengths.length < 10) {
      const v = validationToast(feedbackLocale, "emotionalListing", t.strengthsRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.price.trim()) {
      const v = validationToast(feedbackLocale, "emotionalListing", t.priceRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<EmotionalListingResult>("/api/generate-emotional-listing", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "emotionalListing",
          {
            status: res.status,
            error: res.error,
            message: res.message,
          },
          t.errorGeneric
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      const data = res.data as EmotionalListingResult;
      setResult(data);
      setActiveTab("storytelling");
      toast({ title: t.successTitle, description: data.cached ? t.successCached : t.successDesc });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "emotionalListing");
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
      toast({ title: t.copied, description: t.copiedDesc });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, "emotionalListing", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const copyFullListing = (listing: EmotionalListing, version: string) => {
    const fullText =
      `${listing.titolo}\n\n` +
      `${listing.aperturaEmozionale}\n\n` +
      `${listing.testoSensoriale}\n\n` +
      `${listing.descrizioneNarrativa}\n\n` +
      `${t.copyExportHighlightsTitle}:\n${listing.emotionalHighlights.map((h) => `• ${h}`).join("\n")}\n\n` +
      `${t.sectionImmagina}\n${listing.sezioneImmagina}\n\n` +
      `${listing.ctaEmozionale}`;

    copyToClipboard(fullText, `full-${version}`);
  };

  const renderListingCard = (listing: EmotionalListing, version: string) => {
    const tabInfo = listingTabs.find((tab) => tab.id === version) || listingTabs[0];
    const Icon = tabInfo.icon;

    return (
      <Card className="border-2 border-rose-200 dark:border-rose-800">
        <CardHeader className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Icon className="h-5 w-5" />
              {t.versionLabel} {tabInfo.label}
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
                <Star className="h-3 w-3" /> {t.sectionTitle}
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
            <h3 className="text-xl font-bold text-foreground">{listing.titolo}</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Heart className="h-3 w-3" /> {t.sectionApertura}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.aperturaEmozionale, `apertura-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-apertura-${version}`}
              >
                {copiedField === `apertura-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-4 rounded-lg border-l-4 border-rose-500">
              <p className="text-foreground italic font-medium">&quot;{listing.aperturaEmozionale}&quot;</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {t.sectionSensoriale}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.testoSensoriale, `sensoriale-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-sensoriale-${version}`}
              >
                {copiedField === `sensoriale-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">{listing.testoSensoriale}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> {t.sectionNarrativa}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.descrizioneNarrativa, `narrativa-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-narrativa-${version}`}
              >
                {copiedField === `narrativa-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-foreground leading-relaxed">{listing.descrizioneNarrativa}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" aria-hidden />
                {t.sectionHighlights}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(listing.emotionalHighlights.map((h) => `• ${h}`).join("\n"), `highlights-${version}`)
                }
                className="h-6 px-2"
                data-testid={`button-copy-highlights-${version}`}
              >
                {copiedField === `highlights-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <ul className="space-y-2">
              {listing.emotionalHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                  <span
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${tabInfo.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Quote className="h-3 w-3" aria-hidden />
                {t.sectionImmagina}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.sezioneImmagina, `immagina-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-immagina-${version}`}
              >
                {copiedField === `immagina-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10 p-4 rounded-lg border`}>
              <div className="flex items-start gap-2">
                <Quote className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" aria-hidden />
                <p className="text-foreground italic">{listing.sezioneImmagina}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Heart className="h-3 w-3" aria-hidden />
                {t.sectionCta}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.ctaEmozionale, `cta-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-cta-${version}`}
              >
                {copiedField === `cta-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className={`text-lg font-semibold bg-gradient-to-r ${tabInfo.gradient} bg-clip-text text-transparent`}>
              {listing.ctaEmozionale}
            </p>
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
        aria-label={t.backToDashboard}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90">
            <Heart className="h-3.5 w-3.5 text-rose-400 shrink-0" aria-hidden />
            {t.heroBadge}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-rose-200 dark:border-rose-800">
          <CardHeader className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-600" />
              {t.formTitle}
            </CardTitle>
            <CardDescription>{t.formSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t.listingType}</Label>
              <Select value={formData.tipoTransazione} onValueChange={(value) => handleInputChange("tipoTransazione", value)}>
                <SelectTrigger data-testid="select-tipo-transazione">
                  <SelectValue placeholder={t.selectTransaction} />
                </SelectTrigger>
                <SelectContent>
                  {t.transactionOptions.map((option) => {
                    const TxIcon = TX_ICON[option.iconKey];
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
              <Label htmlFor="propertyType">{t.propertyTypeLabel}</Label>
              <Input
                id="propertyType"
                placeholder={t.propertyTypePlaceholder}
                value={formData.propertyType}
                onChange={(e) => handleInputChange("propertyType", e.target.value)}
                data-testid="input-property-type"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="location">{t.locationLabel}</Label>
                <Input
                  id="location"
                  placeholder={t.locationPlaceholder}
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  data-testid="input-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t.priceLabel}</Label>
                <Input
                  id="price"
                  placeholder={t.pricePlaceholder}
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  data-testid="input-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">{t.featuresLabel}</Label>
              <Textarea
                id="features"
                placeholder={t.featuresPlaceholder}
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows={3}
                data-testid="input-features"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">{t.strengthsLabel}</Label>
              <Textarea
                id="strengths"
                placeholder={t.strengthsPlaceholder}
                value={formData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                rows={2}
                data-testid="input-strengths"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="targetBuyer">{t.targetLabel}</Label>
                <Select
                  value={formData.targetBuyer}
                  onValueChange={(value: FormData["targetBuyer"]) => handleInputChange("targetBuyer", value)}
                >
                  <SelectTrigger data-testid="select-target">
                    <SelectValue placeholder={t.selectTarget} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.targetOptions.map((opt) => {
                      const TargetIcon = TARGET_ICON[opt.iconKey];
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="flex items-center gap-2">
                            <TargetIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                            {opt.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">{t.toneLabel}</Label>
                <Select value={formData.tone} onValueChange={(value: FormData["tone"]) => handleInputChange("tone", value)}>
                  <SelectTrigger data-testid="select-tone">
                    <SelectValue placeholder={t.selectTone} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.toneOptions.map((opt) => {
                      const ToneIcon = TONE_ICON[opt.iconKey];
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="flex items-center gap-2">
                            <ToneIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                            {opt.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              data-testid="button-generate-emotional"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.generateLoading}
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  {t.generateIdle}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" aria-hidden />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.emptyTitle}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{t.emptySubtitle}</p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" aria-hidden />
                <h3 className="text-lg font-medium mb-2">{t.loadingTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.loadingSubtitle}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioCreativo && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">{t.creativeTip}</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">{result.consiglioCreativo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 gap-1 h-auto p-1">
                  {listingTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30"
                        data-testid={`tab-${tab.id}`}
                      >
                        <TabIcon className="h-5 w-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{tab.description}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="storytelling" className="mt-4">
                  {renderListingCard(result.storytelling, "storytelling")}
                </TabsContent>
                <TabsContent value="luxury" className="mt-4">
                  {renderListingCard(result.luxury, "luxury")}
                </TabsContent>
                <TabsContent value="familyWarm" className="mt-4">
                  {renderListingCard(result.familyWarm, "familyWarm")}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
}
