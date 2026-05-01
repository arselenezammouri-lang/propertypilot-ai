/**
 * Immobiliare.it XML Feed Adapter
 * Italy's #1 property portal. Uses XML feed format (Immobiliare.it MLS standard).
 *
 * How it works:
 * 1. We generate an XML feed at /api/feeds/immobiliare/[userId].xml
 * 2. Agency registers this URL in Immobiliare.it's portal backoffice
 * 3. Immobiliare.it crawler pulls the feed every 1-4 hours
 * 4. Listings are automatically created/updated/removed based on feed diff
 *
 * XML Schema: Immobiliare.it "Annuncio" format
 * Reference: https://www.immobiliare.it/info/feed-xml/
 *
 * Lead Ingestion:
 *   Immobiliare.it sends leads via email or webhook (if configured)
 *   We parse incoming emails via Resend inbound webhook OR use Immobiliare.it
 *   partner API (requires approval) to poll leads.
 */

import type { PortalAdapter, PortalId, PortalListingOutput, PortalLead } from "../types";

/* ─── XML Feed Generator ─── */

interface ImmobiliareListing {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  transactionType: "vendita" | "affitto";
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
  floor: number | null;
  totalFloors: number | null;
  energyClass: string | null;
  address: {
    street?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  features: string[];
  images: string[];
  agentName: string;
  agentEmail: string;
  agentPhone: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate Immobiliare.it-compliant XML feed from listings
 */
export function generateImmobiliareXML(
  listings: ImmobiliareListing[],
  agencyName: string,
  agencyEmail: string
): string {
  const now = new Date().toISOString();

  const listingElements = listings.map((l) => {
    const imageElements = l.images
      .map((url, i) => `      <Immagine>\n        <URLImmagine>${escapeXml(url)}</URLImmagine>\n        <Ordine>${i + 1}</Ordine>\n      </Immagine>`)
      .join("\n");

    const featureElements = l.features
      .map((f) => `      <Caratteristica>${escapeXml(f)}</Caratteristica>`)
      .join("\n");

    return `  <Annuncio>
    <IdAnnuncio>${escapeXml(l.id)}</IdAnnuncio>
    <Titolo>${escapeXml(l.title)}</Titolo>
    <Descrizione><![CDATA[${l.description}]]></Descrizione>
    <TipoImmobile>${escapeXml(l.propertyType)}</TipoImmobile>
    <TipoTransazione>${l.transactionType}</TipoTransazione>
    <Prezzo>${l.price}</Prezzo>
    <Superficie>${l.surface}</Superficie>
    <NumeroLocali>${l.rooms}</NumeroLocali>
    <NumeroBagni>${l.bathrooms}</NumeroBagni>
    ${l.floor !== null ? `<Piano>${l.floor}</Piano>` : ""}
    ${l.totalFloors !== null ? `<TotalePiani>${l.totalFloors}</TotalePiani>` : ""}
    ${l.energyClass ? `<ClasseEnergetica>${escapeXml(l.energyClass)}</ClasseEnergetica>` : ""}
    <Indirizzo>
      ${l.address.street ? `<Via>${escapeXml(l.address.street)}</Via>` : ""}
      <Citta>${escapeXml(l.address.city)}</Citta>
      <Provincia>${escapeXml(l.address.province)}</Provincia>
      <CAP>${escapeXml(l.address.postalCode)}</CAP>
      <Nazione>${escapeXml(l.address.country)}</Nazione>
      ${l.address.latitude ? `<Latitudine>${l.address.latitude}</Latitudine>` : ""}
      ${l.address.longitude ? `<Longitudine>${l.address.longitude}</Longitudine>` : ""}
    </Indirizzo>
    <Immagini>
${imageElements}
    </Immagini>
    <Caratteristiche>
${featureElements}
    </Caratteristiche>
    <Agente>
      <Nome>${escapeXml(l.agentName)}</Nome>
      <Email>${escapeXml(l.agentEmail)}</Email>
      <Telefono>${escapeXml(l.agentPhone)}</Telefono>
    </Agente>
  </Annuncio>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Feed xmlns="https://feed.immobiliare.it" version="3.0">
  <Agenzia>
    <Nome>${escapeXml(agencyName)}</Nome>
    <Email>${escapeXml(agencyEmail)}</Email>
    <DataGenerazione>${now}</DataGenerazione>
    <TotaleAnnunci>${listings.length}</TotaleAnnunci>
  </Agenzia>
  <Annunci>
${listingElements}
  </Annunci>
</Feed>`;
}

/* ─── Adapter ─── */

export class ImmobiliareAdapter implements PortalAdapter {
  readonly portalId: PortalId = "immobiliare_it";
  private feedUrl: string;

  constructor(feedUrl: string) {
    this.feedUrl = feedUrl;
  }

  /**
   * For Immobiliare.it, "publishing" means ensuring the listing is in the XML feed.
   * The actual publishing happens when Immobiliare.it's crawler pulls the feed.
   * This method returns the feed URL as the "external" reference.
   */
  async publish(
    listing: PortalListingOutput,
    _media: string[]
  ): Promise<{ externalId: string; url: string }> {
    // In practice: save listing to the saved_listings table with portal metadata.
    // The XML feed route (/api/feeds/immobiliare/[userId].xml) reads from that table.
    const externalId = `immo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      externalId,
      url: this.feedUrl,
    };
  }

  async update(_externalId: string, _listing: PortalListingOutput): Promise<void> {
    // Feed-based: just update the listing in DB, next crawl picks up changes
  }

  async unpublish(_externalId: string): Promise<void> {
    // Feed-based: remove listing from DB, next crawl removes it from Immobiliare.it
  }

  async pollLeads(_since: Date): Promise<PortalLead[]> {
    // Immobiliare.it sends leads via email. We capture them via:
    // 1. Resend inbound webhook parsing (configured in Resend dashboard)
    // 2. Or Immobiliare.it Partner API (requires separate approval)
    // Placeholder: returns empty until email parsing or API is configured
    return [];
  }
}
