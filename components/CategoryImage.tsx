import { ShieldCheck, type LucideIcon } from "lucide-react";

type CategoryImageProps = {
  activeCategory: {
    label: string;
    icon: LucideIcon;
    iconStyle: string;
  };
};

export default function CategoryImage({ activeCategory }: CategoryImageProps) {
  const ActiveIcon = activeCategory.icon;

  return (
    <div
      aria-hidden="true"
      className="relative flex min-h-[290px] items-center justify-center overflow-hidden rounded-xl border border-[#dce6ef] bg-[#edf5fc] p-6 sm:min-h-[340px]"
    >
      <div className="absolute right-[-28px] top-[-42px] size-56 rotate-12 rounded-[42px] bg-[#d9eaff]" />
      <div className="absolute bottom-[-74px] left-[-35px] h-48 w-3/4 -rotate-6 rounded-[38px] bg-[#dceee5]" />
      <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-bold text-[#61758a]">
        <ShieldCheck size={16} className="text-[#218df0]" />{" "}
        {activeCategory.label} 가이드
      </div>
      <div className="relative mt-7 flex size-44 items-center justify-center rounded-[34px] border-[7px] border-white bg-[#218df0] text-white shadow-[0_18px_38px_rgba(33,141,240,0.24)] sm:size-52">
        <ActiveIcon size={92} strokeWidth={1.35} />
        <span className="absolute -right-5 -top-4 flex size-14 items-center justify-center rounded-2xl border-4 border-white bg-[#fff5df] text-[#b67b1d] shadow-sm">
          <ShieldCheck size={27} strokeWidth={1.8} />
        </span>
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-[#526171] shadow-sm">
        <span
          className={`flex size-7 items-center justify-center rounded-md ${activeCategory.iconStyle}`}
        >
          <ActiveIcon size={16} />
        </span>
        {activeCategory.label}
      </div>
    </div>
  );
}
