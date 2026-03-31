"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { PropertyPilotLogo } from "@/components/logo";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";
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
  const { locale, currency, setLocale, setCurrency } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);
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
      newErrors.name = t.contact?.validation?.nameMin ?? "Name must be at least 2 characters";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t.contact?.validation?.emailInvalid ?? "Enter a valid email";
    }
    
    if (formData.message.length < 10) {
      newErrors.message = t.contact?.validation?.messageMin ?? "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: t.contact?.toast?.validationTitle ?? "Validation error",
        description: t.contact?.validation?.checkFields ?? "Check the highlighted fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale === 'en' ? 'en' : 'it',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: t.contact?.toast?.successTitle ?? "Message sent!",
          description: t.contact?.toast?.successDesc ?? "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast({
          title: t.contact?.toast?.errorTitle ?? "Error",
          description: data.error || (t.contact?.toast?.errorDesc ?? "Unable to send message. Please try again."),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t.contact?.toast?.errorTitle ?? "Error",
        description: t.contact?.toast?.errorDesc ?? "Unable to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
              <PropertyPilotLogo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-gradient-blue">PropertyPilot AI</h1>
                <p className="text-xs text-muted-foreground">Pilot Your Agency to the Next Level</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-2 md:space-x-4">
              <LocaleCurrencySelector currentLocale={locale} currentCurrency={currency} onLocaleChange={setLocale} onCurrencyChange={setCurrency} />
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" size="sm" className="border-blue-600/30 hover:border-blue-600 hover:bg-blue-600/10 transition-all" data-testid="button-back-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.contact?.home ?? 'Home'}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up" data-testid="text-page-title">
            <span className="text-gradient-blue">{t.contact?.title ?? 'Contact Us'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-100">
            {t.contact?.subtitle ?? "We're here to help. Contact our team for any questions."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8 animate-fade-in-up delay-200">
            <div className="pp-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HeadphonesIcon className="h-7 w-7 text-blue-600" />
                {t.contact?.support?.title ?? 'Customer Support'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.contact?.support?.desc ?? 'Need technical assistance or questions about your account? Our support team is ready to help.'}
              </p>
              <a 
                href="mailto:support@propertypilotai.com" 
                className="flex items-center gap-3 text-lg text-blue-600 hover:text-blue-500 transition-colors font-medium group"
                data-testid="link-support-email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                support@propertypilotai.com
              </a>
            </div>

            <div className="pp-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building2 className="h-7 w-7 text-blue-500" />
                {t.contact?.sales?.title ?? 'Sales Enquiries'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.contact?.sales?.desc ?? 'Interested in Business or Enterprise plans? Let\'s discuss your business needs.'}
              </p>
              <a 
                href="mailto:sales@propertypilotai.com" 
                className="flex items-center gap-3 text-lg text-blue-500 hover:text-blue-600 transition-colors font-medium group"
                data-testid="link-sales-email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                sales@propertypilotai.com
              </a>
            </div>

            <div className="pp-card p-8 border-2 border-amber-200 bg-gradient-to-br from-amber-400/5 to-blue-600/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="h-7 w-7 text-amber-500" />
                {t.contact?.demo?.title ?? 'Want a Demo?'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.contact?.demo?.desc ?? 'Discover how PropertyPilot AI can transform your real estate business. Book a free demo with our team.'}
              </p>
              <a href="mailto:sales@propertypilotai.com?subject=Richiesta Demo PropertyPilot AI">
                <Button className="neon-button w-full group" data-testid="button-request-demo">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t.contact?.demo?.cta ?? 'Book Free Demo'}
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
            <div className="pp-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-emerald-500" />
                {t.contact?.form?.title ?? 'Send Us a Message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact?.form?.name ?? 'Name'} *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.contact?.form?.namePlaceholder ?? 'Your name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={2}
                    className={`border-border focus:border-blue-600 ${errors.name ? 'border-red-500' : ''}`}
                    data-testid="input-name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.contact?.form?.email ?? 'Email'} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.contact?.form?.emailPlaceholder ?? 'your@email.com'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={`border-border focus:border-blue-600 ${errors.email ? 'border-red-500' : ''}`}
                    data-testid="input-email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t.contact?.form?.subject ?? 'Subject'}</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={t.contact?.form?.subjectPlaceholder ?? 'Message subject'}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="border-border focus:border-blue-600"
                    data-testid="input-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t.contact?.form?.message ?? 'Message'} *</Label>
                  <Textarea
                    id="message"
                    placeholder={t.contact?.form?.messagePlaceholder ?? 'Write your message here...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    minLength={10}
                    rows={5}
                    className={`border-border focus:border-blue-600 resize-none ${errors.message ? 'border-red-500' : ''}`}
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
                      {t.contact?.form?.submit ?? 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-foreground/5 dark:bg-foreground/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 PropertyPilot AI. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
