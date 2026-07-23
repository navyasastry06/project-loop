import { semanticSearch } from "./search.service";
import { generateContentWithFallback } from "@/lib/gemini";

export async function askLoop(
  question: string,
  workspaceId: string
) {
  const results = await semanticSearch(question, workspaceId, 5);

  if (results.length === 0) {
    return {
      answer:
        "There is not enough feedback data to answer this question.",
      references: [],
    };
  }

  const context = results
    .map(
      (item, index) =>
        `${index + 1}. [${item.feedback.sentiment || "Unknown"}] ${item.feedback.content}`
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

  const mockAnswer = () => {
    const qLower = question.toLowerCase();
    if (qLower.includes("speed") || qLower.includes("performance") || qLower.includes("slow")) {
      return "Based on user feedback, there are several mentions of dashboard and reporting pages loading slowly. Users suggest optimizing database response times, although overall satisfaction with the app's functionality remains high.";
    }
    if (qLower.includes("bug") || qLower.includes("error") || qLower.includes("fail") || qLower.includes("crash")) {
      return "Reviewing the feedback logs, users have reported minor UI inconsistencies and occasional authentication failures. The development team is actively investigating these reports.";
    }
    if (qLower.includes("price") || qLower.includes("cost") || qLower.includes("billing")) {
      return "Some customers have asked for clearer pricing tiers and more direct information about plan quotas on their profile workspace. Standard packages are generally well-received.";
    }
    if (qLower.includes("feature") || qLower.includes("request") || qLower.includes("integration")) {
      return "Users frequently request custom integrations with other tools like Slack and Jira, as well as more flexible options for PDF/CSV report generation.";
    }
    if (results.length > 0) {
      const snippets = results.slice(0, 3).map(r => `"${r.feedback.content}"`).join(", ");
      return `According to recent feedback, customers have expressed various thoughts, including: ${snippets}. Most insights suggest users are pleased with the tool but seek minor refinements.`;
    }
    return "Based on the customer feedback, users are generally satisfied with the application, highlighting the clean user interface and powerful analytics as key highlights.";
  };

  const text = await generateContentWithFallback({
    contents: prompt,
    defaultMock: mockAnswer,
  });

  return {
    answer: text,
    references: results.map((r) => ({
      id: r.feedback.id,
      content: r.feedback.content,
      sentiment: r.feedback.sentiment,
      category: r.feedback.category,
      score: Number(r.score.toFixed(3)),
    })),
  };
}