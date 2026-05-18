/**
 * Document Intelligence — Types for document extraction and analysis
 */

export type DocumentType = "mandate" | "energy_certificate" | "deed" | "id_document" | "other";

export type ExtractionStatus = "pending" | "processing" | "completed" | "failed";

export interface ExtractedDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  filename: string;
  file_url: string;
  status: ExtractionStatus;
  extracted_data: Record<string, ExtractedField>;
  citations: DocumentCitation[];
  confidence: number;
  language: string;
  page_count: number;
  created_at: string;
}

export interface ExtractedField {
  value: string | number | boolean | null;
  confidence: number;
  page: number;
  location?: string;
}

export interface DocumentCitation {
  field_name: string;
  text_excerpt: string;
  page: number;
  confidence: number;
}

export interface ExtractionTemplate {
  document_type: DocumentType;
  name: string;
  description: string;
  fields: TemplateField[];
}

export interface TemplateField {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "boolean";
  required: boolean;
  description: string;
}
