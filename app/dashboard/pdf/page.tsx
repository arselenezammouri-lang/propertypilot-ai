"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { 
  FileText,
  Loader2,
  Download,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  X,
  CheckCircle,
  Crown,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  Ruler,
  BedDouble,
  Bath,
  Layers,
  Zap,
  Thermometer,
  Calendar,
  Car,
  Award,
  Palette,
  ExternalLink
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import type { PdfSheetPageUi } from "@/lib/i18n/pdf-sheet-page-ui";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  networkFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";

function createPdfFormSchema(t: PdfSheetPageUi) {
  return z.object({
    title: z.string().min(1, t.zodTitleRequired),
    description: z.string().min(10, t.zodDescriptionMin),
    surface: z.string().optional(),
    rooms: z.string().optional(),
    bathrooms: z.string().optional(),
    price: z.string().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
    propertyType: z.string().optional(),
    floor: z.string().optional(),
    energyClass: z.string().optional(),
    yearBuilt: z.string().optional(),
    parking: z.string().optional(),
    heating: z.string().optional(),
    aiRewrite: z.string().optional(),
    agentName: z.string().optional(),
    agentPhone: z.string().optional(),
    agentEmail: z.string().optional(),
    template: z.enum(["modern", "luxury"]).default("modern"),
  });
}

type PdfFormData = z.infer<ReturnType<typeof createPdfFormSchema>>;

type PdfApiSuccessPayload = {
  success: boolean;
  pdfBase64?: string;
  fileName?: string;
  error?: string;
};

interface AgencyBranding {
  id: number;
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

export default function PdfGeneratorPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [generatedPdf, setGeneratedPdf] = useState<{ base64: string; fileName: string } | null>(null);
  const [useAgencyBranding, setUseAgencyBranding] = useState(false);
  const [agencyBranding, setAgencyBranding] = useState<AgencyBranding | null>(null);
  const { toast } = useToast();
  const { locale } = useLocale();
  const feedbackLocale = locale === "it" ? "it" : "en";
  const usage = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const t = dash.pdfSheetPage;
  const pdfSchema = useMemo(() => createPdfFormSchema(t), [t]);
  const pdfSchemaRef = useRef(pdfSchema);
  pdfSchemaRef.current = pdfSchema;

  useEffect(() => {
    fetch("/api/agency-branding")
      .then(res => res.json())
      .then(data => {
        if (data.branding) {
          setAgencyBranding(data.branding);
        }
      })
      .catch(console.error);
  }, []);

  const form = useForm<PdfFormData>({
    resolver: async (values, ctx, opts) =>
      zodResolver(pdfSchemaRef.current)(values, ctx, opts),
    defaultValues: {
      title: "",
      description: "",
      surface: "",
      rooms: "",
      bathrooms: "",
      price: "",
      address: "",
      status: "",
      propertyType: "",
      floor: "",
      energyClass: "",
      yearBuilt: "",
      parking: "",
      heating: "",
      aiRewrite: "",
      agentName: "",
      agentPhone: "",
      agentEmail: "",
      template: "modern",
    },
  });

  const generatePdfMutation = useMutation({
    mutationFn: async (data: PdfFormData) => {
      const payload = {
        title: data.title,
        description: data.description,
        features: {
          surface: data.surface,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          price: data.price,
          address: data.address,
          status: data.status,
          propertyType: data.propertyType,
          floor: data.floor,
          energyClass: data.energyClass,
          yearBuilt: data.yearBuilt,
          parking: data.parking,
          heating: data.heating,
        },
        images: imageUrls,
        aiRewrite: data.aiRewrite || undefined,
        template: data.template,
        agentName: data.agentName || undefined,
        agentPhone: data.agentPhone || undefined,
        agentEmail: data.agentEmail || undefined,
        brandingMode: useAgencyBranding && agencyBranding ? 'agency' : 'default',
      };

      let res;
      try {
        res = await fetchApi<PdfApiSuccessPayload>("/api/generate-pdf", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch (e) {
        const net = networkFailureToast(feedbackLocale, "pdfSheets");
        throw new Error(handleAPIError(e, net.description));
      }

      if (!res.success) {
        const err = new Error(
          (res.message || res.error || t.pdfError).trim()
        ) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }

      const result = res.data as Record<string, unknown>;
      if (
        !result ||
        result.success !== true ||
        typeof result.pdfBase64 !== "string" ||
        typeof result.fileName !== "string"
      ) {
        throw new Error(
          typeof result?.error === "string" ? result.error : t.pdfError
        );
      }

      return {
        pdfBase64: result.pdfBase64,
        fileName: result.fileName,
      };
    },
    onSuccess: (data) => {
      setGeneratedPdf({ base64: data.pdfBase64, fileName: data.fileName });
      toast({
        title: t.pdfGenerated,
        description: t.pdfGeneratedDesc,
      });
    },
    onError: (error: Error & { status?: number }) => {
      if (typeof error.status === "number") {
        const fail = apiFailureToast(
          feedbackLocale,
          "pdfSheets",
          { status: error.status, error: error.message },
          t.pdfError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      const net = networkFailureToast(feedbackLocale, "pdfSheets");
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: "destructive",
      });
    },
  });

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    try {
      new URL(newImageUrl);
      if (imageUrls.length >= 6) {
        const v = validationToast(feedbackLocale, "pdfSheets", t.maxImages);
        toast({ title: v.title, description: v.description, variant: "destructive" });
        return;
      }
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    } catch {
      const v = validationToast(feedbackLocale, "pdfSheets", t.invalidUrlDesc);
      toast({ title: v.title, description: v.description, variant: "destructive" });
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const downloadPdf = () => {
    if (!generatedPdf) return;

    const byteCharacters = atob(generatedPdf.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generatedPdf.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onSubmit = (data: PdfFormData) => {
    generatePdfMutation.mutate(data);
  };

  const onInvalidSubmit = () => {
    const first = Object.values(form.formState.errors)[0];
    const msg =
      (first?.message as string | undefined) ||
      t.checkRequiredFields;
    const v = validationToast(feedbackLocale, "pdfSheets", msg);
    toast({ title: v.title, description: v.description, variant: "destructive" });
  };

  const selectedTemplate = form.watch("template");

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        data-testid="button-back-dashboard"
        aria-label={t.backDashboard}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-pdf-page"
        subtitle={t.pageSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
      />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
                <div className="futuristic-card p-6 animate-fade-in-up" data-testid="card-template-selector">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sunset-gold" />
                    {t.chooseTemplateHeading}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTemplate === "modern"
                          ? "border-electric-blue bg-electric-blue/10 shadow-glow-blue"
                          : "border-silver-frost/30 hover:border-electric-blue/50"
                      }`}
                      onClick={() => form.setValue("template", "modern")}
                      data-testid="template-modern"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#60A5FA] rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-electric-blue">{t.templateModernTitle}</h4>
                          <p className="text-xs text-muted-foreground">{t.templateModernDesc}</p>
                        </div>
                      </div>
                      {selectedTemplate === "modern" && (
                        <CheckCircle className="h-5 w-5 text-electric-blue absolute top-4 right-4" />
                      )}
                    </div>

                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTemplate === "luxury"
                          ? "border-sunset-gold bg-sunset-gold/10 shadow-glow-gold"
                          : "border-silver-frost/30 hover:border-sunset-gold/50"
                      }`}
                      onClick={() => form.setValue("template", "luxury")}
                      data-testid="template-luxury"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#9333EA] to-[#D4AF37] rounded-lg flex items-center justify-center">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sunset-gold">{t.templateLuxuryTitle}</h4>
                          <p className="text-xs text-muted-foreground">{t.templateLuxuryDesc}</p>
                        </div>
                      </div>
                      {selectedTemplate === "luxury" && (
                        <CheckCircle className="h-5 w-5 text-sunset-gold absolute top-4 right-4" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-50" data-testid="card-branding-mode">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-indigo-500" />
                    {t.brandingPdfHeading}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{t.brandingAgencyTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {agencyBranding ? (
                              <>
                                {t.brandingUseAgencyWithName.replace(
                                  "{name}",
                                  agencyBranding.agency_name
                                )}
                              </>
                            ) : (
                              t.brandingConfigureFirst
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {!agencyBranding && (
                          <Link href="/dashboard/agency-branding">
                            <Button variant="outline" size="sm" className="border-indigo-300">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {t.brandingConfigureCta}
                            </Button>
                          </Link>
                        )}
                        <Switch
                          checked={useAgencyBranding}
                          onCheckedChange={setUseAgencyBranding}
                          disabled={!agencyBranding}
                          data-testid="switch-agency-branding"
                        />
                      </div>
                    </div>
                    
                    {useAgencyBranding && agencyBranding && (
                      <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: agencyBranding.primary_color }}
                          />
                          <span className="text-xs text-muted-foreground">{t.colorPrimary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: agencyBranding.secondary_color }}
                          />
                          <span className="text-xs text-muted-foreground">{t.colorSecondary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: agencyBranding.accent_color }}
                          />
                          <span className="text-xs text-muted-foreground">{t.colorAccent}</span>
                        </div>
                      </div>
                    )}
                    
                    {!useAgencyBranding && (
                      <p className="text-sm text-muted-foreground">
                        {t.brandingDefaultPropertyPilot}
                      </p>
                    )}
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-100" data-testid="card-property-info">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-royal-purple" />
                    {t.propertyInfoSection}
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.titleLabel}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.titlePlaceholder}
                              {...field} 
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.descLabel}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t.descPlaceholder}
                              className="min-h-[120px]"
                              {...field} 
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aiRewrite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-sunset-gold" />
                            {t.aiRewriteSection}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.aiRewritePlaceholder}
                              className="min-h-[100px] border-sunset-gold/30"
                              {...field} 
                              data-testid="input-ai-rewrite"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-150" data-testid="card-features">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-neon-aqua" />
                    {t.featuresSection}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Award className="h-3 w-3" /> {t.priceLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.pricePlaceholder} {...field} data-testid="input-price" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="surface"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Ruler className="h-3 w-3" /> {t.surfaceLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.surfacePlaceholder} {...field} data-testid="input-surface" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <BedDouble className="h-3 w-3" /> {t.roomsLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.roomsPlaceholder} {...field} data-testid="input-rooms" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Bath className="h-3 w-3" /> {t.bathroomsLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.bathroomsPlaceholder} {...field} data-testid="input-bathrooms" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Layers className="h-3 w-3" /> {t.floorLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.floorPlaceholder} {...field} data-testid="input-floor" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {t.propertyTypeShortLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.propertyTypePlaceholder} {...field} data-testid="input-property-type" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {t.addressLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.addressPlaceholder} {...field} data-testid="input-address" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {t.statusLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.statusPlaceholder} {...field} data-testid="input-status" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="energyClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {t.energyLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.energyPlaceholder} {...field} data-testid="input-energy-class" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearBuilt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {t.yearLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.yearPlaceholder} {...field} data-testid="input-year-built" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" /> {t.heatingLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.heatingPlaceholder} {...field} data-testid="input-heating" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Car className="h-3 w-3" /> {t.parkingLabel}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.parkingPlaceholder} {...field} data-testid="input-parking" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-200" data-testid="card-images">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-electric-blue" />
                    {t.imagesSection}
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="url"
                      placeholder={t.imageUrlPlaceholder}
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1"
                      data-testid="input-image-url"
                    />
                    <Button 
                      type="button" 
                      onClick={addImageUrl}
                      variant="outline"
                      className="border-electric-blue/30 hover:border-electric-blue"
                      data-testid="button-add-image"
                    >
                      {t.addImageBtn}
                    </Button>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic user-uploaded URLs */}
                          <img
                            src={url}
                            alt={t.imageAltTemplate.replace("{n}", String(index + 1))}
                            className="w-full h-24 object-cover rounded-lg border border-silver-frost/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,' +
                                encodeURIComponent(
                                  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#f0f0f0" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999">${t.imageLoadError}</text></svg>`
                                );
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-remove-image-${index}`}
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {imageUrls.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      {t.imagesEmptyHint}
                    </p>
                  )}
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-250" data-testid="card-agent-info">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-royal-purple" />
                    {t.agentSectionHeading}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="agentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {t.agentNameShort}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.agentNamePlaceholder} {...field} data-testid="input-agent-name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {t.agentPhoneShort}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.agentPhonePlaceholder} {...field} data-testid="input-agent-phone" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {t.agentEmailShort}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.agentEmailPlaceholder} {...field} data-testid="input-agent-email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={generatePdfMutation.isPending}
                  className="w-full h-14 text-lg bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 transition-all shadow-glow-purple"
                  data-testid="button-generate-pdf"
                >
                  {generatePdfMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.generatingBtn}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      {t.generateBtn}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {generatedPdf ? (
                <div className="futuristic-card p-6 border-2 border-green-500/30 bg-green-500/10 animate-fade-in-up" data-testid="card-pdf-ready">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-neon-aqua rounded-2xl flex items-center justify-center shadow-glow-aqua">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-500 mb-2">{t.sidebarReadyTitle}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {t.sidebarReadyDesc}
                    </p>
                    <Button
                      onClick={downloadPdf}
                      className="w-full bg-gradient-to-r from-green-500 to-neon-aqua hover:opacity-90 text-white"
                      data-testid="button-download-pdf"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {t.downloadBtn}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="futuristic-card p-6 animate-fade-in-up" data-testid="card-preview-placeholder">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center">
                      <FileText className="h-8 w-8 text-royal-purple" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 gradient-text-purple">{t.previewTitle}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t.previewDesc}
                    </p>
                  </div>
                </div>
              )}

              <div className="futuristic-card p-6 border-sunset-gold/30" data-testid="card-tips">
                <h4 className="font-bold text-sunset-gold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t.proTipsTitle}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{t.proTipHighRes}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{t.proTipFirstImage}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{t.proTipAiVersion}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{t.proTipLuxury}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </DashboardPageShell>
  );
}
