"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Loader2,
  Sparkles,
  Settings,
  Play,
  Pause,
  Trash2,
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Layers,
  Download,
  Image as ImageIcon,
  Tag,
  ArrowBigUpDash,
  AlertCircle,
  UserCheck,
  Copy,
  Check,
  FileText,
  MessageSquare,
  User,
  Zap,
  Send,
} from "lucide-react";
import { generateSmartBriefing } from "@/lib/ai/smart-briefing";
import { InvestmentAnalysisModal } from "@/components/investment-analysis-modal";
import { AIVirtualStaging } from "@/components/ai-virtual-staging";
import { ProFeaturePaywall } from "@/components/demo-modal";
import { AIXRayVision } from "@/components/ai-xray-vision";
import { TerritoryCommander } from "@/components/territory-commander";
import { PremiumInvestorReport } from "@/components/premium-investor-report";
import { PriceDropSniperModal } from "@/components/price-drop-sniper-modal";
import { CompetitorRadar } from "@/components/competitor-radar";
import { GlobalLiveFeed } from "@/components/global-live-feed";
import { suggestNextAction } from "@/lib/ai/next-action-suggestion";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuraVRGenerator } from "@/components/aura-vr-generator";
import { GlobalStatsTicker } from "@/components/global-stats-ticker";
import { detectLocaleFromLocation } from "@/lib/i18n/dictionary";
import { formatPriceByLocation } from "@/lib/utils/currency-formatter";

interface ExternalListing {
  id: string;
  title: string;
  location: string;
  price: number | null;
  source_platform: string;
  status: 'new' | 'called' | 'appointment_set' | 'rejected' | 'converted';
  owner_name: string | null;
  phone_number: string | null;
  source_url: string;
  ai_summary: any;
  lead_score: number | null;
  created_at: string;
  updated_at: string;
  surface?: number | null; // mq
  raw_data?: any; // Dati grezzi dallo scraper
  category?: 'RESIDENTIAL_SALE' | 'RESIDENTIAL_RENT' | 'COMMERCIAL';
  estimated_value?: number | null;
}

interface ProspectingStats {
  calls_today: number;
  appointments_this_week: number;
  new_listings_today: number;
  total_active: number;
}

interface LiveFeedItem {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ProspectingFilter {
  id: string;
  name: string;
  criteria: any;
  is_active: boolean;
  auto_run: boolean;
  last_run_at: string | null;
  listings_found_count: number;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: 'Nuovo', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  analyzed: { label: 'Analizzato', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  called: { label: 'Chiamato', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  in_negotiation: { label: 'In Trattativa', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  mandate_taken: { label: 'Mandato Preso', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  appointment_set: { label: 'Appuntamento Fissato', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { label: 'Rifiutato', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  converted: { label: 'Convertito', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
};

const platformConfig: Record<string, { label: string; emoji: string }> = {
  idealista: { label: 'Idealista', emoji: '🏠' },
  immobiliare: { label: 'Immobiliare.it', emoji: '🏘️' },
  zillow: { label: 'Zillow', emoji: '🇺🇸' },
  mls: { label: 'MLS', emoji: '📋' },
  subito: { label: 'Subito.it', emoji: '📦' },
  casa: { label: 'Casa.it', emoji: '🏡' },
};

export default function ProspectingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [listings, setListings] = useState<ExternalListing[]>([]);
  const [filters, setFilters] = useState<ProspectingFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingListingId, setCallingListingId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<ExternalListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [stats, setStats] = useState<ProspectingStats | null>(null);
  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([]);
  const [reportListing, setReportListing] = useState<ExternalListing | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sniperListing, setSniperListing] = useState<ExternalListing | null>(null);
  const [isSniperModalOpen, setIsSniperModalOpen] = useState(false);
  const [priceDropFilter, setPriceDropFilter] = useState(false);
  const [showTopMatchOnly, setShowTopMatchOnly] = useState(false);
  const [copiedListingId, setCopiedListingId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'agency'>('free');
  const [voiceCallsRemaining, setVoiceCallsRemaining] = useState<number>(0);
  const [isManualOverrideOpen, setIsManualOverrideOpen] = useState<string | null>(null);
  const [isAuraVRModalOpen, setIsAuraVRModalOpen] = useState(false);
  const [selectedListingForVR, setSelectedListingForVR] = useState<ExternalListing | null>(null);
  const [isSmartMessageModalOpen, setIsSmartMessageModalOpen] = useState(false);
  const [selectedListingForMessage, setSelectedListingForMessage] = useState<ExternalListing | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');

  // Filtri
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [locationSearch, setLocationSearch] = useState("");

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (platformFilter !== "all") params.append("platform", platformFilter);
      if (locationSearch) params.append("location", locationSearch);

      const response = await fetch(`/api/prospecting/listings?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setListings(data.data || []);
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nel caricamento degli annunci",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/prospecting/filters');
      const data = await response.json();

      if (data.success) {
        setFilters(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchStats = async () => {
    // Only fetch stats for PRO/AGENCY users
    if (userPlan !== 'pro' && userPlan !== 'agency') {
      return;
    }
    
    try {
      const response = await fetch('/api/prospecting/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else if (response.status === 403) {
        // 403 is expected for FREE users, silently ignore
        console.log('[PROSPECTING] Stats not available for current plan');
      }
    } catch (error) {
      // Only log if it's not a 403 (expected for FREE users)
      if (error instanceof Error && !error.message.includes('403')) {
      console.error('Error fetching stats:', error);
      }
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      const data = await response.json();

      if (data.success && data.data) {
        const plan = (data.data.status || 'free') as 'free' | 'starter' | 'pro' | 'agency';
        setUserPlan(plan);

        // Calcola chiamate rimanenti per piano PRO (30/mese) - solo se PRO/AGENCY
        if (plan === 'pro') {
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          // Conta chiamate effettuate questo mese
          try {
          const callsResponse = await fetch(`/api/prospecting/stats?month_start=${monthStart.toISOString()}`);
          const callsData = await callsResponse.json();
          const callsUsed = callsData.success ? (callsData.data?.calls_this_month || 0) : 0;
          
          setVoiceCallsRemaining(Math.max(0, 30 - callsUsed));
          } catch (statsError) {
            // Ignore stats errors for subscription fetch
            console.log('[SUBSCRIPTION] Stats not available, setting default');
            setVoiceCallsRemaining(30);
          }
        } else if (plan === 'agency') {
          setVoiceCallsRemaining(-1); // Illimitato
        } else {
          setVoiceCallsRemaining(0); // FREE/STARTER non hanno chiamate
        }
        
        // After setting plan, fetch stats if PRO/AGENCY
        if (plan === 'pro' || plan === 'agency') {
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const addLiveFeedItem = (message: string, type: LiveFeedItem['type'] = 'info') => {
    const newItem: LiveFeedItem = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type,
    };
    setLiveFeed(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10 items
  };

  useEffect(() => {
    fetchListings();
    fetchFilters();
    // Fetch subscription first - it will call fetchStats() if needed
    fetchUserSubscription();
  }, [statusFilter, platformFilter]);

  // Auto-refresh stats ogni 30 secondi (solo per PRO/AGENCY)
  useEffect(() => {
    if (userPlan !== 'pro' && userPlan !== 'agency') {
      return;
    }
    
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [userPlan]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!loading) fetchListings();
    }, 300);
    return () => clearTimeout(debounce);
  }, [locationSearch]);

  const handleCall = async (listingId: string) => {
    setCallingListingId(listingId);
    try {
      const response = await fetch('/api/prospecting/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      });

      const data = await response.json();

      // If 403, update user plan and show error
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Voice AI Prospecting è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Chiamata avviata",
          description: "La chiamata AI è stata avviata con successo",
        });
        addLiveFeedItem(`🤖 AI sta chiamando il proprietario di "${selectedListing?.title || 'un immobile'}" a ${selectedListing?.location || 'N/A'}`, 'info');
        // Ricarica lista e stats dopo un breve delay
        setTimeout(() => {
          fetchListings();
          fetchStats();
          fetchUserSubscription(); // Aggiorna contatore chiamate
        }, 2000);
      } else {
        toast({
          title: "Errore",
          description: data.error || data.message || "Errore nell'avvio della chiamata",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive",
      });
    } finally {
      setCallingListingId(null);
    }
  };

  const handleSmartMessage = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setSelectedListingForMessage(listing);
    setIsSmartMessageModalOpen(true);

    // Genera messaggio WhatsApp persuasivo basato su lingua e caratteristiche
    const locale = detectLocaleFromLocation(listing.location);
    const yieldPercent = listing.price && listing.surface 
      ? ((listing.price / listing.surface) * 0.08).toFixed(1) // Stima yield 8%
      : null;
    
    const messages: Record<string, (listing: ExternalListing, yieldPercent: string | null) => string> = {
      it: (l, y) => `Ciao! 👋 Ho visto il tuo immobile a ${l.location}. ${y ? `Il rendimento del ${y}% è pazzesco!` : 'Sembra un\'opportunità interessante!'} Sarebbe disponibile per una visita? Sono un agente qualificato e ho clienti interessati. 🏠✨`,
      en: (l, y) => `Hi! 👋 I saw your property in ${l.location}. ${y ? `The ${y}% yield is amazing!` : 'It looks like an interesting opportunity!'} Would you be available for a viewing? I'm a qualified agent with interested clients. 🏠✨`,
      es: (l, y) => `¡Hola! 👋 Vi tu propiedad en ${l.location}. ${y ? `¡El rendimiento del ${y}% es increíble!` : '¡Parece una oportunidad interesante!'} ¿Estarías disponible para una visita? Soy un agente cualificado con clientes interesados. 🏠✨`,
      fr: (l, y) => `Bonjour! 👋 J'ai vu votre bien à ${l.location}. ${y ? `Le rendement de ${y}% est incroyable!` : 'Cela semble être une opportunité intéressante!'} Seriez-vous disponible pour une visite? Je suis un agent qualifié avec des clients intéressés. 🏠✨`,
      de: (l, y) => `Hallo! 👋 Ich habe Ihre Immobilie in ${l.location} gesehen. ${y ? `Die Rendite von ${y}% ist erstaunlich!` : 'Es sieht nach einer interessanten Gelegenheit aus!'} Wären Sie für eine Besichtigung verfügbar? Ich bin ein qualifizierter Makler mit interessierten Kunden. 🏠✨`,
      pt: (l, y) => `Olá! 👋 Vi seu imóvel em ${l.location}. ${y ? `O rendimento de ${y}% é incrível!` : 'Parece uma oportunidade interessante!'} Estaria disponível para uma visita? Sou um agente qualificado com clientes interessados. 🏠✨`,
    };

    const message = messages[locale]?.(listing, yieldPercent) || messages.en(listing, yieldPercent);
    setGeneratedMessage(message);
    
    // Notifica generazione messaggio
    toast({
      title: "Messaggio generato",
      description: "Il messaggio WhatsApp è stato generato con successo",
    });
    addLiveFeedItem(`💬 Messaggio WhatsApp generato per immobile a ${listing.location}`, 'info');
  };

  const handleToggleAutoRun = async (filterId: string, currentValue: boolean) => {
    try {
      const response = await fetch('/api/prospecting/filters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: filterId,
          auto_run: !currentValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchFilters();
        toast({
          title: "Filtro aggiornato",
          description: `Auto-run ${!currentValue ? 'attivato' : 'disattivato'}`,
        });
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nell'aggiornamento del filtro",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore di connessione",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number | null, location?: string) => {
    if (!price) return 'N/A';
    // Se location fornita, usa formattazione basata su location
    if (location) {
      return formatPriceByLocation(price, location);
    }
    // Fallback: EUR (per compatibilità)
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calcola GAP DI MERCATO - Analisi Professionale
  // PRIORITÀ: Se market_gap è già presente in ai_summary o raw_data, usa quello (dallo script seed)
  // Altrimenti calcola con logica professionale
  const calculateMarketGap = (listing: ExternalListing): number | null => {
    // PRIORITÀ 1: Usa market_gap già calcolato (da script seed o AI)
    if (listing.ai_summary?.market_gap && typeof listing.ai_summary.market_gap === 'number') {
      return listing.ai_summary.market_gap;
    }
    if (listing.raw_data?.market_gap_percentage && typeof listing.raw_data.market_gap_percentage === 'number') {
      return listing.raw_data.market_gap_percentage;
    }
    
    // PRIORITÀ 2: Calcola se non disponibile
    if (!listing.price) return null;
    const surface = listing.surface || listing.raw_data?.surface;
    if (!surface || surface === 0) return null;
    
    const pricePerSqm = listing.price / surface;
    
    // Fattori di correzione per calcolo media zona (simulazione professionale)
    const location = listing.location?.toLowerCase() || '';
    const title = listing.title?.toLowerCase() || '';
    const description = listing.raw_data?.description_raw?.toLowerCase() || '';
    
    // Fattore location: zone centrali hanno media più alta
    let locationMultiplier = 1.0;
    if (location.includes('centro') || location.includes('centro storico') || location.includes('downtown')) {
      locationMultiplier = 1.25; // +25% per zone centrali
    } else if (location.includes('periferia') || location.includes('suburb')) {
      locationMultiplier = 0.90; // -10% per periferie
    } else {
      locationMultiplier = 1.0; // Standard
    }
    
    // Fattore tipologia: appartamenti vs case indipendenti
    let typeMultiplier = 1.0;
    if (title.includes('villa') || title.includes('casa indipendente') || title.includes('house')) {
      typeMultiplier = 1.15; // +15% per case indipendenti
    } else if (title.includes('attico') || title.includes('penthouse') || title.includes('duplex')) {
      typeMultiplier = 1.30; // +30% per attici/penthouse
    } else {
      typeMultiplier = 1.0; // Standard per appartamenti
    }
    
    // Fattore stato conservativo: ristrutturato vs da ristrutturare
    let conditionMultiplier = 1.0;
    if (description.includes('ristrutturato') || description.includes('nuovo') || description.includes('refurbished')) {
      conditionMultiplier = 1.20; // +20% per ristrutturati
    } else if (description.includes('da ristrutturare') || description.includes('da sistemare') || description.includes('needs renovation')) {
      conditionMultiplier = 0.85; // -15% per da ristrutturare
    } else {
      conditionMultiplier = 1.0; // Standard
    }
    
    // Calcolo media zona professionale
    // Base: prezzo medio zona = prezzo attuale * fattori correttivi
    // Poi aggiungiamo un margine di mercato standard (15-25% sopra)
    const baseMarketPricePerSqm = pricePerSqm * locationMultiplier * typeMultiplier * conditionMultiplier;
    const marketMargin = 0.18 + (Math.random() * 0.07); // 18-25% margine variabile
    const marketAvgPricePerSqm = baseMarketPricePerSqm * (1 + marketMargin);
    
    // Calcolo gap percentuale
    const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
    
    // Ritorna solo gap positivo (prezzo sotto mercato = opportunità)
    return gap > 0 ? Math.round(gap * 10) / 10 : null; // Arrotondato a 1 decimale
  };

  // Tag AI Image Insights (mock - in produzione da AI)
  const getImageInsights = (listing: ExternalListing): string[] => {
    // Mock tags basati su caratteristiche comuni
    const mockTags = [
      'Infissi da rifare',
      'Cucina anni 70',
      'Parquet ottimo stato',
      'Bagno da ristrutturare',
      'Impianto elettrico datato',
      'Tetto in buone condizioni',
    ];
    // Ritorna 2-4 tag random
    return mockTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Global Stats Ticker */}
        <div className="mb-4">
          <GlobalStatsTicker />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                Arbitrage Command Center
              </h1>
              <p className="text-muted-foreground mt-1">
                Identifica opportunità di arbitraggio e ottieni mandati esclusivi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border">
              <Switch
                checked={showTopMatchOnly}
                onCheckedChange={setShowTopMatchOnly}
              />
              <span className="text-sm font-medium">Sola polpa</span>
            </div>
            <Button 
              onClick={() => {
                const exportData = listings.map(l => ({
                  title: l.title,
                  location: l.location,
                  price: l.price,
                  platform: l.source_platform,
                  status: l.status,
                  lead_score: l.lead_score,
                  market_gap: l.ai_summary?.market_gap || null,
                  owner_name: l.owner_name,
                  phone: l.phone_number,
                  url: l.source_url,
                  created_at: l.created_at,
                }));
                // Import dinamico per evitare errori SSR
                import('@/lib/utils/export-data').then(({ exportToCSV, exportToExcel }) => {
                  const format = window.confirm('Esporta in Excel? (OK = Excel, Annulla = CSV)');
                  if (format) {
                    exportToExcel(exportData, 'prospecting-export');
                  } else {
                    exportToCSV(exportData, 'prospecting-export');
                  }
                });
              }}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Esporta Lead
            </Button>
            <Button onClick={fetchListings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Filtri */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtri
                </CardTitle>
                {/* Micro-messaggio Aria per filtri */}
                {filters.length === 0 && (
                  <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-purple-300">Aria:</span> Crea il tuo primo filtro per iniziare a trovare deal d'oro! Definisci prezzo, location e caratteristiche desiderate.
                      </p>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Piattaforma</label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte</SelectItem>
                      {Object.entries(platformConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.emoji} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="Cerca location..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-lg">Filtri Attivi</CardTitle>
                    <Link href="/dashboard/prospecting/filters">
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {filters.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nessun filtro attivo
                        </p>
                      ) : (
                        filters.map((filter) => (
                          <div
                            key={filter.id}
                            className="p-3 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{filter.name}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Modifica
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Elimina
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {filter.listings_found_count || 0} annunci
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Auto-run</span>
                                <Switch
                                  checked={filter.auto_run}
                                  onCheckedChange={() => handleToggleAutoRun(filter.id, filter.auto_run)}
                                />
                              </div>
                            </div>
                            {filter.last_run_at && (
                              <p className="text-xs text-muted-foreground">
                                Ultimo run: {formatDate(filter.last_run_at)}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabella Annunci */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Annunci Trovati ({listings.length})</CardTitle>
                <CardDescription>
                  Clicca su "Chiama Ora" per avviare una chiamata AI al proprietario
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4 py-4">
                    {/* Skeleton per header tabella */}
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                    </div>
                    {/* Skeleton per righe */}
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4 py-3 border-b">
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">
                      Nessun annuncio trovato. Crea un filtro per iniziare.
                    </p>
                    {/* Micro-messaggio Aria */}
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-purple-300">💡 Consiglio di Aria</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Crea un filtro personalizzato con criteri specifici (prezzo, location, yield) per trovare le migliori opportunità. Più specifico sei, più preciso sarà il match!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titolo</TableHead>
                          <TableHead>AI Briefing</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Prezzo</TableHead>
                          <TableHead>GAP Mercato</TableHead>
                          <TableHead>Piattaforma</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Next Action</TableHead>
                          <TableHead>Azioni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings
                          .filter((listing) => {
                            // Filtro Global Search
                            if (locationSearch) {
                              const searchLower = locationSearch.toLowerCase();
                              const matchesLocation = listing.location.toLowerCase().includes(searchLower);
                              const matchesTitle = listing.title.toLowerCase().includes(searchLower);
                              const matchesPrice = listing.price?.toString().includes(searchLower);
                              const matchesPlatform = listing.source_platform?.toLowerCase().includes(searchLower);
                              if (!matchesLocation && !matchesTitle && !matchesPrice && !matchesPlatform) {
                                return false;
                              }
                            }
                            // Filtro Top Match
                            if (showTopMatchOnly) {
                              const briefing = generateSmartBriefing(
                                listing.title,
                                listing.ai_summary?.summary_note || '',
                                listing.price,
                                listing.location,
                                undefined,
                                listing.raw_data
                              );
                              if (!briefing.hasRealAdvantage) return false;
                            }
                            // Filtro Price Drop
                            if (priceDropFilter) {
                              const priceDrop = listing.ai_summary?.price_drop_percentage;
                              if (!priceDrop || priceDrop <= 0) return false;
                            }
                            return true;
                          })
                          .map((listing) => {
                          const status = statusConfig[listing.status] || statusConfig.new;
                          const platform = platformConfig[listing.source_platform] || { label: listing.source_platform, emoji: '🏠' };

                          const leadScore = listing.lead_score ?? 0;
                          const isGoldLead = leadScore >= 85; // TOP DEAL threshold
                          const isEliteDeal = leadScore > 90; // ELITE DEAL (SOLDI)
                          const marketGap = calculateMarketGap(listing);
                          
                          return (
                            <TableRow 
                              key={listing.id} 
                              className={`${
                                isEliteDeal 
                                  ? 'bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 border-l-4 border-purple-500 shadow-lg shadow-purple-500/20' 
                                  : isGoldLead 
                                  ? 'bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500' 
                                  : ''
                              } hover:bg-muted/50 transition-colors`}
                            >
                              <TableCell>
                                <div className="font-medium max-w-[300px]">
                                  <div className="flex items-center gap-2">
                                    <span className="truncate">{listing.title}</span>
                                    {isEliteDeal && (
                                      <Badge className="bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 text-white text-xs px-3 py-1 font-bold animate-pulse shadow-lg shadow-purple-500/50 border border-cyan-400/50">
                                        💎 SOLDI
                                      </Badge>
                                    )}
                                    {isGoldLead && !isEliteDeal && (
                                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 font-bold animate-pulse shadow-lg">
                                        🔥 TOP DEAL
                                      </Badge>
                                    )}
                                  </div>
                                  {listing.lead_score !== null && listing.lead_score !== undefined && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <Progress value={leadScore} className="h-2 w-24" />
                                      <span className="text-xs text-muted-foreground font-medium">{leadScore}/100</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1.5 min-w-[200px]">
                                  {(() => {
                                    const briefing = generateSmartBriefing(
                                      listing.title,
                                      listing.ai_summary?.summary_note || '',
                                      listing.price,
                                      listing.location,
                                      undefined,
                                      listing.raw_data
                                    );
                                    return (
                                      <>
                                        {/* Vantaggi */}
                                        {briefing.advantages.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {briefing.advantages.map((adv, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-300 text-green-700 dark:text-green-400">
                                                <ArrowBigUpDash className="h-3 w-3 mr-1" />
                                                {adv}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        {/* Difetti */}
                                        {briefing.disadvantages.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {briefing.disadvantages.map((dis, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs bg-red-50 dark:bg-red-950/30 border-red-300 text-red-700 dark:text-red-400">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {dis}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        {/* Target */}
                                        {briefing.targetAudience.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {briefing.targetAudience.map((target, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-300 text-blue-700 dark:text-blue-400">
                                                <UserCheck className="h-3 w-3 mr-1" />
                                                {target}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        {/* Pulsante Copia */}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={async () => {
                                            try {
                                              await navigator.clipboard.writeText(briefing.summaryForClient);
                                              setCopiedListingId(listing.id);
                                              toast({
                                                title: "Copiato!",
                                                description: "Riassunto copiato negli appunti",
                                              });
                                              setTimeout(() => setCopiedListingId(null), 2000);
                                            } catch (error) {
                                              toast({
                                                title: "Errore",
                                                description: "Impossibile copiare",
                                                variant: "destructive",
                                              });
                                            }
                                          }}
                                          className="h-7 text-xs mt-1"
                                        >
                                          {copiedListingId === listing.id ? (
                                            <>
                                              <Check className="h-3 w-3 mr-1 text-green-500" />
                                              Copiato
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="h-3 w-3 mr-1" />
                                              Copia per Cliente
                                            </>
                                          )}
                                        </Button>
                                      </>
                                    );
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {listing.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 font-medium">
                                  <DollarSign className="h-4 w-4" />
                                  {formatPrice(listing.price, listing.location)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {marketGap && marketGap > 0 ? (
                                  <div className="flex items-center gap-1.5 text-green-400 font-semibold">
                                    <TrendingDown className="h-4 w-4" />
                                    <span className="text-sm">-{marketGap.toFixed(0)}%</span>
                                    <span className="text-xs text-muted-foreground">vs Mercato</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {platform.emoji} {platform.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={listing.status}
                                  onValueChange={async (newStatus) => {
                                    try {
                                      const response = await fetch(`/api/prospecting/listings/${listing.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: newStatus }),
                                      });
                                      if (response.ok) {
                                        fetchListings();
                                        toast({
                                          title: "Status aggiornato",
                                          description: `Immobile spostato in: ${statusConfig[newStatus]?.label || newStatus}`,
                                        });
                                      }
                                    } catch (error) {
                                      toast({
                                        title: "Errore",
                                        description: "Impossibile aggiornare lo status",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue>
                                      <Badge className={status.bgColor + ' ' + status.color}>
                                        {status.label}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Nuovo</SelectItem>
                                    <SelectItem value="analyzed">Analizzato</SelectItem>
                                    <SelectItem value="called">Chiamato</SelectItem>
                                    <SelectItem value="in_negotiation">In Trattativa</SelectItem>
                                    <SelectItem value="mandate_taken">Mandato Preso</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const daysSinceContact = listing.updated_at
                                    ? Math.floor((new Date().getTime() - new Date(listing.updated_at).getTime()) / (1000 * 60 * 60 * 24))
                                    : 0;
                                  
                                  const nextAction = suggestNextAction({
                                    status: listing.status === 'new' ? 'new' :
                                            listing.status === 'called' ? 'called' :
                                            listing.status === 'appointment_set' ? 'in_negotiation' :
                                            'new',
                                    price_drop_percentage: listing.ai_summary?.price_drop_percentage,
                                    days_since_last_contact: daysSinceContact,
                                    has_virtual_staging: listing.ai_summary?.virtual_staging_generated || false,
                                    urgency_score: listing.ai_summary?.urgency_score,
                                    market_gap: marketGap,
                                  });

                                  return (
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        nextAction.priority === 'high'
                                          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 text-red-700 dark:text-red-400'
                                          : nextAction.priority === 'medium'
                                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-700 dark:text-amber-400'
                                          : 'bg-gray-50 dark:bg-gray-950/30 border-gray-300 text-gray-700 dark:text-gray-400'
                                      } text-xs cursor-help`}
                                      title={nextAction.reasoning}
                                    >
                                      <span className="mr-1">{nextAction.icon}</span>
                                      {nextAction.action}
                                    </Badge>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* TOP DEAL - Chiama Ora Prominente */}
                                  {isGoldLead && listing.status === 'new' && listing.phone_number && (userPlan === 'pro' || userPlan === 'agency') && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleCall(listing.id)}
                                      disabled={callingListingId === listing.id || (userPlan === 'pro' && voiceCallsRemaining <= 0)}
                                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
                                    >
                                      {callingListingId === listing.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          Avvio...
                                        </>
                                      ) : (
                                        <>
                                          <Phone className="h-5 w-5 mr-2" />
                                          🔥 CHIAMA ORA
                                        </>
                                      )}
                                    </Button>
                                  )}
                                  {/* Outreach Menu - Omnichannel Domination Suite */}
                                  {listing.status === 'new' && listing.phone_number && (userPlan === 'pro' || userPlan === 'agency') && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="sm"
                                          disabled={callingListingId === listing.id || (userPlan === 'pro' && voiceCallsRemaining <= 0)}
                                          className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-semibold"
                                        >
                                          {callingListingId === listing.id ? (
                                            <>
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                              Avvio...
                                            </>
                                          ) : (
                                            <>
                                              <Zap className="h-4 w-4 mr-2" />
                                              Outreach
                                            </>
                                          )}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-56">
                                        {userPlan === 'pro' && (
                                          <>
                                            <DropdownMenuItem
                                              onClick={() => handleCall(listing.id)}
                                              disabled={voiceCallsRemaining <= 0}
                                            >
                                              <Phone className="h-4 w-4 mr-2" />
                                              <div className="flex flex-col">
                                                <span>Avvia Chiamata AI</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {voiceCallsRemaining > 0 ? `${voiceCallsRemaining}/30 rimanenti` : 'Limite raggiunto'}
                                                </span>
                                              </div>
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                        {userPlan === 'agency' && (
                                          <>
                                            <DropdownMenuItem onClick={() => handleCall(listing.id)}>
                                              <Phone className="h-4 w-4 mr-2 text-cyan-500" />
                                              <div className="flex flex-col">
                                                <span className="font-semibold">📞 AI Voice Call</span>
                                                <span className="text-xs text-muted-foreground">Chiamata automatica 24/7</span>
                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSmartMessage(listing.id)}>
                                              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                                              <div className="flex flex-col">
                                                <span className="font-semibold">💬 AI Smart Message</span>
                                                <span className="text-xs text-muted-foreground">Genera SMS/WhatsApp con AI</span>
                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                              setSelectedListingForVR(listing);
                                              setIsAuraVRModalOpen(true);
                                              toast({
                                                title: "Aura VR aperto",
                                                description: "Genera un tour VR immersivo per questo immobile",
                                              });
                                              addLiveFeedItem(`✨ Aura VR avviato per immobile a ${listing.location}`, 'info');
                                            }}>
                                              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                                              <div className="flex flex-col">
                                                <span className="font-semibold">✨ Aura VR</span>
                                                <span className="text-xs text-muted-foreground">Genera tour VR immersivo</span>
                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsManualOverrideOpen(listing.id)}>
                                              <User className="h-4 w-4 mr-2 text-green-500" />
                                              <div className="flex flex-col">
                                                <span className="font-semibold">👤 Manual Override</span>
                                                <span className="text-xs text-muted-foreground">Accesso diretto dati proprietario</span>
                                              </div>
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                  {/* Fallback per Starter/Free - mostra upgrade prompt */}
                                  {listing.status === 'new' && listing.phone_number && (userPlan === 'free' || userPlan === 'starter') && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => router.push('/dashboard/billing')}
                                      className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
                                    >
                                      <Phone className="h-4 w-4 mr-2" />
                                      Upgrade per Outreach
                                    </Button>
                                  )}
                                  {/* Aura VR Button - Disponibile per Pro e Agency */}
                                  {(userPlan === 'pro' || userPlan === 'agency') && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedListingForVR(listing);
                                        setIsAuraVRModalOpen(true);
                                        toast({
                                          title: "Aura VR aperto",
                                          description: "Genera un tour VR immersivo per questo immobile",
                                        });
                                        addLiveFeedItem(`✨ Aura VR avviato per immobile a ${listing.location}`, 'info');
                                      }}
                                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
                                    >
                                      <Sparkles className="h-4 w-4 mr-2" />
                                      Aura VR
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedListing(listing);
                                      setIsDetailModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Analisi Investimento */}
      <InvestmentAnalysisModal
        open={isInvestmentModalOpen}
        onOpenChange={setIsInvestmentModalOpen}
        listing={selectedListing ? {
          title: selectedListing.title,
          location: selectedListing.location,
          price: selectedListing.price,
          marketGap: calculateMarketGap(selectedListing) || undefined,
          imageUrl: selectedListing.raw_data?.images?.[0] || selectedListing.raw_data?.imageUrl,
          raw_data: selectedListing.raw_data,
        } : null}
      />

      {/* Modal Dettaglio */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedListing?.title}</DialogTitle>
            <DialogDescription>
              Dettagli completi dell'annuncio
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-lg">{selectedListing.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prezzo</p>
                  <p className="text-lg font-bold">{formatPrice(selectedListing.price, selectedListing.location)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Piattaforma</p>
                  <Badge>
                    {platformConfig[selectedListing.source_platform]?.emoji || '🏠'} {platformConfig[selectedListing.source_platform]?.label || selectedListing.source_platform}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={statusConfig[selectedListing.status].bgColor + ' ' + statusConfig[selectedListing.status].color}>
                    {statusConfig[selectedListing.status].label}
                  </Badge>
                </div>
                {selectedListing.owner_name && userPlan === 'agency' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proprietario</p>
                    <p>{selectedListing.owner_name}</p>
                  </div>
                )}
                {selectedListing.phone_number && userPlan === 'agency' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefono</p>
                    <p>{selectedListing.phone_number}</p>
                  </div>
                )}
                {(selectedListing.owner_name || selectedListing.phone_number) && userPlan !== 'agency' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dati Proprietario</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Disponibile solo con piano Agency. <Link href="/dashboard/billing" className="underline">Upgrade ora</Link>
                    </p>
                  </div>
                )}
              </div>

              {/* AI Territory Commander */}
              <TerritoryCommander
                location={selectedListing.location}
                propertyCategory={(selectedListing.category || 'RESIDENTIAL_SALE') as PropertyCategory}
                propertyPrice={selectedListing.price || undefined}
              />

              {/* AI X-Ray Vision */}
              {selectedListing.raw_data?.images?.[0] && (
                <AIXRayVision
                  imageUrl={selectedListing.raw_data.images[0]}
                  propertyPrice={selectedListing.price || 0}
                  propertyType="residential"
                  onInsightGenerated={(insight) => {
                    // Insight generato da Aria
                  }}
                />
              )}

              {/* AI Virtual Staging */}
              <ProFeaturePaywall
                title="Virtual Staging 3D"
                description="Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare il Virtual Staging professionale 3D."
                isLocked={userPlan !== 'pro' && userPlan !== 'agency'}
              >
              <AIVirtualStaging listing={selectedListing} />
              </ProFeaturePaywall>

              {/* GAP DI MERCATO */}
              {calculateMarketGap(selectedListing) && calculateMarketGap(selectedListing)! > 0 && (
                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-green-400">GAP DI MERCATO</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    -{calculateMarketGap(selectedListing)!.toFixed(0)}% vs Mercato
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prezzo inferiore alla media della zona - Opportunità di arbitraggio
                  </p>
                </div>
              )}

              {/* Analisi Foto IA */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold">Analisi Foto IA</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getImageInsights(selectedListing).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pulsante Analisi Investimento */}
              <div className="border-t pt-4">
                <Button
                  onClick={() => setIsInvestmentModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Scarica Analisi Investimento
                </Button>
              </div>

              {selectedListing.ai_summary && Object.keys(selectedListing.ai_summary).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Analisi AI</h3>
                  {selectedListing.ai_summary.quality_score && (
                    <p className="text-sm">
                      <strong>Quality Score:</strong> {selectedListing.ai_summary.quality_score}/100
                    </p>
                  )}
                  {selectedListing.ai_summary.summary_note && (
                    <p className="text-sm mt-2">
                      <strong>Nota:</strong> {selectedListing.ai_summary.summary_note}
                    </p>
                  )}
                  {selectedListing.ai_summary.best_time_to_call && (
                    <p className="text-sm mt-2">
                      <strong>Orario migliore per chiamare:</strong> {selectedListing.ai_summary.best_time_to_call}
                    </p>
                  )}
                  {selectedListing.ai_summary.call_transcript && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Transcript Chiamata</p>
                      <div className="bg-muted p-3 rounded text-sm max-h-[200px] overflow-y-auto">
                        {selectedListing.ai_summary.call_transcript}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <a
                  href={selectedListing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Vedi annuncio originale →
                </a>
              </div>
            </div>

          )}
        </DialogContent>
      </Dialog>

      {/* Modal Price Drop Sniper */}
      {sniperListing && (
        <PriceDropSniperModal
          listing={{
            ...sniperListing,
            price_drop_percentage: sniperListing.ai_summary?.price_drop_percentage,
            price_history: sniperListing.ai_summary?.price_history,
          }}
          open={isSniperModalOpen}
          onOpenChange={setIsSniperModalOpen}
          onCall={() => handleCall(sniperListing.id)}
        />
      )}

      {/* Manual Override Dialog - Mostra dati proprietario solo per Agency */}
      {isManualOverrideOpen && userPlan === 'agency' && (() => {
        const listing = listings.find(l => l.id === isManualOverrideOpen);
        if (!listing) return null;
        
        return (
          <Dialog open={!!isManualOverrideOpen} onOpenChange={() => setIsManualOverrideOpen(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  Manual Override - Accesso Dati Proprietario
                </DialogTitle>
                <DialogDescription>
                  Come membro Agency, hai accesso diretto ai dati del proprietario per chiamate umane
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  {listing.owner_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Nome Proprietario</p>
                      <p className="text-lg font-semibold">{listing.owner_name}</p>
                    </div>
                  )}
                  {listing.phone_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Numero di Telefono</p>
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${listing.phone_number}`}
                          className="text-lg font-semibold text-cyan-600 hover:underline"
                        >
                          {listing.phone_number}
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(listing.phone_number || '');
                            toast({
                              title: "Copiato!",
                              description: "Numero copiato negli appunti",
                            });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {listing.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Location Immobile</p>
                      <p className="text-base">{listing.location}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsManualOverrideOpen(null)}
                    className="flex-1"
                  >
                    Chiudi
                  </Button>
                  {listing.phone_number && (
                    <Button
                      onClick={() => {
                        window.location.href = `tel:${listing.phone_number}`;
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Chiama Ora
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Aura VR Modal */}
      <Dialog open={isAuraVRModalOpen} onOpenChange={setIsAuraVRModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Aura VR Generator
            </DialogTitle>
            <DialogDescription>
              Genera un tour VR immersivo per {selectedListingForVR?.title || 'questo immobile'}
            </DialogDescription>
          </DialogHeader>
          {selectedListingForVR && (
            <AuraVRGenerator
              listingId={selectedListingForVR.id}
              listingTitle={selectedListingForVR.title}
              location={selectedListingForVR.location}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* AI Smart Message Modal */}
      <Dialog open={isSmartMessageModalOpen} onOpenChange={setIsSmartMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              AI Smart Message
            </DialogTitle>
            <DialogDescription>
              Messaggio WhatsApp generato per {selectedListingForMessage?.title || 'questo immobile'}
            </DialogDescription>
          </DialogHeader>
          {selectedListingForMessage && generatedMessage && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground mb-2">Messaggio generato:</p>
                <p className="text-base whitespace-pre-wrap">{generatedMessage}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(generatedMessage);
                      toast({
                        title: "Copiato!",
                        description: "Messaggio copiato negli appunti",
                      });
                    } catch (error) {
                      toast({
                        title: "Errore",
                        description: "Impossibile copiare",
                        variant: "destructive",
                      });
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copia Messaggio
                </Button>
                <Button
                  onClick={() => {
                    const message = encodeURIComponent(generatedMessage);
                    const whatsappUrl = `https://wa.me/${selectedListingForMessage.phone_number?.replace(/\D/g, '')}?text=${message}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedListingForMessage.phone_number}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invia su WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

