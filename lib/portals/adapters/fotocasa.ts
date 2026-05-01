/**
 * Fotocasa Adapter — Spain via Adevinta XML feed
 * Fotocasa is owned by Adevinta (same group as LeBonCoin).
 * Integration via Adevinta partner XML feed protocol.
 *
 * Partner program: Via Adevinta (https://adevinta.com/partners)
 * Feed format: Adevinta Real Estate XML
 *
 * Spain-specific requirements:
 *   - Certificado energético (CE) class A-G mandatory
 *   - Gastos de comunidad
 *   - IBI (Impuesto sobre Bienes Inmuebles)
 *
 * Required credentials:
 *   - clientId: Adevinta OAuth client ID
 *   - clientSecret: Adevinta OAuth client secret
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

interface FotocasaConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

interface FCToken { accessToken: string; expiresAt: number; }

export class FotocasaAdapter implements PortalAdapter {
  readonly portalId: PortalId = "fotocasa";
  private config: FotocasaConfig;
  private token: FCToken | null = null;

  constructor(config: FotocasaConfig) {
    this.config = { ...config, baseUrl: config.baseUrl || "https://api.adevinta.com/v1/fotocasa" };
  }

  private async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60_000) return this.token.accessToken;
    const res = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: this.config.clientId, client_secret: this.config.clientSecret }),
    });
    if (!res.ok) throw new Error(`Fotocasa OAuth failed: ${res.status}`);
    const data = await res.json();
    this.token = { accessToken: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
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
      title: listing.title.substring(0, 90),
      description: listing.description,
      images: media.slice(0, 30).map((url) => ({ url })),
    });
    if (!res.ok) throw new Error(`Fotocasa publish failed: ${res.status}`);
    const data = await res.json();
    return { externalId: String(data.id), url: `https://www.fotocasa.es/es/comprar/vivienda/${data.id}` };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    await this.request("PUT", `/ads/${externalId}`, { title: listing.title.substring(0, 90), description: listing.description });
  }

  async unpublish(externalId: string): Promise<void> {
    await this.request("DELETE", `/ads/${externalId}`);
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await this.request("GET", `/leads?since=${since.toISOString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "fotocasa" as const,
      externalLeadId: String(l.id || ""),
      name: String(l.nombre || l.name || ""),
      email: String(l.email || ""),
      phone: l.telefono ? String(l.telefono) : null,
      message: String(l.mensaje || l.message || ""),
      propertyExternalId: String(l.ad_id || ""),
      receivedAt: String(l.fecha || l.date || new Date().toISOString()),
      language: "es" as const,
    }));
  }
}
