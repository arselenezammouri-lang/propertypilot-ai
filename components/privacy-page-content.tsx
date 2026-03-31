"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { Shield, Lock, Eye, Database, Globe, UserCheck, Mail } from "lucide-react";

export function PrivacyPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const copy = isItalian
    ? {
        title: "Privacy",
        highlight: "Policy",
        updated: "Ultimo aggiornamento: Dicembre 2024",
        sections: [
          {
            icon: Eye,
            color: "text-blue-500",
            title: "1. Informazioni Generali",
            body: [
              'PropertyPilot AI ("noi", "nostro") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni in conformita con il GDPR e la normativa italiana.',
              "Titolare del Trattamento: PropertyPilot AI",
              "Email: privacy@propertypilotai.com",
            ],
          },
          {
            icon: Database,
            color: "text-amber-500",
            title: "2. Dati che Raccogliamo",
            body: ["Raccogliamo le seguenti categorie di dati:"],
            lists: [
              {
                title: "Dati forniti direttamente:",
                items: [
                  "Nome e cognome",
                  "Indirizzo email",
                  "Nome agenzia/azienda",
                  "Informazioni di pagamento (elaborate da Stripe)",
                  "Contenuti immobiliari inseriti per la generazione AI",
                ],
              },
              {
                title: "Dati raccolti automaticamente:",
                items: [
                  "Indirizzo IP",
                  "Tipo di browser e dispositivo",
                  "Pagine visitate e interazioni",
                  "Cookie tecnici e analitici",
                ],
              },
            ],
          },
          {
            icon: Lock,
            color: "text-blue-600",
            title: "3. Come Utilizziamo i Tuoi Dati",
            body: ["Utilizziamo i tuoi dati per:"],
            items: [
              "Fornire e migliorare i nostri servizi AI",
              "Gestire il tuo account e abbonamento",
              "Elaborare pagamenti tramite Stripe",
              "Inviarti comunicazioni relative al servizio",
              "Analizzare l'utilizzo per migliorare la piattaforma",
              "Rispettare obblighi legali",
            ],
            note: "Non vendiamo mai i tuoi dati a terzi.",
          },
          {
            icon: Globe,
            color: "text-emerald-500",
            title: "4. Condivisione dei Dati",
            body: ["Condividiamo i tuoi dati solo con:"],
            items: [
              "Stripe: Per elaborazione pagamenti sicura",
              "Supabase: Per hosting database e autenticazione",
              "OpenAI: Per generazione contenuti AI (dati anonimizzati)",
              "Vercel: Per hosting della piattaforma",
            ],
            note: "Tutti i nostri fornitori sono conformi GDPR e offrono adeguate garanzie di sicurezza.",
          },
          {
            icon: UserCheck,
            color: "text-blue-500",
            title: "5. I Tuoi Diritti",
            body: ["In base al GDPR, hai diritto di:"],
            items: [
              "Accesso: Richiedere una copia dei tuoi dati",
              "Rettifica: Correggere dati inesatti",
              "Cancellazione: Richiedere la cancellazione dei tuoi dati",
              "Portabilita: Ricevere i tuoi dati in formato leggibile",
              "Opposizione: Opporti al trattamento per marketing",
              "Limitazione: Limitare il trattamento in certe circostanze",
            ],
            note: "Per esercitare questi diritti, contattaci a privacy@propertypilotai.com",
          },
          {
            title: "6. Cookie",
            body: ["Utilizziamo i seguenti tipi di cookie:"],
            items: [
              "Cookie tecnici: Necessari per il funzionamento del sito",
              "Cookie di sessione: Per mantenere l'autenticazione",
              "Cookie analitici: Per comprendere come usi il sito (anonimizzati)",
            ],
            note: "Puoi gestire le preferenze cookie dal tuo browser.",
          },
          {
            title: "7. Sicurezza dei Dati",
            body: ["Implementiamo misure di sicurezza avanzate:"],
            items: [
              "Crittografia SSL/TLS per tutte le comunicazioni",
              "Crittografia dei dati a riposo",
              "Autenticazione a due fattori disponibile",
              "Backup regolari e disaster recovery",
              "Accesso limitato ai dati solo al personale autorizzato",
            ],
          },
          {
            title: "8. Conservazione dei Dati",
            body: ["Conserviamo i tuoi dati per il tempo necessario a fornire il servizio:"],
            items: [
              "Dati account: Fino alla cancellazione dell'account + 30 giorni",
              "Dati di fatturazione: 10 anni (obblighi fiscali)",
              "Log di sistema: 90 giorni",
              "Contenuti generati: Fino alla cancellazione da parte dell'utente",
            ],
          },
          {
            title: "9. Trasferimenti Internazionali",
            body: [
              "Alcuni dei nostri fornitori di servizi potrebbero essere situati fuori dall'UE. In questi casi, ci assicuriamo che esistano adeguate garanzie come clausole contrattuali standard o certificazioni equivalenti.",
            ],
          },
          {
            icon: Mail,
            color: "text-amber-500",
            title: "10. Contatti e Reclami",
            body: ["Per domande sulla privacy o per esercitare i tuoi diritti:"],
            contacts: ["Email: privacy@propertypilotai.com"],
            note: "Hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).",
          },
        ],
        terms: "Termini e Condizioni",
        refund: "Politica Rimborsi",
      }
    : {
        title: "Privacy",
        highlight: "Policy",
        updated: "Last updated: December 2024",
        sections: [
          {
            icon: Eye,
            color: "text-blue-500",
            title: "1. General Information",
            body: [
              'PropertyPilot AI ("we", "our") respects your privacy and is committed to protecting your personal data. This notice explains how we collect, use, and protect your information in compliance with GDPR and applicable privacy laws.',
              "Data Controller: PropertyPilot AI",
              "Email: privacy@propertypilotai.com",
            ],
          },
          {
            icon: Database,
            color: "text-amber-500",
            title: "2. Data We Collect",
            body: ["We collect the following categories of data:"],
            lists: [
              {
                title: "Data provided directly:",
                items: [
                  "Full name",
                  "Email address",
                  "Agency/company name",
                  "Payment information (processed by Stripe)",
                  "Real estate content submitted for AI generation",
                ],
              },
              {
                title: "Data collected automatically:",
                items: [
                  "IP address",
                  "Browser and device type",
                  "Visited pages and interactions",
                  "Technical and analytics cookies",
                ],
              },
            ],
          },
          {
            icon: Lock,
            color: "text-blue-600",
            title: "3. How We Use Your Data",
            body: ["We use your data to:"],
            items: [
              "Provide and improve our AI services",
              "Manage your account and subscription",
              "Process payments through Stripe",
              "Send service-related communications",
              "Analyze usage to improve the platform",
              "Comply with legal obligations",
            ],
            note: "We never sell your data to third parties.",
          },
          {
            icon: Globe,
            color: "text-emerald-500",
            title: "4. Data Sharing",
            body: ["We share your data only with:"],
            items: [
              "Stripe: secure payment processing",
              "Supabase: database hosting and authentication",
              "OpenAI: AI content generation (with minimized/anonymous data where possible)",
              "Vercel: platform hosting",
            ],
            note: "All our providers offer appropriate security guarantees and GDPR-aligned safeguards.",
          },
          {
            icon: UserCheck,
            color: "text-blue-500",
            title: "5. Your Rights",
            body: ["Under GDPR, you have the right to:"],
            items: [
              "Access: request a copy of your data",
              "Rectification: correct inaccurate data",
              "Erasure: request deletion of your data",
              "Portability: receive your data in a readable format",
              "Objection: object to processing for marketing purposes",
              "Restriction: limit processing in certain circumstances",
            ],
            note: "To exercise these rights, contact us at privacy@propertypilotai.com",
          },
          {
            title: "6. Cookies",
            body: ["We use the following types of cookies:"],
            items: [
              "Technical cookies: required for site operation",
              "Session cookies: used to maintain authentication",
              "Analytics cookies: to understand how you use the site (anonymized where possible)",
            ],
            note: "You can manage cookie preferences from your browser.",
          },
          {
            title: "7. Data Security",
            body: ["We implement advanced security measures:"],
            items: [
              "SSL/TLS encryption for all communications",
              "Encryption of stored data",
              "Two-factor authentication available",
              "Regular backups and disaster recovery",
              "Restricted data access for authorized personnel only",
            ],
          },
          {
            title: "8. Data Retention",
            body: ["We retain your data for the time needed to provide the service:"],
            items: [
              "Account data: until account deletion + 30 days",
              "Billing data: 10 years (tax obligations)",
              "System logs: 90 days",
              "Generated content: until deleted by the user",
            ],
          },
          {
            title: "9. International Transfers",
            body: [
              "Some of our service providers may be located outside the EU. In those cases, we ensure appropriate safeguards such as standard contractual clauses or equivalent certifications.",
            ],
          },
          {
            icon: Mail,
            color: "text-amber-500",
            title: "10. Contacts and Complaints",
            body: ["For privacy questions or to exercise your rights:"],
            contacts: ["Email: privacy@propertypilotai.com"],
            note: "You have the right to lodge a complaint with your data protection authority.",
          },
        ],
        terms: "Terms and Conditions",
        refund: "Refund Policy",
      };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-[#06b6d4]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-privacy">
              {copy.title} <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">{copy.highlight}</span>
            </h1>
            <p className="text-foreground/60">{copy.updated}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        {copy.sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.title} className="pp-card border border-border p-6 md:p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {Icon ? <Icon className={`h-5 w-5 ${section.color ?? "text-blue-500"}`} /> : null}
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="text-foreground/70 leading-relaxed mt-4 first:mt-0">
                  {paragraph.includes("privacy@propertypilotai.com") && paragraph.startsWith("Email:")
                    ? <>Email: <a href="mailto:privacy@propertypilotai.com" className="text-blue-600 hover:underline">privacy@propertypilotai.com</a></>
                    : paragraph}
                </p>
              ))}
              {section.lists?.map((group) => (
                <div key={group.title} className="mt-4 space-y-2">
                  <h3 className="font-semibold text-foreground">{group.title}</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
              {section.items ? (
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {section.contacts ? (
                <ul className="text-muted-foreground mt-4 space-y-2">
                  {section.contacts.map((contact) => (
                    <li key={contact}>
                      {contact.startsWith("Email:")
                        ? <>Email: <a href="mailto:privacy@propertypilotai.com" className="text-blue-600 hover:underline">privacy@propertypilotai.com</a></>
                        : contact}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.note ? (
                <p className="text-foreground/70 leading-relaxed mt-4">
                  {section.note.includes("www.garanteprivacy.it")
                    ? <>Hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.garanteprivacy.it</a>).</>
                    : section.note.includes("privacy@propertypilotai.com")
                    ? <>Per esercitare questi diritti, contattaci a <a href="mailto:privacy@propertypilotai.com" className="text-blue-600 hover:underline">privacy@propertypilotai.com</a></>
                    : section.note}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/terms">
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" />
            {copy.terms}
          </Button>
        </Link>
        <Link href="/refund">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            {copy.refund}
          </Button>
        </Link>
      </div>
    </main>
  );
}
