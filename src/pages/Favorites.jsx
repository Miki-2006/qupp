import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/quotes/SearchBar";
import QuoteCard from "../components/quotes/QuoteCard";
import { Heart, Loader2 } from "lucide-react";

export default function Favorites({
  favoriteQuotes,
  setFavoriteQuotes,
  handleToggleFavorite,
}) {
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filterQuotes = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredQuotes(favoriteQuotes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = favoriteQuotes.filter(
      (q) =>
        q.text.toLowerCase().includes(query) ||
        q.author.toLowerCase().includes(query)
    );
    setFilteredQuotes(filtered);
  }, [favoriteQuotes, searchQuery]);

  useEffect(() => {
    filterQuotes();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div className="text-center mb-6">
          <div className="inline-block bg-pink-500/20 rounded-full p-4 mb-4">
            <Heart className="w-12 h-12 text-pink-400 fill-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-purple-200">Your collection of beloved quotes</p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search your favorites..."
        />

        <>
          <div className="text-white text-sm font-medium px-2">
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
              <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white text-lg">
                {searchQuery
                  ? "No matching favorites found"
                  : "No favorites yet"}
              </p>
              <p className="text-purple-200 text-sm mt-2">
                {searchQuery
                  ? "Try a different search"
                  : "Start exploring and tap the heart on quotes you love"}
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
