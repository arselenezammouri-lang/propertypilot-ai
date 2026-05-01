/**
 * OnTheMarket Adapter — UK via XML property feed
 * OnTheMarket (OTM) is the UK's 3rd largest portal.
 * Integration via XML feed upload.
 *
 * Required credentials:
 *   - branchId: OTM branch identifier
 *   - apiKey: OTM feed API key
 *   - feedUrl: Upload endpoint
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface OTMConfig { branchId: string; apiKey: string; feedUrl: string; }

export class OnTheMarketAdapter implements PortalAdapter {
  readonly portalId: PortalId = "rightmove"; // OTM not in PortalId enum; shares UK type
  private config: OTMConfig;

  constructor(config: OTMConfig) { this.config = config; }

  async publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }> {
    const externalId = `otm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<properties><property>
  <agent_ref>${esc(externalId)}</agent_ref>
  <branch_id>${esc(this.config.branchId)}</branch_id>
  <title>${esc(listing.title)}</title>
  <description><![CDATA[${listing.description}]]></description>
  ${media.slice(0, 20).map((u, i) => `<image_${i + 1}>${esc(u)}</image_${i + 1}>`).join("\n  ")}
</property></properties>`;

    const res = await fetch(this.config.feedUrl, {
      method: "POST",
      headers: { "Content-Type": "application/xml", "X-API-Key": this.config.apiKey },
      body: xml,
    });
    if (!res.ok) throw new Error(`OnTheMarket publish failed: ${res.status}`);
    return { externalId, url: `https://www.onthemarket.com/details/${externalId}` };
  }

  async update(_externalId: string, listing: PortalListingOutput): Promise<void> { await this.publish(listing, []); }
  async unpublish(_externalId: string): Promise<void> { /* Feed-based removal */ }
  async pollLeads(_since: Date): Promise<PortalLead[]> { return []; }
}
