import type { ReactNode } from "react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { EmptyState } from "../feedback/EmptyState";
import { ErrorMessage } from "../feedback/ErrorMessage";
import { LoadingMessage } from "../feedback/LoadingMessage";

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  cell?: (row: Row) => ReactNode;
  className?: string;
}

export interface DataTablePagination {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: (row: Row) => ReactNode;
  pagination?: DataTablePagination;
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  actions,
  pagination,
}: DataTableProps<Row>) {
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {actions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell ? column.cell(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                </TableCell>
              ))}
              {actions ? <TableCell className="text-right">{actions(row)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination ? (
        <div className="flex items-center justify-between text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {pagination.page} of {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pageCount}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
