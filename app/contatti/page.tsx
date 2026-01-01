"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Mail, 
  MessageSquare, 
  Send,
  Phone,
  MapPin,
  ArrowLeft,
  Sparkles,
  Calendar,
  HeadphonesIcon,
  Building2
} from "lucide-react";
import { SiWhatsapp, SiLinkedin, SiX } from "react-icons/si";

export default function ContattiPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<{name?: string; email?: string; message?: string}>({});

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; message?: string} = {};
    
    if (formData.name.length < 2) {
      newErrors.name = "Il nome deve avere almeno 2 caratteri";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Inserisci un'email valida";
    }
    
    if (formData.message.length < 10) {
      newErrors.message = "Il messaggio deve avere almeno 10 caratteri";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Errore di validazione",
        description: "Controlla i campi evidenziati.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Messaggio inviato!",
          description: "Ti risponderemo entro 24 ore.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast({
          title: "Errore",
          description: data.error || "Impossibile inviare il messaggio. Riprova più tardi.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare il messaggio. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-silver-frost/30 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow-purple">
                <img src="/logo.png" alt="PropertyPilot AI" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-purple">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" size="sm" className="border-royal-purple/30 hover:border-royal-purple hover:bg-royal-purple/10 transition-all" data-testid="button-back-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up" data-testid="text-page-title">
            <span className="gradient-text-purple">Contattaci</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-100">
            Siamo qui per aiutarti. Contatta il nostro team per qualsiasi domanda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8 animate-fade-in-up delay-200">
            <div className="futuristic-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HeadphonesIcon className="h-7 w-7 text-royal-purple" />
                Supporto Clienti
              </h2>
              <p className="text-muted-foreground mb-4">
                Hai bisogno di assistenza tecnica o domande sul tuo account? Il nostro team di supporto è pronto ad aiutarti.
              </p>
              <a 
                href="mailto:support@propertypilotai.com" 
                className="flex items-center gap-3 text-lg text-royal-purple hover:text-electric-blue transition-colors font-medium group"
                data-testid="link-support-email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                support@propertypilotai.com
              </a>
            </div>

            <div className="futuristic-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building2 className="h-7 w-7 text-electric-blue" />
                Richieste Commerciali
              </h2>
              <p className="text-muted-foreground mb-4">
                Interessato ai piani Business o Enterprise? Parliamo delle tue esigenze aziendali.
              </p>
              <a 
                href="mailto:sales@propertypilotai.com" 
                className="flex items-center gap-3 text-lg text-electric-blue hover:text-royal-purple transition-colors font-medium group"
                data-testid="link-sales-email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                sales@propertypilotai.com
              </a>
            </div>

            <div className="futuristic-card p-8 border-2 border-sunset-gold/30 bg-gradient-to-br from-sunset-gold/5 to-royal-purple/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="h-7 w-7 text-sunset-gold" />
                Vuoi una Demo?
              </h2>
              <p className="text-muted-foreground mb-6">
                Scopri come PropertyPilot AI può trasformare il tuo business immobiliare. Prenota una demo gratuita con il nostro team.
              </p>
              <a href="mailto:sales@propertypilotai.com?subject=Richiesta Demo PropertyPilot AI">
                <Button className="neon-button w-full group" data-testid="button-request-demo">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Prenota Demo Gratuita
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <a 
                href="https://wa.me/393331234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all group"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://linkedin.com/company/propertypilotai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all group"
                data-testid="link-linkedin"
              >
                <SiLinkedin className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://twitter.com/propertypilotai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all group"
                data-testid="link-twitter"
              >
                <SiX className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div className="animate-fade-in-up delay-300">
            <div className="futuristic-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-neon-aqua" />
                Inviaci un Messaggio
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Il tuo nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={2}
                    className={`border-silver-frost/30 focus:border-royal-purple ${errors.name ? 'border-red-500' : ''}`}
                    data-testid="input-name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="la.tua@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={`border-silver-frost/30 focus:border-royal-purple ${errors.email ? 'border-red-500' : ''}`}
                    data-testid="input-email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Di cosa hai bisogno?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="border-silver-frost/30 focus:border-royal-purple"
                    data-testid="input-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio * <span className="text-xs text-muted-foreground">(minimo 10 caratteri)</span></Label>
                  <Textarea
                    id="message"
                    placeholder="Scrivi il tuo messaggio..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    minLength={10}
                    rows={5}
                    className={`border-silver-frost/30 focus:border-royal-purple resize-none ${errors.message ? 'border-red-500' : ''}`}
                    data-testid="input-message"
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground text-right">{formData.message.length}/10 caratteri minimi</p>
                </div>

                <Button 
                  type="submit" 
                  className="neon-button w-full group" 
                  disabled={isSubmitting}
                  data-testid="button-submit-contact"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Invia Messaggio
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-silver-frost/30 bg-luxury-indigo/5 dark:bg-luxury-indigo/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 PropertyPilot AI. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
