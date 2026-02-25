"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Mic,
  MicOff,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";
import { buildAriaPrompt, getUpgradeSuggestions } from "@/lib/ai/aria-brain";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSpeechRecognitionLocale, localeToSupportedLocale } from "@/lib/i18n/browser-locale";
import { Locale } from "@/lib/i18n/config";
import { ariaTranslations } from "@/lib/i18n/config";
import { useLocale } from "@/hooks/use-locale";

interface Message {
  id: string;
  role: "user" | "aria";
  content: string;
  timestamp: Date;
  docLink?: string;
}

interface AriaCoachProps {
  userName?: string;
  userPlan?: "free" | "starter" | "pro" | "agency";
  userLocation?: string;
}

function getEffectivePlan(realPlan: string): "free" | "starter" | "pro" | "agency" {
  if (typeof window === 'undefined') return realPlan as any;
  const previewTier = localStorage.getItem('preview_tier');
  if (previewTier && previewTier !== 'real') {
    return previewTier as "free" | "starter" | "pro" | "agency";
  }
  return realPlan as "free" | "starter" | "pro" | "agency";
}

export function AriaCoach({ userName, userPlan = "free", userLocation }: AriaCoachProps) {
  const [effectivePlan, setEffectivePlan] = useState<"free" | "starter" | "pro" | "agency">(userPlan);
  const currentLocale = useLocale();
  
  useEffect(() => {
    setEffectivePlan(getEffectivePlan(userPlan));
    
    const handleTierChange = (e: CustomEvent) => {
      const newTier = e.detail;
      if (newTier === 'real') {
        setEffectivePlan(userPlan);
      } else {
        setEffectivePlan(newTier as "free" | "starter" | "pro" | "agency");
      }
      setMessages([]);
    };
    
    window.addEventListener('tier-preview-change', handleTierChange as EventListener);
    return () => window.removeEventListener('tier-preview-change', handleTierChange as EventListener);
  }, [userPlan]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const pathname = usePathname();
  
  // Limite per piano FREE: 1 ora (3600 secondi) al giorno
  const FREE_DAILY_LIMIT_SECONDS = 3600; // 1 ora
  const [dailyUsageSeconds, setDailyUsageSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  // Carica utilizzo giornaliero all'avvio
  useEffect(() => {
    if (effectivePlan === "free" && typeof window !== "undefined") {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`aria_usage_${today}`);
      const usage = stored ? parseInt(stored, 10) : 0;
      setDailyUsageSeconds(usage);
    }
  }, [effectivePlan]);
  
  // Controlla limite giornaliero per FREE (non causa re-render)
  const checkDailyLimit = useCallback(() => {
    if (effectivePlan === "free") {
      return dailyUsageSeconds >= FREE_DAILY_LIMIT_SECONDS;
    }
    return false;
  }, [effectivePlan, dailyUsageSeconds]);
  
  // Aggiorna utilizzo giornaliero
  const updateDailyUsage = useCallback((seconds: number) => {
    if (effectivePlan === "free" && typeof window !== "undefined") {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`aria_usage_${today}`);
      const currentUsage = stored ? parseInt(stored, 10) : 0;
      const newUsage = currentUsage + seconds;
      localStorage.setItem(`aria_usage_${today}`, newUsage.toString());
      setDailyUsageSeconds(newUsage);
    }
  }, [effectivePlan]);
  
  // Inizia tracking sessione quando Aria si apre
  useEffect(() => {
    if (isOpen && effectivePlan === "free" && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    if (!isOpen && sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      updateDailyUsage(sessionDuration);
      setSessionStartTime(null);
    }
  }, [isOpen, effectivePlan, sessionStartTime, updateDailyUsage]);

  // Inizializza Speech Recognition con lingua corretta
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = getSpeechRecognitionLocale(currentLocale);

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        const translations = ariaTranslations[currentLocale];
        toast({
          title: translations?.error || "Errore",
          description: translations?.microphoneError || "Impossibile accedere al microfono. Usa la tastiera.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [toast, currentLocale]);

  // Messaggio di benvenuto strategico e d'impatto
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Calcola statistiche reali per il messaggio strategico
      const fetchTopDeals = async () => {
        try {
          const supabase = createClient();
          const { data: listings } = await supabase
            .from('external_listings')
            .select('id, price, location, lead_score, raw_data')
            .eq('status', 'new')
            .order('lead_score', { ascending: false })
            .limit(50);
          
          if (listings && listings.length > 0) {
            // Calcola market gap per ogni listing
            let topDealsCount = 0;
            listings.forEach((listing: any) => {
              if (!listing.price) return;
              const surface = listing.raw_data?.surface || 100; // Default 100mq se non disponibile
              const pricePerSqm = listing.price / surface;
              
              // Calcolo market gap semplificato (stesso algoritmo di calculateMarketGap)
              const location = listing.location?.toLowerCase() || '';
              const locationMultiplier = location.includes('centro') ? 1.25 : location.includes('periferia') ? 0.90 : 1.0;
              const baseMarketPricePerSqm = pricePerSqm * locationMultiplier;
              const marketMargin = 0.18 + (Math.random() * 0.07);
              const marketAvgPricePerSqm = baseMarketPricePerSqm * (1 + marketMargin);
              const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
              
              if (gap > 15) {
                topDealsCount++;
              }
            });
            
            return topDealsCount;
          }
        } catch (error) {
          console.error('[ARIA] Error fetching top deals:', error);
        }
        return null;
      };

      // Messaggio strategico d'impatto - Usa traduzioni i18n
      const generateStrategicMessage = async () => {
        const topDealsCount = await fetchTopDeals();
        const dealsCount =
          topDealsCount !== null ? topDealsCount : Math.floor(Math.random() * 5) + 2; // 2-6 se non disponibile

        const translations = ariaTranslations[currentLocale];
        const welcomeText = translations?.welcome || ariaTranslations["it"].welcome;

        // Alcune lingue potrebbero non avere ancora la chiave `locationHint`.
        // In quel caso usiamo un fallback sicuro per evitare ReferenceError.
        const locationHintFromTranslations =
          (translations as any)?.locationHint ?? (ariaTranslations as any)?.it?.locationHint ??
          "la tua zona di mercato";

        const t = ariaTranslations[currentLocale] || ariaTranslations['en'];
        const name = userName || (currentLocale === 'it' ? 'Capo' : currentLocale === 'es' ? 'Jefe' : currentLocale === 'fr' ? 'Chef' : currentLocale === 'de' ? 'Boss' : currentLocale === 'ar' ? 'رئيس' : 'Boss');
        let welcomeContent = (t.welcomeIntro || ariaTranslations['en'].welcomeIntro!)
          .replace('{name}', name)
          .replace('{count}', String(dealsCount));
        
        if (dealsCount > 0 && effectivePlan !== 'agency') {
          welcomeContent += t.attentionDeals || ariaTranslations['en'].attentionDeals!;
          welcomeContent += (t.agencyFeatures || ariaTranslations['en'].agencyFeatures!).replace('{count}', String(dealsCount));
        } else {
          welcomeContent += t.simpleDeals || ariaTranslations['en'].simpleDeals!;
        }
        
        if (effectivePlan === 'pro' || effectivePlan === 'agency') {
          const memberTitle = effectivePlan === 'agency' ? (t.memberAgency || t.memberPremium) : t.memberPremium;
          welcomeContent += (t.premiumWelcome || ariaTranslations['en'].premiumWelcome!).replace('{memberTitle}', memberTitle);
        }
        
        welcomeContent += t.canAlsoHelp || ariaTranslations['en'].canAlsoHelp!;
        
        if (effectivePlan === "free") {
          const remainingMinutes = Math.max(0, Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60));
          const freeLine = (t.freePlanRemaining || ariaTranslations['en'].freePlanRemaining!).replace('{minutes}', String(remainingMinutes));
          welcomeContent += `\n\n⏰ ` + freeLine;
        }
        
        const welcomeMessage: Message = {
          id: "welcome",
          role: "aria",
          content: welcomeContent,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      };
      
      generateStrategicMessage();
    }
  }, [isOpen, userName, effectivePlan, currentLocale, dailyUsageSeconds]);

  // Auto-scroll ai nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    const t = ariaTranslations[currentLocale] || ariaTranslations['en'];
    if (!recognition) {
      toast({
        title: t.micUnavailableTitle,
        description: t.micUnavailableDesc,
      });
      return;
    }

    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Controlla limite giornaliero per piano FREE
    if (effectivePlan === "free") {
      const limitReached = checkDailyLimit();
      if (limitReached) {
        const t = ariaTranslations[currentLocale] || ariaTranslations['en'];
        toast({
          title: t.limitReachedTitle,
          description: t.limitReachedDesc,
          variant: "default",
        });
        
        const upgradeMessage: Message = {
          id: Date.now().toString(),
          role: "aria",
          content: t.upgradeMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, upgradeMessage]);
        setInputValue("");
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Chiama API per generare risposta di Aria con effectivePlan (rispetta tier preview) e lingua
      const response = await fetch("/api/aria/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            locale: localeToSupportedLocale(currentLocale), // Passa la lingua all'API
            context: {
              userName,
              userPlan: effectivePlan, // Usa effectivePlan per rispettare tier preview
              currentPage: pathname,
              recentActivity: messages.slice(-3).map((m) => m.content),
              userLocation,
              locale: localeToSupportedLocale(currentLocale), // Aggiungi anche al context
            },
          }),
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta di Aria");
      }

      const data = await response.json();
      const ariaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "aria",
        content: data.response,
        timestamp: new Date(),
        docLink: data.docLink,
      };

      setMessages((prev) => [...prev, ariaMessage]);

      // Se c'è un link alla documentazione, apri automaticamente dopo 2 secondi
      if (data.docLink) {
        setTimeout(() => {
          window.open(data.docLink, '_blank');
        }, 2000);
      }

      // Se utente Free/Starter (rispettando tier preview), occasionalmente suggerisci upgrade
      if ((effectivePlan === "free" || effectivePlan === "starter") && Math.random() < 0.3) {
        const suggestions = getUpgradeSuggestions(effectivePlan, userLocation);
        if (suggestions.length > 0) {
          setTimeout(() => {
            const upgradeSuggestion: Message = {
              id: (Date.now() + 2).toString(),
              role: "aria",
              content: `💡 ${suggestions[Math.floor(Math.random() * suggestions.length)]}`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, upgradeSuggestion]);
          }, 2000);
        }
      }
    } catch (error: any) {
      const translations = ariaTranslations[currentLocale];
      toast({
        title: translations?.error || "Errore",
        description: translations?.recalibrating || "Aria sta ricalibrando le connessioni. Riprova tra qualche istante.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Nessun useEffect qui - checkDailyLimit viene chiamato solo quando necessario

  if (!isOpen) {
    const limitReached = effectivePlan === "free" ? checkDailyLimit() : false;
    const remainingMinutes = effectivePlan === "free" 
      ? Math.max(0, Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60))
      : null;
    
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative group">
          {/* Aria AI glow */}
          <button
            onClick={() => {
              if (effectivePlan === "free" && limitReached) {
                const t = ariaTranslations[currentLocale] || ariaTranslations['en'];
                toast({
                  title: t.limitReachedTitle,
                  description: t.limitReachedDesc,
                  variant: "default",
                });
                window.location.href = "/dashboard/billing";
                return;
              }
              setIsOpen(true);
            }}
            className="aria-coach-trigger"
          >
            <Sparkles className="h-6 w-6" />
            <Badge className={`absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 ${limitReached ? "bg-red-500 border-red-400" : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-purple-300"} border font-mono text-[10px]`}>
              {limitReached ? "⏰" : effectivePlan === "free" && remainingMinutes !== null ? `${remainingMinutes}m` : "✦"}
            </Badge>
          </button>
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg border border-purple-500/30 whitespace-nowrap shadow-[0_0_20px_rgba(147,51,234,0.2)]">
              Aria AI
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[400px] max-w-[calc(100vw-2rem)]">
      <Card className="border-2 border-cyan-500/40 bg-[#0a0f14]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(34,211,238,0.1)] overflow-hidden">
        {/* HUD scan-line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,211,238,0.1)_2px,rgba(34,211,238,0.1)_4px)]" />
        <CardHeader className="pb-3 border-b border-cyan-500/20 bg-[#050a0f]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded flex items-center justify-center border border-cyan-400/50 bg-cyan-500/10">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-base font-mono text-cyan-400 tracking-wider">[ ARIA HUD ]</CardTitle>
                <p className="text-[10px] font-mono text-cyan-500/80">
                  {effectivePlan === "free" ? (
                    <>
                      {dailyUsageSeconds >= FREE_DAILY_LIMIT_SECONDS ? (
                        <span className="text-red-400">{(ariaTranslations[currentLocale] || ariaTranslations['en']).limitReachedBadge}</span>
                      ) : (
                        <span className="text-yellow-400">
                          {Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60)}m {(ariaTranslations[currentLocale] || ariaTranslations['en']).remainingToday}
                        </span>
                      )}
                    </>
                  ) : effectivePlan === "agency" ? (
                    (ariaTranslations[currentLocale] || ariaTranslations['en']).commandUnlimited
                  ) : (
                    (ariaTranslations[currentLocale] || ariaTranslations['en']).commandCenter
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-cyan-500/60 mr-1 hidden sm:inline">SYS</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-7 w-7 text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10"
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#050a0f]/60 border-t border-cyan-500/10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded p-3 font-mono text-sm ${
                      message.role === "user"
                        ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-100"
                        : "bg-[#0a0f14] border border-cyan-500/20 text-cyan-100/90"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.docLink && (
                      <a
                        href={message.docLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline"
                      >
                        📖 {(ariaTranslations[currentLocale] || ariaTranslations['en']).openGuide}
                      </a>
                    )}
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString(getSpeechRecognitionLocale(currentLocale), {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#0a0f14] border border-cyan-500/30 rounded p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-cyan-500/20 bg-[#050a0f]">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  className={`h-9 w-9 ${isListening ? "bg-red-500/20 text-red-400 border-red-500/40" : "text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10"}`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                  aria-pressed={isListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={(ariaTranslations[currentLocale] || ariaTranslations['en']).inputPlaceholder}
                  className="flex-1 bg-[#0a0f14] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-600/60"
                  disabled={isLoading}
                  aria-label="Chat input with Aria AI assistant"
                  aria-describedby="aria-input-hint"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/50 hover:border-cyan-400"
                  aria-label="Send message to Aria"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-red-400 mt-2 text-center animate-pulse">
                  🎤 {(ariaTranslations[currentLocale] || ariaTranslations['en']).listening}
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

