"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Loader2, Copy, Check, Building2, MapPin, Globe, AlertTriangle,
  CheckCircle, ChevronRight, Zap, FileText, Shield, ArrowLeft,
} from "lucide-react";

interface ComplianceCheck { rule: string; status: "pass" | "warning" | "fail"; message: string; }
interface PortalOutput {
  portal: string; language: string; title: string; description: string;
  seoKeywords: string[]; highlights: string[]; callToAction: string;
  complianceChecks: ComplianceCheck[]; characterCount: number; withinLimits: boolean;
}

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

export default function AIListingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PortalOutput[]>([]);
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

  function togglePortal(id: string) {
    setSelectedPortals((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  function toggleLang(code: string) {
    setSelectedLangs((prev) => prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]);
  }

  async function handleGenerate() {
    if (!location || !city || !price || !surface) {
      toast({ title: "Missing fields", description: "Please fill in location, city, price, and surface.", variant: "destructive" });
      return;
    }
    if (selectedPortals.length === 0) {
      toast({ title: "No portals selected", description: "Select at least one target portal.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults([]);

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
          style, brandVoiceId: null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data.outputs);
        toast({ title: `${data.data.outputs.length} listings generated`, description: `${selectedPortals.length} portals × ${selectedLangs.length} languages` });
      } else {
        toast({ title: "Generation failed", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to generate listings", variant: "destructive" });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Listings Engine v2</h1>
            <p className="text-sm text-muted-foreground">Portal-optimized, multilingual, compliance-checked listings</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* ─── LEFT: Input Form ─── */}
        <div className="space-y-6">
          {/* Property Details */}
          <div className="pp-glass-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Property Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-xs mb-1.5 block">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Apartment", "Villa", "Penthouse", "House", "Studio", "Office", "Land", "Commercial"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs mb-1.5 block">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>{[{ v: "IT", l: "🇮🇹 Italy" }, { v: "FR", l: "🇫🇷 France" }, { v: "ES", l: "🇪🇸 Spain" }, { v: "DE", l: "🇩🇪 Germany" }, { v: "UK", l: "🇬🇧 United Kingdom" }, { v: "PT", l: "🇵🇹 Portugal" }].map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs mb-1.5 block">Location / Neighborhood</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Trastevere, Marais..." className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Rome, Paris..." className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Price ({country === "UK" ? "£" : "€"})</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350000" className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Surface (m²)</Label><Input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="85" className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Rooms</Label><Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Bathrooms</Label><Input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Energy Class</Label><Input value={energyClass} onChange={(e) => setEnergyClass(e.target.value)} placeholder="e.g. A2, B, D" className="bg-background/50" /></div>
              <div><Label className="text-xs mb-1.5 block">Features (comma-separated)</Label><Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="terrace, parking, renovated..." className="bg-background/50" /></div>
            </div>
            <div><Label className="text-xs mb-1.5 block">Additional Notes</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any extra details about the property..." className="bg-background/50" rows={2} /></div>
          </div>

          {/* Writing Style */}
          <div className="pp-glass-card p-6">
            <h2 className="font-semibold mb-4">Writing Style</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STYLES.map((s) => (
                <button key={s.id} onClick={() => setStyle(s.id)} className={`p-3 rounded-xl border text-left transition-all ${style === s.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/40 hover:border-border"}`}>
                  <s.icon className={`w-5 h-5 mb-2 ${style === s.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Portal & Language Selection ─── */}
        <div className="space-y-6">
          {/* Target Portals */}
          <div className="pp-glass-card p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-primary" /> Target Portals</h2>
            <p className="text-xs text-muted-foreground mb-3">Your country</p>
            <div className="space-y-2 mb-4">
              {countryPortals.map((p) => (
                <button key={p.id} onClick={() => togglePortal(p.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-sm transition-all ${selectedPortals.includes(p.id) ? "border-primary bg-primary/5" : "border-border/40 hover:border-border"}`}>
                  <span>{p.flag}</span><span className="font-medium">{p.name}</span>
                  {selectedPortals.includes(p.id) && <Check className="w-3.5 h-3.5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
            {otherPortals.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground mb-3">Other markets</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {otherPortals.map((p) => (
                    <button key={p.id} onClick={() => togglePortal(p.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-sm transition-all ${selectedPortals.includes(p.id) ? "border-primary bg-primary/5" : "border-border/40 hover:border-border"}`}>
                      <span>{p.flag}</span><span className="font-medium">{p.name}</span>
                      {selectedPortals.includes(p.id) && <Check className="w-3.5 h-3.5 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Languages */}
          <div className="pp-glass-card p-6">
            <h2 className="font-semibold mb-4">Output Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => toggleLang(l.code)} className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${selectedLangs.includes(l.code) ? "border-primary bg-primary/5" : "border-border/40 hover:border-border"}`}>
                  <span>{l.flag}</span><span>{l.label}</span>
                  {selectedLangs.includes(l.code) && <Check className="w-3 h-3 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={loading} className="btn-primary-gradient w-full h-12 text-base gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating {selectedPortals.length * selectedLangs.length} variants...</> : <><Sparkles className="w-4 h-4" /> Generate {selectedPortals.length * selectedLangs.length} Listings</>}
          </button>
          <p className="text-[10px] text-muted-foreground text-center">{selectedPortals.length} portals × {selectedLangs.length} languages = {selectedPortals.length * selectedLangs.length} variants</p>
        </div>
      </div>

      {/* ─── RESULTS ─── */}
      {results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Generated Listings ({results.length})</h2>
          <Tabs defaultValue={results[0]?.portal + "-" + results[0]?.language} className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1 bg-muted/30 p-1.5 rounded-xl">
              {results.map((r) => {
                const portal = PORTALS.find((p) => p.id === r.portal);
                return (
                  <TabsTrigger key={r.portal + "-" + r.language} value={r.portal + "-" + r.language} className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                    {portal?.flag} {portal?.name} ({r.language.toUpperCase()})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {results.map((r) => {
              const portal = PORTALS.find((p) => p.id === r.portal);
              const passCount = r.complianceChecks.filter((c) => c.status === "pass").length;
              const warnCount = r.complianceChecks.filter((c) => c.status === "warning").length;
              const failCount = r.complianceChecks.filter((c) => c.status === "fail").length;

              return (
                <TabsContent key={r.portal + "-" + r.language} value={r.portal + "-" + r.language}>
                  <div className="pp-glass-card p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{portal?.flag}</span>
                        <span className="font-semibold">{portal?.name}</span>
                        <Badge variant="outline" className="text-[10px]">{r.language.toUpperCase()}</Badge>
                        <Badge variant={r.withinLimits ? "default" : "destructive"} className="text-[10px]">{r.characterCount} chars</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {passCount > 0 && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{passCount}</span>}
                        {warnCount > 0 && <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{warnCount}</span>}
                        {failCount > 0 && <span className="text-red-400 flex items-center gap-1"><Shield className="w-3 h-3" />{failCount}</span>}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Title</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-lg bg-background/50 border border-border/40 text-sm font-medium">{r.title}</div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => copyText(r.title, r.portal + r.language + "title")}>
                          {copied === r.portal + r.language + "title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                      <div className="relative">
                        <div className="p-4 rounded-lg bg-background/50 border border-border/40 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">{r.description}</div>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => copyText(r.description, r.portal + r.language + "desc")}>
                          {copied === r.portal + r.language + "desc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>

                    {/* SEO Keywords + Highlights */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">SEO Keywords</Label>
                        <div className="flex flex-wrap gap-1.5">{r.seoKeywords.map((k) => <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>)}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Key Highlights</Label>
                        <div className="flex flex-wrap gap-1.5">{r.highlights.map((h) => <Badge key={h} variant="outline" className="text-[10px]">{h}</Badge>)}</div>
                      </div>
                    </div>

                    {/* Compliance */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Compliance Checks</Label>
                      <div className="space-y-1">
                        {r.complianceChecks.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {c.status === "pass" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            {c.status === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                            {c.status === "fail" && <Shield className="w-3.5 h-3.5 text-red-400" />}
                            <span className="text-muted-foreground">{c.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
