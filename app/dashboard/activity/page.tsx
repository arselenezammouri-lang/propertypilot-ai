'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Activity, Filter, Download, Clock,
  Sparkles, UserPlus, FileText, Phone,
  MessageSquare, Shield, BarChart3, Globe,
  Bell, CheckCircle2, AlertTriangle, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface ActivityEvent {
  id: string;
  type: 'ai_listing' | 'lead_new' | 'lead_scored' | 'voice_call' | 'whatsapp' | 'compliance' | 'cma' | 'portal' | 'document' | 'automation' | 'billing';
  title: string;
  description: string;
  timestamp: string;
  icon: typeof Sparkles;
  color: string;
}

// Demo events for empty state illustration
const DEMO_EVENTS: ActivityEvent[] = [
  { id: '1', type: 'ai_listing', title: 'AI Listing Generated', description: 'Luxury apartment in Milan — 3 bedrooms, 120m²', timestamp: '2 min ago', icon: Sparkles, color: 'text-purple-500' },
  { id: '2', type: 'lead_new', title: 'New Lead Captured', description: 'Maria Bianchi — interested in Via Roma properties', timestamp: '15 min ago', icon: UserPlus, color: 'text-blue-500' },
  { id: '3', type: 'lead_scored', title: 'Lead Score Updated', description: 'Andrea Rossi scored 87/100 (HOT)', timestamp: '32 min ago', icon: BarChart3, color: 'text-green-500' },
  { id: '4', type: 'compliance', title: 'Compliance Check Passed', description: 'Listing #42 — Italy APE verified ✅', timestamp: '1h ago', icon: Shield, color: 'text-emerald-500' },
  { id: '5', type: 'cma', title: 'CMA Report Generated', description: 'Via Montenapoleone — estimated €1.2M-€1.4M', timestamp: '2h ago', icon: FileText, color: 'text-orange-500' },
  { id: '6', type: 'automation', title: 'Speed-to-Lead Triggered', description: 'Auto email sent to hot lead (score: 92)', timestamp: '3h ago', icon: Zap, color: 'text-yellow-500' },
];

export default function ActivityPage() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState('all');

  const isIT = locale === 'it';

  const title = isIT ? 'Feed Attività' : 'Activity Feed';
  const subtitle = isIT
    ? 'Cronologia in tempo reale di tutte le azioni nella tua agenzia'
    : 'Real-time timeline of all actions across your agency';

  const emptyTitle = isIT
    ? 'Il tuo feed attività apparirà qui'
    : 'Your activity feed will appear here';
  const emptyDesc = isIT
    ? 'Quando generi annunci, ricevi lead, effettui chiamate o esegui automazioni, ogni evento verrà registrato qui.'
    : 'When you generate listings, receive leads, make calls, or run automations, every event will be logged here.';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-primary/10">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={isIT ? 'Tutti gli eventi' : 'All events'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isIT ? 'Tutti gli eventi' : 'All events'}</SelectItem>
                <SelectItem value="ai">{isIT ? 'Generazione AI' : 'AI Generation'}</SelectItem>
                <SelectItem value="leads">{isIT ? 'Lead' : 'Leads'}</SelectItem>
                <SelectItem value="calls">{isIT ? 'Chiamate' : 'Calls'}</SelectItem>
                <SelectItem value="automation">{isIT ? 'Automazioni' : 'Automations'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isIT ? 'Esporta CSV' : 'Export CSV'}
          </Button>
        </div>

        {/* Demo Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              {isIT ? 'Attività Recenti' : 'Recent Activity'}
              <Badge variant="secondary" className="ml-2">{isIT ? 'Demo' : 'Preview'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {DEMO_EVENTS.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`mt-0.5 p-2 rounded-lg bg-muted/50 ${event.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{emptyTitle}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">{emptyDesc}</p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <a href="/dashboard/ai-listings">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isIT ? 'Genera il tuo primo annuncio' : 'Generate your first listing'}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
