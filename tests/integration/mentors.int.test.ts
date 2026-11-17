import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE } from "../../packages/core/src/http/auth";
import { createBrowser } from "./helpers/browser";
import { createOrReuseUser, mintSessionCookie } from "./helpers/identity";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const jwtSecret = inject("jwtSecret");
const operatorEmail = inject("operatorEmail");
const browser = createBrowser();
const unique = Date.now().toString(36);
let operatorCookie = "";

interface Envelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; fieldErrors?: Record<string, string[]> };
}

beforeAll(async () => {
  const operator = await createOrReuseUser({ email: operatorEmail }, databaseUrl);
  const token = await mintSessionCookie({ userId: operator.id, role: "operator" }, jwtSecret);
  operatorCookie = `${SESSION_COOKIE}=${token}`;
  browser.setCookie(SESSION_COOKIE, token, baseUrl);
});

afterAll(() => {
  browser.close();
});

describe("mentors API against a real PostgreSQL", () => {
  it("returns only the published public profile projection to operators", async () => {
    const body = (await (await fetch(`${baseUrl}/api/mentors`, { headers: { cookie: operatorCookie } })).json()) as Envelope<Array<Record<string, unknown>>>;
    expect(body.ok).toBe(true);
    expect(body.data?.every((item) => !("email" in item))).toBe(true);
  });

  it("does not expose an operator route that bypasses invitations", async () => {
    const response = await fetch(`${baseUrl}/api/mentors`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: operatorCookie, "x-devmentor-csrf": "1" },
      body: JSON.stringify({ name: "Uninvited", email: `uninvited-${unique}@example.com` }),
    });
    expect(response.status).toBe(405);
  });

  it("answers 404 for unknown routes", async () => {
    expect((await fetch(`${baseUrl}/nope`)).status).toBe(404);
  });
});

describe("pages in a real browser (agent-browser)", () => {
  beforeAll(() => {
    browser.open(baseUrl);
  });

  it("renders the DevMentor home page", () => {
    expect(browser.title()).toBe("DevMentor — Learn anything, from real people");
    expect(browser.text("h1")).toBe("Find the perfect tutor and start learning today");
    expect(browser.text("body")).toContain("Ana Ruiz");
  });

  it("keeps the public directory out of scope while share pages are available", () => {
    browser.open(`${baseUrl}/mentors`);
    expect(browser.title()).toBe("Mentors | DevMentor");
    expect(browser.text("h1")).toBe("Meet our mentors");
    expect(browser.text("body")).toContain("Mentors share their pages directly.");
  });

  it("shows the published-profile contract without a direct registration form", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    expect(browser.title()).toBe("Mentors | DevMentor admin");
    browser.waitForText("Registered mentors");
    expect(browser.text("body")).toContain("Published mentor pages. Unpublished pages and private contact details are excluded.");
    expect(browser.text("body")).not.toContain("Add mentor");
  });

  it("navigates from the admin page to the public page", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    browser.click('a[href="/mentors"]');
    browser.waitForUrl("**/mentors");
    expect(browser.url()).toBe(`${baseUrl}/mentors`);
    expect(browser.snapshot()).toContain("Meet our mentors");
  });
});
