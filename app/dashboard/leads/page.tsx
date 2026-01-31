"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Target,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Users,
  TrendingUp,
  RefreshCw,
  Eye,
  StickyNote,
  History,
  Loader2,
  X,
  ChevronRight,
  Sparkles,
  Kanban,
} from "lucide-react";
import { Lead, LeadNote, LeadStatusHistory, LeadPriority, LeadStatus, LeadMarket } from "@/lib/types/database.types";
import { ProFeaturePaywall } from "@/components/demo-modal";

const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: "Nuovo", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  contacted: { label: "Contattato", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  followup: { label: "In Follow-Up", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  closed: { label: "Chiuso", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  lost: { label: "Perso", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

const priorityConfig: Record<LeadPriority, { label: string; color: string; bgColor: string; emoji: string }> = {
  low: { label: "Bassa", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-800", emoji: "⬇️" },
  medium: { label: "Media", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30", emoji: "➡️" },
  high: { label: "Alta", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30", emoji: "🔥" },
};

const marketConfig: Record<LeadMarket, { label: string; emoji: string }> = {
  italy: { label: "Italia", emoji: "🇮🇹" },
  usa: { label: "USA", emoji: "🇺🇸" },
};

export default function LeadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [marketFilter, setMarketFilter] = useState<string>("all");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetails, setLeadDetails] = useState<{ notes: LeadNote[]; status_history: LeadStatusHistory[] } | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    messaggio: "",
    priorita: "medium" as LeadPriority,
    market: "italy" as LeadMarket,
  });
  const [submitting, setSubmitting] = useState(false);
  
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'agency'>('free');
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priorita", priorityFilter);
      if (marketFilter !== "all") params.append("market", marketFilter);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();
      
      // If 403, update user plan to free and show paywall
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.success) {
        setLeads(data.data);
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nel caricamento dei lead",
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, priorityFilter, marketFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!loading) fetchLeads();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const handleAddLead = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Errore",
        description: "Il nome è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      // If 403, update user plan to free and show paywall
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.success) {
        toast({
          title: "Lead creato",
          description: `${formData.nome} è stato aggiunto con successo`,
        });
        setIsAddModalOpen(false);
        setFormData({
          nome: "",
          email: "",
          telefono: "",
          messaggio: "",
          priorita: "medium",
          market: "italy",
        });
        fetchLeads();
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nella creazione del lead",
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
      setSubmitting(false);
    }
  };

  const handleUpdateLead = async () => {
    if (!selectedLead || !formData.nome.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, ...formData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Lead aggiornato",
          description: `${formData.nome} è stato aggiornato`,
        });
        setIsEditModalOpen(false);
        setSelectedLead(null);
        fetchLeads();
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nell'aggiornamento",
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
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;

    try {
      const response = await fetch(`/api/leads?id=${selectedLead.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Lead eliminato",
          description: `${selectedLead.nome} è stato eliminato`,
        });
        setIsDeleteDialogOpen(false);
        setSelectedLead(null);
        fetchLeads();
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nell'eliminazione",
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

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch("/api/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, new_status: newStatus }),
      });
      
      const data = await response.json();
      
      // If 403, update user plan to free and show paywall
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.success) {
        toast({
          title: "Stato aggiornato",
          description: data.message,
        });
        fetchLeads();
        if (isDetailModalOpen && selectedLead?.id === leadId) {
          fetchLeadDetails(leadId);
        }
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nell'aggiornamento dello stato",
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

  const fetchLeadDetails = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      
      // If 403, update user plan to free and show paywall
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.success) {
        setSelectedLead(data.data);
        setLeadDetails({
          notes: data.data.notes || [],
          status_history: data.data.status_history || [],
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei dettagli",
        variant: "destructive",
      });
    }
  };

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
    fetchLeadDetails(lead.id);
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;

    setAddingNote(true);
    try {
      const response = await fetch("/api/leads/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: selectedLead.id, nota: newNote }),
      });
      
      const data = await response.json();
      
      // If 403, update user plan to free and show paywall
      if (response.status === 403) {
        setUserPlan('free');
        toast({
          title: "Piano Premium richiesto",
          description: data.message || data.error || "Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.success) {
        toast({
          title: "Nota aggiunta",
          description: "La nota è stata salvata",
        });
        setNewNote("");
        fetchLeadDetails(selectedLead.id);
      } else {
        toast({
          title: "Errore",
          description: data.error || "Errore nell'aggiunta della nota",
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
      setAddingNote(false);
    }
  };

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      nome: lead.nome,
      email: lead.email || "",
      telefono: lead.telefono || "",
      messaggio: lead.messaggio || "",
      priorita: lead.priorita,
      market: lead.market,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleAnalyzeWithAI = (lead: Lead) => {
    const params = new URLSearchParams({
      messaggio: lead.messaggio || "",
      mercato: lead.market === "italy" ? "italia" : "usa",
    });
    router.push(`/dashboard/lead-score?${params.toString()}`);
  };

  const statsData = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    followup: leads.filter(l => l.status === "followup").length,
    closed: leads.filter(l => l.status === "closed").length,
    lost: leads.filter(l => l.status === "lost").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 animate-fade-in-down backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                    Lead Manager + AI
                  </h1>
                  <p className="text-xs text-muted-foreground">CRM 2.5 - Smart Lead Capture + AI</p>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Link href="/dashboard/leads/pipeline">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-violet-500/50 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                  data-testid="button-pipeline-view"
                >
                  <Kanban className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Pipeline</span>
                </Button>
              </Link>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                disabled={refreshing}
                data-testid="button-refresh-leads"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                data-testid="button-add-lead"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nuovo Lead</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProFeaturePaywall
          title="Lead Manager + AI"
          description="Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare il CRM completo con pipeline, automazioni e AI."
          isLocked={isLocked && !isLoadingPlan}
        >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{statsData.total}</p>
              <p className="text-sm text-muted-foreground">Totali</p>
            </CardContent>
          </Card>
          <Card className={`${statusConfig.new.bgColor} border-0`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${statusConfig.new.color}`}>{statsData.new}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.new.label}</p>
            </CardContent>
          </Card>
          <Card className={`${statusConfig.contacted.bgColor} border-0`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${statusConfig.contacted.color}`}>{statsData.contacted}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.contacted.label}</p>
            </CardContent>
          </Card>
          <Card className={`${statusConfig.followup.bgColor} border-0`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${statusConfig.followup.color}`}>{statsData.followup}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.followup.label}</p>
            </CardContent>
          </Card>
          <Card className={`${statusConfig.closed.bgColor} border-0`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${statusConfig.closed.color}`}>{statsData.closed}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.closed.label}</p>
            </CardContent>
          </Card>
          <Card className={`${statusConfig.lost.bgColor} border-0`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${statusConfig.lost.color}`}>{statsData.lost}</p>
              <p className="text-sm text-muted-foreground">{statusConfig.lost.label}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per nome, email o telefono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-leads"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-status">
                    <SelectValue placeholder="Stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-priority">
                    <SelectValue placeholder="Priorità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le priorità</SelectItem>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={marketFilter} onValueChange={setMarketFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-market">
                    <SelectValue placeholder="Mercato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i mercati</SelectItem>
                    {Object.entries(marketConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nessun lead trovato</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Prova a modificare i filtri di ricerca"
                    : "Inizia ad aggiungere i tuoi primi lead"}
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  data-testid="button-add-first-lead"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Lead
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Contatti</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Priorità</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Mercato</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow 
                        key={lead.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${
                          lead.lead_score > 90 
                            ? 'bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 border-l-4 border-purple-500 shadow-lg shadow-purple-500/20' 
                            : lead.lead_score >= 85 
                            ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-l-4 border-amber-500' 
                            : ''
                        }`}
                        data-testid={`row-lead-${lead.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{lead.nome}</div>
                            {lead.lead_score > 90 && (
                              <Badge className="bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 text-white font-bold px-3 py-1 animate-pulse shadow-lg shadow-purple-500/50 border border-cyan-400/50">
                                💎 SOLDI
                              </Badge>
                            )}
                            {lead.lead_score >= 85 && lead.lead_score <= 90 && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-2 py-0.5 animate-pulse shadow-lg">
                                🔥 TOP DEAL
                              </Badge>
                            )}
                          </div>
                          {lead.messaggio && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {lead.messaggio}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {lead.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                {lead.email}
                              </div>
                            )}
                            {lead.telefono && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                {lead.telefono}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => handleStatusChange(lead.id, value as LeadStatus)}
                          >
                            <SelectTrigger className={`w-[130px] border-0 ${statusConfig[lead.status].bgColor}`} data-testid={`select-status-${lead.id}`}>
                              <Badge variant="outline" className={`${statusConfig[lead.status].color} border-0`}>
                                {statusConfig[lead.status].label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  <Badge variant="outline" className={`${config.color} border-0`}>
                                    {config.label}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${priorityConfig[lead.priorita].bgColor} ${priorityConfig[lead.priorita].color} border-0`}>
                            {priorityConfig[lead.priorita].emoji} {priorityConfig[lead.priorita].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lead.lead_score > 0 ? (
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-emerald-500" />
                              <span className="font-bold">{lead.lead_score}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span>{marketConfig[lead.market].emoji}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString("it-IT")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${lead.id}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDetail(lead)} data-testid={`button-view-${lead.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizza Dettagli
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEdit(lead)} data-testid={`button-edit-${lead.id}`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Modifica
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAnalyzeWithAI(lead)} data-testid={`button-analyze-${lead.id}`}>
                                <Sparkles className="h-4 w-4 mr-2 text-cyan-500" />
                                Lead Scoring AI
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/leads/${lead.id}`)} data-testid={`button-enrich-${lead.id}`}>
                                <Target className="h-4 w-4 mr-2 text-violet-500" />
                                AI Lead Insights
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenDelete(lead)}
                                className="text-red-600"
                                data-testid={`button-delete-${lead.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Elimina
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </ProFeaturePaywall>
      </main>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              Nuovo Lead
            </DialogTitle>
            <DialogDescription>
              Inserisci le informazioni del nuovo lead
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Mario Rossi"
                data-testid="input-lead-nome"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mario@email.com"
                  data-testid="input-lead-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+39 333 1234567"
                  data-testid="input-lead-telefono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priorità</Label>
                <Select
                  value={formData.priorita}
                  onValueChange={(value) => setFormData({ ...formData, priorita: value as LeadPriority })}
                >
                  <SelectTrigger data-testid="select-lead-priorita">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Mercato</Label>
                <Select
                  value={formData.market}
                  onValueChange={(value) => setFormData({ ...formData, market: value as LeadMarket })}
                >
                  <SelectTrigger data-testid="select-lead-market">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(marketConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="messaggio">Messaggio del Lead</Label>
              <Textarea
                id="messaggio"
                value={formData.messaggio}
                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                placeholder="Inserisci il messaggio ricevuto dal lead..."
                rows={4}
                data-testid="textarea-lead-messaggio"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleAddLead}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-submit-lead"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Aggiungi Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-emerald-500" />
              Modifica Lead
            </DialogTitle>
            <DialogDescription>
              Modifica le informazioni del lead
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome *</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                data-testid="input-edit-nome"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-edit-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-telefono">Telefono</Label>
                <Input
                  id="edit-telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  data-testid="input-edit-telefono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priorità</Label>
                <Select
                  value={formData.priorita}
                  onValueChange={(value) => setFormData({ ...formData, priorita: value as LeadPriority })}
                >
                  <SelectTrigger data-testid="select-edit-priorita">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Mercato</Label>
                <Select
                  value={formData.market}
                  onValueChange={(value) => setFormData({ ...formData, market: value as LeadMarket })}
                >
                  <SelectTrigger data-testid="select-edit-market">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(marketConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.emoji} {config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-messaggio">Messaggio del Lead</Label>
              <Textarea
                id="edit-messaggio"
                value={formData.messaggio}
                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                rows={4}
                data-testid="textarea-edit-messaggio"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleUpdateLead}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-update-lead"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Pencil className="h-4 w-4 mr-2" />}
              Salva Modifiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              Dettagli Lead
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedLead.nome}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${statusConfig[selectedLead.status].bgColor} ${statusConfig[selectedLead.status].color} border-0`}>
                        {statusConfig[selectedLead.status].label}
                      </Badge>
                      <Badge className={`${priorityConfig[selectedLead.priorita].bgColor} ${priorityConfig[selectedLead.priorita].color} border-0`}>
                        {priorityConfig[selectedLead.priorita].emoji} {priorityConfig[selectedLead.priorita].label}
                      </Badge>
                      <Badge variant="outline">
                        {marketConfig[selectedLead.market].emoji} {marketConfig[selectedLead.market].label}
                      </Badge>
                    </div>
                  </div>
                  {selectedLead.lead_score > 0 && (
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-500">{selectedLead.lead_score}</div>
                      <div className="text-sm text-muted-foreground">Lead Score</div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.email}</span>
                    </div>
                  )}
                  {selectedLead.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.telefono}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Creato: {new Date(selectedLead.created_at).toLocaleDateString("it-IT")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Aggiornato: {new Date(selectedLead.updated_at).toLocaleDateString("it-IT")}</span>
                  </div>
                </div>

                {selectedLead.messaggio && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Messaggio del Lead
                      </h4>
                      <p className="text-muted-foreground bg-muted p-4 rounded-lg whitespace-pre-wrap">
                        {selectedLead.messaggio}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Note ({leadDetails?.notes.length || 0})
                  </h4>
                  <div className="flex gap-2 mb-4">
                    <Textarea
                      placeholder="Aggiungi una nota..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      data-testid="textarea-new-note"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={addingNote || !newNote.trim()}
                      className="self-end bg-emerald-500 hover:bg-emerald-600"
                      data-testid="button-add-note"
                    >
                      {addingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                  {leadDetails?.notes && leadDetails.notes.length > 0 ? (
                    <div className="space-y-2">
                      {leadDetails.notes.map((note) => (
                        <div key={note.id} className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{note.nota}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(note.created_at).toLocaleString("it-IT")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nessuna nota</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Storico Stati
                  </h4>
                  {leadDetails?.status_history && leadDetails.status_history.length > 0 ? (
                    <div className="space-y-2">
                      {leadDetails.status_history.map((history) => (
                        <div key={history.id} className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(history.changed_at).toLocaleString("it-IT")}
                          </span>
                          <ChevronRight className="h-3 w-3" />
                          {history.old_status ? (
                            <>
                              <Badge variant="outline" className={`${statusConfig[history.old_status as LeadStatus]?.color || ""} border-0`}>
                                {statusConfig[history.old_status as LeadStatus]?.label || history.old_status}
                              </Badge>
                              <span>→</span>
                            </>
                          ) : null}
                          <Badge variant="outline" className={`${statusConfig[history.new_status as LeadStatus]?.color || ""} border-0`}>
                            {statusConfig[history.new_status as LeadStatus]?.label || history.new_status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nessuno storico</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => selectedLead && handleAnalyzeWithAI(selectedLead)}
              className="border-cyan-500 text-cyan-600 hover:bg-cyan-50"
              data-testid="button-analyze-detail"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analizza con AI
            </Button>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare il lead "{selectedLead?.nome}". Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLead}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-confirm-delete"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
