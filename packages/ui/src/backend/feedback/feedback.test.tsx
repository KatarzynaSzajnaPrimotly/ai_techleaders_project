import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingMessage } from "./LoadingMessage";

describe("LoadingMessage", () => {
  it("announces the default message politely", () => {
    render(<LoadingMessage />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Loading…");
    expect(status.getAttribute("aria-live")).toBe("polite");
  });

  it("shows a custom message", () => {
    render(<LoadingMessage message="Fetching mentors" />);
    expect(screen.getByRole("status").textContent).toBe("Fetching mentors");
  });
});

describe("ErrorMessage", () => {
  it("renders an alert without a retry button by default", () => {
    render(<ErrorMessage message="Could not load" />);
    expect(screen.getByRole("alert").textContent).toContain("Could not load");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("offers a retry action", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Could not load" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("EmptyState", () => {
  it("shows the title alone", () => {
    const { container } = render(<EmptyState title="No mentors" />);
    expect(screen.getByText("No mentors")).toBeDefined();
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("shows a description when given", () => {
    render(<EmptyState title="No mentors" description="Add the first one." />);
    expect(screen.getByText("Add the first one.")).toBeDefined();
  });
});
