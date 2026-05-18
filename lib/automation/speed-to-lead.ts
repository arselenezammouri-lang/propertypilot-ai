/**
 * Speed-to-Lead Automation — Auto-actions based on lead score
 * 90+: auto-call (Bland AI), 80+: WhatsApp, 60+: email
 * All actions are plan-aware (check user tier limits)
 */

import type { SpeedToLeadAction } from "@/lib/ai/lead-scoring-v2";

export interface AutomationConfig {
  user_id: string;
  plan: string;
  enabled: boolean;
  thresholds: {
    auto_call: number;
    whatsapp: number;
    email: number;
  };
  business_hours: {
    start: number; // 0-23
    end: number;
    timezone: string;
    days: number[]; // 0=Sun, 1=Mon...6=Sat
  };
}

export interface AutomationRun {
  id: string;
  user_id: string;
  lead_id: string;
  action: SpeedToLeadAction;
  score: number;
  status: "triggered" | "executed" | "skipped" | "failed";
  reason?: string;
  created_at: string;
}

const PLAN_CAPABILITIES: Record<string, {
  auto_call: boolean;
  whatsapp: boolean;
  email: boolean;
  max_daily_automations: number;
}> = {
  free: { auto_call: false, whatsapp: false, email: false, max_daily_automations: 0 },
  starter: { auto_call: false, whatsapp: false, email: true, max_daily_automations: 10 },
  pro: { auto_call: true, whatsapp: true, email: true, max_daily_automations: 50 },
  agency: { auto_call: true, whatsapp: true, email: true, max_daily_automations: 200 },
};

export function isWithinBusinessHours(config: AutomationConfig): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  if (!config.business_hours.days.includes(day)) return false;
  return hour >= config.business_hours.start && hour < config.business_hours.end;
}

export function canExecuteAction(
  action: SpeedToLeadAction,
  plan: string,
  dailyCount: number
): { allowed: boolean; reason?: string } {
  const caps = PLAN_CAPABILITIES[plan] ?? PLAN_CAPABILITIES.free;

  if (dailyCount >= caps.max_daily_automations) {
    return { allowed: false, reason: `Daily automation limit reached (${caps.max_daily_automations})` };
  }

  switch (action) {
    case "auto_call":
      return caps.auto_call
        ? { allowed: true }
        : { allowed: false, reason: "Auto-call requires Pro or Agency plan" };
    case "whatsapp":
      return caps.whatsapp
        ? { allowed: true }
        : { allowed: false, reason: "WhatsApp automation requires Pro or Agency plan" };
    case "email":
      return caps.email
        ? { allowed: true }
        : { allowed: false, reason: "Email automation requires Starter plan or above" };
    default:
      return { allowed: false, reason: "Unknown action" };
  }
}

export function getDefaultConfig(userId: string, plan: string): AutomationConfig {
  return {
    user_id: userId,
    plan,
    enabled: plan !== "free",
    thresholds: {
      auto_call: 90,
      whatsapp: 80,
      email: 60,
    },
    business_hours: {
      start: 9,
      end: 19,
      timezone: "Europe/Rome",
      days: [1, 2, 3, 4, 5], // Mon-Fri
    },
  };
}

export function determineAction(
  score: number,
  config: AutomationConfig
): SpeedToLeadAction {
  if (score >= config.thresholds.auto_call) return "auto_call";
  if (score >= config.thresholds.whatsapp) return "whatsapp";
  if (score >= config.thresholds.email) return "email";
  return "none";
}
