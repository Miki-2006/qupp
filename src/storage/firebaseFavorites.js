import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc
} from "firebase/firestore";
import db from "./firebaseConfig";

const getFavoriteId = (quote) => encodeURIComponent(`${quote.quote}__${quote.author}`);

export const fetchUserFavorites = async (uid) => {
  const favoritesRef = collection(db, "users", uid, "favorites");
  const snapshot = await getDocs(favoritesRef);

  return snapshot.docs.map((favoriteDoc) => favoriteDoc.data());
};

export const toggleUserFavorite = async (uid, quote, isFavorite) => {
  const favoriteId = getFavoriteId(quote);
  const favoriteRef = doc(db, "users", uid, "favorites", favoriteId);

  if (isFavorite) {
    await deleteDoc(favoriteRef);
    return false;
  }

  await setDoc(favoriteRef, quote);
  return true;
};
