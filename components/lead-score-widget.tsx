"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Zap, MessageCircle, Snowflake, TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw, Loader2, Crown } from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  email: string;
  lead_score: number;
  created_at: string;
  status: string;
}

interface ScoreAnalytics {
  hot: number;
  warm: number;
  cool: number;
  cold: number;
  total: number;
  avgScore: number;
  topLeads: Lead[];
}

export function LeadScoreWidget({ currentPlan }: { currentPlan: string }) {
  const [data, setData] = useState<ScoreAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/leads?sortBy=lead_score&sortOrder=desc");
      if (!res.ok) { setLoading(false); return; }
      const result = await res.json();
      const leads: Lead[] = result.data || result.leads || [];

      const hot = leads.filter((l) => l.lead_score >= 80).length;
      const warm = leads.filter((l) => l.lead_score >= 60 && l.lead_score < 80).length;
      const cool = leads.filter((l) => l.lead_score >= 40 && l.lead_score < 60).length;
      const cold = leads.filter((l) => l.lead_score < 40).length;
      const totalScored = leads.filter((l) => l.lead_score > 0);
      const avgScore = totalScored.length > 0 ? Math.round(totalScored.reduce((s, l) => s + l.lead_score, 0) / totalScored.length) : 0;

      setData({
        hot, warm, cool, cold,
        total: leads.length,
        avgScore,
        topLeads: leads.filter((l) => l.lead_score > 0).slice(0, 5),
      });
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }

  async function handleBulkScore() {
    setScoring(true);
    try {
      await fetch("/api/leads/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      fetchAnalytics();
    } catch { /* silent */ } finally {
      setScoring(false);
    }
  }

  if (loading) {
    return (
      <div className="pp-glass-card p-6 animate-pulse">
        <div className="h-5 bg-muted/50 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-4 gap-3 mb-4">{[1,2,3,4].map((i) => <div key={i} className="h-16 bg-muted/30 rounded-lg" />)}</div>
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="pp-glass-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No leads yet. Import leads from portals or add them manually.</p>
      </div>
    );
  }

  const isPro = currentPlan === "pro" || currentPlan === "agency";

  return (
    <div className="pp-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Lead Score Analytics</h3>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={handleBulkScore} disabled={scoring}>
          {scoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Re-score all
        </Button>
      </div>

      {/* Score buckets */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Hot", count: data.hot, icon: Flame, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
          { label: "Warm", count: data.warm, icon: Zap, bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
          { label: "Cool", count: data.cool, icon: MessageCircle, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
          { label: "Cold", count: data.cold, icon: Snowflake, bg: "bg-muted", text: "text-muted-foreground", border: "border-border/40" },
        ].map((bucket) => (
          <div key={bucket.label} className={`rounded-xl border ${bucket.border} ${bucket.bg} p-3 text-center`}>
            <bucket.icon className={`w-4 h-4 mx-auto mb-1 ${bucket.text}`} />
            <div className="text-lg font-bold">{bucket.count}</div>
            <div className="text-[10px] text-muted-foreground">{bucket.label}</div>
          </div>
        ))}
      </div>

      {/* Average score */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
        <span className="text-xs text-muted-foreground">Average Score</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{data.avgScore}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Top 5 hottest leads */}
      {data.topLeads.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Hottest Leads</p>
          <div className="space-y-1.5">
            {data.topLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-2 rounded-lg bg-background/20 hover:bg-background/40 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium truncate max-w-[120px]">{lead.nome}</span>
                  <Badge className={`text-[9px] px-1.5 py-0 ${lead.lead_score >= 80 ? "bg-red-500/10 text-red-400 border-red-500/20" : lead.lead_score >= 60 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                    {lead.lead_score}
                  </Badge>
                </div>
                <Link href={`/dashboard/leads/${lead.id}`}>
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-0.5 text-primary">
                    Contact <ArrowRight className="w-2.5 h-2.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speed-to-lead upgrade prompt */}
      {!isPro && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-2">
            <Crown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold mb-1">Auto-respond to hot leads in 60s</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
                Pro plan auto-emails 80+ scored leads within 60 seconds. Agencies with speed-to-lead automation close 2.3x more deals.
              </p>
              <Link href="/pricing">
                <Button size="sm" className="h-6 text-[10px] gap-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                  Upgrade to Pro <ArrowRight className="w-2.5 h-2.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
