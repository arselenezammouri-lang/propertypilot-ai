"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Rocket, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';

interface AriaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  currentUsage: number;
  limit: number;
}

function getPlanUpgrades(isItalian: boolean): Record<string, { next: string; nextPlan: string; price: string; features: string[] }> {
  return {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      price: isItalian ? '€197/mese' : '€197/mo',
      features: isItalian
        ? ['50 annunci/mese', 'Tutti gli strumenti AI', 'PDF professionali']
        : ['50 listings/month', 'All AI tools', 'Professional PDFs'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      price: isItalian ? '€497/mese' : '€497/mo',
      features: isItalian
        ? ['200 annunci/mese', 'CRM completo', 'Lead Scoring AI', '20 Automazioni']
        : ['200 listings/month', 'Full CRM', 'AI Lead Scoring', '20 Automations'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      price: isItalian ? '€897/mese' : '€897/mo',
      features: isItalian
        ? ['Annunci illimitati', '10 utenti inclusi', 'Voice AI 24/7', 'Supporto prioritario']
        : ['Unlimited listings', '10 users included', 'Voice AI 24/7', 'Priority support'],
    },
  };
}

export function AriaLimitModal({ isOpen, onClose, currentPlan, currentUsage, limit }: AriaLimitModalProps) {
  const { locale } = useLocaleContext();
  const isItalian = locale === 'it';
  const upgrade = getPlanUpgrades(isItalian)[currentPlan] || getPlanUpgrades(isItalian).starter;

  const t = {
    title: isItalian ? "Capo, hai raggiunto il limite!" : "You've reached your limit!",
    desc: isItalian
      ? (used: number, lim: number, plan: string) =>
          <>Hai utilizzato <span className="font-bold text-foreground">{used}</span> dei tuoi <span className="font-bold text-foreground">{lim}</span> annunci mensili con il piano <span className="font-bold text-blue-600 capitalize">{plan}</span>.</>
      : (used: number, lim: number, plan: string) =>
          <>You've used <span className="font-bold text-foreground">{used}</span> of your <span className="font-bold text-foreground">{lim}</span> monthly listings on the <span className="font-bold text-blue-600 capitalize">{plan}</span> plan.</>,
    recommended: isItalian ? "CONSIGLIATO" : "RECOMMENDED",
    ariaQuote: (name: string) =>
      isItalian
        ? `"Passa a ${name} per continuare a dominare il mercato!" - Aria`
        : `"Upgrade to ${name} and keep dominating the market!" - Aria`,
    later: isItalian ? "Più tardi" : "Later",
    upgradeTo: (name: string) => isItalian ? `Passa a ${name}` : `Upgrade to ${name}`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {isOpen ? <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background to-blue-600/5 border-blue-600/20">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center animate-pulse">
              <Sparkles className="h-8 w-8 text-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            <span className="text-gradient-blue">{t.title}</span>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {t.desc(currentUsage, limit, currentPlan)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-xl p-6 border border-blue-600/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{upgrade.nextPlan}</h3>
                  <p className="text-sm text-muted-foreground">{upgrade.price}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-amber-400/20 text-amber-500 px-2 py-1 rounded-full font-semibold">
                  CONSIGLIATO
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {upgrade.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground italic">
              "Passa a {upgrade.nextPlan} per continuare a dominare il mercato!" - Aria
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Più tardi
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 text-foreground"
            asChild
          >
            <Link href="/pricing">
              Passa a {upgrade.nextPlan}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent> : null}
    </Dialog>
  );
}
