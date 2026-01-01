"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Home, 
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  MessageSquare,
  FileText,
  Mail,
  Video,
  Hash,
  Lightbulb,
  Zap,
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedFeature?: string;
  suggestedAction?: string;
}

interface ChatResponse {
  message: string;
  suggestedFeature?: string;
  suggestedAction?: string;
  error?: string;
}

const QUICK_SUGGESTIONS = [
  { 
    icon: FileText, 
    text: "Genera un annuncio per questo immobile",
    context: "copy"
  },
  { 
    icon: Mail, 
    text: "Crea un'email di follow-up",
    context: "email"
  },
  { 
    icon: MessageSquare, 
    text: "Suggerisci post social",
    context: "social"
  },
  { 
    icon: Lightbulb, 
    text: "Come usare Perfect Copy 2.0?",
    context: "tutorial"
  },
  { 
    icon: Video, 
    text: "Consigli per video immobiliari",
    context: "social"
  },
  { 
    icon: Hash, 
    text: "Migliori hashtag per Instagram",
    context: "social"
  },
];

const FEATURE_ROUTES: Record<string, string> = {
  'perfect-copy': '/dashboard/perfect-copy',
  'refine-listing': '/dashboard/refine-listing',
  'pdf': '/dashboard/pdf',
  'agent-bio': '/dashboard/agent-bio',
  'followup': '/dashboard/followup-emails',
  'video-scripts': '/dashboard/video-scripts',
  'hashtags': '/dashboard/hashtags',
  'emotional-listing': '/dashboard/emotional-listing',
  'social-post': '/dashboard/social-posts',
  'titles': '/dashboard/titles',
  'translate': '/dashboard/translate',
  'analyze': '/dashboard/analyze',
  'auditor': '/dashboard/auditor',
  'scraper': '/dashboard/scraper',
};

export default function AgencyAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentContext, setCurrentContext] = useState<string>("general");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async ({ userMessage, context }: { userMessage: string; context: string }): Promise<ChatResponse> => {
      const historyMessages = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }));

      historyMessages.push({ role: 'user', content: userMessage });

      const response = await fetch("/api/agency-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyMessages,
          context: context,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Errore nella risposta");
      }

      return result;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        suggestedFeature: data.suggestedFeature,
        suggestedAction: data.suggestedAction,
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendMessage = (text: string, context: string) => {
    if (chatMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ userMessage: text, context });
  };

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;
    sendMessage(inputValue.trim(), currentContext);
    setInputValue("");
  };

  const handleQuickSuggestion = (text: string, context: string) => {
    if (chatMutation.isPending) return;
    setCurrentContext(context);
    sendMessage(text, context);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentContext("general");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <Bot className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Agency Assistant AI</h1>
                <p className="text-xs text-muted-foreground font-medium">Il tuo assistente immobiliare 24/7</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full border border-blue-500/30">
                <Bot className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI Attivo</span>
              </span>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-violet-500/30 hover:border-violet-500 hover:bg-violet-500/10 transition-all" data-testid="button-back-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="mb-6 animate-fade-in-up">
          <div className="futuristic-card p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-purple-500/5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow-purple flex-shrink-0">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  Ciao! Sono il tuo Assistente AI
                </h2>
                <p className="text-muted-foreground">
                  Sono specializzato in copywriting immobiliare e conosco tutte le funzionalità di PropertyPilot AI. 
                  Chiedimi aiuto per annunci, email, post social, strategie di vendita e molto altro!
                </p>
              </div>
            </div>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="mb-6 animate-fade-in-up delay-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Inizia con un suggerimento rapido
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion.text, suggestion.context)}
                  disabled={chatMutation.isPending}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-silver-frost/30 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-left group disabled:opacity-50"
                  data-testid={`button-suggestion-${index}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <suggestion.icon className="h-5 w-5 text-violet-500" />
                  </div>
                  <span className="text-sm font-medium">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 futuristic-card overflow-hidden flex flex-col min-h-[400px] animate-fade-in-up delay-150" data-testid="chat-container">
          <div className="p-4 border-b border-silver-frost/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-violet-500" />
              <span className="font-semibold">Conversazione</span>
              {messages.length > 0 && (
                <span className="text-xs text-muted-foreground">({messages.length} messaggi)</span>
              )}
            </div>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearChat}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-clear-chat"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Nuova chat
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Scrivi un messaggio per iniziare la conversazione</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.id}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-br-md'
                            : 'bg-muted/50 border border-silver-frost/30 rounded-bl-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      {message.suggestedFeature && message.suggestedAction && FEATURE_ROUTES[message.suggestedFeature] && (
                        <div className="mt-2">
                          <Link href={FEATURE_ROUTES[message.suggestedFeature]}>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 text-white"
                              data-testid={`button-suggested-${message.suggestedFeature}`}
                            >
                              {message.suggestedAction}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {chatMutation.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted/50 border border-silver-frost/30 rounded-2xl rounded-bl-md p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                        <span className="text-sm text-muted-foreground">Sto pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-silver-frost/30">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi un messaggio..."
                disabled={chatMutation.isPending}
                className="flex-1 h-12 text-base border-2 border-silver-frost/30 focus:border-violet-500"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || chatMutation.isPending}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 hover:opacity-90 transition-all"
                data-testid="button-send-message"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Premi Invio per inviare • L'assistente conosce tutte le funzionalità di PropertyPilot AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
