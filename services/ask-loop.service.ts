import { semanticSearch } from "./search.service";
import { gemini } from "@/lib/gemini";

export async function askLoop(question: string) {
  const results = await semanticSearch(question);

  const context = results
    .map(
      (item, index) =>
        `${index + 1}. ${item.feedback.content}`
    )
    .join("\n");

  const prompt = `
You are LOOP AI, an AI assistant that answers questions using ONLY the customer feedback below.

Customer Feedback:

${context}

Question:
${question}

Rules:
- Answer ONLY using the provided feedback.
- If there is not enough information, clearly say so.
- Mention which feedback items support your answer.

Return plain text only.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    answer: response.text ?? "",
    references: results.map((r) => ({
      id: r.feedback.id,
      content: r.feedback.content,
      score: Number(r.score.toFixed(3)),
    })),
  };
}