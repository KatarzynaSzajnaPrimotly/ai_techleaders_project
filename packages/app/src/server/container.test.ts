import { beforeEach, describe, expect, it, vi } from "vitest";
import { MentorService } from "@devmentor/core";

const mocks = vi.hoisted(() => ({ createOrm: vi.fn(), createMentorRepository: vi.fn() }));

vi.mock("@devmentor/db", () => ({
  createOrm: mocks.createOrm,
  createMentorRepository: mocks.createMentorRepository,
}));

import { createRequestScope } from "./container";

const globalForContainer = globalThis as unknown as { devmentorContainer?: unknown };

function createFakeOrm() {
  const fork = vi.fn(() => ({ forked: true }));
  return { orm: { em: { fork } }, fork };
}

beforeEach(() => {
  delete globalForContainer.devmentorContainer;
  mocks.createOrm.mockReset();
  mocks.createMentorRepository.mockReset();
});

describe("createRequestScope", () => {
  it("builds the root container once and reuses it for later scopes", async () => {
    const { orm } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);

    const first = await createRequestScope();
    const second = await createRequestScope();

    expect(mocks.createOrm).toHaveBeenCalledTimes(1);
    expect(first).not.toBe(second);
    expect(first.cradle.orm).toBe(orm);
    expect(second.cradle.orm).toBe(orm);
  });

  it("resolves a fresh entity manager fork per scope", async () => {
    const { orm, fork } = createFakeOrm();
    mocks.createOrm.mockResolvedValue(orm);

    const scope = await createRequestScope();
    const em = scope.cradle.em;

    expect(em).toEqual({ forked: true });
    expect(scope.cradle.em).toBe(em);
    await createRequestScope().then((other) => other.cradle.em);
    expect(fork).toHaveBeenCalledTimes(2);
  });

  it("wires the repository to the scoped entity manager and the service to the repository", async () => {
    const { orm } = createFakeOrm();
    const repository = { findAll: vi.fn().mockResolvedValue([]), create: vi.fn() };
    mocks.createOrm.mockResolvedValue(orm);
    mocks.createMentorRepository.mockReturnValue(repository);

    const scope = await createRequestScope();

    expect(scope.cradle.mentorRepository).toBe(repository);
    expect(mocks.createMentorRepository).toHaveBeenCalledWith(scope.cradle.em);
    expect(scope.cradle.mentorService).toBeInstanceOf(MentorService);
    await expect(scope.cradle.mentorService.list()).resolves.toEqual([]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
