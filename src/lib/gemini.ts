import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_PRIORITY = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

/**
 * Tries each model in priority order, returning the first successful response text.
 * Falls back automatically on 503 / overload errors.
 */
export async function generateWithFallback(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  let lastError: unknown;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      // Only retry on overload / unavailable; hard-fail on anything else
      if (!msg.includes('503') && !msg.includes('overloaded') && !msg.includes('Service Unavailable') && !msg.includes('high demand')) {
        throw err;
      }
      console.warn(`[Gemini] ${modelName} unavailable, trying next model…`);
    }
  }

  throw lastError;
}

/** Strip markdown code fences and return clean JSON string */
export function cleanJson(text: string): string {
  return text.replace(/```json\n?|\n?```/g, '').trim();
}
