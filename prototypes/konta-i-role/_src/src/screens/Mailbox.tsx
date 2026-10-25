import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from "@devmentor/ui";
import { Alert } from "../gaps";
import { useStore, visit } from "../store";

// s10: a stand-in for the recipient's mailbox. In production the adapter only logs messages (G11, Q26).
export function Mailbox() {
  const mailbox = useStore((state) => state.mailbox);
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-4 py-12">
      <h1 className="text-xl font-semibold tracking-tight">Mailbox</h1>
      <Alert tone="info">Simulation of an external mailbox. No real e-mail is sent or read.</Alert>
      {mailbox.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState title="No messages." />
          </CardContent>
        </Card>
      ) : (
        mailbox.map((mail) => (
          <Card key={mail.id}>
            <CardHeader>
              <CardTitle>{mail.subject}</CardTitle>
              <CardDescription>To {mail.to}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{mail.body}</p>
              {mail.link ? (
                <Button onClick={() => visit("s04")}>{mail.link.label}</Button>
              ) : null}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
