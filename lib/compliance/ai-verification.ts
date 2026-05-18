/**
 * AI Verification — Uses GPT-4o to do deeper compliance analysis
 * Checks listing text for misleading claims, missing disclosures, etc.
 */

import { createOpenAIWithTimeout } from "@/lib/utils/openai-retry";
import type { ComplianceCountry, AIVerificationResult, ListingData } from "./types";

const COUNTRY_NAMES: Record<ComplianceCountry, string> = {
  IT: "Italy",
  FR: "France",
  ES: "Spain",
  DE: "Germany",
  UK: "United Kingdom",
  PT: "Portugal",
};

export async function verifyListingWithAI(
  listing: ListingData,
  country: ComplianceCountry
): Promise<AIVerificationResult> {
  const openai = createOpenAIWithTimeout();
  const countryName = COUNTRY_NAMES[country];

  const prompt = `You are a real estate compliance expert for ${countryName}. 
Analyze this property listing for regulatory compliance issues.

Listing data:
- Title: ${listing.title || "N/A"}
- Description: ${listing.description || "N/A"}
- Price: ${listing.price ? `€${listing.price}` : "Not stated"}
- Size: ${listing.sqm ? `${listing.sqm} m²` : "Not stated"}
- Rooms: ${listing.rooms || "Not stated"}
- Energy class: ${listing.energy_class || "Not stated"}
- Property type: ${listing.property_type || "Not stated"}
- City: ${listing.city || "Not stated"}
- Country: ${country}
- Photos count: ${listing.photos?.length ?? 0}

Check for:
1. Misleading or exaggerated claims in the description
2. Missing legally required information for ${countryName}
3. Language that could be considered discriminatory
4. Price transparency issues
5. Energy performance disclosure compliance

Return a JSON object with:
- overall_assessment: brief summary (1-2 sentences)
- issues_found: array of specific issues (strings)
- recommendations: array of actionable fixes (strings)
- confidence: number 0-1 indicating confidence in assessment`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        overall_assessment: "AI verification could not be completed",
        issues_found: [],
        recommendations: [],
        confidence: 0,
      };
    }

    const parsed = JSON.parse(content) as AIVerificationResult;
    return {
      overall_assessment: parsed.overall_assessment || "Analysis complete",
      issues_found: Array.isArray(parsed.issues_found) ? parsed.issues_found : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    };
  } catch {
    return {
      overall_assessment: "AI verification unavailable — check OPENAI_API_KEY",
      issues_found: [],
      recommendations: [],
      confidence: 0,
    };
  }
}
