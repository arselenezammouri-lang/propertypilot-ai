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
  Video, 
  Clock, 
  Crown,
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  ArrowLeft,
  Lightbulb,
  Zap,
  Film,
  Camera,
  Hash,
  Play
} from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface VideoScene {
  numero: number;
  timestamp: string;
  testo: string;
  indicazioniVisive: string;
}

interface VideoScript {
  hook: string;
  scenes: VideoScene[];
  cta: string;
  hashtags: string[];
  durata: string;
}

interface VideoScriptResult {
  script15s: VideoScript;
  script30s: VideoScript;
  script60s: VideoScript;
  scriptLuxury: VideoScript;
  hooksVirali: string[];
  consiglioVideo: string;
  cached?: boolean;
}

interface FormData {
  type: string;
  location: string;
  price: string;
  features: string;
  strengths: string;
  targetBuyer: "famiglie" | "investitori" | "luxury" | "studenti";
  tone: "professionale" | "energico" | "luxury" | "emozionale";
}

const SCRIPT_TYPES = [
  { id: "script15s", label: "15 Secondi", icon: Zap, description: "TikTok/Reels" },
  { id: "script30s", label: "30 Secondi", icon: Clock, description: "Reels/Shorts" },
  { id: "script60s", label: "60 Secondi", icon: Film, description: "Tour completo" },
  { id: "scriptLuxury", label: "Luxury", icon: Crown, description: "Cinematografico" },
  { id: "hooksVirali", label: "Hooks", icon: Sparkles, description: "5 aperture" },
] as const;

export default function VideoScriptsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoScriptResult | null>(null);
  const [activeTab, setActiveTab] = useState("script15s");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    type: "",
    location: "",
    price: "",
    features: "",
    strengths: "",
    targetBuyer: "famiglie",
    tone: "professionale",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.type.trim() || formData.type.length < 5) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il tipo di immobile (min 5 caratteri)",
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

    if (!formData.price.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il prezzo",
        variant: "destructive",
      });
      return;
    }

    if (!formData.features.trim() || formData.features.length < 10) {
      toast({
        title: "Campo obbligatorio",
        description: "Descrivi le caratteristiche (min 10 caratteri)",
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

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-video-script", {
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
      setActiveTab("script15s");
      toast({
        title: "Script generati con successo!",
        description: data.cached ? "Risultato dalla cache (24h)" : "5 script video pronti per le riprese",
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

  const copyFullScript = async (script: VideoScript, scriptType: string) => {
    const scenesText = script.scenes.map(s => 
      `[${s.timestamp}] Scena ${s.numero}\n📝 ${s.testo}\n🎬 ${s.indicazioniVisive}`
    ).join('\n\n');
    
    const fullText = `🎬 VIDEO SCRIPT - ${script.durata}\n\n` +
      `🎯 HOOK:\n${script.hook}\n\n` +
      `📹 SCENE:\n${scenesText}\n\n` +
      `📢 CTA:\n${script.cta}\n\n` +
      `#️⃣ HASHTAG:\n${script.hashtags.join(' ')}`;
    
    copyToClipboard(fullText, `full-${scriptType}`);
  };

  const renderScriptCard = (script: VideoScript, scriptType: string) => {
    const typeInfo = SCRIPT_TYPES.find(t => t.id === scriptType) || SCRIPT_TYPES[0];
    const Icon = typeInfo.icon;
    
    return (
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-5 w-5 text-purple-600" />
              Script {typeInfo.label}
              <Badge variant="outline" className="ml-2 text-xs">
                {script.durata}
              </Badge>
            </CardTitle>
            <Button
              variant="default"
              size="sm"
              onClick={() => copyFullScript(script, scriptType)}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
              data-testid={`button-copy-full-${scriptType}`}
            >
              {copiedField === `full-${scriptType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              Copia Script
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3" /> Hook Iniziale
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(script.hook, `hook-${scriptType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-hook-${scriptType}`}
              >
                {copiedField === `hook-${scriptType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              "{script.hook}"
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Film className="h-3 w-3" /> Scene ({script.scenes.length})
            </Label>
            <div className="space-y-3">
              {script.scenes.map((scene, idx) => (
                <div key={idx} className="bg-muted/50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Scena {scene.numero}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded">
                        {scene.timestamp}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`[${scene.timestamp}] ${scene.testo}\n🎬 ${scene.indicazioniVisive}`, `scene-${scriptType}-${idx}`)}
                      className="h-6 px-2"
                      data-testid={`button-copy-scene-${scriptType}-${idx}`}
                    >
                      {copiedField === `scene-${scriptType}-${idx}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <p className="text-foreground font-medium mb-2">{scene.testo}</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Camera className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-500" />
                    <span className="italic">{scene.indicazioniVisive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Play className="h-3 w-3" /> Call-to-Action
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(script.cta, `cta-${scriptType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-cta-${scriptType}`}
              >
                {copiedField === `cta-${scriptType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
              {script.cta}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" /> Hashtag Consigliati
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(script.hashtags.join(' '), `hashtags-${scriptType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-hashtags-${scriptType}`}
              >
                {copiedField === `hashtags-${scriptType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {script.hashtags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHooksCard = (hooks: string[]) => (
    <Card className="border-pink-200 dark:border-pink-800">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-pink-600" />
            5 Hooks Virali
            <Badge variant="outline" className="ml-2 text-xs">
              Aperture video
            </Badge>
          </CardTitle>
          <Button
            variant="default"
            size="sm"
            onClick={() => copyToClipboard(hooks.join('\n\n'), 'all-hooks')}
            className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700"
            data-testid="button-copy-all-hooks"
          >
            {copiedField === 'all-hooks' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            Copia Tutti
          </Button>
        </div>
        <CardDescription>
          Frasi d'apertura testate per massimizzare engagement e watch time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {hooks.map((hook, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {idx + 1}
            </div>
            <p className="flex-1 text-foreground font-medium">"{hook}"</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(hook, `hook-viral-${idx}`)}
              className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`button-copy-hook-viral-${idx}`}
            >
              {copiedField === `hook-viral-${idx}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <Video className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Video Script AI
          </h1>
          <p className="text-muted-foreground">
            Genera script professionali per i tuoi video immobiliari
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          Video Creator AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Dati Immobile
            </CardTitle>
            <CardDescription>
              Inserisci le informazioni per generare script video personalizzati
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo di Immobile *</Label>
              <Input
                id="type"
                placeholder="es. Attico con terrazzo panoramico"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                data-testid="input-type"
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
              <Label htmlFor="features">Caratteristiche Principali *</Label>
              <Textarea
                id="features"
                placeholder="es. 3 camere, 2 bagni, terrazzo 50mq, vista Duomo, ascensore..."
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows={3}
                data-testid="input-features"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">Punti di Forza *</Label>
              <Textarea
                id="strengths"
                placeholder="es. Posizione esclusiva, finiture di pregio, luminosità eccezionale..."
                value={formData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                rows={2}
                data-testid="input-strengths"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="targetBuyer">Target Buyer</Label>
                <Select
                  value={formData.targetBuyer}
                  onValueChange={(value: FormData["targetBuyer"]) => 
                    handleInputChange("targetBuyer", value)
                  }
                >
                  <SelectTrigger data-testid="select-target">
                    <SelectValue placeholder="Seleziona target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="famiglie">Famiglie</SelectItem>
                    <SelectItem value="investitori">Investitori</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="studenti">Studenti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tono Video</Label>
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
                    <SelectItem value="energico">Energico</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="emozionale">Emozionale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              data-testid="button-generate-scripts"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generazione in corso...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Genera 5 Script Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Video className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nessuno script generato
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Compila il form con i dati dell'immobile e clicca "Genera" per creare 
                  script video professionali con timestamp e indicazioni visive.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Generazione in corso...</h3>
                <p className="text-sm text-muted-foreground">
                  Stiamo creando 5 script video personalizzati
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioVideo && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Consiglio per le Riprese
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {result.consiglioVideo}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 gap-1 h-auto p-1">
                  {SCRIPT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30"
                        data-testid={`tab-${type.id}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{type.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="script15s" className="mt-4">
                  {renderScriptCard(result.script15s, "script15s")}
                </TabsContent>
                <TabsContent value="script30s" className="mt-4">
                  {renderScriptCard(result.script30s, "script30s")}
                </TabsContent>
                <TabsContent value="script60s" className="mt-4">
                  {renderScriptCard(result.script60s, "script60s")}
                </TabsContent>
                <TabsContent value="scriptLuxury" className="mt-4">
                  {renderScriptCard(result.scriptLuxury, "scriptLuxury")}
                </TabsContent>
                <TabsContent value="hooksVirali" className="mt-4">
                  {renderHooksCard(result.hooksVirali)}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
