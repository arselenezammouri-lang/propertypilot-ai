/**
 * Portal Adapter System — Unified interface for EU real estate portals
 * Each portal has different title rules, description limits, required fields,
 * and SEO patterns. This system normalizes them.
 */

/* ─── Brand Voice Profile ─── */

export interface BrandVoiceProfile {
  id: string;
  user_id: string;
  name: string;
  tone: "professional" | "luxury" | "friendly" | "casual" | "authoritative";
  style_keywords: string[];
  example_text: string;
  is_default: boolean;
  created_at: string;
}

/* ─── Portal System ─── */

export type PortalId =
  | "immobiliare_it"
  | "casa_it"
  | "idealista"
  | "seloger"
  | "leboncoin"
  | "immoscout24"
  | "immowelt"
  | "rightmove"
  | "zoopla"
  | "fotocasa"
  | "idealista_pt";

export type PortalLanguage = "it" | "en" | "fr" | "es" | "de" | "pt" | "ar";

export type PortalCountry = "IT" | "FR" | "ES" | "DE" | "UK" | "PT";

export interface PortalRules {
  id: PortalId;
  name: string;
  country: PortalCountry;
  language: PortalLanguage;
  title: {
    maxLength: number;
    mustInclude: string[];        // e.g. ["property type", "location"]
    forbidden: string[];          // e.g. ["URGENT", "!!!"]
    seoPattern: string;           // e.g. "{type} {rooms} in {location} — {highlight}"
  };
  description: {
    minLength: number;
    maxLength: number;
    requiredSections: string[];   // e.g. ["location", "features", "transport"]
    seoKeywords: string[];        // High-volume keywords for this portal
  };
  regulatory: {
    energyClassRequired: boolean;
    energyClassFormat: string;    // e.g. "A4-G" (Italy) or "A-G" (EU standard)
    surfaceUnit: "sqm" | "sqft";
    priceFormat: string;          // e.g. "€350.000" vs "350 000 €" vs "£350,000"
    mandatoryDisclosures: string[];
  };
  media: {
    maxPhotos: number;
    maxVideoLength: number;       // seconds
    requiredPhotoTypes: string[]; // e.g. ["exterior", "living_room"]
  };
}

/* ─── Listing Generation Input ─── */

export interface ListingGenerationInput {
  // Property data
  propertyType: string;
  location: string;
  city: string;
  country: PortalCountry;
  price: number;
  currency: "EUR" | "GBP" | "USD";
  surface: number;
  rooms: number;
  bathrooms: number;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  energyClass: string | null;
  features: string[];
  description_raw: string;

  // Generation config
  targetPortals: PortalId[];
  outputLanguages: PortalLanguage[];
  style: "luxury" | "investment" | "standard" | "emotional";
  brandVoiceId: string | null;
}

/* ─── Listing Generation Output ─── */

export interface PortalListingOutput {
  portal: PortalId;
  language: PortalLanguage;
  title: string;
  description: string;
  seoKeywords: string[];
  highlights: string[];
  callToAction: string;
  complianceChecks: ComplianceCheck[];
  characterCount: number;
  withinLimits: boolean;
}

export interface ComplianceCheck {
  rule: string;
  status: "pass" | "warning" | "fail";
  message: string;
}

export interface ListingGenerationResult {
  id: string;
  input: ListingGenerationInput;
  outputs: PortalListingOutput[];
  brandVoiceApplied: boolean;
  brandVoiceName: string | null;
  generatedAt: string;
  model: string;
  tokensUsed: number;
}

/* ─── Portal Connection (user's linked portals) ─── */

export interface PortalConnection {
  id: string;
  user_id: string;
  portal_id: PortalId;
  credentials_encrypted: string;    // AES-256 encrypted JSON
  status: "active" | "pending" | "error" | "disconnected";
  last_sync_at: string | null;
  listings_synced: number;
  leads_imported: number;
  created_at: string;
}

/* ─── Portal Adapter Interface ─── */

export interface PortalAdapter {
  portalId: PortalId;
  publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }>;
  update(externalId: string, listing: PortalListingOutput): Promise<void>;
  unpublish(externalId: string): Promise<void>;
  pollLeads(since: Date): Promise<PortalLead[]>;
}

export interface PortalLead {
  portalId: PortalId;
  externalLeadId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  propertyExternalId: string;
  receivedAt: string;
  language: PortalLanguage;
}
