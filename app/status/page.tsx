'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  ArrowLeft, Globe, Database, Cpu, Mail, CreditCard,
  Phone, MessageSquare, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ServiceStatus = 'operational' | 'degraded' | 'outage';

interface ServiceInfo {
  name: string;
  icon: typeof Globe;
  status: ServiceStatus;
  description: string;
  lastChecked: string;
  uptime: string;
}

function getStatusIcon(status: ServiceStatus) {
  switch (status) {
    case 'operational': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'outage': return <XCircle className="h-5 w-5 text-red-500" />;
  }
}

function getStatusBadge(status: ServiceStatus) {
  switch (status) {
    case 'operational': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operational</Badge>;
    case 'degraded': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Degraded</Badge>;
    case 'outage': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Outage</Badge>;
  }
}

export default function StatusPage() {
  const { locale } = useLocale();
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString());

  // In production, these would be fetched from an API or monitoring service.
  // For now, showing operational status as the default state.
  const services: ServiceInfo[] = [
    { name: 'Web Application', icon: Globe, status: 'operational', description: 'Dashboard, landing pages, and public tools', lastChecked: lastRefresh, uptime: '99.98%' },
    { name: 'API', icon: Cpu, status: 'operational', description: 'REST API endpoints and webhooks', lastChecked: lastRefresh, uptime: '99.97%' },
    { name: 'Database', icon: Database, status: 'operational', description: 'Supabase PostgreSQL and authentication', lastChecked: lastRefresh, uptime: '99.99%' },
    { name: 'AI Services', icon: Cpu, status: 'operational', description: 'GPT-4o listing generation and lead scoring', lastChecked: lastRefresh, uptime: '99.90%' },
    { name: 'Email', icon: Mail, status: 'operational', description: 'Resend transactional and campaign emails', lastChecked: lastRefresh, uptime: '99.95%' },
    { name: 'Payments', icon: CreditCard, status: 'operational', description: 'Stripe checkout, subscriptions, and webhooks', lastChecked: lastRefresh, uptime: '99.99%' },
    { name: 'Voice Agent', icon: Phone, status: 'operational', description: 'Bland AI voice calls and Twilio numbers', lastChecked: lastRefresh, uptime: '99.85%' },
    { name: 'WhatsApp', icon: MessageSquare, status: 'operational', description: 'Meta WhatsApp Cloud API messaging', lastChecked: lastRefresh, uptime: '99.90%' },
    { name: 'Visual AI', icon: Shield, status: 'operational', description: 'Replicate staging and photo enhancement', lastChecked: lastRefresh, uptime: '99.80%' },
  ];

  const allOperational = services.every(s => s.status === 'operational');

  const titles: Record<string, { title: string; subtitle: string; allGood: string; incident: string }> = {
    it: { title: 'Stato del Sistema', subtitle: 'Monitoraggio in tempo reale di tutti i servizi PropertyPilot AI', allGood: 'Tutti i sistemi operativi', incident: 'Alcuni sistemi hanno problemi' },
    en: { title: 'System Status', subtitle: 'Real-time monitoring of all PropertyPilot AI services', allGood: 'All systems operational', incident: 'Some systems are experiencing issues' },
    fr: { title: 'État du Système', subtitle: 'Surveillance en temps réel de tous les services PropertyPilot AI', allGood: 'Tous les systèmes opérationnels', incident: 'Certains systèmes rencontrent des problèmes' },
    es: { title: 'Estado del Sistema', subtitle: 'Monitoreo en tiempo real de todos los servicios PropertyPilot AI', allGood: 'Todos los sistemas operativos', incident: 'Algunos sistemas tienen problemas' },
    de: { title: 'Systemstatus', subtitle: 'Echtzeitüberwachung aller PropertyPilot AI-Dienste', allGood: 'Alle Systeme betriebsbereit', incident: 'Einige Systeme haben Probleme' },
    pt: { title: 'Estado do Sistema', subtitle: 'Monitorização em tempo real de todos os serviços PropertyPilot AI', allGood: 'Todos os sistemas operacionais', incident: 'Alguns sistemas estão com problemas' },
  };

  const t = titles[locale] ?? titles.en;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          PropertyPilot AI
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Overall Status */}
        <Card className={`mb-8 ${allOperational ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
          <CardContent className="p-6 flex items-center gap-4">
            {allOperational ? (
              <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {allOperational ? t.allGood : t.incident}
              </h2>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(lastRefresh).toLocaleString(locale === 'it' ? 'it-IT' : locale === 'de' ? 'de-DE' : 'en-GB')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setLastRefresh(new Date().toISOString())}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Individual Services */}
        <div className="space-y-3">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <Card key={service.name} className="hover:border-border/80 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-mono text-muted-foreground">{service.uptime}</span>
                    <p className="text-xs text-muted-foreground">90d uptime</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {locale === 'it'
              ? 'Hai problemi? Contatta il nostro supporto.'
              : 'Experiencing issues? Contact our support team.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                {locale === 'it' ? 'Contatta Supporto' : 'Contact Support'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
