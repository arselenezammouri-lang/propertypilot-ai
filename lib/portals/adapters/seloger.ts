/**
 * SeLoger Adapter — France's premium property portal
 * Owned by Aviv Group (KKR). Uses partner XML feed protocol.
 *
 * Integration: XML feed upload via SFTP or API endpoint
 * Partner program: Requires Aviv/KKR partner application
 *   Apply at: https://www.avivgroup.com/partners
 * Feed format: SeLoger XML v3 (proprietary)
 * Lead ingestion: Webhook callback or email parsing
 *
 * Required credentials:
 *   - agencyId: SeLoger agency identifier
 *   - apiKey: Partner API key (from Aviv partner portal)
 *   - feedEndpoint: SFTP host or API upload URL
 *
 * Mandatory fields per listing:
 *   - DPE (Diagnostic de Performance Energétique) class A-G
 *   - GES (Gaz à Effet de Serre) class A-G
 *   - Loi Carrez surface (for copropriété)
 *   - Charges de copropriété mensuelles
 *   - Honoraires (agency fees) with mention "charge acquéreur" or "charge vendeur"
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

interface SeLogerConfig {
  agencyId: string;
  apiKey: string;
  feedEndpoint: string;
}

export class SeLogerAdapter implements PortalAdapter {
  readonly portalId: PortalId = "seloger";
  private config: SeLogerConfig;

  constructor(config: SeLogerConfig) {
    this.config = config;
  }

  private buildListingXml(listing: PortalListingOutput, externalId: string): string {
    return `<Annonce>
  <Reference>${escapeXml(externalId)}</Reference>
  <Titre>${escapeXml(listing.title)}</Titre>
  <Descriptif><![CDATA[${listing.description}]]></Descriptif>
  <IdAgence>${escapeXml(this.config.agencyId)}</IdAgence>
  <MotsCles>${listing.seoKeywords.join(", ")}</MotsCles>
</Annonce>`;
  }

  async publish(listing: PortalListingOutput, _media: string[]): Promise<{ externalId: string; url: string }> {
    const externalId = `sl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const xml = this.buildListingXml(listing, externalId);

    const res = await fetch(this.config.feedEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "X-API-Key": this.config.apiKey,
        "X-Agency-Id": this.config.agencyId,
      },
      body: xml,
    });

    if (!res.ok) throw new Error(`SeLoger publish failed: ${res.status}`);
    return { externalId, url: `https://www.seloger.com/annonces/${externalId}.htm` };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    const xml = this.buildListingXml(listing, externalId);
    await fetch(this.config.feedEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/xml", "X-API-Key": this.config.apiKey },
      body: xml,
    });
  }

  async unpublish(externalId: string): Promise<void> {
    await fetch(`${this.config.feedEndpoint}/${externalId}`, {
      method: "DELETE",
      headers: { "X-API-Key": this.config.apiKey },
    });
  }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await fetch(`${this.config.feedEndpoint}/leads?since=${since.toISOString()}`, {
      headers: { "X-API-Key": this.config.apiKey },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "seloger" as const,
      externalLeadId: String(l.id || ""),
      name: String(l.nom || l.name || ""),
      email: String(l.email || ""),
      phone: l.telephone ? String(l.telephone) : null,
      message: String(l.message || ""),
      propertyExternalId: String(l.reference || ""),
      receivedAt: String(l.date || new Date().toISOString()),
      language: "fr" as const,
    }));
  }
}
