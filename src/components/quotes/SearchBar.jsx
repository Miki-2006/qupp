import { Search } from "lucide-react";
import Input from "../ui/Input";

export default function SearchBar({ value, onChange, placeholder = "Search quotes..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-amber-400 focus:ring-amber-400/50 rounded-2xl h-12"
      />
    </div>
  );
}