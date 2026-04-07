"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Wand2,
  Globe,
  Heart,
  TrendingUp,
} from "lucide-react";

const DEMO_OUTPUTS = {
  luxury: {
    title: "Exclusive Penthouse in the Heart of Milan — Panoramic Terrace & Designer Finishes",
    description: "An extraordinary penthouse that redefines luxury living in Milan's most prestigious neighborhood. Floor-to-ceiling windows flood every room with natural light, while the wraparound terrace offers breathtaking views of the Duomo and the city skyline. The open-plan living area features Italian marble floors, a custom Boffi kitchen, and a wine cellar built into the walls. The master suite includes a spa-like bathroom with rainfall shower and freestanding soaking tub. Three additional bedrooms, each with en-suite, provide ample space for family or guests. Smart home automation, climate control, and a private elevator entrance complete this exceptional residence.",
    price: "€2,850,000",
  },
  investment: {
    title: "High-Yield Apartment Block — 6 Units, 7.2% Net Return, Central Location",
    description: "Prime investment opportunity in Milan's fastest-growing district. This fully renovated 6-unit apartment building generates €12,400/month in rental income with 98% occupancy over the past 3 years. Each unit features modern finishes, independent heating, and has been updated to Class A energy rating. The building includes a shared courtyard, storage units, and 4 parking spaces. Located 200m from the metro station and surrounded by new commercial developments, capital appreciation potential is significant. Current tenants on long-term contracts provide stable, predictable income. All documentation and financial records available for due diligence.",
    price: "€1,950,000",
  },
  standard: {
    title: "Bright 3-Bedroom Apartment with Balcony — Renovated, Great Location",
    description: "Beautifully renovated 3-bedroom apartment in a well-maintained building with elevator. The property features a bright living room opening onto a south-facing balcony, a modern fitted kitchen with all appliances, and three comfortable bedrooms with built-in wardrobes. The bathroom has been completely updated with contemporary fixtures. Hardwood floors throughout, double-glazed windows, and independent heating ensure comfort year-round. Located in a quiet residential area with excellent transport links, shops, schools, and parks within walking distance. Garage space included. Available for immediate viewing.",
    price: "€385,000",
  },
};

export default function DemoPage() {
  const [propertyType, setPropertyType] = useState("apartment");
  const [location, setLocation] = useState("Milano, Italy");
  const [style, setStyle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<typeof DEMO_OUTPUTS.luxury | null>(null);
  const [copiedField, setCopiedField] = useState("");

  function handleGenerate() {
    if (!style) return;
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setResult(DEMO_OUTPUTS[style as keyof typeof DEMO_OUTPUTS]);
      setGenerating(false);
    }, 2200);
  }

  async function handleCopy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg">
              Start free trial
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4">
              <Wand2 className="w-3 h-3" />
              Interactive Demo
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              See AI generate a listing in real-time
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Choose a style below and watch PropertyPilot create a professional listing in seconds. No signup required.
            </p>
          </div>

          {/* Input Form */}
          <div className="pp-card p-6 sm:p-8 mb-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Milano, Italy" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger><SelectValue placeholder="Choose style..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">
                      <span className="flex items-center gap-2"><Heart className="w-3 h-3 text-rose-500" /> Luxury</span>
                    </SelectItem>
                    <SelectItem value="investment">
                      <span className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-emerald-500" /> Investment</span>
                    </SelectItem>
                    <SelectItem value="standard">
                      <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Standard</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !style}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-base"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI is writing your listing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Listing
                </>
              )}
            </Button>
          </div>

          {/* Result */}
          {generating && (
            <div className="pp-card p-8 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          )}

          {result && !generating && (
            <div className="space-y-4">
              <div className="pp-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Title</span>
                  <button onClick={() => handleCopy(result.title, "title")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    {copiedField === "title" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedField === "title" ? "Copied" : "Copy"}
                  </button>
                </div>
                <h2 className="text-lg font-bold leading-snug">{result.title}</h2>
              </div>

              <div className="pp-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Description</span>
                  <button onClick={() => handleCopy(result.description, "desc")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    {copiedField === "desc" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedField === "desc" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.description}</p>
              </div>

              <div className="pp-card p-6 text-center bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">
                  This is a preview. The full version generates 5 variants, SEO titles, social posts, and translations.
                </p>
                <Link href="/auth/signup">
                  <Button className="h-10 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                    Start free trial — unlock all features
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!result && !generating && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                Choose a style above and click Generate to see AI in action.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
