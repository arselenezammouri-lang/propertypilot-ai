"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  icon?: ReactNode;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
  size?: "sm" | "md" | "lg";
  gradient?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actions = [],
  className,
  size = "md",
  gradient,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-10",
    md: "py-16",
    lg: "py-24",
  };

  const iconSizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl mb-5",
            iconSizeClasses[size],
            gradient
              ? `bg-gradient-to-br ${gradient}`
              : "bg-white/[0.05] border border-border"
          )}
        >
          <span className={cn(
            "text-muted-foreground",
            size === "sm" && "[&>svg]:h-6 [&>svg]:w-6",
            size === "md" && "[&>svg]:h-8 [&>svg]:w-8",
            size === "lg" && "[&>svg]:h-10 [&>svg]:w-10",
          )}>
            {icon}
          </span>
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-foreground mb-2",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-sm mb-6",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {description}
        </p>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actions.map((action, i) =>
            action.href ? (
              <Link key={i} href={action.href}>
                <Button variant={action.variant ?? (i === 0 ? "default" : "outline")} size="sm">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button
                key={i}
                variant={action.variant ?? (i === 0 ? "default" : "outline")}
                size="sm"
                onClick={action.onClick}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
