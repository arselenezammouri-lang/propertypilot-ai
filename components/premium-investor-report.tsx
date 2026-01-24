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
import { FileText, Download, Loader2, X } from "lucide-react";
import { useState } from "react";
import { generateSmartBriefing } from "@/lib/ai/smart-briefing";
import { useToast } from "@/hooks/use-toast";

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

export function PremiumInvestorReport({
  listing,
  marketGap,
  open,
  onOpenChange,
}: PremiumInvestorReportProps) {
  const [personalNote, setPersonalNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const briefing = generateSmartBriefing(
    listing.title,
    listing.ai_summary?.summary_note || "",
    listing.price,
    listing.location,
    undefined,
    listing.raw_data
  );

  const formatPrice = (price: number | null) => {
    if (!price) return "Prezzo da definire";
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      // Crea HTML per il report
      const reportHTML = generateReportHTML(listing, briefing, marketGap, personalNote);

      // Crea blob e scarica
      const blob = new Blob([reportHTML], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_${listing.title.replace(/[^a-z0-9]/gi, "_")}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Alternativa: usa window.print() per stampa diretta
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.focus();
        // Aspetta che il contenuto sia caricato prima di stampare
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }

      toast({
        title: "Report generato!",
        description: "Il report è stato aperto per la stampa/salvataggio PDF",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Errore",
        description: "Impossibile generare il report",
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
            <FileText className="h-6 w-6 text-purple-400" />
            Genera Premium Investor Report
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Anteprima del report che verrà generato per l'investitore
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Anteprima Report */}
          <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Anteprima Report
                </h3>
                <span className="text-xs text-purple-400">Print-Ready</span>
              </div>
              <div className="bg-white rounded p-4 space-y-3 text-black">
                {/* Header */}
                <div className="border-b-2 border-purple-500 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                        PropertyPilot AI
                      </h2>
                      <p className="text-xs text-gray-600">Premium Investor Report</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{listing.title}</p>
                      <p className="text-xs text-gray-600">{listing.location}</p>
                    </div>
                  </div>
                </div>

                {/* Contenuto */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Prezzo:</p>
                    <p className="text-lg font-bold text-purple-600">{formatPrice(listing.price)}</p>
                  </div>

                  {marketGap && marketGap > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="font-semibold text-green-700">
                        🎯 Opportunità: -{marketGap.toFixed(0)}% rispetto alla media di mercato
                      </p>
                    </div>
                  )}

                  {briefing.advantages.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">✅ Vantaggi:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {briefing.advantages.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {briefing.disadvantages.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">⚠️ Da considerare:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {briefing.disadvantages.map((dis, idx) => (
                          <li key={idx}>{dis}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {listing.ai_summary?.virtual_staging_generated && (
                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="font-semibold text-purple-700">
                        ✨ Virtual Staging 3D disponibile
                      </p>
                    </div>
                  )}

                  {personalNote && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
                      <p className="font-semibold text-cyan-700 mb-1">Nota personale:</p>
                      <p className="text-gray-700">{personalNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nota Personale */}
          <div className="space-y-2">
            <Label htmlFor="personal-note" className="text-gray-300">
              Nota personale (opzionale)
            </Label>
            <Textarea
              id="personal-note"
              placeholder="Es: 'Marco, questo è perfetto per te!'"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              className="bg-[#111111] border-purple-500/30 text-white placeholder:text-gray-500"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-800">
              Annulla
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Genera Report PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateReportHTML(
  listing: any,
  briefing: any,
  marketGap: number | null | undefined,
  personalNote: string
): string {
  const formatPrice = (price: number | null) => {
    if (!price) return "Prezzo da definire";
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Investor Report - ${listing.title}</title>
  <style>
    @media print {
      @page {
        margin: 1cm;
        size: A4;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
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
    .subtitle {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .property-title {
      text-align: right;
    }
    .property-title h1 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .property-title p {
      font-size: 14px;
      color: #6b7280;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #9333ea;
      margin-bottom: 12px;
      border-left: 4px solid #9333ea;
      padding-left: 12px;
    }
    .price {
      font-size: 32px;
      font-weight: 800;
      color: #9333ea;
      margin: 20px 0;
    }
    .highlight-box {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: 600;
      font-size: 16px;
    }
    .advantages, .disadvantages {
      margin: 20px 0;
    }
    .advantages ul, .disadvantages ul {
      list-style: none;
      padding: 0;
    }
    .advantages li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    .advantages li:before {
      content: "✅";
      position: absolute;
      left: 0;
    }
    .disadvantages li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    .disadvantages li:before {
      content: "⚠️";
      position: absolute;
      left: 0;
    }
    .note-box {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .note-box strong {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
    }
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
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">PropertyPilot AI</div>
      <div class="subtitle">Premium Investor Report</div>
    </div>
    <div class="property-title">
      <h1>${listing.title}</h1>
      <p>${listing.location}</p>
    </div>
  </div>

  <div class="section">
    <div class="price">${formatPrice(listing.price)}</div>
  </div>

  ${marketGap && marketGap > 0 ? `
    <div class="highlight-box">
      🎯 Opportunità di Arbitraggio: -${marketGap.toFixed(0)}% rispetto alla media di mercato
    </div>
  ` : ''}

  ${briefing.advantages.length > 0 ? `
    <div class="section">
      <div class="section-title">Vantaggi</div>
      <div class="advantages">
        <ul>
          ${briefing.advantages.map((adv: string) => `<li>${adv}</li>`).join('')}
        </ul>
      </div>
    </div>
  ` : ''}

  ${briefing.disadvantages.length > 0 ? `
    <div class="section">
      <div class="section-title">Da Considerare</div>
      <div class="disadvantages">
        <ul>
          ${briefing.disadvantages.map((dis: string) => `<li>${dis}</li>`).join('')}
        </ul>
      </div>
    </div>
  ` : ''}

  ${listing.ai_summary?.virtual_staging_generated ? `
    <div class="virtual-staging">
      ✨ Virtual Staging 3D disponibile - Contatta per visualizzazione
    </div>
  ` : ''}

  ${personalNote ? `
    <div class="note-box">
      <strong>Nota Personale:</strong>
      ${personalNote}
    </div>
  ` : ''}

  <div class="footer">
    <p>Report generato da PropertyPilot AI - ${new Date().toLocaleDateString('it-IT')}</p>
    <p>Per maggiori informazioni: ${listing.source_url}</p>
  </div>
</body>
</html>
  `;
}

