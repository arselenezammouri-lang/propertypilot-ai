/**
 * PropertyPilot MCP Server — Tool definitions for Model Context Protocol
 * Exposes CRM, listings, leads, analytics as tools via MCP
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, MCPPropertySchema>;
    required?: string[];
  };
}

interface MCPPropertySchema {
  type: string;
  description: string;
  enum?: string[];
}

export const MCP_TOOLS: MCPTool[] = [
  {
    name: "list_listings",
    description: "List saved property listings with optional filters (city, price range, rooms)",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Filter by city name" },
        min_price: { type: "number", description: "Minimum price in EUR" },
        max_price: { type: "number", description: "Maximum price in EUR" },
        rooms: { type: "number", description: "Minimum number of rooms" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "get_listing",
    description: "Get detailed information about a specific property listing by ID",
    inputSchema: {
      type: "object",
      properties: {
        listing_id: { type: "string", description: "UUID of the listing" },
      },
      required: ["listing_id"],
    },
  },
  {
    name: "list_leads",
    description: "List CRM leads with optional status filter",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status", enum: ["new", "contacted", "qualified", "viewing", "offer", "closed", "lost"] },
        min_score: { type: "number", description: "Minimum lead score (0-100)" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "get_lead",
    description: "Get detailed information about a specific CRM lead",
    inputSchema: {
      type: "object",
      properties: {
        lead_id: { type: "string", description: "UUID of the lead" },
      },
      required: ["lead_id"],
    },
  },
  {
    name: "score_lead",
    description: "Calculate AI lead score for a lead based on behavioral signals",
    inputSchema: {
      type: "object",
      properties: {
        lead_id: { type: "string", description: "UUID of the lead to score" },
      },
      required: ["lead_id"],
    },
  },
  {
    name: "generate_description",
    description: "Generate an AI property description in the specified style and language",
    inputSchema: {
      type: "object",
      properties: {
        listing_id: { type: "string", description: "UUID of the listing" },
        style: { type: "string", description: "Writing style", enum: ["professional", "emotional", "luxury"] },
        language: { type: "string", description: "Language code", enum: ["it", "en", "fr", "es", "de", "ar"] },
      },
      required: ["listing_id"],
    },
  },
  {
    name: "run_compliance_check",
    description: "Run compliance check on a listing for a specific EU country",
    inputSchema: {
      type: "object",
      properties: {
        listing_id: { type: "string", description: "UUID of the listing" },
        country: { type: "string", description: "Country code", enum: ["IT", "FR", "ES", "DE", "UK", "PT"] },
      },
      required: ["listing_id", "country"],
    },
  },
  {
    name: "get_analytics",
    description: "Get dashboard analytics: listings count, leads count, conversion rates",
    inputSchema: {
      type: "object",
      properties: {
        period: { type: "string", description: "Time period", enum: ["7d", "30d", "90d"] },
      },
    },
  },
  {
    name: "list_automations",
    description: "List automation runs and their statuses",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status", enum: ["triggered", "executed", "skipped", "failed"] },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "generate_cma",
    description: "Generate a Comparative Market Analysis for a property",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Property address" },
        city: { type: "string", description: "City" },
        sqm: { type: "number", description: "Square meters" },
        rooms: { type: "number", description: "Number of rooms" },
        property_type: { type: "string", description: "Property type (Apartment, Villa, etc.)" },
      },
      required: ["address", "city", "sqm", "rooms"],
    },
  },
];
