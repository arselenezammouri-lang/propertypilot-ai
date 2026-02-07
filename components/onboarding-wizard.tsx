"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, FileText, Rocket, ArrowRight, ArrowLeft, CheckCircle, Building2, Key, PartyPopper, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface OnboardingWizardProps {
  onComplete?: () => void;
}

const ONBOARDING_STEPS = [
  {
    icon: Home,
    title: "Benvenuto in PropertyPilot AI!",
    description: "Sono Aria, la tua assistente AI. Ti guiderò nella creazione del tuo primo annuncio professionale in pochi minuti.",
    details: [
      "Genera annunci professionali con l'AI",
      "Scegli tra Vendita, Affitto o Affitto Breve",
      "Ottieni titoli, descrizioni e traduzioni automatiche"
    ],
    gradient: "from-royal-purple to-electric-blue"
  },
  {
    icon: FileText,
    title: "Crea il Tuo Primo Annuncio",
    description: "Vai alla sezione 'Genera Annuncio' e inserisci i dati dell'immobile. L'AI farà tutto il resto!",
    details: [
      "1. Scegli il tipo di transazione (Vendita/Affitto)",
      "2. Inserisci indirizzo, prezzo e caratteristiche",
      "3. Clicca 'Genera' e ricevi l'annuncio in 30 secondi"
    ],
    gradient: "from-electric-blue to-neon-aqua"
  },
  {
    icon: Rocket,
    title: "Sei Pronto a Dominare!",
    description: "Ora hai tutti gli strumenti per creare annunci professionali che convertono. Buon lavoro!",
    details: [
      "Usa i Titoli A/B per massimizzare i click",
      "Esplora gli Hashtag AI per i social",
      "Prova il PDF Generator per schede professionali"
    ],
    gradient: "from-sunset-gold to-amber-500"
  }
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (!profile?.onboarding_completed) {
        setIsOpen(true);
      }
    } catch (error) {
      // Silently fail - onboarding is not critical
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
      }
    } catch (error) {
      // Silently fail - onboarding completion is not critical
    }
    
    setIsOpen(false);
    onComplete?.();
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step: redirect to listings page for quick win
      completeOnboarding();
      router.push('/dashboard/listings?onboarding=true');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  if (isLoading) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background to-royal-purple/5 border-royal-purple/20">
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg animate-pulse`}>
              <Icon className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-gradient-to-r from-royal-purple to-electric-blue' 
                    : index < currentStep 
                      ? 'bg-neon-aqua' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <DialogTitle className="text-2xl font-bold">
            <span className="gradient-text-purple">{step.title}</span>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ul className="space-y-3">
            {step.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-silver-frost/10">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-sm">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {isLastStep && (
          <div className="flex items-center justify-center gap-2 py-2">
            <PartyPopper className="h-5 w-5 text-sunset-gold animate-bounce" />
            <span className="text-sm font-medium text-sunset-gold">
              Pronto a iniziare!
            </span>
            <PartyPopper className="h-5 w-5 text-sunset-gold animate-bounce" />
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="flex gap-2 w-full">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Indietro
              </Button>
            )}
            {currentStep === 0 && (
              <Button variant="ghost" onClick={skipOnboarding} className="flex-1 text-muted-foreground">
                Salta
              </Button>
            )}
            <Button 
              onClick={nextStep}
              className={`flex-1 bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white`}
            >
              {isLastStep ? (
                <>
                  Crea il Primo Annuncio
                  <Zap className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
