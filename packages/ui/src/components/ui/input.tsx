import * as React from "react";
import { cn } from "../../lib/utils";

export type InputProps = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "min-h-10 w-full rounded-control border border-stroke-control bg-surface-panel px-related py-group text-body leading-body text-text-strong placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-control disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted aria-invalid:border-status-error",
        className,
      )}
      {...props}
    />
  );
});
