"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Gift, Copy, Users, Sparkles, Share2, Check } from "lucide-react";

export function ReferralSection() {
  const { toast } = useToast();
  const [referralData, setReferralData] = useState<{
    referralCode: string;
    referralLink: string;
    bonusCredits: number;
    totalReferrals: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentLocale(getBrowserLocale());
    }
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral');
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!referralData?.referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      toast({
        title: "Link copiato!",
        description: "Condividilo con i tuoi colleghi per guadagnare crediti AI.",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il link",
        variant: "destructive",
      });
    }
  };

  const shareOnWhatsApp = () => {
    if (!referralData?.referralLink) return;
    const messageText = referralMessages[currentLocale] || referralMessages['it'];
    const message = encodeURIComponent(
      `${messageText} ${referralData.referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!referralData?.referralLink) return;
    const url = encodeURIComponent(referralData.referralLink);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="glass border-white/10 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-white/10 rounded mb-4"></div>
          <div className="h-10 bg-white/10 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-sunset-gold/5 via-transparent to-royal-purple/5 pointer-events-none" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sunset-gold to-orange-500 shadow-lg">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg gradient-text-gold">Invita un Collega</CardTitle>
            <CardDescription className="text-silver-frost/70">
              Guadagna 10 crediti AI per ogni amico che si iscrive
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-neon-aqua" />
              <span className="text-2xl font-bold text-white">{referralData?.totalReferrals || 0}</span>
            </div>
            <p className="text-xs text-silver-frost/60">Colleghi invitati</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-sunset-gold" />
              <span className="text-2xl font-bold text-white">{referralData?.bonusCredits || 0}</span>
            </div>
            <p className="text-xs text-silver-frost/60">Crediti bonus</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-silver-frost/80">Il tuo link referral:</label>
          <div className="flex gap-2">
            <Input 
              value={referralData?.referralLink || ''} 
              readOnly 
              className="bg-white/5 border-white/10 text-sm"
            />
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-white/10"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={shareOnWhatsApp}
            className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button 
            onClick={shareOnLinkedIn}
            className="flex-1 bg-[#0A66C2] hover:bg-[#094D92] text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
        </div>

        <div className="p-3 rounded-lg bg-gradient-to-r from-sunset-gold/10 to-royal-purple/10 border border-sunset-gold/20">
          <p className="text-xs text-center text-silver-frost/80">
            <span className="font-semibold text-sunset-gold">Bonus Elite:</span> Invita 5 colleghi e ricevi 1 mese PRO gratis!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
