import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { RefreshCw, Clock, CheckCircle, AlertTriangle, Mail, CreditCard, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Politica di Rimborso | PropertyPilot AI",
  description: "Informazioni sulla politica di rimborso e cancellazione abbonamenti di PropertyPilot AI.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-[#fbbf24]/50 bg-[#fbbf24]/10 flex items-center justify-center">
              <RefreshCw className="h-7 w-7 text-[#fbbf24]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-refund">
                Politica di <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">Rimborso</span>
              </h1>
              <p className="text-white/60">Ultimo aggiornamento: Dicembre 2024</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl border border-white/[0.08]">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-8 w-8 text-neon-aqua flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">La Nostra Garanzia</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Siamo sicuri della qualità di PropertyPilot AI. Per questo offriamo una 
                  <strong className="text-neon-aqua"> garanzia soddisfatti o rimborsati di 14 giorni</strong> 
                  {" "}su tutti i nuovi abbonamenti. Se non sei soddisfatto, ti rimborsiamo senza fare domande.
                </p>
              </div>
            </div>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-electric-blue" />
              1. Periodo di Prova e Rimborso
            </h2>
            <div className="space-y-4">
              <div className="bg-electric-blue/5 p-4 rounded-lg border border-electric-blue/20">
                <h3 className="font-semibold text-electric-blue mb-2">Prova Gratuita 7 Giorni</h3>
                <p className="text-muted-foreground text-sm">
                  Tutti i piani includono 7 giorni di prova gratuita. Nessuna carta di credito richiesta per iniziare.
                  Puoi annullare in qualsiasi momento durante il periodo di prova senza alcun addebito.
                </p>
              </div>
              <div className="bg-neon-aqua/5 p-4 rounded-lg border border-neon-aqua/20">
                <h3 className="font-semibold text-neon-aqua mb-2">Garanzia 14 Giorni</h3>
                <p className="text-muted-foreground text-sm">
                  Se dopo la prova attivi un abbonamento e non sei soddisfatto, puoi richiedere un rimborso 
                  completo entro 14 giorni dalla data del primo pagamento.
                </p>
              </div>
            </div>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-sunset-gold" />
              2. Condizioni per il Rimborso
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Per ottenere un rimborso devi:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Richiedere il rimborso entro 14 giorni dal primo pagamento</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Essere alla prima sottoscrizione (non si applica ai rinnovi)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Non aver violato i Termini di Servizio</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Contattarci via email con la richiesta</span>
              </li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              3. Casi Non Rimborsabili
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Il rimborso non è applicabile nei seguenti casi:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Richiesta dopo 14 giorni dal pagamento</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Rinnovi automatici (puoi cancellare prima del rinnovo)</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Pacchetto Agency Boost (servizio one-time già erogato)</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Account sospesi per violazione dei termini</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Abbonamenti precedenti già rimborsati</span>
              </li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">4. Cancellazione Abbonamento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Puoi cancellare il tuo abbonamento in qualsiasi momento:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground mt-4 space-y-2">
              <li>Accedi alla tua Dashboard</li>
              <li>Vai alla sezione "Billing" o "Abbonamento"</li>
              <li>Clicca su "Cancella Abbonamento"</li>
              <li>Conferma la cancellazione</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Importante:</strong> La cancellazione avrà effetto alla fine del periodo di fatturazione corrente. 
              Continuerai ad avere accesso al servizio fino a quella data.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">5. Processo di Rimborso</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-royal-purple/20 rounded-full flex items-center justify-center text-royal-purple font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Invia la Richiesta</h3>
                  <p className="text-muted-foreground text-sm">Contattaci via email con oggetto "Richiesta Rimborso" specificando il tuo account.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-royal-purple/20 rounded-full flex items-center justify-center text-royal-purple font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Verifica</h3>
                  <p className="text-muted-foreground text-sm">Verificheremo che la richiesta rispetti le condizioni (1-2 giorni lavorativi).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-royal-purple/20 rounded-full flex items-center justify-center text-royal-purple font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Elaborazione</h3>
                  <p className="text-muted-foreground text-sm">Il rimborso viene elaborato tramite Stripe (5-10 giorni per apparire sul conto).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-neon-aqua/20 rounded-full flex items-center justify-center text-neon-aqua font-bold">✓</div>
                <div>
                  <h3 className="font-semibold">Completato</h3>
                  <p className="text-muted-foreground text-sm">Riceverai conferma via email quando il rimborso sarà processato.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              6. Agency Boost - Politica Speciale
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il pacchetto <strong>Agency Boost (€2.497)</strong> è un servizio one-time di implementazione personalizzata. 
              Data la natura del servizio:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Non è rimborsabile una volta iniziata l'implementazione</li>
              <li>È possibile annullare entro 48 ore dall'ordine se il lavoro non è ancora iniziato</li>
              <li>Eventuali problemi verranno risolti con supporto aggiuntivo gratuito</li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl border-2 border-royal-purple/30">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-royal-purple" />
              7. Contattaci
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Per richieste di rimborso o domande:
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2">
              <li>
                <strong>Email rimborsi:</strong>{" "}
                <a href="mailto:billing@propertypilotai.com" className="text-royal-purple hover:underline">
                  billing@propertypilotai.com
                </a>
              </li>
              <li>
                <strong>Supporto generale:</strong>{" "}
                <a href="mailto:support@propertypilotai.com" className="text-royal-purple hover:underline">
                  support@propertypilotai.com
                </a>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Rispondiamo a tutte le richieste entro 24-48 ore lavorative.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/terms">
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Termini e Condizioni
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Privacy Policy
            </Button>
          </Link>
          <Link href="/pricing">
            <Button className="neon-button gap-2">
              Vedi i Piani
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
