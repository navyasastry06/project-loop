import { gemini } from "@/lib/gemini";

export async function analyzeFeedback(feedback: string) {
  const prompt = `
You are an AI assistant that analyzes customer feedback.

Return ONLY valid JSON.

Schema:

{
  "sentiment": "Positive | Neutral | Negative",
  "category": "UI | Performance | Bug | Feature Request | Pricing | Support | Other",
  "summary": "One sentence summary"
}

Feedback:
"${feedback}"
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  const cleaned = text.slice(jsonStart, jsonEnd + 1);
  const analysis = JSON.parse(cleaned);

  let sentiment: "POS" | "NEU" | "NEG";

  switch (analysis.sentiment.toLowerCase()) {
    case "positive":
      sentiment = "POS";
      break;

    case "negative":
      sentiment = "NEG";
      break;

    default:
      sentiment = "NEU";
  }

  return {
    ...analysis,
    sentiment,
  };
}

export async function generateInsights(
  feedbacks: {
    content: string;
    sentiment: string | null;
    category: string | null;
  }[]
) {
  const prompt = `
You are a product analytics expert.

Analyze the following customer feedback data:

${JSON.stringify(feedbacks)}

Generate exactly 4 short business insights.

Return ONLY valid JSON.

{
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3",
    "Insight 4"
  ]
}
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  const cleaned = text.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(cleaned);
}