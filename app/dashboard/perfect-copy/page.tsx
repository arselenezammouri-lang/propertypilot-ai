'use client';

import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { ContextualHelpTrigger } from '@/components/contextual-help-trigger';
import { FieldHelpLabel } from '@/components/field-help-label';
import { ToolPageTwoColumnSkeleton } from '@/components/ui/skeleton-loaders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchApi } from '@/lib/api/client';
import { useAPIErrorHandler } from '@/components/error-boundary';
import {
  apiFailureToast,
  clipboardFailureToast,
  networkFailureToast,
  validationToast,
} from '@/lib/i18n/api-feature-feedback';
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Building2,
  Building,
  MapPin,
  Users,
  Wallet,
  Megaphone,
  Target,
  Search,
  Crown,
  Lightbulb,
  FileText,
  Heart,
  Zap,
  Gem,
  ArrowLeft,
  Rocket,
  Tag,
  KeyRound,
  Palmtree,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Umbrella,
  Globe,
  Plane,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
  PerfectCopyTargetIconKey,
  PerfectCopyTransactionIconKey,
} from '@/lib/i18n/perfect-copy-page-ui';

const PERFECT_COPY_TX_ICON: Record<PerfectCopyTransactionIconKey, LucideIcon> = {
  tag: Tag,
  keyRound: KeyRound,
  palmtree: Palmtree,
};

const PERFECT_COPY_TARGET_ICON: Record<PerfectCopyTargetIconKey, LucideIcon> = {
  users: Users,
  heart: Heart,
  trendingUp: TrendingUp,
  graduationCap: GraduationCap,
  briefcase: Briefcase,
  umbrella: Umbrella,
  gem: Gem,
  globe: Globe,
  plane: Plane,
  building: Building,
};
import Link from 'next/link';

interface CopyVariant {
  titolo: string;
  descrizione: string;
  highlights: string[];
  perchéComprarlo: string[];
  cta: string;
  metaDescription: string;
}

interface PerfectCopyResult {
  professionale: CopyVariant;
  emotivo: CopyVariant;
  breve: CopyVariant;
  seo: CopyVariant;
  luxury: CopyVariant;
  consiglioEsperto: string;
  portaleAdattamento?: string;
}


export default function PerfectCopyPage() {
  const { locale } = useLocale();
  const feedbackLocale = locale === 'it' ? 'it' : 'en';
  const { toast } = useToast();
  const { handleAPIError } = useAPIErrorHandler();
  const usage = useUsageLimits();
  const [pageReady, setPageReady] = useState(false);

  const t = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.perfectCopyPage,
    [locale]
  );

  const errorGenericRef = useRef(t.errorGeneric);
  errorGenericRef.current = t.errorGeneric;

  useEffect(() => {
    const id = requestAnimationFrame(() => setPageReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const planBadgeLabel =
    usage.plan === 'agency'
      ? t.planAgency
      : usage.plan === 'pro'
        ? t.planPro
        : usage.plan === 'starter'
          ? t.planStarter
          : t.planFree;

  const { tipoTransazione, tipiImmobile, targetCliente, toni, portali } = t;

  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [result, setResult] = useState<PerfectCopyResult | null>(null);
  const [activeTab, setActiveTab] = useState('professionale');

  const [formData, setFormData] = useState({
    tipoTransazione: 'vendita',
    tipoImmobile: '',
    zona: '',
    caratteristiche: '',
    puntiForzaList: '',
    targetCliente: '',
    fasciaPrezzo: '',
    tono: 'professionale',
    portaleTarget: 'generico',
  });

  const handleSubmit = async () => {
    if (!formData.tipoImmobile || !formData.zona || !formData.caratteristiche || !formData.targetCliente) {
      const v = validationToast(feedbackLocale, 'perfectCopy', t.requiredFieldsDesc);
      toast({ title: v.title, description: v.description, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetchApi<PerfectCopyResult>('/api/generate-perfect-copy', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (!res.success) {
        const fail = apiFailureToast(feedbackLocale, 'perfectCopy', {
          status: res.status,
          error: res.error,
          message: res.message,
        }, errorGenericRef.current);
        toast({ title: fail.title, description: fail.description, variant: 'destructive' });
        return;
      }
      setResult(res.data as PerfectCopyResult);
      setActiveTab('professionale');
      toast({ title: t.successTitle, description: t.successDesc });

    } catch (error) {
      const net = networkFailureToast(feedbackLocale, 'perfectCopy');
      const friendly = handleAPIError(error, net.description);
      toast({ title: net.title, description: friendly, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({ title: t.copied, description: t.copiedDesc });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const c = clipboardFailureToast(feedbackLocale, 'perfectCopy', t.copyFailed);
      toast({ title: c.title, description: c.description, variant: 'destructive' });
    }
  };

  const copyFullVariant = (variant: CopyVariant, name: string) => {
    const fullText = `${t.copyPackTitle}:\n${variant.titolo}\n\n${t.copyPackDescription}:\n${variant.descrizione}\n\n${t.copyPackHighlights}:\n${variant.highlights.map((h) => `• ${h}`).join('\n')}\n\n${t.copyPackWhyBuy}:\n${variant.perchéComprarlo.map((p) => `• ${p}`).join('\n')}\n\n${t.copyPackCta}:\n${variant.cta}\n\n${t.copyPackMeta}:\n${variant.metaDescription}`;
    copyToClipboard(fullText, `full-${name}`);
  };

  const renderVariantCard = (variant: CopyVariant, name: string, icon: ReactNode, color: string) => (
    <div className="space-y-4" data-testid={`variant-${name}`}>
      <div className="flex justify-end">
        <Button
          onClick={() => copyFullVariant(variant, name)}
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid={`button-copy-full-${name}`}
        >
          {copiedField === `full-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {t.copyAll}
        </Button>
      </div>

      <Card className={`border-${color}-200 dark:border-${color}-800/50 shadow-lg group`}>
        <div className={`h-1 bg-gradient-to-r ${getGradient(name)}`}></div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {icon}
              {t.sectionTitle}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(variant.titolo, `titolo-${name}`)}
              className="flex-shrink-0"
              data-testid={`button-copy-title-${name}`}
            >
              {copiedField === `titolo-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground">{variant.titolo}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {t.sectionDesc}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(variant.descrizione, `descrizione-${name}`)}
              className="flex-shrink-0"
              data-testid={`button-copy-description-${name}`}
            >
              {copiedField === `descrizione-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{variant.descrizione}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-lg group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {t.sectionHighlights}
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.highlights.join('\n• '), `highlights-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-highlights-${name}`}
              >
                {copiedField === `highlights-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {variant.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-500 mt-0.5">✦</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                {t.sectionWhy}
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.perchéComprarlo.join('\n• '), `perche-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-why-${name}`}
              >
                {copiedField === `perche-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {variant.perchéComprarlo.map((motivo, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {motivo}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-lg group bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-purple-500" />
                {t.sectionCta}
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.cta, `cta-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-cta-${name}`}
              >
                {copiedField === `cta-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-purple-700 dark:text-purple-300">{variant.cta}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg group bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                {t.sectionMeta}
                <Badge variant="secondary" className="text-xs">Google</Badge>
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(variant.metaDescription, `meta-${name}`)}
                className="flex-shrink-0"
                data-testid={`button-copy-meta-${name}`}
              >
                {copiedField === `meta-${name}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{variant.metaDescription}</p>
            <p className="text-xs text-blue-500 mt-2">{variant.metaDescription.length}/155 {t.metaChars}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getGradient = (name: string) => {
    switch (name) {
      case 'professionale': return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'emotivo': return 'from-pink-500 via-rose-500 to-red-500';
      case 'breve': return 'from-green-500 via-emerald-500 to-teal-500';
      case 'seo': return 'from-cyan-500 via-blue-500 to-indigo-500';
      case 'luxury': return 'from-amber-500 via-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getVariantIcon = (name: string) => {
    switch (name) {
      case 'professionale': return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'emotivo': return <Heart className="h-5 w-5 text-rose-500" />;
      case 'breve': return <Zap className="h-5 w-5 text-emerald-500" />;
      case 'seo': return <Search className="h-5 w-5 text-cyan-500" />;
      case 'luxury': return <Gem className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <DashboardPageShell className="max-w-6xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        data-testid="link-back-dashboard"
        aria-label={t.backAria}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        contextualHelp={<ContextualHelpTrigger docSlug="getting-started/perfect-copy" />}
        actions={
          <Badge className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
            <Rocket className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.heroBadge}
          </Badge>
        }
      />

      {!pageReady || usage.isLoading ? (
        <ToolPageTwoColumnSkeleton />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-amber-200 dark:border-amber-800/50 shadow-xl sticky top-8">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {t.formTitle}
                </CardTitle>
                <CardDescription>
                  {t.formSubtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-amber-500" />
                    {t.listingTypeLabel}
                  </Label>
                  <Select
                    value={formData.tipoTransazione}
                    onValueChange={(value) => setFormData({ ...formData, tipoTransazione: value })}
                  >
                    <SelectTrigger data-testid="select-tipo-transazione">
                      <SelectValue placeholder={t.selectListingType} />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoTransazione.map((tipo) => {
                        const TxIcon = PERFECT_COPY_TX_ICON[tipo.iconKey];
                        return (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            <span className="flex items-center gap-2">
                              <TxIcon className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                              {tipo.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    {t.propertyTypeLabel}
                  </Label>
                  <Select
                    value={formData.tipoImmobile}
                    onValueChange={(value) => setFormData({ ...formData, tipoImmobile: value })}
                  >
                    <SelectTrigger data-testid="select-tipo-immobile">
                      <SelectValue placeholder={t.selectPropertyType} />
                    </SelectTrigger>
                    <SelectContent>
                      {tipiImmobile.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {t.locationLabel}
                  </Label>
                  <Input
                    placeholder={t.locationPlaceholder}
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    data-testid="input-zona"
                  />
                </div>

                <div className="space-y-2">
                  <FieldHelpLabel help={t.featuresHelp} className="items-center">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-500" />
                      {t.featuresLabel}
                    </span>
                  </FieldHelpLabel>
                  <Textarea
                    placeholder={t.featuresPlaceholder}
                    value={formData.caratteristiche}
                    onChange={(e) => setFormData({ ...formData, caratteristiche: e.target.value })}
                    className="min-h-[100px]"
                    data-testid="textarea-caratteristiche"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {t.strengthsLabel}
                  </Label>
                  <Textarea
                    placeholder={t.strengthsPlaceholder}
                    value={formData.puntiForzaList}
                    onChange={(e) => setFormData({ ...formData, puntiForzaList: e.target.value })}
                    className="min-h-[80px]"
                    data-testid="textarea-punti-forza"
                  />
                </div>

                <div className="space-y-2">
                  <FieldHelpLabel help={t.targetHelp} className="items-center">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-500" />
                      {t.targetLabel}
                    </span>
                  </FieldHelpLabel>
                  <Select
                    value={formData.targetCliente}
                    onValueChange={(value) => setFormData({ ...formData, targetCliente: value })}
                  >
                    <SelectTrigger data-testid="select-target">
                      <SelectValue placeholder={t.selectTarget} />
                    </SelectTrigger>
                    <SelectContent>
                      {targetCliente.map((target) => {
                        const TgIcon = PERFECT_COPY_TARGET_ICON[target.iconKey];
                        return (
                          <SelectItem key={target.value} value={target.value}>
                            <span className="flex items-center gap-2">
                              <TgIcon className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                              {target.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-500" />
                    {t.priceLabel}
                  </Label>
                  <Input
                    placeholder={t.pricePlaceholder}
                    value={formData.fasciaPrezzo}
                    onChange={(e) => setFormData({ ...formData, fasciaPrezzo: e.target.value })}
                    data-testid="input-prezzo"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-amber-500" />
                    {t.toneLabel}
                  </Label>
                  <Select
                    value={formData.tono}
                    onValueChange={(value) => setFormData({ ...formData, tono: value })}
                  >
                    <SelectTrigger data-testid="select-tono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toni.map((tono) => (
                        <SelectItem key={tono.value} value={tono.value}>
                          {tono.label} - {tono.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    {t.portalLabel}
                  </Label>
                  <Select
                    value={formData.portaleTarget}
                    onValueChange={(value) => setFormData({ ...formData, portaleTarget: value })}
                  >
                    <SelectTrigger data-testid="select-portale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {portali.map((portale) => (
                        <SelectItem key={portale.value} value={portale.value}>
                          {portale.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-amber-700 dark:text-amber-300">{t.variantsIncluded}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.variantsDesc}
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                  size="lg"
                  data-testid="button-generate"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.generateLoading}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t.generateIdle}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
                <CardContent className="py-16 text-center">
                  <Crown className="h-16 w-16 mx-auto text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    {t.emptyTitle}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t.emptySubtitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <Badge variant="secondary" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t.tabPro}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Heart className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t.tabEmotivo}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t.tabBreve}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t.tabSeo}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Gem className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {t.tabLuxury}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="border-amber-200 dark:border-amber-800/50">
                <CardContent className="py-16 text-center">
                  <Loader2 className="h-16 w-16 mx-auto text-amber-500 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t.loadingTitle}</h3>
                  <p className="text-muted-foreground">
                    {t.loadingSubtitle}
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {result.consiglioEsperto && (
                  <Card className="border-amber-200 dark:border-amber-800/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        {t.expertTip}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">{result.consiglioEsperto}</p>
                    </CardContent>
                  </Card>
                )}

                {result.portaleAdattamento && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <strong>{t.portalAdaptation}</strong> {result.portaleAdattamento}
                    </p>
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 h-auto p-1" data-testid="tabs-variants">
                    <TabsTrigger value="professionale" className="flex flex-col gap-1 py-2 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/30">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs">{t.tabPro}</span>
                    </TabsTrigger>
                    <TabsTrigger value="emotivo" className="flex flex-col gap-1 py-2 data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{t.tabEmotivo}</span>
                    </TabsTrigger>
                    <TabsTrigger value="breve" className="flex flex-col gap-1 py-2 data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30">
                      <Zap className="h-4 w-4" />
                      <span className="text-xs">{t.tabBreve}</span>
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex flex-col gap-1 py-2 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-900/30">
                      <Search className="h-4 w-4" />
                      <span className="text-xs">{t.tabSeo}</span>
                    </TabsTrigger>
                    <TabsTrigger value="luxury" className="flex flex-col gap-1 py-2 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30">
                      <Gem className="h-4 w-4" />
                      <span className="text-xs">{t.tabLuxury}</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="professionale">
                      {renderVariantCard(result.professionale, 'professionale', getVariantIcon('professionale'), 'indigo')}
                    </TabsContent>
                    <TabsContent value="emotivo">
                      {renderVariantCard(result.emotivo, 'emotivo', getVariantIcon('emotivo'), 'rose')}
                    </TabsContent>
                    <TabsContent value="breve">
                      {renderVariantCard(result.breve, 'breve', getVariantIcon('breve'), 'emerald')}
                    </TabsContent>
                    <TabsContent value="seo">
                      {renderVariantCard(result.seo, 'seo', getVariantIcon('seo'), 'cyan')}
                    </TabsContent>
                    <TabsContent value="luxury">
                      {renderVariantCard(result.luxury, 'luxury', getVariantIcon('luxury'), 'amber')}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}
