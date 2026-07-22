import { prisma } from "../lib/prisma";
import { generateEmbedding } from "../services/embedding.service";

async function main() {
  console.log("Starting re-embedding process...");

  const feedbacks = await prisma.feedback.findMany({
    select: {
      id: true,
      content: true,
    },
  });

  console.log(`Found ${feedbacks.length} feedback items in the database.`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < feedbacks.length; i++) {
    const fb = feedbacks[i];
    console.log(`[${i + 1}/${feedbacks.length}] Generating embedding for feedback ID: ${fb.id}...`);

    try {
      // Call actual Gemini API to generate real embedding vector
      const vector = await generateEmbedding(fb.content);

      if (!vector || vector.length === 0) {
        throw new Error("Received empty vector from API.");
      }

      // Upsert the embedding
      await prisma.embedding.upsert({
        where: { feedbackId: fb.id },
        update: { vector },
        create: {
          feedbackId: fb.id,
          vector,
        },
      });

      successCount++;
      
      // Brief pause to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error: any) {
      console.error(`Failed for feedback ID ${fb.id}:`, error?.message || error);
      errorCount++;
    }
  }

  console.log(`Re-embedding complete! Success: ${successCount}, Failed: ${errorCount}`);
  process.exit(0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
