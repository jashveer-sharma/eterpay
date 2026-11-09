import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "forest" | "neutral";
}

export function Badge({ children, variant = "neutral", className, ...props }: BadgeProps) {
  const variants = {
    success: "badge badge-success",
    warning: "badge badge-warning",
    error: "badge badge-error",
    forest: "badge badge-forest",
    neutral: "badge badge-neutral",
  };
  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
