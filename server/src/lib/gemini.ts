import { env } from '../config/env.js';
import { AppError } from './app-error.js';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function generateMessageSuggestions(context?: string): Promise<string[]> {
  if (!env.GEMINI_API_KEY) {
    throw new AppError(503, 'Message suggestions are unavailable until Gemini is configured.');
  }

  const prompt =
    'Create exactly three friendly, short conversation starter messages that a visitor could send anonymously. ' +
    'Return only a JSON array of three strings. Avoid sensitive, romantic, or insulting questions. ' +
    (context ? 'Use this public profile context if helpful: ' + context : 'Keep the suggestions broadly useful.');
  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(env.GEMINI_MODEL) +
    ':generateContent';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.8,
        maxOutputTokens: 250
      }
    }),
    signal: AbortSignal.timeout(12_000)
  });

  if (!response.ok) {
    console.error('Gemini returned status ' + response.status);
    throw new AppError(502, 'Gemini could not create suggestions right now.');
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) throw new AppError(502, 'Gemini returned an empty suggestion list.');

  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Expected an array.');
    const suggestions = parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.length <= 180)
      .slice(0, 3);
    if (suggestions.length !== 3) throw new Error('Expected three short strings.');
    return suggestions;
  } catch {
    throw new AppError(502, 'Gemini returned suggestions in an unexpected format.');
  }
}

