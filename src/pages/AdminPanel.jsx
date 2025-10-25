import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import db from "../storage/firebaseConfig";

export default function AdminPanel() {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchQuotes() {
      const snapshot = await getDocs(collection(db, "quotes"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuotes(list);
    }
    fetchQuotes();
  }, []);

  const handleSubmit = async () => {
    const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);
    if (!selectedQuote) {
      setStatus("Выберите цитату");
      return;
    }

    const quoteOfTheDay = {
      quote_id: selectedQuote.id,
    };

    const quoteVideoOfTheDay = {
      videoUrl: videoUrl,
    };

    await setDoc(doc(db, "dailyQuote", "A0ra9K9mT1COqJjJfnPf"), quoteOfTheDay);
    await setDoc(doc(db, "dailyQuoteVideo", "SprPZPkraVLrgJj3kIZz"), quoteVideoOfTheDay);
    setStatus("Цитата дня обновлена!");

    setTimeout(function () {
      window.location.href = "/home";
    }, 2000);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Админка: Цитата дня</h2>

      <label>Выберите цитату:</label>
      <select
        value={selectedQuoteId}
        onChange={(e) => setSelectedQuoteId(e.target.value)}
      >
        <option value="">-- Выберите --</option>
        {quotes.map((q) => (
          <option key={q.id} value={q.id}>
            {q.quote} — {q.author}
          </option>
        ))}
      </select>

      <br />
      <br />
      <label>Ссылка на видео:</label>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://youtube.com/..."
        style={{ width: "100%" }}
      />

      <br />
      <br />
      <button onClick={handleSubmit}>Обновить цитату дня</button>
      <p>{status}</p>
    </div>
  );
}
