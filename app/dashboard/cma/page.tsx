"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, FileText, Loader2, TrendingUp, TrendingDown, Minus, Building2,
  MapPin, BarChart3, Download, Send, CheckCircle, AlertTriangle, Sparkles,
  DollarSign, Target, ChevronRight,
} from "lucide-react";

interface CMAReportSummary {
  id: string; property_address: string; property_city: string;
  valuation_expected: number; confidence_score: number;
  comparables_count: number; status: string; created_at: string; pdf_url: string | null;
}

interface GeneratedReport {
  id: string;
  property: { address: string; city: string; sqm: number; rooms: number; condition: string };
  valuation: { estimated_value: number; confidence_low: number; confidence_high: number; confidence_score: number; price_per_sqm: number; methodology: string; comparables_used: number; zone_median_psqm: number };
  comparables: Array<{ address: string; price: number; sqm: number; price_per_sqm: number; distance_km: number; similarity_score: number; source_name: string; source_url: string; adjusted_price_per_sqm: number }>;
  citations: Array<{ source_name: string; source_url: string; claim_text: string }>;
}

export default function CMAPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<CMAReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [form, setForm] = useState({ address: "", city: "", country: "IT", property_type: "Apartment", sqm: "", rooms: "3", bathrooms: "1", condition: "good", year_built: "", features: "", asking_price: "" });

  const fetchReports = useCallback(async () => {
    try {
      // Would fetch from a GET /api/cma endpoint — for now check Supabase directly
      setReports([]);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  async function handleGenerate() {
    if (!form.address || !form.city || !form.sqm) { toast({ title: "Fill address, city, and surface", variant: "destructive" }); return; }
    setGenerating(true);
    setReport(null);
    try {
      const res = await fetch("/api/cma/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, sqm: Number(form.sqm), rooms: Number(form.rooms),
          bathrooms: Number(form.bathrooms),
          year_built: form.year_built ? Number(form.year_built) : null,
          features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
          asking_price: form.asking_price ? Number(form.asking_price) : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        toast({ title: "CMA Report generated", description: `${data.report.comparables.length} comparables analyzed` });
        fetchReports();
      } else { toast({ title: "Failed", description: data.error, variant: "destructive" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setGenerating(false); }
  }

  function formatPrice(n: number): string { return "€" + n.toLocaleString("en", { maximumFractionDigits: 0 }); }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CMA Report Generator</h1>
          <p className="text-sm text-muted-foreground">Automated valuation · Comparable analysis · AI Citations</p>
        </div>
      </div>

      {/* ─── Input Form ─── */}
      <div className="pp-glass-card p-6 space-y-4 mb-8">
        <h2 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Subject Property</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label className="text-xs mb-1.5 block">Address *</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Via Roma 15" className="bg-background/50" /></div>
          <div><Label className="text-xs mb-1.5 block">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Milan" className="bg-background/50" /></div>
          <div><Label className="text-xs mb-1.5 block">Country</Label><Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{[{v:"IT",l:"🇮🇹 Italy"},{v:"FR",l:"🇫🇷 France"},{v:"ES",l:"🇪🇸 Spain"},{v:"DE",l:"🇩🇪 Germany"},{v:"UK",l:"🇬🇧 UK"},{v:"PT",l:"🇵🇹 Portugal"}].map((c)=><SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs mb-1.5 block">Type</Label><Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{["Apartment","Villa","Penthouse","House","Studio"].map((t)=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs mb-1.5 block">Surface (m²) *</Label><Input type="number" value={form.sqm} onChange={(e) => setForm({ ...form, sqm: e.target.value })} placeholder="85" className="bg-background/50" /></div>
          <div><Label className="text-xs mb-1.5 block">Rooms</Label><Input type="number" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} className="bg-background/50" /></div>
          <div><Label className="text-xs mb-1.5 block">Condition</Label><Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{[{v:"new",l:"New"},{v:"excellent",l:"Excellent"},{v:"good",l:"Good"},{v:"fair",l:"Fair"},{v:"needs_renovation",l:"Needs Renovation"}].map((c)=><SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-xs mb-1.5 block">Year Built</Label><Input type="number" value={form.year_built} onChange={(e) => setForm({ ...form, year_built: e.target.value })} placeholder="2005" className="bg-background/50" /></div>
          <div><Label className="text-xs mb-1.5 block">Features</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="terrace, parking..." className="bg-background/50" /></div>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary-gradient h-11 px-8 text-sm gap-2 disabled:opacity-50">
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating CMA...</> : <><Sparkles className="w-4 h-4" /> Generate CMA Report</>}
        </button>
      </div>

      {/* ─── Report Results ─── */}
      {report && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Valuation Header */}
          <div className="pp-glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estimated Market Value</p>
                <div className="text-3xl font-bold text-gradient">{formatPrice(report.valuation.estimated_value)}</div>
                <p className="text-sm text-muted-foreground mt-1">{formatPrice(report.valuation.confidence_low)} — {formatPrice(report.valuation.confidence_high)}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${report.valuation.confidence_score >= 70 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : report.valuation.confidence_score >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                  <Target className="w-3 h-3" /> {report.valuation.confidence_score}% confidence
                </div>
                <p className="text-xs text-muted-foreground mt-2">{report.valuation.price_per_sqm} €/m² · {report.valuation.comparables_used} comps</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{report.valuation.methodology}</p>
          </div>

          {/* Comparables Grid */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Comparable Properties ({report.comparables.length})</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {report.comparables.map((comp, i) => (
                <div key={i} className="pp-glass-card p-4 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{comp.address || `Comparable ${i + 1}`}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatPrice(comp.price)}</span>
                      <span>{comp.sqm}m²</span>
                      <span>{comp.price_per_sqm}€/m²</span>
                      <span>{comp.distance_km}km</span>
                    </div>
                    {comp.source_url && (
                      <a href={comp.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline mt-1 inline-block">
                        📎 {comp.source_name}
                      </a>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 ml-2">{comp.similarity_score}% match</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* AI Citations */}
          {report.citations.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> AI Citations ({report.citations.length})</h3>
              <div className="pp-glass-card p-4 space-y-2">
                {report.citations.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate flex-1">{c.claim_text}</span>
                    {c.source_url ? (
                      <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline shrink-0 ml-2">
                        [{c.source_name}]
                      </a>
                    ) : (
                      <span className="text-muted-foreground shrink-0 ml-2">[{c.source_name}]</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
