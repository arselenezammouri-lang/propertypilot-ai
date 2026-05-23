"use client";

import { MarketingNavHeader } from "@/components/marketing-nav-header";
import { Badge } from "@/components/ui/badge";

const CHANGELOG = [
  { version: "v49", date: "2026-05-18", type: "feat", items: ["Drag-drop Visual AI uploads", "Compliance bulk re-check", "Document save-to-property/lead", "Sitemap + CLAUDE.md updates"] },
  { version: "v48", date: "2026-05-18", type: "feat", items: ["Pricing page complete rewrite (38 features)", "Before/after slider for Visual AI", "Compliance pre-publish hook", "Speed-to-lead cron integration", "Client portal (7 tabs)", "Public marketplace at /marketplace", "PDF report generator"] },
  { version: "v47", date: "2026-05-18", type: "feat", items: ["Auto-weekly market reports", "Sunday 6am cron job", "Market indices table (Idealista, ImmoScout24, Rightmove)", "AI summary + recommendations"] },
  { version: "v46", date: "2026-05-18", type: "feat", items: ["Native mobile app (React Native/Expo)", "6 screens: Dashboard, CRM, Camera, Voice, Settings, Login", "Shared Supabase auth with web"] },
  { version: "v45", date: "2026-05-18", type: "feat", items: ["Predictive seller leads (likely-to-list)", "17-feature ML model", "Feature store for XGBoost training"] },
  { version: "v44", date: "2026-05-18", type: "feat", items: ["Cross-border buyer matching marketplace", "6-country property browse", "Stripe Connect escrow ready"] },
  { version: "v43", date: "2026-05-18", type: "feat", items: ["MCP Server (10 tools, JSON-RPC 2.0)", "Claude Desktop / Cursor compatible", "Bearer token auth"] },
  { version: "v42", date: "2026-05-18", type: "feat", items: ["White-label client portal", "Agency branding editor", "Custom domains", "Mortgage calculator"] },
  { version: "v41", date: "2026-05-18", type: "feat", items: ["Lead Scoring (5-category hybrid)", "Speed-to-lead automation", "ML feature vector", "6 automation templates"] },
  { version: "v40", date: "2026-05-18", type: "feat", items: ["Document Intelligence (GPT-4o vision)", "4 EU document templates (48 fields)", "Click-to-cite citations"] },
  { version: "v39", date: "2026-05-18", type: "feat", items: ["Compliance Shield (6 EU countries)", "35+ country-specific rules", "AI deep verification"] },
  { version: "v38", date: "2026-05-18", type: "feat", items: ["Visual AI Suite (Replicate)", "Virtual staging (6 styles × 7 rooms)", "Photo enhancement (HDR, sky, twilight)", "Floor plan generation"] },
  { version: "v37", date: "2026-05-03", type: "feat", items: ["Stripe EU Tax Compliance", "VAT collection + reverse charge", "Dunning email automation"] },
  { version: "v36", date: "2026-05-03", type: "feat", items: ["CMA Report Generator + AVM", "Automated valuations with AI citations", "948 lines of code"] },
  { version: "v35", date: "2026-05-03", type: "feat", items: ["WhatsApp AI Agent", "10 intent classifications × 6 languages", "Meta Cloud API integration"] },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Changelog</span>
        </h1>
        <p className="text-muted-foreground mb-10">Every update to PropertyPilot AI, from v35 onwards.</p>

        <div className="space-y-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.version} className="flex gap-4">
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="text-xs font-mono">{entry.version}</Badge>
                <div className="w-px flex-1 bg-border/50 mt-2" />
              </div>
              <div className="pb-6">
                <p className="text-xs text-muted-foreground mb-2">{entry.date}</p>
                <ul className="space-y-1">
                  {entry.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
