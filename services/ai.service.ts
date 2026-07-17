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