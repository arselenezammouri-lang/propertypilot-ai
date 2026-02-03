"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ArrowLeft, 
  Instagram, 
  Facebook, 
  Hash, 
  Video, 
  Copy, 
  Check, 
  Sparkles,
  Building2,
  Heart,
  Crown,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Loader2,
  Sun,
  Moon
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import Link from "next/link";
import { useTheme } from "next-themes";

type Tono = "professionale" | "emotivo" | "luxury";
type Lunghezza = "breve" | "standard" | "lunga";

const TIPO_TRANSAZIONE_OPTIONS = [
  { value: 'vendita', label: 'Vendita', icon: '🏷️' },
  { value: 'affitto', label: 'Affitto', icon: '🔑' },
  { value: 'affitto_breve', label: 'Affitto Breve / Turistico', icon: '🏖️' },
];

interface SocialPostResponse {
  instagramPost: string;
  facebookPost: string;
  hashtags: string[];
  tiktokScript: string;
}

interface FormData {
  tipoTransazione: string;
  titolo: string;
  descrizione: string;
  prezzo: string;
  superficie: string;
  camere: string;
  bagni: string;
  localita: string;
  tono: Tono;
  lunghezza: Lunghezza;
}

const TONI_OPTIONS = [
  { 
    value: "professionale" as Tono, 
    label: "Professionale", 
    description: "Formale e autorevole",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    value: "emotivo" as Tono, 
    label: "Emotivo", 
    description: "Coinvolgente e caldo",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    value: "luxury" as Tono, 
    label: "Luxury", 
    description: "Esclusivo e raffinato",
    icon: Crown,
    gradient: "from-amber-500 to-yellow-500"
  },
];

const LUNGHEZZA_OPTIONS = [
  { 
    value: "breve" as Lunghezza, 
    label: "Breve", 
    description: "30 parole IG",
    icon: AlignLeft 
  },
  { 
    value: "standard" as Lunghezza, 
    label: "Standard", 
    description: "60 parole IG",
    icon: AlignCenter 
  },
  { 
    value: "lunga" as Lunghezza, 
    label: "Lunga", 
    description: "100 parole IG",
    icon: AlignJustify 
  },
];

export default function SocialPostsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    titolo: "",
    descrizione: "",
    prezzo: "",
    superficie: "",
    camere: "",
    bagni: "",
    localita: "",
    tono: "professionale",
    lunghezza: "standard",
  });
  
  const [result, setResult] = useState<SocialPostResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/generate-social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore nella generazione");
      }
      
      return response.json() as Promise<SocialPostResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Post generati con successo!",
        description: "I tuoi contenuti social sono pronti per essere copiati.",
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
    
    if (!formData.titolo || formData.titolo.length < 5) {
      toast({
        title: "Titolo richiesto",
        description: "Inserisci un titolo di almeno 5 caratteri",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.descrizione || formData.descrizione.length < 20) {
      toast({
        title: "Descrizione richiesta",
        description: "Inserisci una descrizione di almeno 20 caratteri",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copiato!",
        description: "Testo copiato negli appunti",
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il testo",
        variant: "destructive",
      });
    }
  };

  const copyHashtags = () => {
    if (result?.hashtags) {
      copyToClipboard(result.hashtags.join(" "), "hashtags");
    }
  };

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
                <p className="text-xs text-slate-500 dark:text-slate-400">Social Posts</p>
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
          <h1 className="text-4xl font-bold mb-2">
            Generatore{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Post Social
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Crea contenuti virali per Instagram, Facebook e TikTok in pochi secondi
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900" data-testid="card-form">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Informazioni Immobile
                </CardTitle>
                <CardDescription>
                  Inserisci i dati per generare i post social
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo Annuncio</Label>
                      <Select
                        value={formData.tipoTransazione}
                        onValueChange={(value) => setFormData({ ...formData, tipoTransazione: value })}
                      >
                        <SelectTrigger className="mt-1.5" data-testid="select-tipo-transazione">
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

                    <div>
                      <Label htmlFor="titolo">Titolo *</Label>
                      <Input
                        id="titolo"
                        placeholder="Es: Villa di Lusso con Vista Mare"
                        value={formData.titolo}
                        onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-titolo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="descrizione">Descrizione *</Label>
                      <Textarea
                        id="descrizione"
                        placeholder="Descrivi l'immobile in dettaglio..."
                        value={formData.descrizione}
                        onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                        className="mt-1.5 min-h-[100px]"
                        data-testid="input-descrizione"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prezzo">Prezzo</Label>
                        <Input
                          id="prezzo"
                          placeholder="€ 450.000"
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                      <div>
                        <Label htmlFor="bagni">Bagni</Label>
                        <Input
                          id="bagni"
                          placeholder="2"
                          value={formData.bagni}
                          onChange={(e) => setFormData({ ...formData, bagni: e.target.value })}
                          className="mt-1.5"
                          data-testid="input-bagni"
                        />
                      </div>
                      <div>
                        <Label htmlFor="localita">Località</Label>
                        <Input
                          id="localita"
                          placeholder="Milano"
                          value={formData.localita}
                          onChange={(e) => setFormData({ ...formData, localita: e.target.value })}
                          className="mt-1.5"
                          data-testid="input-localita"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Tono del Messaggio</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {TONI_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, tono: option.value })}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              formData.tono === option.value
                                ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                            }`}
                            data-testid={`button-tono-${option.value}`}
                          >
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${
                              formData.tono === option.value ? "text-white" : "text-slate-600 dark:text-slate-400"
                            }`} />
                            <div className={`font-semibold text-sm ${
                              formData.tono !== option.value && "text-slate-900 dark:text-white"
                            }`}>
                              {option.label}
                            </div>
                            <div className={`text-xs ${
                              formData.tono === option.value ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                            }`}>
                              {option.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Lunghezza</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {LUNGHEZZA_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, lunghezza: option.value })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.lunghezza === option.value
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                            data-testid={`button-lunghezza-${option.value}`}
                          >
                            <Icon className={`h-5 w-5 mx-auto mb-2 ${
                              formData.lunghezza === option.value ? "text-indigo-600" : "text-slate-500"
                            }`} />
                            <div className={`font-semibold text-sm ${
                              formData.lunghezza === option.value ? "text-indigo-600" : "text-slate-900 dark:text-white"
                            }`}>
                              {option.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {option.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generazione in corso...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Genera Post Social
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {!result && !generateMutation.isPending && (
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50" data-testid="card-placeholder">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    I tuoi post appariranno qui
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Compila il form e clicca "Genera Post Social" per creare contenuti virali
                  </p>
                </CardContent>
              </Card>
            )}

            {generateMutation.isPending && (
              <Card className="border-0 shadow-xl shadow-purple-500/10 bg-white dark:bg-slate-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-500" />
                  </div>
                  <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
                    Generazione contenuti AI...
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Stiamo creando post ottimizzati per ogni piattaforma
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-4">
                <Card className="border-0 shadow-xl shadow-pink-500/10 bg-white dark:bg-slate-900 overflow-hidden" data-testid="card-instagram">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-5 w-5" />
                        Instagram Post
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(result.instagramPost, "instagram")}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                        data-testid="button-copy-instagram"
                      >
                        {copiedField === "instagram" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div 
                      className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      data-testid="text-instagram-post"
                    >
                      {result.instagramPost}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-blue-500/10 bg-white dark:bg-slate-900 overflow-hidden" data-testid="card-facebook">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-5 w-5" />
                        Facebook Post
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(result.facebookPost, "facebook")}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                        data-testid="button-copy-facebook"
                      >
                        {copiedField === "facebook" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div 
                      className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      data-testid="text-facebook-post"
                    >
                      {result.facebookPost}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-slate-500/10 bg-white dark:bg-slate-900 overflow-hidden" data-testid="card-hashtags">
                  <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Hashtag Consigliati
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={copyHashtags}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                        data-testid="button-copy-hashtags"
                      >
                        {copiedField === "hashtags" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2" data-testid="container-hashtags">
                      {result.hashtags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-cyan-500/10 bg-white dark:bg-slate-900 overflow-hidden" data-testid="card-tiktok">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SiTiktok className="h-5 w-5" />
                        TikTok / Reels Script
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(result.tiktokScript, "tiktok")}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                        data-testid="button-copy-tiktok"
                      >
                        {copiedField === "tiktok" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div 
                      className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg"
                      data-testid="text-tiktok-script"
                    >
                      {result.tiktokScript}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
