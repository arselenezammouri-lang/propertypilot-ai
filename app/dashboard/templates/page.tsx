"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Bookmark,
  Copy,
  Check,
  Trash2,
  Search,
  Plus,
  FileText,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  created_at: string;
  is_favorite: boolean;
}

const CATEGORIES = [
  { key: "all", label: "All", labelIt: "Tutti" },
  { key: "listing", label: "Listings", labelIt: "Annunci" },
  { key: "title", label: "Titles", labelIt: "Titoli" },
  { key: "social", label: "Social Posts", labelIt: "Post Social" },
  { key: "email", label: "Emails", labelIt: "Email" },
  { key: "video", label: "Video Scripts", labelIt: "Script Video" },
];

export default function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  function loadTemplates() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("pp_templates");
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function saveTemplates(updated: Template[]) {
    setTemplates(updated);
    localStorage.setItem("pp_templates", JSON.stringify(updated));
  }

  function deleteTemplate(id: string) {
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
    toast({ title: "Template deleted" });
  }

  function toggleFavorite(id: string) {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, is_favorite: !t.is_favorite } : t
    );
    saveTemplates(updated);
  }

  async function copyContent(content: string, id: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filtered = templates
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .filter(
      (t) =>
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reuse your best-performing content across listings
          </p>
        </div>
        <Link href="/dashboard/perfect-copy">
          <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg h-9 text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pp-card p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-3" />
              <div className="h-20 bg-muted rounded mb-3" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {templates.length === 0 ? "No templates yet" : "No matching templates"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {templates.length === 0
              ? "When you generate listings, titles, or social posts, save the best ones here to reuse later."
              : "Try adjusting your search or category filter."}
          </p>
          {templates.length === 0 && (
            <Link href="/dashboard/perfect-copy">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                <Plus className="w-4 h-4 mr-1.5" />
                Generate your first listing
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <Card key={template.id} className="pp-card group hover-lift">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {template.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(template.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(template.id)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        template.is_favorite
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-4 mb-4 leading-relaxed">
                  {template.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs flex-1"
                    onClick={() => copyContent(template.content, template.id)}
                  >
                    {copiedId === template.id ? (
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    {copiedId === template.id ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-muted-foreground hover:text-red-500"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {templates.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>{templates.length} templates saved</span>
          <span>{templates.filter((t) => t.is_favorite).length} favorites</span>
        </div>
      )}
    </div>
  );
}
