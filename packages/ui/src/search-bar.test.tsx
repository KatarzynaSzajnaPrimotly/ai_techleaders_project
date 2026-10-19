import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchBar } from "./search-bar";

describe("SearchBar", () => {
  it("submits the query with GET to the given action", () => {
    render(<SearchBar action="/mentors" name="subject" label="Subject" placeholder="Learn…" />);
    const form = screen.getByRole("search");
    expect(form.getAttribute("action")).toBe("/mentors");
    expect(form.getAttribute("method")).toBe("get");
    const input = screen.getByLabelText("Subject");
    expect(input.getAttribute("name")).toBe("subject");
    expect(input.getAttribute("placeholder")).toBe("Learn…");
  });

  it("offers suggestions through a datalist linked to the input", () => {
    const { container } = render(
      <SearchBar action="/mentors" name="subject" label="Subject" placeholder="Learn…" suggestions={["Spanish", "Piano"]} />,
    );
    const list = container.querySelector("datalist");
    expect(list?.id).toBe(screen.getByLabelText("Subject").getAttribute("list"));
    expect([...(list?.querySelectorAll("option") ?? [])].map((option) => option.value)).toEqual(["Spanish", "Piano"]);
  });

  it("has no suggestions by default", () => {
    const { container } = render(<SearchBar action="/mentors" name="subject" label="Subject" placeholder="Learn…" />);
    expect(container.querySelectorAll("option")).toHaveLength(0);
  });
});
