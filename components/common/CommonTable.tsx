import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  { id: "INV001", customer: "김민수", product: "종합보험", status: "가입중", amount: "₩250,000" },
  { id: "INV002", customer: "박서연", product: "자동차보험", status: "만기예정", amount: "₩180,000" },
  { id: "INV003", customer: "최준호", product: "여행보험", status: "갱신완료", amount: "₩96,000" },
];

export default function CommonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-700">Table</h2>
      </div>

      <UiTable className="w-full text-left">
        <TableHeader className="border-b border-slate-200">
          <TableRow className="bg-slate-50/80 hover:bg-slate-50">
            <TableHead className="w-[120px] px-4 py-3 text-slate-600">번호</TableHead>
            <TableHead className="px-4 py-3 text-slate-600">고객명</TableHead>
            <TableHead className="px-4 py-3 text-slate-600">상품</TableHead>
            <TableHead className="px-4 py-3 text-slate-600">상태</TableHead>
            <TableHead className="px-4 py-3 text-right text-slate-600">월 보험료</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
              <TableCell className="px-4 py-3 font-medium text-slate-800">{row.id}</TableCell>
              <TableCell className="px-4 py-3 text-slate-700">{row.customer}</TableCell>
              <TableCell className="px-4 py-3 text-slate-700">{row.product}</TableCell>
              <TableCell className="px-4 py-3">
                <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {row.status}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-right font-medium text-slate-800">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </UiTable>
    </div>
  );
}
