'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  TrendingUp, TrendingDown, MapPin, BarChart3, Activity,
  AlertTriangle, Clock, Filter, Globe, Sparkles,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ZoneData {
  name: string;
  country: string;
  avgPrice: number;
  change6m: number;
  daysOnMarket: number;
  inventory: number;
  demand: 'high' | 'medium' | 'low';
}

const DEMO_ZONES: ZoneData[] = [
  { name: 'Milano Centro', country: 'IT', avgPrice: 6200, change6m: 4.2, daysOnMarket: 42, inventory: 234, demand: 'high' },
  { name: 'Roma EUR', country: 'IT', avgPrice: 4100, change6m: 1.8, daysOnMarket: 68, inventory: 189, demand: 'medium' },
  { name: 'Barcelona Eixample', country: 'ES', avgPrice: 4800, change6m: 5.1, daysOnMarket: 35, inventory: 156, demand: 'high' },
  { name: 'Paris 16e', country: 'FR', avgPrice: 11200, change6m: -1.3, daysOnMarket: 55, inventory: 98, demand: 'medium' },
  { name: 'Berlin Mitte', country: 'DE', avgPrice: 5800, change6m: 2.7, daysOnMarket: 48, inventory: 167, demand: 'medium' },
  { name: 'London Zone 2', country: 'UK', avgPrice: 8900, change6m: -0.5, daysOnMarket: 62, inventory: 312, demand: 'low' },
  { name: 'Lisboa Chiado', country: 'PT', avgPrice: 5100, change6m: 6.8, daysOnMarket: 28, inventory: 87, demand: 'high' },
  { name: 'Firenze Centro', country: 'IT', avgPrice: 5400, change6m: 3.1, daysOnMarket: 51, inventory: 112, demand: 'medium' },
];

export default function MarketIntelligencePage() {
  const { locale } = useLocale();
  const [selectedCountry, setSelectedCountry] = useState('all');
  const isIT = locale === 'it';

  const filteredZones = selectedCountry === 'all'
    ? DEMO_ZONES
    : DEMO_ZONES.filter(z => z.country === selectedCountry);

  const TrendIcon = ({ val }: { val: number }) => {
    if (val > 0) return <ChevronUp className="h-4 w-4 text-emerald-500" />;
    if (val < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10">
            <Activity className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Market Intelligence' : 'Market Intelligence'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Prezzi, trend e opportunità in tempo reale per zona' : 'Real-time prices, trends, and opportunities by zone'}</p>
          </div>
        </div>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[160px]">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isIT ? 'Tutti i Paesi' : 'All Countries'}</SelectItem>
            <SelectItem value="IT">🇮🇹 Italia</SelectItem>
            <SelectItem value="FR">🇫🇷 France</SelectItem>
            <SelectItem value="ES">🇪🇸 España</SelectItem>
            <SelectItem value="DE">🇩🇪 Deutschland</SelectItem>
            <SelectItem value="UK">🇬🇧 UK</SelectItem>
            <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Zone monitorate' : 'Zones monitored', value: `${filteredZones.length}`, icon: MapPin, color: 'text-blue-500' },
          { label: isIT ? 'Prezzo medio/m²' : 'Avg price/m²', value: `€${Math.round(filteredZones.reduce((a, z) => a + z.avgPrice, 0) / filteredZones.length).toLocaleString()}`, icon: BarChart3, color: 'text-emerald-500' },
          { label: isIT ? 'Zone in crescita' : 'Rising zones', value: `${filteredZones.filter(z => z.change6m > 0).length}`, icon: TrendingUp, color: 'text-emerald-500' },
          { label: isIT ? 'Domanda alta' : 'High demand', value: `${filteredZones.filter(z => z.demand === 'high').length}`, icon: Sparkles, color: 'text-orange-500' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Zone Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isIT ? 'Indici di Mercato per Zona' : 'Market Indices by Zone'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-medium">{isIT ? 'Zona' : 'Zone'}</th>
                  <th className="text-right py-3 px-3 font-medium">{isIT ? 'Prezzo/m²' : 'Price/m²'}</th>
                  <th className="text-right py-3 px-3 font-medium">{isIT ? 'Trend 6M' : '6M Trend'}</th>
                  <th className="text-right py-3 px-3 font-medium">{isIT ? 'Giorni medi' : 'Avg Days'}</th>
                  <th className="text-right py-3 px-3 font-medium">{isIT ? 'Inventario' : 'Inventory'}</th>
                  <th className="text-center py-3 px-3 font-medium">{isIT ? 'Domanda' : 'Demand'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map(zone => (
                  <tr key={zone.name} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">{zone.name}</span>
                        <Badge variant="outline" className="text-xs">{zone.country}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-foreground">€{zone.avgPrice.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`flex items-center justify-end gap-1 font-medium ${zone.change6m > 0 ? 'text-emerald-500' : zone.change6m < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        <TrendIcon val={zone.change6m} />
                        {zone.change6m > 0 ? '+' : ''}{zone.change6m}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">{zone.daysOnMarket}d</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">{zone.inventory}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={zone.demand === 'high' ? 'default' : 'secondary'} className={`text-xs ${zone.demand === 'high' ? 'bg-emerald-500/20 text-emerald-400' : zone.demand === 'low' ? 'bg-red-500/20 text-red-400' : ''}`}>
                        {zone.demand === 'high' ? (isIT ? 'Alta' : 'High') : zone.demand === 'medium' ? (isIT ? 'Media' : 'Medium') : (isIT ? 'Bassa' : 'Low')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {isIT ? 'Dati aggiornati mensilmente. Fonti: Idealista, ImmoScout24, Rightmove, ISTAT.' : 'Data updated monthly. Sources: Idealista, ImmoScout24, Rightmove, ISTAT.'}
          </p>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            {isIT ? 'Opportunità rilevate' : 'Opportunities Detected'}
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">🔥 <strong>Lisboa Chiado</strong>: +6.8% in 6 mesi, {isIT ? 'domanda alta, inventario basso — zona calda per investimento' : 'high demand, low inventory — hot zone for investment'}</p>
            <p className="text-muted-foreground">📈 <strong>Barcelona Eixample</strong>: +5.1%, {isIT ? 'tempo medio di vendita 35 giorni — mercato veloce' : 'avg 35 days to sell — fast market'}</p>
            <p className="text-muted-foreground">⚠️ <strong>London Zone 2</strong>: -0.5%, {isIT ? 'inventario alto (312), domanda bassa — compratore ha vantaggio' : 'high inventory (312), low demand — buyer market'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
