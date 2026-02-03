"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Rocket, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AriaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  currentUsage: number;
  limit: number;
}

const PLAN_UPGRADES: Record<string, { next: string; nextPlan: string; price: string; features: string[] }> = {
  free: {
    next: 'starter',
    nextPlan: 'Starter',
    price: '€197/mese',
    features: ['50 annunci/mese', 'Tutti gli strumenti AI', 'PDF professionali'],
  },
  starter: {
    next: 'pro',
    nextPlan: 'Pro',
    price: '€497/mese',
    features: ['200 annunci/mese', 'CRM completo', 'Lead Scoring AI', '20 Automazioni'],
  },
  pro: {
    next: 'agency',
    nextPlan: 'Agency',
    price: '€897/mese',
    features: ['Annunci illimitati', '10 utenti inclusi', 'Voice AI 24/7', 'Supporto prioritario'],
  },
};

export function AriaLimitModal({ isOpen, onClose, currentPlan, currentUsage, limit }: AriaLimitModalProps) {
  const upgrade = PLAN_UPGRADES[currentPlan] || PLAN_UPGRADES.starter;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background to-royal-purple/5 border-royal-purple/20">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-royal-purple/20 to-electric-blue/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-purple to-electric-blue flex items-center justify-center animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            <span className="gradient-text-purple">Capo, hai raggiunto il limite!</span>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Hai utilizzato <span className="font-bold text-foreground">{currentUsage}</span> dei tuoi <span className="font-bold text-foreground">{limit}</span> annunci mensili con il piano <span className="font-bold text-royal-purple capitalize">{currentPlan}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gradient-to-r from-royal-purple/10 to-electric-blue/10 rounded-xl p-6 border border-royal-purple/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sunset-gold to-amber-500 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{upgrade.nextPlan}</h3>
                  <p className="text-sm text-muted-foreground">{upgrade.price}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-sunset-gold/20 text-sunset-gold px-2 py-1 rounded-full font-semibold">
                  CONSIGLIATO
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {upgrade.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-neon-aqua flex-shrink-0" />
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
            className="flex-1 bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 text-white"
            asChild
          >
            <Link href="/pricing">
              Passa a {upgrade.nextPlan}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
