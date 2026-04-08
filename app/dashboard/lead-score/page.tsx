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
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
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
  const { locale } = useLocaleContext();
  const isItalian = locale === 'it';
  const [mercato, setMercato] = useState<'italia' | 'usa'>('italia');
  const [messaggioLead, setMessaggioLead] = useState<string>('');
  const [tipoImmobile, setTipoImmobile] = useState<string>('appartamento');
  const [tempistiche, setTempistiche] = useState<string>(isItalian ? 'Non specificato' : 'Not specified');
  const [budget, setBudget] = useState<string>('');
  const [nomeLead, setNomeLead] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LeadScoreResult | null>(null);
  const [cached, setCached] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  const { toast } = useToast();
  const t = {
    required: isItalian ? "Campo obbligatorio" : "Required field",
    requiredMessage: isItalian ? "Inserisci il messaggio del lead per procedere con l'analisi" : "Enter the lead message to continue with the analysis",
    messageTooShort: isItalian ? "Messaggio troppo breve" : "Message too short",
    messageTooShortDesc: isItalian ? "Il messaggio deve contenere almeno 20 caratteri per un'analisi accurata" : "The message must contain at least 20 characters for an accurate analysis",
    analysisDone: isItalian ? "Analisi completata" : "Analysis completed",
    cachedResult: isItalian ? "Risultato dalla cache (24h)" : "Result from cache (24h)",
    analysisIn: (s: number) => isItalian ? `Analisi completata in ${s}s` : `Analysis completed in ${s}s`,
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedDesc: (label: string) => isItalian ? `${label} copiato negli appunti` : `${label} copied to clipboard`,
    pageTitle: isItalian ? "Lead Scoring AI" : "AI Lead Scoring",
    pageSubtitle: isItalian ? "Analizza automaticamente i messaggi dei tuoi lead con l'AI. Ottieni un punteggio 0-100, priorita d'azione e template di risposta personalizzati." : "Automatically analyze your lead messages with AI. Get a 0-100 score, action priorities, and personalized reply templates.",
    analyzeLead: isItalian ? "Analizza un Nuovo Lead" : "Analyze a New Lead",
    analyzeLeadDesc: isItalian ? "Inserisci il messaggio del lead e le informazioni disponibili per ottenere un'analisi completa" : "Enter the lead message and available information to get a complete analysis",
    referenceMarket: isItalian ? "Mercato di Riferimento" : "Reference Market",
    selectMarket: isItalian ? "Seleziona mercato" : "Select market",
    propertyType: isItalian ? "Tipo Immobile Richiesto" : "Requested Property Type",
    selectType: isItalian ? "Seleziona tipo" : "Select type",
    timing: isItalian ? "Tempistiche Dichiarate" : "Declared Timeline",
    selectTiming: isItalian ? "Seleziona tempistiche" : "Select timeline",
    leadName: isItalian ? "Nome del Lead (opzionale)" : "Lead Name (optional)",
    statedBudget: isItalian ? "Budget Dichiarato (opzionale)" : "Declared Budget (optional)",
    leadMessage: isItalian ? "Messaggio del Lead" : "Lead Message",
    leadMessagePlaceholder: isItalian ? "Incolla qui il messaggio ricevuto dal lead (email, form di contatto, WhatsApp, ecc.)..." : "Paste the message received from the lead here (email, contact form, WhatsApp, etc.)...",
    characters: isItalian ? "caratteri" : "characters",
    minimum20: isItalian ? "Minimo 20 caratteri richiesti" : "Minimum 20 characters required",
    analyzing: isItalian ? "Analisi in corso..." : "Analyzing...",
    analyzeWithAi: isItalian ? "Analizza Lead con AI" : "Analyze Lead with AI",
    analysisSummary: isItalian ? "Sintesi dell'Analisi" : "Analysis Summary",
    leadScoreLabel: "Lead Score",
    leadProfile: isItalian ? "Profilo Lead" : "Lead Profile",
    lossRisk: isItalian ? "Rischio Perdita" : "Risk of Loss",
    factorBreakdown: isItalian ? "Breakdown dei 5 Fattori (0-20 punti ciascuno)" : "5-Factor Breakdown (0-20 points each)",
    factorBreakdownDesc: isItalian ? "Analisi dettagliata dei fattori che determinano il punteggio del lead" : "Detailed analysis of the factors that determine the lead score",
    actionPriorities: isItalian ? "Priorita d'Azione" : "Action Priorities",
    actionPrioritiesDesc: isItalian ? "Azioni consigliate in ordine di priorita per convertire questo lead" : "Recommended actions in order of priority to convert this lead",
    followUpStrategy: isItalian ? "Strategia Follow-Up (7-14 giorni)" : "Follow-Up Strategy (7-14 days)",
    responseTemplates: isItalian ? "Template di Risposta AI" : "AI Response Templates",
    responseTemplatesDesc: isItalian ? "Risposte personalizzate pronte all'uso, generate in base al profilo del lead" : "Ready-to-use personalized replies generated from the lead profile",
    quickReply: isItalian ? "Risposta Rapida" : "Quick Reply",
    professionalReply: isItalian ? "Risposta Professionale" : "Professional Reply",
    subject: isItalian ? "OGGETTO:" : "SUBJECT:",
    shortVersion: isItalian ? "VERSIONE BREVE:" : "SHORT VERSION:",
    fullVersion: isItalian ? "VERSIONE COMPLETA:" : "FULL VERSION:",
    intro: isItalian ? "INTRO:" : "INTRO:",
    fullEmail: isItalian ? "EMAIL COMPLETA:" : "FULL EMAIL:",
    perfectCopy: isItalian ? "Suggerimenti Perfect Copy" : "Perfect Copy Suggestions",
    perfectCopyDesc: isItalian ? "Contenuti consigliati per aumentare le conversioni con questo lead" : "Suggested content to increase conversions with this lead",
    newAnalysis: isItalian ? "Nuova Analisi" : "New Analysis",
    cacheBadge: isItalian ? "⚡ Risultato dalla cache (24h)" : "⚡ Result from cache (24h)",
  };
  const marketOptions = isItalian
    ? [
        { value: 'italia', label: '🇮🇹 Italia' },
        { value: 'usa', label: '🇺🇸 USA' },
      ]
    : [
        { value: 'italia', label: '🇮🇹 Italy' },
        { value: 'usa', label: '🇺🇸 USA' },
      ];
  const propertyTypes = isItalian
    ? [
        ['appartamento', 'Appartamento'], ['villa', 'Villa'], ['attico', 'Attico'], ['loft', 'Loft'], ['ufficio', 'Ufficio'], ['locale_commerciale', 'Locale Commerciale'], ['terreno', 'Terreno'], ['altro', 'Altro']
      ]
    : [
        ['appartamento', 'Apartment'], ['villa', 'Villa'], ['attico', 'Penthouse'], ['loft', 'Loft'], ['ufficio', 'Office'], ['locale_commerciale', 'Commercial Space'], ['terreno', 'Land'], ['altro', 'Other']
      ];
  const timingOptions = isItalian
    ? ['Immediato (entro 1 mese)', 'Breve termine (1-3 mesi)', 'Medio termine (3-6 mesi)', 'Lungo termine (6+ mesi)', 'Non specificato']
    : ['Immediate (within 1 month)', 'Short term (1-3 months)', 'Medium term (3-6 months)', 'Long term (6+ months)', 'Not specified'];

  const handleSubmit = async () => {
    if (!messaggioLead.trim()) {
      toast({
        title: t.required,
        description: t.requiredMessage,
        variant: "destructive"
      });
      return;
    }

    if (messaggioLead.trim().length < 20) {
      toast({
        title: t.messageTooShort,
        description: t.messageTooShortDesc,
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
        throw new Error(data.error || (isItalian ? "Errore durante l'analisi" : "Error during analysis"));
      }

      setResult(data.data || null);
      setCached(data.cached || false);
      setProcessingTime(data.processingTimeMs || null);

      toast({
        title: t.analysisDone,
        description: data.cached ? t.cachedResult : t.analysisIn(Math.round((data.processingTimeMs || 0) / 1000))
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
      title: t.copied,
      description: t.copiedDesc(label)
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
      case 'cold': return { label: label || 'COLD LEAD ❄️', color: 'bg-blue-500/20 text-blue-400 border-border' };
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-border">
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.pageTitle}
            </h1>
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-border">
              🎯 Priority
            </Badge>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t.pageSubtitle}
          </p>
        </div>

        {/* Input Form */}
        <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-cyan-400" />
              {t.analyzeLead}
            </CardTitle>
            <CardDescription>
              {t.analyzeLeadDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Row 1: Mercato, Tipo Immobile, Tempistiche */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t.referenceMarket}</Label>
                <Select value={mercato} onValueChange={(v) => setMercato(v as 'italia' | 'usa')}>
                  <SelectTrigger className="bg-muted/50 border-slate-600 text-foreground" data-testid="select-mercato">
                    <SelectValue placeholder={t.selectMarket} />
                  </SelectTrigger>
                  <SelectContent>
                    {marketOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.propertyType}</Label>
                <Select value={tipoImmobile} onValueChange={setTipoImmobile}>
                  <SelectTrigger className="bg-muted/50 border-slate-600 text-foreground" data-testid="select-tipo-immobile">
                    <SelectValue placeholder={t.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.timing}</Label>
                <Select value={tempistiche} onValueChange={setTempistiche}>
                  <SelectTrigger className="bg-muted/50 border-slate-600 text-foreground" data-testid="select-tempistiche">
                    <SelectValue placeholder={t.selectTiming} />
                  </SelectTrigger>
                  <SelectContent>
                    {timingOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Nome Lead e Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t.leadName}</Label>
                <input
                  type="text"
                  value={nomeLead}
                  onChange={(e) => setNomeLead(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full px-3 py-2 bg-muted/50 border border-slate-600 rounded-md text-foreground placeholder:text-slate-500"
                  data-testid="input-nome-lead"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">{t.statedBudget}</Label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Es. 250.000€ - 300.000€"
                  className="w-full px-3 py-2 bg-muted/50 border border-slate-600 rounded-md text-foreground placeholder:text-slate-500"
                  data-testid="input-budget"
                />
              </div>
            </div>
            
            {/* Messaggio Lead */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                {t.leadMessage} <span className="text-red-400">*</span>
              </Label>
              <Textarea
                value={messaggioLead}
                onChange={(e) => setMessaggioLead(e.target.value)}
                placeholder={t.leadMessagePlaceholder}
                className="min-h-[150px] bg-muted/50 border-slate-600 text-foreground placeholder:text-slate-500"
                data-testid="textarea-messaggio-lead"
              />
              <p className="text-xs text-slate-500">
                {messaggioLead.length} {t.characters} • {t.minimum20}
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
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.analyzeWithAi}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            
            {/* Score Overview */}
            <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(result.categoria)}`} />
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Main Score */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      {getCategoryIcon(result.categoria)}
                      <Badge className={getCategoryBadge(result.categoria, result.categoriaLabel).color}>
                        {getCategoryBadge(result.categoria, result.categoriaLabel).label}
                      </Badge>
                    </div>
                    <div className={`text-6xl font-bold ${getScoreColor(result.leadScore)}`}>
                      {result.leadScore}
                    </div>
                    <p className="text-slate-400 mt-2">{t.leadScoreLabel}</p>
                    <Progress 
                      value={result.leadScore} 
                      className="w-full mt-4 h-3"
                    />
                  </div>
                  
                  {/* Summary */}
                  <div className="lg:col-span-2 p-6 rounded-xl bg-muted/50 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      {t.analysisSummary}
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {result.sintesiAnalisi}
                    </p>
                    
                    {/* Profile & Risk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-1 mb-2">
                          <User className="w-4 h-4" /> {t.leadProfile}
                        </h4>
                        <p className="text-sm text-slate-400">{result.profiloLead}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 border border-red-500/20">
                        <h4 className="text-sm font-medium text-red-400 flex items-center gap-1 mb-2">
                          <AlertTriangle className="w-4 h-4" /> {t.lossRisk}
                        </h4>
                        <p className="text-sm text-slate-400">{result.rischioPerditaLead}</p>
                      </div>
                    </div>
                    
                    {cached && (
                      <Badge className="mt-4 bg-purple-500/20 text-purple-400 border-border">
                        {t.cacheBadge}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factor Breakdown */}
            <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  {t.factorBreakdown}
                </CardTitle>
                <CardDescription>
                  {t.factorBreakdownDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.breakdown.map((factor, index) => {
                    const IconComponent = FACTOR_ICONS[factor.nome] || Target;
                    return (
                      <div 
                        key={index}
                        className="p-4 rounded-xl bg-muted/50 border border-slate-700/50 hover:border-border transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-cyan-400" />
                            <span className="font-medium text-foreground text-sm">{factor.nome}</span>
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
            <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                  {t.actionPriorities}
                </CardTitle>
                <CardDescription>
                  {t.actionPrioritiesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.prioritaAzione.map((action, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-slate-700/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {action.priorita}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{action.azione}</span>
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
                  <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-border">
                    <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {t.followUpStrategy}
                    </h4>
                    <p className="text-sm text-slate-300">{result.followUpStrategy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Templates */}
            <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  {t.responseTemplates}
                </CardTitle>
                <CardDescription>
                  {t.responseTemplatesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Risposta Breve */}
                  <div className="p-5 rounded-xl bg-muted/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-border">
                        ⚡ {t.quickReply}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Oggetto: ${result.rispostaBrieveTemplate.oggetto}\n\n${result.rispostaBrieveTemplate.lungo}`,
                          t.quickReply
                        )}
                        className="text-slate-400 hover:text-foreground"
                        data-testid="button-copy-risposta-breve"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.subject}</p>
                        <p className="text-foreground font-medium">{result.rispostaBrieveTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.shortVersion}</p>
                        <p className="text-slate-300">{result.rispostaBrieveTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.fullVersion}</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaBrieveTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risposta Lunga/Professionale */}
                  <div className="p-5 rounded-xl bg-muted/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-purple-500/20 text-purple-400 border-border">
                        📧 {t.professionalReply}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Oggetto: ${result.rispostaLungaTemplate.oggetto}\n\n${result.rispostaLungaTemplate.lungo}`,
                          t.professionalReply
                        )}
                        className="text-slate-400 hover:text-foreground"
                        data-testid="button-copy-risposta-lunga"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.subject}</p>
                        <p className="text-foreground font-medium">{result.rispostaLungaTemplate.oggetto}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.intro}</p>
                        <p className="text-slate-300">{result.rispostaLungaTemplate.breve}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-muted/40 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">{t.fullEmail}</p>
                        <p className="text-slate-300 whitespace-pre-line">{result.rispostaLungaTemplate.lungo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perfect Copy Suggestions */}
            <Card className="bg-muted/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  {t.perfectCopy}
                </CardTitle>
                <CardDescription>
                  {t.perfectCopyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.suggerimentiPerfectCopy.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <Badge className="bg-amber-500/20 text-amber-400 border-border">
                          {suggestion.tipo}
                        </Badge>
                      </div>
                      <p className="text-foreground font-medium mb-2">{suggestion.descrizione}</p>
                      <p className="text-sm text-slate-400">{suggestion.motivazione}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Info */}
            {processingTime && (
              <div className="text-center text-sm text-slate-500">
                {isItalian
                  ? `Analisi completata in ${(processingTime / 1000).toFixed(1)}s${cached ? ' (dalla cache)' : ''}`
                  : `Analysis completed in ${(processingTime / 1000).toFixed(1)}s${cached ? ' (from cache)' : ''}`}
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
                className="border-slate-600 text-slate-300 hover:bg-muted"
                data-testid="button-nuova-analisi"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.newAnalysis}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
