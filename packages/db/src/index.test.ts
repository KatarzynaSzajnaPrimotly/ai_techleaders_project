import { describe, expect, it } from "vitest";
import * as db from "./index";

describe("@devmentor/db public API", () => {
  it("exposes config, schema, orm and repository helpers", () => {
    expect(typeof db.getDatabaseConfig).toBe("function");
    expect(db.MentorSchema).toBeDefined();
    expect(typeof db.createOrm).toBe("function");
    expect(typeof db.getOrmOptions).toBe("function");
    expect(typeof db.createMentorRepository).toBe("function");
  });
});
