"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ImagePlus,
  Wand2,
  LayoutGrid,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Sparkles,
  Camera,
  Palette,
  Eye,
  Download,
  Plus,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// ─── Types ──────────────────────────────────────────────────
type JobType = "virtual_staging" | "photo_enhancement" | "floor_plan";
type StagingStyle = "modern" | "scandinavian" | "industrial" | "classic" | "minimalist" | "luxury";
type RoomType = "living_room" | "bedroom" | "kitchen" | "bathroom" | "dining_room" | "office" | "terrace";
type EnhancementType = "hdr" | "sky_replacement" | "declutter" | "color_correction" | "twilight";
type FloorPlanStyle = "2d_standard" | "2d_furnished" | "3d_rendered";

interface VisualJob {
  id: string;
  job_type: JobType;
  status: "pending" | "processing" | "completed" | "failed";
  input_url: string;
  output_url: string | null;
  options: Record<string, string>;
  created_at: string;
}

interface UsageInfo {
  used: number;
  limit: number;
  plan: string;
}

// ─── Option Cards ───────────────────────────────────────────
const STAGING_STYLES: { value: StagingStyle; label: string; emoji: string }[] = [
  { value: "modern", label: "Modern", emoji: "🏢" },
  { value: "scandinavian", label: "Scandinavian", emoji: "🪵" },
  { value: "industrial", label: "Industrial", emoji: "🏗️" },
  { value: "classic", label: "Classic", emoji: "🏛️" },
  { value: "minimalist", label: "Minimalist", emoji: "⬜" },
  { value: "luxury", label: "Luxury", emoji: "💎" },
];

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "dining_room", label: "Dining Room" },
  { value: "office", label: "Office" },
  { value: "terrace", label: "Terrace" },
];

const ENHANCEMENT_TYPES: { value: EnhancementType; label: string; desc: string }[] = [
  { value: "hdr", label: "HDR Enhancement", desc: "Boost dynamic range & clarity" },
  { value: "sky_replacement", label: "Sky Replacement", desc: "Perfect blue sky every time" },
  { value: "declutter", label: "Declutter", desc: "Remove personal items & clutter" },
  { value: "color_correction", label: "Color Correction", desc: "Professional color grading" },
  { value: "twilight", label: "Twilight Effect", desc: "Dramatic dusk exterior shots" },
];

const FLOOR_PLAN_STYLES: { value: FloorPlanStyle; label: string; desc: string }[] = [
  { value: "2d_standard", label: "2D Standard", desc: "Clean black & white blueprint" },
  { value: "2d_furnished", label: "2D Furnished", desc: "Colored with furniture layout" },
  { value: "3d_rendered", label: "3D Rendered", desc: "Isometric 3D visualization" },
];

// ─── Component ──────────────────────────────────────────────
export default function VisualAIPage() {
  const [activeTab, setActiveTab] = useState<JobType>("virtual_staging");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stagingStyle, setStagingStyle] = useState<StagingStyle>("modern");
  const [roomType, setRoomType] = useState<RoomType>("living_room");
  const [enhancementType, setEnhancementType] = useState<EnhancementType>("hdr");
  const [floorPlanStyle, setFloorPlanStyle] = useState<FloorPlanStyle>("2d_standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<VisualJob[]>([]);
  const [usage, setUsage] = useState<UsageInfo>({ used: 0, limit: 2, plan: "free" });
  const [selectedJob, setSelectedJob] = useState<VisualJob | null>(null);

  // Fetch jobs and usage
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/visual-ai");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs ?? []);
        if (data.usage) setUsage(data.usage);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Handle file upload (convert to data URL for preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Submit job
  const handleSubmit = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const options: Record<string, string> = {};
      if (activeTab === "virtual_staging") {
        options.style = stagingStyle;
        options.room_type = roomType;
      } else if (activeTab === "photo_enhancement") {
        options.enhancement_type = enhancementType;
      } else {
        options.floor_plan_style = floorPlanStyle;
      }

      const res = await fetch("/api/visual-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_type: activeTab,
          image_url: imageUrl,
          options,
        }),
      });

      if (res.ok) {
        await fetchJobs();
        setImageUrl("");
        setImagePreview(null);
      }
    } catch { /* silent */ }
    setIsProcessing(false);
  };

  const usagePercent = usage.limit > 0 ? (usage.used / usage.limit) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Visual AI Suite
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered photo staging, enhancement & floor plans
          </p>
        </div>
        <Badge variant="outline" className="border-violet-500/30 text-violet-400">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by Replicate
        </Badge>
      </div>

      {/* Usage Meter */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Monthly Usage — <span className="capitalize text-foreground font-medium">{usage.plan}</span> Plan
          </span>
          <span className="text-sm font-mono text-foreground">
            {usage.used}/{usage.limit} jobs
          </span>
        </div>
        <Progress value={usagePercent} className="h-2" />
        {usagePercent >= 80 && (
          <p className="text-xs text-amber-400 mt-2">
            ⚡ Approaching limit — upgrade for more Visual AI jobs
          </p>
        )}
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JobType)}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="virtual_staging" className="gap-2">
            <Palette className="w-4 h-4" /> Virtual Staging
          </TabsTrigger>
          <TabsTrigger value="photo_enhancement" className="gap-2">
            <Camera className="w-4 h-4" /> Photo Enhancement
          </TabsTrigger>
          <TabsTrigger value="floor_plan" className="gap-2">
            <LayoutGrid className="w-4 h-4" /> Floor Plans
          </TabsTrigger>
        </TabsList>

        {/* ─── Virtual Staging ─── */}
        <TabsContent value="virtual_staging" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload */}
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" /> Upload Empty Room
              </h3>
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors">
                {imagePreview && activeTab === "virtual_staging" ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Drop image or click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              {/* Room Type */}
              <h4 className="text-sm font-medium mt-6 mb-3">Room Type</h4>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRoomType(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      roomType === r.value
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Style Selection */}
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-400" /> Choose Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {STAGING_STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStagingStyle(s.value)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      stagingStyle === s.value
                        ? "bg-violet-500/15 border-2 border-violet-500/50 shadow-lg shadow-violet-500/10"
                        : "bg-muted/30 border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <p className="text-sm font-medium mt-1">{s.label}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!imageUrl || isProcessing || usage.used >= usage.limit}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-12"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Stage This Room</>
            )}
          </Button>
        </TabsContent>

        {/* ─── Photo Enhancement ─── */}
        <TabsContent value="photo_enhancement" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" /> Upload Photo
              </h3>
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors">
                {imagePreview && activeTab === "photo_enhancement" ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Drop image or click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-violet-400" /> Enhancement Type
              </h3>
              <div className="space-y-3">
                {ENHANCEMENT_TYPES.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEnhancementType(e.value)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      enhancementType === e.value
                        ? "bg-violet-500/15 border-2 border-violet-500/50"
                        : "bg-muted/30 border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-xs text-muted-foreground">{e.desc}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!imageUrl || isProcessing || usage.used >= usage.limit}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-12"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enhancing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Enhance Photo</>
            )}
          </Button>
        </TabsContent>

        {/* ─── Floor Plans ─── */}
        <TabsContent value="floor_plan" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" /> Upload Photo / Sketch
              </h3>
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors">
                {imagePreview && activeTab === "floor_plan" ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload room photo or hand-drawn sketch</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-violet-400" /> Floor Plan Style
              </h3>
              <div className="space-y-3">
                {FLOOR_PLAN_STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setFloorPlanStyle(s.value)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      floorPlanStyle === s.value
                        ? "bg-violet-500/15 border-2 border-violet-500/50"
                        : "bg-muted/30 border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!imageUrl || isProcessing || usage.used >= usage.limit}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-12"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate Floor Plan</>
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {/* ─── Results Gallery with Before/After ─── */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
        {jobs.length === 0 ? (
          <Card className="p-12 bg-card/50 backdrop-blur border-border/50 text-center">
            <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No visual AI jobs yet. Upload an image to get started.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="overflow-hidden bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-violet-500/30 transition-colors"
                onClick={() => setSelectedJob(job)}
              >
                {/* Before/After Split */}
                <div className="relative h-48 bg-muted/30">
                  {job.status === "completed" && job.output_url ? (
                    <div className="flex h-full">
                      <div className="w-1/2 relative overflow-hidden">
                        <img
                          src={job.input_url}
                          alt="Before"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>
                      <div className="w-px bg-violet-500/50" />
                      <div className="w-1/2 relative overflow-hidden">
                        <img
                          src={job.output_url}
                          alt="After"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-violet-600/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                          After
                        </span>
                      </div>
                      <ArrowLeftRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  ) : job.status === "processing" ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                  ) : job.status === "failed" ? (
                    <div className="flex items-center justify-center h-full">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium capitalize">
                      {job.job_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Before/After Modal with Slider */}
      {selectedJob && selectedJob.status === "completed" && selectedJob.output_url && (
        <BeforeAfterModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

/** Interactive before/after slider modal */
function BeforeAfterModal({ job, onClose }: { job: VisualJob; onClose: () => void }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleDownload = () => {
    if (!job.output_url) return;
    const a = document.createElement("a");
    a.href = job.output_url;
    a.download = `propertypilot-${job.job_type}-${job.id}.jpg`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border/50 max-w-5xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold capitalize">
            {job.job_type.replace(/_/g, " ")} — Before / After Comparison
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={handleDownload}>
              <Download className="w-3 h-3" /> Download HD
            </Button>
            <Button size="sm" className="text-xs gap-1 bg-violet-600 hover:bg-violet-500 text-white">
              <Plus className="w-3 h-3" /> Add to Property
            </Button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Before/After Slider */}
        <div
          className="relative w-full aspect-video overflow-hidden cursor-col-resize select-none"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleMove}
        >
          {/* After (full width, behind) */}
          <img
            src={job.output_url!}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Before (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={job.input_url}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ minWidth: "100%", maxWidth: "none", width: `${100 / (sliderPos / 100)}%` }}
            />
          </div>
          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <GripVertical className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          {/* Labels */}
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
            Before
          </span>
          <span className="absolute top-3 right-3 bg-violet-600/80 text-white text-xs px-2 py-1 rounded z-20">
            After — AI
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Done
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px]">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px]">
          <AlertCircle className="w-3 h-3 mr-1" /> Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground text-[10px]">
          Pending
        </Badge>
      );
  }
}
