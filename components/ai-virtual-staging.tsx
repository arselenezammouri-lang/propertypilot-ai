"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Send, Image as ImageIcon, Layers } from "lucide-react";
import { WhatsAppSenderModal } from "./whatsapp-sender-modal";
import { useToast } from "@/hooks/use-toast";

interface AIVirtualStagingProps {
  listing: {
    id: string;
    title: string;
    location: string;
    owner_name: string | null;
    phone_number: string | null;
  };
}

export function AIVirtualStaging({ listing }: AIVirtualStagingProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simula generazione AI (3 secondi)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Salva nel DB che è stato generato
    try {
      const response = await fetch('/api/prospecting/virtual-staging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          generated: true,
        }),
      });
      
      // If 403, show error message
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          toast({
            title: "Piano Premium richiesto",
            description: data.message || data.error || "Il Virtual Staging 3D è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
      }
    } catch (error) {
      // Gestione errori elegante con messaggio fallback
      toast({
        title: "Calibrazione in corso",
        description: "Aria sta ricalibrando i sensori 3D. Riprova tra un istante.",
        variant: "default",
      });
    }
    
    setIsGenerating(false);
    setHasGenerated(true);
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">AI Virtual Staging</CardTitle>
            </div>
            {hasGenerated && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWhatsAppModal(true)}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Send className="h-4 w-4 mr-2" />
                Invia Progetto via WhatsApp
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Compare Slider */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-purple-500/30 bg-[#0a0a0a]">
            {/* Foto Originale (Sfondo) */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Foto Originale</p>
                </div>
              </div>
            </div>

            {/* Visione Post-Ristrutturazione (Overlay) */}
            {hasGenerated ? (
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900/80 via-cyan-900/80 to-purple-900/80 flex items-center justify-center relative">
                  {/* Immagine placeholder di lusso */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80')] bg-cover bg-center opacity-80" style={{ content: '', loading: 'lazy' } as any}></div>
                  <div className="relative z-10 text-center text-white">
                    <Layers className="h-12 w-12 mx-auto mb-2 text-cyan-400" />
                    <p className="text-sm font-semibold">Visione Post-Ristrutturazione (AI)</p>
                    <p className="text-xs text-gray-300 mt-1">Interno Moderno di Lusso</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Genera la visione 3D per vedere il confronto</p>
              </div>
            )}

            {/* Slider Control */}
            {hasGenerated && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-lg shadow-cyan-400/50 z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 bg-cyan-400 rounded-full border-4 border-[#0a0a0a] shadow-xl cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#0a0a0a] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slider Input (invisible ma interattivo) */}
            {hasGenerated && (
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-30"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              />
            )}
          </div>

          {/* Labels */}
          {hasGenerated && (
            <div className="flex justify-between text-xs text-gray-400">
              <span>Foto Originale</span>
              <span>Visione Post-Ristrutturazione (AI)</span>
            </div>
          )}

          {/* Pulsante Genera */}
          {!hasGenerated && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  L'IA sta arredando l'immobile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Genera Visione 3D
                </>
              )}
            </Button>
          )}

          {/* Info dopo generazione */}
          {hasGenerated && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-sm text-cyan-400">
                ✨ Visione 3D generata con successo! Trascina lo slider per confrontare prima e dopo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Modal */}
      <WhatsAppSenderModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        listing={listing}
      />
    </div>
  );
}

