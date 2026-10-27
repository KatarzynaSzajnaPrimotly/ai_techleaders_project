import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center rounded-control border border-transparent px-group py-1 text-meta font-medium leading-compact",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-action-label",
        secondary: "bg-surface-subtle text-text-strong",
        outline: "border-stroke-control text-text-strong",
        success: "bg-surface-subtle text-status-success",
        warning: "bg-surface-subtle text-status-warning",
        error: "bg-surface-subtle text-status-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
