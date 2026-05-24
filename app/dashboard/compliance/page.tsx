"use client";
import { useLocale } from "@/lib/i18n/locale-context";

import { useState } from "react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  Globe,
  Sparkles,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Country = "IT" | "FR" | "ES" | "DE" | "UK" | "PT";

interface CheckDetail {
  rule_id: string;
  category: string;
  title: string;
  severity: "error" | "warning" | "info";
  passed: boolean;
  message: string;
  suggestion?: string;
  reference?: string;
}

interface AIVerification {
  overall_assessment: string;
  issues_found: string[];
  recommendations: string[];
  confidence: number;
}

const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
];

export default function CompliancePage() {
  const { locale } = useLocale();
  const isIt = locale === "it";
  const [country, setCountry] = useState<Country>("IT");
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<CheckDetail[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIVerification | null>(null);
  const [includeAI, setIncludeAI] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sqm, setSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [energyClass, setEnergyClass] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [city, setCity] = useState("");

  const handleCheck = async () => {
    setLoading(true);
    setChecks([]);
    setScore(null);
    setStatus(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/compliance/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing: {
            title: title || undefined,
            description: description || undefined,
            price: price ? parseFloat(price) : undefined,
            sqm: sqm ? parseFloat(sqm) : undefined,
            rooms: rooms ? parseInt(rooms) : undefined,
            energy_class: energyClass || undefined,
            year_built: yearBuilt ? parseInt(yearBuilt) : undefined,
            city: city || undefined,
            country,
          },
          country,
          include_ai: includeAI,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChecks(data.checks ?? []);
        setScore(data.score);
        setStatus(data.status);
        setAiResult(data.ai_verification ?? null);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const errorCount = checks.filter((c) => !c.passed && c.severity === "error").length;
  const warnCount = checks.filter((c) => !c.passed && c.severity === "warning").length;
  const passCount = checks.filter((c) => c.passed).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Compliance Shield
        </h1>
        <p className="text-muted-foreground mt-1">
          Check your listings against EU country-specific regulations
        </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handleCheck} disabled={loading}>
          <Shield className="w-3 h-3" /> Bulk Re-Check All Listings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 space-y-4">
          {/* Country Selector */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Target Country
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className={`p-2 rounded-lg text-center text-xs transition-all ${
                    country === c.code
                      ? "bg-emerald-500/15 border-2 border-emerald-500/50"
                      : "bg-muted/30 border-2 border-transparent hover:border-border"
                  }`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <p className="mt-1 font-medium">{c.code}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Listing Data */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" /> Listing Data
            </h3>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Price (€)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="m²"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
                type="number"
                className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                placeholder="Rooms"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                type="number"
                className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Energy (A-G)"
                value={energyClass}
                onChange={(e) => setEnergyClass(e.target.value)}
                className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Year Built"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                type="number"
                className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeAI}
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="rounded"
              />
              <Sparkles className="w-3 h-3 text-violet-400" />
              Include AI deep verification
            </label>
          </Card>

          <Button
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white h-11"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
            ) : (
              <><Shield className="w-4 h-4 mr-2" /> Run Compliance Check</>
            )}
          </Button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {score !== null && (
            <>
              {/* Score Card */}
              <Card className={`p-6 bg-card/50 backdrop-blur border-2 ${
                status === "compliant" ? "border-emerald-500/40" :
                status === "needs_review" ? "border-amber-500/40" :
                "border-red-500/40"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {status === "compliant" ? (
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    ) : status === "needs_review" ? (
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold capitalize">{status?.replace("_", " ")}</h2>
                      <p className="text-sm text-muted-foreground">
                        {COUNTRIES.find((c) => c.code === country)?.flag}{" "}
                        {COUNTRIES.find((c) => c.code === country)?.name} regulations
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{score}</p>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                </div>
                <Progress
                  value={score}
                  className="h-2"
                />
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="text-emerald-400">✓ {passCount} passed</span>
                  <span className="text-red-400">✕ {errorCount} errors</span>
                  <span className="text-amber-400">⚠ {warnCount} warnings</span>
                </div>
              </Card>

              {/* Check Results */}
              <div className="space-y-2">
                {checks.map((check) => (
                  <Card
                    key={check.rule_id}
                    className={`p-4 bg-card/50 backdrop-blur border-l-4 ${
                      check.passed
                        ? "border-l-emerald-500"
                        : check.severity === "error"
                        ? "border-l-red-500"
                        : check.severity === "warning"
                        ? "border-l-amber-500"
                        : "border-l-blue-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : check.severity === "error" ? (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          ) : check.severity === "warning" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          )}
                          <h4 className="text-sm font-medium">{check.title}</h4>
                          <Badge variant="outline" className="text-[10px]">
                            {check.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">{check.message}</p>
                        {!check.passed && check.suggestion && (
                          <p className="text-xs text-cyan-400 ml-6 mt-1 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" /> {check.suggestion}
                          </p>
                        )}
                        {check.reference && (
                          <p className="text-[10px] text-muted-foreground/60 ml-6 mt-1">
                            Ref: {check.reference}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          check.passed ? "text-emerald-400 border-emerald-500/30" :
                          check.severity === "error" ? "text-red-400 border-red-500/30" :
                          "text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {check.rule_id}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              {/* AI Verification */}
              {aiResult && (
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 border-violet-500/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" /> AI Deep Verification
                    <Badge variant="outline" className="text-[10px] text-violet-400">
                      {Math.round(aiResult.confidence * 100)}% confidence
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{aiResult.overall_assessment}</p>
                  {aiResult.issues_found.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-red-400 mb-1">Issues Found:</p>
                      <ul className="space-y-1">
                        {aiResult.issues_found.map((issue, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <XCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiResult.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-emerald-400 mb-1">Recommendations:</p>
                      <ul className="space-y-1">
                        {aiResult.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {/* Empty state */}
          {score === null && !loading && (
            <Card className="p-12 bg-card/50 backdrop-blur border-border/50 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{isIt ? "Nessun Controllo Effettuato" : "No Compliance Check Yet"}</h3>
              <p className="text-sm text-muted-foreground">
                {isIt ? "Inserisci i dati dell'annuncio e seleziona un Paese per verificare la conformità." : "Enter listing data and select a country to check compliance with local regulations."}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
