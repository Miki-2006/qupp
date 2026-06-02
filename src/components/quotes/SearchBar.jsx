import { Search } from "lucide-react";
import Input from "../ui/Input";

export default function SearchBar({ value, onChange, placeholder = "Search quotes..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 rounded-2xl h-12 text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-200"
      />
    </div>
  );
}