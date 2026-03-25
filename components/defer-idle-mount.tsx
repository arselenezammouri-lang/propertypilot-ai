"use client";

import { useEffect, useState, type ReactNode } from "react";

type DeferIdleMountProps = {
  children: ReactNode;
  /** Fallback se requestIdleCallback non è disponibile */
  delayMs?: number;
};

/**
 * Monta i figli dopo idle (o timeout) — utile per widget non critici (Fase C5).
 */
export function DeferIdleMount({ children, delayMs = 2000 }: DeferIdleMountProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };

    const fallbackTimer = window.setTimeout(done, delayMs);

    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(
        () => {
          window.clearTimeout(fallbackTimer);
          done();
        },
        { timeout: delayMs }
      );
      return () => {
        cancelled = true;
        window.clearTimeout(fallbackTimer);
        cancelIdleCallback(idleId);
      };
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [delayMs]);

  return ready ? children : null;
}
