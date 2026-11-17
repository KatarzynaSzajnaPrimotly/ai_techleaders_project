import { absoluteUrl, InvitationService, logger, type InvitationEventPublisherPort } from "@devmentor/core";
import { createInvitationRepository, createOrm } from "@devmentor/db";

type InviteCommand =
  | { action: "create"; operator: string; email: string; stackTags: string[]; batch: string | null }
  | { action: "revoke" | "resend"; operator: string; id: string };

export function parseInviteArgs(args: string[]): InviteCommand {
  const [action, ...rest] = args;
  const values = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith("--") || values.has(key) || !rest[index + 1] || rest[index + 1].startsWith("--")) {
      throw new Error("Usage: invite <create --email EMAIL --stack-tags TAG,... | revoke --id ID | resend --id ID> --operator LABEL [--batch NAME]");
    }
    values.set(key, rest[index + 1]);
    index += 1;
  }
  const operator = values.get("--operator")?.trim();
  if (!operator) throw new Error("--operator LABEL is required for the audit log");
  if (action === "create") {
    const email = values.get("--email");
    const rawTags = values.get("--stack-tags");
    if (!email || rawTags === undefined || [...values.keys()].some((key) => !["--email", "--stack-tags", "--operator", "--batch"].includes(key))) {
      throw new Error("Usage: invite create --email EMAIL --stack-tags TAG,... --operator LABEL [--batch NAME]");
    }
    return { action, operator, email, stackTags: rawTags.split(",").map((tag) => tag.trim()).filter(Boolean), batch: values.get("--batch") ?? null };
  }
  if (action === "revoke" || action === "resend") {
    const id = values.get("--id");
    if (!id || [...values.keys()].some((key) => !["--id", "--operator"].includes(key))) {
      throw new Error(`Usage: invite ${action} --id ID --operator LABEL`);
    }
    return { action, operator, id };
  }
  throw new Error("Usage: invite <create --email EMAIL --stack-tags TAG,... | revoke --id ID | resend --id ID> --operator LABEL [--batch NAME]");
}

interface InviteServicePort {
  create(input: { email: string; stackTags: string[]; batch?: string | null }): Promise<{ invitation: { id: string; email: string }; token: string }>;
  revoke(id: string): Promise<void>;
  resend(id: string): Promise<{ invitation: { id: string; email: string }; token: string }>;
}

export async function executeInviteCommand(
  command: InviteCommand,
  dependencies: { service: InviteServicePort; link: (token: string) => string; out: (line: string) => void; now: () => Date },
): Promise<void> {
  if (command.action === "create") {
    const result = await dependencies.service.create({ email: command.email, stackTags: command.stackTags, batch: command.batch });
    dependencies.out(`AUDIT action=create invitation=${result.invitation.id} email=${result.invitation.email} operator=${command.operator} at=${dependencies.now().toISOString()}`);
    dependencies.out(dependencies.link(result.token));
    return;
  }
  if (command.action === "revoke") {
    await dependencies.service.revoke(command.id);
    dependencies.out(`AUDIT action=revoke invitation=${command.id} operator=${command.operator} at=${dependencies.now().toISOString()}`);
    return;
  }
  const result = await dependencies.service.resend(command.id);
  dependencies.out(`AUDIT action=resend invitation=${result.invitation.id} email=${result.invitation.email} operator=${command.operator} at=${dependencies.now().toISOString()}`);
  dependencies.out(dependencies.link(result.token));
}

export async function main(args = process.argv.slice(2)): Promise<void> {
  let orm: Awaited<ReturnType<typeof createOrm>> | undefined;
  try {
    const command = parseInviteArgs(args);
    // Validate link configuration before creating or rotating a single-use token.
    if (command.action === "create" || command.action === "resend") absoluteUrl("/");
    orm = await createOrm();
    const service = new InvitationService({
      invitationRepository: createInvitationRepository(orm.em.fork()),
      invitationEvents: {
        async publishInvitationAccepted(event) {
          logger.info({ invitationId: event.invitationId, userId: event.userId, publishDueAt: event.publishDueAt }, event.type);
        },
      } satisfies InvitationEventPublisherPort,
    });
    await executeInviteCommand(command, {
      service,
      link: (token) => absoluteUrl(`/invitation/${encodeURIComponent(token)}`),
      out: (line) => process.stdout.write(`${line}\n`),
      now: () => new Date(),
    });
  } finally {
    await orm?.close();
  }
}
