"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DeferredMountProps = {
  children: ReactNode;
  /** Altezza minima del placeholder per ridurre layout shift */
  minHeight?: string;
  className?: string;
  /** Margine root per IntersectionObserver (prefetch prima del viewport) */
  rootMargin?: string;
  /** Etichetta accessibile mentre il contenuto non è montato */
  loadingLabel?: string;
};

/**
 * Monta i figli solo quando la sezione è vicina al viewport (Fase C5).
 * Utile con `next/dynamic`: il chunk JS parte solo on-demand, migliorando TTI percepito.
 */
export function DeferredMount({
  children,
  minHeight = "200px",
  className,
  rootMargin = "400px 0px",
  loadingLabel = "Loading section",
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setVisible(true);
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={cn(className)}>
      {visible ? (
        children
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] animate-pulse"
          style={{ minHeight }}
          aria-busy="true"
          aria-label={loadingLabel}
        />
      )}
    </div>
  );
}
