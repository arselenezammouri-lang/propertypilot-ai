"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download, Loader2, Target, AlertTriangle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { generateSmartBriefing } from "@/lib/ai/smart-briefing";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { PremiumInvestorReportUi } from "@/lib/i18n/prospecting-modals-ui";
import { formatPriceByLocation } from "@/lib/utils/currency-formatter";
import { toIntlLocale } from "@/lib/i18n/intl";
import type { Locale } from "@/lib/i18n/config";

interface PremiumInvestorReportProps {
  listing: {
    id: string;
    title: string;
    location: string;
    price: number | null;
    source_url: string;
    ai_summary: any;
    raw_data?: any;
    lead_score?: number | null;
  };
  marketGap?: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateReportHTML(
  listing: PremiumInvestorReportProps["listing"],
  briefing: ReturnType<typeof generateSmartBriefing>,
  marketGap: number | null | undefined,
  personalNote: string,
  r: PremiumInvestorReportUi,
  locale: Locale,
  formattedDate: string
): string {
  const formatPrice = (price: number | null) => {
    if (!price) return r.priceTbd;
    return formatPriceByLocation(price, listing.location);
  };

  const titleEsc = escapeHtml(listing.title);
  const locEsc = escapeHtml(listing.location);
  const noteEsc = personalNote ? escapeHtml(personalNote) : "";

  const gapBlock =
    marketGap && marketGap > 0
      ? `
    <div class="highlight-box">
      ${escapeHtml(r.htmlOpportunity.replace("{pct}", marketGap.toFixed(0)))}
    </div>
  `
      : "";

  const advBlock =
    briefing.advantages.length > 0
      ? `
    <div class="section">
      <div class="section-title">${escapeHtml(r.htmlSectionAdvantages)}</div>
      <div class="advantages">
        <ul>
          ${briefing.advantages.map((adv: string) => `<li>${escapeHtml(adv)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `
      : "";

  const disBlock =
    briefing.disadvantages.length > 0
      ? `
    <div class="section">
      <div class="section-title">${escapeHtml(r.htmlSectionConsiderations)}</div>
      <div class="disadvantages">
        <ul>
          ${briefing.disadvantages.map((dis: string) => `<li>${escapeHtml(dis)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `
      : "";

  const vsBlock = listing.ai_summary?.virtual_staging_generated
    ? `
    <div class="virtual-staging">
      ${escapeHtml(r.htmlVirtualStaging)}
    </div>
  `
    : "";

  const noteBlock = personalNote
    ? `
    <div class="note-box">
      <strong>${escapeHtml(r.htmlPersonalNoteLabel)}</strong>
      ${noteEsc}
    </div>
  `
    : "";

  const htmlLang = locale === "ar" ? "ar" : locale;

  return `
<!DOCTYPE html>
<html lang="${htmlLang}" dir="${locale === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(r.htmlTitle)} — ${titleEsc}</title>
  <style>
    @media print {
      @page { margin: 1cm; size: A4; }
      body { margin: 0; padding: 0; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      background: white;
    }
    .header {
      border-bottom: 3px solid #9333ea;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #9333ea 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .property-title { text-align: right; }
    .property-title h1 { font-size: 24px; color: #1a1a1a; margin-bottom: 4px; }
    .property-title p { font-size: 14px; color: #6b7280; }
    .section { margin-bottom: 30px; }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #9333ea;
      margin-bottom: 12px;
      border-left: 4px solid #9333ea;
      padding-left: 12px;
    }
    .price { font-size: 32px; font-weight: 800; color: #9333ea; margin: 20px 0; }
    .highlight-box {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: 600;
      font-size: 16px;
    }
    .advantages, .disadvantages { margin: 20px 0; }
    .advantages ul, .disadvantages ul { list-style: none; padding: 0; }
    .advantages li, .disadvantages li {
      padding: 8px 0 8px 28px;
      position: relative;
    }
    .advantages li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
    }
    .disadvantages li:before {
      content: "!";
      position: absolute;
      left: 0;
      color: #d97706;
      font-weight: bold;
    }
    .note-box {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .note-box strong { display: block; margin-bottom: 8px; font-size: 14px; }
    .virtual-staging {
      background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">PropertyPilot AI</div>
      <div class="subtitle">${escapeHtml(r.reportSubtitle)}</div>
    </div>
    <div class="property-title">
      <h1>${titleEsc}</h1>
      <p>${locEsc}</p>
    </div>
  </div>

  <div class="section">
    <div class="price">${escapeHtml(formatPrice(listing.price))}</div>
  </div>

  ${gapBlock}
  ${advBlock}
  ${disBlock}
  ${vsBlock}
  ${noteBlock}

  <div class="footer">
    <p>${escapeHtml(r.htmlFooterGenerated.replace("{date}", formattedDate))}</p>
    <p>${escapeHtml(r.htmlFooterMoreInfo.replace("{url}", listing.source_url))}</p>
  </div>
</body>
</html>
  `;
}

export function PremiumInvestorReport({
  listing,
  marketGap,
  open,
  onOpenChange,
}: PremiumInvestorReportProps) {
  const [personalNote, setPersonalNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { locale } = useLocale();
  const r = useMemo(
    () => getTranslation(locale as SupportedLocale).prospectingModals.premiumInvestorReport,
    [locale]
  );

  const briefing = generateSmartBriefing(
    listing.title,
    listing.ai_summary?.summary_note || "",
    listing.price,
    listing.location,
    undefined,
    listing.raw_data
  );

  const formatPrice = (price: number | null) => {
    if (!price) return r.priceTbd;
    return formatPriceByLocation(price, listing.location);
  };

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(toIntlLocale(locale as Locale), {
        dateStyle: "long",
      }).format(new Date()),
    [locale]
  );

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      const reportHTML = generateReportHTML(
        listing,
        briefing,
        marketGap,
        personalNote,
        r,
        locale as Locale,
        formattedDate
      );

      const blob = new Blob([reportHTML], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeTitle = listing.title.replace(/[^a-z0-9]/gi, "_");
      link.download = `${r.downloadFilenamePrefix}${safeTitle}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }

      toast({
        title: r.toastSuccessTitle,
        description: r.toastSuccessDesc,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: r.toastErrorTitle,
        description: r.toastErrorDesc,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" aria-hidden />
            {r.dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">{r.dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {r.previewHeading}
                </h3>
                <span className="text-xs text-purple-400">{r.printReadyBadge}</span>
              </div>
              <div className="bg-white rounded p-4 space-y-3 text-black">
                <div className="border-b-2 border-purple-500 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                        PropertyPilot AI
                      </h2>
                      <p className="text-xs text-gray-600">{r.reportSubtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{listing.title}</p>
                      <p className="text-xs text-gray-600">{listing.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">{r.priceLabel}</p>
                    <p className="text-lg font-bold text-purple-600">{formatPrice(listing.price)}</p>
                  </div>

                  {marketGap && marketGap > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="font-semibold text-green-700 flex items-center gap-2">
                        <Target className="h-4 w-4 shrink-0" aria-hidden />
                        {r.opportunityLine.replace("{pct}", marketGap.toFixed(0))}
                      </p>
                    </div>
                  )}

                  {briefing.advantages.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-600 shrink-0" aria-hidden />
                        {r.advantagesHeading}
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {briefing.advantages.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {briefing.disadvantages.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" aria-hidden />
                        {r.considerationsHeading}
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {briefing.disadvantages.map((dis, idx) => (
                          <li key={idx}>{dis}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {listing.ai_summary?.virtual_staging_generated && (
                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="font-semibold text-purple-700 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                        {r.virtualStagingAvailable}
                      </p>
                    </div>
                  )}

                  {personalNote && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
                      <p className="font-semibold text-cyan-700 mb-1">{r.personalNotePreviewLabel}</p>
                      <p className="text-gray-700">{personalNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal-note" className="text-gray-300">
              {r.personalNoteLabel}
            </Label>
            <Textarea
              id="personal-note"
              placeholder={r.personalNotePlaceholder}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              className="bg-[#111111] border-purple-500/30 text-white placeholder:text-gray-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              {r.cancel}
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                  {r.generating}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" aria-hidden />
                  {r.generatePdf}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
