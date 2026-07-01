'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  ArrowLeft, Leaf, Calculator, TrendingDown,
  Home, Zap, Sun, ThermometerSun, Droplets,
  ChevronRight, CheckCircle2, Sparkles, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EU_GREEN_INCENTIVES: Record<string, { name: string; flag: string; incentives: string[] }> = {
  IT: { name: 'Italia', flag: '🇮🇹', incentives: ['Ecobonus 50-65%', 'Bonus Casa 50%', 'Conto Termico', 'Superbonus (se condominio)'] },
  FR: { name: 'France', flag: '🇫🇷', incentives: ['MaPrimeRénov\'', 'CEE (Certificats d\'Économie d\'Énergie)', 'Éco-PTZ', 'TVA réduite 5.5%'] },
  ES: { name: 'España', flag: '🇪🇸', incentives: ['Plan PREE 5000', 'Programa MOVES', 'Deducciones IRPF', 'Subvenciones IDAE'] },
  DE: { name: 'Deutschland', flag: '🇩🇪', incentives: ['KfW Förderung', 'BEG (Bundesförderung für effiziente Gebäude)', 'Steuerliche Förderung', 'BAFA Zuschuss'] },
  UK: { name: 'UK', flag: '🇬🇧', incentives: ['Boiler Upgrade Scheme', 'ECO4 (Energy Company Obligation)', 'Smart Export Guarantee', 'Home Upgrade Grant'] },
  PT: { name: 'Portugal', flag: '🇵🇹', incentives: ['Vale Eficiência', 'Fundo Ambiental', 'Programa Edifícios + Sustentáveis', 'IVA reduzido 6%'] },
};

export default function CarbonFootprintPage() {
  const { locale } = useLocale();
  const isIT = locale === 'it';
  const [country, setCountry] = useState('IT');
  const [energyClass, setEnergyClass] = useState('D');
  const [surface, setSurface] = useState('100');
  const [heating, setHeating] = useState('gas');
  const [calculated, setCalculated] = useState(false);

  const sqm = parseInt(surface) || 100;
  const classMultiplier: Record<string, number> = { 'A+': 0.3, A: 0.4, B: 0.55, C: 0.7, D: 1.0, E: 1.3, F: 1.6, G: 2.0 };
  const heatingMultiplier: Record<string, number> = { gas: 1.0, oil: 1.4, electric: 0.6, heatpump: 0.3, district: 0.5 };
  const baseCO2 = 25; // kg CO2/m²/year baseline
  const co2PerYear = Math.round(sqm * baseCO2 * (classMultiplier[energyClass] ?? 1) * (heatingMultiplier[heating] ?? 1));
  const co2Savings = Math.round(co2PerYear * 0.55); // potential savings with retrofit

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-green-950 via-slate-900 to-slate-950 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />PropertyPilot AI
          </Link>
          <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
            {isIT ? '100% Gratuito • Nessuna registrazione' : '100% Free • No signup required'}
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isIT ? 'Calcolatore Impronta di Carbonio' : 'Carbon Footprint Calculator'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isIT ? 'Calcola le emissioni CO₂ del tuo immobile e scopri come ridurle con gli incentivi EU.' : 'Calculate your property\'s CO₂ emissions and discover how to reduce them with EU incentives.'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Home className="h-5 w-5 text-primary" />{isIT ? 'Dati Immobile' : 'Property Data'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{isIT ? 'Paese' : 'Country'}</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EU_GREEN_INCENTIVES).map(([code, c]) => (
                      <SelectItem key={code} value={code}>{c.flag} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Classe energetica' : 'Energy class'}</Label>
                <Select value={energyClass} onValueChange={setEnergyClass}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Superficie (m²)' : 'Surface (m²)'}</Label>
                <Input type="number" value={surface} onChange={e => setSurface(e.target.value)} placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label>{isIT ? 'Riscaldamento' : 'Heating'}</Label>
                <Select value={heating} onValueChange={setHeating}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas">{isIT ? 'Gas naturale' : 'Natural gas'}</SelectItem>
                    <SelectItem value="oil">{isIT ? 'Gasolio' : 'Oil'}</SelectItem>
                    <SelectItem value="electric">{isIT ? 'Elettrico' : 'Electric'}</SelectItem>
                    <SelectItem value="heatpump">{isIT ? 'Pompa di calore' : 'Heat pump'}</SelectItem>
                    <SelectItem value="district">{isIT ? 'Teleriscaldamento' : 'District heating'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setCalculated(true)}>
                <Calculator className="h-4 w-4 mr-2" />{isIT ? 'Calcola Emissioni' : 'Calculate Emissions'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {calculated ? (
            <div className="space-y-4">
              <Card className={`border-${co2PerYear > 3000 ? 'red' : co2PerYear > 1500 ? 'yellow' : 'green'}-500/30`}>
                <CardContent className="p-6 text-center">
                  <Leaf className={`h-8 w-8 mx-auto mb-2 ${co2PerYear > 3000 ? 'text-red-500' : co2PerYear > 1500 ? 'text-yellow-500' : 'text-green-500'}`} />
                  <p className="text-sm text-muted-foreground">{isIT ? 'Emissioni annuali stimate' : 'Estimated annual emissions'}</p>
                  <p className="text-4xl font-bold text-foreground">{co2PerYear.toLocaleString()} <span className="text-lg">kg CO₂</span></p>
                  <p className="text-sm text-muted-foreground mt-1">{(co2PerYear / sqm).toFixed(1)} kg CO₂/m²/{isIT ? 'anno' : 'year'}</p>
                </CardContent>
              </Card>
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    {isIT ? 'Risparmio potenziale con retrofit' : 'Potential savings with retrofit'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { icon: ThermometerSun, label: isIT ? 'Isolamento cappotto' : 'Wall insulation', saving: '25-30%' },
                      { icon: Zap, label: isIT ? 'Pompa di calore' : 'Heat pump', saving: '40-60%' },
                      { icon: Sun, label: isIT ? 'Pannelli solari' : 'Solar panels', saving: '20-35%' },
                      { icon: Droplets, label: isIT ? 'Doppi vetri' : 'Double glazing', saving: '10-15%' },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4 text-green-500" />{item.label}</span>
                          <Badge variant="secondary" className="text-xs">{item.saving}</Badge>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-3">
                    {isIT ? `Risparmio stimato: ${co2Savings.toLocaleString()} kg CO₂/anno` : `Estimated savings: ${co2Savings.toLocaleString()} kg CO₂/year`}
                  </p>
                </CardContent>
              </Card>

              {/* Country incentives */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-3">
                    {EU_GREEN_INCENTIVES[country]?.flag} {isIT ? 'Incentivi disponibili' : 'Available incentives'}
                  </h3>
                  <div className="space-y-1.5">
                    {EU_GREEN_INCENTIVES[country]?.incentives.map(inc => (
                      <div key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />{inc}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{isIT ? 'Vuoi il report completo?' : 'Want the full report?'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{isIT ? 'Registrati gratis per il report PDF con costi, risparmi e ROI per ogni retrofit.' : 'Sign up free for the PDF report with costs, savings, and ROI for each retrofit.'}</p>
                  <Button asChild><Link href="/auth/signup"><Sparkles className="h-4 w-4 mr-2" />{isIT ? 'Registrati Gratis' : 'Sign Up Free'}<ChevronRight className="h-4 w-4 ml-2" /></Link></Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center p-8">
                <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{isIT ? 'Inserisci i dati del tuo immobile' : 'Enter your property details'}</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">{isIT ? 'Compila il form per calcolare le emissioni CO₂ e scoprire gli incentivi.' : 'Fill in the form to calculate CO₂ emissions and discover incentives.'}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
