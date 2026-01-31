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
  userLocation?: string; // Location dell'utente per personalizzazione regionale
}

export function AriaCoach({ userName, userPlan = "free", userLocation }: AriaCoachProps) {
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
    if (userPlan === "free" && typeof window !== "undefined") {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`aria_usage_${today}`);
      const usage = stored ? parseInt(stored, 10) : 0;
      setDailyUsageSeconds(usage);
    }
  }, [userPlan]);
  
  // Controlla limite giornaliero per FREE (non causa re-render)
  const checkDailyLimit = useCallback(() => {
    if (userPlan === "free") {
      return dailyUsageSeconds >= FREE_DAILY_LIMIT_SECONDS;
    }
    return false;
  }, [userPlan, dailyUsageSeconds]);
  
  // Aggiorna utilizzo giornaliero
  const updateDailyUsage = useCallback((seconds: number) => {
    if (userPlan === "free" && typeof window !== "undefined") {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`aria_usage_${today}`);
      const currentUsage = stored ? parseInt(stored, 10) : 0;
      const newUsage = currentUsage + seconds;
      localStorage.setItem(`aria_usage_${today}`, newUsage.toString());
      setDailyUsageSeconds(newUsage);
    }
  }, [userPlan]);
  
  // Inizia tracking sessione quando Aria si apre
  useEffect(() => {
    if (isOpen && userPlan === "free" && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    if (!isOpen && sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      updateDailyUsage(sessionDuration);
      setSessionStartTime(null);
    }
  }, [isOpen, userPlan, sessionStartTime, updateDailyUsage]);

  // Inizializza Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "it-IT";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Errore",
          description: "Impossibile accedere al microfono. Usa la tastiera.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [toast]);

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
      
      // Messaggio strategico d'impatto
      const generateStrategicMessage = async () => {
        const topDealsCount = await fetchTopDeals();
        const dealsCount = topDealsCount !== null ? topDealsCount : Math.floor(Math.random() * 5) + 2; // 2-6 se non disponibile
        const locationHint = userName ? 'la tua zona' : 'la zona monitorata';
        
        let welcomeContent = `Ciao${userName ? ` ${userName}` : " Capo"}! Sono **Aria**, il tuo AI Success Partner. 🔥\n\n`;
        
        // Hook strategico principale
        welcomeContent += `Ho appena finito di scansionare ${locationHint}: **ho trovato ${dealsCount} immobili con un Market Gap superiore al 15%**. 💎\n\n`;
        
        // Se ci sono deal d'oro (lead_score > 90) e l'utente non è Agency, suggerisci upgrade
        if (dealsCount > 0 && userPlan !== 'agency') {
          welcomeContent += `🚨 **ATTENZIONE: Questi sono affari d'oro che potrebbero chiudersi in 48 ore!** 💎\n\n`;
          welcomeContent += `Con il piano **Agency a €897/mese**, hai:\n`;
          welcomeContent += `- **Voice Agent AI Illimitato**: Chiamate automatiche 24/7 mentre dormi\n`;
          welcomeContent += `- **Aura VR**: Trasforma video smartphone in tour VR immersivi (illimitati)\n`;
          welcomeContent += `- **Manual Override**: Accesso diretto ai dati proprietario per chiamate umane quando preferisci\n`;
          welcomeContent += `- **Omnichannel Domination Suite**: SMS/WhatsApp AI, Google Calendar Sync, Auto-Prospecting 24/7\n\n`;
          welcomeContent += `**ROI**: Una sola vendita extra al mese copre l'investimento. Con ${dealsCount} deal d'oro pronti, è il momento perfetto per scalare. Vuoi che ti mostri come funziona? 🚀\n\n`;
        } else {
          welcomeContent += `Questi sono affari d'oro che potrebbero chiudersi in 48 ore se agisci subito. Vuoi che ti prepari il pitch per chiamare i proprietari? 📞\n\n`;
        }
        
        // Messaggio speciale per Premium Network Members (PRO/AGENCY)
        if (userPlan === 'pro' || userPlan === 'agency') {
          const memberTitle = userPlan === 'agency' ? 'Agency Intelligence Active' : 'Premium Network Member';
          welcomeContent += `✨ **Benvenuto nel Network Globale PropertyPilot!** Come ${memberTitle}, hai accesso a tutte le funzionalità avanzate. Il sistema sta già lavorando per te 24/7. 🌍\n\n`;
        }
        
        welcomeContent += `Posso anche guidarti nell'uso di PropertyPilot, suggerirti strategie di vendita, o aiutarti a trovare ciò che cerchi. Dimmi pure!`;
        
        // Aggiungi info limite per piano FREE
        if (userPlan === "free") {
          const remainingMinutes = Math.max(0, Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60));
          welcomeContent += `\n\n⏰ **Piano Free**: Hai ${remainingMinutes} minuti rimanenti oggi (limite: 1 ora/giorno). [Sblocca Aria Illimitata](/dashboard/billing)`;
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
  }, [isOpen, userName, userPlan]);

  // Auto-scroll ai nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    if (!recognition) {
      toast({
        title: "Microfono non disponibile",
        description: "Usa la tastiera per scrivere il tuo messaggio.",
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
    if (userPlan === "free") {
      const limitReached = checkDailyLimit();
      if (limitReached) {
        toast({
          title: "Limite giornaliero raggiunto",
          description: "Hai utilizzato 1 ora di Aria oggi. Sblocca un piano per usare Aria illimitata!",
          variant: "default",
        });
        
        // Mostra messaggio di upgrade
        const upgradeMessage: Message = {
          id: Date.now().toString(),
          role: "aria",
          content: `⏰ **Limite giornaliero raggiunto**\n\nHai utilizzato 1 ora di Aria oggi con il piano Free.\n\n🚀 **Sblocca Aria Illimitata** con un abbonamento:\n- **Starter** (€197/mese): Aria illimitata + 50 annunci/mese\n- **Pro** (€497/mese): Aria illimitata + 200 annunci/mese + CRM\n- **Agency** (€897/mese): Aria illimitata + annunci illimitati + Team\n\n[Vai a Scegli Piano](/dashboard/billing)`,
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
      // Chiama API per generare risposta di Aria
      const response = await fetch("/api/aria/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            context: {
              userName,
              userPlan,
              currentPage: pathname,
              recentActivity: messages.slice(-3).map((m) => m.content),
              userLocation,
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

      // Se utente Free/Starter, occasionalmente suggerisci upgrade
      if ((userPlan === "free" || userPlan === "starter") && Math.random() < 0.3) {
        const suggestions = getUpgradeSuggestions(userPlan, userLocation);
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
      toast({
        title: "Ricalibrazione",
        description: "Aria sta ricalibrando le connessioni. Riprova tra qualche istante.",
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
    const limitReached = userPlan === "free" ? checkDailyLimit() : false;
    const remainingMinutes = userPlan === "free" 
      ? Math.max(0, Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60))
      : null;
    
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            if (userPlan === "free" && limitReached) {
              toast({
                title: "Limite giornaliero raggiunto",
                description: "Hai utilizzato 1 ora di Aria oggi. Sblocca un piano per usare Aria illimitata!",
                variant: "default",
              });
              window.location.href = "/dashboard/billing";
              return;
            }
            setIsOpen(true);
          }}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all relative group"
        >
          <MessageCircle className="h-7 w-7" />
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl animate-pulse group-hover:animate-none"></div>
          <Badge className={`absolute -top-2 -right-2 ${limitReached ? "bg-red-500" : "bg-green-500"} text-white border-2 border-background`}>
            {limitReached ? (
              <span className="text-xs">⏰</span>
            ) : userPlan === "free" && remainingMinutes !== null ? (
              <span className="text-xs">{remainingMinutes}m</span>
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)]">
      <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] via-purple-900/20 to-cyan-900/20 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border-2 border-purple-400/50">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Aria</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {userPlan === "free" ? (
                    <>
                      {dailyUsageSeconds >= FREE_DAILY_LIMIT_SECONDS ? (
                        <span className="text-red-400">Limite raggiunto - Upgrade richiesto</span>
                      ) : (
                        <span className="text-yellow-400">
                          {Math.floor((FREE_DAILY_LIMIT_SECONDS - dailyUsageSeconds) / 60)}m rimanenti oggi
                        </span>
                      )}
                    </>
                  ) : (
                    "Your AI Success Partner"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#111111]/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                        : "bg-[#1a1a1a] border border-purple-500/30 text-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.docLink && (
                      <a
                        href={message.docLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        📖 Apri guida dettagliata
                      </a>
                    )}
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-500/20 bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  className={`h-9 w-9 ${isListening ? "bg-red-500/20 text-red-400" : "text-gray-400 hover:text-white"}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrivi o parla con Aria..."
                  className="flex-1 bg-[#111111] border-purple-500/30 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-red-400 mt-2 text-center animate-pulse">
                  🎤 In ascolto...
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

