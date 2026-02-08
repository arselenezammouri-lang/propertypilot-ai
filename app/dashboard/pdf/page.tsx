"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { 
  Home, 
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

export const dynamic = 'force-dynamic';

const pdfFormSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().min(10, "La descrizione deve avere almeno 10 caratteri"),
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

type PdfFormData = z.infer<typeof pdfFormSchema>;

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
  const [loadingBranding, setLoadingBranding] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/agency-branding")
      .then(res => res.json())
      .then(data => {
        if (data.branding) {
          setAgencyBranding(data.branding);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingBranding(false));
  }, []);

  const form = useForm<PdfFormData>({
    resolver: zodResolver(pdfFormSchema),
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

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Errore durante la generazione del PDF");
      }

      return result;
    },
    onSuccess: (data) => {
      setGeneratedPdf({ base64: data.pdfBase64, fileName: data.fileName });
      toast({
        title: "PDF Generato!",
        description: "La tua scheda immobile è pronta per il download.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    try {
      new URL(newImageUrl);
      if (imageUrls.length >= 6) {
        toast({
          title: "Limite raggiunto",
          description: "Puoi aggiungere massimo 6 immagini",
          variant: "destructive",
        });
        return;
      }
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    } catch {
      toast({
        title: "URL non valido",
        description: "Inserisci un URL valido per l'immagine",
        variant: "destructive",
      });
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

  const selectedTemplate = form.watch("template");

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-ai-aurora rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <Home className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground font-medium">Generatore PDF</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all" data-testid="button-back-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 md:mb-14 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4">
            Generatore <span className="gradient-text-gold">Schede PDF</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Crea schede immobiliari professionali stile Canva Premium
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="futuristic-card p-6 animate-fade-in-up" data-testid="card-template-selector">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sunset-gold" />
                    Scegli il Template
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
                          <h4 className="font-bold text-electric-blue">Modern Real Estate</h4>
                          <p className="text-xs text-muted-foreground">Professionale e moderno</p>
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
                          <h4 className="font-bold text-sunset-gold">Luxury Premium</h4>
                          <p className="text-xs text-muted-foreground">Elegante e raffinato</p>
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
                    Branding PDF
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Branding Agenzia (White Label)</h4>
                          <p className="text-sm text-muted-foreground">
                            {agencyBranding ? (
                              <>Usa il brand di <span className="font-medium text-indigo-600">{agencyBranding.agency_name}</span></>
                            ) : (
                              "Configura prima il branding della tua agenzia"
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {!agencyBranding && (
                          <Link href="/dashboard/agency-branding">
                            <Button variant="outline" size="sm" className="border-indigo-300">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Configura
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
                          <span className="text-xs text-muted-foreground">Primario</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: agencyBranding.secondary_color }}
                          />
                          <span className="text-xs text-muted-foreground">Secondario</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: agencyBranding.accent_color }}
                          />
                          <span className="text-xs text-muted-foreground">Accento</span>
                        </div>
                      </div>
                    )}
                    
                    {!useAgencyBranding && (
                      <p className="text-sm text-muted-foreground">
                        Il PDF verrà generato con il branding PropertyPilot AI
                      </p>
                    )}
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-100" data-testid="card-property-info">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-royal-purple" />
                    Informazioni Immobile
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titolo *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Es: Villa di Lusso con Vista Mare" 
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
                          <FormLabel>Descrizione *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrivi la proprietà in dettaglio..."
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
                            Descrizione AI (opzionale)
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Incolla qui la versione riscritta dall'AI..."
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
                    Caratteristiche
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Award className="h-3 w-3" /> Prezzo
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="€ 450.000" {...field} data-testid="input-price" />
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
                            <Ruler className="h-3 w-3" /> Superficie
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="120 mq" {...field} data-testid="input-surface" />
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
                            <BedDouble className="h-3 w-3" /> Locali
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="4 locali" {...field} data-testid="input-rooms" />
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
                            <Bath className="h-3 w-3" /> Bagni
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="2 bagni" {...field} data-testid="input-bathrooms" />
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
                            <Layers className="h-3 w-3" /> Piano
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="3° piano" {...field} data-testid="input-floor" />
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
                            <Building2 className="h-3 w-3" /> Tipologia
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Appartamento" {...field} data-testid="input-property-type" />
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
                            <MapPin className="h-3 w-3" /> Indirizzo
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Via Roma, 15 - Milano" {...field} data-testid="input-address" />
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
                            <Zap className="h-3 w-3" /> Stato
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ottimo stato" {...field} data-testid="input-status" />
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
                            <Zap className="h-3 w-3" /> Classe Energetica
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="A+" {...field} data-testid="input-energy-class" />
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
                            <Calendar className="h-3 w-3" /> Anno
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="2020" {...field} data-testid="input-year-built" />
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
                            <Thermometer className="h-3 w-3" /> Riscaldamento
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Autonomo" {...field} data-testid="input-heating" />
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
                            <Car className="h-3 w-3" /> Parcheggio
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Box auto" {...field} data-testid="input-parking" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-200" data-testid="card-images">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-electric-blue" />
                    Immagini (max 6)
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="url"
                      placeholder="Incolla URL immagine..."
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
                      Aggiungi
                    </Button>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Immagine ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-silver-frost/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999">Errore</text></svg>';
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
                      Aggiungi fino a 6 immagini per la scheda PDF
                    </p>
                  )}
                </div>

                <div className="futuristic-card p-6 animate-fade-in-up delay-250" data-testid="card-agent-info">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-royal-purple" />
                    Info Agente (opzionale)
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="agentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <User className="h-3 w-3" /> Nome
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Mario Rossi" {...field} data-testid="input-agent-name" />
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
                            <Phone className="h-3 w-3" /> Telefono
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+39 333 1234567" {...field} data-testid="input-agent-phone" />
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
                            <Mail className="h-3 w-3" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="mario@agenzia.it" {...field} data-testid="input-agent-email" />
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
                      Generazione in corso...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Genera Scheda PDF
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
                    <h3 className="text-xl font-bold text-green-500 mb-2">PDF Pronto!</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      La tua scheda immobile è stata generata con successo
                    </p>
                    <Button
                      onClick={downloadPdf}
                      className="w-full bg-gradient-to-r from-green-500 to-neon-aqua hover:opacity-90 text-white"
                      data-testid="button-download-pdf"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Scarica PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="futuristic-card p-6 animate-fade-in-up" data-testid="card-preview-placeholder">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-royal-purple/30 to-electric-blue/20 rounded-2xl flex items-center justify-center">
                      <FileText className="h-8 w-8 text-royal-purple" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 gradient-text-purple">Anteprima PDF</h3>
                    <p className="text-muted-foreground text-sm">
                      Compila i dati e genera la tua scheda PDF professionale
                    </p>
                  </div>
                </div>
              )}

              <div className="futuristic-card p-6 border-sunset-gold/30" data-testid="card-tips">
                <h4 className="font-bold text-sunset-gold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Consigli Pro
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Usa immagini di alta qualità (almeno 800px)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>La prima immagine sarà l'hero principale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Aggiungi la versione AI per un impatto premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Il template Luxury è ideale per immobili di pregio</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
