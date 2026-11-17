import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MentorProfileOwnerDto } from "@devmentor/core";

const mocks = vi.hoisted(() => ({ apiCall: vi.fn() }));
vi.mock("@devmentor/ui", async (importOriginal) => ({ ...(await importOriginal<typeof import("@devmentor/ui")>()), apiCall: mocks.apiCall }));

import { MentorProfileEditor } from "./profile-editor";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
const originalExecCommand = Object.getOwnPropertyDescriptor(document, "execCommand");

function makeProfile(overrides: Partial<MentorProfileOwnerDto> = {}): MentorProfileOwnerDto {
  return {
    id: "profile-1", publicWorkUrl: null, bio: null, sessionChannel: null, stackTags: [], slug: null, publishedAt: null, lastPublishedAvailabilityAt: null, prices: null,
    readiness: { publicWorkUrl: false, bio: false, sessionChannel: false }, ...overrides,
  };
}

beforeEach(() => mocks.apiCall.mockReset());
afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
  if (originalExecCommand) Object.defineProperty(document, "execCommand", originalExecCommand);
  else Reflect.deleteProperty(document, "execCommand");
  vi.unstubAllGlobals();
});

describe("MentorProfileEditor", () => {
  it("saves an incremental draft with the shared schema-backed form", async () => {
    mocks.apiCall.mockResolvedValue({ ok: true, status: 200, data: makeProfile({ bio: "Engineer", sessionChannel: "Private room", readiness: { publicWorkUrl: false, bio: true, sessionChannel: true } }) });
    render(<MentorProfileEditor initial={makeProfile()} />);
    fireEvent.change(screen.getByLabelText("About your work"), { target: { value: "Engineer" } });
    fireEvent.click(screen.getByLabelText("React"));
    fireEvent.change(screen.getByLabelText("Session channel"), { target: { value: "Private room" } });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    await waitFor(() => expect(mocks.apiCall).toHaveBeenCalledWith("/api/mentors/me", {
      method: "PUT", body: { publicWorkUrl: "", bio: "Engineer", stackTags: ["React"], sessionChannel: "Private room" },
    }));
    expect(await screen.findByText("Session channel added")).toBeDefined();
  });

  it("shows server readiness field errors beside their inputs", async () => {
    mocks.apiCall.mockResolvedValue({ ok: false, status: 400, error: {
      code: "VALIDATION_ERROR", message: "Profile is incomplete",
      fieldErrors: { publicWorkUrl: ["Add a link"], bio: ["Add a description"] },
    } });
    render(<MentorProfileEditor initial={makeProfile()} />);
    fireEvent.click(screen.getByRole("button", { name: "Publish page" }));
    expect(await screen.findByText("Add a link")).toBeDefined();
    expect(screen.getAllByText("Add a description")).toHaveLength(2);
    expect(screen.getByText("Profile is incomplete")).toBeDefined();
  });

  it("shows transition errors that do not include field errors", async () => {
    mocks.apiCall.mockResolvedValue({ ok: false, status: 503, error: { code: "SERVICE_UNAVAILABLE", message: "Try again later" } });
    render(<MentorProfileEditor initial={makeProfile()} />);
    fireEvent.click(screen.getByRole("button", { name: "Publish page" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Try again later");
  });

  it("shows each readiness item as complete when the profile is ready", () => {
    render(<MentorProfileEditor initial={makeProfile({ publicWorkUrl: "https://example.test", bio: "Engineer", sessionChannel: "Private room", readiness: { publicWorkUrl: true, bio: true, sessionChannel: true } })} />);
    expect(screen.getByText("Public work link added")).toBeDefined();
    expect(screen.getByText("Description added")).toBeDefined();
    expect(screen.getByText("Session channel added")).toBeDefined();
  });

  it("copies a stable share link and unpublishes without discarding its slug", async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
    mocks.apiCall.mockResolvedValue({ ok: true, status: 200, data: makeProfile({ slug: "ada", publishedAt: new Date(0) }) });
    render(<MentorProfileEditor initial={makeProfile({ slug: "ada", publishedAt: new Date(0) })} />);
    expect(screen.getByRole("link", { name: "/m/ada" })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    await screen.findByText("Link copied");
    expect(clipboard.writeText).toHaveBeenCalledWith("http://localhost:3000/m/ada");
    fireEvent.click(screen.getByRole("button", { name: "Unpublish page" }));
    await waitFor(() => expect(mocks.apiCall).toHaveBeenCalledWith("/api/mentors/me/unpublish", { method: "POST", body: {} }));
  });

  it("reports clipboard rejection and uses a fallback when the API is unavailable", async () => {
    const clipboard = { writeText: vi.fn().mockRejectedValue(new Error("denied")) };
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
    render(<MentorProfileEditor initial={makeProfile({ slug: "ada", publishedAt: new Date(0) })} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByText("Copy failed. Select and copy the link above.")).toBeDefined();

    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByText("Link copied")).toBeDefined();
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("reports when the clipboard fallback fails", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn().mockReturnValue(false) });
    render(<MentorProfileEditor initial={makeProfile({ slug: "ada", publishedAt: new Date(0) })} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByText("Copy failed. Select and copy the link above.")).toBeDefined();
  });
});
