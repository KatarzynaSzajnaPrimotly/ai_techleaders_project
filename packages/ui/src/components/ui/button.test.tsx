import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renders a button with the default variant and size", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.className).toContain("bg-action-primary");
    expect(button.className).toContain("min-h-10");
  });

  it.each([
    ["secondary", "bg-surface-subtle"],
    ["outline", "border-stroke-control"],
    ["ghost", "hover:bg-surface-subtle"],
    ["destructive", "bg-status-error"],
  ] as const)("applies the %s variant", (variant, expected) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it.each([
    ["sm", "min-h-8"],
    ["lg", "min-h-12"],
  ] as const)("applies the %s size", (size, expected) => {
    render(<Button size={size}>Go</Button>);
    expect(screen.getByRole("button").className).toContain(expected);
  });

  it("merges a custom className and forwards props", () => {
    render(
      <Button className="px-8" disabled type="submit">
        Send
      </Button>,
    );
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.className).toContain("px-8");
    expect(button.className).not.toContain("px-4");
    expect(button.disabled).toBe(true);
    expect(button.type).toBe("submit");
  });

  it("renders its child element instead of a button when asChild is set", () => {
    render(
      <Button asChild variant="outline">
        <a href="/mentors">Mentors</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Mentors" });
    expect(link.getAttribute("href")).toBe("/mentors");
    expect(link.className).toContain("border");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("exposes the variant helper", () => {
    expect(buttonVariants({ variant: "ghost", size: "sm" })).toContain("min-h-8");
  });
});
