import { Writable } from "node:stream";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLogger, logger, REDACTED_PATHS } from "./logger";

afterEach(() => {
  vi.unstubAllEnvs();
});

function capture() {
  const lines: string[] = [];
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      lines.push(chunk.toString());
      callback();
    },
  });
  return { lines, stream };
}

describe("createLogger", () => {
  it("writes structured JSON", () => {
    const { lines, stream } = capture();
    createLogger(stream, "info").info({ mentorId: "1" }, "created");
    const entry = JSON.parse(lines[0]);
    expect(entry).toMatchObject({ msg: "created", mentorId: "1" });
  });

  it("redacts secrets at the top level and one level deep", () => {
    const { lines, stream } = capture();
    createLogger(stream, "info").info(
      {
        password: "hunter2",
        user: { token: "tok-secret-1", jwt: "aaa.bbb.ccc", password: "pw-secret-2" },
        req: { headers: { authorization: "Bearer x", cookie: "devmentor_session=abc" } },
        safe: "visible",
      },
      "login",
    );
    const raw = lines[0];
    for (const secret of ["hunter2", "tok-secret-1", "aaa.bbb.ccc", "pw-secret-2", "Bearer x", "devmentor_session=abc"]) {
      expect(raw).not.toContain(secret);
    }
    expect(JSON.parse(raw).safe).toBe("visible");
    expect(JSON.parse(raw).password).toBe("[REDACTED]");
  });

  it("lists every sensitive key at both depths", () => {
    expect(REDACTED_PATHS).toEqual(expect.arrayContaining(["password", "*.password", "cookie", "*.cookie"]));
  });

  it("honours an explicit level", () => {
    const { lines, stream } = capture();
    createLogger(stream, "error").info("hidden");
    expect(lines).toHaveLength(0);
  });

  it("takes the level from LOG_LEVEL by default", () => {
    vi.stubEnv("LOG_LEVEL", "silent");
    const { lines, stream } = capture();
    createLogger(stream).error("hidden");
    expect(lines).toHaveLength(0);
  });
});

describe("logger", () => {
  it("is a ready-to-use shared instance", () => {
    expect(typeof logger.info).toBe("function");
  });
});
