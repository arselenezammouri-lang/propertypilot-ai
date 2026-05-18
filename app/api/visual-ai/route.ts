/**
 * Visual AI Suite API — Create and list visual AI jobs
 * POST: Create a new job (staging, enhancement, floor plan)
 * GET: List user's jobs with pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { createStagingJob } from "@/lib/visual-ai/virtual-staging";
import { createEnhancementJob } from "@/lib/visual-ai/photo-enhancement";
import { createFloorPlanJob } from "@/lib/visual-ai/floor-plans";
import { VISUAL_AI_LIMITS } from "@/lib/visual-ai/types";
import type { VisualAIJobType, VisualAIOptions } from "@/lib/visual-ai/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createJobSchema = z.object({
  job_type: z.enum(["virtual_staging", "photo_enhancement", "floor_plan"]),
  image_url: z.string().url(),
  options: z.object({
    style: z.enum(["modern", "scandinavian", "industrial", "classic", "minimalist", "luxury"]).optional(),
    room_type: z.enum(["living_room", "bedroom", "kitchen", "bathroom", "dining_room", "office", "terrace"]).optional(),
    enhancement_type: z.enum(["hdr", "sky_replacement", "declutter", "color_correction", "twilight"]).optional(),
    floor_plan_style: z.enum(["2d_standard", "2d_furnished", "3d_rendered"]).optional(),
  }),
});

async function getUserPlan(supabase: ReturnType<typeof Object>, userId: string): Promise<string> {
  const sb = supabase as Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>;
  const { data } = await sb
    .from("profiles")
    .select("subscription_plan")
    .eq("id", userId)
    .single();
  return data?.subscription_plan || "free";
}

async function getMonthlyUsage(supabase: ReturnType<typeof Object>, userId: string): Promise<number> {
  const sb = supabase as Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await sb
    .from("visual_ai_jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return count ?? 0;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = createJobSchema.parse(body);

    // Check plan limits
    const plan = await getUserPlan(supabase, user.id);
    const usage = await getMonthlyUsage(supabase, user.id);
    const limit = VISUAL_AI_LIMITS[plan] ?? VISUAL_AI_LIMITS.free;

    if (usage >= limit) {
      return NextResponse.json(
        { error: `Visual AI limit reached (${limit}/month on ${plan} plan). Upgrade for more.` },
        { status: 429 }
      );
    }

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://propertypilot-ai.vercel.app"}/api/visual-ai/webhook`;

    // Dispatch to appropriate handler
    let prediction;
    const jobType: VisualAIJobType = parsed.job_type;
    const options: VisualAIOptions = parsed.options;

    switch (jobType) {
      case "virtual_staging":
        prediction = await createStagingJob({
          imageUrl: parsed.image_url,
          style: options.style ?? "modern",
          roomType: options.room_type ?? "living_room",
          webhookUrl,
        });
        break;
      case "photo_enhancement":
        prediction = await createEnhancementJob({
          imageUrl: parsed.image_url,
          enhancementType: options.enhancement_type ?? "hdr",
          webhookUrl,
        });
        break;
      case "floor_plan":
        prediction = await createFloorPlanJob({
          imageUrl: parsed.image_url,
          style: options.floor_plan_style ?? "2d_standard",
          webhookUrl,
        });
        break;
    }

    // Save job to database
    const { data: job, error: insertErr } = await supabase
      .from("visual_ai_jobs")
      .insert({
        user_id: user.id,
        job_type: jobType,
        status: "processing",
        input_url: parsed.image_url,
        replicate_id: prediction.id,
        options,
        credits_used: 1,
      })
      .select("id, status, job_type, created_at")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
    }

    return NextResponse.json({
      job_id: job.id,
      status: "processing",
      replicate_id: prediction.id,
      estimated_seconds: 30,
    });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const url = new URL(request.url);
    const jobType = url.searchParams.get("type");
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("visual_ai_jobs")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (jobType) {
      query = query.eq("job_type", jobType);
    }

    const { data: jobs, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    // Get usage info
    const plan = await getUserPlan(supabase, user.id);
    const usage = await getMonthlyUsage(supabase, user.id);
    const planLimit = VISUAL_AI_LIMITS[plan] ?? VISUAL_AI_LIMITS.free;

    return NextResponse.json({
      jobs: jobs ?? [],
      total: count ?? 0,
      page,
      limit,
      usage: { used: usage, limit: planLimit, plan },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
