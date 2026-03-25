"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { ContextualHelpTrigger } from "@/components/contextual-help-trigger";
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
} from "@/lib/i18n/api-feature-feedback";

export default function ReferralPage() {
  const { locale, currency } = useLocaleContext();
  const { toast } = useToast();
  const feedbackLocale = locale;
  const billingT = useMemo(
    () => getTranslation(locale as SupportedLocale).billing,
    [locale]
  );
  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.referralPage,
    [locale]
  );
  const loadErrorRef = useRef(t.loadError);
  const clipboardErrRef = useRef(t.clipboardCopyError);
  loadErrorRef.current = t.loadError;
  clipboardErrRef.current = t.clipboardCopyError;
  const { plan, isLoading: planLoading } = useUsageLimits();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLinkFromApi, setReferralLinkFromApi] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    friendsInvited: 0,
    discountsEarned: 0,
    potentialEarnings: 0,
  });
  const planBadgeLabel =
    plan === "agency"
      ? t.planAgency
      : plan === "pro"
        ? t.planPro
        : plan === "starter"
          ? t.planStarter
          : t.planFree;

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
            loadErrorRef.current
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
  }, [feedbackLocale, toast]);

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
          clipboardErrRef.current
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
          !planLoading ? { label: planBadgeLabel, variant: "secondary" } : undefined
        }
        contextualHelp={<ContextualHelpTrigger docSlug="commercial/business-features" />}
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
                aria-label={copied ? t.copiedAria : t.copyLinkAria}
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

