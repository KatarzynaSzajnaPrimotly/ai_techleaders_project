import { logger } from "../../../logger";
import type { MailerPort } from "../mailer.port";

const CREDENTIAL_PARAMETER = /([?&#](?:[a-z0-9_-]*(?:token|secret|password|authorization|auth|code|state|api[_-]?key|signature|sig|jwt|key))=)[^&#\s]*/gi;

function redactCredentialParameters(text: string): string {
  return text.replace(CREDENTIAL_PARAMETER, "$1[REDACTED]");
}

/** Explicit development/test transport. Credential values in links are redacted before logging. */
export function createLogMailerAdapter(): MailerPort {
  return {
    async send(message) {
      const text = process.env.NODE_ENV === "development"
        ? message.text
        : redactCredentialParameters(message.text);
      logger.info({ mail: { ...message, text } }, "Outgoing e-mail (log transport)");
    },
  };
}
