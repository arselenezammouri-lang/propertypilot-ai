"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { FileText, Scale, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export function TermsPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const copy = isItalian
    ? {
        title: "Termini e",
        highlight: "Condizioni",
        updated: "Ultimo aggiornamento: Marzo 2026",
        sections: [
          {
            icon: FileText,
            color: "text-blue-500",
            title: "1. Accettazione dei Termini",
            paragraphs: [
              'Utilizzando PropertyPilot AI ("Servizio"), accetti di essere vincolato da questi Termini e Condizioni. Se non accetti questi termini, ti preghiamo di non utilizzare il nostro Servizio.',
              "PropertyPilot AI si riserva il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive immediatamente dopo la pubblicazione sul sito.",
            ],
          },
          {
            icon: Shield,
            color: "text-emerald-500",
            title: "2. Descrizione del Servizio",
            paragraphs: ["PropertyPilot AI e una piattaforma basata su intelligenza artificiale che fornisce:"],
            items: [
              "Generazione automatica di descrizioni immobiliari professionali",
              "Ottimizzazione SEO per annunci immobiliari",
              "Traduzione multilingua di contenuti",
              "Strumenti CRM per la gestione dei lead",
              "Analisi e audit di annunci esistenti",
              "Generazione di materiali marketing (PDF, post social)",
            ],
          },
          {
            icon: CheckCircle,
            color: "text-amber-500",
            title: "3. Account Utente",
            paragraphs: ["Per utilizzare PropertyPilot AI devi:"],
            items: [
              "Avere almeno 18 anni",
              "Fornire informazioni accurate e complete durante la registrazione",
              "Mantenere la sicurezza del tuo account e password",
              "Notificarci immediatamente di qualsiasi uso non autorizzato",
            ],
            note: "Sei responsabile di tutte le attivita che avvengono sotto il tuo account.",
          },
          {
            title: "4. Piani e Pagamenti",
            paragraphs: ["PropertyPilot AI offre diversi piani di abbonamento:"],
            items: [
              "Starter (EUR 197/mese): Funzionalita base per agenti singoli",
              "Pro (EUR 497/mese): CRM completo e automazioni avanzate",
              "Agency (EUR 897/mese): Per team fino a 10 agenti",
              "Agency Boost (EUR 2,497 una tantum): Setup completo e consulenza",
            ],
            note: "I pagamenti vengono elaborati tramite Stripe. I prezzi non includono IVA.",
          },
          {
            title: "5. Proprieta Intellettuale",
            paragraphs: [
              "Tutti i contenuti generati dall'AI attraverso PropertyPilot AI sono di proprieta dell'utente che li ha generati. PropertyPilot AI mantiene i diritti sulla piattaforma, sul software, sul design e sui materiali correlati.",
              "E vietato copiare, modificare o distribuire parti del Servizio senza autorizzazione scritta.",
            ],
          },
          {
            icon: AlertTriangle,
            color: "text-orange-500",
            title: "6. Limitazioni di Responsabilita",
            paragraphs: [
              "PropertyPilot AI non garantisce che i contenuti generati dall'AI siano privi di errori o adatti a tutti gli scopi. L'utente e responsabile della revisione e verifica dei contenuti prima della pubblicazione.",
              "PropertyPilot AI non sara responsabile per danni indiretti, incidentali o consequenziali derivanti dall'uso del Servizio.",
            ],
          },
          {
            title: "7. Uso Accettabile",
            paragraphs: ["E vietato utilizzare PropertyPilot AI per:"],
            items: [
              "Attivita illegali o fraudolente",
              "Generare contenuti diffamatori, offensivi o discriminatori",
              "Violare diritti di terzi",
              "Tentare di accedere a sistemi o dati non autorizzati",
              "Distribuire malware o codice dannoso",
            ],
          },
          {
            title: "8. Cancellazione e Sospensione",
            paragraphs: [
              "Puoi cancellare il tuo account in qualsiasi momento dalla dashboard. PropertyPilot AI si riserva il diritto di sospendere o terminare account che violano questi termini.",
            ],
            linkText: "Politica di Rimborso",
            linkIntro: "Per la politica di rimborso, consulta la nostra",
          },
          {
            title: "9. Legge Applicabile",
            paragraphs: [
              "Questi termini sono regolati dalle leggi italiane. Per qualsiasi controversia, sara competente il Foro di Milano.",
            ],
          },
          {
            title: "10. Contatti",
            paragraphs: ["Per domande su questi termini, contattaci:"],
            contacts: ["Email: legal@propertypilotai.com", "Supporto: support@propertypilotai.com"],
          },
        ],
        privacy: "Privacy Policy",
        refund: "Politica Rimborsi",
      }
    : {
        title: "Terms and",
        highlight: "Conditions",
        updated: "Last updated: March 2026",
        sections: [
          {
            icon: FileText,
            color: "text-blue-500",
            title: "1. Acceptance of Terms",
            paragraphs: [
              'By using PropertyPilot AI ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our Service.',
              "PropertyPilot AI reserves the right to modify these terms at any time. Changes become effective immediately after publication on the site.",
            ],
          },
          {
            icon: Shield,
            color: "text-emerald-500",
            title: "2. Description of the Service",
            paragraphs: ["PropertyPilot AI is an artificial intelligence platform that provides:"],
            items: [
              "Automated generation of professional real estate descriptions",
              "SEO optimization for property listings",
              "Multilingual content translation",
              "CRM tools for lead management",
              "Analysis and auditing of existing listings",
              "Marketing material generation (PDFs, social posts)",
            ],
          },
          {
            icon: CheckCircle,
            color: "text-amber-500",
            title: "3. User Account",
            paragraphs: ["To use PropertyPilot AI you must:"],
            items: [
              "Be at least 18 years old",
              "Provide accurate and complete registration information",
              "Maintain the security of your account and password",
              "Notify us immediately of any unauthorized use",
            ],
            note: "You are responsible for all activities that occur under your account.",
          },
          {
            title: "4. Plans and Payments",
            paragraphs: ["PropertyPilot AI offers different subscription plans:"],
            items: [
              "Starter (EUR 197/month): Basic features for solo agents",
              "Pro (EUR 497/month): Full CRM and advanced automations",
              "Agency (EUR 897/month): For teams up to 10 agents",
              "Agency Boost (EUR 2,497 one-time): Complete setup and consulting",
            ],
            note: "Payments are processed through Stripe. Prices do not include VAT.",
          },
          {
            title: "5. Intellectual Property",
            paragraphs: [
              "All content generated by AI through PropertyPilot AI belongs to the user who generated it. PropertyPilot AI retains rights to the platform, software, design, and related materials.",
              "Copying, modifying, or distributing parts of the Service without written permission is prohibited.",
            ],
          },
          {
            icon: AlertTriangle,
            color: "text-orange-500",
            title: "6. Limitation of Liability",
            paragraphs: [
              "PropertyPilot AI does not guarantee that AI-generated content will be error-free or suitable for every purpose. The user is responsible for reviewing and verifying content before publication.",
              "PropertyPilot AI will not be liable for indirect, incidental, or consequential damages arising from use of the Service.",
            ],
          },
          {
            title: "7. Acceptable Use",
            paragraphs: ["You may not use PropertyPilot AI for:"],
            items: [
              "Illegal or fraudulent activities",
              "Generating defamatory, offensive, or discriminatory content",
              "Violating third-party rights",
              "Attempting unauthorized access to systems or data",
              "Distributing malware or malicious code",
            ],
          },
          {
            title: "8. Cancellation and Suspension",
            paragraphs: [
              "You can cancel your account at any time from the dashboard. PropertyPilot AI reserves the right to suspend or terminate accounts that violate these terms.",
            ],
            linkText: "Refund Policy",
            linkIntro: "For the refund policy, see our",
          },
          {
            title: "9. Governing Law",
            paragraphs: [
              "These terms are governed by Italian law. Any dispute will fall under the jurisdiction of the Court of Milan.",
            ],
          },
          {
            title: "10. Contact",
            paragraphs: ["For questions about these terms, contact us:"],
            contacts: ["Email: legal@propertypilotai.com", "Support: support@propertypilotai.com"],
          },
        ],
        privacy: "Privacy Policy",
        refund: "Refund Policy",
      };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
            <Scale className="h-7 w-7 text-[#9333ea]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-terms">
              {copy.title} <span className="text-gradient-blue">{copy.highlight}</span>
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
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed mt-4 first:mt-0">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {section.note ? (
                <p className="text-muted-foreground leading-relaxed mt-4">{section.note}</p>
              ) : null}
              {section.linkText ? (
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {section.linkIntro}{" "}
                  <Link href="/refund" className="text-blue-600 hover:underline">
                    {section.linkText}
                  </Link>
                  .
                </p>
              ) : null}
              {section.contacts ? (
                <ul className="text-muted-foreground mt-4 space-y-2">
                  {section.contacts.map((contact) => (
                    <li key={contact}>
                      {contact.startsWith("Email:")
                        ? <>Email: <a href="mailto:legal@propertypilotai.com" className="text-blue-600 hover:underline">legal@propertypilotai.com</a></>
                        : <>Support: <a href="mailto:support@propertypilotai.com" className="text-blue-600 hover:underline">support@propertypilotai.com</a></>}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/privacy">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            {copy.privacy}
          </Button>
        </Link>
        <Link href="/refund">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            {copy.refund}
          </Button>
        </Link>
      </div>
    </main>
  );
}
