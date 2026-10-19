import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("wraps children in an English html document", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>child</p>
      </RootLayout>,
    );
    expect(markup.startsWith('<html lang="en">')).toBe(true);
    expect(markup).toContain("<body><p>child</p></body>");
  });

  it("declares the page metadata and an inline icon", () => {
    expect(metadata.title).toBe("Next.js starter");
    expect(metadata.description).toBe("Your Next.js app will show up here.");
    const icons = metadata.icons as { icon: string };
    expect(icons.icon.startsWith("data:image/svg+xml,")).toBe(true);
  });
});
