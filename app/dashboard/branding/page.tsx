"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState, useEffect } from "react";
import {
  Palette,
  Save,
  Eye,
  Globe,
  Upload,
  Loader2,
  CheckCircle2,
  Type,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrandingPage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Branding state
  const [agencyName, setAgencyName] = useState("My Agency");
  const [slug, setSlug] = useState("my-agency");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6");
  const [accentColor, setAccentColor] = useState("#a78bfa");
  const [bgColor, setBgColor] = useState("#0f0f23");
  const [textColor, setTextColor] = useState("#f8fafc");
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, sans-serif");
  const [customDomain, setCustomDomain] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [footerText, setFooterText] = useState("");

  // Fetch existing branding
  useEffect(() => {
    fetch("/api/agency/branding")
      .then((r) => r.json())
      .then((data) => {
        if (data.branding) {
          const b = data.branding;
          if (b.agency_name) setAgencyName(b.agency_name);
          if (b.slug) setSlug(b.slug);
          if (b.primary_color) setPrimaryColor(b.primary_color);
          if (b.secondary_color) setSecondaryColor(b.secondary_color);
          if (b.accent_color) setAccentColor(b.accent_color);
          if (b.background_color) setBgColor(b.background_color);
          if (b.text_color) setTextColor(b.text_color);
          if (b.font_family) setFontFamily(b.font_family);
          if (b.custom_domain) setCustomDomain(b.custom_domain);
          if (b.contact_email) setContactEmail(b.contact_email);
          if (b.contact_phone) setContactPhone(b.contact_phone);
          if (b.footer_text) setFooterText(b.footer_text);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/agency/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency_name: agencyName,
          slug,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          background_color: bgColor,
          text_color: textColor,
          font_family: fontFamily,
          custom_domain: customDomain || null,
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null,
          footer_text: footerText || null,
        }),
      });
      if (res.ok) setSaved(true);
    } catch { /* silent */ }
    setLoading(false);
  };

  const FONTS = [
    "Inter, system-ui, sans-serif",
    "Poppins, sans-serif",
    "DM Sans, sans-serif",
    "Outfit, sans-serif",
    "Plus Jakarta Sans, sans-serif",
    "Lora, serif",
    "Playfair Display, serif",
  ];

  const portalUrl = `/client/${slug}`;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            White-Label Branding
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your client portal appearance — Agency plan exclusive
          </p>
        </div>
        <Badge variant="outline" className="border-violet-500/30 text-violet-400">
          Agency
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-400" /> Agency Identity
            </h3>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Agency Name</label>
              <input
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Portal Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/client/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Contact Email</label>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                  placeholder="info@agency.com"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Contact Phone</label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                  placeholder="+39 02 123456"
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-400" /> Colors & Typography
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Primary", value: primaryColor, set: setPrimaryColor },
                { label: "Secondary", value: secondaryColor, set: setSecondaryColor },
                { label: "Accent", value: accentColor, set: setAccentColor },
              ].map((c) => (
                <div key={c.label}>
                  <label className="text-xs text-muted-foreground mb-1 block">{c.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={c.value}
                      onChange={(e) => c.set(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <input
                      value={c.value}
                      onChange={(e) => c.set(e.target.value)}
                      className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                <Type className="w-3 h-3" /> Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>{f.split(",")[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                <Globe className="w-3 h-3" /> Custom Domain (optional)
              </label>
              <input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                placeholder="clients.youragency.com"
              />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : saved ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Branding</>
              )}
            </Button>
            <Button variant="outline" asChild>
              <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <Eye className="w-4 h-4" /> Preview
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur border-border/50">
          <div className="p-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-xs font-medium">Live Preview</span>
            <Badge variant="outline" className="text-[10px]">
              {slug}.propertypilot-ai.vercel.app
            </Badge>
          </div>
          <div
            className="p-6 min-h-[400px]"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              fontFamily,
            }}
          >
            {/* Mini preview of client portal */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {agencyName.charAt(0)}
              </div>
              <span className="font-semibold text-sm">{agencyName}</span>
            </div>

            <div className="space-y-3">
              <div className="h-32 rounded-lg bg-white/5 flex items-center justify-center text-sm opacity-50">
                Property Card Preview
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-xs text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Book Viewing
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-xs border"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  Contact Agent
                </button>
              </div>
              <div
                className="text-xs opacity-50 mt-4 pt-4"
                style={{ borderTop: `1px solid ${primaryColor}30` }}
              >
                {footerText || `© ${agencyName}. Powered by PropertyPilot AI`}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
