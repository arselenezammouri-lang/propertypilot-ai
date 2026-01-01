'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  Users, 
  Wallet, 
  Megaphone,
  Target,
  Search,
  Crown,
  Lightbulb,
  FileText,
  Heart,
  Zap,
  Gem,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface CopyVariant {
  titolo: string;
  descrizione: string;
  highlights: string[];
  perchéComprarlo: string[];
  cta: string;
  metaDescription: string;
}

interface PerfectCopyResult {
  professionale: CopyVariant;
  emotivo: CopyVariant;
  breve: CopyVariant;
  seo: CopyVariant;
  luxury: CopyVariant;
  consiglioEsperto: string;
  portaleAdattamento?: string;
}

const TIPI_IMMOBILE = [
  { value: 'appartamento', label: 'Appartamento' },
  { value: 'casa', label: 'Casa Indipendente' },
  { value: 'villa', label: 'Villa' },
  { value: 'attico', label: 'Attico' },
  { value: 'loft', label: 'Loft' },
  { value: 'bilocale', label: 'Bilocale' },
  { value: 'trilocale', label: 'Trilocale' },
  { value: 'monolocale', label: 'Monolocale' },
  { value: 'rustico', label: 'Rustico' },
  { value: 'casale', label: 'Casale' },
  { value: 'palazzo', label: 'Palazzo' },
  { value: 'locale_commerciale', label: 'Locale Commerciale' },
  { value: 'ufficio', label: 'Ufficio' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'garage', label: 'Garage/Box' },
];

const TARGET_ACQUIRENTE = [
  { value: 'famiglie', label: 'Famiglie', icon: '👨‍👩‍👧‍👦' },
  { value: 'giovani_coppie', label: 'Giovani Coppie', icon: '💑' },
  { value: 'investitori', label: 'Investitori', icon: '📈' },
  { value: 'studenti', label: 'Studenti', icon: '🎓' },
  { value: 'professionisti', label: 'Professionisti', icon: '💼' },
  { value: 'pensionati', label: 'Pensionati', icon: '🏖️' },
  { value: 'luxury', label: 'Clientela Luxury', icon: '💎' },
  { value: 'stranieri', label: 'Acquirenti Stranieri', icon: '🌍' },
];

const TONI = [
  { value: 'professionale', label: 'Professionale', description: 'Formale e informativo' },
  { value: 'emotivo', label: 'Emotivo', description: 'Coinvolgente e aspirazionale' },
  { value: 'luxury', label: 'Luxury', description: 'Esclusivo e prestigioso' },
];

const PORTALI = [
  { value: 'generico', label: 'Generico (tutti i portali)' },
  { value: 'immobiliare', label: 'Immobiliare.it' },
  { value: 'idealista', label: 'Idealista.it' },
  { value: 'casa', label: 'Casa.it' },
  { value: 'subito', label: 'Subito.it' },
  { value: 'zillow', label: 'Zillow.com (USA)' },
];

export default function PerfectCopyPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [result, setResult] = useState<PerfectCopyResult | null>(null);
  const [activeTab, setActiveTab] = useState('professionale');

  const [formData, setFormData] = useState({
    tipoImmobile: '',
    zona: '',
    caratteristiche: '',
    puntiForzaList: '',
    targetAcquirente: '',
    fasciaPrezzo: '',
    tono: 'professionale',
    portaleTarget: 'generico',
  });

  const handleSubmit = async () => {
    if (!formData.tipoImmobile || !formData.zona || !formData.caratteristiche || !formData.targetAcquirente) {
      toast({
        title: 'Campi obbligatori',
        description: 'Compila tipo immobile, zona, caratteristiche e target acquirente.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-perfect-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(data.error || 'Troppe richieste. Riprova tra un minuto.');
        }
        throw new Error(data.error || 'Errore durante la generazione');
      }

      setResult(data);
      setActiveTab('professionale');
      
      toast({
        title: '✨ Annunci generati!',
        description: 'Tutte le varianti sono pronte. Scegli quella perfetta per te.',
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Errore durante la generazione',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: 'Copiato!',
        description: 'Testo copiato negli appunti.',
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: 'Errore',
        description: 'Impossibile copiare. Riprova.',
        variant: 'destructive',
      });
    }
  };

  const copyFullVariant = (variant: CopyVariant, name: string) => {
    const fullText = `TITOLO:\n${variant.titolo}\n\nDESCRIZIONE:\n${variant.descrizione}\n\nHIGHLIGHTS:\n${variant.highlights.map(h => `• ${h}`).join('\n')}\n\nPERCHÉ COMPRARLO:\n${variant.perchéComprarlo.map(p => `• ${p}`).join('\n')}\n\nCALL TO ACTION:\n${variant.cta}\n\nMETA DESCRIPTION SEO:\n${variant.metaDescription}`;
    copyToClipboard(fullText, `full-${name}`);
  };

  const renderVariantCard = (variant: CopyVariant, name: string, icon: React.ReactNode, color: string) => (
    <div className="space-y-4" data-testid={`variant-${name}`}>
      <div className="flex justify-end">
        <Button
          onClick={() => copyFullVariant(variant, name)}
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid={`button-copy-full-${name}`}
        >
          {copiedField === `full-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          Copia Tutto
        </Button>
      </div>

      <Card className={`border-${color}-200 dark:border-${color}-800/50 shadow-lg group`}>
        <div className={`h-1 bg-gradient-to-r ${getGradient(name)}`}></div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {icon}
              Titolo
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(variant.titolo, `titolo-${name}`)}
              className="flex-shrink-0"
              data-testid={`button-copy-title-${name}`}
            >
              {copiedField === `titolo-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground">{variant.titolo}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Descrizione Completa
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(variant.descrizione, `descrizione-${name}`)}
              className="flex-shrink-0"
              data-testid={`button-copy-description-${name}`}
            >
              {copiedField === `descrizione-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{variant.descrizione}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-lg group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Highlights
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.highlights.join('\n• '), `highlights-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-highlights-${name}`}
              >
                {copiedField === `highlights-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {variant.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-500 mt-0.5">✦</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Perché Comprarlo
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.perchéComprarlo.join('\n• '), `perche-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-why-${name}`}
              >
                {copiedField === `perche-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {variant.perchéComprarlo.map((motivo, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {motivo}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-lg group bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-purple-500" />
                Call to Action
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.cta, `cta-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-cta-${name}`}
              >
                {copiedField === `cta-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-purple-700 dark:text-purple-300">{variant.cta}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg group bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                Meta Description SEO
                <Badge variant="secondary" className="text-xs">Google</Badge>
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.metaDescription, `meta-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-meta-${name}`}
              >
                {copiedField === `meta-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{variant.metaDescription}</p>
            <p className="text-xs text-blue-500 mt-2">{variant.metaDescription.length}/155 caratteri</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getGradient = (name: string) => {
    switch (name) {
      case 'professionale': return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'emotivo': return 'from-pink-500 via-rose-500 to-red-500';
      case 'breve': return 'from-green-500 via-emerald-500 to-teal-500';
      case 'seo': return 'from-cyan-500 via-blue-500 to-indigo-500';
      case 'luxury': return 'from-amber-500 via-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getVariantIcon = (name: string) => {
    switch (name) {
      case 'professionale': return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'emotivo': return <Heart className="h-5 w-5 text-rose-500" />;
      case 'breve': return <Zap className="h-5 w-5 text-emerald-500" />;
      case 'seo': return <Search className="h-5 w-5 text-cyan-500" />;
      case 'luxury': return <Gem className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/25">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Perfect Real Estate Copy 2.0
                </h1>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  🚀 Power Feature
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Genera 5 varianti professionali del tuo annuncio in un click
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-amber-200 dark:border-amber-800/50 shadow-xl sticky top-8">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Dati Immobile
                </CardTitle>
                <CardDescription>
                  Inserisci i dettagli per generare annunci perfetti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    Tipo Immobile *
                  </Label>
                  <Select
                    value={formData.tipoImmobile}
                    onValueChange={(value) => setFormData({ ...formData, tipoImmobile: value })}
                  >
                    <SelectTrigger data-testid="select-tipo-immobile">
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPI_IMMOBILE.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    Zona/Località *
                  </Label>
                  <Input
                    placeholder="Es: Centro Storico, Milano"
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    data-testid="input-zona"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    Caratteristiche Principali *
                  </Label>
                  <Textarea
                    placeholder="Es: 120mq, 3 camere, 2 bagni, terrazzo, box auto, ristrutturato 2023..."
                    value={formData.caratteristiche}
                    onChange={(e) => setFormData({ ...formData, caratteristiche: e.target.value })}
                    className="min-h-[100px]"
                    data-testid="textarea-caratteristiche"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Punti di Forza
                  </Label>
                  <Textarea
                    placeholder="Es: Vista panoramica, silenzioso, luminoso, vicino metro..."
                    value={formData.puntiForzaList}
                    onChange={(e) => setFormData({ ...formData, puntiForzaList: e.target.value })}
                    className="min-h-[80px]"
                    data-testid="textarea-punti-forza"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-500" />
                    Target Acquirente *
                  </Label>
                  <Select
                    value={formData.targetAcquirente}
                    onValueChange={(value) => setFormData({ ...formData, targetAcquirente: value })}
                  >
                    <SelectTrigger data-testid="select-target">
                      <SelectValue placeholder="Seleziona target" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_ACQUIRENTE.map((target) => (
                        <SelectItem key={target.value} value={target.value}>
                          {target.icon} {target.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-500" />
                    Fascia di Prezzo
                  </Label>
                  <Input
                    placeholder="Es: €350.000 - €400.000"
                    value={formData.fasciaPrezzo}
                    onChange={(e) => setFormData({ ...formData, fasciaPrezzo: e.target.value })}
                    data-testid="input-prezzo"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-amber-500" />
                    Tono Principale
                  </Label>
                  <Select
                    value={formData.tono}
                    onValueChange={(value) => setFormData({ ...formData, tono: value })}
                  >
                    <SelectTrigger data-testid="select-tono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONI.map((tono) => (
                        <SelectItem key={tono.value} value={tono.value}>
                          {tono.label} - {tono.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    Portale Target
                  </Label>
                  <Select
                    value={formData.portaleTarget}
                    onValueChange={(value) => setFormData({ ...formData, portaleTarget: value })}
                  >
                    <SelectTrigger data-testid="select-portale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTALI.map((portale) => (
                        <SelectItem key={portale.value} value={portale.value}>
                          {portale.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-amber-700 dark:text-amber-300">5 Varianti Premium Incluse</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professionale, Emotivo, Breve, SEO e Luxury
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                  size="lg"
                  data-testid="button-generate"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generazione in corso...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Genera 5 Varianti
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
                <CardContent className="py-16 text-center">
                  <Crown className="h-16 w-16 mx-auto text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    Il tuo annuncio perfetto ti aspetta
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Compila il form e genera automaticamente 5 varianti professionali:
                    Professionale, Emotivo, Breve, SEO e Luxury.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <Badge variant="secondary">📋 Professionale</Badge>
                    <Badge variant="secondary">💖 Emotivo</Badge>
                    <Badge variant="secondary">⚡ Breve</Badge>
                    <Badge variant="secondary">🔍 SEO</Badge>
                    <Badge variant="secondary">💎 Luxury</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="border-amber-200 dark:border-amber-800/50">
                <CardContent className="py-16 text-center">
                  <Loader2 className="h-16 w-16 mx-auto text-amber-500 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Generazione AI in corso...</h3>
                  <p className="text-muted-foreground">
                    Stiamo creando 5 varianti ottimizzate del tuo annuncio
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {result.consiglioEsperto && (
                  <Card className="border-amber-200 dark:border-amber-800/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Consiglio dell'Esperto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">{result.consiglioEsperto}</p>
                    </CardContent>
                  </Card>
                )}

                {result.portaleAdattamento && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <strong>Adattamento portale:</strong> {result.portaleAdattamento}
                    </p>
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 h-auto p-1" data-testid="tabs-variants">
                    <TabsTrigger value="professionale" className="flex flex-col gap-1 py-2 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/30">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs">Pro</span>
                    </TabsTrigger>
                    <TabsTrigger value="emotivo" className="flex flex-col gap-1 py-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">Emotivo</span>
                    </TabsTrigger>
                    <TabsTrigger value="breve" className="flex flex-col gap-1 py-2 data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30">
                      <Zap className="h-4 w-4" />
                      <span className="text-xs">Breve</span>
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex flex-col gap-1 py-2 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-900/30">
                      <Search className="h-4 w-4" />
                      <span className="text-xs">SEO</span>
                    </TabsTrigger>
                    <TabsTrigger value="luxury" className="flex flex-col gap-1 py-2 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30">
                      <Gem className="h-4 w-4" />
                      <span className="text-xs">Luxury</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="professionale">
                      {renderVariantCard(result.professionale, 'professionale', getVariantIcon('professionale'), 'indigo')}
                    </TabsContent>
                    <TabsContent value="emotivo">
                      {renderVariantCard(result.emotivo, 'emotivo', getVariantIcon('emotivo'), 'rose')}
                    </TabsContent>
                    <TabsContent value="breve">
                      {renderVariantCard(result.breve, 'breve', getVariantIcon('breve'), 'emerald')}
                    </TabsContent>
                    <TabsContent value="seo">
                      {renderVariantCard(result.seo, 'seo', getVariantIcon('seo'), 'cyan')}
                    </TabsContent>
                    <TabsContent value="luxury">
                      {renderVariantCard(result.luxury, 'luxury', getVariantIcon('luxury'), 'amber')}
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
