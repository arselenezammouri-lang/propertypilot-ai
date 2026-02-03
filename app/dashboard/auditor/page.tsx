'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  FileText, 
  Link2, 
  Award, 
  TrendingUp, 
  Search,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Users,
  Target,
  Loader2,
  Copy,
  Check,
  Globe,
  ShoppingCart,
  Crown,
  Share2,
  Heart,
  AlertCircle,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { ProFeaturePaywall } from '@/components/demo-modal';

interface StructuralAudit {
  titolo: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  apertura: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  corpo: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
  callToAction: { valutazione: string; punteggio: number; problemi: string[]; suggerimenti: string[] };
}

interface SEOAudit {
  punteggioSEO: number;
  keywordsMancanti: string[];
  ottimizzazioneH1: { presente: boolean; valutazione: string; suggerimento: string };
  problemiLeggibilita: string[];
  metaDescriptionConsigliata: string;
  keywordsPresenti: string[];
  densitaKeywords: string;
}

interface EmotionalAudit {
  tono: { attuale: string; ideale: string; valutazione: string };
  puntiDeboli: string[];
  sensazioniMancanti: string[];
  opportunitaNarrative: string[];
  connessioneEmotiva: number;
}

interface RedFlag {
  gravita: 'critica' | 'alta' | 'media';
  problema: string;
  soluzione: string;
  impatto: string;
}

interface AISuggestion {
  titolo: string;
  descrizione: string;
  priorita: number;
  impattoPrevisto: string;
}

interface OptimizedVersion {
  titolo: string;
  descrizione: string;
  highlights: string[];
  callToAction: string;
  metaDescription: string;
}

interface AuditResult {
  qualityScore: number;
  scoreBreakdown: { struttura: number; seo: number; emozioni: number; persuasivita: number };
  structuralAudit: StructuralAudit;
  seoAudit: SEOAudit;
  emotionalAudit: EmotionalAudit;
  redFlags: RedFlag[];
  suggestions: AISuggestion[];
  optimizedVersion: OptimizedVersion;
  targetBuyer: string;
  mercatoAnalisi: string;
}

const OBIETTIVI = [
  { value: 'vendita', label: 'Vendita', icon: ShoppingCart, description: 'Massimizza conversioni' },
  { value: 'seo', label: 'SEO', icon: Search, description: 'Visibilità portali' },
  { value: 'luxury', label: 'Luxury', icon: Crown, description: 'Target alto spendente' },
  { value: 'social', label: 'Social', icon: Share2, description: 'Engagement social' },
];

const MERCATI = [
  { value: 'italia', label: '🇮🇹 Italia', portali: 'Immobiliare, Idealista, Casa, Subito' },
  { value: 'usa', label: '🇺🇸 USA', portali: 'Zillow, Realtor, Redfin, Trulia' },
];

const TIPO_TRANSAZIONE_OPTIONS = [
  { value: 'vendita', label: 'Vendita', icon: '🏷️' },
  { value: 'affitto', label: 'Affitto', icon: '🔑' },
  { value: 'affitto_breve', label: 'Affitto Breve / Turistico', icon: '🏖️' },
];

export default function AuditorPage() {
  const { toast } = useToast();
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mercato, setMercato] = useState<'italia' | 'usa'>('italia');
  const [obiettivo, setObiettivo] = useState<'seo' | 'vendita' | 'luxury' | 'social'>('vendita');
  const [tipoTransazione, setTipoTransazione] = useState<'vendita' | 'affitto' | 'affitto_breve'>('vendita');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'agency'>('free');
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({ title: 'Copiato!', description: 'Testo copiato negli appunti' });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleAnalyze = async () => {
    if (inputMode === 'text' && (!textInput.trim() || textInput.trim().length < 50)) {
      toast({
        variant: 'destructive',
        title: 'Testo insufficiente',
        description: 'Inserisci almeno 50 caratteri di testo',
      });
      return;
    }

    if (inputMode === 'url' && !urlInput.trim()) {
      toast({
        variant: 'destructive',
        title: 'URL richiesto',
        description: 'Inserisci l\'URL dell\'annuncio da analizzare',
      });
      return;
    }

    setIsAnalyzing(true);
    setAuditResult(null);

    try {
      const payload = {
        ...(inputMode === 'text' ? { text: textInput } : { url: urlInput }),
        imageUrl: imageUrl || undefined,
        mercato,
        obiettivo,
        tipoTransazione,
      };

      const response = await fetch('/api/audit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        toast({
          variant: 'destructive',
          title: 'Errore durante l\'analisi',
          description: 'Errore di comunicazione con il server. Riprova tra qualche secondo.',
          duration: 8000,
        });
        return;
      }

      if (!response.ok) {
        // If 403, update user plan to free and show paywall
        if (response.status === 403) {
          setUserPlan('free');
          toast({
            variant: 'destructive',
            title: 'Piano Premium richiesto',
            description: result.message || result.error || 'L\'Audit Immobiliare AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
            duration: 8000,
          });
          return;
        }
        
        const errorMessage = result.message || result.error || 'Errore durante l\'analisi';
        toast({
          variant: 'destructive',
          title: 'Errore durante l\'analisi',
          description: result.suggestion ? `${errorMessage}\n\n💡 ${result.suggestion}` : errorMessage,
          duration: 8000,
        });
        return;
      }

      if (result.success && result.data) {
        setAuditResult(result.data);
        toast({
          title: 'Analisi completata!',
          description: `Punteggio qualità: ${result.data.qualityScore}/100`,
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Errore durante l\'analisi',
        description: error.message || 'Impossibile connettersi al server.',
        duration: 8000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Eccellente';
    if (score >= 80) return 'Ottimo';
    if (score >= 70) return 'Buono';
    if (score >= 60) return 'Discreto';
    if (score >= 50) return 'Sufficiente';
    return 'Da migliorare';
  };

  const getGravitaColor = (gravita: string) => {
    switch (gravita) {
      case 'critica': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'alta': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default: return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    }
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, section)}
      className="h-8 px-2"
      data-testid={`button-copy-${section}`}
    >
      {copiedSection === section ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  // Load user subscription plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();
        
        if (data.success && data.data) {
          const plan = (data.data.status || 'free') as 'free' | 'starter' | 'pro' | 'agency';
          setUserPlan(plan);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    };
    
    fetchUserPlan();
  }, []);

  const isLocked = userPlan !== 'pro' && userPlan !== 'agency';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Dashboard
          </Link>
        </div>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-amber-500/20 border border-blue-400/30">
            <Award className="h-8 w-8 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Real Estate Audit AI
            </h1>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              🔥 Expert
            </Badge>
          </div>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
            Analisi professionale completa: struttura, SEO, emozioni, red flags e versione ottimizzata
          </p>
        </div>

        <ProFeaturePaywall
          title="Audit Immobiliare AI"
          description="Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare l'audit completo."
          isLocked={isLocked && !isLoadingPlan}
        >
          <Card className="mb-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30 shadow-2xl shadow-blue-500/10" data-testid="card-input">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <FileText className="h-6 w-6 text-blue-400" />
                Analizza il tuo Annuncio
              </CardTitle>
              <CardDescription className="text-blue-200/60">
                Incolla il testo o inserisci l'URL per ricevere un audit completo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-3 mb-6">
                <Label className="text-blue-200">Tipo Annuncio</Label>
                <Select value={tipoTransazione} onValueChange={(v) => setTipoTransazione(v as 'vendita' | 'affitto' | 'affitto_breve')}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-tipo-transazione">
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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-blue-200">Mercato di riferimento</Label>
                <Select value={mercato} onValueChange={(v) => setMercato(v as 'italia' | 'usa')}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-mercato">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MERCATI.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.label}</span>
                          <span className="text-xs text-muted-foreground">{m.portali}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-blue-200">Obiettivo principale</Label>
                <Select value={obiettivo} onValueChange={(v) => setObiettivo(v as 'seo' | 'vendita' | 'luxury' | 'social')}>
                  <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white" data-testid="select-obiettivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OBIETTIVI.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <div className="flex items-center gap-2">
                          <o.icon className="h-4 w-4" />
                          <span className="font-medium">{o.label}</span>
                          <span className="text-xs text-muted-foreground">- {o.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'text' | 'url')}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="text" className="data-[state=active]:bg-blue-600" data-testid="tab-text">
                  <FileText className="h-4 w-4 mr-2" />
                  Inserisci Testo
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-blue-600" data-testid="tab-url">
                  <Link2 className="h-4 w-4 mr-2" />
                  URL Annuncio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <Textarea
                  data-testid="textarea-listing"
                  placeholder="Incolla qui il testo completo dell'annuncio immobiliare (minimo 50 caratteri)..."
                  className="min-h-[200px] resize-y bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <p className={`text-sm ${textInput.length < 50 ? 'text-amber-400' : 'text-blue-200/60'}`}>
                  Caratteri: {textInput.length}/50 minimo
                </p>
              </TabsContent>

              <TabsContent value="url" className="space-y-4 mt-4">
                <Input
                  data-testid="input-url"
                  type="url"
                  placeholder="https://www.immobiliare.it/annunci/..."
                  className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-sm text-blue-200/60">
                  Supportati: Immobiliare.it, Idealista.it, Casa.it, Subito.it, Zillow.com
                </p>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Label className="text-blue-200 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                URL Immagine (opzionale)
              </Label>
              <Input
                data-testid="input-image-url"
                type="url"
                placeholder="https://esempio.com/immagine.jpg"
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/40"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <Button
              data-testid="button-analyze"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 hover:from-blue-500 hover:via-purple-500 hover:to-amber-400 text-white font-bold shadow-lg shadow-blue-500/25"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Analisi in corso... (30-60 sec)
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  Avvia Audit Completo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        </ProFeaturePaywall>

        {auditResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20" data-testid="card-quality-score">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-blue-200/60 text-sm uppercase tracking-wider mb-2">Punteggio Qualità</p>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-7xl md:text-8xl font-black bg-gradient-to-r ${getScoreGradient(auditResult.qualityScore)} bg-clip-text text-transparent`} data-testid="text-quality-score">
                        {auditResult.qualityScore}
                      </span>
                      <span className="text-3xl text-blue-200/40">/100</span>
                    </div>
                    <Badge className={`mt-3 text-lg px-4 py-1 ${auditResult.qualityScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : auditResult.qualityScore >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {getScoreLabel(auditResult.qualityScore)}
                    </Badge>
                  </div>

                  <div className="flex-1 max-w-md space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Struttura</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.struttura}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.struttura / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">SEO</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.seo}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.seo / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Emozioni</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.emozioni}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.emozioni / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Persuasività</span>
                        <span className="text-amber-400 font-bold">{auditResult.scoreBreakdown.persuasivita}/25</span>
                      </div>
                      <Progress value={(auditResult.scoreBreakdown.persuasivita / 25) * 100} className="h-2 bg-slate-700" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30" data-testid="card-structural-audit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  Audit Strutturale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(['titolo', 'apertura', 'corpo', 'callToAction'] as const).map((key) => {
                  const item = auditResult.structuralAudit[key];
                  const labels = { titolo: '📌 Titolo', apertura: '🚀 Apertura', corpo: '📝 Corpo', callToAction: '🎯 Call to Action' };
                  return (
                    <div key={key} className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-200">{labels[key]}</h4>
                        <Badge className={item.punteggio >= 7 ? 'bg-emerald-500/20 text-emerald-400' : item.punteggio >= 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}>
                          {item.punteggio}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-100/80 mb-3">{item.valutazione}</p>
                      {item.problemi?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-red-400 mb-1">Problemi:</p>
                          <ul className="text-sm text-red-300/80 space-y-1">
                            {item.problemi.map((p, i) => <li key={i} className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-0.5 shrink-0" />{p}</li>)}
                          </ul>
                        </div>
                      )}
                      {item.suggerimenti?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-emerald-400 mb-1">Suggerimenti:</p>
                          <ul className="text-sm text-emerald-300/80 space-y-1">
                            {item.suggerimenti.map((s, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-emerald-500/30" data-testid="card-seo-audit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-emerald-400" />
                    Audit SEO
                  </div>
                  <Badge className={auditResult.seoAudit.punteggioSEO >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {auditResult.seoAudit.punteggioSEO}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-red-500/20">
                    <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Keywords Mancanti
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {auditResult.seoAudit.keywordsMancanti?.map((kw, i) => (
                        <Badge key={i} variant="outline" className="border-red-500/30 text-red-300">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Keywords Presenti
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {auditResult.seoAudit.keywordsPresenti?.map((kw, i) => (
                        <Badge key={i} variant="outline" className="border-emerald-500/30 text-emerald-300">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-200 mb-2">Ottimizzazione H1</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {auditResult.seoAudit.ottimizzazioneH1?.presente ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <span className="text-sm text-blue-100/80">{auditResult.seoAudit.ottimizzazioneH1?.valutazione}</span>
                  </div>
                  <p className="text-sm text-amber-300/80">💡 {auditResult.seoAudit.ottimizzazioneH1?.suggerimento}</p>
                </div>

                {auditResult.seoAudit.problemiLeggibilita?.length > 0 && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-amber-500/20">
                    <h4 className="font-semibold text-amber-400 mb-3">Problemi di Leggibilità</h4>
                    <ul className="space-y-2">
                      {auditResult.seoAudit.problemiLeggibilita.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-emerald-400">Meta Description Consigliata</h4>
                    <CopyButton text={auditResult.seoAudit.metaDescriptionConsigliata || ''} section="meta" />
                  </div>
                  <p className="text-sm text-emerald-100/90 italic">"{auditResult.seoAudit.metaDescriptionConsigliata}"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-pink-500/30" data-testid="card-emotional-audit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-pink-400" />
                    Audit Emozioni
                  </div>
                  <Badge className={auditResult.emotionalAudit.connessioneEmotiva >= 70 ? 'bg-pink-500/20 text-pink-400' : 'bg-amber-500/20 text-amber-400'}>
                    Connessione: {auditResult.emotionalAudit.connessioneEmotiva}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-pink-500/20">
                  <h4 className="font-semibold text-pink-200 mb-3">Analisi del Tono</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200/60">Tono attuale:</span>
                      <p className="text-pink-300 font-medium">{auditResult.emotionalAudit.tono?.attuale}</p>
                    </div>
                    <div>
                      <span className="text-blue-200/60">Tono ideale:</span>
                      <p className="text-emerald-300 font-medium">{auditResult.emotionalAudit.tono?.ideale}</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100/80 mt-3">{auditResult.emotionalAudit.tono?.valutazione}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-red-500/20">
                    <h4 className="font-semibold text-red-400 mb-3">Punti Deboli Emotivi</h4>
                    <ul className="space-y-2">
                      {auditResult.emotionalAudit.puntiDeboli?.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-200/80">
                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-amber-500/20">
                    <h4 className="font-semibold text-amber-400 mb-3">Sensazioni Mancanti</h4>
                    <ul className="space-y-2">
                      {auditResult.emotionalAudit.sensazioniMancanti?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-400 mb-3">✨ Opportunità Narrative</h4>
                  <ul className="space-y-2">
                    {auditResult.emotionalAudit.opportunitaNarrative?.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-purple-200/90">
                        <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-purple-400" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {auditResult.redFlags?.length > 0 && (
              <Card className="bg-gradient-to-br from-red-950/50 to-slate-900/90 border-2 border-red-500/50" data-testid="card-red-flags">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                    🚨 Critical Fixes (Red Flags)
                  </CardTitle>
                  <CardDescription className="text-red-200/60">
                    Problemi urgenti da risolvere prima di pubblicare
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {auditResult.redFlags.map((rf, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${getGravitaColor(rf.gravita)}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getGravitaColor(rf.gravita)}>
                          {rf.gravita.toUpperCase()}
                        </Badge>
                        <span className="font-semibold text-white">{rf.problema}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-emerald-400 font-medium">✅ Soluzione:</span>
                          <p className="text-emerald-200/80 mt-1">{rf.soluzione}</p>
                        </div>
                        <div>
                          <span className="text-amber-400 font-medium">⚠️ Impatto se non risolto:</span>
                          <p className="text-amber-200/80 mt-1">{rf.impatto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/30" data-testid="card-suggestions">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Zap className="h-6 w-6 text-amber-400" />
                  Suggerimenti AI Strategici
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {auditResult.suggestions?.map((s, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                        {s.priorita}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-300 mb-1">{s.titolo}</h4>
                        <p className="text-sm text-blue-100/80 mb-2">{s.descrizione}</p>
                        <p className="text-xs text-emerald-400">📈 Impatto previsto: {s.impattoPrevisto}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20" data-testid="card-optimized-version">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-purple-400" />
                    Versione Ottimizzata (Mini Perfect Copy)
                  </div>
                  <CopyButton 
                    text={`${auditResult.optimizedVersion.titolo}\n\n${auditResult.optimizedVersion.descrizione}\n\n${auditResult.optimizedVersion.highlights.map(h => `• ${h}`).join('\n')}\n\n${auditResult.optimizedVersion.callToAction}`}
                    section="optimized"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-300">Titolo Ottimizzato</span>
                    <CopyButton text={auditResult.optimizedVersion.titolo || ''} section="title" />
                  </div>
                  <p className="text-xl font-bold text-white">{auditResult.optimizedVersion.titolo}</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-300">Descrizione</span>
                    <CopyButton text={auditResult.optimizedVersion.descrizione || ''} section="description" />
                  </div>
                  <p className="text-blue-100/90 whitespace-pre-line leading-relaxed">{auditResult.optimizedVersion.descrizione}</p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-emerald-300">Highlights</span>
                    <CopyButton text={auditResult.optimizedVersion.highlights?.join('\n') || ''} section="highlights" />
                  </div>
                  <ul className="space-y-2">
                    {auditResult.optimizedVersion.highlights?.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-emerald-100/90">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-300">Call to Action</span>
                    <CopyButton text={auditResult.optimizedVersion.callToAction || ''} section="cta" />
                  </div>
                  <p className="text-lg font-semibold text-amber-200">{auditResult.optimizedVersion.callToAction}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-200">Meta Description SEO</span>
                    <CopyButton text={auditResult.optimizedVersion.metaDescription || ''} section="seo-meta" />
                  </div>
                  <p className="text-sm text-blue-100/80 italic">"{auditResult.optimizedVersion.metaDescription}"</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-blue-500/30" data-testid="card-target-buyer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Users className="h-5 w-5 text-blue-400" />
                    Target Acquirente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100/80 text-sm leading-relaxed">{auditResult.targetBuyer}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-emerald-500/30" data-testid="card-market-analysis">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Globe className="h-5 w-5 text-emerald-400" />
                    Analisi di Mercato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">{auditResult.mercatoAnalisi}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
