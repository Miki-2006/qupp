import "./App.css";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Favorites from "./pages/Favorites";
import fetchFavorites from "./localstorage/fetchFavorites";
import updateQuote from "./localstorage/pushQuote";

function App() {
  const [favoriteQuotes, setFavoriteQuotes] = useState(null);

  useEffect(() => {
    const getFavoriteQuotes = async () => {
      const data = await fetchFavorites();
      if (data) {
        setFavoriteQuotes(data);
      }
    };

    getFavoriteQuotes()
  }, []);

  useEffect(() => {
    const updateFavoriteQuotes = async () => {
      const isUpdated = await updateQuote(favoriteQuotes);
      if (isUpdated) {
        console.log('Favorite quotes in localstorage are updated', favoriteQuotes);
      } else {
        console.error('Error in updating favorite quotes in localstorage!');
      }
    }
    updateFavoriteQuotes()
  }, [favoriteQuotes])

  const handleToggleFavorite = (quote) => {
    
    const isFavorite = favoriteQuotes.some(q => q.quote === quote.quote);
    
    if (isFavorite) {
      const newFavoriteQuotes = favoriteQuotes.filter(q => q.quote !== quote.quote)
      setFavoriteQuotes(newFavoriteQuotes)
    } else {
      setFavoriteQuotes([...favoriteQuotes, quote])
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} />}  />
          <Route path="/quotes" element={<Quotes favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} />}  />
          <Route path="/favorites" element={<Favorites favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
