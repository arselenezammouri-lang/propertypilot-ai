'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  DollarSign, Plus, TrendingUp, Users, PieChart,
  Calendar, Filter, Download, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CommissionsPage() {
  const { locale } = useLocale();
  const [period, setPeriod] = useState('month');
  const isIT = locale === 'it';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <DollarSign className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Commissioni' : 'Commissions'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Traccia provvigioni, split agente e revenue pipeline' : 'Track commissions, agent splits, and revenue pipeline'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">{isIT ? 'Questo mese' : 'This month'}</SelectItem>
              <SelectItem value="quarter">{isIT ? 'Trimestre' : 'Quarter'}</SelectItem>
              <SelectItem value="year">{isIT ? 'Anno' : 'Year'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Pipeline attiva' : 'Active pipeline', value: '€0', icon: TrendingUp, color: 'text-blue-500' },
          { label: isIT ? 'Provvigioni in sospeso' : 'Pending commissions', value: '€0', icon: DollarSign, color: 'text-yellow-500' },
          { label: isIT ? 'Incassate (mese)' : 'Collected (month)', value: '€0', icon: DollarSign, color: 'text-emerald-500' },
          { label: isIT ? 'Media per deal' : 'Avg per deal', value: '€0', icon: PieChart, color: 'text-purple-500' },
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

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isIT ? 'Nessuna commissione registrata' : 'No commissions recorded yet'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {isIT
              ? 'Quando chiudi un affare, registra la commissione qui per tracciare le tue provvigioni, gli split agente e le previsioni di revenue.'
              : 'When you close a deal, record the commission here to track your earnings, agent splits, and revenue forecasts.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'Split per agente' : 'Agent splits'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <PieChart className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'Report fiscale' : 'Tax reporting'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'Previsioni revenue' : 'Revenue forecast'}</span>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {isIT ? 'Registra prima commissione' : 'Record first commission'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
