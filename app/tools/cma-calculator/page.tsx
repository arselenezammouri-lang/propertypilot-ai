"use client";

import { useState } from "react";
import { Calculator, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MarketingNavHeader } from "@/components/marketing-nav-header";
import { calculateTransferCosts } from "@/lib/tax-calculator/eu-transfer-costs";
import type { TransferCostResult } from "@/lib/tax-calculator/eu-transfer-costs";

type Country = "IT" | "FR" | "ES" | "DE" | "UK" | "PT";

const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
];

export default function CMACalculatorPage() {
  const [country, setCountry] = useState<Country>("IT");
  const [price, setPrice] = useState("350000");
  const [isFirstHome, setIsFirstHome] = useState(true);
  const [result, setResult] = useState<TransferCostResult | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(price) || 0;
    if (p > 0) {
      setResult(calculateTransferCosts(country, p, isFirstHome));
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">EU Transfer Cost Calculator</span>
        </h1>
        <p className="text-center text-muted-foreground mb-8">Free tool — calculate taxes, notary fees & total acquisition costs across 6 EU countries</p>

        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 space-y-4">
          <div>
            <label className="text-sm mb-2 block">Country</label>
            <div className="grid grid-cols-3 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className={`p-2 rounded-lg text-center text-sm transition-all ${
                    country === c.code ? "bg-amber-500/15 border-2 border-amber-500/50" : "bg-muted/30 border-2 border-transparent hover:border-border"
                  }`}
                >
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block">Purchase Price (€)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFirstHome} onChange={(e) => setIsFirstHome(e.target.checked)} className="rounded" />
            First home / primary residence
          </label>

          <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <Calculator className="w-4 h-4 mr-2" /> Calculate Costs
          </Button>

          {result && (
            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-xl bg-amber-500/10 text-center">
                <p className="text-sm text-muted-foreground">Total Acquisition Cost</p>
                <p className="text-3xl font-bold text-amber-400">€{result.total_acquisition_cost.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.total_percentage} of purchase price</p>
              </div>

              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm">{item.label}</p>
                      {item.note && <p className="text-[10px] text-muted-foreground">{item.note}</p>}
                    </div>
                    <p className="text-sm font-mono">€{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 flex justify-between">
                <span className="text-sm">Annual {result.annual_tax_name}</span>
                <span className="text-sm font-mono text-blue-400">€{result.annual_property_tax.toLocaleString()}/yr</span>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-3">Need AI-powered property valuations with full CMA reports?</p>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
