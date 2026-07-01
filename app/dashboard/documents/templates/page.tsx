'use client';

import { useState, useMemo } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  FileText, Search, Download, Copy, Globe,
  FileSignature, Shield, Home, Scale, Users,
  Filter, ChevronRight, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocTemplate {
  id: string;
  name: string;
  category: string;
  countries: string[];
  description: string;
  fields: number;
  esignReady: boolean;
}

const TEMPLATES: DocTemplate[] = [
  // Sale mandates
  { id: 'mandato-vendita-it', name: 'Mandato di Vendita', category: 'mandate', countries: ['IT'], description: 'Mandato di vendita immobiliare (FIAIP/FIMAA template)', fields: 18, esignReady: true },
  { id: 'mandat-vente-fr', name: 'Mandat de Vente', category: 'mandate', countries: ['FR'], description: 'Mandat exclusif ou simple de vente immobilière', fields: 16, esignReady: true },
  { id: 'contrato-mediacion-es', name: 'Contrato de Mediación', category: 'mandate', countries: ['ES'], description: 'Contrato de intermediación inmobiliaria', fields: 14, esignReady: true },
  { id: 'maklervertrag-de', name: 'Maklervertrag', category: 'mandate', countries: ['DE'], description: 'Alleinauftrag / einfacher Maklerauftrag', fields: 15, esignReady: true },
  { id: 'estate-agency-agreement-uk', name: 'Estate Agency Agreement', category: 'mandate', countries: ['UK'], description: 'Sole agency or multi-agency agreement', fields: 14, esignReady: true },
  { id: 'contrato-mediacao-pt', name: 'Contrato de Mediação', category: 'mandate', countries: ['PT'], description: 'Contrato de mediação imobiliária', fields: 13, esignReady: true },
  // Purchase proposals
  { id: 'proposta-acquisto-it', name: 'Proposta di Acquisto', category: 'purchase', countries: ['IT'], description: 'Proposta irrevocabile di acquisto con caparra confirmatoria', fields: 22, esignReady: true },
  { id: 'offre-achat-fr', name: "Offre d'Achat", category: 'purchase', countries: ['FR'], description: "Offre d'achat immobilière avec conditions suspensives", fields: 18, esignReady: true },
  { id: 'oferta-compra-es', name: 'Oferta de Compra', category: 'purchase', countries: ['ES'], description: 'Oferta de compra con señal y arras', fields: 16, esignReady: true },
  { id: 'kaufangebot-de', name: 'Kaufangebot', category: 'purchase', countries: ['DE'], description: 'Kaufangebot für Immobilien', fields: 15, esignReady: true },
  // Lease agreements
  { id: 'contratto-locazione-it', name: 'Contratto di Locazione', category: 'lease', countries: ['IT'], description: 'Contratto 4+4, 3+2, transitorio, studenti', fields: 24, esignReady: true },
  { id: 'bail-habitation-fr', name: "Bail d'Habitation", category: 'lease', countries: ['FR'], description: 'Bail habitation vide ou meublé (Loi ALUR)', fields: 22, esignReady: true },
  { id: 'contrato-arrendamiento-es', name: 'Contrato de Arrendamiento', category: 'lease', countries: ['ES'], description: 'Contrato de alquiler de vivienda (LAU)', fields: 20, esignReady: true },
  { id: 'mietvertrag-de', name: 'Mietvertrag', category: 'lease', countries: ['DE'], description: 'Mietvertrag für Wohnraum', fields: 21, esignReady: true },
  { id: 'tenancy-agreement-uk', name: 'Assured Shorthold Tenancy', category: 'lease', countries: ['UK'], description: 'AST agreement with deposit protection', fields: 18, esignReady: true },
  // Compliance & GDPR
  { id: 'privacy-consent', name: 'Privacy Consent (GDPR)', category: 'compliance', countries: ['IT', 'FR', 'ES', 'DE', 'UK', 'PT'], description: 'GDPR-compliant data processing consent form', fields: 8, esignReady: false },
  { id: 'nda-immobiliare', name: 'NDA Immobiliare', category: 'compliance', countries: ['IT', 'FR', 'ES', 'DE', 'UK', 'PT'], description: 'Non-disclosure agreement for property transactions', fields: 10, esignReady: true },
  { id: 'ape-checklist-it', name: 'APE Compliance Checklist', category: 'compliance', countries: ['IT'], description: 'Attestato Prestazione Energetica checklist', fields: 12, esignReady: false },
  { id: 'dpe-checklist-fr', name: 'DPE Compliance Checklist', category: 'compliance', countries: ['FR'], description: 'Diagnostic de Performance Énergétique checklist', fields: 12, esignReady: false },
  // Viewing & reports
  { id: 'visita-report', name: 'Viewing Report', category: 'report', countries: ['IT', 'FR', 'ES', 'DE', 'UK', 'PT'], description: 'Post-viewing feedback report template', fields: 10, esignReady: false },
  { id: 'cma-report-cover', name: 'CMA Report Cover', category: 'report', countries: ['IT', 'FR', 'ES', 'DE', 'UK', 'PT'], description: 'Branded cover page for CMA valuation reports', fields: 6, esignReady: false },
  { id: 'buyer-representation', name: 'Buyer Representation', category: 'mandate', countries: ['IT', 'FR', 'ES', 'DE', 'UK', 'PT'], description: 'Buyer exclusive representation agreement', fields: 14, esignReady: true },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: FileText },
  { id: 'mandate', label: 'Mandates', icon: FileSignature },
  { id: 'purchase', label: 'Purchase', icon: Home },
  { id: 'lease', label: 'Lease', icon: Scale },
  { id: 'compliance', label: 'GDPR/Compliance', icon: Shield },
  { id: 'report', label: 'Reports', icon: FileText },
];

export default function DocumentTemplatesPage() {
  const { locale } = useLocale();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const isIT = locale === 'it';

  const filtered = useMemo(() => TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || t.category === category;
    const matchCountry = countryFilter === 'all' || t.countries.includes(countryFilter);
    return matchSearch && matchCat && matchCountry;
  }), [search, category, countryFilter]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <FileText className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Template Documenti' : 'Document Templates'}</h1>
          <p className="text-muted-foreground">{isIT ? `${TEMPLATES.length} template legali multi-lingua pronti all'uso` : `${TEMPLATES.length} multi-language legal templates ready to use`}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={isIT ? 'Cerca template...' : 'Search templates...'} className="pl-10" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[140px]"><Globe className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isIT ? 'Tutti' : 'All'}</SelectItem>
            <SelectItem value="IT">🇮🇹 IT</SelectItem>
            <SelectItem value="FR">🇫🇷 FR</SelectItem>
            <SelectItem value="ES">🇪🇸 ES</SelectItem>
            <SelectItem value="DE">🇩🇪 DE</SelectItem>
            <SelectItem value="UK">🇬🇧 UK</SelectItem>
            <SelectItem value="PT">🇵🇹 PT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(template => (
          <Card key={template.id} className="hover:border-primary/30 transition-colors cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.countries.map(c => (
                  <Badge key={c} variant="outline" className="text-xs">{c === 'IT' ? '🇮🇹' : c === 'FR' ? '🇫🇷' : c === 'ES' ? '🇪🇸' : c === 'DE' ? '🇩🇪' : c === 'UK' ? '🇬🇧' : '🇵🇹'} {c}</Badge>
                ))}
                <Badge variant="secondary" className="text-xs">{template.fields} {isIT ? 'campi' : 'fields'}</Badge>
                {template.esignReady && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs border-emerald-500/30">
                    <FileSignature className="h-3 w-3 mr-1" />E-Sign
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {isIT ? `${filtered.length} di ${TEMPLATES.length} template visualizzati` : `${filtered.length} of ${TEMPLATES.length} templates shown`}
      </p>
    </div>
  );
}
