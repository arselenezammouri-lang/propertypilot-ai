/**
 * Deed Template — Property deed/title extraction schema
 */

import type { ExtractionTemplate } from "../types";

export const DEED_TEMPLATE: ExtractionTemplate = {
  document_type: "deed",
  name: "Property Deed / Title",
  description: "Atto di compravendita, titre de propriété, escritura de compraventa",
  fields: [
    { key: "deed_number", label: "Deed Number", type: "string", required: true, description: "Notarial deed reference number" },
    { key: "deed_date", label: "Deed Date", type: "date", required: true, description: "Date of the deed execution" },
    { key: "notary_name", label: "Notary Name", type: "string", required: true, description: "Name of the notary" },
    { key: "seller_name", label: "Seller Name", type: "string", required: true, description: "Name of the seller/transferor" },
    { key: "buyer_name", label: "Buyer Name", type: "string", required: true, description: "Name of the buyer/transferee" },
    { key: "property_address", label: "Property Address", type: "string", required: true, description: "Full property address" },
    { key: "cadastral_reference", label: "Cadastral Reference", type: "string", required: true, description: "Foglio, particella, subalterno (IT) or equivalent" },
    { key: "sale_price", label: "Sale Price", type: "number", required: true, description: "Transaction price in EUR" },
    { key: "property_description", label: "Property Description", type: "string", required: false, description: "Legal description of the property" },
    { key: "surface_area", label: "Surface Area (m²)", type: "number", required: false, description: "Property surface area" },
    { key: "encumbrances", label: "Encumbrances", type: "string", required: false, description: "Any liens, mortgages, or easements" },
    { key: "registration_date", label: "Registration Date", type: "date", required: false, description: "Date registered at land registry" },
  ],
};
