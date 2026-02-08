"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  ArrowLeft,
  Briefcase,
  Heart,
  Crown,
  Instagram,
  Globe,
  User,
  Building2,
  MapPin,
  Award,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface BioVariant {
  fraseApertura: string;
  bio: string;
  skillsPuntiForza: string[];
  approccioVendita: string;
  cta: string;
  seoVersion?: string;
}

interface AgentBioResult {
  professionale: BioVariant;
  emotiva: BioVariant;
  luxury: BioVariant;
  social: BioVariant;
  website: BioVariant;
  consiglioPersonalBranding: string;
  cached?: boolean;
}

interface FormData {
  nomeAgente: string;
  nomeAgenzia: string;
  anniEsperienza: number;
  specializzazioni: string;
  zonaOperativa: string;
  certificazioniPremi: string;
  tono: "professionale" | "amichevole" | "luxury";
  mercato: "italia" | "usa" | "internazionale";
}

const TONI = [
  { value: "professionale", label: "Professionale", icon: Briefcase, description: "Formale e autorevole" },
  { value: "amichevole", label: "Amichevole", icon: Heart, description: "Caldo e accessibile" },
  { value: "luxury", label: "Luxury", icon: Crown, description: "Esclusivo e sofisticato" },
];

const MERCATI = [
  { value: "italia", label: "🇮🇹 Italia", description: "Mercato italiano" },
  { value: "usa", label: "🇺🇸 USA", description: "Mercato americano" },
  { value: "internazionale", label: "🌍 Internazionale", description: "Clientela globale" },
];

export default function AgentBioPage() {
  const [formData, setFormData] = useState<FormData>({
    nomeAgente: "",
    nomeAgenzia: "",
    anniEsperienza: 5,
    specializzazioni: "",
    zonaOperativa: "",
    certificazioniPremi: "",
    tono: "professionale",
    mercato: "italia",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentBioResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("professionale");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.nomeAgente.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il nome dell'agente",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nomeAgenzia.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il nome dell'agenzia",
        variant: "destructive",
      });
      return;
    }

    if (!formData.specializzazioni.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci almeno una specializzazione",
        variant: "destructive",
      });
      return;
    }

    if (!formData.zonaOperativa.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci la zona operativa",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-agent-bio", {
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
      setActiveTab("professionale");
      toast({
        title: "Bio generate con successo!",
        description: data.cached ? "Risultato dalla cache (24h)" : "5 varianti pronte per l'uso",
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

  const copyFullBio = async (variant: BioVariant, variantName: string) => {
    const fullText = `${variant.fraseApertura}\n\n${variant.bio}\n\n${variant.skillsPuntiForza.map(s => `• ${s}`).join('\n')}\n\n${variant.approccioVendita}\n\n${variant.cta}${variant.seoVersion ? `\n\n---\nSEO: ${variant.seoVersion}` : ''}`;
    copyToClipboard(fullText, `full-${variantName}`);
  };

  const getVariantIcon = (variant: string) => {
    switch (variant) {
      case "professionale": return <Briefcase className="h-4 w-4" />;
      case "emotiva": return <Heart className="h-4 w-4" />;
      case "luxury": return <Crown className="h-4 w-4" />;
      case "social": return <Instagram className="h-4 w-4" />;
      case "website": return <Globe className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "professionale": return "indigo";
      case "emotiva": return "rose";
      case "luxury": return "amber";
      case "social": return "purple";
      case "website": return "cyan";
      default: return "gray";
    }
  };

  const renderVariantCard = (variant: BioVariant, variantName: string, icon: JSX.Element, color: string) => (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100/50 dark:from-${color}-900/20 dark:to-${color}-800/10`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg capitalize">
            {icon}
            Bio {variantName}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyFullBio(variant, variantName)}
            className="flex items-center gap-1"
            data-testid={`button-copy-full-${variantName}`}
          >
            {copiedField === `full-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            Copia tutto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Frase di Apertura</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.fraseApertura, `apertura-${variantName}`)}
              className="h-6 px-2"
              data-testid={`button-copy-apertura-${variantName}`}
            >
              {copiedField === `apertura-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className={`text-lg font-semibold text-${color}-700 dark:text-${color}-300 italic`}>
            "{variant.fraseApertura}"
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Bio Completa</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.bio, `bio-${variantName}`)}
              className="h-6 px-2"
              data-testid={`button-copy-bio-${variantName}`}
            >
              {copiedField === `bio-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {variant.bio}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Skills & Punti di Forza</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.skillsPuntiForza.map(s => `• ${s}`).join('\n'), `skills-${variantName}`)}
              className="h-6 px-2"
              data-testid={`button-copy-skills-${variantName}`}
            >
              {copiedField === `skills-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <ul className="space-y-1">
            {variant.skillsPuntiForza.map((skill, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`text-${color}-500 mt-1`}>•</span>
                <span className="text-muted-foreground">{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Approccio di Vendita</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.approccioVendita, `approccio-${variantName}`)}
              className="h-6 px-2"
              data-testid={`button-copy-approccio-${variantName}`}
            >
              {copiedField === `approccio-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className="text-muted-foreground italic">
            {variant.approccioVendita}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Call-to-Action</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(variant.cta, `cta-${variantName}`)}
              className="h-6 px-2"
              data-testid={`button-copy-cta-${variantName}`}
            >
              {copiedField === `cta-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className={`font-medium text-${color}-600 dark:text-${color}-400`}>
            {variant.cta}
          </p>
        </div>

        {variant.seoVersion && (
          <div className={`space-y-2 p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800`}>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Versione SEO</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(variant.seoVersion!, `seo-${variantName}`)}
                className="h-6 px-2"
                data-testid={`button-copy-seo-${variantName}`}
              >
                {copiedField === `seo-${variantName}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {variant.seoVersion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Agent BIO AI Creator
              </h1>
              <p className="text-muted-foreground">
                Genera biografie professionali per il tuo personal branding
              </p>
            </div>
            <span className="ml-auto px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg shadow-blue-500/25">
              ✨ Agent Branding AI
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-500/10">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Dati Agente
                </CardTitle>
                <CardDescription>
                  Inserisci le informazioni per generare 5 varianti di bio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeAgente" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Nome Agente *
                    </Label>
                    <Input
                      id="nomeAgente"
                      value={formData.nomeAgente}
                      onChange={(e) => setFormData({ ...formData, nomeAgente: e.target.value })}
                      placeholder="es. Marco Rossi"
                      data-testid="input-nome-agente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeAgenzia" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      Nome Agenzia *
                    </Label>
                    <Input
                      id="nomeAgenzia"
                      value={formData.nomeAgenzia}
                      onChange={(e) => setFormData({ ...formData, nomeAgenzia: e.target.value })}
                      placeholder="es. Immobiliare Premium"
                      data-testid="input-nome-agenzia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="anniEsperienza">Anni di Esperienza</Label>
                    <Input
                      id="anniEsperienza"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.anniEsperienza}
                      onChange={(e) => setFormData({ ...formData, anniEsperienza: parseInt(e.target.value) || 0 })}
                      data-testid="input-anni-esperienza"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zonaOperativa" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Zona Operativa *
                    </Label>
                    <Input
                      id="zonaOperativa"
                      value={formData.zonaOperativa}
                      onChange={(e) => setFormData({ ...formData, zonaOperativa: e.target.value })}
                      placeholder="es. Milano Centro, Brianza"
                      data-testid="input-zona-operativa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializzazioni">Specializzazioni *</Label>
                  <Textarea
                    id="specializzazioni"
                    value={formData.specializzazioni}
                    onChange={(e) => setFormData({ ...formData, specializzazioni: e.target.value })}
                    placeholder="es. Immobili di lusso, Attici, Ville, Proprietà commerciali, Nuove costruzioni"
                    rows={2}
                    data-testid="input-specializzazioni"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificazioniPremi" className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Certificazioni / Premi (opzionale)
                  </Label>
                  <Textarea
                    id="certificazioniPremi"
                    value={formData.certificazioniPremi}
                    onChange={(e) => setFormData({ ...formData, certificazioniPremi: e.target.value })}
                    placeholder="es. Top Producer 2023, Certificato FIAIP, Luxury Property Specialist"
                    rows={2}
                    data-testid="input-certificazioni"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tono della Bio</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TONI.map((tono) => {
                      const Icon = tono.icon;
                      return (
                        <button
                          key={tono.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, tono: tono.value as any })}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            formData.tono === tono.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                          }`}
                          data-testid={`button-tono-${tono.value}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`h-4 w-4 ${formData.tono === tono.value ? "text-blue-500" : "text-gray-500"}`} />
                            <span className="font-medium text-sm">{tono.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{tono.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mercato Target</Label>
                  <Select
                    value={formData.mercato}
                    onValueChange={(value) => setFormData({ ...formData, mercato: value as any })}
                  >
                    <SelectTrigger data-testid="select-mercato">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MERCATI.map((mercato) => (
                        <SelectItem key={mercato.value} value={mercato.value}>
                          <span className="flex items-center gap-2">
                            {mercato.label} - {mercato.description}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">5 Varianti Premium Incluse</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professionale, Emotiva, Luxury, Social e Website SEO
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  size="lg"
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generazione in corso...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Genera 5 Bio AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <User className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pronto a creare la tua Bio</h3>
                  <p className="text-muted-foreground max-w-md">
                    Compila il form e genera 5 versioni professionali della tua biografia 
                    per sito web, social media e materiali di marketing.
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-muted-foreground">Generazione delle 5 bio in corso...</p>
                  <p className="text-sm text-muted-foreground mt-2">Questo può richiedere 15-30 secondi</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {result.consiglioPersonalBranding && (
                  <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Consiglio Personal Branding
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">{result.consiglioPersonalBranding}</p>
                    </CardContent>
                  </Card>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1" data-testid="tabs-variants">
                    <TabsTrigger value="professionale" className="flex flex-col gap-1 py-2 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/30">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-xs">Pro</span>
                    </TabsTrigger>
                    <TabsTrigger value="emotiva" className="flex flex-col gap-1 py-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">Emotiva</span>
                    </TabsTrigger>
                    <TabsTrigger value="luxury" className="flex flex-col gap-1 py-2 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30">
                      <Crown className="h-4 w-4" />
                      <span className="text-xs">Luxury</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex flex-col gap-1 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30">
                      <Instagram className="h-4 w-4" />
                      <span className="text-xs">Social</span>
                    </TabsTrigger>
                    <TabsTrigger value="website" className="flex flex-col gap-1 py-2 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-900/30">
                      <Globe className="h-4 w-4" />
                      <span className="text-xs">Website</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="professionale">
                      {renderVariantCard(result.professionale, 'professionale', getVariantIcon('professionale'), 'indigo')}
                    </TabsContent>
                    <TabsContent value="emotiva">
                      {renderVariantCard(result.emotiva, 'emotiva', getVariantIcon('emotiva'), 'rose')}
                    </TabsContent>
                    <TabsContent value="luxury">
                      {renderVariantCard(result.luxury, 'luxury', getVariantIcon('luxury'), 'amber')}
                    </TabsContent>
                    <TabsContent value="social">
                      {renderVariantCard(result.social, 'social', getVariantIcon('social'), 'purple')}
                    </TabsContent>
                    <TabsContent value="website">
                      {renderVariantCard(result.website, 'website', getVariantIcon('website'), 'cyan')}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
