/**
 * EstateSync Adapter — Unified API for German portals
 * Covers: ImmoScout24, Immowelt, Kleinanzeigen (formerly eBay Kleinanzeigen)
 *
 * EstateSync API: https://api.estatesync.com/v1
 * Auth: OAuth 2.0 client_credentials
 * Rate limit: 100 req/min per token
 *
 * API Endpoints Used:
 *   POST   /oauth/token                    — Get access token
 *   POST   /listings                       — Create listing
 *   PUT    /listings/{id}                  — Update listing
 *   DELETE /listings/{id}                  — Remove listing
 *   GET    /listings/{id}/portals          — Portal publish status
 *   POST   /listings/{id}/publish          — Publish to selected portals
 *   DELETE /listings/{id}/portals/{portal} — Unpublish from portal
 *   GET    /leads                          — Poll new leads (paginated)
 *   GET    /leads?since={ISO8601}          — Leads since timestamp
 *
 * Portal IDs in EstateSync:
 *   "immoscout24" | "immowelt" | "kleinanzeigen"
 */

import type {
  PortalAdapter,
  PortalId,
  PortalListingOutput,
  PortalLead,
} from "../types";

/* ─── Config ─── */

interface EstateSyncConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  targetPortals: Array<"immoscout24" | "immowelt" | "kleinanzeigen">;
}

interface EstateSyncToken {
  accessToken: string;
  expiresAt: number; // epoch ms
}

/* ─── Listing Payload (EstateSync Schema) ─── */

interface EstateSyncListing {
  title: string;
  description: string;
  property_type: string;
  transaction_type: "sale" | "rent";
  price: { amount: number; currency: "EUR" };
  address: {
    street?: string;
    house_number?: string;
    zip_code: string;
    city: string;
    country: "DE";
    latitude?: number;
    longitude?: number;
  };
  living_space: number; // sqm
  rooms: number;
  bathrooms: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  energy_certificate?: {
    type: "demand" | "consumption";
    class: string; // "A+" to "H"
    value: number; // kWh/(m²·a)
    heating_type?: string;
  };
  features: string[];
  images: Array<{ url: string; title?: string; sort_order: number }>;
  contact: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
}

/* ─── Adapter ─── */

export class EstateSyncAdapter implements PortalAdapter {
  readonly portalId: PortalId;
  private config: EstateSyncConfig;
  private token: EstateSyncToken | null = null;

  constructor(portalId: PortalId, config: EstateSyncConfig) {
    this.portalId = portalId;
    this.config = {
      ...config,
      baseUrl: config.baseUrl || "https://api.estatesync.com/v1",
    };
  }

  /* ─── OAuth ─── */

  private async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) {
      return this.token.accessToken;
    }

    const res = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`EstateSync OAuth failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    this.token = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return this.token.accessToken;
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const token = await this.getToken();
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return res;
  }

  /* ─── Convert our output to EstateSync schema ─── */

  private toEstateSyncPayload(
    listing: PortalListingOutput,
    media: string[],
    contact: { name: string; email: string; phone?: string; company?: string }
  ): Partial<EstateSyncListing> {
    return {
      title: listing.title,
      description: listing.description,
      transaction_type: "sale",
      price: { amount: 0, currency: "EUR" }, // Price injected from property data
      address: { zip_code: "", city: "", country: "DE" },
      features: listing.highlights,
      images: media.map((url, i) => ({ url, sort_order: i })),
      contact,
    };
  }

  /* ─── PortalAdapter Interface ─── */

  async publish(
    listing: PortalListingOutput,
    media: string[]
  ): Promise<{ externalId: string; url: string }> {
    // Step 1: Create listing in EstateSync
    const payload = this.toEstateSyncPayload(listing, media, {
      name: "PropertyPilot AI",
      email: "portals@propertypilotai.com",
    });

    const createRes = await this.request("POST", "/listings", payload);
    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`EstateSync create failed: ${createRes.status} ${err}`);
    }
    const created = await createRes.json();
    const externalId = created.id as string;

    // Step 2: Publish to target portals
    const publishRes = await this.request(`POST`, `/listings/${externalId}/publish`, {
      portals: this.config.targetPortals,
    });
    if (!publishRes.ok) {
      console.warn(`EstateSync publish warning: ${publishRes.status}`);
    }

    // Step 3: Get portal URL
    const statusRes = await this.request("GET", `/listings/${externalId}/portals`);
    const statuses = statusRes.ok ? await statusRes.json() : { portals: [] };
    const portalUrl = statuses.portals?.[0]?.url || `https://www.immobilienscout24.de/expose/${externalId}`;

    return { externalId, url: portalUrl };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    const res = await this.request("PUT", `/listings/${externalId}`, {
      title: listing.title,
      description: listing.description,
      features: listing.highlights,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`EstateSync update failed: ${res.status} ${err}`);
    }
  }

  async unpublish(externalId: string): Promise<void> {
    const res = await this.request("DELETE", `/listings/${externalId}`);
    if (!res.ok && res.status !== 404) {
      const err = await res.text();
      throw new Error(`EstateSync unpublish failed: ${res.status} ${err}`);
    }
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const sinceISO = since.toISOString();
    const res = await this.request("GET", `/leads?since=${encodeURIComponent(sinceISO)}&limit=100`);
    if (!res.ok) {
      console.error(`EstateSync pollLeads failed: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const leads: PortalLead[] = (data.leads || data.data || []).map((l: Record<string, unknown>) => ({
      portalId: this.portalId,
      externalLeadId: String(l.id || ""),
      name: String(l.name || l.contact_name || ""),
      email: String(l.email || l.contact_email || ""),
      phone: l.phone ? String(l.phone) : null,
      message: String(l.message || ""),
      propertyExternalId: String(l.listing_id || l.property_id || ""),
      receivedAt: String(l.created_at || l.received_at || new Date().toISOString()),
      language: "de" as const,
    }));

    return leads;
  }
}

/**
 * Factory: Create EstateSync adapter for a specific German portal
 */
export function createEstateSyncAdapter(
  portalId: "immoscout24" | "immowelt",
  credentials: { clientId: string; clientSecret: string }
): EstateSyncAdapter {
  const targetMap: Record<string, Array<"immoscout24" | "immowelt" | "kleinanzeigen">> = {
    immoscout24: ["immoscout24"],
    immowelt: ["immowelt"],
  };

  return new EstateSyncAdapter(portalId, {
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    baseUrl: "https://api.estatesync.com/v1",
    targetPortals: targetMap[portalId] || ["immoscout24"],
  });
}
