"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ProFeaturePaywall } from "@/components/demo-modal";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { toIntlLocale } from "@/lib/i18n/intl";
import { useAPIErrorHandler } from "@/components/error-boundary";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { fetchApi } from "@/lib/api/client";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import {
  apiFailureToast,
  networkFailureToast,
  premiumFeatureToast,
} from "@/lib/i18n/api-feature-feedback";
import { 
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

const QUICK_ICON_BY_KEY = {
  file: FileText,
  mail: Mail,
  message: MessageSquare,
  lightbulb: Lightbulb,
  video: Video,
  hash: Hash,
} as const;

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
  const { locale } = useLocaleContext();
  const feedbackLocale = locale;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentContext, setCurrentContext] = useState<string>("general");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'agency'>('free');
  const { plan: usagePlan, isLoading: usagePlanLoading } = useUsageLimits();
  const { handleAPIError } = useAPIErrorHandler();

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.agencyAssistantPage,
    [locale]
  );

  const premiumRequiredRef = useRef(t.premiumRequired);
  const responseErrorRef = useRef(t.responseError);
  premiumRequiredRef.current = t.premiumRequired;
  responseErrorRef.current = t.responseError;

  const localizedQuickSuggestions = useMemo(
    () =>
      t.quickSuggestions.map((s) => ({
        context: s.context,
        text: s.text,
        icon: QUICK_ICON_BY_KEY[s.iconKey],
      })),
    [t]
  );

  useEffect(() => {
    if (usagePlanLoading) return;
    const p = (usagePlan || "free").toLowerCase();
    if (p === "starter" || p === "pro" || p === "agency") {
      setUserPlan(p);
    } else {
      setUserPlan("free");
    }
  }, [usagePlan, usagePlanLoading]);

  const planBadgeLabel =
    userPlan === "agency"
      ? t.planAgency
      : userPlan === "pro"
        ? t.planPro
        : userPlan === "starter"
          ? t.planStarter
          : t.planFree;

  // Agency Assistant AI is only for PRO and AGENCY plans
  const isLocked = userPlan === "free" || userPlan === "starter";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async ({
      userMessage,
      context,
    }: {
      userMessage: string;
      context: string;
    }): Promise<ChatResponse> => {
      const historyMessages = messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      historyMessages.push({ role: "user", content: userMessage });

      const res = await fetchApi<ChatResponse>("/api/agency-chatbot", {
        method: "POST",
        body: JSON.stringify({
          messages: historyMessages,
          context,
        }),
      });

      if (!res.success) {
        if (res.status === 403) {
          setUserPlan("free");
        }
        const err = new Error(
          res.message || res.error || responseErrorRef.current
        ) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }

      const data = res.data;
      if (!data?.message) {
        const e = new Error(responseErrorRef.current) as Error & { status?: number };
        e.status = 500;
        throw e;
      }
      return data;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        suggestedFeature: data.suggestedFeature,
        suggestedAction: data.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error: Error & { status?: number }) => {
      const st = error.status;
      if (st === 403) {
        toast({
          variant: "destructive",
          ...premiumFeatureToast(
            feedbackLocale,
            "agencyAssistantChat",
            error.message || premiumRequiredRef.current
          ),
        });
        return;
      }
      if (st !== undefined) {
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "agencyAssistantChat",
            { status: st, message: error.message },
            handleAPIError(error, responseErrorRef.current)
          ),
        });
        return;
      }
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "agencyAssistantChat"),
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

  if (usagePlanLoading) {
    return (
      <DashboardPageShell className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" aria-hidden />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell className="flex flex-col">
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 shadow-glow-purple">
              <Bot className="h-6 w-6 text-white" aria-hidden />
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </span>
        }
        titleDataTestId="heading-agency-assistant"
        subtitle={t.subtitle}
        planBadge={
          !usagePlanLoading
            ? { label: planBadgeLabel, variant: "secondary" }
            : undefined
        }
        contextualHelp={<ContextualHelpTrigger docSlug="smart-briefing/client-ready" />}
        actions={
          <div className="flex flex-wrap items-center gap-2 min-h-11">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
              <Bot className="h-4 w-4 shrink-0" aria-hidden />
              {t.aiActive}
            </span>
            <Link href="/dashboard" aria-label={t.backAria}>
              <Button
                variant="outline"
                size="sm"
                className="min-h-11 touch-manipulation border-white/20 bg-white/5 text-white hover:bg-white/10"
                data-testid="button-back-dashboard"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backLink}
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <ProFeaturePaywall
          title={t.title}
          description={t.paywallDescription}
          isLocked={isLocked}
        >
        <div className="mb-6 animate-fade-in-up">
          <div className="futuristic-card p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-purple-500/5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow-purple flex-shrink-0">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  {t.introTitle}
                </h2>
                <p className="text-muted-foreground">
                  {t.introBody}
                </p>
              </div>
            </div>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="mb-6 animate-fade-in-up delay-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              {t.quickStart}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {localizedQuickSuggestions.map((suggestion, index) => (
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
              <span className="font-semibold">{t.conversation}</span>
              {messages.length > 0 && (
                <span className="text-xs text-muted-foreground">({messages.length} {t.messages})</span>
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
                {t.newChat}
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t.emptyState}</p>
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
                        {message.timestamp.toLocaleTimeString(
                          toIntlLocale(locale as Locale),
                          { hour: '2-digit', minute: '2-digit' }
                        )}
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
                        <span className="text-sm text-muted-foreground">{t.thinking}</span>
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
                placeholder={t.placeholder}
                disabled={chatMutation.isPending}
                className="flex-1 h-12 text-base border-2 border-silver-frost/30 focus:border-violet-500"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || chatMutation.isPending}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 hover:opacity-90 transition-all"
                data-testid="button-send-message"
                aria-label={t.sendAria}
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p id="chat-input-hint" className="text-xs text-muted-foreground mt-2 text-center">
              {t.inputHint}
            </p>
          </div>
        </div>
        </ProFeaturePaywall>
      </div>
    </DashboardPageShell>
  );
}
