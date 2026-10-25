import { Button } from "@devmentor/ui";
import { Alert, AuthCard } from "../gaps";
import { useStore } from "../store";

// s03: the same text for every address (37-K6). The mailbox button is a prototype aid, not part of the product.
export function CheckInbox() {
  const email = useStore((state) => state.draft.email);
  return (
    <AuthCard title="Check your e-mail" description={email ? `We sent a message to ${email}.` : "We sent you a message."}>
      <p className="text-sm">Open the link in the message to continue.</p>
      <p className="text-sm text-muted-foreground">
        Didn&apos;t get it?{" "}
        <a href="/register" data-goto="s02" className="text-foreground underline underline-offset-4">
          Register again.
        </a>
      </p>
      <Alert tone="info" className="space-y-2">
        <p>Prototype: no e-mail is sent. The message is in the simulated mailbox.</p>
        <Button asChild variant="outline" size="sm">
          <a href="#s10" data-goto="s10">
            Open the simulated mailbox
          </a>
        </Button>
      </Alert>
    </AuthCard>
  );
}
