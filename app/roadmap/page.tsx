"use client";

import { MarketingNavHeader } from "@/components/marketing-nav-header";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

const ROADMAP = [
  { quarter: "Q3 2026", status: "complete", items: [
    { name: "Multilingual AI Listing Descriptions", status: "complete" },
    { name: "16 EU Portal Integrations", status: "complete" },
    { name: "Multilingual Voice Agent (Bland AI)", status: "complete" },
    { name: "WhatsApp AI Agent", status: "complete" },
    { name: "Branded CMA / AVM Reports", status: "complete" },
    { name: "Stripe EU Tax Compliance", status: "complete" },
  ]},
  { quarter: "Q4 2026", status: "complete", items: [
    { name: "Visual AI Suite (staging, enhancement, floor plans)", status: "complete" },
    { name: "Compliance Shield (6 EU countries)", status: "complete" },
    { name: "Document Intelligence (mandates, energy certs)", status: "complete" },
    { name: "Lead Scoring + Speed-to-Lead", status: "complete" },
    { name: "White-Label Client Portal", status: "complete" },
  ]},
  { quarter: "H1 2027", status: "complete", items: [
    { name: "MCP Server (AI assistant integration)", status: "complete" },
    { name: "Cross-Border Marketplace", status: "complete" },
    { name: "Predictive Seller Leads", status: "complete" },
    { name: "Native Mobile App (iOS + Android)", status: "complete" },
    { name: "Auto-Weekly Market Reports", status: "complete" },
  ]},
  { quarter: "H2 2027", status: "planned", items: [
    { name: "Enterprise tier (€1,997/mo)", status: "planned" },
    { name: "CASAFARI data partnership", status: "planned" },
    { name: "Real-time AVM with XGBoost", status: "planned" },
    { name: "AI voice cloning per-agent", status: "planned" },
    { name: "Advanced analytics with Recharts dashboards", status: "planned" },
    { name: "Franchise management module", status: "planned" },
  ]},
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Product Roadmap</span>
        </h1>
        <p className="text-muted-foreground mb-10">Our journey to building Europe&apos;s #1 AI real estate platform.</p>

        <div className="space-y-8">
          {ROADMAP.map((q) => (
            <div key={q.quarter}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold">{q.quarter}</h2>
                <Badge variant="outline" className={`text-xs ${
                  q.status === "complete" ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"
                }`}>
                  {q.status === "complete" ? "Complete" : "Planned"}
                </Badge>
              </div>
              <div className="space-y-2 ml-4">
                {q.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 text-sm">
                    {item.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <span className={item.status === "complete" ? "text-foreground" : "text-muted-foreground"}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
