import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const FOUNDER_EMAILS = [
  "arselenezammouri@gmail.com",
  "arselen@propertypilot.ai",
  "arselenezammouri-lang@users.noreply.github.com",
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !FOUNDER_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checks: Record<string, { status: "ok" | "missing" | "error"; value?: string }> = {};

    // Check critical env vars (show if set, not values)
    const envVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "OPENAI_API_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
      "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
      "NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID",
      "NEXT_PUBLIC_APP_URL",
      "RESEND_API_KEY",
      "RESEND_FROM_EMAIL",
      "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    ];

    for (const name of envVars) {
      const val = process.env[name];
      if (val) {
        checks[name] = {
          status: "ok",
          value: val.slice(0, 8) + "..." + val.slice(-4),
        };
      } else {
        checks[name] = { status: "missing" };
      }
    }

    return NextResponse.json({ checks, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
