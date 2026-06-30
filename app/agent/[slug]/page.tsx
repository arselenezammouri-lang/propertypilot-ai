'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Star,
  Calendar, MessageSquare, Award, Building2,
  Clock, TrendingUp, ChevronRight, ExternalLink,
  Share2, Download, Languages
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Demo agent data — in production, fetched from Supabase by slug
const DEMO_AGENT = {
  name: 'Demo Agent',
  slug: 'demo-agent',
  title: 'Real Estate Professional',
  bio: 'Experienced real estate professional specializing in residential properties across the metropolitan area. Passionate about helping clients find their dream home.',
  photo: null,
  phone: '+39 333 123 4567',
  email: 'agent@propertypilot.eu',
  website: null,
  city: 'Milano',
  country: 'IT',
  languages: ['Italiano', 'English'],
  certifications: ['FIAIP', 'Patentino Agente Immobiliare'],
  experience_years: 8,
  areas: ['Milano Centro', 'Navigli', 'Brera', 'Porta Nuova'],
  stats: { deals_closed: 0, avg_response_time: '< 2h', satisfaction: 0, listings_active: 0 },
  social: { linkedin: null, instagram: null, facebook: null },
  verified: true,
};

export default function AgentShowcasePage({ params }: { params: { slug: string } }) {
  const { locale } = useLocale();
  const isIT = locale === 'it';
  const agent = DEMO_AGENT; // In production: fetch by params.slug

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            PropertyPilot AI
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Photo */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-border flex-shrink-0">
              <Building2 className="h-12 w-12 text-primary/60" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{agent.name}</h1>
                {agent.verified && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Award className="h-3 w-3 mr-1" />
                    {isIT ? 'Verificato' : 'Verified'}
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-3">{agent.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{agent.city}, {agent.country}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{agent.experience_years} {isIT ? 'anni' : 'years'}</span>
                <span className="flex items-center gap-1"><Languages className="h-4 w-4" />{agent.languages.join(', ')}</span>
              </div>
              <div className="flex gap-3">
                <Button size="sm"><Phone className="h-4 w-4 mr-2" />{isIT ? 'Chiama' : 'Call'}</Button>
                <Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-2" />Email</Button>
                <Button size="sm" variant="outline"><MessageSquare className="h-4 w-4 mr-2" />WhatsApp</Button>
                <Button size="sm" variant="ghost"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: isIT ? 'Affari chiusi' : 'Deals closed', value: agent.stats.deals_closed || '—', icon: TrendingUp },
            { label: isIT ? 'Tempo risposta' : 'Response time', value: agent.stats.avg_response_time, icon: Clock },
            { label: isIT ? 'Soddisfazione' : 'Satisfaction', value: agent.stats.satisfaction ? `${agent.stats.satisfaction}%` : '—', icon: Star },
            { label: isIT ? 'Annunci attivi' : 'Active listings', value: agent.stats.listings_active || '—', icon: Building2 },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bio */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">{isIT ? 'Chi sono' : 'About me'}</h2>
            <p className="text-muted-foreground leading-relaxed">{agent.bio}</p>
          </CardContent>
        </Card>

        {/* Areas & Certifications */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">{isIT ? 'Zone di competenza' : 'Areas of expertise'}</h3>
              <div className="flex flex-wrap gap-2">
                {agent.areas.map(area => (
                  <Badge key={area} variant="secondary">{area}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">{isIT ? 'Certificazioni' : 'Certifications'}</h3>
              <div className="flex flex-wrap gap-2">
                {agent.certifications.map(cert => (
                  <Badge key={cert} variant="outline" className="text-primary border-primary/30">
                    <Award className="h-3 w-3 mr-1" />{cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Listings (empty state) */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{isIT ? 'Annunci attivi' : 'Active Listings'}</h2>
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground">{isIT ? 'Nessun annuncio attivo al momento.' : 'No active listings at the moment.'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking CTA */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isIT ? 'Prenota un appuntamento' : 'Book an appointment'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isIT
                ? 'Vuoi visitare un immobile o ricevere una consulenza? Prenota direttamente.'
                : 'Want to visit a property or get a consultation? Book directly.'}
            </p>
            <Button size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              {isIT ? 'Prenota Visita' : 'Book Visit'}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>{isIT ? 'Pagina agente su' : 'Agent page on'} <Link href="/" className="text-primary hover:underline">PropertyPilot AI</Link></p>
        </div>
      </div>
    </div>
  );
}
