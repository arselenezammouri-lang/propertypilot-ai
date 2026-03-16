"use client";

import { useState, useEffect, useCallback } from 'react';

export interface UsageLimits {
  currentUsage: number;
  limit: number;
  plan: string;
  isLoading: boolean;
  error: string | null;
  hasReachedLimit: boolean;
  isNearLimit: boolean;
  remainingGenerations: number;
  percentageUsed: number;
  refresh: () => Promise<void>;
}

export function useUsageLimits(): UsageLimits {
  const [currentUsage, setCurrentUsage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [plan, setPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(0);
  const [percentageUsed, setPercentageUsed] = useState(0);

  const applySafeFallback = useCallback((message: string | null) => {
    setPlan('free');
    setCurrentUsage(0);
    setLimit(5);
    setHasReachedLimit(false);
    setIsNearLimit(false);
    setRemainingGenerations(5);
    setPercentageUsed(0);
    setError(message);
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/usage');
      
      if (!response.ok) {
        if (response.status === 401) {
          applySafeFallback(null);
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to fetch usage');
      }

      const rawData = await response.json();
      const data = (rawData && typeof rawData === 'object') ? rawData as Record<string, unknown> : {};

      const safePlan = typeof data.plan === 'string' ? data.plan : 'free';
      const safeCurrentUsage = typeof data.currentUsage === 'number' && Number.isFinite(data.currentUsage)
        ? data.currentUsage
        : 0;
      const safeLimit = typeof data.limit === 'number' && Number.isFinite(data.limit)
        ? data.limit
        : 5;
      const computedRemaining = safeLimit === -1 ? -1 : Math.max(0, safeLimit - safeCurrentUsage);
      const computedHasReachedLimit = safeLimit !== -1 && safeCurrentUsage >= safeLimit;
      const computedPercentageUsed = safeLimit > 0
        ? Math.min(100, Math.max(0, Math.round((safeCurrentUsage / safeLimit) * 100)))
        : 0;

      const safeHasReachedLimit = typeof data.hasReachedLimit === 'boolean'
        ? data.hasReachedLimit
        : computedHasReachedLimit;
      const safeIsNearLimit = typeof data.isNearLimit === 'boolean'
        ? data.isNearLimit
        : (safeLimit !== -1 && computedPercentageUsed >= 80 && !safeHasReachedLimit);
      const safeRemainingGenerations = typeof data.remainingGenerations === 'number' && Number.isFinite(data.remainingGenerations)
        ? data.remainingGenerations
        : computedRemaining;
      const safePercentageUsed = typeof data.percentageUsed === 'number' && Number.isFinite(data.percentageUsed)
        ? data.percentageUsed
        : computedPercentageUsed;

      setPlan(safePlan);
      setCurrentUsage(safeCurrentUsage);
      setLimit(safeLimit);
      setHasReachedLimit(safeHasReachedLimit);
      setIsNearLimit(safeIsNearLimit);
      setRemainingGenerations(safeRemainingGenerations);
      setPercentageUsed(safePercentageUsed);
    } catch (err) {
      console.error('Error in useUsageLimits:', err);
      applySafeFallback('Errore nel caricamento');
    } finally {
      setIsLoading(false);
    }
  }, [applySafeFallback]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    currentUsage,
    limit,
    plan,
    isLoading,
    error,
    hasReachedLimit,
    isNearLimit,
    remainingGenerations,
    percentageUsed,
    refresh: fetchUsage,
  };
}
