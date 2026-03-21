"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Gift, Users, Percent, TrendingUp, Copy, Check, MessageCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
} from "@/lib/i18n/api-feature-feedback";

export default function ReferralPage() {
  const { locale, currency } = useLocaleContext();
  const { toast } = useToast();
  const feedbackLocale = (locale === "it" ? "it" : "en") as "it" | "en";
  const billingT = getTranslation(locale as SupportedLocale).billing;
  const { plan, isLoading: planLoading } = useUsageLimits();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLinkFromApi, setReferralLinkFromApi] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    friendsInvited: 0,
    discountsEarned: 0,
    potentialEarnings: 0,
  });
  const isItalian = locale === "it";
  const t = {
    copied: isItalian ? "Link copiato!" : "Link copied!",
    copiedDesc: isItalian ? "Il link di referral e stato copiato negli appunti." : "The referral link has been copied to your clipboard.",
    programTitle: isItalian ? "Referral Program" : "Referral Program",
    programSubtitle: isItalian
      ? "Invita un'altra agenzia e ricevi uno sconto del 20% sul tuo prossimo rinnovo"
      : "Invite another agency and receive a 20% discount on your next renewal",
    uniqueLink: isItalian ? "Il tuo Link Unico" : "Your Unique Link",
    uniqueLinkDesc: isItalian
      ? "Condividi questo link con altre agenzie. Quando si iscrivono al piano PRO o AGENCY, ricevi il 20% di sconto sul tuo prossimo rinnovo."
      : "Share this link with other agencies. When they subscribe to the PRO or AGENCY plan, you receive a 20% discount on your next renewal.",
    shareWhatsapp: isItalian ? "Condividi su WhatsApp" : "Share on WhatsApp",
    invitedFriends: isItalian ? "Amici Invitati" : "Friends Invited",
    registeredAgencies: isItalian ? "Agenzie registrate" : "Registered agencies",
    discountsEarned: isItalian ? "Sconti Maturati" : "Discounts Earned",
    totalDiscount: isItalian ? "Sconto totale accumulato" : "Total discount accumulated",
    potentialEarnings: isItalian ? "Guadagno Potenziale" : "Potential Earnings",
    futureValue: isItalian ? "Valore sconti futuri" : "Future discount value",
    howItWorks: isItalian ? "Come Funziona" : "How It Works",
    step1Title: isItalian ? "Condividi il tuo link" : "Share your link",
    step1Desc: isItalian ? "Invita altre agenzie usando il link unico o WhatsApp." : "Invite other agencies using your unique link or WhatsApp.",
    step2Title: isItalian ? "Si iscrivono al piano PRO o AGENCY" : "They subscribe to the PRO or AGENCY plan",
    step2Desc: isItalian
      ? "Quando un'amica si iscrive a un piano a pagamento, il sistema la registra automaticamente."
      : "When a referred agency subscribes to a paid plan, the system records it automatically.",
    step3Title: isItalian ? "Ricevi il 20% di sconto" : "Receive a 20% discount",
    step3Desc: isItalian
      ? "Lo sconto viene applicato automaticamente al tuo prossimo rinnovo. Puoi accumulare piu sconti!"
      : "The discount is automatically applied to your next renewal. You can accumulate multiple discounts!",
    whatsappMessage: isItalian
      ? "Ciao! Ho trovato PropertyPilot AI, la piattaforma che sta rivoluzionando il settore immobiliare. Con l'IA puoi generare annunci, trovare deal e ottenere mandati 24/7. Provala anche tu usando il mio link:"
      : "Hi! I found PropertyPilot AI, the platform helping real estate agencies generate listings, find deals, and win mandates 24/7. Try it using my link:",
  };

  const loadReferralData = useCallback(async () => {
    try {
      const res = await fetchApi<{
        referralCode?: string;
        referralLink?: string;
        totalReferrals?: number;
      }>("/api/referral");
      if (!res.success) {
        toast({
          variant: "destructive",
          ...apiFailureToast(
            feedbackLocale,
            "referralProgram",
            { status: res.status, message: res.message, error: res.error },
            isItalian ? "Impossibile caricare il referral." : "Could not load referral data."
          ),
        });
        return;
      }
      const d = res.data;
      if (d?.referralCode) setReferralCode(d.referralCode);
      if (d?.referralLink) setReferralLinkFromApi(d.referralLink);
      const n = typeof d?.totalReferrals === "number" ? d.totalReferrals : 0;
      setStats({
        friendsInvited: n,
        discountsEarned: n * 20,
        potentialEarnings: n * 179.4,
      });
    } catch {
      toast({
        variant: "destructive",
        ...networkFailureToast(feedbackLocale, "referralProgram"),
      });
    }
  }, [feedbackLocale, isItalian, toast]);

  useEffect(() => {
    void loadReferralData();
  }, [loadReferralData]);

  const referralLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (referralLinkFromApi) return referralLinkFromApi;
    if (!referralCode) return "";
    return `${window.location.origin}/auth/signup?ref=${referralCode}`;
  }, [referralCode, referralLinkFromApi]);

  const handleCopy = async () => {
    const link = referralLink;
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({
        title: t.copied,
        description: t.copiedDesc,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        ...clipboardFailureToast(
          feedbackLocale,
          "referralProgram",
          isItalian ? "Impossibile copiare il link." : "Could not copy the link."
        ),
      });
    }
  };

  const handleWhatsAppShare = () => {
    const link = referralLink || `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${referralCode}`;
    const message = `${t.whatsappMessage} ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        variant="dark"
        title={
          <span className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/50 bg-gradient-to-br from-amber-500/30 to-yellow-500/30">
              <Gift className="h-6 w-6 text-amber-400" aria-hidden />
            </span>
            <span>{t.programTitle}</span>
          </span>
        }
        titleDataTestId="heading-referral"
        subtitle={t.programSubtitle}
        planBadge={
          !planLoading ? { label: plan.toUpperCase(), variant: "secondary" } : undefined
        }
      />

      <div
        className="mb-8 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70"
        data-testid="stripe-trust-banner-referral"
      >
        <Shield className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" aria-hidden />
        <p className="leading-relaxed">{billingT.stripeTrust}</p>
      </div>

        {/* Main Card - Gold Design */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-[#0a0a0a] via-amber-900/10 to-yellow-900/10 mb-8 shadow-2xl shadow-amber-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Gift className="h-6 w-6 text-amber-400" />
              {t.uniqueLink}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t.uniqueLinkDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-[#111111] border-amber-500/30 text-white font-mono text-sm"
              />
              <Button
                onClick={() => void handleCopy()}
                variant="outline"
                size="icon"
                className="min-h-11 min-w-11 touch-manipulation border-amber-500/30 hover:bg-amber-500/10"
                aria-label={copied ? (isItalian ? "Copiato" : "Copied") : (isItalian ? "Copia link" : "Copy link")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-amber-400" />
                )}
              </Button>
            </div>

            <Button
              onClick={handleWhatsAppShare}
              className="w-full min-h-11 touch-manipulation bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t.shareWhatsapp}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-lg text-white">{t.invitedFriends}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stats.friendsInvited}</p>
              <p className="text-sm text-gray-400 mt-1">{t.registeredAgencies}</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg text-white">{t.discountsEarned}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-400">{stats.discountsEarned}%</p>
              <p className="text-sm text-gray-400 mt-1">{t.totalDiscount}</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg text-white">{t.potentialEarnings}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{formatCurrencyForLocale(stats.potentialEarnings, locale as Locale, currency)}</p>
              <p className="text-sm text-gray-400 mt-1">{t.futureValue}</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.howItWorks}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">{t.step1Title}</p>
                  <p className="text-sm text-gray-400">{t.step1Desc}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">{t.step2Title}</p>
                  <p className="text-sm text-gray-400">{t.step2Desc}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">{t.step3Title}</p>
                  <p className="text-sm text-gray-400">{t.step3Desc}</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
    </DashboardPageShell>
  );
}

