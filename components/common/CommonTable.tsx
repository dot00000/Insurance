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

const defaultRows: CommonTableRow[] = [
  { id: "INV001", customer: "김민수", product: "종합보험", status: "가입중", amount: "₩250,000" },
  { id: "INV002", customer: "박서연", product: "자동차보험", status: "만기예정", amount: "₩180,000" },
  { id: "INV003", customer: "최준호", product: "여행보험", status: "갱신완료", amount: "₩96,000" },
];

const defaultColumns: CommonTableColumn[] = [
  { key: "id", label: "번호", headerClassName: "w-[120px]", className: "font-medium text-slate-800" },
  { key: "customer", label: "고객명" },
  { key: "product", label: "상품" },
  {
    key: "status",
    label: "상태",
    render: (value) => (
      <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
        {value}
      </span>
    ),
  },
  { key: "amount", label: "월 보험료", headerClassName: "text-right", className: "text-right font-medium text-slate-800" },
];

type CommonTableProps = {
  name: string;
  columns?: CommonTableColumn[];
  rows?: CommonTableRow[];
  onRowClick?: (row: CommonTableRow) => void;
};

export default function CommonTable({
  name,
  columns = defaultColumns,
  rows = defaultRows,
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
