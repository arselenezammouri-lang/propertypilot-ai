import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { FileText, Scale, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Termini e Condizioni | PropertyPilot AI",
  description: "Leggi i termini e le condizioni d'uso di PropertyPilot AI, la piattaforma AI per professionisti immobiliari.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
              <Scale className="h-7 w-7 text-[#9333ea]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-terms">
                Termini e <span className="gradient-text-purple">Condizioni</span>
              </h1>
              <p className="text-white/60">Ultimo aggiornamento: Dicembre 2024</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-electric-blue" />
              1. Accettazione dei Termini
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizzando PropertyPilot AI ("Servizio"), accetti di essere vincolato da questi Termini e Condizioni. 
              Se non accetti questi termini, ti preghiamo di non utilizzare il nostro Servizio.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              PropertyPilot AI si riserva il diritto di modificare questi termini in qualsiasi momento. 
              Le modifiche saranno effettive immediatamente dopo la pubblicazione sul sito.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-neon-aqua" />
              2. Descrizione del Servizio
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPilot AI è una piattaforma basata su intelligenza artificiale che fornisce:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Generazione automatica di descrizioni immobiliari professionali</li>
              <li>Ottimizzazione SEO per annunci immobiliari</li>
              <li>Traduzione multilingua di contenuti</li>
              <li>Strumenti CRM per la gestione dei lead</li>
              <li>Analisi e audit di annunci esistenti</li>
              <li>Generazione di materiali marketing (PDF, post social)</li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-sunset-gold" />
              3. Account Utente
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Per utilizzare PropertyPilot AI devi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Avere almeno 18 anni</li>
              <li>Fornire informazioni accurate e complete durante la registrazione</li>
              <li>Mantenere la sicurezza del tuo account e password</li>
              <li>Notificarci immediatamente di qualsiasi uso non autorizzato</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Sei responsabile di tutte le attività che avvengono sotto il tuo account.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">4. Piani e Pagamenti</h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPilot AI offre diversi piani di abbonamento:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Starter (€197/mese)</strong>: Funzionalità base per agenti singoli</li>
              <li><strong>Pro (€497/mese)</strong>: CRM completo e automazioni avanzate</li>
              <li><strong>Agency (€897/mese)</strong>: Per team fino a 10 agenti</li>
              <li><strong>Agency Boost (€2.497 una tantum)</strong>: Setup completo e consulenza</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              I pagamenti vengono elaborati tramite Stripe. I prezzi non includono IVA.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">5. Proprietà Intellettuale</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tutti i contenuti generati dall'AI attraverso PropertyPilot AI sono di proprietà dell'utente 
              che li ha generati. PropertyPilot AI mantiene i diritti sulla piattaforma, il software, 
              il design e tutti i materiali correlati.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              È vietato copiare, modificare o distribuire parti del Servizio senza autorizzazione scritta.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              6. Limitazioni di Responsabilità
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPilot AI non garantisce che i contenuti generati dall'AI siano privi di errori 
              o adatti a tutti gli scopi. L'utente è responsabile della revisione e verifica dei contenuti 
              prima della pubblicazione.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              PropertyPilot AI non sarà responsabile per danni indiretti, incidentali o consequenti 
              derivanti dall'uso del Servizio.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">7. Uso Accettabile</h2>
            <p className="text-muted-foreground leading-relaxed">
              È vietato utilizzare PropertyPilot AI per:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Attività illegali o fraudolente</li>
              <li>Generare contenuti diffamatori, offensivi o discriminatori</li>
              <li>Violare diritti di terzi</li>
              <li>Tentare di accedere a sistemi o dati non autorizzati</li>
              <li>Distribuire malware o codice dannoso</li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">8. Cancellazione e Sospensione</h2>
            <p className="text-muted-foreground leading-relaxed">
              Puoi cancellare il tuo account in qualsiasi momento dalla dashboard. PropertyPilot AI 
              si riserva il diritto di sospendere o terminare account che violano questi termini.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Per la politica di rimborso, consulta la nostra{" "}
              <Link href="/refund" className="text-royal-purple hover:underline">
                Politica di Rimborso
              </Link>.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">9. Legge Applicabile</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questi termini sono regolati dalle leggi italiane. Per qualsiasi controversia, 
              sarà competente il Foro di Milano.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">10. Contatti</h2>
            <p className="text-muted-foreground leading-relaxed">
              Per domande su questi termini, contattaci:
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2">
              <li>Email: <a href="mailto:legal@propertypilotai.com" className="text-royal-purple hover:underline">legal@propertypilotai.com</a></li>
              <li>Supporto: <a href="mailto:support@propertypilotai.com" className="text-royal-purple hover:underline">support@propertypilotai.com</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/privacy">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </Button>
          </Link>
          <Link href="/refund">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Politica Rimborsi
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
