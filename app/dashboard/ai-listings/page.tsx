"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Loader2, Copy, Check, Building2, MapPin, Globe, AlertTriangle,
  CheckCircle, ChevronRight, Zap, FileText, Shield, ArrowLeft, Plus,
  Pencil, Trash2, Mic, X, Star,
} from "lucide-react";

/* ─── Types ─── */

interface BrandVoice { id: string; name: string; tone: string; style_keywords: string[]; example_text: string; is_default: boolean; }
interface ComplianceCheck { rule: string; status: "pass" | "warning" | "fail"; message: string; }
interface PortalOutput {
  portal: string; language: string; title: string; description: string;
  seoKeywords: string[]; highlights: string[]; callToAction: string;
  complianceChecks: ComplianceCheck[]; characterCount: number; withinLimits: boolean;
}

/* ─── Constants ─── */

const PORTALS = [
  { id: "immobiliare_it", name: "Immobiliare.it", flag: "🇮🇹", country: "IT" },
  { id: "casa_it", name: "Casa.it", flag: "🇮🇹", country: "IT" },
  { id: "idealista", name: "Idealista", flag: "🇪🇸", country: "ES" },
  { id: "seloger", name: "SeLoger", flag: "🇫🇷", country: "FR" },
  { id: "leboncoin", name: "LeBonCoin", flag: "🇫🇷", country: "FR" },
  { id: "immoscout24", name: "ImmoScout24", flag: "🇩🇪", country: "DE" },
  { id: "immowelt", name: "Immowelt", flag: "🇩🇪", country: "DE" },
  { id: "rightmove", name: "Rightmove", flag: "🇬🇧", country: "UK" },
  { id: "zoopla", name: "Zoopla", flag: "🇬🇧", country: "UK" },
  { id: "fotocasa", name: "Fotocasa", flag: "🇪🇸", country: "ES" },
  { id: "idealista_pt", name: "Idealista PT", flag: "🇵🇹", country: "PT" },
];

const LANGUAGES = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

const STYLES = [
  { id: "standard", label: "Standard", icon: FileText, desc: "Professional & clear" },
  { id: "luxury", label: "Luxury", icon: Sparkles, desc: "Exclusive & aspirational" },
  { id: "investment", label: "Investment", icon: Zap, desc: "ROI & data-driven" },
  { id: "emotional", label: "Emotional", icon: Building2, desc: "Lifestyle & storytelling" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "luxury", label: "Luxury" },
  { value: "casual", label: "Casual" },
  { value: "authoritative", label: "Authoritative" },
];

export default function AIListingsPage() {
  const { toast } = useToast();

  // Brand voice state
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("default");
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoice | null>(null);
  const [voiceForm, setVoiceForm] = useState({ name: "", tone: "professional", keywords: "", example_text: "", is_default: false });
  const [voiceSaving, setVoiceSaving] = useState(false);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PortalOutput[]>([]);
  const [brandVoiceName, setBrandVoiceName] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [propertyType, setPropertyType] = useState("Apartment");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("IT");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [rooms, setRooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("1");
  const [energyClass, setEnergyClass] = useState("");
  const [features, setFeatures] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("standard");
  const [selectedPortals, setSelectedPortals] = useState<string[]>(["immobiliare_it"]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["it", "en"]);

  /* ─── Brand Voice CRUD ─── */

  const fetchVoices = useCallback(async () => {
    try {
      const res = await fetch("/api/brand-voice");
      if (res.ok) {
        const data = await res.json();
        setBrandVoices(data.profiles || []);
        const defaultV = (data.profiles || []).find((v: BrandVoice) => v.is_default);
        if (defaultV) setSelectedVoiceId(defaultV.id);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchVoices(); }, [fetchVoices]);

  function openCreateVoice() {
    setEditingVoice(null);
    setVoiceForm({ name: "", tone: "professional", keywords: "", example_text: "", is_default: false });
    setVoiceModalOpen(true);
  }

  function openEditVoice(v: BrandVoice) {
    setEditingVoice(v);
    setVoiceForm({ name: v.name, tone: v.tone, keywords: v.style_keywords.join(", "), example_text: v.example_text, is_default: v.is_default });
    setVoiceModalOpen(true);
  }

  async function saveVoice() {
    if (!voiceForm.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const keywords = voiceForm.keywords.split(",").map((k) => k.trim()).filter(Boolean);
    if (keywords.length === 0) { toast({ title: "Add at least one style keyword", variant: "destructive" }); return; }

    setVoiceSaving(true);
    try {
      const payload = {
        ...(editingVoice ? { id: editingVoice.id } : {}),
        name: voiceForm.name.trim(),
        tone: voiceForm.tone,
        style_keywords: keywords,
        example_text: voiceForm.example_text.trim(),
        is_default: voiceForm.is_default,
      };

      const res = await fetch("/api/brand-voice", {
        method: editingVoice ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: editingVoice ? "Profile updated" : "Profile created", description: `"${voiceForm.name}" saved.` });
        setVoiceModalOpen(false);
        fetchVoices();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setVoiceSaving(false);
    }
  }

  async function deleteVoice(v: BrandVoice) {
    try {
      const res = await fetch("/api/brand-voice", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Deleted", description: `"${v.name}" removed.` });
        if (selectedVoiceId === v.id) setSelectedVoiceId("default");
        fetchVoices();
      } else {
        toast({ title: "Cannot delete", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  }

  /* ─── Generation ─── */

  function togglePortal(id: string) { setSelectedPortals((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); }
  function toggleLang(code: string) { setSelectedLangs((l) => l.includes(code) ? l.filter((x) => x !== code) : [...l, code]); }

  async function handleGenerate() {
    if (!location || !city || !price || !surface) { toast({ title: "Missing fields", description: "Fill location, city, price, surface.", variant: "destructive" }); return; }
    if (selectedPortals.length === 0) { toast({ title: "No portals", variant: "destructive" }); return; }
    setLoading(true);
    setResults([]);
    setBrandVoiceName(null);

    try {
      const res = await fetch("/api/ai-listings/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType, location, city, country,
          price: Number(price), currency: country === "UK" ? "GBP" : "EUR",
          surface: Number(surface), rooms: Number(rooms), bathrooms: Number(bathrooms),
          floor: null, totalFloors: null, yearBuilt: null,
          energyClass: energyClass || null,
          features: features.split(",").map((f) => f.trim()).filter(Boolean),
          description_raw: description,
          targetPortals: selectedPortals,
          outputLanguages: selectedLangs,
          style,
          brandVoiceId: selectedVoiceId !== "default" ? selectedVoiceId : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data.outputs);
        setBrandVoiceName(data.data.brandVoiceName || null);
        toast({ title: `${data.data.outputs.length} listings generated` });
      } else {
        toast({ title: "Failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const countryPortals = PORTALS.filter((p) => p.country === country);
  const otherPortals = PORTALS.filter((p) => p.country !== country);
  const selectedVoice = brandVoices.find((v) => v.id === selectedVoiceId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Listings Engine v2</h1>
            <p className="text-sm text-muted-foreground">Portal-optimized · Multilingual · Brand voice · Compliance-checked</p>
          </div>
        </div>
      </div>

      {/* ─── BRAND VOICE SECTION ─── */}
      <div className="pp-glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Mic className="w-4 h-4 text-primary" /> Brand Voice</h2>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={openCreateVoice}><Plus className="w-3 h-3" /> New Voice</Button>
        </div>

        {brandVoices.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No brand voice profiles yet</p>
            <p className="text-xs text-muted-foreground">Create one to make AI write in your agency&apos;s unique style.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedVoiceId("default")} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${selectedVoiceId === "default" ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
              <Globe className="w-3.5 h-3.5" /> Default (no brand voice)
            </button>
            {brandVoices.map((v) => (
              <div key={v.id} className="flex items-center gap-0.5">
                <button onClick={() => setSelectedVoiceId(v.id)} className={`flex items-center gap-2 px-3 py-2 rounded-l-lg border-y border-l text-xs transition-all ${selectedVoiceId === v.id ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
                  {v.is_default && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                  {v.name}
                  <Badge variant="outline" className="text-[9px] ml-1 h-4">{v.tone}</Badge>
                </button>
                <button onClick={() => openEditVoice(v)} className="px-1.5 py-2 border-y border-border/40 text-muted-foreground hover:text-foreground text-xs"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => deleteVoice(v)} className="px-1.5 py-2 border-y border-r rounded-r-lg border-border/40 text-muted-foreground hover:text-red-400 text-xs"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}

        {selectedVoice && (
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
            <span className="font-medium text-primary">Active: {selectedVoice.name}</span>
            <span className="text-muted-foreground ml-2">· {selectedVoice.tone} · {selectedVoice.style_keywords.slice(0, 5).join(", ")}</span>
          </div>
        )}
      </div>

      {/* ─── MAIN GRID ─── */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: Property form */}
        <div className="space-y-6">
          <div className="pp-glass-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Property Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-xs mb-1.5 block">Property Type</Label><Select value={propertyType} onValueChange={setPropertyType}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{["Apartment","Villa","Penthouse","House","Studio","Office","Land","Commercial"].map((t)=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs mb-1.5 block">Country</Label><Select value={country} onValueChange={setCountry}><SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger><SelectContent>{[{v:"IT",l:"🇮🇹 Italy"},{v:"FR",l:"🇫🇷 France"},{v:"ES",l:"🇪🇸 Spain"},{v:"DE",l:"🇩🇪 Germany"},{v:"UK",l:"🇬🇧 UK"},{v:"PT",l:"🇵🇹 Portugal"}].map((c)=><SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs mb-1.5 block">Location</Label><Input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="e.g. Trastevere, Marais..." className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">City</Label><Input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="e.g. Rome, Paris..." className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Price ({country==="UK"?"£":"€"})</Label><Input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="350000" className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Surface (m²)</Label><Input type="number" value={surface} onChange={(e)=>setSurface(e.target.value)} placeholder="85" className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Rooms</Label><Input type="number" value={rooms} onChange={(e)=>setRooms(e.target.value)} className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Bathrooms</Label><Input type="number" value={bathrooms} onChange={(e)=>setBathrooms(e.target.value)} className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Energy Class</Label><Input value={energyClass} onChange={(e)=>setEnergyClass(e.target.value)} placeholder="e.g. A2, B, D" className="bg-background/50"/></div>
              <div><Label className="text-xs mb-1.5 block">Features</Label><Input value={features} onChange={(e)=>setFeatures(e.target.value)} placeholder="terrace, parking..." className="bg-background/50"/></div>
            </div>
            <div><Label className="text-xs mb-1.5 block">Notes</Label><Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Extra details..." className="bg-background/50" rows={2}/></div>
          </div>

          <div className="pp-glass-card p-6">
            <h2 className="font-semibold mb-4">Writing Style</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STYLES.map((s)=>(<button key={s.id} onClick={()=>setStyle(s.id)} className={`p-3 rounded-xl border text-left transition-all ${style===s.id?"border-primary bg-primary/5 ring-1 ring-primary/20":"border-border/40 hover:border-border"}`}><s.icon className={`w-5 h-5 mb-2 ${style===s.id?"text-primary":"text-muted-foreground"}`}/><div className="text-sm font-medium">{s.label}</div><div className="text-[10px] text-muted-foreground">{s.desc}</div></button>))}
            </div>
          </div>
        </div>

        {/* RIGHT: Portals + Languages + Generate */}
        <div className="space-y-6">
          <div className="pp-glass-card p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-primary"/> Target Portals</h2>
            <p className="text-xs text-muted-foreground mb-3">Your country</p>
            <div className="space-y-2 mb-4">{countryPortals.map((p)=>(<button key={p.id} onClick={()=>togglePortal(p.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-sm transition-all ${selectedPortals.includes(p.id)?"border-primary bg-primary/5":"border-border/40 hover:border-border"}`}><span>{p.flag}</span><span className="font-medium">{p.name}</span>{selectedPortals.includes(p.id)&&<Check className="w-3.5 h-3.5 text-primary ml-auto"/>}</button>))}</div>
            {otherPortals.length>0&&(<><p className="text-xs text-muted-foreground mb-3">Other markets</p><div className="space-y-2 max-h-48 overflow-y-auto">{otherPortals.map((p)=>(<button key={p.id} onClick={()=>togglePortal(p.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-sm transition-all ${selectedPortals.includes(p.id)?"border-primary bg-primary/5":"border-border/40 hover:border-border"}`}><span>{p.flag}</span><span className="font-medium">{p.name}</span>{selectedPortals.includes(p.id)&&<Check className="w-3.5 h-3.5 text-primary ml-auto"/>}</button>))}</div></>)}
          </div>
          <div className="pp-glass-card p-6">
            <h2 className="font-semibold mb-4">Output Languages</h2>
            <div className="grid grid-cols-2 gap-2">{LANGUAGES.map((l)=>(<button key={l.code} onClick={()=>toggleLang(l.code)} className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${selectedLangs.includes(l.code)?"border-primary bg-primary/5":"border-border/40 hover:border-border"}`}><span>{l.flag}</span><span>{l.label}</span>{selectedLangs.includes(l.code)&&<Check className="w-3 h-3 text-primary ml-auto"/>}</button>))}</div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary-gradient w-full h-12 text-base gap-2 disabled:opacity-50">
            {loading?<><Loader2 className="w-4 h-4 animate-spin"/>Generating...</>:<><Sparkles className="w-4 h-4"/>Generate {selectedPortals.length*selectedLangs.length} Listings</>}
          </button>
          <p className="text-[10px] text-muted-foreground text-center">{selectedPortals.length} portals × {selectedLangs.length} languages{selectedVoice?` · Voice: ${selectedVoice.name}`:""}</p>
        </div>
      </div>

      {/* ─── RESULTS ─── */}
      {results.length>0&&(
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>Generated Listings ({results.length})</h2>
            {brandVoiceName&&<Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1"><Mic className="w-3 h-3"/>Powered by &ldquo;{brandVoiceName}&rdquo;</Badge>}
          </div>
          <Tabs defaultValue={results[0]?.portal+"-"+results[0]?.language} className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1 bg-muted/30 p-1.5 rounded-xl">
              {results.map((r)=>{const p=PORTALS.find((x)=>x.id===r.portal);return(<TabsTrigger key={r.portal+"-"+r.language} value={r.portal+"-"+r.language} className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">{p?.flag} {p?.name} ({r.language.toUpperCase()})</TabsTrigger>);})}
            </TabsList>
            {results.map((r)=>{
              const portal=PORTALS.find((x)=>x.id===r.portal);
              const passC=r.complianceChecks.filter((c)=>c.status==="pass").length;
              const warnC=r.complianceChecks.filter((c)=>c.status==="warning").length;
              const failC=r.complianceChecks.filter((c)=>c.status==="fail").length;
              return(
                <TabsContent key={r.portal+"-"+r.language} value={r.portal+"-"+r.language}>
                  <div className="pp-glass-card p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="text-lg">{portal?.flag}</span><span className="font-semibold">{portal?.name}</span><Badge variant="outline" className="text-[10px]">{r.language.toUpperCase()}</Badge><Badge variant={r.withinLimits?"default":"destructive"} className="text-[10px]">{r.characterCount} chars</Badge></div>
                      <div className="flex items-center gap-2 text-xs">{passC>0&&<span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>{passC}</span>}{warnC>0&&<span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>{warnC}</span>}{failC>0&&<span className="text-red-400 flex items-center gap-1"><Shield className="w-3 h-3"/>{failC}</span>}</div>
                    </div>
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><div className="flex items-center gap-2"><div className="flex-1 p-3 rounded-lg bg-background/50 border border-border/40 text-sm font-medium">{r.title}</div><Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={()=>copyText(r.title,r.portal+r.language+"t")}>{copied===r.portal+r.language+"t"?<Check className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}</Button></div></div>
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label><div className="relative"><div className="p-4 rounded-lg bg-background/50 border border-border/40 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">{r.description}</div><Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={()=>copyText(r.description,r.portal+r.language+"d")}>{copied===r.portal+r.language+"d"?<Check className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}</Button></div></div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label className="text-xs text-muted-foreground mb-2 block">SEO Keywords</Label><div className="flex flex-wrap gap-1.5">{r.seoKeywords.map((k)=><Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>)}</div></div>
                      <div><Label className="text-xs text-muted-foreground mb-2 block">Compliance</Label><div className="space-y-1">{r.complianceChecks.map((c,i)=>(<div key={i} className="flex items-center gap-2 text-xs">{c.status==="pass"&&<CheckCircle className="w-3.5 h-3.5 text-emerald-400"/>}{c.status==="warning"&&<AlertTriangle className="w-3.5 h-3.5 text-amber-400"/>}{c.status==="fail"&&<Shield className="w-3.5 h-3.5 text-red-400"/>}<span className="text-muted-foreground">{c.message}</span></div>))}</div></div>
                    </div>
                  </div>
                </TabsContent>);
            })}
          </Tabs>
        </motion.div>
      )}

      {/* ─── BRAND VOICE MODAL ─── */}
      <Dialog open={voiceModalOpen} onOpenChange={setVoiceModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingVoice ? "Edit Brand Voice" : "Create Brand Voice"}</DialogTitle>
            <DialogDescription>Define your agency&apos;s writing style. AI will match this voice when generating listings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label className="text-xs mb-1.5 block">Name <span className="text-red-400">*</span></Label><Input value={voiceForm.name} onChange={(e)=>setVoiceForm({...voiceForm,name:e.target.value})} placeholder='e.g. "Luxury Milanese", "Friendly Local"' className="bg-background/50"/></div>
            <div><Label className="text-xs mb-1.5 block">Tone <span className="text-red-400">*</span></Label>
              <Select value={voiceForm.tone} onValueChange={(v)=>setVoiceForm({...voiceForm,tone:v})}>
                <SelectTrigger className="bg-background/50"><SelectValue/></SelectTrigger>
                <SelectContent>{TONES.map((t)=><SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs mb-1.5 block">Style Keywords <span className="text-red-400">*</span></Label><Input value={voiceForm.keywords} onChange={(e)=>setVoiceForm({...voiceForm,keywords:e.target.value})} placeholder="elegante, esclusivo, raffinato, luminoso" className="bg-background/50"/><p className="text-[10px] text-muted-foreground mt-1">Comma-separated words that define your style</p></div>
            <div><Label className="text-xs mb-1.5 block">Example Text</Label><Textarea value={voiceForm.example_text} onChange={(e)=>setVoiceForm({...voiceForm,example_text:e.target.value})} placeholder="Paste 2-3 sample listing descriptions your agency has written. AI will learn to mimic this voice." className="bg-background/50" rows={5}/><p className="text-[10px] text-muted-foreground mt-1">Optional but highly recommended. The more examples, the better the AI matches your voice.</p></div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={voiceForm.is_default} onChange={(e)=>setVoiceForm({...voiceForm,is_default:e.target.checked})} className="rounded border-border"/>
              <span className="text-sm">Set as default brand voice</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={()=>setVoiceModalOpen(false)} disabled={voiceSaving}>Cancel</Button>
            <button onClick={saveVoice} disabled={voiceSaving} className="btn-primary-gradient h-9 px-5 text-sm gap-1.5">
              {voiceSaving?<><Loader2 className="w-3.5 h-3.5 animate-spin"/>Saving...</>:<>{editingVoice?"Update":"Create"} Voice</>}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
