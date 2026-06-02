// src/components/Quiz.jsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { questions } from '../data/questions'; // Импортируем линейный массив вопросов

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 - старт, 1 - вопросы, 2 - результат/загрузка
  const [currentQuestion, setCurrentQuestion] = useState(0); // Индекс текущего вопроса
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  
  const cardRef = useRef(null);

  // Старт теста
  const startQuiz = () => {
    setCurrentStep(1);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setResult(null);
    setError('');
    setUserName('');
  };

  // Выбор ответа
  const handleAnswerSelect = (optionText) => {
    const currentQuestionText = questions[currentQuestion].question;
    
    // Сохраняем цепочку ответов
    const updatedAnswers = [
      ...userAnswers,
      { question: currentQuestionText, answer: optionText }
    ];
    setUserAnswers(updatedAnswers);
  
    if (currentQuestion < questions.length - 1) {
      // Если есть еще вопросы, переходим к следующему
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Если это был последний вопрос, отправляем все ответы ИИ
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
          throw new Error('Эндпоинт /api/analyze не найден. Для локальной проверки запустите проект через `vercel dev`.');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 text-slate-700 p-6 font-sans">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl shadow-brand-200/40 p-8 border border-brand-100">
        
        {/* ЭКРАН 0: Старт */}
        {currentStep === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-700 to-accent-600 bg-clip-text text-transparent">
              Кто вы на самом деле?
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Пройдите глубокий тест из 7 вопросов. Наш искусственный интеллект проанализирует ваши ответы через призму юнгианских архетипов и подберет реальную историческую цитату, которая отражает вашу душу.
            </p>
            <button
              onClick={startQuiz}
              className="px-8 py-3 bg-gradient-to-r from-brand-600 to-accent-500 hover:brightness-105 text-white font-semibold rounded-xl transition shadow-lg shadow-brand-200/50"
            >
              Начать тест
            </button>
          </div>
        )}

        {/* ЭКРАН 1: Вопросы */}
        {currentStep === 1 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                Анализ личности...
              </span>
              <span className="text-xs text-slate-400">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
            </div>

            {/* Прогресс-бар */}
            <div className="w-full bg-brand-100 h-2 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-gradient-to-r from-brand-500 to-accent-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            
            <h2 className="text-xl font-medium mb-6 text-slate-800 leading-snug">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option.text)}
                  className="w-full text-left p-4 bg-white hover:bg-brand-5/40 border border-brand-100 hover:border-brand-300 rounded-xl transition text-slate-700 shadow-sm"
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
                <p className="text-slate-600 animate-pulse text-center">
                  ИИ сопоставляет ваши ответы с юнгианскими архетипами и ищет цитату в истории...
                </p>
              </div>
            )}

            {error && (
              <div className="text-center py-6">
                <p className="text-red-400 mb-6">{error}</p>
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-brand-100 hover:bg-brand-200 text-brand-900 rounded-lg transition"
                >
                  Попробовать снова
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-brand-700 mb-4">
                  Ваша цитата готова!
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-brand-800 mb-2">
                    Как вас зовут?
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Введите имя"
                    className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                {/* Карточка цитаты для конвертации в картинку */}
                <div 
                  ref={cardRef}
                  className="p-8 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-700 to-accent-600 border border-brand-300/50 shadow-2xl relative overflow-hidden"
                  style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  {/* Декоративные размытые фоновые сферы */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200/20 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <img
                      src="/qupp-logo.png"
                      alt="qupp logo"
                      className="h-10 w-auto object-contain brightness-0 invert opacity-95 mx-auto mb-5"
                    />
                    <p className="text-center text-base md:text-lg font-semibold tracking-wide mb-5 text-cyan-100">
                      {userName?.trim()
                        ? `${userName.trim()}, эта цитата для вас`
                        : "Эта цитата для вас"}
                    </p>
                    <p className="text-lg md:text-xl font-medium text-white italic mb-4 leading-relaxed text-center">
                      {result.quote}
                    </p>
                    <p className="text-sm font-semibold text-cyan-100 uppercase tracking-widest text-center">
                      — {result.author}
                    </p>
                  </div>
                </div>

                {/* Объяснение от ИИ */}
                <div className="p-4 bg-brand-5 rounded-xl border border-brand-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-2">
                    Анализ вашего характера:
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* Кнопки действий */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleDownloadImage}
                    className="py-3 bg-white border border-brand-300 hover:bg-brand-50 text-brand-800 font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    📥 Скачать картинку
                  </button>
                  <button
                    onClick={handleShareImage}
                    className="py-3 bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 hover:brightness-105 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    ✨ Поделиться
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={startQuiz}
                    className="text-xs text-brand-700 hover:text-brand-800 underline transition"
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