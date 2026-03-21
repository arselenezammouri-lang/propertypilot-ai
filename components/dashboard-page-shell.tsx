import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DashboardPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Default: max-w-7xl + responsive horizontal padding + vertical rhythm */
  as?: "div" | "section";
};

/**
 * Consistent content width and spacing for all dashboard tool pages (Fase A2).
 */
export function DashboardPageShell({
  children,
  className,
  as: Tag = "div",
}: DashboardPageShellProps) {
  return (
    <Tag
      className={cn(
        "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8",
        className
      )}
    >
      {children}
    </Tag>
  );
}
