"use client";

import { useState } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MarketingNavHeader } from "@/components/marketing-nav-header";

export default function ROICalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState("300000");
  const [monthlyRent, setMonthlyRent] = useState("1200");
  const [annualExpenses, setAnnualExpenses] = useState("3000");
  const [appreciation, setAppreciation] = useState("3");
  const [holdYears, setHoldYears] = useState("5");

  const price = parseFloat(purchasePrice) || 0;
  const rent = parseFloat(monthlyRent) || 0;
  const expenses = parseFloat(annualExpenses) || 0;
  const appRate = (parseFloat(appreciation) || 0) / 100;
  const years = parseInt(holdYears) || 1;

  const annualRental = rent * 12 - expenses;
  const grossYield = price > 0 ? ((rent * 12) / price * 100).toFixed(1) : "0";
  const netYield = price > 0 ? (annualRental / price * 100).toFixed(1) : "0";
  const futureValue = Math.round(price * Math.pow(1 + appRate, years));
  const capitalGain = futureValue - price;
  const totalReturn = annualRental * years + capitalGain;
  const roi = price > 0 ? ((totalReturn / price) * 100).toFixed(1) : "0";

  return (
    <main className="min-h-screen bg-background">
      <MarketingNavHeader />
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Property ROI Calculator</span>
        </h1>
        <p className="text-center text-muted-foreground mb-8">Free tool — calculate rental yield and investment returns</p>

        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1 block">Purchase Price (€)</label>
              <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm mb-1 block">Monthly Rent (€)</label>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm mb-1 block">Annual Expenses (€)</label>
              <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm mb-1 block">Appreciation (%/yr)</label>
              <input type="number" step="0.5" value={appreciation} onChange={(e) => setAppreciation(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm mb-1 block">Hold (years)</label>
              <input type="number" value={holdYears} onChange={(e) => setHoldYears(e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
              <p className="text-xs text-muted-foreground">Gross Yield</p>
              <p className="text-2xl font-bold text-emerald-400">{grossYield}%</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-500/10 text-center">
              <p className="text-xs text-muted-foreground">Net Yield</p>
              <p className="text-2xl font-bold text-teal-400">{netYield}%</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 text-center">
              <p className="text-xs text-muted-foreground">{years}yr Total ROI</p>
              <p className="text-2xl font-bold text-blue-400">{roi}%</p>
            </div>
            <div className="p-4 rounded-xl bg-violet-500/10 text-center">
              <p className="text-xs text-muted-foreground">Capital Gain ({years}yr)</p>
              <p className="text-2xl font-bold text-violet-400">€{capitalGain.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-3">Get AI-powered CMA valuations for any European property</p>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
