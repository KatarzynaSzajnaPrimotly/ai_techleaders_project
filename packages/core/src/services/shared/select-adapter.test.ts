import { describe, expect, it } from "vitest";
import { ServiceUnavailableError } from "../../http/errors";
import { selectAdapter } from "./select-adapter";

describe("selectAdapter", () => {
  const logAdapter = { send: async () => undefined };

  it("returns the explicitly selected adapter", () => {
    expect(selectAdapter("MAILER_TRANSPORT", { log: logAdapter }, "log")).toBe(logAdapter);
  });

  it.each([undefined, "", "  "])("fails closed when the selector %s is unset", (value) => {
    expect(() => selectAdapter("MAILER_TRANSPORT", { log: logAdapter }, value)).toThrowError(
      expect.objectContaining({ name: "ServiceUnavailableError", status: 503, message: "Required adapter configuration is missing: MAILER_TRANSPORT" }),
    );
  });

  it("fails closed when a selector has no matching adapter", () => {
    expect(() => selectAdapter("MAILER_TRANSPORT", { log: logAdapter }, "smtp")).toThrowError(
      expect.objectContaining({ name: "ServiceUnavailableError", status: 503, message: "No adapter is registered for MAILER_TRANSPORT: smtp" }),
    );
  });

  it("does not treat inherited object properties as registered adapters", () => {
    expect(() => selectAdapter("MAILER_TRANSPORT", {}, "toString")).toThrowError(ServiceUnavailableError);
  });
});
