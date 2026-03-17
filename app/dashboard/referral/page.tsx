"use client";

import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Gift, Share2, Users, Percent, TrendingUp, Copy, Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { formatCurrencyForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";

export default function ReferralPage() {
  const { locale, currency } = useLocaleContext();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>("");
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
      const response = await fetch('/api/referral');
      if (!response.ok) {
        throw new Error('Errore nel recupero referral');
      }
      const data = await response.json();

      setReferralCode(data.referralCode || '');
      const totalReferrals = Number(data.totalReferrals || 0);
      setStats({
        friendsInvited: totalReferrals,
        discountsEarned: totalReferrals * 20,
        potentialEarnings: totalReferrals * 179.4,
      });
    } catch (error) {
      console.error('[REFERRAL] Error loading data:', error);
      toast({
        title: isItalian ? "Errore" : "Error",
        description: isItalian ? "Impossibile caricare i dati referral." : "Unable to load referral data.",
        variant: "destructive",
      });
    }
  }, [toast, isItalian]);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const referralLink = `${window.location.origin}/auth/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: t.copied,
      description: t.copiedDesc,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const message = `${t.whatsappMessage} ${window.location.origin}/auth/signup?ref=${referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/signup?ref=${referralCode}` : '';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-500/30 flex items-center justify-center border border-amber-500/50">
              <Gift className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{t.programTitle}</h1>
              <p className="text-muted-foreground mt-1">
                {t.programSubtitle}
              </p>
            </div>
          </div>
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
                onClick={handleCopy}
                type="button"
                variant="outline"
                size="icon"
                className="border-amber-500/30 hover:bg-amber-500/10"
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
              type="button"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0"
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
      </div>
    </div>
  );
}

