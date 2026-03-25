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
import { TrendingDown, Layers, TrendingUp, Download, DollarSign } from "lucide-react";
import { formatPriceByLocation } from "@/lib/utils/currency-formatter";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { useMemo } from "react";

interface InvestmentAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    title: string;
    location: string;
    price: number | null;
    marketGap?: number;
    imageUrl?: string;
    raw_data?: any;
  } | null;
}

export function InvestmentAnalysisModal({
  open,
  onOpenChange,
  listing,
}: InvestmentAnalysisModalProps) {
  const { locale } = useLocale();
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).prospectingModals.investmentAnalysis,
    [locale]
  );

  const metrics = useMemo(() => {
    if (!listing) return null;
    const purchasePrice = listing.price || 0;

    let marketGap = listing.marketGap;
    if (!marketGap && purchasePrice > 0) {
      const baseMultiplier = 1.18;
      const locationFactor = listing.location?.toLowerCase().includes("centro") ? 1.08 : 1.0;
      const marketAvgPrice = purchasePrice * baseMultiplier * locationFactor;
      marketGap = ((marketAvgPrice - purchasePrice) / marketAvgPrice) * 100;
    }

    const marketAvgPrice = marketGap
      ? purchasePrice / (1 - marketGap / 100)
      : purchasePrice * 1.22;

    const renovationBase = 0.12;
    const renovationVariance = 0.08;
    const renovationCosts = purchasePrice * (renovationBase + Math.random() * renovationVariance);

    const resaleDiscount = 0.95 + Math.random() * 0.03;
    const estimatedResalePrice = marketAvgPrice * resaleDiscount;
    const totalInvestment = purchasePrice + renovationCosts;
    const profit = estimatedResalePrice - totalInvestment;
    const roi = totalInvestment > 0 ? ((profit / totalInvestment) * 100).toFixed(1) : "0";

    return {
      purchasePrice,
      marketGap,
      renovationCosts,
      estimatedResalePrice,
      totalInvestment,
      profit,
      roi,
    };
  }, [listing]);

  const handleDownload = () => {
    if (!listing || !metrics) return;
    const formatPrice = (price: number) => formatPriceByLocation(price, listing.location);
    const content = `
${t.exportHeader}
================================

${t.exportPropertyLine} ${listing.title}
${t.exportLocationLine} ${listing.location}

${t.exportPurchase} ${formatPrice(metrics.purchasePrice)}
${t.exportRenovation} ${formatPrice(metrics.renovationCosts)}
${t.exportTotalInv} ${formatPrice(metrics.totalInvestment)}

${t.exportResale} ${formatPrice(metrics.estimatedResalePrice)}
${t.exportProfit} ${formatPrice(metrics.profit)}

${t.exportRoi} ${metrics.roi}%
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.downloadFilenamePrefix}${listing.title.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!listing || !metrics) return null;

  const formatPrice = (price: number) => formatPriceByLocation(price, listing.location);

  const imageUrl = listing.imageUrl || listing.raw_data?.images?.[0] || listing.raw_data?.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-cyan-400" aria-hidden />
            {t.dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {listing.title} - {listing.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-purple-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic listing image URL */}
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">{listing.title}</h3>
                <p className="text-white/80 text-sm">{listing.location}</p>
              </div>
            </div>
          )}

          <Card className="bg-[#111111] border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="h-4 w-4" aria-hidden />
                {t.purchasePrice}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatPrice(metrics.purchasePrice)}</div>
              {listing.marketGap && listing.marketGap > 0 && (
                <div className="mt-2 flex items-center gap-2 text-green-400">
                  <TrendingDown className="h-4 w-4" aria-hidden />
                  <span className="text-sm font-semibold">
                    {t.marketVsLine.replace("{pct}", listing.marketGap.toFixed(0))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4" aria-hidden />
                {t.renovationTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatPrice(metrics.renovationCosts)}</div>
              <div className="mt-2 text-sm text-gray-400">{t.renovationHint}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" aria-hidden />
                {t.resaleTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatPrice(metrics.estimatedResalePrice)}</div>
              <div className="mt-2 text-sm text-gray-400">{t.resaleHint}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-cyan-500/20 border-cyan-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                {t.roiTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-extrabold text-cyan-400 mb-2">{metrics.roi}%</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{t.totalInvestment}</div>
                  <div className="text-lg font-semibold text-white">
                    {formatPrice(metrics.totalInvestment)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{t.potentialProfit}</div>
                  <div className="text-lg font-semibold text-green-400">{formatPrice(metrics.profit)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-purple-400">{t.disclaimerLead}</strong> {t.disclaimer}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              {t.close}
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden />
              {t.download}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
