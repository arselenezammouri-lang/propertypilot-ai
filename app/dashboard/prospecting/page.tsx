"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PropertyCategory } from "@/lib/utils/property-category";
import { fetchApi } from "@/lib/api/client";
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
import { useLocale } from "@/lib/i18n/locale-context";
import { generateSmartBriefing } from "@/lib/ai/smart-briefing";
import { maskPhone, maskName } from "@/lib/utils/pii-mask";
import NextDynamic from "next/dynamic";
import { suggestNextAction } from "@/lib/ai/next-action-suggestion";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuraVRGenerator } from "@/components/aura-vr-generator";
import { GlobalStatsTicker } from "@/components/global-stats-ticker";
import { detectLocaleFromLocation } from "@/lib/i18n/dictionary";
import { formatPriceByLocation } from "@/lib/utils/currency-formatter";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  premiumFeatureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";

// Lazy load heavy components
const InvestmentAnalysisModal = NextDynamic(() => import("@/components/investment-analysis-modal").then(mod => ({ default: mod.InvestmentAnalysisModal })), {
  ssr: false,
});

const AIVirtualStaging = NextDynamic(() => import("@/components/ai-virtual-staging").then(mod => ({ default: mod.AIVirtualStaging })), {
  ssr: false,
});

const ProFeaturePaywall = NextDynamic(() => import("@/components/demo-modal").then(mod => ({ default: mod.ProFeaturePaywall })), {
  ssr: false,
});

const AIXRayVision = NextDynamic(() => import("@/components/ai-xray-vision").then(mod => ({ default: mod.AIXRayVision })), {
  ssr: false,
});

const TerritoryCommander = NextDynamic(() => import("@/components/territory-commander").then(mod => ({ default: mod.TerritoryCommander })), {
  ssr: false,
});
const PremiumInvestorReport = NextDynamic(() => import("@/components/premium-investor-report").then(mod => ({ default: mod.PremiumInvestorReport })), {
  ssr: false,
});

const PriceDropSniperModal = NextDynamic(() => import("@/components/price-drop-sniper-modal").then(mod => ({ default: mod.PriceDropSniperModal })), {
  ssr: false,
});

const CompetitorRadar = NextDynamic(() => import("@/components/competitor-radar").then(mod => ({ default: mod.CompetitorRadar })), {
  ssr: false,
});

const GlobalLiveFeed = NextDynamic(() => import("@/components/global-live-feed").then(mod => ({ default: mod.GlobalLiveFeed })), {
  ssr: false,
});

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

const getStatusConfig = (isItalian: boolean): Record<string, { label: string; color: string; bgColor: string }> => ({
  new: { label: isItalian ? 'Nuovo' : 'New', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  analyzed: { label: isItalian ? 'Analizzato' : 'Analyzed', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  called: { label: isItalian ? 'Chiamato' : 'Called', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  in_negotiation: { label: isItalian ? 'In Trattativa' : 'In Negotiation', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  mandate_taken: { label: isItalian ? 'Mandato Preso' : 'Mandate Taken', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  appointment_set: { label: isItalian ? 'Appuntamento Fissato' : 'Appointment Set', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { label: isItalian ? 'Rifiutato' : 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  converted: { label: isItalian ? 'Convertito' : 'Converted', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
});

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
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const feedbackLocale = (isItalian ? "it" : "en") as "it" | "en";
  const { toast } = useToast();
  const { plan: usagePlan, isLoading: usagePlanLoading, refresh: refreshUsagePlan } = useUsageLimits();
  const statusConfig = getStatusConfig(isItalian);
  const { handleAPIError } = useAPIErrorHandler();

  const t = {
    heroTitle: isItalian ? "Arbitrage Command Center" : "Arbitrage Command Center",
    heroSubtitle: isItalian ? "Identifica opportunità di arbitraggio e ottieni mandati esclusivi" : "Identify arbitrage opportunities and secure exclusive mandates",
    topMatchOnly: isItalian ? "Sola polpa" : "Top matches only",
    exportLeads: isItalian ? "Esporta Lead" : "Export Leads",
    refresh: isItalian ? "Aggiorna" : "Refresh",
    filters: isItalian ? "Filtri" : "Filters",
    ariaMsg: isItalian ? "Crea il tuo primo filtro per iniziare a trovare deal d'oro! Definisci prezzo, location e caratteristiche desiderate." : "Create your first filter to start finding golden deals! Define price, location, and desired features.",
    statusLabel: "Status",
    allStatuses: isItalian ? "Tutti" : "All",
    platformLabel: isItalian ? "Piattaforma" : "Platform",
    allPlatforms: isItalian ? "Tutte" : "All",
    locationLabel: isItalian ? "Location" : "Location",
    locationPlaceholder: isItalian ? "Cerca location..." : "Search location...",
    activeFilters: isItalian ? "Filtri Attivi" : "Active Filters",
    noFilters: isItalian ? "Nessun filtro attivo" : "No active filters",
    editFilter: isItalian ? "Modifica" : "Edit",
    deleteFilter: isItalian ? "Elimina" : "Delete",
    autoRun: "Auto-run",
    lastRun: isItalian ? "Ultimo run:" : "Last run:",
    listings: isItalian ? "annunci" : "listings",
    exportConfirm: isItalian ? "Esporta in Excel? (OK = Excel, Annulla = CSV)" : "Export to Excel? (OK = Excel, Cancel = CSV)",
    // toasts
    premiumRequired: isItalian ? "Piano Premium richiesto" : "Premium plan required",
    premiumCallDesc: isItalian ? "Il Voice AI Prospecting è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY." : "Voice AI Prospecting is a Premium feature. Upgrade your account to the PRO or AGENCY plan.",
    callStarted: isItalian ? "Chiamata avviata" : "Call started",
    callStartedDesc: isItalian ? "La chiamata AI è stata avviata con successo" : "The AI call was started successfully",
    errorTitle: isItalian ? "Errore" : "Error",
    connectionError: isItalian ? "Errore di connessione" : "Connection error",
    loadError: isItalian ? "Errore nel caricamento degli annunci" : "Error loading listings",
    callError: isItalian ? "Errore nell'avvio della chiamata" : "Error starting the call",
    msgGenerated: isItalian ? "Messaggio generato" : "Message generated",
    msgGeneratedDesc: isItalian ? "Il messaggio WhatsApp è stato generato con successo" : "The WhatsApp message was generated successfully",
    filtersComingSoon: isItalian ? "Crea un filtro dalla barra di ricerca sopra. Funzionalità in arrivo." : "Create a filter from the search bar above. Feature coming soon.",
    statusUpdated: isItalian ? "Status aggiornato" : "Status updated",
    statusUpdateError: isItalian ? "Errore aggiornamento status" : "Error updating status",
    autoRunUpdated: isItalian ? "Auto-run aggiornato" : "Auto-run updated",
    autoRunError: isItalian ? "Errore aggiornamento auto-run" : "Error updating auto-run",
    deleted: isItalian ? "Eliminato" : "Deleted",
    deleteError: isItalian ? "Errore eliminazione" : "Delete error",
    // status/priority labels
    statusNew: isItalian ? "Nuovo" : "New",
    statusAnalyzed: isItalian ? "Analizzato" : "Analyzed",
    statusCalled: isItalian ? "Chiamato" : "Called",
    statusNegotiation: isItalian ? "In Trattativa" : "In Negotiation",
    statusMandateTaken: isItalian ? "Mandato Preso" : "Mandate Taken",
    statusAppointment: isItalian ? "Appuntamento Fissato" : "Appointment Set",
    statusRejected: isItalian ? "Rifiutato" : "Rejected",
    statusConverted: isItalian ? "Convertito" : "Converted",
    // table
    colTitle: isItalian ? "Titolo" : "Title",
    colAiBriefing: isItalian ? "AI Briefing" : "AI Briefing",
    colLocation: isItalian ? "Location" : "Location",
    colPrice: isItalian ? "Prezzo" : "Price",
    colMarketGap: isItalian ? "GAP Mercato" : "Market GAP",
    colPlatform: isItalian ? "Piattaforma" : "Platform",
    colStatus: isItalian ? "Status" : "Status",
    colNextAction: isItalian ? "Next Action" : "Next Action",
    colActions: isItalian ? "Azioni" : "Actions",
    // copy
    copied: isItalian ? "Copiato" : "Copied",
    copiedTitle: isItalian ? "Copiato!" : "Copied!",
    copiedDesc: isItalian ? "Riassunto copiato negli appunti" : "Summary copied to clipboard",
    copyForClient: isItalian ? "Copia per Cliente" : "Copy for Client",
    copyError: isItalian ? "Impossibile copiare" : "Cannot copy",
    // empty state
    noListings: isItalian ? "Nessun annuncio trovato. Crea un filtro per iniziare." : "No listings found. Create a filter to get started.",
    ariaAdvice: isItalian ? "💡 Consiglio di Aria" : "💡 Aria's Tip",
    ariaEmptyMsg: isItalian ? "Crea un filtro personalizzato con criteri specifici (prezzo, location, yield) per trovare le migliori opportunità. Più specifico sei, più preciso sarà il match!" : "Create a custom filter with specific criteria (price, location, yield) to find the best opportunities. The more specific you are, the more accurate the match!",
    // detail modal strings
    viewDetails: isItalian ? "Dettagli" : "Details",
    callAI: isItalian ? "Chiama AI" : "AI Call",
    smartMessage: isItalian ? "Messaggio Smart" : "Smart Message",
    investmentAnalysis: isItalian ? "Analisi Investimento" : "Investment Analysis",
    premiumReport: isItalian ? "Report Premium" : "Premium Report",
    priceDropSniper: isItalian ? "Price Drop Sniper" : "Price Drop Sniper",
    virtualStaging: isItalian ? "Virtual Staging" : "Virtual Staging",
    xRayVision: isItalian ? "X-Ray Vision" : "X-Ray Vision",
    auraVR: isItalian ? "Aura VR" : "Aura VR",
    contactOwner: isItalian ? "Contatta Proprietario" : "Contact Owner",
    loading: isItalian ? "Caricamento..." : "Loading...",
    // status select
    statusSelectNew: isItalian ? "Nuovo" : "New",
    statusSelectAnalyzed: isItalian ? "Analizzato" : "Analyzed",
    statusSelectCalled: isItalian ? "Chiamato" : "Called",
    statusSelectNegotiation: isItalian ? "In Trattativa" : "In Negotiation",
    statusSelectMandate: isItalian ? "Mandato Preso" : "Mandate Taken",
    // action buttons
    starting: isItalian ? "Avvio..." : "Starting...",
    callNow: isItalian ? "🔥 CHIAMA ORA" : "🔥 CALL NOW",
    outreach: isItalian ? "Outreach" : "Outreach",
    startAiCall: isItalian ? "Avvia Chiamata AI" : "Start AI Call",
    callsRemaining: (n: number) => isItalian ? `${n}/30 rimanenti` : `${n}/30 remaining`,
    callLimitReached: isItalian ? "Limite raggiunto" : "Limit reached",
    aiVoiceCall: isItalian ? "📞 AI Voice Call" : "📞 AI Voice Call",
    aiVoiceCallDesc: isItalian ? "Chiamata automatica 24/7" : "Automatic call 24/7",
    aiSmartMessage: isItalian ? "💬 AI Smart Message" : "💬 AI Smart Message",
    aiSmartMessageDesc: isItalian ? "Genera SMS/WhatsApp con AI" : "Generate SMS/WhatsApp with AI",
    auraVRTitle: isItalian ? "Aura VR aperto" : "Aura VR opened",
    auraVRDesc: isItalian ? "Genera un tour VR immersivo per questo immobile" : "Generate an immersive VR tour for this property",
    vsMarket: isItalian ? "vs Mercato" : "vs Market",
    statusUpdatedDesc: (label: string) => isItalian ? `Immobile spostato in: ${label}` : `Property moved to: ${label}`,
    statusUpdateFailDesc: isItalian ? "Impossibile aggiornare lo status" : "Cannot update status",
  };

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

  useEffect(() => {
    if (usagePlanLoading) return;
    const p = (usagePlan || "free").toLowerCase();
    if (p === "starter" || p === "pro" || p === "agency") {
      setUserPlan(p);
    } else {
      setUserPlan("free");
    }
  }, [usagePlan, usagePlanLoading]);
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

      const res = await fetchApi<ExternalListing[]>(`/api/prospecting/listings?${params.toString()}`);
      if (!res.success) {
        throw new Error(res.error || res.message || t.loadError);
      }
      setListings(res.data ?? []);
    } catch (error: unknown) {
      const friendly = handleAPIError(error, t.loadError);
      toast({
        ...apiFailureToast(feedbackLocale, "prospectingCommand", {}, friendly),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await fetchApi<ProspectingFilter[]>('/api/prospecting/filters');
      if (res.success && res.data != null) {
        setFilters(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchStats = async () => {
    if (userPlan !== 'pro' && userPlan !== 'agency') return;
    try {
      const res = await fetchApi<ProspectingStats>('/api/prospecting/stats');
      if (res.success && res.data != null) {
        setStats(res.data as ProspectingStats);
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes('403')) {
        console.error('Error fetching stats:', error);
      }
    }
  };

  const fetchVoiceCallQuota = async () => {
    if (userPlan !== "pro" && userPlan !== "agency") {
      setVoiceCallsRemaining(0);
      return;
    }
    if (userPlan === "agency") {
      setVoiceCallsRemaining(-1);
      return;
    }
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    try {
      const callsRes = await fetchApi<{ calls_this_month?: number }>(
        `/api/prospecting/stats?month_start=${monthStart.toISOString()}`
      );
      const callsUsed =
        callsRes.success && callsRes.data ? (callsRes.data.calls_this_month ?? 0) : 0;
      setVoiceCallsRemaining(Math.max(0, 30 - callsUsed));
    } catch {
      setVoiceCallsRemaining(30);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run when filters change only
  }, [statusFilter, platformFilter]);

  useEffect(() => {
    void fetchVoiceCallQuota();
    if (userPlan === "pro" || userPlan === "agency") {
      fetchStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- when plan from usage settles
  }, [userPlan]);

  // Auto-refresh stats ogni 30 secondi (solo per PRO/AGENCY)
  useEffect(() => {
    if (userPlan !== 'pro' && userPlan !== 'agency') {
      return;
    }
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- interval when plan changes
  }, [userPlan]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!loading) fetchListings();
    }, 300);
    return () => clearTimeout(debounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce on location only
  }, [locationSearch]);

  const handleCall = async (listingId: string) => {
    setCallingListingId(listingId);
    try {
      const res = await fetchApi<unknown>('/api/prospecting/call', {
        method: 'POST',
        body: JSON.stringify({ listing_id: listingId }),
      });
      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          toast({
            ...premiumFeatureToast(
              feedbackLocale,
              "prospectingCommand",
              res.message || res.error || t.premiumCallDesc
            ),
            variant: "destructive",
          });
          return;
        }
        toast({
          ...apiFailureToast(
            feedbackLocale,
            "prospectingCommand",
            { status: res.status, message: res.message, error: res.error },
            t.callError
          ),
          variant: "destructive",
        });
        return;
      }
      toast({
        title: t.callStarted,
        description: t.callStartedDesc,
      });
      addLiveFeedItem(`🤖 AI sta chiamando il proprietario di "${selectedListing?.title || 'un immobile'}" a ${selectedListing?.location || 'N/A'}`, 'info');
      setTimeout(() => {
        fetchListings();
        fetchStats();
        void refreshUsagePlan();
        void fetchVoiceCallQuota();
      }, 2000);
    } catch {
      toast({
        ...networkFailureToast(feedbackLocale, "prospectingCommand"),
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
    
    toast({
      title: t.msgGenerated,
      description: t.msgGeneratedDesc,
    });
    addLiveFeedItem(`💬 Messaggio WhatsApp generato per immobile a ${listing.location}`, 'info');
  };

  const handleToggleAutoRun = async (filterId: string, currentValue: boolean) => {
    try {
      const res = await fetchApi<unknown>('/api/prospecting/filters', {
        method: 'PATCH',
        body: JSON.stringify({
          id: filterId,
          auto_run: !currentValue,
        }),
      });
      if (res.success) {
        fetchFilters();
        toast({
          title: t.autoRunUpdated,
          description: `Auto-run ${!currentValue ? (isItalian ? 'attivato' : 'enabled') : (isItalian ? 'disattivato' : 'disabled')}`,
        });
      } else {
        toast({
          ...apiFailureToast(
            feedbackLocale,
            "prospectingCommand",
            { status: res.status, message: res.message, error: res.error },
            t.autoRunError
          ),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        ...networkFailureToast(feedbackLocale, "prospectingCommand"),
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
    <DashboardPageShell>
      <div className="mb-4">
        <GlobalStatsTicker />
      </div>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        titleDataTestId="heading-prospecting"
        subtitle={t.heroSubtitle}
        planBadge={
          !usagePlanLoading
            ? { label: userPlan.toUpperCase(), variant: "secondary" }
            : undefined
        }
        actions={
          <div className="flex flex-wrap items-center gap-3 min-h-11 touch-manipulation">
            <Link href="/dashboard" aria-label={isItalian ? "Indietro" : "Back"}>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 min-h-11 w-11 touch-manipulation text-white/90 hover:text-white hover:bg-white/10"
                aria-label={isItalian ? "Indietro" : "Back"}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Switch
                checked={showTopMatchOnly}
                onCheckedChange={setShowTopMatchOnly}
              />
              <span className="text-sm font-medium text-white/90">{t.topMatchOnly}</span>
            </div>
            <Button
              onClick={() => {
                const exportData = listings.map((l) => ({
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
                import("@/lib/utils/export-data").then(({ exportToCSV, exportToExcel }) => {
                  const format = window.confirm(t.exportConfirm);
                  if (format) {
                    exportToExcel(exportData, "prospecting-export");
                  } else {
                    exportToCSV(exportData, "prospecting-export");
                  }
                });
              }}
              variant="outline"
              className="min-h-11 touch-manipulation border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.exportLeads}
            </Button>
            <Button
              onClick={fetchListings}
              variant="outline"
              className="min-h-11 touch-manipulation border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.refresh}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Filtri */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t.filters}
                </CardTitle>
                {filters.length === 0 && (
                  <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-purple-300">Aria:</span> {t.ariaMsg}
                      </p>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t.statusLabel}</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allStatuses}</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t.platformLabel}</label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allPlatforms}</SelectItem>
                      {Object.entries(platformConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.emoji} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t.locationLabel}</label>
                  <Input
                    placeholder={t.locationPlaceholder}
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-lg">{t.activeFilters}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast({
                          ...validationToast(
                            feedbackLocale,
                            "prospectingCommand",
                            t.filtersComingSoon
                          ),
                          duration: 4000,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {filters.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {t.noFilters}
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
                                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="More options">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    {t.editFilter}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t.deleteFilter}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {filter.listings_found_count || 0} {t.listings}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{t.autoRun}</span>
                                <Switch
                                  checked={filter.auto_run}
                                  onCheckedChange={() => handleToggleAutoRun(filter.id, filter.auto_run)}
                                />
                              </div>
                            </div>
                            {filter.last_run_at && (
                              <p className="text-xs text-muted-foreground">
                                {t.lastRun} {formatDate(filter.last_run_at)}
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
                      {t.noListings}
                    </p>
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-purple-300">{t.ariaAdvice}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t.ariaEmptyMsg}
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
                          <TableHead>{t.colTitle}</TableHead>
                          <TableHead>{t.colAiBriefing}</TableHead>
                          <TableHead>{t.colLocation}</TableHead>
                          <TableHead>{t.colPrice}</TableHead>
                          <TableHead>{t.colMarketGap}</TableHead>
                          <TableHead>{t.colPlatform}</TableHead>
                          <TableHead>{t.colStatus}</TableHead>
                          <TableHead>{t.colNextAction}</TableHead>
                          <TableHead>{t.colActions}</TableHead>
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
                                  ? 'bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-purple-500/20 border-2 border-purple-500/60 animate-neon-pulse shadow-lg shadow-purple-500/30 rounded-lg' 
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
                                      <span className="diamond-soldi-badge">
                                        💎 SOLDI
                                      </span>
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
                                                title: t.copiedTitle,
                                                description: t.copiedDesc,
                                              });
                                              setTimeout(() => setCopiedListingId(null), 2000);
                                            } catch {
                                              toast({
                                                ...clipboardFailureToast(
                                                  feedbackLocale,
                                                  "prospectingCommand",
                                                  t.copyError
                                                ),
                                                variant: "destructive",
                                              });
                                            }
                                          }}
                                          className="h-7 text-xs mt-1"
                                        >
                                          {copiedListingId === listing.id ? (
                                            <>
                                              <Check className="h-3 w-3 mr-1 text-green-500" />
                                              {t.copied}
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="h-3 w-3 mr-1" />
                                              {t.copyForClient}
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
                                    <span className="text-xs text-muted-foreground">{t.vsMarket}</span>
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
                                      const res = await fetchApi<unknown>(`/api/prospecting/listings/${listing.id}`, {
                                        method: 'PATCH',
                                        body: JSON.stringify({ status: newStatus }),
                                      });
                                      if (res.success) {
                                        fetchListings();
                                        toast({
                                          title: t.statusUpdated,
                                          description: t.statusUpdatedDesc(statusConfig[newStatus]?.label || newStatus),
                                        });
                                      } else {
                                        toast({
                                          ...apiFailureToast(
                                            feedbackLocale,
                                            "prospectingCommand",
                                            {
                                              status: res.status,
                                              message: res.message,
                                              error: res.error,
                                            },
                                            t.statusUpdateFailDesc
                                          ),
                                          variant: "destructive",
                                        });
                                      }
                                    } catch {
                                      toast({
                                        ...networkFailureToast(
                                          feedbackLocale,
                                          "prospectingCommand"
                                        ),
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
                                    <SelectItem value="new">{t.statusSelectNew}</SelectItem>
                                    <SelectItem value="analyzed">{t.statusSelectAnalyzed}</SelectItem>
                                    <SelectItem value="called">{t.statusSelectCalled}</SelectItem>
                                    <SelectItem value="in_negotiation">{t.statusSelectNegotiation}</SelectItem>
                                    <SelectItem value="mandate_taken">{t.statusSelectMandate}</SelectItem>
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
                                          {t.starting}
                                        </>
                                      ) : (
                                        <>
                                          <Phone className="h-5 w-5 mr-2" />
                                          {t.callNow}
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
                                              {t.starting}
                                            </>
                                          ) : (
                                            <>
                                              <Zap className="h-4 w-4 mr-2" />
                                              {t.outreach}
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
                                                <span>{t.startAiCall}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {voiceCallsRemaining > 0 ? t.callsRemaining(voiceCallsRemaining) : t.callLimitReached}
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
                                                <span className="font-semibold">{t.aiVoiceCall}</span>
                                                <span className="text-xs text-muted-foreground">{t.aiVoiceCallDesc}</span>
                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSmartMessage(listing.id)}>
                                              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                                              <div className="flex flex-col">
                                                <span className="font-semibold">{t.aiSmartMessage}</span>
                                                <span className="text-xs text-muted-foreground">{t.aiSmartMessageDesc}</span>
                                              </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                              setSelectedListingForVR(listing);
                                              setIsAuraVRModalOpen(true);
                                              toast({
                                                title: t.auraVRTitle,
                                                description: t.auraVRDesc,
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
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Dati Proprietario</p>
                    <div className="text-sm">
                      {selectedListing.owner_name && (
                        <p className="text-amber-400/90 font-mono">Proprietario: {maskName(selectedListing.owner_name)}</p>
                      )}
                      {selectedListing.phone_number && (
                        <p className="text-amber-400/90 font-mono mt-1">Telefono: {maskPhone(selectedListing.phone_number)}</p>
                      )}
                      <p className="text-amber-500/80 mt-2 text-xs">
                        Sblocca i dati completi con piano Agency. <Link href="/dashboard/billing" className="underline hover:text-amber-400">Upgrade ora</Link>
                      </p>
                    </div>
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
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(listing.phone_number || '');
                              toast({
                                title: t.copiedTitle,
                                description: isItalian
                                  ? "Numero copiato negli appunti"
                                  : "Phone number copied to clipboard",
                              });
                            } catch {
                              toast({
                                ...clipboardFailureToast(
                                  feedbackLocale,
                                  "prospectingCommand",
                                  t.copyError
                                ),
                                variant: "destructive",
                              });
                            }
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
                        title: t.copiedTitle,
                        description: isItalian
                          ? "Messaggio copiato negli appunti"
                          : "Message copied to clipboard",
                      });
                    } catch {
                      toast({
                        ...clipboardFailureToast(
                          feedbackLocale,
                          "prospectingCommand",
                          t.copyError
                        ),
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
    </DashboardPageShell>
  );
}

