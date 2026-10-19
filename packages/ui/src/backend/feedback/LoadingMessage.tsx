export function LoadingMessage({ message = "Loading…" }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
