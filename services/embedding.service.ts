import { gemini } from "@/lib/gemini";

export async function generateEmbedding(text: string) {
  try {
    const response = await gemini.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

    return response.embeddings?.[0].values ?? [];
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("Embedding API failed, using fallback mock vector:", errMsg);
    // Generate a pseudo-random mock vector of length 768 based on text hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Array.from({ length: 768 }, (_, idx) => {
      const seed = Math.sin(hash + idx) * 10000;
      return seed - Math.floor(seed) - 0.5;
    });
  }
}