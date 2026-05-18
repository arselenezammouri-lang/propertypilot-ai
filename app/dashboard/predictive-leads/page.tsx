"use client";

import { useState } from "react";
import {
  TrendingUp,
  Target,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  Sparkles,
  BarChart3,
  Home,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PredictiveLead {
  id: string;
  address: string;
  city: string;
  country: string;
  owner_name: string;
  probability: number;
  confidence: number;
  category: string;
  key_signals: string[];
  recommended_approach: string;
  property_value: number;
}

const MOCK_LEADS: PredictiveLead[] = [
  {
    id: "1",
    address: "Via Roma 42, 3° piano",
    city: "Milano",
    country: "IT",
    owner_name: "Marco Bianchi",
    probability: 0.87,
    confidence: 0.82,
    category: "very_likely",
    key_signals: ["Owned 8 years", "3 home valuation searches", "Neighborhood prices rising +12%"],
    recommended_approach: "Direct outreach — call within 48 hours",
    property_value: 385000,
  },
  {
    id: "2",
    address: "Rue de la Paix 15, 5ème",
    city: "Paris",
    country: "FR",
    owner_name: "Sophie Martin",
    probability: 0.72,
    confidence: 0.75,
    category: "likely",
    key_signals: ["Recent divorce filing", "Moving service searches", "Property value up 8%"],
    recommended_approach: "Personalized letter + free home valuation offer",
    property_value: 520000,
  },
  {
    id: "3",
    address: "Calle Mayor 28, 2°",
    city: "Madrid",
    country: "ES",
    owner_name: "Carlos Rodriguez",
    probability: 0.54,
    confidence: 0.65,
    category: "likely",
    key_signals: ["Approaching retirement", "Low local inventory", "Owned 15 years"],
    recommended_approach: "Free home valuation + market report",
    property_value: 290000,
  },
  {
    id: "4",
    address: "Berliner Str. 88, 4. OG",
    city: "Berlin",
    country: "DE",
    owner_name: "Hans Weber",
    probability: 0.38,
    confidence: 0.58,
    category: "possible",
    key_signals: ["Job change", "Rising interest rates", "Agent contact searches"],
    recommended_approach: "Add to monthly market report mailing list",
    property_value: 445000,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  very_likely: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  likely: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  possible: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  unlikely: "text-muted-foreground border-border bg-muted/30",
};

export default function PredictiveLeadsPage() {
  const [leads] = useState(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<PredictiveLead | null>(null);

  const stats = {
    veryLikely: leads.filter((l) => l.category === "very_likely").length,
    likely: leads.filter((l) => l.category === "likely").length,
    possible: leads.filter((l) => l.category === "possible").length,
    totalValue: leads.reduce((sum, l) => sum + l.property_value, 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Predictive Seller Leads
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered identification of homeowners likely to list — powered by behavioral signals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <p className="text-xs text-muted-foreground">Very Likely</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.veryLikely}</p>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <p className="text-xs text-muted-foreground">Likely</p>
          <p className="text-2xl font-bold text-blue-400">{stats.likely}</p>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <p className="text-xs text-muted-foreground">Possible</p>
          <p className="text-2xl font-bold text-amber-400">{stats.possible}</p>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <p className="text-xs text-muted-foreground">Total Value Pipeline</p>
          <p className="text-2xl font-bold">€{(stats.totalValue / 1000).toFixed(0)}k</p>
        </Card>
      </div>

      {/* Leads Table */}
      <div className="space-y-3">
        {leads.map((lead) => (
          <Card
            key={lead.id}
            className={`p-4 bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-blue-500/30 transition-colors ${
              selectedLead?.id === lead.id ? "border-blue-500/40" : ""
            }`}
            onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{lead.owner_name}</h3>
                    <Badge variant="outline" className={`text-[10px] capitalize ${CATEGORY_COLORS[lead.category]}`}>
                      {lead.category.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {lead.address}, {lead.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold">{Math.round(lead.probability * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">probability</p>
                </div>
                <div className="w-20">
                  <Progress value={lead.probability * 100} className="h-2" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  €{lead.property_value.toLocaleString()}
                </p>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                  selectedLead?.id === lead.id ? "rotate-90" : ""
                }`} />
              </div>
            </div>

            {/* Expanded details */}
            {selectedLead?.id === lead.id && (
              <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-blue-400 mb-2">Key Signals</p>
                  <ul className="space-y-1">
                    {lead.key_signals.map((signal, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <Sparkles className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-400 mb-2">Recommended Action</p>
                  <p className="text-xs text-muted-foreground">{lead.recommended_approach}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <Phone className="w-3 h-3" /> Call
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </Button>
                    <Button size="sm" className="text-xs gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Home className="w-3 h-3" /> Free Valuation
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Data Sources */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Data Sources & Partnerships
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Predictive lead scoring combines multiple data signals. Accuracy improves with data partnerships.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Casafari", status: "Partnership" },
            { name: "Public Records", status: "Active" },
            { name: "Portal Activity", status: "Active" },
            { name: "Market Data", status: "Active" },
          ].map((source) => (
            <div key={source.name} className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-sm font-medium">{source.name}</p>
              <Badge variant="outline" className="text-[10px] mt-1">
                {source.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
