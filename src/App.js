import "./App.css";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Quiz from "./components/Quiz"
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import { auth, googleProvider } from "./storage/firebaseConfig";
import { fetchUserFavorites, toggleUserFavorite } from "./storage/firebaseFavorites";

const normalizeEmail = (email) =>
  (email || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .toLowerCase();

const getUserEmail = (firebaseUser) =>
  firebaseUser?.email || firebaseUser?.providerData?.[0]?.email || "";
const ADMIN_EMAIL = normalizeEmail(process.env.REACT_APP_ADMIN_EMAIL);
const ADMIN_ROUTE = "/admin/QU-company/Miki-2006";
const LEGACY_ADMIN_ROUTE = "/admin/QU-company/qupp-product/founder/Miki-2006";

function App() {
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthChecked(true);

      if (!authUser) {
        setFavoriteQuotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    const signedInEmail = normalizeEmail(getUserEmail(user));
    const isAdmin = Boolean(ADMIN_EMAIL) && signedInEmail === ADMIN_EMAIL;

    if (isAdmin && window.location.pathname !== ADMIN_ROUTE) {
      window.location.assign(ADMIN_ROUTE);
    }
  }, [authChecked, user]);

  useEffect(() => {
    const getFavoriteQuotes = async () => {
      if (!user) {
        return;
      }

      try {
        const data = await fetchUserFavorites(user.uid);
        setFavoriteQuotes(data);
      } catch (error) {
        console.error("Error while fetching favorites from Firebase:", error);
      }
    };

    getFavoriteQuotes();
  }, [user]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInEmail = normalizeEmail(getUserEmail(result?.user));

      if (ADMIN_EMAIL && signedInEmail === ADMIN_EMAIL) {
        window.location.assign(ADMIN_ROUTE);
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleToggleFavorite = async (quote) => {
    if (!user) {
      alert("Нужно войти через Google, чтобы сохранять в избранное.");
      return;
    }

    const isFavorite = favoriteQuotes.some((q) => q.quote === quote.quote);

    try {
      const wasAdded = await toggleUserFavorite(user.uid, quote, isFavorite);

      if (wasAdded) {
        setFavoriteQuotes((prev) => [...prev, quote]);
      } else {
        setFavoriteQuotes((prev) => prev.filter((q) => q.quote !== quote.quote));
      }
    } catch (error) {
      console.error("Error while updating favorites in Firebase:", error);
    }
  };

  const canAccessAdmin =
    Boolean(ADMIN_EMAIL) && normalizeEmail(getUserEmail(user)) === ADMIN_EMAIL;

  return (
    <Router>
      <Layout user={user} onLogin={handleSignIn} onLogout={handleSignOut}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} />}  />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quotes" element={<Quotes favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} />}  />
          <Route path="/favorites" element={<Favorites user={user} favoriteQuotes={favoriteQuotes} setFavoriteQuotes={setFavoriteQuotes} handleToggleFavorite={handleToggleFavorite} onLogin={handleSignIn} />} />
          <Route
            path={ADMIN_ROUTE}
            element={
              !authChecked ? null : (
                canAccessAdmin ? <AdminPanel /> : <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path={LEGACY_ADMIN_ROUTE}
            element={<Navigate to={ADMIN_ROUTE} replace />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
