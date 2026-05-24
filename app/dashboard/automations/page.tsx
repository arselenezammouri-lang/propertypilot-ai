"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState } from "react";
import {
  Zap,
  Phone,
  MessageCircle,
  Mail,
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  icon: React.ReactNode;
  plan: "starter" | "pro" | "agency";
}

interface AutomationRun {
  id: string;
  action: string;
  lead_name: string;
  score: number;
  status: "executed" | "skipped" | "failed";
  created_at: string;
}

const TEMPLATES: AutomationTemplate[] = [
  {
    id: "hot-lead-call",
    name: "Hot Lead Auto-Call",
    description: "Automatically call leads scoring 90+ via Bland AI within 30 seconds",
    trigger: "Lead score ≥ 90",
    action: "Bland AI voice call",
    icon: <Phone className="w-5 h-5 text-red-400" />,
    plan: "pro",
  },
  {
    id: "warm-lead-whatsapp",
    name: "Warm Lead WhatsApp",
    description: "Send personalized WhatsApp message with property matches for scores 80+",
    trigger: "Lead score ≥ 80",
    action: "WhatsApp AI message",
    icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
    plan: "pro",
  },
  {
    id: "nurture-email",
    name: "Nurture Email Sequence",
    description: "Enroll leads scoring 60-79 in a 5-email nurture sequence",
    trigger: "Lead score 60–79",
    action: "Email sequence (Resend)",
    icon: <Mail className="w-5 h-5 text-blue-400" />,
    plan: "starter",
  },
  {
    id: "viewing-reminder",
    name: "Viewing Reminder",
    description: "Send WhatsApp reminder 2 hours before scheduled viewings",
    trigger: "Viewing in 2 hours",
    action: "WhatsApp reminder",
    icon: <Clock className="w-5 h-5 text-amber-400" />,
    plan: "pro",
  },
  {
    id: "portal-lead-alert",
    name: "Portal Lead Alert",
    description: "Instant notification + scoring when a new lead arrives from any portal",
    trigger: "New portal lead",
    action: "Score + notify + auto-action",
    icon: <TrendingUp className="w-5 h-5 text-violet-400" />,
    plan: "starter",
  },
  {
    id: "re-engagement",
    name: "Re-engagement Campaign",
    description: "Auto-email cold leads (score <40) after 14 days of inactivity",
    trigger: "14 days inactive + score < 40",
    action: "Re-engagement email",
    icon: <Mail className="w-5 h-5 text-orange-400" />,
    plan: "starter",
  },
];

const MOCK_RUNS: AutomationRun[] = [
  { id: "1", action: "auto_call", lead_name: "Marco Rossi", score: 94, status: "executed", created_at: new Date().toISOString() },
  { id: "2", action: "whatsapp", lead_name: "Sophie Durand", score: 85, status: "executed", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", action: "email", lead_name: "Hans Mueller", score: 67, status: "executed", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", action: "auto_call", lead_name: "Ana Garcia", score: 91, status: "skipped", created_at: new Date(Date.now() - 10800000).toISOString() },
];

export default function AutomationsPage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [automationsEnabled, setAutomationsEnabled] = useState(true);
  const [callThreshold, setCallThreshold] = useState(90);
  const [whatsappThreshold, setWhatsappThreshold] = useState(80);
  const [emailThreshold, setEmailThreshold] = useState(60);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Speed-to-Lead Automations
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered lead response — call in 30s, WhatsApp in 60s, email in 90s
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {automationsEnabled ? "Active" : "Paused"}
          </span>
          <Switch
            checked={automationsEnabled}
            onCheckedChange={setAutomationsEnabled}
          />
        </div>
      </div>

      <Tabs defaultValue="flows">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="flows" className="gap-2">
            <Zap className="w-4 h-4" /> Automation Flows
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" /> Thresholds
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Run History
          </TabsTrigger>
        </TabsList>

        {/* ─── Flows ─── */}
        <TabsContent value="flows" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <Card key={t.id} className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-amber-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                    {t.icon}
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {t.plan}+
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{t.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400">
                      Trigger
                    </Badge>
                    <span className="text-muted-foreground">{t.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400">
                      Action
                    </Badge>
                    <span className="text-muted-foreground">{t.action}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Automation flow enabled.")}
                  className="w-full mt-4 text-xs"
                >
                  <Play className="w-3 h-3 mr-1" /> Enable
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── Thresholds ─── */}
        <TabsContent value="settings" className="mt-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 max-w-lg space-y-6">
            <h3 className="font-semibold">Score Thresholds</h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-400" /> Auto-Call Threshold
                  </span>
                  <span className="font-mono text-amber-400">{callThreshold}</span>
                </label>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={callThreshold}
                  onChange={(e) => setCallThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Leads scoring ≥ {callThreshold} get auto-called via Bland AI</p>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Threshold
                  </span>
                  <span className="font-mono text-amber-400">{whatsappThreshold}</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={whatsappThreshold}
                  onChange={(e) => setWhatsappThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Leads scoring {whatsappThreshold}–{callThreshold - 1} get WhatsApp message</p>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" /> Email Threshold
                  </span>
                  <span className="font-mono text-amber-400">{emailThreshold}</span>
                </label>
                <input
                  type="range"
                  min={30}
                  max={85}
                  value={emailThreshold}
                  onChange={(e) => setEmailThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Leads scoring {emailThreshold}–{whatsappThreshold - 1} get nurture email</p>
              </div>
            </div>

            <Button onClick={() => alert("Thresholds saved.")} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              Save Thresholds
            </Button>
          </Card>
        </TabsContent>

        {/* ─── History ─── */}
        <TabsContent value="history" className="mt-6">
          <div className="space-y-2">
            {MOCK_RUNS.map((run) => (
              <Card key={run.id} className="p-4 bg-card/50 backdrop-blur border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {run.action === "auto_call" ? (
                    <Phone className="w-4 h-4 text-red-400" />
                  ) : run.action === "whatsapp" ? (
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-blue-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{run.lead_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {run.score} • {run.action.replace("_", " ")} •{" "}
                      {new Date(run.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    run.status === "executed"
                      ? "text-emerald-400 border-emerald-500/30"
                      : run.status === "skipped"
                      ? "text-amber-400 border-amber-500/30"
                      : "text-red-400 border-red-500/30"
                  }`}
                >
                  {run.status === "executed" ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {run.status}
                </Badge>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
