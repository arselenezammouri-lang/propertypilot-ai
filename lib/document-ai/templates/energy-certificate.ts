/**
 * Energy Certificate Template — APE/DPE/EPC extraction schema
 */

import type { ExtractionTemplate } from "../types";

export const ENERGY_CERTIFICATE_TEMPLATE: ExtractionTemplate = {
  document_type: "energy_certificate",
  name: "Energy Performance Certificate",
  description: "APE (IT), DPE (FR), CEE (ES), Energieausweis (DE), EPC (UK)",
  fields: [
    { key: "certificate_number", label: "Certificate Number", type: "string", required: true, description: "Unique certificate reference number" },
    { key: "energy_class", label: "Energy Class", type: "string", required: true, description: "Energy efficiency rating (A4/A+ to G)" },
    { key: "energy_index", label: "Energy Performance Index", type: "number", required: true, description: "kWh/m²/year energy consumption" },
    { key: "co2_emissions", label: "CO2 Emissions", type: "number", required: false, description: "kg CO2/m²/year" },
    { key: "co2_class", label: "CO2 Emissions Class", type: "string", required: false, description: "Greenhouse gas emissions class (A to G)" },
    { key: "property_address", label: "Property Address", type: "string", required: true, description: "Address of the certified property" },
    { key: "property_type", label: "Property Type", type: "string", required: false, description: "Type of building/unit" },
    { key: "floor_area", label: "Floor Area (m²)", type: "number", required: true, description: "Measured floor area in square meters" },
    { key: "heating_type", label: "Heating Type", type: "string", required: false, description: "Primary heating system type" },
    { key: "energy_source", label: "Energy Source", type: "string", required: false, description: "Primary energy source (gas, electric, etc.)" },
    { key: "issue_date", label: "Issue Date", type: "date", required: true, description: "Date the certificate was issued" },
    { key: "expiry_date", label: "Expiry Date", type: "date", required: true, description: "Certificate validity end date" },
    { key: "certifier_name", label: "Certifier Name", type: "string", required: false, description: "Name of the certifying professional" },
    { key: "recommendations", label: "Improvement Recommendations", type: "string", required: false, description: "Suggested energy improvement measures" },
  ],
};
