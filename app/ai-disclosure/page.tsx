'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { ArrowLeft, Bot, Brain, Eye, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AI_USES = [
  {
    feature: 'AI Listing Generation',
    model: 'GPT-4o (OpenAI)',
    purpose: 'Generate property descriptions from structured input data',
    input: 'Property type, location, size, rooms, features, price',
    output: 'Professional property description in selected language and style',
    humanReview: true,
    automated: false,
    risk: 'Low — creative writing assistance, always reviewed by agent',
  },
  {
    feature: 'Lead Scoring',
    model: 'GPT-4o-mini (OpenAI) + Heuristic Model',
    purpose: 'Score leads 0-100 based on engagement, intent, and profile',
    input: 'Lead interactions, message content, contact frequency',
    output: 'Numerical score (0-100) with category breakdown',
    humanReview: true,
    automated: false,
    risk: 'Low — scoring assists prioritization, does not make decisions',
  },
  {
    feature: 'Virtual Staging',
    model: 'SDXL (Replicate)',
    purpose: 'Add virtual furniture to photos of empty rooms',
    input: 'Room photo, style preference, room type',
    output: 'Staged room image',
    humanReview: true,
    automated: false,
    risk: 'Low — visual enhancement, clearly labeled as virtual',
  },
  {
    feature: 'Photo Enhancement',
    model: 'Real-ESRGAN, SDXL (Replicate)',
    purpose: 'Enhance property photos: HDR, sky replacement, declutter',
    input: 'Original property photo, enhancement type',
    output: 'Enhanced photo',
    humanReview: true,
    automated: false,
    risk: 'Low — photo improvement, original always preserved',
  },
  {
    feature: 'Voice Agent',
    model: 'Bland AI (Speech AI), ElevenLabs (Voice Synthesis)',
    purpose: 'Automated phone calls to qualify leads and book viewings',
    input: 'Lead phone number, property context, conversation pathway',
    output: 'Call transcript, meeting booking, lead status update',
    humanReview: true,
    automated: true,
    risk: 'Medium — caller is informed they are speaking with AI assistant',
  },
  {
    feature: 'WhatsApp AI',
    model: 'GPT-4o-mini (OpenAI)',
    purpose: 'Classify incoming message intent and generate contextual replies',
    input: 'Incoming WhatsApp message, conversation history',
    output: 'Intent classification, suggested reply (agent-approved or auto-sent)',
    humanReview: true,
    automated: true,
    risk: 'Low — messages clearly from business account, human handoff available',
  },
  {
    feature: 'Compliance Shield',
    model: 'GPT-4o (OpenAI) + Rule Engine',
    purpose: 'Check listings against country-specific regulatory requirements',
    input: 'Listing data, country, property type',
    output: 'Compliance report with errors, warnings, and suggestions',
    humanReview: true,
    automated: false,
    risk: 'Low — advisory tool, does not make legal decisions',
  },
  {
    feature: 'Document AI',
    model: 'GPT-4o Vision (OpenAI)',
    purpose: 'Extract structured data from scanned documents',
    input: 'Document image (energy certificate, mandate, ID)',
    output: '48 structured fields with confidence scores',
    humanReview: true,
    automated: false,
    risk: 'Low — extraction assistance, always verified by user',
  },
  {
    feature: 'Translation',
    model: 'GPT-4o (OpenAI)',
    purpose: 'Translate property listings preserving real estate terminology',
    input: 'Listing text, source language, target language',
    output: 'Translated listing text',
    humanReview: true,
    automated: false,
    risk: 'Low — translation tool, user reviews before publishing',
  },
  {
    feature: 'CMA Valuation',
    model: 'Heuristic AVM (Custom) + GPT-4o (OpenAI)',
    purpose: 'Estimate property value from comparable sales analysis',
    input: 'Property details, location, comparables',
    output: 'Estimated value range with confidence score',
    humanReview: true,
    automated: false,
    risk: 'Low — advisory estimate clearly labeled as AI-generated, not appraisal',
  },
];

export default function AiDisclosurePage() {
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
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {isIT ? 'Trasparenza sull\'Intelligenza Artificiale' : 'AI Transparency Disclosure'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {isIT
              ? 'Come PropertyPilot AI utilizza l\'intelligenza artificiale — in conformità con il Regolamento UE sull\'IA (AI Act).'
              : 'How PropertyPilot AI uses artificial intelligence — in compliance with the EU AI Act.'}
          </p>
          <Badge className="mt-3">EU AI Act Compliant</Badge>
        </div>

        {/* Principles */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {isIT ? 'I nostri principi AI' : 'Our AI Principles'}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                isIT ? 'Trasparenza: informiamo sempre quando l\'AI è coinvolta' : 'Transparency: we always inform when AI is involved',
                isIT ? 'Controllo umano: ogni output AI è revisionabile dall\'utente' : 'Human oversight: every AI output is reviewable by the user',
                isIT ? 'Nessuna decisione automatizzata senza supervisione' : 'No automated decision-making without oversight',
                isIT ? 'Dati non utilizzati per addestrare modelli di terze parti' : 'Data not used to train third-party models',
                isIT ? 'Opt-out disponibile per tutte le funzionalità AI' : 'Opt-out available for all AI features',
                isIT ? 'Privacy by design in ogni funzionalità' : 'Privacy by design in every feature',
              ].map((principle, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{principle}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Uses */}
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {isIT ? 'Dove utilizziamo l\'AI' : 'Where We Use AI'}
        </h2>

        <div className="space-y-4">
          {AI_USES.map(use => (
            <Card key={use.feature} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{use.feature}</h3>
                    <p className="text-sm text-muted-foreground">{use.model}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {use.humanReview && (
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        {isIT ? 'Revisione umana' : 'Human review'}
                      </Badge>
                    )}
                    <Badge variant={use.risk.startsWith('Low') ? 'secondary' : 'outline'} className="text-xs">
                      {use.risk.split(' — ')[0]}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-medium text-foreground">{isIT ? 'Scopo: ' : 'Purpose: '}</span>
                    <span className="text-muted-foreground">{use.purpose}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Input: </span>
                    <span className="text-muted-foreground">{use.input}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Output: </span>
                    <span className="text-muted-foreground">{use.output}</span>
                  </div>
                  {use.automated && (
                    <div className="flex items-center gap-2 mt-1">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        {isIT
                          ? 'Questa funzionalità può operare automaticamente. L\'utente può disattivarla in qualsiasi momento.'
                          : 'This feature can operate automatically. Users can disable it at any time.'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Handling */}
        <Card className="mt-8 mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {isIT ? 'Gestione dei dati AI' : 'AI Data Handling'}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {isIT
                  ? "I dati inviati a modelli AI (OpenAI, Replicate) vengono utilizzati esclusivamente per generare l'output richiesto. Non vengono utilizzati per addestrare modelli di terze parti."
                  : "Data sent to AI models (OpenAI, Replicate) is used exclusively to generate the requested output. It is not used to train third-party models."}
              </p>
              <p>
                {isIT
                  ? "OpenAI API: con il piano API enterprise, i dati non vengono utilizzati per il training. Retention: 30 giorni per monitoraggio abusi, poi eliminati."
                  : "OpenAI API: with the enterprise API plan, data is not used for training. Retention: 30 days for abuse monitoring, then deleted."}
              </p>
              <p>
                {isIT
                  ? "I risultati AI (descrizioni, punteggi, immagini) sono archiviati nel database Supabase dell'utente e protetti da RLS."
                  : "AI outputs (descriptions, scores, images) are stored in the user's Supabase database and protected by RLS."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground text-center">
          {isIT
            ? 'Ultimo aggiornamento: Giugno 2026. Questa pagina viene aggiornata quando vengono aggiunte nuove funzionalità AI.'
            : 'Last updated: June 2026. This page is updated when new AI features are added.'}
        </p>
      </div>
    </div>
  );
}
