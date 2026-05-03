/**
 * WhatsApp Message Templates — Pre-approved Meta templates
 *
 * ⚠️ IMPORTANT: These templates must be submitted to Meta for approval
 * before they can be used in production. Submit via:
 * Meta Business Suite → WhatsApp Manager → Message Templates
 *
 * Template names must be lowercase, alphanumeric + underscores only.
 * Each template needs approval per language.
 */

export interface WATemplate {
  name: string;
  languages: string[];
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    text?: string;
    parameters?: string[]; // {{1}}, {{2}} placeholders
  }>;
}

export const TEMPLATES: Record<string, WATemplate> = {
  welcome: {
    name: "propertypilot_welcome",
    languages: ["it", "fr", "es", "de", "en", "pt"],
    category: "MARKETING",
    components: [
      { type: "HEADER", text: "🏠 Welcome to PropertyPilot!" },
      { type: "BODY", text: "Hi {{1}}! Thanks for your interest in {{2}}. Our AI assistant is ready to help you find your dream property.\n\nReply to start searching or type 'viewing' to book a visit.", parameters: ["name", "property_or_agency"] },
      { type: "FOOTER", text: "PropertyPilot AI · propertypilotai.com" },
    ],
  },

  listing_alert: {
    name: "propertypilot_listing_alert",
    languages: ["it", "fr", "es", "de", "en", "pt"],
    category: "UTILITY",
    components: [
      { type: "HEADER", text: "🔔 New Property Match!" },
      { type: "BODY", text: "Hi {{1}}, a new property matching your criteria is available:\n\n📍 {{2}}\n💰 {{3}}\n🏠 {{4}}\n\nReply 'viewing' to book a visit or 'details' for more info.", parameters: ["name", "location", "price", "description"] },
    ],
  },

  viewing_reminder: {
    name: "propertypilot_viewing_reminder",
    languages: ["it", "fr", "es", "de", "en", "pt"],
    category: "UTILITY",
    components: [
      { type: "BODY", text: "📅 Reminder: You have a property viewing tomorrow!\n\n🏠 {{1}}\n📍 {{2}}\n🕐 {{3}}\n\nReply 'confirm' to confirm or 'cancel' to cancel.", parameters: ["property", "address", "time"] },
    ],
  },

  viewing_confirmation: {
    name: "propertypilot_viewing_confirmed",
    languages: ["it", "fr", "es", "de", "en", "pt"],
    category: "UTILITY",
    components: [
      { type: "BODY", text: "✅ Your viewing is confirmed!\n\n🏠 {{1}}\n📍 {{2}}\n🕐 {{3}}\n\nWe look forward to seeing you. The agent's contact: {{4}}", parameters: ["property", "address", "datetime", "agent_phone"] },
    ],
  },

  re_engagement: {
    name: "propertypilot_re_engagement",
    languages: ["it", "fr", "es", "de", "en", "pt"],
    category: "MARKETING",
    components: [
      { type: "BODY", text: "Hi {{1}}! 👋 It's been a while since we chatted. We have {{2}} new properties in your preferred area.\n\nReply 'show me' to see the latest listings or 'not interested' to opt out.", parameters: ["name", "count"] },
    ],
  },
};

/** Get template by name */
export function getTemplate(name: string): WATemplate | undefined {
  return TEMPLATES[name];
}

/** List all template names */
export function listTemplateNames(): string[] {
  return Object.keys(TEMPLATES);
}
