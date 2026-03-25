import type { PrivacyPolicyPageUi } from '@/lib/i18n/privacy-policy-page-ui';
import type { TermsPolicyPageUi } from '@/lib/i18n/terms-policy-page-ui';
import type { RefundPolicyPageUi } from '@/lib/i18n/refund-policy-page-ui';
import { privacyFooterNonIt } from '@/lib/i18n/legal-policy-locales-shared';

export const privacyPolicyPageUiDe: PrivacyPolicyPageUi = {
  title: 'Datenschutz',
  highlight: 'Richtlinie',
  updated: 'Zuletzt aktualisiert: Dezember 2024',
  terms: 'Allgemeine Geschäftsbedingungen',
  refund: 'Rückerstattungsrichtlinie',
  ...privacyFooterNonIt('Um diese Rechte auszuüben, kontaktieren Sie uns unter '),
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. Allgemeine Informationen',
      body: [
        'PropertyPilot AI („wir“, „unser“) respektiert Ihre Privatsphäre und verpflichtet sich zum Schutz Ihrer personenbezogenen Daten. Diese Hinweise erläutern, wie wir Ihre Daten gemäß DSGVO und geltendem Datenschutzrecht erheben, nutzen und schützen.',
        'Verantwortlicher: PropertyPilot AI',
        'E-Mail: privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Welche Daten wir erheben',
      body: ['Wir erheben folgende Datenkategorien:'],
      lists: [
        {
          title: 'Direkt von Ihnen bereitgestellt:',
          items: [
            'Vollständiger Name',
            'E-Mail-Adresse',
            'Agentur-/Firmenname',
            'Zahlungsinformationen (verarbeitet durch Stripe)',
            'Immobilieninhalte zur KI-Generierung',
          ],
        },
        {
          title: 'Automatisch erfasst:',
          items: [
            'IP-Adresse',
            'Browser- und Gerätetyp',
            'Besuchte Seiten und Interaktionen',
            'Technische und Analyse-Cookies',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. Wie wir Ihre Daten nutzen',
      body: ['Wir nutzen Ihre Daten, um:'],
      items: [
        'unsere KI-Dienste bereitzustellen und zu verbessern',
        'Ihr Konto und Abonnement zu verwalten',
        'Zahlungen über Stripe abzuwickeln',
        'Ihnen dienstbezogene Mitteilungen zu senden',
        'die Nutzung zu analysieren und die Plattform zu verbessern',
        'rechtlichen Verpflichtungen nachzukommen',
      ],
      note: 'Wir verkaufen Ihre Daten niemals an Dritte.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Weitergabe von Daten',
      body: ['Wir geben Ihre Daten nur weiter an:'],
      items: [
        'Stripe: sichere Zahlungsabwicklung',
        'Supabase: Datenbank-Hosting und Authentifizierung',
        'OpenAI: KI-Inhaltserstellung (Daten soweit möglich minimiert/anonymisiert)',
        'Vercel: Hosting der Plattform',
      ],
      note: 'Alle Anbieter bieten angemessene Sicherheitsgarantien und DSGVO-konforme Schutzmaßnahmen.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. Ihre Rechte',
      body: ['Nach DSGVO haben Sie das Recht auf:'],
      items: [
        'Auskunft: Kopie Ihrer Daten anfordern',
        'Berichtigung: unrichtige Daten korrigieren',
        'Löschung: Löschung Ihrer Daten verlangen',
        'Datenübertragbarkeit: Daten in lesbarem Format erhalten',
        'Widerspruch: Widerspruch gegen Verarbeitung zu Marketingzwecken',
        'Einschränkung: Einschränkung der Verarbeitung unter bestimmten Voraussetzungen',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookies',
      body: ['Wir verwenden folgende Cookie-Arten:'],
      items: [
        'Technisch notwendige Cookies für den Betrieb der Website',
        'Sitzungs-Cookies zur Aufrechterhaltung der Anmeldung',
        'Analyse-Cookies zum Verständnis der Nutzung (soweit möglich anonymisiert)',
      ],
      note: 'Cookie-Einstellungen können Sie in Ihrem Browser verwalten.',
    },
    {
      title: '7. Datensicherheit',
      body: ['Wir setzen umfassende Sicherheitsmaßnahmen ein:'],
      items: [
        'SSL/TLS-Verschlüsselung für alle Übertragungen',
        'Verschlüsselung gespeicherter Daten',
        'Zwei-Faktor-Authentifizierung verfügbar',
        'Regelmäßige Backups und Disaster Recovery',
        'Zugriff nur für autorisiertes Personal',
      ],
    },
    {
      title: '8. Aufbewahrung',
      body: ['Wir speichern Daten so lange wie für den Dienst erforderlich:'],
      items: [
        'Kontodaten: bis zur Kontolöschung + 30 Tage',
        'Abrechnungsdaten: 10 Jahre (steuerrechtliche Pflichten)',
        'Systemprotokolle: 90 Tage',
        'Generierte Inhalte: bis zur Löschung durch den Nutzer',
      ],
    },
    {
      title: '9. Internationale Übermittlungen',
      body: [
        'Einige Anbieter können außerhalb des EWR sitzen. Dann stellen wir geeignete Garantien sicher, z. B. Standardvertragsklauseln oder gleichwertige Maßnahmen.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Kontakt und Beschwerden',
      body: ['Bei Datenschutzfragen oder zur Ausübung Ihrer Rechte:'],
      contacts: ['E-Mail: privacy@propertypilotai.com'],
      note: 'Sie haben das Recht, bei der Datenschutzbehörde Ihres Landes Beschwerde einzulegen.',
    },
  ],
};

export const termsPolicyPageUiDe: TermsPolicyPageUi = {
  title: 'Allgemeine',
  highlight: 'Geschäftsbedingungen',
  updated: 'Zuletzt aktualisiert: Dezember 2024',
  privacy: 'Datenschutzrichtlinie',
  refund: 'Rückerstattungsrichtlinie',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Annahme der Bedingungen',
      paragraphs: [
        'Durch die Nutzung von PropertyPilot AI („Dienst“) erklären Sie sich mit diesen Bedingungen einverstanden. Wenn nicht, nutzen Sie den Dienst bitte nicht.',
        'PropertyPilot AI kann diese Bedingungen jederzeit ändern. Änderungen gelten mit Veröffentlichung auf der Website.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Leistungsbeschreibung',
      paragraphs: ['PropertyPilot AI ist eine KI-Plattform, die Folgendes bietet:'],
      items: [
        'Automatisierte Erstellung professioneller Immobilientexte',
        'SEO-Optimierung für Inserate',
        'Mehrsprachige Übersetzung von Inhalten',
        'CRM-Tools für Lead-Management',
        'Analyse und Audit bestehender Inserate',
        'Erstellung von Marketingmaterial (PDFs, Social Posts)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. Nutzerkonto',
      paragraphs: ['Zur Nutzung von PropertyPilot AI müssen Sie:'],
      items: [
        'mindestens 18 Jahre alt sein',
        'bei der Registrierung korrekte und vollständige Angaben machen',
        'Sicherheit von Konto und Passwort wahren',
        'uns unverzüglich über unbefugte Nutzung informieren',
      ],
      note: 'Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich.',
    },
    {
      title: '4. Tarife und Zahlungen',
      paragraphs: ['PropertyPilot AI bietet verschiedene Abonnements:'],
      items: [
        'Starter (197 EUR/Monat): Basisfunktionen für Einzelagenten',
        'Pro (497 EUR/Monat): Voll-CRM und erweiterte Automatisierung',
        'Agency (897 EUR/Monat): für Teams bis zu 10 Agenten',
        'Agency Boost (2.497 EUR einmalig): vollständiges Setup und Beratung',
      ],
      note: 'Zahlungen werden über Stripe abgewickelt. Preise zzgl. MwSt.',
    },
    {
      title: '5. Geistiges Eigentum',
      paragraphs: [
        'Von der KI über PropertyPilot AI erzeugte Inhalte gehören dem Nutzer, der sie erzeugt hat. PropertyPilot AI behält Rechte an Plattform, Software, Design und zugehörigen Materialien.',
        'Das Kopieren, Ändern oder Verbreiten von Teilen des Dienstes ohne schriftliche Erlaubnis ist untersagt.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Haftungsbeschränkung',
      paragraphs: [
        'PropertyPilot AI garantiert nicht, dass KI-Inhalte fehlerfrei oder für jeden Zweck geeignet sind. Der Nutzer prüft und verifiziert Inhalte vor Veröffentlichung.',
        'PropertyPilot AI haftet nicht für indirekte, zufällige oder Folgeschäden aus der Nutzung des Dienstes.',
      ],
    },
    {
      title: '7. Zulässige Nutzung',
      paragraphs: ['Sie dürfen PropertyPilot AI nicht nutzen für:'],
      items: [
        'illegale oder betrügerische Aktivitäten',
        'Erstellung diffamierender, beleidigender oder diskriminierender Inhalte',
        'Verletzung von Rechten Dritter',
        'unbefugten Zugriff auf Systeme oder Daten',
        'Verbreitung von Malware',
      ],
    },
    {
      title: '8. Kündigung und Sperre',
      paragraphs: [
        'Sie können Ihr Konto jederzeit im Dashboard löschen. PropertyPilot AI darf Konten bei Verstößen sperren oder beenden.',
      ],
      linkText: 'Rückerstattungsrichtlinie',
      linkIntro: 'Zur Rückerstattung siehe unsere',
    },
    {
      title: '9. Anwendbares Recht',
      paragraphs: [
        'Es gilt italienisches Recht. Gerichtsstand ist Mailand.',
      ],
    },
    {
      title: '10. Kontakt',
      paragraphs: ['Fragen zu diesen Bedingungen:'],
      contacts: ['E-Mail: legal@propertypilotai.com', 'Support: support@propertypilotai.com'],
    },
  ],
};

export const refundPolicyPageUiDe: RefundPolicyPageUi = {
  title: 'Rückerstattungs',
  highlight: 'Richtlinie',
  updated: 'Zuletzt aktualisiert: Dezember 2024',
  guaranteeTitle: 'Unsere Garantie',
  guaranteeBodyStart: 'Wir stehen hinter der Qualität von PropertyPilot AI. Deshalb bieten wir eine',
  guaranteeBodyStrong: '14-Tage-Geld-zurück-Garantie',
  guaranteeBodyEnd: 'für alle neuen Abonnements. Wenn Sie nicht zufrieden sind, erstatten wir ohne Umstände.',
  trialTitle: '1. Testphase und Rückerstattung',
  freeTrialTitle: '7 Tage kostenlos testen',
  freeTrialBody:
    'Alle Tarife beinhalten 7 Tage kostenlose Testphase. Keine Kreditkarte zum Start nötig. Sie können während der Testphase jederzeit kostenlos kündigen.',
  guarantee14Title: '14-Tage-Garantie',
  guarantee14Body:
    'Schließen Sie nach dem Test ein Abonnement ab und sind unzufrieden, können Sie innerhalb von 14 Tagen ab erster Zahlung eine vollständige Rückerstattung beantragen.',
  conditionsTitle: '2. Voraussetzungen',
  conditionsIntro: 'Für eine Rückerstattung müssen Sie:',
  conditions: [
    'innerhalb von 14 Tagen nach erster Zahlung anfragen',
    'in Ihrer ersten Abonnementlaufzeit sein (Verlängerungen ausgeschlossen)',
    'die Nutzungsbedingungen nicht verletzt haben',
    'uns per E-Mail kontaktieren',
  ],
  nonRefundableTitle: '3. Keine Rückerstattung',
  nonRefundableIntro: 'Keine Rückerstattung in folgenden Fällen:',
  nonRefundable: [
    'Antrag mehr als 14 Tage nach Zahlung',
    'automatische Verlängerungen (Kündigung vor Verlängerung möglich)',
    'Agency Boost-Paket (Einmal-Service bereits erbracht)',
    'gesperrte Konten wegen Verstoßes',
    'bereits erstattete frühere Abonnements',
  ],
  cancelTitle: '4. Abo kündigen',
  cancelIntro: 'Sie können Ihr Abonnement jederzeit kündigen:',
  cancelSteps: [
    'Im Dashboard anmelden',
    'Zu Abrechnung oder Abonnement gehen',
    '„Abo kündigen“ klicken',
    'Kündigung bestätigen',
  ],
  cancelImportant: 'Wichtig:',
  cancelImportantBody:
    'Die Kündigung wird zum Ende der laufenden Abrechnungsperiode wirksam. Der Zugang bleibt bis dahin bestehen.',
  processTitle: '5. Ablauf der Rückerstattung',
  process: [
    {
      step: '1',
      title: 'Anfrage senden',
      body: 'Schreiben Sie uns per E-Mail mit Betreff „Rückerstattungsantrag“ und Ihrem Konto.',
    },
    {
      step: '2',
      title: 'Prüfung',
      body: 'Wir prüfen die Voraussetzungen (1–2 Werktage).',
    },
    {
      step: '3',
      title: 'Bearbeitung',
      body: 'Die Rückerstattung läuft über Stripe (5–10 Tage bis zur Gutschrift).',
    },
    {
      step: '✓',
      title: 'Abgeschlossen',
      body: 'Sie erhalten eine E-Mail-Bestätigung, sobald die Rückerstattung bearbeitet wurde.',
    },
  ],
  boostTitle: '6. Agency Boost — Sonderregelung',
  boostIntro: 'Das Paket',
  boostProductLabel: 'Agency Boost (2.497 EUR)',
  boostBody: 'ist ein einmaliger Implementierungsservice. Daher:',
  boostRules: [
    'nach Beginn der Implementierung nicht erstattungsfähig',
    'Stornierung innerhalb von 48 Stunden nach Bestellung möglich, wenn noch nicht gestartet',
    'Lieferprobleme werden mit zusätzlichem Support ohne Mehrkosten gelöst',
  ],
  contactTitle: '7. Kontakt',
  contactIntro: 'Bei Rückerstattungsfragen:',
  refundEmail: 'E-Mail Rückerstattung:',
  supportEmail: 'Allgemeiner Support:',
  contactOutro: 'Wir antworten innerhalb von 24–48 Werktunden.',
  terms: 'Allgemeine Geschäftsbedingungen',
  privacy: 'Datenschutzrichtlinie',
  pricing: 'Preise ansehen',
};
