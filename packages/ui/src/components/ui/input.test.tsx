import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("defaults to text, forwards props and ref, and applies semantic styles", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Email" className="custom-input" name="email" />);

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("name")).toBe("email");
    expect(input.className).toContain("rounded-control");
    expect(input.className).toContain("custom-input");
    expect(ref.current).toBe(input);
  });

  it("preserves an explicit type and accessible state props", () => {
    render(<Input type="password" aria-invalid="true" aria-label="Password" disabled />);

    const input = screen.getByLabelText("Password");
    expect(input.getAttribute("type")).toBe("password");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect((input as HTMLInputElement).disabled).toBe(true);
  });
});
