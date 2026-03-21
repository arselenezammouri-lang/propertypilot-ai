import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DashboardPageHeaderProps = {
  title: string;
  /** e.g. for E2E — applied to the H1 */
  titleDataTestId?: string;
  subtitle?: string;
  /** e.g. "free" | "agency" — shown as a subtle plan badge */
  planBadge?: { label: string; variant?: "default" | "secondary" | "outline" };
  actions?: ReactNode;
  className?: string;
  /**
   * `dark` = testo chiaro su shell dashboard (#050505).
   * `light` = titoli su sfondi chiari (es. alcune pagine legacy).
   */
  variant?: "dark" | "light";
};

/**
 * Enterprise-style page chrome: context (title + value line) + optional plan badge + primary actions.
 * Use on dashboard pages for consistent hierarchy (Fase A — PLAN_SAAS_UX_ENTERPRISE.md).
 */
export function DashboardPageHeader({
  title,
  titleDataTestId,
  subtitle,
  planBadge,
  actions,
  className,
  variant = "dark",
}: DashboardPageHeaderProps) {
  const isLight = variant === "light";
  return (
    <header
      className={cn(
        "mb-8 md:mb-10 pb-6 border-b",
        isLight ? "border-amber-200/60 dark:border-white/10" : "border-white/10",
        className
      )}
      data-testid="dashboard-page-header"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                isLight
                  ? "text-foreground"
                  : "text-white"
              )}
              data-testid={titleDataTestId}
            >
              {title}
            </h1>
            {planBadge ? (
              <Badge
                variant={planBadge.variant ?? "secondary"}
                className={cn(
                  "uppercase text-[10px] tracking-wider",
                  isLight
                    ? "border-amber-300/50 bg-amber-500/10 text-amber-900 dark:text-amber-100"
                    : "border-white/15 bg-white/5 text-white/90"
                )}
              >
                {planBadge.label}
              </Badge>
            ) : null}
          </div>
          {subtitle ? (
            <p
              className={cn(
                "text-sm sm:text-base max-w-2xl leading-relaxed",
                isLight
                  ? "text-muted-foreground"
                  : "text-white/65"
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:justify-end [&_button]:min-h-11 [&_button]:touch-manipulation">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
