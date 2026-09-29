"use client";

import annuityInsurance from "@/data/annuity-insurance.json";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { createFilterItems } from "@/utils/filterItems";
import { formatAmount } from "@/utils/insuranceFormat";
import { useState } from "react";

const items = annuityInsurance.response.body.items.item;
const rowsPerPage = 10;

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "연금 지급 방식",
  prdNm: "상품명",
  age: "가입자 나이",
  basePremium: "기본 월 보험료 (원)",
  ageSurcharge: "나이 추가 보험료 (원)",
  totalPremium: "총 월 보험료 (원)",
  maxEnrollmentAge: "최대 가입 나이",
  paymentPeriodYears: "납입 기간 (년)",
  annuityStartAge: "연금 개시 나이",
  annuityType: "연금 유형",
  guaranteedPeriodYears: "보증 지급 기간 (년)",
  expectedMonthlyAnnuity: "예상 월 연금액 (원)",
  taxBenefit: "세제 혜택",
  basePremiumUnit: "기본 보험료 단위",
  premiumUnit: "보험료 단위",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
};

const currencyFields = new Set([
  "basePremium",
  "ageSurcharge",
  "totalPremium",
  "expectedMonthlyAnnuity",
]);

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [company, setCompany] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "prdNm", label: "상품명" },
    { key: "age", label: "가입자 나이" },
    { key: "maxEnrollmentAge", label: "최대 가입 나이" },
    { key: "basePremium", label: "기본료 (원)" },
    { key: "ageSurcharge", label: "나이 추가료 (원)" },
    { key: "totalPremium", label: "총 보험료 (원)" },
    { key: "expectedMonthlyAnnuity", label: "예상 월 연금액 (원)" },
    { key: "ptrn", label: "보험 유형" },
  ];

  const rows = items.map((item, index) => ({
    ...item,
    id: index,
    basePremium: formatAmount(item.basePremium),
    ageSurcharge: formatAmount(item.ageSurcharge),
    totalPremium: formatAmount(item.totalPremium),
    expectedMonthlyAnnuity: formatAmount(item.expectedMonthlyAnnuity),
  }));

  const companyOptions = createFilterItems(
    items.map((item) => item.cmpyNm),
    "전체 회사",
  );
  const planTypeOptions = createFilterItems(
    items.map((item) => item.ptrn),
    "전체 유형",
  );

  const filteredRows = rows.filter(
    (row) =>
      (company === "all" || row.cmpyNm === company) &&
      (planType === "all" || row.ptrn === planType) &&
      (selectedAge === null ||
        (Number.isFinite(Number(row.maxEnrollmentAge)) &&
          selectedAge <= Number(row.maxEnrollmentAge))) &&
      (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase()),
  );

  const selectedDetails = selectedItem
    ? Object.entries(selectedItem)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
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
      <div className="flex flex-wrap gap-3 py-5">
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
        name="연금보험"
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
