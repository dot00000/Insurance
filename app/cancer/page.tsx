"use client";

import cancerInsurance from "@/data/cancer-insurance.json";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { createFilterItems } from "@/utils/filterItems";
import { formatRate } from "@/utils/insuranceFormat";
import { useState } from "react";

const items = cancerInsurance.response.body.items.item;
const rowsPerPage = 10;

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "보장 항목",
  prdNm: "상품명",
  age: "가입 나이",
  mlInsRt: "남성 보험료 (원)",
  fmlInsRt: "여성 보험료 (원)",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
};

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [cmpyNum, setCmpyNum] = useState("all");
  const [ptrn, setPrtn] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "prdNm", label: "상품명" },
    { key: "age", label: "(만) 나이" },
    { key: "mlInsRt", label: "남성 보험료 (원)" },
    { key: "fmlInsRt", label: "여성 보험료 (원)" },
    { key: "ptrn", label: "보험 유형" },
    { key: "mog", label: "보장 항목" },
  ];

  const rows = items.map((item, index) => ({
    ...item,
    plans: undefined, // 플랜 객체는 테이블 셀에 표시하지 않습니다.
    id: index,
    ptrn: item.ptrn,
    mog: item.mog,
    cmpyNm: item.cmpyNm,
    mlInsRt: formatRate(item.mlInsRt),
    fmlInsRt: formatRate(item.fmlInsRt),
    age: item.age,
    prdNm: item.prdNm,
  }));

  const companyItems = createFilterItems(
    items.map((item) => item.cmpyNm),
    "전체 회사",
  );
  const patternItems = createFilterItems(
    items.map((item) => item.ptrn),
    "전체 유형",
  );

  const filteredRows = rows.filter(
    (row) =>
      (cmpyNum === "all" || row.cmpyNm === cmpyNum) &&
      (ptrn === "all" || row.ptrn === ptrn) &&
      (selectedAge === null || selectedAge <= Number(row.age)) &&
      (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase()),
  );
  const selectedDetails = selectedItem
    ? Object.entries(selectedItem)
        .filter(([key, value]) => key !== "plans" && value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label: detailLabels[key] ?? key,
          value:
            key === "mlInsRt" || key === "fmlInsRt"
              ? formatRate(typeof value === "string" ? value : undefined)
              : String(value),
        }))
    : [];
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const visibleRows = filteredRows.slice(
    (pageNo - 1) * rowsPerPage,
    pageNo * rowsPerPage,
  );

  return (
    <div className="p-6">
      <div className="flex gap-3 py-5">
        <SelectBox
          name={cmpyNum}
          onNameChange={(value) => {
            setCmpyNum(value);
            setPageNo(1);
          }}
          items={companyItems}
        />
        <SelectBox
          name={ptrn}
          onNameChange={(value) => {
            setPrtn(value);
            setPageNo(1);
          }}
          items={patternItems}
        />
        <CommonCalendar
          onAgeChange={(age) => {
            setSelectedAge(age);
            setPageNo(1);
          }}
        />
        <Search
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPageNo(1);
          }}
          placeholder="상품명 검색"
        />
      </div>
      <CommonTable
        name="암보험"
        columns={columns}
        rows={visibleRows}
        onRowClick={(row) => {
          const item = items[Number(row.id)];
          if (item) setSelectedItem(item);
        }}
      />
      {selectedItem && (
        <CommonDialog
          title={selectedItem.prdNm}
          description={selectedItem.cmpyNm}
          details={selectedDetails}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <div className="py-10">
        <CommonPagination
          currentPage={pageNo}
          onPageChange={setPageNo}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}