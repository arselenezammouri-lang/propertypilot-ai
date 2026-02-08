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
  Sparkles
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

const TIPO_TRANSAZIONE_OPTIONS = [
  { value: 'vendita', label: 'Vendita', icon: '🏷️' },
  { value: 'affitto', label: 'Affitto', icon: '🔑' },
  { value: 'affitto_breve', label: 'Affitto Breve / Turistico', icon: '🏖️' },
];

const HASHTAG_TABS = [
  { id: "virali", label: "Virali", icon: TrendingUp, description: "15 hashtag ad alto reach", color: "from-pink-500 to-rose-500" },
  { id: "nicchia", label: "Nicchia", icon: Target, description: "15 hashtag specifici", color: "from-purple-500 to-indigo-500" },
  { id: "localSeo", label: "Local SEO", icon: MapPin, description: "10 hashtag locali", color: "from-green-500 to-emerald-500" },
  { id: "usa", label: "USA", icon: Globe, description: "15 hashtag americani", color: "from-blue-500 to-cyan-500" },
] as const;

export default function HashtagsPage() {
  const { toast } = useToast();
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
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il tipo di immobile (min 3 caratteri)",
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

    if (!formData.strengths.trim() || formData.strengths.length < 10) {
      toast({
        title: "Campo obbligatorio",
        description: "Descrivi i punti di forza (min 10 caratteri)",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il prezzo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-hashtags", {
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
        throw new Error(data.error || "Errore nella generazione");
      }

      setResult(data);
      setActiveTab("virali");
      toast({
        title: "Hashtag generati con successo!",
        description: data.cached ? "Risultato dalla cache (24h)" : "Oltre 50 hashtag pronti per i tuoi post",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore nella generazione",
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
        description: "Hashtag copiati negli appunti",
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

  const renderHashtagList = (hashtags: string[], category: string, gradient: string) => {
    const hashtagText = hashtags.join(' ');
    
    return (
      <Card className="border-2 border-opacity-50" style={{ borderColor: `var(--${category}-border, #e5e7eb)` }}>
        <CardHeader className={`bg-gradient-to-r ${gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                {hashtags.length} Hashtag {category === 'virali' ? 'Virali' : category === 'nicchia' ? 'di Nicchia' : category === 'localSeo' ? 'Local SEO' : 'USA'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Clicca per copiare tutti gli hashtag
              </CardDescription>
            </div>
            <Button
              onClick={() => copyToClipboard(hashtagText, category)}
              className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white`}
              data-testid={`button-copy-${category}`}
            >
              {copiedField === category ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copia Tutti
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
                <CardTitle className="text-base">Mix {mixName}</CardTitle>
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <Hash className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Hashtag AI Generator
          </h1>
          <p className="text-muted-foreground">
            Genera hashtag ottimizzati per massimizzare il reach dei tuoi post
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
          ⚡ Viral Booster AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              Dati Immobile
            </CardTitle>
            <CardDescription>
              Inserisci le informazioni per generare hashtag personalizzati
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
              <Label htmlFor="propertyType">Tipo di Immobile *</Label>
              <Input
                id="propertyType"
                placeholder="es. Attico con terrazzo"
                value={formData.propertyType}
                onChange={(e) => handleInputChange("propertyType", e.target.value)}
                data-testid="input-property-type"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo *</Label>
                <Input
                  id="price"
                  placeholder="es. €450.000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  data-testid="input-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">Punti di Forza *</Label>
              <Textarea
                id="strengths"
                placeholder="es. Vista panoramica, terrazzo 50mq, finiture di pregio..."
                value={formData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                rows={3}
                data-testid="input-strengths"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tone">Tono</Label>
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
                    <SelectItem value="professionale">Professionale</SelectItem>
                    <SelectItem value="emozionale">Emozionale</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="virale">Virale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="market">Mercato</Label>
                <Select
                  value={formData.market}
                  onValueChange={(value: FormData["market"]) => 
                    handleInputChange("market", value)
                  }
                >
                  <SelectTrigger data-testid="select-market">
                    <SelectValue placeholder="Seleziona mercato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italy">🇮🇹 Italia</SelectItem>
                    <SelectItem value="usa">🇺🇸 USA</SelectItem>
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
                  Generazione in corso...
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
                  Genera 50+ Hashtag
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
                  Nessun hashtag generato
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Compila il form con i dati dell'immobile e clicca "Genera" per creare 
                  oltre 50 hashtag ottimizzati per i tuoi social.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Generazione in corso...</h3>
                <p className="text-sm text-muted-foreground">
                  Stiamo creando hashtag ottimizzati per il tuo immobile
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
                          Consiglio Strategico
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
                  {HASHTAG_TABS.map((tab) => {
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
                          Seleziona "USA" come mercato per generare hashtag americani
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Mix Pronti all'Uso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderMixCard(result.mixA, 'A', 'Focus Virale', 'from-pink-500 to-rose-500')}
                  {renderMixCard(result.mixB, 'B', 'Equilibrato', 'from-purple-500 to-indigo-500')}
                  {renderMixCard(result.mixC, 'C', 'Focus Locale', 'from-green-500 to-emerald-500')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
