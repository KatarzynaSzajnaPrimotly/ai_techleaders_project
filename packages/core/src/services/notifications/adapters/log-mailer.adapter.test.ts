import { afterEach, describe, expect, it, vi } from "vitest";

const log = vi.hoisted(() => ({ info: vi.fn() }));
vi.mock("../../../logger", () => ({ logger: log }));

import { createLogMailerAdapter } from "./log-mailer.adapter";

afterEach(() => log.info.mockReset());

describe("createLogMailerAdapter", () => {
  it("logs useful e-mail content while redacting bearer values in message links", async () => {
    const adapter = createLogMailerAdapter();
    const message = {
      to: "ada@example.test",
      subject: "Confirm",
      text: "Open https://example.test/register/confirm?token=BearerSecret&returnTo=%2Fhome or https://example.test/login?code=oauth-code and https://example.test/confirm?registrationToken=NewBearer&api_key=KeySecret",
    };
    await expect(adapter.send(message)).resolves.toBeUndefined();
    expect(log.info).toHaveBeenCalledWith({
      mail: {
        ...message,
        text: "Open https://example.test/register/confirm?token=[REDACTED]&returnTo=%2Fhome or https://example.test/login?code=[REDACTED] and https://example.test/confirm?registrationToken=[REDACTED]&api_key=[REDACTED]",
      },
    }, "Outgoing e-mail (log transport)");
    expect(JSON.stringify(log.info.mock.calls)).not.toContain("BearerSecret");
    expect(JSON.stringify(log.info.mock.calls)).not.toContain("oauth-code");
    expect(JSON.stringify(log.info.mock.calls)).not.toContain("NewBearer");
    expect(JSON.stringify(log.info.mock.calls)).not.toContain("KeySecret");
  });
});
