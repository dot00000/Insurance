"use client";

import travelInsurance from "@/data/travel-insurance.json";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import Search from "@/components/common/Search";
import SelectBox from "@/components/common/SelectBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFilterItems } from "@/utils/filterItems";
import { formatAmount } from "@/utils/insuranceFormat";
import { Plus, X } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

const items = travelInsurance.response.body.items.item;
const rowsPerPage = 10;

type TripType = "국내" | "해외";
type QuoteRequest = {
  tripType: TripType;
  destinations: string[];
  tripDays: number;
};

const detailLabels: Record<string, string> = {
  cmpyCd: "보험사 코드",
  cmpyNm: "회사명",
  ptrn: "보험 유형",
  mog: "주요 보장",
  prdNm: "상품명",
  age: "가입 연령 상한",
  basePremium: "1일 기본 보험료 (원)",
  totalPremium: "총 보험료 (원)",
  basDt: "기준일",
  ofrInstNm: "제공 기관",
  tripType: "여행 구분",
  tripPurpose: "여행 목적",
  tripDays: "체류 기간 (일)",
  medicalExpenseLimit: "의료비 보장 한도 (원)",
  accidentDeathLimit: "상해 사망 보장 한도 (원)",
  baggageLimit: "휴대품 보장 한도 (원)",
  flightDelayBenefit: "항공 지연 보장 (원)",
  liabilityLimit: "배상책임 보장 한도 (원)",
  basePremiumUnit: "기본 보험료 단위",
  premiumUnit: "총 보험료 단위",
};

function parseDestinations(value: string) {
  return value
    .split(/[，,\n]/)
    .map((destination) => destination.trim())
    .filter(Boolean);
}

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [company, setCompany] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [tripPurpose, setTripPurpose] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [tripType, setTripType] = useState<TripType>("국내");
  const [tripDays, setTripDays] = useState(1);
  const [destinationInput, setDestinationInput] = useState("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);

  const maxTripDays = tripType === "국내" ? 30 : 90;
  const companyOptions = createFilterItems(
    items.map((item) => item.cmpyNm),
    "전체 회사",
  );
  const planTypeOptions = createFilterItems(
    items.map((item) => item.tripType),
    "전체 여행 구분",
  );
  const tripPurposeOptions = createFilterItems(
    items.map((item) => item.tripPurpose),
    "전체 여행 목적",
  );

  function addDestinations(value = destinationInput) {
    const parsed = parseDestinations(value);
    if (parsed.length === 0) return;

    setDestinations((current) => {
      const seen = new Set(current.map((destination) => destination.toLocaleLowerCase()));
      return [
        ...current,
        ...parsed.filter((destination) => {
          const normalized = destination.toLocaleLowerCase();
          if (seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        }),
      ];
    });
    setDestinationInput("");
    setError("");
  }

  function handleDestinationKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDestinations();
    }
  }

  function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requestedDestinations = [
      ...destinations,
      ...parseDestinations(destinationInput),
    ].filter((destination, index, all) =>
      all.findIndex((candidate) => candidate.toLocaleLowerCase() === destination.toLocaleLowerCase()) === index,
    );

    if (requestedDestinations.length === 0) {
      setError("여행지를 하나 이상 입력해 주세요.");
      setQuoteRequest(null);
      return;
    }

    setQuoteRequest({ tripType, destinations: requestedDestinations, tripDays });
    setDestinations(requestedDestinations);
    setDestinationInput("");
    setPageNo(1);
    setError("");
  }

  const rows = items.map((item, index) => {
    const quoteDays = quoteRequest?.tripDays ?? Number(item.tripDays);
    const totalPremium = Number(item.basePremium) * quoteDays;

    return {
      ...item,
      id: index,
      age: item.age,
      basePremium: formatAmount(item.basePremium),
      tripDays: String(quoteDays),
      totalPremium: formatAmount(totalPremium),
      medicalExpenseLimit: formatAmount(item.medicalExpenseLimit),
      accidentDeathLimit: formatAmount(item.accidentDeathLimit),
      baggageLimit: formatAmount(item.baggageLimit),
      flightDelayBenefit: formatAmount(item.flightDelayBenefit),
      liabilityLimit: formatAmount(item.liabilityLimit),
    };
  });

  const columns = [
    { key: "id", label: "번호" },
    { key: "cmpyNm", label: "회사명" },
    { key: "prdNm", label: "상품명" },
    { key: "tripType", label: "여행 구분" },
    { key: "tripPurpose", label: "여행 목적" },
    { key: "tripDays", label: "체류 기간 (일)" },
    { key: "basePremium", label: "1일 기본료 (원)" },
    { key: "totalPremium", label: "총 보험료 (원)" },
    { key: "ptrn", label: "보험 유형" },
  ];

  const filteredRows = rows.filter((row) =>
    (!quoteRequest || row.tripType === quoteRequest.tripType) &&
    (company === "all" || row.cmpyNm === company) &&
    (planType === "all" || row.tripType === planType) &&
    (tripPurpose === "all" || row.tripPurpose === tripPurpose) &&
    (selectedAge === null || selectedAge <= Number(row.age)) &&
    (row.prdNm ?? "").toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase()),
  );

  const selectedDetails = selectedItem
    ? Object.entries({
        ...selectedItem,
        destinations: quoteRequest?.destinations.join(", ") || "미입력",
        tripDays: String(quoteRequest?.tripDays ?? Number(selectedItem.tripDays)),
        totalPremium: String(
          Number(selectedItem.basePremium) *
            (quoteRequest?.tripDays ?? Number(selectedItem.tripDays)),
        ),
      })
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label:
            key === "destinations"
              ? "입력한 여행지"
              : detailLabels[key] ?? key,
          value:
            key === "basePremium" ||
            key === "totalPremium" ||
            key === "medicalExpenseLimit" ||
            key === "accidentDeathLimit" ||
            key === "baggageLimit" ||
            key === "flightDelayBenefit" ||
            key === "liabilityLimit" ||
            key === "totalPremium"
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
    <div className="space-y-4 p-6">
      <form className="space-y-2" onSubmit={handleQuoteSubmit}
      >
        {destinations.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="입력한 여행지 목록">
            {destinations.map((destination) => (
              <li key={destination} className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700">
                <span>{destination}</span>
                <button
                  type="button"
                  aria-label={`${destination} 삭제`}
                  className="rounded p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => {
                    setDestinations((current) => current.filter((value) => value !== destination));
                    setQuoteRequest(null);
                  }}
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {quoteRequest && (
          <p className="text-sm text-slate-600">
            견적 여행지: {quoteRequest.destinations.join(" · ")} · {quoteRequest.tripDays}일
          </p>
        )}
      </form>

      <div className="flex flex-col flex-wrap gap-3 py-2">
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
            placeholder="여행 구분"
            />
            <SelectBox
            name={tripPurpose}
            onNameChange={(value) => {
                setTripPurpose(value);
                setPageNo(1);
            }}
            items={tripPurposeOptions}
            placeholder="여행 목적"
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
        name="여행자보험"
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
      <div className="py-5">
        <CommonPagination
          currentPage={pageNo}
          onPageChange={setPageNo}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}