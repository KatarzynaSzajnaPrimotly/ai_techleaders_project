import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ execFileSync: vi.fn(() => "cookie set\n") }));
vi.mock("node:child_process", () => ({ execFileSync: mocks.execFileSync }));

import { createBrowser, setCookie } from "./browser";

beforeEach(() => mocks.execFileSync.mockClear());

describe("browser cookie helper", () => {
  it("sets an HttpOnly lax cookie against the target app URL", () => {
    setCookie("devmentor_session", "signed-token", "http://127.0.0.1:4000", "auth-test");
    expect(mocks.execFileSync).toHaveBeenCalledWith(
      expect.stringContaining("node_modules/.bin/agent-browser"),
      ["cookies", "set", "devmentor_session", "signed-token", "--url", "http://127.0.0.1:4000", "--httpOnly", "--sameSite", "Lax"],
      expect.objectContaining({ env: expect.objectContaining({ AGENT_BROWSER_SESSION: "auth-test" }) }),
    );
  });

  it("exposes cookie setup through an isolated browser session", () => {
    const browser = createBrowser("isolated");
    browser.setCookie("test", "value", "http://localhost:3000");
    expect(mocks.execFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["cookies", "set", "test", "value", "--url", "http://localhost:3000"]),
      expect.objectContaining({ env: expect.objectContaining({ AGENT_BROWSER_SESSION: "isolated" }) }),
    );
  });
});
