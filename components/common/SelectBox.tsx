import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectBoxItem = {
  label: string;
  value: string;
};

type SelectBoxProps = {
  name?: string;
  onNameChange?: (name: string) => void;
  items?: SelectBoxItem[];
  placeholder?: string;
};

export default function SelectBox({
  name = "전체 회사",
  onNameChange,
  items = [{ label: "전체 보험", value: "전체 회사" }],
  placeholder = "보험 유형",
}: SelectBoxProps) {
  const selectedItem = items.find((item) => item.value === name);

  return (
    <div className="w-full max-w-56">
      <label htmlFor="insurance-filter" className="sr-only">
        보험 유형 선택
      </label>

      <Select
        value={name}
        onValueChange={(value) => onNameChange?.(value ?? "전체 회사")}
      >
        <SelectTrigger
          id="insurance-filter"
          className="!h-[42px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
        >
          <SelectValue placeholder={placeholder}>
            {selectedItem?.label}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="rounded-md px-2 py-1.5 text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
