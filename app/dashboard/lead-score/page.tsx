'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Target,
  Flame,
  Thermometer,
  Snowflake,
  Clock,
  Wallet,
  Calendar,
  Heart,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Copy,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Mail,
  Phone,
  User,
  Building,
  RefreshCw,
  Loader2,
  Lightbulb,
  FileText,
  Shield
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface LeadFactor {
  nome: string;
  punteggio: number;
  motivazione: string;
}

interface ActionPriority {
  priorita: number;
  azione: string;
  motivazione: string;
  tempistica: string;
}

interface LeadResponse {
  breve: string;
  lungo: string;
  oggetto: string;
}

interface PerfectCopySuggestion {
  tipo: string;
  descrizione: string;
  motivazione: string;
}

interface LeadScoreResult {
  leadScore: number;
  categoria: 'hot' | 'warm' | 'cold';
  categoriaLabel: string;
  categoriaEmoji: string;
  sintesiAnalisi: string;
  breakdown: LeadFactor[];
  prioritaAzione: ActionPriority[];
  rispostaBrieveTemplate: LeadResponse;
  rispostaLungaTemplate: LeadResponse;
  suggerimentiPerfectCopy: PerfectCopySuggestion[];
  profiloLead: string;
  rischioPerditaLead: string;
  followUpStrategy: string;
}

interface LeadScoreResponse {
  success: boolean;
  data?: LeadScoreResult;
  cached?: boolean;
  processingTimeMs?: number;
  error?: string;
}

const FACTOR_ICONS: Record<string, any> = {
  'Urgenza Percepita': Clock,
  'Budget e Compatibilità': Wallet,
  'Tempistiche': Calendar,
  'Motivazione': Heart,
  'Chiarezza Messaggio': MessageSquare
};

export default function LeadScorePage() {
  const [mercato, setMercato] = useState<'italia' | 'usa'>('italia');
  const [messaggioLead, setMessaggioLead] = useState<string>('');
  const [tipoImmobile, setTipoImmobile] = useState<string>('appartamento');
  const [tempistiche, setTempistiche] = useState<string>('Non specificato');
  const [budget, setBudget] = useState<string>('');
  const [nomeLead, setNomeLead] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LeadScoreResult | null>(null);
  const [cached, setCached] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!messaggioLead.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il messaggio del lead per procedere con l'analisi",
        variant: "destructive"
      });
      return;
    }

    if (messaggioLead.trim().length < 20) {
      toast({
        title: "Messaggio troppo breve",
        description: "Il messaggio deve contenere almeno 20 caratteri per un'analisi accurata",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/lead-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mercato,
          messaggioLead: messaggioLead.trim(),
          tipoImmobile,
          tempistiche,
          budget: budget.trim() || undefined,
          nomeLead: nomeLead.trim() || undefined
        })
      });

      const data: LeadScoreResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Errore durante l\'analisi');
      }

      setResult(data.data || null);
      setCached(data.cached || false);
      setProcessingTime(data.processingTimeMs || null);

      toast({
        title: "Analisi completata",
        description: data.cached ? "Risultato dalla cache (24h)" : `Analisi completata in ${Math.round((data.processingTimeMs || 0) / 1000)}s`
      });

    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'analisi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiato!",
      description: `${label} copiato negli appunti`
    });
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'hot': return <Flame className="w-6 h-6 text-red-500" />;
      case 'warm': return <Thermometer className="w-6 h-6 text-orange-500" />;
      case 'cold': return <Snowflake className="w-6 h-6 text-blue-400" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'hot': return 'from-red-500 to-orange-500';
      case 'warm': return 'from-orange-400 to-yellow-500';
      case 'cold': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryBadge = (categoria: string, label: string) => {
    switch (categoria) {
      case 'hot': return { label: label || 'HOT LEAD 🔥', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'warm': return { label: label || 'WARM LEAD ⭐', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'cold': return { label: label || 'COLD LEAD ❄️', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default: return { label: 'LEAD', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFactorScoreColor = (score: number, max: number = 20) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lead Scoring AI
            </h1>
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30">
              🎯 Priority
            </Badge>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Analizza automaticamente i messaggi dei tuoi lead con l'AI. Ottieni un punteggio 0-100, 
            priorità d'azione e template di risposta personalizzati.
          </p>
        </div>

        {/* Input Form */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              Analizza un Nuovo Lead
            </CardTitle>
            <CardDescription>
              Inserisci il messaggio del lead e le informazioni disponibili per ottenere un'analisi completa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Row 1: Mercato, Tipo Immobile, Tempistiche */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Mercato di Riferimento</Label>
                <Select value={mercato} onValueChange={(v) => setMercato(v as 'italia' | 'usa')}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-mercato">
                    <SelectValue placeholder="Seleziona mercato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italia">🇮🇹 Italia</SelectItem>
                    <SelectItem value="usa">🇺🇸 USA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo Immobile Richiesto</Label>
                <Select value={tipoImmobile} onValueChange={setTipoImmobile}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-tipo-immobile">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appartamento">Appartamento</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="attico">Attico</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="ufficio">Ufficio</SelectItem>
                    <SelectItem value="locale_commerciale">Locale Commerciale</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="altro">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Tempistiche Dichiarate</Label>
                <Select value={tempistiche} onValueChange={setTempistiche}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white" data-testid="select-tempistiche">
                    <SelectValue placeholder="Seleziona tempistiche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediato (entro 1 mese)">Immediato (entro 1 mese)</SelectItem>
                    <SelectItem value="Breve termine (1-3 mesi)">Breve termine (1-3 mesi)</SelectItem>
                    <SelectItem value="Medio termine (3-6 mesi)">Medio termine (3-6 mesi)</SelectItem>
                    <SelectItem value="Lungo termine (6+ mesi)">Lungo termine (6+ mesi)</SelectItem>
                    <SelectItem value="Non specificato">Non specificato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Nome Lead e Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome del Lead (opzionale)</Label>
                <input
                  type="text"
                  value={nomeLead}
                  onChange={(e) => setNomeLead(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500"
                  data-testid="input-nome-lead"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Budget Dichiarato (opzionale)</Label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Es. 250.000€ - 300.000€"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500"
                  data-testid="input-budget"
                />
              </div>
            </div>
            
            {/* Messaggio Lead */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                Messaggio del Lead <span className="text-red-400">*</span>
              </Label>
              <Textarea
                value={messaggioLead}
                onChange={(e) => setMessaggioLead(e.target.value)}
                placeholder="Incolla qui il messaggio ricevuto dal lead (email, form di contatto, WhatsApp, ecc.)..."
                className="min-h-[150px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                data-testid="textarea-messaggio-lead"
              />
              <p className="text-xs text-slate-500">
                {messaggioLead.length} caratteri • Minimo 20 caratteri richiesti
              </p>
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || messaggioLead.trim().length < 20}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/25"
              data-testid="button-analizza-lead"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisi in corso...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analizza Lead con AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            
            {/* Score Overview */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(result.categoria)}`} />
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Main Score */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      {getCategoryIcon(result.categoria)}
                      <Badge className={getCategoryBadge(result.categoria, result.categoriaLabel).color}>
                        {getCategoryBadge(result.categoria, result.categoriaLabel).label}
                      </Badge>
                    </div>
                    <div className={`text-6xl font-bold ${getScoreColor(result.leadScore)}`}>
                      {result.leadScore}
                    </div>
                    <p className="text-slate-400 mt-2">Lead Score</p>
                    <Progress 
                      value={result.leadScore} 
                      className="w-full mt-4 h-3"
                    />
                  </div>
                  
                  {/* Summary */}
                  <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Sintesi dell'Analisi
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {result.sintesiAnalisi}
                    </p>
                    
                    {/* Profile & Risk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-1 mb-2">
                          <User className="w-4 h-4" /> Profilo Lead
                        </h4>
                        <p className="text-sm text-slate-400">{result.profiloLead}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-red-500/20">
                        <h4 className="text-sm font-medium text-red-400 flex items-center gap-1 mb-2">
                          <AlertTriangle className="w-4 h-4" /> Rischio Perdita
                        </h4>
                        <p className="text-sm text-slate-400">{result.rischioPerditaLead}</p>
                      </div>
                    </div>
                    
                    {cached && (
                      <Badge className="mt-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
                        ⚡ Risultato dalla cache (24h)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factor Breakdown */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Breakdown dei 5 Fattori (0-20 punti ciascuno)
                </CardTitle>
                <CardDescription>
                  Analisi dettagliata dei fattori che determinano il punteggio del lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.breakdown.map((factor, index) => {
                    const IconComponent = FACTOR_ICONS[factor.nome] || Target;
                    return (
                      <div 
                        key={index}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-cyan-400" />
                            <span className="font-medium text-white text-sm">{factor.nome}</span>
                          </div>
                          <span className={`text-lg font-bold ${getFactorScoreColor(factor.punteggio)}`}>
                            {factor.punteggio}/20
                          </span>
                        </div>
                        <Progress value={(factor.punteggio / 20) * 100} className="h-2 mb-3" />
                        <p className="text-sm text-slate-400">{factor.motivazione}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Priorities */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                  Priorità d'Azione
                </CardTitle>
                <CardDescription>
                  Azioni consigliate in ordine di priorità per convertire questo lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.prioritaAzione.map((action, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {action.priorita}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{action.azione}</span>
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {action.tempistica}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{action.motivazione}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Follow-up Strategy */}
                {result.followUpStrategy && (
                  <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Strategia Follow-Up (7-14 giorni)
                    </h4>
                    <p className="text-sm text-slate-300">{result.followUpStrategy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Templates */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Template di Risposta AI
                </CardTitle>
                <CardDescription>
                  Risposte personalizzate pronte all'uso, generate in base al profilo del lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Risposta Breve */}
                  <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        ⚡ Risposta Rapida
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Oggetto: ${result.rispostaBrieveTemplate.oggetto}\n\n${result.rispostaBrieveTemplate.lungo}`,
                          'Risposta breve'
                        )}
                        className="text-slate-400 hover:text-white"
                        data-testid="button-copy-risposta-breve"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">OGGETTO:</p>
                        <p className="text-white font-medium">{result.rispostaBrieveTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">VERSIONE BREVE:</p>
                        <p className="text-slate-300">{result.rispostaBrieveTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">VERSIONE COMPLETA:</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaBrieveTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risposta Lunga/Professionale */}
                  <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        📧 Risposta Professionale
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Oggetto: ${result.rispostaLungaTemplate.oggetto}\n\n${result.rispostaLungaTemplate.lungo}`,
                          'Risposta professionale'
                        )}
                        className="text-slate-400 hover:text-white"
                        data-testid="button-copy-risposta-lunga"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">OGGETTO:</p>
                        <p className="text-white font-medium">{result.rispostaLungaTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">INTRO:</p>
                        <p className="text-slate-300">{result.rispostaLungaTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">EMAIL COMPLETA:</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaLungaTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perfect Copy Suggestions */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Suggerimenti Perfect Copy
                </CardTitle>
                <CardDescription>
                  Contenuti consigliati per aumentare le conversioni con questo lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.suggerimentiPerfectCopy.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-slate-800/50 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          {suggestion.tipo}
                        </Badge>
                      </div>
                      <p className="text-white font-medium mb-2">{suggestion.descrizione}</p>
                      <p className="text-sm text-slate-400">{suggestion.motivazione}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Info */}
            {processingTime && (
              <div className="text-center text-sm text-slate-500">
                Analisi completata in {(processingTime / 1000).toFixed(1)}s
                {cached && ' (dalla cache)'}
              </div>
            )}
            
            {/* New Analysis Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setMessaggioLead('');
                  setBudget('');
                  setNomeLead('');
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                data-testid="button-nuova-analisi"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nuova Analisi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
