import { prisma } from "@/lib/prisma";
import { cosineSimilarity } from "@/lib/cosine";
import { generateEmbedding } from "./embedding.service";

export async function semanticSearch(query: string) {
  const queryVector = await generateEmbedding(query);

  const embeddings = await prisma.embedding.findMany({
    include: {
      feedback: true,
    },
  });

  const results = embeddings.map((embedding) => ({
    feedback: embedding.feedback,
    score: cosineSimilarity(
      queryVector,
      embedding.vector as number[]
    ),
  }));

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 5);
}