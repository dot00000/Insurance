import { CalendarDays, ShieldCheck } from "lucide-react";
import { categories } from "@/utils/insuranceCategories";

type SeletedInsuranceProps = {
  insuranceType: string;
  insuranceName: string;
  insuredName: string;
  startDate: string;
  endDate: string;
};

export default function SeletedInsurance({
  insuranceType,
  insuranceName,
  insuredName,
  startDate,
  endDate,
}: SeletedInsuranceProps) {
  const Icon = categories.find(
    (category) => category.id === insuranceType || category.label === insuranceType,
  )?.icon ?? ShieldCheck;

  return (
    <div className="mb-6 rounded-xl border border-[#e4e8ed] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(25,38,55,0.03)] sm:px-7">
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#218df0]">
            <Icon size={30} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#218df0]">
              <ShieldCheck size={15} /> {insuranceType}
            </div>
            <h1 className="truncate text-lg font-bold tracking-normal sm:text-xl">
              {insuranceName}
            </h1>
            <p className="mt-1 text-sm text-[#77808b]">
              가입자 정보 <span className="mx-1 text-[#c7cdd4]">|</span> {insuredName}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#edf0f3] pt-4 text-sm sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div>
            <div className="mb-1 text-xs text-[#8b939e]">보험 시작일</div>
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays size={15} className="text-[#9099a5]" /> {startDate}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs text-[#8b939e]">보험 종료일</div>
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays size={15} className="text-[#9099a5]" /> {endDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
