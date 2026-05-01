/**
 * Portal Adapters — Barrel export + factory
 * Covers 11+ EU portals across 6 countries
 */

export { EstateSyncAdapter, createEstateSyncAdapter } from "./estatesync";
export { ImmobiliareAdapter, generateImmobiliareXML } from "./immobiliare";
export { IdealistaAdapter, createIdealistaAdapter } from "./idealista";
export { SeLogerAdapter } from "./seloger";
export { BieniciAdapter } from "./bienici";
export { LeBonCoinAdapter } from "./leboncoin";
export { RightmoveAdapter } from "./rightmove";
export { ZooplaAdapter } from "./zoopla";
export { OnTheMarketAdapter } from "./onthemarket";
export { FotocasaAdapter } from "./fotocasa";
export { ImovirtualAdapter } from "./imovirtual";

import type { PortalAdapter, PortalId } from "../types";
import { createEstateSyncAdapter } from "./estatesync";
import { ImmobiliareAdapter } from "./immobiliare";
import { createIdealistaAdapter } from "./idealista";
import { SeLogerAdapter } from "./seloger";
import { BieniciAdapter } from "./bienici";
import { LeBonCoinAdapter } from "./leboncoin";
import { RightmoveAdapter } from "./rightmove";
import { ZooplaAdapter } from "./zoopla";
import { OnTheMarketAdapter } from "./onthemarket";
import { FotocasaAdapter } from "./fotocasa";
import { ImovirtualAdapter } from "./imovirtual";

/**
 * Create a portal adapter from stored credentials
 */
export function createAdapter(
  portalId: PortalId,
  credentials: Record<string, string>,
  feedUrl?: string
): PortalAdapter | null {
  switch (portalId) {
    // Germany — EstateSync
    case "immoscout24":
    case "immowelt":
      return createEstateSyncAdapter(portalId, {
        clientId: credentials.clientId || "",
        clientSecret: credentials.clientSecret || "",
      });

    // Italy — XML Feed
    case "immobiliare_it":
      return new ImmobiliareAdapter(feedUrl || "");

    // Italy — Casa.it (same XML feed pattern as Immobiliare)
    case "casa_it":
      return new ImmobiliareAdapter(feedUrl || "");

    // Spain/Italy/Portugal — Idealista API
    case "idealista":
      return createIdealistaAdapter(portalId, (credentials.country as "es" | "it" | "pt") || "es", {
        apiKey: credentials.clientId || "",
        apiSecret: credentials.clientSecret || "",
      });

    case "idealista_pt":
      return createIdealistaAdapter(portalId, "pt", {
        apiKey: credentials.clientId || "",
        apiSecret: credentials.clientSecret || "",
      });

    // France — SeLoger (Aviv/KKR)
    case "seloger":
      return new SeLogerAdapter({
        agencyId: credentials.agencyId || "",
        apiKey: credentials.apiKey || "",
        feedEndpoint: credentials.feedEndpoint || "",
      });

    // France — LeBonCoin (Adevinta)
    case "leboncoin":
      return new LeBonCoinAdapter({
        clientId: credentials.clientId || "",
        clientSecret: credentials.clientSecret || "",
        baseUrl: "https://api.adevinta.com/v1",
      });

    // UK — Rightmove RTDF
    case "rightmove":
      return new RightmoveAdapter({
        networkId: credentials.networkId || credentials.branchId || "",
        branchId: credentials.branchId || "",
        apiKey: credentials.apiKey || "",
        baseUrl: "https://adf.rightmove.co.uk/v1",
      });

    // UK — Zoopla
    case "zoopla":
      return new ZooplaAdapter({
        apiKey: credentials.apiKey || "",
        branchId: credentials.branchId || "",
        feedUrl: credentials.feedUrl || "",
      });

    // Spain — Fotocasa (Adevinta)
    case "fotocasa":
      return new FotocasaAdapter({
        clientId: credentials.clientId || "",
        clientSecret: credentials.clientSecret || "",
        baseUrl: "https://api.adevinta.com/v1/fotocasa",
      });

    default:
      return null;
  }
}
