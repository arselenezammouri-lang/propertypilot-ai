'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { ArrowLeft, Code, Key, Zap, Shield, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v1/health', description: 'Health check — returns API status', auth: false },
  { method: 'GET', path: '/api/v1/listings', description: 'List all listings (paginated)', auth: true },
  { method: 'POST', path: '/api/v1/listings', description: 'Create a new listing', auth: true },
  { method: 'GET', path: '/api/v1/leads', description: 'List leads (filter by status)', auth: true },
  { method: 'POST', path: '/api/v1/leads', description: 'Create a new lead', auth: true },
  { method: 'POST', path: '/api/social/publish', description: 'Publish to social platforms', auth: true },
  { method: 'POST', path: '/api/climate-risk', description: 'Get climate risk score for coordinates', auth: false },
  { method: 'POST', path: '/api/generate', description: 'Generate AI property description', auth: true },
  { method: 'POST', path: '/api/lead-score', description: 'Score a lead (0-100)', auth: true },
  { method: 'POST', path: '/api/cma/generate', description: 'Generate CMA valuation report', auth: true },
  { method: 'POST', path: '/api/compliance/check', description: 'Run compliance check on listing', auth: true },
];

export default function ApiDocsPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const isIT = locale === 'it';

  const copyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast({ title: isIT ? 'Copiato!' : 'Copied!' });
  };

  const curlExample = `curl -X GET https://propertypilot-ai.vercel.app/api/v1/listings \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const nodeExample = `const response = await fetch('https://propertypilot-ai.vercel.app/api/v1/listings', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
const { data, pagination } = await response.json();`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />Docs
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Code className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">REST API v1</h1>
            <p className="text-muted-foreground">{isIT ? 'Documentazione API per il piano Agency' : 'API documentation for Agency plan'}</p>
          </div>
          <Badge className="ml-auto">Agency</Badge>
        </div>

        {/* Auth */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Key className="h-5 w-5 text-primary" />{isIT ? 'Autenticazione' : 'Authentication'}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{isIT ? 'Usa il tuo API key nell\'header Authorization:' : 'Use your API key in the Authorization header:'}</p>
            <div className="bg-muted rounded-lg p-3 font-mono text-sm flex items-center justify-between">
              <code>Authorization: Bearer YOUR_API_KEY</code>
              <Button variant="ghost" size="sm" onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY')}><Copy className="h-3 w-3" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{isIT ? 'Genera la tua API key in Dashboard → Settings → API Keys' : 'Generate your API key in Dashboard → Settings → API Keys'}</p>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{isIT ? 'Endpoint Disponibili' : 'Available Endpoints'}</h2>
        <div className="space-y-3 mb-8">
          {API_ENDPOINTS.map(ep => (
            <Card key={`${ep.method}-${ep.path}`} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <Badge variant={ep.method === 'GET' ? 'secondary' : 'default'} className={`font-mono text-xs w-14 justify-center ${ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : ''}`}>
                  {ep.method}
                </Badge>
                <code className="text-sm font-mono text-foreground flex-1">{ep.path}</code>
                <span className="text-sm text-muted-foreground hidden md:block">{ep.description}</span>
                {ep.auth && <Shield className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Examples */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{isIT ? 'Esempi' : 'Examples'}</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-mono">cURL</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copyCode(curlExample)}><Copy className="h-3 w-3 mr-1" />{isIT ? 'Copia' : 'Copy'}</Button>
            </CardHeader>
            <CardContent><pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{curlExample}</pre></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-mono">Node.js</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copyCode(nodeExample)}><Copy className="h-3 w-3 mr-1" />{isIT ? 'Copia' : 'Copy'}</Button>
            </CardHeader>
            <CardContent><pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{nodeExample}</pre></CardContent>
          </Card>
        </div>

        {/* Rate Limits */}
        <Card className="mt-8">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500" />{isIT ? 'Rate Limits' : 'Rate Limits'}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">{isIT ? 'Richieste per ora' : 'Requests per hour'}:</span> <span className="font-mono text-foreground">1,000</span></div>
              <div><span className="text-muted-foreground">{isIT ? 'Richieste per minuto' : 'Requests per minute'}:</span> <span className="font-mono text-foreground">60</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
