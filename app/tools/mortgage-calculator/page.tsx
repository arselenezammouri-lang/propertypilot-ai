"use client";

import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MarketingNavHeader } from "@/components/marketing-nav-header";

export default function MortgageCalculatorPage() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("3.5");
  const [years, setYears] = useState("25");

  const P = parseFloat(amount) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;
  const monthly = r > 0 && n > 0 ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - P;

  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mortgage Calculator</span>
        </h1>
        <p className="text-center text-muted-foreground mb-8">Free tool — calculate your monthly mortgage payment across EU countries</p>

        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 space-y-4">
          <div>
            <label className="text-sm mb-1 block">Loan Amount (€)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1 block">Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm mb-1 block">Duration (years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-4xl font-bold text-indigo-400">€{monthly.toLocaleString()}</p>
            <div className="flex justify-center gap-6 mt-3 text-xs text-muted-foreground">
              <span>Total: €{totalPaid.toLocaleString()}</span>
              <span>Interest: €{totalInterest.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-3">Want AI-powered property valuations?</p>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
