const fetchFavorites = () => {
  const raw = localStorage.getItem("favorite-quotes");

  if (!raw) {
    return []; // или null, если тебе так удобнее
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Ошибка при парсинге favorite-quotes:", error);
    return [];
  }
};

export default fetchFavorites;
