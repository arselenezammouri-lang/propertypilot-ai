/**
 * Idealista API Adapter — Covers Spain, Italy, Portugal
 *
 * Idealista API: https://developers.idealista.com/
 * Auth: OAuth 2.0 (client_credentials, API key + secret)
 * Coverage: Spain (idealista.com), Italy (idealista.it), Portugal (idealista.pt)
 *
 * API Endpoints:
 *   POST   /oauth/token                           — Get access token
 *   POST   /api/3.5/{country}/properties           — Create property listing
 *   PUT    /api/3.5/{country}/properties/{id}      — Update listing
 *   DELETE /api/3.5/{country}/properties/{id}      — Remove listing
 *   GET    /api/3.5/{country}/properties/{id}      — Get listing status
 *   GET    /api/3.5/{country}/leads                — Poll leads (paginated)
 *   GET    /api/3.5/{country}/leads?since={ts}     — Leads since timestamp
 *
 * Country codes: "es" (Spain), "it" (Italy), "pt" (Portugal)
 *
 * Property Types (Idealista schema):
 *   "flat" | "house" | "chalet" | "duplex" | "penthouse" | "studio" |
 *   "office" | "premises" | "garage" | "land" | "building"
 *
 * Mandatory fields:
 *   - title, description, propertyType, operation (sale|rent)
 *   - price, size (m²), rooms, bathrooms
 *   - address (street, city, province, postalCode)
 *   - energyCertificate (class A-G, required in ES/IT/PT)
 *   - at least 3 photos
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead, PortalLanguage } from "../types";

/* ─── Config ─── */

interface IdealistaConfig {
  apiKey: string;
  apiSecret: string;
  country: "es" | "it" | "pt";
  baseUrl: string;
}

interface IdealistaToken {
  accessToken: string;
  expiresAt: number;
}

/* ─── Idealista Property Schema ─── */

interface IdealistaProperty {
  title: string;
  description: string;
  propertyType: string;
  operation: "sale" | "rent";
  price: number;
  size: number;
  rooms: number;
  bathrooms: number;
  floor?: number;
  hasLift?: boolean;
  hasParking?: boolean;
  hasPool?: boolean;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  yearBuilt?: number;
  energyCertificate: {
    class: string;
    consumption?: number;
  };
  address: {
    street?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  photos: Array<{ url: string; caption?: string }>;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

/* ─── Adapter ─── */

export class IdealistaAdapter implements PortalAdapter {
  readonly portalId: PortalId;
  private config: IdealistaConfig;
  private token: IdealistaToken | null = null;

  constructor(portalId: PortalId, config: IdealistaConfig) {
    this.portalId = portalId;
    this.config = {
      ...config,
      baseUrl: config.baseUrl || "https://api.idealista.com",
    };
  }

  /* ─── OAuth ─── */

  private async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) {
      return this.token.accessToken;
    }

    const credentials = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString("base64");

    const res = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!res.ok) {
      throw new Error(`Idealista OAuth failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    this.token = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    };
    return this.token.accessToken;
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const token = await this.getToken();
    return fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }

  /* ─── Feature extraction from highlights ─── */

  private extractFeatures(highlights: string[]): Partial<IdealistaProperty> {
    const lower = highlights.map((h) => h.toLowerCase());
    return {
      hasLift: lower.some((h) => h.includes("ascensor") || h.includes("ascensore") || h.includes("elevador") || h.includes("lift")),
      hasParking: lower.some((h) => h.includes("garaje") || h.includes("garage") || h.includes("parking") || h.includes("box auto")),
      hasPool: lower.some((h) => h.includes("piscina") || h.includes("pool")),
      hasTerrace: lower.some((h) => h.includes("terraza") || h.includes("terrazzo") || h.includes("terrace")),
      hasGarden: lower.some((h) => h.includes("jardín") || h.includes("giardino") || h.includes("garden")),
    };
  }

  /* ─── PortalAdapter Interface ─── */

  async publish(
    listing: PortalListingOutput,
    media: string[]
  ): Promise<{ externalId: string; url: string }> {
    const features = this.extractFeatures(listing.highlights);

    const property: Partial<IdealistaProperty> = {
      title: listing.title,
      description: listing.description,
      operation: "sale",
      photos: media.map((url) => ({ url })),
      ...features,
      contact: {
        name: "PropertyPilot AI",
        email: "portals@propertypilotai.com",
        phone: "",
      },
    };

    const res = await this.request("POST", `/api/3.5/${this.config.country}/properties`, property);
    if (!res.ok) {
      throw new Error(`Idealista publish failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const externalId = String(data.propertyCode || data.id);
    const portalDomain = this.config.country === "es" ? "idealista.com" :
      this.config.country === "it" ? "idealista.it" : "idealista.pt";

    return {
      externalId,
      url: `https://www.${portalDomain}/inmueble/${externalId}/`,
    };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    const res = await this.request("PUT", `/api/3.5/${this.config.country}/properties/${externalId}`, {
      title: listing.title,
      description: listing.description,
    });
    if (!res.ok && res.status !== 404) {
      throw new Error(`Idealista update failed: ${res.status}`);
    }
  }

  async unpublish(externalId: string): Promise<void> {
    const res = await this.request("DELETE", `/api/3.5/${this.config.country}/properties/${externalId}`);
    if (!res.ok && res.status !== 404) {
      throw new Error(`Idealista unpublish failed: ${res.status}`);
    }
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const sinceISO = since.toISOString();
    const res = await this.request("GET", `/api/3.5/${this.config.country}/leads?since=${encodeURIComponent(sinceISO)}&limit=100`);
    if (!res.ok) {
      console.error(`Idealista pollLeads failed: ${res.status}`);
      return [];
    }

    const langMap: Record<string, PortalLanguage> = { es: "es", it: "it", pt: "pt" };
    const data = await res.json();

    return (data.leads || data.elements || []).map((l: Record<string, unknown>) => ({
      portalId: this.portalId,
      externalLeadId: String(l.leadId || l.id || ""),
      name: String(l.name || l.contactName || ""),
      email: String(l.email || l.contactEmail || ""),
      phone: l.phone ? String(l.phone) : null,
      message: String(l.message || l.comments || ""),
      propertyExternalId: String(l.propertyCode || l.propertyId || ""),
      receivedAt: String(l.date || l.createdAt || new Date().toISOString()),
      language: langMap[this.config.country] || "es",
    }));
  }
}

/**
 * Factory: Create Idealista adapter for a country
 */
export function createIdealistaAdapter(
  portalId: PortalId,
  country: "es" | "it" | "pt",
  credentials: { apiKey: string; apiSecret: string }
): IdealistaAdapter {
  return new IdealistaAdapter(portalId, {
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret,
    country,
    baseUrl: "https://api.idealista.com",
  });
}
