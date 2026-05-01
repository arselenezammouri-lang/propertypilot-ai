/**
 * Zoopla Adapter — UK property portal via XML feed
 * Zoopla (owned by Silverlake). Uses XML property feed.
 *
 * Integration: XML feed upload or SFTP
 * Feed format: Zoopla Property XML v2
 * Authentication: API key + branch credentials
 *
 * Required credentials:
 *   - apiKey: Zoopla developer API key
 *   - branchId: Branch identifier
 *   - feedUrl: Feed upload endpoint
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface ZooplaConfig {
  apiKey: string;
  branchId: string;
  feedUrl: string;
}

export class ZooplaAdapter implements PortalAdapter {
  readonly portalId: PortalId = "zoopla";
  private config: ZooplaConfig;

  constructor(config: ZooplaConfig) {
    this.config = config;
  }

  async publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }> {
    const externalId = `zp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const imageXml = media.slice(0, 25).map((url, i) => `    <image url="${esc(url)}" caption="Image ${i + 1}" />`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<properties>
  <property>
    <agent_ref>${esc(externalId)}</agent_ref>
    <branch_id>${esc(this.config.branchId)}</branch_id>
    <title>${esc(listing.title)}</title>
    <description><![CDATA[${listing.description}]]></description>
    <status>available</status>
    <images>
${imageXml}
    </images>
  </property>
</properties>`;

    const res = await fetch(this.config.feedUrl, {
      method: "POST",
      headers: { "Content-Type": "application/xml", "X-API-Key": this.config.apiKey },
      body: xml,
    });

    if (!res.ok) throw new Error(`Zoopla publish failed: ${res.status}`);
    return { externalId, url: `https://www.zoopla.co.uk/for-sale/details/${externalId}` };
  }

  async update(_externalId: string, listing: PortalListingOutput): Promise<void> {
    await this.publish(listing, []); // Feed-based: re-upload
  }

  async unpublish(_externalId: string): Promise<void> {
    // Feed-based: exclude from next feed generation
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await fetch(`${this.config.feedUrl}/leads?branch_id=${this.config.branchId}&since=${since.toISOString()}`, {
      headers: { "X-API-Key": this.config.apiKey },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "zoopla" as const,
      externalLeadId: String(l.id || ""),
      name: String(l.name || ""),
      email: String(l.email || ""),
      phone: l.phone ? String(l.phone) : null,
      message: String(l.message || ""),
      propertyExternalId: String(l.property_ref || ""),
      receivedAt: String(l.date || new Date().toISOString()),
      language: "en" as const,
    }));
  }
}
