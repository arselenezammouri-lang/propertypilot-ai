/**
 * Document AI Extract API — Upload and extract structured data from documents
 * POST: Accepts image URL or base64, returns extracted fields with citations
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { extractDocument } from "@/lib/document-ai/extractor";
import type { DocumentType } from "@/lib/document-ai/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const extractSchema = z.object({
  image_url: z.string().min(1, "Image URL required"),
  document_type: z.enum(["mandate", "energy_certificate", "deed", "id_document", "other"]),
  filename: z.string().default("document"),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = extractSchema.parse(body);

    // Run extraction
    const result = await extractDocument(
      parsed.image_url,
      parsed.document_type as DocumentType,
      parsed.filename
    );

    // Save to database
    const { data: doc, error: insertErr } = await supabase
      .from("extracted_documents")
      .insert({
        user_id: user.id,
        document_type: result.document_type_detected,
        filename: parsed.filename,
        file_url: parsed.image_url,
        status: result.confidence > 0 ? "completed" : "failed",
        extracted_data: result.extracted_data,
        citations: result.citations,
        confidence: result.confidence,
        language: result.language,
        page_count: 1,
      })
      .select("id, created_at")
      .single();

    if (insertErr) {
      console.error("Document save error:", insertErr);
    }

    return NextResponse.json({
      document_id: doc?.id,
      document_type: result.document_type_detected,
      extracted_data: result.extracted_data,
      citations: result.citations,
      confidence: result.confidence,
      language: result.language,
    });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
