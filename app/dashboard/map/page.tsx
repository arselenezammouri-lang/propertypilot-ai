"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Zap,
  MapPin,
  Filter,
  Phone,
  Send,
  TrendingDown,
  Clock,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import NextDynamic from "next/dynamic";
import { analyzeUrgency } from "@/lib/ai/urgency-analysis";

// Lazy load heavy components
const AIVirtualStaging = NextDynamic(() => import("@/components/ai-virtual-staging").then(mod => ({ default: mod.AIVirtualStaging })), {
  ssr: false,
});

const WhatsAppSenderModal = NextDynamic(() => import("@/components/whatsapp-sender-modal").then(mod => ({ default: mod.WhatsAppSenderModal })), {
  ssr: false,
});

const PredatorLiveBadge = NextDynamic(() => import("@/components/predator-live-badge").then(mod => ({ default: mod.PredatorLiveBadge })), {
  ssr: false,
});

interface ExternalListing {
  id: string;
  title: string;
  location: string;
  price: number | null;
  source_platform: string;
  status: 'new' | 'called' | 'appointment_set' | 'rejected' | 'converted';
  owner_name: string | null;
  phone_number: string | null;
  source_url: string;
  ai_summary: any;
  lead_score: number | null;
  created_at: string;
  updated_at: string;
  raw_data?: any;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  listing: ExternalListing;
  urgencyScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  marketGap: number | null;
  daysOnMarket: number;
}

export default function PredatorMapPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { locale, currency } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale).dashboard;
  const [listings, setListings] = useState<ExternalListing[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showGhostListings, setShowGhostListings] = useState(false);
  const [topDealsOnly, setTopDealsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [callingListingId, setCallingListingId] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { handleAPIError } = useAPIErrorHandler();
  const [userPlan, setUserPlan] = useState<string>("free");
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/user/subscription");
        const data = await res.json();
        if (data?.success && data?.data?.status) setUserPlan(data.data.status);
      } catch {
        setUserPlan("free");
      } finally {
        setIsLoadingPlan(false);
      }
    };
    fetchPlan();
  }, []);

  const isMapLocked = userPlan !== "agency";

  // Mock geocoding - in produzione usare API reale (Google Maps, Mapbox, etc.)
  const geocodeLocation = async (location: string): Promise<{ lat: number; lng: number } | null> => {
    // Mock: genera coordinate casuali per demo
    // In produzione: chiamare API geocoding
    const mockCoords = {
      'milano': { lat: 45.4642, lng: 9.1900 },
      'roma': { lat: 41.9028, lng: 12.4964 },
      'firenze': { lat: 43.7696, lng: 11.2558 },
      'torino': { lat: 45.0703, lng: 7.6869 },
      'napoli': { lat: 40.8518, lng: 14.2681 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
    };

    const locationLower = location.toLowerCase();
    for (const [key, coords] of Object.entries(mockCoords)) {
      if (locationLower.includes(key)) {
        // Aggiungi variazione casuale per non sovrapporre marker
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.1,
          lng: coords.lng + (Math.random() - 0.5) * 0.1,
        };
      }
    }

    // Default: coordinate Italia centrale con variazione
    return {
      lat: 43.0 + (Math.random() - 0.5) * 4,
      lng: 12.0 + (Math.random() - 0.5) * 4,
    };
  };

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsRes, eliteRes] = await Promise.all([
        fetch('/api/prospecting/listings?status=all'),
        fetch('/api/prospecting/elite-deals'),
      ]);
      const listingsData = await listingsRes.json();
      const eliteData = await eliteRes.json();

      if (!listingsRes.ok || !listingsData.success) {
        throw new Error(listingsData.error || 'Unable to load listings');
      }

      if (!eliteRes.ok || !eliteData.success || !Array.isArray(eliteData.data)) {
        // Elite deals are optional; log but don't block the map
        console.warn('[PREDATOR MAP] Elite deals not available');
      }

      const userListings = listingsData.data || [];
      const eliteListings = Array.isArray(eliteData.data) ? eliteData.data : [];
      setListings([...userListings, ...eliteListings]);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setListings([]);
      const friendly = handleAPIError(error, locale === "it" ? "Errore nel caricamento delle liste" : "Error loading map data");
      toast({
        title: locale === "it" ? "Errore" : "Error",
        description: friendly,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [handleAPIError, locale, toast]);

  useEffect(() => {
    if (!isMapLocked) fetchListings();
  }, [isMapLocked, fetchListings]);

  useEffect(() => {
    // Processa listings e crea markers
    const processMarkers = async () => {
      const processedMarkers: MapMarker[] = [];

      for (const listing of listings) {
        // Filtro Ghost Listings
        if (showGhostListings) {
          const daysOnMarket = Math.floor(
            (new Date().getTime() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysOnMarket <= 90) continue;
        }

        // Geocoding
        const coords = await geocodeLocation(listing.location);
        if (!coords) continue;

        // Calcola market gap
        const marketGap = calculateMarketGapForListing(listing);

        // Applica filtro Top Deals se richiesto
        if (topDealsOnly && !(marketGap && marketGap > 15)) {
          continue;
        }

        // Analizza urgenza
        const daysOnMarket = Math.floor(
          (new Date().getTime() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const urgency = analyzeUrgency(
          listing.title,
          listing.raw_data?.description || listing.ai_summary?.summary_note || '',
          listing.price,
          daysOnMarket
        );

        processedMarkers.push({
          id: listing.id,
          lat: coords.lat,
          lng: coords.lng,
          listing,
          urgencyScore: urgency.urgencyScore,
          urgencyLevel: urgency.urgencyLevel,
          marketGap,
          daysOnMarket,
        });
      }

      setMarkers(processedMarkers);
    };

    if (listings.length > 0) {
      processMarkers();
    }
  }, [listings, showGhostListings, topDealsOnly]);

  const calculateMarketGapForListing = (listing: ExternalListing): number | null => {
    if (!listing.price || !listing.raw_data?.surface) return null;
    const pricePerSqm = listing.price / listing.raw_data.surface;
    const marketAvgPricePerSqm = pricePerSqm * 1.22;
    const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
    return gap > 0 ? gap : null;
  };

  const handleCall = async (listingId: string) => {
    setCallingListingId(listingId);
    try {
      const response = await fetch('/api/prospecting/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t.mapCallLaunched,
          description: locale === "it" ? "La chiamata AI è stata avviata con successo" : "AI call started successfully",
        });
        fetchListings();
      } else {
        toast({
          title: locale === "it" ? "Errore" : "Error",
          description: data.error || t.mapCallError,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: locale === "it" ? "Errore" : "Error",
        description: locale === "it" ? "Errore di connessione" : "Connection error",
        variant: "destructive",
      });
    } finally {
      setCallingListingId(null);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return formatCurrencyForLocale(price, locale as Locale, currency);
  };

  if (isLoadingPlan) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isMapLocked) {
    return (
      <div className="min-h-screen bg-card text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600/20">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {locale === "it" ? "Mappa Territorio AI" : "AI Territory Map"}
                </CardTitle>
                <CardDescription className="text-foreground/60 mt-1">
                  {locale === "it"
                    ? "Disponibile solo con piano Agency. Sblocca la mappa e tutte le funzionalità Diamond."
                    : "Available on Agency plan only. Unlock the map and all Diamond features."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/billing">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-amber-400 hover:opacity-90">
                {locale === "it" ? "Sblocca con Agency" : "Upgrade to Agency"}
              </Button>
            </Link>
            <Link href="/dashboard/prospecting">
              <Button variant="ghost" className="w-full mt-2 text-foreground/60 hover:text-foreground hover:bg-muted/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === "it" ? "Torna al Prospecting" : "Back to Prospecting"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card text-foreground relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/prospecting" aria-label={locale === "it" ? "Torna al Prospecting" : "Back to Prospecting"}>
              <Button variant="ghost" size="icon" aria-label={locale === "it" ? "Indietro" : "Back"}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                <span className="hidden sm:inline">{t.mapTitle}</span>
                <span className="sm:hidden">{t.mapTitle.replace(' Command', '')}</span>
              </h1>
              <p className="text-xs sm:text-sm text-foreground/60 hidden sm:block">
                {t.mapSubtitle}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showGhostListings}
                onCheckedChange={setShowGhostListings}
              />
              <span className="text-xs sm:text-sm text-foreground/70 hidden sm:inline">{t.mapGhostListings}</span>
              <span className="text-xs sm:text-sm text-foreground/70 sm:hidden">Ghost</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={topDealsOnly}
                onCheckedChange={setTopDealsOnly}
              />
              <span className="text-xs sm:text-sm text-foreground/70 hidden sm:inline">
                {locale === "it" ? "Solo TOP DEAL" : "Top deals only"}
              </span>
              <span className="text-xs sm:text-sm text-foreground/70 sm:hidden">TOP</span>
            </div>
            <Button onClick={fetchListings} variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t.mapRefresh}</span>
              <span className="sm:hidden">{t.mapRefresh}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="pt-20 h-screen relative">
        {/* Badge LIVE Predatori Online - Solo primo accesso */}
        <PredatorLiveBadge />
        
        {/* Mappa Placeholder Professionale (Mapbox-style) */}
        <div
          ref={mapContainerRef}
          className="w-full h-full bg-[#1a1a1a] relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              )
            `,
          }}
        >
          {/* Legend - Responsive */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-40 bg-card/90 backdrop-blur-xl border border-border rounded-lg p-2 sm:p-4 max-w-[260px] sm:max-w-none">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3">{t.mapLegend}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                <span className="text-foreground/70">{t.mapTopDeal}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-foreground" />
                </div>
                <span className="text-foreground/70">{t.mapHighUrgency}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                <span className="text-foreground/70">{t.mapWarm}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white"></div>
                <span className="text-foreground/70">{t.mapCold}</span>
              </div>
              {/* KPI sintetici */}
              <div className="pt-2 mt-1 border-t border-border space-y-1">
                <p className="text-[10px] text-foreground/50 flex justify-between">
                  <span>{locale === "it" ? "Immobili mappati" : "Mapped listings"}</span>
                  <span className="font-semibold text-gray-100">{markers.length}</span>
                </p>
                <p className="text-[10px] text-foreground/50 flex justify-between">
                  <span>{locale === "it" ? "Top Deals" : "Top deals"}</span>
                  <span className="font-semibold text-emerald-400">
                    {markers.filter(m => m.marketGap && m.marketGap > 15).length}
                  </span>
                </p>
                <p className="text-[10px] text-foreground/50 flex justify-between">
                  <span>{locale === "it" ? "Alta urgenza" : "High urgency"}</span>
                  <span className="font-semibold text-red-400">
                    {markers.filter(m => m.urgencyScore >= 70).length}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Markers */}
          {markers.map((marker) => {
            const isTopDeal = marker.marketGap && marker.marketGap > 15;
            const isHighUrgency = marker.urgencyScore >= 70;
            
            let markerColor = 'bg-gray-500';
            if (isTopDeal) markerColor = 'bg-green-500';
            else if (isHighUrgency) markerColor = 'bg-red-500';
            else if (marker.urgencyScore >= 30) markerColor = 'bg-yellow-500';

            // Calcola posizione percentuale (mock - in produzione usare coordinate reali)
            const leftPercent = 30 + (marker.lng % 40);
            const topPercent = 30 + (marker.lat % 40);

            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                }}
              >
                <div className={`w-6 h-6 rounded-full ${markerColor} border-2 border-white shadow-lg transition-all hover:scale-125 ${selectedMarker?.id === marker.id ? 'ring-4 ring-cyan-400' : ''}`}>
                  {isHighUrgency && (
                    <Zap className="h-3 w-3 text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-card border border-border rounded-lg p-2 text-xs whitespace-nowrap shadow-xl">
                    <p className="font-semibold text-foreground">{marker.listing.title}</p>
                    <p className="text-gray-400">{formatPrice(marker.listing.price)}</p>
                    {isTopDeal && (
                      <Badge className="bg-green-500 text-foreground text-xs mt-1">TOP DEAL</Badge>
                    )}
                    {isHighUrgency && (
                      <Badge className="bg-red-500 text-foreground text-xs mt-1">HIGH URGENCY</Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-20">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            </div>
          )}

          {!loading && markers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nessun immobile trovato</p>
                <p className="text-gray-500 text-sm mt-2">
                  {showGhostListings 
                    ? 'Nessun Ghost Listing disponibile'
                    : 'Attiva il filtro Ghost Listings per vedere più opzioni'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Azione Rapida */}
        {selectedMarker && (
          <div className="absolute top-20 right-0 w-96 h-[calc(100vh-5rem)] bg-card/95 backdrop-blur-xl border-l border-border z-40 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header Sidebar */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">{selectedMarker.listing.title}</h2>
                  <p className="text-sm text-gray-400">{selectedMarker.listing.location}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMarker(null)}
                  className="text-gray-400 hover:text-foreground"
                  aria-label={locale === "it" ? "Chiudi dettaglio" : "Close detail"}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Urgency Score */}
              <Card className="bg-[#111111] border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-400" />
                    Urgency Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {selectedMarker.urgencyScore}/100
                  </div>
                  <Badge className={`${
                    selectedMarker.urgencyLevel === 'critical' ? 'bg-red-500' :
                    selectedMarker.urgencyLevel === 'high' ? 'bg-orange-500' :
                    selectedMarker.urgencyLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  } text-foreground`}>
                    {selectedMarker.urgencyLevel.toUpperCase()}
                  </Badge>
                  {selectedMarker.daysOnMarket > 90 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Ghost Listing: {selectedMarker.daysOnMarket} giorni sul mercato</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Market Gap */}
              {selectedMarker.marketGap && selectedMarker.marketGap > 0 && (
                <Card className="bg-[#111111] border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-400" />
                      GAP DI MERCATO
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      -{selectedMarker.marketGap.toFixed(0)}%
                    </div>
                    <p className="text-xs text-gray-400 mt-1">vs Media Zona</p>
                  </CardContent>
                </Card>
              )}

              {/* Prezzo */}
              <Card className="bg-[#111111] border-border">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-foreground">
                    {formatPrice(selectedMarker.listing.price)}
                  </div>
                </CardContent>
              </Card>

              {/* Mini Anteprima 3D */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Anteprima 3D
                </h3>
                <AIVirtualStaging listing={selectedMarker.listing} />
              </div>

              {/* Azioni Rapide */}
              <div className="border-t border-border pt-6 space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Azioni Rapide
                </h3>
                
                <Button
                  onClick={() => handleCall(selectedMarker.listing.id)}
                  disabled={callingListingId === selectedMarker.listing.id || !selectedMarker.listing.phone_number}
                  className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold"
                >
                  {callingListingId === selectedMarker.listing.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Chiamata in corso...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      {t.mapLanciaChiamata}
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowWhatsAppModal(true)}
                  disabled={!selectedMarker.listing.phone_number}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-foreground"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invia WhatsApp Progetto
                </Button>
              </div>

              {/* Link Annuncio */}
              <div className="border-t border-border pt-4">
                <a
                  href={selectedMarker.listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                >
                  Vedi annuncio originale →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {selectedMarker && (
        <WhatsAppSenderModal
          open={showWhatsAppModal}
          onOpenChange={setShowWhatsAppModal}
          listing={selectedMarker.listing}
        />
      )}
    </div>
  );
}

