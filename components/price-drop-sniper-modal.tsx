"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown, Copy, Check, Phone } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { toIntlLocale } from "@/lib/i18n/intl";
import type { Locale } from "@/lib/i18n/config";

interface PriceDropSniperModalProps {
  listing: {
    id: string;
    title: string;
    location: string;
    price: number | null;
    price_history?: Array<{ date: string; price: number }>;
    price_drop_percentage?: number;
    owner_name?: string | null;
    phone_number?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCall?: () => void;
}

export function PriceDropSniperModal({
  listing,
  open,
  onOpenChange,
  onCall,
}: PriceDropSniperModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { locale } = useLocale();
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).prospectingModals.priceDropSniper,
    [locale]
  );

  const intlLocale = toIntlLocale(locale as Locale);

  const formatPrice = useCallback(
    (price: number | null) => {
      if (!price) return "N/A";
      return new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },
    [intlLocale]
  );

  const ownerName = listing.owner_name?.trim() || t.ownerFallback;
  const sniperScript = useMemo(() => {
    return t.scriptTemplate
      .replace(/\{owner\}/g, ownerName)
      .replace(/\{location\}/g, listing.location)
      .replace(/\{price\}/g, formatPrice(listing.price));
  }, [t.scriptTemplate, ownerName, listing.location, listing.price, formatPrice]);

  const chartData =
    listing.price_history && listing.price_history.length > 0
      ? listing.price_history.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString(intlLocale, {
            day: "2-digit",
            month: "short",
          }),
          price: entry.price,
        }))
      : [
          { date: t.chartLabel30dAgo, price: listing.price ? listing.price * 1.1 : 0 },
          { date: t.chartLabel15dAgo, price: listing.price ? listing.price * 1.05 : 0 },
          { date: t.chartLabelToday, price: listing.price || 0 },
        ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sniperScript);
      setCopied(true);
      toast({
        title: t.toastCopyTitle,
        description: t.toastCopyDesc,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t.toastErrorTitle,
        description: t.toastErrorDesc,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#0a0a0a] border-red-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-red-400" aria-hidden />
            {t.dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">{t.dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Card className="bg-[#111111] border-red-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">{t.locationLabel}</p>
                <p className="text-white font-medium">{listing.location}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-400">{t.currentPrice}</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(listing.price)}</p>
                </div>
                {listing.price_drop_percentage && (
                  <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                    <TrendingDown className="h-4 w-4 mr-1" aria-hidden />
                    -{listing.price_drop_percentage.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-red-500/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {t.priceVariation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-cyan-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {t.callScriptTitle}
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 text-xs">
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-green-400" aria-hidden />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" aria-hidden />
                      {t.copy}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-cyan-500/20">
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{sniperScript}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              {t.close}
            </Button>
            {listing.phone_number && onCall && (
              <Button
                onClick={() => {
                  onCall();
                  onOpenChange(false);
                }}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                <Phone className="h-4 w-4 mr-2" aria-hidden />
                {t.launchCall}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
