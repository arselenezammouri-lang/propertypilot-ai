"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FileSearch,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Quote,
  Sparkles,
  Eye,
  ChevronRight,
  Home,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DocumentType = "mandate" | "energy_certificate" | "deed" | "id_document" | "other";

interface ExtractedField {
  value: string | number | boolean | null;
  confidence: number;
  page: number;
  location?: string;
}

interface Citation {
  field_name: string;
  text_excerpt: string;
  page: number;
  confidence: number;
}

const DOC_TYPES: { value: DocumentType; label: string; icon: string }[] = [
  { value: "mandate", label: "Mandate", icon: "📋" },
  { value: "energy_certificate", label: "Energy Certificate", icon: "⚡" },
  { value: "deed", label: "Property Deed", icon: "📜" },
  { value: "id_document", label: "ID Document", icon: "🪪" },
  { value: "other", label: "Other", icon: "📄" },
];

export default function DocumentsPage() {
  const [docType, setDocType] = useState<DocumentType>("mandate");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, ExtractedField> | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; document_type: string; filename: string; confidence: number; created_at: string }>>([]);

  // Fetch history
  useEffect(() => {
    fetch("/api/document-ai/extract")
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setExtractedData(null);
    setCitations([]);

    try {
      const res = await fetch("/api/document-ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          document_type: docType,
          filename,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedData(data.extracted_data ?? null);
        setCitations(data.citations ?? []);
        setConfidence(data.confidence ?? 0);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const getCitationForField = (fieldName: string) =>
    citations.find((c) => c.field_name === fieldName);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
          Document Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered document extraction with click-to-cite references
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Document */}
        <div className="space-y-4">
          {/* Document Type */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-sm font-medium mb-3">Document Type</h3>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  onClick={() => setDocType(dt.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    docType === dt.value
                      ? "bg-orange-500/15 border-2 border-orange-500/50"
                      : "bg-muted/30 border-2 border-transparent hover:border-border"
                  }`}
                >
                  <span>{dt.icon}</span>
                  <span>{dt.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Upload */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-orange-400" /> Upload Document
            </h3>
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Document preview" className="h-full w-full object-contain" />
              ) : (
                <>
                  <FileText className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload document image (JPG, PNG, PDF page)</span>
                  <span className="text-xs text-muted-foreground/60 mt-1">Supports mandates, energy certs, deeds, IDs</span>
                </>
              )}
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
            {filename && <p className="text-xs text-muted-foreground mt-2">📎 {filename}</p>}
          </Card>

          <Button
            onClick={handleExtract}
            disabled={!imageUrl || loading}
            className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white h-11"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Extract Data</>
            )}
          </Button>

          {/* Citations Panel */}
          {citations.length > 0 && (
            <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Quote className="w-4 h-4 text-orange-400" /> Citations
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {citations.map((cite, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      highlightedField === cite.field_name
                        ? "bg-orange-500/15 border border-orange-500/40"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setHighlightedField(cite.field_name)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-[10px]">{cite.field_name}</Badge>
                      <span className="text-[10px] text-muted-foreground">p.{cite.page}</span>
                    </div>
                    <p className="text-muted-foreground italic">&quot;{cite.text_excerpt}&quot;</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Extracted Data */}
        <div className="space-y-4">
          {extractedData ? (
            <>
              {/* Confidence Header */}
              <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">Extraction Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        confidence > 0.8
                          ? "text-emerald-400 border-emerald-500/30"
                          : confidence > 0.5
                          ? "text-amber-400 border-amber-500/30"
                          : "text-red-400 border-red-500/30"
                      }`}
                    >
                      {Math.round(confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs gap-1 flex-1">
                    <Home className="w-3 h-3" /> Save to Property
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1 flex-1">
                    <Users className="w-3 h-3" /> Save to Lead
                  </Button>
                </div>
              </Card>

              {/* Extracted Fields */}
              <div className="space-y-2">
                {Object.entries(extractedData).map(([key, field]) => {
                  const citation = getCitationForField(key);
                  const isHighlighted = highlightedField === key;

                  return (
                    <Card
                      key={key}
                      className={`p-3 bg-card/50 backdrop-blur transition-all cursor-pointer ${
                        isHighlighted
                          ? "border-orange-500/40 bg-orange-500/5"
                          : "border-border/50 hover:border-border"
                      }`}
                      onClick={() => setHighlightedField(isHighlighted ? null : key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-muted-foreground font-mono">{key}</p>
                            {citation && (
                              <Quote className="w-3 h-3 text-orange-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium">
                            {field.value != null ? String(field.value) : (
                              <span className="text-muted-foreground italic">Not found</span>
                            )}
                          </p>
                          {isHighlighted && citation && (
                            <div className="mt-2 p-2 rounded bg-muted/30 text-xs">
                              <p className="text-muted-foreground italic">&quot;{citation.text_excerpt}&quot;</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">Page {citation.page}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              field.confidence > 0.8
                                ? "text-emerald-400 border-emerald-500/30"
                                : field.confidence > 0.5
                                ? "text-amber-400 border-amber-500/30"
                                : "text-red-400 border-red-500/30"
                            }`}
                          >
                            {Math.round(field.confidence * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card className="p-12 bg-card/50 backdrop-blur border-border/50 text-center">
              <FileSearch className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No Document Extracted Yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload a document and click Extract to see structured data with AI-powered citations.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
