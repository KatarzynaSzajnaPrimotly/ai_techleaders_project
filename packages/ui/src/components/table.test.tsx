import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

describe("Table", () => {
  it("renders a table with header, body, rows and cells", () => {
    render(
      <Table className="t-extra">
        <TableHeader className="h-extra">
          <TableRow className="r-extra">
            <TableHead className="th-extra">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="b-extra">
          <TableRow>
            <TableCell className="td-extra">Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table").className).toContain("t-extra");
    expect(screen.getByRole("columnheader", { name: "Name" }).className).toContain("th-extra");
    expect(screen.getByRole("cell", { name: "Ada" }).className).toContain("td-extra");
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });
});
