// src/components/Quiz.jsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

// Вопросы теста
const questions = [
  {
    id: 1,
    question: "В шумной компании вы скорее...",
    options: [
      { text: "Будете в центре внимания, делясь историями", value: "активный, общительный, лидер" },
      { text: "Будете тихо общаться с 1-2 знакомыми в сторонке", value: "интроверт, вдумчивый, избирательный" },
      { text: "Захотите поскорее уйти в более спокойное место", value: "ценитель тишины, уединенный" }
    ]
  },
  {
    id: 2,
    question: "Какая природная стихия вам ближе всего?",
    options: [
      { text: "Огонь — страсть, энергия и действие", value: "энергичный, импульсивный, страстный" },
      { text: "Вода — глубина, спокойствие и адаптивность", value: "спокойный, гибкий, эмпатичный" },
      { text: "Воздух — свобода, легкость и новые идеи", value: "творческий, свободолюбивый, мечтатель" },
      { text: "Земля — стабильность, порядок и практичность", value: "практичный, надежный, приземленный" }
    ]
  },
  {
    id: 3,
    question: "Если перед вами стоит сложная жизненная задача, вы...",
    options: [
      { text: "Действуете немедленно, решая проблемы на ходу", value: "решительный, практик, смелый" },
      { text: "Долго анализируете все риски и составляете план", value: "аналитик, стратег, осторожный" },
      { text: "Ищете совета или моральной поддержки у близких", value: "социальный, ценящий отношения, эмоциональный" }
    ]
  },
  {
    id: 4,
    question: "Какую суперсилу вы бы выбрали?",
    options: [
      { text: "Умение читать мысли других людей", value: "любознательный, психолог, ищущий истину" },
      { text: "Телепортация в любую точку мира за секунду", value: "путешественник, динамичный, независимый" },
      { text: "Способность останавливать время, чтобы подумать", value: "философ, созерцатель, неторопливый" }
    ]
  },
  {
    id: 5,
    question: "Что вы больше всего цените в окружающих?",
    options: [
      { text: "Искренность, доброту и теплоту", value: "душевный, альтруист, мягкий" },
      { text: "Острый ум, амбиции и целеустремленность", value: "амбициозный, карьерист, сильный" },
      { text: "Чувство юмора, легкость и оптимизм", value: "жизнерадостный, легкий на подъем" }
    ]
  },
  {
    id: 6,
    question: "Ваш идеальный вечер выходного дня:",
    options: [
      { text: "Уютный плед, книга, музыка или любимый фильм", value: "одиночка, эстет, меланхолик" },
      { text: "Романтическая прогулка под звездами с любимым человеком", value: "романтик, любящий, верный" },
      { text: "Встреча с друзьями и долгие обсуждения обо всем на свете", value: "общительный, открытый, дружелюбный" }
    ]
  },
  {
    id: 7,
    question: "Что для вас сейчас важнее всего в жизни?",
    options: [
      { text: "Достижение внутренней гармонии и покоя", value: "духовный, ищущий баланс" },
      { text: "Реализация целей, карьера и финансовый успех", value: "целеустремленный, амбициозный" },
      { text: "Понимание себя, своих истинных желаний и поиск пути", value: "самопознание, философский склад ума" }
    ]
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 - старт, 1 - вопросы, 2 - результат
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const cardRef = useRef(null);

  // Старт теста
  const startQuiz = () => {
    setCurrentStep(1);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setResult(null);
    setError('');
  };

  // Выбор ответа
  const handleAnswerSelect = (value) => {
    const updatedAnswers = [...userAnswers, value];
    setUserAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Тест завершен, отправляем на сервер
      sendAnswersToAI(updatedAnswers);
    }
  };

  // Отправка ответов на сервер
  const sendAnswersToAI = async (answers) => {
    setLoading(true);
    setCurrentStep(2);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const raw = await response.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        if (data?.error) {
          throw new Error(data.error);
        }
        if (response.status === 404) {
          throw new Error('Эндпоинт /api/analyze не найден. Для локальной проверки запустите проект через `vercel dev` или укажите `REACT_APP_API_BASE_URL`.');
        }
        throw new Error(`Сервер вернул ошибку ${response.status}.`);
      }

      if (!data?.quote || !data?.author) {
        throw new Error('Сервер вернул ответ в неожиданном формате.');
      }

      setResult(data);
    } catch (err) {
      setError(err?.message || 'Не удалось связаться с сервером. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  // Генерация картинки и скачивание
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Повышаем качество картинки
        useCORS: true,
        backgroundColor: null
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'qupp-quote-personality.png';
      link.click();
    } catch (err) {
      console.error('Ошибка при генерации изображения:', err);
    }
  };

  // Шаринг через системное меню (Web Share API)
  const handleShareImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'my-quote.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Моя цитата от qupp',
            text: 'Я прошел личностный тест и получил эту цитату. Попробуй и ты!',
          });
        } else {
          alert('Ваш браузер не поддерживает прямую отправку файлов. Вы можете скачать картинку и отправить ее вручную.');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Ошибка шаринга:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        
        {/* ЭКРАН 0: Старт */}
        {currentStep === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Кто вы на самом деле?
            </h1>
            <p className="text-slate-400 mb-8">
              Пройдите короткий психологический тест из 7 вопросов. Наш ИИ проанализирует ваши ответы и подберет реальную цитату великого человека, отражающую вашу личность.
            </p>
            <button
              onClick={startQuiz}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-900/20"
            >
              Начать тест
            </button>
          </div>
        )}

        {/* ЭКРАН 1: Вопросы */}
        {currentStep === 1 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-medium mb-6 text-slate-100">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option.value)}
                  className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 rounded-xl transition text-slate-200"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ЭКРАН 2: Результаты / Загрузка */}
        {currentStep === 2 && (
          <div>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400 mb-4"></div>
                <p className="text-slate-400 animate-pulse text-center">
                  ИИ сканирует ваши ответы и ищет идеальную цитату в истории...
                </p>
              </div>
            )}

            {error && (
              <div className="text-center py-6">
                <p className="text-red-400 mb-6">{error}</p>
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Попробовать снова
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-emerald-400 mb-4">
                  Ваша цитата готова!
                </h2>

                {/* Карточка цитаты для конвертации в картинку */}
                <div 
                  ref={cardRef}
                  className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 border border-slate-700/60 shadow-2xl relative overflow-hidden"
                  style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  {/* Фоновые декоративные элементы для красоты */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                  
                  {/* Иконка кавычек */}
                  <div className="text-5xl text-emerald-400/20 font-serif leading-none absolute top-4 left-4">“</div>

                  <div className="relative z-10 text-center px-4">
                    <p className="text-lg md:text-xl font-medium text-slate-100 italic mb-4 leading-relaxed">
                      {result.quote}
                    </p>
                    <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
                      — {result.author}
                    </p>
                  </div>

                  {/* Водяной знак вашего проекта */}
                  <div className="absolute bottom-3 right-4 text-[10px] tracking-wider text-slate-500 uppercase font-mono">
                    qupp.vercel.app
                  </div>
                </div>

                {/* Объяснение от ИИ */}
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Анализ вашего характера:
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* Кнопки действий */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleDownloadImage}
                    className="py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    📥 Скачать картинку
                  </button>
                  <button
                    onClick={handleShareImage}
                    className="py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    ✨ Поделиться
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={startQuiz}
                    className="text-xs text-slate-500 hover:text-slate-400 underline transition"
                  >
                    Пройти тест заново
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}