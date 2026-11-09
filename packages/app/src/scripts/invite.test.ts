import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createInvitationRepository: vi.fn(),
  createOrm: vi.fn(),
  InvitationService: vi.fn(),
  absoluteUrl: vi.fn(),
  logger: { info: vi.fn() },
}));

vi.mock("@devmentor/core", () => ({ InvitationService: mocks.InvitationService, absoluteUrl: mocks.absoluteUrl, logger: mocks.logger }));
vi.mock("@devmentor/db", () => ({ createInvitationRepository: mocks.createInvitationRepository, createOrm: mocks.createOrm }));

import { executeInviteCommand, main, parseInviteArgs } from "./invite";

const fixedDate = new Date("2026-11-09T12:00:00.000Z");
const service = { create: vi.fn(), revoke: vi.fn(), resend: vi.fn() };
const output = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  service.create.mockResolvedValue({ invitation: { id: "inv-1", email: "ada@example.com" }, token: "secret-token" });
  service.revoke.mockResolvedValue(undefined);
  service.resend.mockResolvedValue({ invitation: { id: "inv-1", email: "ada@example.com" }, token: "rotated-token" });
  mocks.absoluteUrl.mockReturnValue("https://devmentor.example/invitation/secret-token");
});

afterEach(() => vi.restoreAllMocks());

describe("parseInviteArgs", () => {
  it("parses create arguments, trimming tags and optional batch", () => {
    expect(parseInviteArgs(["create", "--email", "Ada@example.com", "--stack-tags", " TypeScript, React,", "--operator", " Founder A ", "--batch", "October"])).toEqual({
      action: "create", email: "Ada@example.com", stackTags: ["TypeScript", "React"], operator: "Founder A", batch: "October",
    });
  });

  it.each(["revoke", "resend"] as const)("parses %s arguments", (action) => {
    expect(parseInviteArgs([action, "--id", "inv-1", "--operator", "Founder A"])).toEqual({ action, id: "inv-1", operator: "Founder A" });
  });

  const invalidArgs: string[][] = [
    [], ["unknown"], ["create", "--operator", "Founder A"], ["create", "--email", "a@b.c", "--stack-tags", "", "--operator", " "],
    ["create", "--email", "a@b.c", "--stack-tags", "", "--operator", "A", "--id", "wrong"],
    ["create", "--email", "a@b.c", "--operator", "A"], ["create", "--email", "a@b.c", "--stack-tags", "", "--operator", "A", "--id", "wrong"],
    ["resend", "--id", "x", "--operator", "A", "--batch", "wrong"], ["revoke", "--id", "x", "--operator", "A", "--id", "y"],
    ["revoke", "--id", "--operator", "A"], ["other", "--operator", "A"],
  ];
  it.each(invalidArgs.map((args) => [args]))("rejects malformed args %j", (args: string[]) => {
    expect(() => parseInviteArgs(args)).toThrow();
  });
});

describe("executeInviteCommand", () => {
  const dependencies = { service, link: (token: string) => `https://example.test/invitation/${token}`, out: output, now: () => fixedDate };

  it("audits successful create and prints its link separately", async () => {
    await executeInviteCommand({ action: "create", email: "ada@example.com", stackTags: ["TypeScript"], batch: null, operator: "Founder A" }, dependencies);
    expect(service.create).toHaveBeenCalledWith({ email: "ada@example.com", stackTags: ["TypeScript"], batch: null });
    expect(output.mock.calls).toEqual([
      ["AUDIT action=create invitation=inv-1 email=ada@example.com operator=Founder A at=2026-11-09T12:00:00.000Z"],
      ["https://example.test/invitation/secret-token"],
    ]);
  });

  it("writes no audit line or link when create fails", async () => {
    service.create.mockRejectedValueOnce(new Error("duplicate"));
    await expect(executeInviteCommand({ action: "create", email: "ada@example.com", stackTags: [], batch: null, operator: "A" }, dependencies)).rejects.toThrow("duplicate");
    expect(output).not.toHaveBeenCalled();
  });

  it("audits revoke without printing a link", async () => {
    await executeInviteCommand({ action: "revoke", id: "inv-1", operator: "Founder A" }, dependencies);
    expect(output).toHaveBeenCalledExactlyOnceWith("AUDIT action=revoke invitation=inv-1 operator=Founder A at=2026-11-09T12:00:00.000Z");
  });

  it("audits resend and prints the rotated link", async () => {
    await executeInviteCommand({ action: "resend", id: "inv-1", operator: "Founder A" }, dependencies);
    expect(output.mock.calls).toEqual([
      ["AUDIT action=resend invitation=inv-1 email=ada@example.com operator=Founder A at=2026-11-09T12:00:00.000Z"],
      ["https://example.test/invitation/rotated-token"],
    ]);
  });
});

describe("main", () => {
  it("wires the service to the database and closes the ORM", async () => {
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const orm = { em: { fork: vi.fn(() => "entity-manager") }, close: vi.fn() };
    const instance = { create: vi.fn().mockResolvedValue({ invitation: { id: "inv-2", email: "ada@example.com" }, token: "one-time" }) };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createInvitationRepository.mockReturnValue("repository");
    mocks.InvitationService.mockImplementation(function () { return instance; });
    mocks.absoluteUrl.mockReturnValue("https://devmentor.example/invitation/one-time");
    await main(["create", "--email", "ada@example.com", "--stack-tags", "React", "--operator", "Founder A"]);
    expect(mocks.createInvitationRepository).toHaveBeenCalledWith("entity-manager");
    expect(mocks.InvitationService).toHaveBeenCalledWith(expect.objectContaining({ invitationRepository: "repository", invitationEvents: expect.any(Object) }));
    const options = mocks.InvitationService.mock.calls[0][0];
    await options.invitationEvents.publishInvitationAccepted({ invitationId: "inv-2", userId: "user-1", publishDueAt: fixedDate, type: "invitations.invitation.accepted" });
    expect(mocks.logger.info).toHaveBeenCalledWith({ invitationId: "inv-2", userId: "user-1", publishDueAt: fixedDate }, "invitations.invitation.accepted");
    expect(mocks.absoluteUrl).toHaveBeenCalledWith("/invitation/one-time");
    expect(write).toHaveBeenCalledWith("https://devmentor.example/invitation/one-time\n");
    expect(orm.close).toHaveBeenCalledOnce();
  });

  it("closes an initialized ORM if a command fails", async () => {
    const orm = { em: { fork: vi.fn() }, close: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createInvitationRepository.mockReturnValue("repository");
    mocks.InvitationService.mockImplementation(function () { return { create: vi.fn().mockRejectedValue(new Error("db failure")) }; });
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const exit = Object.getOwnPropertyDescriptor(process, "exitCode");
    await expect(main(["create", "--email", "ada@example.com", "--stack-tags", "React", "--operator", "Founder A"])).rejects.toThrow("db failure");
    expect(orm.close).toHaveBeenCalledOnce();
    if (exit) Object.defineProperty(process, "exitCode", exit);
    error.mockRestore();
  });

  it("skips ORM closing when argument parsing fails before connection", async () => {
    await expect(main(["unknown"])).rejects.toThrow();
    expect(mocks.createOrm).not.toHaveBeenCalled();
  });
});
