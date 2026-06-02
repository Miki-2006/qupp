import { motion } from "framer-motion";
import Button from "../ui/Button";

const categories = [
  { value: "motivation", label: "Motivation", emoji: "💪" },
  { value: "love", label: "Love", emoji: "❤️" },
  { value: "success", label: "Success", emoji: "🎯" },
  { value: "wisdom", label: "Wisdom", emoji: "🦉" },
  { value: "life", label: "Life", emoji: "🌟" }
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <motion.div
          key={category.value}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selected === category.value ? "default" : "outline"}
            onClick={() => onSelect(category.value)}
            className={`rounded-full px-4 whitespace-nowrap ${
              selected === category.value
                ? "text-white shadow-lg shadow-brand-200/50"
                : "bg-white/80 text-brand-800 hover:bg-brand-50"
            }`}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}