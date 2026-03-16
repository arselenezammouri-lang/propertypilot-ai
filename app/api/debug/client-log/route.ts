import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEBUG_LOG_PATH = "/opt/cursor/logs/debug.log";

type IncomingPayload = {
  hypothesisId?: unknown;
  location?: unknown;
  message?: unknown;
  data?: unknown;
  timestamp?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as IncomingPayload;
    const safeEntry = {
      hypothesisId: typeof payload.hypothesisId === "string" ? payload.hypothesisId : "unknown",
      location: typeof payload.location === "string" ? payload.location : "unknown",
      message: typeof payload.message === "string" ? payload.message : "unknown",
      data: payload.data && typeof payload.data === "object" ? payload.data : {},
      timestamp: typeof payload.timestamp === "number" ? payload.timestamp : Date.now(),
    };

    // #region agent log
    fs.appendFileSync(DEBUG_LOG_PATH, `${JSON.stringify(safeEntry)}\n`);
    // #endregion

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
