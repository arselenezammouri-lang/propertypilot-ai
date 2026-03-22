"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import {
  apiFailureToast,
  networkFailureToast,
} from "@/lib/i18n/api-feature-feedback";
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Phone, 
  Mail, 
  GripVertical,
  ExternalLink,
  Sparkles,
  RefreshCw,
  LayoutGrid
} from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  email: string | null;
  telefono: string | null;
  messaggio: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'followup' | 'closed' | 'lost';
  lead_score: number | null;
  market: 'italy' | 'usa';
  created_at: string;
  updated_at: string;
}

type StatusColumn = 'new' | 'contacted' | 'followup' | 'closed' | 'lost';

// Locale-independent configs — labels resolved inside component using t

function getScoreColor(score: number | null): string {
  if (score === null || score === 0) return 'text-slate-400';
  if (score >= 80) return 'text-emerald-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBadge(score: number | null): string {
  if (score === null || score === 0) return '❓';
  if (score >= 80) return '🔥';
  if (score >= 50) return '⭐';
  return '❄️';
}

export default function PipelinePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const feedbackLocale = (locale === "it" ? "it" : "en") as "it" | "en";
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.leadPipelinePage,
    [locale],
  );
  const usage = useUsageLimits();
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();

  const statusConfig: Record<StatusColumn, { label: string; color: string; bgColor: string; borderColor: string }> = {
    new: { label: t.statusNew, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
    contacted: { label: t.statusContacted, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
    followup: { label: t.statusFollowup, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    closed: { label: t.statusClosed, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
    lost: { label: t.statusLost, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  };

  const priorityConfig = {
    low: { label: t.priorityLow, color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    medium: { label: t.priorityMedium, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    high: { label: t.priorityHigh, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  };
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<StatusColumn | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetchApi<Lead[]>("/api/leads");
      if (!res.success) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        const fail = apiFailureToast(
          feedbackLocale,
          "leadPipeline",
          { status: res.status, error: res.error, message: res.message },
          t.loadError
        );
        toast({ title: fail.title, description: fail.description, variant: "destructive" });
        return;
      }
      const list = Array.isArray(res.data) ? res.data : [];
      setLeads(list);
    } catch (error) {
      const net = networkFailureToast(feedbackLocale, "leadPipeline");
      toast({
        title: net.title,
        description: handleAPIError(error, net.description),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast, feedbackLocale, t.loadError, handleAPIError]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lead.id);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: StatusColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: StatusColumn) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    setIsUpdating(true);

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === draggedLead.id 
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    try {
      const response = await fetch("/api/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: draggedLead.id,
          new_status: newStatus,
        }),
      });
      const body = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        const fail = apiFailureToast(
          feedbackLocale,
          "leadPipeline",
          { status: response.status, error: body.error, message: body.message },
          t.updateError
        );
        throw new Error(fail.description);
      }

      toast({
        title: t.statusUpdated,
        description: body.message || t.movedTo.replace("{label}", statusConfig[newStatus].label),
      });

      fetch('/api/automations/execute-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger_type: 'status_changed',
          lead_id: draggedLead.id,
          lead_data: { ...draggedLead, status: newStatus },
          previous_data: { status: draggedLead.status }
        })
      }).then(async (autoRes) => {
        if (autoRes.ok) {
          const autoData = await autoRes.json();
          if (autoData.executed > 0) {
            toast({
              title: t.automationApplied,
              description: t.automationRules.replace("{count}", String(autoData.executed)),
            });
            fetchLeads();
          }
        }
      }).catch(console.error);

    } catch (error) {
      console.error('Error updating status:', error);
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === draggedLead.id 
            ? { ...lead, status: draggedLead.status }
            : lead
        )
      );
      const desc =
        error instanceof Error && error.message
          ? error.message
          : t.updateError;
      toast({ title: t.errorTitle, description: desc, variant: "destructive" });
    } finally {
      setIsUpdating(false);
      setDraggedLead(null);
    }
  };

  const getLeadsByStatus = (status: StatusColumn) => {
    return leads.filter(lead => lead.status === status);
  };

  const columns: StatusColumn[] = ['new', 'contacted', 'followup', 'closed', 'lost'];

  const planBadgeLabel =
    usage.plan === "agency"
      ? "Agency"
      : usage.plan === "pro"
        ? "Pro"
        : usage.plan === "starter"
          ? "Starter"
          : "Free";

  if (isLoading) {
    return (
      <DashboardPageShell className="max-w-[1800px]">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-slate-400">{t.loadingPipeline}</p>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell className="max-w-[1800px]">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          data-testid="button-back-dashboard"
          aria-label={t.backToDashboardAria}
        >
          <ArrowLeft className="h-4 w-4" />
          {t.dashboardLink}
        </Link>
      </div>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        titleDataTestId="heading-leads-pipeline"
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        contextualHelp={<ContextualHelpTrigger docSlug="crm/pipeline" />}
        actions={
          <Badge className="border-0 bg-gradient-to-r from-emerald-500 via-violet-500 to-purple-500 text-xs text-white">
            {t.heroBadge}
          </Badge>
        }
      />

      <div>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3 md:ml-auto md:justify-end">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" data-testid="button-table-view">
                <LayoutGrid className="h-4 w-4 mr-2" />
                {t.tableView}
              </Button>
            </Link>
            <Button 
              onClick={fetchLeads}
              variant="outline" 
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              disabled={isUpdating}
              data-testid="button-refresh-pipeline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              {t.refresh}
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {columns.map(status => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig[status].bgColor} border ${statusConfig[status].borderColor}`} />
                <span className={`text-sm font-medium ${statusConfig[status].color}`}>
                  {statusConfig[status].label}
                </span>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                  {getLeadsByStatus(status).length}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {columns.map(status => (
            <div
              key={status}
              className={`flex flex-col rounded-xl border-2 transition-all duration-200 min-h-[500px] ${
                dragOverColumn === status
                  ? `${statusConfig[status].borderColor} ${statusConfig[status].bgColor} scale-[1.02]`
                  : 'border-slate-700/50 bg-slate-800/30'
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
              data-testid={`column-${status}`}
            >
              <div className={`p-4 border-b ${statusConfig[status].borderColor} ${statusConfig[status].bgColor}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold ${statusConfig[status].color}`}>
                    {statusConfig[status].label}
                  </h3>
                  <Badge variant="secondary" className={`${statusConfig[status].bgColor} ${statusConfig[status].color} border ${statusConfig[status].borderColor}`}>
                    {getLeadsByStatus(status).length}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px]">
                {getLeadsByStatus(status).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                    <Users className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">{t.noLeads}</p>
                  </div>
                ) : (
                  getLeadsByStatus(status).map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={handleDragEnd}
                      className={`group p-4 rounded-lg bg-slate-900/80 border border-slate-700/50 cursor-grab active:cursor-grabbing hover:border-slate-600 transition-all ${
                        draggedLead?.id === lead.id ? 'opacity-50 scale-95' : ''
                      }`}
                      data-testid={`lead-card-${lead.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GripVertical className="h-4 w-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="font-semibold text-white truncate">{lead.nome}</span>
                        </div>
                        <Badge className={`${priorityConfig[lead.priority].color} text-xs flex-shrink-0`}>
                          {priorityConfig[lead.priority].label}
                        </Badge>
                      </div>

                      {lead.lead_score !== null && lead.lead_score > 0 && (
                        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-slate-800/50">
                          <Target className={`h-4 w-4 ${getScoreColor(lead.lead_score)}`} />
                          <span className={`text-sm font-bold ${getScoreColor(lead.lead_score)}`}>
                            {lead.lead_score}/100
                          </span>
                          <span className="text-lg">{getScoreBadge(lead.lead_score)}</span>
                        </div>
                      )}

                      <div className="space-y-1.5 text-sm text-slate-400 mb-3">
                        {lead.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{lead.telefono}</span>
                          </div>
                        )}
                      </div>

                      {lead.messaggio && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {lead.messaggio}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                        <Link href={`/dashboard/leads?selected=${lead.id}`} className="flex-1" aria-label={`Open lead ${lead.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                            data-testid={`button-open-lead-${lead.id}`}
                            aria-label={`Open lead ${lead.id} in table view`}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {t.openLead}
                          </Button>
                        </Link>
                        <Link href={`/dashboard/leads/${lead.id}`} aria-label={`View AI insights for lead ${lead.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                            data-testid={`button-ai-insights-${lead.id}`}
                            aria-label={`View AI insights for lead ${lead.id}`}
                          >
                            <Sparkles className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🔥</span>
              <span>{t.legendHot}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>{t.legendWarm}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">❄️</span>
              <span>{t.legendCold}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❓</span>
              <span>{t.notAnalyzed}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
