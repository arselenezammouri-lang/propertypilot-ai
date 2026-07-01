'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Gift, Copy, Share2, Users, TrendingUp,
  CheckCircle2, Link2, Mail, MessageSquare,
  Trophy, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ReferralsPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const isIT = locale === 'it';

  const referralLink = 'https://propertypilot-ai.vercel.app/auth/signup?ref=YOUR_CODE';

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    toast({ title: isIT ? 'Link copiato!' : 'Link copied!', description: isIT ? 'Condividilo con i tuoi colleghi.' : 'Share it with your colleagues.' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-pink-500/10">
          <Gift className="h-6 w-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Programma Referral' : 'Referral Program'}</h1>
          <p className="text-muted-foreground">{isIT ? 'Invita colleghi e ricevi 1 mese gratis per ogni referral convertito' : 'Invite colleagues and get 1 free month for every converted referral'}</p>
        </div>
      </div>

      {/* How it works */}
      <Card className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-pink-500/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">{isIT ? 'Come funziona' : 'How it works'}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Share2, title: isIT ? 'Condividi il link' : 'Share your link', desc: isIT ? 'Invia il tuo link personale a colleghi agenti immobiliari' : 'Send your personal link to fellow real estate agents' },
              { step: '2', icon: Users, title: isIT ? 'Si registrano' : 'They sign up', desc: isIT ? 'Il collega si registra e attiva un piano a pagamento' : 'Your colleague signs up and activates a paid plan' },
              { step: '3', icon: Gift, title: isIT ? 'Entrambi vincete' : 'Both win', desc: isIT ? 'Tu ricevi 1 mese gratis. Anche loro 1 mese gratis.' : 'You get 1 free month. They get 1 free month too.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-500 font-bold flex items-center justify-center mx-auto mb-3">{item.step}</div>
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Referral link */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">{isIT ? 'Il tuo link referral' : 'Your referral link'}</h3>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopy}><Copy className="h-4 w-4 mr-2" />{isIT ? 'Copia' : 'Copy'}</Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2" />Email</Button>
            <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" />WhatsApp</Button>
            <Button variant="outline" size="sm"><Link2 className="h-4 w-4 mr-2" />LinkedIn</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Link cliccati' : 'Link clicks', value: '0', icon: Link2 },
          { label: isIT ? 'Registrazioni' : 'Signups', value: '0', icon: Users },
          { label: isIT ? 'Conversioni' : 'Conversions', value: '0', icon: CheckCircle2 },
          { label: isIT ? 'Mesi gratuiti' : 'Free months earned', value: '0', icon: Gift },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <Icon className="h-5 w-5 text-pink-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reward badge */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isIT ? 'Classifica Top Referrer' : 'Top Referrer Leaderboard'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isIT
              ? 'I top referrer ricevono badge speciali sul profilo agente e accesso anticipato alle nuove funzionalità.'
              : 'Top referrers receive special badges on their agent profile and early access to new features.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
