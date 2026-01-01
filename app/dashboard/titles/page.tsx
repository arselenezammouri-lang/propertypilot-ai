"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles,
  Building2,
  Heart,
  Crown,
  Loader2,
  Sun,
  Moon,
  Zap,
  Target,
  Search,
  Star,
  TrendingUp,
  MousePointerClick
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tono = "professionale" | "emotivo" | "luxury";
type TipoImmobile = "casa" | "appartamento" | "villa" | "locale" | "terreno" | "ufficio";

interface TitlesResponse {
  titoli: string[];
  clickbait: string[];
  luxury: string[];
  seo: string[];
  migliore: {
    titolo: string;
    motivazione: string;
  };
}

interface FormData {
  tipoImmobile: TipoImmobile;
  localita: string;
  prezzo: string;
  superficie: string;
  camere: string;
  puntiChiave: string;
  tono: Tono;
}

const TIPO_IMMOBILE_OPTIONS = [
  { value: "appartamento" as TipoImmobile, label: "Appartamento" },
  { value: "casa" as TipoImmobile, label: "Casa" },
  { value: "villa" as TipoImmobile, label: "Villa" },
  { value: "locale" as TipoImmobile, label: "Locale Commerciale" },
  { value: "ufficio" as TipoImmobile, label: "Ufficio" },
  { value: "terreno" as TipoImmobile, label: "Terreno" },
];

const TONI_OPTIONS = [
  { 
    value: "professionale" as Tono, 
    label: "Professionale", 
    description: "Chiaro e informativo",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    value: "emotivo" as Tono, 
    label: "Emotivo", 
    description: "Aspirazionale e coinvolgente",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    value: "luxury" as Tono, 
    label: "Luxury", 
    description: "Esclusivo e prestigioso",
    icon: Crown,
    gradient: "from-amber-500 to-yellow-500"
  },
];

const TITLE_CATEGORIES = [
  {
    key: "titoli",
    label: "Titoli Alto CTR",
    description: "10 titoli ottimizzati per massimizzare i click",
    icon: MousePointerClick,
    gradient: "from-indigo-500 to-purple-500",
    shadowColor: "shadow-indigo-500/20",
    badge: "CTR +40%"
  },
  {
    key: "clickbait",
    label: "Clickbait Soft",
    description: "Attirano curiosità senza essere spam",
    icon: Zap,
    gradient: "from-orange-500 to-red-500",
    shadowColor: "shadow-orange-500/20",
    badge: "Virale"
  },
  {
    key: "luxury",
    label: "Luxury",
    description: "Per immobili di alto livello e clienti facoltosi",
    icon: Crown,
    gradient: "from-amber-500 to-yellow-500",
    shadowColor: "shadow-amber-500/20",
    badge: "Premium"
  },
  {
    key: "seo",
    label: "SEO Optimized",
    description: "Ottimizzati per Google e portali immobiliari",
    icon: Search,
    gradient: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
    badge: "Ranking"
  },
];

export default function TitlesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    tipoImmobile: "appartamento",
    localita: "",
    prezzo: "",
    superficie: "",
    camere: "",
    puntiChiave: "",
    tono: "professionale",
  });
  
  const [result, setResult] = useState<TitlesResponse | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore nella generazione");
      }
      
      return response.json() as Promise<TitlesResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Titoli generati con successo!",
        description: "19 titoli ad alto CTR sono pronti per essere utilizzati.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.localita || formData.localita.length < 2) {
      toast({
        title: "Località richiesta",
        description: "Inserisci la località dell'immobile",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.puntiChiave || formData.puntiChiave.length < 10) {
      toast({
        title: "Punti chiave richiesti",
        description: "Descrivi almeno i punti chiave dell'immobile (min 10 caratteri)",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(text);
      toast({
        title: "Copiato!",
        description: "Titolo copiato negli appunti",
      });
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il testo",
        variant: "destructive",
      });
    }
  };

  const TitleCard = ({ title, index, category }: { title: string; index: number; category: string }) => (
    <div 
      className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
      data-testid={`title-${category}-${index}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {index + 1}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
          {title}
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => copyToClipboard(title)}
        className="flex-shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        data-testid={`button-copy-${category}-${index}`}
      >
        {copiedTitle === title ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  PropertyPilot AI
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Titoli A/B</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">
              Generatore{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Titoli A/B
              </span>
            </h1>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/25">
              <TrendingUp className="h-3 w-3 mr-1" />
              CTR +40%
            </Badge>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Genera 19 titoli ad alto conversion rate ottimizzati per massimizzare i click sui tuoi annunci
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900" data-testid="card-form">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-500" />
                  Dati Immobile
                </CardTitle>
                <CardDescription>
                  Inserisci le informazioni per generare titoli ottimizzati
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipoImmobile">Tipo Immobile *</Label>
                      <Select
                        value={formData.tipoImmobile}
                        onValueChange={(value: TipoImmobile) => setFormData({ ...formData, tipoImmobile: value })}
                      >
                        <SelectTrigger className="mt-1.5" data-testid="select-tipo-immobile">
                          <SelectValue placeholder="Seleziona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPO_IMMOBILE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="localita">Località *</Label>
                      <Input
                        id="localita"
                        placeholder="Es: Milano Centro"
                        value={formData.localita}
                        onChange={(e) => setFormData({ ...formData, localita: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-localita"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prezzo">Prezzo</Label>
                      <Input
                        id="prezzo"
                        placeholder="€ 350.000"
                        value={formData.prezzo}
                        onChange={(e) => setFormData({ ...formData, prezzo: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-prezzo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="superficie">Superficie</Label>
                      <Input
                        id="superficie"
                        placeholder="120 mq"
                        value={formData.superficie}
                        onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-superficie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="camere">Camere</Label>
                      <Input
                        id="camere"
                        placeholder="3"
                        value={formData.camere}
                        onChange={(e) => setFormData({ ...formData, camere: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-camere"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="puntiChiave">Punti Chiave dell'Immobile *</Label>
                    <Textarea
                      id="puntiChiave"
                      placeholder="Descrivi le caratteristiche principali: balcone, garage, giardino, vista, ristrutturato, luminoso..."
                      value={formData.puntiChiave}
                      onChange={(e) => setFormData({ ...formData, puntiChiave: e.target.value })}
                      className="mt-1.5 min-h-[80px]"
                      data-testid="input-punti-chiave"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Tono dei Titoli</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {TONI_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, tono: option.value })}
                            className={`relative p-3 rounded-xl border-2 transition-all ${
                              formData.tono === option.value
                                ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                            }`}
                            data-testid={`button-tono-${option.value}`}
                          >
                            <Icon className={`h-5 w-5 mx-auto mb-1.5 ${
                              formData.tono === option.value ? "text-white" : "text-slate-600 dark:text-slate-400"
                            }`} />
                            <div className={`font-semibold text-xs ${
                              formData.tono !== option.value && "text-slate-900 dark:text-white"
                            }`}>
                              {option.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generazione titoli...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Genera 19 Titoli A/B
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {!result && !generateMutation.isPending && (
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50" data-testid="card-placeholder">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <MousePointerClick className="h-10 w-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    I tuoi titoli appariranno qui
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Compila il form e clicca "Genera 19 Titoli A/B" per creare titoli ad alto CTR
                  </p>
                </CardContent>
              </Card>
            )}

            {generateMutation.isPending && (
              <Card className="border-0 shadow-xl shadow-indigo-500/10 bg-white dark:bg-slate-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500" />
                  </div>
                  <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
                    Generazione titoli AI...
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Stiamo creando 19 titoli ottimizzati per il massimo CTR
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl shadow-green-500/10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 overflow-hidden" data-testid="card-best-title">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current" />
                      Miglior Titolo Consigliato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3" data-testid="text-best-title">
                          {result.migliore.titolo}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-best-motivation">
                          {result.migliore.motivazione}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(result.migliore.titolo)}
                        className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white"
                        data-testid="button-copy-best"
                      >
                        {copiedTitle === result.migliore.titolo ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {TITLE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const titles = result[category.key as keyof typeof result] as string[];
                    
                    if (!titles || !Array.isArray(titles)) return null;
                    
                    return (
                      <Card 
                        key={category.key}
                        className={`border-0 shadow-xl ${category.shadowColor} bg-white dark:bg-slate-900 overflow-hidden`}
                        data-testid={`card-${category.key}`}
                      >
                        <CardHeader className={`bg-gradient-to-r ${category.gradient} text-white py-4`}>
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {category.label}
                            </div>
                            <Badge className="bg-white/20 text-white border-0 text-xs">
                              {category.badge}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-white/80 text-xs">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          {titles.map((title, index) => (
                            <TitleCard 
                              key={index} 
                              title={title} 
                              index={index} 
                              category={category.key}
                            />
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
