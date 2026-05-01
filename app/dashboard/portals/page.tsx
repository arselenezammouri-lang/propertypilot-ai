"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Globe, Link2, CheckCircle, AlertCircle, Clock, RefreshCw,
  Loader2, Unplug, Zap, Lock, Users, FileText, X,
} from "lucide-react";

/* ─── Portal Metadata ─── */

interface PortalMeta {
  id: string;
  name: string;
  flag: string;
  country: string;
  protocol: string;
  fields: PortalField[];
  requiredPlan: "starter" | "pro" | "agency";
}

interface PortalField {
  key: string;
  label: string;
  type: "text" | "password" | "select";
  placeholder: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

const PORTALS: PortalMeta[] = [
  { id: "immobiliare_it", name: "Immobiliare.it", flag: "🇮🇹", country: "IT", protocol: "XML Feed", requiredPlan: "starter", fields: [
    { key: "agencyId", label: "Agency ID", type: "text", placeholder: "Your Immobiliare.it agency ID", required: true },
    { key: "feedUsername", label: "Feed Username", type: "text", placeholder: "XML feed username", required: true },
    { key: "feedPassword", label: "Feed Password", type: "password", placeholder: "XML feed password", required: true },
  ]},
  { id: "idealista", name: "Idealista", flag: "🇪🇸", country: "ES", protocol: "REST API", requiredPlan: "starter", fields: [
    { key: "clientId", label: "Client ID", type: "text", placeholder: "Idealista API client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "API secret", required: true },
    { key: "country", label: "Country", type: "select", placeholder: "Select country", required: true, options: [
      { value: "es", label: "🇪🇸 Spain" }, { value: "it", label: "🇮🇹 Italy" }, { value: "pt", label: "🇵🇹 Portugal" },
    ]},
  ]},
  { id: "seloger", name: "SeLoger", flag: "🇫🇷", country: "FR", protocol: "Aviv Partner API", requiredPlan: "starter", fields: [
    { key: "agencyId", label: "Agency ID", type: "text", placeholder: "SeLoger agency ID", required: true },
    { key: "apiKey", label: "Partner API Key", type: "password", placeholder: "Aviv partner API key", required: true },
    { key: "feedEndpoint", label: "Feed Endpoint", type: "text", placeholder: "https://feed.seloger.com/...", required: true },
  ]},
  { id: "immoscout24", name: "ImmoScout24", flag: "🇩🇪", country: "DE", protocol: "EstateSync", requiredPlan: "starter", fields: [
    { key: "clientId", label: "EstateSync Client ID", type: "text", placeholder: "OAuth client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "OAuth client secret", required: true },
  ]},
  { id: "immowelt", name: "Immowelt", flag: "🇩🇪", country: "DE", protocol: "EstateSync", requiredPlan: "pro", fields: [
    { key: "clientId", label: "EstateSync Client ID", type: "text", placeholder: "OAuth client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "OAuth client secret", required: true },
  ]},
  { id: "rightmove", name: "Rightmove", flag: "🇬🇧", country: "UK", protocol: "RTDF", requiredPlan: "starter", fields: [
    { key: "networkId", label: "Network ID", type: "text", placeholder: "RTDF network ID", required: true },
    { key: "branchId", label: "Branch ID", type: "text", placeholder: "Rightmove branch ID", required: true },
    { key: "apiKey", label: "RTDF API Key", type: "password", placeholder: "Partner API key", required: true },
  ]},
  { id: "zoopla", name: "Zoopla", flag: "🇬🇧", country: "UK", protocol: "XML Feed", requiredPlan: "pro", fields: [
    { key: "apiKey", label: "API Key", type: "password", placeholder: "Zoopla developer API key", required: true },
    { key: "branchId", label: "Branch ID", type: "text", placeholder: "Branch identifier", required: true },
    { key: "feedUrl", label: "Feed URL", type: "text", placeholder: "https://feed.zoopla.co.uk/...", required: true },
  ]},
  { id: "idealista_pt", name: "Idealista PT", flag: "🇵🇹", country: "PT", protocol: "REST API", requiredPlan: "starter", fields: [
    { key: "clientId", label: "Client ID", type: "text", placeholder: "Idealista API client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "API secret", required: true },
  ]},
  { id: "fotocasa", name: "Fotocasa", flag: "🇪🇸", country: "ES", protocol: "Adevinta API", requiredPlan: "pro", fields: [
    { key: "clientId", label: "Adevinta Client ID", type: "text", placeholder: "OAuth client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "OAuth secret", required: true },
  ]},
  { id: "casa_it", name: "Casa.it", flag: "🇮🇹", country: "IT", protocol: "XML Feed", requiredPlan: "pro", fields: [
    { key: "agencyId", label: "Agency ID", type: "text", placeholder: "Casa.it agency ID", required: true },
    { key: "feedUsername", label: "Feed Username", type: "text", placeholder: "XML feed username", required: true },
    { key: "feedPassword", label: "Feed Password", type: "password", placeholder: "XML feed password", required: true },
  ]},
  { id: "leboncoin", name: "LeBonCoin", flag: "🇫🇷", country: "FR", protocol: "Adevinta API", requiredPlan: "pro", fields: [
    { key: "clientId", label: "Adevinta Client ID", type: "text", placeholder: "OAuth client ID", required: true },
    { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "OAuth secret", required: true },
  ]},
  { id: "onthemarket", name: "OnTheMarket", flag: "🇬🇧", country: "UK", protocol: "XML Feed", requiredPlan: "pro", fields: [
    { key: "branchId", label: "Branch ID", type: "text", placeholder: "OTM branch ID", required: true },
    { key: "apiKey", label: "API Key", type: "password", placeholder: "OTM feed API key", required: true },
    { key: "feedUrl", label: "Feed URL", type: "text", placeholder: "https://feed.onthemarket.com/...", required: true },
  ]},
  { id: "bienici", name: "Bien'ici", flag: "🇫🇷", country: "FR", protocol: "Poliris Feed", requiredPlan: "agency", fields: [
    { key: "polirisAgencyId", label: "Poliris Agency ID", type: "text", placeholder: "Poliris agency ID", required: true },
    { key: "polirisFeedKey", label: "Feed Key", type: "password", placeholder: "Poliris feed key", required: true },
    { key: "feedUrl", label: "Feed URL", type: "text", placeholder: "https://feed.poliris.com/...", required: true },
  ]},
  { id: "imovirtual", name: "Imovirtual", flag: "🇵🇹", country: "PT", protocol: "OLX Feed", requiredPlan: "pro", fields: [
    { key: "apiKey", label: "OLX API Key", type: "password", placeholder: "OLX Group partner API key", required: true },
    { key: "agencyId", label: "Agency ID", type: "text", placeholder: "Imovirtual agency ID", required: true },
    { key: "feedUrl", label: "Feed URL", type: "text", placeholder: "https://feed.olxgroup.com/...", required: true },
  ]},
];

/* ─── Types ─── */

interface PortalConnection {
  id: string;
  portal_id: string;
  status: string;
  leads_count: number;
  listings_count: number;
  last_sync_at: string | null;
  last_error: string | null;
  created_at: string;
}

/* ─── Component ─── */

export default function PortalsPage() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<PortalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectModal, setConnectModal] = useState<PortalMeta | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch("/api/portals");
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  function getConnection(portalId: string): PortalConnection | undefined {
    return connections.find((c) => c.portal_id === portalId);
  }

  function openConnect(portal: PortalMeta) {
    if (portal.fields.length === 0) {
      toast({ title: "Coming Soon", description: `${portal.name} integration is under development.` });
      return;
    }
    setFormData({});
    setConnectModal(portal);
  }

  async function handleConnect() {
    if (!connectModal) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal_id: connectModal.id, credentials: formData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Connected!", description: `${connectModal.name} is now ${data.status}.` });
        setConnectModal(null);
        fetchConnections();
      } else {
        toast({ title: "Connection failed", description: data.error || "Check your credentials", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisconnect(conn: PortalConnection) {
    try {
      const res = await fetch("/api/portals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: conn.id }),
      });
      if (res.ok) {
        toast({ title: "Disconnected", description: "Portal has been disconnected." });
        fetchConnections();
      }
    } catch {
      toast({ title: "Error", description: "Failed to disconnect", variant: "destructive" });
    }
  }

  async function handleSync(conn: PortalConnection) {
    setSyncing(conn.id);
    try {
      const res = await fetch("/api/portals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: conn.id }),
      });
      if (res.ok) {
        toast({ title: "Sync complete", description: "Leads have been synced." });
        fetchConnections();
      }
    } catch {
      toast({ title: "Sync failed", variant: "destructive" });
    } finally {
      setSyncing(null);
    }
  }

  function formatTime(iso: string | null): string {
    if (!iso) return "Never";
    const d = new Date(iso);
    const now = new Date();
    const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  }

  const connectedCount = connections.filter((c) => c.status === "connected").length;
  const totalLeads = connections.reduce((sum, c) => sum + (c.leads_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Portal Connections</h1>
            <p className="text-sm text-muted-foreground">Publish listings & import leads from EU portals</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground"><Link2 className="w-4 h-4 text-emerald-400" /><span className="font-medium text-foreground">{connectedCount}</span> connected</div>
          <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4 text-primary" /><span className="font-medium text-foreground">{totalLeads}</span> leads imported</div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="pp-glass-card p-5 animate-pulse">
              <div className="h-5 bg-muted/50 rounded w-2/3 mb-3" />
              <div className="h-3 bg-muted/30 rounded w-full mb-2" />
              <div className="h-8 bg-muted/30 rounded w-1/2 mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Portal Grid */}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTALS.map((portal, i) => {
            const conn = getConnection(portal.id);
            const isConnected = conn?.status === "connected";
            const isPending = conn?.status === "pending";
            const isError = conn?.status === "error";
            const comingSoon = portal.fields.length === 0;

            return (
              <motion.div key={portal.id} className="pp-glass-card p-5 flex flex-col" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{portal.flag}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{portal.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{portal.protocol}</p>
                    </div>
                  </div>
                  {isConnected && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>}
                  {isPending && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                  {isError && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>}
                  {!conn && !comingSoon && <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]">Not connected</Badge>}
                  {comingSoon && <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]"><Clock className="w-3 h-3 mr-1" />Soon</Badge>}
                </div>

                {/* Stats (if connected) */}
                {conn && (isConnected || isPending) && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-background/30">
                      <div className="text-sm font-bold">{conn.leads_count || 0}</div>
                      <div className="text-[9px] text-muted-foreground">Leads</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-background/30">
                      <div className="text-sm font-bold">{conn.listings_count || 0}</div>
                      <div className="text-[9px] text-muted-foreground">Listings</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-background/30">
                      <div className="text-[10px] font-medium">{formatTime(conn.last_sync_at)}</div>
                      <div className="text-[9px] text-muted-foreground">Last sync</div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {isError && conn.last_error && (
                  <p className="text-[10px] text-red-400 mb-3 line-clamp-2">{conn.last_error}</p>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 mr-auto">
                    <Lock className="w-3 h-3" />{portal.requiredPlan === "starter" ? "Starter+" : "Pro+"}
                  </span>
                  {isConnected && (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground" onClick={() => handleSync(conn)} disabled={syncing === conn.id}>
                        {syncing === conn.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Sync
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-400 hover:text-red-300" onClick={() => handleDisconnect(conn)}>
                        <Unplug className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  {(isError || isPending) && (
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openConnect(portal)}>
                      <RefreshCw className="w-3 h-3" /> Retry
                    </Button>
                  )}
                  {!conn && !comingSoon && (
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openConnect(portal)}>
                      <Link2 className="w-3 h-3" /> Connect
                    </Button>
                  )}
                  {comingSoon && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" disabled>Notify Me</Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── Connect Modal ─── */}
      <Dialog open={!!connectModal} onOpenChange={() => setConnectModal(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {connectModal && <span className="text-xl">{connectModal.flag}</span>}
              Connect to {connectModal?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your {connectModal?.name} API credentials. They will be encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {connectModal?.fields.map((field) => (
              <div key={field.key}>
                <Label className="text-xs mb-1.5 block">{field.label} {field.required && <span className="text-red-400">*</span>}</Label>
                {field.type === "select" ? (
                  <Select value={formData[field.key] || ""} onValueChange={(v) => setFormData((prev) => ({ ...prev, [field.key]: v }))}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder={field.placeholder} /></SelectTrigger>
                    <SelectContent>{field.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="bg-background/50"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setConnectModal(null)} disabled={submitting}>Cancel</Button>
            <button onClick={handleConnect} disabled={submitting} className="btn-primary-gradient h-9 px-5 text-sm gap-1.5">
              {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...</> : <><Link2 className="w-3.5 h-3.5" /> Connect</>}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
