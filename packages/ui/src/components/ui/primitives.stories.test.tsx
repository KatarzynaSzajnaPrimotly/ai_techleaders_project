import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badges, Buttons, Cards, Inputs, Tables, Textareas } from "./primitives.stories";

type PrimitiveStory = typeof Buttons;

function renderPrimitiveStory(story: PrimitiveStory) {
  if (!story.render) throw new Error("Primitive story must define a render function");

  const args = {} as Parameters<NonNullable<PrimitiveStory["render"]>>[0];
  const context = {} as Parameters<NonNullable<PrimitiveStory["render"]>>[1];
  render(story.render(args, context));
}

describe("first batch primitive stories", () => {
  it("shows the button variants and disabled state", () => {
    renderPrimitiveStory(Buttons);

    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
    expect((screen.getByRole("button", { name: "Unavailable" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("labels badge states with text", () => {
    renderPrimitiveStory(Badges);

    expect(screen.getByText("Confirmed")).toBeTruthy();
    expect(screen.getByText("Needs attention")).toBeTruthy();
    expect(screen.getByText("Payment failed")).toBeTruthy();
  });

  it("groups card content", () => {
    renderPrimitiveStory(Cards);

    expect(screen.getByRole("heading", { name: "Session details" })).toBeTruthy();
  });

  it("renders a semantic sessions table", () => {
    renderPrimitiveStory(Tables);

    expect(screen.getByRole("table", { name: "Upcoming sessions" })).toBeTruthy();
    expect(screen.getByText("Sam Rivera")).toBeTruthy();
  });

  it("demonstrates labeled input states", () => {
    renderPrimitiveStory(Inputs);

    expect(screen.getByLabelText("Email address").getAttribute("type")).toBe("email");
    expect((screen.getByLabelText("Disabled field") as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
  });

  it("shows the text area with its privacy note", () => {
    renderPrimitiveStory(Textareas);

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByText("Keep session notes private unless you choose to share them.")).toBeTruthy();
  });
});
