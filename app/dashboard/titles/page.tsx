"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import { fetchApi } from "@/lib/api/client";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  clipboardFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import {
  Copy,
  Check,
  Sparkles,
  Loader2,
  Star,
  TrendingUp,
  Target,
  Tag,
  KeyRound,
  Palmtree,
  ArrowLeft,
  MousePointerClick,
} from "lucide-react";
import {
  getTitlesAbCategoryVisuals,
  toneIconsForTitlesAb,
} from "@/lib/i18n/titles-ab-page-ui";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tono = "professionale" | "emotivo" | "luxury";
type TipoImmobile = "casa" | "appartamento" | "villa" | "locale" | "terreno" | "ufficio";

interface TitlesResponse {
  titoli: string[];
  clickbait: string[];
  luxury: string[];
  seo: string[];
  migliore: {
    titolo: string;
    motivazione: string;
  };
}

interface FormData {
  tipoTransazione: string;
  tipoImmobile: TipoImmobile;
  localita: string;
  prezzo: string;
  superficie: string;
  camere: string;
  puntiChiave: string;
  tono: Tono;
}

export default function TitlesPage() {
  const { toast } = useToast();
  const { locale } = useLocaleContext();
  const feedbackLocale = locale;
  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const tt = dash.transactionTypes;
  const tipoTransazioneOptions = useMemo(
    () =>
      [
        { value: "vendita", label: tt.vendita, Icon: Tag },
        { value: "affitto", label: tt.affitto, Icon: KeyRound },
        { value: "affitto_breve", label: tt.affitto_breve, Icon: Palmtree },
      ] as const,
    [tt]
  );
  const usage = useUsageLimits();
  const tp = dash.titlesAbPage;
  const t = tp;
  const categoryVisuals = useMemo(() => getTitlesAbCategoryVisuals(), []);
  const propertyTypeOptions = tp.propertyTypes;
  const toniOptions = useMemo(
    () =>
      tp.tones.map((opt) => ({
        value: opt.value as Tono,
        label: opt.label,
        description: opt.description,
        icon: toneIconsForTitlesAb[opt.value],
        gradient:
          opt.value === "professionale"
            ? "from-blue-500 to-cyan-500"
            : opt.value === "emotivo"
              ? "from-pink-500 to-rose-500"
              : "from-amber-500 to-yellow-500",
      })),
    [tp.tones]
  );
  const titleCategories = useMemo(
    () =>
      tp.categories.map((c) => ({
        key: c.key,
        label: c.label,
        description: c.description,
        badge: c.badge,
        icon: categoryVisuals.categoryIcons[c.key],
        gradient: categoryVisuals.categoryGradients[c.key],
        shadowColor: categoryVisuals.categoryShadows[c.key],
      })),
    [categoryVisuals, tp.categories]
  );
  
  const [formData, setFormData] = useState<FormData>({
    tipoTransazione: "vendita",
    tipoImmobile: "appartamento",
    localita: "",
    prezzo: "",
    superficie: "",
    camere: "",
    puntiChiave: "",
    tono: "professionale",
  });
  
  const [result, setResult] = useState<TitlesResponse | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const planBadgeLabel =
    usage.plan === "agency"
      ? dash.planAgency
      : usage.plan === "pro"
        ? dash.planPro
        : usage.plan === "starter"
          ? dash.planStarter
          : dash.planFree;

  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetchApi<TitlesResponse>("/api/generate-titles", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.success) {
        const err = new Error(res.message || res.error || t.generateError) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }
      return res.data as TitlesResponse;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: t.successTitle,
        description: t.successDesc,
      });
    },
    onError: (error: Error & { status?: number }) => {
      const fail = apiFailureToast(feedbackLocale, "titleGenerator", {
        status: error.status,
        message: error.message,
        error: error.message,
      }, t.generateError);
      toast({
        title: fail.title,
        description: fail.description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.localita || formData.localita.length < 2) {
      const v = validationToast(feedbackLocale, "titleGenerator", t.locationRequiredDesc);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    
    if (!formData.puntiChiave || formData.puntiChiave.length < 10) {
      const v = validationToast(feedbackLocale, "titleGenerator", t.pointsRequiredDesc);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }
    
    generateMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(text);
      toast({
        title: t.copied,
        description: t.copiedDesc,
      });
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, "titleGenerator", t.copyFailedDesc);
      toast({ title: c.title, description: c.description, variant: "destructive" });
    }
  };

  const TitleCard = ({ title, index, category }: { title: string; index: number; category: string }) => (
    <div 
      className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
      data-testid={`title-${category}-${index}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {index + 1}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
          {title}
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => copyToClipboard(title)}
        className="flex-shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        data-testid={`button-copy-${category}-${index}`}
      >
        {copiedTitle === title ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        {t.backToDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        subtitle={t.heroDescription}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {t.subtitleBadge}
          </Badge>
        }
      />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900" data-testid="card-form">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-500" />
                  {t.propertyData}
                </CardTitle>
                <CardDescription>
                  {t.propertyDataDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label>{t.listingType}</Label>
                    <Select
                      value={formData.tipoTransazione}
                      onValueChange={(value) => setFormData({ ...formData, tipoTransazione: value })}
                    >
                      <SelectTrigger data-testid="select-tipo-transazione">
                        <SelectValue placeholder={t.selectTransaction} />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoTransazioneOptions.map((option) => {
                          const TxIcon = option.Icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <TxIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                                <span>{option.label}</span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipoImmobile">{t.propertyType}</Label>
                      <Select
                        value={formData.tipoImmobile}
                        onValueChange={(value: TipoImmobile) => setFormData({ ...formData, tipoImmobile: value })}
                      >
                        <SelectTrigger className="mt-1.5" data-testid="select-tipo-immobile">
                          <SelectValue placeholder={t.selectPropertyType} />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="localita">{t.locationLabel}</Label>
                      <Input
                        id="localita"
                        placeholder={t.locationPlaceholder}
                        value={formData.localita}
                        onChange={(e) => setFormData({ ...formData, localita: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-localita"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prezzo">{t.priceLabel}</Label>
                      <Input
                        id="prezzo"
                        placeholder={t.pricePlaceholder}
                        value={formData.prezzo}
                        onChange={(e) => setFormData({ ...formData, prezzo: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-prezzo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="superficie">{t.sizeLabel}</Label>
                      <Input
                        id="superficie"
                        placeholder={t.sizePlaceholder}
                        value={formData.superficie}
                        onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-superficie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="camere">{t.roomsLabel}</Label>
                      <Input
                        id="camere"
                        placeholder={t.roomsPlaceholder}
                        value={formData.camere}
                        onChange={(e) => setFormData({ ...formData, camere: e.target.value })}
                        className="mt-1.5"
                        data-testid="input-camere"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="puntiChiave">{t.keyPointsLabel}</Label>
                    <Textarea
                      id="puntiChiave"
                      placeholder={t.keyPointsPlaceholder}
                      value={formData.puntiChiave}
                      onChange={(e) => setFormData({ ...formData, puntiChiave: e.target.value })}
                      className="mt-1.5 min-h-[80px]"
                      data-testid="input-punti-chiave"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{t.toneLabel}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {toniOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, tono: option.value })}
                            className={`relative p-3 rounded-xl border-2 transition-all ${
                              formData.tono === option.value
                                ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                            }`}
                            data-testid={`button-tono-${option.value}`}
                          >
                            <Icon className={`h-5 w-5 mx-auto mb-1.5 ${
                              formData.tono === option.value ? "text-white" : "text-slate-600 dark:text-slate-400"
                            }`} />
                            <div className={`font-semibold text-xs ${
                              formData.tono !== option.value && "text-slate-900 dark:text-white"
                            }`}>
                              {option.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t.generateButtonLoading}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        {t.generateButtonIdle}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {!result && !generateMutation.isPending && (
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50" data-testid="card-placeholder">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <MousePointerClick className="h-10 w-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t.emptyTitle}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    {t.emptySubtitle}
                  </p>
                </CardContent>
              </Card>
            )}

            {generateMutation.isPending && (
              <Card className="border-0 shadow-xl shadow-indigo-500/10 bg-white dark:bg-slate-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500" />
                  </div>
                  <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
                    {t.loadingTitle}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {t.loadingSubtitle}
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl shadow-green-500/10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 overflow-hidden" data-testid="card-best-title">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current" />
                      {t.bestTitleHeading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3" data-testid="text-best-title">
                          {result.migliore.titolo}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-best-motivation">
                          {result.migliore.motivazione}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(result.migliore.titolo)}
                        className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white"
                        data-testid="button-copy-best"
                      >
                        {copiedTitle === result.migliore.titolo ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {titleCategories.map((category) => {
                    const Icon = category.icon;
                    const titles = result[category.key as keyof typeof result] as string[];
                    
                    if (!titles || !Array.isArray(titles)) return null;
                    
                    return (
                      <Card 
                        key={category.key}
                        className={`border-0 shadow-xl ${category.shadowColor} bg-white dark:bg-slate-900 overflow-hidden`}
                        data-testid={`card-${category.key}`}
                      >
                        <CardHeader className={`bg-gradient-to-r ${category.gradient} text-white py-4`}>
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {category.label}
                            </div>
                            <Badge className="bg-white/20 text-white border-0 text-xs">
                              {category.badge}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-white/80 text-xs">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          {titles.map((title, index) => (
                            <TitleCard 
                              key={index} 
                              title={title} 
                              index={index} 
                              category={category.key}
                            />
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
    </DashboardPageShell>
  );
}
