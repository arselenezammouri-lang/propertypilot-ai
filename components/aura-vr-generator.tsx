"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Video,
  Zap,
  Globe,
  Share2,
  Smartphone,
  Loader2,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Copy,
  Send,
  MapPin,
  Navigation,
  RotateCw,
} from "lucide-react";
import { getTranslation, SupportedLocale, detectLocaleFromLocation } from "@/lib/i18n/dictionary";

interface AuraVRGeneratorProps {
  listingId?: string;
  listingTitle?: string;
  locale?: SupportedLocale;
  location?: string; // Per auto-detect locale
}

function getProcessingMessages(locale: SupportedLocale) {
  const t = getTranslation(locale).auraVR;
  
  return [
    { progress: 0, message: t.processing.analyzing, subtext: t.progress.analyzingSub },
    { progress: 15, message: t.processing.mapping, subtext: t.progress.mappingSub },
    { progress: 30, message: t.processing.rendering, subtext: t.progress.renderingSub },
    { progress: 50, message: t.processing.optimizing, subtext: t.progress.optimizingSub },
    { progress: 70, message: t.processing.preparing, subtext: t.progress.preparingSub },
    { progress: 85, message: t.processing.finalizing, subtext: t.progress.finalizingSub },
    { progress: 100, message: t.processing.complete, subtext: t.progress.completeSub },
  ];
}

export function AuraVRGenerator({ listingId, listingTitle, locale, location }: AuraVRGeneratorProps) {
  const { toast } = useToast();
  
  // Detect locale from location if not provided
  const detectedLocale = useMemo(() => {
    if (locale) return locale;
    if (location) return detectLocaleFromLocation(location);
    return 'en'; // Default
  }, [locale, location]);
  
  const t = getTranslation(detectedLocale);
  const AI_PROCESSING_MESSAGES = useMemo(() => getProcessingMessages(detectedLocale), [detectedLocale]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<{ message: string; subtext: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [vrLink, setVrLink] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'drone' | 'cinematic' | 'panorama' | null>(null);

  const handleStartScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setIsComplete(false);
    setVrLink(null);
    setCurrentMessage(AI_PROCESSING_MESSAGES[0]);

    // Simula la scansione con progress incrementale
    for (let i = 0; i < AI_PROCESSING_MESSAGES.length; i++) {
      const messageData = AI_PROCESSING_MESSAGES[i];
      
      // Trova il prossimo step
      const nextStep = AI_PROCESSING_MESSAGES[i + 1];
      const targetProgress = nextStep?.progress || 100;
      
      // Anima il progress verso il target
      const steps = 20;
      const increment = (targetProgress - messageData.progress) / steps;
      
      for (let j = 0; j < steps; j++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress((prev) => {
          const newProgress = Math.min(prev + increment, targetProgress);
          
          // Aggiorna il messaggio quando raggiungi una nuova soglia
          if (newProgress >= messageData.progress && newProgress < (nextStep?.progress || 101)) {
            setCurrentMessage({ message: messageData.message, subtext: messageData.subtext });
          }
          
          return newProgress;
        });
      }

      // Se c'è un prossimo messaggio, attendi prima di passare
      if (i < AI_PROCESSING_MESSAGES.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Genera link VR unico
    const generatedLink = `https://aura.propertypilot.ai/tour/${listingId || Date.now()}`;
    setVrLink(generatedLink);
    setIsComplete(true);
    setIsScanning(false);
    setCurrentMessage(AI_PROCESSING_MESSAGES[AI_PROCESSING_MESSAGES.length - 1]);
  };

  const handleCopyLink = async () => {
    if (!vrLink) return;

    try {
      await navigator.clipboard.writeText(vrLink);
      toast({
        title: "Link copiato!",
        description: "Il link VR è stato copiato negli appunti",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il link",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!vrLink) return;

    const message = encodeURIComponent(
      `🏠 Ciao! Ho preparato un tour VR immersivo per te:\n\n${vrLink}\n\nApri il link sul tuo smartphone per esplorare l'immobile in realtà virtuale! 🥽`
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="relative w-full">
      {/* Main Card - Glassmorphism */}
      <Card className="glass-card border-2 border-transparent bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/20 via-[#06b6d4]/20 to-[#9333ea]/20 animate-pulse opacity-50" />
        <div className="absolute inset-[1px] bg-background/95 rounded-lg" />
        
        <CardContent className="relative z-10 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-[#9333ea] animate-pulse" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea] bg-clip-text text-transparent">
                {t.auraVR.title}
              </h3>
              <Sparkles className="h-8 w-8 text-[#06b6d4] animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t.auraVR.subtitle}
            </p>
          </div>

          {/* Capture State */}
          {!isScanning && !isComplete && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#06b6d4] rounded-full blur-2xl opacity-50 animate-pulse" />
                <Button
                  onClick={handleStartScan}
                  size="lg"
                  className="relative z-10 bg-gradient-to-r from-[#9333ea] to-[#06b6d4] hover:from-[#9333ea]/90 hover:to-[#06b6d4]/90 text-white font-bold text-lg px-8 py-6 h-auto shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 animate-pulse"
                >
                  <Video className="h-6 w-6 mr-3" />
                  {t.auraVR.startScan}
                  <Zap className="h-6 w-6 ml-3" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>{t.auraVR.result.videoSource}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{t.auraVR.result.tourTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress State */}
          {isScanning && (
            <div className="space-y-6 py-8">
              {/* Progress Circle */}
              <div className="relative w-48 h-48 mx-auto">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    className="transition-all duration-300 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* AI Processing Messages */}
              {currentMessage && (
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-white">
                    {currentMessage.message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentMessage.subtext}
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-muted/20" />
              </div>
            </div>
          )}

          {/* Result State */}
          {isComplete && vrLink && (
            <div className="space-y-6 py-6">
              {/* Success Header */}
              <div className="text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-white">{t.auraVR.result.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.auraVR.result.subtitle}
                </p>
              </div>

              {/* Triple-View Selection */}
              <div className="space-y-4">
                <div className="text-center">
                  <h5 className="text-sm font-semibold text-white mb-2">Triple Perspective - Massimo Standard di Lusso</h5>
                  <p className="text-xs text-muted-foreground mb-4">
                    Scegli la modalità di visualizzazione per il tuo tour VR
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Drone Mode */}
                  <Card 
                    className={`glass-card border-2 cursor-pointer transition-all ${
                      selectedView === 'drone' 
                        ? 'border-[#06b6d4] bg-[#06b6d4]/20 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                        : 'border-white/10 hover:border-[#06b6d4]/50'
                    }`}
                    onClick={() => setSelectedView('drone')}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <MapPin className="h-8 w-8 text-[#06b6d4] mx-auto" />
                      <h6 className="font-semibold text-sm text-white">Drone Mode</h6>
                      <p className="text-xs text-muted-foreground">Vista aerea/satellite dell'area</p>
                    </CardContent>
                  </Card>

                  {/* Cinematic Walk */}
                  <Card 
                    className={`glass-card border-2 cursor-pointer transition-all ${
                      selectedView === 'cinematic' 
                        ? 'border-[#9333ea] bg-[#9333ea]/20 shadow-[0_0_20px_rgba(147,51,234,0.4)]' 
                        : 'border-white/10 hover:border-[#9333ea]/50'
                    }`}
                    onClick={() => setSelectedView('cinematic')}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <Navigation className="h-8 w-8 text-[#9333ea] mx-auto" />
                      <h6 className="font-semibold text-sm text-white">Cinematic Walk</h6>
                      <p className="text-xs text-muted-foreground">Percorso fluido tra le stanze</p>
                    </CardContent>
                  </Card>

                  {/* 360° Panorama */}
                  <Card 
                    className={`glass-card border-2 cursor-pointer transition-all ${
                      selectedView === 'panorama' 
                        ? 'border-[#06b6d4] bg-[#06b6d4]/20 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                        : 'border-white/10 hover:border-[#06b6d4]/50'
                    }`}
                    onClick={() => setSelectedView('panorama')}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <RotateCw className="h-8 w-8 text-[#06b6d4] mx-auto" />
                      <h6 className="font-semibold text-sm text-white">360° Panorama</h6>
                      <p className="text-xs text-muted-foreground">Visualizzazione immersiva totale</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Preview Card */}
              <Card className="glass-card border border-[#06b6d4]/30 bg-gradient-to-br from-[#06b6d4]/10 to-[#9333ea]/10 backdrop-blur-md">
                <CardContent className="p-6 space-y-4">
                  {/* Preview Placeholder con vista selezionata */}
                  <div className="relative aspect-video rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#06b6d4]/20 border border-[#9333ea]/30 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                    <div className="relative z-10 text-center space-y-3">
                      {selectedView === 'drone' && <MapPin className="h-16 w-16 text-[#06b6d4] mx-auto animate-pulse" />}
                      {selectedView === 'cinematic' && <Navigation className="h-16 w-16 text-[#9333ea] mx-auto animate-pulse" />}
                      {selectedView === 'panorama' && <RotateCw className="h-16 w-16 text-[#06b6d4] mx-auto animate-spin-slow" />}
                      {!selectedView && <Globe className="h-16 w-16 text-[#06b6d4] mx-auto animate-spin-slow" />}
                      <p className="text-sm font-medium text-white">
                        {selectedView === 'drone' && 'Drone Mode - Vista Aerea'}
                        {selectedView === 'cinematic' && 'Cinematic Walk - Percorso Fluido'}
                        {selectedView === 'panorama' && '360° Panorama - Immersione Totale'}
                        {!selectedView && 'Tour VR Immersivo'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {listingTitle || "Immobile"}
                      </p>
                    </div>
                  </div>

                  {/* Link Display */}
                  <div className="p-3 bg-background/50 rounded-lg border border-white/10">
                    <p className="text-xs text-muted-foreground mb-1">{t.auraVR.result.linkLabel}</p>
                    <p className="text-sm font-mono text-cyan-400 truncate">{vrLink}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="border-[#06b6d4]/50 text-[#06b6d4] hover:bg-[#06b6d4]/10 hover:border-[#06b6d4]"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t.auraVR.result.copyLink}
                    </Button>
                    <Button
                      onClick={handleShareWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white border-0"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {t.auraVR.result.shareWhatsApp}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Aria Integration Box */}
          {isComplete && (
            <Card className="glass-card border border-[#9333ea]/30 bg-gradient-to-r from-[#9333ea]/10 to-transparent backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-[#9333ea] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-white">
                      {t.auraVR.aria.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.auraVR.aria.stats} <span className="text-green-400 font-semibold">40% {detectedLocale === 'en' ? 'more visits' : detectedLocale === 'es' ? 'más de visitas' : detectedLocale === 'fr' ? 'de visites en plus' : detectedLocale === 'de' ? 'mehr Besuche' : detectedLocale === 'pt' ? 'mais visitas' : 'di visite in più'}</span>. 
                      {t.auraVR.aria.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="text-purple-400 font-semibold">Triple Perspective:</span> Drone Mode, Cinematic Walk e 360° Panorama - il massimo standard di lusso per tour VR immersivi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restart Button */}
          {isComplete && (
            <div className="text-center">
              <Button
                onClick={() => {
                  setIsComplete(false);
                  setProgress(0);
                  setVrLink(null);
                  setCurrentMessage(null);
                }}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white"
              >
                {t.auraVR.result.generateNew}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
