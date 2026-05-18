/**
 * Market Reports Cron — Runs Sunday 6am, generates and emails weekly reports
 * Deploy as Vercel Cron: schedule "0 6 * * 0"
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMarketIndices, generateMarketSummary } from "@/lib/market-reports/types";

export const dynamic = "force-dynamic";

/** Default cities per country */
const DEFAULT_CITIES: Record<string, string[]> = {
  IT: ["Milano", "Roma", "Firenze", "Napoli", "Bologna", "Torino"],
  FR: ["Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse"],
  ES: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Palma"],
  DE: ["Berlin", "München", "Hamburg", "Frankfurt", "Köln", "Stuttgart"],
  UK: ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol", "Leeds"],
  PT: ["Lisboa", "Porto", "Faro", "Braga", "Coimbra", "Funchal"],
};

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all users with market report configs enabled
    const { data: configs } = await supabase
      .from("market_report_configs")
      .select("*")
      .eq("enabled", true);

    if (!configs || configs.length === 0) {
      return NextResponse.json({ message: "No active report configs", reports_generated: 0 });
    }

    let reportsGenerated = 0;

    for (const config of configs) {
      const countries = (config.countries as string[]) ?? ["IT"];

      for (const country of countries) {
        const cities = (config.cities as string[])?.length > 0
          ? (config.cities as string[])
          : DEFAULT_CITIES[country] ?? [];

        // Generate market data
        const indices = generateMarketIndices(country, cities);
        const { summary, highlights, recommendations } = await generateMarketSummary(indices, country);

        const reportDate = new Date().toISOString().split("T")[0];
        const title = `Weekly Market Report — ${country} — ${reportDate}`;

        // Save report
        await supabase.from("market_reports").insert({
          user_id: config.user_id,
          title,
          report_date: reportDate,
          country,
          cities,
          indices,
          summary,
          highlights,
          recommendations,
          pdf_url: null,
          email_sent: false,
        });

        reportsGenerated++;
      }
    }

    return NextResponse.json({
      message: `Generated ${reportsGenerated} market reports`,
      reports_generated: reportsGenerated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Market reports cron error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron failed" },
      { status: 500 }
    );
  }
}
