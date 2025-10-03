import { useState, useEffect, useCallback } from "react";
import { Sparkles, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import QuoteCard from "../components/quotes/QuoteCard";
import SearchBar from "../components/quotes/SearchBar";
import fetchDailyQuote from "../storage/fetchDailyQuote";

export default function Home({favoriteQuotes, setFavoriteQuotes, handleToggleFavorite}) {
  const navigate = useNavigate();
  const [dailyQuote, setDailyQuote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getDailyQuote = async () => {
      const data = await fetchDailyQuote();
      if (data) {
        setDailyQuote(data);
      }
    };

    getDailyQuote();
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(
        createPageUrl("Quotes") + `?search=${encodeURIComponent(searchQuery)}`
      );
    }
  }, [searchQuery, navigate]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Daily Inspiration
          </h1>
          <p className="text-purple-200">Your dose of wisdom for today</p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for inspiration..."
        />

        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 border-none shadow-2xl rounded-3xl p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Quote of the Day</h2>
          </div>

          {dailyQuote && (
            <QuoteCard
              quote={dailyQuote}
              isFavorite={dailyQuote ? true : false}
              onToggleFavorite={() => handleToggleFavorite(dailyQuote)}
            />
          )}

          {!dailyQuote && (
            <div className="bg-white/90 rounded-2xl p-6 text-center">
              <p className="text-gray-600">Loading today's inspiration...</p>
            </div>
          )}
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Youtube className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Motivational Video</h2>
                <p className="text-sm text-red-100">Watch and get inspired</p>
              </div>
            </div>
          </div>

          <div className="relative pb-[56.25%] bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/ZXsQAXx_ao0"
              title="Motivational Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Card>

        <div className="text-center py-8">
          <p className="text-purple-200 text-sm mb-4">
            Want to explore more quotes?
          </p>
          <Button
            onClick={() => navigate(createPageUrl("Quotes"))}
            className="text-violet-700 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold shadow-xl"
          >
            Browse All Quotes →
          </Button>
        </div>
      </div>
    </div>
  );
}
