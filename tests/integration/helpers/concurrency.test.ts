import { describe, expect, it } from "vitest";
import { runConcurrently } from "./concurrency";

describe("runConcurrently", () => {
  it("releases all requests at the same barrier and preserves result order", async () => {
    const arrived: number[] = [];
    const results = await runConcurrently(4, async (index) => {
      arrived.push(index);
      return index * 2;
    });

    expect(arrived).toEqual([0, 1, 2, 3]);
    expect(results).toEqual([0, 2, 4, 6]);
  });

  it.each([0, -1, 1.5, Number.NaN])("rejects an invalid request count (%s)", async (count) => {
    await expect(runConcurrently(count, () => "unused")).rejects.toThrow(RangeError);
  });
});
