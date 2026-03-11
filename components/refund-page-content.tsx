"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { RefreshCw, Clock, CheckCircle, AlertTriangle, Mail, CreditCard, XCircle } from "lucide-react";

export function RefundPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const copy = isItalian
    ? {
        title: "Politica di",
        highlight: "Rimborso",
        updated: "Ultimo aggiornamento: Dicembre 2024",
        guaranteeTitle: "La Nostra Garanzia",
        guaranteeBodyStart: "Siamo sicuri della qualita di PropertyPilot AI. Per questo offriamo una",
        guaranteeBodyStrong: "garanzia soddisfatti o rimborsati di 14 giorni",
        guaranteeBodyEnd: "su tutti i nuovi abbonamenti. Se non sei soddisfatto, ti rimborsiamo senza fare domande.",
        trialTitle: "1. Periodo di Prova e Rimborso",
        freeTrialTitle: "Prova Gratuita 7 Giorni",
        freeTrialBody: "Tutti i piani includono 7 giorni di prova gratuita. Nessuna carta di credito richiesta per iniziare. Puoi annullare in qualsiasi momento durante il periodo di prova senza alcun addebito.",
        guarantee14Title: "Garanzia 14 Giorni",
        guarantee14Body: "Se dopo la prova attivi un abbonamento e non sei soddisfatto, puoi richiedere un rimborso completo entro 14 giorni dalla data del primo pagamento.",
        conditionsTitle: "2. Condizioni per il Rimborso",
        conditionsIntro: "Per ottenere un rimborso devi:",
        conditions: [
          "Richiedere il rimborso entro 14 giorni dal primo pagamento",
          "Essere alla prima sottoscrizione (non si applica ai rinnovi)",
          "Non aver violato i Termini di Servizio",
          "Contattarci via email con la richiesta",
        ],
        nonRefundableTitle: "3. Casi Non Rimborsabili",
        nonRefundableIntro: "Il rimborso non e applicabile nei seguenti casi:",
        nonRefundable: [
          "Richiesta dopo 14 giorni dal pagamento",
          "Rinnovi automatici (puoi cancellare prima del rinnovo)",
          "Pacchetto Agency Boost (servizio one-time gia erogato)",
          "Account sospesi per violazione dei termini",
          "Abbonamenti precedenti gia rimborsati",
        ],
        cancelTitle: "4. Cancellazione Abbonamento",
        cancelIntro: "Puoi cancellare il tuo abbonamento in qualsiasi momento:",
        cancelSteps: [
          "Accedi alla tua Dashboard",
          'Vai alla sezione "Billing" o "Abbonamento"',
          'Clicca su "Cancella Abbonamento"',
          "Conferma la cancellazione",
        ],
        cancelImportant: "Importante:",
        cancelImportantBody: "La cancellazione avra effetto alla fine del periodo di fatturazione corrente. Continuerai ad avere accesso al servizio fino a quella data.",
        processTitle: "5. Processo di Rimborso",
        process: [
          {
            step: "1",
            title: "Invia la Richiesta",
            body: 'Contattaci via email con oggetto "Richiesta Rimborso" specificando il tuo account.',
          },
          {
            step: "2",
            title: "Verifica",
            body: "Verificheremo che la richiesta rispetti le condizioni (1-2 giorni lavorativi).",
          },
          {
            step: "3",
            title: "Elaborazione",
            body: "Il rimborso viene elaborato tramite Stripe (5-10 giorni per apparire sul conto).",
          },
          {
            step: "✓",
            title: "Completato",
            body: "Riceverai conferma via email quando il rimborso sara processato.",
          },
        ],
        boostTitle: "6. Agency Boost - Politica Speciale",
        boostIntro: "Il pacchetto",
        boostBody: "e un servizio one-time di implementazione personalizzata. Data la natura del servizio:",
        boostRules: [
          "Non e rimborsabile una volta iniziata l'implementazione",
          "E possibile annullare entro 48 ore dall'ordine se il lavoro non e ancora iniziato",
          "Eventuali problemi verranno risolti con supporto aggiuntivo gratuito",
        ],
        contactTitle: "7. Contattaci",
        contactIntro: "Per richieste di rimborso o domande:",
        refundEmail: "Email rimborsi:",
        supportEmail: "Supporto generale:",
        contactOutro: "Rispondiamo a tutte le richieste entro 24-48 ore lavorative.",
        terms: "Termini e Condizioni",
        privacy: "Privacy Policy",
        pricing: "Vedi i Piani",
      }
    : {
        title: "Refund",
        highlight: "Policy",
        updated: "Last updated: December 2024",
        guaranteeTitle: "Our Guarantee",
        guaranteeBodyStart: "We are confident in the quality of PropertyPilot AI. That is why we offer a",
        guaranteeBodyStrong: "14-day money-back guarantee",
        guaranteeBodyEnd: "on all new subscriptions. If you are not satisfied, we will refund you with no hassle.",
        trialTitle: "1. Trial and Refund Window",
        freeTrialTitle: "7-Day Free Trial",
        freeTrialBody: "All plans include a 7-day free trial. No credit card required to get started. You can cancel at any time during the trial period with no charge.",
        guarantee14Title: "14-Day Guarantee",
        guarantee14Body: "If you activate a subscription after the trial and you are not satisfied, you can request a full refund within 14 days of the first payment date.",
        conditionsTitle: "2. Refund Conditions",
        conditionsIntro: "To obtain a refund you must:",
        conditions: [
          "Request the refund within 14 days of the first payment",
          "Be on your first subscription term (renewals are excluded)",
          "Not have violated the Terms of Service",
          "Contact us by email with the request",
        ],
        nonRefundableTitle: "3. Non-Refundable Cases",
        nonRefundableIntro: "Refunds do not apply in the following cases:",
        nonRefundable: [
          "Request submitted after 14 days from payment",
          "Automatic renewals (you can cancel before renewal)",
          "Agency Boost package (one-time service already delivered)",
          "Accounts suspended for terms violations",
          "Previous subscriptions already refunded",
        ],
        cancelTitle: "4. Subscription Cancellation",
        cancelIntro: "You can cancel your subscription at any time:",
        cancelSteps: [
          "Log in to your dashboard",
          'Go to the "Billing" or "Subscription" section',
          'Click "Cancel Subscription"',
          "Confirm the cancellation",
        ],
        cancelImportant: "Important:",
        cancelImportantBody: "Cancellation takes effect at the end of the current billing period. You will keep access to the service until that date.",
        processTitle: "5. Refund Process",
        process: [
          {
            step: "1",
            title: "Send the Request",
            body: 'Contact us by email with the subject "Refund Request" and specify your account.',
          },
          {
            step: "2",
            title: "Verification",
            body: "We will verify that the request meets the conditions (1-2 business days).",
          },
          {
            step: "3",
            title: "Processing",
            body: "The refund is processed through Stripe (5-10 days to appear in your account).",
          },
          {
            step: "✓",
            title: "Completed",
            body: "You will receive an email confirmation when the refund has been processed.",
          },
        ],
        boostTitle: "6. Agency Boost - Special Policy",
        boostIntro: "The",
        boostBody: "package is a one-time personalized implementation service. Because of the nature of the service:",
        boostRules: [
          "It is not refundable once implementation has started",
          "It can be canceled within 48 hours of the order if work has not started yet",
          "Any delivery issues will be resolved with additional support at no extra cost",
        ],
        contactTitle: "7. Contact Us",
        contactIntro: "For refund requests or questions:",
        refundEmail: "Refund email:",
        supportEmail: "General support:",
        contactOutro: "We reply to all requests within 24-48 business hours.",
        terms: "Terms and Conditions",
        privacy: "Privacy Policy",
        pricing: "View Pricing",
      };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#fbbf24]/50 bg-[#fbbf24]/10 flex items-center justify-center">
            <RefreshCw className="h-7 w-7 text-[#fbbf24]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-refund">
              {copy.title} <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">{copy.highlight}</span>
            </h1>
            <p className="text-white/60">{copy.updated}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-neon-aqua flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">{copy.guaranteeTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {copy.guaranteeBodyStart} <strong className="text-neon-aqua">{copy.guaranteeBodyStrong}</strong>{" "}
                {copy.guaranteeBodyEnd}
              </p>
            </div>
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-electric-blue" />
            {copy.trialTitle}
          </h2>
          <div className="space-y-4">
            <div className="bg-electric-blue/5 p-4 rounded-lg border border-electric-blue/20">
              <h3 className="font-semibold text-electric-blue mb-2">{copy.freeTrialTitle}</h3>
              <p className="text-muted-foreground text-sm">{copy.freeTrialBody}</p>
            </div>
            <div className="bg-neon-aqua/5 p-4 rounded-lg border border-neon-aqua/20">
              <h3 className="font-semibold text-neon-aqua mb-2">{copy.guarantee14Title}</h3>
              <p className="text-muted-foreground text-sm">{copy.guarantee14Body}</p>
            </div>
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-sunset-gold" />
            {copy.conditionsTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{copy.conditionsIntro}</p>
          <ul className="space-y-3">
            {copy.conditions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            {copy.nonRefundableTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{copy.nonRefundableIntro}</p>
          <ul className="space-y-3">
            {copy.nonRefundable.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">{copy.cancelTitle}</h2>
          <p className="text-muted-foreground leading-relaxed">{copy.cancelIntro}</p>
          <ol className="list-decimal list-inside text-muted-foreground mt-4 space-y-2">
            {copy.cancelSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <strong>{copy.cancelImportant}</strong> {copy.cancelImportantBody}
          </p>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">{copy.processTitle}</h2>
          <div className="space-y-4">
            {copy.process.map((item) => (
              <div key={`${item.step}-${item.title}`} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.step === "✓" ? "bg-neon-aqua/20 text-neon-aqua" : "bg-royal-purple/20 text-royal-purple"}`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {copy.boostTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {copy.boostIntro} <strong>Agency Boost (EUR 2,497)</strong> {copy.boostBody}
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
            {copy.boostRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl border-2 border-royal-purple/30">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-royal-purple" />
            {copy.contactTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{copy.contactIntro}</p>
          <ul className="text-muted-foreground mt-4 space-y-2">
            <li>
              <strong>{copy.refundEmail}</strong>{" "}
              <a href="mailto:billing@propertypilotai.com" className="text-royal-purple hover:underline">
                billing@propertypilotai.com
              </a>
            </li>
            <li>
              <strong>{copy.supportEmail}</strong>{" "}
              <a href="mailto:support@propertypilotai.com" className="text-royal-purple hover:underline">
                support@propertypilotai.com
              </a>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">{copy.contactOutro}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/terms">
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            {copy.terms}
          </Button>
        </Link>
        <Link href="/privacy">
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            {copy.privacy}
          </Button>
        </Link>
        <Link href="/pricing">
          <Button className="neon-button gap-2">
            {copy.pricing}
          </Button>
        </Link>
      </div>
    </main>
  );
}
