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

export const dynamic = 'force-dynamic';

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
  const [isLoading, setIsLoading] = useState(true);
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
        title: "Campo obbligatorio",
        description: "Inserisci il nome dell'agenzia",
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
        throw new Error(data.error || "Errore nel salvataggio");
      }

      setHasExisting(true);
      toast({
        title: "Branding salvato!",
        description: "Il profilo della tua agenzia è stato salvato con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore nel salvataggio",
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
          Torna alla Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Building2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Branding Agenzia
          </h1>
          <p className="text-muted-foreground">
            Personalizza le schede PDF con il tuo brand White Label
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
                Informazioni Agenzia
              </CardTitle>
              <CardDescription>
                Dati base della tua agenzia immobiliare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="agency_name">Nome Agenzia *</Label>
                <Input
                  id="agency_name"
                  placeholder="es. Immobiliare Rossi"
                  value={formData.agency_name}
                  onChange={(e) => handleInputChange("agency_name", e.target.value)}
                  data-testid="input-agency-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  URL Logo (opzionale)
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
                  Inserisci l'URL del logo della tua agenzia (formato PNG o JPG consigliato)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Sito Web (opzionale)
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://www.tuaagenzia.it"
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
                Contatti
              </CardTitle>
              <CardDescription>
                Informazioni di contatto per le schede PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Referente
                </Label>
                <Input
                  id="contact_name"
                  placeholder="es. Mario Rossi"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange("contact_name", e.target.value)}
                  data-testid="input-contact-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefono
                  </Label>
                  <Input
                    id="contact_phone"
                    placeholder="+39 02 1234567"
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
                    placeholder="info@agenzia.it"
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
                Colori Brand
              </CardTitle>
              <CardDescription>
                Personalizza i colori delle tue schede PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Colore Primario</Label>
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
                  <Label htmlFor="secondary_color">Colore Secondario</Label>
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
                  <Label htmlFor="accent_color">Colore Accento</Label>
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
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {hasExisting ? "Aggiorna Branding" : "Salva Branding"}
              </>
            )}
          </Button>
        </div>

        <div>
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                Anteprima Scheda PDF
              </CardTitle>
              <CardDescription>
                Ecco come apparirà la tua scheda White Label
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
                      {formData.agency_name || "Nome Agenzia"}
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
                    Titolo Immobile
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
                      Splendido appartamento in zona centrale, luminoso e 
                      ristrutturato con finiture di pregio. Ideale per famiglie...
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
                        {formData.contact_name || "Nome Referente"}
                      </div>
                      <div className="opacity-80">
                        {formData.contact_phone || "+39 000 0000000"}
                      </div>
                    </div>
                    <div className="text-right text-xs opacity-80">
                      <div>{formData.agency_name || "Nome Agenzia"}</div>
                      <div>{formData.website_url || "www.agenzia.it"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {hasExisting && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Branding configurato - Usa "White Label" nella generazione PDF
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
