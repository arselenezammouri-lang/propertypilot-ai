"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Construction,
  Pipette,
  Ruler,
  AlertCircle,
  Award,
  Loader2,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { ImageDefect, RenovationQuote, analyzePropertyImage, generateRenovationQuote, generateAriaInsight } from "@/lib/ai/image-analysis";
import { useToast } from "@/hooks/use-toast";

interface AIXRayVisionProps {
  imageUrl: string;
  propertyPrice: number;
  propertyType?: 'residential' | 'commercial';
  onInsightGenerated?: (insight: string) => void;
}

export function AIXRayVision({ 
  imageUrl, 
  propertyPrice,
  propertyType = 'residential',
  onInsightGenerated 
}: AIXRayVisionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [defects, setDefects] = useState<ImageDefect[]>([]);
  const [quote, setQuote] = useState<RenovationQuote | null>(null);
  const [ariaInsight, setAriaInsight] = useState<string>("");
  const [selectedDefect, setSelectedDefect] = useState<ImageDefect | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!imageUrl) {
      toast({
        title: "Errore",
        description: "Nessuna immagine disponibile",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setDefects([]);
    setQuote(null);
    setAriaInsight("");

    // Animazione scanning
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    try {
      // Analizza immagine
      const detectedDefects = await analyzePropertyImage(imageUrl, propertyType);
      setDefects(detectedDefects);

      // Genera preventivo
      const renovationQuote = generateRenovationQuote(detectedDefects);
      setQuote(renovationQuote);

      // Genera insight Aria
      const insight = generateAriaInsight(detectedDefects, renovationQuote, propertyPrice);
      setAriaInsight(insight);
      
      if (onInsightGenerated) {
        onInsightGenerated(insight);
      }

      toast({
        title: "Analisi completata",
        description: `Rilevati ${detectedDefects.length} elementi`,
      });
    } catch (error: any) {
      // Gestione errori elegante con messaggio fallback in stile Glassmorphism
      toast({
        title: "Ricalibrazione sensori",
        description: "Aria sta ricalibrando i sensori X-Ray Vision. Riprova tra un istante.",
        variant: "default",
      });
    } finally {
      clearInterval(scanInterval);
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const getMarkerColor = (defect: ImageDefect) => {
    if (defect.type === 'defect') {
      return defect.severity === 'high' 
        ? 'bg-red-500 border-red-600' 
        : defect.severity === 'medium'
        ? 'bg-orange-500 border-orange-600'
        : 'bg-yellow-500 border-yellow-600';
    }
    return 'bg-amber-400 border-amber-500';
  };

  const getMarkerIcon = (defect: ImageDefect) => {
    return defect.type === 'defect' ? AlertCircle : Award;
  };

  return (
    <div className="space-y-6">
      <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/50">
                <Pipette className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Analisi Tecnica Immagini IA</CardTitle>
                <p className="text-sm text-muted-foreground">X-Ray Vision - Rilevazione difetti e pregi</p>
              </div>
            </div>
            <Button
              onClick={handleScan}
              disabled={isScanning || !imageUrl}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scansione...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Avvia Scansione
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Image Container with Markers */}
          <div ref={containerRef} className="relative w-full bg-[#111111] rounded-lg overflow-hidden border border-cyan-500/20">
            {imageUrl && (
              <>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Property"
                  className="w-full h-auto max-h-[500px] object-contain"
                  loading="lazy"
                />
                
                {/* Scanning Line Animation */}
                {isScanning && (
                  <div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 transition-all duration-100"
                    style={{
                      top: `${scanProgress}%`,
                    }}
                  />
                )}

                {/* Markers */}
                {defects.map((defect) => (
                  <div
                    key={defect.id}
                    className={`absolute w-8 h-8 rounded-full border-2 ${getMarkerColor(defect)} cursor-pointer transition-all hover:scale-125 hover:z-10`}
                    style={{
                      left: `${defect.location.x}%`,
                      top: `${defect.location.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedDefect(defect)}
                    title={defect.description}
                  >
                    <div className="flex items-center justify-center h-full">
                      {defect.type === 'defect' ? (
                        <AlertCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Award className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1a1a1a] border border-cyan-500/30 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <p className="text-xs font-semibold text-white mb-1">{defect.category}</p>
                      <p className="text-xs text-gray-300 mb-2">{defect.description}</p>
                      {defect.type === 'defect' && defect.estimatedCost && (
                        <p className="text-xs text-red-400">
                          Costo stimato: €{defect.estimatedCost.toLocaleString('it-IT')}
                        </p>
                      )}
                      {defect.type === 'premium' && defect.valueIncrease && (
                        <p className="text-xs text-amber-400">
                          Valore aggiunto: +€{defect.valueIncrease.toLocaleString('it-IT')}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Confidenza: {defect.confidence}%
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Progress Bar */}
          {isScanning && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cyan-400 font-mono">Scansione in corso...</span>
                <span className="text-sm text-cyan-400 font-mono">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-cyan-500/20" />
            </div>
          )}

          {/* Aria Insight */}
          {ariaInsight && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-400 mb-1">Aria Insight</p>
                  <p className="text-sm text-gray-300">{ariaInsight}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Renovation Quote Sidebar */}
      {quote && (
        <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Construction className="h-5 w-5 text-cyan-400" />
              <CardTitle className="text-lg text-white">Budget Riqualificazione Consigliato</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {quote.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 bg-[#111111] border border-cyan-500/20 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          item.priority === 'high'
                            ? 'border-red-500/50 text-red-400'
                            : item.priority === 'medium'
                            ? 'border-orange-500/50 text-orange-400'
                            : 'border-yellow-500/50 text-yellow-400'
                        }`}
                      >
                        {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Bassa'}
                      </Badge>
                      <span className="text-sm font-semibold text-white">{item.category}</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">
                      €{item.cost.toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">Totale</span>
                <span className="text-2xl font-bold text-cyan-400">
                  €{quote.totalCost.toLocaleString('it-IT')}
                </span>
              </div>

              {/* ROI */}
              <div className="flex items-center gap-2 p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <TrendingUp className={`h-4 w-4 ${quote.estimatedROI > 0 ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-sm text-gray-300">ROI Stimato:</span>
                <span className={`text-sm font-bold ${quote.estimatedROI > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {quote.estimatedROI > 0 ? '+' : ''}{quote.estimatedROI.toFixed(1)}%
                </span>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-2 mt-3 p-3 bg-[#111111] border border-cyan-500/20 rounded-lg">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Tempo stimato:</span>
                <span className="text-sm font-semibold text-cyan-400">{quote.timeEstimate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

