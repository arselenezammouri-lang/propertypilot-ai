import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  ArrowRight,
  Star,
  Shield,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface AgencyProfile {
  id: string;
  full_name: string;
  agency_name?: string;
  agency_slug?: string;
  bio?: string;
  city?: string;
  country?: string;
  website?: string;
  phone?: string;
  email?: string;
  languages?: string[];
  specialties?: string[];
  is_public: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, agency_name, city, country, bio")
    .eq("agency_slug", params.slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!profile) {
    return { title: "Agency Not Found | PropertyPilot AI" };
  }

  const name = profile.agency_name || profile.full_name;
  const location = [profile.city, profile.country].filter(Boolean).join(", ");

  return {
    title: `${name} — Real Estate Agency${location ? ` in ${location}` : ""} | PropertyPilot AI`,
    description: profile.bio
      ? profile.bio.slice(0, 155)
      : `${name} is a real estate agency${location ? ` based in ${location}` : ""} powered by PropertyPilot AI.`,
    openGraph: {
      title: `${name} — Real Estate Agency`,
      description: profile.bio || `Professional real estate agency powered by AI.`,
    },
  };
}

export default async function AgencyProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  // Fetch agency profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("agency_slug", params.slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  // Fetch public listings count
  const { count: listingsCount } = await supabase
    .from("saved_listings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const name = profile.agency_name || profile.full_name;
  const location = [profile.city, profile.country].filter(Boolean).join(", ");
  const specialties = profile.specialties || [];
  const languages = profile.languages || ["Italian", "English"];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <Link href="/auth/signup">
            <Button
              size="sm"
              className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg"
            >
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Profile Header */}
      <section className="pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="pp-card p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {name}
                  </h1>
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>

                {location && (
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-3">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </p>
                )}

                {profile.bio && (
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  {listingsCount !== null && listingsCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{listingsCount}</span>
                      <span className="text-muted-foreground">listings</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {languages.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      {specialties.length > 0 && (
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-lg font-semibold mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s: string) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="pp-card p-8 sm:p-10 text-center bg-muted/30">
            <h2 className="text-xl font-bold mb-2">
              Are you a real estate agent?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your own AI-powered agency profile and start generating
              professional listings in seconds.
            </p>
            <Link href="/auth/signup">
              <Button className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                Create your profile
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
