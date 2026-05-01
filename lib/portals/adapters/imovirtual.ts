/**
 * Imovirtual Adapter — Portugal via OLX Group XML feed
 * Imovirtual is Portugal's leading property portal (OLX Group / Prosus).
 * Integration via OLX Group partner feed protocol.
 *
 * Feed format: OLX Real Estate XML
 * Partner: Via OLX Group (https://www.olxgroup.com)
 *
 * Portugal-specific requirements:
 *   - Certificado energético (CE) class A+ to F mandatory
 *   - IMI (Imposto Municipal sobre Imóveis) reference
 *
 * Required credentials:
 *   - apiKey: OLX Group partner API key
 *   - agencyId: Imovirtual agency identifier
 *   - feedUrl: OLX feed upload endpoint
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface ImovirtualConfig { apiKey: string; agencyId: string; feedUrl: string; }

export class ImovirtualAdapter implements PortalAdapter {
  readonly portalId: PortalId = "idealista_pt"; // Shares PT portal slot
  private config: ImovirtualConfig;

  constructor(config: ImovirtualConfig) { this.config = config; }

  async publish(listing: PortalListingOutput, media: string[]): Promise<{ externalId: string; url: string }> {
    const externalId = `imv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const imageXml = media.slice(0, 30).map((url, i) => `    <Imagem url="${esc(url)}" ordem="${i + 1}" />`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Imoveis>
  <Imovel>
    <Referencia>${esc(externalId)}</Referencia>
    <Titulo>${esc(listing.title)}</Titulo>
    <Descricao><![CDATA[${listing.description}]]></Descricao>
    <AgenciaId>${esc(this.config.agencyId)}</AgenciaId>
    <Imagens>
${imageXml}
    </Imagens>
  </Imovel>
</Imoveis>`;

    const res = await fetch(this.config.feedUrl, {
      method: "POST",
      headers: { "Content-Type": "application/xml", "X-API-Key": this.config.apiKey },
      body: xml,
    });
    if (!res.ok) throw new Error(`Imovirtual publish failed: ${res.status}`);
    return { externalId, url: `https://www.imovirtual.com/anuncio/${externalId}` };
  }

  async update(_externalId: string, listing: PortalListingOutput): Promise<void> { await this.publish(listing, []); }
  async unpublish(_externalId: string): Promise<void> { /* Feed-based removal */ }

  async pollLeads(since: Date): Promise<PortalLead[]> {
    const res = await fetch(`${this.config.feedUrl}/leads?since=${since.toISOString()}`, {
      headers: { "X-API-Key": this.config.apiKey },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.leads || []).map((l: Record<string, unknown>) => ({
      portalId: "idealista_pt" as const,
      externalLeadId: String(l.id || ""),
      name: String(l.nome || l.name || ""),
      email: String(l.email || ""),
      phone: l.telefone ? String(l.telefone) : null,
      message: String(l.mensagem || l.message || ""),
      propertyExternalId: String(l.referencia || ""),
      receivedAt: String(l.data || new Date().toISOString()),
      language: "pt" as const,
    }));
  }
}
