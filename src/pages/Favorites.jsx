import { useEffect, useState } from "react";
import QuoteCard from "../components/quotes/QuoteCard";
import { Heart } from "lucide-react";

export default function Favorites({
  user,
  favoriteQuotes,
  handleToggleFavorite,
  onLogin,
}) {
  const [filteredQuotes, setFilteredQuotes] = useState([]);

  useEffect(() => {
    setFilteredQuotes(favoriteQuotes || []);
  }, [favoriteQuotes]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-24">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <div className="bg-white/90 border border-brand-100 rounded-3xl p-8 text-center shadow-sm">
            <Heart className="w-14 h-14 text-brand-300 mx-auto mb-4" />
            <p className="text-brand-900 text-lg font-semibold mb-2">
              Войдите, чтобы открыть избранное
            </p>
            <p className="text-brand-700 text-sm mb-5">
              Список favorites хранится в вашем Firebase аккаунте.
            </p>
            <button
              onClick={onLogin}
              className="px-5 py-2 text-sm font-semibold rounded-full border border-brand-200 text-brand-800 bg-white hover:bg-brand-50 transition"
            >
              Войти через Google
            </button>
          </div>
        </div>
      </div>
    );
  }

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
