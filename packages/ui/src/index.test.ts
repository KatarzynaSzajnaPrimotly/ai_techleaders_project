import { describe, expect, it } from "vitest";
import * as ui from "./index";

describe("@devmentor/ui public API", () => {
  it("exposes components and helpers", () => {
    for (const name of [
      "Backdrop",
      "MentorCard",
      "cn",
      "Button",
      "buttonVariants",
      "Badge",
      "Card",
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardContent",
      "Table",
      "TableHeader",
      "TableBody",
      "TableRow",
      "TableHead",
      "TableCell",
      "apiCall",
      "apiCallOrThrow",
      "ApiError",
      "readJsonSafe",
      "CrudForm",
      "DataTable",
      "EmptyState",
      "ErrorMessage",
      "LoadingMessage",
      "SiteHeader",
      "SiteFooter",
      "SearchBar",
      "TutorCard",
    ]) {
      expect(ui, name).toHaveProperty(name);
    }
  });
});
