'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Scale, TrendingUp, TrendingDown, Target,
  BarChart3, Clock, Users, Sparkles,
  ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NegotiationAnalysis {
  suggestedCounter: number;
  reasoning: string[];
  acceptProbability: number;
  marketPosition: 'above' | 'at' | 'below';
  daysOnMarket: number;
  comparableAvg: number;
  recommendation: 'accept' | 'counter' | 'reject';
}

export function NegotiationAdvisor() {
  const { locale } = useLocale();
  const [askingPrice, setAskingPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [daysOnMarket, setDaysOnMarket] = useState('30');
  const [analysis, setAnalysis] = useState<NegotiationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const isIT = locale === 'it';

  const fmt = (n: number) => new Intl.NumberFormat(isIT ? 'it-IT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const analyzeOffer = async () => {
    const asking = parseInt(askingPrice);
    const offer = parseInt(offerPrice);
    const days = parseInt(daysOnMarket);
    if (!asking || !offer) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const diff = ((asking - offer) / asking) * 100;
    const marketAvg = asking * 0.95;
    const urgencyFactor = Math.min(days / 90, 1);

    let recommendation: 'accept' | 'counter' | 'reject';
    let suggestedCounter: number;
    let acceptProbability: number;

    if (diff <= 3) {
      recommendation = 'accept';
      suggestedCounter = offer;
      acceptProbability = 92;
    } else if (diff <= 10) {
      recommendation = 'counter';
      suggestedCounter = Math.round(asking - (asking - offer) * 0.4 * (1 + urgencyFactor * 0.3));
      acceptProbability = 65 + Math.round(urgencyFactor * 15);
    } else {
      recommendation = diff > 20 ? 'reject' : 'counter';
      suggestedCounter = Math.round(asking * 0.93);
      acceptProbability = 30 + Math.round(urgencyFactor * 20);
    }

    setAnalysis({
      suggestedCounter,
      reasoning: [
        isIT ? `L'offerta è ${diff.toFixed(1)}% sotto il prezzo richiesto` : `Offer is ${diff.toFixed(1)}% below asking price`,
        isIT ? `L'immobile è sul mercato da ${days} giorni` : `Property has been on market for ${days} days`,
        days > 60 ? (isIT ? 'Alto tempo sul mercato — il venditore potrebbe essere più flessibile' : 'High days on market — seller may be more flexible') : (isIT ? 'Tempo sul mercato nella media' : 'Average time on market'),
        isIT ? `Media comparabili nella zona: ${fmt(marketAvg)}` : `Comparable average in area: ${fmt(marketAvg)}`,
      ],
      acceptProbability,
      marketPosition: offer > marketAvg ? 'above' : offer < marketAvg * 0.95 ? 'below' : 'at',
      daysOnMarket: days,
      comparableAvg: marketAvg,
      recommendation,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            {isIT ? 'Analisi Negoziazione AI' : 'AI Negotiation Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{isIT ? 'Prezzo richiesto' : 'Asking price'}</Label>
              <Input type="number" value={askingPrice} onChange={e => setAskingPrice(e.target.value)} placeholder="350000" />
            </div>
            <div className="space-y-2">
              <Label>{isIT ? 'Offerta ricevuta' : 'Offer received'}</Label>
              <Input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="320000" />
            </div>
            <div className="space-y-2">
              <Label>{isIT ? 'Giorni sul mercato' : 'Days on market'}</Label>
              <Input type="number" value={daysOnMarket} onChange={e => setDaysOnMarket(e.target.value)} placeholder="30" />
            </div>
          </div>
          <Button onClick={analyzeOffer} disabled={loading || !askingPrice || !offerPrice} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? (isIT ? 'Analisi in corso...' : 'Analyzing...') : (isIT ? 'Analizza Offerta' : 'Analyze Offer')}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis */}
      {analysis && (
        <div className="space-y-4">
          {/* Recommendation */}
          <Card className={`border-${analysis.recommendation === 'accept' ? 'emerald' : analysis.recommendation === 'counter' ? 'yellow' : 'red'}-500/30`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {analysis.recommendation === 'accept' ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : analysis.recommendation === 'counter' ? <Target className="h-8 w-8 text-yellow-500" /> : <AlertCircle className="h-8 w-8 text-red-500" />}
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {analysis.recommendation === 'accept' ? (isIT ? 'Accetta l\'offerta' : 'Accept the offer') : analysis.recommendation === 'counter' ? (isIT ? 'Fai una controproposta' : 'Make a counter-offer') : (isIT ? 'Rifiuta l\'offerta' : 'Reject the offer')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isIT ? `Probabilità di accettazione: ${analysis.acceptProbability}%` : `Acceptance probability: ${analysis.acceptProbability}%`}
                  </p>
                </div>
              </div>
              {analysis.recommendation === 'counter' && (
                <div className="bg-background rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">{isIT ? 'Controproposta suggerita' : 'Suggested counter-offer'}</p>
                  <p className="text-3xl font-bold text-foreground">{fmt(analysis.suggestedCounter)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reasoning */}
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-foreground mb-3">{isIT ? 'Ragionamento AI' : 'AI Reasoning'}</h4>
              <ul className="space-y-2">
                {analysis.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{isIT ? 'Posizione mercato' : 'Market position'}</p>
              <Badge variant={analysis.marketPosition === 'above' ? 'default' : 'secondary'} className="mt-1">
                {analysis.marketPosition === 'above' ? (isIT ? 'Sopra media' : 'Above avg') : analysis.marketPosition === 'at' ? (isIT ? 'In media' : 'At avg') : (isIT ? 'Sotto media' : 'Below avg')}
              </Badge>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{isIT ? 'Media comparabili' : 'Comparable avg'}</p>
              <p className="font-semibold text-foreground mt-1">{fmt(analysis.comparableAvg)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{isIT ? 'Probabilità' : 'Probability'}</p>
              <p className="font-semibold text-foreground mt-1">{analysis.acceptProbability}%</p>
            </CardContent></Card>
          </div>
        </div>
      )}
    </div>
  );
}
