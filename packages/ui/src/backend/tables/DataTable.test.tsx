import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  name: string;
  note?: string;
}

const rows: Row[] = [
  { id: "1", name: "Ada", note: "first" },
  { id: "2", name: "Grace" },
];
const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name" },
  { key: "note", header: "Note", className: "note-col" },
];
const getRowKey = (row: Row) => row.id;

describe("DataTable", () => {
  it("shows the loading state instead of rows", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} loading />);
    expect(screen.getByRole("status")).toBeDefined();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("shows the error state with a retry action", () => {
    const onRetry = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} error="Boom" onRetry={onRetry} />);
    expect(screen.getByRole("alert").textContent).toContain("Boom");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows the default empty state", () => {
    render(<DataTable columns={columns} rows={[]} getRowKey={getRowKey} />);
    expect(screen.getByText("Nothing here yet")).toBeDefined();
  });

  it("shows a custom empty state", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowKey={getRowKey}
        emptyTitle="No mentors yet."
        emptyDescription="Add one."
      />,
    );
    expect(screen.getByText("No mentors yet.")).toBeDefined();
    expect(screen.getByText("Add one.")).toBeDefined();
  });

  it("renders headers and cells, defaulting a missing value to an empty cell", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} />);
    expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual(["Name", "Note"]);
    expect(screen.getByRole("cell", { name: "Ada" })).toBeDefined();
    expect(screen.getByRole("cell", { name: "first" }).className).toContain("note-col");
    const lastRowCells = screen.getAllByRole("row")[2].querySelectorAll("td");
    expect(lastRowCells[1].textContent).toBe("");
  });

  it("uses a custom cell renderer", () => {
    const custom: DataTableColumn<Row>[] = [{ key: "name", header: "Name", cell: (row) => <b>{row.name.toUpperCase()}</b> }];
    render(<DataTable columns={custom} rows={rows} getRowKey={getRowKey} />);
    expect(screen.getByText("ADA").tagName).toBe("B");
  });

  it("adds a row actions column", () => {
    const onDelete = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        actions={(row) => <button onClick={() => onDelete(row.id)}>Delete {row.name}</button>}
      />,
    );
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Delete Grace" }));
    expect(onDelete).toHaveBeenCalledWith("2");
  });

  it("has no actions column or pagination by default", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} />);
    expect(screen.queryByRole("columnheader", { name: "Actions" })).toBeNull();
    expect(screen.queryByText(/Page \d+ of/)).toBeNull();
  });

  describe("pagination", () => {
    const paginate = (page: number, pageCount: number, onPageChange = vi.fn()) =>
      render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} pagination={{ page, pageCount, onPageChange }} />);

    it("disables Previous on the first page and pages forward", () => {
      const onPageChange = vi.fn();
      paginate(1, 3, onPageChange);
      expect(screen.getByText("Page 1 of 3")).toBeDefined();
      expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("disables Next on the last page and pages back", () => {
      const onPageChange = vi.fn();
      paginate(3, 3, onPageChange);
      expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(screen.getByRole("button", { name: "Previous" }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("enables both buttons in the middle", () => {
      paginate(2, 3);
      expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(false);
      expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(false);
    });
  });
});
