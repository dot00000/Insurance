"use client";

import { useMedicalInsuranceQuery } from "@/api/medical/medical.query";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import type { MedicalInsuranceItem } from "@/api/medical/medical.type";
import { createFilterItems } from "@/utils/filterItems";
import { useState } from "react";

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "보장 항목",
  prdNm: "상품명",
  age: "가입 나이",
  mlInsRt: "남성 보험료율",
  fmlInsRt: "여성 보험료율",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
  pageNo: "페이지 번호",
};

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [cmpyNum, setCmpyNum] = useState("all");
  const [ptrn, setPrtn] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MedicalInsuranceItem | null>(null);
  const { data, isLoading, isError } = useMedicalInsuranceQuery(pageNo);
  const items = data?.items ?? [];
  const formatRate = (value: number | string | null | undefined) =>
    value === null || value === undefined
      ? "-"
      : Number(value).toLocaleString();

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "ptrn", label: "유형" },
    { key: "mlInsRt", label: "남성 보험료율" },
    { key: "fmlInsRt", label: "여성 보험료율" },
    { key: "age", label: "(만) 나이" },
    { key: "prdNm", label: "상품명" },
  ];

  const rows = items.map((item, id) => ({
    ...item,
    id: id,
    ptrn: item.ptrn,
    cmpyNm: item.cmpyNm ?? "-",
    mlInsRt: formatRate(item.mlInsRt),
    fmlInsRt: formatRate(item.fmlInsRt),
    age: item.age ?? "-",
    prdNm: item.prdNm ?? "-",
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
      (selectedAge === null ||
        (Number.isFinite(Number(row.age)) && selectedAge <= Number(row.age))) &&
      (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase()),
  );
  const selectedDetails = selectedItem
    ? Object.entries(selectedItem)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label: detailLabels[key] ?? key,
          value:
            key === "mlInsRt" || key === "fmlInsRt"
              ? formatRate(value as number | string)
              : String(value),
        }))
    : [];

  return (
    <div className="p-6">
      <div className="flex py-5 gap-3">
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
      {isLoading && <p>불러오는 중입니다.</p>}
      {isError && <p>데이터를 불러오지 못했습니다.</p>}
      {!isLoading && !isError && (
        <CommonTable
          name="실손보험"
          columns={columns}
          rows={filteredRows}
          onRowClick={(row) => {
            const item = items[Number(row.id)];
            if (item) setSelectedItem(item);
          }}
        />
      )}
      {selectedItem && (
        <CommonDialog
          title={selectedItem.prdNm ?? "보험 정보"}
          description={selectedItem.cmpyNm ?? "선택한 보험 상품의 상세 정보입니다."}
          details={selectedDetails}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <div className="py-10">
        <CommonPagination currentPage={pageNo} onPageChange={setPageNo} />
      </div>
    </div>
  );
}
