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
  Heart, 
  Crown,
  Users,
  BookOpen,
  Copy, 
  Check, 
  Loader2,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Star,
  Quote
} from "lucide-react";
import Link from "next/link";

interface EmotionalListing {
  titolo: string;
  aperturaEmozionale: string;
  testoSensoriale: string;
  descrizioneNarrativa: string;
  emotionalHighlights: string[];
  sezioneImmagina: string;
  ctaEmozionale: string;
}

interface EmotionalListingResult {
  storytelling: EmotionalListing;
  luxury: EmotionalListing;
  familyWarm: EmotionalListing;
  consiglioCreativo: string;
  cached?: boolean;
}

interface FormData {
  tipoTransazione: string;
  propertyType: string;
  location: string;
  features: string;
  strengths: string;
  price: string;
  targetBuyer: "famiglie" | "giovani" | "investitori" | "luxury";
  tone: "emozionale" | "luxury" | "caldo";
}


export default function EmotionalListingPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const t = {
    backToDashboard: isItalian ? "Torna alla Dashboard" : "Back to Dashboard",
    heroTitle: isItalian ? "Emotional Listing AI" : "Emotional Listing AI",
    heroSubtitle: isItalian
      ? "Descrizioni emozionali che toccano il cuore dei tuoi acquirenti"
      : "Emotional descriptions that touch the heart of your buyers",
    heroBadge: isItalian ? "💛 Emotional AI" : "💛 Emotional AI",
    formTitle: isItalian ? "Dati Immobile" : "Property Data",
    formSubtitle: isItalian
      ? "Inserisci le informazioni per generare descrizioni emozionali"
      : "Enter information to generate emotional descriptions",
    listingType: isItalian ? "Tipo Annuncio" : "Listing Type",
    selectTransaction: isItalian ? "Seleziona tipo transazione" : "Select transaction type",
    propertyTypeLabel: isItalian ? "Tipo di Immobile *" : "Property Type *",
    propertyTypePlaceholder: isItalian ? "es. Villa con giardino e piscina" : "e.g. Villa with garden and pool",
    locationLabel: isItalian ? "Località *" : "Location *",
    locationPlaceholder: isItalian ? "es. Lago di Como" : "e.g. Lake Como",
    priceLabel: isItalian ? "Prezzo *" : "Price *",
    pricePlaceholder: isItalian ? "es. €1.200.000" : "e.g. $1,200,000",
    featuresLabel: isItalian ? "Caratteristiche *" : "Features *",
    featuresPlaceholder: isItalian
      ? "es. 5 camere, 3 bagni, giardino 2000mq, piscina infinity, vista lago..."
      : "e.g. 5 bedrooms, 3 bathrooms, 2000sqm garden, infinity pool, lake view...",
    strengthsLabel: isItalian ? "Punti di Forza *" : "Key Strengths *",
    strengthsPlaceholder: isItalian
      ? "es. Vista mozzafiato, privacy assoluta, finiture di pregio, domotica..."
      : "e.g. Breathtaking view, total privacy, premium finishes, home automation...",
    targetLabel: isItalian ? "Target" : "Target",
    selectTarget: isItalian ? "Seleziona target" : "Select target",
    toneLabel: isItalian ? "Tono" : "Tone",
    selectTone: isItalian ? "Seleziona tono" : "Select tone",
    generateIdle: isItalian ? "Genera 3 Versioni Emozionali" : "Generate 3 Emotional Versions",
    generateLoading: isItalian ? "Generazione in corso..." : "Generating...",
    emptyTitle: isItalian ? "Nessuna descrizione generata" : "No description generated",
    emptySubtitle: isItalian
      ? "Compila il form con i dati dell'immobile e clicca \"Genera\" per creare 3 descrizioni emozionali."
      : "Fill the form with property data and click \"Generate\" to create 3 emotional descriptions.",
    loadingTitle: isItalian ? "Generazione in corso..." : "Generating...",
    loadingSubtitle: isItalian
      ? "Stiamo creando descrizioni emozionali coinvolgenti"
      : "We are creating engaging emotional descriptions",
    creativeTip: isItalian ? "Consiglio Creativo" : "Creative Tip",
    versionLabel: isItalian ? "Versione" : "Version",
    copyAll: isItalian ? "Copia Tutto" : "Copy All",
    sectionTitle: isItalian ? "Titolo" : "Title",
    sectionApertura: isItalian ? "Apertura Emozionale" : "Emotional Opening",
    sectionSensoriale: isItalian ? "Testo Sensoriale" : "Sensory Text",
    sectionNarrativa: isItalian ? "Descrizione Narrativa" : "Narrative Description",
    sectionImmagina: isItalian ? "🌟 Immagina Questo..." : "🌟 Imagine This...",
    sectionCta: isItalian ? "🎯 CTA Emozionale" : "🎯 Emotional CTA",
    // tabs
    tabStorytelling: "Storytelling",
    tabStorytDesc: isItalian ? "Narrativa immersiva" : "Immersive narrative",
    tabLuxury: "Luxury",
    tabLuxuryDesc: isItalian ? "Esclusivo e raffinato" : "Exclusive and refined",
    tabFamilyWarm: isItalian ? "Family Warm" : "Family Warm",
    tabFamilyWarmDesc: isItalian ? "Caldo e accogliente" : "Warm and welcoming",
    // toasts
    fieldRequired: isItalian ? "Campo obbligatorio" : "Required field",
    propertyTypeRequired: isItalian ? "Inserisci il tipo di immobile (min 3 caratteri)" : "Enter property type (min 3 characters)",
    locationRequired: isItalian ? "Inserisci la località" : "Enter the location",
    featuresRequired: isItalian ? "Descrivi le caratteristiche (min 10 caratteri)" : "Describe features (min 10 characters)",
    strengthsRequired: isItalian ? "Descrivi i punti di forza (min 10 caratteri)" : "Describe key strengths (min 10 characters)",
    priceRequired: isItalian ? "Inserisci il prezzo" : "Enter the price",
    limitTitle: isItalian ? "Limite raggiunto" : "Limit reached",
    limitDefault: isItalian ? "Troppi tentativi. Riprova tra un minuto." : "Too many attempts. Try again in a minute.",
    accessDenied: isItalian ? "Accesso negato" : "Access denied",
    accessDeniedDesc: isItalian ? "Devi effettuare il login per usare questa funzione." : "You must log in to use this feature.",
    successTitle: isItalian ? "Descrizioni emozionali generate!" : "Emotional descriptions generated!",
    successCached: isItalian ? "Risultato dalla cache (24h)" : "Result from cache (24h)",
    successDesc: isItalian ? "3 versioni emozionali pronte all'uso" : "3 emotional versions ready to use",
    errorTitle: isItalian ? "Errore" : "Error",
    errorGeneric: isItalian ? "Errore nella generazione" : "Generation error",
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedDesc: isItalian ? "Testo copiato negli appunti" : "Text copied to clipboard",
    copyFailed: isItalian ? "Impossibile copiare il testo" : "Unable to copy text",
  };

  const tipoTransazioneOptions = [
    { value: "vendita", label: isItalian ? "Vendita" : "Sale", icon: "🏷️" },
    { value: "affitto", label: isItalian ? "Affitto" : "Rental", icon: "🔑" },
    { value: "affitto_breve", label: isItalian ? "Affitto Breve / Turistico" : "Short-Term / Vacation Rental", icon: "🏖️" },
  ];

  const listingTabs = [
    { id: "storytelling", label: t.tabStorytelling, icon: BookOpen, description: t.tabStorytDesc, gradient: "from-rose-500 to-pink-500" },
    { id: "luxury", label: t.tabLuxury, icon: Crown, description: t.tabLuxuryDesc, gradient: "from-amber-500 to-yellow-500" },
    { id: "familyWarm", label: t.tabFamilyWarm, icon: Users, description: t.tabFamilyWarmDesc, gradient: "from-sky-500 to-blue-500" },
  ] as const;

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionalListingResult | null>(null);
  const [activeTab, setActiveTab] = useState("storytelling");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    propertyType: "",
    location: "",
    features: "",
    strengths: "",
    price: "",
    targetBuyer: "famiglie",
    tone: "emozionale",
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
    if (!formData.features.trim() || formData.features.length < 10) {
      toast({ title: t.fieldRequired, description: t.featuresRequired, variant: "destructive" });
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
      const response = await fetch("/api/generate-emotional-listing", {
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
      setActiveTab("storytelling");
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

  const copyFullListing = (listing: EmotionalListing, version: string) => {
    const fullText = `${listing.titolo}\n\n` +
      `${listing.aperturaEmozionale}\n\n` +
      `${listing.testoSensoriale}\n\n` +
      `${listing.descrizioneNarrativa}\n\n` +
      `✨ EMOTIONAL HIGHLIGHTS:\n${listing.emotionalHighlights.map(h => `• ${h}`).join('\n')}\n\n` +
      `🌟 IMMAGINA QUESTO...\n${listing.sezioneImmagina}\n\n` +
      `${listing.ctaEmozionale}`;
    
    copyToClipboard(fullText, `full-${version}`);
  };

  const renderListingCard = (listing: EmotionalListing, version: string) => {
    const tabInfo = listingTabs.find(tab => tab.id === version) || listingTabs[0];
    const Icon = tabInfo.icon;
    
    return (
      <Card className="border-2 border-rose-200 dark:border-rose-800">
        <CardHeader className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Icon className="h-5 w-5" />
              {t.versionLabel} {tabInfo.label}
            </CardTitle>
            <Button
              onClick={() => copyFullListing(listing, version)}
              className={`bg-gradient-to-r ${tabInfo.gradient} hover:opacity-90 text-foreground`}
              data-testid={`button-copy-full-${version}`}
            >
              {copiedField === `full-${version}` ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {t.copyAll}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" /> {t.sectionTitle}
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
                <Heart className="h-3 w-3" /> {t.sectionApertura}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.aperturaEmozionale, `apertura-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-apertura-${version}`}
              >
                {copiedField === `apertura-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-4 rounded-lg border-l-4 border-rose-500">
              <p className="text-foreground italic font-medium">
                "{listing.aperturaEmozionale}"
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {t.sectionSensoriale}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.testoSensoriale, `sensoriale-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-sensoriale-${version}`}
              >
                {copiedField === `sensoriale-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
              {listing.testoSensoriale}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> {t.sectionNarrativa}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.descrizioneNarrativa, `narrativa-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-narrativa-${version}`}
              >
                {copiedField === `narrativa-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-foreground leading-relaxed">
              {listing.descrizioneNarrativa}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                ✨ Emotional Highlights
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.emotionalHighlights.map(h => `• ${h}`).join('\n'), `highlights-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-highlights-${version}`}
              >
                {copiedField === `highlights-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <ul className="space-y-2">
              {listing.emotionalHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${tabInfo.gradient} flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {t.sectionImmagina}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.sezioneImmagina, `immagina-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-immagina-${version}`}
              >
                {copiedField === `immagina-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className={`bg-gradient-to-r ${tabInfo.gradient} bg-opacity-10 p-4 rounded-lg border`}>
              <div className="flex items-start gap-2">
                <Quote className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <p className="text-foreground italic">
                  {listing.sezioneImmagina}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {t.sectionCta}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(listing.ctaEmozionale, `cta-${version}`)}
                className="h-6 px-2"
                data-testid={`button-copy-cta-${version}`}
              >
                {copiedField === `cta-${version}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className={`text-lg font-semibold bg-gradient-to-r ${tabInfo.gradient} bg-clip-text text-transparent`}>
              {listing.ctaEmozionale}
            </p>
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
          {t.backToDashboard}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-foreground">
          <Heart className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-muted-foreground">
            {t.heroSubtitle}
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-rose-500 to-pink-500 text-foreground border-0">
          {t.heroBadge}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-rose-200 dark:border-rose-800">
          <CardHeader className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-600" />
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
              <Label htmlFor="features">{t.featuresLabel}</Label>
              <Textarea
                id="features"
                placeholder={t.featuresPlaceholder}
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows={3}
                data-testid="input-features"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">{t.strengthsLabel}</Label>
              <Textarea
                id="strengths"
                placeholder={t.strengthsPlaceholder}
                value={formData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                rows={2}
                data-testid="input-strengths"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="targetBuyer">{t.targetLabel}</Label>
                <Select
                  value={formData.targetBuyer}
                  onValueChange={(value: FormData["targetBuyer"]) => 
                    handleInputChange("targetBuyer", value)
                  }
                >
                  <SelectTrigger data-testid="select-target">
                    <SelectValue placeholder={t.selectTarget} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="famiglie">👨‍👩‍👧 Famiglie</SelectItem>
                    <SelectItem value="giovani">✨ Giovani</SelectItem>
                    <SelectItem value="investitori">📈 Investitori</SelectItem>
                    <SelectItem value="luxury">👑 Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <SelectItem value="emozionale">💗 Emozionale</SelectItem>
                    <SelectItem value="luxury">👑 Luxury</SelectItem>
                    <SelectItem value="caldo">🏠 Caldo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-foreground"
              data-testid="button-generate-emotional"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.generateLoading}
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
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
                <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
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
                <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.loadingTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.loadingSubtitle}
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioCreativo && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {t.creativeTip}
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {result.consiglioCreativo}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 gap-1 h-auto p-1">
                  {listingTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30"
                        data-testid={`tab-${tab.id}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{tab.description}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="storytelling" className="mt-4">
                  {renderListingCard(result.storytelling, "storytelling")}
                </TabsContent>
                <TabsContent value="luxury" className="mt-4">
                  {renderListingCard(result.luxury, "luxury")}
                </TabsContent>
                <TabsContent value="familyWarm" className="mt-4">
                  {renderListingCard(result.familyWarm, "familyWarm")}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
