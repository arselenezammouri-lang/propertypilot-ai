/**
 * Document AI Extractor — Uses GPT-4o vision for document extraction
 * Extracts structured data from images/PDFs with citations
 */

import { createOpenAIWithTimeout } from "@/lib/utils/openai-retry";
import type { DocumentType, ExtractedField, DocumentCitation, ExtractionTemplate } from "./types";
import { MANDATE_TEMPLATE } from "./templates/mandate";
import { ENERGY_CERTIFICATE_TEMPLATE } from "./templates/energy-certificate";
import { DEED_TEMPLATE } from "./templates/deed";
import { ID_DOCUMENT_TEMPLATE } from "./templates/id-document";

const TEMPLATES: Record<DocumentType, ExtractionTemplate | null> = {
  mandate: MANDATE_TEMPLATE,
  energy_certificate: ENERGY_CERTIFICATE_TEMPLATE,
  deed: DEED_TEMPLATE,
  id_document: ID_DOCUMENT_TEMPLATE,
  other: null,
};

interface ExtractionResult {
  extracted_data: Record<string, ExtractedField>;
  citations: DocumentCitation[];
  confidence: number;
  language: string;
  document_type_detected: DocumentType;
}

export async function extractDocument(
  imageUrl: string,
  documentType: DocumentType,
  filename: string
): Promise<ExtractionResult> {
  const openai = createOpenAIWithTimeout();
  const template = TEMPLATES[documentType];

  const fieldsDescription = template
    ? template.fields
        .map((f) => `- ${f.key} (${f.type}${f.required ? ", required" : ""}): ${f.description}`)
        .join("\n")
    : "Extract all relevant information from the document.";

  const systemPrompt = `You are a document extraction AI specialized in European real estate documents.
You extract structured data from document images with precise citations.

For each field you extract:
1. The value
2. Your confidence (0.0 to 1.0)
3. The page number where it was found
4. The exact text excerpt from the document that contains this information

${template ? `Document type: ${template.name}\nDescription: ${template.description}\n\nFields to extract:\n${fieldsDescription}` : "Detect the document type and extract all relevant information."}

IMPORTANT:
- Return a JSON object
- Include "extracted_data" with field objects: { value, confidence, page, location }
- Include "citations" array: { field_name, text_excerpt, page, confidence }
- Include "confidence" (overall 0-1), "language" (detected language code), "document_type_detected"
- Be precise with numbers, dates, and names
- If a field is not found, set value to null with low confidence`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract structured data from this ${template?.name ?? "document"} (filename: ${filename}). Return JSON with extracted_data, citations, confidence, language, and document_type_detected.`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);

    // Normalize extracted_data
    const extractedData: Record<string, ExtractedField> = {};
    if (parsed.extracted_data && typeof parsed.extracted_data === "object") {
      for (const [key, val] of Object.entries(parsed.extracted_data)) {
        const field = val as Record<string, unknown>;
        extractedData[key] = {
          value: field.value as string | number | boolean | null ?? null,
          confidence: typeof field.confidence === "number" ? field.confidence : 0.5,
          page: typeof field.page === "number" ? field.page : 1,
          location: typeof field.location === "string" ? field.location : undefined,
        };
      }
    }

    // Normalize citations
    const citations: DocumentCitation[] = Array.isArray(parsed.citations)
      ? parsed.citations.map((c: Record<string, unknown>) => ({
          field_name: String(c.field_name ?? ""),
          text_excerpt: String(c.text_excerpt ?? ""),
          page: typeof c.page === "number" ? c.page : 1,
          confidence: typeof c.confidence === "number" ? c.confidence : 0.5,
        }))
      : [];

    return {
      extracted_data: extractedData,
      citations,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
      language: typeof parsed.language === "string" ? parsed.language : "unknown",
      document_type_detected: parsed.document_type_detected ?? documentType,
    };
  } catch (err) {
    console.error("Document extraction error:", err);
    return {
      extracted_data: {},
      citations: [],
      confidence: 0,
      language: "unknown",
      document_type_detected: documentType,
    };
  }
}
