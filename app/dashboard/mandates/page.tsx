'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  FileSignature, Plus, Calendar, AlertTriangle,
  CheckCircle2, Clock, Users, Building2, Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MandatesPage() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState('all');
  const isIT = locale === 'it';

  const mandateTypes: Record<string, { it: string; en: string }[]> = {
    IT: [{ it: 'Mandato in Esclusiva', en: 'Exclusive Mandate' }, { it: 'Mandato Non Esclusivo', en: 'Non-Exclusive' }, { it: 'Mandato Multi-Agenzia', en: 'Multi-Agency' }],
    FR: [{ it: 'Mandat Exclusif', en: 'Mandat Exclusif' }, { it: 'Mandat Simple', en: 'Mandat Simple' }, { it: 'Mandat Semi-Exclusif', en: 'Semi-Exclusive' }],
    ES: [{ it: 'Exclusiva', en: 'Exclusiva' }, { it: 'No Exclusiva', en: 'Non-Exclusive' }],
    DE: [{ it: 'Alleinauftrag', en: 'Sole Mandate' }, { it: 'Einfacher Auftrag', en: 'Simple Mandate' }],
    UK: [{ it: 'Sole Agency', en: 'Sole Agency' }, { it: 'Multi Agency', en: 'Multi Agency' }, { it: 'Joint Sole', en: 'Joint Sole' }],
    PT: [{ it: 'Contrato Exclusivo', en: 'Exclusive Contract' }, { it: 'Contrato Não Exclusivo', en: 'Non-Exclusive' }],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <FileSignature className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Mandati' : 'Mandates'}</h1>
            <p className="text-muted-foreground">{isIT ? 'Gestisci mandati di vendita con template multi-paese e promemoria scadenze' : 'Manage sale mandates with multi-country templates and expiry reminders'}</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isIT ? 'Nuovo Mandato' : 'New Mandate'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isIT ? 'Mandati attivi' : 'Active mandates', value: '0', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: isIT ? 'In scadenza (30gg)' : 'Expiring (30d)', value: '0', icon: AlertTriangle, color: 'text-yellow-500' },
          { label: isIT ? 'Esclusivi' : 'Exclusive', value: '0', icon: FileSignature, color: 'text-blue-500' },
          { label: isIT ? 'Commissione media' : 'Avg commission', value: '—', icon: Building2, color: 'text-purple-500' },
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

      {/* Country templates info */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">{isIT ? 'Template per Paese' : 'Country Templates'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(mandateTypes).map(([country, types]) => (
              <div key={country} className="p-3 rounded-lg bg-muted/50 text-sm">
                <span className="font-medium text-foreground">{country === 'IT' ? '🇮🇹' : country === 'FR' ? '🇫🇷' : country === 'ES' ? '🇪🇸' : country === 'DE' ? '🇩🇪' : country === 'UK' ? '🇬🇧' : '🇵🇹'} {country}</span>
                <div className="mt-1 space-y-0.5">
                  {types.map(t => (
                    <p key={t.en} className="text-xs text-muted-foreground">{isIT ? t.it : t.en}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <FileSignature className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isIT ? 'Nessun mandato registrato' : 'No mandates recorded yet'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {isIT
              ? 'Registra i tuoi mandati di vendita per tracciare scadenze, commissioni e documenti. Template FIAIP/FIMAA inclusi.'
              : 'Record your sale mandates to track expiry dates, commissions, and documents. Country-specific templates included.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'Alert scadenze' : 'Expiry alerts'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <FileSignature className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'E-signature' : 'E-signature'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{isIT ? 'Assegna agente' : 'Assign agent'}</span>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {isIT ? 'Registra primo mandato' : 'Record first mandate'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
