"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface OnboardingTooltipProps {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onComplete?: () => void;
  step?: number;
  totalSteps?: number;
}

export function OnboardingTooltip({
  targetId,
  title,
  description,
  position = 'bottom',
  onComplete,
  step = 1,
  totalSteps = 1,
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    checkTooltipStatus();
    positionTooltip();
    
    const handleResize = () => positionTooltip();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  const checkTooltipStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: tooltip } = await supabase
        .from('user_onboarding_progress')
        .select('completed_tooltips')
        .eq('user_id', user.id)
        .single();

      const completed = tooltip?.completed_tooltips || [];
      if (completed.includes(targetId)) {
        setIsCompleted(true);
        return;
      }

      // Show tooltip after a short delay
      setTimeout(() => setIsVisible(true), 500);
    } catch (error) {
      // Silently fail
    }
  };

  const positionTooltip = () => {
    const target = document.getElementById(targetId);
    const tooltip = tooltipRef.current;
    
    if (!target || !tooltip) return;

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 10;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + 10;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + scrollX - tooltipRect.width - 10;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollX + 10;
        break;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const markAsCompleted = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: existing } = await supabase
          .from('user_onboarding_progress')
          .select('completed_tooltips')
          .eq('user_id', user.id)
          .single();

        const completed = existing?.completed_tooltips || [];
        if (!completed.includes(targetId)) {
          await supabase
            .from('user_onboarding_progress')
            .upsert({
              user_id: user.id,
              completed_tooltips: [...completed, targetId],
              updated_at: new Date().toISOString(),
            });
        }
      }
    } catch (error) {
      // Silently fail
    }

    setIsCompleted(true);
    setIsVisible(false);
    onComplete?.();
  };

  if (isCompleted || !isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] w-80 bg-gradient-to-br from-royal-purple/95 to-electric-blue/95 backdrop-blur-sm border-2 border-royal-purple/50 rounded-xl shadow-2xl p-4 animate-fade-in"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-aqua" />
          <h3 className="font-bold text-white text-sm">{title}</h3>
        </div>
        <button
          onClick={markAsCompleted}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-white/90 text-sm mb-4 leading-relaxed">{description}</p>
      
      {totalSteps > 1 && (
        <div className="flex items-center gap-2 mb-3 text-xs text-white/70">
          <span>Passo {step} di {totalSteps}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={markAsCompleted}
          size="sm"
          className="flex-1 bg-neon-aqua hover:bg-neon-aqua/80 text-black font-semibold"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Capito!
        </Button>
      </div>
    </div>
  );
}
