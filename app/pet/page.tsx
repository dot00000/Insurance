"use client";

import petInsurance from "@/data/pet-insurance.json";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { createFilterItems } from "@/utils/filterItems";
import { formatRate, getMaximumEnrollmentAge } from "@/utils/insuranceFormat";
import { useState } from "react";

const items = petInsurance.response.body.items.item;
const rowsPerPage = 10;

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "보장 항목",
  prdNm: "상품명",
  age: "반려동물 나이",
  petType: "동물 종류",
  breed: "품종",
  petAgeMonths: "나이 (개월)",
  mlInsRt: "기본 보험료 (원/월)",
  fmlInsRt: "보험료 예시 (원/월)",
  coverageRate: "보장 비율",
  annualLimit: "연간 보장 한도 (원)",
  deductible: "자기부담금",
  enrollmentAgeRange: "가입 가능 연령",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
};

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [company, setCompany] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [petType, setPetType] = useState("all");
  const [breed, setBreed] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "prdNm", label: "상품명" },
    { key: "petType", label: "종류" },
    { key: "breed", label: "품종" },
    { key: "age", label: "반려동물 나이" },
    { key: "mlInsRt", label: "월 보험료 (원)" },
    { key: "coverageRate", label: "보장 비율" },
    { key: "mog", label: "보장 항목" },
    { key: "ptrn", label: "보험 유형" },
  ];

  const rows = items.map((item, index) => ({
    ...item,
    id: index,
    cmpyNm: item.cmpyNm,
    mlInsRt: formatRate(item.mlInsRt),
    fmlInsRt: formatRate(item.fmlInsRt),
    annualLimit: formatRate(item.annualLimit),
    age: item.age,
  }));

  const companyOptions = createFilterItems(
    items.map((item) => item.cmpyNm),
    "전체 회사",
  );
  const planTypeOptions = createFilterItems(
    items.map((item) => item.ptrn),
    "전체 유형",
  );
  const petTypeOptions = createFilterItems(
    items.map((item) => item.petType),
    "전체 종류",
  );
  const breedOptions = createFilterItems(
    items
      .filter((item) => petType === "all" || item.petType === petType)
      .map((item) => item.breed),
    "전체 품종",
  );

  const filteredRows = rows.filter((row) => {
    const maxEnrollmentAge = getMaximumEnrollmentAge(row.enrollmentAgeRange);
    return (
      (company === "all" || row.cmpyNm === company) &&
      (planType === "all" || row.ptrn === planType) &&
      (petType === "all" || row.petType === petType) &&
      (breed === "all" || row.breed === breed) &&
      (selectedAge === null ||
        (maxEnrollmentAge !== null && selectedAge <= maxEnrollmentAge)) &&
      (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase())
    );
  });

  const selectedDetails = selectedItem
    ? Object.entries(selectedItem)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label: detailLabels[key] ?? key,
          value:
            key === "mlInsRt" || key === "fmlInsRt" || key === "annualLimit"
              ? formatRate(value)
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
            name={petType}
            onNameChange={(value) => {
                setPetType(value);
                setBreed("all");
                setPageNo(1);
            }}
            items={petTypeOptions}
            placeholder="동물 종류"
            />
            <SelectBox
            name={breed}
            onNameChange={(value) => {
                setBreed(value);
                setPageNo(1);
            }}
            items={breedOptions}
            placeholder="품종"
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
        name="반려동물보험"
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