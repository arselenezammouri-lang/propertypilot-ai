"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe, Save, ExternalLink, Loader2 } from "lucide-react";

export default function ProfileSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    agency_name: "",
    agency_slug: "",
    bio: "",
    city: "",
    country: "",
    website: "",
    phone: "",
    is_public: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/subscription", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setForm({
            agency_name: data.profile.agency_name || "",
            agency_slug: data.profile.agency_slug || "",
            bio: data.profile.bio || "",
            city: data.profile.city || "",
            country: data.profile.country || "",
            website: data.profile.website || "",
            phone: data.profile.phone || "",
            is_public: data.profile.is_public || false,
          });
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: "Profile saved", description: "Your agency profile has been updated." });
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Could not save profile.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error.", variant: "destructive" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const profileUrl = form.agency_slug
    ? `https://propertypilot-ai.vercel.app/agency/${form.agency_slug}`
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Agency Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up your public agency page — visible to potential clients and indexed by Google
        </p>
      </div>

      <div className="pp-card p-6 space-y-6">
        {/* Public toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium">Public Profile</p>
            <p className="text-xs text-muted-foreground">
              Make your agency visible to the world
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_public: !form.is_public })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.is_public ? "bg-emerald-500" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                form.is_public ? "translate-x-5.5 left-0.5" : "left-0.5"
              }`}
              style={{ transform: form.is_public ? "translateX(22px)" : "translateX(0)" }}
            />
          </button>
        </div>

        {/* Agency Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Agency Name</Label>
            <Input
              value={form.agency_name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({
                  ...form,
                  agency_name: name,
                  agency_slug: form.agency_slug || generateSlug(name),
                });
              }}
              placeholder="e.g. Rossi Real Estate"
            />
          </div>
          <div className="space-y-2">
            <Label>Profile URL Slug</Label>
            <Input
              value={form.agency_slug}
              onChange={(e) => setForm({ ...form, agency_slug: generateSlug(e.target.value) })}
              placeholder="e.g. rossi-real-estate"
            />
            {profileUrl && (
              <p className="text-xs text-muted-foreground truncate">
                {profileUrl}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label>Bio / Description</Label>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell clients about your agency, your expertise, your market..."
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Milano"
            />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="e.g. Italy"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://www.youragency.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+39 02 1234567"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {profileUrl && form.is_public && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View public profile
              </a>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-lg"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
