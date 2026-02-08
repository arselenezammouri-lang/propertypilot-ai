"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Clock, 
  Calendar, 
  Home,
  Crown,
  Eye,
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  ArrowLeft,
  Lightbulb,
  Zap,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface EmailVariant {
  oggetto: string;
  testoEmail: string;
  cta: string;
  ps?: string;
  versioneBreve: string;
  versioneLunga: string;
}

interface FollowUpResult {
  immediateResponse: EmailVariant;
  followUp24h: EmailVariant;
  followUp72h: EmailVariant;
  appointmentScheduling: EmailVariant;
  postVisit: EmailVariant;
  luxuryLeadFollowUp: EmailVariant;
  consiglioConversione: string;
  cached?: boolean;
}

interface FormData {
  leadName: string;
  agentName: string;
  agencyName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  reasonOfInterest: string;
  tone: "professionale" | "amichevole" | "luxury";
}

const EMAIL_TYPES = [
  { id: "immediateResponse", label: "Risposta Immediata", icon: Zap, description: "Entro 1 ora" },
  { id: "followUp24h", label: "Follow-Up 24h", icon: Clock, description: "Dopo 24 ore" },
  { id: "followUp72h", label: "Follow-Up 72h", icon: Clock, description: "Dopo 72 ore" },
  { id: "appointmentScheduling", label: "Appuntamento", icon: Calendar, description: "Fissa visita" },
  { id: "postVisit", label: "Post-Visita", icon: Eye, description: "Dopo la visita" },
  { id: "luxuryLeadFollowUp", label: "Luxury Lead", icon: Crown, description: "Clienti VIP" },
] as const;

export default function FollowUpEmailsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FollowUpResult | null>(null);
  const [activeTab, setActiveTab] = useState("immediateResponse");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showLongVersion, setShowLongVersion] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    leadName: "",
    agentName: "",
    agencyName: "",
    propertyTitle: "",
    propertyLocation: "",
    propertyPrice: "",
    reasonOfInterest: "",
    tone: "professionale",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.leadName.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il nome del lead",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agentName.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il nome dell'agente",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agencyName.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il nome dell'agenzia",
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyTitle.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il titolo dell'immobile",
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyLocation.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci la località dell'immobile",
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyPrice.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci il prezzo dell'immobile",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reasonOfInterest.trim() || formData.reasonOfInterest.length < 10) {
      toast({
        title: "Campo obbligatorio",
        description: "Descrivi il motivo di interesse del lead (min 10 caratteri)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Limite raggiunto",
            description: data.message || "Troppi tentativi. Riprova tra un minuto.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 401) {
          toast({
            title: "Accesso negato",
            description: "Devi effettuare il login per usare questa funzione.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error || "Errore nella generazione");
      }

      setResult(data);
      setActiveTab("immediateResponse");
      toast({
        title: "Email generate con successo!",
        description: data.cached ? "Risultato dalla cache (24h)" : "6 email pronte per l'uso",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore nella generazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: "Copiato!",
        description: "Testo copiato negli appunti",
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: "Errore",
        description: "Impossibile copiare il testo",
        variant: "destructive",
      });
    }
  };

  const copyFullEmail = async (email: EmailVariant, emailType: string) => {
    const version = showLongVersion ? email.versioneLunga : email.testoEmail;
    const fullText = `Oggetto: ${email.oggetto}\n\n${version}\n\n${email.cta}${email.ps ? `\n\nP.S. ${email.ps}` : ''}`;
    copyToClipboard(fullText, `full-${emailType}`);
  };

  const getEmailTypeInfo = (type: string) => {
    return EMAIL_TYPES.find(t => t.id === type) || EMAIL_TYPES[0];
  };

  const renderEmailCard = (email: EmailVariant, emailType: string) => {
    const typeInfo = getEmailTypeInfo(emailType);
    const Icon = typeInfo.icon;
    
    return (
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-5 w-5 text-orange-600" />
              {typeInfo.label}
              <Badge variant="outline" className="ml-2 text-xs">
                {typeInfo.description}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLongVersion(!showLongVersion)}
                className="text-xs"
                data-testid={`button-toggle-version-${emailType}`}
              >
                {showLongVersion ? "Versione Standard" : "Versione Lunga"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => copyFullEmail(email, emailType)}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700"
                data-testid={`button-copy-full-${emailType}`}
              >
                {copiedField === `full-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copia Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Oggetto
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(email.oggetto, `oggetto-${emailType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-oggetto-${emailType}`}
              >
                {copiedField === `oggetto-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">
              {email.oggetto}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                {showLongVersion ? "Testo Email (Versione Lunga)" : "Testo Email"}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(
                  showLongVersion ? email.versioneLunga : email.testoEmail, 
                  `testo-${emailType}`
                )}
                className="h-6 px-2"
                data-testid={`button-copy-testo-${emailType}`}
              >
                {copiedField === `testo-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {showLongVersion ? email.versioneLunga : email.testoEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-muted-foreground">Call-to-Action</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(email.cta, `cta-${emailType}`)}
                  className="h-6 px-2"
                  data-testid={`button-copy-cta-${emailType}`}
                >
                  {copiedField === `cta-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                {email.cta}
              </p>
            </div>

            {email.ps && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">P.S.</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(email.ps!, `ps-${emailType}`)}
                    className="h-6 px-2"
                    data-testid={`button-copy-ps-${emailType}`}
                  >
                    {copiedField === `ps-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-sm italic text-muted-foreground bg-muted/30 p-2 rounded">
                  P.S. {email.ps}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Versione Breve (WhatsApp/SMS)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(email.versioneBreve, `breve-${emailType}`)}
                className="h-6 px-2"
                data-testid={`button-copy-breve-${emailType}`}
              >
                {copiedField === `breve-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              {email.versioneBreve}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
          <Mail className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Follow-Up Email AI
          </h1>
          <p className="text-muted-foreground">
            Genera 6 email professionali per convertire i tuoi lead immobiliari
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
          Lead Converter AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Dati del Lead
            </CardTitle>
            <CardDescription>
              Inserisci le informazioni per generare email personalizzate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="leadName">Nome del Lead *</Label>
              <Input
                id="leadName"
                placeholder="es. Marco Rossi"
                value={formData.leadName}
                onChange={(e) => handleInputChange("leadName", e.target.value)}
                data-testid="input-lead-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentName">Nome Agente *</Label>
              <Input
                id="agentName"
                placeholder="es. Anna Bianchi"
                value={formData.agentName}
                onChange={(e) => handleInputChange("agentName", e.target.value)}
                data-testid="input-agent-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Nome Agenzia *</Label>
              <Input
                id="agencyName"
                placeholder="es. Immobiliare Milano"
                value={formData.agencyName}
                onChange={(e) => handleInputChange("agencyName", e.target.value)}
                data-testid="input-agency-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyTitle">Titolo Immobile *</Label>
              <Input
                id="propertyTitle"
                placeholder="es. Attico con terrazzo panoramico"
                value={formData.propertyTitle}
                onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
                data-testid="input-property-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyLocation">Località *</Label>
                <Input
                  id="propertyLocation"
                  placeholder="es. Milano Centro"
                  value={formData.propertyLocation}
                  onChange={(e) => handleInputChange("propertyLocation", e.target.value)}
                  data-testid="input-property-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">Prezzo *</Label>
                <Input
                  id="propertyPrice"
                  placeholder="es. €450.000"
                  value={formData.propertyPrice}
                  onChange={(e) => handleInputChange("propertyPrice", e.target.value)}
                  data-testid="input-property-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasonOfInterest">Motivo di Interesse *</Label>
              <Textarea
                id="reasonOfInterest"
                placeholder="es. Il cliente cerca un attico in zona centrale per uso abitativo, ha visitato il portale e richiesto info..."
                value={formData.reasonOfInterest}
                onChange={(e) => handleInputChange("reasonOfInterest", e.target.value)}
                rows={3}
                data-testid="input-reason-of-interest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tono delle Email</Label>
              <Select
                value={formData.tone}
                onValueChange={(value: "professionale" | "amichevole" | "luxury") => 
                  handleInputChange("tone", value)
                }
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder="Seleziona tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professionale">Professionale</SelectItem>
                  <SelectItem value="amichevole">Amichevole</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              data-testid="button-generate-emails"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generazione in corso...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Genera 6 Email Follow-Up
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Mail className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nessuna email generata
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Compila il form con i dati del lead e clicca "Genera" per creare 
                  6 email di follow-up professionali e personalizzate.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Generazione in corso...</h3>
                <p className="text-sm text-muted-foreground">
                  Stiamo creando 6 email personalizzate per il tuo lead
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {result.consiglioConversione && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Consiglio per Convertire questo Lead
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {result.consiglioConversione}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
                  {EMAIL_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/30"
                        data-testid={`tab-${type.id}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{type.label.split(' ')[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="immediateResponse" className="mt-4">
                  {renderEmailCard(result.immediateResponse, "immediateResponse")}
                </TabsContent>
                <TabsContent value="followUp24h" className="mt-4">
                  {renderEmailCard(result.followUp24h, "followUp24h")}
                </TabsContent>
                <TabsContent value="followUp72h" className="mt-4">
                  {renderEmailCard(result.followUp72h, "followUp72h")}
                </TabsContent>
                <TabsContent value="appointmentScheduling" className="mt-4">
                  {renderEmailCard(result.appointmentScheduling, "appointmentScheduling")}
                </TabsContent>
                <TabsContent value="postVisit" className="mt-4">
                  {renderEmailCard(result.postVisit, "postVisit")}
                </TabsContent>
                <TabsContent value="luxuryLeadFollowUp" className="mt-4">
                  {renderEmailCard(result.luxuryLeadFollowUp, "luxuryLeadFollowUp")}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
