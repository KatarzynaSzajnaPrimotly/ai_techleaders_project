import * as React from "react";
import { cn } from "../../lib/utils";

export type TextareaProps = React.ComponentProps<"textarea">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full resize-y rounded-control border border-stroke-control bg-surface-panel px-related py-related text-body leading-body text-text-strong placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-control disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted aria-invalid:border-status-error",
        className,
      )}
      {...props}
    />
  );
});
