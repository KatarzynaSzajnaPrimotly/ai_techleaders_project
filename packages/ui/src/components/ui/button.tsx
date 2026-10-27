import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-control border border-transparent px-4 py-2 text-label font-medium leading-compact transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-control disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-action-label hover:brightness-95",
        secondary: "bg-surface-subtle text-text-strong hover:brightness-95",
        outline: "border-stroke-control bg-transparent text-text-strong hover:bg-surface-subtle",
        ghost: "text-text-strong hover:bg-surface-subtle",
        destructive: "bg-status-error text-action-label hover:brightness-95",
      },
      size: {
        default: "min-h-10 px-4",
        sm: "min-h-8 px-3 text-meta",
        lg: "min-h-12 px-6 text-body",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
