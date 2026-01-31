"use client";

import { useState, useEffect } from "react";
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
import { 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Mail, 
  Clock, 
  Calendar,
  Sparkles, 
  Loader2,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Share2,
  FileText
} from "lucide-react";
import Link from "next/link";
import type { Automation } from "@/lib/types/database.types";

const AUTOMATION_TYPES = [
  { 
    id: "followup", 
    label: "Follow-up Automatico Lead", 
    icon: Mail, 
    description: "Invia email di follow-up automatiche ai tuoi lead",
    color: "from-blue-500 to-indigo-600"
  },
  { 
    id: "reminder", 
    label: "Reminder Appuntamenti", 
    icon: Calendar, 
    description: "Promemoria automatici per visite immobiliari",
    color: "from-amber-500 to-orange-600"
  },
  { 
    id: "weekly-content", 
    label: "Contenuti Settimanali", 
    icon: Share2, 
    description: "Genera automaticamente post social, newsletter e titoli",
    color: "from-emerald-500 to-teal-600"
  },
] as const;

const EMAIL_TYPES = [
  { value: "immediate", label: "Risposta Immediata" },
  { value: "24h", label: "Follow-up 24h" },
  { value: "72h", label: "Follow-up 72h" },
  { value: "appointment", label: "Appuntamento" },
  { value: "post-visit", label: "Post-Visita" },
  { value: "luxury", label: "Luxury Lead" },
];

const REPEAT_INTERVALS = [
  { value: "once", label: "Una volta" },
  { value: "daily", label: "Giornaliero" },
  { value: "weekly", label: "Settimanale" },
];

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
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [resultDialog, setResultDialog] = useState<{ open: boolean; result: string | null }>({ open: false, result: null });
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'agency'>('free');
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

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

  // Load user subscription plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();
        
        if (data.success && data.data) {
          const plan = (data.data.status || 'free') as 'free' | 'starter' | 'pro' | 'agency';
          setUserPlan(plan);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    };
    
    fetchUserPlan();
  }, []);

  const isLocked = userPlan !== 'pro' && userPlan !== 'agency';

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
      
      // If 403, update user plan to free and show error
      if (response.status === 403) {
        setUserPlan('free');
        throw new Error(result.message || result.error || "Le Automazioni AI sono una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.");
      }
      
      if (!response.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: "Successo!", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
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
      toast({ title: "Successo!", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
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
      toast({ title: "Eliminata!", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
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
      toast({ title: "Eseguita!", description: "Automazione completata con successo" });
      queryClient.invalidateQueries({ queryKey: ["/api/automations"] });
      setResultDialog({ open: true, result: data.result });
      setExecutingId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
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
      toast({ title: "Errore", description: "Inserisci un nome per l'automazione", variant: "destructive" });
      return;
    }

    let payload: any = {};

    if (formData.type === "followup") {
      if (!formData.client_name || !formData.client_email || !formData.property_type) {
        toast({ title: "Errore", description: "Compila tutti i campi obbligatori", variant: "destructive" });
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
        toast({ title: "Errore", description: "Compila tutti i campi obbligatori", variant: "destructive" });
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
        toast({ title: "Errore", description: "Seleziona almeno un tipo di contenuto", variant: "destructive" });
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
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Attiva</Badge>;
      case "paused":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">In pausa</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completata</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fallita</Badge>;
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-glow-aqua">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Automazioni AI
                </h1>
                <p className="text-sm text-muted-foreground">Automatizza le tue attività quotidiane</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700" data-testid="button-create-automation">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuova Automazione
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Crea Automazione</DialogTitle>
                  <DialogDescription>
                    Configura una nuova automazione per la tua agenzia
                  </DialogDescription>
                </DialogHeader>
                
                {!selectedType ? (
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground mb-2">Seleziona il tipo di automazione:</p>
                    {AUTOMATION_TYPES.map((type) => (
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
                      Torna alla selezione
                    </Button>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome Automazione *</Label>
                        <Input
                          id="name"
                          placeholder="Es. Follow-up Mario Rossi"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-automation-name"
                        />
                      </div>

                      {(formData.type === "followup" || formData.type === "reminder") && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="client_name">Nome Cliente *</Label>
                              <Input
                                id="client_name"
                                placeholder="Mario Rossi"
                                value={formData.client_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                data-testid="input-client-name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="client_email">Email Cliente *</Label>
                              <Input
                                id="client_email"
                                type="email"
                                placeholder="mario@email.com"
                                value={formData.client_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                                data-testid="input-client-email"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property_type">Tipo Immobile</Label>
                              <Input
                                id="property_type"
                                placeholder="Appartamento, Villa..."
                                value={formData.property_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                                data-testid="input-property-type"
                              />
                            </div>
                            <div>
                              <Label htmlFor="property_location">Zona</Label>
                              <Input
                                id="property_location"
                                placeholder="Milano Centro"
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
                              <Label htmlFor="email_type">Tipo Email</Label>
                              <Select
                                value={formData.email_type}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, email_type: v }))}
                              >
                                <SelectTrigger data-testid="select-email-type">
                                  <SelectValue placeholder="Seleziona tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {EMAIL_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="delay_hours">Invio tra (ore)</Label>
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
                              <Label htmlFor="visit_date">Data Visita *</Label>
                              <Input
                                id="visit_date"
                                type="datetime-local"
                                value={formData.visit_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                                data-testid="input-visit-date"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reminder_type">Tipo Promemoria</Label>
                              <Select
                                value={formData.reminder_type}
                                onValueChange={(v: "3h" | "24h") => setFormData(prev => ({ ...prev, reminder_type: v }))}
                              >
                                <SelectTrigger data-testid="select-reminder-type">
                                  <SelectValue placeholder="Seleziona" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3h">3 ore prima</SelectItem>
                                  <SelectItem value="24h">24 ore prima</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}

                      {formData.type === "weekly-content" && (
                        <>
                          <div>
                            <Label className="mb-3 block">Tipi di Contenuto *</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: "social_post", label: "Post Social" },
                                { value: "newsletter", label: "Newsletter" },
                                { value: "ab_titles", label: "Titoli A/B" },
                              ].map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      content_types: prev.content_types.includes(item.value)
                                        ? prev.content_types.filter(t => t !== item.value)
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
                              <Label htmlFor="property_focus">Focus Proprietà</Label>
                              <Input
                                id="property_focus"
                                placeholder="Es. Ville di lusso"
                                value={formData.property_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                                data-testid="input-property-focus"
                              />
                            </div>
                            <div>
                              <Label htmlFor="target_market">Mercato Target</Label>
                              <Select
                                value={formData.target_market}
                                onValueChange={(v: "ita" | "usa" | "international") => setFormData(prev => ({ ...prev, target_market: v }))}
                              >
                                <SelectTrigger data-testid="select-target-market">
                                  <SelectValue placeholder="Seleziona mercato" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ita">Italia</SelectItem>
                                  <SelectItem value="usa">USA</SelectItem>
                                  <SelectItem value="international">Internazionale</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor="repeat_interval">Ripetizione</Label>
                        <Select
                          value={formData.repeat_interval}
                          onValueChange={(v: "once" | "daily" | "weekly") => setFormData(prev => ({ ...prev, repeat_interval: v }))}
                        >
                          <SelectTrigger data-testid="select-repeat-interval">
                            <SelectValue placeholder="Seleziona ripetizione" />
                          </SelectTrigger>
                          <SelectContent>
                            {REPEAT_INTERVALS.map((interval) => (
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
                            Creazione in corso...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Crea Automazione
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProFeaturePaywall
          title="Automazioni AI"
          description="Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare le automazioni complete."
          isLocked={isLocked && !isLoadingPlan}
        >
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {AUTOMATION_TYPES.map((type) => {
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
                  <p className="text-sm text-muted-foreground">{activeCount} attive</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-teal-400" />
              Le Tue Automazioni
            </CardTitle>
            <CardDescription>Gestisci le automazioni attive per la tua agenzia</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
              </div>
            ) : automations.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nessuna automazione</h3>
                <p className="text-muted-foreground mb-6">Crea la tua prima automazione per iniziare</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  data-testid="button-create-first"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crea Prima Automazione
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
                                {automation.repeat_interval === "daily" ? "Giornaliero" : "Settimanale"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Tipo: {AUTOMATION_TYPES.find(t => t.id === automation.type)?.label}</p>
                            {automation.next_run && (
                              <p>Prossima esecuzione: {formatDate(automation.next_run)}</p>
                            )}
                            {automation.last_run && (
                              <p>Ultima esecuzione: {formatDate(automation.last_run)}</p>
                            )}
                            <p>Esecuzioni: {automation.execution_count}</p>
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
                        <p className="text-xs font-medium text-muted-foreground mb-1">Ultimo Risultato:</p>
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
      </main>

      <Dialog open={resultDialog.open} onOpenChange={(open) => setResultDialog({ open, result: null })}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Risultato Automazione
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm">
            {resultDialog.result}
          </div>
          <Button onClick={() => setResultDialog({ open: false, result: null })} data-testid="button-close-result">
            Chiudi
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
