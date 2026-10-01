import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReactNode } from "react";

export type CommonTableRow = Record<string, ReactNode>;

export type CommonTableColumn = {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  render?: (value: ReactNode, row: CommonTableRow) => ReactNode;
};


type CommonTableProps = {
  name: string;
  columns?: CommonTableColumn[];
  rows?: CommonTableRow[];
  onRowClick?: (row: CommonTableRow) => void;
};

export default function CommonTable({
  name,
  columns = [],
  rows = [],
  onRowClick,
}: CommonTableProps) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-700 text-bold">{name}</h2>
      </div>

      <div className="w-full min-w-0 max-w-full overflow-x-auto">
        <UiTable className="w-full text-left">
          <TableHeader className="border-b border-slate-200">
            <TableRow className="bg-slate-50/80 hover:bg-slate-50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`px-4 py-3 text-slate-600 ${column.headerClassName ?? ""}`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={String(row.id ?? rowIndex)}
                className={`border-b border-slate-100 hover:bg-slate-50/80 ${onRowClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500" : ""}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onRowClick(row);
                  }
                } : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick ? `상세 정보 보기: ${String(row.prdNm ?? row.product ?? row.id ?? rowIndex + 1)}` : undefined}
              >
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <TableCell key={column.key} className={`px-4 py-3 text-slate-700 ${column.className ?? ""}`}>
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </UiTable>
      </div>
    </div>
  );
}
