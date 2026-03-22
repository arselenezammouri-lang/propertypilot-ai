"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
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
  Hash, 
  Zap,
  Target,
  MapPin, 
  Globe,
  Copy, 
  Check, 
  Loader2,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Tag,
  KeyRound,
  Palmtree,
} from "lucide-react";
import Link from "next/link";

interface HashtagResult {
  virali: string[];
  nicchia: string[];
  localSeo: string[];
  usa: string[];
  consiglioStrategico: string;
  mixA: string[];
  mixB: string[];
  mixC: string[];
  cached?: boolean;
}

interface FormData {
  tipoTransazione: string;
  propertyType: string;
  location: string;
  strengths: string;
  price: string;
  tone: "professionale" | "emozionale" | "luxury" | "virale";
  market: "italy" | "usa";
}


export default function HashtagsPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const feedbackLocale = isItalian ? "it" : "en";
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const tt = dash.transactionTypes;
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const t = dash.hashtagsPage;

  const tipoTransazioneOptions = useMemo(
    () =>
      [
        { value: "vendita" as const, label: tt.vendita, Icon: Tag },
        { value: "affitto" as const, label: tt.affitto, Icon: KeyRound },
        { value: "affitto_breve" as const, label: tt.affitto_breve, Icon: Palmtree },
      ] as const,
    [tt]
  );

  const hashtagTabs = useMemo(
    () =>
      [
        { id: "virali" as const, label: t.tabVirali, icon: TrendingUp, description: t.tabViraliDesc, color: "from-pink-500 to-rose-500" },
        { id: "nicchia" as const, label: t.tabNicchia, icon: Target, description: t.tabNicchiaDesc, color: "from-purple-500 to-indigo-500" },
        { id: "localSeo" as const, label: t.tabLocalSeo, icon: MapPin, description: t.tabLocalSeoDesc, color: "from-green-500 to-emerald-500" },
        { id: "usa" as const, label: t.tabUsa, icon: Globe, description: t.tabUsaDesc, color: "from-blue-500 to-cyan-500" },
      ] as const,
    [t]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HashtagResult | null>(null);
  const [activeTab, setActiveTab] = useState("virali");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    propertyType: "",
    location: "",
    strengths: "",
    price: "",
    tone: "professionale",
    market: "italy",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.propertyType.trim() || formData.propertyType.length < 3) {
      const v = validationToast(feedbackLocale, "hashtagGenerator", t.propertyTypeRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.location.trim()) {
      const v = validationToast(feedbackLocale, "hashtagGenerator", t.locationRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.strengths.trim() || formData.strengths.length < 10) {
      const v = validationToast(feedbackLocale, "hashtagGenerator", t.strengthsRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    if (!formData.price.trim()) {
      const v = validationToast(feedbackLocale, "hashtagGenerator", t.priceRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<HashtagResult>("/api/generate-hashtags", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        const fail = apiFailureToast(feedbackLocale, "hashtagGenerator", {
          status: res.status,
          error: res.error,
          message: res.message,
        }, t.errorGeneric);
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      const data = res.data as HashtagResult;
      setResult(data);
      setActiveTab("virali");
      toast({ title: t.successTitle, description: data.cached ? t.successCached : t.successDesc });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "hashtagGenerator");
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
      const c = clipboardFailureToast(feedbackLocale, "hashtagGenerator", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const hashtagCardTitle = (count: number, category: string) => {
    const tpl =
      category === "virali"
        ? t.hashtagTitleVirali
        : category === "nicchia"
          ? t.hashtagTitleNicchia
          : category === "localSeo"
            ? t.hashtagTitleLocalSeo
            : t.hashtagTitleUsa;
    return tpl.replace("{count}", String(count));
  };

  const renderHashtagList = (hashtags: string[], category: string, gradient: string) => {
    const hashtagText = hashtags.join(' ');
    
    return (
      <Card className="border-2 border-opacity-50" style={{ borderColor: `var(--${category}-border, #e5e7eb)` }}>
        <CardHeader className={`bg-gradient-to-r ${gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                {hashtagCardTitle(hashtags.length, category)}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t.clickToCopy}
              </CardDescription>
            </div>
            <Button
              onClick={() => copyToClipboard(hashtagText, category)}
              className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white`}
              data-testid={`button-copy-${category}`}
            >
              {copiedField === category ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {t.copyAll}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-sm py-1.5 px-3 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => copyToClipboard(tag, `${category}-${idx}`)}
                data-testid={`hashtag-${category}-${idx}`}
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
                {copiedField === `${category}-${idx}` && <Check className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMixCard = (mix: string[], mixName: string, description: string, gradient: string) => {
    const hashtagText = mix.join(' ');
    
    return (
      <Card className="border border-muted">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                {mixName}
              </div>
              <div>
                <CardTitle className="text-base">
                  {t.mixTitleTemplate.replace("{label}", mixName)}
                </CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(hashtagText, `mix${mixName}`)}
              data-testid={`button-copy-mix-${mixName}`}
            >
              {copiedField === `mix${mixName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground break-words">
            {hashtagText}
          </p>
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
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        {t.backToDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <Badge className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
            <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.heroBadge}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              {t.formTitle}
            </CardTitle>
            <CardDescription>
              {t.formSubtitle}
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
                  {tipoTransazioneOptions.map((option) => {
                    const TxIcon = option.Icon;
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
              <Label htmlFor="strengths">{t.strengthsLabel}</Label>
              <Textarea
                id="strengths"
                placeholder={t.strengthsPlaceholder}
                value={formData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                rows={3}
                data-testid="input-strengths"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tone">{t.toneLabel}</Label>
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
                    <SelectItem value="professionale">{t.toneProfessionale}</SelectItem>
                    <SelectItem value="emozionale">{t.toneEmozionale}</SelectItem>
                    <SelectItem value="luxury">{t.toneLuxury}</SelectItem>
                    <SelectItem value="virale">{t.toneVirale}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="market">{t.marketLabel}</Label>
                <Select
                  value={formData.market}
                  onValueChange={(value: FormData["market"]) => 
                    handleInputChange("market", value)
                  }
                >
                  <SelectTrigger data-testid="select-market">
                    <SelectValue placeholder={t.selectMarket} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italy">{t.marketItaly}</SelectItem>
                    <SelectItem value="usa">{t.marketUsa}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              data-testid="button-generate-hashtags"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.generateLoading}
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
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
                <Hash className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {t.emptyTitle}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t.emptySubtitle}
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.loadingTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.loadingSubtitle}
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioStrategico && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {t.strategicTip}
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {result.consiglioStrategico}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
                  {hashtagTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isDisabled = tab.id === 'usa' && formData.market !== 'usa';
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        disabled={isDisabled}
                        className={`flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900/30 ${isDisabled ? 'opacity-50' : ''}`}
                        data-testid={`tab-${tab.id}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="virali" className="mt-4">
                  {renderHashtagList(result.virali, 'virali', 'from-pink-500 to-rose-500')}
                </TabsContent>
                <TabsContent value="nicchia" className="mt-4">
                  {renderHashtagList(result.nicchia, 'nicchia', 'from-purple-500 to-indigo-500')}
                </TabsContent>
                <TabsContent value="localSeo" className="mt-4">
                  {renderHashtagList(result.localSeo, 'localSeo', 'from-green-500 to-emerald-500')}
                </TabsContent>
                <TabsContent value="usa" className="mt-4">
                  {formData.market === 'usa' ? (
                    renderHashtagList(result.usa, 'usa', 'from-blue-500 to-cyan-500')
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                        <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {t.usaMarketMsg}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {t.readyMixes}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderMixCard(result.mixA, 'A', t.viralFocus, 'from-pink-500 to-rose-500')}
                  {renderMixCard(result.mixB, 'B', t.balanced, 'from-purple-500 to-indigo-500')}
                  {renderMixCard(result.mixC, 'C', t.localFocus, 'from-green-500 to-emerald-500')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
}
