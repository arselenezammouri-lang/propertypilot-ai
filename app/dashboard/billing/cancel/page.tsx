'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  ArrowLeft, AlertTriangle, Gift, Clock, MessageSquare,
  CheckCircle2, Download, Heart, Zap, ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type CancelReason = 'expensive' | 'missing_feature' | 'not_using' | 'competitor' | 'other';
type Step = 'reason' | 'retention' | 'confirm' | 'done';

const RETENTION_OFFERS: Record<CancelReason, { icon: typeof Gift; offer: { it: string; en: string }; cta: { it: string; en: string } }> = {
  expensive: {
    icon: Gift,
    offer: { it: 'Capisco il budget! Ti offro 50% di sconto per i prossimi 3 mesi.', en: "I understand budgets are tight! Here's 50% off for the next 3 months." },
    cta: { it: 'Accetta 50% sconto', en: 'Accept 50% off' },
  },
  missing_feature: {
    icon: Sparkles,
    offer: { it: 'La funzionalità che cerchi potrebbe essere già in sviluppo! Dai un\'occhiata alla nostra roadmap.', en: 'The feature you need might already be in development! Check our roadmap.' },
    cta: { it: 'Vedi Roadmap', en: 'View Roadmap' },
  },
  not_using: {
    icon: Clock,
    offer: { it: 'Nessun problema! Possiamo mettere in pausa il tuo abbonamento per 1 mese — gratis.', en: "No problem! We can pause your subscription for 1 month — free." },
    cta: { it: 'Pausa 1 mese gratis', en: 'Pause 1 month free' },
  },
  competitor: {
    icon: Zap,
    offer: { it: 'PropertyPilot AI è l\'unica piattaforma con AI Listings + Voice Agent + Compliance Shield + 16 portali EU. Nessun altro offre tutto questo.', en: "PropertyPilot AI is the only platform with AI Listings + Voice Agent + Compliance Shield + 16 EU portals. No competitor offers all of this." },
    cta: { it: 'Confronta funzionalità', en: 'Compare features' },
  },
  other: {
    icon: MessageSquare,
    offer: { it: 'Mi piacerebbe capire meglio. Il fondatore Arslene ti invierà un\'email personale entro 24 ore.', en: "I'd love to understand better. Founder Arslene will send you a personal email within 24 hours." },
    cta: { it: 'Parla con il fondatore', en: 'Talk to the founder' },
  },
};

export default function CancelPage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('reason');
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [feedback, setFeedback] = useState('');
  const isIT = locale === 'it';

  const handleConfirmCancel = () => {
    // In production: POST to /api/stripe/cancel-subscription
    setStep('done');
    toast({ title: isIT ? 'Abbonamento cancellato' : 'Subscription cancelled', description: isIT ? 'Accesso attivo fino alla fine del periodo corrente.' : 'Access remains active until end of current period.' });
  };

  const reasons: { value: CancelReason; label: string }[] = [
    { value: 'expensive', label: isIT ? 'Troppo costoso per il mio budget' : 'Too expensive for my budget' },
    { value: 'missing_feature', label: isIT ? 'Manca una funzionalità che mi serve' : 'Missing a feature I need' },
    { value: 'not_using', label: isIT ? 'Non lo sto usando abbastanza' : "I'm not using it enough" },
    { value: 'competitor', label: isIT ? 'Sto passando a un altro strumento' : "I'm switching to another tool" },
    { value: 'other', label: isIT ? 'Altro motivo' : 'Other reason' },
  ];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Link href="/dashboard/billing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />{isIT ? 'Torna alla fatturazione' : 'Back to billing'}
      </Link>

      {/* Step 1: Reason */}
      {step === 'reason' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-foreground">{isIT ? 'Ci dispiace vederti andare' : "We're sorry to see you go"}</h1>
          </div>
          <p className="text-muted-foreground">{isIT ? 'Prima di procedere, ci dici perché? Il tuo feedback ci aiuta a migliorare.' : 'Before you go, can you tell us why? Your feedback helps us improve.'}</p>

          <div className="space-y-2">
            {reasons.map(r => (
              <button
                key={r.value}
                onClick={() => { setReason(r.value); setStep('retention'); }}
                className={`w-full p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-muted/30 ${reason === r.value ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <span className="text-foreground font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Retention Offer */}
      {step === 'retention' && reason && (
        <div className="space-y-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              {(() => { const Icon = RETENTION_OFFERS[reason].icon; return <Icon className="h-10 w-10 text-primary mx-auto mb-4" />; })()}
              <h2 className="text-lg font-semibold text-foreground mb-3">{isIT ? 'Aspetta! Abbiamo un\'offerta per te' : 'Wait! We have an offer for you'}</h2>
              <p className="text-muted-foreground mb-6">
                {isIT ? RETENTION_OFFERS[reason].offer.it : RETENTION_OFFERS[reason].offer.en}
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => { toast({ title: isIT ? 'Offerta accettata!' : 'Offer accepted!' }); }}>
                  <Heart className="h-4 w-4 mr-2" />
                  {isIT ? RETENTION_OFFERS[reason].cta.it : RETENTION_OFFERS[reason].cta.en}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep('confirm')}>
                  {isIT ? 'No grazie, voglio cancellare' : 'No thanks, I want to cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Final Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4">
          <Card className="border-red-500/30">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{isIT ? 'Conferma cancellazione' : 'Confirm cancellation'}</h2>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{isIT ? 'Accesso attivo fino alla fine del periodo pagato' : 'Access remains active until end of paid period'}</p>
                <p className="flex items-center gap-2"><Download className="h-4 w-4 text-blue-500" />{isIT ? 'Puoi esportare tutti i tuoi dati prima' : 'You can export all your data first'}</p>
                <p className="flex items-center gap-2"><Heart className="h-4 w-4 text-pink-500" />{isIT ? 'Puoi sempre riattivare in futuro' : 'You can always reactivate later'}</p>
              </div>
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-foreground">{isIT ? 'Feedback aggiuntivo (opzionale)' : 'Additional feedback (optional)'}</label>
                <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder={isIT ? 'Cosa potremmo fare meglio?' : 'What could we do better?'} rows={3} />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('retention')} className="flex-1">
                  {isIT ? 'Torna indietro' : 'Go back'}
                </Button>
                <Button variant="destructive" onClick={handleConfirmCancel} className="flex-1">
                  {isIT ? 'Conferma cancellazione' : 'Confirm cancellation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 'done' && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">{isIT ? 'Abbonamento cancellato' : 'Subscription cancelled'}</h2>
            <p className="text-muted-foreground mb-6">
              {isIT ? 'Il tuo accesso rimarrà attivo fino alla fine del periodo corrente. Puoi sempre riattivare dalla pagina Billing.' : 'Your access will remain active until the end of the current period. You can always reactivate from the Billing page.'}
            </p>
            <Button asChild>
              <Link href="/dashboard">{isIT ? 'Torna alla Dashboard' : 'Back to Dashboard'}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
