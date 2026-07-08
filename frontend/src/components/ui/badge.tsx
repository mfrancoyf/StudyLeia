import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-700",
        accent: "bg-accent-500/15 text-accent-500",
        success: "bg-success-500/15 text-success-500",
        warning: "bg-warning-500/15 text-warning-500",
        danger: "bg-danger-500/15 text-danger-500",
        xp: "bg-xp-500/15 text-amber-600",
        outline: "border border-slate-200 text-slate-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
