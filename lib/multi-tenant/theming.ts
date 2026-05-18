/**
 * Multi-Tenant Theming — CSS variables for white-label client portals
 * Agency-tier exclusive: custom logo, colors, fonts, domain
 */

export interface AgencyBranding {
  id: string;
  user_id: string;
  agency_name: string;
  slug: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  custom_domain: string | null;
  footer_text: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_BRANDING: Omit<AgencyBranding, "id" | "user_id" | "created_at" | "updated_at"> = {
  agency_name: "PropertyPilot Agency",
  slug: "",
  logo_url: null,
  favicon_url: null,
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  accent_color: "#a78bfa",
  background_color: "#0f0f23",
  text_color: "#f8fafc",
  font_family: "Inter, system-ui, sans-serif",
  custom_domain: null,
  footer_text: null,
  contact_email: null,
  contact_phone: null,
  social_links: {},
};

/**
 * Generate CSS custom properties from branding config
 */
export function brandingToCSSVariables(branding: AgencyBranding): string {
  return `
    :root {
      --agency-primary: ${branding.primary_color};
      --agency-secondary: ${branding.secondary_color};
      --agency-accent: ${branding.accent_color};
      --agency-bg: ${branding.background_color};
      --agency-text: ${branding.text_color};
      --agency-font: ${branding.font_family};
    }
  `.trim();
}

/**
 * Generate inline style object from branding
 */
export function brandingToStyles(branding: AgencyBranding): Record<string, string> {
  return {
    "--agency-primary": branding.primary_color,
    "--agency-secondary": branding.secondary_color,
    "--agency-accent": branding.accent_color,
    "--agency-bg": branding.background_color,
    "--agency-text": branding.text_color,
    fontFamily: branding.font_family,
  };
}

const FONT_OPTIONS = [
  "Inter, system-ui, sans-serif",
  "Poppins, sans-serif",
  "DM Sans, sans-serif",
  "Outfit, sans-serif",
  "Plus Jakarta Sans, sans-serif",
  "Lora, serif",
  "Playfair Display, serif",
] as const;

export function getFontOptions(): readonly string[] {
  return FONT_OPTIONS;
}
