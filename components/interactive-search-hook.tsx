"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Lock, TrendingDown, MapPin, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MockListing {
  id: string;
  title: string;
  location: string;
  marketGap: number;
  price: number;
}

const mockListings: MockListing[] = [
  {
    id: "1",
    title: "Villa moderna con piscina e giardino",
    location: "Milano, Via Garibaldi",
    marketGap: 18,
    price: 850000,
  },
  {
    id: "2",
    title: "Appartamento luminoso in zona centrale",
    location: "Roma, Piazza Navona",
    marketGap: 22,
    price: 450000,
  },
  {
    id: "3",
    title: "Luxury penthouse con vista panoramica",
    location: "Firenze, Centro Storico",
    marketGap: 15,
    price: 1200000,
  },
];

export function InteractiveSearchHook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MockListing[] | null>(null);
  const [searchCategory, setSearchCategory] = useState<'all' | 'sale' | 'rent' | 'commercial'>('all');
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setResults(null);

    // Simula scansione AI (2-3 secondi)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mostra risultati mock (oscurati)
    setResults(mockListings);
    setIsSearching(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const obscureTitle = (title: string) => {
    // Oscura parzialmente il titolo
    const words = title.split(" ");
    return words
      .map((word, idx) => {
        if (idx < 2) return word;
        return "█".repeat(word.length);
      })
      .join(" ");
  };

  return (
    <div className="w-full py-16 bg-gradient-to-b from-background to-purple-500/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Box */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-purple-500/10 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ricerca Live nella tua Zona
              </h2>
              <p className="text-muted-foreground text-lg">
                L'IA scansiona Idealista, Immobiliare.it, Zillow e MLS in tempo reale
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cerca in tutto il mondo (es: Affitti a Londra, Commerciale a New York, Vendite a Parigi...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="pl-10 h-12 text-lg bg-background/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-12 px-8 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Scansione...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Cerca
                  </>
                )}
              </Button>
            </div>

            {/* Scanning Animation */}
            {isSearching && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  <p className="text-purple-300 font-medium">
                    L'IA sta analizzando Idealista e Immobiliare a{" "}
                    <span className="font-bold">{searchQuery}</span>...
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {results && !isSearching && (
              <div className="mt-8 space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    Trovati <span className="font-bold text-purple-400">3 opportunità</span> con Market Gap significativo
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {results.map((listing) => (
                    <Card
                      key={listing.id}
                      className="border-purple-500/20 bg-background/50 hover:border-purple-500/40 transition-all hover:shadow-lg"
                    >
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          {/* Titolo Oscurato */}
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">Titolo</p>
                            <p className="text-base font-medium">{obscureTitle(listing.title)}</p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{listing.location}</p>
                          </div>

                          {/* Market Gap */}
                          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <span className="text-sm font-medium text-green-400">Market Gap</span>
                            <Badge className="bg-green-500 text-white">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              -{listing.marketGap}%
                            </Badge>
                          </div>

                          {/* Prezzo Oscurato */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Prezzo</p>
                            <p className="text-lg font-bold">
                              {formatPrice(listing.price).substring(0, 3)}███
                            </p>
                          </div>

                          {/* CTA Button */}
                          <Link href="/auth/signup">
                            <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold mt-4 relative shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all animate-pulse hover:animate-none">
                              <Lock className="h-4 w-4 mr-2" />
                              Sblocca Dati e Chiama Ora
                              <div className="absolute inset-0 rounded-md bg-purple-400/30 blur-xl -z-10"></div>
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    ⚡ Questi deal sono stati inviati anche a{" "}
                    <span className="font-bold text-amber-400">12 agenzie partner</span> nella tua zona. Affrettati!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

