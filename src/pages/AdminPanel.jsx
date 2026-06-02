import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import db from "../storage/firebaseConfig";

export default function AdminPanel() {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
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

    await setDoc(doc(db, "dailyQuote", "A0ra9K9mT1COqJjJfnPf"), quoteOfTheDay);
    setStatus("Цитата дня обновлена!");

    setTimeout(function () {
      window.location.href = "/home";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="rounded-3xl bg-white/90 border border-brand-100 shadow-xl shadow-brand-200/40 p-6">
      <h2 className="text-2xl font-bold text-brand-900 mb-6">Админка: Цитата дня</h2>

      <label className="text-sm font-semibold text-brand-800">Выберите цитату:</label>
      <select
        className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-brand-200"
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
      <button
        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 hover:brightness-105 transition shadow-lg shadow-brand-200/60"
        onClick={handleSubmit}
      >
        Обновить цитату дня
      </button>
      <p className="mt-4 text-sm text-brand-700 font-medium">{status}</p>
      </div>
      </div>
    </div>
  );
}
