/**
 * Portal Adapters — Barrel export + factory
 */

export { EstateSyncAdapter, createEstateSyncAdapter } from "./estatesync";
export { ImmobiliareAdapter, generateImmobiliareXML } from "./immobiliare";
export { IdealistaAdapter, createIdealistaAdapter } from "./idealista";

import type { PortalAdapter, PortalId } from "../types";
import { createEstateSyncAdapter } from "./estatesync";
import { ImmobiliareAdapter } from "./immobiliare";
import { createIdealistaAdapter } from "./idealista";

/**
 * Create a portal adapter from stored credentials
 */
export function createAdapter(
  portalId: PortalId,
  credentials: Record<string, string>,
  feedUrl?: string
): PortalAdapter | null {
  switch (portalId) {
    case "immoscout24":
    case "immowelt":
      return createEstateSyncAdapter(portalId, {
        clientId: credentials.clientId || "",
        clientSecret: credentials.clientSecret || "",
      });

    case "immobiliare_it":
      return new ImmobiliareAdapter(feedUrl || "");

    case "idealista":
      return createIdealistaAdapter(portalId, "es", {
        apiKey: credentials.apiKey || "",
        apiSecret: credentials.apiSecret || "",
      });

    case "idealista_pt":
      return createIdealistaAdapter(portalId, "pt", {
        apiKey: credentials.apiKey || "",
        apiSecret: credentials.apiSecret || "",
      });

    default:
      return null;
  }
}
