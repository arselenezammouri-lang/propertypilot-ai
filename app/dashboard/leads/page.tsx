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
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
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
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { formatDateForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
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
  ArrowDown,
  ArrowRight,
  Flame,
  Gem,
} from "lucide-react";
import { Lead, LeadNote, LeadStatusHistory, LeadPriority, LeadStatus, LeadMarket } from "@/lib/types/database.types";
import { fetchApi } from "@/lib/api/client";
import {
  apiFailureToast,
  networkFailureToast,
  premiumFeatureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import NextDynamic from "next/dynamic";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton-loaders";

const ProFeaturePaywall = NextDynamic(() => import("@/components/demo-modal").then(mod => ({ default: mod.ProFeaturePaywall })), {
  ssr: false,
});

export default function LeadsPage() {
  const router = useRouter();
  const { locale, timezone } = useLocaleContext();
  const { toast } = useToast();
  const usage = useUsageLimits();
  const feedbackLocale = locale;
  const lp = getTranslation(locale as SupportedLocale).dashboard.leadsPage;

  const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
    new: { label: lp.statusNew, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    contacted: { label: lp.statusContacted, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
    followup: { label: lp.statusFollowup, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    closed: { label: lp.statusClosed, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
    lost: { label: lp.statusLost, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  };

  const priorityConfig: Record<
    LeadPriority,
    { label: string; color: string; bgColor: string; Icon: typeof ArrowDown }
  > = {
    low: { label: lp.priorityLow, color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-800", Icon: ArrowDown },
    medium: {
      label: lp.priorityMedium,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      Icon: ArrowRight,
    },
    high: { label: lp.priorityHigh, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30", Icon: Flame },
  };

  const marketConfig: Record<LeadMarket, { label: string; code: string }> = {
    italy: { label: lp.marketItaly, code: lp.marketItalyCode },
    usa: { label: lp.marketUsa, code: lp.marketUsaCode },
  };

  const fallbackLeadName = lp.fallbackLeadName;
  const getLeadName = (name?: string | null) => {
    const cleaned = typeof name === "string" ? name.trim() : "";
    return cleaned.length > 0 ? cleaned : fallbackLeadName;
  };
  
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
  const [isDeleting, setIsDeleting] = useState(false);
  
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

      const res = await fetchApi<{ data: Lead[] }>(`/api/leads?${params.toString()}`);

      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          const p = premiumFeatureToast(
            feedbackLocale,
            "leadManager",
            res.message || res.error || lp.premiumRequiredDesc
          );
          toast({ title: p.title, description: p.description, variant: "destructive" });
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.loadingError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      const normalizedLeads = (res.data.data || []).map((lead) => ({
        ...lead,
        nome: getLeadName(lead.nome),
      }));
      setLeads(normalizedLeads);
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchLeads is stable, deps are filters
  }, [statusFilter, priorityFilter, marketFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!loading) fetchLeads();
    }, 300);
    return () => clearTimeout(debounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce on search only
  }, [searchQuery]);

  // Load user subscription plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetchApi<{ status?: string }>('/api/user/subscription');
        if (res.success) {
          const plan = (res.data?.status || 'free') as 'free' | 'starter' | 'pro' | 'agency';
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
      const v = validationToast(feedbackLocale, "leadManager", lp.nameRequired);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchApi<{ data: Lead }>("/api/leads", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          const p = premiumFeatureToast(
            feedbackLocale,
            "leadManager",
            res.message || res.error || lp.premiumRequiredDesc
          );
          toast({ title: p.title, description: p.description, variant: "destructive" });
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.createError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      toast({
        title: lp.successLeadCreatedTitle,
        description: lp.leadCreatedDesc.replace("{name}", formData.nome),
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
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLead = async () => {
    if (!selectedLead || !formData.nome.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetchApi<{ data: Lead }>("/api/leads", {
        method: "PATCH",
        body: JSON.stringify({ id: selectedLead.id, ...formData }),
      });
      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.updateError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      toast({
        title: lp.successLeadUpdatedTitle,
        description: lp.leadUpdatedDesc.replace("{name}", formData.nome),
      });
      setIsEditModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setIsDeleting(true);
    try {
      const res = await fetchApi<unknown>(`/api/leads?id=${selectedLead.id}`, { method: "DELETE" });
      if (!res.success) {
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.deleteError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      toast({
        title: lp.successLeadDeletedTitle,
        description: lp.leadDeletedDesc.replace("{name}", getLeadName(selectedLead.nome)),
      });
      setIsDeleteDialogOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetchApi<{ message?: string }>("/api/leads/update-status", {
        method: "POST",
        body: JSON.stringify({ lead_id: leadId, new_status: newStatus }),
      });
      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          const p = premiumFeatureToast(
            feedbackLocale,
            "leadManager",
            res.message || res.error || lp.premiumRequiredDesc
          );
          toast({ title: p.title, description: p.description, variant: "destructive" });
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.statusUpdateError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      toast({
        title: lp.successStatusTitle,
        description: res.data?.message ?? lp.statusUpdated,
      });
      fetchLeads();
      if (isDetailModalOpen && selectedLead?.id === leadId) {
        fetchLeadDetails(leadId);
      }
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    }
  };

  const fetchLeadDetails = async (leadId: string) => {
    try {
      type LeadWithDetails = Lead & { notes?: LeadNote[]; status_history?: LeadStatusHistory[] };
      const res = await fetchApi<LeadWithDetails>(`/api/leads/${leadId}`);
      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          const p = premiumFeatureToast(
            feedbackLocale,
            "leadManager",
            res.message || res.error || lp.premiumRequiredDesc
          );
          toast({ title: p.title, description: p.description, variant: "destructive" });
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.detailsError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      const lead = res.data;
      if (lead) {
        setSelectedLead(lead);
        setLeadDetails({
          notes: lead.notes || [],
          status_history: lead.status_history || [],
        });
      }
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
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
      const res = await fetchApi<unknown>("/api/leads/add-note", {
        method: "POST",
        body: JSON.stringify({ lead_id: selectedLead.id, nota: newNote }),
      });
      if (!res.success) {
        if (res.status === 403) {
          setUserPlan('free');
          const p = premiumFeatureToast(
            feedbackLocale,
            "leadManager",
            res.message || res.error || lp.premiumRequiredDesc
          );
          toast({ title: p.title, description: p.description, variant: "destructive" });
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadManager",
          { status: res.status, error: res.error, message: res.message },
          lp.noteError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      toast({
        title: lp.successNoteTitle,
        description: lp.noteSaved,
      });
      setNewNote("");
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      const n = networkFailureToast(feedbackLocale, "leadManager");
      toast({ title: n.title, description: n.description, variant: "destructive" });
    } finally {
      setAddingNote(false);
    }
  };

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      nome: getLeadName(lead.nome),
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

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  return (
    <div className="min-h-screen bg-background">
      <DashboardPageShell>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {lp.backToDashboard}
        </Link>

        <DashboardPageHeader
          variant="dark"
          title={lp.leadManagerTitle}
          subtitle={lp.pageSubtitle}
          planBadge={{ label: planBadgeLabel, variant: "outline" }}
          contextualHelp={<ContextualHelpTrigger docSlug="crm/pipeline" />}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard/leads/pipeline" aria-label="Switch to pipeline view">
                <Button
                  aria-label="Switch to pipeline view"
                  variant="outline"
                  size="sm"
                  className="border-violet-500/50 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 min-h-9"
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
                className="min-h-9"
                data-testid="button-refresh-leads"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                aria-label="Add new lead"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white min-h-9"
                data-testid="button-add-lead"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{lp.newLead}</span>
              </Button>
            </div>
          }
        />

        <ProFeaturePaywall
          title={lp.leadManagerTitle}
          description={lp.leadManagerDesc}
          isLocked={isLocked && !isLoadingPlan}
        >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{statsData.total}</p>
              <p className="text-sm text-muted-foreground">{lp.total}</p>
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
                  placeholder={lp.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-leads"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-status">
                    <SelectValue placeholder={lp.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lp.allStatuses}</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-priority">
                    <SelectValue placeholder={lp.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lp.allPriorities}</SelectItem>
                    {Object.entries(priorityConfig).map(([key, config]) => {
                      const PIcon = config.Icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <PIcon className="h-4 w-4 shrink-0" aria-hidden />
                            {config.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select value={marketFilter} onValueChange={setMarketFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-filter-market">
                    <SelectValue placeholder={lp.market} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lp.allMarkets}</SelectItem>
                    {Object.entries(marketConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{config.code}</span>
                          {config.label}
                        </span>
                      </SelectItem>
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
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-emerald-500/20 rounded-md" />
                    <div className="h-4 w-64 bg-slate-700/60 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 w-28 bg-slate-700/60 rounded-md" />
                    <div className="h-9 w-28 bg-slate-700/60 rounded-md" />
                  </div>
                </div>
                <ListSkeleton items={6} />
              </div>
            ) : leads.length === 0 ? (
              <EmptyState
                icon={<Users />}
                title={lp.noLeads}
                description={
                  searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? lp.adjustFilters
                    : lp.addFirstLead
                }
                gradient="from-emerald-500/20 to-teal-500/20"
                size="lg"
                actions={
                  !(searchQuery || statusFilter !== "all" || priorityFilter !== "all")
                    ? [
                        {
                          label: lp.addLead,
                          onClick: () => setIsAddModalOpen(true),
                          icon: <Plus className="h-4 w-4" />,
                        },
                        {
                          label: lp.pipelineKanban,
                          href: "/dashboard/leads/pipeline",
                          variant: "outline" as const,
                          icon: <Kanban className="h-4 w-4" />,
                        },
                      ]
                    : []
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{lp.tableColumnLead}</TableHead>
                      <TableHead>{lp.contacts}</TableHead>
                      <TableHead>{lp.status}</TableHead>
                      <TableHead>{lp.priority}</TableHead>
                      <TableHead>{lp.score}</TableHead>
                      <TableHead>{lp.market}</TableHead>
                      <TableHead>{lp.date}</TableHead>
                      <TableHead className="text-right">{lp.actions}</TableHead>
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
                            <div className="font-medium">{getLeadName(lead.nome)}</div>
                            {lead.lead_score > 90 && (
                              <Badge className="bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 text-white font-bold px-3 py-1 animate-pulse shadow-lg shadow-purple-500/50 border border-cyan-400/50 gap-1">
                                <Gem className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                {lp.badgeRevenueOpportunity}
                              </Badge>
                            )}
                            {lead.lead_score >= 85 && lead.lead_score <= 90 && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-2 py-0.5 animate-pulse shadow-lg gap-1">
                                <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                {lp.badgeTopDeal}
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
                          <Badge
                            className={`${priorityConfig[lead.priorita].bgColor} ${priorityConfig[lead.priorita].color} border-0 gap-1`}
                          >
                            {(() => {
                              const PIcon = priorityConfig[lead.priorita].Icon;
                              return (
                                <>
                                  <PIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                  {priorityConfig[lead.priorita].label}
                                </>
                              );
                            })()}
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
                          <span
                            className="inline-flex min-w-[2.25rem] items-center justify-center rounded border border-muted-foreground/30 px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground"
                            title={marketConfig[lead.market].label}
                          >
                            {marketConfig[lead.market].code}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDateForLocale(lead.created_at, locale as Locale, timezone)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                data-testid={`button-actions-${lead.id}`}
                                aria-label={`Actions for lead ${lead.id}`}
                              >
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
                                {lp.delete}
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
      </DashboardPageShell>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              {lp.newLead}
            </DialogTitle>
            <DialogDescription>
              {lp.addLeadInfo}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">{lp.name} *</Label>
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
                <Label>{lp.priority}</Label>
                <Select
                  value={formData.priorita}
                  onValueChange={(value) => setFormData({ ...formData, priorita: value as LeadPriority })}
                >
                  <SelectTrigger data-testid="select-lead-priorita">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => {
                      const PIcon = config.Icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <PIcon className="h-4 w-4 shrink-0" aria-hidden />
                            {config.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{lp.market}</Label>
                <Select
                  value={formData.market}
                  onValueChange={(value) => setFormData({ ...formData, market: value as LeadMarket })}
                >
                  <SelectTrigger data-testid="select-lead-market">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(marketConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{config.code}</span>
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="messaggio">{lp.leadMessage}</Label>
              <Textarea
                id="messaggio"
                value={formData.messaggio}
                onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                placeholder={lp.leadMessagePlaceholder}
                rows={4}
                data-testid="textarea-lead-messaggio"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              {lp.cancel}
            </Button>
            <Button
              onClick={handleAddLead}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-submit-lead"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {lp.addLead}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-emerald-500" />
              {lp.editLead}
            </DialogTitle>
            <DialogDescription>
              {lp.editLeadInfo}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">{lp.name} *</Label>
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
                    {Object.entries(priorityConfig).map(([key, config]) => {
                      const PIcon = config.Icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <PIcon className="h-4 w-4 shrink-0" aria-hidden />
                            {config.label}
                          </span>
                        </SelectItem>
                      );
                    })}
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
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{config.code}</span>
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-messaggio">{lp.leadMessage}</Label>
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
              {lp.cancel}
            </Button>
            <Button
              onClick={handleUpdateLead}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-update-lead"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Pencil className="h-4 w-4 mr-2" />}
              {lp.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              {lp.leadDetails}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{getLeadName(selectedLead.nome)}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${statusConfig[selectedLead.status].bgColor} ${statusConfig[selectedLead.status].color} border-0`}>
                        {statusConfig[selectedLead.status].label}
                      </Badge>
                      <Badge
                        className={`${priorityConfig[selectedLead.priorita].bgColor} ${priorityConfig[selectedLead.priorita].color} border-0 gap-1`}
                      >
                        {(() => {
                          const PIcon = priorityConfig[selectedLead.priorita].Icon;
                          return (
                            <>
                              <PIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              {priorityConfig[selectedLead.priorita].label}
                            </>
                          );
                        })()}
                      </Badge>
                      <Badge variant="outline" className="gap-1.5">
                        <span className="font-mono text-xs">{marketConfig[selectedLead.market].code}</span>
                        {marketConfig[selectedLead.market].label}
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
                    <span>{lp.created}: {formatDateForLocale(selectedLead.created_at, locale as Locale, timezone)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{lp.updated}: {formatDateForLocale(selectedLead.updated_at, locale as Locale, timezone)}</span>
                  </div>
                </div>

                {selectedLead.messaggio && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {lp.leadMessage}
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
                    {lp.notes} ({leadDetails?.notes.length || 0})
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
            <AlertDialogTitle>{lp.areYouSure}</AlertDialogTitle>
            <AlertDialogDescription>
              {lp.deleteWarning.replace("{name}", getLeadName(selectedLead?.nome))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{lp.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDeleteLead(); }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-confirm-delete"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? lp.deleting : lp.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
