"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, AlertTriangle, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ExpiredListing {
  id: string;
  title: string;
  location: string;
  price: number | null;
  source_url: string;
  days_offline: number;
  ai_note: string;
  status: "removed" | "stale";
}

export function CompetitorRadar() {
  const [listings, setListings] = useState<ExpiredListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiredListings();
  }, []);

  const fetchExpiredListings = async () => {
    try {
      const response = await fetch("/api/prospecting/expired-listings");
      const data = await response.json();

      if (data.success) {
        setListings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching expired listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
              <History className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Radar Scadenze</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Immobili offline o fermi da 120+ giorni
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchExpiredListings}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {listings.slice(0, 5).map((listing) => (
          <div
            key={listing.id}
            className="p-3 bg-background/50 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{listing.title}</span>
                  <Badge
                    variant="outline"
                    className={`${
                      listing.status === "removed"
                        ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-700 dark:text-red-400"
                        : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {listing.status === "removed" ? (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Rimosso
                      </>
                    ) : (
                      <>
                        <History className="h-3 w-3 mr-1" />
                        Fermo
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{listing.location}</div>
                <div className="text-sm font-medium">{formatPrice(listing.price)}</div>
                <div className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded p-2">
                  <strong>AI Note:</strong> {listing.ai_note}
                </div>
                <div className="text-xs text-muted-foreground">
                  Offline da {listing.days_offline} giorni
                </div>
              </div>
              <Link href={`/dashboard/prospecting?listing=${listing.id}`}>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {listings.length > 5 && (
          <div className="text-center pt-2">
            <Link href="/dashboard/prospecting?filter=expired">
              <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">
                Vedi tutti ({listings.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

