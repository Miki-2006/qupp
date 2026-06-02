import { useState, useEffect } from "react";
import QuoteCard from "../components/quotes/QuoteCard";
import CategoryFilter from "../components/quotes/CategoryFilter";
import fetchQuotes from "../storage/fetchQuotes";

export default function Quotes({
  favoriteQuotes,
  setFavoriteQuotes,
  handleToggleFavorite,
}) {
  const [quotes, setQuotes] = useState(null);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("motivation");

  useEffect(() => {
    const getQuotes = async () => {
      const data = await fetchQuotes();
      setQuotes(data);
    };
    getQuotes();
  }, []);

  useEffect(() => {
  const filterQuotes = () => {
    let filtered = quotes;

    filtered = filtered?.filter(q => q.category === selectedCategory);

    setFilteredQuotes(filtered);
  };

  filterQuotes();
}, [quotes, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <>
          <div className="text-brand-800 text-sm font-semibold px-2">
            {filteredQuotes?.length}{" "}
            {filteredQuotes?.length === 1 ? "quote" : "quotes"} found
          </div>

          <div className="space-y-4">
            {filteredQuotes?.map((quote, index) => (
              <QuoteCard
                key={index}
                quote={quote}
                isFavorite={favoriteQuotes.some(q => q.quote === quote.quote)}
                onToggleFavorite={() => handleToggleFavorite(quote)}
              />
            ))}
          </div>

          {filteredQuotes?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brand-900 text-lg">No quotes found</p>
              <p className="text-brand-700 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
