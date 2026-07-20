import { prisma } from "@/lib/prisma";
import { cosineSimilarity } from "@/lib/cosine";
import { generateEmbedding } from "./embedding.service";

const SIMILARITY_THRESHOLD = 0.5;
const MAX_RESULTS = 10;

export async function semanticSearch(
  query: string,
  workspaceId: string,
  limit: number = MAX_RESULTS
) {
  const queryVector = await generateEmbedding(query);

  const embeddings = await prisma.embedding.findMany({
    where: {
      feedback: {
        workspaceId,
      },
    },
    include: {
      feedback: true,
    },
  });

  const scored = embeddings
    .map((embedding) => ({
      feedback: embedding.feedback,
      score: cosineSimilarity(
        queryVector,
        embedding.vector as number[]
      ),
    }))
    .filter((item) => item.score >= SIMILARITY_THRESHOLD);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}