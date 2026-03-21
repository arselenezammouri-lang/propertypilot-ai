import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DashboardPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Default: max-w-7xl + responsive horizontal padding + vertical rhythm */
  as?: "div" | "section";
};

/**
 * Vertical rhythm for tool pages. Horizontal padding lives in `app/dashboard/layout.tsx`
 * next to the sidebar (Fase A5) — avoid double horizontal padding here.
 */
export function DashboardPageShell({
  children,
  className,
  as: Tag = "div",
}: DashboardPageShellProps) {
  return (
    <Tag className={cn("w-full py-6 md:py-8", className)}>
      {children}
    </Tag>
  );
}
