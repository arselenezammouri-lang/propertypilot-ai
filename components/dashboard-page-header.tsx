import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  /** e.g. "free" | "agency" — shown as a subtle plan badge */
  planBadge?: { label: string; variant?: "default" | "secondary" | "outline" };
  actions?: ReactNode;
  className?: string;
};

/**
 * Enterprise-style page chrome: context (title + value line) + optional plan badge + primary actions.
 * Use on dashboard pages for consistent hierarchy (Fase A — PLAN_SAAS_UX_ENTERPRISE.md).
 */
export function DashboardPageHeader({
  title,
  subtitle,
  planBadge,
  actions,
  className,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 md:mb-10 pb-6 border-b border-white/10",
        className
      )}
      data-testid="dashboard-page-header"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {planBadge ? (
              <Badge
                variant={planBadge.variant ?? "secondary"}
                className="uppercase text-[10px] tracking-wider border-white/15 bg-white/5 text-white/90"
              >
                {planBadge.label}
              </Badge>
            ) : null}
          </div>
          {subtitle ? (
            <p className="text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
