'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation } from '@/lib/i18n/dictionary';
import {
  Search, BookOpen, Sparkles, BarChart3, Phone, MessageSquare,
  Shield, FileText, Globe, CreditCard, Settings, Zap,
  ChevronRight, ExternalLink, ThumbsUp, ThumbsDown, ArrowLeft,
  HelpCircle, Video, Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
}

const CATEGORIES = [
  { id: 'getting-started', icon: BookOpen, label: 'Getting Started', color: 'text-blue-500' },
  { id: 'ai-listings', icon: Sparkles, label: 'AI Listings', color: 'text-purple-500' },
  { id: 'crm-leads', icon: BarChart3, label: 'CRM & Leads', color: 'text-green-500' },
  { id: 'voice-agent', icon: Phone, label: 'Voice Agent', color: 'text-orange-500' },
  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp AI', color: 'text-emerald-500' },
  { id: 'compliance', icon: Shield, label: 'Compliance', color: 'text-red-500' },
  { id: 'documents', icon: FileText, label: 'Document AI', color: 'text-yellow-500' },
  { id: 'portals', icon: Globe, label: 'Portal Connections', color: 'text-cyan-500' },
  { id: 'billing', icon: CreditCard, label: 'Billing & Plans', color: 'text-pink-500' },
  { id: 'visual-ai', icon: Zap, label: 'Visual AI', color: 'text-violet-500' },
  { id: 'integrations', icon: Settings, label: 'Integrations', color: 'text-slate-500' },
  { id: 'marketplace', icon: Globe, label: 'Marketplace', color: 'text-teal-500' },
];

const ARTICLES: HelpArticle[] = [
  // Getting Started
  { id: '1', title: 'Create your first AI listing in 60 seconds', summary: 'Step-by-step guide to generating your first professional property description with AI.', category: 'getting-started', tags: ['tutorial', 'beginner'] },
  { id: '2', title: 'Understanding your dashboard', summary: 'Tour of the main dashboard sections: overview, activity feed, quick actions, and usage meters.', category: 'getting-started', tags: ['tutorial', 'dashboard'] },
  { id: '3', title: 'Setting up your agency profile', summary: 'Configure your agency name, logo, brand colors, contact information, and team members.', category: 'getting-started', tags: ['setup', 'branding'] },
  { id: '4', title: 'Choosing the right plan for your agency', summary: 'Compare Free, Starter, Pro, and Agency plans. Find the features that match your business needs.', category: 'getting-started', tags: ['plans', 'pricing'] },
  { id: '5', title: 'Quick start checklist for new users', summary: 'Complete these 7 steps in your first day to unlock the full power of PropertyPilot AI.', category: 'getting-started', tags: ['tutorial', 'checklist'] },
  // AI Listings
  { id: '6', title: 'How AI listing generation works', summary: 'Under the hood: GPT-4o analyzes your property data and generates portal-optimized descriptions in 3 styles.', category: 'ai-listings', tags: ['ai', 'technical'] },
  { id: '7', title: 'Choosing the right listing style', summary: 'When to use Standard Pro, Luxury, or Investment writing styles for maximum impact.', category: 'ai-listings', tags: ['ai', 'copywriting'] },
  { id: '8', title: 'Multi-language listing translation', summary: 'Auto-translate your listings into 12 languages while preserving real estate terminology.', category: 'ai-listings', tags: ['translation', 'multilingual'] },
  { id: '9', title: 'Refining AI-generated content', summary: 'Tips for fine-tuning AI outputs: adjusting tone, adding local details, and ensuring accuracy.', category: 'ai-listings', tags: ['ai', 'editing'] },
  { id: '10', title: 'Using brand voice for consistent copy', summary: 'Train the AI to write in your agency style with Brand Voice profiles and example listings.', category: 'ai-listings', tags: ['branding', 'ai'] },
  // CRM & Leads
  { id: '11', title: 'Lead scoring explained', summary: 'How the 5-category AI scoring system (engagement, recency, intent, profile, behavior) ranks your leads 0-100.', category: 'crm-leads', tags: ['leads', 'scoring'] },
  { id: '12', title: 'Setting up Speed-to-Lead automation', summary: 'Configure automatic actions when hot leads come in: call, WhatsApp, or email within seconds.', category: 'crm-leads', tags: ['automation', 'leads'] },
  { id: '13', title: 'Managing your lead pipeline', summary: 'Kanban boards, status transitions, bulk operations, and assignment to team agents.', category: 'crm-leads', tags: ['crm', 'pipeline'] },
  { id: '14', title: 'Importing leads from CSV or Excel', summary: 'Bulk import with smart column mapping, duplicate detection, and validation reporting.', category: 'crm-leads', tags: ['import', 'data'] },
  { id: '15', title: 'Follow-up email automation', summary: 'Set up drip sequences triggered by lead actions: post-viewing, cold nurture, market updates.', category: 'crm-leads', tags: ['email', 'automation'] },
  // Voice Agent
  { id: '16', title: 'Setting up Voice Agent AI', summary: 'Configure Bland AI for outbound calls: select language, pathway, and voice style.', category: 'voice-agent', tags: ['voice', 'setup'] },
  { id: '17', title: 'Understanding call pathways', summary: 'Three pathway types: inbound inquiry, lead callback, and viewing booking. How each works.', category: 'voice-agent', tags: ['voice', 'pathways'] },
  { id: '18', title: 'Voice cloning for your agency', summary: 'Agency plan: clone your voice with ElevenLabs for brand-consistent automated calls.', category: 'voice-agent', tags: ['voice', 'agency'] },
  // WhatsApp
  { id: '19', title: 'Connecting WhatsApp Business', summary: 'Link your Meta Business account, configure webhook, and submit message templates for approval.', category: 'whatsapp', tags: ['whatsapp', 'setup'] },
  { id: '20', title: 'WhatsApp AI auto-replies', summary: 'How intent classification detects buyer needs and generates contextual responses in 6 languages.', category: 'whatsapp', tags: ['whatsapp', 'ai'] },
  // Compliance
  { id: '21', title: 'Compliance Shield overview', summary: 'How PropertyPilot checks 35+ rules across 6 EU countries before you publish a listing.', category: 'compliance', tags: ['compliance', 'eu'] },
  { id: '22', title: 'Italy: APE and conformità requirements', summary: 'Required energy certification, building conformity, and cadastral documentation for Italian listings.', category: 'compliance', tags: ['italy', 'compliance'] },
  { id: '23', title: 'France: DPE, Loi Carrez, and Loi ALUR', summary: 'French energy performance, exact surface measurement, and mandatory disclosure requirements.', category: 'compliance', tags: ['france', 'compliance'] },
  // Documents
  { id: '24', title: 'Extracting data from property documents', summary: 'Upload PDFs, photos, or scans. GPT-4o Vision extracts 48 structured fields automatically.', category: 'documents', tags: ['documents', 'ai'] },
  // Portals
  { id: '25', title: 'Connecting your first portal', summary: 'Step-by-step guide to connecting Immobiliare.it, Idealista, or other portals.', category: 'portals', tags: ['portals', 'setup'] },
  { id: '26', title: 'Portal-specific formatting rules', summary: 'Each portal has unique requirements. Learn how PropertyPilot auto-formats your listings.', category: 'portals', tags: ['portals', 'formatting'] },
  // Billing
  { id: '27', title: 'Understanding your invoice and VAT', summary: 'How EU VAT is calculated, where to find invoices, and how to add your VAT ID for B2B.', category: 'billing', tags: ['billing', 'vat'] },
  { id: '28', title: 'Upgrading or downgrading your plan', summary: 'How prorated billing works when you change plans mid-cycle.', category: 'billing', tags: ['billing', 'plans'] },
  { id: '29', title: 'Cancellation and refund policy', summary: 'How to cancel, what happens to your data, and our 30-day money-back guarantee.', category: 'billing', tags: ['billing', 'cancel'] },
  // Visual AI
  { id: '30', title: 'Virtual staging: empty rooms to furnished', summary: 'Upload photos of empty rooms and let AI furnish them in 6 different styles.', category: 'visual-ai', tags: ['visual', 'staging'] },
  { id: '31', title: 'Photo enhancement: HDR, sky replacement', summary: 'Enhance property photos with HDR, blue sky, twilight, and clutter removal.', category: 'visual-ai', tags: ['visual', 'enhancement'] },
];

export default function HelpCenterPage() {
  const { locale } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(article => {
      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(t => t.includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const titles: Record<string, { title: string; subtitle: string; search: string; contact: string; noResults: string }> = {
    it: { title: 'Centro Assistenza', subtitle: 'Trova risposte, guide e tutorial per PropertyPilot AI', search: 'Cerca articoli, guide, tutorial...', contact: 'Contatta il Supporto', noResults: 'Nessun articolo trovato. Prova a modificare la ricerca.' },
    en: { title: 'Help Center', subtitle: 'Find answers, guides, and tutorials for PropertyPilot AI', search: 'Search articles, guides, tutorials...', contact: 'Contact Support', noResults: 'No articles found. Try adjusting your search.' },
    fr: { title: "Centre d'aide", subtitle: 'Trouvez des réponses, guides et tutoriels pour PropertyPilot AI', search: 'Rechercher articles, guides...', contact: 'Contacter le Support', noResults: 'Aucun article trouvé. Essayez de modifier votre recherche.' },
    es: { title: 'Centro de Ayuda', subtitle: 'Encuentra respuestas, guías y tutoriales para PropertyPilot AI', search: 'Buscar artículos, guías, tutoriales...', contact: 'Contactar Soporte', noResults: 'No se encontraron artículos. Intenta ajustar tu búsqueda.' },
    de: { title: 'Hilfezentrum', subtitle: 'Antworten, Anleitungen und Tutorials für PropertyPilot AI', search: 'Artikel, Anleitungen suchen...', contact: 'Support kontaktieren', noResults: 'Keine Artikel gefunden. Versuche, deine Suche anzupassen.' },
    pt: { title: 'Centro de Ajuda', subtitle: 'Encontre respostas, guias e tutoriais para PropertyPilot AI', search: 'Pesquisar artigos, guias...', contact: 'Contactar Suporte', noResults: 'Nenhum artigo encontrado. Tente ajustar a sua pesquisa.' },
  };

  const t = titles[locale] ?? titles.en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            PropertyPilot AI
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-3">{t.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t.subtitle}</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="pl-12 h-12 text-base bg-background/10 backdrop-blur border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
                  isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : cat.color}`} />
                <span className="text-xs font-medium leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Articles */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <Card className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t.noResults}</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/contact">{t.contact}</Link>
              </Button>
            </Card>
          ) : (
            filteredArticles.map(article => (
              <Card key={article.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{article.summary}</p>
                    <div className="flex gap-2 mt-2">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'it' ? "Non trovi quello che cerchi?" : "Can't find what you're looking for?"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {locale === 'it'
                ? "Il nostro team di supporto è pronto ad aiutarti."
                : "Our support team is ready to help you."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/contact">{t.contact}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/demo">
                  <Video className="h-4 w-4 mr-2" />
                  {locale === 'it' ? 'Prenota Demo' : 'Book Demo'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
