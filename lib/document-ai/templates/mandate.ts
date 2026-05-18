/**
 * Mandate Template — Extraction schema for real estate mandates
 */

import type { ExtractionTemplate } from "../types";

export const MANDATE_TEMPLATE: ExtractionTemplate = {
  document_type: "mandate",
  name: "Real Estate Mandate",
  description: "Exclusive or non-exclusive property sale/rental mandate",
  fields: [
    { key: "mandate_type", label: "Mandate Type", type: "string", required: true, description: "Exclusive (esclusiva) or non-exclusive (non esclusiva)" },
    { key: "mandate_number", label: "Mandate Number", type: "string", required: false, description: "Reference number of the mandate" },
    { key: "start_date", label: "Start Date", type: "date", required: true, description: "Date the mandate begins" },
    { key: "end_date", label: "End Date", type: "date", required: true, description: "Date the mandate expires" },
    { key: "property_address", label: "Property Address", type: "string", required: true, description: "Full address of the property" },
    { key: "property_type", label: "Property Type", type: "string", required: false, description: "Type of property (apartment, villa, etc.)" },
    { key: "asking_price", label: "Asking Price", type: "number", required: true, description: "Listed asking price in EUR" },
    { key: "commission_rate", label: "Commission Rate", type: "number", required: true, description: "Agency commission percentage" },
    { key: "seller_name", label: "Seller Name", type: "string", required: true, description: "Full name of the property owner/seller" },
    { key: "seller_tax_id", label: "Seller Tax ID", type: "string", required: false, description: "Codice fiscale or tax ID of the seller" },
    { key: "agency_name", label: "Agency Name", type: "string", required: true, description: "Name of the real estate agency" },
    { key: "agency_license", label: "Agency License", type: "string", required: false, description: "Agency registration/license number" },
    { key: "special_conditions", label: "Special Conditions", type: "string", required: false, description: "Any special terms or conditions" },
  ],
};
