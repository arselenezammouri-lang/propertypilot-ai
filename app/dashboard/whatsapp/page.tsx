"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, MessageCircle, Send, Loader2, Bot, User, Phone, Search,
  BarChart3, Clock, Zap, Crown, ArrowRight, RefreshCw, Filter,
} from "lucide-react";

interface Conversation {
  id: string; contact_phone: string; contact_name: string | null;
  last_message: string | null; last_message_at: string | null;
  ai_handled: boolean; status: string; unread_count: number;
  lead_id: string | null;
}

export default function WhatsAppPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendForm, setSendForm] = useState({ phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/whatsapp/send?filter=${filter}&limit=50`);
      if (res.ok) { const data = await res.json(); setConversations(data.conversations || []); }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  async function handleSend() {
    if (!sendForm.phone || !sendForm.message) { toast({ title: "Phone and message required", variant: "destructive" }); return; }
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendForm),
      });
      if (res.ok) { toast({ title: "Message sent!" }); setSendModalOpen(false); setSendForm({ phone: "", message: "" }); fetchConversations(); }
      else { const d = await res.json(); toast({ title: "Failed", description: d.error, variant: "destructive" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSending(false); }
  }

  function formatTime(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return d.toLocaleDateString();
  }

  const filtered = conversations.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      return (c.contact_name?.toLowerCase().includes(q) || c.contact_phone.includes(q) || c.last_message?.toLowerCase().includes(q));
    }
    return true;
  });

  const totalConvs = conversations.length;
  const aiHandled = conversations.filter((c) => c.ai_handled).length;
  const unread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">WhatsApp AI Agent</h1>
            <p className="text-sm text-muted-foreground">AI-powered conversations · 6 languages · Auto-respond</p>
          </div>
        </div>
        <Button onClick={() => setSendModalOpen(true)} className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Send className="w-4 h-4" /> New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Conversations", value: totalConvs, icon: MessageCircle, color: "text-green-400" },
          { label: "AI Handled", value: aiHandled, icon: Bot, color: "text-primary" },
          { label: "Unread", value: unread, icon: Clock, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="pp-glass-card p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color}`} />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="pl-9 bg-background/50 h-9" />
        </div>
        <div className="flex gap-1">
          {["all", "ai", "human", "active"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === f ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground"}`}>
              {f === "all" ? "All" : f === "ai" ? "🤖 AI" : f === "human" ? "👤 Human" : "Active"}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" onClick={fetchConversations}><RefreshCw className="w-3 h-3" /></Button>
      </div>

      {/* Conversation List */}
      <div className="pp-glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No WhatsApp conversations yet.</p>
            <p className="text-xs text-muted-foreground mt-1">When leads message your WhatsApp Business number, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filtered.map((conv, i) => (
              <motion.div key={conv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${conv.ai_handled ? "bg-primary/10" : "bg-green-500/10"}`}>
                  {conv.ai_handled ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{conv.contact_name || conv.contact_phone}</span>
                    {conv.unread_count > 0 && <Badge className="bg-green-500 text-white text-[9px] h-4 min-w-[16px] justify-center">{conv.unread_count}</Badge>}
                    {conv.ai_handled && <Badge variant="outline" className="text-[9px] h-4">🤖 AI</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.last_message || "No messages"}</p>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0">{formatTime(conv.last_message_at)}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Send Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="w-4 h-4 text-green-400" /> Send WhatsApp Message</DialogTitle>
            <DialogDescription>Send a direct message to a contact via WhatsApp Business.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs mb-1.5 block">Phone Number <span className="text-red-400">*</span></label>
              <Input value={sendForm.phone} onChange={(e) => setSendForm({ ...sendForm, phone: e.target.value })} placeholder="+39 333 123 4567" className="bg-background/50" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block">Message <span className="text-red-400">*</span></label>
              <textarea value={sendForm.message} onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })} placeholder="Type your message..." className="w-full h-24 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm resize-none focus:border-primary/50 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setSendModalOpen(false)}>Cancel</Button>
            <button onClick={handleSend} disabled={sending} className="inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold text-white text-sm h-9 px-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
