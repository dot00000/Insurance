"use client";

import { useMedicalInsuranceQuery } from "@/api/medical/medical.query";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { createFilterItems } from "@/utils/filterItems";
import { useState } from "react";

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [cmpyNum, setCmpyNum] = useState("all");
  const [ptrn, setPrtn] = useState("all");
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
    { key: "age", label: "나이" },
    { key: "prdNm", label: "상품명" },
  ];

  const rows = items.map((item, id) => ({
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
      (ptrn === "all" || row.ptrn === ptrn),
  );

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
        <CommonCalendar />
        <Search />
      </div>
      {isLoading && <p>불러오는 중입니다.</p>}
      {isError && <p>데이터를 불러오지 못했습니다.</p>}
      {!isLoading && !isError && (
        <CommonTable name="실손보험" columns={columns} rows={filteredRows} />
      )}
      <CommonPagination currentPage={pageNo} onPageChange={setPageNo} />
    </div>
  );
}
