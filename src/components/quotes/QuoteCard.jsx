import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function QuoteCard({ quote, isFavorite, onToggleFavorite }) {
  const categoryColors = {
    motivation: "from-brand-500 to-accent-500",
    love: "from-brand-400 to-brand-700",
    success: "from-cyan-400 to-brand-600",
    wisdom: "from-sky-400 to-brand-700",
    life: "from-brand-500 to-indigo-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-white/95 backdrop-blur-sm border-brand-100 shadow-xl rounded-3xl p-6">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryColors[quote.category]}`} />
        
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
            {quote.category}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite()}
            className="hover:bg-brand-50 rounded-full"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite ? "fill-brand-600 text-brand-600" : "text-slate-400"
              }`}
            />
          </Button>
        </div>

        <p className="text-lg leading-relaxed text-slate-700 mb-4 font-serif italic">
          "{quote.quote}"
        </p>

        <p className="text-sm font-semibold text-brand-800">
          — {quote.author}
        </p>
      </Card>
    </motion.div>
  );
}