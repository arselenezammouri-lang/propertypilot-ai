/**
 * LeBonCoin Adapter — France via Adevinta partner API
 * LeBonCoin is France's largest classifieds site (Adevinta group).
 *
 * Integration: Adevinta Partner API (REST + JSON)
 * Partner program: Requires Adevinta partner application
 *   Apply at: https://adevinta.com/partners
 * Authentication: OAuth 2.0 client_credentials
 * Rate limit: 60 req/min
 *
 * Required credentials:
 *   - clientId: Adevinta OAuth client ID
 *   - clientSecret: Adevinta OAuth client secret
 *
 * API Endpoints:
 *   POST /v1/ads         — Create ad
 *   PUT  /v1/ads/{id}    — Update ad
 *   DELETE /v1/ads/{id}  — Remove ad
 *   GET  /v1/leads       — Poll leads
 *
 * LeBonCoin specifics:
 *   - Title max 70 chars
 *   - DPE class required for real estate
 *   - Max 10 photos
 *   - Category: "ventes_immobilieres" or "locations"
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

interface LeBonCoinConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

interface LBCToken { accessToken: string; expiresAt: number; }

export class LeBonCoinAdapter implements PortalAdapter {
  readonly portalId: PortalId = "leboncoin";
  private config: LeBonCoinConfig;
  private token: LBCToken | null = null;

  constructor(config: LeBonCoinConfig) {
    this.config = { ...config, baseUrl: config.baseUrl || "https://api.adevinta.com/v1" };
  }

  private async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) return this.token.accessToken;
    const res = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: this.config.clientId, client_secret: this.config.clientSecret }),
    });
    if (!res.ok) throw new Error(`LeBonCoin OAuth failed: ${res.status}`);
    const data = await res.json();
    this.token = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return this.token.accessToken;
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const token = await this.getToken();
    return fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }

  async publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }> {
    const res = await this.request("POST", "/ads", {
      category: "ventes_immobilieres",
      title: listing.title.substring(0, 70),
      body: listing.description,
      images: media.slice(0, 10).map((url) => ({ url })),
    });
    if (!res.ok) throw new Error(`LeBonCoin publish failed: ${res.status}`);
    const data = await res.json();
    return { externalId: String(data.id), url: `https://www.leboncoin.fr/ventes_immobilieres/${data.id}.htm` };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    await this.request("PUT", `/ads/${externalId}`, { title: listing.title.substring(0, 70), body: listing.description });
  }

  async unpublish(externalId: string): Promise<void> {
    await this.request("DELETE", `/ads/${externalId}`);
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await this.request("GET", `/leads?since=${since.toISOString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "leboncoin" as const,
      externalLeadId: String(l.id || ""),
      name: String(l.name || ""),
      email: String(l.email || ""),
      phone: l.phone ? String(l.phone) : null,
      message: String(l.message || ""),
      propertyExternalId: String(l.ad_id || ""),
      receivedAt: String(l.created_at || new Date().toISOString()),
      language: "fr" as const,
    }));
  }
}
