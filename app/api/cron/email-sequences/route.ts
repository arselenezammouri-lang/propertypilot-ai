// Email Sequences Cron — Runs daily at 9am
// Sends scheduled welcome, trial-ending, and re-engagement emails via Resend

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getScheduledEmails } from "@/lib/email/sequences";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "PropertyPilot AI <noreply@propertypilotai.com>";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase env vars" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get all users with their email log history
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, subscription_plan")
    .not("email", "is", null);

  if (error || !profiles) {
    return NextResponse.json({ error: "Failed to fetch profiles", details: error?.message }, { status: 500 });
  }

  // Get existing email logs to prevent duplicates
  const { data: emailLogs } = await supabase
    .from("email_logs")
    .select("user_id, subject")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const sentMap = new Map<string, Set<string>>();
  for (const log of emailLogs || []) {
    if (!sentMap.has(log.user_id)) sentMap.set(log.user_id, new Set());
    sentMap.get(log.user_id)?.add(log.subject);
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const profile of profiles) {
    if (!profile.email) continue;

    const userSent = sentMap.get(profile.id) || new Set();
    const emailsSentKeys = Array.from(userSent).map((s) => {
      // Reconstruct sequence key from subject (best effort)
      if (s.includes("Welcome")) return "welcome:1";
      if (s.includes("Quick tip")) return "welcome:2";
      if (s.includes("Connect your first")) return "welcome:4";
      if (s.includes("trial ends in 3")) return "trial_ending:3";
      if (s.includes("trial ends in 1")) return "trial_ending:1";
      if (s.includes("trial ends in 0") || s.includes("trial ends today")) return "trial_ending:0";
      if (s.includes("miss you")) return "re_engagement:7";
      return s;
    });

    // Trial ends 7 days after signup for free users
    const trialEndsAt = profile.subscription_plan === "free"
      ? new Date(new Date(profile.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const scheduledEmails = getScheduledEmails({
      id: profile.id,
      email: profile.email,
      name: profile.full_name || "there",
      createdAt: profile.created_at,
      lastLoginAt: null, // Would come from auth.users last_sign_in_at
      plan: profile.subscription_plan || "free",
      trialEndsAt,
      emailsSent: emailsSentKeys,
    });

    for (const email of scheduledEmails) {
      if (!email.template) { skipped++; continue; }

      // Check if already sent (by subject match)
      if (userSent.has(email.template.subject)) { skipped++; continue; }

      if (!resendKey) {
        // Log intent but don't send (no Resend key configured)
        skipped++;
        continue;
      }

      try {
        // Send via Resend API
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email.email],
            subject: email.template.subject,
            html: email.template.html,
          }),
        });

        if (res.ok) {
          const resendData = await res.json();
          // Log the sent email
          await supabase.from("email_logs").insert({
            user_id: email.userId,
            resend_id: resendData.id || null,
            to: email.email,
            subject: email.template.subject,
            status: "sent",
          });
          sent++;
        } else {
          errors++;
        }
      } catch {
        errors++;
      }
    }
  }

  return NextResponse.json({
    message: `Email sequences processed`,
    profiles: profiles.length,
    sent,
    skipped,
    errors,
    timestamp: new Date().toISOString(),
  });
}
