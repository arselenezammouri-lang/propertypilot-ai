/**
 * Market Reports API — List and manage user's market reports
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10", 10), 50);
    const offset = (page - 1) * limit;

    const { data: reports, count } = await supabase
      .from("market_reports")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("report_date", { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({
      reports: reports ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
