"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Phone, PhoneCall, PhoneOff, Globe, Loader2, Play, Clock, Users,
  MicVocal, BarChart3, Calendar, FileText, ChevronRight, Plus, Zap, Crown,
  ArrowRight, RefreshCw,
} from "lucide-react";

interface CallRecord {
  id: string; bland_call_id: string; pathway: string; language: string;
  phone_number: string; status: string; direction: string; duration_seconds: number | null;
  transcript: string | null; summary: string | null; outcome: string | null;
  recording_url: string | null; created_at: string;
}

const PATHWAYS = [
  { id: "inbound-listing-inquiry", name: "Inbound Inquiry", icon: PhoneCall, desc: "Handle incoming property inquiries" },
  { id: "outbound-new-lead-callback", name: "Lead Callback", icon: Phone, desc: "Auto-call hot leads within 60s" },
  { id: "viewing-booking", name: "Viewing Booking", icon: Calendar, desc: "Schedule property viewings" },
];

const LANGUAGES = [
  { code: "it", flag: "🇮🇹", name: "Italiano" }, { code: "en", flag: "🇬🇧", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" }, { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" }, { code: "pt", flag: "🇵🇹", name: "Português" },
];

export default function VoiceCampaignsPage() {
  const { toast } = useToast();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [calling, setCalling] = useState(false);
  const [callForm, setCallForm] = useState({ phone: "", pathway: "outbound-new-lead-callback", language: "it", leadName: "", propertyTitle: "" });
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const fetchCalls = useCallback(async () => {
    try {
      const res = await fetch("/api/voice/calls?limit=30");
      if (res.ok) { const data = await res.json(); setCalls(data.calls || []); }
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  async function initiateCall() {
    if (!callForm.phone) { toast({ title: "Phone number required", variant: "destructive" }); return; }
    setCalling(true);
    try {
      const res = await fetch("/api/voice/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: callForm.phone, pathway: callForm.pathway, language: callForm.language,
          context: { leadName: callForm.leadName, propertyTitle: callForm.propertyTitle },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Call initiated!", description: `Calling ${callForm.phone}...` });
        setCallModalOpen(false);
        fetchCalls();
      } else {
        toast({ title: "Call failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally { setCalling(false); }
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function outcomeLabel(outcome: string | null): string {
    const map: Record<string, string> = {
      viewing_booked: "📅 Viewing Booked", interested: "⭐ Interested",
      not_interested: "❌ Not Interested", callback_requested: "📞 Callback",
      no_answer: "📵 No Answer", failed: "⚠️ Failed", completed: "✅ Completed",
    };
    return map[outcome || ""] || outcome || "—";
  }

  const totalCalls = calls.length;
  const completedCalls = calls.filter((c) => c.status === "completed").length;
  const totalMinutes = Math.round(calls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / 60);
  const viewingsBooked = calls.filter((c) => c.outcome === "viewing_booked").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <MicVocal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voice AI Campaigns</h1>
            <p className="text-sm text-muted-foreground">Multilingual voice agent · 6 languages · Cal.com integration</p>
          </div>
        </div>
        <Button onClick={() => setCallModalOpen(true)} className="gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
          <Phone className="w-4 h-4" /> New Call
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Calls", value: totalCalls, icon: Phone, color: "text-violet-400" },
          { label: "Completed", value: completedCalls, icon: PhoneCall, color: "text-emerald-400" },
          { label: "Minutes Used", value: totalMinutes, icon: Clock, color: "text-blue-400" },
          { label: "Viewings Booked", value: viewingsBooked, icon: Calendar, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="pp-glass-card p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pathway Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {PATHWAYS.map((p) => (
          <div key={p.id} className="pp-glass-card p-5">
            <p.icon className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
            <div className="flex flex-wrap gap-1">
              {LANGUAGES.map((l) => <span key={l.code} className="text-xs" title={l.name}>{l.flag}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Call History */}
      <div className="pp-glass-card overflow-hidden">
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Call History</h2>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={fetchCalls}><RefreshCw className="w-3 h-3" /> Refresh</Button>
        </div>

        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : calls.length === 0 ? (
          <div className="p-8 text-center">
            <PhoneOff className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No calls yet. Start your first campaign!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {calls.map((call) => (
              <button key={call.id} onClick={() => setSelectedCall(call)} className="w-full flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${call.direction === "inbound" ? "bg-blue-500/10" : "bg-violet-500/10"}`}>
                  {call.direction === "inbound" ? <PhoneCall className="w-4 h-4 text-blue-400" /> : <Phone className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{call.phone_number}</span>
                    <Badge variant="outline" className="text-[9px] h-4">{call.language.toUpperCase()}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{PATHWAYS.find((p) => p.id === call.pathway)?.name || call.pathway}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs">{outcomeLabel(call.outcome)}</div>
                  <div className="text-[10px] text-muted-foreground">{formatDuration(call.duration_seconds)} · {new Date(call.created_at).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── New Call Modal ─── */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> New Voice Call</DialogTitle>
            <DialogDescription>Initiate an AI-powered call. The voice agent handles the conversation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label className="text-xs mb-1.5 block">Phone Number <span className="text-red-400">*</span></Label><Input value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} placeholder="+39 333 123 4567" className="bg-background/50" /></div>
            <div><Label className="text-xs mb-1.5 block">Pathway</Label>
              <Select value={callForm.pathway} onValueChange={(v) => setCallForm({ ...callForm, pathway: v })}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{PATHWAYS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><Label className="text-xs mb-1.5 block">Language</Label>
              <Select value={callForm.language} onValueChange={(v) => setCallForm({ ...callForm, language: v })}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{LANGUAGES.map((l) => <SelectItem key={l.code} value={l.code}>{l.flag} {l.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><Label className="text-xs mb-1.5 block">Lead Name</Label><Input value={callForm.leadName} onChange={(e) => setCallForm({ ...callForm, leadName: e.target.value })} placeholder="Optional" className="bg-background/50" /></div>
            <div><Label className="text-xs mb-1.5 block">Property Title</Label><Input value={callForm.propertyTitle} onChange={(e) => setCallForm({ ...callForm, propertyTitle: e.target.value })} placeholder="Optional — property context" className="bg-background/50" /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setCallModalOpen(false)}>Cancel</Button>
            <button onClick={initiateCall} disabled={calling} className="btn-primary-gradient h-9 px-5 text-sm gap-1.5">
              {calling ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Calling...</> : <><Phone className="w-3.5 h-3.5" />Start Call</>}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Call Detail Modal ─── */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[80vh] overflow-y-auto">
          {selectedCall && (<>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCall.direction === "inbound" ? <PhoneCall className="w-4 h-4 text-blue-400" /> : <Phone className="w-4 h-4 text-violet-400" />}
                {selectedCall.phone_number}
              </DialogTitle>
              <DialogDescription>{outcomeLabel(selectedCall.outcome)} · {formatDuration(selectedCall.duration_seconds)} · {new Date(selectedCall.created_at).toLocaleString()}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-background/30"><div className="text-xs font-medium">{selectedCall.language.toUpperCase()}</div><div className="text-[9px] text-muted-foreground">Language</div></div>
                <div className="p-2 rounded-lg bg-background/30"><div className="text-xs font-medium capitalize">{selectedCall.direction}</div><div className="text-[9px] text-muted-foreground">Direction</div></div>
                <div className="p-2 rounded-lg bg-background/30"><div className="text-xs font-medium capitalize">{selectedCall.status}</div><div className="text-[9px] text-muted-foreground">Status</div></div>
              </div>
              {selectedCall.summary && (<div><Label className="text-xs text-muted-foreground mb-1 block">AI Summary</Label><div className="p-3 rounded-lg bg-background/50 border border-border/40 text-sm leading-relaxed">{selectedCall.summary}</div></div>)}
              {selectedCall.transcript && (<div><Label className="text-xs text-muted-foreground mb-1 block">Transcript</Label><div className="p-3 rounded-lg bg-background/50 border border-border/40 text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">{selectedCall.transcript}</div></div>)}
              {selectedCall.recording_url && (<div><Label className="text-xs text-muted-foreground mb-1 block">Recording</Label><audio controls src={selectedCall.recording_url} className="w-full h-8" /></div>)}
            </div>
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
