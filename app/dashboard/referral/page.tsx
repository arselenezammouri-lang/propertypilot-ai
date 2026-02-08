"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Gift, Share2, Users, Percent, TrendingUp, Copy, Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';

export default function ReferralPage() {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    friendsInvited: 0,
    discountsEarned: 0,
    potentialEarnings: 0,
  });

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Genera o recupera referral code
      const userCode = `PP-${user.id.slice(0, 8).toUpperCase()}`;
      setReferralCode(userCode);

      // Carica statistiche (mock per ora - in produzione: da database)
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .eq('status', 'completed');

      if (referrals) {
        setStats({
          friendsInvited: referrals.length,
          discountsEarned: referrals.length * 20, // 20% per referral
          potentialEarnings: referrals.length * 179.4, // 20% di €897
        });
      }
    } catch (error) {
      console.error('[REFERRAL] Error loading data:', error);
    }
  };

  const handleCopy = () => {
    const referralLink = `${window.location.origin}/auth/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copiato!",
      description: "Il link di referral è stato copiato negli appunti.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Ciao! Ho trovato PropertyPilot AI, la piattaforma che sta rivoluzionando il settore immobiliare. Con l'IA puoi generare annunci, trovare deal e ottenere mandati 24/7. Provala anche tu usando il mio link: ${window.location.origin}/auth/signup?ref=${referralCode}`;
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
              <h1 className="text-4xl font-bold text-white">Referral Program</h1>
              <p className="text-muted-foreground mt-1">
                Invita un'altra agenzia e ricevi uno sconto del 20% sul tuo prossimo rinnovo
              </p>
            </div>
          </div>
        </div>

        {/* Main Card - Gold Design */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-[#0a0a0a] via-amber-900/10 to-yellow-900/10 mb-8 shadow-2xl shadow-amber-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Gift className="h-6 w-6 text-amber-400" />
              Il tuo Link Unico
            </CardTitle>
            <CardDescription className="text-gray-400">
              Condividi questo link con altre agenzie. Quando si iscrivono al piano PRO o AGENCY, ricevi il 20% di sconto sul tuo prossimo rinnovo.
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
                variant="outline"
                size="icon"
                className="border-amber-500/30 hover:bg-amber-500/10"
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
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Condividi su WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-lg text-white">Amici Invitati</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stats.friendsInvited}</p>
              <p className="text-sm text-gray-400 mt-1">Agenzie registrate</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg text-white">Sconti Maturati</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-400">{stats.discountsEarned}%</p>
              <p className="text-sm text-gray-400 mt-1">Sconto totale accumulato</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg text-white">Guadagno Potenziale</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">€{stats.potentialEarnings}</p>
              <p className="text-sm text-gray-400 mt-1">Valore sconti futuri</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
          <CardHeader>
            <CardTitle className="text-xl text-white">Come Funziona</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">Condividi il tuo link</p>
                  <p className="text-sm text-gray-400">Invita altre agenzie usando il link unico o WhatsApp.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">Si iscrivono al piano PRO o AGENCY</p>
                  <p className="text-sm text-gray-400">Quando un'amica si iscrive a un piano a pagamento, il sistema la registra automaticamente.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</Badge>
                <div>
                  <p className="font-semibold text-white mb-1">Ricevi il 20% di sconto</p>
                  <p className="text-sm text-gray-400">Lo sconto viene applicato automaticamente al tuo prossimo rinnovo. Puoi accumulare più sconti!</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

