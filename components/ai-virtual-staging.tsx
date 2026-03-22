"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Send, Image as ImageIcon, Layers } from "lucide-react";
import { WhatsAppSenderModal } from "./whatsapp-sender-modal";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";

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
  const { locale } = useLocale();
  const vs = useMemo(() => getTranslation(locale).virtualStaging, [locale]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await fetch("/api/prospecting/virtual-staging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          generated: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          toast({
            title: vs.premiumRequiredTitle,
            description: data.message || data.error || vs.premiumRequiredDesc,
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      toast({
        title: vs.calibrationTitle,
        description: vs.calibrationDesc,
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
              <Sparkles className="h-5 w-5 text-purple-400" aria-hidden />
              <CardTitle className="text-lg">{vs.cardTitle}</CardTitle>
            </div>
            {hasGenerated && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWhatsAppModal(true)}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Send className="h-4 w-4 mr-2" />
                {vs.sendWhatsApp}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-purple-500/30 bg-[#0a0a0a]">
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" aria-hidden />
                  <p className="text-sm">{vs.originalPhoto}</p>
                </div>
              </div>
            </div>

            {hasGenerated ? (
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900/80 via-cyan-900/80 to-purple-900/80 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80')] bg-cover bg-center opacity-80" />
                  <div className="relative z-10 text-center text-white">
                    <Layers className="h-12 w-12 mx-auto mb-2 text-cyan-400" aria-hidden />
                    <p className="text-sm font-semibold">{vs.afterVisionTitle}</p>
                    <p className="text-xs text-gray-300 mt-1">{vs.afterVisionSubtitle}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-gray-400 text-sm">{vs.generatePrompt}</p>
              </div>
            )}

            {hasGenerated && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-lg shadow-cyan-400/50 z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 bg-cyan-400 rounded-full border-4 border-[#0a0a0a] shadow-xl cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#0a0a0a] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasGenerated && (
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-30"
                style={{ WebkitAppearance: "none", appearance: "none" }}
                aria-label="Before and after comparison"
              />
            )}
          </div>

          {hasGenerated && (
            <div className="flex justify-between text-xs text-gray-400">
              <span>{vs.originalPhoto}</span>
              <span>{vs.afterVisionTitle}</span>
            </div>
          )}

          {!hasGenerated && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {vs.generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {vs.generateCta}
                </>
              )}
            </Button>
          )}

          {hasGenerated && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-sm text-cyan-400">{vs.successBanner}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <WhatsAppSenderModal open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal} listing={listing} />
    </div>
  );
}
