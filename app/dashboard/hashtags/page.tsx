"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
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


export default function HashtagsPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const t = {
    backToDashboard: isItalian ? "Torna alla Dashboard" : "Back to Dashboard",
    heroTitle: isItalian ? "Hashtag AI Generator" : "Hashtag AI Generator",
    heroSubtitle: isItalian
      ? "Genera hashtag ottimizzati per massimizzare il reach dei tuoi post"
      : "Generate optimized hashtags to maximize the reach of your posts",
    heroBadge: isItalian ? "⚡ Viral Booster AI" : "⚡ Viral Booster AI",
    formTitle: isItalian ? "Dati Immobile" : "Property Data",
    formSubtitle: isItalian
      ? "Inserisci le informazioni per generare hashtag personalizzati"
      : "Enter information to generate personalized hashtags",
    listingType: isItalian ? "Tipo Annuncio" : "Listing Type",
    selectTransaction: isItalian ? "Seleziona tipo transazione" : "Select transaction type",
    propertyTypeLabel: isItalian ? "Tipo di Immobile *" : "Property Type *",
    propertyTypePlaceholder: isItalian ? "es. Attico con terrazzo" : "e.g. Attic with terrace",
    locationLabel: isItalian ? "Località *" : "Location *",
    locationPlaceholder: isItalian ? "es. Milano Centro" : "e.g. Milan Centre",
    priceLabel: isItalian ? "Prezzo *" : "Price *",
    pricePlaceholder: isItalian ? "es. €450.000" : "e.g. $450,000",
    strengthsLabel: isItalian ? "Punti di Forza *" : "Key Strengths *",
    strengthsPlaceholder: isItalian
      ? "es. Vista panoramica, terrazzo 50mq, finiture di pregio..."
      : "e.g. Panoramic view, 50sqm terrace, premium finishes...",
    toneLabel: isItalian ? "Tono" : "Tone",
    selectTone: isItalian ? "Seleziona tono" : "Select tone",
    marketLabel: isItalian ? "Mercato" : "Market",
    selectMarket: isItalian ? "Seleziona mercato" : "Select market",
    generateIdle: isItalian ? "Genera 50+ Hashtag" : "Generate 50+ Hashtags",
    generateLoading: isItalian ? "Generazione in corso..." : "Generating...",
    emptyTitle: isItalian ? "Nessun hashtag generato" : "No hashtags generated",
    emptySubtitle: isItalian
      ? "Compila il form con i dati dell'immobile e clicca \"Genera\" per creare oltre 50 hashtag ottimizzati."
      : "Fill the form with property data and click \"Generate\" to create over 50 optimized hashtags.",
    loadingTitle: isItalian ? "Generazione in corso..." : "Generating...",
    loadingSubtitle: isItalian
      ? "Stiamo creando hashtag ottimizzati per il tuo immobile"
      : "We are creating optimized hashtags for your property",
    strategicTip: isItalian ? "Consiglio Strategico" : "Strategic Tip",
    readyMixes: isItalian ? "Mix Pronti all'Uso" : "Ready-to-Use Mixes",
    viralFocus: isItalian ? "Focus Virale" : "Viral Focus",
    balanced: isItalian ? "Equilibrato" : "Balanced",
    localFocus: isItalian ? "Focus Locale" : "Local Focus",
    copyAll: isItalian ? "Copia Tutti" : "Copy All",
    clickToCopy: isItalian ? "Clicca per copiare tutti gli hashtag" : "Click to copy all hashtags",
    usaMarketMsg: isItalian
      ? "Seleziona \"USA\" come mercato per generare hashtag americani"
      : "Select \"USA\" as market to generate American hashtags",
    // toasts
    fieldRequired: isItalian ? "Campo obbligatorio" : "Required field",
    propertyTypeRequired: isItalian ? "Inserisci il tipo di immobile (min 3 caratteri)" : "Enter property type (min 3 characters)",
    locationRequired: isItalian ? "Inserisci la località" : "Enter the location",
    strengthsRequired: isItalian ? "Descrivi i punti di forza (min 10 caratteri)" : "Describe key strengths (min 10 characters)",
    priceRequired: isItalian ? "Inserisci il prezzo" : "Enter the price",
    limitTitle: isItalian ? "Limite raggiunto" : "Limit reached",
    limitDefault: isItalian ? "Troppi tentativi. Riprova tra un minuto." : "Too many attempts. Try again in a minute.",
    accessDenied: isItalian ? "Accesso negato" : "Access denied",
    accessDeniedDesc: isItalian ? "Devi effettuare il login per usare questa funzione." : "You must log in to use this feature.",
    successTitle: isItalian ? "Hashtag generati con successo!" : "Hashtags generated successfully!",
    successCached: isItalian ? "Risultato dalla cache (24h)" : "Result from cache (24h)",
    successDesc: isItalian ? "Oltre 50 hashtag pronti per i tuoi post" : "Over 50 hashtags ready for your posts",
    errorTitle: isItalian ? "Errore" : "Error",
    errorGeneric: isItalian ? "Errore nella generazione" : "Generation error",
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedDesc: isItalian ? "Hashtag copiati negli appunti" : "Hashtags copied to clipboard",
    copyFailed: isItalian ? "Impossibile copiare il testo" : "Unable to copy text",
    // tabs
    tabVirali: isItalian ? "Virali" : "Viral",
    tabNicchia: isItalian ? "Nicchia" : "Niche",
    tabLocalSeo: "Local SEO",
    tabUsa: "USA",
    tabViraliDesc: isItalian ? "15 hashtag ad alto reach" : "15 high-reach hashtags",
    tabNicchiaDesc: isItalian ? "15 hashtag specifici" : "15 specific hashtags",
    tabLocalSeoDesc: isItalian ? "10 hashtag locali" : "10 local hashtags",
    tabUsaDesc: isItalian ? "15 hashtag americani" : "15 American hashtags",
    // category labels
    catVirali: isItalian ? "Virali" : "Viral",
    catNicchia: isItalian ? "di Nicchia" : "Niche",
    catLocalSeo: "Local SEO",
    catUsa: "USA",
  };

  const tipoTransazioneOptions = [
    { value: "vendita", label: isItalian ? "Vendita" : "Sale", icon: "🏷️" },
    { value: "affitto", label: isItalian ? "Affitto" : "Rental", icon: "🔑" },
    { value: "affitto_breve", label: isItalian ? "Affitto Breve / Turistico" : "Short-Term / Vacation Rental", icon: "🏖️" },
  ];

  const hashtagTabs = [
    { id: "virali", label: t.tabVirali, icon: TrendingUp, description: t.tabViraliDesc, color: "from-pink-500 to-rose-500" },
    { id: "nicchia", label: t.tabNicchia, icon: Target, description: t.tabNicchiaDesc, color: "from-purple-500 to-indigo-500" },
    { id: "localSeo", label: t.tabLocalSeo, icon: MapPin, description: t.tabLocalSeoDesc, color: "from-green-500 to-emerald-500" },
    { id: "usa", label: t.tabUsa, icon: Globe, description: t.tabUsaDesc, color: "from-blue-500 to-cyan-500" },
  ] as const;

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
      toast({ title: t.fieldRequired, description: t.propertyTypeRequired, variant: "destructive" });
      return;
    }
    if (!formData.location.trim()) {
      toast({ title: t.fieldRequired, description: t.locationRequired, variant: "destructive" });
      return;
    }
    if (!formData.strengths.trim() || formData.strengths.length < 10) {
      toast({ title: t.fieldRequired, description: t.strengthsRequired, variant: "destructive" });
      return;
    }
    if (!formData.price.trim()) {
      toast({ title: t.fieldRequired, description: t.priceRequired, variant: "destructive" });
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
          toast({ title: t.limitTitle, description: data.message || t.limitDefault, variant: "destructive" });
          return;
        }
        if (response.status === 401) {
          toast({ title: t.accessDenied, description: t.accessDeniedDesc, variant: "destructive" });
          return;
        }
        throw new Error(data.error || t.errorGeneric);
      }

      setResult(data);
      setActiveTab("virali");
      toast({ title: t.successTitle, description: data.cached ? t.successCached : t.successDesc });
    } catch (error) {
      const friendly = handleAPIError(error, t.errorGeneric);
      toast({ title: t.errorTitle, description: friendly, variant: "destructive" });
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
      toast({ title: t.errorTitle, description: t.copyFailed, variant: "destructive" });
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
                {hashtags.length} Hashtag {category === 'virali' ? t.catVirali : category === 'nicchia' ? t.catNicchia : category === 'localSeo' ? t.catLocalSeo : t.catUsa}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t.clickToCopy}
              </CardDescription>
            </div>
            <Button
              onClick={() => copyToClipboard(hashtagText, category)}
              className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-foreground`}
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
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-foreground font-bold text-sm`}>
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
          {t.backToDashboard}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-foreground">
          <Hash className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-muted-foreground">
            {t.heroSubtitle}
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-foreground border-0">
          {t.heroBadge}
        </Badge>
      </div>

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
                  {tipoTransazioneOptions.map((option) => (
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
                    <SelectItem value="professionale">Professionale</SelectItem>
                    <SelectItem value="emozionale">Emozionale</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="virale">Virale</SelectItem>
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
                    <SelectItem value="italy">🇮🇹 Italia</SelectItem>
                    <SelectItem value="usa">🇺🇸 USA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-foreground"
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
    </div>
  );
}
