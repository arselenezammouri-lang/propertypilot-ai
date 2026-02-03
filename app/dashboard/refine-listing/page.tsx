"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  FileText
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

interface FormData {
  tipoTransazione: string;
  originalText: string;
  propertyType: string;
  location: string;
  tone: "professional" | "emotional" | "luxury" | "seo";
}

const TIPO_TRANSAZIONE_OPTIONS = [
  { value: 'vendita', label: 'Vendita', icon: '🏷️' },
  { value: 'affitto', label: 'Affitto', icon: '🔑' },
  { value: 'affitto_breve', label: 'Affitto Breve / Turistico', icon: '🏖️' },
];

const REFINE_TABS = [
  { id: "professional", label: "Professional", icon: Briefcase, description: "Autorevole e credibile", gradient: "from-blue-500 to-indigo-500" },
  { id: "emotional", label: "Emotional", icon: Heart, description: "Coinvolgente ed evocativo", gradient: "from-rose-500 to-pink-500" },
  { id: "luxury", label: "Luxury", icon: Crown, description: "Esclusivo e raffinato", gradient: "from-amber-500 to-yellow-500" },
  { id: "seo", label: "SEO Boosted", icon: Search, description: "Ottimizzato per Google", gradient: "from-emerald-500 to-teal-500" },
] as const;

export default function RefineListingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RefineListingResult | null>(null);
  const [activeTab, setActiveTab] = useState("professional");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      toast({
        title: "Testo troppo breve",
        description: "L'annuncio originale deve avere almeno 50 caratteri",
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyType.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il tipo di immobile",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci la località",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/refine-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Limite raggiunto",
            description: data.message || "Troppi tentativi. Riprova tra un minuto.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 401) {
          toast({
            title: "Accesso negato",
            description: "Devi effettuare il login per usare questa funzione.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error || "Errore nel raffinamento");
      }

      setResult(data);
      setActiveTab("professional");
      toast({
        title: "Annuncio raffinato!",
        description: data.cached ? "Risultato dalla cache (24h)" : "4 versioni migliorate pronte all'uso",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore nel raffinamento",
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
        title: "Copiato!",
        description: "Testo copiato negli appunti",
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: "Errore",
        description: "Impossibile copiare il testo",
        variant: "destructive",
      });
    }
  };

  const copyFullListing = (listing: RefinedListing, version: string) => {
    const fullText = `${listing.titolo}\n\n` +
      `${listing.descrizione}\n\n` +
      `✨ HIGHLIGHTS:\n${listing.highlights.map(h => `• ${h}`).join('\n')}\n\n` +
      `🎯 ${listing.cta}\n\n` +
      `📝 META DESCRIPTION:\n${listing.metaDescription}`;
    
    copyToClipboard(fullText, `full-${version}`);
  };

  const renderListingCard = (listing: RefinedListing, version: string) => {
    const tabInfo = REFINE_TABS.find(t => t.id === version) || REFINE_TABS[0];
    const Icon = tabInfo.icon;
    
    return (
      <Card className="border-2 border-violet-200 dark:border-violet-800">
        <CardHeader className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Icon className="h-5 w-5" />
              Versione {tabInfo.label}
            </CardTitle>
            <Button
              onClick={() => copyFullListing(listing, version)}
              className={`bg-gradient-to-r ${tabInfo.gradient} hover:opacity-90 text-white`}
              data-testid={`button-copy-full-${version}`}
            >
              {copiedField === `full-${version}` ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copia Tutto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Wand2 className="h-3 w-3" /> Titolo Migliorato
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
                <FileText className="h-3 w-3" /> Descrizione Migliorata
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
                ✨ 5 Highlights
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
                🎯 CTA Migliorata
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
                <Search className="h-3 w-3" /> Meta Description SEO
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
                {listing.metaDescription.length}/160 caratteri
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white">
          <Sparkles className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            Perfect Again AI
          </h1>
          <p className="text-muted-foreground">
            Raffina e migliora completamente i tuoi annunci esistenti
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
          ✨ Perfect Again AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-violet-200 dark:border-violet-800">
          <CardHeader className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-violet-600" />
              Annuncio da Migliorare
            </CardTitle>
            <CardDescription>
              Incolla il tuo annuncio esistente e lascia che l'AI lo perfezioni
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Tipo Annuncio</Label>
              <Select
                value={formData.tipoTransazione}
                onValueChange={(value) => handleInputChange("tipoTransazione", value)}
              >
                <SelectTrigger data-testid="select-tipo-transazione">
                  <SelectValue placeholder="Seleziona tipo transazione" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_TRANSAZIONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalText">Testo Annuncio Originale *</Label>
              <Textarea
                id="originalText"
                placeholder="Incolla qui il tuo annuncio esistente che vuoi migliorare... (min 50 caratteri)"
                value={formData.originalText}
                onChange={(e) => handleInputChange("originalText", e.target.value)}
                rows={8}
                className="resize-none"
                data-testid="input-original-text"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.originalText.length}/3000 caratteri
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Tipo Immobile *</Label>
                <Input
                  id="propertyType"
                  placeholder="es. Appartamento"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange("propertyType", e.target.value)}
                  data-testid="input-property-type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Località *</Label>
                <Input
                  id="location"
                  placeholder="es. Milano Centro"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  data-testid="input-location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tono Preferito</Label>
              <Select
                value={formData.tone}
                onValueChange={(value: FormData["tone"]) => 
                  handleInputChange("tone", value)
                }
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder="Seleziona tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="emotional">💗 Emotional</SelectItem>
                  <SelectItem value="luxury">👑 Luxury</SelectItem>
                  <SelectItem value="seo">🔍 SEO Boosted</SelectItem>
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
                  Raffinamento in corso...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Perfeziona Annuncio
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
                  Nessun annuncio raffinato
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Incolla il tuo annuncio esistente e clicca "Perfeziona" per generare 
                  4 versioni migliorate: Professional, Emotional, Luxury e SEO.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-violet-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Raffinamento in corso...</h3>
                <p className="text-sm text-muted-foreground">
                  L'AI sta analizzando e migliorando il tuo annuncio
                </p>
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
                          Analisi Annuncio Originale
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
                  {REFINE_TABS.map((tab) => {
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
    </div>
  );
}
