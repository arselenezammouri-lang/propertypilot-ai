/**
 * ID Document Template — Identity document extraction schema
 */

import type { ExtractionTemplate } from "../types";

export const ID_DOCUMENT_TEMPLATE: ExtractionTemplate = {
  document_type: "id_document",
  name: "Identity Document",
  description: "Carta d'identità, passport, permesso di soggiorno, driving license",
  fields: [
    { key: "document_type", label: "Document Type", type: "string", required: true, description: "Passport, ID card, driving license, etc." },
    { key: "document_number", label: "Document Number", type: "string", required: true, description: "Unique document identification number" },
    { key: "full_name", label: "Full Name", type: "string", required: true, description: "Full legal name as on document" },
    { key: "date_of_birth", label: "Date of Birth", type: "date", required: true, description: "Date of birth" },
    { key: "place_of_birth", label: "Place of Birth", type: "string", required: false, description: "City/country of birth" },
    { key: "nationality", label: "Nationality", type: "string", required: true, description: "Nationality/citizenship" },
    { key: "gender", label: "Gender", type: "string", required: false, description: "Gender as stated on document" },
    { key: "issue_date", label: "Issue Date", type: "date", required: true, description: "Document issue date" },
    { key: "expiry_date", label: "Expiry Date", type: "date", required: true, description: "Document expiration date" },
    { key: "issuing_authority", label: "Issuing Authority", type: "string", required: false, description: "Authority that issued the document" },
    { key: "tax_id", label: "Tax ID / Fiscal Code", type: "string", required: false, description: "Codice fiscale, NIF, NIE, etc." },
    { key: "address", label: "Registered Address", type: "string", required: false, description: "Address on the document if present" },
  ],
};
