import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/quotes/SearchBar";
import QuoteCard from "../components/quotes/QuoteCard";
import CategoryFilter from "../components/quotes/CategoryFilter";
import { Loader2 } from "lucide-react";
import fetchQuotes from "../storage/fetchQuotes";

export default function Quotes({
  favoriteQuotes,
  setFavoriteQuotes,
  handleToggleFavorite,
}) {
  const [quotes, setQuotes] = useState(null);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getQuotes = async () => {
      const data = await fetchQuotes();
      setQuotes(data);
    };
    getQuotes();
  }, []);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const searchParam = urlParams.get('search');
  //   if (searchParam) {
  //     setSearchQuery(searchParam);
  //   }
  //   loadUser();
  //   loadQuotes();
  // }, [loadUser, loadQuotes]);

  useEffect(() => {
  const filterQuotes = () => {
    let filtered = quotes;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        q =>
          q.text.toLowerCase().includes(query) ||
          q.author.toLowerCase().includes(query)
      );
    }

    setFilteredQuotes(filtered);
  };

  filterQuotes();
}, [quotes, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Explore Quotes</h1>
          <p className="text-purple-200">Discover wisdom from great minds</p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by text or author..."
        />

        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <>
          <div className="text-white text-sm font-medium px-2">
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
              <p className="text-white text-lg">No quotes found</p>
              <p className="text-purple-200 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
