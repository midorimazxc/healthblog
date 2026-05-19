import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Поиск по статьям...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="glass relative flex items-center gap-3 rounded-full px-5 py-3">
      <Search className="h-4 w-4 text-white/70" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-white placeholder:text-white/50 outline-none"
      />
    </div>
  );
}
