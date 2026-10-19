import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { createBrowser } from "./helpers/browser";

const baseUrl = inject("baseUrl");
const browser = createBrowser();
const unique = Date.now().toString(36);
const mentor = { name: `Ada ${unique}`, email: `ada-${unique}@example.com` };

const CSRF = { "x-devmentor-csrf": "1" };

function postMentor(body: unknown, headers: Record<string, string> = CSRF) {
  return fetch(`${baseUrl}/api/mentors`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

interface Envelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; fieldErrors?: Record<string, string[]> };
}

afterAll(() => {
  browser.close();
});

describe("mentors API against a real PostgreSQL", () => {
  it("creates a mentor and normalises the input", async () => {
    const response = await postMentor({ name: `  ${mentor.name} `, email: mentor.email.toUpperCase() });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, data: { name: mentor.name, email: mentor.email } });
  });

  it("refuses a state-changing request without the CSRF header", async () => {
    const response = await postMentor({ name: "No Csrf", email: `csrf-${unique}@example.com` }, {});
    expect(response.status).toBe(403);
    expect(((await response.json()) as Envelope<never>).error?.code).toBe("FORBIDDEN");
  });

  it("rejects a duplicate email with 409 and no database details", async () => {
    const response = await postMentor(mentor);
    expect(response.status).toBe(409);
    const body = (await response.json()) as Envelope<never>;
    expect(body.error?.code).toBe("CONFLICT");
    expect(body.error?.message).toBe(`A mentor with email ${mentor.email} already exists`);
    expect(JSON.stringify(body)).not.toContain("constraint");
  });

  it("rejects invalid input with 400 and per-field errors", async () => {
    expect((await postMentor({ name: "No Email" })).status).toBe(400);
    const response = await postMentor({ name: "Bad", email: "nope" });
    expect(response.status).toBe(400);
    const body = (await response.json()) as Envelope<never>;
    expect(body.error?.code).toBe("VALIDATION_ERROR");
    expect(body.error?.fieldErrors?.email).toEqual(["Email is invalid"]);
  });

  it("lists the stored mentor", async () => {
    const body = (await (await fetch(`${baseUrl}/api/mentors`)).json()) as Envelope<Array<{ email: string }>>;
    expect(body.ok).toBe(true);
    expect(body.data?.map((item) => item.email)).toContain(mentor.email);
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
    browser.waitForText(mentor.email);
    expect(browser.text("table")).toContain(mentor.email);
  });

  it("adds a mentor through the admin form (CrudForm, apiCall, CSRF header, real database)", () => {
    const added = { name: `Grace ${unique}`, email: `grace-${unique}@example.com` };
    browser.open(`${baseUrl}/admin/mentors`);
    browser.waitForText("Registered mentors");
    browser.fill("#name", added.name);
    browser.fill("#email", added.email);
    browser.click('button[type="submit"]');
    browser.waitForText(added.email);
    expect(browser.text("table")).toContain(added.name);

    browser.open(`${baseUrl}/mentors`);
    expect(browser.text("body")).toContain(added.email);
  });

  it("shows validation messages from the shared schema in the admin form", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    browser.waitForText("Registered mentors");
    browser.fill("#email", "nope");
    browser.click('button[type="submit"]');
    browser.waitForText("Email is invalid");
    expect(browser.text("body")).toContain("Name is required");
  });

  it("navigates from the admin page to the public page", () => {
    browser.open(`${baseUrl}/admin/mentors`);
    browser.click('a[href="/mentors"]');
    browser.waitForUrl("**/mentors");
    expect(browser.url()).toBe(`${baseUrl}/mentors`);
    expect(browser.snapshot()).toContain("Meet our mentors");
  });
});
