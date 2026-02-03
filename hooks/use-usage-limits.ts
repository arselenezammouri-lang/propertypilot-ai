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

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/usage');
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to fetch usage');
      }

      const data = await response.json();

      setPlan(data.plan || 'free');
      setCurrentUsage(data.currentUsage || 0);
      setLimit(data.limit ?? 5);
      setHasReachedLimit(data.hasReachedLimit || false);
      setIsNearLimit(data.isNearLimit || false);
      setRemainingGenerations(data.remainingGenerations ?? 0);
      setPercentageUsed(data.percentageUsed || 0);
    } catch (err) {
      console.error('Error in useUsageLimits:', err);
      setError('Errore nel caricamento');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
