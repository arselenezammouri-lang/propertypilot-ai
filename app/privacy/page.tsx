import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { Shield, Lock, Eye, Database, Globe, UserCheck, Mail } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Privacy Policy | PropertyPilot AI",
  description: "Informativa sulla privacy e protezione dei dati personali di PropertyPilot AI. Scopri come trattiamo i tuoi dati.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-[#06b6d4]/50 bg-[#06b6d4]/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-[#06b6d4]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-privacy">
                Privacy <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">Policy</span>
              </h1>
              <p className="text-white/60">Ultimo aggiornamento: Dicembre 2024</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-electric-blue" />
              1. Informazioni Generali
            </h2>
            <p className="text-white/70 leading-relaxed">
              PropertyPilot AI ("noi", "nostro") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
              Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni 
              in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e la normativa italiana.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              <strong>Titolare del Trattamento:</strong> PropertyPilot AI<br />
              <strong>Email:</strong> privacy@propertypilotai.com
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-sunset-gold" />
              2. Dati che Raccogliamo
            </h2>
            <p className="text-white/70 leading-relaxed">
              Raccogliamo le seguenti categorie di dati:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">Dati forniti direttamente:</h3>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Nome agenzia/azienda</li>
                  <li>Informazioni di pagamento (elaborate da Stripe)</li>
                  <li>Contenuti immobiliari inseriti per la generazione AI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dati raccolti automaticamente:</h3>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Indirizzo IP</li>
                  <li>Tipo di browser e dispositivo</li>
                  <li>Pagine visitate e interazioni</li>
                  <li>Cookie tecnici e analitici</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-royal-purple" />
              3. Come Utilizziamo i Tuoi Dati
            </h2>
            <p className="text-white/70 leading-relaxed">
              Utilizziamo i tuoi dati per:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Fornire e migliorare i nostri servizi AI</li>
              <li>Gestire il tuo account e abbonamento</li>
              <li>Elaborare pagamenti tramite Stripe</li>
              <li>Inviarti comunicazioni relative al servizio</li>
              <li>Analizzare l'utilizzo per migliorare la piattaforma</li>
              <li>Rispettare obblighi legali</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              <strong>Non vendiamo mai i tuoi dati a terzi.</strong>
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-neon-aqua" />
              4. Condivisione dei Dati
            </h2>
            <p className="text-white/70 leading-relaxed">
              Condividiamo i tuoi dati solo con:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Stripe:</strong> Per elaborazione pagamenti sicura</li>
              <li><strong>Supabase:</strong> Per hosting database e autenticazione</li>
              <li><strong>OpenAI:</strong> Per generazione contenuti AI (dati anonimizzati)</li>
              <li><strong>Vercel:</strong> Per hosting della piattaforma</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Tutti i nostri fornitori sono conformi GDPR e offrono adeguate garanzie di sicurezza.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-electric-blue" />
              5. I Tuoi Diritti
            </h2>
            <p className="text-white/70 leading-relaxed">
              In base al GDPR, hai diritto di:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Accesso:</strong> Richiedere una copia dei tuoi dati</li>
              <li><strong>Rettifica:</strong> Correggere dati inesatti</li>
              <li><strong>Cancellazione:</strong> Richiedere la cancellazione dei tuoi dati</li>
              <li><strong>Portabilità:</strong> Ricevere i tuoi dati in formato leggibile</li>
              <li><strong>Opposizione:</strong> Opporti al trattamento per marketing</li>
              <li><strong>Limitazione:</strong> Limitare il trattamento in certe circostanze</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Per esercitare questi diritti, contattaci a{" "}
              <a href="mailto:privacy@propertypilotai.com" className="text-royal-purple hover:underline">
                privacy@propertypilotai.com
              </a>
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">6. Cookie</h2>
            <p className="text-white/70 leading-relaxed">
              Utilizziamo i seguenti tipi di cookie:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Cookie tecnici:</strong> Necessari per il funzionamento del sito</li>
              <li><strong>Cookie di sessione:</strong> Per mantenere l'autenticazione</li>
              <li><strong>Cookie analitici:</strong> Per comprendere come usi il sito (anonimizzati)</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Puoi gestire le preferenze cookie dal tuo browser.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">7. Sicurezza dei Dati</h2>
            <p className="text-white/70 leading-relaxed">
              Implementiamo misure di sicurezza avanzate:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
              <li>Crittografia dei dati a riposo</li>
              <li>Autenticazione a due fattori disponibile</li>
              <li>Backup regolari e disaster recovery</li>
              <li>Accesso limitato ai dati solo al personale autorizzato</li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">8. Conservazione dei Dati</h2>
            <p className="text-white/70 leading-relaxed">
              Conserviamo i tuoi dati per il tempo necessario a fornire il servizio:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Dati account:</strong> Fino alla cancellazione dell'account + 30 giorni</li>
              <li><strong>Dati di fatturazione:</strong> 10 anni (obblighi fiscali)</li>
              <li><strong>Log di sistema:</strong> 90 giorni</li>
              <li><strong>Contenuti generati:</strong> Fino alla cancellazione da parte dell'utente</li>
            </ul>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">9. Trasferimenti Internazionali</h2>
            <p className="text-white/70 leading-relaxed">
              Alcuni dei nostri fornitori di servizi potrebbero essere situati fuori dall'UE. 
              In questi casi, ci assicuriamo che esistano adeguate garanzie come clausole contrattuali 
              standard o certificazioni Privacy Shield/equivalenti.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-sunset-gold" />
              10. Contatti e Reclami
            </h2>
            <p className="text-white/70 leading-relaxed">
              Per domande sulla privacy o per esercitare i tuoi diritti:
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2">
              <li>Email: <a href="mailto:privacy@propertypilotai.com" className="text-royal-purple hover:underline">privacy@propertypilotai.com</a></li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali 
              (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-royal-purple hover:underline">www.garanteprivacy.it</a>).
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/terms">
            <Button variant="outline" className="gap-2">
              <Lock className="h-4 w-4" />
              Termini e Condizioni
            </Button>
          </Link>
          <Link href="/refund">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Politica Rimborsi
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
