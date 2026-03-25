"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import type { AgentBioMercatoUi, AgentBioTonoUi } from "@/lib/i18n/agent-bio-page-ui";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  ArrowLeft,
  Briefcase,
  Heart,
  Crown,
  Instagram,
  Globe,
  User,
  Building2,
  MapPin,
  Award,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

interface BioVariant {
  fraseApertura: string;
  bio: string;
  skillsPuntiForza: string[];
  approccioVendita: string;
  cta: string;
  seoVersion?: string;
}

interface AgentBioResult {
  professionale: BioVariant;
  emotiva: BioVariant;
  luxury: BioVariant;
  social: BioVariant;
  website: BioVariant;
  consiglioPersonalBranding: string;
  cached?: boolean;
}

interface FormData {
  nomeAgente: string;
  nomeAgenzia: string;
  anniEsperienza: number;
  specializzazioni: string;
  zonaOperativa: string;
  certificazioniPremi: string;
  tono: "professionale" | "amichevole" | "luxury";
  mercato: "italia" | "usa" | "internazionale";
}

type BioVariantKey = "professionale" | "emotiva" | "luxury" | "social" | "website";

const TONE_ICON_MAP: Record<AgentBioTonoUi, typeof Briefcase> = {
  professionale: Briefcase,
  amichevole: Heart,
  luxury: Crown,
};

export default function AgentBioPage() {
  const { locale } = useLocaleContext();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const t = dash.agentBioPage;
  const [formData, setFormData] = useState<FormData>({
    nomeAgente: "",
    nomeAgenzia: "",
    anniEsperienza: 5,
    specializzazioni: "",
    zonaOperativa: "",
    certificazioniPremi: "",
    tono: "professionale",
    mercato: "italia",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentBioResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("professionale");
  const { toast } = useToast();

  const toniOptions = useMemo(
    () =>
      t.toneOptions.map((o) => ({
        ...o,
        icon: TONE_ICON_MAP[o.value],
      })),
    [t]
  );

  const handleSubmit = async () => {
    if (!formData.nomeAgente.trim()) {
      const v = validationToast(feedbackLocale, "agentBio", t.agentNameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.nomeAgenzia.trim()) {
      const v = validationToast(feedbackLocale, "agentBio", t.agencyNameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.specializzazioni.trim()) {
      const v = validationToast(feedbackLocale, "agentBio", t.specializationRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.zonaOperativa.trim()) {
      const v = validationToast(feedbackLocale, "agentBio", t.areaRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<AgentBioResult>("/api/generate-agent-bio", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "agentBio",
          { status: res.status, error: res.error, message: res.message },
          t.generateError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      const data = res.data as AgentBioResult;
      setResult(data);
      setActiveTab("professionale");
      toast({
        title: t.bioSuccess,
        description: data.cached ? t.cacheResult : t.readyVariants,
      });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "agentBio");
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
        description: t.copiedText,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, "agentBio", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const copyFullBio = async (variant: BioVariant, variantKey: BioVariantKey) => {
    const fullText = `${variant.fraseApertura}\n\n${variant.bio}\n\n${variant.skillsPuntiForza.map(s => `• ${s}`).join('\n')}\n\n${variant.approccioVendita}\n\n${variant.cta}${variant.seoVersion ? `\n\n---\n${t.seoCopyPrefix} ${variant.seoVersion}` : ''}`;
    copyToClipboard(fullText, `full-${variantKey}`);
  };

  const getVariantIcon = (variant: BioVariantKey) => {
    switch (variant) {
      case "professionale": return <Briefcase className="h-4 w-4" />;
      case "emotiva": return <Heart className="h-4 w-4" />;
      case "luxury": return <Crown className="h-4 w-4" />;
      case "social": return <Instagram className="h-4 w-4" />;
      case "website": return <Globe className="h-4 w-4" />;
    }
  };

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "professionale": return "indigo";
      case "emotiva": return "rose";
      case "luxury": return "amber";
      case "social": return "purple";
      case "website": return "cyan";
      default: return "gray";
    }
  };

  const renderVariantCard = (variant: BioVariant, variantKey: BioVariantKey, icon: JSX.Element, color: string) => (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100/50 dark:from-${color}-900/20 dark:to-${color}-800/10`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg capitalize">
            {icon}
            {t.bioCardTitlePrefix} {t.variantDisplayName[variantKey]}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyFullBio(variant, variantKey)}
            className="flex items-center gap-1"
            data-testid={`button-copy-full-${variantKey}`}
          >
            {copiedField === `full-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {t.copyAll}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">{t.opening}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.fraseApertura, `apertura-${variantKey}`)}
              className="h-6 px-2"
              data-testid={`button-copy-apertura-${variantKey}`}
            >
              {copiedField === `apertura-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className={`text-lg font-semibold text-${color}-700 dark:text-${color}-300 italic`}>
            "{variant.fraseApertura}"
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">{t.fullBio}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.bio, `bio-${variantKey}`)}
              className="h-6 px-2"
              data-testid={`button-copy-bio-${variantKey}`}
            >
              {copiedField === `bio-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {variant.bio}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">{t.skills}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.skillsPuntiForza.map(s => `• ${s}`).join('\n'), `skills-${variantKey}`)}
              className="h-6 px-2"
              data-testid={`button-copy-skills-${variantKey}`}
            >
              {copiedField === `skills-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <ul className="space-y-1">
            {variant.skillsPuntiForza.map((skill, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`text-${color}-500 mt-1`}>•</span>
                <span className="text-muted-foreground">{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">{t.salesApproach}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.approccioVendita, `approccio-${variantKey}`)}
              className="h-6 px-2"
              data-testid={`button-copy-approccio-${variantKey}`}
            >
              {copiedField === `approccio-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className="text-muted-foreground italic">
            {variant.approccioVendita}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">{t.ctaLabel}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.cta, `cta-${variantKey}`)}
              className="h-6 px-2"
              data-testid={`button-copy-cta-${variantKey}`}
            >
              {copiedField === `cta-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className={`font-medium text-${color}-600 dark:text-${color}-400`}>
            {variant.cta}
          </p>
        </div>

        {variant.seoVersion && (
          <div className={`space-y-2 p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800`}>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">{t.seoVersionLabel}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(variant.seoVersion!, `seo-${variantKey}`)}
                className="h-6 px-2"
                data-testid={`button-copy-seo-${variantKey}`}
              >
                {copiedField === `seo-${variantKey}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {variant.seoVersion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
        data-testid="button-back"
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
        contextualHelp={<ContextualHelpTrigger docSlug="smart-briefing/briefing-guide" />}
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90">
            <Sparkles className="h-3.5 w-3.5 text-sunset-gold shrink-0" aria-hidden />
            {t.heroBadge}
          </span>
        }
      />

      <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-500/10">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  {t.agentData}
                </CardTitle>
                <CardDescription>
                  {t.agentDataDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeAgente" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      {t.agentName} *
                    </Label>
                    <Input
                      id="nomeAgente"
                      value={formData.nomeAgente}
                      onChange={(e) => setFormData({ ...formData, nomeAgente: e.target.value })}
                      placeholder={t.agentNamePlaceholder}
                      data-testid="input-nome-agente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeAgenzia" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      {t.agencyName} *
                    </Label>
                    <Input
                      id="nomeAgenzia"
                      value={formData.nomeAgenzia}
                      onChange={(e) => setFormData({ ...formData, nomeAgenzia: e.target.value })}
                      placeholder={t.agencyNamePlaceholder}
                      data-testid="input-nome-agenzia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="anniEsperienza">{t.experienceYears}</Label>
                    <Input
                      id="anniEsperienza"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.anniEsperienza}
                      onChange={(e) => setFormData({ ...formData, anniEsperienza: parseInt(e.target.value) || 0 })}
                      data-testid="input-anni-esperienza"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zonaOperativa" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {t.serviceArea} *
                    </Label>
                    <Input
                      id="zonaOperativa"
                      value={formData.zonaOperativa}
                      onChange={(e) => setFormData({ ...formData, zonaOperativa: e.target.value })}
                      placeholder={t.serviceAreaPlaceholder}
                      data-testid="input-zona-operativa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializzazioni">{t.specializations} *</Label>
                  <Textarea
                    id="specializzazioni"
                    value={formData.specializzazioni}
                    onChange={(e) => setFormData({ ...formData, specializzazioni: e.target.value })}
                    placeholder={t.specializationsPlaceholder}
                    rows={2}
                    data-testid="input-specializzazioni"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificazioniPremi" className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    {t.certifications}
                  </Label>
                  <Textarea
                    id="certificazioniPremi"
                    value={formData.certificazioniPremi}
                    onChange={(e) => setFormData({ ...formData, certificazioniPremi: e.target.value })}
                    placeholder={t.certificationsPlaceholder}
                    rows={2}
                    data-testid="input-certificazioni"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.tone}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {toniOptions.map((tono) => {
                      const Icon = tono.icon;
                      return (
                        <button
                          key={tono.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, tono: tono.value as FormData["tono"] })
                          }
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            formData.tono === tono.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                          }`}
                          data-testid={`button-tono-${tono.value}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`h-4 w-4 ${formData.tono === tono.value ? "text-blue-500" : "text-gray-500"}`} />
                            <span className="font-medium text-sm">{tono.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{tono.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t.targetMarket}</Label>
                  <Select
                    value={formData.mercato}
                    onValueChange={(value) =>
                      setFormData({ ...formData, mercato: value as AgentBioMercatoUi })
                    }
                  >
                    <SelectTrigger data-testid="select-mercato">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {t.marketOptions.map((mercato) => (
                        <SelectItem key={mercato.value} value={mercato.value}>
                          <span className="flex items-center gap-2">
                            {mercato.label} — {mercato.description}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">{t.premiumIncluded}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.premiumIncludedDesc}
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  size="lg"
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t.generate5}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <User className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t.readyCreate}</h3>
                  <p className="text-muted-foreground max-w-md">
                    {t.readyCreateDesc}
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-muted-foreground">{t.generating5}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t.waitTime}</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {result.consiglioPersonalBranding && (
                  <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        {t.brandingTip}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">{result.consiglioPersonalBranding}</p>
                    </CardContent>
                  </Card>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1" data-testid="tabs-variants">
                    <TabsTrigger value="professionale" className="flex flex-col gap-1 py-2 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/30">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-xs">{t.tabPro}</span>
                    </TabsTrigger>
                    <TabsTrigger value="emotiva" className="flex flex-col gap-1 py-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{t.tabEmotional}</span>
                    </TabsTrigger>
                    <TabsTrigger value="luxury" className="flex flex-col gap-1 py-2 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30">
                      <Crown className="h-4 w-4" />
                      <span className="text-xs">{t.tabLuxury}</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex flex-col gap-1 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30">
                      <Instagram className="h-4 w-4" />
                      <span className="text-xs">{t.tabSocial}</span>
                    </TabsTrigger>
                    <TabsTrigger value="website" className="flex flex-col gap-1 py-2 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-900/30">
                      <Globe className="h-4 w-4" />
                      <span className="text-xs">{t.tabWebsite}</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="professionale">
                      {renderVariantCard(result.professionale, 'professionale', getVariantIcon('professionale'), 'indigo')}
                    </TabsContent>
                    <TabsContent value="emotiva">
                      {renderVariantCard(result.emotiva, 'emotiva', getVariantIcon('emotiva'), 'rose')}
                    </TabsContent>
                    <TabsContent value="luxury">
                      {renderVariantCard(result.luxury, 'luxury', getVariantIcon('luxury'), 'amber')}
                    </TabsContent>
                    <TabsContent value="social">
                      {renderVariantCard(result.social, 'social', getVariantIcon('social'), 'purple')}
                    </TabsContent>
                    <TabsContent value="website">
                      {renderVariantCard(result.website, 'website', getVariantIcon('website'), 'cyan')}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </div>
    </DashboardPageShell>
  );
}
