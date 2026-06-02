import { useEffect, useState } from "react";
import QuoteCard from "../components/quotes/QuoteCard";
import { Heart } from "lucide-react";

export default function Favorites({
  favoriteQuotes,
  setFavoriteQuotes,
  handleToggleFavorite,
}) {
  const [filteredQuotes, setFilteredQuotes] = useState([]);

  useEffect(() => {
    setFilteredQuotes(favoriteQuotes || []);
  }, [favoriteQuotes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <>
          <div className="text-brand-800 text-sm font-semibold px-2">
            {filteredQuotes.length} favorite{" "}
            {filteredQuotes.length === 1 ? "quote" : "quotes"}
          </div>

          <div className="space-y-4">
            {filteredQuotes.map((quote, index) => (
              <QuoteCard
                key={index}
                quote={quote}
                isFavorite={favoriteQuotes.some(q => q.quote === quote.quote)}
                onToggleFavorite={() => handleToggleFavorite(quote)}
              />
            ))}
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-brand-300 mx-auto mb-4" />
              <p className="text-brand-900 text-lg">
                No favorites yet
              </p>
              <p className="text-brand-700 text-sm mt-2">
                Start exploring and tap the heart on quotes you love
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
