import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("forwards props and ref and applies semantic styles", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Question" className="custom-textarea" rows={5} />);

    const textarea = screen.getByRole("textbox", { name: "Question" });
    expect(textarea.getAttribute("rows")).toBe("5");
    expect(textarea.className).toContain("resize-y");
    expect(textarea.className).toContain("custom-textarea");
    expect(ref.current).toBe(textarea);
  });

  it("preserves accessible invalid and disabled states", () => {
    render(<Textarea aria-invalid="true" aria-label="Answer" disabled />);

    const textarea = screen.getByLabelText("Answer");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
  });
});
