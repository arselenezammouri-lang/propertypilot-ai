"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import { useLocaleContext } from "@/components/providers/locale-provider";

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
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";
  const [isLoading, setIsLoading] = useState(true);

  const t = {
    backToDashboard: isItalian ? "Torna alla Dashboard" : "Back to Dashboard",
    pageTitle: isItalian ? "Branding Agenzia" : "Agency Branding",
    pageSubtitle: isItalian ? "Personalizza le schede PDF con il tuo brand White Label" : "Customize PDF sheets with your White Label brand",
    agencyInfoTitle: isItalian ? "Informazioni Agenzia" : "Agency Information",
    agencyInfoDesc: isItalian ? "Dati base della tua agenzia immobiliare" : "Basic data for your real estate agency",
    agencyNameLabel: isItalian ? "Nome Agenzia *" : "Agency Name *",
    agencyNamePlaceholder: isItalian ? "es. Immobiliare Rossi" : "e.g. Rossi Real Estate",
    logoUrlLabel: isItalian ? "URL Logo (opzionale)" : "Logo URL (optional)",
    logoUrlHelper: isItalian ? "Inserisci l'URL del logo della tua agenzia (formato PNG o JPG consigliato)" : "Enter your agency logo URL (PNG or JPG format recommended)",
    websiteLabel: isItalian ? "Sito Web (opzionale)" : "Website (optional)",
    websitePlaceholder: isItalian ? "https://www.tuaagenzia.it" : "https://www.youragency.com",
    contactsTitle: isItalian ? "Contatti" : "Contacts",
    contactsDesc: isItalian ? "Informazioni di contatto per le schede PDF" : "Contact information for PDF sheets",
    contactNameLabel: isItalian ? "Nome Referente" : "Contact Name",
    contactNamePlaceholder: isItalian ? "es. Mario Rossi" : "e.g. John Smith",
    phoneLabel: isItalian ? "Telefono" : "Phone",
    phonePlaceholder: isItalian ? "+39 02 1234567" : "+1 555 1234567",
    emailPlaceholder: isItalian ? "info@agenzia.it" : "info@agency.com",
    colorsTitle: isItalian ? "Colori Brand" : "Brand Colors",
    colorsDesc: isItalian ? "Personalizza i colori delle tue schede PDF" : "Customize the colors of your PDF sheets",
    primaryColor: isItalian ? "Colore Primario" : "Primary Color",
    secondaryColor: isItalian ? "Colore Secondario" : "Secondary Color",
    accentColor: isItalian ? "Colore Accento" : "Accent Color",
    saving: isItalian ? "Salvataggio..." : "Saving...",
    updateBranding: isItalian ? "Aggiorna Branding" : "Update Branding",
    saveBranding: isItalian ? "Salva Branding" : "Save Branding",
    previewTitle: isItalian ? "Anteprima Scheda PDF" : "PDF Sheet Preview",
    previewDesc: isItalian ? "Ecco come apparirà la tua scheda White Label" : "Here's how your White Label sheet will look",
    previewPropertyTitle: isItalian ? "Titolo Immobile" : "Property Title",
    previewAgencyName: isItalian ? "Nome Agenzia" : "Agency Name",
    previewContact: isItalian ? "Nome Referente" : "Contact Name",
    previewPhone: isItalian ? "+39 000 0000000" : "+1 000 0000000",
    previewWebsite: isItalian ? "www.agenzia.it" : "www.agency.com",
    previewDesc2: isItalian ? "Splendido appartamento in zona centrale, luminoso e ristrutturato con finiture di pregio. Ideale per famiglie..." : "Splendid apartment in central area, bright and renovated with quality finishes. Ideal for families...",
    brandingConfigured: isItalian ? "Branding configurato - Usa \"White Label\" nella generazione PDF" : "Branding configured - Use \"White Label\" in PDF generation",
    // toasts
    required: isItalian ? "Campo obbligatorio" : "Required field",
    agencyNameRequired: isItalian ? "Inserisci il nome dell'agenzia" : "Enter the agency name",
    saved: isItalian ? "Branding salvato!" : "Branding saved!",
    savedDesc: isItalian ? "Il profilo della tua agenzia è stato salvato con successo." : "Your agency profile has been saved successfully.",
    errorTitle: isItalian ? "Errore" : "Error",
    saveError: isItalian ? "Errore nel salvataggio" : "Save error",
  };
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
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const response = await fetch("/api/agency-branding");
      const data = await response.json();
      
      if (data.branding) {
        setFormData({
          agency_name: data.branding.agency_name || "",
          logo_url: data.branding.logo_url || "",
          primary_color: data.branding.primary_color || "#1E3A5F",
          secondary_color: data.branding.secondary_color || "#60A5FA",
          accent_color: data.branding.accent_color || "#F59E0B",
          contact_name: data.branding.contact_name || "",
          contact_phone: data.branding.contact_phone || "",
          contact_email: data.branding.contact_email || "",
          website_url: data.branding.website_url || "",
        });
        setHasExisting(true);
      }
    } catch (error) {
      console.error("Error loading branding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.agency_name.trim()) {
      toast({
        title: t.required,
        description: t.agencyNameRequired,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/agency-branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          logo_url: formData.logo_url || null,
          contact_name: formData.contact_name || null,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          website_url: formData.website_url || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.saveError);
      }

      setHasExisting(true);
      toast({
        title: t.saved,
        description: t.savedDesc,
      });
    } catch (error) {
      toast({
        title: t.errorTitle,
        description: error instanceof Error ? error.message : t.saveError,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToDashboard}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Building2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground">
            {t.pageSubtitle}
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          🏢 White Label
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                {t.agencyInfoTitle}
              </CardTitle>
              <CardDescription>
                {t.agencyInfoDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="agency_name">{t.agencyNameLabel}</Label>
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
                  placeholder="https://example.com/logo.png"
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

          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                {t.contactsTitle}
              </CardTitle>
              <CardDescription>
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
                    Email
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

          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                {t.colorsTitle}
              </CardTitle>
              <CardDescription>
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
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
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
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                {t.previewTitle}
              </CardTitle>
              <CardDescription>
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
                      alt="Logo"
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
                    White Label
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
                    €350.000
                  </p>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["100 mq", "3 locali", "2 bagni"].map((feature, i) => (
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
    </div>
  );
}
