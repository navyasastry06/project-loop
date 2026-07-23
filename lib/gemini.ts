import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateContentWithFallback(options: {
  contents: string;
  defaultMock?: unknown;
}) {
  // If API key is missing entirely, jump straight to mock if available
  if (!process.env.GEMINI_API_KEY) {
    if (options.defaultMock) {
      console.log("No GEMINI_API_KEY found. Using mock fallback.");
      return typeof options.defaultMock === "function"
        ? JSON.stringify(options.defaultMock())
        : typeof options.defaultMock === "string"
        ? options.defaultMock
        : JSON.stringify(options.defaultMock);
    }
  }

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await gemini.models.generateContent({
        model,
        contents: options.contents,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`Failed to generate content with model ${model}:`, errMsg);
      lastError = err;
    }
  }

  if (options.defaultMock) {
    console.log("All Gemini models failed or quota exceeded. Returning mock fallback.");
    return typeof options.defaultMock === "function"
      ? JSON.stringify(options.defaultMock())
      : typeof options.defaultMock === "string"
      ? options.defaultMock
      : JSON.stringify(options.defaultMock);
  }

  throw lastError || new Error("All Gemini models failed and no mock fallback was provided.");
}