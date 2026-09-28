import { Search as SearchIcon } from "lucide-react";

type SearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function Search({
  value = "",
  onChange,
  placeholder = "검색어를 입력하세요",
}: SearchProps) {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor="insurance-search" className="sr-only">
        검색
      </label>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <input
          id="insurance-search"
          type="search"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
