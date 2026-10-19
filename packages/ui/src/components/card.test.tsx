import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders every part with its content", () => {
    render(
      <Card data-testid="card" className="extra">
        <CardHeader className="header-extra">
          <CardTitle className="title-extra">Title</CardTitle>
          <CardDescription className="desc-extra">Description</CardDescription>
        </CardHeader>
        <CardContent className="content-extra">Body</CardContent>
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("extra");
    expect(screen.getByRole("heading", { name: "Title" }).className).toContain("title-extra");
    expect(screen.getByText("Description").className).toContain("desc-extra");
    expect(screen.getByText("Body").className).toContain("content-extra");
    expect(screen.getByText("Title").parentElement?.className).toContain("header-extra");
  });
});
