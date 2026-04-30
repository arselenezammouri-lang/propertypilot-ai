"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Globe, Link2, CheckCircle, AlertCircle, Clock, ExternalLink, Zap, Lock,
} from "lucide-react";

interface PortalInfo {
  id: string;
  name: string;
  country: string;
  flag: string;
  protocol: string;
  status: "available" | "coming_soon" | "beta";
  description: string;
  requiredPlan: "starter" | "pro" | "agency";
}

const PORTALS: PortalInfo[] = [
  { id: "immobiliare_it", name: "Immobiliare.it", country: "Italy", flag: "🇮🇹", protocol: "XML Feed", status: "available", description: "Italy's #1 property portal. XML feed integration for automated listing sync.", requiredPlan: "starter" },
  { id: "casa_it", name: "Casa.it", country: "Italy", flag: "🇮🇹", protocol: "XML Feed", status: "coming_soon", description: "Major Italian portal with strong local coverage.", requiredPlan: "pro" },
  { id: "idealista", name: "Idealista", country: "Spain", flag: "🇪🇸", protocol: "REST API", status: "available", description: "Leading portal in Spain, Italy, and Portugal. Direct API integration.", requiredPlan: "starter" },
  { id: "seloger", name: "SeLoger", country: "France", flag: "🇫🇷", protocol: "API + Feed", status: "available", description: "France's premium property portal. API integration with lead polling.", requiredPlan: "starter" },
  { id: "leboncoin", name: "LeBonCoin", country: "France", flag: "🇫🇷", protocol: "Feed", status: "coming_soon", description: "France's largest classifieds site. High-volume traffic.", requiredPlan: "pro" },
  { id: "immoscout24", name: "ImmoScout24", country: "Germany", flag: "🇩🇪", protocol: "EstateSync API", status: "available", description: "Germany's #1 portal. EstateSync covers ImmoScout24 + Immowelt + Kleinanzeigen in one API.", requiredPlan: "starter" },
  { id: "immowelt", name: "Immowelt", country: "Germany", flag: "🇩🇪", protocol: "EstateSync API", status: "available", description: "Major German portal. Integrated via EstateSync unified API.", requiredPlan: "pro" },
  { id: "rightmove", name: "Rightmove", country: "UK", flag: "🇬🇧", protocol: "BLM Feed", status: "available", description: "UK's #1 property portal. BLM feed format for automated publishing.", requiredPlan: "starter" },
  { id: "zoopla", name: "Zoopla", country: "UK", flag: "🇬🇧", protocol: "REST API", status: "beta", description: "Major UK portal with strong SEO. Direct API integration.", requiredPlan: "pro" },
  { id: "fotocasa", name: "Fotocasa", country: "Spain", flag: "🇪🇸", protocol: "XML Feed", status: "coming_soon", description: "Popular Spanish portal with strong mobile presence.", requiredPlan: "pro" },
  { id: "idealista_pt", name: "Idealista Portugal", country: "Portugal", flag: "🇵🇹", protocol: "REST API", status: "available", description: "Leading portal in Portugal. Same Idealista API.", requiredPlan: "starter" },
];

export default function PortalsPage() {
  const [filter, setFilter] = useState<string>("all");

  const countries = [...new Set(PORTALS.map((p) => p.country))];
  const filtered = filter === "all" ? PORTALS : PORTALS.filter((p) => p.country === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Connections</h1>
          <p className="text-sm text-muted-foreground">Publish listings to EU portals. Sync leads automatically.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mt-6 mb-6 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === "all" ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
          All Portals ({PORTALS.length})
        </button>
        {countries.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === c ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
            {PORTALS.find((p) => p.country === c)?.flag} {c}
          </button>
        ))}
      </div>

      {/* Portal Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((portal, i) => (
          <motion.div key={portal.id} className="pp-glass-card p-5 flex flex-col" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{portal.flag}</span>
                <div>
                  <h3 className="font-semibold text-sm">{portal.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{portal.protocol}</p>
                </div>
              </div>
              {portal.status === "available" && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge>}
              {portal.status === "beta" && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]"><Zap className="w-3 h-3 mr-1" />Beta</Badge>}
              {portal.status === "coming_soon" && <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px]"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{portal.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {portal.requiredPlan === "starter" ? "Starter+" : portal.requiredPlan === "pro" ? "Pro+" : "Agency"}
              </span>
              {portal.status === "available" || portal.status === "beta" ? (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" disabled>
                  <Link2 className="w-3 h-3" /> Connect
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" disabled>
                  Notify Me
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 pp-glass-card p-6 text-center">
        <h3 className="font-semibold mb-2">Need a portal we don&apos;t support yet?</h3>
        <p className="text-sm text-muted-foreground mb-4">We&apos;re building new integrations every month. Tell us which portal matters most to you.</p>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3.5 h-3.5" /> Request a Portal</Button>
        </Link>
      </div>
    </div>
  );
}
