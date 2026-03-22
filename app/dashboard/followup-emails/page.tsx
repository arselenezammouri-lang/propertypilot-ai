"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import type { FollowupEmailTabId, FollowupEmailTone } from "@/lib/i18n/followup-emails-page-ui";
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
  Mail,
  Clock,
  Calendar,
  Crown,
  Eye,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  Lightbulb,
  Zap,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmailVariant {
  oggetto: string;
  testoEmail: string;
  cta: string;
  ps?: string;
  versioneBreve: string;
  versioneLunga: string;
}

interface FollowUpResult {
  immediateResponse: EmailVariant;
  followUp24h: EmailVariant;
  followUp72h: EmailVariant;
  appointmentScheduling: EmailVariant;
  postVisit: EmailVariant;
  luxuryLeadFollowUp: EmailVariant;
  consiglioConversione: string;
  cached?: boolean;
}

interface FormData {
  leadName: string;
  agentName: string;
  agencyName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  reasonOfInterest: string;
  tone: FollowupEmailTone;
}

interface FollowUpEmailsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const FOLLOWUP_TAB_ICON: Record<FollowupEmailTabId, LucideIcon> = {
  immediateResponse: Zap,
  followUp24h: Clock,
  followUp72h: Clock,
  appointmentScheduling: Calendar,
  postVisit: Eye,
  luxuryLeadFollowUp: Crown,
};

export default function FollowUpEmailsPage({ searchParams }: FollowUpEmailsPageProps) {
  const { locale } = useLocaleContext();
  const feedbackLocale = locale;
  const usage = useUsageLimits();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FollowUpResult | null>(null);
  const [activeTab, setActiveTab] = useState("immediateResponse");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showLongVersion, setShowLongVersion] = useState(false);
  const { handleAPIError } = useAPIErrorHandler();
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const t = dash.followupEmailsPage;

  const emailTypes = useMemo(
    () =>
      t.emailTypes.map((e) => ({
        ...e,
        icon: FOLLOWUP_TAB_ICON[e.id],
      })),
    [t.emailTypes]
  );

  const [formData, setFormData] = useState<FormData>({
    leadName: "",
    agentName: "",
    agencyName: "",
    propertyTitle: "",
    propertyLocation: "",
    propertyPrice: "",
    reasonOfInterest: "",
    tone: "professionale",
  });

  useEffect(() => {
    if (!searchParams) return;

    const getParam = (key: string) => {
      const value = searchParams[key];
      return Array.isArray(value) ? value[0] : value || "";
    };

    setFormData((prev) => ({
      ...prev,
      leadName: getParam("leadName") || prev.leadName,
      propertyTitle: getParam("propertyTitle") || prev.propertyTitle,
      propertyLocation: getParam("propertyLocation") || prev.propertyLocation,
      propertyPrice: getParam("propertyPrice") || prev.propertyPrice,
    }));
  }, [searchParams]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.leadName.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.leadNameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.agentName.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.agentNameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.agencyName.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.agencyNameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.propertyTitle.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.propertyTitleRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.propertyLocation.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.propertyLocationRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.propertyPrice.trim()) {
      const v = validationToast(feedbackLocale, "followupEmails", t.propertyPriceRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    if (!formData.reasonOfInterest.trim() || formData.reasonOfInterest.length < 10) {
      const v = validationToast(feedbackLocale, "followupEmails", t.reasonRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<FollowUpResult>("/api/generate-followup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "followupEmails",
          { status: res.status, error: res.error, message: res.message },
          t.generateError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }

      const data = res.data as FollowUpResult;
      setResult(data);
      setActiveTab("immediateResponse");
      toast({
        title: t.success,
        description: data.cached ? t.cacheResult : t.ready6,
      });
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "followupEmails");
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
      const c = clipboardFailureToast(feedbackLocale, "followupEmails", t.copyFailed);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const copyFullEmail = async (email: EmailVariant, emailType: string) => {
    const version = showLongVersion ? email.versioneLunga : email.testoEmail;
    const fullText = `${t.subjectLabel}: ${email.oggetto}\n\n${version}\n\n${email.cta}${email.ps ? `\n\n${t.psLabel} ${email.ps}` : ""}`;
    copyToClipboard(fullText, `full-${emailType}`);
  };

  const getEmailTypeInfo = (type: string) => {
    return emailTypes.find((e) => e.id === type) || emailTypes[0];
  };

  const renderEmailCard = (email: EmailVariant, emailType: string) => {
    const typeInfo = getEmailTypeInfo(emailType);
    const Icon = typeInfo.icon;

    return (
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-5 w-5 text-orange-600" />
              {typeInfo.label}
              <Badge variant="outline" className="ml-2 text-xs">
                {typeInfo.description}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLongVersion(!showLongVersion)}
                className="text-xs"
                data-testid={`button-toggle-version-${emailType}`}
              >
                {showLongVersion ? t.standardVersion : t.longVersion}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => copyFullEmail(email, emailType)}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700"
                data-testid={`button-copy-full-${emailType}`}
              >
                {copiedField === `full-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {t.copyEmail}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {t.subjectLabel}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(email.oggetto, `oggetto-${emailType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-oggetto-${emailType}`}
              >
                {copiedField === `oggetto-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">{email.oggetto}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                {showLongVersion ? t.emailTextLong : t.emailText}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(showLongVersion ? email.versioneLunga : email.testoEmail, `testo-${emailType}`)
                }
                className="h-6 px-2"
                data-testid={`button-copy-testo-${emailType}`}
              >
                {copiedField === `testo-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {showLongVersion ? email.versioneLunga : email.testoEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-muted-foreground">{t.ctaLabel}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(email.cta, `cta-${emailType}`)}
                  className="h-6 px-2"
                  data-testid={`button-copy-cta-${emailType}`}
                >
                  {copiedField === `cta-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                {email.cta}
              </p>
            </div>

            {email.ps && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">{t.psLabel}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(email.ps!, `ps-${emailType}`)}
                    className="h-6 px-2"
                    data-testid={`button-copy-ps-${emailType}`}
                  >
                    {copiedField === `ps-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-sm italic text-muted-foreground bg-muted/30 p-2 rounded">
                  {t.psLabel} {email.ps}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> {t.shortVersion}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(email.versioneBreve, `breve-${emailType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-breve-${emailType}`}
              >
                {copiedField === `breve-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              {email.versioneBreve}
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
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs">
            {t.heroBadge}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              {t.formCardTitle}
            </CardTitle>
            <CardDescription>{t.formCardDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="leadName">{t.leadName}</Label>
              <Input
                id="leadName"
                placeholder={t.leadNamePlaceholder}
                value={formData.leadName}
                onChange={(e) => handleInputChange("leadName", e.target.value)}
                data-testid="input-lead-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentName">{t.agentName}</Label>
              <Input
                id="agentName"
                placeholder={t.agentNamePlaceholder}
                value={formData.agentName}
                onChange={(e) => handleInputChange("agentName", e.target.value)}
                data-testid="input-agent-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">{t.agencyName}</Label>
              <Input
                id="agencyName"
                placeholder={t.agencyNamePlaceholder}
                value={formData.agencyName}
                onChange={(e) => handleInputChange("agencyName", e.target.value)}
                data-testid="input-agency-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyTitle">{t.propertyTitle}</Label>
              <Input
                id="propertyTitle"
                placeholder={t.propertyTitlePlaceholder}
                value={formData.propertyTitle}
                onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
                data-testid="input-property-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyLocation">{t.propertyLocation}</Label>
                <Input
                  id="propertyLocation"
                  placeholder={t.propertyLocationPlaceholder}
                  value={formData.propertyLocation}
                  onChange={(e) => handleInputChange("propertyLocation", e.target.value)}
                  data-testid="input-property-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">{t.propertyPrice}</Label>
                <Input
                  id="propertyPrice"
                  placeholder={t.propertyPricePlaceholder}
                  value={formData.propertyPrice}
                  onChange={(e) => handleInputChange("propertyPrice", e.target.value)}
                  data-testid="input-property-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasonOfInterest">{t.reasonInterest}</Label>
              <Textarea
                id="reasonOfInterest"
                placeholder={t.reasonPlaceholder}
                value={formData.reasonOfInterest}
                onChange={(e) => handleInputChange("reasonOfInterest", e.target.value)}
                rows={3}
                data-testid="input-reason-of-interest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">{t.tone}</Label>
              <Select
                value={formData.tone}
                onValueChange={(value: FollowupEmailTone) => handleInputChange("tone", value)}
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder={t.selectTone} />
                </SelectTrigger>
                <SelectContent>
                  {t.toneOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              data-testid="button-generate-emails"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.generate6}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Mail className="h-16 w-16 text-muted-foreground/50 mb-4" aria-hidden />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.noResultTitle}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{t.readyDesc}</p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" aria-hidden />
                <h3 className="text-lg font-medium mb-2">{t.generatingTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.generatingDesc}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioConversione && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">{t.convertTip}</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">{result.consiglioConversione}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
                  {emailTypes.map((type) => {
                    const TabIcon = type.icon;
                    return (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/30"
                        data-testid={`tab-${type.id}`}
                      >
                        <TabIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">{type.label.split(" ")[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="immediateResponse" className="mt-4">
                  {renderEmailCard(result.immediateResponse, "immediateResponse")}
                </TabsContent>
                <TabsContent value="followUp24h" className="mt-4">
                  {renderEmailCard(result.followUp24h, "followUp24h")}
                </TabsContent>
                <TabsContent value="followUp72h" className="mt-4">
                  {renderEmailCard(result.followUp72h, "followUp72h")}
                </TabsContent>
                <TabsContent value="appointmentScheduling" className="mt-4">
                  {renderEmailCard(result.appointmentScheduling, "appointmentScheduling")}
                </TabsContent>
                <TabsContent value="postVisit" className="mt-4">
                  {renderEmailCard(result.postVisit, "postVisit")}
                </TabsContent>
                <TabsContent value="luxuryLeadFollowUp" className="mt-4">
                  {renderEmailCard(result.luxuryLeadFollowUp, "luxuryLeadFollowUp")}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
}
