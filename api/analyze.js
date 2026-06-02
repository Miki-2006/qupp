// api/analyze.js

export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Метод не разрешен' });
    }
  
    const { answers } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({ error: 'Ошибка конфигурации бэкенда: Отсутствует API ключ' });
    }
  
    const systemInstruction = `
      Ты — эксперт по психологии, философии и литературе. Тебе предоставлены ответы пользователя на личностный тест.
      Твоя задача:
      1. Проанализировать характер и настроение пользователя на основе его ответов.
      2. Найти в своей базе знаний РЕАЛЬНУЮ, СУЩЕСТВУЮЩУЮ в истории цитату известного писателя, философа, ученого или исторического деятеля на русском языке, которая подходит его текущему состоянию.
      3. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать цитаты самостоятельно. Цитата должна быть настоящей и иметь автора.
      
      Верни ответ строго в формате JSON со следующими полями:
      {
        "quote": "Текст существующей цитаты на русском языке",
        "author": "Имя и фамилия реального автора цитаты",
        "explanation": "Короткое психологическое объяснение (1-2 предложения), почему эта цитата подходит пользователю"
      }
      Не пиши никаких дополнительных символов, разметки markdown или пояснений вне JSON.
    `;
  
    try {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `Ответы пользователя на тест: ${JSON.stringify(answers)}` }]
              }
            ],
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Ошибка Gemini API:', errorData);
        return res.status(500).json({ error: 'Ошибка при запросе к ИИ' });
      }
  
      const data = await apiResponse.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Парсим JSON, полученный от Gemini
      const resultJson = JSON.parse(textResponse);
      return res.status(200).json(resultJson);
  
    } catch (error) {
      console.error('Системная ошибка бэкенда:', error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }