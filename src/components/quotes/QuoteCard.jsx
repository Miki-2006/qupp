import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function QuoteCard({ quote, isFavorite, onToggleFavorite }) {
  const categoryColors = {
    motivation: "from-orange-500 to-pink-500",
    love: "from-pink-500 to-rose-500",
    success: "from-green-500 to-emerald-500",
    wisdom: "from-blue-500 to-indigo-500",
    life: "from-purple-500 to-violet-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl p-6">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryColors[quote.category]}`} />
        
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
            {quote.category}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite()}
            className="hover:bg-pink-50 rounded-full"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-400"
              }`}
            />
          </Button>
        </div>

        <p className="text-lg leading-relaxed text-gray-800 mb-4 font-serif italic">
          "{quote.quote}"
        </p>

        <p className="text-sm font-medium text-purple-700">
          — {quote.author}
        </p>
      </Card>
    </motion.div>
  );
}