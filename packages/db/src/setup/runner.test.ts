import { describe, expect, it, vi } from "vitest";
import { runSetup } from "./runner";
import { SetupError, type SetupStep } from "./types";

const ok = (name: string, status: "done" | "skipped"): SetupStep => ({
  name,
  run: async () => ({ status, detail: `${name} detail` }),
});
const failing = (name: string, error: unknown): SetupStep => ({
  name,
  run: async () => {
    throw error;
  },
});

describe("runSetup", () => {
  it("reports every step in order and succeeds", async () => {
    const log = vi.fn();
    expect(await runSetup([ok("A", "done"), ok("B", "skipped")], log)).toBe(true);
    expect(log.mock.calls).toEqual([["[done] A: A detail"], ["[skipped] B: B detail"]]);
  });

  it("stops at the first failure and prints the fix of a SetupError", async () => {
    const log = vi.fn();
    const later = vi.fn();
    const steps = [failing("A", new SetupError("broken", "do this")), { name: "B", run: later }];
    expect(await runSetup(steps, log)).toBe(false);
    expect(log.mock.calls).toEqual([["[failed] A: broken"], ["  fix: do this"]]);
    expect(later).not.toHaveBeenCalled();
  });

  it("reports a plain Error without a fix line", async () => {
    const log = vi.fn();
    expect(await runSetup([failing("A", new Error("boom"))], log)).toBe(false);
    expect(log.mock.calls).toEqual([["[failed] A: boom"]]);
  });

  it("reports a thrown non-Error value", async () => {
    const log = vi.fn();
    expect(await runSetup([failing("A", "text")], log)).toBe(false);
    expect(log.mock.calls).toEqual([["[failed] A: text"]]);
  });
});
