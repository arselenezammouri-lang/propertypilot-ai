"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Home,
  Calendar,
  MessageCircle,
  FileText,
  Calculator,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgencyBranding {
  agency_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  contact_email: string | null;
  contact_phone: string | null;
  footer_text: string | null;
}

interface AssignedListing {
  id: string;
  title: string;
  price: number;
  city: string;
  sqm: number;
  rooms: number;
  bathrooms: number;
  image_url: string;
  status: string;
}

export default function ClientPortalPage() {
  const params = useParams();
  const slug = params.agencySlug as string;
  const [branding, setBranding] = useState<AgencyBranding | null>(null);
  const [listings, setListings] = useState<AssignedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [mortgageAmount, setMortgageAmount] = useState("250000");
  const [mortgageRate, setMortgageRate] = useState("3.5");
  const [mortgageYears, setMortgageYears] = useState("25");

  useEffect(() => {
    setLoading(true);
    // In production, fetch from /api/client/portal?slug={slug}
    // For now, use placeholder data
    setBranding({
      agency_name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      logo_url: null,
      primary_color: "#6366f1",
      secondary_color: "#8b5cf6",
      background_color: "#0f0f23",
      text_color: "#f8fafc",
      font_family: "Inter, system-ui, sans-serif",
      contact_email: `info@${slug}.com`,
      contact_phone: "+39 02 1234567",
      footer_text: `© ${new Date().getFullYear()} ${slug.replace(/-/g, " ")}. All rights reserved.`,
    });
    setListings([]);
    setLoading(false);
  }, [slug]);

  // Mortgage calculator
  const calculateMonthly = () => {
    const P = parseFloat(mortgageAmount) || 0;
    const r = (parseFloat(mortgageRate) || 0) / 100 / 12;
    const n = (parseFloat(mortgageYears) || 0) * 12;
    if (r === 0 || n === 0) return 0;
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const style = branding ? {
    "--agency-primary": branding.primary_color,
    "--agency-secondary": branding.secondary_color,
    fontFamily: branding.font_family,
  } as React.CSSProperties : {};

  return (
    <div className="min-h-screen bg-background" style={style}>
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt={branding.agency_name} className="h-8" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                {branding?.agency_name?.charAt(0) ?? "P"}
              </div>
            )}
            <span className="font-semibold text-sm">{branding?.agency_name}</span>
          </div>
          <div className="flex items-center gap-2">
            {branding?.contact_phone && (
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <Phone className="w-3 h-3" /> {branding.contact_phone}
              </Button>
            )}
            <Button size="sm" className="bg-[var(--agency-primary,#6366f1)] text-white text-xs">
              Contact Agent
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="properties">
          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="properties" className="gap-2">
              <Home className="w-4 h-4" /> Properties
            </TabsTrigger>
            <TabsTrigger value="viewings" className="gap-2">
              <Calendar className="w-4 h-4" /> Viewings
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" /> Documents
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="w-4 h-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="mortgage" className="gap-2">
              <Calculator className="w-4 h-4" /> Mortgage
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties">
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden bg-card/50 backdrop-blur border-border/50">
                    <div className="h-48 bg-muted/30 relative">
                      {listing.image_url && (
                        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                      )}
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{listing.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {listing.city}
                      </p>
                      <p className="text-lg font-bold" style={{ color: "var(--agency-primary, #6366f1)" }}>
                        €{listing.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {listing.rooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {listing.bathrooms}</span>
                        <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {listing.sqm}m²</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Your Properties</h3>
                <p className="text-sm text-muted-foreground">
                  Your agent will assign matching properties here. Check back soon!
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Viewings Tab */}
          <TabsContent value="viewings">
            <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Scheduled Viewings</h3>
              <p className="text-sm text-muted-foreground">No viewings scheduled yet. Contact your agent to arrange one.</p>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Shared Documents</h3>
              <p className="text-sm text-muted-foreground">Your agent can share contracts, mandates, and documents here.</p>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Chat with Your Agent</h3>
              <p className="text-sm text-muted-foreground">Secure messaging with your real estate agent.</p>
              <Button className="mt-4" style={{ backgroundColor: "var(--agency-primary, #6366f1)" }}>
                Start Chat
              </Button>
            </Card>
          </TabsContent>

          {/* Mortgage Calculator */}
          <TabsContent value="mortgage">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 max-w-lg mx-auto">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" style={{ color: "var(--agency-primary, #6366f1)" }} />
                Mortgage Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Loan Amount (€)</label>
                  <input
                    type="number"
                    value={mortgageAmount}
                    onChange={(e) => setMortgageAmount(e.target.value)}
                    className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Duration (years)</label>
                    <input
                      type="number"
                      value={mortgageYears}
                      onChange={(e) => setMortgageYears(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: "var(--agency-primary, #6366f1)" }}>
                    €{calculateMonthly().toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: €{(calculateMonthly() * parseInt(mortgageYears || "0") * 12).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          {branding?.footer_text || `Powered by PropertyPilot AI`}
        </div>
      </footer>
    </div>
  );
}
