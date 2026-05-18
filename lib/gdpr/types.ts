/**
 * GDPR Compliance Module — DSAR automation, consent tracking, data export, deletion
 * EU-native: handles right to access, right to deletion, consent management
 */

export type ConsentType = "marketing_email" | "marketing_sms" | "marketing_whatsapp" | "data_processing" | "analytics" | "third_party_sharing";

export type DSARType = "access" | "deletion" | "rectification" | "portability" | "restriction";

export type DSARStatus = "received" | "verified" | "processing" | "completed" | "rejected";

export interface ConsentRecord {
  id: string;
  user_id: string;
  lead_id?: string;
  consent_type: ConsentType;
  granted: boolean;
  ip_address: string;
  user_agent: string;
  source: string;
  granted_at: string;
  revoked_at?: string;
}

export interface DSARRequest {
  id: string;
  requester_email: string;
  requester_name: string;
  request_type: DSARType;
  status: DSARStatus;
  user_id?: string;
  notes: string;
  response_data?: Record<string, unknown>;
  completed_at?: string;
  deadline: string;
  created_at: string;
}

/** GDPR requires response within 30 days (72h for breaches) */
export function calculateDeadline(requestDate: Date): string {
  const deadline = new Date(requestDate);
  deadline.setDate(deadline.getDate() + 30);
  return deadline.toISOString();
}

/** Generate exportable data package for a user (Right to Portability) */
export interface DataExportPackage {
  profile: Record<string, unknown>;
  leads: Record<string, unknown>[];
  listings: Record<string, unknown>[];
  documents: Record<string, unknown>[];
  consent_history: ConsentRecord[];
  activities: Record<string, unknown>[];
  export_date: string;
  format: "json";
}

/** Per-country GDPR specifics */
export const COUNTRY_GDPR_NOTES: Record<string, { authority: string; url: string; extra_requirements: string[] }> = {
  IT: {
    authority: "Garante per la protezione dei dati personali",
    url: "https://www.garanteprivacy.it",
    extra_requirements: ["Codice in materia di protezione dei dati personali (D.Lgs 196/2003)", "Cookie consent banner required"],
  },
  FR: {
    authority: "Commission Nationale de l'Informatique et des Libertés (CNIL)",
    url: "https://www.cnil.fr",
    extra_requirements: ["Explicit opt-in for commercial emails (Loi pour la Confiance dans l'Économie Numérique)", "Cookie consent per CNIL guidelines"],
  },
  ES: {
    authority: "Agencia Española de Protección de Datos (AEPD)",
    url: "https://www.aepd.es",
    extra_requirements: ["LOPDGDD (Ley Orgánica 3/2018)", "Explicit consent for phone marketing"],
  },
  DE: {
    authority: "Bundesbeauftragte für den Datenschutz (BfDI)",
    url: "https://www.bfdi.bund.de",
    extra_requirements: ["BDSG (Bundesdatenschutzgesetz)", "Double opt-in required for email marketing", "Strict cookie consent (TTDSG)"],
  },
  UK: {
    authority: "Information Commissioner's Office (ICO)",
    url: "https://ico.org.uk",
    extra_requirements: ["UK GDPR + Data Protection Act 2018", "PECR for electronic marketing"],
  },
  PT: {
    authority: "Comissão Nacional de Proteção de Dados (CNPD)",
    url: "https://www.cnpd.pt",
    extra_requirements: ["Lei n.º 58/2019 (GDPR implementation)", "Electronic marketing consent required"],
  },
};

/** Consent types required per lead capture context */
export function getRequiredConsents(country: string, context: "lead_form" | "newsletter" | "whatsapp" | "voice_call"): ConsentType[] {
  const base: ConsentType[] = ["data_processing"];

  switch (context) {
    case "lead_form":
      return [...base, "marketing_email"];
    case "newsletter":
      return [...base, "marketing_email"];
    case "whatsapp":
      return [...base, "marketing_whatsapp"];
    case "voice_call":
      return [...base, "marketing_sms"];
    default:
      return base;
  }
}
