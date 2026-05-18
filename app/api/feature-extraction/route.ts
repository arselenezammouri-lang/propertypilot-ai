import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { extractFeaturesFromText } from "@/lib/feature-extraction/extractor";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  description: z.string().min(10).max(10000),
  language: z.string().default("auto"),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const parsed = schema.parse(body);
    const features = await extractFeaturesFromText(parsed.description, parsed.language);
    return NextResponse.json({ features });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
