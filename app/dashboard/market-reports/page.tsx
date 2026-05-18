"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Calendar,
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Mail,
  Download,
  Settings,
  Sparkles,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface MarketIndex {
  country: string;
  city: string;
  source: string;
  avg_price_sqm: number;
  price_change_1m: number;
  price_change_3m: number;
  price_change_1y: number;
  avg_days_on_market: number;
  inventory_level: string;
  demand_index: number;
}

interface MarketReport {
  id: string;
  title: string;
  report_date: string;
  country: string;
  cities: string[];
  indices: MarketIndex[];
  summary: string;
  highlights: string[];
  recommendations: string[];
  email_sent: boolean;
}

const FLAG_MAP: Record<string, string> = {
  IT: "🇮🇹", FR: "🇫🇷", ES: "🇪🇸", DE: "🇩🇪", UK: "🇬🇧", PT: "🇵🇹",
};

// Mock latest report for UI
const MOCK_REPORT: MarketReport = {
  id: "1",
  title: "Weekly Market Report — IT — 2026-05-18",
  report_date: "2026-05-18",
  country: "IT",
  cities: ["Milano", "Roma", "Firenze", "Napoli", "Bologna", "Torino"],
  indices: [
    { country: "IT", city: "Milano", source: "Idealista", avg_price_sqm: 4850, price_change_1m: 1.2, price_change_3m: 3.4, price_change_1y: 7.8, avg_days_on_market: 42, inventory_level: "low", demand_index: 82 },
    { country: "IT", city: "Roma", source: "Idealista", avg_price_sqm: 3920, price_change_1m: 0.8, price_change_3m: 2.1, price_change_1y: 5.3, avg_days_on_market: 55, inventory_level: "medium", demand_index: 71 },
    { country: "IT", city: "Firenze", source: "Idealista", avg_price_sqm: 4200, price_change_1m: 1.5, price_change_3m: 4.2, price_change_1y: 9.1, avg_days_on_market: 38, inventory_level: "low", demand_index: 85 },
    { country: "IT", city: "Napoli", source: "Idealista", avg_price_sqm: 2650, price_change_1m: -0.3, price_change_3m: 0.8, price_change_1y: 2.4, avg_days_on_market: 72, inventory_level: "high", demand_index: 48 },
    { country: "IT", city: "Bologna", source: "Idealista", avg_price_sqm: 3450, price_change_1m: 0.9, price_change_3m: 2.8, price_change_1y: 6.2, avg_days_on_market: 45, inventory_level: "medium", demand_index: 74 },
    { country: "IT", city: "Torino", source: "Idealista", avg_price_sqm: 2180, price_change_1m: 0.2, price_change_3m: 0.5, price_change_1y: 1.8, avg_days_on_market: 68, inventory_level: "high", demand_index: 52 },
  ],
  summary: "The Italian property market continues its upward trend with Milano and Firenze leading. Average price change of +0.72% month-over-month across 6 tracked cities.",
  highlights: [
    "🔥 Hot markets: Milano, Firenze, Bologna",
    "❄️ Cooling: Napoli",
    "📊 Average price/m²: €3,542",
    "⏱️ Average days on market: 53",
  ],
  recommendations: [
    "Consider accelerating sales in Milano and Firenze before potential correction",
    "Advise buyers to act quickly on well-priced properties in Bologna",
    "Share this report with clients to position yourself as a market expert",
  ],
  email_sent: false,
};

export default function MarketReportsPage() {
  const [report] = useState(MOCK_REPORT);
  const [autoSend, setAutoSend] = useState(true);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Market Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Auto-generated weekly market intelligence — every Sunday at 6am
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Auto-email</span>
          <Switch checked={autoSend} onCheckedChange={setAutoSend} />
        </div>
      </div>

      <Tabs defaultValue="latest">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="latest" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Latest Report
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Calendar className="w-4 h-4" /> History
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" /> Configuration
          </TabsTrigger>
        </TabsList>

        {/* Latest Report */}
        <TabsContent value="latest" className="mt-6 space-y-6">
          {/* Report Header */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {FLAG_MAP[report.country]} {report.title}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> Generated {report.report_date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Download className="w-3 h-3" /> PDF
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Mail className="w-3 h-3" /> Email to Clients
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{report.summary}</p>
          </Card>

          {/* Market Indices Table */}
          <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold">Market Indices by City</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left p-3 pl-4">City</th>
                    <th className="text-right p-3">€/m²</th>
                    <th className="text-right p-3">1M Δ</th>
                    <th className="text-right p-3">3M Δ</th>
                    <th className="text-right p-3">1Y Δ</th>
                    <th className="text-right p-3">Days on Market</th>
                    <th className="text-right p-3">Inventory</th>
                    <th className="text-right p-3 pr-4">Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {report.indices.map((idx) => (
                    <tr key={idx.city} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="p-3 pl-4 font-medium flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {idx.city}
                      </td>
                      <td className="text-right p-3 font-mono">€{idx.avg_price_sqm.toLocaleString()}</td>
                      <td className="text-right p-3">
                        <span className={`flex items-center justify-end gap-1 ${
                          idx.price_change_1m > 0 ? "text-emerald-400" :
                          idx.price_change_1m < 0 ? "text-red-400" : "text-muted-foreground"
                        }`}>
                          {idx.price_change_1m > 0 ? <ArrowUpRight className="w-3 h-3" /> :
                           idx.price_change_1m < 0 ? <ArrowDownRight className="w-3 h-3" /> :
                           <Minus className="w-3 h-3" />}
                          {idx.price_change_1m > 0 ? "+" : ""}{idx.price_change_1m.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className={idx.price_change_3m > 0 ? "text-emerald-400" : "text-red-400"}>
                          {idx.price_change_3m > 0 ? "+" : ""}{idx.price_change_3m.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className={idx.price_change_1y > 0 ? "text-emerald-400" : "text-red-400"}>
                          {idx.price_change_1y > 0 ? "+" : ""}{idx.price_change_1y.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right p-3 font-mono">{idx.avg_days_on_market}d</td>
                      <td className="text-right p-3">
                        <Badge variant="outline" className={`text-[10px] capitalize ${
                          idx.inventory_level === "low" ? "text-red-400 border-red-500/30" :
                          idx.inventory_level === "high" ? "text-emerald-400 border-emerald-500/30" :
                          "text-amber-400 border-amber-500/30"
                        }`}>
                          {idx.inventory_level}
                        </Badge>
                      </td>
                      <td className="text-right p-3 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                              style={{ width: `${idx.demand_index}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono">{idx.demand_index}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Highlights & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" /> Key Highlights
              </h3>
              <ul className="space-y-2">
                {report.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{h}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-teal-400 mt-1">→</span> {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-6">
          <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Report History</h3>
            <p className="text-sm text-muted-foreground">
              Weekly reports will appear here. Reports are auto-generated every Sunday at 6am.
            </p>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 max-w-lg space-y-4">
            <h3 className="font-semibold">Report Configuration</h3>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Countries to Track</label>
              <div className="flex flex-wrap gap-2">
                {["IT", "FR", "ES", "DE", "UK", "PT"].map((c) => (
                  <Badge key={c} variant="outline" className="cursor-pointer hover:bg-accent">
                    {FLAG_MAP[c]} {c}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Schedule</label>
              <p className="text-sm">Every Sunday at 6:00 AM (Europe/Rome)</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">White-Label Reports</p>
                <p className="text-xs text-muted-foreground">Use your agency branding on PDF reports</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-Email to Clients</p>
                <p className="text-xs text-muted-foreground">Send weekly digest to your client list</p>
              </div>
              <Switch checked={autoSend} onCheckedChange={setAutoSend} />
            </div>

            <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              Save Configuration
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
