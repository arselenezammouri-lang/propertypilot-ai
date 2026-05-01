/**
 * Rightmove RTDF Adapter — UK's #1 property portal
 * Uses Real Time Data Feed (RTDF) protocol (formerly BLM format).
 *
 * ⚠️ PARTNER STATUS REQUIRED
 * Rightmove RTDF is only available to approved software partners.
 * Apply at: https://www.rightmove.co.uk/developer/
 * Approval process: ~4-8 weeks, requires demo of software
 *
 * Protocol: HTTPS POST with JSON payload (RTDF v3)
 * Auth: Certificate-based mutual TLS + API key
 * Endpoint: https://adf.rightmove.co.uk/v1/property/sendpropertydetails
 *
 * Required credentials:
 *   - networkId: Rightmove network/branch ID
 *   - apiKey: RTDF API key (issued after partner approval)
 *   - branchId: Branch identifier
 *
 * UK-specific requirements:
 *   - EPC rating (A-G) mandatory
 *   - Council tax band
 *   - Tenure: freehold / leasehold / share of freehold
 *   - Stamp duty information
 *   - Price qualifier: "guide price", "offers over", "fixed price"
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

interface RightmoveConfig {
  networkId: string;
  branchId: string;
  apiKey: string;
  baseUrl: string;
}

export class RightmoveAdapter implements PortalAdapter {
  readonly portalId: PortalId = "rightmove";
  private config: RightmoveConfig;

  constructor(config: RightmoveConfig) {
    this.config = { ...config, baseUrl: config.baseUrl || "https://adf.rightmove.co.uk/v1" };
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    return fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.config.apiKey,
        "X-Network-Id": this.config.networkId,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }

  async publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }> {
    const payload = {
      network: { network_id: this.config.networkId },
      branch: { branch_id: this.config.branchId },
      property: {
        agent_ref: `pp-${Date.now()}`,
        published: true,
        property_type: "FLAT",
        status: "AVAILABLE",
        summary: listing.title,
        description: listing.description,
        media_image_60: media.slice(0, 30).map((url, i) => ({ media_url: url, caption: `Image ${i + 1}` })),
      },
    };

    const res = await this.request("POST", "/property/sendpropertydetails", payload);
    if (!res.ok) throw new Error(`Rightmove RTDF failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const externalId = data.property?.agent_ref || payload.property.agent_ref;
    return { externalId, url: `https://www.rightmove.co.uk/properties/${externalId}` };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    await this.request("POST", "/property/sendpropertydetails", {
      network: { network_id: this.config.networkId },
      branch: { branch_id: this.config.branchId },
      property: { agent_ref: externalId, summary: listing.title, description: listing.description },
    });
  }

  async unpublish(externalId: string): Promise<void> {
    await this.request("POST", "/property/removeproperty", {
      network: { network_id: this.config.networkId },
      branch: { branch_id: this.config.branchId },
      property: { agent_ref: externalId },
    });
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await this.request("GET", `/leads?branch_id=${this.config.branchId}&since=${since.toISOString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "rightmove" as const,
      externalLeadId: String(l.enquiry_id || l.id || ""),
      name: String(l.full_name || l.first_name || ""),
      email: String(l.email || ""),
      phone: l.phone ? String(l.phone) : null,
      message: String(l.message || l.comments || ""),
      propertyExternalId: String(l.agent_ref || l.property_id || ""),
      receivedAt: String(l.created_at || new Date().toISOString()),
      language: "en" as const,
    }));
  }
}
