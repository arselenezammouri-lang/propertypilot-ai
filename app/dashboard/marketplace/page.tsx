"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState, useEffect } from "react";
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
  TrendingUp,
  Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyMap } from "@/components/maps/property-map";

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
  created_at: string;
}

const COUNTRIES = [
  { code: "", label: "All Countries", flag: "🌍" },
  { code: "IT", label: "Italy", flag: "🇮🇹" },
  { code: "FR", label: "France", flag: "🇫🇷" },
  { code: "ES", label: "Spain", flag: "🇪🇸" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { code: "PT", label: "Portugal", flag: "🇵🇹" },
];

const PROPERTY_TYPES = ["", "Apartment", "Villa", "Penthouse", "Townhouse", "Land", "Commercial"];

const FLAG_MAP: Record<string, string> = {
  IT: "🇮🇹", FR: "🇫🇷", ES: "🇪🇸", DE: "🇩🇪", UK: "🇬🇧", PT: "🇵🇹",
};

export default function MarketplacePage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [total, setTotal] = useState(0);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country) params.set("country", country);
      if (propertyType) params.set("property_type", propertyType);
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

  useEffect(() => { fetchListings(); }, [country, propertyType]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Cross-Border Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Match international buyers with properties across 6 EU countries
          </p>
        </div>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
          <Globe className="w-3 h-3 mr-1" /> {total} Properties
        </Badge>
      </div>

      {/* Map View */}
      <PropertyMap address="Europe" zoom={4} height="h-48" className="rounded-xl" />

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
            ))}
          </select>

          {/* Property Type */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t || "All Types"}</option>
            ))}
          </select>

          {/* Price Range */}
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

          <Button size="sm" variant="outline" onClick={fetchListings}>
            <Search className="w-3 h-3 mr-1" /> Search
          </Button>
        </div>
      </Card>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-emerald-500/30 transition-colors">
              <div className="h-48 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center relative">
                <Store className="w-12 h-12 text-emerald-500/30" />
                {listing.cross_border && (
                  <Badge className="absolute top-2 left-2 bg-emerald-500/80 text-white text-[10px]">
                    <Globe className="w-3 h-3 mr-1" /> Cross-Border
                  </Badge>
                )}
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{FLAG_MAP[listing.country] ?? "🏠"}</span>
                  <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> {listing.city}, {listing.country}
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  €{listing.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {listing.rooms}</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {listing.sqm}m²</span>
                  <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {listing.commission_rate}%</span>
                </div>
                {listing.languages_available.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Languages className="w-3 h-3 text-muted-foreground" />
                    {listing.languages_available.map((l) => (
                      <Badge key={l} variant="outline" className="text-[10px]">{l.toUpperCase()}</Badge>
                    ))}
                  </div>
                )}
                <Button size="sm" onClick={() => alert("Interest registered! The listing agent will contact you.")} className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> Express Interest
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No Marketplace Listings Yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to list a cross-border property on the PropertyPilot marketplace.
          </p>
          <Button onClick={() => alert("To list properties on the marketplace, create a listing in AI Listings first.")} className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            List Your Property
          </Button>
        </Card>
      )}
    </div>
  );
}
