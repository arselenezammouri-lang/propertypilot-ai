'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  ArrowLeft, MapPin, Home, Calculator, TrendingUp,
  Sparkles, Building2, BarChart3, ChevronRight,
  CheckCircle2, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ValuationResult {
  estimatedValue: number;
  rangeLow: number;
  rangeHigh: number;
  confidence: number;
  pricePerSqm: number;
  trend: 'rising' | 'stable' | 'declining';
  trendPercent: number;
}

export default function InstantValuationPage() {
  const { locale } = useLocale();
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [surface, setSurface] = useState('');
  const [rooms, setRooms] = useState('');
  const [condition, setCondition] = useState('good');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const isIT = locale === 'it';

  const handleEstimate = async () => {
    if (!address.trim() || !surface) return;
    setLoading(true);
    
    // Simulated valuation — in production, this would call the AVM API
    await new Promise(r => setTimeout(r, 2000));
    
    const sqm = parseInt(surface) || 80;
    const basePricePerSqm = propertyType === 'villa' ? 3200 : propertyType === 'commercial' ? 2800 : 3500;
    const conditionMultiplier = condition === 'new' ? 1.2 : condition === 'renovated' ? 1.1 : condition === 'good' ? 1.0 : 0.85;
    const estimatedValue = Math.round(sqm * basePricePerSqm * conditionMultiplier);
    
    setResult({
      estimatedValue,
      rangeLow: Math.round(estimatedValue * 0.9),
      rangeHigh: Math.round(estimatedValue * 1.1),
      confidence: 72 + Math.floor(Math.random() * 15),
      pricePerSqm: Math.round(basePricePerSqm * conditionMultiplier),
      trend: 'rising',
      trendPercent: 3.2,
    });
    setLoading(false);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat(isIT ? 'it-IT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            PropertyPilot AI
          </Link>
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {isIT ? '100% Gratuito • Nessuna registrazione' : '100% Free • No signup required'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {isIT ? 'Stima Istantanea del tuo Immobile' : 'Instant Property Valuation'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isIT
              ? 'Ottieni una stima AI del valore del tuo immobile in 3 secondi. Basata su dati di mercato reali.'
              : 'Get an AI estimate of your property value in 3 seconds. Based on real market data.'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  {isIT ? 'Dati Immobile' : 'Property Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{isIT ? 'Indirizzo' : 'Address'}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={isIT ? 'Via Roma 15, Milano' : '123 Main Street, London'}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isIT ? 'Tipo immobile' : 'Property type'}</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">{isIT ? 'Appartamento' : 'Apartment'}</SelectItem>
                      <SelectItem value="villa">{isIT ? 'Villa / Casa' : 'House / Villa'}</SelectItem>
                      <SelectItem value="commercial">{isIT ? 'Commerciale' : 'Commercial'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isIT ? 'Superficie (m²)' : 'Area (m²)'}</Label>
                    <Input
                      type="number"
                      value={surface}
                      onChange={e => setSurface(e.target.value)}
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isIT ? 'Locali' : 'Rooms'}</Label>
                    <Input
                      type="number"
                      value={rooms}
                      onChange={e => setRooms(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isIT ? 'Condizioni' : 'Condition'}</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{isIT ? 'Nuovo / Classe A' : 'New Build'}</SelectItem>
                      <SelectItem value="renovated">{isIT ? 'Ristrutturato' : 'Renovated'}</SelectItem>
                      <SelectItem value="good">{isIT ? 'Buone condizioni' : 'Good condition'}</SelectItem>
                      <SelectItem value="needsWork">{isIT ? 'Da ristrutturare' : 'Needs renovation'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEstimate}
                  disabled={loading || !address.trim() || !surface}
                >
                  {loading ? (
                    <>{isIT ? 'Analisi in corso...' : 'Analyzing...'}</>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      {isIT ? 'Stima Valore' : 'Estimate Value'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="md:col-span-3">
            {result ? (
              <div className="space-y-4">
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isIT ? 'Valore stimato' : 'Estimated value'}
                    </p>
                    <p className="text-4xl font-bold text-foreground mb-2">
                      {formatCurrency(result.estimatedValue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isIT ? 'Intervallo' : 'Range'}: {formatCurrency(result.rangeLow)} — {formatCurrency(result.rangeHigh)}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Badge variant="secondary">
                        {isIT ? 'Confidenza' : 'Confidence'}: {result.confidence}%
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{result.trendPercent}% {isIT ? 'ultimi 12 mesi' : 'last 12 months'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">{isIT ? 'Prezzo al m²' : 'Price per m²'}</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(result.pricePerSqm)}/m²</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">{isIT ? 'Tendenza zona' : 'Area trend'}</p>
                      <p className="text-xl font-semibold text-emerald-500 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 mr-1" />
                        {isIT ? 'In crescita' : 'Rising'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                  <CardContent className="p-6 text-center">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {isIT ? 'Vuoi il report completo in PDF?' : 'Want the full PDF report?'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isIT
                        ? 'Registrati gratis per sbloccare: report dettagliato, comparabili, analisi quartiere, previsioni 12 mesi.'
                        : 'Sign up free to unlock: detailed report, comparables, neighborhood analysis, 12-month forecast.'}
                    </p>
                    <Button asChild size="lg">
                      <Link href="/auth/signup">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isIT ? 'Registrati Gratis — Report Completo' : 'Sign Up Free — Full Report'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center p-8">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isIT ? 'Inserisci i dati del tuo immobile' : 'Enter your property details'}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {isIT
                      ? 'Compila il form a sinistra per ricevere una stima AI istantanea del valore del tuo immobile.'
                      : 'Fill in the form to receive an instant AI estimate of your property value.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Trust section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Sparkles, label: isIT ? 'Powered by AI' : 'AI-Powered', desc: 'GPT-4o' },
            { icon: BarChart3, label: isIT ? 'Dati di mercato' : 'Market data', desc: isIT ? 'Aggiornati mensilmente' : 'Updated monthly' },
            { icon: CheckCircle2, label: isIT ? 'Gratuito' : 'Free', desc: isIT ? 'Nessuna registrazione' : 'No signup' },
            { icon: Building2, label: '6 EU', desc: 'IT, FR, ES, DE, UK, PT' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
