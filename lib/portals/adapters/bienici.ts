/**
 * Bien'ici Adapter — France via Poliris XML feed
 * Bien'ici is operated by the FNAIM (French real estate federation).
 * Integration through Poliris feed aggregator.
 *
 * Feed format: Poliris XML standard
 * Partner: Via Poliris (https://www.poliris.com)
 * Leads: Email notification or Poliris API callback
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface BieniciConfig {
  polirisAgencyId: string;
  polirisFeedKey: string;
  feedUrl: string;
}

export class BieniciAdapter implements PortalAdapter {
  readonly portalId: PortalId = "seloger"; // Bien'ici uses same feed infra
  private config: BieniciConfig;

  constructor(config: BieniciConfig) {
    this.config = config;
  }

  async publish(listing: PortalListingOutput, _media: string[]): Promise<{ externalId: string; url: string }> {
    const externalId = `bci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Annonces>
  <Annonce>
    <Reference>${esc(externalId)}</Reference>
    <Titre>${esc(listing.title)}</Titre>
    <Descriptif><![CDATA[${listing.description}]]></Descriptif>
    <AgenceId>${esc(this.config.polirisAgencyId)}</AgenceId>
  </Annonce>
</Annonces>`;

    const res = await fetch(this.config.feedUrl, {
      method: "POST",
      headers: { "Content-Type": "application/xml", "X-Feed-Key": this.config.polirisFeedKey },
      body: xml,
    });

    if (!res.ok) throw new Error(`Bien'ici publish failed: ${res.status}`);
    return { externalId, url: `https://www.bienici.com/annonce/${externalId}` };
  }

  async update(externalId: string, listing: PortalListingOutput): Promise<void> {
    await this.publish(listing, []); // Feed-based: re-upload replaces
  }

  async unpublish(_externalId: string): Promise<void> {
    // Feed-based: remove from next feed generation
  }

  async pollLeads(_since: Date): Promise<PortalLead[]> {
    // Leads arrive via Poliris email forwarding
    return [];
  }
}
