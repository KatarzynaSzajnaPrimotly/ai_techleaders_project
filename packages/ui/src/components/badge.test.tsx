import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("uses the default variant", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New").className).toContain("bg-primary");
  });

  it.each([
    ["secondary", "bg-secondary"],
    ["outline", "text-foreground"],
  ] as const)("supports the %s variant", (variant, expected) => {
    render(<Badge variant={variant}>Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain(expected);
  });

  it("merges a custom className", () => {
    render(<Badge className="ml-2">Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain("ml-2");
  });
});
