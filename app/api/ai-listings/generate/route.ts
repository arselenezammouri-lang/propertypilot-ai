import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { PORTAL_RULES, getPortalRules } from "@/lib/portals/rules";
import type {
  PortalId,
  PortalLanguage,
  PortalListingOutput,
  ComplianceCheck,
  ListingGenerationResult,
  BrandVoiceProfile,
} from "@/lib/portals/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

/* ─── Input Validation ─── */

const generateSchema = z.object({
  propertyType: z.string().min(1),
  location: z.string().min(1),
  city: z.string().min(1),
  country: z.enum(["IT", "FR", "ES", "DE", "UK", "PT"]),
  price: z.number().positive(),
  currency: z.enum(["EUR", "GBP", "USD"]).default("EUR"),
  surface: z.number().positive(),
  rooms: z.number().positive(),
  bathrooms: z.number().min(0).default(1),
  floor: z.number().nullable().default(null),
  totalFloors: z.number().nullable().default(null),
  yearBuilt: z.number().nullable().default(null),
  energyClass: z.string().nullable().default(null),
  features: z.array(z.string()).default([]),
  description_raw: z.string().default(""),
  targetPortals: z.array(z.string()).min(1),
  outputLanguages: z.array(z.string()).min(1),
  style: z.enum(["luxury", "investment", "standard", "emotional"]).default("standard"),
  brandVoiceId: z.string().nullable().default(null),
});

/* ─── Structured Prompt Builder ─── */

function buildPortalPrompt(
  input: z.infer<typeof generateSchema>,
  portalId: PortalId,
  lang: PortalLanguage,
  brandVoice: BrandVoiceProfile | null
): string {
  const rules = getPortalRules(portalId);

  const brandSection = brandVoice
    ? `\n## BRAND VOICE — Match this voice EXACTLY
Name: "${brandVoice.name}"
Tone: ${brandVoice.tone}
Style keywords (use these words naturally): ${brandVoice.style_keywords.join(", ")}
${brandVoice.example_text ? `\nExample of how this brand writes:\n"""${brandVoice.example_text.substring(0, 1500)}"""\n\nMimic this writing style, vocabulary, and sentence rhythm.` : ""}`
    : "";

  const regulatorySection = rules.regulatory.mandatoryDisclosures.length > 0
    ? `\n## REGULATORY (MANDATORY)\nYou MUST include these disclosures:\n${rules.regulatory.mandatoryDisclosures.map((d) => `- ${d}`).join("\n")}\nEnergy class format: ${rules.regulatory.energyClassFormat}\nSurface unit: ${rules.regulatory.surfaceUnit}\nPrice format: ${rules.regulatory.priceFormat}`
    : "";

  return `You are an expert real estate copywriter specialized in the ${rules.country} market, writing for ${rules.name}.

## PORTAL RULES
- Title: max ${rules.title.maxLength} characters. Must include: ${rules.title.mustInclude.join(", ")}
- Title SEO pattern: "${rules.title.seoPattern}"
- Forbidden in title: ${rules.title.forbidden.join(", ") || "none"}
- Description: ${rules.description.minLength}-${rules.description.maxLength} characters
- Required sections: ${rules.description.requiredSections.join(", ")}
- High-SEO keywords for this portal: ${rules.description.seoKeywords.join(", ")}
${regulatorySection}
${brandSection}

## PROPERTY DATA
- Type: ${input.propertyType}
- Location: ${input.location}, ${input.city}, ${input.country}
- Price: ${input.price} ${input.currency}
- Surface: ${input.surface} ${rules.regulatory.surfaceUnit}
- Rooms: ${input.rooms} | Bathrooms: ${input.bathrooms}
${input.floor !== null ? `- Floor: ${input.floor}/${input.totalFloors}` : ""}
${input.yearBuilt ? `- Year built: ${input.yearBuilt}` : ""}
${input.energyClass ? `- Energy class: ${input.energyClass}` : ""}
- Features: ${input.features.join(", ") || "Not specified"}
${input.description_raw ? `- Agent notes: ${input.description_raw}` : ""}

## STYLE: ${input.style.toUpperCase()}
${input.style === "luxury" ? "Write with sophistication, exclusivity, and aspiration. Use sensory language." : ""}
${input.style === "investment" ? "Lead with ROI data, rental yield potential, and market positioning." : ""}
${input.style === "emotional" ? "Create vivid lifestyle imagery. Help buyers imagine living here." : ""}
${input.style === "standard" ? "Professional, clear, and informative. Highlight practical benefits." : ""}

## OUTPUT LANGUAGE: ${lang.toUpperCase()}
Write EVERYTHING in ${lang === "it" ? "Italian" : lang === "fr" ? "French" : lang === "es" ? "Spanish" : lang === "de" ? "German" : lang === "pt" ? "Portuguese" : "English"}.

## RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "title": "...",
  "description": "...",
  "seoKeywords": ["keyword1", "keyword2", ...],
  "highlights": ["highlight1", "highlight2", ...],
  "callToAction": "..."
}`;
}

/* ─── Compliance Checker ─── */

function checkCompliance(
  output: { title: string; description: string },
  portalId: PortalId,
  energyClass: string | null
): ComplianceCheck[] {
  const rules = getPortalRules(portalId);
  const checks: ComplianceCheck[] = [];

  // Title length
  if (output.title.length > rules.title.maxLength) {
    checks.push({ rule: "title_length", status: "fail", message: `Title exceeds ${rules.title.maxLength} chars (${output.title.length})` });
  } else {
    checks.push({ rule: "title_length", status: "pass", message: `Title within ${rules.title.maxLength} char limit` });
  }

  // Description length
  if (output.description.length < rules.description.minLength) {
    checks.push({ rule: "description_min", status: "warning", message: `Description below ${rules.description.minLength} chars (${output.description.length})` });
  } else if (output.description.length > rules.description.maxLength) {
    checks.push({ rule: "description_max", status: "fail", message: `Description exceeds ${rules.description.maxLength} chars` });
  } else {
    checks.push({ rule: "description_length", status: "pass", message: "Description within limits" });
  }

  // Energy class
  if (rules.regulatory.energyClassRequired) {
    const hasEnergy = output.description.toLowerCase().includes("energ") || output.description.toLowerCase().includes("dpe") || output.description.toLowerCase().includes("epc");
    if (!hasEnergy && !energyClass) {
      checks.push({ rule: "energy_class", status: "warning", message: `${rules.name} requires energy class disclosure` });
    } else {
      checks.push({ rule: "energy_class", status: "pass", message: "Energy class referenced" });
    }
  }

  // Forbidden words in title
  for (const word of rules.title.forbidden) {
    if (output.title.toLowerCase().includes(word.toLowerCase())) {
      checks.push({ rule: "forbidden_word", status: "fail", message: `Title contains forbidden word: "${word}"` });
    }
  }

  return checks;
}

/* ─── Fallback Generator (no OpenAI needed) ─── */

function generateFallback(
  input: z.infer<typeof generateSchema>,
  portalId: PortalId,
  lang: PortalLanguage
): { title: string; description: string; seoKeywords: string[]; highlights: string[]; callToAction: string } {
  const rules = getPortalRules(portalId);
  const priceStr = input.price.toLocaleString(lang === "en" ? "en-GB" : lang);

  const titles: Record<PortalLanguage, string> = {
    it: `${input.propertyType} ${input.rooms} locali a ${input.location} — ${input.surface}m²`,
    en: `${input.rooms} Bedroom ${input.propertyType} in ${input.location} — ${input.surface}sqm`,
    fr: `${input.propertyType} ${input.rooms} pièces à ${input.location} (${input.surface}m²)`,
    es: `${input.propertyType} en ${input.location} — ${input.rooms} hab, ${input.surface}m²`,
    de: `${input.propertyType} in ${input.location} — ${input.rooms} Zimmer, ${input.surface}m²`,
    pt: `${input.propertyType} em ${input.location} — T${input.rooms}, ${input.surface}m²`,
    ar: `${input.propertyType} في ${input.location} — ${input.rooms} غرف`,
  };

  const descriptions: Record<PortalLanguage, string> = {
    it: `Proponiamo in vendita ${input.propertyType.toLowerCase()} di ${input.surface}m² situato a ${input.location}, ${input.city}. L'immobile si compone di ${input.rooms} locali e ${input.bathrooms} bagni.${input.features.length > 0 ? ` Caratteristiche principali: ${input.features.join(", ")}.` : ""} ${input.energyClass ? `Classe energetica: ${input.energyClass}.` : ""} Prezzo: €${priceStr}. Contattateci per maggiori informazioni o per prenotare una visita.`,
    en: `We are pleased to present this ${input.surface}sqm ${input.propertyType.toLowerCase()} located in ${input.location}, ${input.city}. The property comprises ${input.rooms} rooms and ${input.bathrooms} bathrooms.${input.features.length > 0 ? ` Key features: ${input.features.join(", ")}.` : ""} ${input.energyClass ? `Energy rating: ${input.energyClass}.` : ""} Price: ${input.currency === "GBP" ? "£" : "€"}${priceStr}. Contact us for more information or to arrange a viewing.`,
    fr: `Nous vous proposons ce ${input.propertyType.toLowerCase()} de ${input.surface}m² situé à ${input.location}, ${input.city}. Le bien se compose de ${input.rooms} pièces et ${input.bathrooms} salle(s) de bain.${input.features.length > 0 ? ` Prestations : ${input.features.join(", ")}.` : ""} ${input.energyClass ? `DPE : ${input.energyClass}.` : ""} Prix : ${priceStr} €. Contactez-nous pour plus d'informations.`,
    es: `Presentamos este ${input.propertyType.toLowerCase()} de ${input.surface}m² ubicado en ${input.location}, ${input.city}. La propiedad cuenta con ${input.rooms} habitaciones y ${input.bathrooms} baños.${input.features.length > 0 ? ` Características: ${input.features.join(", ")}.` : ""} ${input.energyClass ? `Certificado energético: ${input.energyClass}.` : ""} Precio: ${priceStr} €. Contáctenos para más información.`,
    de: `Wir präsentieren diese ${input.surface}m² ${input.propertyType} in ${input.location}, ${input.city}. Die Immobilie verfügt über ${input.rooms} Zimmer und ${input.bathrooms} Badezimmer.${input.features.length > 0 ? ` Ausstattung: ${input.features.join(", ")}.` : ""} ${input.energyClass ? `Energieausweis: ${input.energyClass}.` : ""} Preis: ${priceStr} €. Kontaktieren Sie uns für weitere Informationen.`,
    pt: `Apresentamos este ${input.propertyType.toLowerCase()} de ${input.surface}m² localizado em ${input.location}, ${input.city}. O imóvel dispõe de ${input.rooms} quartos e ${input.bathrooms} casas de banho.${input.features.length > 0 ? ` Características: ${input.features.join(", ")}.` : ""} ${input.energyClass ? `Certificado energético: ${input.energyClass}.` : ""} Preço: ${priceStr} €. Contacte-nos para mais informações.`,
    ar: `نقدم لكم ${input.propertyType} بمساحة ${input.surface}م² في ${input.location}, ${input.city}. يتكون العقار من ${input.rooms} غرف و ${input.bathrooms} حمامات. السعر: €${priceStr}.`,
  };

  return {
    title: (titles[lang] || titles.en).substring(0, rules.title.maxLength),
    description: descriptions[lang] || descriptions.en,
    seoKeywords: rules.description.seoKeywords.slice(0, 8),
    highlights: input.features.slice(0, 5),
    callToAction: lang === "it" ? "Prenota una visita oggi" : lang === "fr" ? "Planifiez une visite" : lang === "es" ? "Agenda una visita" : lang === "de" ? "Besichtigung vereinbaren" : "Schedule a viewing today",
  };
}

/* ─── Main API Handler ─── */

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = generateSchema.parse(body);

    // Load brand voice if specified
    let brandVoice: BrandVoiceProfile | null = null;
    if (parsed.brandVoiceId) {
      const { data } = await supabase
        .from("brand_voice_profiles")
        .select("*")
        .eq("id", parsed.brandVoiceId)
        .eq("user_id", user.id)
        .maybeSingle();
      brandVoice = data as BrandVoiceProfile | null;
    }

    const outputs: PortalListingOutput[] = [];

    for (const portalIdRaw of parsed.targetPortals) {
      const portalId = portalIdRaw as PortalId;
      if (!PORTAL_RULES[portalId]) continue;

      for (const langRaw of parsed.outputLanguages) {
        const lang = langRaw as PortalLanguage;

        // Build the prompt (ready for OpenAI/Claude when API key is live)
        const _prompt = buildPortalPrompt(parsed, portalId, lang, brandVoice);

        // For now use the structured fallback generator
        // When OpenAI API key is configured, swap to:
        //   const aiResponse = await openai.chat.completions.create({ ... })
        const generated = generateFallback(parsed, portalId, lang);

        const compliance = checkCompliance(generated, portalId, parsed.energyClass);
        const rules = getPortalRules(portalId);

        outputs.push({
          portal: portalId,
          language: lang,
          title: generated.title,
          description: generated.description,
          seoKeywords: generated.seoKeywords,
          highlights: generated.highlights,
          callToAction: generated.callToAction,
          complianceChecks: compliance,
          characterCount: generated.description.length,
          withinLimits: generated.description.length >= rules.description.minLength && generated.description.length <= rules.description.maxLength,
        });
      }
    }

    // Log generation
    await supabase.from("generation_logs").insert({
      user_id: user.id,
      type: "ai_listing_v2",
      input_data: parsed,
      output_count: outputs.length,
    }).then(() => {});

    const result: ListingGenerationResult = {
      id: crypto.randomUUID(),
      input: parsed as ListingGenerationResult["input"],
      outputs,
      brandVoiceApplied: !!brandVoice,
      brandVoiceName: brandVoice?.name || null,
      generatedAt: new Date().toISOString(),
      model: "structured-fallback-v1",
      tokensUsed: 0,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("[AI-LISTINGS] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
