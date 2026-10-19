import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { createBrowser } from "./helpers/browser";

const baseUrl = inject("baseUrl");
const browser = createBrowser();
const unique = Date.now().toString(36);
const mentor = { name: `Ada ${unique}`, email: `ada-${unique}@example.com` };

function postMentor(body: unknown) {
  return fetch(`${baseUrl}/api/mentors`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterAll(() => {
  browser.close();
});

describe("mentors API against a real PostgreSQL", () => {
  it("creates a mentor and normalises the input", async () => {
    const response = await postMentor({ name: `  ${mentor.name} `, email: mentor.email.toUpperCase() });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ name: mentor.name, email: mentor.email });
  });

  it("rejects a duplicate email with 409 and no database details", async () => {
    const response = await postMentor(mentor);
    expect(response.status).toBe(409);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe(`A mentor with email ${mentor.email} already exists`);
    expect(body.error).not.toContain("constraint");
  });

  it("rejects invalid input with 400", async () => {
    expect((await postMentor({ name: "No Email" })).status).toBe(400);
    const response = await postMentor({ name: "Bad", email: "nope" });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Mentor email is invalid" });
  });

  it("lists the stored mentor", async () => {
    const mentors = (await (await fetch(`${baseUrl}/api/mentors`)).json()) as Array<{ email: string }>;
    expect(mentors.map((item) => item.email)).toContain(mentor.email);
  });

  it("answers 404 for unknown routes", async () => {
    expect((await fetch(`${baseUrl}/nope`)).status).toBe(404);
  });
});

describe("pages in a real browser (agent-browser)", () => {
  beforeAll(() => {
    browser.open(baseUrl);
  });

  it("renders the Mentora home page", () => {
    expect(browser.title()).toBe("Mentora — Learn anything, from real people");
    expect(browser.text("h1")).toBe("Find the perfect tutor and start learning today");
    expect(browser.text("body")).toContain("Ana Ruiz");
  });

  it("shows the mentor on the public page", () => {
    browser.open(`${baseUrl}/mentors`);
    expect(browser.title()).toBe("Mentors | DevMentor");
    expect(browser.text("h1")).toBe("Meet our mentors");
    const body = browser.text("body");
    expect(body).toContain(mentor.name);
    expect(body).toContain(mentor.email);
  });

  it("shows the mentor in the admin table", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    expect(browser.title()).toBe("Mentors | DevMentor admin");
    expect(browser.text("table")).toContain(mentor.email);
  });

  it("navigates from the admin page to the public page", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    browser.click('a[href="/mentors"]');
    browser.waitForUrl("**/mentors");
    expect(browser.url()).toBe(`${baseUrl}/mentors`);
    expect(browser.snapshot()).toContain("Meet our mentors");
  });
});
