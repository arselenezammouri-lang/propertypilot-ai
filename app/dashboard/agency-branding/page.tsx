"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import {
  apiFailureToast,
  networkFailureToast,
  premiumFeatureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import { 
  Building2, 
  Palette,
  User,
  Phone,
  Mail,
  Globe,
  Image as ImageIcon,
  Save,
  Loader2,
  ArrowLeft,
  Eye,
  Check
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";

interface AgencyBranding {
  id: number;
  user_id: string;
  agency_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website_url: string | null;
}

export default function AgencyBrandingPage() {
  const { toast } = useToast();
  const { locale } = useLocale();
  const feedbackLocale = locale;
  const { plan, isLoading: planLoading } = useUsageLimits();
  const [isLoading, setIsLoading] = useState(true);

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.agencyBrandingPage,
    [locale]
  );

  const loadForbiddenRef = useRef(t.loadForbidden);
  const loadErrorGenericRef = useRef(t.loadErrorGeneric);
  loadForbiddenRef.current = t.loadForbidden;
  loadErrorGenericRef.current = t.loadErrorGeneric;
  const [isSaving, setIsSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  const [formData, setFormData] = useState({
    agency_name: "",
    logo_url: "",
    primary_color: "#1E3A5F",
    secondary_color: "#60A5FA",
    accent_color: "#F59E0B",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    website_url: "",
  });

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const res = await fetchApi<{ branding: AgencyBranding | null }>("/api/agency-branding");
        if (!res.success) {
          if (res.status === 403) {
            toast({
              variant: "destructive",
              ...premiumFeatureToast(
                feedbackLocale,
                "agencyBrandingWhiteLabel",
                res.message || res.error || loadForbiddenRef.current
              ),
            });
          } else {
            toast({
              variant: "destructive",
              ...apiFailureToast(
                feedbackLocale,
                "agencyBrandingWhiteLabel",
                { status: res.status, message: res.message, error: res.error },
                loadErrorGenericRef.current
              ),
            });
          }
          return;
        }
        const branding = res.data?.branding;
        if (branding) {
          setFormData({
            agency_name: branding.agency_name || "",
            logo_url: branding.logo_url || "",
            primary_color: branding.primary_color || "#1E3A5F",
            secondary_color: branding.secondary_color || "#60A5FA",
            accent_color: branding.accent_color || "#F59E0B",
            contact_name: branding.contact_name || "",
            contact_phone: branding.contact_phone || "",
            contact_email: branding.contact_email || "",
            website_url: branding.website_url || "",
          });
          setHasExisting(true);
        }
      } catch {
        toast({
          variant: "destructive",
          ...networkFailureToast(feedbackLocale, "agencyBrandingWhiteLabel"),
        });
      } finally {
        setIsLoading(false);
      }
    };
    void loadBranding();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only; refs carry latest copy for toasts
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.agency_name.trim()) {
      toast({
        variant: "destructive",
        ...validationToast(feedbackLocale, "agencyBrandingWhiteLabel", t.agencyNameRequired),
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetchApi<unknown>("/api/agency-branding", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          logo_url: formData.logo_url || null,
          contact_name: formData.contact_name || null,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          website_url: formData.website_url || null,
        }),
      });

      if (!res.success) {
        if (res.status === 403) {
          toast({
            variant: "destructive",
            ...premiumFeatureToast(
              feedbackLocale,
              "agencyBrandingWhiteLabel",
              res.message || res.error || loadForbiddenRef.current
            ),
          });
          return;
        }
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "agencyBrandingWhiteLabel",
            { status: res.status, message: res.message, error: res.error },
            t.saveError
          ),
        });
        return;
      }

      setHasExisting(true);
      toast({
        title: t.saved,
        description: t.savedDesc,
      });
    } catch {
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "agencyBrandingWhiteLabel"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" aria-hidden />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex items-center gap-3">
            <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-2 text-white">
              <Building2 className="h-8 w-8" aria-hidden />
            </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t.pageTitle}
            </span>
          </span>
        }
        titleDataTestId="heading-agency-branding"
        subtitle={t.pageSubtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: "secondary" } : undefined
        }
        contextualHelp={<ContextualHelpTrigger docSlug="commercial/business-features" />}
        actions={
          <Link
            href="/dashboard"
            className="text-sm text-white/70 hover:text-white"
            aria-label={t.backAria}
          >
            <span className="inline-flex min-h-11 items-center gap-2 touch-manipulation">
              <ArrowLeft className="h-4 w-4" />
              {t.backToDashboard}
            </span>
          </Link>
        }
      />

      <div className="mb-6 flex justify-end">
        <Badge className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t.badgeWhiteLabel}
        </Badge>
      </div>

      <div className="mx-auto grid max-w-6xl w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border border-white/10 bg-white/[0.03]">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-indigo-400" />
                {t.agencyInfoTitle}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t.agencyInfoDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="agency_name" className="text-white/90">{t.agencyNameLabel}</Label>
                <Input
                  id="agency_name"
                  placeholder={t.agencyNamePlaceholder}
                  value={formData.agency_name}
                  onChange={(e) => handleInputChange("agency_name", e.target.value)}
                  data-testid="input-agency-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {t.logoUrlLabel}
                </Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder={t.logoUrlPlaceholder}
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange("logo_url", e.target.value)}
                  data-testid="input-logo-url"
                />
                <p className="text-xs text-muted-foreground">
                  {t.logoUrlHelper}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t.websiteLabel}
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder={t.websitePlaceholder}
                  value={formData.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  data-testid="input-website-url"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/[0.03]">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-indigo-400" />
                {t.contactsTitle}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t.contactsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t.contactNameLabel}
                </Label>
                <Input
                  id="contact_name"
                  placeholder={t.contactNamePlaceholder}
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange("contact_name", e.target.value)}
                  data-testid="input-contact-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t.phoneLabel}
                  </Label>
                  <Input
                    id="contact_phone"
                    placeholder={t.phonePlaceholder}
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    data-testid="input-contact-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.emailLabel}
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/[0.03]">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5 text-indigo-400" />
                {t.colorsTitle}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t.colorsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">{t.primaryColor}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="primary_color"
                      value={formData.primary_color}
                      onChange={(e) => handleInputChange("primary_color", e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => handleInputChange("primary_color", e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">{t.secondaryColor}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="secondary_color"
                      value={formData.secondary_color}
                      onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent_color">{t.accentColor}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="accent_color"
                      value={formData.accent_color}
                      onChange={(e) => handleInputChange("accent_color", e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                      data-testid="input-accent-color"
                    />
                    <Input
                      value={formData.accent_color}
                      onChange={(e) => handleInputChange("accent_color", e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full min-h-11 touch-manipulation bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            size="lg"
            data-testid="button-save-branding"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {hasExisting ? t.updateBranding : t.saveBranding}
              </>
            )}
          </Button>
        </div>

        <div>
          <Card className="sticky top-4 border border-white/10 bg-white/[0.03] lg:top-24">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5 text-indigo-400" />
                {t.previewTitle}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t.previewDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="rounded-lg overflow-hidden shadow-lg border"
                style={{ aspectRatio: '210/297' }}
              >
                <div 
                  className="p-4 flex items-center justify-between"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  {formData.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- dynamic logo URL from form
                    <img
                      src={formData.logo_url}
                      alt={t.logoAlt}
                      className="h-8 w-auto object-contain bg-white rounded p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-white font-bold text-sm">
                      {formData.agency_name || t.previewAgencyName}
                    </div>
                  )}
                  <div 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: formData.secondary_color, color: '#fff' }}
                  >
                    {t.previewRibbon}
                  </div>
                </div>

                <div className="bg-gray-200 h-24 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>

                <div className="p-4 bg-white">
                  <h3 
                    className="font-bold text-lg mb-1"
                    style={{ color: formData.primary_color }}
                  >
                    {t.previewPropertyTitle}
                  </h3>
                  <p 
                    className="text-xl font-bold"
                    style={{ color: formData.secondary_color }}
                  >
                    {t.previewPriceSample}
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {t.previewFeatures.map((feature, i) => (
                      <div 
                        key={i}
                        className="text-center p-2 rounded text-xs"
                        style={{ 
                          backgroundColor: `${formData.secondary_color}20`,
                          color: formData.primary_color 
                        }}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-600">
                    <p className="line-clamp-3">
                      {t.previewDesc2}
                    </p>
                  </div>
                </div>

                <div 
                  className="p-3 mt-auto"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="text-xs">
                      <div className="font-semibold">
                        {formData.contact_name || t.previewContact}
                      </div>
                      <div className="opacity-80">
                        {formData.contact_phone || t.previewPhone}
                      </div>
                    </div>
                    <div className="text-right text-xs opacity-80">
                      <div>{formData.agency_name || t.previewAgencyName}</div>
                      <div>{formData.website_url || t.previewWebsite}</div>
                    </div>
                  </div>
                </div>
              </div>

              {hasExisting && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  {t.brandingConfigured}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
