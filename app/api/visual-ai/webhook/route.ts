/**
 * Visual AI Webhook — Receives Replicate prediction callbacks
 * Updates job status and output URL when prediction completes
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ReplicateWebhookPayload {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: string | string[] | null;
  error: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ReplicateWebhookPayload;

    if (!payload.id) {
      return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    const supabase = await createClient();

    // Determine output URL
    let outputUrl: string | null = null;
    if (payload.output) {
      outputUrl = Array.isArray(payload.output) ? payload.output[0] : payload.output;
    }

    // Map Replicate status to our status
    const statusMap: Record<string, string> = {
      succeeded: "completed",
      failed: "failed",
      canceled: "failed",
      processing: "processing",
      starting: "processing",
    };
    const jobStatus = statusMap[payload.status] ?? "processing";

    // Update the job
    const updateData: Record<string, unknown> = {
      status: jobStatus,
      output_url: outputUrl,
    };

    if (jobStatus === "completed") {
      updateData.completed_at = new Date().toISOString();
    }
    if (payload.error) {
      updateData.error_message = payload.error;
    }

    const { error: updateErr } = await supabase
      .from("visual_ai_jobs")
      .update(updateData)
      .eq("replicate_id", payload.id);

    if (updateErr) {
      console.error("Visual AI webhook update error:", updateErr);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Visual AI webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
