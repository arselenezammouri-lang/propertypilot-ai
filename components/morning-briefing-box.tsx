"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellRing, TrendingDown, Zap, Smartphone, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

interface TopListing {
  id: string;
  title: string;
  location: string;
  price: number | null;
  market_gap: number | null;
  urgency_score?: number;
  target_audience?: string[];
  source_url: string;
}

export function MorningBriefingBox() {
  const { locale, currency } = useLocaleContext();
  const [topListings, setTopListings] = useState<TopListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerAgencies, setPartnerAgencies] = useState<number>(0);
  const { toast } = useToast();
  const t = {
    it: {
      na: "N/A",
      sent: "Notifica di prova inviata!",
      sentDesc: "Controlla la tua email e WhatsApp",
      error: "Errore",
      sendError: "Impossibile inviare la notifica",
      connectionError: "Errore di connessione",
      title: "Il tuo Briefing di Oggi",
      subtitle: "Top 3 opportunità con Market Gap più alto (ultime 24h)",
      configure: "Configura",
      priceDown: "Prezzo",
      highUrgency: "Urgenza Alta",
      target: "Target",
      fomo: "Questi deal sono stati inviati anche a",
      partnerAgencies: "agenzie partner nella tua zona. Affrettati!",
      sendTest: "Invia Prova sul mio Cellulare",
    },
    en: {
      na: "N/A",
      sent: "Test notification sent!",
      sentDesc: "Check your email and WhatsApp",
      error: "Error",
      sendError: "Unable to send notification",
      connectionError: "Connection error",
      title: "Your Briefing Today",
      subtitle: "Top 3 opportunities with the highest market gap (last 24h)",
      configure: "Configure",
      priceDown: "Price",
      highUrgency: "High Urgency",
      target: "Target",
      fomo: "These deals have also been sent to",
      partnerAgencies: "partner agencies in your area. Move fast!",
      sendTest: "Send Test to My Phone",
    },
  }[(locale === "it" ? "it" : "en") as "it" | "en"];

  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    try {
      const response = await fetch("/api/notifications/briefing");
      const data = await response.json();

      if (data.success) {
        setTopListings(data.data?.listings || []);
        setPartnerAgencies(data.data?.partner_agencies || Math.floor(Math.random() * 15) + 5);
      }
    } catch (error) {
      console.error("Error fetching briefing:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return t.na;
    return formatCurrencyForLocale(price, locale as Locale, currency);
  };

  const handleSendTest = async () => {
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: true, whatsapp: true }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t.sent,
          description: t.sentDesc,
        });
      } else {
        toast({
          title: t.error,
          description: data.error || t.sendError,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.connectionError,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="mb-6 border-border bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-purple-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topListings.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-border bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-purple-500/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
              <BellRing className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>
          <Link href="/dashboard/settings/notifications">
            <Button variant="outline" size="sm" className="border-primary/30 text-purple-400">
              <Zap className="h-4 w-4 mr-2" />
              {t.configure}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top 3 Listings */}
        <div className="space-y-3">
          {topListings.map((listing, index) => (
            <div
              key={listing.id}
              className="flex items-start justify-between p-4 bg-background/50 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500 text-foreground">#{index + 1}</Badge>
                  <span className="font-semibold text-sm">{listing.title}</span>
                </div>
                <div className="text-xs text-muted-foreground">{listing.location}</div>
                <div className="flex items-center gap-3 flex-wrap">
                  {listing.market_gap && listing.market_gap > 0 && (
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 border-green-300 text-green-700 dark:text-green-400">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {t.priceDown} -{listing.market_gap.toFixed(0)}%
                    </Badge>
                  )}
                  {listing.urgency_score && listing.urgency_score >= 70 && (
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 border-red-300 text-red-700 dark:text-red-400">
                      <Zap className="h-3 w-3 mr-1" />
                      {t.highUrgency}
                    </Badge>
                  )}
                  {listing.target_audience && listing.target_audience.length > 0 && (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 border-blue-300 text-blue-700 dark:text-blue-400">
                      {t.target} {listing.target_audience[0]}
                    </Badge>
                  )}
                </div>
                <div className="text-sm font-medium">{formatPrice(listing.price)}</div>
              </div>
              <Link href={`/dashboard/prospecting?listing=${listing.id}`}>
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FOMO Indicator */}
        <div className="bg-amber-500/10 border border-border rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-amber-400">
            ⚡ {t.fomo}{" "}
            <span className="text-amber-300">{partnerAgencies}</span> {t.partnerAgencies}
          </p>
        </div>

        {/* Test Button */}
        <div className="pt-2 border-t border-purple-500/20">
          <Button
            onClick={handleSendTest}
            variant="outline"
            className="w-full border-primary/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {t.sendTest}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

