"use client";

import carInsurance from "@/data/car-insurance.json";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { createFilterItems } from "@/utils/filterItems";
import { formatAmount, getMinimumDriverAge } from "@/utils/insuranceFormat";
import { useState } from "react";

const items = carInsurance.response.body.items.item;
const rowsPerPage = 10;

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "보장 항목",
  prdNm: "상품명",
  age: "가입 나이",
  mlInsRt: "남성 보험료 (원/년)",
  fmlInsRt: "여성 보험료 (원/년)",
  vehicleType: "차량 종류",
  driverRange: "운전자 범위",
  driverAgeLimit: "가입 가능 운전자 연령",
  annualDistanceKm: "연간 주행거리 (km)",
  discountSpecial: "할인 특약",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
};

const currencyFields = new Set(["mlInsRt", "fmlInsRt"]);

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [company, setCompany] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [vehicleType, setVehicleType] = useState("all");
  const [driverRange, setDriverRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "prdNm", label: "상품명" },
    { key: "vehicleType", label: "차량 종류" },
    { key: "driverAgeLimit", label: "최소 운전자 연령" },
    { key: "mlInsRt", label: "남성 보험료 (원)" },
    { key: "fmlInsRt", label: "여성 보험료 (원)" },
    { key: "driverRange", label: "운전자 범위" },
    { key: "ptrn", label: "보험 유형" },
  ];

  const rows = items.map((item, index) => ({
    ...item,
    plans: undefined, // 플랜 객체는 테이블 셀에 표시하지 않습니다.
    id: index,
    mlInsRt: formatAmount(item.mlInsRt),
    fmlInsRt: formatAmount(item.fmlInsRt),
    annualDistanceKm: formatAmount(item.annualDistanceKm),
  }));

  const companyOptions = createFilterItems(
    items.map((item) => item.cmpyNm),
    "전체 회사",
  );
  const planTypeOptions = createFilterItems(
    items.map((item) => item.ptrn),
    "전체 유형",
  );
  const vehicleTypeOptions = createFilterItems(
    items.map((item) => item.vehicleType),
    "전체 차량",
  );
  const driverRangeOptions = createFilterItems(
    items.map((item) => item.driverRange),
    "전체 운전자 범위",
  );

  const filteredRows = rows.filter((row) => {
    const minimumDriverAge = getMinimumDriverAge(row.driverAgeLimit);
    return (
      (company === "all" || row.cmpyNm === company) &&
      (planType === "all" || row.ptrn === planType) &&
      (vehicleType === "all" || row.vehicleType === vehicleType) &&
      (driverRange === "all" || row.driverRange === driverRange) &&
      (selectedAge === null ||
        (minimumDriverAge !== null && selectedAge >= minimumDriverAge)) &&
      (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase())
    );
  });

  const selectedDetails = selectedItem
    ? Object.entries(selectedItem)
        .filter(([key, value]) => key !== "plans" && value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label: detailLabels[key] ?? key,
          value: currencyFields.has(key)
            ? formatAmount(value as string | number)
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
      <div className="flex flex-col flex-wrap gap-3 py-5">
        <div className="flex gap-3">
          <SelectBox
            name={company}
            onNameChange={(value) => {
              setCompany(value);
              setPageNo(1);
            }}
            items={companyOptions}
            placeholder="보험사"
          />
          <SelectBox
            name={planType}
            onNameChange={(value) => {
              setPlanType(value);
              setPageNo(1);
            }}
            items={planTypeOptions}
            placeholder="보험 유형"
          />
          <SelectBox
            name={vehicleType}
            onNameChange={(value) => {
              setVehicleType(value);
              setPageNo(1);
            }}
            items={vehicleTypeOptions}
            placeholder="차량 종류"
          />
          <SelectBox
            name={driverRange}
            onNameChange={(value) => {
              setDriverRange(value);
              setPageNo(1);
            }}
            items={driverRangeOptions}
            placeholder="운전자 범위"
          />
        </div>
        <div className="flex gap-3">
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
      </div>

      <CommonTable
        name="자동차보험"
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
