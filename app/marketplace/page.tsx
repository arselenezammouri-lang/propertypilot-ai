"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Globe,
  Search,
  MapPin,
  Bed,
  Maximize,
  Euro,
  Languages,
  Filter,
  ArrowRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingNavHeader } from "@/components/marketing-nav-header";

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  country: string;
  city: string;
  property_type: string;
  sqm: number;
  rooms: number;
  languages_available: string[];
  commission_rate: number;
  cross_border: boolean;
}

const FLAG: Record<string, string> = {
  IT: "🇮🇹", FR: "🇫🇷", ES: "🇪🇸", DE: "🇩🇪", UK: "🇬🇧", PT: "🇵🇹",
};

const COUNTRIES = [
  { code: "", label: "All Countries", flag: "🌍" },
  { code: "IT", label: "Italy", flag: "🇮🇹" },
  { code: "FR", label: "France", flag: "🇫🇷" },
  { code: "ES", label: "Spain", flag: "🇪🇸" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "UK", label: "UK", flag: "🇬🇧" },
  { code: "PT", label: "Portugal", flag: "🇵🇹" },
];

export default function MarketplacePublicPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [total, setTotal] = useState(0);
  const [country, setCountry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country) params.set("country", country);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      const res = await fetch(`/api/marketplace?${params}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings ?? []);
        setTotal(data.total ?? 0);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mb-4">
            <Globe className="w-3 h-3 mr-1" /> Cross-Border Marketplace
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              European Properties
            </span>
            <br />
            <span className="text-foreground">One Marketplace</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse properties across Italy, France, Spain, Germany, UK and Portugal.
            AI-powered translation, cross-border agent matching, and secure escrow.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); }}
              className="bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
              ))}
            </select>
            <input
              placeholder="Min €"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              className="w-28 bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
            />
            <span className="text-muted-foreground">–</span>
            <input
              placeholder="Max €"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              className="w-28 bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
            />
            <Button size="sm" onClick={fetchListings} className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Search className="w-3 h-3 mr-1" /> Search
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">{total} properties</span>
          </div>
        </Card>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => (
              <Card key={l.id} className="overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-emerald-500/30 transition-all group">
                <div className="h-48 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center relative">
                  <Store className="w-12 h-12 text-emerald-500/20" />
                  {l.cross_border && (
                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px]">
                      <Globe className="w-3 h-3 mr-1" /> Cross-Border
                    </Badge>
                  )}
                  <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{FLAG[l.country] ?? "🏠"}</span>
                    <h3 className="font-semibold text-sm truncate">{l.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" /> {l.city}, {l.country}
                  </p>
                  <p className="text-xl font-bold text-emerald-400">€{l.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {l.rooms}</span>
                    <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {l.sqm}m²</span>
                    <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {l.commission_rate}%</span>
                  </div>
                  {l.languages_available.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Languages className="w-3 h-3 text-muted-foreground" />
                      {l.languages_available.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-[10px]">{lang.toUpperCase()}</Badge>
                      ))}
                    </div>
                  )}
                  <Button size="sm" className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                    Express Interest <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center bg-card/50 backdrop-blur border-border/50">
            <Store className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Marketplace Launching Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The PropertyPilot cross-border marketplace is coming. List your properties to reach international buyers.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Sign Up to List Properties
              </Button>
            </Link>
          </Card>
        )}
      </section>
    </main>
  );
}
