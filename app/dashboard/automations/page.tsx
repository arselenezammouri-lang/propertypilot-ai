"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { ProFeaturePaywall } from "@/components/demo-modal";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { WorkflowAutomationTypeId } from "@/lib/i18n/workflow-automations-page-ui";
import { useUsageLimits } from "@/hooks/use-usage-limits";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import {
  apiFailureToast,
  validationToast,
} from "@/lib/i18n/api-feature-feedback";
import { formatDateTimeForLocale } from "@/lib/i18n/intl";
import { Locale } from "@/lib/i18n/config";
import {
  Settings,
  Plus,
  Play,
  Trash2,
  Mail,
  Calendar,
  Loader2,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import type { Automation } from "@/lib/types/database.types";

interface FormData {
  type: "followup" | "reminder" | "weekly-content";
  name: string;
  client_name: string;
  client_email: string;
  property_type: string;
  property_location: string;
  delay_hours: number;
  email_type: string;
  visit_date: string;
  reminder_type: "3h" | "24h";
  content_types: string[];
  target_market: "ita" | "usa" | "international";
  repeat_interval: "once" | "daily" | "weekly";
}

export default function AutomationsPage() {
  const { locale, timezone } = useLocaleContext();
  const { toast } = useToast();
  const usage = useUsageLimits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [resultDialog, setResultDialog] = useState<{ open: boolean; result: string | null }>({ open: false, result: null });
  const feedbackLocale = locale === "it" ? "it" : "en";

  const ui = useMemo(
    () => getTranslation(locale as SupportedLocale).dashboard.workflowAutomationsPage,
    [locale]
  );
  const t = ui;
  const premiumMsgRef = useRef(t.premiumRequired);
  premiumMsgRef.current = t.premiumRequired;

  const automationTypes = useMemo(() => {
    const ids: WorkflowAutomationTypeId[] = ["followup", "reminder", "weekly-content"];
    const icons = {
      followup: Mail,
      reminder: Calendar,
      "weekly-content": Share2,
    } as const;
    const colors = {
      followup: "from-blue-500 to-indigo-600",
      reminder: "from-amber-500 to-orange-600",
      "weekly-content": "from-emerald-500 to-teal-600",
    } as const;
    return ids.map((id) => ({
      id,
      label: ui.automationTypes[id].label,
      description: ui.automationTypes[id].description,
      icon: icons[id],
      color: colors[id],
    }));
  }, [ui]);

  const emailTypes = ui.emailTypes;
  const repeatIntervals = ui.repeatIntervals;

  const [formData, setFormData] = useState<FormData>({
    type: "followup",
    name: "",
    client_name: "",
    client_email: "",
    property_type: "",
    property_location: "",
    delay_hours: 24,
    email_type: "24h",
    visit_date: "",
    reminder_type: "24h",
    content_types: ["social_post"],
    target_market: "ita",
    repeat_interval: "once",
  });

  const userPlan = usage.plan as "free" | "starter" | "pro" | "agency";
  const isLoadingPlan = usage.isLoading;
  const isLocked = userPlan !== "pro" && userPlan !== "agency";

  const planBadgeLabel =
    userPlan === "agency"
      ? t.planAgency
      : userPlan === "pro"
        ? t.planPro
        : userPlan === "starter"
          ? t.planStarter
          : t.planFree;

  const { data: automationsData, isLoading } = useQuery<{ automations: Automation[] }>({
    queryKey: ["/api/automations"],
    enabled: !isLocked, // Only fetch if not locked
  });

  const automations: Automation[] = automationsData?.automations || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (response.status === 403) {
        throw new Error(result.message || result.error || premiumMsgRef.current);
      }
      
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: t.success, description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      const r = apiFailureToast(
        feedbackLocale,
        "workflowAutomations",
        { message: error.message },
        error.message
      );
      toast({ title: r.title, description: r.description, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: t.success, description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
    },
    onError: (error: Error) => {
      const r = apiFailureToast(feedbackLocale, "workflowAutomations", { message: error.message }, error.message);
      toast({ title: r.title, description: r.description, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/automations?id=${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: t.deleted, description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
    },
    onError: (error: Error) => {
      const r = apiFailureToast(feedbackLocale, "workflowAutomations", { message: error.message }, error.message);
      toast({ title: r.title, description: r.description, variant: "destructive" });
    },
  });

  const executeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/automations/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automation_id: id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: t.executed, description: t.executionDone });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      setResultDialog({ open: true, result: data.result });
      setExecutingId(null);
    },
    onError: (error: Error) => {
      const r = apiFailureToast(feedbackLocale, "workflowAutomations", { message: error.message }, error.message);
      toast({ title: r.title, description: r.description, variant: "destructive" });
      setExecutingId(null);
    },
  });

  const resetForm = () => {
    setFormData({
      type: "followup",
      name: "",
      client_name: "",
      client_email: "",
      property_type: "",
      property_location: "",
      delay_hours: 24,
      email_type: "24h",
      visit_date: "",
      reminder_type: "24h",
      content_types: ["social_post"],
      target_market: "ita",
      repeat_interval: "once",
    });
    setSelectedType(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      const v = validationToast(feedbackLocale, "workflowAutomations", t.enterName);
      toast({ title: v.title, description: v.description, variant: "destructive" });
      return;
    }

    let payload: any = {};

    if (formData.type === "followup") {
      if (!formData.client_name || !formData.client_email || !formData.property_type) {
        const v = validationToast(feedbackLocale, "workflowAutomations", t.fillRequired);
        toast({ title: v.title, description: v.description, variant: "destructive" });
        return;
      }
      payload = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        property_type: formData.property_type,
        property_location: formData.property_location,
        delay_hours: formData.delay_hours,
        email_type: formData.email_type,
      };
    } else if (formData.type === "reminder") {
      if (!formData.client_name || !formData.client_email || !formData.visit_date) {
        const v = validationToast(feedbackLocale, "workflowAutomations", t.fillRequired);
        toast({ title: v.title, description: v.description, variant: "destructive" });
        return;
      }
      payload = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        property_type: formData.property_type,
        property_location: formData.property_location,
        visit_date: new Date(formData.visit_date).toISOString(),
        reminder_type: formData.reminder_type,
      };
    } else if (formData.type === "weekly-content") {
      if (formData.content_types.length === 0) {
        const v = validationToast(feedbackLocale, "workflowAutomations", t.selectContent);
        toast({ title: v.title, description: v.description, variant: "destructive" });
        return;
      }
      payload = {
        content_types: formData.content_types,
        property_focus: formData.property_type,
        target_market: formData.target_market,
      };
    }

    createMutation.mutate({
      type: formData.type,
      name: formData.name,
      payload,
      repeat_interval: formData.repeat_interval,
    });
  };

  const handleExecute = (id: string) => {
    setExecutingId(id);
    executeMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{t.active}</Badge>;
      case "paused":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{t.paused}</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{t.completed}</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t.failed}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "followup":
        return <Mail className="h-5 w-5 text-blue-400" />;
      case "reminder":
        return <Calendar className="h-5 w-5 text-amber-400" />;
      case "weekly-content":
        return <Share2 className="h-5 w-5 text-emerald-400" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t.notAvailable;
    return formatDateTimeForLocale(dateString, locale as Locale, timezone);
  };

  return (
    <DashboardPageShell className="max-w-7xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        data-testid="button-back"
        aria-label={t.backAria}
      >
        <ArrowLeft className="h-4 w-4" />
        {t.dashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        titleDataTestId="heading-workflow-automations"
        subtitle={t.pageSubtitle}
        planBadge={{ label: planBadgeLabel, variant: "outline" }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white/90" asChild>
              <Link href="/dashboard/crm/automations">{t.crmRulesLink}</Link>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  data-testid="button-create-automation"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.newAutomation}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{t.createAutomation}</DialogTitle>
                  <DialogDescription>
                    {t.configureAutomation}
                  </DialogDescription>
                </DialogHeader>
                
                {!selectedType ? (
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground mb-2">{t.selectAutomationType}</p>
                    {automationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id);
                          setFormData(prev => ({ ...prev, type: type.id as any }));
                        }}
                        className={`p-4 rounded-xl border-2 border-transparent hover:border-teal-500/50 bg-muted/50 hover:bg-muted transition-all text-left flex items-start gap-4`}
                        data-testid={`button-type-${type.id}`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                          <type.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)} className="w-fit" data-testid="button-back-type">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t.backToSelection}
                    </Button>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t.automationName}</Label>
                        <Input
                          id="name"
                          placeholder={t.automationNamePlaceholder}
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-automation-name"
                        />
                      </div>

                      {(formData.type === "followup" || formData.type === "reminder") && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="client_name">{t.clientName}</Label>
                              <Input
                                id="client_name"
                                placeholder={t.placeholderClientName}
                                value={formData.client_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                data-testid="input-client-name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="client_email">{t.clientEmail}</Label>
                              <Input
                                id="client_email"
                                type="email"
                                placeholder={t.placeholderClientEmail}
                                value={formData.client_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                                data-testid="input-client-email"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property_type">{t.propertyType}</Label>
                              <Input
                                id="property_type"
                                placeholder={t.placeholderPropertyType}
                                value={formData.property_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                                data-testid="input-property-type"
                              />
                            </div>
                            <div>
                              <Label htmlFor="property_location">{t.area}</Label>
                              <Input
                                id="property_location"
                                placeholder={t.placeholderArea}
                                value={formData.property_location}
                                onChange={(e) => setFormData(prev => ({ ...prev, property_location: e.target.value }))}
                                data-testid="input-property-location"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.type === "followup" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email_type">{t.emailType}</Label>
                              <Select
                                value={formData.email_type}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, email_type: v }))}
                              >
                                <SelectTrigger data-testid="select-email-type">
                                  <SelectValue placeholder={t.selectType} />
                                </SelectTrigger>
                                <SelectContent>
                                  {emailTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="delay_hours">{t.sendInHours}</Label>
                              <Input
                                id="delay_hours"
                                type="number"
                                min={1}
                                max={168}
                                value={formData.delay_hours}
                                onChange={(e) => setFormData(prev => ({ ...prev, delay_hours: parseInt(e.target.value) || 24 }))}
                                data-testid="input-delay-hours"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.type === "reminder" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="visit_date">{t.visitDate}</Label>
                              <Input
                                id="visit_date"
                                type="datetime-local"
                                value={formData.visit_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                                data-testid="input-visit-date"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reminder_type">{t.reminderType}</Label>
                              <Select
                                value={formData.reminder_type}
                                onValueChange={(v: "3h" | "24h") => setFormData(prev => ({ ...prev, reminder_type: v }))}
                              >
                                <SelectTrigger data-testid="select-reminder-type">
                                  <SelectValue placeholder={t.select} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3h">{t.reminder3hBefore}</SelectItem>
                                  <SelectItem value="24h">{t.reminder24hBefore}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}

                      {formData.type === "weekly-content" && (
                        <>
                          <div>
                            <Label className="mb-3 block">{t.contentTypes}</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: "social_post", label: t.contentSocialPost },
                                { value: "newsletter", label: t.contentNewsletter },
                                { value: "ab_titles", label: t.contentAbTitles },
                              ].map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      content_types: prev.content_types.includes(item.value)
                                        ? prev.content_types.filter((id) => id !== item.value)
                                        : [...prev.content_types, item.value]
                                    }));
                                  }}
                                  className={`px-4 py-2 rounded-lg border transition-colors ${
                                    formData.content_types.includes(item.value)
                                      ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                      : "bg-muted border-muted-foreground/20 hover:border-teal-500/50"
                                  }`}
                                  data-testid={`toggle-content-${item.value}`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property_focus">{t.propertyFocus}</Label>
                              <Input
                                id="property_focus"
                                placeholder={t.placeholderPropertyFocus}
                                value={formData.property_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                                data-testid="input-property-focus"
                              />
                            </div>
                            <div>
                              <Label htmlFor="target_market">{t.targetMarket}</Label>
                              <Select
                                value={formData.target_market}
                                onValueChange={(v: "ita" | "usa" | "international") => setFormData(prev => ({ ...prev, target_market: v }))}
                              >
                                <SelectTrigger data-testid="select-target-market">
                                  <SelectValue placeholder={t.selectMarket} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ita">{t.marketItaly}</SelectItem>
                                  <SelectItem value="usa">{t.marketUsa}</SelectItem>
                                  <SelectItem value="international">{t.marketInternational}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor="repeat_interval">{t.repeat}</Label>
                        <Select
                          value={formData.repeat_interval}
                          onValueChange={(v: "once" | "daily" | "weekly") => setFormData(prev => ({ ...prev, repeat_interval: v }))}
                        >
                          <SelectTrigger data-testid="select-repeat-interval">
                            <SelectValue placeholder={t.selectRepeat} />
                          </SelectTrigger>
                          <SelectContent>
                            {repeatIntervals.map((interval) => (
                              <SelectItem key={interval.value} value={interval.value}>
                                {interval.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={handleSubmit} 
                        disabled={createMutation.isPending}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                        data-testid="button-submit-automation"
                      >
                        {createMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t.creating}
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            {t.submitCreate}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <p className="mb-6 max-w-2xl text-sm text-white/55">{t.crmRulesHint}</p>

      <ProFeaturePaywall
          title={t.paywallTitle}
          description={t.paywallDescription}
          isLocked={isLocked && !isLoadingPlan}
        >
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {automationTypes.map((type) => {
            const count = automations.filter(a => a.type === type.id).length;
            const activeCount = automations.filter(a => a.type === type.id && a.status === "active").length;
            return (
              <Card key={type.id} className="futuristic-card hover-lift" data-testid={`card-stats-${type.id}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{type.label}</CardTitle>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                    <type.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{count}</div>
                  <p className="text-sm text-muted-foreground">
                    {t.activeCount.replace("{count}", String(activeCount))}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-teal-400" />
              {t.yourAutomations}
            </CardTitle>
            <CardDescription>{t.yourAutomationsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
              </div>
            ) : automations.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.noAutomations}</h3>
                <p className="text-muted-foreground mb-6">{t.noAutomationDesc}</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  data-testid="button-create-first"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.createFirstAutomation}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div 
                    key={automation.id} 
                    className="p-4 rounded-xl border border-muted bg-muted/30 hover:bg-muted/50 transition-colors"
                    data-testid={`automation-item-${automation.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getTypeIcon(automation.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{automation.name}</h3>
                            {getStatusBadge(automation.status)}
                            {automation.repeat_interval !== "once" && (
                              <Badge variant="outline" className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                {automation.repeat_interval === "daily" ? t.daily : t.weekly}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              {t.type}:{" "}
                              {automationTypes.find((at) => at.id === automation.type)?.label}
                            </p>
                            {automation.next_run && (
                              <p>{t.nextRun}: {formatDate(automation.next_run)}</p>
                            )}
                            {automation.last_run && (
                              <p>{t.lastRun}: {formatDate(automation.last_run)}</p>
                            )}
                            <p>{t.runs}: {automation.execution_count}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={automation.status === "active"}
                          onCheckedChange={(checked) => {
                            toggleMutation.mutate({
                              id: automation.id,
                              status: checked ? "active" : "paused",
                            });
                          }}
                          disabled={automation.status === "completed" || automation.status === "failed"}
                          data-testid={`switch-toggle-${automation.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExecute(automation.id)}
                          disabled={automation.status !== "active" || executingId === automation.id}
                          data-testid={`button-execute-${automation.id}`}
                        >
                          {executingId === automation.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(automation.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:border-red-400"
                          data-testid={`button-delete-${automation.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {automation.last_result && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t.lastResult}</p>
                        <p className="text-sm whitespace-pre-wrap">{automation.last_result.substring(0, 500)}{automation.last_result.length > 500 && "..."}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </ProFeaturePaywall>

      <Dialog open={resultDialog.open} onOpenChange={(open) => setResultDialog({ open, result: null })}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              {t.resultTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm">
            {resultDialog.result}
          </div>
          <Button onClick={() => setResultDialog({ open: false, result: null })} data-testid="button-close-result">
            {t.close}
          </Button>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
