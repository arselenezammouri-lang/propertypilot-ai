'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Landmark, Plus, Calculator, Users, TrendingUp,
  FileText, Globe, ChevronRight, ExternalLink,
  DollarSign, Percent, Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrokerPartner {
  name: string;
  country: string;
  type: 'online' | 'traditional';
  url: string;
  commission: string;
}

const BROKER_PARTNERS: BrokerPartner[] = [
  { name: 'Facile.it', country: 'IT', type: 'online', url: 'https://www.facile.it/mutui', commission: '0.5-1%' },
  { name: 'MutuiOnline.it', country: 'IT', type: 'online', url: 'https://www.mutuionline.it', commission: '0.3-0.8%' },
  { name: 'Mutui.it', country: 'IT', type: 'online', url: 'https://www.mutui.it', commission: '0.4-0.7%' },
  { name: 'CheBanca!', country: 'IT', type: 'traditional', url: 'https://www.chebanca.it', commission: '0.5%' },
  { name: 'Pretto.fr', country: 'FR', type: 'online', url: 'https://www.pretto.fr', commission: '0.5-1.2%' },
  { name: 'Empruntis', country: 'FR', type: 'online', url: 'https://www.empruntis.com', commission: '0.8-1%' },
  { name: 'Meilleurtaux', country: 'FR', type: 'online', url: 'https://www.meilleurtaux.com', commission: '0.7-1%' },
  { name: 'TrioTeca', country: 'ES', type: 'online', url: 'https://trioteca.com', commission: '0.5-1%' },
  { name: 'Interhyp', country: 'DE', type: 'online', url: 'https://www.interhyp.de', commission: '0.5-1.5%' },
  { name: 'Dr. Klein', country: 'DE', type: 'online', url: 'https://www.drklein.de', commission: '0.5-1%' },
];

const COUNTRY_TAX_RULES: Record<string, { name: string; flag: string; rules: string[] }> = {
  IT: { name: 'Italia', flag: '🇮🇹', rules: ['Detrazioni interessi 19%', 'Agevolazione prima casa <36 anni', 'Surroga mutuo gratuita', 'Imposta sostitutiva 0.25% (prima casa)'] },
  FR: { name: 'France', flag: '🇫🇷', rules: ['PTZ (Prêt à Taux Zéro)', 'Déduction intérêts d\'emprunt', 'Frais de notaire 2-3% (neuf) / 7-8% (ancien)', 'Assurance emprunteur obligatoire'] },
  ES: { name: 'España', flag: '🇪🇸', rules: ['Hipoteca variable vs fija', 'IBI (Impuesto sobre Bienes Inmuebles)', 'AJD (Actos Jurídicos Documentados)', 'Deducción vivienda habitual'] },
  DE: { name: 'Deutschland', flag: '🇩🇪', rules: ['Bausparvertrag (risparmio edilizio)', 'Eigenheimrente / Riester', 'Grunderwerbsteuer 3.5-6.5%', 'KfW Förderung (sussidi energia)'] },
  UK: { name: 'United Kingdom', flag: '🇬🇧', rules: ['Stamp Duty Land Tax (SDLT)', 'Help to Buy ISA / Lifetime ISA', 'First-time buyer relief (£0-425k)', 'Mortgage interest tax relief (BTL)'] },
  PT: { name: 'Portugal', flag: '🇵🇹', rules: ['Crédito habitação', 'IMT (Imposto Municipal sobre Transmissões)', 'IMI (Imposto Municipal sobre Imóveis)', 'Isenção IMT jovens <35 (até €316k)'] },
};

export default function MortgagesPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState('calculator');
  const [selectedCountry, setSelectedCountry] = useState('IT');
  const isIT = locale === 'it';

  // Simple mortgage calculator state
  const [price, setPrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(20);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(25);

  const loanAmount = price * (1 - downPayment / 100);
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  const fmt = (n: number) => new Intl.NumberFormat(isIT ? 'it-IT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-green-500/10">
          <Landmark className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Mutui & Broker' : 'Mortgages & Brokers'}</h1>
          <p className="text-muted-foreground">{isIT ? 'Calcola rate, confronta broker e offri pre-approvazione ai tuoi clienti' : 'Calculate payments, compare brokers, and offer pre-approval to your clients'}</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="calculator"><Calculator className="h-4 w-4 mr-1" />{isIT ? 'Calcolatore' : 'Calculator'}</TabsTrigger>
          <TabsTrigger value="brokers"><Users className="h-4 w-4 mr-1" />{isIT ? 'Broker Partner' : 'Broker Partners'}</TabsTrigger>
          <TabsTrigger value="tax"><Globe className="h-4 w-4 mr-1" />{isIT ? 'Regole Fiscali' : 'Tax Rules'}</TabsTrigger>
        </TabsList>

        {/* Calculator */}
        <TabsContent value="calculator" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">{isIT ? 'Simulazione Mutuo' : 'Mortgage Simulation'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">{isIT ? 'Prezzo immobile' : 'Property price'}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">€</span>
                    <input type="range" min={50000} max={2000000} step={10000} value={price} onChange={e => setPrice(Number(e.target.value))} className="flex-1" />
                    <span className="text-sm font-mono w-24 text-right">{fmt(price)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{isIT ? 'Anticipo' : 'Down payment'}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="range" min={5} max={80} step={5} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="flex-1" />
                    <span className="text-sm font-mono w-16 text-right">{downPayment}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{isIT ? 'Tasso interesse (TAEG)' : 'Interest rate (APR)'}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="range" min={1} max={8} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="flex-1" />
                    <span className="text-sm font-mono w-16 text-right">{rate.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{isIT ? 'Durata (anni)' : 'Duration (years)'}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="range" min={5} max={35} step={5} value={years} onChange={e => setYears(Number(e.target.value))} className="flex-1" />
                    <span className="text-sm font-mono w-16 text-right">{years} {isIT ? 'anni' : 'yrs'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{isIT ? 'Rata mensile' : 'Monthly payment'}</p>
                  <p className="text-4xl font-bold text-foreground">{fmt(monthlyPayment)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">{isIT ? 'Importo mutuo' : 'Loan amount'}</p>
                    <p className="font-semibold text-foreground">{fmt(loanAmount)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">{isIT ? 'Anticipo' : 'Down payment'}</p>
                    <p className="font-semibold text-foreground">{fmt(price - loanAmount)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">{isIT ? 'Interessi totali' : 'Total interest'}</p>
                    <p className="font-semibold text-red-500">{fmt(totalInterest)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-muted-foreground">{isIT ? 'Totale pagato' : 'Total paid'}</p>
                    <p className="font-semibold text-foreground">{fmt(totalPaid)}</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  {isIT ? 'Genera PDF pre-approvazione' : 'Generate pre-approval PDF'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brokers */}
        <TabsContent value="brokers" className="mt-4 space-y-3">
          {Object.entries(
            BROKER_PARTNERS.reduce<Record<string, BrokerPartner[]>>((acc, b) => { (acc[b.country] ??= []).push(b); return acc; }, {})
          ).map(([country, brokers]) => (
            <Card key={country}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-3">
                  {COUNTRY_TAX_RULES[country]?.flag} {COUNTRY_TAX_RULES[country]?.name}
                </h3>
                <div className="space-y-2">
                  {brokers.map(b => (
                    <div key={b.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-foreground">{b.name}</span>
                        <Badge variant="secondary" className="text-xs">{b.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{isIT ? 'Commissione' : 'Commission'}: {b.commission}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={b.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tax Rules */}
        <TabsContent value="tax" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(COUNTRY_TAX_RULES).map(([code, country]) => (
              <Card key={code}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-3">{country.flag} {country.name}</h3>
                  <ul className="space-y-1.5">
                    {country.rules.map(rule => (
                      <li key={rule} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
