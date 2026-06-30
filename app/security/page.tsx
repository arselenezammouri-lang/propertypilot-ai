'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  Shield, Lock, Server, Eye, FileCheck, Users,
  ArrowLeft, CheckCircle2, Globe, Database, ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SUBPROCESSORS = [
  { name: 'Vercel', purpose: 'Hosting, CDN, Edge Functions', data: 'Request logs, static assets', location: 'Global (EU primary)', certs: ['SOC 2'] },
  { name: 'Supabase', purpose: 'Authentication, Database, Storage', data: 'User data, property data, files', location: 'EU (Ireland)', certs: ['SOC 2', 'ISO 27001'] },
  { name: 'Stripe', purpose: 'Payments, Subscriptions', data: 'Payment methods, billing addresses', location: 'EU', certs: ['PCI-DSS L1', 'SOC 2'] },
  { name: 'OpenAI', purpose: 'AI Text Generation', data: 'Property descriptions (anonymized)', location: 'US', certs: ['SOC 2'] },
  { name: 'Resend', purpose: 'Email Delivery', data: 'Email addresses, message content', location: 'US', certs: ['SOC 2'] },
  { name: 'Replicate', purpose: 'Visual AI (Staging, Enhancement)', data: 'Property photos', location: 'US', certs: [] },
  { name: 'Bland AI', purpose: 'Voice Agent Calls', data: 'Phone numbers, call transcripts', location: 'US', certs: [] },
  { name: 'Twilio', purpose: 'Phone Number Management', data: 'Phone numbers', location: 'Global', certs: ['SOC 2'] },
  { name: 'Meta/WhatsApp', purpose: 'WhatsApp Business API', data: 'Messages, phone numbers', location: 'Global', certs: ['SOC 2'] },
  { name: 'Sentry', purpose: 'Error Tracking', data: 'Error logs (no PII)', location: 'US', certs: ['SOC 2'] },
];

export default function SecurityPage() {
  const { locale } = useLocale();

  const isIT = locale === 'it';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          PropertyPilot AI
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold text-foreground">
              {isIT ? 'Sicurezza e Conformità' : 'Security & Compliance'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {isIT
              ? "La sicurezza dei tuoi dati è la nostra priorità. Ecco come proteggiamo la tua agenzia."
              : "Your data security is our top priority. Here's how we protect your agency."}
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Lock, title: 'AES-256', desc: isIT ? 'Crittografia a riposo' : 'Encryption at rest' },
            { icon: Shield, title: 'TLS 1.3', desc: isIT ? 'Crittografia in transito' : 'Encryption in transit' },
            { icon: Globe, title: isIT ? 'EU-Hosted' : 'EU-Hosted', desc: 'Supabase Ireland' },
            { icon: FileCheck, title: 'GDPR', desc: isIT ? 'Nativo per design' : 'Native by design' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4 text-center">
                  <Icon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security Measures */}
        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {isIT ? 'Sicurezza del Database' : 'Database Security'}
            </h2>
            <div className="space-y-2">
              {[
                isIT ? 'Row-Level Security (RLS) su OGNI tabella' : 'Row-Level Security (RLS) on EVERY table',
                isIT ? 'Nessun accesso diretto al database — solo API autenticate' : 'No direct database access — authenticated APIs only',
                isIT ? 'Query parametrizzate (zero SQL injection)' : 'Parameterized queries (zero SQL injection)',
                isIT ? 'Backup giornalieri automatici' : 'Automatic daily backups',
                isIT ? 'Point-in-Time Recovery disponibile' : 'Point-in-Time Recovery available',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {isIT ? 'Autenticazione e Sessioni' : 'Authentication & Sessions'}
            </h2>
            <div className="space-y-2">
              {[
                isIT ? 'Supabase Auth con hashing bcrypt' : 'Supabase Auth with bcrypt hashing',
                isIT ? 'Cookie httpOnly e SameSite=Strict' : 'httpOnly and SameSite=Strict cookies',
                isIT ? 'Rate limiting su tutti gli endpoint auth' : 'Rate limiting on all auth endpoints',
                isIT ? 'Protezione CSRF tramite cookie SameSite' : 'CSRF protection via SameSite cookies',
                isIT ? 'Nessun dato sensibile nel localStorage' : 'No sensitive data in localStorage',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {isIT ? 'Conformità GDPR' : 'GDPR Compliance'}
            </h2>
            <div className="space-y-2">
              {[
                isIT ? 'Diritto alla cancellazione: endpoint /api/gdpr' : 'Right to erasure: /api/gdpr endpoint',
                isIT ? 'Esportazione dati completa per ogni utente' : 'Full data export for every user',
                isIT ? 'Consenso granulare dei cookie' : 'Granular cookie consent',
                isIT ? 'Minimizzazione dei dati: raccogliamo solo ciò che serve' : 'Data minimization: we only collect what we need',
                isIT ? 'Infrastruttura EU-hosted (Vercel EU, Supabase Ireland)' : 'EU-hosted infrastructure (Vercel EU, Supabase Ireland)',
                isIT ? 'DPA disponibile per il piano Agency' : 'DPA available for Agency plan',
                isIT ? "Zero vendita di dati a terze parti" : "Zero data sold to third parties",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Subprocessors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isIT ? 'Sub-responsabili del trattamento' : 'Subprocessors'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-foreground">{isIT ? 'Servizio' : 'Service'}</th>
                  <th className="text-left py-3 px-2 font-medium text-foreground">{isIT ? 'Scopo' : 'Purpose'}</th>
                  <th className="text-left py-3 px-2 font-medium text-foreground">{isIT ? 'Localizzazione' : 'Location'}</th>
                  <th className="text-left py-3 px-2 font-medium text-foreground">{isIT ? 'Certificazioni' : 'Certifications'}</th>
                </tr>
              </thead>
              <tbody>
                {SUBPROCESSORS.map(sp => (
                  <tr key={sp.name} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">{sp.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{sp.purpose}</td>
                    <td className="py-3 px-2 text-muted-foreground">{sp.location}</td>
                    <td className="py-3 px-2">
                      {sp.certs.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {sp.certs.map(c => (
                            <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Report */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isIT ? 'Segnala una vulnerabilità' : 'Report a Vulnerability'}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {isIT
                ? 'Se scopri una vulnerabilità di sicurezza, segnalala in modo responsabile.'
                : 'If you discover a security vulnerability, please report it responsibly.'}
            </p>
            <Button asChild>
              <a href="mailto:security@propertypilotai.com">
                security@propertypilotai.com
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
