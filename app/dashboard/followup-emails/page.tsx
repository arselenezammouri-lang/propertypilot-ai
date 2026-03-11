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
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { useAPIErrorHandler } from "@/components/error-boundary";
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

export default function FollowUpEmailsPage() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FollowUpResult | null>(null);
  const [activeTab, setActiveTab] = useState("immediateResponse");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showLongVersion, setShowLongVersion] = useState(false);
  const { handleAPIError } = useAPIErrorHandler();
  const t = {
    required: isItalian ? "Campo obbligatorio" : "Required field",
    leadNameRequired: isItalian ? "Inserisci il nome del lead" : "Enter the lead name",
    agentNameRequired: isItalian ? "Inserisci il nome dell'agente" : "Enter the agent name",
    agencyNameRequired: isItalian ? "Inserisci il nome dell'agenzia" : "Enter the agency name",
    propertyTitleRequired: isItalian ? "Inserisci il titolo dell'immobile" : "Enter the property title",
    propertyLocationRequired: isItalian ? "Inserisci la localita dell'immobile" : "Enter the property location",
    propertyPriceRequired: isItalian ? "Inserisci il prezzo dell'immobile" : "Enter the property price",
    reasonRequired: isItalian ? "Descrivi il motivo di interesse del lead (min 10 caratteri)" : "Describe the lead's reason of interest (min 10 characters)",
    rateLimit: isItalian ? "Limite raggiunto" : "Rate limit reached",
    rateLimitDesc: isItalian ? "Troppi tentativi. Riprova tra un minuto." : "Too many attempts. Try again in a minute.",
    accessDenied: isItalian ? "Accesso negato" : "Access denied",
    loginRequired: isItalian ? "Devi effettuare il login per usare questa funzione." : "You need to log in to use this feature.",
    generateError: isItalian ? "Errore nella generazione" : "Generation error",
    success: isItalian ? "Email generate con successo!" : "Emails generated successfully!",
    cacheResult: isItalian ? "Risultato dalla cache (24h)" : "Result from cache (24h)",
    ready6: isItalian ? "6 email pronte per l'uso" : "6 emails ready to use",
    error: isItalian ? "Errore" : "Error",
    copied: isItalian ? "Copiato!" : "Copied!",
    copiedText: isItalian ? "Testo copiato negli appunti" : "Text copied to clipboard",
    copyFailed: isItalian ? "Impossibile copiare il testo" : "Unable to copy text",
    subjectLabel: isItalian ? "Oggetto" : "Subject",
    psLabel: "P.S.",
    standardVersion: isItalian ? "Versione Standard" : "Standard Version",
    longVersion: isItalian ? "Versione Lunga" : "Long Version",
    copyEmail: isItalian ? "Copia Email" : "Copy Email",
    emailTextLong: isItalian ? "Testo Email (Versione Lunga)" : "Email Text (Long Version)",
    emailText: isItalian ? "Testo Email" : "Email Text",
    shortVersion: isItalian ? "Versione Breve (WhatsApp/SMS)" : "Short Version (WhatsApp/SMS)",
    back: isItalian ? "Torna alla Dashboard" : "Back to Dashboard",
    pageSubtitle: isItalian ? "Genera 6 email professionali per convertire i tuoi lead immobiliari" : "Generate 6 professional emails to convert your real estate leads",
    leadName: isItalian ? "Nome Lead *" : "Lead Name *",
    agentName: isItalian ? "Nome Agente *" : "Agent Name *",
    agencyName: isItalian ? "Nome Agenzia *" : "Agency Name *",
    propertyTitle: isItalian ? "Titolo Immobile *" : "Property Title *",
    propertyLocation: isItalian ? "Localita *" : "Location *",
    propertyPrice: isItalian ? "Prezzo *" : "Price *",
    reasonInterest: isItalian ? "Motivo di Interesse *" : "Reason of Interest *",
    tone: isItalian ? "Tono delle Email" : "Email Tone",
    generating: isItalian ? "Generazione in corso..." : "Generating...",
    generate6: isItalian ? "Genera 6 Email Follow-Up" : "Generate 6 Follow-Up Emails",
    noResultTitle: isItalian ? "Nessuna email generata" : "No emails generated yet",
    readyTitle: isItalian ? "Pronto a generare le tue email" : "Ready to generate your emails",
    readyDesc: isItalian ? 'Compila il form con i dati del lead e clicca "Genera" per creare 6 email professionali personalizzate.' : 'Fill in the form with the lead details and click "Generate" to create 6 personalized professional emails.',
    generatingTitle: isItalian ? "Generazione in corso..." : "Generation in progress...",
    generatingDesc: isItalian ? "Stiamo creando 6 email personalizzate per il tuo lead" : "We're creating 6 personalized emails for your lead",
    convertTip: isItalian ? "Consiglio per Convertire questo Lead" : "Tip to Convert This Lead",
    ctaLabel: isItalian ? "Invito all'azione" : "Call-to-Action",
  };
  const emailTypes = isItalian
    ? [
        { id: "immediateResponse", label: "Risposta Immediata", icon: Zap, description: "Entro 1 ora" },
        { id: "followUp24h", label: "Follow-Up 24h", icon: Clock, description: "Dopo 24 ore" },
        { id: "followUp72h", label: "Follow-Up 72h", icon: Clock, description: "Dopo 72 ore" },
        { id: "appointmentScheduling", label: "Appuntamento", icon: Calendar, description: "Fissa visita" },
        { id: "postVisit", label: "Post-Visita", icon: Eye, description: "Dopo la visita" },
        { id: "luxuryLeadFollowUp", label: "Luxury Lead", icon: Crown, description: "Clienti VIP" },
      ]
    : [
        { id: "immediateResponse", label: "Immediate Response", icon: Zap, description: "Within 1 hour" },
        { id: "followUp24h", label: "24h Follow-Up", icon: Clock, description: "After 24 hours" },
        { id: "followUp72h", label: "72h Follow-Up", icon: Clock, description: "After 72 hours" },
        { id: "appointmentScheduling", label: "Appointment", icon: Calendar, description: "Book a visit" },
        { id: "postVisit", label: "Post-Visit", icon: Eye, description: "After the visit" },
        { id: "luxuryLeadFollowUp", label: "Luxury Lead", icon: Crown, description: "VIP clients" },
      ];

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
        title: t.required,
        description: t.leadNameRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.agentName.trim()) {
      toast({
        title: t.required,
        description: t.agentNameRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.agencyName.trim()) {
      toast({
        title: t.required,
        description: t.agencyNameRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyTitle.trim()) {
      toast({
        title: t.required,
        description: t.propertyTitleRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyLocation.trim()) {
      toast({
        title: t.required,
        description: t.propertyLocationRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.propertyPrice.trim()) {
      toast({
        title: t.required,
        description: t.propertyPriceRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.reasonOfInterest.trim() || formData.reasonOfInterest.length < 10) {
      toast({
        title: t.required,
        description: t.reasonRequired,
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
            title: t.rateLimit,
            description: data.message || t.rateLimitDesc,
            variant: "destructive",
          });
          return;
        }
        if (response.status === 401) {
          toast({
            title: t.accessDenied,
            description: t.loginRequired,
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error || t.generateError);
      }

      setResult(data);
      setActiveTab("immediateResponse");
      toast({
        title: t.success,
        description: data.cached ? t.cacheResult : t.ready6,
      });
    } catch (error) {
      const friendly = handleAPIError(error, t.generateError);
      toast({
        title: t.error,
        description: friendly,
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
        title: t.copied,
        description: t.copiedText,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: t.error,
        description: t.copyFailed,
        variant: "destructive",
      });
    }
  };

  const copyFullEmail = async (email: EmailVariant, emailType: string) => {
    const version = showLongVersion ? email.versioneLunga : email.testoEmail;
    const fullText = `${t.subjectLabel}: ${email.oggetto}\n\n${version}\n\n${email.cta}${email.ps ? `\n\n${t.psLabel} ${email.ps}` : ''}`;
    copyToClipboard(fullText, `full-${emailType}`);
  };

  const getEmailTypeInfo = (type: string) => {
    return emailTypes.find(t => t.id === type) || emailTypes[0];
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
                {showLongVersion ? t.standardVersion : t.longVersion}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => copyFullEmail(email, emailType)}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700"
                data-testid={`button-copy-full-${emailType}`}
              >
                {copiedField === `full-${emailType}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {t.copyEmail}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {t.subjectLabel}
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
                {showLongVersion ? t.emailTextLong : t.emailText}
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
                <Label className="text-sm font-medium text-muted-foreground">{t.ctaLabel}</Label>
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
                <Label className="text-sm font-medium text-muted-foreground">{t.psLabel}</Label>
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
                {t.psLabel} {email.ps}
              </p>
            </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> {t.shortVersion}
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
          {t.back}
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
            {t.pageSubtitle}
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
              {isItalian ? "Dati del Lead" : "Lead Data"}
            </CardTitle>
            <CardDescription>
              {isItalian ? "Inserisci le informazioni per generare email personalizzate" : "Enter the information to generate personalized emails"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="leadName">{t.leadName}</Label>
              <Input
                id="leadName"
                placeholder={isItalian ? "es. Marco Rossi" : "e.g. John Smith"}
                value={formData.leadName}
                onChange={(e) => handleInputChange("leadName", e.target.value)}
                data-testid="input-lead-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentName">{t.agentName}</Label>
              <Input
                id="agentName"
                placeholder={isItalian ? "es. Anna Bianchi" : "e.g. Anna Brown"}
                value={formData.agentName}
                onChange={(e) => handleInputChange("agentName", e.target.value)}
                data-testid="input-agent-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">{t.agencyName}</Label>
              <Input
                id="agencyName"
                placeholder={isItalian ? "es. Immobiliare Milano" : "e.g. Prime Realty"}
                value={formData.agencyName}
                onChange={(e) => handleInputChange("agencyName", e.target.value)}
                data-testid="input-agency-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyTitle">{t.propertyTitle}</Label>
              <Input
                id="propertyTitle"
                placeholder={isItalian ? "es. Attico con terrazzo panoramico" : "e.g. Penthouse with panoramic terrace"}
                value={formData.propertyTitle}
                onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
                data-testid="input-property-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="propertyLocation">{t.propertyLocation}</Label>
                <Input
                  id="propertyLocation"
                  placeholder={isItalian ? "es. Milano Centro" : "e.g. Downtown Miami"}
                  value={formData.propertyLocation}
                  onChange={(e) => handleInputChange("propertyLocation", e.target.value)}
                  data-testid="input-property-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">{t.propertyPrice}</Label>
                <Input
                  id="propertyPrice"
                  placeholder={isItalian ? "es. €450.000" : "e.g. $450,000"}
                  value={formData.propertyPrice}
                  onChange={(e) => handleInputChange("propertyPrice", e.target.value)}
                  data-testid="input-property-price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasonOfInterest">{t.reasonInterest}</Label>
              <Textarea
                id="reasonOfInterest"
                placeholder={
                  isItalian
                    ? "es. Il cliente cerca un attico in zona centrale per uso abitativo, ha visitato il portale e richiesto info..."
                    : "e.g. The client is looking for a central penthouse for residential use, visited the portal and requested info..."
                }
                value={formData.reasonOfInterest}
                onChange={(e) => handleInputChange("reasonOfInterest", e.target.value)}
                rows={3}
                data-testid="input-reason-of-interest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">{t.tone}</Label>
              <Select
                value={formData.tone}
                onValueChange={(value: "professionale" | "amichevole" | "luxury") => 
                  handleInputChange("tone", value)
                }
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder={isItalian ? "Seleziona tono" : "Select tone"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professionale">{isItalian ? "Professionale" : "Professional"}</SelectItem>
                  <SelectItem value="amichevole">{isItalian ? "Amichevole" : "Friendly"}</SelectItem>
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
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.generate6}
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
                  {t.noResultTitle}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t.readyDesc}
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.generatingTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.generatingDesc}
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
                          {t.convertTip}
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
                  {emailTypes.map((type) => {
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
